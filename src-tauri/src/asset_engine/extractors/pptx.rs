//! PPTX extractor for embedded media in OpenXML presentation archives.

use crate::asset_engine::models::RawExtractedAsset;
use crate::contracts::AssetType;
use std::io::{Cursor, Read};

pub fn extract_from_pptx(pptx_bytes: &[u8]) -> Result<Vec<RawExtractedAsset>, String> {
    let cursor = Cursor::new(pptx_bytes);
    let mut archive = zip::ZipArchive::new(cursor)
        .map_err(|e| format!("Failed to read PPTX zip container: {}", e))?;

    let mut assets = Vec::new();

    for i in 0..archive.len() {
        let mut file = archive
            .by_index(i)
            .map_err(|e| format!("Failed to read zip entry {}: {}", i, e))?;

        let name = file.name().to_string();

        // Target media files inside ppt/media/
        if name.starts_with("ppt/media/") && !file.is_dir() {
            let filename = std::path::Path::new(&name)
                .file_name()
                .and_then(|f| f.to_str())
                .unwrap_or("media.bin")
                .to_string();

            let ext = filename.split('.').last().unwrap_or("png").to_lowercase();
            let (mime_type, hinted_type) = match ext.as_str() {
                "png" => ("image/png", AssetType::Image),
                "jpg" | "jpeg" => ("image/jpeg", AssetType::Image),
                "svg" => ("image/svg+xml", AssetType::Diagram),
                "mp3" | "wav" => ("audio/mpeg", AssetType::Audio),
                "mp4" => ("video/mp4", AssetType::Video),
                "emf" | "wmf" => ("image/x-emf", AssetType::Diagram),
                _ => ("application/octet-stream", AssetType::Image),
            };

            let mut data = Vec::with_capacity(file.size() as usize);
            file.read_to_end(&mut data)
                .map_err(|e| format!("Failed to read asset data for '{}': {}", name, e))?;

            assets.push(RawExtractedAsset {
                original_filename: filename,
                mime_type: mime_type.to_string(),
                data,
                width: None,
                height: None,
                caption: None,
                alt: None,
                provenance_tags: vec!["source:pptx".to_string(), format!("path:{}", name)],
                hinted_type: Some(hinted_type),
                hinted_role: None,
            });
        }
    }

    Ok(assets)
}
