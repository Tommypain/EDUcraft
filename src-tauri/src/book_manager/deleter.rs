use std::fs;
use std::path::Path;

pub fn delete_book_from_fs(path: &Path) -> Result<(), String> {
    if !path.exists() {
        return Err(format!("Path does not exist: {}", path.display()));
    }

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
