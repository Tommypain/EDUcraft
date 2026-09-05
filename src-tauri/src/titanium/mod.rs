//! EDUcraft Master Architecture — Titanium Extension Layer Core
//!
//! Provides plugin discovery, manifest validation, lifecycle transitions,
//! capability registration, sandbox permissions, and contribution aggregation.

pub mod blocks;
pub mod composition;
pub mod declarative;
pub mod events;
pub mod registry;
pub mod slots;
pub mod theme_tokens;
pub mod types;
pub mod validator;

pub use blocks::*;
pub use composition::*;
pub use declarative::*;
pub use events::*;
pub use registry::*;
pub use slots::*;
pub use theme_tokens::*;
pub use types::*;
pub use validator::*;
