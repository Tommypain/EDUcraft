use crate::book_manager::{delete_book_from_fs, scan_books_directory, BookScanResult};
use std::env;
use std::path::{Path, PathBuf};

fn resolve_default_books_dir() -> PathBuf {
    // 1. Check current working directory for BOOKS/
    if let Ok(cwd) = env::current_dir() {
        let p = cwd.join("BOOKS");
        if p.exists() {
            return p;
        }
        // In dev mode, cwd might be inside src-tauri
        let parent_books = cwd.parent().map(|p| p.join("BOOKS"));
        if let Some(ref pb) = parent_books {
            if pb.exists() {
                return pb.clone();
            }
        }
    }

    // 2. Absolute fallback for this workspace
    let fallback = PathBuf::from("/home/tommypain/Projects/EDUcraft/BOOKS");
    if fallback.exists() {
        return fallback;
    }

    PathBuf::from("BOOKS")
}

#[tauri::command]
pub async fn get_default_books_dir() -> Result<String, String> {
    let dir = resolve_default_books_dir();
    Ok(dir.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn scan_books_dir(dir: Option<String>) -> Result<BookScanResult, String> {
    let target = match dir {
        Some(d) if !d.trim().is_empty() => PathBuf::from(d),
        _ => resolve_default_books_dir(),
    };

    scan_books_directory(&target)
}

#[tauri::command]
pub async fn delete_book_fs(path: String, _id: String) -> Result<bool, String> {
    let target = Path::new(&path);
    delete_book_from_fs(target).map(|_| true)
}
