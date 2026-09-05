# PHASE 15 SPECIFICATION — Full Integration

## Objective
Wire together all built subsystems into a unified, end-to-end operational architecture:
1. **End-to-End Pipeline**:
   - Asset Extraction Engine (Phase 3)
   - Asset Intelligence & Perceptual Hashing (Phase 4)
   - Semantic Asset Resolver (Phase 5)
   - Dynamic Runtime & Capabilities (Phase 6)
   - In-Memory Knowledge Graph (Phase 7)
   - Titanium Plugin Registry & Building Blocks (Phases 8-13)
   - Migration Engine (Phase 14)
2. **IPC Command Surface**:
   - Add Tauri IPC commands in `src-tauri/src/commands/` for Titanium management and graph queries:
     - `titanium_list_plugins`
     - `titanium_activate_plugin`
     - `titanium_deactivate_plugin`
     - `titanium_get_contributions`
     - `titanium_resolve_asset`
3. **End-to-End Test Suite**:
   - Ingest a multimodal document, extract assets, tag intelligence, ingest into knowledge graph, activate a plugin providing custom blocks, query concepts, evaluate questions, and propagate study performance to concept mastery.
4. **Zero Breaking Changes**:
   - All existing export, book management, and UI workflows remain fully intact.

---

## 1. Architecture & IPC Integration

### A. IPC Commands (`src-tauri/src/commands/titanium.rs`)
```rust
#[tauri::command]
pub fn titanium_list_plugins() -> Vec<RegisteredPlugin>;

#[tauri::command]
pub fn titanium_activate_plugin(plugin_id: String) -> Result<Vec<String>, String>;

#[tauri::command]
pub fn titanium_deactivate_plugin(plugin_id: String) -> Result<(), String>;

#[tauri::command]
pub fn titanium_get_contributions() -> AggregatedContributions;
```

### B. Global Application State
- Shared `Mutex<TitaniumRegistry>` initialized with engine version.

---

## 2. Verification Plan
Automated test suite `src-tauri/tests/full_integration_test.rs`:
1. Ingest raw multimodal document with diagrams.
2. Deduplicate and enrich assets with perceptual hashes and intelligence concepts.
3. Build unified KnowledgeGraph with hierarchical and multimodal edges.
4. Verify concept tracing connects extracted diagrams to curriculum leaves and assessment questions.
5. Simulate student answering question and verify real-time mastery score propagation.
6. Install and activate a declarative plugin, verify new block kind is available and aggregated into active contributions.
7. Verify zero regressions across the entire project test suite and frontend build.
