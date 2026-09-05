//! EDUcraft Master Architecture — Formal Data Contracts
//!
//! Strongly typed serde models for Books, Assets, Manifests, Collections,
//! and Titanium Plugins. Fully backward-compatible with v1.0 books.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub const CURRENT_SCHEMA_VERSION: &str = "1.1";
pub const LEGACY_SCHEMA_VERSION: &str = "1.0";

pub fn default_schema_version() -> String {
    LEGACY_SCHEMA_VERSION.to_string()
}

pub fn default_manifest_version() -> String {
    "1.0".to_string()
}

pub fn default_target_engine() -> String {
    ">=0.0.9".to_string()
}

/// Detect schema version from raw JSON. Defaults to "1.0" if missing.
pub fn detect_schema_version(val: &serde_json::Value) -> String {
    val.get("schema_version")
        .and_then(|v| v.as_str())
        .unwrap_or(LEGACY_SCHEMA_VERSION)
        .to_string()
}

/// Check if schema requires migration
pub fn needs_migration(version: &str) -> bool {
    // Currently v1.0 and v1.1 are natively supported without migration
    version != CURRENT_SCHEMA_VERSION && version != LEGACY_SCHEMA_VERSION
}

// ============================================================================
// Localized Text Contract
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
pub struct LocalizedText {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ar: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub en: Option<String>,
}

// ============================================================================
// Knowledge Asset Model Contract
// ============================================================================

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum AssetType {
    Image,
    Diagram,
    Chart,
    Table,
    Audio,
    Video,
    Document,
    #[serde(rename = "pdffigure")]
    PdfFigure,
    #[serde(rename = "model3d")]
    Model3D,
    #[serde(rename = "interactivediagram")]
    InteractiveDiagram,
    Unknown,
}

impl Default for AssetType {
    fn default() -> Self {
        AssetType::Unknown
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum AssetRole {
    Figure,
    Diagram,
    Hero,
    Card,
    Solution,
    Icon,
    Decorative,
    Unknown,
}

impl Default for AssetRole {
    fn default() -> Self {
        AssetRole::Unknown
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct KnowledgeAsset {
    pub id: String,
    #[serde(default)]
    pub asset_type: AssetType,
    #[serde(default)]
    pub role: AssetRole,
    pub original_filename: String,
    pub storage_path: String,
    pub mime_type: String,
    pub byte_size: u64,
    pub sha256: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub aspect_ratio: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<f64>,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub is_decorative: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub caption: Option<LocalizedText>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alt: Option<LocalizedText>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub tags: Vec<String>,
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct KnowledgeAssetManifest {
    #[serde(default = "default_manifest_version")]
    pub manifest_version: String,
    pub book_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub generated_at: Option<String>,
    #[serde(default)]
    pub assets: HashMap<String, KnowledgeAsset>,
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

impl KnowledgeAssetManifest {
    pub fn new(book_id: impl Into<String>) -> Self {
        Self {
            manifest_version: default_manifest_version(),
            book_id: book_id.into(),
            generated_at: None,
            assets: HashMap::new(),
            extra: HashMap::new(),
        }
    }

    pub fn add_asset(&mut self, asset: KnowledgeAsset) {
        self.assets.insert(asset.id.clone(), asset);
    }

    /// Add an asset with SHA-256 deduplication.
    /// If an asset with identical sha256 already exists, returns the existing canonical id.
    /// Otherwise inserts the new asset and returns its id.
    pub fn add_or_deduplicate(&mut self, asset: KnowledgeAsset) -> String {
        if let Some(existing) = self.find_by_hash(&asset.sha256) {
            return existing.id.clone();
        }
        let id = asset.id.clone();
        self.assets.insert(id.clone(), asset);
        id
    }

    pub fn get_asset(&self, id: &str) -> Option<&KnowledgeAsset> {
        self.assets.get(id)
    }

    pub fn find_by_hash(&self, sha256: &str) -> Option<&KnowledgeAsset> {
        let lower = sha256.to_lowercase();
        self.assets.values().find(|a| a.sha256.to_lowercase() == lower)
    }

    pub fn find_by_type(&self, asset_type: &AssetType) -> Vec<&KnowledgeAsset> {
        self.assets.values().filter(|a| &a.asset_type == asset_type).collect()
    }

    pub fn find_unused_assets(&self, referenced_ids: &[&str]) -> Vec<&KnowledgeAsset> {
        self.assets
            .values()
            .filter(|a| !referenced_ids.contains(&a.id.as_str()))
            .collect()
    }

    pub fn find_missing_references(&self, referenced_ids: &[&str]) -> Vec<String> {
        referenced_ids
            .iter()
            .filter(|&&id| !self.assets.contains_key(id))
            .map(|&id| id.to_string())
            .collect()
    }

    pub fn validate(&self) -> Result<(), String> {
        if self.book_id.trim().is_empty() {
            return Err("Asset manifest book_id cannot be empty".to_string());
        }
        for (key, asset) in &self.assets {
            if asset.id != *key {
                return Err(format!(
                    "Asset key '{}' does not match internal id '{}'",
                    key, asset.id
                ));
            }
            if asset.id.trim().is_empty() {
                return Err("Asset id cannot be empty".to_string());
            }
            if asset.storage_path.trim().is_empty() {
                return Err(format!("Asset '{}' storage_path cannot be empty", asset.id));
            }
            if asset.mime_type.trim().is_empty() {
                return Err(format!("Asset '{}' mime_type cannot be empty", asset.id));
            }
            if asset.byte_size == 0 {
                return Err(format!("Asset '{}' byte_size cannot be 0", asset.id));
            }
            let trimmed_hash = asset.sha256.trim();
            if trimmed_hash.len() != 64 || !trimmed_hash.chars().all(|c| c.is_ascii_hexdigit()) {
                return Err(format!(
                    "Asset '{}' sha256 must be a 64-character hex string",
                    asset.id
                ));
            }
        }
        Ok(())
    }
}

// ============================================================================
// Titanium Plugin Contract
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct PluginViewContribution {
    pub id: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct PluginThemeContribution {
    pub id: String,
    pub name: String,
    pub file: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct PluginBlockContribution {
    pub kind: String,
    pub title: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct PluginQuestionContribution {
    #[serde(rename = "type")]
    pub question_type: String,
    pub title: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
pub struct PluginContributions {
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub views: Vec<PluginViewContribution>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub themes: Vec<PluginThemeContribution>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub content_blocks: Vec<PluginBlockContribution>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub question_types: Vec<PluginQuestionContribution>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PluginManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub entry_point: String,
    #[serde(default = "default_target_engine")]
    pub target_engine: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub capabilities: Vec<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contributions: Option<PluginContributions>,
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

impl PluginManifest {
    pub fn validate(&self) -> Result<(), String> {
        if self.id.trim().is_empty() {
            return Err("Plugin id cannot be empty".to_string());
        }
        if self.name.trim().is_empty() {
            return Err("Plugin name cannot be empty".to_string());
        }
        if self.version.trim().is_empty() {
            return Err("Plugin version cannot be empty".to_string());
        }
        if self.entry_point.trim().is_empty() {
            return Err("Plugin entry_point cannot be empty".to_string());
        }
        Ok(())
    }
}
