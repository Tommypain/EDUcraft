# PHASE 17 SPECIFICATION — Production Hardening & Final Verification

## Objective
Execute the final, comprehensive production hardening, security audit, regression verification, and performance benchmarking across the entire EDUcraft Master Architecture (Phases 0 through 16).

---

## 1. Scope & Verification Components

### 1.1 Legacy Books Regression Verification (Rule 1 is Absolute)
- Verify that all 14 canonical books in `src/data/`:
  - `01-html-master-curriculum.json`
  - `02-css-tailwind-master-curriculum.json`
  - `03-javascript-master-curriculum.json`
  - `04-typescript-master-curriculum.json`
  - `05-react-master-curriculum.json`
  - `06-node-backend-master-book.json`
  - `07-rust-book-01-core.json` through `14-rust-book-08-production.json`
  can be parsed by `serde_json`, converted into `KnowledgeBook`, migrated losslessly via `MigrationEngine`, and registered into the `KnowledgeGraph` with zero errors.

### 1.2 Security & Sandboxing Audit
- **Path Traversal Guards**: Verify rejection of `../`, `..\\`, absolute paths outside roots in plugin manifests and asset manifests.
- **WASM Sandboxing**: Verify fuel exhaustion bounding, linear memory bounds checking, and malformed header validation.
- **Panic Isolation**: Verify that plugin hooks with panics or runtime failures do not crash the Tauri host process.

### 1.3 Performance Benchmarks & Limits
- **Knowledge Graph**: Ensure graph construction and mastery queries execute within sub-millisecond thresholds (< 1ms per typical query).
- **Semantic Asset Resolver**: Ensure inverted index resolution executes in sub-millisecond time.
- **Dependency DAG**: Ensure Kahn's topological sort for plugin ordering completes in < 0.1ms.

### 1.4 Code Hygiene & Build Pipeline
- Execute complete Rust test suite across all targets (`cargo test --all-targets`).
- Execute frontend TypeScript compilation and build (`npm run build`).

---

## 2. Implementation Deliverables
1. `src-tauri/tests/production_hardening_test.rs`:
   - Comprehensive test suite covering:
     - 14-book legacy ingestion & graph validation.
     - Security bounds (traversal, fuel, memory limit enforcement).
     - Performance latency assertions.
2. `PHASE_17_REPORT.md`:
   - Full summary of production audit findings, benchmark metrics, and final readiness declaration.
