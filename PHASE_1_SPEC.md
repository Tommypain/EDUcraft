# PHASE 1 SPECIFICATION — Data Contract Architecture

## Objective
Establish a formal, strongly-typed, backward-compatible data contract architecture for EDUcraft. Introduce explicit schema versioning (`schema_version`), capability flags, knowledge asset manifest references, and plugin manifests without breaking existing book JSON structures.

---

## 1. Principles & Guarantees
1. **Zero Breaking Changes**: Any book JSON created in previous versions (lacking `schema_version` or asset manifests) must continue to load, validate, render, and export with zero errors or warnings.
2. **Default Fallbacks**:
   - If `schema_version` is absent, the runtime infers `"1.0"`.
   - If `capabilities` is absent, the runtime infers standard core capabilities (`["core", "katex", "prism", "smart-images", "canvas-a4"]`).
   - If `assets` is absent, the book operates in legacy asset mode or zero-asset mode.
3. **Strict Rust Deserialization with Forward Extensibility**:
   - All structs use `serde` default attributes and `#[serde(flatten)]` for pass-through attributes.
4. **Decoupled Contracts**:
   - Contracts must be agnostic of specific UI framework versions and exportable as standard schemas.

---

## 2. Core Contracts Specification

### A. Book Contract (`book.json`)
```typescript
interface BookContract {
  schema_version?: string; // e.g. "1.0", "1.1" (defaults to "1.0")
  id: string;              // unique slug
  ar: BookLocaleContract;  // title, tagline, description, extra
  en: BookLocaleContract;  // title, tagline, description, extra
  cover?: {
    from: string;          // gradient start hex
    to: string;            // gradient end hex
    icon?: string;         // lucide icon name
  };
  flavorId?: string;       // e.g. "code", "medical", "default"
  skinId?: string;
  crossLinks?: [string, string][]; // leaf-to-leaf cross reference edges
  capabilities?: string[]; // declared engine capabilities required
  assets?: {
    manifest_path?: string; // e.g. "assets/manifest.json"
    total_count?: number;
  };
  metadata?: {
    author?: string;
    created_at?: string;
    updated_at?: string;
    version?: string;
    license?: string;
    tags?: string[];
  };
  nodes: BookNodeContract[]; // branches, subs, leaves
  [key: string]: unknown;  // passthrough fields
}
```

### B. Book Node Contract (`BookNodeContract`)
```typescript
interface BookNodeContract {
  id: string;
  level: "branch" | "sub" | "leaf";
  parent?: string;
  ar?: { title: string; summary?: string } | string;
  en?: { title: string; summary?: string } | string;
  pagePaletteId?: string; // 1 to 60 (A4 plate theme)
  pageBlocks?: ContentBlockContract[];
  cards?: CardContract[];
  questions?: QuestionContract[];
  [key: string]: unknown;
}
```

### C. Content Block Contract (`ContentBlockContract`)
```typescript
type ContentBlockKind =
  | "sectionTitle"
  | "text"
  | "keyterm"
  | "note"
  | "warning"
  | "important"
  | "code"
  | "table"
  | "image"
  | "pagebreak";

interface ContentBlockContract {
  id?: string;
  kind: ContentBlockKind;
  text?: string;
  term?: string;
  definition?: string;
  language?: string;
  headers?: string[];
  rows?: string[][];
  // Image Block attributes:
  imageUrl?: string;        // legacy direct path or data URI
  asset_id?: string;        // stable unique asset identifier (v1.1+)
  isPlaceholder?: boolean;
  caption?: string;
  width?: "25%" | "50%" | "75%" | "100%";
  align?: "left" | "center" | "right";
  [key: string]: unknown;
}
```

### D. Knowledge Asset Manifest Contract (`asset-manifest.json`)
```typescript
interface KnowledgeAssetManifest {
  manifest_version: string; // "1.0"
  book_id: string;
  generated_at?: string;
  assets: Record<string, KnowledgeAsset>;
}

interface KnowledgeAsset {
  id: string;               // e.g. "ast_01h8x..."
  original_filename: string;
  storage_path: string;     // e.g. "assets/images/header.png"
  mime_type: string;        // e.g. "image/png"
  byte_size: number;
  sha256: string;
  width?: number;
  height?: number;
  aspect_ratio?: number;
  role?: "figure" | "diagram" | "hero" | "card" | "solution" | "icon" | "unknown";
  caption?: {
    ar?: string;
    en?: string;
  };
  alt?: {
    ar?: string;
    en?: string;
  };
  tags?: string[];
}
```

### E. Question Contract (`QuestionContract`)
```typescript
type QuestionType =
  | "single"
  | "multi"
  | "tf"
  | "short"
  | "essay"
  | "fill"
  | "cloze"
  | "match"
  | "order"
  | "sort"
  | "numeric"
  | "rating"
  | "slider";

interface QuestionContract {
  id: string;
  type: QuestionType;
  stem?: string;
  prompt?: string;
  options?: any[];
  answer?: any;
  explanation?: string;
  points?: number;
  asset_ids?: string[];     // referenced assets
  content?: ContentBlockContract[]; // rich content blocks shown above prompt
  [key: string]: unknown;
}
```

### F. Plugin Manifest Contract (`plugin.toml` / `plugin.json`)
```typescript
interface PluginManifestContract {
  id: string;               // unique reverse-dns style, e.g. "org.educraft.math-editor"
  name: string;
  version: string;          // semver e.g. "1.0.0"
  author?: string;
  description?: string;
  entry_point: string;      // "main.js" or "main.wasm"
  target_engine: string;    // e.g. ">=0.0.9"
  capabilities: string[];   // e.g. ["views:register", "renderers:register"]
  contributions?: {
    views?: { id: string; title: string; icon: string }[];
    themes?: { id: string; name: string; file: string }[];
    content_blocks?: { kind: string; title: string }[];
    question_types?: { type: string; title: string }[];
  };
}
```

---

## 3. Rust Backend Implementation Plan
1. **Types Evolution (`src-tauri/src/export_engine/types.rs`)**:
   - Add `schema_version`, `capabilities`, `metadata`, `assets` to `ExportBook` with defaults.
   - Add `AssetReference` or `asset_id` to ContentBlock / questions if relevant.
2. **Contract Module (`src-tauri/src/contracts/mod.rs`)**:
   - Define dedicated typed structures for `KnowledgeAssetManifest`, `KnowledgeAsset`, `PluginManifest`.
   - Expose validation helpers.
3. **Validator Evolution (`src-tauri/src/book_manager/validator.rs`)**:
   - Verify that books with explicit `schema_version` (e.g. `"1.0"`, `"1.1"`) or without `schema_version` validate identically and cleanly.
   - Verify `asset_id` in image content blocks is validated when present.
4. **TypeScript Definitions**:
   - Create `src/types/contracts.ts` mirroring all contracts for frontend type safety.

---

## 4. Verification Plan
1. **Automated Rust Contract Tests (`src-tauri/tests/contract_compatibility_test.rs`)**:
   - Test 1: Load legacy JSON (V1.0 with no `schema_version`) -> Validate successful deserialization and default version assignment.
   - Test 2: Load modern JSON (V1.1 with `schema_version`, `capabilities`, `metadata`, `assets`) -> Validate full round-trip preservation.
   - Test 3: Asset manifest serialization / deserialization roundtrip.
   - Test 4: Plugin manifest serialization / deserialization roundtrip.
2. **Automated Frontend Build**:
   - Run `npm run build` to confirm zero regressions in the UI bundle.
3. **All existing tests pass**:
   - Run `cargo test` in `src-tauri` (all existing + new tests must pass).
