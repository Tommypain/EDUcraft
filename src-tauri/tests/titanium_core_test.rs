use educraft_lib::contracts::{
    PluginBlockContribution, PluginContributions, PluginManifest, PluginThemeContribution,
    PluginViewContribution,
};
use educraft_lib::titanium::*;
use std::fs;

fn create_valid_plugin_manifest() -> PluginManifest {
    PluginManifest {
        id: "com.educraft.latex-math".to_string(),
        name: "LaTeX Math Renderer".to_string(),
        version: "1.0.0".to_string(),
        author: Some("EDUcraft Team".to_string()),
        description: Some("Adds custom math rendering blocks and formulas".to_string()),
        entry_point: "dist/plugin.js".to_string(),
        target_engine: ">=0.0.9".to_string(),
        capabilities: vec!["math_rendering".to_string()],
        permissions: vec!["register:block".to_string(), "fs:read".to_string()],
        contributions: Some(PluginContributions {
            views: vec![PluginViewContribution {
                id: "latex_debugger".to_string(),
                title: "LaTeX Debugger".to_string(),
                icon: Some("icons/math.svg".to_string()),
            }],
            themes: vec![PluginThemeContribution {
                id: "latex_dark".to_string(),
                name: "LaTeX Dark".to_string(),
                file: "themes/dark.css".to_string(),
            }],
            content_blocks: vec![PluginBlockContribution {
                kind: "latexBlock".to_string(),
                title: "LaTeX Math Equation".to_string(),
            }],
            question_types: vec![],
        }),
        ..Default::default()
    }
}

#[test]
fn test_manifest_validation_and_path_traversal_prevention() {
    let mut manifest = create_valid_plugin_manifest();
    let current_engine = "0.0.9.0";

    // Valid manifest passes
    assert!(validate_plugin_manifest(&manifest, current_engine).is_ok());

    // Incompatible engine
    manifest.target_engine = ">=1.0.0".to_string();
    assert!(matches!(
        validate_plugin_manifest(&manifest, current_engine),
        Err(TitaniumError::IncompatibleEngine { .. })
    ));
    manifest.target_engine = ">=0.0.9".to_string();

    // Security violation: Path traversal in entry point
    manifest.entry_point = "../../../etc/passwd".to_string();
    assert!(matches!(
        validate_plugin_manifest(&manifest, current_engine),
        Err(TitaniumError::SecurityViolation(_))
    ));

    // Security violation: Absolute path in entry point
    manifest.entry_point = "/usr/bin/node".to_string();
    assert!(matches!(
        validate_plugin_manifest(&manifest, current_engine),
        Err(TitaniumError::SecurityViolation(_))
    ));
    manifest.entry_point = "dist/plugin.js".to_string();

    // Security violation: Path traversal in contributed theme file
    if let Some(contributions) = &mut manifest.contributions {
        contributions.themes[0].file = "../secrets/theme.css".to_string();
    }
    assert!(matches!(
        validate_plugin_manifest(&manifest, current_engine),
        Err(TitaniumError::SecurityViolation(_))
    ));
}

