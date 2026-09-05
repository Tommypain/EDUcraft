//! Titanium Central Plugin Registry and Lifecycle Coordinator

use super::types::{AggregatedContributions, PluginPermission, PluginState, RegisteredPlugin, TitaniumError};
use super::validator::validate_plugin_manifest;
use crate::contracts::PluginManifest;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

/// Central runtime registry managing discovery, validation, lifecycle, and permissions.
#[derive(Debug, Clone)]
pub struct TitaniumRegistry {
    pub engine_version: String,
    pub plugins: HashMap<String, RegisteredPlugin>,
    pub capability_map: HashMap<String, Vec<String>>,
}

impl TitaniumRegistry {
    pub fn new(engine_version: impl Into<String>) -> Self {
        Self {
            engine_version: engine_version.into(),
            plugins: HashMap::new(),
            capability_map: HashMap::new(),
        }
    }

    /// Read a manifest from raw content based on extension or autodetection.
    pub fn parse_manifest(content: &str, is_toml: bool) -> Result<PluginManifest, TitaniumError> {
        if is_toml {
            toml::from_str(content).map_err(|e| TitaniumError::InvalidManifest(e.to_string()))
        } else {
            serde_json::from_str(content).map_err(|e| TitaniumError::InvalidManifest(e.to_string()))
        }
    }

