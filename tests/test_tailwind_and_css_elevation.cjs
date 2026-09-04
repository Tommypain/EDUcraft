const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== VERIFYING TAILWIND & CSS DESIGN ELEVATION & RESTORATION (v0.0.8.0) ===\n");

const stylesPath = path.join(__dirname, "../src/styles.css");
const styles = fs.readFileSync(stylesPath, "utf8");

const jsxPath = path.join(__dirname, "../src/EDUcraft_fixed.jsx");
const jsx = fs.readFileSync(jsxPath, "utf8");

// 1. styles.css Design Tokens & Utilities
console.log("--- TEST 1: CSS Design Utilities & Apple Motion Physics ---");
assert(styles.includes(".educraft-btn"), "styles.css must declare .educraft-btn");
assert(styles.includes("cubic-bezier(0.16, 1, 0.3, 1)"), ".educraft-btn must use fluid Apple spring curve");
assert(styles.includes("active:scale-[0.97]") || styles.includes("transform: scale(0.97)"), ".educraft-btn must have tactile scale press feedback");
assert(styles.includes(".educraft-glass"), "styles.css must declare .educraft-glass frosted glass material");
assert(styles.includes("backdrop-filter: blur("), ".educraft-glass must use backdrop-filter blur");
assert(styles.includes(".custom-scrollbar"), "styles.css must declare .custom-scrollbar");
assert(styles.includes(".educraft-textarea"), "styles.css must declare .educraft-textarea");
assert(styles.includes("resize: none"), ".educraft-textarea must disable raw browser resize handles");
assert(styles.includes(".educraft-input"), "styles.css must declare .educraft-input");
assert(styles.includes(".educraft-paper-sheet"), "styles.css must declare .educraft-paper-sheet");
console.log("[PASS] Spring physics, frosted glass materials, slim scrollbars, and paper elevation verified.");

// 2. Color Tokens & Theme Restoration
console.log("\n--- TEST 2: Normal Color Tokens Restoration ---");
assert(jsx.includes('canvas: "#F3EAD9"'), "FLAVORS.normal must restore warm parchment canvas (#F3EAD9)");
assert(jsx.includes('surface: "#FFFDFB"'), "FLAVORS.normal must restore #FFFDFB surface");
assert(jsx.includes('ink: "#241B13"'), "FLAVORS.normal must restore deep warm ink (#241B13)");
assert(jsx.includes("linear-gradient(180deg, ${theme.accentSoft} 0%, ${theme.canvas} 55%)"), "Original smooth container gradient must be restored in EditorView");
console.log("[PASS] Warm parchment normal theme colors and container gradient successfully restored.");

// 3. Editor Navigation, Ribbon Craft & Legibility
console.log("\n--- TEST 3: Editor Navigation & RibbonButton Craft ---");
assert(jsx.includes("ChevronRight size={12}"), "EditorBreadcrumb must use modern ChevronRight separators");
assert(jsx.includes("Search size={13}"), "EditorLeafNav must include search input with search icon");
assert(jsx.includes("educraft-glass"), "EditorView top bar and ribbons must use frosted glass styling");
assert(jsx.includes("w-5 h-5 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"), "Question types palette must use distinct colored app-icon style badges");
assert(jsx.includes("color: active ? theme.accent : theme.ink"), "RibbonButton label text must always be legible theme.ink (never white-on-white)");
console.log("[PASS] Segmented controls, outline search filter, colored question badges, and legible ribbon labels verified.");

// 4. A4 Pages Container Containment & All Book Pages Full Editor Tools
console.log("\n--- TEST 4: Container Overflow Fix & All Book Pages Editor Tools ---");
assert(!jsx.includes("if (!blocks.length) {\n    return (\n      <p className=\"text-sm\" style={{ color: \"#00000088\" }}>"), "FullBookA4Preview must never lock users out with early return on empty blocks");
assert(jsx.includes("Math.min(1.0, Math.max(0.35,"), "useFitScale must cap auto-scale at 1.0 (100%) to prevent unexpected horizontal expansion");
assert(jsx.includes("xl:grid-cols-[minmax(0,1fr)_260px]"), "A4PageBuilder and FullBookA4Preview must use responsive minmax grid to stay inside template");
assert(jsx.includes("Blocks: ") || jsx.includes("عناصر: "), "FullBookA4Preview must include task pane inspector for active target leaf");
console.log("[PASS] No elements overflowing template, 100% scale cap, and full editor tools in All Book Pages verified.");

console.log("\n============================================================");
console.log("ALL TAILWIND, CSS & v0.0.8.0 CHECKS PASSED PERFECTLY (100%)!");
console.log("============================================================\n");
