use educraft_lib::contracts::{
    AssetIntelligence, AssetProvenance, AssetRole, AssetType, ConfidenceLevel, ConfidenceScore,
    KnowledgeAsset, KnowledgeAssetManifest,
};
use educraft_lib::export_engine::types::{BookLocale, BookNode, ExportBook};
use educraft_lib::knowledge_graph::*;
use serde_json::json;
use std::collections::HashMap;

fn create_mock_book() -> ExportBook {
    let mut extra_leaf1 = HashMap::new();
    extra_leaf1.insert(
        "pageBlocks".to_string(),
        json!([
            {
                "id": "block_html_intro",
                "kind": "keyterm",
                "title": "HTML Introduction",
                "concepts": ["html_structure", "dom_tree"],
                "asset_id": "asset_dom_diagram"
            },
            {
                "id": "block_html_tags",
                "kind": "note",
                "title": "Tags and Elements",
                "concepts": ["html_tags"]
            }
        ]),
    );
    extra_leaf1.insert(
        "questions".to_string(),
        json!([
            {
                "id": "q_html_01",
                "type": "multiple_choice",
                "subject": "html_structure",
                "difficulty": "Beginner"
            }
        ]),
    );

    let mut extra_leaf2 = HashMap::new();
    extra_leaf2.insert(
        "pageBlocks".to_string(),
        json!([
            {
                "id": "block_html_advanced",
                "kind": "sectionTitle",
                "title": "Advanced Semantics",
                "concepts": ["semantic_web"]
            }
        ]),
    );
    extra_leaf2.insert(
        "questions".to_string(),
        json!([
            {
                "id": "q_html_02",
                "type": "cloze",
                "subject": "dom_tree",
                "difficulty": "Intermediate"
            }
        ]),
    );

    ExportBook {
        schema_version: "1.1".to_string(),
        id: "book_html".to_string(),
        ar: BookLocale {
            title: "كتاب لغة الويب".to_string(),
            tagline: None,
            extra: HashMap::new(),
        },
        en: BookLocale {
            title: "HTML Master Book".to_string(),
            tagline: None,
            extra: HashMap::new(),
        },
        nodes: vec![
            BookNode {
                id: "branch_01".to_string(),
                level: "branch".to_string(),
                parent: None,
                ar: Some("الفصل الأول".to_string()),
                en: Some("Chapter 1".to_string()),
                extra: HashMap::new(),
            },
            BookNode {
                id: "leaf_01".to_string(),
                level: "leaf".to_string(),
                parent: Some("branch_01".to_string()),
                ar: Some("مقدمة الهيكل".to_string()),
                en: Some("HTML Basics".to_string()),
                extra: extra_leaf1,
            },
            BookNode {
                id: "leaf_02".to_string(),
                level: "leaf".to_string(),
                parent: Some("branch_01".to_string()),
                ar: Some("الهيكل المتقدم".to_string()),
                en: Some("Advanced Structure".to_string()),
                extra: extra_leaf2,
            },
            BookNode {
                id: "leaf_03".to_string(),
                level: "leaf".to_string(),
                parent: Some("branch_01".to_string()),
                ar: Some("تطبيقات عملية".to_string()),
                en: Some("Practical Workshop".to_string()),
                extra: HashMap::new(),
            },
        ],
        // leaf_01 is prerequisite of leaf_02, and leaf_02 is prerequisite of leaf_03
        cross_links: vec![
            json!(["leaf_01", "leaf_02"]),
            json!({"from": "leaf_02", "to": "leaf_03"}),
        ],
        capabilities: vec!["images".to_string(), "quizzes".to_string()],
        assets: None,
        metadata: None,
        extra: HashMap::new(),
    }
}

fn create_mock_manifest() -> KnowledgeAssetManifest {
    let mut manifest = KnowledgeAssetManifest::new("book_html");

    let asset = KnowledgeAsset {
        id: "asset_dom_diagram".to_string(),
        asset_type: AssetType::Diagram,
        role: AssetRole::Figure,
        original_filename: "dom_tree_diagram.png".to_string(),
        storage_path: "assets/dom_tree_diagram.png".to_string(),
        mime_type: "image/png".to_string(),
        byte_size: 15420,
        sha256: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".to_string(),
        intelligence: Some(AssetIntelligence {
            title: None,
            caption: None,
            description: None,
            ocr_text: None,
            topics: vec!["Web Architecture".to_string()],
            concepts: vec!["dom_tree".to_string()],
            pedagogical_role: AssetRole::Figure,
            provenance: AssetProvenance::default(),
            confidence: ConfidenceScore {
                score: 0.95,
                level: ConfidenceLevel::High,
                basis: vec!["test".to_string()],
            },
            perceptual_hash: None,
            extra: HashMap::new(),
        }),
        ..KnowledgeAsset::default()
    };

    manifest.add_asset(asset);
    manifest
}

