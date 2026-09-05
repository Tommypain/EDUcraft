use educraft_lib::contracts::CURRENT_SCHEMA_VERSION;
use educraft_lib::migration::*;
use serde_json::json;

#[test]
fn test_legacy_book_forward_migration() {
    let legacy_json = json!({
        "id": "book_legacy_01",
        "ar": { "title": "كتاب قديم" },
        "en": { "title": "Legacy Book" },
        "nodes": [
            {
                "id": "node_intro",
                "level": "leaf",
                "pageBlocks": [
                    {
                        "kind": "text",
                        "text": "Hello legacy world without block ID"
                    }
                ],
                "questions": [
                    {
                        "type": "multiple_choice",
                        "text": "Choose A"
                    }
                ],
                "custom_untracked_field": 12345
            }
        ]
    });

    let (book, report) = MigrationEngine::migrate_to_current(legacy_json)
        .expect("Migration should succeed");

    // Version updated to 1.1
    assert_eq!(book.schema_version, CURRENT_SCHEMA_VERSION);
    assert_eq!(report.from_version, "1.0");
    assert_eq!(report.to_version, CURRENT_SCHEMA_VERSION);

    // Capabilities injected
    assert!(book.capabilities.contains(&"images".to_string()));
    assert!(book.capabilities.contains(&"quizzes".to_string()));

    // Deterministic block & question IDs generated
    let leaf = &book.nodes[0];
    let blocks = leaf.extra.get("pageBlocks").unwrap().as_array().unwrap();
    assert_eq!(blocks[0].get("id").unwrap().as_str().unwrap(), "node_intro_b1");

    let questions = leaf.extra.get("questions").unwrap().as_array().unwrap();
    assert_eq!(questions[0].get("id").unwrap().as_str().unwrap(), "node_intro_q1");

    // Custom field preserved losslessly in extra
    assert_eq!(leaf.extra.get("custom_untracked_field").unwrap(), &json!(12345));
}

#[test]
fn test_downsample_for_v1_0() {
    let modern_json = json!({
        "schema_version": "1.1",
        "id": "book_modern_01",
        "ar": { "title": "كتاب حديث" },
        "en": { "title": "Modern Book" },
        "capabilities": ["images", "quizzes"],
        "nodes": []
    });

    let (book, _) = MigrationEngine::migrate_to_current(modern_json).unwrap();
    let downsampled = MigrationEngine::downsample_for_v1_0(&book)
        .expect("Downsampling should succeed");

    assert_eq!(downsampled.get("schema_version").unwrap().as_str().unwrap(), "1.0");
}
