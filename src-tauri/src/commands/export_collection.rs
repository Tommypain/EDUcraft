//! Tauri IPC command: export a collection (folder/encyclopedia) as one HTML file.

use crate::export_engine::{
    html_builder::{build_export_html, lang_to_dir, seed_to_safe_json, slugify, ExportHtmlOptions},
    types::ExportSeed,
    validator::validate_and_sanitize_seed,
};
use std::path::PathBuf;
use tauri::AppHandle;

/// Export a collection (folder or encyclopedia) to a self-contained HTML file.
#[tauri::command]
pub async fn export_collection(
    mut seed: ExportSeed,
    collection_title: String,
    output_path: Option<String>,
    app: AppHandle,
) -> Result<String, String> {
    // 1. Validate & sanitize seed data
    let validation_report = validate_and_sanitize_seed(&mut seed)?;
    if !validation_report.warnings.is_empty() {
        eprintln!(
            "[EDUcraft Rust Exporter] Collection validation repairs applied: {:?}",
            validation_report.warnings
        );
    }

    // 2. Determine save path
    let save_path: PathBuf = match output_path {
        Some(p) => PathBuf::from(p),
        None => {
            use tauri_plugin_dialog::DialogExt;
            let slug = slugify(&collection_title);
            let default_name = if slug.is_empty() {
                "collection.html".to_string()
            } else {
                format!("{}.html", slug)
            };

            let path = app
                .dialog()
                .file()
                .set_file_name(&default_name)
                .add_filter("HTML file", &["html"])
                .blocking_save_file()
                .ok_or("Export cancelled by user")?;

            path.into_path().map_err(|e| e.to_string())?
        }
    };

    // 3. Serialise seed
    let seed_json = seed_to_safe_json(&seed).map_err(|e| e.to_string())?;

    // 4. Favicon
    let favicon = seed
        .books
        .first()
        .map(|b| {
            let from = b
                .extra
                .get("cover")
                .and_then(|c| c.get("from"))
                .and_then(|v| v.as_str())
                .unwrap_or("#6366f1");
            let to = b
                .extra
                .get("cover")
                .and_then(|c| c.get("to"))
                .and_then(|v| v.as_str())
                .unwrap_or("#818cf8");
            format!(
                "data:image/svg+xml,{}",
                format!(
                    r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%25" stop-color="{from}"/><stop offset="100%25" stop-color="{to}"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(%23g)"/></svg>"#
                )
            )
        })
        .unwrap_or_else(|| "data:,".to_string());

    // 5. Generate HTML
    let html = build_export_html(&ExportHtmlOptions {
        title: &collection_title,
        favicon: &favicon,
        lang: &seed.lang,
        dir: lang_to_dir(&seed.lang),
        seed_json: &seed_json,
    });

    // 6. Write to disk
    std::fs::write(&save_path, html).map_err(|e| format!("Failed to write file: {e}"))?;

    Ok(save_path.to_string_lossy().into_owned())
}
