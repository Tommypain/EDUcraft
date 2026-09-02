use educraft_lib::book_manager::{delete_book_from_fs, scan_books_directory};
use std::env;
use std::path::Path;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = env::args().collect();
    let cmd = args.get(1).map(|s| s.as_str()).unwrap_or("scan");

    match cmd {
        "scan" => {
            let dir_arg = args.get(2).cloned().unwrap_or_else(|| {
                let cwd = env::current_dir().unwrap_or_default();
                if cwd.join("BOOKS").exists() {
                    return cwd.join("BOOKS").to_string_lossy().to_string();
                }
                if let Some(p) = cwd.parent() {
                    if p.join("BOOKS").exists() {
                        return p.join("BOOKS").to_string_lossy().to_string();
                    }
                }
                "/home/tommypain/Projects/EDUcraft/BOOKS".to_string()
            });

            let result = scan_books_directory(Path::new(&dir_arg))?;
            println!("{}", serde_json::to_string(&result)?);
        }
        "delete" => {
            let path_arg = args.get(2).ok_or("Missing path to delete")?;
            delete_book_from_fs(Path::new(path_arg))?;
            println!(r#"{{"ok":true,"deleted":"{}"}}"#, path_arg);
        }
        other => {
            eprintln!("Unknown command: {}", other);
            std::process::exit(1);
        }
    }

    Ok(())
}
