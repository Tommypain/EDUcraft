# PHASE 0 REPORT — Comprehensive Architecture Audit

## 1. Executive Summary
Phase 0 Architecture Audit was conducted non-destructively across the entire EDUcraft codebase (Frontend, Backend Rust Core, and Data Contracts).
The audit confirmed a highly functional, feature-rich educational platform with zero regressions, passing 100% of Rust backend unit/integration tests (20/20) and passing frontend production bundle builds (`npm run build`).

---

## 2. Inventory of Existing Subsystems

### A. Frontend Subsystems (`src/`)
1. **Core Application & Shell**:
   - `src/EDUcraft_fixed.jsx`: Monolithic component (~12,900 lines) containing the complete app shell, state machine, multi-mode views, dialogs, modals, and asset hooks.
   - `src/standalone.jsx`: Headless/standalone bundle entry point reading `window.EDUCRAFT_EXPORT`.
   - `src/main.jsx`: Vite/Tauri desktop entry point mounting the root React application.
2. **Views**:
   - `LibraryView`: Book shelf grid, hierarchical collections (folders and encyclopedias), search, filtering, item relocation popover, book cover gradient customizer, backup and import triggers.
   - `TreeView`: Interactive SVG knowledge tree / mindmap canvas with branch, sub-branch, and leaf nodes, collision-free multi-tier auto-layout, cross-links (`crossLinks: [[from, to]]`), and node selection breadcrumbs.
   - `LeafDeck`: Interactive flashcard/quiz mode with question timers, score calculation, explanations, and instant feedback banners.
   - `ReadThroughView`: Continuous full-book study mode supporting dual presentation:
     - High-fidelity A4 sheet miniature preview.
     - Responsive mobile continuous read-through flow (cards, blocks, inline questions).
   - `EditorView`: Knowledge tree editor, A4 Canvas Studio with floating action toolbar (`CanvasBlockWrapper`), 60 Plates English Palette Picker, card outline manager, and block authoring tools.
   - `PlannerView`: Study pacing calendar, streak counter, leaf completion tracking, and study target manager.
3. **Renderers**:
   - **Content Engine (`ContentBlock`)**:
     - Supported block kinds (9): `sectionTitle`, `text`, `keyterm`, `note`, `warning`, `important`, `code`, `table`, `image`, `pagebreak`.
     - Smart Image Engine: 25%, 50%, 75%, 100% width modes, left/center/right alignment, aspect ratio preservation, placeholders (`isPlaceholder: true`).
     - Tables: Configurable column headers, responsive row rendering, cell text alignment.
     - Code: Syntax-highlighted code container with language tags.
   - **Question Engine**:
     - All 13 question types fully implemented and rendered:
       1. `single` (Single-choice MCQ)
       2. `multi` (Multiple-choice MCQ)
       3. `tf` (True / False boolean)
       4. `short` (Short text answer)
       5. `essay` (Long subjective essay)
       6. `fill` (Fill-in-the-blank text matching)
       7. `cloze` (Inline cloze deletions)
       8. `match` (Pair matching with connection lines)
       9. `order` (Sequence re-ordering)
       10. `sort` (Category categorization buckets)
       11. `numeric` (Numerical tolerance evaluation)
       12. `rating` (Likert rating scale)
       13. `slider` (Continuous range slider)
     - Question content block support: Optional rich `content: ContentBlock[]` rendered prior to question prompt.

### B. Backend Subsystems (`src-tauri/`)
1. **Book Manager (`src-tauri/src/book_manager/`)**:
   - `mod.rs`: Central lifecycle management (`load_books`, `scan_books`, `save_book`, `delete_book`).
   - `types.rs`: `DiscoveredBook`, `BookState` (`Valid`, `Incomplete`, `Invalid`, `Missing`, `Changed`), `BookScanResult`.
   - `scanner.rs`: Recursive directory traversal for `.json` and directory-based books.
   - `importer.rs`: Validates and loads incoming JSON schemas.
   - `validator.rs`: Structural and semantic validation (root book fields, node hierarchy, content block schema rules, table row lengths matching headers, question content rules).
   - `assets.rs`: Filesystem image saving and deletion at `BOOKS/<book_id>/assets/images/<filename>`.
   - `deleter.rs`: Physical deletion of books and associated asset directories.
2. **Export Engine (`src-tauri/src/export_engine/`)**:
   - `html_builder.rs`: Builds self-contained single-file HTML exports, inlines CSS/JS bundles, resolves static assets into base64 data URIs, injects `window.EDUCRAFT_EXPORT`.
   - `bundle_loader.rs`: Loads embedded assets (`ui_bundle.js`, `ui_bundle.css`) from compile-time assets or disk.
   - `types.rs`: `ExportBook`, `BookNode`, `BookLocale`, `ExportCollection`, `ExportSeed`.
3. **IPC Bridge & Commands (`src-tauri/src/commands/`)**:
   - `books.rs`: `scan_books_dir`, `load_book`, `save_book_json`, `delete_book_item`, `save_book_asset`, `delete_book_asset`.
   - `export_book.rs`: `export_standalone_html`, `export_book_json`.
   - `export_collection.rs`: Multi-book collection bundle export.
