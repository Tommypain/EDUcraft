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
    PathBuf::from("/home/tommypain/Projects/EDUcraft/BOOKS")
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
            let target_path = Path::new(target_arg);

            if target_path.exists() {
                delete_book_from_fs(target_path)?;
                println!(r#"{{"ok":true,"deleted":"{}"}}"#, target_arg);
            } else {
                let books_dir = args
                    .get(3)
                    .map(PathBuf::from)
                    .unwrap_or_else(resolve_default_books_dir);

                let deleted_path = delete_book_by_id(&books_dir, target_arg)?;
                println!(
                    r#"{{"ok":true,"deleted":"{}","path":"{}"}}"#,
                    target_arg,
                    deleted_path.display()
                );
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
        other => {
            eprintln!("Unknown command: {}", other);
            std::process::exit(1);
        }
    }

    Ok(())
}
