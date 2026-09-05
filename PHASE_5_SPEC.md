# PHASE 5 SPECIFICATION — Semantic Asset Resolver

## Objective
Implement a deterministic Semantic Asset Resolver that maps educational requirements (topic, type, role, concept, context) to concrete assets in the Knowledge Asset Manifest.
Enforce the core rule: **"Never fabricate an asset. If no valid asset exists: resolved = false. The runtime must gracefully continue."**

---

## 1. Resolution Pipeline
```text
Requirement (Query)
        ↓
Inverted Asset Index (Type, Role, Topics, Keywords)
        ↓
Candidate Filtering
        ↓
Multifactor Relevance Scoring (Type, Role, Topic, Concept, Context, Confidence)
        ↓
Score Threshold Check
   ┌────┴────┐
 Passes    Fails
   ↓         ↓
Best Match  resolved = false
(asset_id) (None, graceful continuation)
```

---

## 2. Contracts & Types

### A. Resolution Query (`AssetResolutionQuery`)
```rust
pub struct AssetResolutionQuery {
    pub topic: Option<String>,
    pub asset_type: Option<AssetType>,
    pub role: Option<AssetRole>,
    pub concept: Option<String>,
    pub context: Option<String>,
    pub min_score: Option<f32>,       // threshold (default: 0.30)
}
```

### B. Scored Candidate (`ScoredCandidate`)
```rust
pub struct ScoredCandidate {
    pub asset_id: String,
    pub score: f32,
    pub match_reasons: Vec<String>,
}
```

### C. Resolution Result (`AssetResolutionResult`)
```rust
pub struct AssetResolutionResult {
    pub resolved: bool,
    pub asset_id: Option<String>,
    pub score: f32,
    pub candidates: Vec<ScoredCandidate>,
    pub reason: Option<String>,
}
```

---

## 3. Scoring Heuristics
1. **Type Constraint**:
   - Matches required `AssetType`: +0.25. Incompatible type: candidate eliminated or heavily penalized (-0.50).
2. **Role Constraint**:
   - Matches required `AssetRole`: +0.20.
3. **Topic Match**:
   - Direct topic hit in asset intelligence or tags: +0.30.
4. **Concept Match**:
   - Direct concept hit: +0.25.
5. **Contextual Text Overlap**:
   - Lexical overlap between context string and caption/alt text: up to +0.20.
6. **Intelligence Confidence Weighting**:
   - High-confidence assets receive slight preferential weighting (+0.10) over unverified low-confidence assets.
7. **Threshold Rule**:
   - If the top candidate score is below `min_score` (default 0.30), `resolved = false` and `asset_id = None`.
   - **Zero Fabrication**: Under no circumstances will a nonexistent ID be fabricated.

---

## 4. Verification Plan
Automated test suite `src-tauri/tests/asset_resolver_test.rs`:
1. **Exact Semantic Match**: Query with matching topic and role resolves cleanly with score > 0.70.
2. **Type Disqualification**: Image query does not resolve to an audio or 3D asset even if topics match.
3. **Zero Fabrication & Graceful Miss**: Query for non-existent topic ("astronomy" in biology book) returns `resolved = false`, `asset_id = None`.
4. **0-Assets Graceful Handling**: Resolving against an empty manifest returns `resolved = false` with 0 errors.
5. **Multi-Candidate Ranking**: Returns candidates sorted by score in descending order.
