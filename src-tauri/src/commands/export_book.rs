//! Tauri IPC command: export a single book as a standalone HTML file.

use crate::export_engine::{
    html_builder::{build_export_html, lang_to_dir, seed_to_safe_json, slugify, ExportHtmlOptions},
    types::ExportSeed,
    validator::validate_and_sanitize_seed,
};
use std::path::PathBuf;
use tauri::AppHandle;

/// Export a single book to a self-contained HTML file.
#[tauri::command]
pub async fn export_book(
    mut seed: ExportSeed,
    output_path: Option<String>,
    app: AppHandle,
) -> Result<String, String> {
    // 1. Validate & sanitize seed data (fixes orphan leaves, broken links, missing locales)
    let validation_report = validate_and_sanitize_seed(&mut seed)?;
    if !validation_report.warnings.is_empty() {
        eprintln!(
            "[EDUcraft Rust Exporter] Validation repairs applied: {:?}",
            validation_report.warnings
        );
    }

    let book = seed.books.first().ok_or("No books in export seed")?;
    let title = if seed.lang == "ar" {
        book.ar.title.clone()
    } else {
        book.en.title.clone()
    };

    // 2. Determine save path
    let save_path: PathBuf = match output_path {
        Some(p) => PathBuf::from(p),
        None => {
            use tauri_plugin_dialog::DialogExt;
            let slug = slugify(&title);
            let default_name = if slug.is_empty() {
                format!("{}.html", book.id)
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

    // 3. Serialise seed to safe JSON
    let seed_json = seed_to_safe_json(&seed).map_err(|e| e.to_string())?;

    // 4. Build SVG favicon
    let favicon = build_svg_favicon(&book.extra);

    // 5. Generate self-contained HTML
    let html = build_export_html(&ExportHtmlOptions {
        title: &title,
        favicon: &favicon,
        lang: &seed.lang,
        dir: lang_to_dir(&seed.lang),
        seed_json: &seed_json,
    });

    // 6. Write file to disk
    std::fs::write(&save_path, html).map_err(|e| format!("Failed to write file: {e}"))?;

    Ok(save_path.to_string_lossy().into_owned())
}

/// Build a tiny inline SVG favicon data URI from the book's cover gradient colours.
fn build_svg_favicon(book_extra: &std::collections::HashMap<String, serde_json::Value>) -> String {
    let from = book_extra
        .get("cover")
        .and_then(|c| c.get("from"))
        .and_then(|v| v.as_str())
        .unwrap_or("#6366f1");
    let to = book_extra
        .get("cover")
        .and_then(|c| c.get("to"))
        .and_then(|v| v.as_str())
        .unwrap_or("#818cf8");

    let svg = format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="{from}"/><stop offset="100%" stop-color="{to}"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#g)"/></svg>"#,
        from = from,
        to = to
    );

    format!(
        "data:image/svg+xml,{}",
        svg.chars()
            .map(|c| match c {
                ' ' => '+',
                '#' => '%',
                _ => c,
            })
            .collect::<String>()
            .replace('%', "%23")
            .replace('+', "%20")
    )
}
