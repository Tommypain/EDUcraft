//! Inverted asset index for high-performance candidate retrieval.

use super::types::AssetResolutionQuery;
use crate::contracts::{AssetRole, AssetType, KnowledgeAssetManifest};
use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone, Default)]
pub struct AssetIndex {
    pub by_type: HashMap<AssetType, Vec<String>>,
    pub by_role: HashMap<AssetRole, Vec<String>>,
    pub by_topic: HashMap<String, Vec<String>>,
    pub by_concept: HashMap<String, Vec<String>>,
    pub by_keyword: HashMap<String, Vec<String>>,
}

impl AssetIndex {
    pub fn build(manifest: &KnowledgeAssetManifest) -> Self {
        let mut index = AssetIndex::default();

        for (id, asset) in &manifest.assets {
            // Index by type
            index
                .by_type
                .entry(asset.asset_type.clone())
                .or_default()
                .push(id.clone());

            // Index by role
            index
                .by_role
                .entry(asset.role.clone())
                .or_default()
                .push(id.clone());

            // Index by tags
            for tag in &asset.tags {
                index
                    .by_keyword
                    .entry(tag.to_lowercase())
                    .or_default()
                    .push(id.clone());
            }

            // Index by intelligence metadata
            if let Some(ref intel) = asset.intelligence {
                for topic in &intel.topics {
                    index
                        .by_topic
                        .entry(topic.to_lowercase())
                        .or_default()
                        .push(id.clone());
                }
                for concept in &intel.concepts {
                    index
                        .by_concept
                        .entry(concept.to_lowercase())
                        .or_default()
                        .push(id.clone());
                }
            }

            // Index words in filename and caption
            let mut text_sources = vec![asset.original_filename.clone()];
            if let Some(ref cap) = asset.caption {
                if let Some(ref en) = cap.en {
                    text_sources.push(en.clone());
                }
                if let Some(ref ar) = cap.ar {
                    text_sources.push(ar.clone());
                }
            }
            for text in text_sources {
                for word in text.split(|c: char| !c.is_alphanumeric()) {
                    let w = word.to_lowercase();
                    if w.len() >= 3 {
                        index.by_keyword.entry(w).or_default().push(id.clone());
                    }
                }
            }
        }

        index
    }

    /// Retrieve candidate asset IDs that match any query dimension.
    /// If no specific terms are provided, returns all indexed IDs.
    pub fn get_candidates(&self, query: &AssetResolutionQuery, manifest: &KnowledgeAssetManifest) -> Vec<String> {
        if manifest.assets.is_empty() {
            return Vec::new();
        }

        let mut candidate_ids = HashSet::new();

        if let Some(ref topic) = query.topic {
            let t = topic.to_lowercase();
            if let Some(ids) = self.by_topic.get(&t) {
                candidate_ids.extend(ids.iter().cloned());
            }
            if let Some(ids) = self.by_keyword.get(&t) {
                candidate_ids.extend(ids.iter().cloned());
            }
        }

        if let Some(ref concept) = query.concept {
            let c = concept.to_lowercase();
            if let Some(ids) = self.by_concept.get(&c) {
                candidate_ids.extend(ids.iter().cloned());
            }
            if let Some(ids) = self.by_keyword.get(&c) {
                candidate_ids.extend(ids.iter().cloned());
            }
        }

        if let Some(ref role) = query.role {
            if let Some(ids) = self.by_role.get(role) {
                candidate_ids.extend(ids.iter().cloned());
            }
        }

        if let Some(ref atype) = query.asset_type {
            if let Some(ids) = self.by_type.get(atype) {
                candidate_ids.extend(ids.iter().cloned());
            }
        }

        // If no specific dimension was matched, consider all assets
        if candidate_ids.is_empty() {
            return manifest.assets.keys().cloned().collect();
        }

        candidate_ids.into_iter().collect()
    }
}
