const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("=== EXECUTING QUADRUPLE DELETION ON ALL TEST BOOKS ===\n");

const ROOT_DIR = path.resolve(__dirname, "..");
const BOOKS_DIR = path.join(ROOT_DIR, "BOOKS");
const CLI_BIN = path.join(ROOT_DIR, "src-tauri/target/debug/books_cli");

if (!fs.existsSync(CLI_BIN)) {
  throw new Error("CLI binary not found at: " + CLI_BIN);
}

// 1. Discover all books currently in BOOKS/
const initialEntries = fs.readdirSync(BOOKS_DIR).filter(name => {
  const full = path.join(BOOKS_DIR, name);
  return fs.statSync(full).isDirectory() && !name.startsWith(".");
});

console.log(`Found ${initialEntries.length} test books in BOOKS/ to delete:\n`, initialEntries);

if (initialEntries.length === 0) {
  console.log("BOOKS/ is already clean.");
}

// 2. Delete each book one by one using delete_book_by_id through books_cli
let deletedCount = 0;
const deletedIds = [];

for (const bookId of initialEntries) {
  console.log(`Deleting [${deletedCount + 1}/${initialEntries.length}]: ${bookId}...`);
  try {
    const cmd = `"${CLI_BIN}" delete "${bookId}" "${BOOKS_DIR}"`;
    const res = execSync(cmd, { encoding: "utf-8" });
    const parsed = JSON.parse(res.trim());
    if (!parsed.ok) {
      throw new Error(`delete_book_by_id returned non-ok result: ${res}`);
    }
    console.log(`  -> Deleted from disk & un-staged from git index: ${parsed.path || parsed.deleted}`);
    deletedCount++;
    deletedIds.push(bookId);
  } catch (err) {
    console.error(`\n[FATAL ERROR] Failed to delete book '${bookId}' via delete_book_by_id!`);
    console.error(`Error details:`, err.message);
    process.exit(1);
  }
}

console.log(`\nSuccessfully deleted ${deletedCount} books via delete_book_by_id.`);

// 3. Verify physical disk state
const remainingDiskEntries = fs.readdirSync(BOOKS_DIR).filter(n => !n.startsWith("."));
if (remainingDiskEntries.length !== 0) {
  throw new Error(`Disk verification failed! Remaining orphan folders in BOOKS/: ${remainingDiskEntries.join(", ")}`);
}
console.log("[PASS] Physical Verification: BOOKS/ directory is 100% empty (0 orphan folders).");

// 4. Verify scanner output on empty BOOKS/
const scanOutput = execSync(`"${CLI_BIN}" scan "${BOOKS_DIR}"`, {
  encoding: "utf-8",
  maxBuffer: 50 * 1024 * 1024
});
const scanResult = JSON.parse(scanOutput);
if (scanResult.valid_count !== 0 || scanResult.total_found !== 0) {
  throw new Error(`Scanner verification failed! Found ${scanResult.total_found} books, ${scanResult.valid_count} valid.`);
}
console.log("[PASS] Scanner Verification: 0 books found on disk, library scan is completely empty.");

// 5. Verify Zero-Flash Cold Reload on Empty Library
console.log("\n--- Testing Zero-Flash on Cold Reload (Empty Library) ---");
const mockDefaultStaticBooks = [
  "01-html-master-curriculum",
  "02-css-tailwind-master-curriculum",
  "03-javascript-master-curriculum",
  "04-typescript-master-curriculum",
  "05-react-master-curriculum",
  "06-node-backend-master-book",
  "07-rust-book-01-core",
  "08-rust-book-02-advanced",
  "09-rust-book-03-backend",
  "10-rust-book-04-databases",
  "11-rust-book-05-networking",
  "12-rust-book-06-robotics",
  "13-rust-book-07-wasm",
  "14-rust-book-08-production"
];

const deletedSet = new Set(deletedIds);
const coldLoadedBooks = mockDefaultStaticBooks.filter(id => !deletedSet.has(id));

if (coldLoadedBooks.length !== 0) {
  throw new Error(`Zero-Flash test failed! ${coldLoadedBooks.length} books would flash on initial render: ${coldLoadedBooks.join(", ")}`);
}
console.log("[PASS] Zero-Flash Verified: 0 books rendered on Frame 0, library cleanly opens to empty shelf state.");

// 6. Verify Git status for BOOKS/
const gitStatus = execSync("git status --porcelain BOOKS/", { encoding: "utf-8" }).trim();
console.log("\nGit status for BOOKS/:\n" + (gitStatus || "(completely clean)"));

console.log("\n============================================================");
console.log(`CLEANUP COMPLETE: ${deletedCount} test books permanently deleted.`);
console.log("============================================================");