#[test]
fn test_plugin_lifecycle_and_contributions() {
    let mut registry = TitaniumRegistry::new("0.0.9.0");
    let manifest = create_valid_plugin_manifest();
    let plugin_id = manifest.id.clone();

    // 1. Install
    let installed_id = registry
        .install(manifest.clone(), None)
        .expect("Install should succeed");
    assert_eq!(installed_id, plugin_id);

    let plugin = registry.get_plugin(&plugin_id).unwrap();
    assert_eq!(plugin.state, PluginState::Installed);

    // Initial contributions should be empty because plugin is not yet active
    let contributions = registry.get_active_contributions();
    assert!(contributions.content_blocks.is_empty());
    assert!(!registry.has_capability("math_rendering"));

    // 2. Load
    registry.load(&plugin_id).expect("Load should succeed");
    assert_eq!(registry.get_plugin(&plugin_id).unwrap().state, PluginState::Loaded);

    // 3. Activate
    registry
        .activate(&plugin_id)
        .expect("Activate should succeed");
    assert_eq!(registry.get_plugin(&plugin_id).unwrap().state, PluginState::Active);
    assert!(registry.has_capability("math_rendering"));

    // Check permissions
    assert!(registry.check_permission(&plugin_id, &PluginPermission::RegisterBlock));
    assert!(registry.check_permission(&plugin_id, &PluginPermission::FsRead));
    assert!(!registry.check_permission(&plugin_id, &PluginPermission::Network));

    // Check active contributions aggregated
    let active_contribs = registry.get_active_contributions();
    assert_eq!(active_contribs.content_blocks.len(), 1);
    assert_eq!(active_contribs.content_blocks[0].kind, "latexBlock");
    assert_eq!(active_contribs.views.len(), 1);
    assert_eq!(active_contribs.themes.len(), 1);

    // 4. Deactivate
    registry
        .deactivate(&plugin_id)
        .expect("Deactivate should succeed");
    assert_eq!(registry.get_plugin(&plugin_id).unwrap().state, PluginState::Disabled);
    assert!(!registry.has_capability("math_rendering"));

    // Contributions should be withdrawn
    let deactivated_contribs = registry.get_active_contributions();
    assert!(deactivated_contribs.content_blocks.is_empty());
    assert!(!registry.check_permission(&plugin_id, &PluginPermission::RegisterBlock));

    // 5. Uninstall
    registry
        .uninstall(&plugin_id)
        .expect("Uninstall should succeed");
    assert!(registry.get_plugin(&plugin_id).is_none());
}

#[test]
fn test_toml_and_json_manifest_discovery() {
    let temp_dir = std::env::temp_dir().join(format!("titanium_test_{}", std::process::id()));
    let _ = fs::remove_dir_all(&temp_dir);
    fs::create_dir_all(&temp_dir).unwrap();

    // 1. JSON plugin folder
    let json_plugin_dir = temp_dir.join("plugin-json");
    fs::create_dir_all(&json_plugin_dir).unwrap();
    let json_content = r#"{
        "id": "com.educraft.test-json",
        "name": "Test JSON Plugin",
        "version": "0.1.0",
        "entry_point": "index.js",
        "target_engine": ">=0.0.9"
    }"#;
    fs::write(json_plugin_dir.join("plugin.json"), json_content).unwrap();

    // 2. TOML plugin folder
    let toml_plugin_dir = temp_dir.join("plugin-toml");
    fs::create_dir_all(&toml_plugin_dir).unwrap();
    let toml_content = r#"
        id = "com.educraft.test-toml"
        name = "Test TOML Plugin"
        version = "0.2.0"
        entry_point = "index.js"
        target_engine = ">=0.0.9"
    "#;
    fs::write(toml_plugin_dir.join("plugin.toml"), toml_content).unwrap();

    let mut registry = TitaniumRegistry::new("0.0.9.0");
    let discovered = registry
        .discover_directory(&temp_dir)
        .expect("Discovery should succeed");

    assert_eq!(discovered.len(), 2);
    assert!(discovered.contains(&"com.educraft.test-json".to_string()));
    assert!(discovered.contains(&"com.educraft.test-toml".to_string()));

    let p_json = registry.get_plugin("com.educraft.test-json").unwrap();
    assert_eq!(p_json.manifest.name, "Test JSON Plugin");
    assert_eq!(p_json.state, PluginState::Discovered);

    let p_toml = registry.get_plugin("com.educraft.test-toml").unwrap();
    assert_eq!(p_toml.manifest.name, "Test TOML Plugin");
    assert_eq!(p_toml.state, PluginState::Discovered);

    // Clean up
    let _ = fs::remove_dir_all(&temp_dir);
}
