# PHASE 10 SPECIFICATION — Titanium Building Blocks

## Objective
Establish the standard **Titanium Building Blocks** subsystem:
1. **Unified Block Registry & Dispatcher**:
   - Manages the 9 core built-in blocks (`sectionTitle`, `subtitle`, `text`, `note`, `keyterm`, `important`, `quote`, `table`, `cardGrid`) + custom plugin blocks.
   - Robust **Fallback Handler**: If a block kind is unrecognized (e.g. from an uninstalled or disabled plugin), cleanly render a structured fallback block without crashing or failing export/import.
2. **Unified Question Registry & Dispatcher**:
   - Manages the 13 core question types (`multiple_choice`, `true_false`, `cloze`, `matching`, `sorting`, `short_answer`, etc.) + custom plugin question types.
   - Robust **Question Fallback Handler**: Renders an informative fallback preview if an archetype is missing.
3. **Design Token & Theme Registry**:
   - Formal Design Tokens: Color palettes, typography scales, spacing units, border radii, shadows, and RTL mirroring.
   - Theme resolver: resolves active theme variables with cascading inheritance.
4. **Extension Slot System**:
   - Slot definitions: `SlotId` (`HeaderActions`, `SidebarTabs`, `LeafHeader`, `LeafFooter`, `PageOverlay`, `ModalDialog`).
   - Slot contribution registry: allows active plugins to inject UI components and actions into declared slots.

---

## 1. Architecture & Models

### A. Block & Question Registries (`src-tauri/src/titanium/blocks.rs`)
```rust
pub struct BlockRegistry {
    built_in: HashSet<String>,
    custom: HashMap<String, DeclarativeBlockDef>,
}
```
- Core blocks recognized:
  `["sectionTitle", "subtitle", "text", "note", "keyterm", "important", "quote", "table", "cardGrid"]`
- Fallback rendering:
  ```rust
  pub fn render_or_fallback(&self, block: &serde_json::Value) -> RenderedBlock
  ```
  Returns `RenderedBlock { kind, content, is_fallback }`.

### B. Theme Tokens (`src-tauri/src/titanium/theme_tokens.rs`)
- Standard tokens:
  - Font families (`sans`, `mono`, `arabic`)
  - Color tokens (`primary`, `surface`, `border`, `text_main`, `text_muted`, `accent`)
  - Radii & Shadows

### C. Extension Slots (`src-tauri/src/titanium/slots.rs`)
- Defined slot locations and aggregated slot contents.

---

## 2. API Surface
- `BlockRegistry::is_supported(&self, kind: &str) -> bool`
- `BlockRegistry::render_block(&self, kind: &str, fields: &HashMap<String, serde_json::Value>) -> RenderedBlock`
- `QuestionRegistry::is_supported(&self, q_type: &str) -> bool`
- `QuestionRegistry::evaluate_score(&self, q_type: &str, submission: &serde_json::Value, answer_key: &serde_json::Value) -> QuestionScore`
- `SlotRegistry::get_slot_items(&self, slot: &SlotId) -> Vec<SlotItem>`

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/titanium_building_blocks_test.rs`:
1. **Core Block & Question Recognition**: Verify all 9 built-in blocks and 13 core questions are identified as natively supported.
2. **Custom Block Registration & Rendering**: Register a custom block and verify rendering.
3. **Graceful Fallback on Missing Extension**: Verify an unknown block or disabled plugin block renders a structured fallback with `is_fallback = true` without error.
4. **Question Scoring & Fallback**: Verify question evaluation and fallback grading.
5. **Slot Registry Operations**: Inject items into `SidebarTabs` and `LeafFooter` and verify order and filtering.
6. **Full Project Green Build**: Rust test suite and frontend build.
