# PHASE 9 SPECIFICATION — Declarative Plugin System

## Objective
Establish a **Declarative Plugin System** for Titanium that allows extending EDUcraft without arbitrary executable code. Declarative plugins define:
1. **Custom Content Blocks**:
   - `kind`: Unique block identifier (e.g. `calloutNotice`, `codePlayground`).
   - `title`: Display name in editor palette.
   - `schema`: Expected fields, default values, and required attributes.
   - `render_template`: Markdown / HTML / Token template for presentation.
2. **Custom Themes**:
   - `id`, `name`: Theme identifier and human-readable name.
   - `variables`: CSS custom properties (colors, backgrounds, fonts, radii, borders).
   - `is_dark`: Theme flavor flag.
3. **Custom Views / Tools**:
   - `id`, `title`, `icon`: View descriptor.
   - `target_pane`: Placement (`sidebar`, `editor_toolbar`, `footer_tray`, `modal`).
   - `component_type`: Archetype identifier (`markdown_preview`, `inspector`, `glossary`, `asset_gallery`).
4. **Custom Question Archetypes**:
   - `type`: Question type identifier (e.g. `matrix_matching`, `flashcard_flip`).
   - `title`: Question type display name.
   - `default_points`: Default grading weight.
   - `scoring_mode`: `exact`, `partial`, `boolean`.
5. **Shortcode / Macro Processors**:
   - Pattern replacement rules (e.g. `{{callout:kind}}...{{/callout}}` or `[tip]...[/tip]`).

---

## 1. Data Contracts & Architecture

### A. Declarative Models (`src-tauri/src/titanium/declarative.rs`)
```rust
pub struct DeclarativePlugin {
    pub manifest: PluginManifest,
    pub content_blocks: Vec<DeclarativeBlockDef>,
    pub themes: Vec<DeclarativeThemeDef>,
    pub views: Vec<DeclarativeViewDef>,
    pub question_types: Vec<DeclarativeQuestionDef>,
    pub macros: Vec<DeclarativeMacroDef>,
}
```

### B. Validation & Pure Safety
- 100% declarative: Zero executable code or foreign scripts.
- Schema verification for block definitions and theme CSS variables.
- Pure string transformations for macros with recursion depth guard.

---

## 2. API Surface
- `DeclarativePlugin::from_manifest(manifest: PluginManifest, raw_data: &serde_json::Value) -> Result<Self, TitaniumError>`
- `DeclarativePlugin::render_block(&self, kind: &str, fields: &HashMap<String, serde_json::Value>) -> Option<String>`
- `DeclarativePlugin::expand_macros(&self, text: &str) -> String`
- `DeclarativePlugin::generate_css(&self, theme_id: &str) -> Option<String>`

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/declarative_plugin_test.rs`:
1. **Declarative Plugin Parsing**: Ingest declarative block, theme, view, and question definitions.
2. **Block Template Rendering**: Render custom content block into clean HTML with dynamic variables.
3. **Macro Expansion**: Test shortcode parsing (`[badge color="green"]Text[/badge]` -> styled HTML) with recursion guards.
4. **Theme CSS Generation**: Verify CSS variable sheet emission.
5. **Full Project Green Build**: Rust test suite and frontend build.
