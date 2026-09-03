//! Smart Import Engine for EDUcraft.
//! Validates book structure, content blocks, and question rules.
//! Supports Rayon parallelism across leaves, streaming IPC events,
//! and all-or-nothing transactional saving with rollback.

use super::validator::{validate_book_structure, validate_content_block, ValidationInfo};
use crate::export_engine::types::ExportBook;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum IssueSeverity {
    Error,
    Warning,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ImportIssue {
    pub severity: IssueSeverity,
    pub location: String,
    pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct AutoFillEntry {
    pub target_id: String,
    pub location: String,
    pub field: String,
    pub action_taken: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DryRunReport {
    pub is_valid: bool,
    pub book_id: String,
    pub title_ar: String,
    pub title_en: String,
    pub node_count: usize,
    pub branch_count: usize,
    pub leaf_count: usize,
    pub question_count: usize,
    pub issues: Vec<ImportIssue>,
    pub auto_fills: Vec<AutoFillEntry>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auto_filled_json: Option<String>,
}

pub trait ImportEventSink: Send + Sync {
    fn emit(&self, event: &str, payload: serde_json::Value);
}

pub struct NoopEventSink;
impl ImportEventSink for NoopEventSink {
    fn emit(&self, _event: &str, _payload: serde_json::Value) {}
}

pub struct StdoutEventSink;
impl ImportEventSink for StdoutEventSink {
    fn emit(&self, event: &str, payload: serde_json::Value) {
        println!(
            "{}",
            serde_json::json!({
                "event": event,
                "data": payload
            })
        );
    }
}

fn auto_fill_content_block(
    block_val: &mut serde_json::Value,
    location_prefix: &str,
    auto_fills: &mut Vec<AutoFillEntry>,
    issues: &mut Vec<ImportIssue>,
    event_sink: &(dyn ImportEventSink + Sync),
) {
    let obj = match block_val.as_object_mut() {
        Some(o) => o,
        None => return,
    };

    let block_id = obj
        .get("id")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown_block")
        .to_string();
    let location = format!("{} -> block:{}", location_prefix, block_id);

    let kind = obj
        .get("kind")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    match kind.as_str() {
        "image" => {
            let has_valid_url = obj
                .get("imageUrl")
                .and_then(|u| u.as_str())
                .map(|s| !s.trim().is_empty())
                .unwrap_or(false);

            let is_placeholder = obj
                .get("isPlaceholder")
                .and_then(|p| p.as_bool())
                .unwrap_or(false);

            if !has_valid_url && !is_placeholder {
                obj.insert("isPlaceholder".to_string(), serde_json::json!(true));
                auto_fills.push(AutoFillEntry {
                    target_id: block_id,
                    location,
                    field: "imageUrl".to_string(),
                    action_taken: "Marked isPlaceholder: true due to missing/empty imageUrl".to_string(),
                });
            }
        }
        "table" => {
            let headers_len = obj
                .get("headers")
                .and_then(|h| h.as_array())
                .map(|a| a.len())
                .unwrap_or(0);

            let rows_empty = obj
                .get("rows")
                .and_then(|r| r.as_array())
                .map(|a| a.is_empty())
                .unwrap_or(true);

            if headers_len > 0 && rows_empty {
                let default_row = vec![serde_json::json!("—"); headers_len];
                obj.insert("rows".to_string(), serde_json::json!([default_row]));
                obj.insert("isPlaceholder".to_string(), serde_json::json!(true));
                auto_fills.push(AutoFillEntry {
                    target_id: block_id,
                    location,
                    field: "rows".to_string(),
                    action_taken: format!(
                        "Generated default placeholder row with {} cells matching headers length",
                        headers_len
                    ),
                });
            }
        }
        "code" => {
            let has_lang = obj
                .get("codeLang")
                .and_then(|l| l.as_str())
                .map(|s| !s.trim().is_empty())
                .unwrap_or(false);

            if !has_lang {
                obj.insert("codeLang".to_string(), serde_json::json!("plaintext"));
                auto_fills.push(AutoFillEntry {
                    target_id: block_id.clone(),
                    location: location.clone(),
                    field: "codeLang".to_string(),
                    action_taken: "Defaulted missing codeLang to 'plaintext'".to_string(),
                });
                let issue = ImportIssue {
                    severity: IssueSeverity::Warning,
                    location,
                    message: format!("Code block '{}' missing codeLang, defaulted to 'plaintext'", block_id),
                };
                event_sink.emit(
                    "import:issue",
                    serde_json::json!({
                        "severity": "warning",
                        "location": issue.location,
                        "message": issue.message,
                    }),
                );
                issues.push(issue);
            }
        }
        _ => {}
    }
}

fn auto_fill_node_coordinates(
    nodes: &mut [serde_json::Value],
    auto_fills: &mut Vec<AutoFillEntry>,
) {
    let mut branches_idx = Vec::new();
    let mut subs_idx = Vec::new();
    let mut leaves_idx = Vec::new();

    for (idx, n_val) in nodes.iter().enumerate() {
        if let Some(obj) = n_val.as_object() {
            let level = obj.get("level").and_then(|l| l.as_str()).unwrap_or("leaf");
            match level {
                "branch" => branches_idx.push(idx),
                "sub" => subs_idx.push(idx),
                _ => leaves_idx.push(idx),
            }
        }
    }

    let apply_layout = |indices: &[usize], default_y: f64, nodes_slice: &mut [serde_json::Value], fills: &mut Vec<AutoFillEntry>| {
        let total = indices.len();
        if total == 0 {
            return;
        }
        for (i, &idx) in indices.iter().enumerate() {
            let obj = match nodes_slice[idx].as_object_mut() {
                Some(o) => o,
                None => continue,
            };

            let node_id = obj.get("id").and_then(|id| id.as_str()).unwrap_or("node").to_string();
            let has_x = obj.get("x").and_then(|v| v.as_f64()).is_some();
            let has_y = obj.get("y").and_then(|v| v.as_f64()).is_some();

            if !has_x || !has_y {
                let computed_x = ((i + 1) as f64) * 800.0 / ((total + 1) as f64);
                let computed_y = default_y;

                if !has_x {
                    obj.insert("x".to_string(), serde_json::json!(computed_x));
                }
                if !has_y {
                    obj.insert("y".to_string(), serde_json::json!(computed_y));
                }

                fills.push(AutoFillEntry {
                    target_id: node_id.clone(),
                    location: format!("node:{}", node_id),
                    field: "coordinates".to_string(),
                    action_taken: format!(
                        "Computed deterministic auto-layout coordinates x: {:.1}, y: {:.1}",
                        computed_x, computed_y
                    ),
                });
            }
        }
    };

    apply_layout(&branches_idx, 50.0, nodes, auto_fills);
    apply_layout(&subs_idx, 150.0, nodes, auto_fills);
    apply_layout(&leaves_idx, 260.0, nodes, auto_fills);
}

fn validate_question_details(
    q_val: &serde_json::Value,
    node_id: &str,
    issues: &mut Vec<ImportIssue>,
    event_sink: &(dyn ImportEventSink + Sync),
) {
    let q_obj = match q_val.as_object() {
        Some(o) => o,
        None => return,
    };

    let q_id = q_obj
        .get("id")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown_question");
    let q_type = q_obj
        .get("type")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown_type");
    let location = format!("leaf:{} -> question:{}", node_id, q_id);

    let mut check_and_record = |locale_obj: &serde_json::Map<String, serde_json::Value>, lang: &str| {
        let loc = format!("{} ({})", location, lang);
        let issue = match q_type {
            "single" => {
                if let (Some(options), Some(correct)) = (
                    locale_obj.get("options").and_then(|v| v.as_array()),
                    locale_obj.get("correct").and_then(|v| v.as_i64()),
                ) {
                    if correct < 0 || (correct as usize) >= options.len() {
                        Some(ImportIssue {
                            severity: IssueSeverity::Error,
                            location: loc,
                            message: format!(
                                "Single choice correct index ({}) is out of range for options (len: {})",
                                correct,
                                options.len()
                            ),
                        })
                    } else {
                        None
                    }
                } else {
                    None
                }
            }
            "multi" => {
                if let (Some(options), Some(correct_arr)) = (
                    locale_obj.get("options").and_then(|v| v.as_array()),
                    locale_obj.get("correct").and_then(|v| v.as_array()),
                ) {
                    let mut found_err = None;
                    for c_val in correct_arr {
                        if let Some(idx) = c_val.as_i64() {
                            if idx < 0 || (idx as usize) >= options.len() {
                                found_err = Some(ImportIssue {
                                    severity: IssueSeverity::Error,
                                    location: loc.clone(),
                                    message: format!(
                                        "Multi choice correct index ({}) is out of range for options (len: {})",
                                        idx,
                                        options.len()
                                    ),
                                });
                                break;
                            }
                        }
                    }
                    found_err
                } else {
                    None
                }
            }
            "match" => {
                if let (Some(left), Some(right), Some(correct_arr)) = (
                    locale_obj.get("left").and_then(|v| v.as_array()),
                    locale_obj.get("right").and_then(|v| v.as_array()),
                    locale_obj.get("correct").and_then(|v| v.as_array()),
                ) {
                    if correct_arr.len() != left.len() {
                        Some(ImportIssue {
                            severity: IssueSeverity::Error,
                            location: loc,
                            message: format!(
                                "Match correct array length ({}) does not match left items ({})",
                                correct_arr.len(),
                                left.len()
                            ),
                        })
                    } else {
                        let mut found_err = None;
                        for c_val in correct_arr {
                            if let Some(idx) = c_val.as_i64() {
                                if idx < 0 || (idx as usize) >= right.len() {
                                    found_err = Some(ImportIssue {
                                        severity: IssueSeverity::Error,
                                        location: loc.clone(),
                                        message: format!(
                                            "Match correct index ({}) is out of range for right items (len: {})",
                                            idx,
                                            right.len()
                                        ),
                                    });
                                    break;
                                }
                            }
                        }
                        found_err
                    }
                } else {
                    None
                }
            }
            "cloze" => {
                if let (Some(bank), Some(correct)) = (
                    locale_obj.get("bank").and_then(|v| v.as_array()),
                    locale_obj.get("correct").and_then(|v| v.as_str()),
                ) {
                    let in_bank = bank.iter().any(|b| b.as_str() == Some(correct));
                    if !in_bank {
                        Some(ImportIssue {
                            severity: IssueSeverity::Error,
                            location: loc,
                            message: format!(
                                "Cloze correct word '{}' does not exist in word bank",
                                correct
                            ),
                        })
                    } else {
                        None
                    }
                } else {
                    None
                }
            }
            _ => None,
        };

        if let Some(iss) = issue {
            event_sink.emit(
                "import:issue",
                serde_json::json!({
                    "severity": "error",
                    "location": iss.location,
                    "message": iss.message,
                }),
            );
            issues.push(iss);
        }
    };

    if let Some(en) = q_obj.get("en").and_then(|v| v.as_object()) {
        check_and_record(en, "en");
    }
    if let Some(ar) = q_obj.get("ar").and_then(|v| v.as_object()) {
        check_and_record(ar, "ar");
    }
    check_and_record(q_obj, "root");
}

#[allow(dead_code)]
struct ProcessedLeaf {
    orig_idx: usize,
    leaf_id: String,
    node_val: serde_json::Value,
    issues: Vec<ImportIssue>,
    auto_fills: Vec<AutoFillEntry>,
    question_count: usize,
    block_count: usize,
}

pub fn import_book_with_sink(
    json_content: &str,
    event_sink: &(dyn ImportEventSink + Sync),
) -> Result<DryRunReport, String> {
    let mut root_val: serde_json::Value = serde_json::from_str(json_content)
        .map_err(|e| format!("Failed to parse book JSON: {}", e))?;

    let book_id = root_val
        .get("id")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown_book")
        .to_string();

    let mut global_issues: Vec<ImportIssue> = Vec::new();
    let mut global_auto_fills: Vec<AutoFillEntry> = Vec::new();

    let nodes_array = root_val
        .get_mut("nodes")
        .and_then(|n| n.as_array_mut())
        .ok_or_else(|| "Book JSON is missing 'nodes' array".to_string())?;

    let total_nodes = nodes_array.len();

    // 1. Emit import:started
    event_sink.emit(
        "import:started",
        serde_json::json!({
            "book_id": book_id,
            "total_nodes": total_nodes,
        }),
    );

    // Auto-fill node coordinates
    auto_fill_node_coordinates(nodes_array, &mut global_auto_fills);

    // 2. Emit import:tree-ready (light tree structure)
    let light_tree: Vec<serde_json::Value> = nodes_array
        .iter()
        .map(|n| {
            serde_json::json!({
                "id": n.get("id"),
                "level": n.get("level"),
                "parent": n.get("parent"),
                "ar": n.get("ar"),
                "en": n.get("en"),
            })
        })
        .collect();

    event_sink.emit(
        "import:tree-ready",
        serde_json::json!({
            "book_id": book_id,
            "tree": light_tree,
        }),
    );

    // Separate leaves for Rayon parallel processing
    let mut non_leaves: Vec<(usize, serde_json::Value)> = Vec::new();
    let mut leaves_to_process: Vec<(usize, serde_json::Value)> = Vec::new();

    for (idx, node) in nodes_array.drain(..).enumerate() {
        let is_leaf = node.get("level").and_then(|l| l.as_str()) == Some("leaf");
        if is_leaf {
            leaves_to_process.push((idx, node));
        } else {
            non_leaves.push((idx, node));
        }
    }

    let total_leaves = leaves_to_process.len();

    // 3. Rayon parallel processing on leaves
    let processed_leaves: Vec<ProcessedLeaf> = leaves_to_process
        .into_par_iter()
        .map(|(orig_idx, mut node_val)| {
            let leaf_id = node_val
                .get("id")
                .and_then(|id| id.as_str())
                .unwrap_or("leaf")
                .to_string();

            let mut leaf_issues = Vec::new();
            let mut leaf_auto_fills = Vec::new();
            let mut question_count = 0;
            let mut block_count = 0;

            let loc = format!("leaf:{}", leaf_id);

            // Auto-fill and validate pageBlocks
            if let Some(blocks) = node_val.get_mut("pageBlocks").and_then(|p| p.as_array_mut()) {
                block_count = blocks.len();
                for (b_idx, b_val) in blocks.iter_mut().enumerate() {
                    auto_fill_content_block(b_val, &loc, &mut leaf_auto_fills, &mut leaf_issues, event_sink);
                    let b_id = b_val.get("id").and_then(|v| v.as_str()).unwrap_or("unknown");
                    if let Err(err) = validate_content_block(b_val, true) {
                        let iss = ImportIssue {
                            severity: IssueSeverity::Error,
                            location: format!("leaf:{} -> pageBlock:{} (idx: {})", leaf_id, b_id, b_idx),
                            message: err,
                        };
                        event_sink.emit(
                            "import:issue",
                            serde_json::json!({
                                "severity": "error",
                                "location": iss.location,
                                "message": iss.message,
                            }),
                        );
                        leaf_issues.push(iss);
                    }
                }
            }

            // Auto-fill and validate questions
            let mut check_qs = |qs: &mut Vec<serde_json::Value>| {
                question_count += qs.len();
                for q in qs.iter_mut() {
                    let q_id = q.get("id").and_then(|v| v.as_str()).unwrap_or("q").to_string();
                    let q_loc = format!("leaf:{} -> question:{}", leaf_id, q_id);
                    if let Some(content) = q.get_mut("content").and_then(|c| c.as_array_mut()) {
                        for b in content.iter_mut() {
                            auto_fill_content_block(b, &q_loc, &mut leaf_auto_fills, &mut leaf_issues, event_sink);
                        }
                    }
                    validate_question_details(q, &leaf_id, &mut leaf_issues, event_sink);
                }
            };

            if let Some(cards) = node_val.get_mut("cards").and_then(|c| c.as_array_mut()) {
                for card in cards {
                    if let Some(groups) = card.get_mut("questionGroups").and_then(|g| g.as_array_mut()) {
                        for g in groups {
                            if let Some(qs) = g.get_mut("questions").and_then(|q| q.as_array_mut()) {
                                check_qs(qs);
                            }
                        }
                    }
                    if let Some(qs) = card.get_mut("questions").and_then(|q| q.as_array_mut()) {
                        check_qs(qs);
                    }
                }
            }

            if let Some(qs) = node_val.get_mut("questions").and_then(|q| q.as_array_mut()) {
                check_qs(qs);
            }

            // Emit import:leaf-ready
            event_sink.emit(
                "import:leaf-ready",
                serde_json::json!({
                    "book_id": book_id,
                    "leaf_id": leaf_id,
                    "question_count": question_count,
                    "block_count": block_count,
                }),
            );

            ProcessedLeaf {
                orig_idx,
                leaf_id,
                node_val,
                issues: leaf_issues,
                auto_fills: leaf_auto_fills,
                question_count,
                block_count,
            }
        })
        .collect();

    // 4. Re-assemble nodes deterministically in their original tree sequence
    let mut all_assembled: Vec<(usize, serde_json::Value)> = non_leaves;
    let mut total_questions = 0;

    // Collect leaf results in exact original tree order
    let mut sorted_leaves = processed_leaves;
    sorted_leaves.sort_by_key(|l| l.orig_idx);

    for l in sorted_leaves {
        total_questions += l.question_count;
        global_issues.extend(l.issues);
        global_auto_fills.extend(l.auto_fills);
        all_assembled.push((l.orig_idx, l.node_val));
    }

    all_assembled.sort_by_key(|(idx, _)| *idx);
    let final_nodes: Vec<serde_json::Value> = all_assembled.into_iter().map(|(_, n)| n).collect();
    root_val["nodes"] = serde_json::Value::Array(final_nodes);

    // 5. Final validation using existing validator
    let book: ExportBook = serde_json::from_value(root_val.clone())
        .map_err(|e| format!("Failed to parse book structure: {}", e))?;

    let v_info: ValidationInfo = validate_book_structure(&book);
    if let Some(ref err) = v_info.error {
        let iss = ImportIssue {
            severity: IssueSeverity::Error,
            location: format!("book:{}", book.id),
            message: err.clone(),
        };
        event_sink.emit(
            "import:issue",
            serde_json::json!({
                "severity": "error",
                "location": iss.location,
                "message": iss.message,
            }),
        );
        global_issues.push(iss);
    }

    let has_errors = global_issues.iter().any(|i| i.severity == IssueSeverity::Error);
    let auto_filled_str = serde_json::to_string(&root_val).ok();
    let is_valid = !has_errors && v_info.error.is_none();

    let report = DryRunReport {
        is_valid,
        book_id: book.id,
        title_ar: book.ar.title,
        title_en: book.en.title,
        node_count: book.nodes.len(),
        branch_count: v_info.branch_count,
        leaf_count: total_leaves,
        question_count: total_questions,
        issues: global_issues,
        auto_fills: global_auto_fills,
        auto_filled_json: auto_filled_str,
    };

    // 6. Emit import:completed or import:failed
    if is_valid {
        event_sink.emit("import:completed", serde_json::to_value(&report).unwrap());
    } else {
        event_sink.emit("import:failed", serde_json::to_value(&report).unwrap());
    }

    Ok(report)
}

pub fn import_book_dry_run(json_content: &str) -> Result<DryRunReport, String> {
    import_book_with_sink(json_content, &NoopEventSink)
}

pub fn save_imported_book_transactional(
    books_dir: &Path,
    book_id: &str,
    final_json: &str,
) -> Result<PathBuf, String> {
    if !books_dir.exists() {
        return Err(format!("Books directory does not exist: {}", books_dir.display()));
    }

    let nonce = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();

    let staging_dir = books_dir.join(format!(".tmp_{}_{}", book_id, nonce));
    let target_dir = books_dir.join(book_id);
    let backup_dir = books_dir.join(format!(".backup_{}_{}", book_id, nonce));

    // 1. Create staging folder
    fs::create_dir_all(&staging_dir).map_err(|e| format!("Failed to create staging dir: {}", e))?;

    // 2. Write book.json into staging folder
    let staging_file = staging_dir.join("book.json");
    if let Err(e) = fs::write(&staging_file, final_json) {
        let _ = fs::remove_dir_all(&staging_dir);
        return Err(format!("Failed to write book.json in staging: {}", e));
    }

    // 3. Dry-run validate the staged file content before commit
    match import_book_dry_run(final_json) {
        Ok(rep) if rep.is_valid => {}
        Ok(rep) => {
            let _ = fs::remove_dir_all(&staging_dir);
            return Err(format!(
                "Staged book is invalid ({} issues found)",
                rep.issues.len()
            ));
        }
        Err(e) => {
            let _ = fs::remove_dir_all(&staging_dir);
            return Err(format!("Staged book failed dry run: {}", e));
        }
    }

    // 4. Atomic swap with rollback
    let had_previous = target_dir.exists();
    if had_previous {
        if let Err(e) = fs::rename(&target_dir, &backup_dir) {
            let _ = fs::remove_dir_all(&staging_dir);
            return Err(format!("Failed to backup existing book: {}", e));
        }
    }

    if let Err(e) = fs::rename(&staging_dir, &target_dir) {
        // Rollback!
        if had_previous && backup_dir.exists() {
            let _ = fs::rename(&backup_dir, &target_dir);
        }
        let _ = fs::remove_dir_all(&staging_dir);
        return Err(format!("Failed to commit imported book: {}", e));
    }

    // 5. Cleanup backup after successful commit
    if had_previous && backup_dir.exists() {
        let _ = fs::remove_dir_all(&backup_dir);
    }

    Ok(target_dir)
}
