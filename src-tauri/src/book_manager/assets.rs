use std::fs;
use std::path::Path;

pub fn decode_base64(s: &str) -> Result<Vec<u8>, String> {
    const TABLE: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut lookup = [255u8; 256];
    for (i, &b) in TABLE.iter().enumerate() {
        lookup[b as usize] = i as u8;
    }
    lookup[b'-' as usize] = 62;
    lookup[b'_' as usize] = 63;

    let clean_str = if let Some(idx) = s.find(',') {
        &s[idx + 1..]
    } else {
        s
    };

    let clean: Vec<u8> = clean_str
        .bytes()
        .filter(|&b| b != b'=' && !b.is_ascii_whitespace())
        .collect();
    let mut out = Vec::with_capacity(clean.len() * 3 / 4);

    for chunk in clean.chunks(4) {
        let mut buf = 0u32;
        for (i, &b) in chunk.iter().enumerate() {
            let val = lookup[b as usize];
            if val == 255 {
                return Err(format!("Invalid base64 character: {}", b as char));
            }
            buf |= (val as u32) << (18 - i * 6);
        }
        if chunk.len() >= 2 {
            out.push(((buf >> 16) & 0xFF) as u8);
        }
        if chunk.len() >= 3 {
            out.push(((buf >> 8) & 0xFF) as u8);
        }
        if chunk.len() == 4 {
            out.push((buf & 0xFF) as u8);
        }
    }
    Ok(out)
}

pub fn save_book_asset(
    books_dir: &Path,
    book_id: &str,
    filename: &str,
    data: &[u8],
) -> Result<String, String> {
    if !books_dir.exists() {
        return Err(format!("Books directory does not exist: {}", books_dir.display()));
    }

    let book_dir = books_dir.join(book_id);
    if !book_dir.exists() {
        fs::create_dir_all(&book_dir)
            .map_err(|e| format!("Failed to create book directory '{}': {}", book_dir.display(), e))?;
    }

    let images_dir = book_dir.join("assets").join("images");
    fs::create_dir_all(&images_dir)
        .map_err(|e| format!("Failed to create images directory '{}': {}", images_dir.display(), e))?;

    let clean_filename = Path::new(filename)
        .file_name()
        .and_then(|f| f.to_str())
        .unwrap_or("image.png");

    let target_file = images_dir.join(clean_filename);
    fs::write(&target_file, data)
        .map_err(|e| format!("Failed to write asset file '{}': {}", target_file.display(), e))?;

    Ok(format!("assets/images/{}", clean_filename))
}

pub fn delete_book_asset(
    books_dir: &Path,
    book_id: &str,
    relative_path: &str,
) -> Result<bool, String> {
    if relative_path.contains("..") {
        return Err("Path traversal forbidden".to_string());
    }

    let book_dir = books_dir.join(book_id);
    let target_file = book_dir.join(relative_path);

    if target_file.exists() && target_file.is_file() {
        fs::remove_file(&target_file).map_err(|e| {
            format!(
                "Failed to delete asset file '{}': {}",
                target_file.display(),
                e
            )
        })?;
        Ok(true)
    } else {
        Ok(false)
    }
}

pub fn compute_sha256(data: &[u8]) -> String {
    use sha2::{Digest, Sha256};
    let mut hasher = Sha256::new();
    hasher.update(data);
    let result = hasher.finalize();
    let mut s = String::with_capacity(64);
    for b in result {
        use std::fmt::Write;
        let _ = write!(s, "{:02x}", b);
    }
    s
}

pub fn load_manifest(book_dir: &Path) -> Result<Option<crate::contracts::KnowledgeAssetManifest>, String> {
    let manifest_file = book_dir.join("assets").join("manifest.json");
    if !manifest_file.exists() {
        return Ok(None);
    }
    let content = fs::read_to_string(&manifest_file)
        .map_err(|e| format!("Failed to read asset manifest '{}': {}", manifest_file.display(), e))?;
    let manifest: crate::contracts::KnowledgeAssetManifest = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse asset manifest '{}': {}", manifest_file.display(), e))?;
    Ok(Some(manifest))
}

pub fn save_manifest(
    book_dir: &Path,
    manifest: &crate::contracts::KnowledgeAssetManifest,
) -> Result<(), String> {
    manifest.validate()?;
    let assets_dir = book_dir.join("assets");
    if !assets_dir.exists() {
        fs::create_dir_all(&assets_dir)
            .map_err(|e| format!("Failed to create assets directory '{}': {}", assets_dir.display(), e))?;
    }
    let manifest_file = assets_dir.join("manifest.json");
    let json_bytes = serde_json::to_vec_pretty(manifest)
        .map_err(|e| format!("Failed to serialize asset manifest: {}", e))?;
    fs::write(&manifest_file, json_bytes)
        .map_err(|e| format!("Failed to write asset manifest '{}': {}", manifest_file.display(), e))?;
    Ok(())
}

pub fn collect_book_asset_references(book: &crate::export_engine::types::ExportBook) -> Vec<String> {
    use std::collections::HashSet;
    let mut refs = HashSet::new();

    for node in &book.nodes {
        if node.level != "leaf" {
            continue;
        }

        // 1. pageBlocks
        if let Some(blocks) = node.extra.get("pageBlocks").and_then(|p| p.as_array()) {
            for b in blocks {
                if let Some(aid) = b.get("asset_id").and_then(|v| v.as_str()) {
                    if !aid.trim().is_empty() {
                        refs.insert(aid.to_string());
                    }
                }
            }
        }

        // 2. helper closure to scan questions
        let mut scan_question = |q: &serde_json::Value| {
            if let Some(arr) = q.get("asset_ids").and_then(|a| a.as_array()) {
                for id_val in arr {
                    if let Some(s) = id_val.as_str() {
                        if !s.trim().is_empty() {
                            refs.insert(s.to_string());
                        }
                    }
                }
            }
            if let Some(aid) = q.get("asset_id").and_then(|v| v.as_str()) {
                if !aid.trim().is_empty() {
                    refs.insert(aid.to_string());
                }
            }
            let mut scan_content = |c: &serde_json::Value| {
                if let Some(c_arr) = c.as_array() {
                    for b in c_arr {
                        if let Some(aid) = b.get("asset_id").and_then(|v| v.as_str()) {
                            if !aid.trim().is_empty() {
                                refs.insert(aid.to_string());
                            }
                        }
                    }
                }
            };
            if let Some(c) = q.get("content") {
                scan_content(c);
            }
            if let Some(en) = q.get("en").and_then(|v| v.as_object()) {
                if let Some(c) = en.get("content") {
                    scan_content(c);
                }
            }
            if let Some(ar) = q.get("ar").and_then(|v| v.as_object()) {
                if let Some(c) = ar.get("content") {
                    scan_content(c);
                }
            }
        };

        if let Some(cards) = node.extra.get("cards").and_then(|c| c.as_array()) {
            for card in cards {
                if let Some(groups) = card.get("questionGroups").and_then(|g| g.as_array()) {
                    for g in groups {
                        if let Some(qs) = g.get("questions").and_then(|q| q.as_array()) {
                            for q in qs {
                                scan_question(q);
                            }
                        }
                    }
                }
            }
        } else if let Some(qs) = node.extra.get("questions").and_then(|q| q.as_array()) {
            for q in qs {
                scan_question(q);
            }
        }
    }

    let mut list: Vec<String> = refs.into_iter().collect();
    list.sort();
    list
}
