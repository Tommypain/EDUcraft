use educraft_lib::book_manager::{delete_book_from_fs, scan_books_directory, BookState};
use std::fs;
use std::path::PathBuf;

#[test]
fn test_scan_books_directory_real() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).parent().unwrap().to_path_buf();
    let books_dir = root.join("BOOKS");

    let result = scan_books_directory(&books_dir).expect("Scan BOOKS directory");
    println!("Scanned books count: {}", result.total_found);
    assert!(result.total_found >= 5, "Expected at least 5 books, found {}", result.total_found);
    assert_eq!(result.valid_count, result.total_found, "All seeded books should be valid");

    for b in &result.books {
        assert_eq!(b.state, BookState::Valid);
        assert!(!b.id.is_empty());
        assert!(!b.title_ar.is_empty());
        assert!(!b.title_en.is_empty());
        assert!(b.node_count > 0, "Book {} should have nodes", b.id);
    }
}

#[test]
fn test_dynamic_add_and_delete_lifecycle() {
    let test_books_dir = PathBuf::from("/tmp/educraft_test_books_isolated");
    let _ = fs::remove_dir_all(&test_books_dir);
    fs::create_dir_all(&test_books_dir).unwrap();

    let test_book_dir = test_books_dir.join("99-test-dynamic-book");

    // 1. Create a dynamic new book folder
    fs::create_dir_all(&test_book_dir).unwrap();
    let dummy_json = r#"{
        "id": "99-test-dynamic-book",
        "ar": { "title": "كتاب ديناميكي جديد", "tagline": "اختبار" },
        "en": { "title": "Dynamic Test Book", "tagline": "Testing" },
        "nodes": [
            { "id": "b1", "level": "branch", "ar": "فرع", "en": "Branch" },
            { "id": "l1", "level": "leaf", "parent": "b1", "ar": "ورقة", "en": "Leaf" }
        ]
    }"#;
    fs::write(test_book_dir.join("book.json"), dummy_json).unwrap();

    // 2. Rescan: New book must appear!
    let scan1 = scan_books_directory(&test_books_dir).unwrap();
    let found = scan1.books.iter().find(|b| b.id == "99-test-dynamic-book");
    assert!(found.is_some(), "Dynamic book should be discovered");
    assert_eq!(found.unwrap().state, BookState::Valid);

    // 3. Delete via deleter (real filesystem delete)
    delete_book_from_fs(&test_book_dir).unwrap();
    assert!(!test_book_dir.exists(), "Book folder must be deleted from disk");

    // 4. Rescan: Book must disappear!
    let scan2 = scan_books_directory(&test_books_dir).unwrap();
    let missing = scan2.books.iter().find(|b| b.id == "99-test-dynamic-book");
    assert!(missing.is_none(), "Deleted book must not appear in scan");

    let _ = fs::remove_dir_all(&test_books_dir);
}

#[test]
fn test_delete_book_by_id_only() {
    use educraft_lib::book_manager::delete_book_by_id;

    let test_books_dir = PathBuf::from("/tmp/educraft_test_books_by_id");
    let _ = fs::remove_dir_all(&test_books_dir);
    fs::create_dir_all(&test_books_dir).unwrap();

    let folder_path = test_books_dir.join("arbitrary-folder-name");
    fs::create_dir_all(&folder_path).unwrap();

    let book_content = r#"{
        "id": "target-delete-by-id-123",
        "ar": { "title": "كتاب تجربة الحذف بالـ ID", "tagline": "وصف" },
        "en": { "title": "ID Delete Test Book", "tagline": "Tagline" },
        "nodes": [
            { "id": "b1", "level": "branch", "ar": "فرع", "en": "Branch" },
            { "id": "l1", "level": "leaf", "parent": "b1", "ar": "ورقة", "en": "Leaf" }
        ]
    }"#;
    fs::write(folder_path.join("book.json"), book_content).unwrap();

    // 1. Verify scan discovers book
    let scan1 = scan_books_directory(&test_books_dir).unwrap();
    assert_eq!(scan1.total_found, 1);
    assert_eq!(scan1.books[0].id, "target-delete-by-id-123");

    // 2. Delete using book_id ONLY (no path given!)
    let deleted_path = delete_book_by_id(&test_books_dir, "target-delete-by-id-123").expect("Delete by ID should succeed");
    assert_eq!(deleted_path, folder_path);
    assert!(!folder_path.exists(), "Target folder must be deleted from filesystem");

    // 3. Rescan: Book must be 100% gone
    let scan2 = scan_books_directory(&test_books_dir).unwrap();
    assert_eq!(scan2.total_found, 0);

    // 4. Repeated deletion must return error
    let err = delete_book_by_id(&test_books_dir, "target-delete-by-id-123");
    assert!(err.is_err(), "Deleting already deleted book must fail");

    let _ = fs::remove_dir_all(&test_books_dir);
}

