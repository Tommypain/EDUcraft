use educraft_lib::asset_resolver::{resolve_asset, AssetIndex, AssetResolutionQuery};
use educraft_lib::book_manager::types::BookState;
use educraft_lib::book_manager::validator::validate_book_structure;
use educraft_lib::contracts::{
    AssetIntelligence, AssetProvenance, AssetRole, AssetType, ConfidenceLevel, ConfidenceScore,
    KnowledgeAsset, KnowledgeAssetManifest, LocalizedText, PluginManifest,
};
use educraft_lib::knowledge_graph::build_graph_from_book;
use educraft_lib::migration::MigrationEngine;
use educraft_lib::titanium::validator::{is_safe_relative_path, validate_plugin_manifest};
use educraft_lib::titanium::wasm::{WasmError, WasmExecutionConfig, WasmSandbox};
use educraft_lib::titanium::*;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::time::Instant;

const BOOK_FILENAMES: [&str; 14] = [
    "01-html-master-curriculum.json",
    "02-css-tailwind-master-curriculum.json",
    "03-javascript-master-curriculum.json",
    "04-typescript-master-curriculum.json",
    "05-react-master-curriculum.json",
    "06-node-backend-master-book.json",
    "07-rust-book-01-core.json",
    "08-rust-book-02-advanced.json",
    "09-rust-book-03-backend.json",
    "10-rust-book-04-databases.json",
    "11-rust-book-05-networking.json",
    "12-rust-book-06-robotics.json",
    "13-rust-book-07-wasm.json",
    "14-rust-book-08-production.json",
];

fn create_test_asset(id: &str, topic: &str, concept: &str, title: &str) -> KnowledgeAsset {
    KnowledgeAsset {
        id: id.to_string(),
        asset_type: AssetType::Diagram,
        role: AssetRole::Figure,
        original_filename: format!("{}.svg", id),
        storage_path: format!("assets/{}.svg", id),
        mime_type: "image/svg+xml".to_string(),
        byte_size: 1024,
        sha256: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".to_string(),
        width: Some(800),
        height: Some(600),
        aspect_ratio: Some(1.33),
        duration_seconds: None,
        is_decorative: false,
        caption: Some(LocalizedText {
            en: Some(title.to_string()),
            ar: None,
        }),
        alt: None,
        tags: vec![topic.to_string()],
        intelligence: Some(AssetIntelligence {
            title: Some(LocalizedText {
                en: Some(title.to_string()),
                ar: None,
            }),
            caption: Some(LocalizedText {
                en: Some(title.to_string()),
                ar: None,
            }),
            description: None,
            ocr_text: None,
            topics: vec![topic.to_string()],
            concepts: vec![concept.to_string()],
            pedagogical_role: AssetRole::Figure,
            provenance: AssetProvenance::default(),
            confidence: ConfidenceScore {
                score: 0.95,
                level: ConfidenceLevel::High,
                basis: vec!["metadata".to_string()],
            },
            perceptual_hash: Some("0123456789abcdef".to_string()),
            extra: HashMap::new(),
        }),
        extra: HashMap::new(),
    }
}

