use educraft_lib::export_engine::{
    html_builder::{build_export_html, lang_to_dir, seed_to_safe_json, ExportHtmlOptions},
    types::{ExportBook, ExportSeed},
    validator::validate_and_sanitize_seed,
};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[test]
fn test_real_book_export_pipeline() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).parent().unwrap().to_path_buf();
    let book_path = root.join("src/data/01-html-master-curriculum.json");
    let json_str = fs::read_to_string(&book_path).expect("Read book json");

    let book: ExportBook = serde_json::from_str(&json_str).expect("Deserialize book");
    assert_eq!(book.id, "01-html-master-curriculum");

    let mut seed = ExportSeed {
        id: book.id.clone(),
        start_book_id: book.id.clone(),
        books: vec![book.clone()],
        collections: vec![],
        lang: "ar".to_string(),
        skin_id: "normal".to_string(),
        flavor_id: "normal".to_string(),
        book_flavors: HashMap::from([(book.id.clone(), "normal".to_string())]),
        covers: HashMap::new(),
        disable_editor: false,
    };

    // 1. Validation & sanitization
    let report = validate_and_sanitize_seed(&mut seed).expect("Validation should pass");
    println!("Validation report: {:?}", report);

    // 2. JSON serialization
    let seed_json = seed_to_safe_json(&seed).expect("Seed JSON safe serialization");
    assert!(!seed_json.contains("</script"));

    // 3. Build HTML with resolved cover favicon
    let favicon = educraft_lib::export_engine::html_builder::resolve_seed_cover_favicon(&seed, Some(&book.id));
    let html = build_export_html(&ExportHtmlOptions::new(
        &book.ar.title,
        &favicon,
        "ar",
        lang_to_dir("ar"),
        &seed_json,
    ));

    // 4. Assertions on generated HTML
    assert!(html.starts_with("<!DOCTYPE html>"));
    assert!(html.contains(r#"lang="ar""#));
    assert!(html.contains(r#"dir="rtl""#));
    assert!(html.contains("window.__EDUCRAFT_EXPORT__ ="));
    assert!(html.contains(&book.ar.title));
    assert!(html.contains(r#"<link rel="icon""#));
    assert!(html.contains(r#"<link rel="apple-touch-icon""#));
    assert!(html.contains(r#"<meta property="og:image""#));
    assert!(html.len() > 1_000_000, "Exported HTML should be a full standalone bundle (>1MB)");

    // Write to disk for manual & browser verification
    let out_path = root.join("src-tauri/tests/output/exported_html_book.html");
    fs::write(&out_path, &html).expect("Write exported HTML to disk");
    println!("✅ Standalone HTML book written to: {:?}", out_path);
}

#[test]
fn test_stress_export_all_library_books() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).parent().unwrap().to_path_buf();
    let library_path = root.join("src/data/all_educraft_books.json");
    if !library_path.exists() {
        return;
    }
    let json_str = fs::read_to_string(&library_path).expect("Read library json");
    let books: Vec<ExportBook> = serde_json::from_str(&json_str).expect("Deserialize all books");
    println!("Loaded {} books for stress validation", books.len());

    for mut book in books {
        let mut report = educraft_lib::export_engine::validator::ValidationReport::default();
        let res = educraft_lib::export_engine::validator::validate_and_sanitize_book(&mut book, &mut report);
        assert!(res.is_ok(), "Book {} failed validation: {:?}", book.id, res.err());
    }
    println!("✅ All library books passed validation and auto-sanitization without error!");
}