#[test]
fn test_idempotent_rescan() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).parent().unwrap().to_path_buf();
    let books_dir = root.join("BOOKS");

    let scan1 = scan_books_directory(&books_dir).unwrap();
    let scan2 = scan_books_directory(&books_dir).unwrap();
    let scan3 = scan_books_directory(&books_dir).unwrap();

    assert_eq!(scan1.total_found, scan2.total_found);
    assert_eq!(scan2.total_found, scan3.total_found);
    for i in 0..scan1.total_found {
        assert_eq!(scan1.books[i].id, scan2.books[i].id);
        assert_eq!(scan2.books[i].id, scan3.books[i].id);
    }
}

#[test]
fn test_content_block_validation_and_asset_lifecycle() {
    use educraft_lib::book_manager::{delete_book_asset, save_book_asset, validate_content_block};
    use serde_json::json;

    // 1. Valid Table
    let valid_table = json!({
        "id": "t1",
        "kind": "table",
        "headers": ["Col 1", "Col 2", "Col 3"],
        "rows": [
            ["A", "B", "C"],
            ["D", "E", "F"]
        ]
    });
    assert!(validate_content_block(&valid_table, true).is_ok());

    // 2. Invalid Table: row length mismatch
    let invalid_table = json!({
        "id": "t2",
        "kind": "table",
        "headers": ["Col 1", "Col 2", "Col 3"],
        "rows": [
            ["A", "B"] // Only 2 cells, expected 3!
        ]
    });
    let err = validate_content_block(&invalid_table, true);
    assert!(err.is_err());
    assert!(err.unwrap_err().contains("length (2) does not match headers length (3)"));

    // 3. Pagebreak forbidden inside question content
    let pagebreak_block = json!({
        "id": "pb1",
        "kind": "pagebreak"
    });
    assert!(validate_content_block(&pagebreak_block, true).is_ok()); // ok for pageBlocks
    assert!(validate_content_block(&pagebreak_block, false).is_err()); // forbidden in question content

    // 4. Free text paragraph
    let text_block = json!({
        "id": "txt1",
        "kind": "text",
        "text": "This is a free text explanation paragraph."
    });
    assert!(validate_content_block(&text_block, true).is_ok());

    // 5. Asset saving and deleting lifecycle
    let test_books_dir = PathBuf::from("/tmp/educraft_test_assets");
    let _ = fs::remove_dir_all(&test_books_dir);
    fs::create_dir_all(&test_books_dir).unwrap();

    let saved_rel = save_book_asset(
        &test_books_dir,
        "sample-book",
        "my_diagram.png",
        b"fake_png_binary_data",
    ).expect("Save asset should succeed");

    assert_eq!(saved_rel, "assets/images/my_diagram.png");
    let disk_file = test_books_dir.join("sample-book").join(&saved_rel);
    assert!(disk_file.exists(), "Saved image must physically exist in book folder");

    let deleted = delete_book_asset(&test_books_dir, "sample-book", &saved_rel)
        .expect("Delete asset should succeed");
    assert!(deleted, "Delete should return true");
    assert!(!disk_file.exists(), "Deleted image must not exist on disk");

    let _ = fs::remove_dir_all(&test_books_dir);
}

