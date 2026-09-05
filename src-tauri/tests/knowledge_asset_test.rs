//! EDUcraft Knowledge Asset Model Test Suite
//! Verifies zero-asset validity, multimodal types, SHA-256 deduplication,
//! reference auditing, and metadata validation.

use educraft_lib::book_manager::assets::{
    collect_book_asset_references, compute_sha256, load_manifest, save_manifest,
};
use educraft_lib::contracts::{
    AssetRole, AssetType, KnowledgeAsset, KnowledgeAssetManifest, LocalizedText,
};
use educraft_lib::export_engine::types::{BookLocale, BookNode, ExportBook};
use std::collections::HashMap;

fn dummy_sha256(byte: u8) -> String {
    format!("{:02x}", byte).repeat(32)
}

#[test]
fn test_zero_assets_manifest_is_completely_valid() {
    let manifest = KnowledgeAssetManifest::new("zero-assets-book");
    assert_eq!(manifest.assets.len(), 0);
    assert!(manifest.validate().is_ok());

    let unused = manifest.find_unused_assets(&[]);
    assert!(unused.is_empty());

    let missing = manifest.find_missing_references(&[]);
    assert!(missing.is_empty());

    // Disk persistence test in tempdir
    let temp_dir = std::env::temp_dir().join(format!("educraft_test_zero_assets_{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&temp_dir);
    std::fs::create_dir_all(&temp_dir).unwrap();

    // 1. Loading non-existent manifest returns None without error
    let initial_load = load_manifest(&temp_dir).expect("Load must not error on missing manifest");
    assert!(initial_load.is_none());

    // 2. Saving and loading zero-asset manifest
    save_manifest(&temp_dir, &manifest).expect("Zero-asset manifest must save cleanly");
    let loaded = load_manifest(&temp_dir).expect("Must load cleanly").expect("Manifest must exist");
    assert_eq!(loaded.book_id, "zero-assets-book");
    assert_eq!(loaded.assets.len(), 0);

    let _ = std::fs::remove_dir_all(&temp_dir);
}

#[test]
fn test_single_asset_lifecycle() {
    let raw_bytes = b"EDUcraft Smart Image Test Payload 2026";
    let sha = compute_sha256(raw_bytes);
    assert_eq!(sha.len(), 64);

    let mut manifest = KnowledgeAssetManifest::new("single-asset-book");
    let asset = KnowledgeAsset {
        id: "ast_01single001".to_string(),
        asset_type: AssetType::Image,
        role: AssetRole::Figure,
        original_filename: "test_image.png".to_string(),
        storage_path: "assets/images/test_image.png".to_string(),
        mime_type: "image/png".to_string(),
        byte_size: raw_bytes.len() as u64,
        sha256: sha.clone(),
        width: Some(800),
        height: Some(600),
        aspect_ratio: Some(1.333),
        duration_seconds: None,
        is_decorative: false,
        caption: Some(LocalizedText {
            ar: Some("شكل توضيحي".to_string()),
            en: Some("Illustrative Figure".to_string()),
        }),
        alt: None,
        tags: vec!["anatomy".to_string()],
        extra: HashMap::new(),
    };

    manifest.add_asset(asset);
    assert!(manifest.validate().is_ok());

    let found_by_id = manifest.get_asset("ast_01single001");
    assert!(found_by_id.is_some());
    assert_eq!(found_by_id.unwrap().sha256, sha);

    let found_by_hash = manifest.find_by_hash(&sha);
    assert!(found_by_hash.is_some());
    assert_eq!(found_by_hash.unwrap().id, "ast_01single001");
}

#[test]
fn test_many_multimodal_assets() {
    let mut manifest = KnowledgeAssetManifest::new("multimodal-curriculum");

    let types_to_test = vec![
        ("ast_img", AssetType::Image, "image/png", "figure.png"),
        ("ast_diag", AssetType::Diagram, "image/svg+xml", "diag.svg"),
        ("ast_audio", AssetType::Audio, "audio/mp3", "narration.mp3"),
        ("ast_3d", AssetType::Model3D, "model/gltf-binary", "heart.glb"),
        ("ast_table", AssetType::Table, "application/json", "stats.json"),
    ];

    for (idx, (id, atype, mime, fname)) in types_to_test.into_iter().enumerate() {
        let asset = KnowledgeAsset {
            id: id.to_string(),
            asset_type: atype,
            role: AssetRole::Figure,
            original_filename: fname.to_string(),
            storage_path: format!("assets/{}", fname),
            mime_type: mime.to_string(),
            byte_size: 1024 * (idx as u64 + 1),
            sha256: dummy_sha256(idx as u8 + 10),
            width: None,
            height: None,
            aspect_ratio: None,
            duration_seconds: if mime.starts_with("audio") { Some(45.2) } else { None },
            is_decorative: false,
            caption: None,
            alt: None,
            tags: vec![],
            extra: HashMap::new(),
        };
        manifest.add_asset(asset);
    }

    assert_eq!(manifest.assets.len(), 5);
    assert!(manifest.validate().is_ok());

    let audio_assets = manifest.find_by_type(&AssetType::Audio);
    assert_eq!(audio_assets.len(), 1);
    assert_eq!(audio_assets[0].id, "ast_audio");
    assert_eq!(audio_assets[0].duration_seconds, Some(45.2));

    let model_assets = manifest.find_by_type(&AssetType::Model3D);
    assert_eq!(model_assets.len(), 1);
    assert_eq!(model_assets[0].id, "ast_3d");
}

#[test]
fn test_duplicate_assets_sha256_deduplication() {
    let mut manifest = KnowledgeAssetManifest::new("dedup-book");
    let shared_sha = dummy_sha256(99);

    let canonical_asset = KnowledgeAsset {
        id: "ast_canonical_01".to_string(),
        asset_type: AssetType::Image,
        role: AssetRole::Hero,
        original_filename: "cover_original.png".to_string(),
        storage_path: "assets/images/cover_original.png".to_string(),
        mime_type: "image/png".to_string(),
        byte_size: 20480,
        sha256: shared_sha.clone(),
        width: Some(1200),
        height: Some(630),
        aspect_ratio: Some(1.9),
        duration_seconds: None,
        is_decorative: false,
        caption: None,
        alt: None,
        tags: vec![],
        extra: HashMap::new(),
    };

    let first_id = manifest.add_or_deduplicate(canonical_asset);
    assert_eq!(first_id, "ast_canonical_01");
    assert_eq!(manifest.assets.len(), 1);

    // Attempt to register a second asset with the exact same sha256
    let duplicate_asset = KnowledgeAsset {
        id: "ast_duplicate_temp_id".to_string(),
        asset_type: AssetType::Image,
        role: AssetRole::Figure,
        original_filename: "cover_copy.png".to_string(),
        storage_path: "assets/images/cover_copy.png".to_string(),
        mime_type: "image/png".to_string(),
        byte_size: 20480,
        sha256: shared_sha,
        width: Some(1200),
        height: Some(630),
        aspect_ratio: Some(1.9),
        duration_seconds: None,
        is_decorative: false,
        caption: None,
        alt: None,
        tags: vec![],
        extra: HashMap::new(),
    };

    let resolved_id = manifest.add_or_deduplicate(duplicate_asset);
    // Must return the canonical asset id and NOT create a duplicate entry
    assert_eq!(resolved_id, "ast_canonical_01");
    assert_eq!(manifest.assets.len(), 1);
}

#[test]
fn test_unused_assets_and_missing_references_detection() {
    let mut manifest = KnowledgeAssetManifest::new("audit-book");

    for id in &["ast_used_1", "ast_used_2", "ast_unused_orphaned"] {
        manifest.add_asset(KnowledgeAsset {
            id: id.to_string(),
            asset_type: AssetType::Image,
            role: AssetRole::Card,
            original_filename: format!("{}.png", id),
            storage_path: format!("assets/images/{}.png", id),
            mime_type: "image/png".to_string(),
            byte_size: 5000,
            sha256: dummy_sha256(id.as_bytes()[id.len() - 1]),
            width: None,
            height: None,
            aspect_ratio: None,
            duration_seconds: None,
            is_decorative: false,
            caption: None,
            alt: None,
            tags: vec![],
            extra: HashMap::new(),
        });
    }

    // Book references ast_used_1, ast_used_2, and a ghost reference ast_ghost_404
    let referenced = ["ast_used_1", "ast_used_2", "ast_ghost_404"];

    let unused = manifest.find_unused_assets(&referenced);
    assert_eq!(unused.len(), 1);
    assert_eq!(unused[0].id, "ast_unused_orphaned");

    let missing = manifest.find_missing_references(&referenced);
    assert_eq!(missing, vec!["ast_ghost_404".to_string()]);
}

#[test]
fn test_invalid_metadata_rejection() {
    let mut manifest = KnowledgeAssetManifest::new("invalid-meta-book");

    // 1. Zero byte size
    let bad_bytes_asset = KnowledgeAsset {
        id: "ast_bad_bytes".to_string(),
        asset_type: AssetType::Image,
        role: AssetRole::Figure,
        original_filename: "zero.png".to_string(),
        storage_path: "assets/zero.png".to_string(),
        mime_type: "image/png".to_string(),
        byte_size: 0,
        sha256: dummy_sha256(1),
        width: None,
        height: None,
        aspect_ratio: None,
        duration_seconds: None,
        is_decorative: false,
        caption: None,
        alt: None,
        tags: vec![],
        extra: HashMap::new(),
    };
    manifest.add_asset(bad_bytes_asset);
    assert!(manifest.validate().is_err());

    // 2. Invalid SHA-256 (wrong length or characters)
    let mut manifest2 = KnowledgeAssetManifest::new("invalid-sha-book");
    let bad_sha_asset = KnowledgeAsset {
        id: "ast_bad_sha".to_string(),
        asset_type: AssetType::Image,
        role: AssetRole::Figure,
        original_filename: "bad.png".to_string(),
        storage_path: "assets/bad.png".to_string(),
        mime_type: "image/png".to_string(),
        byte_size: 100,
        sha256: "not-a-valid-sha256".to_string(),
        width: None,
        height: None,
        aspect_ratio: None,
        duration_seconds: None,
        is_decorative: false,
        caption: None,
        alt: None,
        tags: vec![],
        extra: HashMap::new(),
    };
    manifest2.add_asset(bad_sha_asset);
    assert!(manifest2.validate().is_err());
}

#[test]
fn test_collect_book_asset_references_real_structure() {
    let book = ExportBook {
        id: "sample_book".to_string(),
        ar: BookLocale { title: "كتاب".to_string(), tagline: None, extra: HashMap::new() },
        en: BookLocale { title: "Book".to_string(), tagline: None, extra: HashMap::new() },
        nodes: vec![
            BookNode {
                id: "leaf_1".to_string(),
                level: "leaf".to_string(),
                parent: None,
                ar: None,
                en: None,
                extra: {
                    let mut m = HashMap::new();
                    // 1. pageBlock with asset_id
                    m.insert("pageBlocks".to_string(), serde_json::json!([
                        {
                            "id": "blk_img_1",
                            "kind": "image",
                            "asset_id": "ast_leaf_figure"
                        }
                    ]));
                    // 2. question with asset_ids and content block asset_id
                    m.insert("questions".to_string(), serde_json::json!([
                        {
                            "id": "q1",
                            "type": "single",
                            "asset_ids": ["ast_question_badge"],
                            "content": [
                                {
                                    "kind": "image",
                                    "asset_id": "ast_question_formula"
                                }
                            ]
                        }
                    ]));
                    m
                },
            },
        ],
        cross_links: vec![],
        extra: HashMap::new(),
        ..ExportBook::default()
    };

    let refs = collect_book_asset_references(&book);
    assert_eq!(
        refs,
        vec![
            "ast_leaf_figure".to_string(),
            "ast_question_badge".to_string(),
            "ast_question_formula".to_string()
        ]
    );
}