#[test]
fn test_all_14_legacy_books_ingestion_and_graph_construction() {
    let data_dir = Path::new("../src/data");
    assert!(
        data_dir.exists(),
        "Expected ../src/data to exist containing legacy books"
    );

    let mut total_nodes = 0;
    let mut total_questions = 0;
    let mut total_branches = 0;

    for filename in BOOK_FILENAMES {
        let book_path = data_dir.join(filename);
        assert!(
            book_path.exists(),
            "Book file '{}' does not exist at {:?}",
            filename,
            book_path
        );

        let content = fs::read_to_string(&book_path)
            .unwrap_or_else(|e| panic!("Failed to read '{}': {}", filename, e));

        let val: serde_json::Value = serde_json::from_str(&content)
            .unwrap_or_else(|e| panic!("Failed to parse JSON for '{}': {}", filename, e));

        // Rule 1: Backward compatibility check
        let original_version = MigrationEngine::detect_version(&val);
        assert_eq!(
            original_version, "1.0",
            "Book '{}' should be detected as version 1.0",
            filename
        );

        // Lossless migration to current schema version 1.1
        let (migrated_book, report) = MigrationEngine::migrate_to_current(val)
            .unwrap_or_else(|e| panic!("Migration failed for '{}': {}", filename, e));

        assert_eq!(report.from_version, "1.0");
        assert_eq!(report.to_version, "1.1");
        assert_eq!(migrated_book.id, filename.trim_end_matches(".json"));

        // Validate book structure
        let validation = validate_book_structure(&migrated_book);
        assert_eq!(
            validation.state,
            BookState::Valid,
            "Book '{}' validation failed: {:?}",
            filename,
            validation.error
        );
        assert!(
            validation.error.is_none(),
            "Book '{}' has validation error: {:?}",
            filename,
            validation.error
        );
        assert!(validation.node_count > 0, "Book '{}' has 0 nodes", filename);

        total_nodes += validation.node_count;
        total_questions += validation.question_count;
        total_branches += validation.branch_count;

        // Build knowledge graph from book
        let graph = build_graph_from_book(&migrated_book, None);
        assert!(
            graph.has_node(&migrated_book.id),
            "KnowledgeGraph for '{}' missing root book node",
            filename
        );
        assert!(
            graph.node_count() > 0,
            "KnowledgeGraph for '{}' should contain nodes",
            filename
        );
        assert!(
            graph.edge_count() > 0,
            "KnowledgeGraph for '{}' should contain edges",
            filename
        );
    }

    println!(
        "Verified all 14 books successfully! Total Nodes: {}, Questions: {}, Branches: {}",
        total_nodes, total_questions, total_branches
    );
    assert!(total_nodes > 100, "Expected significant total node count across 14 books");
}

#[test]
fn test_security_sandboxing_audit() {
    // 1. Path traversal security checks
    assert!(!is_safe_relative_path("../secret.key"));
    assert!(!is_safe_relative_path("../../etc/passwd"));
    assert!(!is_safe_relative_path("..\\windows\\win.ini"));
    assert!(!is_safe_relative_path("/usr/local/bin"));
    assert!(!is_safe_relative_path("C:\\Windows\\System32"));
    assert!(!is_safe_relative_path("plugins/../secret/file.js"));
    assert!(!is_safe_relative_path(""));
    assert!(is_safe_relative_path("plugins/math.js"));
    assert!(is_safe_relative_path("assets/themes/dark.css"));
    assert!(is_safe_relative_path("bundle.wasm"));

    // 2. Plugin manifest security validation
    let unsafe_manifest = PluginManifest {
        id: "com.malicious.plugin".to_string(),
        name: "Bad Plugin".to_string(),
        version: "1.0.0".to_string(),
        description: Some("Traversal test".to_string()),
        author: Some("Hacker".to_string()),
        target_engine: ">=0.0.9.0".to_string(),
        entry_point: "../../../etc/shadow".to_string(),
        capabilities: vec![],
        permissions: vec![],
        dependencies: HashMap::new(),
        contributions: None,
        extra: Default::default(),
    };
    let val_res = validate_plugin_manifest(&unsafe_manifest, "0.0.9.0");
    assert!(val_res.is_err());
    if let Err(TitaniumError::SecurityViolation(msg)) = val_res {
        assert!(msg.contains("unsafe path or traversal"));
    } else {
        panic!("Expected SecurityViolation error");
    }

    // 3. WASM sandboxing limits
    // Test invalid magic bytes
    let bad_magic_bytes = vec![0xde, 0xad, 0xbe, 0xef, 0x01, 0x00, 0x00, 0x00];
    let mut sandbox = WasmSandbox::new(WasmExecutionConfig::default());
    assert_eq!(sandbox.load_module(&bad_magic_bytes), Err(WasmError::InvalidMagic));

    // Test memory out of bounds
    let tiny_config = WasmExecutionConfig {
        max_memory_bytes: 512,
        initial_fuel: 100_000,
    };
    let mut constrained_sandbox = WasmSandbox::new(tiny_config);
    let large_data = vec![0u8; 1024];
    let mem_res = constrained_sandbox.write_memory(0, &large_data);
    assert!(matches!(mem_res, Err(WasmError::MemoryOutOfBounds { .. })));

    // Test fuel exhaustion
    let low_fuel_config = WasmExecutionConfig {
        max_memory_bytes: 64 * 1024,
        initial_fuel: 20,
    };
    let mut fuel_sandbox = WasmSandbox::new(low_fuel_config);
    let wasm_bin = WasmSandbox::create_test_wasm_binary(&["process_data"]);
    fuel_sandbox.load_module(&wasm_bin).unwrap();
    // call_export requires at least 10 + 50 = 60 fuel, but initial fuel is only 20
    let call_res = fuel_sandbox.call_export("process_data", b"hello world payload");
    assert_eq!(call_res, Err(WasmError::FuelExhausted));
}

