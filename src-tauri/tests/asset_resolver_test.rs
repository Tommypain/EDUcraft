//! EDUcraft Semantic Asset Resolver Test Suite
//! Tests inverted indexing, multifactor relevance scoring, type constraints,
//! zero-fabrication guarantees, and graceful empty manifest handling.

use educraft_lib::asset_resolver::{
    resolve_asset, AssetIndex, AssetResolutionQuery,
};
use educraft_lib::contracts::{
    AssetIntelligence, AssetProvenance, AssetRole, AssetType, ConfidenceLevel,
    ConfidenceScore, KnowledgeAsset, KnowledgeAssetManifest, LocalizedText,
};
use std::collections::HashMap;

fn make_test_asset(
    id: &str,
    atype: AssetType,
    role: AssetRole,
    topics: Vec<&str>,
    concepts: Vec<&str>,
    caption_en: &str,
) -> KnowledgeAsset {
    KnowledgeAsset {
        id: id.to_string(),
        asset_type: atype,
        role: role.clone(),
        original_filename: format!("{}.png", id),
        storage_path: format!("assets/images/{}.png", id),
        mime_type: "image/png".to_string(),
        byte_size: 15000,
        sha256: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".to_string(),
        width: Some(800),
        height: Some(600),
        aspect_ratio: Some(1.33),
        duration_seconds: None,
        is_decorative: false,
        caption: Some(LocalizedText {
            en: Some(caption_en.to_string()),
            ar: None,
        }),
        alt: None,
        tags: vec![],
        intelligence: Some(AssetIntelligence {
            title: None,
            caption: Some(LocalizedText {
                en: Some(caption_en.to_string()),
                ar: None,
            }),
            description: None,
            ocr_text: None,
            topics: topics.into_iter().map(String::from).collect(),
            concepts: concepts.into_iter().map(String::from).collect(),
            pedagogical_role: role,
            provenance: AssetProvenance::default(),
            confidence: ConfidenceScore {
                score: 0.90,
                level: ConfidenceLevel::High,
                basis: vec!["explicit_caption".to_string()],
            },
            perceptual_hash: Some("abcdef0123456789".to_string()),
            extra: HashMap::new(),
        }),
        extra: HashMap::new(),
    }
}

#[test]
fn test_exact_semantic_match_by_topic_and_role() {
    let mut manifest = KnowledgeAssetManifest::new("biology_medical");
    manifest.add_asset(make_test_asset(
        "ast_heart_diagram",
        AssetType::Diagram,
        AssetRole::Figure,
        vec!["cardiology", "heart"],
        vec!["circulation", "ventricle"],
        "Anatomy of the Human Heart and Valves",
    ));
    manifest.add_asset(make_test_asset(
        "ast_cell_diagram",
        AssetType::Diagram,
        AssetRole::Figure,
        vec!["cytology", "cell"],
        vec!["membrane"],
        "Plant Cell Membrane Structure",
    ));

    let index = AssetIndex::build(&manifest);

    let query = AssetResolutionQuery {
        topic: Some("heart".to_string()),
        asset_type: Some(AssetType::Diagram),
        role: Some(AssetRole::Figure),
        concept: Some("circulation".to_string()),
        context: Some("Blood enters the right atrium and flows into the ventricle".to_string()),
        min_score: Some(0.40),
    };

    let result = resolve_asset(&manifest, &index, &query);

    assert!(result.resolved, "Query for heart diagram must resolve");
    assert_eq!(result.asset_id.as_deref(), Some("ast_heart_diagram"));
    assert!(result.score >= 0.70, "Score should be high for multifaceted match");
    assert!(!result.candidates.is_empty());
}

#[test]
fn test_type_disqualification_constraint() {
    let mut manifest = KnowledgeAssetManifest::new("biology_medical");
    manifest.add_asset(make_test_asset(
        "ast_heart_diagram",
        AssetType::Diagram,
        AssetRole::Figure,
        vec!["cardiology", "heart"],
        vec![],
        "Human Heart Diagram",
    ));

    let index = AssetIndex::build(&manifest);

    // Query specifically demands an Audio clip of heart sounds
    let query = AssetResolutionQuery {
        topic: Some("heart".to_string()),
        asset_type: Some(AssetType::Audio),
        role: None,
        concept: None,
        context: None,
        min_score: None,
    };

    let result = resolve_asset(&manifest, &index, &query);

    // Must NOT resolve to the diagram; zero fabrication guarantee
    assert!(!result.resolved);
    assert_eq!(result.asset_id, None);
}

#[test]
fn test_zero_fabrication_on_unknown_topic() {
    let mut manifest = KnowledgeAssetManifest::new("biology_medical");
    manifest.add_asset(make_test_asset(
        "ast_cell",
        AssetType::Diagram,
        AssetRole::Figure,
        vec!["cell"],
        vec![],
        "Cell diagram",
    ));

    let index = AssetIndex::build(&manifest);

    // Query for topic completely absent from manifest
    let query = AssetResolutionQuery {
        topic: Some("quantum_mechanics".to_string()),
        asset_type: None,
        role: None,
        concept: None,
        context: None,
        min_score: Some(0.30),
    };

    let result = resolve_asset(&manifest, &index, &query);

    assert!(!result.resolved);
    assert_eq!(result.asset_id, None);
}

#[test]
fn test_graceful_handling_of_empty_manifest() {
    let manifest = KnowledgeAssetManifest::new("empty_book");
    let index = AssetIndex::build(&manifest);

    let query = AssetResolutionQuery {
        topic: Some("anything".to_string()),
        asset_type: None,
        role: None,
        concept: None,
        context: None,
        min_score: None,
    };

    let result = resolve_asset(&manifest, &index, &query);

    assert!(!result.resolved);
    assert_eq!(result.asset_id, None);
    assert_eq!(result.candidates.len(), 0);
}

#[test]
fn test_multi_candidate_ranking_order() {
    let mut manifest = KnowledgeAssetManifest::new("ranking_test");

    // Candidate A: perfect match
    manifest.add_asset(make_test_asset(
        "ast_perfect_heart",
        AssetType::Diagram,
        AssetRole::Figure,
        vec!["heart"],
        vec!["circulation"],
        "Complete human heart circulation system",
    ));

    // Candidate B: partial match (topic only)
    manifest.add_asset(make_test_asset(
        "ast_general_organ",
        AssetType::Diagram,
        AssetRole::Figure,
        vec!["heart"],
        vec![],
        "General internal thoracic organ overview",
    ));

    let index = AssetIndex::build(&manifest);

    let query = AssetResolutionQuery {
        topic: Some("heart".to_string()),
        asset_type: Some(AssetType::Diagram),
        role: Some(AssetRole::Figure),
        concept: Some("circulation".to_string()),
        context: Some("Blood circulation in cardiac chambers".to_string()),
        min_score: Some(0.30),
    };

    let result = resolve_asset(&manifest, &index, &query);

    assert!(result.resolved);
    assert_eq!(result.asset_id.as_deref(), Some("ast_perfect_heart"));
    assert_eq!(result.candidates.len(), 2);
    // Verified descending score order
    assert!(result.candidates[0].score > result.candidates[1].score);
}
