//! Data types for semantic asset resolution.

use crate::contracts::{AssetRole, AssetType};
use serde::{Deserialize, Serialize};

pub const DEFAULT_MIN_RESOLUTION_SCORE: f32 = 0.30;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct AssetResolutionQuery {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub topic: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asset_type: Option<AssetType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<AssetRole>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub concept: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_score: Option<f32>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ScoredCandidate {
    pub asset_id: String,
    pub score: f32,
    pub match_reasons: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AssetResolutionResult {
    pub resolved: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asset_id: Option<String>,
    pub score: f32,
    pub candidates: Vec<ScoredCandidate>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,
}

impl AssetResolutionResult {
    pub fn unresolved(reason: impl Into<String>) -> Self {
        Self {
            resolved: false,
            asset_id: None,
            score: 0.0,
            candidates: Vec::new(),
            reason: Some(reason.into()),
        }
    }
}
