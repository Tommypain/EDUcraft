use super::types::BookState;
use crate::export_engine::types::ExportBook;

pub struct ValidationInfo {
    pub state: BookState,
    pub error: Option<String>,
    pub node_count: usize,
    pub question_count: usize,
    pub branch_count: usize,
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
            if let Some(cards) = node.extra.get("cards").and_then(|c| c.as_array()) {
                for card in cards {
                    if let Some(groups) = card.get("questionGroups").and_then(|g| g.as_array()) {
                        for g in groups {
                            if let Some(qs) = g.get("questions").and_then(|q| q.as_array()) {
                                question_count += qs.len();
                            }
                        }
                    }
                }
            } else if let Some(qs) = node.extra.get("questions").and_then(|q| q.as_array()) {
                question_count += qs.len();
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
