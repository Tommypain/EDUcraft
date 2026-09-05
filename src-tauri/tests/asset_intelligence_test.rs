//! EDUcraft Asset Intelligence Test Suite
//! Tests evidence-based metadata enrichment, zero-hallucination guarantees,
//! explicit low-confidence recording, perceptual hashing (dHash), and provenance tracking.

use educraft_lib::asset_engine::models::RawExtractedAsset;
use educraft_lib::asset_intelligence::{compute_dhash, enrich_asset_intelligence, hamming_distance};
use educraft_lib::contracts::{AssetRole, AssetType, ConfidenceLevel, LocalizedText};

#[test]
fn test_high_confidence_intelligence_enrichment() {
    let raw = RawExtractedAsset {
        original_filename: "cardiovascular_system.png".to_string(),
        mime_type: "image/png".to_string(),
        data: b"SAMPLE_PNG_DATA_CARDIOVASCULAR_HUMAN_HEART_SYSTEM_2026".to_vec(),
        width: Some(1024),
        height: Some(768),
        caption: Some(LocalizedText {
            en: Some("Figure 4.2: Diagram of Human Cardiovascular Circulation".to_string()),
            ar: Some("شكل 4.2: مخطط الدورة الدموية في جسم الإنسان".to_string()),
        }),
        alt: Some(LocalizedText {
            en: Some("Human heart and systemic blood vessels".to_string()),
            ar: None,
        }),
        provenance_tags: vec![
            "source:anatomy_textbook.html".to_string(),
            "page:42".to_string(),
            "tag:figure".to_string(),
        ],
        hinted_type: Some(AssetType::Diagram),
        hinted_role: Some(AssetRole::Figure),
    };

    let intel = enrich_asset_intelligence(&raw, AssetRole::Figure);

    // 1. High confidence evaluation
    assert_eq!(intel.confidence.level, ConfidenceLevel::High);
    assert!(intel.confidence.score >= 0.80);
    assert!(intel.confidence.basis.contains(&"explicit_caption".to_string()));
    assert!(intel.confidence.basis.contains(&"alt_text".to_string()));
    assert!(intel.confidence.basis.contains(&"provenance_verified".to_string()));

    // 2. Strict evidence-derived topics
    assert!(!intel.topics.is_empty(), "Topics must be extracted from caption");
    assert!(
        intel.topics.contains(&"cardiovascular".to_string())
            || intel.topics.contains(&"circulation".to_string())
            || intel.topics.contains(&"human".to_string()),
        "Topics must contain evidence-based keywords from text"
    );

    // 3. Perceptual hash
    let phash = intel.perceptual_hash.as_ref().expect("Perceptual hash must be computed");
    assert_eq!(phash.len(), 16);

    // 4. Provenance
    assert_eq!(intel.provenance.source_file.as_deref(), Some("anatomy_textbook.html"));
    assert_eq!(intel.provenance.page_number, Some(42));
    assert_eq!(intel.provenance.container_tag.as_deref(), Some("figure"));
}

#[test]
fn test_zero_hallucination_and_low_confidence_on_bare_asset() {
    let raw = RawExtractedAsset {
        original_filename: "unknown_figure_99.png".to_string(),
        mime_type: "image/png".to_string(),
        data: b"BARE_IMAGE_DATA_WITH_ZERO_SURROUNDING_TEXT".to_vec(),
        width: Some(300),
        height: Some(200),
        caption: None,
        alt: None,
        provenance_tags: vec![],
        hinted_type: None,
        hinted_role: None,
    };

    let intel = enrich_asset_intelligence(&raw, AssetRole::Figure);

    // Directives: "Never invent semantic information without evidence. If confidence is low: record low confidence."
    assert_eq!(intel.confidence.level, ConfidenceLevel::Low);
    assert!(intel.confidence.score < 0.50);
    assert!(intel.confidence.basis.contains(&"filename_only".to_string()));
    assert!(intel.confidence.basis.contains(&"no_text_evidence".to_string()));

    // Zero-hallucination guarantee: topics and concepts MUST be empty when no text evidence exists
    assert!(intel.topics.is_empty(), "Must not invent topics without evidence");
    assert!(intel.concepts.is_empty(), "Must not invent concepts without evidence");
}

#[test]
fn test_perceptual_hash_dhash_and_hamming_distance() {
    let data_a = b"IMAGE_BUFFER_A_WITH_GRADIENT_PIXELS_0123456789";
    let data_b = b"IMAGE_BUFFER_A_WITH_GRADIENT_PIXELS_0123456789"; // Identical
    let data_c = b"COMPLETELY_DIFFERENT_IMAGE_PAYLOAD_9876543210";

    let hash_a = compute_dhash(data_a);
    let hash_b = compute_dhash(data_b);
    let hash_c = compute_dhash(data_c);

    assert_eq!(hash_a.len(), 16);
    assert_eq!(hash_a, hash_b, "Identical buffers must produce identical dHash");

    let dist_identical = hamming_distance(&hash_a, &hash_b).unwrap();
    assert_eq!(dist_identical, 0);

    let dist_different = hamming_distance(&hash_a, &hash_c).unwrap();
    assert!(dist_different > 0, "Differing buffers should have non-zero Hamming distance");
}

#[test]
fn test_provenance_extraction_pptx_slide() {
    let raw = RawExtractedAsset {
        original_filename: "media_slide_7.png".to_string(),
        mime_type: "image/png".to_string(),
        data: b"SLIDE_IMAGE".to_vec(),
        width: None,
        height: None,
        caption: None,
        alt: None,
        provenance_tags: vec![
            "path:ppt/media/media_slide_7.png".to_string(),
            "slide:7".to_string(),
        ],
        hinted_type: Some(AssetType::Image),
        hinted_role: None,
    };

    let intel = enrich_asset_intelligence(&raw, AssetRole::Figure);
    assert_eq!(intel.provenance.source_file.as_deref(), Some("ppt/media/media_slide_7.png"));
    assert_eq!(intel.provenance.slide_number, Some(7));
}
