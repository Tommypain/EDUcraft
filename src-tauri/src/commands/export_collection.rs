//! Tauri IPC command: export a full collection (folder/encyclopedia) as one HTML file.

use crate::export_engine::{
    html_builder::{build_export_html, lang_to_dir, seed_to_safe_json, slugify, ExportHtmlOptions},
    types::ExportSeed,
};
use std::path::PathBuf;
use tauri::AppHandle;

/// Export a collection (folder or encyclopedia) to a self-contained HTML file.
///
/// The seed already contains the flattened list of all books in the collection
/// tree (computed on the JS side by `resolveCollectionBooks`).
#[tauri::command]
pub async fn export_collection(
    seed: ExportSeed,
    collection_title: String,
    output_path: Option<String>,
    app: AppHandle,
) -> Result<String, String> {
    // Determine save path
    let save_path: PathBuf = match output_path {
        Some(p) => PathBuf::from(p),
        None => {
            use tauri_plugin_dialog::DialogExt;
            let default_name = format!("{}.html", slugify(&collection_title));

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

    // Serialise seed
    let seed_json = seed_to_safe_json(&seed).map_err(|e| e.to_string())?;

    // Favicon: derived from the first book's cover colours
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

    let html = build_export_html(&ExportHtmlOptions {
        title: &collection_title,
        favicon: &favicon,
        lang: &seed.lang,
        dir: lang_to_dir(&seed.lang),
        seed_json: &seed_json,
    });

    std::fs::write(&save_path, html).map_err(|e| format!("Failed to write file: {e}"))?;

    Ok(save_path.to_string_lossy().into_owned())
}
