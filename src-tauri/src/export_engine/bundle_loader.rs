//! Compile-time asset embedding for the EDUcraft standalone UI bundle.
//!
//! The JS and CSS files are baked into the binary at compile time using
//! `include_str!()`. This means:
//!   - Zero I/O at export time (assets are already in memory)
//!   - UI bundle is always in sync with the binary (can't drift)
//!   - To update assets: run `npm run build:export`, then `cargo build`
//!
//! The files are written by `scripts/build-export-bundle.js`.

/// The full minified standalone React bundle (iife format).
/// Updated by `npm run build:export` → written to src-tauri/assets/ui_bundle.js
pub static UI_BUNDLE_JS: &str = include_str!("../../assets/ui_bundle.js");

/// The compiled Tailwind CSS for every class used in the standalone bundle.
/// Updated alongside UI_BUNDLE_JS by the same build step.
pub static UI_BUNDLE_CSS: &str = include_str!("../../assets/ui_bundle.css");
