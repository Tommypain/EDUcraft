import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function buildExport() {
  console.log("🔨 Building Standalone EDUcraft HTML Bundle for Rust Exporter...");

  const rustAssetsDir = path.join(rootDir, "src-tauri", "assets");
  const rustJsOut = path.join(rustAssetsDir, "ui_bundle.js");
  const rustCssOut = path.join(rustAssetsDir, "ui_bundle.css");
  const tempDir = path.join(rootDir, ".export_temp");

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  if (!fs.existsSync(rustAssetsDir)) fs.mkdirSync(rustAssetsDir, { recursive: true });

  // 1. Bundle standalone React application
  await esbuild.build({
    entryPoints: [path.join(rootDir, "src", "standalone.jsx")],
    bundle: true,
    minify: true,
    target: ["es2022", "chrome100", "firefox100", "safari15"],
    format: "iife",
    jsx: "automatic",
    outfile: path.join(tempDir, "bundle.js"),
    external: ["tailwindcss"],
    define: { "process.env.NODE_ENV": '"production"' },
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".css": "text",
      ".png": "dataurl",
      ".svg": "text",
      ".json": "json"
    }
  });

  const jsCode = fs.readFileSync(path.join(tempDir, "bundle.js"), "utf8");

  // 2. Extract compiled CSS from dist/assets or fallback to src/styles.css
  let cssCode = "";
  const distAssetsDir = path.join(rootDir, "dist", "assets");
  if (fs.existsSync(distAssetsDir)) {
    const cssFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith(".css"));
    if (cssFiles.length > 0) {
      cssCode = fs.readFileSync(path.join(distAssetsDir, cssFiles[0]), "utf8");
    }
  }
  if (!cssCode) {
    const mainCssPath = path.join(rootDir, "src", "styles.css");
    if (fs.existsSync(mainCssPath)) cssCode = fs.readFileSync(mainCssPath, "utf8");
  }

  // 3. Write raw assets for Rust include_str!()
  fs.writeFileSync(rustJsOut, jsCode, "utf8");
  fs.writeFileSync(rustCssOut, cssCode, "utf8");
  console.log(`✅ Rust assets generated successfully:`);
  console.log(`   JS  → src-tauri/assets/ui_bundle.js  (${(jsCode.length / 1024).toFixed(1)} KB)`);
  console.log(`   CSS → src-tauri/assets/ui_bundle.css (${(cssCode.length / 1024).toFixed(1)} KB)`);

  // 4. Clean temp
  fs.rmSync(tempDir, { recursive: true, force: true });
}

buildExport().catch((err) => {
  console.error("❌ Error building export bundle:", err);
  process.exit(1);
});
