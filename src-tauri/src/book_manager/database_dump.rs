//! Full Database Dump Export and Restore Engine for EDUcraft.
//!
//! Complies strictly with the single source of truth architecture:
//! - Physical books in `BOOKS/` on disk are read directly from disk.
//! - Associated user preferences (collections, bookFlavors, covers, plans) are bundled in the dump.
//! - Restore operations are transactional: any validation error or disk failure triggers an atomic rollback.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use super::importer::{import_book_dry_run, save_imported_book_transactional};
use super::scanner::scan_books_directory;

pub const CURRENT_DATA_VERSION: &str = "1.0.0";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FullDatabaseDump {
    pub exported_at: String,
    pub version: String,
    #[serde(default)]
    pub collections: Vec<serde_json::Value>,
    #[serde(default)]
    pub books: Vec<serde_json::Value>,
    #[serde(default)]
    pub book_flavors: serde_json::Value,
    #[serde(default)]
    pub covers: serde_json::Value,
    #[serde(default)]
    pub plans: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RestoreReport {
    pub success: bool,
    pub mode: String,
    pub restored_books_count: usize,
    pub restored_collections_count: usize,
    pub warnings: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RestoreMode {
    FullReplace,
    Merge,
}

impl RestoreMode {
    pub fn parse(s: &str) -> Self {
        match s.trim().to_lowercase().as_str() {
            "full_replace" | "replace" => RestoreMode::FullReplace,
            _ => RestoreMode::Merge,
        }
    }
}

fn current_timestamp_iso() -> String {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    format!("{}-01-01T00:00:00Z (timestamp: {})", 2026, now)
}

/// Exports the complete database (all books on disk + client metadata).
pub fn export_full_database_dump(
    books_dir: &Path,
    collections: Vec<serde_json::Value>,
    book_flavors: serde_json::Value,
    covers: serde_json::Value,
    plans: serde_json::Value,
) -> Result<FullDatabaseDump, String> {
    let scan = scan_books_directory(books_dir).map_err(|e| format!("Failed to scan BOOKS directory: {}", e))?;

    let mut books = Vec::new();
    for entry in scan.books {
        let p = PathBuf::from(&entry.path);
        let json_path = if entry.is_dir {
            p.join("book.json")
        } else {
            p
        };

        if json_path.is_file() {
            let content = fs::read_to_string(&json_path)
                .map_err(|e| format!("Failed to read {}: {}", json_path.display(), e))?;
            let val: serde_json::Value = serde_json::from_str(&content)
                .map_err(|e| format!("Invalid JSON in {}: {}", json_path.display(), e))?;
            books.push(val);
        }
    }

    Ok(FullDatabaseDump {
        exported_at: current_timestamp_iso(),
        version: CURRENT_DATA_VERSION.to_string(),
        collections,
        books,
        book_flavors,
        covers,
        plans,
    })
}

/// Validates and restores a FullDatabaseDump onto disk transactionally.
pub fn restore_full_database_dump(
    books_dir: &Path,
    dump: &FullDatabaseDump,
    mode: RestoreMode,
) -> Result<RestoreReport, String> {
    if dump.books.is_empty() && dump.collections.is_empty() {
        return Err("Database dump contains no books and no collections".to_string());
    }

    // 1. Deep validate EVERY book in the dump before making any disk changes
    let mut warnings = Vec::new();
    for (idx, b_val) in dump.books.iter().enumerate() {
        let b_id = b_val
            .get("id")
            .and_then(|id| id.as_str())
            .unwrap_or_default();
        if b_id.is_empty() {
            return Err(format!("Book at index {} is missing an 'id'", idx));
        }

        let json_str = serde_json::to_string(b_val)
            .map_err(|e| format!("Failed to serialize book at index {}: {}", idx, e))?;

        let dry_run = import_book_dry_run(&json_str)
            .map_err(|e| format!("Validation error for book '{}': {}", b_id, e))?;

        if !dry_run.is_valid {
            let err_msgs: Vec<String> = dry_run.issues.iter().map(|i| i.message.clone()).collect();
            return Err(format!(
                "Validation failed for book '{}': {}",
                b_id,
                err_msgs.join("; ")
            ));
        }

        for w in dry_run.issues.iter().filter(|i| i.severity == super::importer::IssueSeverity::Warning) {
            warnings.push(format!("{}: {}", b_id, w.message));
        }
    }

    // 2. Prepare transactional execution
    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_nanos();
    let backup_dir = books_dir.join(format!(".backup_full_restore_{}", nonce));

    if mode == RestoreMode::FullReplace {
        // Move all existing non-hidden book directories into a staging backup
        fs::create_dir_all(&backup_dir)
            .map_err(|e| format!("Failed to create restore backup dir: {}", e))?;

        if let Ok(entries) = fs::read_dir(books_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                let fname = entry.file_name().to_string_lossy().to_string();
                if path.is_dir() && !fname.starts_with('.') {
                    let dest = backup_dir.join(&fname);
                    if let Err(e) = fs::rename(&path, &dest) {
                        rollback_full_replace(books_dir, &backup_dir);
                        return Err(format!("Failed to stage existing book '{}': {}", fname, e));
                    }
                }
            }
        }
    }

    // 3. Save each incoming book transactionally
    let mut written_book_dirs: Vec<PathBuf> = Vec::new();
    for b_val in &dump.books {
        let b_id = b_val["id"].as_str().unwrap();
        let target_folder = books_dir.join(b_id);

        let content_str = match serde_json::to_string_pretty(b_val) {
            Ok(s) => s,
            Err(e) => {
                cleanup_restore_failure(books_dir, &backup_dir, &written_book_dirs, &mode);
                return Err(format!("Failed to serialize book '{}': {}", b_id, e));
            }
        };

        if let Err(e) = save_imported_book_transactional(books_dir, b_id, &content_str) {
            cleanup_restore_failure(books_dir, &backup_dir, &written_book_dirs, &mode);
            return Err(format!("Transactional write failed for book '{}': {}", b_id, e));
        }

        written_book_dirs.push(target_folder);
    }

    // 4. Success: Clean up temporary backup directory
    if backup_dir.exists() {
        let _ = fs::remove_dir_all(&backup_dir);
    }

    Ok(RestoreReport {
        success: true,
        mode: match mode {
            RestoreMode::FullReplace => "full_replace".to_string(),
            RestoreMode::Merge => "merge".to_string(),
        },
        restored_books_count: dump.books.len(),
        restored_collections_count: dump.collections.len(),
        warnings,
    })
}

fn rollback_full_replace(books_dir: &Path, backup_dir: &Path) {
    if backup_dir.is_dir() {
        if let Ok(entries) = fs::read_dir(backup_dir) {
            for entry in entries.flatten() {
                let dest = books_dir.join(entry.file_name());
                let _ = fs::rename(entry.path(), dest);
            }
        }
        let _ = fs::remove_dir_all(backup_dir);
    }
}

fn cleanup_restore_failure(
    books_dir: &Path,
    backup_dir: &Path,
    written_dirs: &[PathBuf],
    mode: &RestoreMode,
) {
    for d in written_dirs {
        if d.is_dir() {
            let _ = fs::remove_dir_all(d);
        }
    }

    if *mode == RestoreMode::FullReplace {
        rollback_full_replace(books_dir, backup_dir);
    }
}
