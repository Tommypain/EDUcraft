//! Asset loader with dynamic live auto-synchronization and compile-time fallback.
//!
//! When running in development or workspace mode:
//!   - Automatically checks if UI source files (`src/EDUcraft_fixed.jsx`, etc.)
//!     have been modified since the last bundle build.
//!   - Automatically re-runs `scripts/build-export-bundle.js` on-the-fly if stale.
//!   - Reads the newest bundle files directly from disk without requiring Rust recompilation.
//!
//! When running in production/packaged binary mode:
//!   - Falls back seamlessly to the baked-in `include_str!()` assets in zero I/O time.

use std::borrow::Cow;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};

/// The compile-time fallback React bundle (iife format).
pub static UI_BUNDLE_JS: &str = include_str!("../../assets/ui_bundle.js");

/// The compile-time fallback Tailwind CSS bundle.
pub static UI_BUNDLE_CSS: &str = include_str!("../../assets/ui_bundle.css");

static SYNC_CHECKED: AtomicBool = AtomicBool::new(false);

/// Locate the workspace project root directory containing `package.json` and `scripts/`.
pub fn find_project_root() -> Option<PathBuf> {
    // 1. Check explicit environment override
    if let Ok(p) = std::env::var("EDUCRAFT_PROJECT_ROOT") {
        let pb = PathBuf::from(p);
        if pb.join("package.json").exists() {
            return Some(pb);
        }
    }

    // 2. Check current working directory and ancestors
    if let Ok(cwd) = std::env::current_dir() {
        let mut curr = cwd.as_path();
        loop {
            if curr.join("package.json").exists() && curr.join("scripts/build-export-bundle.js").exists() {
                return Some(curr.to_path_buf());
            }
            match curr.parent() {
                Some(p) => curr = p,
                None => break,
            }
        }
    }

    // 3. Check current executable path and ancestors
    if let Ok(exe) = std::env::current_exe() {
        let mut curr = exe.as_path();
        loop {
            if curr.join("package.json").exists() && curr.join("scripts/build-export-bundle.js").exists() {
                return Some(curr.to_path_buf());
            }
            match curr.parent() {
                Some(p) => curr = p,
                None => break,
            }
        }
    }

    // 4. Check compile-time manifest dir parent
    let manifest_parent = Path::new(env!("CARGO_MANIFEST_DIR")).parent();
    if let Some(p) = manifest_parent {
        if p.join("package.json").exists() {
            return Some(p.to_path_buf());
        }
    }

    None
}

/// Check if source code has been updated since the bundle was last built.
/// If so, automatically invokes `node scripts/build-export-bundle.js`.
pub fn ensure_fresh_bundle() {
    if SYNC_CHECKED.swap(true, Ordering::SeqCst) {
        return;
    }

    let project_root = match find_project_root() {
        Some(r) => r,
        None => return,
    };

    let bundle_js = project_root.join("src-tauri/assets/ui_bundle.js");
    let bundle_css = project_root.join("src-tauri/assets/ui_bundle.css");

    let bundle_mtime = bundle_js
        .metadata()
        .and_then(|m| m.modified())
        .ok();

    let sources = [
        project_root.join("src/EDUcraft_fixed.jsx"),
        project_root.join("src/standalone.jsx"),
        project_root.join("src/styles.css"),
        project_root.join("scripts/build-export-bundle.js"),
    ];

    let mut needs_rebuild = bundle_mtime.is_none() || !bundle_css.exists();

    if !needs_rebuild {
        if let Some(b_time) = bundle_mtime {
            for src in &sources {
                if let Ok(meta) = src.metadata() {
                    if let Ok(s_time) = meta.modified() {
                        if s_time > b_time {
                            needs_rebuild = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    if needs_rebuild {
        eprintln!("[EDUcraft Exporter] Source changes detected; auto-syncing standalone UI bundle...");
        let script = project_root.join("scripts/build-export-bundle.js");
        if script.exists() {
            let status = Command::new("node")
                .arg(&script)
                .current_dir(&project_root)
                .status();

            match status {
                Ok(s) if s.success() => {
                    eprintln!("[EDUcraft Exporter] ✅ UI bundle auto-synchronized successfully.");
                }
                Ok(s) => {
                    eprintln!("[EDUcraft Exporter] ⚠️ Bundle build exited with status: {}", s);
                }
                Err(e) => {
                    eprintln!("[EDUcraft Exporter] ⚠️ Failed to execute node bundler: {}", e);
                }
            }
        }
    }
}

/// Retrieve the standalone JS bundle.
/// Prioritizes live files on disk (or auto-built files), falling back to baked-in `UI_BUNDLE_JS`.
pub fn get_ui_bundle_js() -> Cow<'static, str> {
    ensure_fresh_bundle();

    // 1. Explicit env var override
    if let Ok(p) = std::env::var("EDUCRAFT_BUNDLE_JS_PATH") {
        if let Ok(content) = fs::read_to_string(p) {
            if !content.trim().is_empty() {
                return Cow::Owned(content);
            }
        }
    }

    // 2. Candidate paths on disk
    let candidate_paths = if let Some(root) = find_project_root() {
        vec![
            root.join("src-tauri/assets/ui_bundle.js"),
            root.join("assets/ui_bundle.js"),
        ]
    } else {
        vec![
            PathBuf::from("src-tauri/assets/ui_bundle.js"),
            PathBuf::from("assets/ui_bundle.js"),
        ]
    };

    for path in candidate_paths {
        if path.exists() {
            if let Ok(content) = fs::read_to_string(&path) {
                if !content.trim().is_empty() {
                    return Cow::Owned(content);
                }
            }
        }
    }

    // 3. Fallback to compile-time baked bundle
    Cow::Borrowed(UI_BUNDLE_JS)
}

/// Retrieve the standalone CSS bundle.
/// Prioritizes live files on disk (or auto-built files), falling back to baked-in `UI_BUNDLE_CSS`.
pub fn get_ui_bundle_css() -> Cow<'static, str> {
    ensure_fresh_bundle();

    // 1. Explicit env var override
    if let Ok(p) = std::env::var("EDUCRAFT_BUNDLE_CSS_PATH") {
        if let Ok(content) = fs::read_to_string(p) {
            if !content.trim().is_empty() {
                return Cow::Owned(content);
            }
        }
    }

    // 2. Candidate paths on disk
    let candidate_paths = if let Some(root) = find_project_root() {
        vec![
            root.join("src-tauri/assets/ui_bundle.css"),
            root.join("assets/ui_bundle.css"),
        ]
    } else {
        vec![
            PathBuf::from("src-tauri/assets/ui_bundle.css"),
            PathBuf::from("assets/ui_bundle.css"),
        ]
    };

    for path in candidate_paths {
        if path.exists() {
            if let Ok(content) = fs::read_to_string(&path) {
                if !content.trim().is_empty() {
                    return Cow::Owned(content);
                }
            }
        }
    }

    // 3. Fallback to compile-time baked bundle
    Cow::Borrowed(UI_BUNDLE_CSS)
}
