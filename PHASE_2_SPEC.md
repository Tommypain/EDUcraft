# PHASE 2 SPECIFICATION — Knowledge Asset Model

## Objective
Design and implement the generic Knowledge Asset abstraction for EDUcraft. Support future multimodal asset types (image, diagram, chart, table, audio, video, document, PDF figure, 3D model, interactive diagram) with stable IDs, SHA-256 deduplication, semantic roles, localized metadata, and reference tracking. Ensure books with 0 assets remain completely valid and natural.

---

## 1. Guarantees & Constraints
1. **Zero Assets is Normal (Rule 9)**: No errors, no synthetic placeholder assets, no required asset directories.
2. **Stable Identity (Rule 10)**: Asset identity is defined by a stable ID (`asset_id`), never a transient filename or relative path.
3. **Multimodal Future-Proofing**: The model supports non-image assets (audio, video, 3D glTF models, interactive charts) natively.
4. **Content-Addressable Deduplication**: Deduplication is performed by SHA-256 hash. Identical payloads map to canonical assets.
5. **Integrity & Reference Tracking**: The system detects unused assets and broken references without failing or corrupting data.

---

## 2. Model Specification

### A. Asset Type (`AssetType`)
```rust
pub enum AssetType {
    Image,
    Diagram,
    Chart,
    Table,
    Audio,
    Video,
    Document,
    PdfFigure,
    Model3D,
    InteractiveDiagram,
    Unknown,
}
```

### B. Asset Semantic Role (`AssetRole`)
```rust
pub enum AssetRole {
    Figure,
    Diagram,
    Hero,
    Card,
    Solution,
    Icon,
    Decorative,
    Unknown,
}
```

### C. Knowledge Asset (`KnowledgeAsset`)
```rust
pub struct KnowledgeAsset {
    pub id: String,                         // e.g. "ast_01h8x..."
    pub asset_type: AssetType,              // multimodal category
    pub role: AssetRole,                    // pedagogical function
    pub original_filename: String,          // original file name
    pub storage_path: String,               // canonical path relative to book root
    pub mime_type: String,                  // e.g. "image/png", "audio/mpeg"
    pub byte_size: u64,                     // size in bytes
    pub sha256: String,                     // 64-char lowercase hex
    pub width: Option<u32>,                 // pixel width if visual
    pub height: Option<u32>,                // pixel height if visual
    pub aspect_ratio: Option<f64>,          // calculated aspect ratio
    pub duration_seconds: Option<f64>,      // duration for audio/video
    pub caption: Option<LocalizedText>,     // educational caption
    pub alt: Option<LocalizedText>,         // accessibility description
    pub is_decorative: bool,                // true for logos, watermarks, backgrounds
    pub tags: Vec<String>,                  // semantic classification tags
    pub extra: HashMap<String, Value>,      // forward-compatible extra properties
}
```

### D. Knowledge Asset Manifest (`KnowledgeAssetManifest`)
```rust
pub struct KnowledgeAssetManifest {
    pub manifest_version: String,           // "1.0"
    pub book_id: String,
    pub generated_at: Option<String>,
    pub assets: HashMap<String, KnowledgeAsset>,
    pub extra: HashMap<String, Value>,
}
```

---

## 3. Operational Capabilities
1. **Canonical Deduplication**:
   - When registering an asset with an existing SHA-256 hash, retrieve the existing canonical `asset_id` instead of duplicating storage.
2. **Reference Audit**:
   - `find_unused_assets(referenced_ids)`: Identifies assets in the manifest that are not cited in any leaf, content block, or question.
   - `find_missing_references(referenced_ids)`: Identifies `asset_id`s cited by nodes or questions that do not exist in the manifest.
3. **Persistence Lifecycle**:
   - `save_manifest(book_dir, &manifest)`
   - `load_manifest(book_dir) -> Option<KnowledgeAssetManifest>`: If `assets/manifest.json` does not exist, cleanly returns `None` or an empty manifest without throwing errors.

---

## 4. Verification Plan
Automated integration test suite in `tests/knowledge_asset_test.rs`:
1. **0 Assets**: Empty manifest validates with zero errors.
2. **1 Asset**: Single image asset lifecycle, verification of ID and SHA-256.
3. **Many Assets**: Multiple distinct multimodal types (image, audio, 3D model, table).
4. **Duplicate Assets**: SHA-256 deduplication correctly reuses existing asset ID.
5. **Unused Assets**: Reference audit flags unreferenced assets.
6. **Missing References**: Reference audit flags referenced asset IDs missing from manifest.
7. **Invalid Metadata**: Empty ID, invalid SHA-256 format, or zero byte size properly rejected.
