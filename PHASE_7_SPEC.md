# PHASE 7 SPECIFICATION — Knowledge Graph

## Objective
Establish a unified, lightweight, in-memory Knowledge Graph that connects Books, Chapters (Branches), Sections (SubBranches), Units (Leaves), ContentBlocks, Concepts, Questions, Assets, and Study Records.
Fulfill the example pipeline:
```text
Concept → Content → Asset → Questions → Study Performance
```
Strictly adhere to the design constraint: **"Implement only what is justified by the existing architecture. Do not create an unnecessary giant graph database."**

---

## 1. Graph Model

### A. Graph Node Kinds (`GraphNodeKind`)
```rust
pub enum GraphNodeKind {
    Book,
    Branch,
    SubBranch,
    Leaf,
    ContentBlock,
    Concept,
    Question,
    Asset,
}
```

### B. Graph Edge Kinds (`EdgeKind`)
```rust
pub enum EdgeKind {
    Contains,         // Hierarchy: Book -> Branch -> Sub -> Leaf -> Block / Question
    PrerequisiteOf,   // Pedagogical dependency: Leaf A -> Leaf B (from crossLinks)
    Illustrates,      // Asset -> Leaf / Block / Question
    Tests,            // Question -> Leaf / Concept / Asset
    CoversConcept,    // Block / Question / Asset -> Concept
    RecordedStudy,    // Study performance: Student Attempt -> Question / Leaf
}
```

### C. In-Memory Graph Structure (`KnowledgeGraph`)
- Adjacency list representation using `HashMap<String, Vec<GraphEdge>>` for outgoing edges and reverse index for incoming edges.
- Node registry: `HashMap<String, GraphNode>`.
- Fast, pure memory footprint with sub-millisecond traversal and simple JSON serialization.

---

## 2. Core Capabilities & Queries
1. **Automated Graph Ingestion**:
   - Construct graph directly from `ExportBook`, `crossLinks`, and `KnowledgeAssetManifest`.
   - Auto-extracts `Concept` nodes from asset intelligence and content terms.
2. **Prerequisite Discovery**:
   - `get_prerequisites(leaf_id)`: Traverses incoming `PrerequisiteOf` edges to compute required study paths.
3. **Multimodal Concept Tracing**:
   - Given a `Concept` (e.g. "mitosis"), find all associated:
     - Lessons / Leaves covering it.
     - Assets illustrating it.
     - Questions testing it.
4. **Study Performance Propagation**:
   - `record_study_attempt(leaf_id, question_id, is_correct, score)`:
   - Aggregates study records along `Tests` and `CoversConcept` edges to dynamically evaluate Concept Mastery (0.0 to 1.0).

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/knowledge_graph_test.rs`:
1. **Graph Construction**: Ingest book with branches, leaves, pageBlocks, questions, cross-links, and asset manifest.
2. **Prerequisite Resolution**: Verify `crossLinks` correctly map to `PrerequisiteOf` edges and traversal finds prerequisites.
3. **Concept-to-Question-to-Asset Linkage**: Verify that querying a concept retrieves the related ContentBlock, Asset, and Question.
4. **Study Performance & Concept Mastery**: Answering questions increases concept mastery score from 0.0 to 1.0.
5. **Full Project Green Build**: Rust test suite and frontend build.
