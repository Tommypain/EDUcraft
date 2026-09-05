use educraft_lib::asset_engine::extractors::extract_from_html;
use educraft_lib::asset_intelligence::compute_dhash;
use educraft_lib::asset_resolver::{resolve_asset, AssetIndex, AssetResolutionQuery};
use educraft_lib::contracts::{
    AssetIntelligence, AssetProvenance, AssetRole, AssetType, ConfidenceLevel, ConfidenceScore,
    KnowledgeAsset, KnowledgeAssetManifest,
};
use educraft_lib::export_engine::types::{BookLocale, BookNode, ExportBook};
use educraft_lib::knowledge_graph::build_graph_from_book;
use educraft_lib::migration::MigrationEngine;
use educraft_lib::titanium::*;
use serde_json::json;
use std::collections::HashMap;

#[test]
fn test_end_to_end_master_architecture_pipeline() {
    // ------------------------------------------------------------------------
    // Step 1: Asset Extraction from HTML source
    // ------------------------------------------------------------------------
    let html_source = r##"
        <div class="lesson">
            <h1>Architecture Overview</h1>
            <figure>
                <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="150" fill="#2563eb"/>
                </svg>
                <figcaption>System Architecture Blueprint Diagram</figcaption>
            </figure>
        </div>
    "##;

    let extracted_assets = extract_from_html(html_source);
    assert_eq!(extracted_assets.len(), 1);
    let raw_asset = &extracted_assets[0];
    assert_eq!(raw_asset.mime_type, "image/svg+xml");

    // ------------------------------------------------------------------------
    // Step 2: Asset Intelligence & Perceptual Hashing
    // ------------------------------------------------------------------------
    let phash = compute_dhash(&raw_asset.data);
    assert_eq!(phash.len(), 16);

    let asset = KnowledgeAsset {
        id: "asset_system_blueprint".to_string(),
        asset_type: AssetType::Diagram,
        role: AssetRole::Figure,
        original_filename: raw_asset.original_filename.clone(),
        storage_path: "assets/blueprint.svg".to_string(),
        mime_type: raw_asset.mime_type.clone(),
        byte_size: raw_asset.data.len() as u64,
        sha256: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".to_string(),
        intelligence: Some(AssetIntelligence {
            title: None,
            caption: None,
            description: None,
            ocr_text: None,
            topics: vec!["System Architecture".to_string()],
            concepts: vec!["microservices".to_string(), "event_bus".to_string()],
            pedagogical_role: AssetRole::Figure,
            provenance: AssetProvenance::default(),
            confidence: ConfidenceScore {
                score: 0.95,
                level: ConfidenceLevel::High,
                basis: vec!["svg_diagram_caption".to_string()],
            },
            perceptual_hash: Some(phash),
            extra: HashMap::new(),
        }),
        ..KnowledgeAsset::default()
    };

    let mut manifest = KnowledgeAssetManifest::new("book_arch_master");
    let canonical_id = manifest.add_or_deduplicate(asset);
    assert_eq!(canonical_id, "asset_system_blueprint");

    // ------------------------------------------------------------------------
    // Step 3: Semantic Asset Resolver Query
    // ------------------------------------------------------------------------
    let index = AssetIndex::build(&manifest);
    let mut query = AssetResolutionQuery::default();
    query.topic = Some("System Architecture".to_string());
    query.role = Some(AssetRole::Figure);
    query.concept = Some("microservices".to_string());
    let resolved = resolve_asset(&manifest, &index, &query);
    assert!(resolved.resolved);
    assert_eq!(resolved.asset_id.as_deref(), Some("asset_system_blueprint"));
    assert!(resolved.score >= 0.8);

    // ------------------------------------------------------------------------
    // Step 4: Knowledge Graph Ingestion & Concept Tracing
    // ------------------------------------------------------------------------
    let mut leaf_extra = HashMap::new();
    leaf_extra.insert(
        "pageBlocks".to_string(),
        json!([
            {
                "id": "block_overview",
                "kind": "keyterm",
                "title": "Core Blueprint",
                "concepts": ["microservices"],
                "asset_id": "asset_system_blueprint"
            }
        ]),
    );
    leaf_extra.insert(
        "questions".to_string(),
        json!([
            {
                "id": "q_microservices_01",
                "type": "multiple_choice",
                "subject": "microservices",
                "difficulty": "Intermediate"
            }
        ]),
    );

    let book = ExportBook {
        schema_version: "1.1".to_string(),
        id: "book_arch_master".to_string(),
        ar: BookLocale {
            title: "كتاب المعمارية المتقدمة".to_string(),
            tagline: None,
            extra: HashMap::new(),
        },
        en: BookLocale {
            title: "Advanced Software Architecture".to_string(),
            tagline: None,
            extra: HashMap::new(),
        },
        nodes: vec![BookNode {
            id: "leaf_microservices".to_string(),
            level: "leaf".to_string(),
            parent: None,
            ar: Some("الخدمات المصغرة".to_string()),
            en: Some("Microservices Unit".to_string()),
            extra: leaf_extra,
        }],
        cross_links: vec![],
        capabilities: vec!["images".to_string(), "quizzes".to_string()],
        assets: None,
        metadata: None,
        extra: HashMap::new(),
    };

    let mut graph = build_graph_from_book(&book, Some(&manifest));

    // Concept Trace: microservices connects diagram, leaf, block, and question
    let trace = graph
        .trace_concept("microservices")
        .expect("Concept microservices should be found");
    assert!(trace.assets.contains(&"asset_system_blueprint".to_string()));
    assert!(trace.content_blocks.contains(&"block_overview".to_string()));
    assert!(trace.questions.contains(&"q_microservices_01".to_string()));
    assert!(trace.leaves.contains(&"leaf_microservices".to_string()));

    // ------------------------------------------------------------------------
    // Step 5: Study Record & Dynamic Mastery Calculation
    // ------------------------------------------------------------------------
    assert_eq!(graph.get_concept_mastery("concept_microservices"), 0.0);
    graph.record_study_attempt("leaf_microservices", "q_microservices_01", true, 1.0);
    assert_eq!(graph.get_concept_mastery("concept_microservices"), 1.0);

    // ------------------------------------------------------------------------
    // Step 6: Titanium Plugin Registration, Slots, and Fallbacks
    // ------------------------------------------------------------------------
    let mut registry = TitaniumRegistry::new("0.0.9.0");

    let plugin_val = json!({
        "manifest": {
            "id": "com.educraft.arch-tools",
            "name": "Architecture Tools",
            "version": "1.0.0",
            "entry_point": "tools.js",
            "target_engine": ">=0.0.9",
            "permissions": ["register:block"]
        },
        "content_blocks": [
            {
                "kind": "systemDiagramBlock",
                "title": "Interactive Architecture Diagram",
                "default_fields": { "zoom": "1.0" },
                "required_fields": ["model"],
                "render_template": "<div class=\"arch-diag\">Model: {{model}} (Zoom: {{zoom}})</div>"
            }
        ]
    });

    let mut decl_plugin = DeclarativePlugin::from_json_value(&plugin_val).unwrap();
    decl_plugin.sync_manifest_contributions();

    registry
        .install(decl_plugin.manifest.clone(), None)
        .expect("Install should succeed");
    registry
        .activate(&decl_plugin.manifest.id)
        .expect("Activation should succeed");

    let contribs = registry.get_active_contributions();
    assert_eq!(contribs.content_blocks.len(), 1);
    assert_eq!(contribs.content_blocks[0].kind, "systemDiagramBlock");

    // BlockRegistry rendering with custom block
    let mut block_registry = BlockRegistry::new();
    block_registry.register_custom(decl_plugin.content_blocks[0].clone());

    let rendered = block_registry.render_or_fallback(&json!({
        "kind": "systemDiagramBlock",
        "model": "CloudCluster",
        "zoom": "1.5"
    }));
    assert!(!rendered.is_fallback);
    assert_eq!(rendered.html, "<div class=\"arch-diag\">Model: CloudCluster (Zoom: 1.5)</div>");

    // Unsupported block renders clean fallback
    let fallback = block_registry.render_or_fallback(&json!({
        "kind": "uninstalledAiChatWidget",
        "prompt": "Explain DDD"
    }));
    assert!(fallback.is_fallback);
    assert!(fallback.html.contains("Extension Block Placeholder: uninstalledAiChatWidget"));

    // ------------------------------------------------------------------------
    // Step 7: Migration Engine lossless validation
    // ------------------------------------------------------------------------
    let legacy_book_json = json!({
        "id": "legacy_book",
        "ar": { "title": "كتاب قديم" },
        "en": { "title": "Legacy Book" },
        "nodes": []
    });

    let (migrated_book, report) = MigrationEngine::migrate_to_current(legacy_book_json).unwrap();
    assert_eq!(migrated_book.schema_version, "1.1");
    assert_eq!(report.from_version, "1.0");
    assert!(migrated_book.capabilities.contains(&"images".to_string()));
}
