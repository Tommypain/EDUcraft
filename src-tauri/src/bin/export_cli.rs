//! Standalone CLI adapter for EDUcraft HTML export engine.
//! Accepts an ExportSeed JSON via stdin and streams the self-contained HTML to stdout.

use educraft_lib::export_engine::{
    html_builder::{build_export_html, lang_to_dir, seed_to_safe_json, ExportHtmlOptions},
    types::ExportSeed,
    validator::validate_and_sanitize_seed,
};
use std::io::{self, Read, Write};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut buffer = String::new();
    io::stdin().read_to_string(&mut buffer)?;

    if buffer.trim().is_empty() {
        eprintln!("[export_cli] Error: Empty input payload");
        std::process::exit(1);
    }

    let mut seed: ExportSeed = serde_json::from_str(&buffer)?;
    let report = validate_and_sanitize_seed(&mut seed)
        .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))?;

    if !report.warnings.is_empty() {
        eprintln!("[export_cli] Validation repairs applied: {:?}", report.warnings);
    }

    let title = if !seed.collections.is_empty() {
        seed.collections[0].title.clone()
    } else if let Some(book) = seed.books.first() {
        if seed.lang == "ar" {
            book.ar.title.clone()
        } else {
            book.en.title.clone()
        }
    } else {
        "EDUcraft".to_string()
    };

    let seed_json = seed_to_safe_json(&seed)?;

    let html = build_export_html(&ExportHtmlOptions {
        title: &title,
        favicon: "data:,",
        lang: &seed.lang,
        dir: lang_to_dir(&seed.lang),
        seed_json: &seed_json,
    });

    let stdout = io::stdout();
    let mut handle = stdout.lock();
    handle.write_all(html.as_bytes())?;
    handle.flush()?;

    Ok(())
}
