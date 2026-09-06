use educraft_lib::book_manager::{delete_book_by_id, delete_book_from_fs, scan_books_directory};
use std::env;
use std::path::{Path, PathBuf};

fn resolve_default_books_dir() -> PathBuf {
    let cwd = env::current_dir().unwrap_or_default();
    if cwd.join("BOOKS").exists() {
        return cwd.join("BOOKS");
    }
    if let Some(p) = cwd.parent() {
        if p.join("BOOKS").exists() {
            return p.join("BOOKS");
        }
    }
    if let Ok(exe) = env::current_exe() {
        let mut cur = exe.parent();
        for _ in 0..5 {
            if let Some(dir) = cur {
                let p = dir.join("BOOKS");
                if p.exists() {
                    return p;
                }
                cur = dir.parent();
            } else {
                break;
            }
        }
    }
    cwd.join("BOOKS")
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = env::args().collect();
    let cmd = args.get(1).map(|s| s.as_str()).unwrap_or("scan");

    match cmd {
        "scan" => {
            let dir_arg = args
                .get(2)
                .map(PathBuf::from)
                .unwrap_or_else(resolve_default_books_dir);

            let result = scan_books_directory(&dir_arg)?;
            println!("{}", serde_json::to_string(&result)?);
        }
        "delete" => {
            let target_arg = args.get(2).ok_or("Missing book id or path to delete")?;
            let books_dir = args
                .get(3)
                .map(PathBuf::from)
                .unwrap_or_else(resolve_default_books_dir);

            match delete_book_by_id(&books_dir, target_arg) {
                Ok(deleted_path) => {
                    println!(
                        r#"{{"ok":true,"deleted":"{}","path":"{}"}}"#,
                        target_arg,
                        deleted_path.display()
                    );
                }
                Err(_) => {
                    let target_path = Path::new(target_arg);
                    if target_path.is_absolute() && target_path.exists() {
                        delete_book_from_fs(target_path)?;
                        println!(r#"{{"ok":true,"deleted":"{}"}}"#, target_arg);
                    } else {
                        return Err(format!("Book '{}' not found in '{}'", target_arg, books_dir.display()).into());
                    }
                }
            }
        }
        "import_dry_run" => {
            let json_file = args.get(2).ok_or("Missing path to book JSON file")?;
            let content = std::fs::read_to_string(json_file)?;
            let report = educraft_lib::book_manager::import_book_with_sink(
                &content,
                &educraft_lib::book_manager::StdoutEventSink,
            )?;
            println!("{}", serde_json::to_string(&report)?);
        }
        "import_commit" => {
            let book_id = args.get(2).ok_or("Missing book ID")?;
            let json_file = args.get(3).ok_or("Missing path to book JSON file")?;
            let books_dir = args
                .get(4)
                .map(PathBuf::from)
                .unwrap_or_else(resolve_default_books_dir);
            let content = std::fs::read_to_string(json_file)?;
            let saved = educraft_lib::book_manager::save_imported_book_transactional(
                &books_dir,
                book_id,
                &content,
            )?;
            println!(r#"{{"ok":true,"committed":"{}"}}"#, saved.display());
        }
        "export_full_db" => {
            let meta_json_file = args.get(2);
            let books_dir = args
                .get(3)
                .map(PathBuf::from)
                .unwrap_or_else(resolve_default_books_dir);

            let (collections, book_flavors, covers, plans) = if let Some(mf) = meta_json_file {
                let content = std::fs::read_to_string(mf)?;
                let meta: serde_json::Value = serde_json::from_str(&content)?;
                (
                    meta.get("collections").and_then(|v| v.as_array()).cloned().unwrap_or_default(),
                    meta.get("bookFlavors").cloned().unwrap_or_else(|| serde_json::json!({})),
                    meta.get("covers").cloned().unwrap_or_else(|| serde_json::json!({})),
                    meta.get("plans").cloned().unwrap_or_else(|| serde_json::json!({})),
                )
            } else {
                (Vec::new(), serde_json::json!({}), serde_json::json!({}), serde_json::json!({}))
            };

            let dump = educraft_lib::book_manager::export_full_database_dump(
                &books_dir,
                collections,
                book_flavors,
                covers,
                plans,
            )?;
            println!("{}", serde_json::to_string_pretty(&dump)?);
        }
        "import_full_db" => {
            let dump_file = args.get(2).ok_or("Missing path to dump JSON file")?;
            let mode_str = args.get(3).map(|s| s.as_str()).unwrap_or("merge");
            let books_dir = args
                .get(4)
                .map(PathBuf::from)
                .unwrap_or_else(resolve_default_books_dir);

            let content = std::fs::read_to_string(dump_file)?;
            let dump: educraft_lib::book_manager::FullDatabaseDump = serde_json::from_str(&content)?;
            let mode = educraft_lib::book_manager::RestoreMode::parse(mode_str);
            let report = educraft_lib::book_manager::restore_full_database_dump(&books_dir, &dump, mode)?;
            println!("{}", serde_json::to_string(&report)?);
        }
        other => {
            eprintln!("Unknown command: {}", other);
            std::process::exit(1);
        }
    }

    Ok(())
}
