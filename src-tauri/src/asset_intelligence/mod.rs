//! EDUcraft Asset Intelligence Subsystem.
//!
//! Provides perceptual hashing (dHash), evidence-based semantic enrichment,
//! topic/concept extraction without hallucination, and confidence scoring.

pub mod enricher;
pub mod phash;

pub use enricher::enrich_asset_intelligence;
pub use phash::{compute_dhash, hamming_distance};
