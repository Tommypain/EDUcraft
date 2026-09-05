//! EDUcraft Master Architecture — Data Schema Migration Engine
//!
//! Provides lossless forward upgrading (1.0 -> 1.1) and backward downsampling (1.1 -> 1.0)
//! with audit logging and zero data loss.

use crate::contracts::{CURRENT_SCHEMA_VERSION, LEGACY_SCHEMA_VERSION};
use crate::export_engine::types::ExportBook;
use serde::{Deserialize, Serialize};
use serde_json::json;

/// Error types occurring during migration.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum MigrationError {
    InvalidBookJson(String),
    UnsupportedVersion(String),
    SerializationError(String),
}

impl std::fmt::Display for MigrationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MigrationError::InvalidBookJson(msg) => write!(f, "Invalid book JSON: {}", msg),
            MigrationError::UnsupportedVersion(v) => write!(f, "Unsupported book schema version: {}", v),
            MigrationError::SerializationError(msg) => write!(f, "Serialization error during migration: {}", msg),
        }
    }
}

impl std::error::Error for MigrationError {}

/// Comprehensive record of all transformations performed during migration.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct MigrationReport {
    pub from_version: String,
    pub to_version: String,
    pub changes: Vec<String>,
    pub timestamp: String,
}

/// Core migration coordinator.
pub struct MigrationEngine;

impl MigrationEngine {
    /// Detect the schema version of a book JSON object. Defaults to "1.0" if absent.
    pub fn detect_version(val: &serde_json::Value) -> String {
        val.get("schema_version")
            .and_then(|v| v.as_str())
            .unwrap_or(LEGACY_SCHEMA_VERSION)
            .to_string()
    }

    /// Migrate an arbitrary book JSON value to the current schema version (1.1) losslessly.
    pub fn migrate_to_current(
        mut val: serde_json::Value,
    ) -> Result<(ExportBook, MigrationReport), MigrationError> {
        if !val.is_object() {
            return Err(MigrationError::InvalidBookJson(
                "Book root must be a JSON object".to_string(),
            ));
        }

        let from_version = Self::detect_version(&val);
        let mut changes = Vec::new();

        if from_version == LEGACY_SCHEMA_VERSION {
            // 1. Upgrade schema_version
            val["schema_version"] = json!(CURRENT_SCHEMA_VERSION);
            changes.push(format!(
                "Upgraded schema_version from {} to {}",
                from_version, CURRENT_SCHEMA_VERSION
            ));

            // 2. Inject default capabilities if missing
            let needs_capabilities = val
                .get("capabilities")
                .and_then(|c| c.as_array())
                .map(|a| a.is_empty())
                .unwrap_or(true);

            if needs_capabilities {
                val["capabilities"] = json!([
                    "images",
                    "quizzes",
                    "cross_links",
                    "reading_progress"
                ]);
                changes.push("Injected default core capabilities array".to_string());
            }

            // 3. Normalize nodes: assign IDs to blocks and questions lacking them
            if let Some(nodes) = val.get_mut("nodes").and_then(|n| n.as_array_mut()) {
                for node in nodes {
                    let node_id = node
                        .get("id")
                        .and_then(|v| v.as_str())
                        .unwrap_or("node")
                        .to_string();

                    // Check pageBlocks
                    if let Some(blocks) = node.get_mut("pageBlocks").and_then(|b| b.as_array_mut()) {
                        for (idx, block) in blocks.iter_mut().enumerate() {
                            let has_id = block
                                .get("id")
                                .and_then(|v| v.as_str())
                                .map(|s| !s.trim().is_empty())
                                .unwrap_or(false);

                            if !has_id {
                                let gen_id = format!("{}_b{}", node_id, idx + 1);
                                block["id"] = json!(gen_id);
                                changes.push(format!(
                                    "Assigned deterministic block ID '{}' in node '{}'",
                                    gen_id, node_id
                                ));
                            }
                        }
                    }

                    // Check questions
                    if let Some(questions) = node.get_mut("questions").and_then(|q| q.as_array_mut()) {
                        for (idx, q) in questions.iter_mut().enumerate() {
                            let has_id = q
                                .get("id")
                                .and_then(|v| v.as_str())
                                .map(|s| !s.trim().is_empty())
                                .unwrap_or(false);

                            if !has_id {
                                let gen_id = format!("{}_q{}", node_id, idx + 1);
                                q["id"] = json!(gen_id);
                                changes.push(format!(
                                    "Assigned deterministic question ID '{}' in node '{}'",
                                    gen_id, node_id
                                ));
                            }
                        }
                    }
                }
            }
        }

        let report = MigrationReport {
            from_version,
            to_version: CURRENT_SCHEMA_VERSION.to_string(),
            changes,
            timestamp: "now".to_string(),
        };

        let book: ExportBook = serde_json::from_value(val)
            .map_err(|e| MigrationError::SerializationError(e.to_string()))?;

        Ok((book, report))
    }

    /// Downsample a modern 1.1 ExportBook for legacy 1.0 consumers.
    pub fn downsample_for_v1_0(book: &ExportBook) -> Result<serde_json::Value, MigrationError> {
        let mut val = serde_json::to_value(book)
            .map_err(|e| MigrationError::SerializationError(e.to_string()))?;

        // Revert schema_version to legacy 1.0
        val["schema_version"] = json!(LEGACY_SCHEMA_VERSION);

        Ok(val)
    }
}