4. **Toolchain & Linker Config**:
   - `src-tauri/.cargo/config.toml` properly specifies host glibc linker flags (`-C link-arg=-Wl,--no-as-needed -C link-arg=/usr/lib64/ld-linux-x86-64.so.2`).
   - 20/20 Rust tests pass:
     - 6 tests in `lib.rs` (Export Engine core).
     - 12 tests in `book_manager_test.rs` (Book lifecycle, asset lifecycle, table validation, idempotent rescanning).
     - 2 tests in `export_test.rs` (HTML build and JS payload formatting).

---

## 3. Active Data Contracts & Dependencies

### Data Contract 1: Book JSON (`book.json`)
- **Structure**:
  ```json
  {
    "id": "html-master-curriculum",
    "cover": { "from": "#0f172a", "to": "#1e293b", "icon": "Code" },
    "ar": { "title": "...", "tagline": "..." },
    "en": { "title": "...", "tagline": "..." },
    "crossLinks": [["leaf-1", "leaf-2"]],
    "nodes": [ ... ]
  }
  ```
- **Readers**:
  - Frontend: `EDUcraft_fixed.jsx` (`loadBook`, `activeBook`, `LibraryView`, `TreeView`, `ReadThroughView`, `EditorView`).
  - Backend: `src-tauri/src/book_manager/importer.rs`, `src-tauri/src/export_engine/html_builder.rs`.
- **Writers**:
  - Frontend: `saveBookToDisk()` invoking Tauri IPC command `save_book_json`.
  - Backend: `src-tauri/src/commands/books.rs`.

### Data Contract 2: Book Node (`BookNode`)
- **Structure**:
  - `level`: `"branch"` | `"sub"` | `"leaf"`
  - `id`: Unique string ID.
  - `ar`: `{ "title": "...", "summary": "..." }` or plain string.
  - `en`: `{ "title": "...", "summary": "..." }` or plain string.
  - `cards`: Array of cards with `questionGroups`.
  - `questions`: Direct array of questions (legacy or alternative format).
  - `pageBlocks`: Array of `ContentBlock` objects.
  - `pagePaletteId`: Palette identifier (1 to 60).

### Data Contract 3: Collections (`educraft_collections.json`)
- **Structure**:
  - Array of `{ "id": string, "kind": "folder" | "encyclopedia", "title": string, "itemIds": string[] }`.
- **Storage**:
  - Primary: Frontend `localStorage.getItem("educraft_collections")`.
  - Persistence: Written to disk as `educraft_collections.json` in the books directory.

---

## 4. Architectural Couplings & Technical Debt

1. **Asset Identity Coupled to Filename**:
   - Currently, assets are referenced by relative file paths (e.g. `assets/images/header.png`).
   - There is no stable, globally unique `asset_id` (e.g. `ast_01h8...`). Renaming or moving files breaks references.
2. **Missing Asset Manifest**:
   - Books currently do not have a dedicated `asset-manifest.json` describing asset metadata (hash, mime type, byte size, dimensions, semantic role, captions, sources).
3. **No Explicit Schema Versioning**:
   - Books currently do not carry a `schema_version` attribute (e.g., `"1.0"`). Versioning is implicit, making migrations fragile.
4. **Monolithic Frontend Architecture**:
   - `EDUcraft_fixed.jsx` houses the entirety of the UI, renderers, canvas tools, and view logic in a single file of ~13,000 lines.
   - Titanium extension layer does not yet exist to decouple views, renderers, and tools into modular plugins.
5. **No Declarative Capability Negotiation**:
   - The engine does not declare or inspect book capabilities (e.g., whether a book requires KaTeX, Prism, 3D Canvas, Audio, or custom question types).

---

## 5. Compatibility Principles for Evolution

To satisfy the **Master Architecture Autonomous Engineering Loop**:
1. **Rule 1 is Absolute**: Never break existing JSON. Every existing book in `BOOKS/` and `src/data/` must continue to load, validate, and render flawlessly without manual migration.
2. **Additive-First Evolution**:
   - `schema_version` is optional and defaults to `"1.0"`.
   - `assets` manifest and `asset_id` references are optional. If an image block contains `imageUrl`, it resolves transparently.
   - Books with 0 assets remain 100% valid.
3. **Strict Validation with Clear Diagnostics**:
   - Deserializers in Rust must use `#[serde(default)]` and `#[serde(flatten)]` to ensure forward-compatibility with any future fields without failing on legacy books.

---

## 6. Phase 0 Audit Conclusion & Next Phase
- **Status**: Audit completed successfully with zero blockers.
- **Next Phase**: **PHASE 1 — DATA CONTRACT ARCHITECTURE**.
- **Immediate Action**: Create `PHASE_1_SPEC.md`, specify the additive schema contracts (`schema_version`, capabilities, asset manifest reference, typed models in Rust & TS), implement and verify.
