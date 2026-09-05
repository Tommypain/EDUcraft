//! Titanium Event Bus and Hook Subsystem
//!
//! Provides priority-ordered Action hooks (side-effects) and Filter hooks (data transformations)
//! with complete panic and error isolation.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::Arc;

/// Standard lifecycle and interaction events dispatched across Titanium.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", rename_all = "snake_case")]
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

impl HookEvent {
    pub fn name(&self) -> &'static str {
        match self {
            HookEvent::BeforeBookLoad { .. } => "before_book_load",
            HookEvent::AfterBookLoad { .. } => "after_book_load",
            HookEvent::BeforeBookSave { .. } => "before_book_save",
            HookEvent::AfterBookSave { .. } => "after_book_save",
            HookEvent::BeforeExport { .. } => "before_export",
            HookEvent::AfterExport { .. } => "after_export",
            HookEvent::OnLeafComplete { .. } => "on_leaf_complete",
            HookEvent::OnQuestionSubmit { .. } => "on_question_submit",
            HookEvent::OnStudyRecord { .. } => "on_study_record",
        }
    }
}

/// Pipeline filter locations where plugins can intercept and transform data.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FilterHook {
    FilterExportHtml,
    FilterBlockContent,
    FilterQuestionSubmission,
}

/// Outcome of an individual action hook execution.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct HookExecutionResult {
    pub subscriber_id: String,
    pub plugin_id: String,
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// An action hook subscriber that executes a side effect on an event.
#[derive(Clone)]
pub struct ActionSubscriber {
    pub id: String,
    pub plugin_id: String,
    pub priority: i32,
    pub handler: Arc<dyn Fn(&HookEvent) -> Result<(), String> + Send + Sync>,
}

/// A filter hook subscriber that transforms data flowing through the pipeline.
#[derive(Clone)]
pub struct FilterSubscriber {
    pub id: String,
    pub plugin_id: String,
    pub priority: i32,
    pub handler: Arc<dyn Fn(serde_json::Value) -> Result<serde_json::Value, String> + Send + Sync>,
}

/// Central fault-tolerant Event Bus for Titanium plugins.
#[derive(Default, Clone)]
pub struct HookBus {
    action_subscribers: HashMap<String, Vec<ActionSubscriber>>,
    filter_subscribers: HashMap<FilterHook, Vec<FilterSubscriber>>,
}

impl HookBus {
    pub fn new() -> Self {
        Self::default()
    }

    /// Subscribe an action handler to an event name.
    pub fn subscribe_action(&mut self, event_name: impl Into<String>, subscriber: ActionSubscriber) {
        self.action_subscribers
            .entry(event_name.into())
            .or_default()
            .push(subscriber);
    }

    /// Subscribe a filter handler to a filter pipeline.
    pub fn subscribe_filter(&mut self, hook: FilterHook, subscriber: FilterSubscriber) {
        self.filter_subscribers
            .entry(hook)
            .or_default()
            .push(subscriber);
    }

    /// Dispatch an action event to all subscribed handlers in descending priority order.
    /// Panics and errors in handlers are isolated and will never bubble up or crash the core app.
    pub fn dispatch_action(&self, event: &HookEvent) -> Vec<HookExecutionResult> {
        let mut results = Vec::new();
        let event_name = event.name();

        if let Some(subscribers) = self.action_subscribers.get(event_name) {
            let mut sorted = subscribers.clone();
            sorted.sort_by(|a, b| b.priority.cmp(&a.priority));

            for sub in sorted {
                let handler = Arc::clone(&sub.handler);
                let event_ref = event.clone();

                let exec_res = catch_unwind(AssertUnwindSafe(move || (handler)(&event_ref)));

                match exec_res {
                    Ok(Ok(())) => {
                        results.push(HookExecutionResult {
                            subscriber_id: sub.id,
                            plugin_id: sub.plugin_id,
                            success: true,
                            error: None,
                        });
                    }
                    Ok(Err(err)) => {
                        results.push(HookExecutionResult {
                            subscriber_id: sub.id,
                            plugin_id: sub.plugin_id,
                            success: false,
                            error: Some(err),
                        });
                    }
                    Err(_) => {
                        results.push(HookExecutionResult {
                            subscriber_id: sub.id,
                            plugin_id: sub.plugin_id,
                            success: false,
                            error: Some("Handler panicked".to_string()),
                        });
                    }
                }
            }
        }

        results
    }

    /// Pipe data sequentially through all registered filter subscribers in priority order.
    /// Any failing filter is skipped, preserving the current state of data.
    pub fn apply_filter(&self, hook: FilterHook, mut value: serde_json::Value) -> serde_json::Value {
        if let Some(subscribers) = self.filter_subscribers.get(&hook) {
            let mut sorted = subscribers.clone();
            sorted.sort_by(|a, b| b.priority.cmp(&a.priority));

            for sub in sorted {
                let handler = Arc::clone(&sub.handler);
                let val_clone = value.clone();

                let res = catch_unwind(AssertUnwindSafe(move || (handler)(val_clone)));
                if let Ok(Ok(next_val)) = res {
                    value = next_val;
                }
            }
        }
        value
    }

    /// Withdraw all hooks registered by a specific plugin upon deactivation or uninstall.
    pub fn withdraw_plugin_hooks(&mut self, plugin_id: &str) {
        for subs in self.action_subscribers.values_mut() {
            subs.retain(|s| s.plugin_id != plugin_id);
        }
        for subs in self.filter_subscribers.values_mut() {
            subs.retain(|s| s.plugin_id != plugin_id);
        }
    }
}
