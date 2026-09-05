# PHASE 14 SPECIFICATION — Migration & Compatibility

## Objective
Establish a formal, lossless **Data Schema Migration Engine** for EDUcraft:
1. **Schema Version Detection**:
   - Accurately detects version of input book: unversioned legacy (`"1.0"`), intermediate, or current (`"1.1"`).
2. **Lossless Forward Migration (`1.0` → `1.1`)**:
   - Injects canonical `schema_version: "1.1"`.
   - Injects standard capability set (`["images", "quizzes", "cross_links", "reading_progress"]`).
   - Ensures all `pageBlocks` have stable unique `id`s.
   - Preserves all unknown fields in `extra` (Zero Data Loss guarantee).
   - Generates migration audit report detailing every transformation performed.
3. **Lossless Backward Downsampling (`1.1` → `1.0`)**:
   - Strips non-breaking v1.1 extensions or flattens them into `extra` for legacy v1.0 consumer compatibility.
4. **Zero Breaking Changes**:
   - Old books continue to load and render with 100% fidelity.

---

## 1. Architecture & Models

### A. Migration Models (`src-tauri/src/migration/mod.rs`)
```rust
pub struct MigrationReport {
    pub from_version: String,
    pub to_version: String,
    pub changes: Vec<String>,
    pub timestamp: String,
}
```

### B. Migration Pipeline (`MigrationEngine`)
- `detect_version(val: &serde_json::Value) -> String`
- `migrate_book(book_val: serde_json::Value) -> Result<(serde_json::Value, MigrationReport), MigrationError>`
- `downgrade_to_v1_0(book_val: serde_json::Value) -> Result<serde_json::Value, MigrationError>`

---

## 2. API Surface
- `MigrationEngine::migrate_to_current(val: serde_json::Value) -> Result<(ExportBook, MigrationReport), MigrationError>`
- `MigrationEngine::downsample_for_v1_0(book: &ExportBook) -> Result<serde_json::Value, MigrationError>`

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/migration_test.rs`:
1. **Legacy Unversioned Ingestion**: Ingest legacy book without `schema_version`, verify it is upgraded to `"1.1"` with capabilities.
2. **Zero Data Loss Invariant**: Verify all custom fields in branches, leaves, and blocks are preserved 1:1.
3. **Block ID Auto-Generation**: Verify blocks without IDs receive deterministic IDs (`leafId_b{i}`).
4. **Backward Downsampling**: Verify modern book downsampled to v1.0 can be deserialized by legacy parser.
5. **Full Project Green Build**: Rust test suite and frontend build.
