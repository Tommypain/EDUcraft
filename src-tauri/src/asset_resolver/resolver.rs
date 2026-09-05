//! Asset resolver implementation.
//! Maps queries to optimal assets with zero-fabrication guarantees.

use super::index::AssetIndex;
use super::scorer::score_candidate;
use super::types::{AssetResolutionQuery, AssetResolutionResult, DEFAULT_MIN_RESOLUTION_SCORE};
use crate::contracts::KnowledgeAssetManifest;

pub fn resolve_asset(
    manifest: &KnowledgeAssetManifest,
    index: &AssetIndex,
    query: &AssetResolutionQuery,
) -> AssetResolutionResult {
    if manifest.assets.is_empty() {
        return AssetResolutionResult::unresolved("Empty asset manifest (0 assets)");
    }

    let candidate_ids = index.get_candidates(query, manifest);
    if candidate_ids.is_empty() {
        return AssetResolutionResult::unresolved("No candidates found in index matching query criteria");
    }

    let mut scored_candidates = Vec::with_capacity(candidate_ids.len());

    for cid in candidate_ids {
        if let Some(asset) = manifest.get_asset(&cid) {
            let candidate = score_candidate(asset, query);
            if candidate.score > 0.0 {
                scored_candidates.push(candidate);
            }
        }
    }

    if scored_candidates.is_empty() {
        return AssetResolutionResult::unresolved("All candidates scored 0 or disqualified by type mismatch");
    }

    // Sort descending by score
    scored_candidates.sort_by(|a, b| {
        b.score
            .partial_cmp(&a.score)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    let min_score = query.min_score.unwrap_or(DEFAULT_MIN_RESOLUTION_SCORE);
    let best_id = scored_candidates[0].asset_id.clone();
    let best_score = scored_candidates[0].score;

    if best_score >= min_score {
        AssetResolutionResult {
            resolved: true,
            asset_id: Some(best_id),
            score: best_score,
            candidates: scored_candidates,
            reason: None,
        }
    } else {
        AssetResolutionResult {
            resolved: false,
            asset_id: None,
            score: best_score,
            candidates: scored_candidates,
            reason: Some(format!(
                "Best candidate scored {:.2}, which is below required threshold {:.2}",
                best_score, min_score
            )),
        }
    }
}