#[test]
fn test_import_dry_run_valid_complete_book() {
    use educraft_lib::book_manager::import_book_dry_run;

    let valid_json = r#"{
        "id": "dry-run-valid-book",
        "ar": { "title": "كتاب تدقيق كامل", "tagline": "وصف" },
        "en": { "title": "Full Dry Run Book", "tagline": "Tagline" },
        "nodes": [
            { "id": "b1", "level": "branch", "ar": "فرع", "en": "Branch" },
            {
                "id": "l1",
                "level": "leaf",
                "parent": "b1",
                "ar": "ورقة",
                "en": "Leaf",
                "pageBlocks": [
                    { "id": "blk1", "kind": "text", "text": "فقرة تعليمية" },
                    { "id": "blk2", "kind": "table", "headers": ["A", "B"], "rows": [["1", "2"], ["3", "4"]] }
                ],
                "questions": [
                    {
                        "id": "q1",
                        "type": "single",
                        "en": { "prompt": "Choose one", "options": ["Option 0", "Option 1"], "correct": 1 },
                        "ar": { "prompt": "اختر واحدة", "options": ["خيار 0", "خيار 1"], "correct": 1 }
                    }
                ]
            }
        ]
    }"#;

    let report = import_book_dry_run(valid_json).expect("Dry run should succeed");
    assert!(report.is_valid, "Book must be valid");
    assert!(report.issues.is_empty(), "Issues must be empty");
    assert_eq!(report.book_id, "dry-run-valid-book");
    assert_eq!(report.node_count, 2);
    assert_eq!(report.branch_count, 1);
    assert_eq!(report.leaf_count, 1);
    assert_eq!(report.question_count, 1);
}

#[test]
fn test_import_dry_run_invalid_table() {
    use educraft_lib::book_manager::import_book_dry_run;

    let invalid_table_json = r#"{
        "id": "dry-run-invalid-table",
        "ar": { "title": "كتاب جدول خاطئ", "tagline": "وصف" },
        "en": { "title": "Invalid Table Book", "tagline": "Tagline" },
        "nodes": [
            { "id": "b1", "level": "branch", "ar": "فرع", "en": "Branch" },
            {
                "id": "l1",
                "level": "leaf",
                "parent": "b1",
                "ar": "ورقة",
                "en": "Leaf",
                "pageBlocks": [
                    {
                        "id": "t_err",
                        "kind": "table",
                        "headers": ["Col 1", "Col 2", "Col 3"],
                        "rows": [
                            ["Val 1", "Val 2"]
                        ]
                    }
                ]
            }
        ]
    }"#;

    let report = import_book_dry_run(invalid_table_json).expect("Dry run executes");
    assert!(!report.is_valid, "Book with bad table must be marked invalid");
    assert!(!report.issues.is_empty(), "Issues must contain error");
    let issue = report.issues.iter().find(|i| i.message.contains("does not match headers length"));
    assert!(issue.is_some(), "Expected table length mismatch error, found: {:?}", report.issues);
}

