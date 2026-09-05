//! EDUcraft Master Architecture — In-Memory Knowledge Graph Engine
//!
//! Provides a graph structure connecting Books, Chapters, Sections, Leaves,
//! ContentBlocks, Concepts, Questions, Assets, and Study Records.
//! Allows prerequisite resolution, multimodal concept tracing, and study performance propagation.

pub mod analytics;
pub mod builder;
pub mod types;

pub use builder::*;
pub use types::*;

