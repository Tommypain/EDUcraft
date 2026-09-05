use educraft_lib::titanium::*;
use serde_json::json;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};

#[test]
fn test_action_hook_priority_dispatch() {
    let mut bus = HookBus::new();
    let execution_order = Arc::new(Mutex::new(Vec::new()));

    // Subscriber with low priority
    let order_clone1 = Arc::clone(&execution_order);
    bus.subscribe_action(
        "on_leaf_complete",
        ActionSubscriber {
            id: "sub_low".to_string(),
            plugin_id: "plugin_low".to_string(),
            priority: 10,
            handler: Arc::new(move |_| {
                order_clone1.lock().unwrap().push("low");
                Ok(())
            }),
        },
    );

    // Subscriber with high priority
    let order_clone2 = Arc::clone(&execution_order);
    bus.subscribe_action(
        "on_leaf_complete",
        ActionSubscriber {
            id: "sub_high".to_string(),
            plugin_id: "plugin_high".to_string(),
            priority: 100,
            handler: Arc::new(move |_| {
                order_clone2.lock().unwrap().push("high");
                Ok(())
            }),
        },
    );

    let event = HookEvent::OnLeafComplete {
        leaf_id: "leaf_intro".to_string(),
        time_spent_secs: 120,
    };

    let results = bus.dispatch_action(&event);
    assert_eq!(results.len(), 2);
    assert!(results[0].success);
    assert_eq!(results[0].subscriber_id, "sub_high");
    assert!(results[1].success);
    assert_eq!(results[1].subscriber_id, "sub_low");

    let order = execution_order.lock().unwrap().clone();
    assert_eq!(order, vec!["high", "low"]);
}

#[test]
fn test_filter_hook_pipeline_transformation() {
    let mut bus = HookBus::new();

    // Filter 1: Higher priority (runs first)
    bus.subscribe_filter(
        FilterHook::FilterExportHtml,
        FilterSubscriber {
            id: "f_high".to_string(),
            plugin_id: "plugin_watermark".to_string(),
            priority: 50,
            handler: Arc::new(|val| {
                let s = val.as_str().unwrap_or("");
                Ok(json!(format!("{} [Watermark]", s)))
            }),
        },
    );

    // Filter 2: Lower priority (runs second)
    bus.subscribe_filter(
        FilterHook::FilterExportHtml,
        FilterSubscriber {
            id: "f_low".to_string(),
            plugin_id: "plugin_analytics".to_string(),
            priority: 10,
            handler: Arc::new(|val| {
                let s = val.as_str().unwrap_or("");
                Ok(json!(format!("{} [Analytics]", s)))
            }),
        },
    );

    let initial = json!("<html><body>Book</body></html>");
    let filtered = bus.apply_filter(FilterHook::FilterExportHtml, initial);
    assert_eq!(
        filtered.as_str().unwrap(),
        "<html><body>Book</body></html> [Watermark] [Analytics]"
    );
}

#[test]
fn test_error_and_panic_containment() {
    let mut bus = HookBus::new();
    let counter = Arc::new(AtomicUsize::new(0));

    // 1. Handler that panics
    bus.subscribe_action(
        "on_question_submit",
        ActionSubscriber {
            id: "sub_panic".to_string(),
            plugin_id: "buggy_plugin".to_string(),
            priority: 100,
            handler: Arc::new(|_| {
                panic!("Catastrophic unexpected bug in plugin!");
            }),
        },
    );

    // 2. Handler that returns an error
    bus.subscribe_action(
        "on_question_submit",
        ActionSubscriber {
            id: "sub_err".to_string(),
            plugin_id: "err_plugin".to_string(),
            priority: 50,
            handler: Arc::new(|_| Err("Network timeout".to_string())),
        },
    );

    // 3. Normal handler (should still execute safely)
    let c = Arc::clone(&counter);
    bus.subscribe_action(
        "on_question_submit",
        ActionSubscriber {
            id: "sub_ok".to_string(),
            plugin_id: "good_plugin".to_string(),
            priority: 10,
            handler: Arc::new(move |_| {
                c.fetch_add(1, Ordering::SeqCst);
                Ok(())
            }),
        },
    );

    let event = HookEvent::OnQuestionSubmit {
        question_id: "q_1".to_string(),
        is_correct: true,
        score: 1.0,
    };

    let results = bus.dispatch_action(&event);
    assert_eq!(results.len(), 3);

    assert!(!results[0].success);
    assert!(results[0].error.as_ref().unwrap().contains("panicked"));

    assert!(!results[1].success);
    assert_eq!(results[1].error.as_deref(), Some("Network timeout"));

    assert!(results[2].success);
    assert_eq!(counter.load(Ordering::SeqCst), 1);
}

#[test]
fn test_withdraw_plugin_hooks() {
    let mut bus = HookBus::new();

    bus.subscribe_action(
        "after_export",
        ActionSubscriber {
            id: "sub_a".to_string(),
            plugin_id: "plugin_a".to_string(),
            priority: 10,
            handler: Arc::new(|_| Ok(())),
        },
    );

    bus.subscribe_action(
        "after_export",
        ActionSubscriber {
            id: "sub_b".to_string(),
            plugin_id: "plugin_b".to_string(),
            priority: 10,
            handler: Arc::new(|_| Ok(())),
        },
    );

    let event = HookEvent::AfterExport {
        book_id: "b_1".to_string(),
        output_size: 5000,
    };

    assert_eq!(bus.dispatch_action(&event).len(), 2);

    bus.withdraw_plugin_hooks("plugin_a");
    let remaining = bus.dispatch_action(&event);
    assert_eq!(remaining.len(), 1);
    assert_eq!(remaining[0].plugin_id, "plugin_b");
}