#[test]
fn test_import_dry_run_question_out_of_range() {
    use educraft_lib::book_manager::import_book_dry_run;

    let out_of_range_json = r#"{
        "id": "dry-run-bad-question",
        "ar": { "title": "كتاب سؤال خاطئ", "tagline": "وصف" },
        "en": { "title": "Bad Question Book", "tagline": "Tagline" },
        "nodes": [
            { "id": "b1", "level": "branch", "ar": "فرع", "en": "Branch" },
            {
                "id": "l1",
                "level": "leaf",
                "parent": "b1",
                "ar": "ورقة",
                "en": "Leaf",
                "questions": [
                    {
                        "id": "q_bad",
                        "type": "single",
                        "en": {
                            "prompt": "Pick one",
                            "options": ["First", "Second"],
                            "correct": 99
                        }
                    }
                ]
            }
        ]
    }"#;

    let report = import_book_dry_run(out_of_range_json).expect("Dry run executes");
    assert!(!report.is_valid, "Book with out of range question must be invalid");
    let issue = report.issues.iter().find(|i| i.message.contains("Single choice correct index (99) is out of range"));
    assert!(issue.is_some(), "Expected out of range error, found: {:?}", report.issues);
}

#[test]
fn test_import_dry_run_auto_fill_missing_presentation_fields() {
    use educraft_lib::book_manager::import_book_dry_run;

    let book_with_missing_fields = r#"{
        "id": "dry-run-autofill-book",
        "ar": { "title": "كتاب التعويض التلقائي", "tagline": "وصف" },
        "en": { "title": "AutoFill Test Book", "tagline": "Tagline" },
        "nodes": [
            { "id": "b1", "level": "branch", "ar": "فرع", "en": "Branch" },
            {
                "id": "l1",
                "level": "leaf",
                "parent": "b1",
                "ar": "ورقة",
                "en": "Leaf",
                "pageBlocks": [
                    { "id": "img1", "kind": "image", "title": "صورة بدون رابط" },
                    { "id": "tbl1", "kind": "table", "title": "جدول بدون صفوف", "headers": ["الاسم", "الوظيفة"], "rows": [] },
                    { "id": "code1", "kind": "code", "title": "كود بدون لغة", "text": "let x = 42;" }
                ],
                "questions": [
                    {
                        "id": "q1",
                        "type": "single",
                        "en": { "prompt": "Valid question?", "options": ["Yes", "No"], "correct": 0 },
                        "ar": { "prompt": "سؤال سليم؟", "options": ["نعم", "لا"], "correct": 0 }
                    }
                ]
            }
        ]
    }"#;

    let report = import_book_dry_run(book_with_missing_fields).expect("Dry run executes");

    // 1. Must succeed (valid == true) because presentation fields were auto-filled safely
    assert!(report.is_valid, "Book with auto-fillable fields must be marked valid! Issues: {:?}", report.issues);

    // 2. Check AutoFillEntries
    assert!(!report.auto_fills.is_empty(), "AutoFillEntries must not be empty");

    // a) Image auto-fill
    let img_fill = report.auto_fills.iter().find(|f| f.target_id == "img1" && f.field == "imageUrl");
    assert!(img_fill.is_some(), "Expected image placeholder auto-fill");
    assert!(img_fill.unwrap().action_taken.contains("isPlaceholder: true"));

    // b) Table rows auto-fill
    let tbl_fill = report.auto_fills.iter().find(|f| f.target_id == "tbl1" && f.field == "rows");
    assert!(tbl_fill.is_some(), "Expected table rows auto-fill");
    assert!(tbl_fill.unwrap().action_taken.contains("matching headers length"));

    // c) CodeLang auto-fill
    let code_fill = report.auto_fills.iter().find(|f| f.target_id == "code1" && f.field == "codeLang");
    assert!(code_fill.is_some(), "Expected codeLang auto-fill");
    assert!(code_fill.unwrap().action_taken.contains("plaintext"));

    // d) Coordinates auto-layout
    let coord_fill = report.auto_fills.iter().find(|f| f.field == "coordinates");
    assert!(coord_fill.is_some(), "Expected node coordinates auto-layout");

    // 3. Check issues: CodeLang generates a Warning, but NO errors exist
    assert!(!report.issues.iter().any(|i| i.severity == educraft_lib::book_manager::IssueSeverity::Error));
    assert!(report.issues.iter().any(|i| i.severity == educraft_lib::book_manager::IssueSeverity::Warning));

    // 4. Verify auto_filled_json parses back with filled rows and isPlaceholder
    let filled_str = report.auto_filled_json.expect("auto_filled_json must be present");
    let parsed: serde_json::Value = serde_json::from_str(&filled_str).unwrap();
    let leaf_blocks = &parsed["nodes"][1]["pageBlocks"];
    assert_eq!(leaf_blocks[0]["isPlaceholder"], true);
    assert_eq!(leaf_blocks[1]["rows"][0], serde_json::json!(["—", "—"]));
    assert_eq!(leaf_blocks[2]["codeLang"], "plaintext");
}

