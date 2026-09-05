//! Unified Block and Question Registry with Robust Fallback Handling
//!
//! Bridges EDUcraft's 9 built-in content blocks and 13 core questions with dynamic plugin extensions.
//! Guarantees that unknown or uninstalled blocks and questions render safely as structured fallbacks.

use super::declarative::{DeclarativeBlockDef, DeclarativeQuestionDef};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};

pub const CORE_BLOCK_KINDS: &[&str] = &[
    "sectionTitle",
    "subtitle",
    "text",
    "note",
    "keyterm",
    "important",
    "quote",
    "table",
    "cardGrid",
];

pub const CORE_QUESTION_TYPES: &[&str] = &[
    "multiple_choice",
    "single_choice",
    "true_false",
    "cloze",
    "matching",
    "sorting",
    "short_answer",
    "fill_blank",
    "ordering",
    "classification",
    "diagram_label",
    "matrix",
    "code_runner",
];

/// Result of rendering a content block.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct RenderedBlock {
    pub kind: String,
    pub html: String,
    pub is_fallback: bool,
}

/// Registry managing all available content block types.
#[derive(Debug, Clone)]
pub struct BlockRegistry {
    built_in: HashSet<String>,
    custom: HashMap<String, DeclarativeBlockDef>,
}

impl Default for BlockRegistry {
    fn default() -> Self {
        let mut built_in = HashSet::new();
        for &k in CORE_BLOCK_KINDS {
            built_in.insert(k.to_string());
        }
        Self {
            built_in,
            custom: HashMap::new(),
        }
    }
}

impl BlockRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn is_supported(&self, kind: &str) -> bool {
        self.built_in.contains(kind) || self.custom.contains_key(kind)
    }

    pub fn is_built_in(&self, kind: &str) -> bool {
        self.built_in.contains(kind)
    }

    pub fn register_custom(&mut self, block_def: DeclarativeBlockDef) {
        self.custom.insert(block_def.kind.clone(), block_def);
    }

    pub fn unregister_custom(&mut self, kind: &str) {
        self.custom.remove(kind);
    }

    /// Render a block safely. If unrecognized, renders an informative structured fallback.
    pub fn render_or_fallback(&self, block_val: &serde_json::Value) -> RenderedBlock {
        let kind = block_val
            .get("kind")
            .and_then(|v| v.as_str())
            .unwrap_or("unknown");

        // 1. Custom block definition
        if let Some(def) = self.custom.get(kind) {
            let fields: HashMap<String, serde_json::Value> = block_val
                .as_object()
                .map(|obj| obj.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
                .unwrap_or_default();

            if let Ok(html) = def.render(&fields) {
                return RenderedBlock {
                    kind: kind.to_string(),
                    html,
                    is_fallback: false,
                };
            }
        }

        // 2. Built-in block (default standard rendering placeholder)
        if self.built_in.contains(kind) {
            let text = block_val
                .get("text")
                .and_then(|v| v.as_str())
                .unwrap_or("");
            let title = block_val
                .get("title")
                .and_then(|v| v.as_str())
                .unwrap_or("");

            let html = format!(
                r#"<div class="educraft-block educraft-block-{}" data-kind="{}"><h3>{}</h3><p>{}</p></div>"#,
                kind, kind, title, text
            );
            return RenderedBlock {
                kind: kind.to_string(),
                html,
                is_fallback: false,
            };
        }

        // 3. Fallback for unknown / disabled plugin block
        let pretty_json = serde_json::to_string_pretty(block_val).unwrap_or_default();
        let fallback_html = format!(
            r#"<div class="educraft-fallback-block" data-unsupported-kind="{}"><div class="fallback-badge">Extension Block Placeholder: {}</div><pre class="fallback-data">{}</pre></div>"#,
            kind, kind, pretty_json
        );

        RenderedBlock {
            kind: kind.to_string(),
            html: fallback_html,
            is_fallback: true,
        }
    }
}

/// Evaluation result for student question submission.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct QuestionScore {
    pub question_type: String,
    pub score: f32,
    pub max_score: f32,
    pub is_correct: bool,
    pub is_fallback: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub feedback: Option<String>,
}

/// Registry managing all available question archetypes and grading evaluators.
#[derive(Debug, Clone)]
pub struct QuestionRegistry {
    built_in: HashSet<String>,
    custom: HashMap<String, DeclarativeQuestionDef>,
}

impl Default for QuestionRegistry {
    fn default() -> Self {
        let mut built_in = HashSet::new();
        for &q in CORE_QUESTION_TYPES {
            built_in.insert(q.to_string());
        }
        Self {
            built_in,
            custom: HashMap::new(),
        }
    }
}

impl QuestionRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn is_supported(&self, q_type: &str) -> bool {
        self.built_in.contains(q_type) || self.custom.contains_key(q_type)
    }

    pub fn register_custom(&mut self, q_def: DeclarativeQuestionDef) {
        self.custom.insert(q_def.question_type.clone(), q_def);
    }

    pub fn unregister_custom(&mut self, q_type: &str) {
        self.custom.remove(q_type);
    }

    /// Evaluate a question response. Fallback to basic string comparison if custom or unsupported.
    pub fn evaluate_submission(
        &self,
        q_type: &str,
        submission: &serde_json::Value,
        correct_answer: &serde_json::Value,
    ) -> QuestionScore {
        let max_score = self
            .custom
            .get(q_type)
            .map(|q| q.default_points)
            .unwrap_or(1.0);

        if !self.is_supported(q_type) {
            return QuestionScore {
                question_type: q_type.to_string(),
                score: 0.0,
                max_score,
                is_correct: false,
                is_fallback: true,
                feedback: Some(format!("Unsupported question type '{}'", q_type)),
            };
        }

        // Standard matching (direct equality or normalized string check)
        let is_correct = submission == correct_answer
            || match (submission.as_str(), correct_answer.as_str()) {
                (Some(s), Some(c)) => s.trim().eq_ignore_ascii_case(c.trim()),
                _ => false,
            };

        let score = if is_correct { max_score } else { 0.0 };

        QuestionScore {
            question_type: q_type.to_string(),
            score,
            max_score,
            is_correct,
            is_fallback: false,
            feedback: if is_correct {
                Some("Correct!".to_string())
            } else {
                Some("Incorrect.".to_string())
            },
        }
    }
}