#[test]
fn test_knowledge_graph_construction() {
    let book = create_mock_book();
    let manifest = create_mock_manifest();

    let graph = build_graph_from_book(&book, Some(&manifest));

    // Verify Book node exists
    assert!(graph.has_node("book_html"));
    let book_node = graph.get_node("book_html").unwrap();
    assert_eq!(book_node.kind, GraphNodeKind::Book);
    assert_eq!(book_node.label, "HTML Master Book");

    // Verify Chapter and Leaves exist
    assert!(graph.has_node("branch_01"));
    assert!(graph.has_node("leaf_01"));
    assert!(graph.has_node("leaf_02"));
    assert!(graph.has_node("leaf_03"));

    // Verify ContentBlock and Question nodes exist
    assert!(graph.has_node("block_html_intro"));
    assert!(graph.has_node("q_html_01"));

    // Verify Asset node exists
    assert!(graph.has_node("asset_dom_diagram"));
    let asset_node = graph.get_node("asset_dom_diagram").unwrap();
    assert_eq!(asset_node.kind, GraphNodeKind::Asset);

    // Verify Concept nodes auto-created
    assert!(graph.has_node("concept_dom_tree"));
    assert!(graph.has_node("concept_html_structure"));

    // Verify Hierarchy: Book -> branch_01 -> leaf_01
    let outgoing_book = graph.get_outgoing_edges("book_html");
    assert!(outgoing_book.iter().any(|e| e.target == "branch_01" && e.kind == EdgeKind::Contains));

    let outgoing_branch = graph.get_outgoing_edges("branch_01");
    assert!(outgoing_branch.iter().any(|e| e.target == "leaf_01" && e.kind == EdgeKind::Contains));
}

#[test]
fn test_prerequisite_traversal() {
    let book = create_mock_book();
    let graph = build_graph_from_book(&book, None);

    // Direct prerequisites
    let direct_p2 = graph.get_direct_prerequisites("leaf_02");
    assert_eq!(direct_p2, vec!["leaf_01".to_string()]);

    let direct_p3 = graph.get_direct_prerequisites("leaf_03");
    assert_eq!(direct_p3, vec!["leaf_02".to_string()]);

    // Transitive prerequisites (leaf_03 requires leaf_02 and leaf_01)
    let all_p3 = graph.get_prerequisites("leaf_03");
    assert_eq!(all_p3.len(), 2);
    assert!(all_p3.contains(&"leaf_02".to_string()));
    assert!(all_p3.contains(&"leaf_01".to_string()));

    // Dependents
    let dep_p1 = graph.get_dependents("leaf_01");
    assert_eq!(dep_p1, vec!["leaf_02".to_string()]);
}

#[test]
fn test_concept_multimodal_tracing() {
    let book = create_mock_book();
    let manifest = create_mock_manifest();
    let graph = build_graph_from_book(&book, Some(&manifest));

    let trace = graph.trace_concept("dom_tree").expect("Concept dom_tree should be found");
    assert_eq!(trace.concept_id, "concept_dom_tree");

    // Must link to the block that covers it
    assert!(trace.content_blocks.contains(&"block_html_intro".to_string()));

    // Must link to the question that tests it (q_html_02)
    assert!(trace.questions.contains(&"q_html_02".to_string()));

    // Must link to the asset that covers it (asset_dom_diagram)
    assert!(trace.assets.contains(&"asset_dom_diagram".to_string()));

    // Must trace back to leaves containing these blocks and questions
    assert!(trace.leaves.contains(&"leaf_01".to_string()));
    assert!(trace.leaves.contains(&"leaf_02".to_string()));
}

#[test]
fn test_study_performance_and_concept_mastery() {
    let book = create_mock_book();
    let manifest = create_mock_manifest();
    let mut graph = build_graph_from_book(&book, Some(&manifest));

    let concept_id = "concept_html_structure";
    assert_eq!(graph.get_concept_mastery(concept_id), 0.0);

    // Record correct attempt on q_html_01 (score 1.0)
    let updated = graph.record_study_attempt("leaf_01", "q_html_01", true, 1.0);
    assert!(updated.contains_key(concept_id));
    assert_eq!(graph.get_concept_mastery(concept_id), 1.0);

    // Record another attempt on same question with partial score 0.5
    graph.record_study_attempt("leaf_01", "q_html_01", false, 0.5);
    // Mastery should average to (1.0 + 0.5) / 2 = 0.75
    assert_eq!(graph.get_concept_mastery(concept_id), 0.75);

    // Verify study record node and edges created
    assert!(graph.node_count() > 10);
    let study_node = graph.get_node("attempt_1_q_html_01").unwrap();
    assert_eq!(study_node.kind, GraphNodeKind::StudyRecord);
}
