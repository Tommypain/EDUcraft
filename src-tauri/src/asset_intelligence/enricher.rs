//! Evidence-based Asset Intelligence enricher.
//! Strictly derives semantic topics and concepts from available text evidence.
//! Records explicit confidence scores and basis chains without hallucination.

use super::phash::compute_dhash;
use crate::asset_engine::models::RawExtractedAsset;
use crate::contracts::{
    AssetIntelligence, AssetProvenance, AssetRole, ConfidenceLevel, ConfidenceScore,
};
use std::collections::HashMap;

pub fn enrich_asset_intelligence(
    raw: &RawExtractedAsset,
    pedagogical_role: AssetRole,
) -> AssetIntelligence {
    // 1. Extract provenance from tags
    let mut provenance = AssetProvenance::default();
    for tag in &raw.provenance_tags {
        if let Some(src) = tag.strip_prefix("source:") {
            provenance.source_file = Some(src.to_string());
        } else if let Some(path) = tag.strip_prefix("path:") {
            provenance.source_file = Some(path.to_string());
        } else if let Some(p) = tag.strip_prefix("page:") {
            provenance.page_number = p.parse().ok();
        } else if let Some(s) = tag.strip_prefix("slide:") {
            provenance.slide_number = s.parse().ok();
        } else if let Some(t) = tag.strip_prefix("tag:") {
            provenance.container_tag = Some(t.to_string());
        }
    }

    // 2. Extract textual evidence
    let mut evidence = Vec::new();
    let mut score = 0.0f32;

    let has_caption = raw
        .caption
        .as_ref()
        .map(|c| c.en.as_ref().or(c.ar.as_ref()).map(|s| !s.trim().is_empty()).unwrap_or(false))
        .unwrap_or(false);

    let has_alt = raw
        .alt
        .as_ref()
        .map(|a| a.en.as_ref().or(a.ar.as_ref()).map(|s| !s.trim().is_empty()).unwrap_or(false))
        .unwrap_or(false);

    if has_caption {
        score += 0.65;
        evidence.push("explicit_caption".to_string());
    }

    if has_alt {
        score += 0.25;
        evidence.push("alt_text".to_string());
    }

    if !raw.provenance_tags.is_empty() {
        score += 0.10;
        evidence.push("provenance_verified".to_string());
    }

    // Never invent semantic information without evidence.
    // Topics and concepts are derived strictly from caption or alt text.
    let mut topics = Vec::new();
    let mut concepts = Vec::new();

    let combined_text = format!(
        "{} {}",
        raw.caption
            .as_ref()
            .and_then(|c| c.en.as_ref().or(c.ar.as_ref()))
            .map(|s| s.as_str())
            .unwrap_or(""),
        raw.alt
            .as_ref()
            .and_then(|a| a.en.as_ref().or(a.ar.as_ref()))
            .map(|s| s.as_str())
            .unwrap_or("")
    );

    let cleaned_text = combined_text.trim();
    if !cleaned_text.is_empty() {
        // Evidence exists! Extract keywords
        for word in cleaned_text.split_whitespace() {
            let clean_word = word
                .trim_matches(|c: char| !c.is_alphanumeric())
                .to_lowercase();
            if clean_word.len() >= 4 {
                const STOP_WORDS: &[&str] = &[
                    "this", "that", "with", "from", "figure", "image", "table", "chart",
                    "diagram", "look", "here", "their", "which", "there"
                ];
                if !STOP_WORDS.contains(&clean_word.as_str()) && !topics.contains(&clean_word) {
                    if topics.len() < 5 {
                        topics.push(clean_word.clone());
                    } else if concepts.len() < 5 {
                        concepts.push(clean_word);
                    }
                }
            }
        }
    } else {
        // No text evidence! Strictly low confidence, no invented topics
        evidence.push("filename_only".to_string());
        evidence.push("no_text_evidence".to_string());
        score = 0.20;
    }

    let confidence_level = if score >= 0.80 {
        ConfidenceLevel::High
    } else if score >= 0.50 {
        ConfidenceLevel::Medium
    } else {
        ConfidenceLevel::Low
    };

    let perceptual_hash = Some(compute_dhash(&raw.data));

    AssetIntelligence {
        title: None,
        caption: raw.caption.clone(),
        description: raw.alt.clone(),
        ocr_text: None,
        topics,
        concepts,
        pedagogical_role,
        provenance,
        confidence: ConfidenceScore {
            score: score.min(1.0),
            level: confidence_level,
            basis: evidence,
        },
        perceptual_hash,
        extra: HashMap::new(),
    }
}
