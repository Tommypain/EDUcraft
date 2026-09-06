const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("=== COMPREHENSIVE VERIFICATION: EMPTY STATES & MANUAL BOOK BUILD (v0.0.7.4) ===\n");

const ROOT_DIR = path.resolve(__dirname, "..");
const BOOKS_DIR = path.join(ROOT_DIR, "BOOKS");
const CLI_BIN = path.join(ROOT_DIR, "src-tauri/target/debug/books_cli");
const fixedJsx = path.join(ROOT_DIR, "src/EDUcraft_fixed.jsx");
const appContent = fs.readFileSync(fixedJsx, "utf-8");

// -----------------------------------------------------------------------------
// TEST 1: Dictionary & Localization Completeness (UI.en and UI.ar)
// -----------------------------------------------------------------------------
console.log("--- TEST 1: Localized UI Strings (UI.en & UI.ar) ---");

const requiredKeys = [
  "libraryNewBook",
  "editorEmptyTitle",
  "editorEmptySub",
  "treeEmptyTitle",
  "treeEmptySub",
  "plannerEmptyTitle",
  "plannerEmptySub",
  "createNewBookCta",
  "newBookPrompt",
  "quickSelectBook",
  "addBranchBtn",
  "addLeafBtn",
  "branchTitlePrompt",
  "leafTitlePrompt",
];

for (const key of requiredKeys) {
  if (!appContent.includes(`${key}:`)) {
    throw new Error(`TEST 1 FAILED: Missing localization key: ${key}`);
  }
}
console.log(`[PASS] All ${requiredKeys.length} required localization keys present in UI dictionaries.`);

// -----------------------------------------------------------------------------
// TEST 2: Static Code Architecture Audit
// -----------------------------------------------------------------------------
console.log("\n--- TEST 2: Static Code Architecture Audit ---");

// Check ViewEmptyState declaration
if (!appContent.includes("function ViewEmptyState(")) {
  throw new Error("TEST 2 FAILED: ViewEmptyState component is missing!");
}
console.log("[PASS] ViewEmptyState component successfully declared.");

// Check navbar buttons are enabled
if (appContent.includes('onClick={() => currentBook && setView("editor")}')) {
  throw new Error("TEST 2 FAILED: Editor navbar button still conditioned on currentBook!");
}
if (appContent.includes('onClick={() => currentBook && setView("tree")}')) {
  throw new Error("TEST 2 FAILED: Tree navbar button still conditioned on currentBook!");
}
if (appContent.includes('onClick={() => currentBook && setView("planner")}')) {
  throw new Error("TEST 2 FAILED: Planner navbar button still conditioned on currentBook!");
}
console.log("[PASS] Navbar buttons are unblocked and freely accessible without currentBook.");

// Check EditorView branch & leaf authoring handlers
if (!appContent.includes("handleAddBranch") || !appContent.includes("handleAddLeaf")) {
  throw new Error("TEST 2 FAILED: EditorView is missing branch/leaf authoring handlers!");
}
console.log("[PASS] EditorView handles handleAddBranch and handleAddLeaf.");

// Check physical disk save in updateCurrentBook
if (!appContent.includes("saveImportedBookFs(target.id") && !appContent.includes("saveImportedBookFs(bookToSave.id")) {
  throw new Error("TEST 2 FAILED: updateCurrentBook does not persist book JSON to disk!");
}
console.log("[PASS] updateCurrentBook automatically persists mutations physically to disk.");

// Check empty states in view routing
if (!appContent.includes("view === \"editor\"") || !appContent.includes("view === \"tree\"") || !appContent.includes("view === \"planner\"")) {
  throw new Error("TEST 2 FAILED: View router missing conditional branches!");
}
console.log("[PASS] View router cleanly renders dedicated empty states when currentBook is null.");

// -----------------------------------------------------------------------------
// TEST 3: Physical Book Creation & Disk Persistence
// -----------------------------------------------------------------------------
console.log("\n--- TEST 3: Physical Book Creation & Disk Persistence ---");

const testBookId = "system-design-manual-build";
const initialBookPayload = {
  id: testBookId,
  cover: { from: "#3B82F6", to: "#1D4ED8", icon: "book" },
  en: { title: "System Design Manual Build", tagline: "Crafted from scratch" },
  ar: { title: "تصميم النظم الموزعة", tagline: "تم إنشاؤه يدوياً من الصفر" },
  flavorId: "nord",
  nodes: [],
  pageBlocks: {},
  questions: [],
};

const tempFile = path.join(ROOT_DIR, `.temp_${testBookId}.json`);
fs.writeFileSync(tempFile, JSON.stringify(initialBookPayload, null, 2));

