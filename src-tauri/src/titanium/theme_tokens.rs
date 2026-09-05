//! Design Token Registry and Theme Stylesheet Generator
//!
//! Standardizes typography, spacing, border radii, shadows, colors, and RTL layout mirrors.

use super::declarative::DeclarativeThemeDef;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Standard EDUcraft design token definition.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DesignTokens {
    pub font_sans: String,
    pub font_mono: String,
    pub font_arabic: String,
    pub space_xs: String,
    pub space_sm: String,
    pub space_md: String,
    pub space_lg: String,
    pub space_xl: String,
    pub radius_sm: String,
    pub radius_md: String,
    pub radius_lg: String,
    pub radius_full: String,
}

impl Default for DesignTokens {
    fn default() -> Self {
        Self {
            font_sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif".to_string(),
            font_mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace".to_string(),
            font_arabic: "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif".to_string(),
            space_xs: "0.25rem".to_string(),
            space_sm: "0.5rem".to_string(),
            space_md: "1rem".to_string(),
            space_lg: "1.5rem".to_string(),
            space_xl: "2rem".to_string(),
            radius_sm: "0.25rem".to_string(),
            radius_md: "0.5rem".to_string(),
            radius_lg: "0.75rem".to_string(),
            radius_full: "9999px".to_string(),
        }
    }
}

impl DesignTokens {
    pub fn to_css_variables(&self) -> HashMap<String, String> {
        let mut map = HashMap::new();
        map.insert("--font-sans".to_string(), self.font_sans.clone());
        map.insert("--font-mono".to_string(), self.font_mono.clone());
        map.insert("--font-arabic".to_string(), self.font_arabic.clone());
        map.insert("--space-xs".to_string(), self.space_xs.clone());
        map.insert("--space-sm".to_string(), self.space_sm.clone());
        map.insert("--space-md".to_string(), self.space_md.clone());
        map.insert("--space-lg".to_string(), self.space_lg.clone());
        map.insert("--space-xl".to_string(), self.space_xl.clone());
        map.insert("--radius-sm".to_string(), self.radius_sm.clone());
        map.insert("--radius-md".to_string(), self.radius_md.clone());
        map.insert("--radius-lg".to_string(), self.radius_lg.clone());
        map.insert("--radius-full".to_string(), self.radius_full.clone());
        map
    }
}

/// Generates a comprehensive CSS stylesheet for a theme including base tokens and RTL adjustments.
pub fn generate_theme_stylesheet(theme: &DeclarativeThemeDef, is_rtl: bool) -> String {
    let tokens = DesignTokens::default();
    let mut vars = tokens.to_css_variables();

    // Overlay theme custom variables
    for (k, v) in &theme.variables {
        let var_name = if k.starts_with("--") {
            k.clone()
        } else {
            format!("--{}", k)
        };
        vars.insert(var_name, v.clone());
    }

    let dir_attr = if is_rtl { r#"[dir="rtl"]"# } else { r#"[dir="ltr"]"# };
    let mut css = format!(":root[data-theme=\"{}\"]{} {{\n", theme.id, dir_attr);

    let mut sorted: Vec<_> = vars.iter().collect();
    sorted.sort_by_key(|&(k, _)| k);
    for (k, v) in sorted {
        css.push_str(&format!("  {}: {};\n", k, v));
    }
    css.push_str("}\n");

    css
}
