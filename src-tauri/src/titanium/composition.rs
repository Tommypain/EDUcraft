//! Titanium Plugin Composition, Dependency Resolution, and Conflict Detection
//!
//! Provides topological dependency DAG ordering, cycle detection, feature pack bundles,
//! and contribution collision prevention.

use super::types::{PluginState, TitaniumError};
use super::validator::is_engine_compatible;
use crate::contracts::PluginManifest;
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet, VecDeque};

/// Structured errors that occur during plugin composition and dependency resolution.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum CompositionError {
    MissingDependency {
        dependent: String,
        required: String,
        version_req: String,
    },
    IncompatibleDependencyVersion {
        dependent: String,
        required: String,
        required_version: String,
        actual_version: String,
    },
    CircularDependency(Vec<String>),
    BlockCollision {
        block_kind: String,
        plugin_a: String,
        plugin_b: String,
    },
    QuestionCollision {
        question_type: String,
        plugin_a: String,
        plugin_b: String,
    },
    ViewCollision {
        view_id: String,
        plugin_a: String,
        plugin_b: String,
    },
}

impl std::fmt::Display for CompositionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CompositionError::MissingDependency {
                dependent,
                required,
                version_req,
            } => write!(
                f,
                "Plugin '{}' requires missing dependency '{}' ({})",
                dependent, required, version_req
            ),
            CompositionError::IncompatibleDependencyVersion {
                dependent,
                required,
                required_version,
                actual_version,
            } => write!(
                f,
                "Plugin '{}' requires '{}' version {}, but found {}",
                dependent, required, required_version, actual_version
            ),
            CompositionError::CircularDependency(cycle) => {
                write!(f, "Circular dependency detected: {}", cycle.join(" -> "))
            }
            CompositionError::BlockCollision {
                block_kind,
                plugin_a,
                plugin_b,
            } => write!(
                f,
                "Block collision on kind '{}': provided by both '{}' and '{}'",
                block_kind, plugin_a, plugin_b
            ),
            CompositionError::QuestionCollision {
                question_type,
                plugin_a,
                plugin_b,
            } => write!(
                f,
                "Question collision on type '{}': provided by both '{}' and '{}'",
                question_type, plugin_a, plugin_b
            ),
            CompositionError::ViewCollision {
                view_id,
                plugin_a,
                plugin_b,
            } => write!(
                f,
                "View collision on id '{}': provided by both '{}' and '{}'",
                view_id, plugin_a, plugin_b
            ),
        }
    }
}

impl std::error::Error for CompositionError {}

/// Manifest for a Feature Pack meta-plugin bundling multiple plugins.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct FeaturePackManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub bundled_plugins: Vec<String>,
}

/// Engine for resolving plugin dependencies and computing topological activation orders.
pub struct DependencyResolver;

impl DependencyResolver {
    /// Compute deterministic topological activation order for a set of target plugins.
    pub fn resolve_order(
        available: &HashMap<String, PluginManifest>,
        targets: &[String],
    ) -> Result<Vec<String>, CompositionError> {
        // 1. Collect all reachable plugins (targets + all transitive dependencies)
        let mut needed = HashSet::new();
        let mut queue = VecDeque::new();

        for t in targets {
            if !available.contains_key(t) {
                return Err(CompositionError::MissingDependency {
                    dependent: "target".to_string(),
                    required: t.clone(),
                    version_req: "*".to_string(),
                });
            }
            needed.insert(t.clone());
            queue.push_back(t.clone());
        }

        while let Some(curr_id) = queue.pop_front() {
            let manifest = &available[&curr_id];
            for (dep_id, ver_req) in &manifest.dependencies {
                let dep_manifest = available.get(dep_id).ok_or_else(|| {
                    CompositionError::MissingDependency {
                        dependent: curr_id.clone(),
                        required: dep_id.clone(),
                        version_req: ver_req.clone(),
                    }
                })?;

                // Check version compatibility
                if !is_engine_compatible(ver_req, &dep_manifest.version) {
                    return Err(CompositionError::IncompatibleDependencyVersion {
                        dependent: curr_id.clone(),
                        required: dep_id.clone(),
                        required_version: ver_req.clone(),
                        actual_version: dep_manifest.version.clone(),
                    });
                }

                if needed.insert(dep_id.clone()) {
                    queue.push_back(dep_id.clone());
                }
            }
        }

        // 2. Build dependency graph for needed plugins
        // Edge: dep -> dependent (dep must activate before dependent)
        let mut outgoing: HashMap<String, Vec<String>> = HashMap::new();
        let mut in_degree: HashMap<String, usize> = HashMap::new();

        for id in &needed {
            outgoing.entry(id.clone()).or_default();
            in_degree.entry(id.clone()).or_insert(0);
        }

        for id in &needed {
            let manifest = &available[id];
            for dep_id in manifest.dependencies.keys() {
                if needed.contains(dep_id) {
                    outgoing.entry(dep_id.clone()).or_default().push(id.clone());
                    *in_degree.entry(id.clone()).or_insert(0) += 1;
                }
            }
        }

        // 3. Kahn's Algorithm for topological sorting
        let mut sorted_ready: Vec<String> = in_degree
            .iter()
            .filter(|&(_, &deg)| deg == 0)
            .map(|(id, _)| id.clone())
            .collect();
        sorted_ready.sort();
        let mut ready = VecDeque::from(sorted_ready);

        let mut order = Vec::new();

        while let Some(u) = ready.pop_front() {
            order.push(u.clone());
            if let Some(neighbors) = outgoing.get(&u) {
                let mut next_batch = Vec::new();
                for v in neighbors {
                    let deg = in_degree.get_mut(v).unwrap();
                    *deg -= 1;
                    if *deg == 0 {
                        next_batch.push(v.clone());
                    }
                }
                next_batch.sort();
                ready.extend(next_batch);
            }
        }

        if order.len() < needed.len() {
            let unresolved: Vec<String> = in_degree
                .into_iter()
                .filter(|(_, deg)| *deg > 0)
                .map(|(id, _)| id)
                .collect();
            return Err(CompositionError::CircularDependency(unresolved));
        }

        Ok(order)
    }
}

