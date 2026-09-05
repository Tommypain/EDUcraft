import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function compileCss() {
  const distAssetsDir = path.join(rootDir, "dist", "assets");
  const mainCssPath = path.join(rootDir, "src", "styles.css");
  const srcJsPath = path.join(rootDir, "src", "EDUcraft_fixed.jsx");

  // Check if dist/assets has an up-to-date CSS file
  if (fs.existsSync(distAssetsDir) && fs.existsSync(mainCssPath)) {
    const cssFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith(".css"));
    if (cssFiles.length > 0) {
      const candidatePath = path.join(distAssetsDir, cssFiles[0]);
      const cssMtime = fs.statSync(candidatePath).mtimeMs;
      const srcMtime = Math.max(
        fs.statSync(mainCssPath).mtimeMs,
        fs.existsSync(srcJsPath) ? fs.statSync(srcJsPath).mtimeMs : 0
      );
      if (cssMtime >= srcMtime) {
        return fs.readFileSync(candidatePath, "utf8");
      }
    }
  }

  // Programmatic build via Vite + Tailwind 4 directly from source
  try {
    const { build } = await import("vite");
    const tailwindPlugin = (await import("@tailwindcss/vite")).default;
    const res = await build({
      configFile: false,
      logLevel: "error",
      plugins: [tailwindPlugin()],
      build: {
        write: false,
        rollupOptions: {
          input: mainCssPath,
        },
      },
    });

    const output = Array.isArray(res) ? res[0]?.output : res?.output;
    const cssChunk = output?.find((o) => o.fileName.endsWith(".css"));
    if (cssChunk && cssChunk.source) {
      return typeof cssChunk.source === "string" ? cssChunk.source : cssChunk.source.toString();
    }
  } catch (err) {
    console.warn("⚠️ Vite CSS programmatic compile failed, falling back to disk read:", err.message);
  }

  // Fallback to reading dist or raw CSS
  if (fs.existsSync(distAssetsDir)) {
    const cssFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith(".css"));
    if (cssFiles.length > 0) {
      return fs.readFileSync(path.join(distAssetsDir, cssFiles[0]), "utf8");
    }
  }
  if (fs.existsSync(mainCssPath)) {
    return fs.readFileSync(mainCssPath, "utf8");
  }
  return "";
}

async function buildExport() {
  console.log("🔨 Building Standalone EDUcraft HTML Bundle for Rust Exporter...");

  const rustAssetsDir = path.join(rootDir, "src-tauri", "assets");
  const rustJsOut = path.join(rustAssetsDir, "ui_bundle.js");
  const rustCssOut = path.join(rustAssetsDir, "ui_bundle.css");
  const rustMetaOut = path.join(rustAssetsDir, "ui_bundle.json");
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
      ".json": "json",
    },
  });

  const jsCode = fs.readFileSync(path.join(tempDir, "bundle.js"), "utf8");

  // 2. Extract or compile CSS
  const cssCode = await compileCss();

  // 3. Write raw assets for Rust loader
  fs.writeFileSync(rustJsOut, jsCode, "utf8");
  fs.writeFileSync(rustCssOut, cssCode, "utf8");

  const meta = {
    builtAt: new Date().toISOString(),
    jsBytes: Buffer.byteLength(jsCode, "utf8"),
    cssBytes: Buffer.byteLength(cssCode, "utf8"),
  };
  fs.writeFileSync(rustMetaOut, JSON.stringify(meta, null, 2), "utf8");

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
