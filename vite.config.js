import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const host = process.env.TAURI_DEV_HOST;

function rustExporterPlugin() {
  return {
    name: "rust-exporter-bridge",
    configureServer(server) {
      const handleExport = (req, res, next) => {
        if (req.method !== "POST") return next();
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => {
          const payload = Buffer.concat(chunks);
          const binPath = path.resolve(__dirname, "src-tauri/target/debug/export_cli");

          if (!fs.existsSync(binPath)) {
            res.statusCode = 503;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "export_cli binary not found. Run: npm run build:cli" }));
            return;
          }

          const proc = spawn(binPath, [], {
            env: {
              ...process.env,
              LIBRARY_PATH: path.resolve(__dirname, "src-tauri/.pkgconfig/lib"),
              PKG_CONFIG_PATH: path.resolve(__dirname, "src-tauri/.pkgconfig"),
            },
          });

          res.setHeader("Content-Type", "text/html; charset=utf-8");
          proc.stdout.pipe(res);

          let stderr = "";
          proc.stderr.on("data", (d) => {
            stderr += d.toString();
          });

          proc.on("error", (err) => {
            console.error("[Vite Rust Exporter] Process error:", err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: String(err) }));
            }
          });

          proc.on("close", (code) => {
            if (code !== 0 && !res.headersSent) {
              console.error("[Vite Rust Exporter] Exited with code:", code, stderr);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: stderr }));
            }
          });

          proc.stdin.write(payload);
          proc.stdin.end();
        });
      };

      server.middlewares.use("/__api/export_book", handleExport);
      server.middlewares.use("/__api/export_collection", handleExport);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), rustExporterPlugin()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 5174,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