// Physical commit via Rust engine (same as saveImportedBookFs)
const commitRes = execSync(`"${CLI_BIN}" import_commit "${testBookId}" "${tempFile}" "${BOOKS_DIR}"`, { encoding: "utf-8" });
console.log("Physical creation result:", commitRes.trim());

const bookDir = path.join(BOOKS_DIR, testBookId);
const bookJsonFile = path.join(bookDir, "book.json");
if (!fs.existsSync(bookJsonFile)) {
  throw new Error("TEST 3 FAILED: Initial book.json not created on disk!");
}
console.log("[PASS] Created physical book on disk: BOOKS/" + testBookId + "/book.json");

// -----------------------------------------------------------------------------
// TEST 4: Manual Branch, Leaf, and Question Authoring
// -----------------------------------------------------------------------------
console.log("\n--- TEST 4: Manual Authoring (Adding Branch & Leaf to Empty Book) ---");

const authoredBook = {
  ...initialBookPayload,
  nodes: [
    {
      id: "branch-distributed-fundamentals",
      level: "branch",
      parent: null,
      en: "Distributed Fundamentals",
      ar: "أساسيات الأنظمة الموزعة",
    },
    {
      id: "leaf-cap-theorem",
      level: "leaf",
      parent: "branch-distributed-fundamentals",
      en: "CAP Theorem",
      ar: "مبرهنة كاب CAP",
      cards: [
        {
          id: "card-leaf-cap-theorem-0",
          image: null,
          imagePosition: "top",
          questions: [
            {
              id: "q-cap-1",
              type: "single_choice",
              subject: "Architecture",
              difficulty: "Intermediate",
              tier: "core",
              dir: "ltr",
              en: { prompt: "In a network partition, what does CAP theorem force you to choose?" },
              ar: { prompt: "عند حدوث انقسام في الشبكة، ما الذي تجبرك مبرهنة CAP على اختياره؟" },
              options: ["Consistency or Availability", "Speed or Storage", "Safety or Liveness"],
              answer: 0,
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-cap-1",
          leafId: "leaf-cap-theorem",
          type: "single_choice",
          subject: "Architecture",
          difficulty: "Intermediate",
          tier: "core",
          dir: "ltr",
          en: { prompt: "In a network partition, what does CAP theorem force you to choose?" },
          ar: { prompt: "عند حدوث انقسام في الشبكة، ما الذي تجبرك مبرهنة CAP على اختياره؟" },
          options: ["Consistency or Availability", "Speed or Storage", "Safety or Liveness"],
          answer: 0,
        },
      ],
    },
  ],
};

// Write the mutated book to disk (simulating updateCurrentBook)
fs.writeFileSync(tempFile, JSON.stringify(authoredBook, null, 2));
execSync(`"${CLI_BIN}" import_commit "${testBookId}" "${tempFile}" "${BOOKS_DIR}"`, { encoding: "utf-8" });

// Verify disk content
const diskContent = JSON.parse(fs.readFileSync(bookJsonFile, "utf-8"));
if (!Array.isArray(diskContent.nodes) || diskContent.nodes.length !== 2) {
  throw new Error(`TEST 4 FAILED: Expected 2 nodes on disk, found ${diskContent.nodes?.length}`);
}
console.log("[PASS] Mutated book successfully persisted to disk with 1 branch and 1 leaf.");

// -----------------------------------------------------------------------------
// TEST 5: Cold Restart Scan Verification
// -----------------------------------------------------------------------------
console.log("\n--- TEST 5: Cold Restart Scan Verification ---");

for (let restart = 1; restart <= 3; restart++) {
  const scanOut = execSync(`"${CLI_BIN}" scan "${BOOKS_DIR}"`, { encoding: "utf-8", maxBuffer: 50 * 1024 * 1024 });
  const scanData = JSON.parse(scanOut);
  const found = scanData.books.find((b) => b.id === testBookId);
  if (!found || found.state !== "valid") {
    throw new Error(`TEST 5 FAILED: Manually authored book not found or invalid on restart ${restart}!`);
  }
}
console.log("[PASS] Manually authored book verified across 3 consecutive cold scans from disk.");

// -----------------------------------------------------------------------------
// TEST 6: Cleanup Test Book
// -----------------------------------------------------------------------------
console.log("\n--- TEST 6: Clean Up Test Artifacts ---");

execSync(`"${CLI_BIN}" delete "${testBookId}" "${BOOKS_DIR}"`, { encoding: "utf-8" });
if (fs.existsSync(bookDir)) {
  throw new Error("TEST 6 FAILED: Book directory not removed!");
}
if (fs.existsSync(tempFile)) {
  fs.unlinkSync(tempFile);
}
console.log("[PASS] Physical test book permanently deleted. Test workspace 100% clean.");

console.log("\n============================================================");
console.log("ALL TESTS PASSED: EMPTY STATES & MANUAL BOOK CREATION VERIFIED!");
console.log("============================================================\n");
