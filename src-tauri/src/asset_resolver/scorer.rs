//! Multifactor relevance scorer for candidate assets.

use super::types::{AssetResolutionQuery, ScoredCandidate};
use crate::contracts::{ConfidenceLevel, KnowledgeAsset};

pub fn score_candidate(asset: &KnowledgeAsset, query: &AssetResolutionQuery) -> ScoredCandidate {
    let mut score = 0.0f32;
    let mut reasons = Vec::new();

    // 1. Strict Asset Type constraint
    if let Some(ref req_type) = query.asset_type {
        if &asset.asset_type == req_type {
            score += 0.25;
            reasons.push(format!("type_match:{:?}", req_type));
        } else {
            // Type mismatch is a disqualifying factor
            return ScoredCandidate {
                asset_id: asset.id.clone(),
                score: 0.0,
                match_reasons: vec![format!("type_mismatch:expected_{:?}_found_{:?}", req_type, asset.asset_type)],
            };
        }
    }

    // 2. Role constraint
    if let Some(ref req_role) = query.role {
        if &asset.role == req_role {
            score += 0.20;
            reasons.push(format!("role_match:{:?}", req_role));
        }
    }

    // 3. Topic match
    if let Some(ref req_topic) = query.topic {
        let t = req_topic.to_lowercase();
        let mut topic_matched = false;

        if let Some(ref intel) = asset.intelligence {
            if intel.topics.iter().any(|top| top.to_lowercase() == t) {
                score += 0.30;
                reasons.push(format!("intelligence_topic_match:{}", t));
                topic_matched = true;
            }
        }

        if !topic_matched && asset.tags.iter().any(|tag| tag.to_lowercase().contains(&t)) {
            score += 0.20;
            reasons.push(format!("tag_topic_match:{}", t));
            topic_matched = true;
        }

        if !topic_matched && asset.original_filename.to_lowercase().contains(&t) {
            score += 0.15;
            reasons.push(format!("filename_topic_match:{}", t));
        }
    }

    // 4. Concept match
    if let Some(ref req_concept) = query.concept {
        let c = req_concept.to_lowercase();
        if let Some(ref intel) = asset.intelligence {
            if intel.concepts.iter().any(|con| con.to_lowercase() == c) {
                score += 0.25;
                reasons.push(format!("concept_match:{}", c));
            }
        }
    }

    // 5. Contextual lexical overlap
    if let Some(ref req_context) = query.context {
        let ctx_lower = req_context.to_lowercase();
        let mut overlap_count = 0;
        let mut total_words = 0;

        for word in ctx_lower.split(|ch: char| !ch.is_alphanumeric()) {
            if word.len() >= 4 {
                total_words += 1;
                let in_caption = asset
                    .caption
                    .as_ref()
                    .and_then(|cap| cap.en.as_ref().or(cap.ar.as_ref()))
                    .map(|s| s.to_lowercase().contains(word))
                    .unwrap_or(false);

                let in_alt = asset
                    .alt
                    .as_ref()
                    .and_then(|a| a.en.as_ref().or(a.ar.as_ref()))
                    .map(|s| s.to_lowercase().contains(word))
                    .unwrap_or(false);

                if in_caption || in_alt {
                    overlap_count += 1;
                }
            }
        }

        if total_words > 0 && overlap_count > 0 {
            let ratio = (overlap_count as f32) / (total_words as f32);
            let ctx_score = (ratio * 0.25).min(0.25);
            score += ctx_score;
            reasons.push(format!("context_overlap:{:.2}", ctx_score));
        }
    }

    // 6. Verified intelligence bonus
    if let Some(ref intel) = asset.intelligence {
        if intel.confidence.level == ConfidenceLevel::High {
            score += 0.05;
            reasons.push("high_confidence_bonus".to_string());
        }
    }

    // 7. Decorative penalty
    if asset.is_decorative {
        score = (score - 0.75).max(0.0);
        reasons.push("decorative_penalty".to_string());
    }

    ScoredCandidate {
        asset_id: asset.id.clone(),
        score: score.min(1.0),
        match_reasons: reasons,
    }
}