#[test]
fn test_import_streaming_events_and_timing() {
    use educraft_lib::book_manager::{import_book_with_sink, ImportEventSink};
    use std::sync::{Arc, Mutex};
    use std::time::Instant;

    struct RecordingSink {
        events: Arc<Mutex<Vec<(String, serde_json::Value, Instant)>>>,
    }

    impl ImportEventSink for RecordingSink {
        fn emit(&self, event: &str, payload: serde_json::Value) {
            self.events.lock().unwrap().push((
                event.to_string(),
                payload,
                Instant::now(),
            ));
        }
    }

    let events_vec = Arc::new(Mutex::new(Vec::new()));
    let start_time = Instant::now();
    let sink = RecordingSink {
        events: events_vec.clone(),
    };

    let book_json = r#"{
        "id": "streaming-test-book",
        "ar": { "title": "كتاب الأحداث", "tagline": "وصف" },
        "en": { "title": "Streaming Book", "tagline": "Tagline" },
        "nodes": [
            { "id": "b1", "level": "branch", "ar": "فرع 1", "en": "Branch 1" },
            { "id": "l1", "level": "leaf", "parent": "b1", "ar": "ورقة 1", "en": "Leaf 1", "pageBlocks": [{ "id": "t1", "kind": "text", "text": "نص" }] },
            { "id": "l2", "level": "leaf", "parent": "b1", "ar": "ورقة 2", "en": "Leaf 2", "pageBlocks": [{ "id": "t2", "kind": "text", "text": "نص" }] }
        ]
    }"#;

    let report = import_book_with_sink(book_json, &sink).expect("Import with sink executes");
    assert!(report.is_valid);

    let recorded = events_vec.lock().unwrap();
    let event_names: Vec<&str> = recorded.iter().map(|(e, _, _)| e.as_str()).collect();

    // Verify event sequence
    assert_eq!(event_names[0], "import:started");
    assert_eq!(event_names[1], "import:tree-ready");
    assert!(event_names.contains(&"import:leaf-ready"));
    assert_eq!(*event_names.last().unwrap(), "import:completed");

    // Measure time from start to first leaf-ready
    let first_leaf_event = recorded.iter().find(|(e, _, _)| e == "import:leaf-ready");
    assert!(first_leaf_event.is_some());
    let elapsed_to_first_leaf = first_leaf_event.unwrap().2.duration_since(start_time);
    println!("Time from start to first leaf-ready: {:?}", elapsed_to_first_leaf);
}

