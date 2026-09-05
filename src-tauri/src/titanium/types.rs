//! Titanium Core Data Types
//!
//! Defines plugin states, permissions, registration models, and aggregated contributions.

use crate::contracts::{PluginBlockContribution, PluginManifest, PluginQuestionContribution, PluginThemeContribution, PluginViewContribution};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

/// The lifecycle state of a Titanium plugin.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PluginState {
    Discovered,
    Installed,
    Loaded,
    Active,
    Disabled,
    Error(String),
}

/// Fine-grained sandbox permissions for Titanium plugins.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PluginPermission {
    FsRead,
    FsWrite,
    Network,
    ExecuteWasm,
    RegisterBlock,
    RegisterQuestion,
    RegisterTheme,
    RegisterView,
}

impl PluginPermission {
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "fs:read" | "fsread" => Some(PluginPermission::FsRead),
            "fs:write" | "fswrite" => Some(PluginPermission::FsWrite),
            "network" => Some(PluginPermission::Network),
            "wasm" | "executewasm" | "execute:wasm" => Some(PluginPermission::ExecuteWasm),
            "block" | "registerblock" | "register:block" => Some(PluginPermission::RegisterBlock),
            "question" | "registerquestion" | "register:question" => Some(PluginPermission::RegisterQuestion),
            "theme" | "registertheme" | "register:theme" => Some(PluginPermission::RegisterTheme),
            "view" | "registerview" | "register:view" => Some(PluginPermission::RegisterView),
            _ => None,
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            PluginPermission::FsRead => "fs:read",
            PluginPermission::FsWrite => "fs:write",
            PluginPermission::Network => "network",
            PluginPermission::ExecuteWasm => "wasm",
            PluginPermission::RegisterBlock => "register:block",
            PluginPermission::RegisterQuestion => "register:question",
            PluginPermission::RegisterTheme => "register:theme",
            PluginPermission::RegisterView => "register:view",
        }
    }
}

/// A registered plugin entry within the Titanium runtime.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct RegisteredPlugin {
    pub manifest: PluginManifest,
    pub state: PluginState,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location: Option<PathBuf>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub installed_at: Option<String>,
}

/// Aggregated contributions actively supplied by all currently active plugins.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
pub struct AggregatedContributions {
    pub views: Vec<PluginViewContribution>,
    pub themes: Vec<PluginThemeContribution>,
    pub content_blocks: Vec<PluginBlockContribution>,
    pub question_types: Vec<PluginQuestionContribution>,
}

/// Error type for Titanium core operations.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum TitaniumError {
    PluginNotFound(String),
    InvalidManifest(String),
    IncompatibleEngine {
        required: String,
        current: String,
    },
    InvalidStateTransition {
        from: String,
        to: String,
        reason: String,
    },
    PermissionDenied {
        plugin_id: String,
        permission: String,
    },
    SecurityViolation(String),
    IoError(String),
}

impl std::fmt::Display for TitaniumError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TitaniumError::PluginNotFound(id) => write!(f, "Plugin not found: '{}'", id),
            TitaniumError::InvalidManifest(msg) => write!(f, "Invalid manifest: {}", msg),
            TitaniumError::IncompatibleEngine { required, current } => write!(
                f,
                "Incompatible engine version: requires '{}', current is '{}'",
                required, current
            ),
            TitaniumError::InvalidStateTransition { from, to, reason } => {
                write!(f, "Invalid state transition from '{}' to '{}': {}", from, to, reason)
            }
            TitaniumError::PermissionDenied { plugin_id, permission } => {
                write!(f, "Permission '{}' denied for plugin '{}'", permission, plugin_id)
            }
            TitaniumError::SecurityViolation(msg) => write!(f, "Security violation: {}", msg),
            TitaniumError::IoError(msg) => write!(f, "I/O error: {}", msg),
        }
    }
}

impl std::error::Error for TitaniumError {}
