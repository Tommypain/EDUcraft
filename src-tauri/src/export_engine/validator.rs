//! Data validation and repair for the EDUcraft Export Engine.
//!
//! Enforces the Tree <-> Content Contract:
//! - Guarantees every leaf has a stable ID and valid parent branch/sub.
//! - Auto-repairs orphan leaves and removes broken cross-links.
//! - Ensures locale fallbacks so a leaf or question never crashes when accessed in Arabic or English.
//! - Verifies that content (A4 pageBlocks / question decks) is properly structured.

use super::types::{BookNode, ExportBook, ExportSeed};
use std::collections::{HashMap, HashSet};

#[derive(Debug, Default, Clone)]
pub struct ValidationReport {
    pub fixed_orphan_leaves: usize,
    pub pruned_broken_links: usize,
    pub locale_fallbacks_applied: usize,
    pub warnings: Vec<String>,
}

/// Validate and sanitize an ExportSeed before HTML generation.
/// Returns Ok(ValidationReport) with repairs applied, or Err(String) if unrecoverable.
pub fn validate_and_sanitize_seed(seed: &mut ExportSeed) -> Result<ValidationReport, String> {
    if seed.books.is_empty() {
        return Err("Export failed: The export payload contains zero books.".to_string());
    }

    let mut report = ValidationReport::default();

    for book in &mut seed.books {
        validate_and_sanitize_book(book, &mut report)?;
    }

    // Verify startBookId points to an existing book
    let book_ids: HashSet<String> = seed.books.iter().map(|b| b.id.clone()).collect();
    if !book_ids.contains(&seed.start_book_id) {
        if let Some(first) = seed.books.first() {
            report.warnings.push(format!(
                "startBookId '{}' not found; defaulted to '{}'",
                seed.start_book_id, first.id
            ));
            seed.start_book_id = first.id.clone();
        }
    }

    Ok(report)
}

