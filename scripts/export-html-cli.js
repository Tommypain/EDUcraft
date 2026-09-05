import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const bookFile = process.argv[2] || path.join(projectRoot, "src/data/01-html-master-curriculum.json");
const outputFile = process.argv[3] || "/home/tommypain/Downloads/Books/html-master-curriculum.html";
const lang = process.argv[4] || "ar";
const flavorId = process.argv[5] || "orange";

if (!fs.existsSync(bookFile)) {
  console.error("❌ Book file not found:", bookFile);
  process.exit(1);
}

const bookRaw = JSON.parse(fs.readFileSync(bookFile, "utf-8"));
const book = bookRaw.book || bookRaw;

// Try to read master library to get any cover data if available
let covers = {};
const masterLibPath = path.join(projectRoot, "src/data/educraft_master_library.json");
if (fs.existsSync(masterLibPath)) {
  try {
    const master = JSON.parse(fs.readFileSync(masterLibPath, "utf-8"));
    if (master.covers) covers = master.covers;
  } catch (e) {}
}

const seed = {
  id: book.id || "01-html-master-curriculum",
  startBookId: book.id || "01-html-master-curriculum",
  books: [book],
  collections: [],
  lang,
  skinId: "normal",
  flavorId,
  bookFlavors: { [book.id]: flavorId },
  covers: covers[book.id] ? { [book.id]: covers[book.id] } : {},
  disableEditor: false,
};

const cliPath = path.join(projectRoot, "src-tauri/target/debug/export_cli");
if (!fs.existsSync(cliPath)) {
  console.error("❌ export_cli binary not found at:", cliPath);
  process.exit(1);
}

console.log(`📦 Running Rust export_cli for book "${book.id}"...`);
const child = spawnSync(cliPath, [], {
  input: JSON.stringify(seed),
  maxBuffer: 100 * 1024 * 1024,
  encoding: "utf-8",
});

if (child.error) {
  console.error("❌ Failed to run export_cli:", child.error);
  process.exit(1);
}

if (child.status !== 0) {
  console.error("❌ export_cli failed with status:", child.status);
  console.error(child.stderr);
  process.exit(child.status || 1);
}

const html = child.stdout;
if (!html || !html.includes("<!DOCTYPE html>")) {
  console.error("❌ export_cli did not output valid HTML!");
  console.error("Stdout preview:", html.slice(0, 500));
  process.exit(1);
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, html, "utf-8");

console.log(`✅ Successfully exported standalone book to: ${outputFile} (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