#[test]
fn test_panic_isolation_and_resilience() {
    let mut bus = HookBus::new();
    let counter = Arc::new(AtomicUsize::new(0));
    let counter_clone = Arc::clone(&counter);

    // Register a misbehaving hook that panics
    bus.subscribe_action(
        "on_leaf_complete",
        ActionSubscriber {
            id: "sub_panicking".to_string(),
            plugin_id: "com.panicking.plugin".to_string(),
            priority: 100,
            handler: Arc::new(|_| {
                panic!("Critical third-party plugin failure!");
            }),
        },
    );

    // Register a subsequent legitimate hook
    bus.subscribe_action(
        "on_leaf_complete",
        ActionSubscriber {
            id: "sub_wellbehaved".to_string(),
            plugin_id: "com.wellbehaved.plugin".to_string(),
            priority: 50,
            handler: Arc::new(move |_| {
                counter_clone.fetch_add(1, Ordering::SeqCst);
                Ok(())
            }),
        },
    );

    // Trigger action — host should survive the panic completely
    let event = HookEvent::OnLeafComplete {
        leaf_id: "leaf_intro".to_string(),
        time_spent_secs: 60,
    };
    let results = bus.dispatch_action(&event);

    assert_eq!(results.len(), 2);
    // First result should report the trapped panic
    assert!(!results[0].success);
    assert!(results[0].error.as_ref().unwrap().contains("panicked"));

    // Second hook should have executed successfully
    assert!(results[1].success);
    assert_eq!(counter.load(Ordering::SeqCst), 1);
}

#[test]
fn test_performance_benchmarks() {
    // 1. Dependency DAG Resolution Performance Benchmark
    let mut available = HashMap::new();
    let n = 50;
    for i in 0..n {
        let mut deps = HashMap::new();
        if i > 0 {
            deps.insert(format!("plugin_{}", i - 1), ">=1.0.0".to_string());
        }
        let manifest = PluginManifest {
            id: format!("plugin_{}", i),
            name: format!("Plugin {}", i),
            version: "1.0.0".to_string(),
            description: None,
            author: None,
            entry_point: "index.js".to_string(),
            target_engine: ">=0.0.9".to_string(),
            capabilities: vec![],
            permissions: vec![],
            dependencies: deps,
            contributions: None,
            extra: Default::default(),
        };
        available.insert(format!("plugin_{}", i), manifest);
    }

    let root_id = format!("plugin_{}", n - 1);
    let dag_start = Instant::now();
    let sorted = DependencyResolver::resolve_order(&available, &[root_id]).unwrap();
    let dag_elapsed = dag_start.elapsed();

    assert_eq!(sorted.len(), n);
    println!("50-node DAG Kahn's topological sort elapsed: {:?}", dag_elapsed);
    assert!(
        dag_elapsed.as_millis() < 5,
        "DAG resolution took too long: {:?}",
        dag_elapsed
    );

    // 2. Semantic Asset Resolver Benchmark
    let mut manifest = KnowledgeAssetManifest::new("benchmark_book");
    for i in 0..100 {
        let asset = create_test_asset(
            &format!("asset_{:03}", i),
            "databases",
            "b_tree",
            &format!("Database Index B-Tree Diagram {}", i),
        );
        manifest.add_asset(asset);
    }

    let asset_index = AssetIndex::build(&manifest);

    let query = AssetResolutionQuery {
        topic: Some("databases".to_string()),
        asset_type: Some(AssetType::Diagram),
        role: Some(AssetRole::Figure),
        concept: Some("b_tree".to_string()),
        context: Some("Database indexing with B-tree data structures".to_string()),
        min_score: Some(0.40),
    };

    let resolver_start = Instant::now();
    let iterations = 1000;
    for _ in 0..iterations {
        let result = resolve_asset(&manifest, &asset_index, &query);
        assert!(result.resolved);
        assert!(!result.candidates.is_empty());
    }
    let resolver_elapsed = resolver_start.elapsed();
    let per_query_us = resolver_elapsed.as_micros() as f64 / iterations as f64;
    println!(
        "Asset Resolution: {} queries in {:?} ({:.2} µs/query)",
        iterations, resolver_elapsed, per_query_us
    );
    assert!(
        per_query_us < 1000.0,
        "Asset resolution took too long: {:.2} µs/query",
        per_query_us
    );
}
