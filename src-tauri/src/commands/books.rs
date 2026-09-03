use crate::book_manager::{delete_book_by_id, delete_book_from_fs, scan_books_directory, BookScanResult};
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
pub async fn delete_book_fs(id: Option<String>, path: Option<String>) -> Result<bool, String> {
    let books_dir = resolve_default_books_dir();

    // 1. Primary: delete by id directly from BOOKS/
    if let Some(ref book_id) = id {
        if !book_id.trim().is_empty() {
            match delete_book_by_id(&books_dir, book_id) {
                Ok(_) => return Ok(true),
                Err(e) => {
                    // If path is provided, try path fallback before erroring
                    if path.is_none() {
                        return Err(e);
                    }
                }
            }
        }
    }

    // 2. Fallback: delete by path
    if let Some(ref p) = path {
        if !p.trim().is_empty() {
            let target = Path::new(p);
            if target.exists() {
                delete_book_from_fs(target)?;
                return Ok(true);
            }
        }
    }

    if let Some(ref book_id) = id {
        Err(format!("Book with id '{}' not found in '{}'", book_id, books_dir.display()))
    } else {
        Err("Neither valid book id nor path was provided for deletion".to_string())
    }
}

#[tauri::command]
pub async fn save_book_image(
    book_id: String,
    filename: String,
    data_base64: String,
) -> Result<String, String> {
    let books_dir = resolve_default_books_dir();
    let bytes = crate::book_manager::decode_base64(&data_base64)?;
    crate::book_manager::save_book_asset(&books_dir, &book_id, &filename, &bytes)
}

#[tauri::command]
pub async fn delete_book_image(book_id: String, relative_path: String) -> Result<bool, String> {
    let books_dir = resolve_default_books_dir();
    crate::book_manager::delete_book_asset(&books_dir, &book_id, &relative_path)
}

#[tauri::command]
pub async fn import_book_dry_run_cmd(
    json_content: String,
) -> Result<crate::book_manager::DryRunReport, String> {
    crate::book_manager::import_book_dry_run(&json_content)
}

struct TauriEventSink {
    app: tauri::AppHandle,
}

impl crate::book_manager::ImportEventSink for TauriEventSink {
    fn emit(&self, event: &str, payload: serde_json::Value) {
        use tauri::Emitter;
        let _ = self.app.emit(event, payload);
    }
}

#[tauri::command]
pub async fn import_book_stream_cmd(
    app: tauri::AppHandle,
    json_content: String,
) -> Result<crate::book_manager::DryRunReport, String> {
    let sink = TauriEventSink { app };
    crate::book_manager::import_book_with_sink(&json_content, &sink)
}

#[tauri::command]
pub async fn import_book_commit_cmd(
    book_id: String,
    final_json: String,
) -> Result<String, String> {
    let books_dir = resolve_default_books_dir();
    let saved_path = crate::book_manager::save_imported_book_transactional(&books_dir, &book_id, &final_json)?;
    Ok(saved_path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn export_full_database(
    collections: Vec<serde_json::Value>,
    book_flavors: serde_json::Value,
    covers: serde_json::Value,
    plans: serde_json::Value,
) -> Result<String, String> {
    let books_dir = resolve_default_books_dir();
    let dump = crate::book_manager::export_full_database_dump(
        &books_dir,
        collections,
        book_flavors,
        covers,
        plans,
    )?;
    serde_json::to_string_pretty(&dump).map_err(|e| format!("Failed to serialize dump: {}", e))
}

#[tauri::command]
pub async fn import_full_database(
    dump_json: String,
    mode: Option<String>,
) -> Result<crate::book_manager::RestoreReport, String> {
    let books_dir = resolve_default_books_dir();
    let dump: crate::book_manager::FullDatabaseDump = serde_json::from_str(&dump_json)
        .map_err(|e| format!("Invalid database dump JSON: {}", e))?;
    let restore_mode = crate::book_manager::RestoreMode::parse(mode.as_deref().unwrap_or("merge"));
    crate::book_manager::restore_full_database_dump(&books_dir, &dump, restore_mode)
}



