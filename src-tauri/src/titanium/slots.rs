//! Titanium UI Extension Slots
//!
//! Provides designated insertion points throughout the application interface
//! where active plugins can inject tabs, actions, overlays, and footer widgets.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Standard predefined UI slots in EDUcraft.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SlotId {
    HeaderActions,
    SidebarTabs,
    LeafHeader,
    LeafFooter,
    PageOverlay,
    ModalDialog,
}

impl SlotId {
    pub fn as_str(&self) -> &'static str {
        match self {
            SlotId::HeaderActions => "header_actions",
            SlotId::SidebarTabs => "sidebar_tabs",
            SlotId::LeafHeader => "leaf_header",
            SlotId::LeafFooter => "leaf_footer",
            SlotId::PageOverlay => "page_overlay",
            SlotId::ModalDialog => "modal_dialog",
        }
    }
}

/// An extension item registered into a specific UI slot.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SlotItem {
    pub id: String,
    pub slot: SlotId,
    pub plugin_id: String,
    pub title: String,
    #[serde(default)]
    pub priority: i32,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub payload: HashMap<String, serde_json::Value>,
}

/// Registry managing all currently injected extension slot items.
#[derive(Debug, Clone, Default)]
pub struct SlotRegistry {
    items: HashMap<String, SlotItem>,
}

impl SlotRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    /// Register or update an item into a slot.
    pub fn register_item(&mut self, item: SlotItem) {
        self.items.insert(item.id.clone(), item);
    }

    /// Remove an item by id.
    pub fn unregister_item(&mut self, item_id: &str) {
        self.items.remove(item_id);
    }

    /// Withdraw all slot items contributed by a specific plugin.
    pub fn withdraw_plugin_items(&mut self, plugin_id: &str) {
        self.items.retain(|_, item| item.plugin_id != plugin_id);
    }

    /// Retrieve all items for a slot, sorted by descending priority (higher priority first).
    pub fn get_slot_items(&self, slot: &SlotId) -> Vec<&SlotItem> {
        let mut slot_items: Vec<&SlotItem> = self
            .items
            .values()
            .filter(|item| &item.slot == slot)
            .collect();
        slot_items.sort_by(|a, b| b.priority.cmp(&a.priority));
        slot_items
    }

    pub fn total_items(&self) -> usize {
        self.items.len()
    }
}
