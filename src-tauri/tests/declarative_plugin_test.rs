use educraft_lib::titanium::*;
use serde_json::json;
use std::collections::HashMap;

#[test]
fn test_declarative_plugin_parsing_and_sync() {
    let raw = json!({
        "manifest": {
            "id": "com.educraft.math-kit",
            "name": "Math Kit Declarative",
            "version": "1.0.0",
            "entry_point": "declarative.json",
            "target_engine": ">=0.0.9"
        },
        "content_blocks": [
            {
                "kind": "formulaBox",
                "title": "Formula Box",
                "default_fields": {
                    "border_color": "#3b82f6"
                },
                "required_fields": ["formula"],
                "render_template": "<div class=\"formula-box\" style=\"border-color: {{border_color}};\"><code>{{formula}}</code></div>"
            }
        ],
        "themes": [
            {
                "id": "solarized_dark",
                "name": "Solarized Dark",
                "is_dark": true,
                "variables": {
                    "--bg-canvas": "#002b36",
                    "--text-primary": "#839496"
                }
            }
        ],
        "views": [
            {
                "id": "formula_inspector",
                "title": "Formula Inspector",
                "target_pane": "sidebar",
                "component_type": "inspector"
            }
        ],
        "question_types": [
            {
                "type": "formula_proof",
                "title": "Formula Proof Step",
                "default_points": 2.5,
                "scoring_mode": "exact"
            }
        ],
        "macros": [
            {
                "tag": "alert",
                "template": "<div class=\"alert alert-{{type}}\">{{content}}</div>"
            }
        ]
    });

    let mut plugin = DeclarativePlugin::from_json_value(&raw).expect("Parsing should succeed");
    assert_eq!(plugin.content_blocks.len(), 1);
    assert_eq!(plugin.themes.len(), 1);
    assert_eq!(plugin.views.len(), 1);
    assert_eq!(plugin.question_types.len(), 1);
    assert_eq!(plugin.macros.len(), 1);

    // Sync contributions into manifest
    plugin.sync_manifest_contributions();
    let contribs = plugin.manifest.contributions.as_ref().unwrap();
    assert_eq!(contribs.content_blocks.len(), 1);
    assert_eq!(contribs.content_blocks[0].kind, "formulaBox");
    assert_eq!(contribs.themes.len(), 1);
    assert_eq!(contribs.views.len(), 1);
    assert_eq!(contribs.question_types.len(), 1);
}

#[test]
fn test_block_template_rendering() {
    let mut default_fields = HashMap::new();
    default_fields.insert("border_color".to_string(), json!("#3b82f6"));
    default_fields.insert("title".to_string(), json!("Note"));

    let block_def = DeclarativeBlockDef {
        kind: "customCallout".to_string(),
        title: "Callout".to_string(),
        icon: None,
        default_fields,
        required_fields: vec!["message".to_string()],
        render_template: r#"<div class="callout" style="border: 2px solid {{border_color}}"><h4>{{title}}</h4><p>{{message}}</p></div>"#.to_string(),
    };

    // Missing required field fails
    let empty_fields = HashMap::new();
    assert!(block_def.render(&empty_fields).is_err());

    // Providing required field uses defaults for optional
    let mut fields = HashMap::new();
    fields.insert("message".to_string(), json!("Newton's second law: F = ma"));
    let rendered = block_def.render(&fields).expect("Rendering should succeed");
    assert!(rendered.contains("Newton's second law: F = ma"));
    assert!(rendered.contains("#3b82f6")); // Default border color
    assert!(rendered.contains("<h4>Note</h4>")); // Default title

    // Overriding defaults
    fields.insert("title".to_string(), json!("Physics Law"));
    fields.insert("border_color".to_string(), json!("#ef4444"));
    let rendered2 = block_def.render(&fields).expect("Rendering should succeed");
    assert!(rendered2.contains("<h4>Physics Law</h4>"));
    assert!(rendered2.contains("#ef4444"));
}

#[test]
fn test_macro_expansion() {
    let macro_def = DeclarativeMacroDef {
        tag: "badge".to_string(),
        template: r#"<span class="badge badge-{{color}}">{{content}}</span>"#.to_string(),
    };

    let text = "This is a [badge color=\"success\"]Passing[/badge] test and a [badge color=\"error\"]Failing[/badge] test.";
    let expanded = macro_def.expand(text);
    assert_eq!(
        expanded,
        r#"This is a <span class="badge badge-success">Passing</span> test and a <span class="badge badge-error">Failing</span> test."#
    );
}

#[test]
fn test_theme_css_generation() {
    let mut vars = HashMap::new();
    vars.insert("--bg-base".to_string(), "#0f172a".to_string());
    vars.insert("accent-color".to_string(), "#38bdf8".to_string());

    let theme = DeclarativeThemeDef {
        id: "midnight".to_string(),
        name: "Midnight Blue".to_string(),
        is_dark: true,
        variables: vars,
    };

    let css = theme.to_css();
    assert!(css.contains(r#":root[data-theme="midnight"] {"#));
    assert!(css.contains("--bg-base: #0f172a;"));
    assert!(css.contains("--accent-color: #38bdf8;")); // Auto-prepended --
}
