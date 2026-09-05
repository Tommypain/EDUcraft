//! HTML extractor for images, data URIs, SVG diagrams, and tables.

use crate::asset_engine::models::RawExtractedAsset;
use crate::book_manager::assets::decode_base64;
use crate::contracts::{AssetType, LocalizedText};

pub fn extract_from_html(html: &str) -> Vec<RawExtractedAsset> {
    let mut assets = Vec::new();

    // 1. Extract <img> tags
    let mut search_idx = 0;
    let mut img_counter = 0;

    while let Some(start_pos) = html[search_idx..].find("<img") {
        let actual_start = search_idx + start_pos;
        let end_pos = match html[actual_start..].find('>') {
            Some(p) => actual_start + p + 1,
            None => break,
        };

        let tag = &html[actual_start..end_pos];
        search_idx = end_pos;
        img_counter += 1;

        // Parse attributes
        let src = extract_attr(tag, "src").unwrap_or_default();
        if src.is_empty() {
            continue;
        }

        let alt = extract_attr(tag, "alt");
        let width = extract_attr(tag, "width").and_then(|w| w.parse::<u32>().ok());
        let height = extract_attr(tag, "height").and_then(|h| h.parse::<u32>().ok());

        // Extract surrounding figcaption if inside <figure>
        let surrounding_caption = extract_surrounding_caption(html, actual_start);

        if src.starts_with("data:image/") {
            // Data URI
            let semi = src.find(';').unwrap_or(src.len());
            let mime_type = src["data:".len()..semi].to_string();
            let ext = match mime_type.as_str() {
                "image/png" => "png",
                "image/jpeg" | "image/jpg" => "jpg",
                "image/svg+xml" => "svg",
                "image/webp" => "webp",
                "image/gif" => "gif",
                _ => "bin",
            };

            if let Ok(data) = decode_base64(&src) {
                assets.push(RawExtractedAsset {
                    original_filename: format!("html_embedded_img_{}.{}", img_counter, ext),
                    mime_type,
                    data,
                    width,
                    height,
                    caption: surrounding_caption.map(|c| LocalizedText {
                        en: Some(c.clone()),
                        ar: Some(c),
                    }),
                    alt: alt.map(|a| LocalizedText {
                        en: Some(a.clone()),
                        ar: Some(a),
                    }),
                    provenance_tags: vec!["source:html".to_string(), "tag:img_data_uri".to_string()],
                    hinted_type: Some(AssetType::Image),
                    hinted_role: None,
                });
            }
        } else {
            // File reference or standard URL
            let filename = std::path::Path::new(&src)
                .file_name()
                .and_then(|f| f.to_str())
                .unwrap_or("image.png")
                .to_string();

            let ext = filename.split('.').last().unwrap_or("png").to_lowercase();
            let mime_type = match ext.as_str() {
                "png" => "image/png",
                "jpg" | "jpeg" => "image/jpeg",
                "svg" => "image/svg+xml",
                "webp" => "image/webp",
                "gif" => "image/gif",
                _ => "application/octet-stream",
            }
            .to_string();

            // Store src reference as payload if data not directly inline
            assets.push(RawExtractedAsset {
                original_filename: filename,
                mime_type,
                data: src.as_bytes().to_vec(),
                width,
                height,
                caption: surrounding_caption.map(|c| LocalizedText {
                    en: Some(c.clone()),
                    ar: Some(c),
                }),
                alt: alt.map(|a| LocalizedText {
                    en: Some(a.clone()),
                    ar: Some(a),
                }),
                provenance_tags: vec!["source:html".to_string(), format!("src:{}", src)],
                hinted_type: Some(AssetType::Image),
                hinted_role: None,
            });
        }
    }

    // 2. Extract inline <svg> blocks
    let mut svg_search = 0;
    let mut svg_counter = 0;
    while let Some(start_pos) = html[svg_search..].find("<svg") {
        let actual_start = svg_search + start_pos;
        if let Some(end_rel) = html[actual_start..].find("</svg>") {
            let actual_end = actual_start + end_rel + "</svg>".len();
            let svg_content = &html[actual_start..actual_end];
            svg_search = actual_end;
            svg_counter += 1;

            assets.push(RawExtractedAsset {
                original_filename: format!("diagram_svg_{}.svg", svg_counter),
                mime_type: "image/svg+xml".to_string(),
                data: svg_content.as_bytes().to_vec(),
                width: None,
                height: None,
                caption: None,
                alt: None,
                provenance_tags: vec!["source:html".to_string(), "tag:svg".to_string()],
                hinted_type: Some(AssetType::Diagram),
                hinted_role: None,
            });
        } else {
            break;
        }
    }

    assets
}

fn extract_attr(tag: &str, attr_name: &str) -> Option<String> {
    let pattern = format!("{}=\"", attr_name);
    if let Some(idx) = tag.find(&pattern) {
        let rest = &tag[idx + pattern.len()..];
        if let Some(end) = rest.find('"') {
            return Some(rest[..end].to_string());
        }
    }
    let pattern_single = format!("{}='", attr_name);
    if let Some(idx) = tag.find(&pattern_single) {
        let rest = &tag[idx + pattern_single.len()..];
        if let Some(end) = rest.find('\'') {
            return Some(rest[..end].to_string());
        }
    }
    None
}

fn extract_surrounding_caption(html: &str, img_pos: usize) -> Option<String> {
    // Look backwards for <figure> within 300 chars
    let search_back_start = img_pos.saturating_sub(300);
    let back_chunk = &html[search_back_start..img_pos];
    if back_chunk.contains("<figure") {
        // Look forward for <figcaption> within 500 chars
        let search_fwd_end = (img_pos + 500).min(html.len());
        let fwd_chunk = &html[img_pos..search_fwd_end];
        if let Some(cap_start) = fwd_chunk.find("<figcaption") {
            if let Some(tag_close) = fwd_chunk[cap_start..].find('>') {
                let inner_start = cap_start + tag_close + 1;
                if let Some(cap_end) = fwd_chunk[inner_start..].find("</figcaption>") {
                    let cap_text = &fwd_chunk[inner_start..inner_start + cap_end];
                    let clean = cap_text.replace('\n', " ").trim().to_string();
                    if !clean.is_empty() {
                        return Some(clean);
                    }
                }
            }
        }
    }
    None
}
