use educraft_lib::titanium::*;
use serde_json::json;
use std::collections::HashMap;

#[test]
fn test_core_blocks_and_questions_recognized() {
    let block_registry = BlockRegistry::new();
    for &b in CORE_BLOCK_KINDS {
        assert!(block_registry.is_supported(b), "Core block {} should be supported", b);
        assert!(block_registry.is_built_in(b), "Core block {} should be marked built-in", b);
    }
    assert!(!block_registry.is_supported("unknownWidget"));

    let q_registry = QuestionRegistry::new();
    for &q in CORE_QUESTION_TYPES {
        assert!(q_registry.is_supported(q), "Core question {} should be supported", q);
    }
    assert!(!q_registry.is_supported("ai_interview"));
}

#[test]
fn test_custom_block_registration_and_fallback_safety() {
    let mut registry = BlockRegistry::new();

    // 1. Built-in block rendering
    let note_val = json!({
        "kind": "note",
        "title": "Study Tip",
        "text": "Always write semantic HTML."
    });
    let rendered_note = registry.render_or_fallback(&note_val);
    assert!(!rendered_note.is_fallback);
    assert!(rendered_note.html.contains("Study Tip"));

    // 2. Unknown block triggers structured fallback
    let unknown_val = json!({
        "kind": "uninstalledPhysicsSimulator",
        "gravity": 9.81,
        "mass": 50
    });
    let fallback = registry.render_or_fallback(&unknown_val);
    assert!(fallback.is_fallback);
    assert!(fallback.html.contains("Extension Block Placeholder: uninstalledPhysicsSimulator"));
    assert!(fallback.html.contains("9.81")); // Preserves raw data safely

    // 3. Register custom block
    let custom_block = DeclarativeBlockDef {
        kind: "physicsSim".to_string(),
        title: "Physics Sim".to_string(),
        icon: None,
        default_fields: HashMap::new(),
        required_fields: vec!["gravity".to_string()],
        render_template: "<div class=\"sim\">Gravity: {{gravity}}</div>".to_string(),
    };
    registry.register_custom(custom_block);
    assert!(registry.is_supported("physicsSim"));

    let custom_val = json!({
        "kind": "physicsSim",
        "gravity": 9.81
    });
    let rendered_custom = registry.render_or_fallback(&custom_val);
    assert!(!rendered_custom.is_fallback);
    assert_eq!(rendered_custom.html, "<div class=\"sim\">Gravity: 9.81</div>");
}

#[test]
fn test_question_evaluation_and_fallback() {
    let q_registry = QuestionRegistry::new();

    // 1. Built-in multiple choice evaluation
    let res = q_registry.evaluate_submission(
        "multiple_choice",
        &json!("A"),
        &json!("A"),
    );
    assert!(res.is_correct);
    assert_eq!(res.score, 1.0);
    assert!(!res.is_fallback);

    // 2. Incorrect submission
    let res2 = q_registry.evaluate_submission(
        "multiple_choice",
        &json!("B"),
        &json!("A"),
    );
    assert!(!res2.is_correct);
    assert_eq!(res2.score, 0.0);

    // 3. Unsupported question type -> Fallback
    let fallback_res = q_registry.evaluate_submission(
        "unsupported_ai_eval",
        &json!("answer"),
        &json!("answer"),
    );
    assert!(fallback_res.is_fallback);
    assert!(!fallback_res.is_correct);
    assert!(fallback_res.feedback.unwrap().contains("Unsupported"));
}

#[test]
fn test_design_tokens_and_rtl_stylesheet() {
    let mut vars = HashMap::new();
    vars.insert("--primary".to_string(), "#2563eb".to_string());

    let theme = DeclarativeThemeDef {
        id: "blue_clarity".to_string(),
        name: "Blue Clarity".to_string(),
        is_dark: false,
        variables: vars,
    };

    let rtl_css = generate_theme_stylesheet(&theme, true);
    assert!(rtl_css.contains(r#":root[data-theme="blue_clarity"][dir="rtl"] {"#));
    assert!(rtl_css.contains("--primary: #2563eb;"));
    assert!(rtl_css.contains("--font-arabic:"));

    let ltr_css = generate_theme_stylesheet(&theme, false);
    assert!(ltr_css.contains(r#":root[data-theme="blue_clarity"][dir="ltr"] {"#));
}

#[test]
fn test_slot_registry_priority_and_withdrawal() {
    let mut slot_registry = SlotRegistry::new();

    slot_registry.register_item(SlotItem {
        id: "tab_glossary".to_string(),
        slot: SlotId::SidebarTabs,
        plugin_id: "plugin_a".to_string(),
        title: "Glossary".to_string(),
        priority: 10,
        payload: HashMap::new(),
    });

    slot_registry.register_item(SlotItem {
        id: "tab_formula".to_string(),
        slot: SlotId::SidebarTabs,
        plugin_id: "plugin_b".to_string(),
        title: "Formulas".to_string(),
        priority: 50, // Higher priority
        payload: HashMap::new(),
    });

    slot_registry.register_item(SlotItem {
        id: "footer_stats".to_string(),
        slot: SlotId::LeafFooter,
        plugin_id: "plugin_a".to_string(),
        title: "Stats".to_string(),
        priority: 0,
        payload: HashMap::new(),
    });

    // Check priority order for SidebarTabs
    let sidebar_items = slot_registry.get_slot_items(&SlotId::SidebarTabs);
    assert_eq!(sidebar_items.len(), 2);
    assert_eq!(sidebar_items[0].id, "tab_formula"); // 50 comes before 10
    assert_eq!(sidebar_items[1].id, "tab_glossary");

    // Withdraw plugin_a
    slot_registry.withdraw_plugin_items("plugin_a");
    let remaining_sidebar = slot_registry.get_slot_items(&SlotId::SidebarTabs);
    assert_eq!(remaining_sidebar.len(), 1);
    assert_eq!(remaining_sidebar[0].id, "tab_formula");

    let remaining_footer = slot_registry.get_slot_items(&SlotId::LeafFooter);
    assert!(remaining_footer.is_empty());
}
