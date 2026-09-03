use super::types::BookState;
use crate::export_engine::types::ExportBook;

pub struct ValidationInfo {
    pub state: BookState,
    pub error: Option<String>,
    pub node_count: usize,
    pub question_count: usize,
    pub branch_count: usize,
}

pub fn validate_content_block(block: &serde_json::Value, allow_pagebreak: bool) -> Result<(), String> {
    let obj = match block.as_object() {
        Some(o) => o,
        None => return Err("ContentBlock must be a JSON object".to_string()),
    };

    let block_id = obj
        .get("id")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown_block");
    let kind = match obj.get("kind").and_then(|v| v.as_str()) {
        Some(k) => k,
        None => return Err(format!("Block '{}' missing mandatory 'kind'", block_id)),
    };

    match kind {
        "pagebreak" => {
            if !allow_pagebreak {
                return Err(format!(
                    "Block '{}': pagebreak is forbidden inside Question content",
                    block_id
                ));
            }
        }
        "table" => {
            let headers = obj
                .get("headers")
                .and_then(|h| h.as_array())
                .ok_or_else(|| format!("Table block '{}' missing 'headers' array", block_id))?;

            if headers.is_empty() {
                return Err(format!(
                    "Table block '{}': 'headers' array must have at least 1 column",
                    block_id
                ));
            }

            let headers_len = headers.len();
            let rows = obj
                .get("rows")
                .and_then(|r| r.as_array())
                .ok_or_else(|| format!("Table block '{}' missing 'rows' array", block_id))?;

            for (row_idx, row_val) in rows.iter().enumerate() {
                let row = row_val.as_array().ok_or_else(|| {
                    format!(
                        "Table block '{}' row {} must be an array of cells",
                        block_id,
                        row_idx + 1
                    )
                })?;

                if row.len() != headers_len {
                    return Err(format!(
                        "Table block '{}' row {} length ({}) does not match headers length ({})",
                        block_id,
                        row_idx + 1,
                        row.len(),
                        headers_len
                    ));
                }
            }
        }
        "sectionTitle" | "text" => {
            let text = obj
                .get("text")
                .and_then(|t| t.as_str())
                .ok_or_else(|| format!("Block '{}' ({}) missing 'text'", block_id, kind))?;
            if text.trim().is_empty() {
                return Err(format!("Block '{}' ({}) 'text' cannot be empty", block_id, kind));
            }
        }
        "keyterm" | "note" | "warning" | "important" => {
            let text = obj
                .get("text")
                .and_then(|t| t.as_str())
                .ok_or_else(|| format!("Block '{}' ({}) missing 'text'", block_id, kind))?;
            if text.trim().is_empty() {
                return Err(format!("Block '{}' ({}) 'text' cannot be empty", block_id, kind));
            }
        }
        "code" => {
            let text = obj
                .get("text")
                .and_then(|t| t.as_str())
                .ok_or_else(|| format!("Code block '{}' missing 'text'", block_id))?;
            if text.trim().is_empty() {
                return Err(format!("Code block '{}' 'text' cannot be empty", block_id));
            }
        }
        "image" => {
            let is_placeholder = obj
                .get("isPlaceholder")
                .and_then(|p| p.as_bool())
                .unwrap_or(false);
            if !is_placeholder {
                let url = obj.get("imageUrl").and_then(|u| u.as_str()).unwrap_or("");
                if url.trim().is_empty() {
                    return Err(format!(
                        "Image block '{}' missing valid 'imageUrl' (or isPlaceholder)",
                        block_id
                    ));
                }
            }
        }
        unknown => {
            return Err(format!(
                "Block '{}' has unrecognized kind '{}'",
                block_id, unknown
            ));
        }
    }

    Ok(())
}

fn validate_question_content(q_val: &serde_json::Value) -> Result<(), String> {
    let q_obj = match q_val.as_object() {
        Some(o) => o,
        None => return Ok(()),
    };

    let check_content_array = |arr: &serde_json::Value| -> Result<(), String> {
        if let Some(blocks) = arr.as_array() {
            for b in blocks {
                validate_content_block(b, false)?;
            }
        }
        Ok(())
    };

    if let Some(c) = q_obj.get("content") {
        check_content_array(c)?;
    }
    if let Some(en) = q_obj.get("en").and_then(|v| v.as_object()) {
        if let Some(c) = en.get("content") {
            check_content_array(c)?;
        }
    }
    if let Some(ar) = q_obj.get("ar").and_then(|v| v.as_object()) {
        if let Some(c) = ar.get("content") {
            check_content_array(c)?;
        }
    }

    Ok(())
}

pub fn validate_book_structure(book: &ExportBook) -> ValidationInfo {
    if book.id.trim().is_empty() {
        return ValidationInfo {
            state: BookState::Invalid,
            error: Some("Book ID cannot be empty".to_string()),
            node_count: 0,
            question_count: 0,
            branch_count: 0,
        };
    }

    let has_title = !book.ar.title.trim().is_empty() || !book.en.title.trim().is_empty();
    if !has_title {
        return ValidationInfo {
            state: BookState::Incomplete,
            error: Some("Book is missing both Arabic and English titles".to_string()),
            node_count: book.nodes.len(),
            question_count: 0,
            branch_count: 0,
        };
    }

    if book.nodes.is_empty() {
        return ValidationInfo {
            state: BookState::Incomplete,
            error: Some("Book curriculum tree has no nodes".to_string()),
            node_count: 0,
            question_count: 0,
            branch_count: 0,
        };
    }

    let mut branch_count = 0;
    let mut question_count = 0;

    for node in &book.nodes {
        if node.level == "branch" {
            branch_count += 1;
        } else if node.level == "leaf" {
            // 1. Validate pageBlocks if present
            if let Some(page_blocks) = node.extra.get("pageBlocks").and_then(|p| p.as_array()) {
                for b in page_blocks {
                    if let Err(err) = validate_content_block(b, true) {
                        return ValidationInfo {
                            state: BookState::Invalid,
                            error: Some(format!("Leaf '{}' pageBlocks error: {}", node.id, err)),
                            node_count: book.nodes.len(),
                            question_count,
                            branch_count,
                        };
                    }
                }
            }

            // 2. Validate cards and questions
            if let Some(cards) = node.extra.get("cards").and_then(|c| c.as_array()) {
                for card in cards {
                    if let Some(groups) = card.get("questionGroups").and_then(|g| g.as_array()) {
                        for g in groups {
                            if let Some(qs) = g.get("questions").and_then(|q| q.as_array()) {
                                question_count += qs.len();
                                for q in qs {
                                    if let Err(err) = validate_question_content(q) {
                                        return ValidationInfo {
                                            state: BookState::Invalid,
                                            error: Some(format!("Leaf '{}' question error: {}", node.id, err)),
                                            node_count: book.nodes.len(),
                                            question_count,
                                            branch_count,
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            } else if let Some(qs) = node.extra.get("questions").and_then(|q| q.as_array()) {
                question_count += qs.len();
                for q in qs {
                    if let Err(err) = validate_question_content(q) {
                        return ValidationInfo {
                            state: BookState::Invalid,
                            error: Some(format!("Leaf '{}' question error: {}", node.id, err)),
                            node_count: book.nodes.len(),
                            question_count,
                            branch_count,
                        };
                    }
                }
            }
        }
    }

    ValidationInfo {
        state: BookState::Valid,
        error: None,
        node_count: book.nodes.len(),
        question_count,
        branch_count,
    }
}