/// Detector for conflicting contributions between plugins.
pub struct ConflictDetector;

impl ConflictDetector {
    /// Verify that an active or proposed set of manifests has no contribution collisions.
    pub fn check_set(manifests: &[&PluginManifest]) -> Result<(), CompositionError> {
        let mut block_map: HashMap<String, String> = HashMap::new();
        let mut question_map: HashMap<String, String> = HashMap::new();
        let mut view_map: HashMap<String, String> = HashMap::new();

        for m in manifests {
            if let Some(contribs) = &m.contributions {
                for b in &contribs.content_blocks {
                    if let Some(existing) = block_map.get(&b.kind) {
                        if existing != &m.id {
                            return Err(CompositionError::BlockCollision {
                                block_kind: b.kind.clone(),
                                plugin_a: existing.clone(),
                                plugin_b: m.id.clone(),
                            });
                        }
                    }
                    block_map.insert(b.kind.clone(), m.id.clone());
                }

                for q in &contribs.question_types {
                    if let Some(existing) = question_map.get(&q.question_type) {
                        if existing != &m.id {
                            return Err(CompositionError::QuestionCollision {
                                question_type: q.question_type.clone(),
                                plugin_a: existing.clone(),
                                plugin_b: m.id.clone(),
                            });
                        }
                    }
                    question_map.insert(q.question_type.clone(), m.id.clone());
                }

                for v in &contribs.views {
                    if let Some(existing) = view_map.get(&v.id) {
                        if existing != &m.id {
                            return Err(CompositionError::ViewCollision {
                                view_id: v.id.clone(),
                                plugin_a: existing.clone(),
                                plugin_b: m.id.clone(),
                            });
                        }
                    }
                    view_map.insert(v.id.clone(), m.id.clone());
                }
            }
        }

        Ok(())
    }
}

impl super::registry::TitaniumRegistry {
    /// Activate a plugin along with all its declared dependencies in topological order.
    pub fn activate_with_dependencies(&mut self, plugin_id: &str) -> Result<Vec<String>, TitaniumError> {
        let available: HashMap<String, PluginManifest> = self
            .plugins
            .iter()
            .map(|(k, v)| (k.clone(), v.manifest.clone()))
            .collect();

        let order = DependencyResolver::resolve_order(&available, &[plugin_id.to_string()])
            .map_err(|e| TitaniumError::InvalidStateTransition {
                from: "Inactive".to_string(),
                to: "Active".to_string(),
                reason: e.to_string(),
            })?;

        // Check for conflicts among active plugins + proposed activation order
        let mut to_verify: Vec<&PluginManifest> = self
            .plugins
            .values()
            .filter(|p| p.state == PluginState::Active)
            .map(|p| &p.manifest)
            .collect();

        for id in &order {
            if let Some(p) = self.plugins.get(id) {
                if !to_verify.iter().any(|m| m.id == *id) {
                    to_verify.push(&p.manifest);
                }
            }
        }

        ConflictDetector::check_set(&to_verify).map_err(|e| TitaniumError::InvalidStateTransition {
            from: "Inactive".to_string(),
            to: "Active".to_string(),
            reason: e.to_string(),
        })?;

        // Activate each in order
        for id in &order {
            self.activate(id)?;
        }

        Ok(order)
    }
}
