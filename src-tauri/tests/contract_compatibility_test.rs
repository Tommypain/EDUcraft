//! EDUcraft Contract Compatibility Test Suite
//! Verifies that legacy v1.0 JSON loads with zero errors, v1.1 features round-trip,
//! and asset/plugin contracts validate strictly.

use educraft_lib::contracts::{
    detect_schema_version, needs_migration, AssetRole, KnowledgeAsset,
    KnowledgeAssetManifest, LocalizedText, PluginManifest, LEGACY_SCHEMA_VERSION,
};
use educraft_lib::export_engine::types::ExportBook;
use std::collections::HashMap;

#[test]
fn test_legacy_v1_json_deserialization_with_zero_errors() {
    let legacy_json = r##"{
        "id": "legacy-book-sample",
        "cover": { "from": "#0f172a", "to": "#334155", "icon": "Book" },
        "flavorId": "science",
        "ar": { "title": "كتاب قديم", "tagline": "وصف قديم" },
        "en": { "title": "Legacy Book", "tagline": "Old Description" },
        "nodes": [
            {
                "id": "branch_1",
                "level": "branch",
                "en": "Branch One",
                "ar": "الفرع الأول"
            },
            {
                "id": "leaf_1",
                "level": "leaf",
                "parent": "branch_1",
                "en": "Leaf One",
                "ar": "الورقة الأولى",
                "questions": []
            }
        ],
        "cross_links": []
    }"##;

    // Detect schema version from raw JSON
    let parsed_raw: serde_json::Value = serde_json::from_str(legacy_json).unwrap();
    let detected_ver = detect_schema_version(&parsed_raw);
    assert_eq!(detected_ver, LEGACY_SCHEMA_VERSION);
    assert!(!needs_migration(&detected_ver));

    // Deserialization into ExportBook
    let book: ExportBook = serde_json::from_str(legacy_json).expect("Legacy book must deserialize seamlessly");

    assert_eq!(book.schema_version, "1.0");
    assert_eq!(book.id, "legacy-book-sample");
    assert_eq!(book.ar.title, "كتاب قديم");
    assert_eq!(book.en.title, "Legacy Book");
    assert_eq!(book.nodes.len(), 2);
    assert!(book.capabilities.is_empty());
    assert!(book.assets.is_none());
    assert!(book.metadata.is_none());

    // Verify extra fields preserved (cover, flavorId)
    assert!(book.extra.contains_key("cover"));
    assert!(book.extra.contains_key("flavorId"));
}

#[test]
fn test_modern_v1_1_json_roundtrip() {
    let modern_json = r##"{
        "schema_version": "1.1",
        "id": "modern-book-sample",
        "capabilities": ["katex", "prism", "smart-images"],
        "assets": {
            "manifest_path": "assets/manifest.json",
            "total_count": 12
        },
        "metadata": {
            "author": "EDUcraft Architecture Team",
            "version": "1.1.0",
            "tags": ["biology", "curriculum"]
        },
        "ar": { "title": "كتاب حديث" },
        "en": { "title": "Modern Book" },
        "nodes": [
            {
                "id": "branch_1",
                "level": "branch",
                "en": "Root Branch"
            }
        ]
    }"##;

    let book: ExportBook = serde_json::from_str(modern_json).expect("Modern book must deserialize");
    assert_eq!(book.schema_version, "1.1");
    assert_eq!(book.capabilities, vec!["katex", "prism", "smart-images"]);

    let assets_meta = book.assets.as_ref().expect("Assets meta must be present");
    assert_eq!(assets_meta.manifest_path.as_deref(), Some("assets/manifest.json"));
    assert_eq!(assets_meta.total_count, Some(12));

    let meta = book.metadata.as_ref().expect("Metadata must be present");
    assert_eq!(meta.author.as_deref(), Some("EDUcraft Architecture Team"));
    assert_eq!(meta.tags, vec!["biology", "curriculum"]);

    // Serialization round-trip
    let serialized = serde_json::to_string(&book).expect("Serialization must succeed");
    let book_roundtrip: ExportBook = serde_json::from_str(&serialized).expect("Round-trip deserialization must succeed");
    assert_eq!(book_roundtrip.schema_version, "1.1");
    assert_eq!(book_roundtrip.capabilities, book.capabilities);
    assert_eq!(book_roundtrip.id, book.id);
}

#[test]
fn test_knowledge_asset_manifest_validation() {
    let mut manifest = KnowledgeAssetManifest::new("biology-101");
    manifest.generated_at = Some("2026-09-05T18:00:00Z".to_string());

    let asset = KnowledgeAsset {
        id: "ast_01h8xcell001".to_string(),
        asset_type: educraft_lib::contracts::AssetType::Image,
        role: AssetRole::Figure,
        original_filename: "cell_membrane.png".to_string(),
        storage_path: "assets/images/cell_membrane.png".to_string(),
        mime_type: "image/png".to_string(),
        byte_size: 45120,
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855".to_string(),
        width: Some(1920),
        height: Some(1080),
        aspect_ratio: Some(1.777),
        duration_seconds: None,
        is_decorative: false,
        caption: Some(LocalizedText {
            ar: Some("غشاء الخلية البلازمي".to_string()),
            en: Some("Cell Plasma Membrane".to_string()),
        }),
        alt: None,
        tags: vec!["biology".to_string(), "cell".to_string()],
        extra: HashMap::new(),
    };

    manifest.add_asset(asset);
    assert!(manifest.validate().is_ok());

    let retrieved = manifest.get_asset("ast_01h8xcell001").expect("Asset must be found");
    assert_eq!(retrieved.role, AssetRole::Figure);
    assert_eq!(retrieved.byte_size, 45120);

    // Mismatched ID test
    let mut bad_manifest = manifest.clone();
    bad_manifest.assets.get_mut("ast_01h8xcell001").unwrap().id = "mismatched_id".to_string();
    assert!(bad_manifest.validate().is_err());
}

#[test]
fn test_plugin_manifest_contract() {
    let json_str = r##"{
        "id": "org.educraft.plugin.latex-studio",
        "name": "LaTeX Studio Extension",
        "version": "1.0.0",
        "author": "EDUcraft",
        "entry_point": "dist/main.js",
        "capabilities": ["views:register"]
    }"##;

    let plugin: PluginManifest = serde_json::from_str(json_str).expect("Plugin manifest must parse");
    assert!(plugin.validate().is_ok());
    assert_eq!(plugin.target_engine, ">=0.0.9");
}
