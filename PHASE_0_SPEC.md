# PHASE 0 SPECIFICATION — Comprehensive Architecture Audit

## Objective
Conduct a thorough, non-destructive audit of the entire existing EDUcraft system across Frontend, Backend (Rust Core & Tauri), and Data contracts. Understand every subsystem, dependency, reader, writer, and coupling before any structural evolution.

## Scope of Audit

### 1. Frontend Subsystems (`src/`)
- **Core App & Shell**: `src/EDUcraft_fixed.jsx`, `src/standalone.jsx`, `src/main.jsx`
- **Views**:
  - `LibraryView`: Shelf, hierarchical collections (folders, encyclopedias), card actions, search, backup
  - `TreeView`: Breadcrumbs, knowledge tree visualization, branch/sub-branch/leaf nodes
  - `LeafDeck`: Question deck, active leaf answering, feedback banner, scoring
  - `ReadThroughView`: Full book read-through, leaf paging, responsive mobile flow vs A4 sheet preview
  - `EditorView`: Knowledge tree editor, question authoring, A4 canvas studio, pageBlocks manager
  - `PlannerView`: To-do checklist, activity calendar, pace tracking, streak calculation
- **Renderers**:
  - Educational Content / Lesson Renderer: Markdown, rich text, media, KaTeX math, Prism syntax highlighting
  - Question Engine Renderers: All 13 question types (single, multiple, boolean, fill, match, order, code, etc.)
  - Leaf / Page Layout: A4 preview, responsive flow mode
- **State & IPC Bridge**:
  - React State vs `localStorage` vs Tauri backend commands (`invoke`)
  - Standalone mode (`window.EDUCRAFT_EXPORT`) vs Tauri desktop mode

### 2. Backend Subsystems (`src-tauri/`)
- **Core Cargo Configuration**: `Cargo.toml`, dependencies (`serde`, `serde_json`, `tauri`, `walkdir`, etc.)
- **Tauri IPC Commands** (`src-tauri/src/commands/`):
  - `book_manager`: Listing, scanning, loading, saving, deleting books
  - `export_book`: Standalone HTML and JSON export commands
  - `export_collection`: Multi-book collection bundle export
- **Export Engine** (`src-tauri/src/export_engine/`):
  - `html_builder.rs`: Standalone HTML packaging, CSS/JS asset inlining, seed data injection
  - `bundle_loader.rs`: Embedded asset resolution (`ui_bundle.js`, `ui_bundle.css`)
  - `types.rs`: Export metadata, options, and payloads
- **Binaries & Scripts**:
  - `src-tauri/src/bin/export_cli.rs`: Headless command-line HTML export
  - `src-tauri/src/bin/books_cli.rs`: CLI book validation and management
  - Bundler scripts: `scripts/build-export-bundle.js`, `scripts/export-html-cli.js`
- **Validation Engine**:
  - Rust data validator rules, error structures, incomplete vs corrupted book handling

### 3. Data Subsystems & Contracts
- **Book JSON Contract**:
  - Top-level fields: `id`, `en`, `ar`, `cover`, `flavorId`, `nodes`, `pageBlocks`, `questions`
  - Node hierarchy: `branch` -> `sub` -> `leaf`
  - Leaf payload: `id`, `title`, `summary`, `contentBlocks`, `questions`
- **Questions Contract**:
  - Internal schema: `id`, `type`, `stem`, `options`, `answer`, `explanation`, `points`
- **Collections Contract**:
  - Array of `{ id, kind: "folder" | "encyclopedia", title, itemIds: [...] }`
- **Mindmap / Knowledge Tree Contract**:
  - Graph node relationships, cross-links (`crossLinks: [...]`), coordinate system (`VB_W = 800, VB_H = 300`)

### 4. Key Questions to Answer in Audit
1. What exists currently?
2. What is the active data contract across each subsystem?
3. Who reads each JSON?
4. Who writes each JSON?
5. Who depends on filenames vs stable IDs?
6. What is directly coupled to React?
7. What is directly coupled to Rust?
8. Where are the hardcoded paths, magic strings, and implicit assumptions?
9. How is error handling structured?
10. How does the import/export pipeline operate end-to-end?

## Methodology
- Pure inspection: No production code changes during Phase 0.
- Deep code exploration using static file inspection, ripgrep pattern analysis, AST trace, and runtime CLI validation.
- Output: `PHASE_0_REPORT.md` documenting all findings with zero assumptions.