    /// Discover plugins inside a root directory (each subdirectory can hold plugin.json or plugin.toml).
    pub fn discover_directory(&mut self, dir: &Path) -> Result<Vec<String>, TitaniumError> {
        let mut discovered = Vec::new();
        if !dir.exists() || !dir.is_dir() {
            return Ok(discovered);
        }

        let entries = fs::read_dir(dir).map_err(|e| TitaniumError::IoError(e.to_string()))?;
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                let json_manifest = path.join("plugin.json");
                let toml_manifest = path.join("plugin.toml");

                let (manifest_file, is_toml) = if json_manifest.exists() {
                    (json_manifest, false)
                } else if toml_manifest.exists() {
                    (toml_manifest, true)
                } else {
                    continue;
                };

                let content = fs::read_to_string(&manifest_file)
                    .map_err(|e| TitaniumError::IoError(e.to_string()))?;

                match Self::parse_manifest(&content, is_toml) {
                    Ok(manifest) => {
                        let id = manifest.id.clone();
                        self.plugins.insert(
                            id.clone(),
                            RegisteredPlugin {
                                manifest,
                                state: PluginState::Discovered,
                                location: Some(path),
                                installed_at: None,
                            },
                        );
                        discovered.push(id);
                    }
                    Err(err) => {
                        eprintln!("Failed to parse plugin manifest in {:?}: {}", path, err);
                    }
                }
            }
        }

        Ok(discovered)
    }

    /// Install a manifest into the registry after validating security and compatibility.
    pub fn install(
        &mut self,
        manifest: PluginManifest,
        location: Option<PathBuf>,
    ) -> Result<String, TitaniumError> {
        validate_plugin_manifest(&manifest, &self.engine_version)?;

        let id = manifest.id.clone();
        let plugin = RegisteredPlugin {
            manifest,
            state: PluginState::Installed,
            location,
            installed_at: Some("now".to_string()),
        };

        self.plugins.insert(id.clone(), plugin);
        Ok(id)
    }

    /// Transition plugin from Installed/Discovered to Loaded.
    pub fn load(&mut self, plugin_id: &str) -> Result<(), TitaniumError> {
        let plugin = self
            .plugins
            .get_mut(plugin_id)
            .ok_to_string(plugin_id)?;

        validate_plugin_manifest(&plugin.manifest, &self.engine_version)?;

        match plugin.state {
            PluginState::Discovered | PluginState::Installed | PluginState::Disabled => {
                plugin.state = PluginState::Loaded;
                Ok(())
            }
            PluginState::Loaded | PluginState::Active => Ok(()),
            PluginState::Error(ref err) => Err(TitaniumError::InvalidStateTransition {
                from: format!("Error({})", err),
                to: "Loaded".to_string(),
                reason: "Cannot load plugin currently in error state".to_string(),
            }),
        }
    }

    /// Activate a loaded (or installed) plugin and register its capabilities.
    pub fn activate(&mut self, plugin_id: &str) -> Result<(), TitaniumError> {
        // Ensure valid state
        let capabilities = {
            let plugin = self
                .plugins
                .get_mut(plugin_id)
                .ok_to_string(plugin_id)?;

            validate_plugin_manifest(&plugin.manifest, &self.engine_version)?;

            match plugin.state {
                PluginState::Installed | PluginState::Loaded | PluginState::Disabled => {
                    plugin.state = PluginState::Active;
                    plugin.manifest.capabilities.clone()
                }
                PluginState::Active => return Ok(()),
                PluginState::Discovered => {
                    return Err(TitaniumError::InvalidStateTransition {
                        from: "Discovered".to_string(),
                        to: "Active".to_string(),
                        reason: "Plugin must be installed before activation".to_string(),
                    });
                }
                PluginState::Error(ref err) => {
                    return Err(TitaniumError::InvalidStateTransition {
                        from: format!("Error({})", err),
                        to: "Active".to_string(),
                        reason: "Plugin is in error state".to_string(),
                    });
                }
            }
        };

        // Register capabilities
        for cap in capabilities {
            self.capability_map
                .entry(cap)
                .or_default()
                .push(plugin_id.to_string());
        }

        Ok(())
    }

    /// Deactivate an active plugin and withdraw its capabilities.
    pub fn deactivate(&mut self, plugin_id: &str) -> Result<(), TitaniumError> {
        let capabilities = {
            let plugin = self
                .plugins
                .get_mut(plugin_id)
                .ok_to_string(plugin_id)?;

            match plugin.state {
                PluginState::Active => {
                    plugin.state = PluginState::Disabled;
                    plugin.manifest.capabilities.clone()
                }
                _ => return Ok(()),
            }
        };

        // Remove capabilities
        for cap in capabilities {
            if let Some(list) = self.capability_map.get_mut(&cap) {
                list.retain(|id| id != plugin_id);
            }
        }

        Ok(())
    }

    /// Uninstall a plugin entirely from the registry.
    pub fn uninstall(&mut self, plugin_id: &str) -> Result<(), TitaniumError> {
        self.deactivate(plugin_id)?;
        self.plugins.remove(plugin_id);
        Ok(())
    }

    /// Check if a plugin is currently Active and holds a specific permission.
    pub fn check_permission(&self, plugin_id: &str, perm: &PluginPermission) -> bool {
        if let Some(plugin) = self.plugins.get(plugin_id) {
            if plugin.state == PluginState::Active {
                return plugin
                    .manifest
                    .permissions
                    .iter()
                    .any(|p| PluginPermission::from_str(p).as_ref() == Some(perm));
            }
        }
        false
    }

    /// Check if a capability is provided by at least one currently active plugin.
    pub fn has_capability(&self, capability: &str) -> bool {
        self.capability_map
            .get(capability)
            .map(|list| !list.is_empty())
            .unwrap_or(false)
    }

    /// Aggregate all contributions from currently Active plugins.
    pub fn get_active_contributions(&self) -> AggregatedContributions {
        let mut agg = AggregatedContributions::default();

        for plugin in self.plugins.values() {
            if plugin.state == PluginState::Active {
                if let Some(contributions) = &plugin.manifest.contributions {
                    agg.views.extend(contributions.views.clone());
                    agg.themes.extend(contributions.themes.clone());
                    agg.content_blocks.extend(contributions.content_blocks.clone());
                    agg.question_types.extend(contributions.question_types.clone());
                }
            }
        }

        agg
    }

    pub fn get_plugin(&self, id: &str) -> Option<&RegisteredPlugin> {
        self.plugins.get(id)
    }

    pub fn list_plugins(&self) -> Vec<&RegisteredPlugin> {
        self.plugins.values().collect()
    }
}

trait OptionExt<T> {
    fn ok_to_string(self, id: &str) -> Result<T, TitaniumError>;
}

impl<T> OptionExt<T> for Option<T> {
    fn ok_to_string(self, id: &str) -> Result<T, TitaniumError> {
        self.ok_or_else(|| TitaniumError::PluginNotFound(id.to_string()))
    }
}
