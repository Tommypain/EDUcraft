# PHASE 11 SPECIFICATION — Plugin Composition

## Objective
Establish the **Plugin Composition Engine** for Titanium, enabling:
1. **Plugin Dependencies**:
   - Manifests declare dependencies on other plugins with version constraints (e.g. `dependencies: { "com.educraft.math": ">=1.0.0" }`).
2. **Topological Dependency Graph Resolution**:
   - Builds a Directed Acyclic Graph (DAG) of plugin dependencies.
   - Computes deterministic activation order (`topological_sort`).
   - Detects missing dependencies and cyclic dependencies (`A -> B -> C -> A`).
3. **Feature Packs / Bundles**:
   - Meta-plugins that aggregate multiple child plugins into a cohesive suite (e.g. `stem_bundle`, `language_arts_pack`).
4. **Conflict Detection & Prevention**:
   - Detects collision in custom block kinds (`kind`), question types (`type`), and exclusive capabilities before activation.
5. **Zero Breaking Changes**:
   - Fully backward-compatible with standalone and legacy plugins without dependencies.

---

## 1. Architecture & Models

### A. Extended Plugin Manifest & Dependency Spec (`src-tauri/src/titanium/composition.rs`)
```rust
pub struct PluginDependency {
    pub id: String,
    pub version_req: String,
}

pub struct FeaturePackManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub bundled_plugins: Vec<String>,
}
```

### B. Dependency Graph Resolver (`DependencyResolver`)
- `resolve_activation_order(plugin_ids: &[String], registry: &TitaniumRegistry) -> Result<Vec<String>, CompositionError>`
- Detects cycles via Kahn's algorithm or DFS with recursion stack tracking.
- Validates that required dependencies exist and satisfy semver constraints.

### C. Conflict Detector (`ConflictDetector`)
- Detects if two plugins attempt to register the same `kind` of content block, question type, or conflicting exclusive capabilities.

---

## 2. API Surface
- `DependencyResolver::resolve_order(plugins: &[PluginManifest]) -> Result<Vec<String>, CompositionError>`
- `ConflictDetector::check_conflicts(active: &[PluginManifest], candidate: &PluginManifest) -> Result<(), CompositionError>`
- `TitaniumRegistry::activate_with_dependencies(&mut self, plugin_id: &str) -> Result<Vec<String>, TitaniumError>`

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/plugin_composition_test.rs`:
1. **Linear Dependency Chain**: A depends on B, B depends on C -> activation order `[C, B, A]`.
2. **Missing Dependency Error**: Attempting to resolve a plugin with an unsatisfied dependency returns clear error.
3. **Circular Dependency Detection**: A depends on B, B depends on A -> cycle error detected.
4. **Collision Detection**: Two plugins registering the same block kind `latexBlock` rejected with collision error.
5. **Feature Pack Bundle**: Ingesting a feature pack activates all bundled sub-plugins in topological order.
6. **Full Project Green Build**: Rust test suite and frontend build.
