//! EDUcraft Dynamic Capability-Driven Runtime.
//!
//! Controls dynamic activation and safe gating of subsystems
//! (images, questions, mindmap, canvas_a4, katex, code_highlight).

pub mod capabilities;
pub mod context;

pub use capabilities::RuntimeCapabilities;
pub use context::RuntimeContext;
