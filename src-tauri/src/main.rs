// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod export;
use export::ExportPayload;
use export::BundlePayload;
use std::fs;


// Tauri command to greet the user
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to EDUcraft.", name)
}

// Tauri command to retrieve system and platform details
#[tauri::command]
fn get_system_info() -> serde_json::Value {
    serde_json::json!({
        "os": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "family": std::env::consts::FAMILY,
        "mode": "Tauri Native IPC"
    })
}

// Tauri command to compile standalone HTML using the Rust engine (legacy template)
#[tauri::command]
fn export_standalone_bundle(payload: ExportPayload) -> Result<String, String> {
    Ok(export::generate_standalone_html(&payload))
}

// NEW: Export the real React app bundle with injected book/bag data
#[tauri::command]
fn export_app_bundle(payload: BundlePayload) -> Result<String, String> {
    export::bundle_app_with_data(&payload)
}

// Tauri command to save the generated HTML to disk directly
#[tauri::command]
fn save_exported_html(file_path: String, html_content: String) -> Result<String, String> {
    fs::write(&file_path, html_content)
        .map(|_| format!("File saved successfully to {}", file_path))
        .map_err(|e| format!("Failed to write file: {}", e))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info,
            export_standalone_bundle,
            export_app_bundle,
            save_exported_html
        ])
        .run(tauri::generate_context!())
        .expect("error while running EDUcraft application");
}
