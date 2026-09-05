//! Declarative Plugin Engine
//!
//! Evaluates purely declarative plugin definitions without arbitrary code execution.
//! Handles custom content blocks, custom themes, views, question archetypes, and macros.

use super::types::TitaniumError;
use crate::contracts::{
    PluginBlockContribution, PluginContributions, PluginManifest, PluginQuestionContribution,
    PluginThemeContribution, PluginViewContribution,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

fn default_question_points() -> f32 {
    1.0
}

/// Definition for a declarative custom content block.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DeclarativeBlockDef {
    pub kind: String,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub default_fields: HashMap<String, serde_json::Value>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub required_fields: Vec<String>,
    /// Template string with `{{field_name}}` placeholders.
    pub render_template: String,
}

impl DeclarativeBlockDef {
    /// Render the block template with provided fields.
    pub fn render(&self, fields: &HashMap<String, serde_json::Value>) -> Result<String, TitaniumError> {
        // Validate required fields
        for req in &self.required_fields {
            if !fields.contains_key(req) && !self.default_fields.contains_key(req) {
                return Err(TitaniumError::InvalidManifest(format!(
                    "Block '{}' missing required field '{}'",
                    self.kind, req
                )));
            }
        }

        let mut output = self.render_template.clone();

        // Merge fields (defaults overridden by actual fields)
        let mut merged = self.default_fields.clone();
        for (k, v) in fields {
            merged.insert(k.clone(), v.clone());
        }

        // Replace placeholders
        for (k, v) in merged {
            let val_str = match v {
                serde_json::Value::String(s) => s,
                serde_json::Value::Number(n) => n.to_string(),
                serde_json::Value::Bool(b) => b.to_string(),
                serde_json::Value::Null => String::new(),
                other => other.to_string(),
            };
            let placeholder = format!("{{{{{}}}}}", k);
            output = output.replace(&placeholder, &val_str);
        }

        Ok(output)
    }
}

/// Definition for a declarative theme with CSS custom properties.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DeclarativeThemeDef {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub is_dark: bool,
    pub variables: HashMap<String, String>,
}

impl DeclarativeThemeDef {
    /// Generate standard CSS rule for this theme.
    pub fn to_css(&self) -> String {
        let mut css = format!(":root[data-theme=\"{}\"] {{\n", self.id);
        let mut sorted_vars: Vec<_> = self.variables.iter().collect();
        sorted_vars.sort_by_key(|&(k, _)| k);
        for (var, val) in sorted_vars {
            let var_name = if var.starts_with("--") {
                var.clone()
            } else {
                format!("--{}", var)
            };
            css.push_str(&format!("  {}: {};\n", var_name, val));
        }
        css.push_str("}\n");
        css
    }
}

/// Definition for a declarative UI view or panel.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DeclarativeViewDef {
    pub id: String,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,
    pub target_pane: String, // "sidebar" | "editor_toolbar" | "footer_tray" | "modal"
    pub component_type: String, // "markdown_preview" | "inspector" | "glossary" | "asset_gallery"
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub settings: HashMap<String, serde_json::Value>,
}

/// Definition for a declarative question archetype.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DeclarativeQuestionDef {
    #[serde(rename = "type")]
    pub question_type: String,
    pub title: String,
    #[serde(default = "default_question_points")]
    pub default_points: f32,
    pub scoring_mode: String, // "exact" | "partial" | "boolean"
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub schema: HashMap<String, serde_json::Value>,
}

/// Definition for a shortcode / macro processor.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DeclarativeMacroDef {
    pub tag: String,
    pub template: String,
}

