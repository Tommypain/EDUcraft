//! EDUcraft Dynamic Capability-Driven Runtime Test Suite
//! Tests capability negotiation, subsystem guarding, asset resolver bypass when images=false,
//! and custom capability extension.

use educraft_lib::asset_resolver::{AssetIndex, AssetResolutionQuery};
use educraft_lib::contracts::{
    AssetRole, AssetType, KnowledgeAsset, KnowledgeAssetManifest, LocalizedText,
};
use educraft_lib::export_engine::types::{BookLocale, ExportBook};
use educraft_lib::runtime::{RuntimeCapabilities, RuntimeContext};
use std::collections::HashMap;

fn create_sample_manifest() -> KnowledgeAssetManifest {
    let mut manifest = KnowledgeAssetManifest::new("runtime_test_book");
    manifest.add_asset(KnowledgeAsset {
        id: "ast_anatomy_sample".to_string(),
        asset_type: AssetType::Diagram,
        role: AssetRole::Figure,
        original_filename: "anatomy.png".to_string(),
        storage_path: "assets/images/anatomy.png".to_string(),
        mime_type: "image/png".to_string(),
        byte_size: 10000,
        sha256: "1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff".to_string(),
        width: Some(400),
        height: Some(300),
        aspect_ratio: Some(1.33),
        duration_seconds: None,
        is_decorative: false,
        caption: Some(LocalizedText {
            en: Some("Heart anatomy diagram".to_string()),
            ar: None,
        }),
        alt: None,
        tags: vec!["heart".to_string()],
        ..KnowledgeAsset::default()
    });
    manifest
}

#[test]
fn test_default_capabilities_for_legacy_book() {
    // Empty declared capabilities simulates a legacy book without capabilities field
    let caps = RuntimeCapabilities::negotiate(&[]);

    assert!(caps.can("images"));
    assert!(caps.can("questions"));
    assert!(caps.can("mindmap"));
    assert!(caps.can("canvas_a4"));
    assert!(caps.can("katex"));
    assert!(caps.can("code_highlight"));
    assert!(caps.can("editor"));
    assert!(!caps.can("audio"), "Audio is off by default");
    assert!(!caps.can("video"), "Video is off by default");
}

#[test]
fn test_negotiate_explicit_capabilities() {
    let declared = vec![
        "questions".to_string(),
        "katex".to_string(),
        "plugin.canvas3d".to_string(),
    ];
    let caps = RuntimeCapabilities::negotiate(&declared);

    assert!(caps.can("questions"));
    assert!(caps.can("katex"));
    assert!(caps.can("plugin.canvas3d"));

    // Subsystems not in declared capabilities MUST be disabled
    assert!(!caps.can("images"));
    assert!(!caps.can("mindmap"));
    assert!(!caps.can("audio"));
    assert!(!caps.can("video"));
}

#[test]
fn test_subsystem_guarding_images_disabled() {
    let manifest = create_sample_manifest();
    let index = AssetIndex::build(&manifest);

    // Create book with capabilities that explicitly omit "images"
    let book = ExportBook {
        id: "text_only_math_book".to_string(),
        ar: BookLocale { title: "كتاب رياضيات".to_string(), tagline: None, extra: HashMap::new() },
        en: BookLocale { title: "Math Book".to_string(), tagline: None, extra: HashMap::new() },
        nodes: vec![],
        cross_links: vec![],
        capabilities: vec!["questions".to_string(), "katex".to_string()],
        ..ExportBook::default()
    };

    let runtime = RuntimeContext::from_book(&book);
    assert!(!runtime.can("images"));

    let query = AssetResolutionQuery {
        topic: Some("heart".to_string()),
        asset_type: Some(AssetType::Diagram),
        role: None,
        concept: None,
        context: None,
        min_score: None,
    };

    // 1. Guarded asset resolution must be cleanly bypassed
    let result = runtime.resolve_asset(&manifest, &index, &query);
    assert!(!result.resolved);
    assert_eq!(result.asset_id, None);
    assert!(
        result.reason.unwrap().contains("capability 'images' is disabled"),
        "Must cite disabled capability reason"
    );

    // 2. Guarded asset storage must be rejected
    assert!(runtime.check_asset_storage_allowed().is_err());
}

#[test]
fn test_subsystem_guarding_images_enabled() {
    let manifest = create_sample_manifest();
    let index = AssetIndex::build(&manifest);

    let book = ExportBook {
        id: "visual_biology_book".to_string(),
        ar: BookLocale { title: "كتاب أحياء".to_string(), tagline: None, extra: HashMap::new() },
        en: BookLocale { title: "Biology Book".to_string(), tagline: None, extra: HashMap::new() },
        nodes: vec![],
        cross_links: vec![],
        capabilities: vec!["images".to_string(), "questions".to_string()],
        ..ExportBook::default()
    };

    let runtime = RuntimeContext::from_book(&book);
    assert!(runtime.can("images"));

    let query = AssetResolutionQuery {
        topic: Some("heart".to_string()),
        asset_type: Some(AssetType::Diagram),
        role: None,
        concept: None,
        context: None,
        min_score: Some(0.20),
    };

    // 1. Guarded asset resolution executes and resolves
    let result = runtime.resolve_asset(&manifest, &index, &query);
    assert!(result.resolved);
    assert_eq!(result.asset_id.as_deref(), Some("ast_anatomy_sample"));

    // 2. Guarded asset storage is allowed
    assert!(runtime.check_asset_storage_allowed().is_ok());
}

#[test]
fn test_custom_plugin_capability_extension() {
    let caps = RuntimeCapabilities::default().with_capability("plugin.custom_ar_vr");

    assert!(caps.can("images"));
    assert!(caps.can("plugin.custom_ar_vr"));
    assert!(!caps.can("plugin.non_existent"));
}
