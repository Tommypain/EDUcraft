//! EDUcraft Master Architecture — Titanium Extension Layer Core
//!
//! Provides plugin discovery, manifest validation, lifecycle transitions,
//! capability registration, sandbox permissions, and contribution aggregation.

pub mod registry;
pub mod types;
pub mod validator;

pub use registry::*;
pub use types::*;
pub use validator::*;
