//! Data models for the Asset Extraction Engine.

use crate::contracts::{AssetRole, AssetType, LocalizedText};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ExtractionSource {
    Html,
    Pptx,
    Pdf,
    DirectFile,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RawExtractedAsset {
    pub original_filename: String,
    pub mime_type: String,
    pub data: Vec<u8>,
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub caption: Option<LocalizedText>,
    pub alt: Option<LocalizedText>,
    pub provenance_tags: Vec<String>,
    pub hinted_type: Option<AssetType>,
    pub hinted_role: Option<AssetRole>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractionOptions {
    pub filter_decorative: bool,
    pub min_width: u32,
    pub min_height: u32,
    pub deduplicate_by_hash: bool,
}

impl Default for ExtractionOptions {
    fn default() -> Self {
        Self {
            filter_decorative: true,
            min_width: 32,
            min_height: 32,
            deduplicate_by_hash: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ExtractionReport {
    pub total_found: usize,
    pub unique_stored: usize,
    pub deduplicated_count: usize,
    pub decorative_count: usize,
    pub educational_count: usize,
    pub asset_ids: Vec<String>,
    pub warnings: Vec<String>,
}
