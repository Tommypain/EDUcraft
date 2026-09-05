# PHASE 16 SPECIFICATION — Cloud JSON Creator Skill Update

## Objective
Update the **`educraft-book-authoring`** skill documentation to instruct authoring agents on the EDUcraft Master Architecture updates (v0.0.9+ / Schema 1.1):
1. **Schema 1.1 Specification**:
   - `schema_version: "1.1"`
   - `capabilities: ["images", "quizzes", "cross_links", "reading_progress"]`
   - `metadata: { "author", "version", "created_at", "license", "tags" }`
   - `assets: { "manifest_path", "total_count" }`
2. **Knowledge Graph & Multimodal Links**:
   - ContentBlock concepts mapping (`concepts: ["html_dom", "nesting"]`).
   - ContentBlock asset references (`asset_id: "asset_..."`).
   - Question concept linkage (`subject: "dom_tree"`, `concepts: ["..."]`) for automatic student mastery calculation.
3. **Titanium Plugin Support**:
   - Declaring `"recommended_plugins": ["com.educraft.latex-math"]`.
4. **Strict Backward Compatibility (Rule 1)**:
   - Reaffirming that legacy v1.0 books (unversioned, without capabilities or manifests) remain 100% valid and supported.

---

## 1. Modifications Planned
- Edit `/home/tommypain/.gemini/config/skills/educraft-book-authoring/SKILL.md`:
  - Update Table of Contents to include Section 10.
  - Add Section 10: "معمارية EDUcraft Master Architecture (الإصدار 0.0.9+ و Schema 1.1)" with full JSON schema examples, contract definitions, and guidelines for authoring modern books.

---

## 2. Verification Plan
1. Validate Markdown syntax and structure of `SKILL.md`.
2. Confirm Table of Contents alignment and accurate cross-linking.
3. Run project cargo tests and frontend build to verify zero side-effects.
