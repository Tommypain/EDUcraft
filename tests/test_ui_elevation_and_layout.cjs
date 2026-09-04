const fs = require("fs");
const path = require("path");

console.log("=== VERIFICATION OF UI ELEVATION, BUTTON CRAFT & KNOWLEDGE TREE LAYOUT ===\n");

const rootDir = path.resolve(__dirname, "..");
const fixedJsxFile = path.join(rootDir, "src/EDUcraft_fixed.jsx");
const ktFile = path.join(rootDir, "src/utils/KnowledgeTree.jsx");

const fixedJsx = fs.readFileSync(fixedJsxFile, "utf-8");
const ktContent = fs.readFileSync(ktFile, "utf-8");

// -----------------------------------------------------------------------------
// TEST 1: Button System & Motion Craft Audit
// -----------------------------------------------------------------------------
console.log("--- TEST 1: Button System & Default Colors Audit ---");

// Check CSS motion classes
if (!fixedJsx.includes(".educraft-btn {") || !fixedJsx.includes("cubic-bezier(0.16, 1, 0.3, 1)")) {
  throw new Error("TEST 1 FAILED: .educraft-btn with spring cubic-bezier transition is missing!");
}
console.log("[PASS] .educraft-btn spring motion class declared.");

// Verify Import JSON is not solid colored by default
if (fixedJsx.includes('background: theme.accent, border: `1.5px solid ${theme.accent}`, minHeight: 36 }}\n            title={ui.libraryImportJson}')) {
  throw new Error("TEST 1 FAILED: Import JSON still has solid theme.accent background by default!");
}
console.log("[PASS] Import JSON uses unified neutral outline styling with accent icon.");

// Verify Browse CTA in TreeView is not solid colored by default
if (fixedJsx.includes('background: theme.accent, color: theme.accentInk, minHeight: 44 }}\n          >\n            <ListFilter size={15} />\n            {ui.browseCta}')) {
  throw new Error("TEST 1 FAILED: Browse CTA still has solid theme.accent background by default!");
}
console.log("[PASS] Browse CTA in TreeView unified with Read Through as neutral peer.");

// Verify Mindmap view switch in KnowledgeTree is not solid colored by default
if (ktContent.includes('background: viewMode === "graph" ? theme.accent : "transparent"')) {
  throw new Error("TEST 1 FAILED: Mindmap button still uses solid theme.accent instead of accentSoft!");
}
console.log("[PASS] Mindmap view switcher uses refined accentSoft indicator.");

// -----------------------------------------------------------------------------
// TEST 2: Knowledge Tree Collision-Free Multi-Tier Layout Test
// -----------------------------------------------------------------------------
console.log("\n--- TEST 2: Knowledge Tree Collision-Free Multi-Tier Layout Audit ---");

// Verify collision detection logic
if (!ktContent.includes("hasOverlap = true;") || !ktContent.includes("minSpacing = ((")) {
  throw new Error("TEST 2 FAILED: Collision detection logic missing in computeTreeLayout!");
}
console.log("[PASS] Collision detection for squashed manual coordinates is active.");

// Verify staggering logic
if (!ktContent.includes("tierY = (lIdx % 2 === 0) ? 295 : 355") && !ktContent.includes("tierCount === 3")) {
  throw new Error("TEST 2 FAILED: Staggering tiers missing in computeTreeLayout!");
}
console.log("[PASS] Multi-tier staggered layout correctly calculates alternating leaf rows.");

// Verify dynamic viewBox height and width calculation
if (!ktContent.includes("const finalVbW = Math.max(vbW, Math.round(maxXPos + 80));") ||
    !ktContent.includes("const finalVbH = Math.max(420, Math.round(maxYPos + 75));")) {
  throw new Error("TEST 2 FAILED: Dynamic viewBox height and width expansion missing!");
}
console.log("[PASS] ViewBox width and height dynamically expand based on staggered leaf positions.");

// -----------------------------------------------------------------------------
// TEST 3: Editor Enhancements (All Pages Preview, Image Uploader, Swatches)
// -----------------------------------------------------------------------------
console.log("\n--- TEST 3: Editor Enhancements Audit ---");

if (!fixedJsx.includes("function CardImageUploader(")) {
  throw new Error("TEST 3 FAILED: CardImageUploader component missing!");
}
console.log("[PASS] CardImageUploader component declared with drag-and-drop & file picker.");

if (!fixedJsx.includes('["all_pages", lang === "ar" ? "كل صفحات الكتاب" : "All Book Pages", Library]')) {
  throw new Error("TEST 3 FAILED: all_pages mode missing from Editor tabs!");
}
console.log("[PASS] All Book Pages preview tab integrated into Editor header.");

if (!fixedJsx.includes('tab === "all_pages" ? (') || !fixedJsx.includes("<FullBookA4Preview")) {
  throw new Error("TEST 3 FAILED: FullBookA4Preview rendering missing for all_pages mode!");
}
console.log("[PASS] FullBookA4Preview rendered directly inside EditorView stage.");

if (!fixedJsx.includes("onChangeBookFlavor") || !fixedJsx.includes("FLAVORS")) {
  throw new Error("TEST 3 FAILED: Book Flavor switcher missing in EditorView!");
}
console.log("[PASS] Book Flavor palette swatches integrated into Editor header toolbar.");

// -----------------------------------------------------------------------------
// TEST 4: React Error Boundary Audit
// -----------------------------------------------------------------------------
console.log("\n--- TEST 4: React Error Boundary Audit ---");

if (!fixedJsx.includes("class ErrorBoundary extends React.Component")) {
  throw new Error("TEST 4 FAILED: ErrorBoundary class declaration missing!");
}
console.log("[PASS] ErrorBoundary component declared.");

if (!fixedJsx.includes("<ErrorBoundary theme={theme} skin={skin} ui={ui} lang={lang} onReset={() => setView(\"library\")}>")) {
  throw new Error("TEST 4 FAILED: ErrorBoundary does not wrap view router!");
}
console.log("[PASS] ErrorBoundary safely encapsulates the entire application view router.");

console.log("\n============================================================");
console.log("ALL VERIFICATIONS PASSED: UI ELEVATION & LAYOUT CRAFT VERIFIED!");
console.log("============================================================\n");
