//! Heuristic classification of raw extracted assets.
//! Differentiates educational figures/diagrams from decorative UI artifacts.

use super::models::{ExtractionOptions, RawExtractedAsset};
use crate::contracts::{AssetRole, AssetType};

pub struct ClassificationResult {
    pub asset_type: AssetType,
    pub role: AssetRole,
    pub is_decorative: bool,
}

pub fn classify_asset(raw: &RawExtractedAsset, options: &ExtractionOptions) -> ClassificationResult {
    let lower_fname = raw.original_filename.to_lowercase();
    let lower_alt = raw
        .alt
        .as_ref()
        .and_then(|a| a.en.as_ref().or(a.ar.as_ref()))
        .map(|s| s.to_lowercase())
        .unwrap_or_default();

    // 1. Check decorative heuristics
    let mut is_decorative = false;

    if options.filter_decorative {
        const DECORATIVE_NAME_PATTERNS: &[&str] = &[
            "logo", "watermark", "spacer", "bullet", "divider", "line_divider",
            "banner_bg", "bg_header", "bg_footer", "footer_bg", "icon_bullet",
            "dot.", "pixel", "1x1", "blank.png", "transparent.png"
        ];

        for pat in DECORATIVE_NAME_PATTERNS {
            if lower_fname.contains(pat) {
                is_decorative = true;
                break;
            }
        }

        if !is_decorative {
            for pat in &["spacer", "divider", "bullet", "decoration", "decorative"] {
                if lower_alt.contains(pat) {
                    is_decorative = true;
                    break;
                }
            }
        }

        // Small dimensions check (e.g. <= 32x32 bullets or spacers)
        if !is_decorative {
            if let (Some(w), Some(h)) = (raw.width, raw.height) {
                if w <= options.min_width && h <= options.min_height {
                    is_decorative = true;
                } else if w > 0 && h > 0 {
                    // Extreme aspect ratios (e.g. line dividers 1000x2 or 2x1000)
                    let ratio = (w as f64) / (h as f64);
                    if ratio >= 25.0 || ratio <= 0.04 {
                        is_decorative = true;
                    }
                }
            }
        }
    }

    if is_decorative {
        return ClassificationResult {
            asset_type: raw.hinted_type.clone().unwrap_or(AssetType::Image),
            role: AssetRole::Decorative,
            is_decorative: true,
        };
    }

    // 2. Classify educational asset type
    let asset_type = if let Some(ref h) = raw.hinted_type {
        h.clone()
    } else if raw.mime_type.contains("svg") || lower_fname.ends_with(".svg") {
        AssetType::Diagram
    } else if raw.mime_type.starts_with("audio/") || lower_fname.ends_with(".mp3") || lower_fname.ends_with(".wav") {
        AssetType::Audio
    } else if raw.mime_type.starts_with("video/") || lower_fname.ends_with(".mp4") || lower_fname.ends_with(".webm") {
        AssetType::Video
    } else if raw.mime_type.contains("gltf") || lower_fname.ends_with(".glb") || lower_fname.ends_with(".gltf") {
        AssetType::Model3D
    } else if raw.mime_type.contains("json") && lower_fname.contains("table") {
        AssetType::Table
    } else {
        AssetType::Image
    };

    // 3. Classify pedagogical role
    let role = if let Some(ref r) = raw.hinted_role {
        r.clone()
    } else {
        match asset_type {
            AssetType::Diagram => AssetRole::Diagram,
            AssetType::Table => AssetRole::Figure,
            AssetType::Image => {
                if lower_fname.contains("cover") || lower_fname.contains("hero") {
                    AssetRole::Hero
                } else if lower_fname.contains("solution") || lower_fname.contains("answer") {
                    AssetRole::Solution
                } else if lower_fname.contains("card") {
                    AssetRole::Card
                } else {
                    AssetRole::Figure
                }
            }
            _ => AssetRole::Figure,
        }
    };

    ClassificationResult {
        asset_type,
        role,
        is_decorative: false,
    }
}