#[test]
fn test_import_transactional_save_and_rollback() {
    use educraft_lib::book_manager::save_imported_book_transactional;

    let test_books_dir = PathBuf::from("/tmp/educraft_test_transactional");
    let _ = fs::remove_dir_all(&test_books_dir);
    fs::create_dir_all(&test_books_dir).unwrap();

    let valid_book = r#"{
        "id": "tx-book-1",
        "ar": { "title": "كتاب معاملاتي", "tagline": "وصف" },
        "en": { "title": "Transactional Book", "tagline": "Tagline" },
        "nodes": [
            { "id": "b1", "level": "branch", "ar": "فرع", "en": "Branch" },
            { "id": "l1", "level": "leaf", "parent": "b1", "ar": "ورقة", "en": "Leaf" }
        ]
    }"#;

    // 1. Successful transactional save
    let path = save_imported_book_transactional(&test_books_dir, "tx-book-1", valid_book)
        .expect("Transactional save should succeed");

    assert!(path.join("book.json").exists(), "book.json must exist in target folder");

    // 2. Failed save due to invalid JSON/schema -> Must rollback and leave zero garbage
    let invalid_book = r#"{
        "id": "tx-book-fail",
        "nodes": []
    }"#;

    let res = save_imported_book_transactional(&test_books_dir, "tx-book-fail", invalid_book);
    assert!(res.is_err(), "Invalid book must fail transactional save");

    // Ensure no partial directory or staging folder left behind
    assert!(!test_books_dir.join("tx-book-fail").exists());
    let entries: Vec<_> = fs::read_dir(&test_books_dir)
        .unwrap()
        .filter_map(|e| e.ok())
        .collect();

    // Only tx-book-1 exists, zero staging or temp files
    assert_eq!(entries.len(), 1);
    assert_eq!(entries[0].file_name().to_string_lossy(), "tx-book-1");

    let _ = fs::remove_dir_all(&test_books_dir);
}

#[test]
fn test_import_benchmark_rayon_large_book() {
    use educraft_lib::book_manager::{import_book_with_sink, NoopEventSink};
    use std::time::Instant;

    // Generate synthetic large book with 200 leaves and 1,000 questions (5 questions per leaf)
    let mut nodes = Vec::new();
    nodes.push(serde_json::json!({
        "id": "main-branch",
        "level": "branch",
        "ar": "الفرع الرئيسي",
        "en": "Main Branch"
    }));

    for i in 0..200 {
        let mut questions = Vec::new();
        for q in 0..5 {
            questions.push(serde_json::json!({
                "id": format!("q-{}-{}", i, q),
                "type": "single",
                "en": {
                    "prompt": format!("Question {} on Leaf {}", q, i),
                    "options": ["Option A", "Option B", "Option C"],
                    "correct": 1
                },
                "ar": {
                    "prompt": format!("السؤال {} في الورقة {}", q, i),
                    "options": ["الخيار أ", "الخيار ب", "الخيار ج"],
                    "correct": 1
                }
            }));
        }

        nodes.push(serde_json::json!({
            "id": format!("leaf-{}", i),
            "level": "leaf",
            "parent": "main-branch",
            "ar": format!("ورقة {}", i),
            "en": format!("Leaf {}", i),
            "pageBlocks": [
                { "id": format!("txt-{}", i), "kind": "text", "text": "محتوى تعليمي تفصيلي" },
                { "id": format!("tbl-{}", i), "kind": "table", "headers": ["Col1", "Col2"], "rows": [["1", "2"]] }
            ],
            "questions": questions
        }));
    }

    let large_book_val = serde_json::json!({
        "id": "synthetic-large-book-200l-1000q",
        "ar": { "title": "كتاب تجريبي ضخم (200 ورقة و 1000 سؤال)", "tagline": "اختبار السرعة" },
        "en": { "title": "Synthetic Large Book (200 leaves, 1000 questions)", "tagline": "Benchmark" },
        "nodes": nodes
    });

    let large_book_json = serde_json::to_string(&large_book_val).unwrap();

    // 1. Run Parallel Rayon Import
    let start_rayon = Instant::now();
    let report = import_book_with_sink(&large_book_json, &NoopEventSink).expect("Import large book");
    let rayon_duration = start_rayon.elapsed();

    assert!(report.is_valid);
    assert_eq!(report.leaf_count, 200);
    assert_eq!(report.question_count, 1000);

    println!("\n=======================================================");
    println!(" BENCHMARK RESULTS (200 leaves, 1,000 questions):");
    println!(" Rayon Parallel Import Duration: {:?}", rayon_duration);
    println!(" Total Nodes: {}, Questions: {}", report.node_count, report.question_count);
    println!("=======================================================\n");
}




