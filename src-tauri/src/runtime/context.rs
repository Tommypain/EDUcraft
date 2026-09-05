//! Centralized Runtime Context coordinating capability-driven subsystem execution.

use super::capabilities::RuntimeCapabilities;
use crate::asset_resolver::{resolve_asset, AssetIndex, AssetResolutionQuery, AssetResolutionResult};
use crate::contracts::KnowledgeAssetManifest;
use crate::export_engine::types::ExportBook;

#[derive(Debug, Clone, Default)]
pub struct RuntimeContext {
    pub capabilities: RuntimeCapabilities,
    pub active_book_id: Option<String>,
}

impl RuntimeContext {
    pub fn new(capabilities: RuntimeCapabilities) -> Self {
        Self {
            capabilities,
            active_book_id: None,
        }
    }

    /// Construct a runtime context tailored to a specific book's declared capabilities.
    pub fn from_book(book: &ExportBook) -> Self {
        let capabilities = RuntimeCapabilities::negotiate(&book.capabilities);
        Self {
            capabilities,
            active_book_id: Some(book.id.clone()),
        }
    }

    pub fn can(&self, capability: &str) -> bool {
        self.capabilities.can(capability)
    }

    /// Guarded asset resolution.
    /// If the runtime context does not have the 'images' capability,
    /// resolution is bypassed with zero overhead and zero fabrication.
    pub fn resolve_asset(
        &self,
        manifest: &KnowledgeAssetManifest,
        index: &AssetIndex,
        query: &AssetResolutionQuery,
    ) -> AssetResolutionResult {
        if !self.can("images") {
            return AssetResolutionResult::unresolved(
                "Asset resolution bypassed: capability 'images' is disabled in active runtime context",
            );
        }

        resolve_asset(manifest, index, query)
    }

    /// Guarded asset persistence check.
    pub fn check_asset_storage_allowed(&self) -> Result<(), String> {
        if !self.can("images") {
            return Err("Asset storage rejected: capability 'images' is disabled in runtime context".to_string());
        }
        Ok(())
    }
}
