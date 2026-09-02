//! EDUcraft Tauri application library.
//!
//! # Architecture
//! ```text
//! lib.rs          — Tauri builder + command registration
//! commands/       — IPC surface: thin wrappers, Tauri-aware
//! export_engine/  — Pure Rust business logic, no Tauri dependency
//! ```

mod commands;
pub mod export_engine;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::export_book,
            commands::export_collection,
        ])
        .run(tauri::generate_context!())
        .expect("error while running EDUcraft application");
}
