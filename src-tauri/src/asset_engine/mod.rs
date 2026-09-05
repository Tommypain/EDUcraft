//! EDUcraft Asset Extraction Engine
//!
//! Multi-source asset extraction, classification, normalization,
//! content-addressable deduplication, and manifest integration.

pub mod classifier;
pub mod extractors;
pub mod models;
pub mod pipeline;

pub use classifier::classify_asset;
pub use models::{ExtractionOptions, ExtractionReport, ExtractionSource, RawExtractedAsset};
pub use pipeline::process_raw_assets;
