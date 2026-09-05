//! Dynamic Runtime Capabilities representation and negotiation.

use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RuntimeCapabilities {
    pub images: bool,
    pub questions: bool,
    pub mindmap: bool,
    pub canvas_a4: bool,
    pub katex: bool,
    pub code_highlight: bool,
    pub audio: bool,
    pub video: bool,
    pub editor: bool,
    #[serde(default, skip_serializing_if = "HashSet::is_empty")]
    pub custom: HashSet<String>,
}

impl Default for RuntimeCapabilities {
    fn default() -> Self {
        Self {
            images: true,
            questions: true,
            mindmap: true,
            canvas_a4: true,
            katex: true,
            code_highlight: true,
            audio: false,
            video: false,
            editor: true,
            custom: HashSet::new(),
        }
    }
}

impl RuntimeCapabilities {
    /// Negotiate runtime capabilities from a book's declared capability list.
    /// If empty, defaults to full standard profile.
    pub fn negotiate(declared: &[String]) -> Self {
        if declared.is_empty() {
            return Self::default();
        }

        let set: HashSet<String> = declared
            .iter()
            .map(|s| s.to_lowercase().trim().to_string())
            .collect();

        let mut custom = HashSet::new();
        const STANDARD: &[&str] = &[
            "images", "image", "questions", "quiz", "mindmap", "tree",
            "canvas_a4", "a4", "katex", "math", "latex",
            "code_highlight", "prism", "code", "audio", "video", "editor",
        ];

        for item in &set {
            if !STANDARD.contains(&item.as_str()) {
                custom.insert(item.clone());
            }
        }

        Self {
            images: set.contains("images") || set.contains("image"),
            questions: set.contains("questions") || set.contains("quiz"),
            mindmap: set.contains("mindmap") || set.contains("tree"),
            canvas_a4: set.contains("canvas_a4") || set.contains("a4"),
            katex: set.contains("katex") || set.contains("math") || set.contains("latex"),
            code_highlight: set.contains("code_highlight")
                || set.contains("prism")
                || set.contains("code"),
            audio: set.contains("audio"),
            video: set.contains("video"),
            editor: set.contains("editor"),
            custom,
        }
    }

    pub fn can(&self, capability: &str) -> bool {
        match capability.to_lowercase().as_str() {
            "images" | "image" => self.images,
            "questions" | "quiz" => self.questions,
            "mindmap" | "tree" => self.mindmap,
            "canvas_a4" | "a4" => self.canvas_a4,
            "katex" | "math" | "latex" => self.katex,
            "code_highlight" | "prism" | "code" => self.code_highlight,
            "audio" => self.audio,
            "video" => self.video,
            "editor" => self.editor,
            other => self.custom.contains(other),
        }
    }

    pub fn with_capability(mut self, cap: impl Into<String>) -> Self {
        let c = cap.into();
        match c.to_lowercase().as_str() {
            "images" | "image" => self.images = true,
            "questions" | "quiz" => self.questions = true,
            "mindmap" | "tree" => self.mindmap = true,
            "canvas_a4" | "a4" => self.canvas_a4 = true,
            "katex" | "math" | "latex" => self.katex = true,
            "code_highlight" | "prism" | "code" => self.code_highlight = true,
            "audio" => self.audio = true,
            "video" => self.video = true,
            "editor" => self.editor = true,
            other => {
                self.custom.insert(other.to_string());
            }
        }
        self
    }
}
