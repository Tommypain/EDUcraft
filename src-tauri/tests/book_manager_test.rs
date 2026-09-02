use educraft_lib::book_manager::{delete_book_from_fs, scan_books_directory, BookState};
use std::fs;
use std::path::PathBuf;

#[test]
fn test_scan_books_directory_real() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).parent().unwrap().to_path_buf();
    let books_dir = root.join("BOOKS");

    let result = scan_books_directory(&books_dir).expect("Scan BOOKS directory");
    println!("Scanned books count: {}", result.total_found);
    assert!(result.total_found >= 14, "Expected at least 14 books, found {}", result.total_found);
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
