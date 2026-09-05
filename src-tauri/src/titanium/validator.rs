//! Titanium Manifest Validation and Security Verification
//!
//! Enforces structural correctness, path traversal restrictions, and engine compatibility.

use crate::contracts::PluginManifest;
use super::types::TitaniumError;

/// Parse version numbers into vector of u32 (e.g. "0.0.9.0" -> vec![0, 0, 9, 0])
pub fn parse_version(v: &str) -> Vec<u32> {
    v.trim_start_matches(|c: char| !c.is_ascii_digit())
        .split('.')
        .filter_map(|part| part.parse::<u32>().ok())
        .collect()
}

/// Compare two version vectors (returns Ordering)
pub fn compare_versions(a: &[u32], b: &[u32]) -> std::cmp::Ordering {
    let max_len = a.len().max(b.len());
    for i in 0..max_len {
        let va = a.get(i).copied().unwrap_or(0);
        let vb = b.get(i).copied().unwrap_or(0);
        match va.cmp(&vb) {
            std::cmp::Ordering::Equal => continue,
            other => return other,
        }
    }
    std::cmp::Ordering::Equal
}

/// Check whether the engine satisfies the plugin's `target_engine` constraint.
pub fn is_engine_compatible(required: &str, current: &str) -> bool {
    let req = required.trim();
    if req.is_empty() || req == "*" {
        return true;
    }

    let current_ver = parse_version(current);

    if req.starts_with(">=") {
        let min_ver = parse_version(req.trim_start_matches(">=").trim());
        compare_versions(&current_ver, &min_ver) != std::cmp::Ordering::Less
    } else if req.starts_with('>') {
        let min_ver = parse_version(req.trim_start_matches('>').trim());
        compare_versions(&current_ver, &min_ver) == std::cmp::Ordering::Greater
    } else if req.starts_with("<=") {
        let max_ver = parse_version(req.trim_start_matches("<=").trim());
        compare_versions(&current_ver, &max_ver) != std::cmp::Ordering::Greater
    } else if req.starts_with('<') {
        let max_ver = parse_version(req.trim_start_matches('<').trim());
        compare_versions(&current_ver, &max_ver) == std::cmp::Ordering::Less
    } else {
        // Assume minimum version compatibility if prefix omitted
        let target = parse_version(req);
        compare_versions(&current_ver, &target) != std::cmp::Ordering::Less
    }
}

/// Check if a relative path attempts directory traversal or points outside sandbox.
pub fn is_safe_relative_path(path: &str) -> bool {
    let trimmed = path.trim();
    if trimmed.is_empty() {
        return false;
    }

    // Prohibit absolute paths
    if trimmed.starts_with('/') || trimmed.starts_with('\\') {
        return false;
    }
    // Prohibit Windows drive letters (e.g. C:)
    if trimmed.len() >= 2 && trimmed.chars().next().unwrap().is_ascii_alphabetic() && trimmed.chars().nth(1) == Some(':') {
        return false;
    }

    // Prohibit directory traversal component
    let normalized = trimmed.replace('\\', "/");
    for part in normalized.split('/') {
        if part == ".." {
            return false;
        }
    }

    true
}

/// Thoroughly validate a PluginManifest for structure, security, and compatibility.
pub fn validate_plugin_manifest(
    manifest: &PluginManifest,
    current_engine: &str,
) -> Result<(), TitaniumError> {
    // 1. Basic manifest schema validation
    manifest
        .validate()
        .map_err(TitaniumError::InvalidManifest)?;

    // 2. Security: safe entry point path
    if !is_safe_relative_path(&manifest.entry_point) {
        return Err(TitaniumError::SecurityViolation(format!(
            "Entry point '{}' contains an unsafe path or traversal",
            manifest.entry_point
        )));
    }

    // 3. Security: check contributed theme paths
    if let Some(contributions) = &manifest.contributions {
        for theme in &contributions.themes {
            if !is_safe_relative_path(&theme.file) {
                return Err(TitaniumError::SecurityViolation(format!(
                    "Theme file '{}' in plugin '{}' contains an unsafe path",
                    theme.file, manifest.id
                )));
            }
        }
    }

    // 4. Engine compatibility check
    if !is_engine_compatible(&manifest.target_engine, current_engine) {
        return Err(TitaniumError::IncompatibleEngine {
            required: manifest.target_engine.clone(),
            current: current_engine.to_string(),
        });
    }

    Ok(())
}
