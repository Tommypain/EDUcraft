//! EDUcraft Semantic Asset Resolver.
//!
//! Resolves educational queries (topic, type, role, concept, context)
//! to concrete asset IDs using inverted indexing, multifactor scoring,
//! and strict zero-fabrication guarantees.

pub mod index;
pub mod resolver;
pub mod scorer;
pub mod types;

pub use index::AssetIndex;
pub use resolver::resolve_asset;
pub use scorer::score_candidate;
pub use types::{AssetResolutionQuery, AssetResolutionResult, ScoredCandidate, DEFAULT_MIN_RESOLUTION_SCORE};
