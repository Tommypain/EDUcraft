use std::fs;
use std::path::{Path, PathBuf};

/// Defensively un-stage / remove from git index if tracked, with ZERO auto-commit.
pub fn run_defensive_git_rm(path: &Path) {
    let _ = std::process::Command::new("git")
        .args(["rm", "-r", "--cached", "--ignore-unmatch"])
        .arg(path)
        .output();
}

pub fn delete_book_from_fs(path: &Path) -> Result<(), String> {
    if !path.exists() {
        return Err(format!("Path does not exist: {}", path.display()));
    }

    // Defensive git rm --cached if tracked (Zero auto-commit, safe and non-blocking)
    run_defensive_git_rm(path);

    if path.is_dir() {
        fs::remove_dir_all(path).map_err(|e| {
            format!(
                "Failed to delete book directory '{}': {}",
                path.display(),
                e
            )
        })?;
    } else {
        fs::remove_file(path).map_err(|e| {
            format!(
                "Failed to delete book file '{}': {}",
                path.display(),
                e
            )
        })?;
    }

    Ok(())
}

fn check_json_file_id(file_path: &Path, expected_id: &str) -> bool {
    if let Ok(content) = fs::read_to_string(file_path) {
        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&content) {
            if let Some(id) = val.get("id").and_then(|v| v.as_str()) {
                return id == expected_id;
            }
        }
    }
    false
}

pub fn delete_book_by_id(books_dir: &Path, book_id: &str) -> Result<PathBuf, String> {
    if !books_dir.exists() {
        return Err(format!("Books directory does not exist: {}", books_dir.display()));
    }

    // 1. Direct match: folder named `book_id`
    let direct_folder = books_dir.join(book_id);
    if direct_folder.is_dir() {
        delete_book_from_fs(&direct_folder)?;
        return Ok(direct_folder);
    }

    // 2. Direct match: file named `{book_id}.json`
    let direct_file = books_dir.join(format!("{}.json", book_id));
    if direct_file.is_file() {
        delete_book_from_fs(&direct_file)?;
        return Ok(direct_file);
    }

    // 3. Scan directory entries to match book id inside book.json or standalone json
    let entries = fs::read_dir(books_dir).map_err(|e| {
        format!("Failed to read books directory '{}': {}", books_dir.display(), e)
    })?;

    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            let book_json = path.join("book.json");
            if book_json.exists() && check_json_file_id(&book_json, book_id) {
                delete_book_from_fs(&path)?;
                return Ok(path);
            }
            if let Ok(sub_entries) = fs::read_dir(&path) {
                for sub in sub_entries.flatten() {
                    let sub_p = sub.path();
                    if sub_p.extension().and_then(|ext| ext.to_str()) == Some("json") {
                        if check_json_file_id(&sub_p, book_id) {
                            delete_book_from_fs(&path)?;
                            return Ok(path);
                        }
                    }
                }
            }
        } else if path.is_file() && path.extension().and_then(|ext| ext.to_str()) == Some("json") {
            if check_json_file_id(&path, book_id) {
                delete_book_from_fs(&path)?;
                return Ok(path);
            }
        }
    }

    Err(format!("Book with id '{}' was not found in '{}'", book_id, books_dir.display()))
}
