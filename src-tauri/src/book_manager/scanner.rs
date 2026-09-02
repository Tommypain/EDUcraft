use super::types::{BookScanResult, BookState, DiscoveredBook};
use super::validator::validate_book_structure;
use crate::export_engine::types::ExportBook;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;

pub fn scan_books_directory(dir: &Path) -> Result<BookScanResult, String> {
    if !dir.exists() {
        return Err(format!("Books directory does not exist: {}", dir.display()));
    }
    if !dir.is_dir() {
        return Err(format!("Specified path is not a directory: {}", dir.display()));
    }

    let entries = fs::read_dir(dir).map_err(|e| {
        format!("Failed to read books directory '{}': {}", dir.display(), e)
    })?;

    let mut discovered: Vec<DiscoveredBook> = Vec::new();
    let mut errors: Vec<String> = Vec::new();

    for entry in entries {
        let entry = match entry {
            Ok(e) => e,
            Err(err) => {
                errors.push(format!("Error reading entry: {}", err));
                continue;
            }
        };

        let path = entry.path();
        let metadata = match entry.metadata() {
            Ok(m) => m,
            Err(err) => {
                errors.push(format!("Error reading metadata for '{}': {}", path.display(), err));
                continue;
            }
        };

        let mtime_ms = metadata
            .modified()
            .ok()
            .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
            .map(|d| d.as_millis() as u64)
            .unwrap_or(0);

        if metadata.is_dir() {
            // Check for book.json inside folder
            let book_json_path = path.join("book.json");
            let target_json = if book_json_path.exists() {
                Some(book_json_path)
            } else {
                // Check if there is any .json file in the folder
                find_first_json_in_dir(&path)
            };

            if let Some(json_file) = target_json {
                match parse_and_validate_book_file(&json_file, &path, true, mtime_ms) {
                    Ok(book) => discovered.push(book),
                    Err(discovered_err) => discovered.push(discovered_err),
                }
            } else {
                // Folder without JSON
                let folder_name = path
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("unknown")
                    .to_string();
                discovered.push(DiscoveredBook {
                    id: folder_name.clone(),
                    title_ar: folder_name.clone(),
                    title_en: folder_name,
                    tagline_ar: String::new(),
                    tagline_en: String::new(),
                    path: path.to_string_lossy().to_string(),
                    is_dir: true,
                    state: BookState::Incomplete,
                    error: Some("No book.json found in folder".to_string()),
                    mtime_ms,
                    node_count: 0,
                    question_count: 0,
                    branch_count: 0,
                    book: None,
                });
            }
        } else if metadata.is_file() {
            // Check for standalone .json file
            if let Some(ext) = path.extension() {
                if ext == "json" {
                    match parse_and_validate_book_file(&path, &path, false, mtime_ms) {
                        Ok(book) => discovered.push(book),
                        Err(discovered_err) => discovered.push(discovered_err),
                    }
                }
            }
        }
    }

    // Sort deterministically by id for idempotency
    discovered.sort_by(|a, b| a.id.cmp(&b.id));

    let total_found = discovered.len();
    let valid_count = discovered
        .iter()
        .filter(|b| b.state == BookState::Valid)
        .count();
    let invalid_count = total_found - valid_count;

    Ok(BookScanResult {
        books: discovered,
        scanned_dir: dir.to_string_lossy().to_string(),
        total_found,
        valid_count,
        invalid_count,
        errors,
    })
}

fn find_first_json_in_dir(dir: &Path) -> Option<PathBuf> {
    let entries = fs::read_dir(dir).ok()?;
    for entry in entries.flatten() {
        let p = entry.path();
        if p.is_file() && p.extension().map(|e| e == "json").unwrap_or(false) {
            return Some(p);
        }
    }
    None
}

fn parse_and_validate_book_file(
    json_path: &Path,
    entity_path: &Path,
    is_dir: bool,
    mtime_ms: u64,
) -> Result<DiscoveredBook, DiscoveredBook> {
    let fallback_id = entity_path
        .file_name()
        .and_then(|n| n.to_str())
        .map(|s| s.trim_end_matches(".json"))
        .unwrap_or("unnamed")
        .to_string();

    let content = match fs::read_to_string(json_path) {
        Ok(c) => c,
        Err(err) => {
            return Err(DiscoveredBook {
                id: fallback_id.clone(),
                title_ar: fallback_id.clone(),
                title_en: fallback_id,
                tagline_ar: String::new(),
                tagline_en: String::new(),
                path: entity_path.to_string_lossy().to_string(),
                is_dir,
                state: BookState::Invalid,
                error: Some(format!("Could not read file: {}", err)),
                mtime_ms,
                node_count: 0,
                question_count: 0,
                branch_count: 0,
                book: None,
            });
        }
    };

    let book: ExportBook = match serde_json::from_str(&content) {
        Ok(b) => b,
        Err(err) => {
            return Err(DiscoveredBook {
                id: fallback_id.clone(),
                title_ar: fallback_id.clone(),
                title_en: fallback_id,
                tagline_ar: String::new(),
                tagline_en: String::new(),
                path: entity_path.to_string_lossy().to_string(),
                is_dir,
                state: BookState::Invalid,
                error: Some(format!("Invalid JSON schema: {}", err)),
                mtime_ms,
                node_count: 0,
                question_count: 0,
                branch_count: 0,
                book: None,
            });
        }
    };

    let validation = validate_book_structure(&book);

    let title_ar = if !book.ar.title.trim().is_empty() {
        book.ar.title.clone()
    } else {
        book.en.title.clone()
    };

    let title_en = if !book.en.title.trim().is_empty() {
        book.en.title.clone()
    } else {
        title_ar.clone()
    };

    let tagline_ar = book.ar.tagline.clone().unwrap_or_default();
    let tagline_en = book.en.tagline.clone().unwrap_or_default();

    Ok(DiscoveredBook {
        id: book.id.clone(),
        title_ar,
        title_en,
        tagline_ar,
        tagline_en,
        path: entity_path.to_string_lossy().to_string(),
        is_dir,
        state: validation.state,
        error: validation.error,
        mtime_ms,
        node_count: validation.node_count,
        question_count: validation.question_count,
        branch_count: validation.branch_count,
        book: Some(book),
    })
}
