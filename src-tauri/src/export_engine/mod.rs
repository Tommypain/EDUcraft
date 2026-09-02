//! EDUcraft HTML Export Engine — pure Rust, zero Tauri dependency.
//!
//! # Architecture
//! - `types`         — Serde structs for ExportSeed, ExportBook, BookNode, etc.
//! - `validator`     — Automatic data integrity checking and repair before export
//! - `bundle_loader` — Compile-time asset embedding via include_str!()
//! - `html_builder`  — Pure functions that assemble the final self-contained HTML document

pub mod bundle_loader;
pub mod html_builder;
pub mod types;
pub mod validator;
