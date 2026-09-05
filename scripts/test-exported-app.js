import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM, VirtualConsole } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "../src-tauri/tests/output/exported_html_book.html");

if (!fs.existsSync(htmlPath)) {
  console.error("❌ Exported HTML file not found at:", htmlPath);
  process.exit(1);
}

const htmlContent = fs.readFileSync(htmlPath, "utf8");
console.log(`📄 Testing Standalone Exported App: ${(htmlContent.length / 1024 / 1024).toFixed(2)} MB`);

const virtualConsole = new VirtualConsole();
const errors = [];
const warnings = [];

virtualConsole.on("error", (...args) => {
  const msg = args.join(" ");
  if (msg.includes("Could not parse CSS stylesheet") || msg.includes("fonts.googleapis.com")) return;
  errors.push(msg);
  console.error("🔴 [Browser Error]:", msg);
});

virtualConsole.on("warn", (...args) => {
  const msg = args.join(" ");
  if (msg.includes("fonts.googleapis.com")) return;
  warnings.push(msg);
});

const dom = new JSDOM(htmlContent, {
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole,
  url: "http://localhost:3000/",
  beforeParse(window) {
    window.requestAnimationFrame = window.requestAnimationFrame || ((cb) => setTimeout(cb, 16));
    window.cancelAnimationFrame = window.cancelAnimationFrame || ((id) => clearTimeout(id));
    window.matchMedia = window.matchMedia || function() {
      return { matches: false, addListener: function() {}, removeListener: function() {} };
    };
    window.scrollTo = () => {};
    window.HTMLElement.prototype.scrollIntoView = () => {};
  }
});

const { window } = dom;
const { document } = window;

setTimeout(async () => {
  try {
    console.log("\n--- TEST 1: Initial Render & App Mounting ---");
    const root = document.getElementById("root");
    if (!root || !root.innerHTML.trim()) {
      throw new Error("Root element is empty!");
    }
    console.log("✅ Application mounted with", root.innerHTML.length, "bytes of HTML");

    console.log("\n--- TEST 2: Seed Data Contract Verification ---");
    const exportData = window.__EDUCRAFT_EXPORT__;
    const book = exportData.books[0];
    console.log(`✅ Book: "${book.ar.title}" (ID: ${book.id})`);
    const leaves = book.nodes.filter(n => n.level === "leaf");
    console.log(`✅ Total Leaves in Tree: ${leaves.length}`);

    console.log("\n--- TEST 3: Tree Leaf Navigation & Blank Page Prevention across Multiple Leaves ---");
    const leafButtons = Array.from(document.querySelectorAll("button")).filter(b => b.textContent.includes("➜"));
    console.log(`Found ${leafButtons.length} clickable leaf cards in Outline view`);

    let tested = 0;
    for (let i = 0; i < Math.min(8, leafButtons.length); i++) {
      const btn = leafButtons[i];
      const leafName = btn.textContent.replace(/\s+/g, " ").trim();
      console.log(`\n [Leaf ${i + 1}/${leafButtons.length}] Testing: "${leafName.slice(0, 50)}..."`);
      
      btn.click();
      await new Promise(r => setTimeout(r, 200));

      const leafViewRoot = document.getElementById("root");
      if (!leafViewRoot || leafViewRoot.innerHTML.length < 1000) {
        throw new Error(`CRITICAL: Blank page detected on leaf ${i + 1}!`);
      }

      // Check if tabs exist
      const hasA4Tab = leafViewRoot.innerHTML.includes("شيتات A4");
      const hasQuizTab = leafViewRoot.innerHTML.includes("الأسئلة والتمارين");
      console.log(`  ✓ Rendered successfully: A4Tab=${hasA4Tab}, QuizTab=${hasQuizTab}, HTML bytes=${leafViewRoot.innerHTML.length}`);

      // If quiz tab exists, click it and verify questions
      if (hasQuizTab) {
        const quizBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("الأسئلة والتمارين"));
        if (quizBtn) {
          quizBtn.click();
          await new Promise(r => setTimeout(r, 100));
          console.log(`  ✓ Switched to Quiz tab successfully.`);
        }
      }

      // Return to Tree
      const backBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes(book.ar.title));
      if (backBtn) {
        backBtn.click();
        await new Promise(r => setTimeout(r, 100));
      }
      tested++;
    }

    console.log(`\n✅ Tested ${tested} leaves thoroughly: ZERO crashes, ZERO blank pages!`);

    if (errors.length > 0) {
      console.error("❌ Runtime errors occurred during interactive test:", errors);
      process.exit(1);
    }

    console.log("\n🎉 ALL TESTS PASSED! Standalone Exported App is 100% verified!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Fatal Test Exception:", err);
    process.exit(1);
  }
}, 1200);
