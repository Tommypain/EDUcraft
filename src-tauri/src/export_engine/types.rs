//! Pure data types for the EDUcraft HTML export engine.
//! No Tauri dependency — only serde. This module is fully unit-testable in isolation.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// A single node in the book's knowledge tree (branch, sub, or leaf).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookNode {
    pub id: String,
    pub level: String, // "branch" | "sub" | "leaf"
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ar: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub en: Option<String>,
    /// All remaining fields (questions, cards, pageBlocks, etc.) kept as raw JSON
    /// so the Rust layer never needs to know the full question schema.
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Localised metadata for a book.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookLocale {
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tagline: Option<String>,
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// A full book as serialised from the React state.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportBook {
    pub id: String,
    pub ar: BookLocale,
    pub en: BookLocale,
    pub nodes: Vec<BookNode>,
    #[serde(default)]
    pub cross_links: Vec<serde_json::Value>,
    /// Remaining book fields (cover gradient, etc.) passed through as-is.
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// A folder/encyclopedia collection.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportCollection {
    pub id: String,
    pub title: String,
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// The full payload that the React UI sends via Tauri IPC when requesting an export.
/// Mirrors the JS `seed` object built by `buildExportSeed()` on the frontend.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportSeed {
    pub id: String,
    #[serde(rename = "startBookId")]
    pub start_book_id: String,
    pub books: Vec<ExportBook>,
    #[serde(default)]
    pub collections: Vec<ExportCollection>,
    pub lang: String,
    #[serde(rename = "skinId")]
    pub skin_id: String,
    #[serde(rename = "flavorId")]
    pub flavor_id: String,
    #[serde(rename = "bookFlavors", default)]
    pub book_flavors: HashMap<String, String>,
    /// base64 data URIs keyed by book id
    #[serde(default)]
    pub covers: HashMap<String, String>,
}
