# PHASE 8 SPECIFICATION — Titanium Core

## Objective
Establish the foundational **Titanium Extension Layer** core architecture for EDUcraft:
1. Manifest discovery and validation (`plugin.json` & `plugin.toml`).
2. Robust lifecycle state machine:
   `Discovered → Validated → Installed → Loaded → Activated ⇄ Deactivated → Uninstalled`
3. Explicit permission sandboxing (`FsRead`, `FsWrite`, `Network`, `RegisterBlock`, `RegisterQuestion`, `RegisterTheme`, `RegisterView`).
4. Central `TitaniumRegistry`:
   - Plugin lifecycle management.
   - Capability negotiation & validation.
   - Contribution aggregation (custom views, themes, content blocks, question types).
5. Safe boundaries:
   - Target engine semver validation.
   - Path traversal prevention for entry points and theme assets.
   - Zero regression to existing EDUcraft system.

---

## 1. Architecture & Data Structures

### A. Lifecycle States (`PluginState`)
```rust
pub enum PluginState {
    Discovered,
    Installed,
    Loaded,
    Active,
    Disabled,
    Error(String),
}
```

### B. Permissions (`PluginPermission`)
```rust
pub enum PluginPermission {
    FsRead,
    FsWrite,
    Network,
    ExecuteWasm,
    RegisterBlock,
    RegisterQuestion,
    RegisterTheme,
    RegisterView,
}
```

### C. Registered Plugin (`RegisteredPlugin`)
```rust
pub struct RegisteredPlugin {
    pub manifest: PluginManifest,
    pub state: PluginState,
    pub location: Option<PathBuf>,
    pub installed_at: Option<String>,
}
```

### D. Central Registry (`TitaniumRegistry`)
- Manages all registered plugins and their active states.
- Aggregates contributions from active plugins.
- Enforces capability matching and permission prerequisites.

---

## 2. API Surface
- `TitaniumRegistry::new(engine_version: &str)`
- `discover_directory(&mut self, dir: &Path) -> Result<Vec<String>, TitaniumError>`
- `install_manifest(&mut self, manifest: PluginManifest, location: Option<PathBuf>) -> Result<String, TitaniumError>`
- `load(&mut self, plugin_id: &str) -> Result<(), TitaniumError>`
- `activate(&mut self, plugin_id: &str) -> Result<(), TitaniumError>`
- `deactivate(&mut self, plugin_id: &str) -> Result<(), TitaniumError>`
- `uninstall(&mut self, plugin_id: &str) -> Result<(), TitaniumError>`
- `get_active_contributions(&self) -> AggregatedContributions`
- `check_permission(&self, plugin_id: &str, perm: &PluginPermission) -> bool`

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/titanium_core_test.rs`:
1. **Manifest Validation**: JSON & TOML parsing, required field enforcement, engine version matching.
2. **Lifecycle Transitions**: Full state transitions from Discovered to Active to Deactivated and Uninstalled.
3. **Permission Sandboxing**: Correct permission checking and restriction enforcement.
4. **Contribution Aggregation**: Active plugins contribute views/blocks/themes; deactivated plugins withdraw them.
5. **Path Traversal Prevention**: Malicious entry points (`../../etc/passwd`) are rejected.
6. **Zero Breaking Changes**: Project cargo tests and frontend build pass without issues.
