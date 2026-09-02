//! EDUcraft HTML Export Engine — pure Rust, no Tauri dependency.
//!
//! # Modules
//! - `types`         — Serde structs for ExportSeed, ExportBook, BookNode, etc.
//! - `bundle_loader` — Compile-time asset embedding via include_str!()
//! - `html_builder`  — Pure functions that assemble the final HTML document
//!
//! # Usage (from a Tauri command)
//! ```rust
//! use export_engine::{html_builder, types::ExportSeed};
//!
//! let html = html_builder::build_export_html(&opts);
//! std::fs::write(&output_path, html)?;
//! ```

pub mod bundle_loader;
pub mod html_builder;
pub mod types;