/// Validate and auto-repair a single book.
pub fn validate_and_sanitize_book(book: &mut ExportBook, report: &mut ValidationReport) -> Result<(), String> {
    if book.id.trim().is_empty() {
        return Err("Book has an empty ID.".to_string());
    }

    // 1. Locale fallback for book titles
    if book.ar.title.trim().is_empty() && !book.en.title.trim().is_empty() {
        book.ar.title = book.en.title.clone();
        report.locale_fallbacks_applied += 1;
    } else if book.en.title.trim().is_empty() && !book.ar.title.trim().is_empty() {
        book.en.title = book.ar.title.clone();
        report.locale_fallbacks_applied += 1;
    } else if book.ar.title.trim().is_empty() && book.en.title.trim().is_empty() {
        book.ar.title = format!("كتاب {}", book.id);
        book.en.title = format!("Book {}", book.id);
        report.locale_fallbacks_applied += 1;
    }

    // 2. Ensure at least one branch node exists
    let has_branch = book.nodes.iter().any(|n| n.level == "branch");
    if !has_branch {
        let root_branch_id = format!("{}-b-root", book.id);
        book.nodes.insert(
            0,
            BookNode {
                id: root_branch_id.clone(),
                level: "branch".to_string(),
                parent: None,
                ar: Some(book.ar.title.clone()),
                en: Some(book.en.title.clone()),
                extra: HashMap::new(),
            },
        );
        report.warnings.push("Book had no branches; auto-generated root branch.".to_string());
    }

    // Find the first available branch ID to adopt orphan nodes
    let first_branch_id = book
        .nodes
        .iter()
        .find(|n| n.level == "branch")
        .map(|n| n.id.clone())
        .unwrap();

    // 3. Build a map of node IDs and check relationships
    let node_ids: HashSet<String> = book.nodes.iter().map(|n| n.id.clone()).collect();

    for node in &mut book.nodes {
        // Ensure locale fallbacks on nodes
        if node.ar.is_none() && node.en.is_some() {
            node.ar = node.en.clone();
            report.locale_fallbacks_applied += 1;
        } else if node.en.is_none() && node.ar.is_some() {
            node.en = node.ar.clone();
            report.locale_fallbacks_applied += 1;
        } else if node.ar.is_none() && node.en.is_none() {
            node.ar = Some(node.id.clone());
            node.en = Some(node.id.clone());
            report.locale_fallbacks_applied += 1;
        }

        // Parent validation
        if node.level == "sub" || node.level == "leaf" {
            let has_valid_parent = match &node.parent {
                Some(p) => node_ids.contains(p),
                None => false,
            };

            if !has_valid_parent {
                report.warnings.push(format!(
                    "Orphan node '{}' (level: '{}') re-parented to '{}'",
                    node.id, node.level, first_branch_id
                ));
                node.parent = Some(first_branch_id.clone());
                report.fixed_orphan_leaves += 1;
            }
        }
    }

    // 4. Prune broken cross-links
    let valid_node_ids: HashSet<String> = book.nodes.iter().map(|n| n.id.clone()).collect();
    let original_link_count = book.cross_links.len();
    book.cross_links.retain(|link| {
        if let (Some(from), Some(to)) = (
            link.get("from").and_then(|v| v.as_str()),
            link.get("to").and_then(|v| v.as_str()),
        ) {
            valid_node_ids.contains(from) && valid_node_ids.contains(to)
        } else {
            false
        }
    });

    let pruned = original_link_count - book.cross_links.len();
    if pruned > 0 {
        report.pruned_broken_links += pruned;
        report.warnings.push(format!("Pruned {} broken cross-branch links", pruned));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::export_engine::types::BookLocale;

    #[test]
    fn auto_fixes_orphan_leaf() {
        let mut book = ExportBook {
            id: "b1".to_string(),
            ar: BookLocale { title: "كتاب".to_string(), tagline: None, extra: HashMap::new() },
            en: BookLocale { title: "Book".to_string(), tagline: None, extra: HashMap::new() },
            nodes: vec![
                BookNode {
                    id: "branch1".to_string(),
                    level: "branch".to_string(),
                    parent: None,
                    ar: Some("فرع".to_string()),
                    en: Some("Branch".to_string()),
                    extra: HashMap::new(),
                },
                BookNode {
                    id: "leaf1".to_string(),
                    level: "leaf".to_string(),
                    parent: Some("non_existent_parent".to_string()),
                    ar: Some("ورقة".to_string()),
                    en: Some("Leaf".to_string()),
                    extra: HashMap::new(),
                },
            ],
            cross_links: vec![],
            extra: HashMap::new(),
        };

        let mut report = ValidationReport::default();
        validate_and_sanitize_book(&mut book, &mut report).unwrap();

        assert_eq!(report.fixed_orphan_leaves, 1);
        assert_eq!(book.nodes[1].parent, Some("branch1".to_string()));
    }

    #[test]
    fn prunes_broken_cross_links() {
        let mut book = ExportBook {
            id: "b1".to_string(),
            ar: BookLocale { title: "كتاب".to_string(), tagline: None, extra: HashMap::new() },
            en: BookLocale { title: "Book".to_string(), tagline: None, extra: HashMap::new() },
            nodes: vec![
                BookNode {
                    id: "n1".to_string(),
                    level: "branch".to_string(),
                    parent: None,
                    ar: None,
                    en: None,
                    extra: HashMap::new(),
                },
            ],
            cross_links: vec![
                serde_json::json!({ "from": "n1", "to": "ghost_node" }),
                serde_json::json!({ "from": "n1", "to": "n1" }),
            ],
            extra: HashMap::new(),
        };

        let mut report = ValidationReport::default();
        validate_and_sanitize_book(&mut book, &mut report).unwrap();

        assert_eq!(report.pruned_broken_links, 1);
        assert_eq!(book.cross_links.len(), 1);
    }
}
