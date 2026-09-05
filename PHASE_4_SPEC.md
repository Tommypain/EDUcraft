# PHASE 4 SPECIFICATION — Asset Intelligence

## Objective
Establish the Asset Intelligence layer for EDUcraft to extract, score, and attach verified semantic metadata to Knowledge Assets.
Support:
- Title, localized caption, description
- OCR / text stream extraction
- Educational topics and concepts
- Pedagogical role
- Provenance (source file, page, slide, tag)
- Perceptual hash (dHash 64-bit gradient hash) for visual similarity
- Strict evidence-based confidence scoring (High, Medium, Low)

---

## 1. Strict Design Directives
1. **Never Invent Information Without Evidence**:
   - If an asset has no surrounding text, caption, or structured metadata, topics and concepts **must remain empty**.
   - No hallucinated or synthetic tags are permitted.
2. **Deterministic Confidence Tracking**:
   - Every semantic deduction must carry an explicit basis (e.g. `["explicit_figcaption", "slide_title_context"]`).
   - If confidence is low, it **must explicitly be recorded as Low confidence** (`ConfidenceLevel::Low`, score < 0.5) with basis noted (e.g. `["filename_only"]`).
3. **Perceptual Hashing (dHash)**:
   - Compute a 64-bit perceptual hash (dHash / difference hash) to identify visually similar images, recompressed formats, or aspect-adjusted diagrams.

---

## 2. Models Specification

### A. Confidence Score (`ConfidenceScore`)
```rust
pub enum ConfidenceLevel {
    High,    // score >= 0.8 (e.g. explicit figcaption + alt + structured metadata)
    Medium,  // 0.5 <= score < 0.8 (e.g. nearby heading or structured slide title)
    Low,     // score < 0.5 (e.g. filename-only inference, ambiguous context)
}

pub struct ConfidenceScore {
    pub score: f32,          // 0.0 to 1.0
    pub level: ConfidenceLevel,
    pub basis: Vec<String>,  // evidence chain
}
```

### B. Asset Provenance (`AssetProvenance`)
```rust
pub struct AssetProvenance {
    pub source_file: Option<String>,
    pub page_number: Option<u32>,
    pub slide_number: Option<u32>,
    pub container_tag: Option<String>,
}
```

### C. Asset Intelligence (`AssetIntelligence`)
```rust
pub struct AssetIntelligence {
    pub title: Option<LocalizedText>,
    pub caption: Option<LocalizedText>,
    pub description: Option<LocalizedText>,
    pub ocr_text: Option<String>,
    pub topics: Vec<String>,
    pub concepts: Vec<String>,
    pub pedagogical_role: AssetRole,
    pub provenance: AssetProvenance,
    pub confidence: ConfidenceScore,
    pub perceptual_hash: Option<String>,
}
```

---

## 3. Operational Flow
```text
Raw Extracted Asset + Context
             ↓
Extract Provenance (page, slide, file)
             ↓
Extract Text / OCR / Captions
             ↓
Derive Topics & Concepts (Evidence Filter)
             ↓
Compute Perceptual Hash (dHash)
             ↓
Calculate Confidence & Evidence Basis
             ↓
Attach to KnowledgeAsset
```

---

## 4. Verification Plan
Automated test suite `src-tauri/tests/asset_intelligence_test.rs`:
1. **High Confidence Enrichment**: Asset with explicit `<figcaption>` and heading produces High confidence with documented evidence basis.
2. **Strict Zero-Hallucination & Low Confidence**: Bare asset (`img123.png` with no text) produces `ConfidenceLevel::Low`, zero invented topics/concepts, and records `basis: ["filename_only"]`.
3. **Perceptual Hash Computation**: Deterministic 64-bit hex dHash generation.
4. **Provenance Extraction**: Page and slide indices cleanly recorded in `AssetProvenance`.
5. **Full Green Suite**: Run all tests across the project.
