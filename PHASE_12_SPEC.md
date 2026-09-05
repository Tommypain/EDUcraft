# PHASE 12 SPECIFICATION — Events & Hook System

## Objective
Establish a high-performance, fault-tolerant **Event Bus & Hook Subsystem** for Titanium:
1. **Event Dispatching & Subscriptions**:
   - Action hooks (side-effects): `on_book_loaded`, `on_leaf_opened`, `on_question_answered`, `on_export_finished`.
   - Filter hooks (pipeline data mutators): `filter_export_html`, `filter_block_content`, `filter_question_submission`.
2. **Priority Ordering**:
   - Higher priority subscribers execute before lower priority ones.
3. **Fault-Tolerant Error Containment**:
   - If an event handler panics, returns an error, or times out, the error is isolated and recorded in the audit log. The core pipeline MUST NEVER crash.
4. **Zero Breaking Changes**:
   - All core export and book management routines run unmodified with or without event listeners attached.

---

## 1. Architecture & Models

### A. Event & Hook Kinds (`src-tauri/src/titanium/events.rs`)
```rust
pub enum HookEvent {
    BeforeBookLoad { book_id: String },
    AfterBookLoad { book_id: String },
    BeforeBookSave { book_id: String },
    AfterBookSave { book_id: String },
    BeforeExport { book_id: String, format: String },
    AfterExport { book_id: String, output_size: usize },
    OnLeafComplete { leaf_id: String, time_spent_secs: u32 },
    OnQuestionSubmit { question_id: String, is_correct: bool, score: f32 },
    OnStudyRecord { leaf_id: String, question_id: String, score: f32 },
}

pub enum FilterHook {
    FilterExportHtml,
    FilterBlockContent,
    FilterQuestionSubmission,
}
```

### B. Hook Subscribers & Event Bus (`HookBus`)
```rust
pub struct HookSubscriber {
    pub id: String,
    pub plugin_id: String,
    pub priority: i32,
    pub handler: Arc<dyn Fn(&HookEvent) -> Result<(), String> + Send + Sync>,
}

pub struct FilterSubscriber {
    pub id: String,
    pub plugin_id: String,
    pub priority: i32,
    pub handler: Arc<dyn Fn(serde_json::Value) -> Result<serde_json::Value, String> + Send + Sync>,
}
```

---

## 2. API Surface
- `HookBus::new()`
- `HookBus::subscribe_action(&mut self, event_pattern: &str, subscriber: HookSubscriber)`
- `HookBus::subscribe_filter(&mut self, hook: FilterHook, subscriber: FilterSubscriber)`
- `HookBus::dispatch_action(&self, event: &HookEvent) -> Vec<HookExecutionResult>`
- `HookBus::apply_filter(&self, hook: FilterHook, initial_value: serde_json::Value) -> serde_json::Value`
- `HookBus::withdraw_plugin_hooks(&mut self, plugin_id: &str)`

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/titanium_events_test.rs`:
1. **Action Hook Dispatch & Priority**: Multiple listeners fire in descending priority order.
2. **Filter Hook Pipeline**: Value passes through a chain of filters sequentially (`"Hello"` -> `"Hello [PluginA]"` -> `"Hello [PluginA] [PluginB]"`).
3. **Error Containment**: A handler returning an error does not prevent subsequent handlers from running and does not panic the bus.
4. **Plugin Unload Withdrawal**: Withdrawing a plugin removes its action and filter hooks cleanly.
5. **Full Project Green Build**: Rust test suite and frontend build.
