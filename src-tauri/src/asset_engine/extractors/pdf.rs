//! PDF extractor for embedded image and figure streams using lopdf.

use crate::asset_engine::models::RawExtractedAsset;
use crate::contracts::AssetType;

pub fn extract_from_pdf(pdf_bytes: &[u8]) -> Result<Vec<RawExtractedAsset>, String> {
    let doc = lopdf::Document::load_mem(pdf_bytes)
        .map_err(|e| format!("Failed to parse PDF document: {}", e))?;

    let mut assets = Vec::new();
    let mut image_counter = 0;

    for (obj_id, object) in &doc.objects {
        if let Ok(stream) = object.as_stream() {
            let dict = &stream.dict;

            // Check if object is an XObject Image
            let is_image = dict
                .get(b"Subtype")
                .ok()
                .and_then(|val| val.as_name().ok())
                .map(|name| name == b"Image")
                .unwrap_or(false);

            if is_image {
                image_counter += 1;

                let width = dict
                    .get(b"Width")
                    .ok()
                    .and_then(|val| val.as_i64().ok())
                    .map(|w| w as u32);

                let height = dict
                    .get(b"Height")
                    .ok()
                    .and_then(|val| val.as_i64().ok())
                    .map(|h| h as u32);

                let filter_name = dict
                    .get(b"Filter")
                    .ok()
                    .and_then(|val| val.as_name().ok())
                    .map(|n| n.to_vec())
                    .unwrap_or_default();

                let (mime_type, ext) = if filter_name == b"DCTDecode" {
                    ("image/jpeg", "jpg")
                } else {
                    ("image/png", "png")
                };

                let data = stream.content.clone();

                assets.push(RawExtractedAsset {
                    original_filename: format!("pdf_figure_{}.{}", image_counter, ext),
                    mime_type: mime_type.to_string(),
                    data,
                    width,
                    height,
                    caption: None,
                    alt: None,
                    provenance_tags: vec![
                        "source:pdf".to_string(),
                        format!("object_id:{}_{}", obj_id.0, obj_id.1),
                    ],
                    hinted_type: Some(AssetType::Image),
                    hinted_role: None,
                });
            }
        }
    }

    Ok(assets)
}
