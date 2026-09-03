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
