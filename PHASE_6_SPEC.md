# PHASE 6 SPECIFICATION — Dynamic Runtime

## Objective
Establish a centralized, capability-driven Dynamic Runtime for EDUcraft across Rust Core and Frontend.
Ensure that subsystems (Asset Resolver, Image Storage, Question Engine, Mindmap Tree, KaTeX Math, Code Highlighting) are activated dynamically based on declared capabilities.
When a capability is disabled (e.g. `images = false`):
- The asset resolver is bypassed without making unnecessary calls.
- No image UI assumptions are made.
- The runtime behaves with full stability and zero overhead.

---

## 1. Core Capabilities
Standard capabilities defined:
1. `images`: Image loading, smart image engine, asset resolver, image uploads.
2. `questions`: Quiz mode, leaf decks, question scoring, 13 question types.
3. `mindmap`: Interactive SVG knowledge tree, collision-free auto-layout, cross-links.
4. `canvas_a4`: A4 sheet miniature preview and direct on-canvas A4 editing studio.
5. `katex`: Mathematical LaTeX rendering.
6. `code_highlight`: Prism syntax highlighting.
7. `audio`: Multimodal audio playback and narrations.
8. `video`: Video playback.
9. `editor`: Authoring ribbon, block creation, outline editing.

---

## 2. Dynamic Runtime Architecture

### A. Capability Set (`RuntimeCapabilities`)
```rust
pub struct RuntimeCapabilities {
    pub images: bool,
    pub questions: bool,
    pub mindmap: bool,
    pub canvas_a4: bool,
    pub katex: bool,
    pub code_highlight: bool,
    pub audio: bool,
    pub video: bool,
    pub editor: bool,
    pub custom: HashSet<String>,
}
```

### B. Capability Negotiation
- **Legacy Books (Implicit Default)**:
  - If a book JSON does not declare `capabilities`, the runtime infers the standard full-feature profile (`images: true`, `questions: true`, `mindmap: true`, `canvas_a4: true`, `katex: true`, `code_highlight: true`, `editor: true`).
- **Declared Capabilities**:
  - If a book specifies `capabilities: ["questions", "katex"]`, the runtime sets `images = false`, `mindmap = false`, etc.
- **Runtime Context (`RuntimeContext`)**:
  - Centralized coordinator in Rust (`src-tauri/src/runtime/mod.rs`).
  - Guards the Asset Resolver: calling `resolve_asset` when `images == false` immediately returns `resolved = false` with `reason: "Capability 'images' is disabled in active runtime context"`.
  - Guards the Asset Storage: calling `save_book_asset` when `images == false` immediately rejects without disk I/O.

### C. Frontend Runtime Layer (`src/runtime/capabilities.ts`)
- Provides `CapabilityContext` and `useCapabilities()` hook / controller.
- Views inspect `can("images")`, `can("mindmap")`, `can("questions")` from one central authority rather than checking fragmented props or raw JSON fields.

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/dynamic_runtime_test.rs`:
1. **Default Capabilities**: Old book produces full capability profile (all standard flags true).
2. **Capability Negotiation**: Book declaring `["questions", "katex"]` produces runtime with `questions = true`, `katex = true`, and `images = false`.
3. **Subsystem Guarding (Images Disabled)**:
   - Calling resolver with `images: false` runtime returns `resolved = false` with disabled capability reason.
   - Calling asset storage with `images: false` runtime is rejected.
4. **Custom Capabilities**: Dynamic registration of arbitrary plugin capabilities (e.g. `ext.threejs`).
5. **Full Project Green Build**: Rust test suite and frontend build.
