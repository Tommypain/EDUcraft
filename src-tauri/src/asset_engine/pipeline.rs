//! Canonical Asset Extraction Pipeline.
//! Executes: EXTRACT -> NORMALIZE -> CLASSIFY -> HASH -> DEDUPLICATE -> STORE -> MANIFEST

use super::classifier::classify_asset;
use super::models::{ExtractionOptions, ExtractionReport, RawExtractedAsset};
use crate::book_manager::assets::compute_sha256;
use crate::contracts::{KnowledgeAsset, KnowledgeAssetManifest};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

pub fn process_raw_assets(
    raw_assets: Vec<RawExtractedAsset>,
    options: &ExtractionOptions,
    manifest: &mut KnowledgeAssetManifest,
    book_dir: Option<&Path>,
) -> Result<ExtractionReport, String> {
    let mut report = ExtractionReport::default();

    for raw in raw_assets {
        report.total_found += 1;

        if raw.data.is_empty() {
            report.warnings.push(format!(
                "Skipping empty 0-byte raw asset: {}",
                raw.original_filename
            ));
            continue;
        }

        // 1. HASH & NORMALIZE
        let sha256 = compute_sha256(&raw.data);
        let byte_size = raw.data.len() as u64;
        let aspect_ratio = match (raw.width, raw.height) {
            (Some(w), Some(h)) if h > 0 => Some((w as f64) / (h as f64)),
            _ => None,
        };

        // 2. CLASSIFY
        let classification = classify_asset(&raw, options);
        if classification.is_decorative {
            report.decorative_count += 1;
        } else {
            report.educational_count += 1;
        }

        // 3. DEDUPLICATE
        if options.deduplicate_by_hash {
            if let Some(existing) = manifest.find_by_hash(&sha256) {
                report.deduplicated_count += 1;
                report.asset_ids.push(existing.id.clone());
                continue;
            }
        }

        // 4. STORE
        let clean_filename = Path::new(&raw.original_filename)
            .file_name()
            .and_then(|f| f.to_str())
            .unwrap_or("asset.bin");

        let asset_id = format!("ast_{}", &sha256[..16]);
        let storage_path = format!("assets/images/{}_{}", &sha256[..8], clean_filename);

        if let Some(dir) = book_dir {
            let target_path = dir.join(&storage_path);
            if let Some(parent) = target_path.parent() {
                let _ = fs::create_dir_all(parent);
            }
            fs::write(&target_path, &raw.data).map_err(|e| {
                format!(
                    "Failed to write extracted asset '{}': {}",
                    target_path.display(),
                    e
                )
            })?;
        }

        // 5. MANIFEST
        let intelligence = crate::asset_intelligence::enrich_asset_intelligence(
            &raw,
            classification.role.clone(),
        );

        let asset = KnowledgeAsset {
            id: asset_id.clone(),
            asset_type: classification.asset_type,
            role: classification.role,
            original_filename: raw.original_filename,
            storage_path,
            mime_type: raw.mime_type,
            byte_size,
            sha256,
            width: raw.width,
            height: raw.height,
            aspect_ratio,
            duration_seconds: None,
            is_decorative: classification.is_decorative,
            caption: raw.caption,
            alt: raw.alt,
            tags: raw.provenance_tags,
            intelligence: Some(intelligence),
            extra: HashMap::new(),
        };

        manifest.add_asset(asset);
        report.unique_stored += 1;
        report.asset_ids.push(asset_id);
    }

    Ok(report)
}
