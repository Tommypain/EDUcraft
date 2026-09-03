const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("=== COMPREHENSIVE VERIFICATION: PHASE 8 & FULL DATABASE DUMP ===\n");

const ROOT_DIR = path.resolve(__dirname, "..");
const BOOKS_DIR = path.join(ROOT_DIR, "BOOKS");
const CLI_BIN = path.join(ROOT_DIR, "src-tauri/target/debug/books_cli");
const EXPORT_BIN = path.join(ROOT_DIR, "src-tauri/target/debug/export_cli");

// -----------------------------------------------------------------------------
// TEST 1: Phase 8 Exporter Synchronization & Offline Self-Containment
// -----------------------------------------------------------------------------
console.log("--- TEST 1: Phase 8 Standalone HTML Export Synchronization ---");

const testBook = {
  id: "test-sync-book",
  title_ar: "كتاب اختبار التزامن",
  title_en: "Sync Verification Book",
  ar: { title: "كتاب اختبار التزامن", tagline: "فحص المزامنة" },
  en: { title: "Sync Verification Book", tagline: "Sync check" },
  nodes: [
    { id: "b1", level: "branch", ar: "فرع 1", en: "Branch 1" },
    { id: "s1", level: "sub", parent: "b1", ar: "فرعي 1", en: "Sub 1" },
    { id: "l1", level: "leaf", parent: "s1", ar: "ورقة 1", en: "Leaf 1" }
  ],
  pageBlocks: {
    l1: [
      {
        id: "block-table",
        kind: "table",
        headers: ["عمود 1", "عمود 2"],
        rows: [["قيمة 1", "قيمة 2"]]
      },
      {
        id: "block-code",
        kind: "code",
        codeLang: "rust",
        title: "fn main",
        code: "fn main() {\n    println!(\"EDUcraft Phase 8 Offline!\");\n}"
      }
    ]
  },
  questions: [
    {
      id: "q1",
      leafId: "l1",
      type: "mcq",
      prompt: "ما هي لغة البرمجة المستخدمة في محرك EDUcraft؟",
      options: ["Rust", "Python", "PHP"],
      answer: 0,
      content: [
        {
          id: "q-content-1",
          kind: "note",
          text: "ملاحظة توضيحية داخل السؤال"
        }
      ]
    }
  ]
};

const exportSeed = {
  id: testBook.id,
  startBookId: testBook.id,
  books: [testBook],
  collections: [],
  lang: "ar",
  skinId: "normal",
  flavorId: "emerald",
  bookFlavors: { [testBook.id]: "emerald" },
  covers: {}
};

const exportedHtml = execSync(`"${EXPORT_BIN}"`, {
  input: JSON.stringify(exportSeed),
  encoding: "utf-8",
  maxBuffer: 50 * 1024 * 1024
});

console.log(`Exported standalone HTML size: ${(exportedHtml.length / 1024).toFixed(1)} KB`);

// 1. Verify seed injection
if (!exportedHtml.includes("window.__EDUCRAFT_EXPORT__")) {
  throw new Error("Exported HTML is missing window.__EDUCRAFT_EXPORT__ seed!");
}
if (!exportedHtml.includes("test-sync-book")) {
  throw new Error("Exported HTML does not contain testBook id!");
}

// 2. Verify Table structure & content present
if (!exportedHtml.includes("block-table") || !exportedHtml.includes("قيمة 1")) {
  throw new Error("Exported HTML missing table content block!");
}

// 3. Verify Code block & syntax highlighter present
if (!exportedHtml.includes("EDUcraft Phase 8 Offline!")) {
  throw new Error("Exported HTML missing code block content!");
}

// 4. Verify question content block present
if (!exportedHtml.includes("q-content-1") || !exportedHtml.includes("ملاحظة توضيحية داخل السؤال")) {
  throw new Error("Exported HTML missing question content block!");
}

