use educraft_lib::contracts::{
    PluginBlockContribution, PluginContributions, PluginManifest,
};
use educraft_lib::titanium::*;
use std::collections::HashMap;

fn create_plugin(id: &str, version: &str, deps: Vec<(&str, &str)>) -> PluginManifest {
    let mut dependencies = HashMap::new();
    for (dep_id, req) in deps {
        dependencies.insert(dep_id.to_string(), req.to_string());
    }

    PluginManifest {
        id: id.to_string(),
        name: format!("Plugin {}", id),
        version: version.to_string(),
        author: None,
        description: None,
        entry_point: "index.js".to_string(),
        target_engine: ">=0.0.9".to_string(),
        capabilities: vec![],
        permissions: vec![],
        dependencies,
        contributions: None,
        extra: Default::default(),
    }
}

#[test]
fn test_topological_dependency_ordering() {
    let mut available = HashMap::new();
    // A -> B -> C
    available.insert("C".to_string(), create_plugin("C", "1.0.0", vec![]));
    available.insert("B".to_string(), create_plugin("B", "1.0.0", vec![("C", ">=1.0.0")]));
    available.insert("A".to_string(), create_plugin("A", "1.0.0", vec![("B", ">=1.0.0")]));

    let order = DependencyResolver::resolve_order(&available, &["A".to_string()])
        .expect("Resolution should succeed");

    assert_eq!(order, vec!["C", "B", "A"]);
}

#[test]
fn test_missing_dependency_rejection() {
    let mut available = HashMap::new();
    available.insert("A".to_string(), create_plugin("A", "1.0.0", vec![("MISSING", ">=1.0")]));

    let err = DependencyResolver::resolve_order(&available, &["A".to_string()])
        .expect_err("Should fail with missing dependency");

    assert!(matches!(err, CompositionError::MissingDependency { .. }));
}

#[test]
fn test_incompatible_dependency_version_rejection() {
    let mut available = HashMap::new();
    available.insert("B".to_string(), create_plugin("B", "1.2.0", vec![]));
    available.insert("A".to_string(), create_plugin("A", "1.0.0", vec![("B", ">=2.0.0")]));

    let err = DependencyResolver::resolve_order(&available, &["A".to_string()])
        .expect_err("Should fail with incompatible dependency version");

    assert!(matches!(err, CompositionError::IncompatibleDependencyVersion { .. }));
}

#[test]
fn test_circular_dependency_detection() {
    let mut available = HashMap::new();
    // A -> B -> A
    available.insert("A".to_string(), create_plugin("A", "1.0.0", vec![("B", "*")]));
    available.insert("B".to_string(), create_plugin("B", "1.0.0", vec![("A", "*")]));

    let err = DependencyResolver::resolve_order(&available, &["A".to_string()])
        .expect_err("Should detect cycle");

    assert!(matches!(err, CompositionError::CircularDependency(_)));
}

#[test]
fn test_contribution_conflict_detection() {
    let mut p1 = create_plugin("plugin1", "1.0.0", vec![]);
    p1.contributions = Some(PluginContributions {
        views: vec![],
        themes: vec![],
        content_blocks: vec![PluginBlockContribution {
            kind: "codePlayground".to_string(),
            title: "Code Playground 1".to_string(),
        }],
        question_types: vec![],
    });

    let mut p2 = create_plugin("plugin2", "1.0.0", vec![]);
    p2.contributions = Some(PluginContributions {
        views: vec![],
        themes: vec![],
        content_blocks: vec![PluginBlockContribution {
            kind: "codePlayground".to_string(), // Collides with p1!
            title: "Code Playground 2".to_string(),
        }],
        question_types: vec![],
    });

    let conflict = ConflictDetector::check_set(&[&p1, &p2]).expect_err("Should detect block collision");
    assert!(matches!(conflict, CompositionError::BlockCollision { .. }));
}

#[test]
fn test_registry_activate_with_dependencies() {
    let mut registry = TitaniumRegistry::new("0.0.9.0");

    let p_core = create_plugin("math.core", "1.0.0", vec![]);
    let p_advanced = create_plugin("math.advanced", "1.0.0", vec![("math.core", ">=1.0.0")]);

    registry.install(p_core, None).unwrap();
    registry.install(p_advanced, None).unwrap();

    let activated_order = registry
        .activate_with_dependencies("math.advanced")
        .expect("Should activate dependencies in order");

    assert_eq!(activated_order, vec!["math.core", "math.advanced"]);
    assert_eq!(registry.get_plugin("math.core").unwrap().state, PluginState::Active);
    assert_eq!(registry.get_plugin("math.advanced").unwrap().state, PluginState::Active);
}
