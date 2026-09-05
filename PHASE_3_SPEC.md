# PHASE 3 SPECIFICATION — Asset Extraction Engine

## Objective
Implement an end-to-end Asset Extraction Engine supporting three major educational source formats: **HTML**, **PPTX**, and **PDF**.
Execute the canonical pipeline:
```text
SOURCE → EXTRACT → NORMALIZE → CLASSIFY → HASH → DEDUPLICATE → STORE → MANIFEST
```
Strictly differentiate educational assets from decorative noise (logos, backgrounds, watermarks, tracking pixels, UI dividers).

---

## 1. Supported Source Formats

### A. HTML / Web Curricula
- Extracts `<img>` tags with standard URLs, relative file paths, and inline Base64 data URIs.
- Extracts inline `<svg>` vector diagrams as independent SVG image assets.
- Captures educational context: surrounding `<figure>` `<figcaption>`, `alt` tags, and preceding heading text.
- Extracts educational `<table>` elements into structured tabular assets.

### B. PPTX Presentation Slides
- Inspects PowerPoint OpenXML zip container.
- Extracts embedded media files from `ppt/media/*`.
- Correlates media with slide index (`ppt/slides/slide{N}.xml`) and slide titles to produce educational captions and provenance tags.

### C. PDF Documents
- Inspects PDF object graph using `lopdf`.
- Extracts embedded XObject Image streams (`/Filter /DCTDecode`, `/FlateDecode`).
- Records source page numbers and associated stream dimensions.

---

## 2. Extraction Pipeline Stages

1. **Extract**:
   - Decodes raw binary streams from source documents.
   - Collects provenance (source format, slide number, page number, tag, original filename, contextual captions).
2. **Normalize**:
   - Standardizes file extensions (`.png`, `.jpg`, `.svg`, `.json`).
   - Standardizes MIME types (`image/png`, `image/jpeg`, `image/svg+xml`, `application/json`).
3. **Classify**:
   - Evaluates whether an asset is educational or decorative:
     - **Decorative detection heuristics**:
       - Filenames matching decorative patterns (`logo`, `watermark`, `bullet`, `spacer`, `divider`, `bg_`, `background`).
       - Extremely small dimensions (width ≤ 32px and height ≤ 32px, 1x1 tracking pixels).
       - Severe aspect ratio outliers without captions (e.g. 50:1 line dividers).
     - Assigns `AssetRole::Decorative` and `is_decorative: true`.
     - Assigns `AssetRole::Figure`, `Diagram`, `Table`, or `Hero` to legitimate pedagogical assets.
4. **Hash**:
   - Computes 64-character lowercase SHA-256 checksum on normalized payload.
5. **Deduplicate**:
   - Consults existing `KnowledgeAssetManifest`.
   - If an asset with identical SHA-256 exists, reuses the canonical `asset_id` and records the occurrence without duplicate disk storage.
6. **Store**:
   - Saves unique binary payloads to canonical paths under `BOOKS/<book_id>/assets/images/` (or `assets/tables/`).
7. **Manifest**:
   - Registers new `KnowledgeAsset` records into `KnowledgeAssetManifest` with complete metadata.
   - Produces an `ExtractionReport`.

---

## 3. Architecture & Modules
- `src-tauri/src/asset_engine/mod.rs`: Module entry point.
- `src-tauri/src/asset_engine/models.rs`: `ExtractedAsset`, `ExtractionSource`, `ExtractionOptions`, `ExtractionReport`.
- `src-tauri/src/asset_engine/classifier.rs`: Heuristic classifier for educational vs decorative assets.
- `src-tauri/src/asset_engine/pipeline.rs`: The central extraction pipeline.
- `src-tauri/src/asset_engine/extractors/html.rs`: HTML parser and media extractor.
- `src-tauri/src/asset_engine/extractors/pptx.rs`: PPTX zip archive extractor.
- `src-tauri/src/asset_engine/extractors/pdf.rs`: PDF stream extractor.

---

## 4. Verification Plan
Automated test suite `src-tauri/tests/asset_extraction_test.rs`:
1. **HTML Extraction**: Extract data URI images, SVG blocks, and figure captions from HTML string.
2. **PPTX Extraction**: Extract slide media from mock OpenXML PPTX zip container, verifying slide provenance.
3. **PDF Extraction**: Extract image streams from valid PDF binary streams.
4. **Decorative Filtering**: Confirm that small bullet icons, spacer gifs, and "company_logo.png" are correctly classified as decorative (`is_decorative = true`).
5. **Deduplication**: Multiple identical images in a presentation or document are deduplicated to a single stored asset.
6. **Full Green Build**: `cargo test` and `npm run build`.
