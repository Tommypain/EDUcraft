use crate::export_engine::types::ExportBook;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum BookState {
    Valid,
    Incomplete,
    Invalid,
    Missing,
    Changed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiscoveredBook {
    pub id: String,
    pub title_ar: String,
    pub title_en: String,
    pub tagline_ar: String,
    pub tagline_en: String,
    pub path: String,
    pub is_dir: bool,
    pub state: BookState,
    pub error: Option<String>,
    pub mtime_ms: u64,
    pub node_count: usize,
    pub question_count: usize,
    pub branch_count: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub book: Option<ExportBook>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookScanResult {
    pub books: Vec<DiscoveredBook>,
    pub scanned_dir: String,
    pub total_found: usize,
    pub valid_count: usize,
    pub invalid_count: usize,
    pub errors: Vec<String>,
}