impl DeclarativeMacroDef {
    /// Expand [tag key="val"]content[/tag] in text.
    pub fn expand(&self, input: &str) -> String {
        let open_tag_prefix = format!("[{}", self.tag);
        let close_tag = format!("[/{}]", self.tag);

        let mut result = input.to_string();
        while let Some(start_idx) = result.find(&open_tag_prefix) {
            let after_open = &result[start_idx..];
            if let Some(open_tag_end) = after_open.find(']') {
                let open_tag_full = &after_open[..=open_tag_end];
                let content_start = start_idx + open_tag_end + 1;

                if let Some(close_rel_idx) = result[content_start..].find(&close_tag) {
                    let content_end = content_start + close_rel_idx;
                    let inner_content = &result[content_start..content_end];
                    let total_end = content_end + close_tag.len();

                    // Parse attributes in open tag: [tag attr="val"]
                    let attr_slice = &open_tag_full[open_tag_prefix.len()..open_tag_full.len() - 1];
                    let mut attrs = HashMap::new();
                    for part in attr_slice.split_whitespace() {
                        if let Some((k, v)) = part.split_once('=') {
                            let clean_v = v.trim_matches('"').trim_matches('\'');
                            attrs.insert(k.trim().to_string(), clean_v.to_string());
                        }
                    }

                    // Render macro template
                    let mut rendered = self.template.replace("{{content}}", inner_content);
                    for (k, v) in attrs {
                        rendered = rendered.replace(&format!("{{{{{}}}}}", k), &v);
                    }

                    // Replace remaining unmatched {{attr}} placeholders with empty string
                    while let Some(p_start) = rendered.find("{{") {
                        if let Some(p_end) = rendered[p_start..].find("}}") {
                            rendered.replace_range(p_start..p_start + p_end + 2, "");
                        } else {
                            break;
                        }
                    }

                    result.replace_range(start_idx..total_end, &rendered);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        result
    }
}

/// A complete, standalone declarative plugin package.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DeclarativePlugin {
    pub manifest: PluginManifest,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub content_blocks: Vec<DeclarativeBlockDef>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub themes: Vec<DeclarativeThemeDef>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub views: Vec<DeclarativeViewDef>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub question_types: Vec<DeclarativeQuestionDef>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub macros: Vec<DeclarativeMacroDef>,
}

impl DeclarativePlugin {
    /// Ingest from raw JSON representation.
    pub fn from_json_value(val: &serde_json::Value) -> Result<Self, TitaniumError> {
        serde_json::from_value(val.clone()).map_err(|e| TitaniumError::InvalidManifest(e.to_string()))
    }

    /// Sync manifest contributions from the declarative definitions.
    pub fn sync_manifest_contributions(&mut self) {
        let views: Vec<PluginViewContribution> = self
            .views
            .iter()
            .map(|v| PluginViewContribution {
                id: v.id.clone(),
                title: v.title.clone(),
                icon: v.icon.clone(),
            })
            .collect();

        let themes: Vec<PluginThemeContribution> = self
            .themes
            .iter()
            .map(|t| PluginThemeContribution {
                id: t.id.clone(),
                name: t.name.clone(),
                file: format!("themes/{}.css", t.id),
            })
            .collect();

        let content_blocks: Vec<PluginBlockContribution> = self
            .content_blocks
            .iter()
            .map(|b| PluginBlockContribution {
                kind: b.kind.clone(),
                title: b.title.clone(),
            })
            .collect();

        let question_types: Vec<PluginQuestionContribution> = self
            .question_types
            .iter()
            .map(|q| PluginQuestionContribution {
                question_type: q.question_type.clone(),
                title: q.title.clone(),
            })
            .collect();

        self.manifest.contributions = Some(PluginContributions {
            views,
            themes,
            content_blocks,
            question_types,
        });
    }

    /// Render a block of given kind using this plugin's definitions.
    pub fn render_block(&self, kind: &str, fields: &HashMap<String, serde_json::Value>) -> Option<String> {
        let block_def = self.content_blocks.iter().find(|b| b.kind == kind)?;
        block_def.render(fields).ok()
    }

    /// Run all macro expansions in this plugin over input text.
    pub fn expand_macros(&self, input: &str) -> String {
        let mut text = input.to_string();
        for m in &self.macros {
            text = m.expand(&text);
        }
        text
    }

    /// Generate CSS for a declared theme by id.
    pub fn generate_theme_css(&self, theme_id: &str) -> Option<String> {
        let theme = self.themes.iter().find(|t| t.id == theme_id)?;
        Some(theme.to_css())
    }
}