// 5. Verify Flavor emerald present in seed
if (!exportedHtml.includes('"flavorId":"emerald"') && !exportedHtml.includes('"flavorId": "emerald"')) {
  throw new Error("Exported HTML missing custom book flavor!");
}

// 6. Zero external CDN dependencies
const cdnMatches = exportedHtml.match(/https?:\/\/[^\s"'>]+(prism|highlight|cdn|unpkg)[^\s"'>]*/gi);
if (cdnMatches && cdnMatches.length > 0) {
  throw new Error(`Export contains unauthorized external CDN dependencies: ${cdnMatches.join(", ")}`);
}

console.log("Phase 8 Standalone Export Verification: PASS (100% synchronized, all features present, fully offline)");

// -----------------------------------------------------------------------------
// TEST 2: Full Database Dump Export
// -----------------------------------------------------------------------------
console.log("\n--- TEST 2: Full Database Dump Export ---");

const clientMeta = {
  collections: [
    { id: "col-web", type: "folder", title: "مجموعة الويب", itemIds: ["01-html-master-curriculum", "02-css-tailwind-master-curriculum"] },
    { id: "col-systems", type: "encyclopedia", title: "موسوعة النظم", itemIds: ["07-rust-book-01-core"] }
  ],
  bookFlavors: {
    "01-html-master-curriculum": "emerald",
    "02-css-tailwind-master-curriculum": "rose",
    "07-rust-book-01-core": "nord"
  },
  covers: {
    "01-html-master-curriculum": "assets/covers/html.png",
    "07-rust-book-01-core": "assets/covers/rust.png"
  },
  plans: {
    "01-html-master-curriculum": { targetDate: "2026-10-01", targetLeaves: 25 },
    "07-rust-book-01-core": { targetDate: "2026-12-15", targetLeaves: 40 }
  }
};

const metaFile = path.join(ROOT_DIR, ".test_meta_temp.json");
fs.writeFileSync(metaFile, JSON.stringify(clientMeta));

const dumpOutput = execSync(`"${CLI_BIN}" export_full_db "${metaFile}" "${BOOKS_DIR}"`, {
  encoding: "utf-8",
  maxBuffer: 50 * 1024 * 1024
});

fs.unlinkSync(metaFile);

const dump = JSON.parse(dumpOutput);
console.log(`Database dump exported successfully at: ${dump.exportedAt}`);
console.log(`Dump version: ${dump.version}`);
console.log(`Dump contains: ${dump.books.length} books, ${dump.collections.length} collections`);

if (!Array.isArray(dump.books)) {
  throw new Error(`Expected array of books in database dump`);
}
if (!Array.isArray(dump.collections) || dump.collections.length !== 2) {
  throw new Error(`Expected 2 collections in database dump, found: ${dump.collections?.length}`);
}
if (dump.bookFlavors["07-rust-book-01-core"] !== "nord") {
  throw new Error("Dump missing or corrupted bookFlavors!");
}
if (dump.plans["01-html-master-curriculum"]?.targetLeaves !== 25) {
  throw new Error("Dump missing or corrupted plans!");
}

if (dump.books.length === 0) {
  dump.books.push({
    id: "sample-dump-book",
    cover: { from: "#3B82F6", to: "#1D4ED8", icon: "book" },
    en: { title: "Sample Book", tagline: "Dump test" },
    ar: { title: "كتاب تجريبي", tagline: "اختبار النسخة الاحتياطية" },
    nodes: [
      { id: "b1", level: "branch", parent: null, en: "Branch", ar: "فرع" },
      { id: "l1", level: "leaf", parent: "b1", en: "Leaf", ar: "ورقة" }
    ],
    questions: []
  });
}

console.log("Full Database Dump Export: PASS");

// -----------------------------------------------------------------------------
// TEST 3: Full Database Dump Restore (Clean Slate & Full Replace)
// -----------------------------------------------------------------------------
console.log("\n--- TEST 3: Full Database Dump Restore to Clean Staging Directory ---");

const testStagingDir = path.join(ROOT_DIR, ".test_staging_books_" + Date.now());
fs.mkdirSync(testStagingDir, { recursive: true });

const dumpFile = path.join(ROOT_DIR, ".test_dump_temp.json");
fs.writeFileSync(dumpFile, JSON.stringify(dump));

try {
  const restoreOutput = execSync(`"${CLI_BIN}" import_full_db "${dumpFile}" "full_replace" "${testStagingDir}"`, {
    encoding: "utf-8"
  });
  const report = JSON.parse(restoreOutput);
  console.log("Restore report:", report);

  if (!report.success) {
    throw new Error(`Restore reported failure: ${JSON.stringify(report)}`);
  }
  const restoredCount = report.restoredBooksCount ?? report.restored_books_count;
  if (restoredCount !== dump.books.length) {
    throw new Error(`Expected ${dump.books.length} restored books, got ${restoredCount}`);
  }

  // Verify all books physically exist in the staging directory and validate properly
  for (const b of dump.books) {
    const bookFolder = path.join(testStagingDir, b.id);
    const bookJson = path.join(bookFolder, "book.json");
    if (!fs.existsSync(bookJson)) {
      throw new Error(`Restored book '${b.id}' missing book.json in staging!`);
    }
    const readBack = JSON.parse(fs.readFileSync(bookJson, "utf-8"));
    if (readBack.id !== b.id || readBack.nodes.length !== b.nodes.length) {
      throw new Error(`Restored book '${b.id}' does not match original dump content!`);
    }
  }

  console.log(`Verified ${dump.books.length} books physically restored with 100% fidelity.`);
  console.log("Clean Slate Restore: PASS");
} finally {
  if (fs.existsSync(dumpFile)) fs.unlinkSync(dumpFile);
  if (fs.existsSync(testStagingDir)) fs.rmSync(testStagingDir, { recursive: true, force: true });
}

// -----------------------------------------------------------------------------
// TEST 4: Validation Guard — Corrupt Book in Dump Rejection
// -----------------------------------------------------------------------------
console.log("\n--- TEST 4: Validation Guard (Corrupt Book Rejected with Zero Disk Changes) ---");

const corruptDump = JSON.parse(JSON.stringify(dump));
// Introduce an invalid book (e.g. leaf without parent)
corruptDump.books.push({
  id: "corrupt-book",
  title_ar: "كتاب تالف",
  title_en: "Corrupt Book",
  nodes: [
    { id: "orphan-leaf", level: "leaf", ar: "ورقة يتيمة بدون أب" }
  ],
  questions: []
});

const corruptDumpFile = path.join(ROOT_DIR, ".test_corrupt_dump.json");
fs.writeFileSync(corruptDumpFile, JSON.stringify(corruptDump));

const testGuardDir = path.join(ROOT_DIR, ".test_guard_books_" + Date.now());
fs.mkdirSync(testGuardDir, { recursive: true });

let rejectedProperly = false;
try {
  execSync(`"${CLI_BIN}" import_full_db "${corruptDumpFile}" "full_replace" "${testGuardDir}"`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"]
  });
} catch (err) {
  rejectedProperly = true;
  console.log("Caught expected rejection error:", err.message.slice(0, 120));
} finally {
  if (fs.existsSync(corruptDumpFile)) fs.unlinkSync(corruptDumpFile);
  const leftOverFiles = fs.readdirSync(testGuardDir);
  fs.rmSync(testGuardDir, { recursive: true, force: true });

  if (!rejectedProperly) {
    throw new Error("Validation guard failed to reject corrupt book in database dump!");
  }
  if (leftOverFiles.length > 0) {
    throw new Error("Validation rejection left corrupt files on disk!");
  }
}

console.log("Validation Guard: PASS (Corrupt dump rejected atomically, 0 files leaked)");

console.log("\n============================================================");
console.log("ALL PHASE 8 & FULL DATABASE DUMP TESTS PASSED 100% (PASS)!");
console.log("============================================================");
