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
      // 1. Export endpoints
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

      // 2. Book Management endpoints
      server.middlewares.use("/__api/books/scan", (req, res, next) => {
        if (req.method !== "GET" && req.method !== "POST") return next();
        const binPath = path.resolve(__dirname, "src-tauri/target/debug/books_cli");
        const booksDir = path.resolve(__dirname, "BOOKS");

        if (!fs.existsSync(binPath)) {
          res.statusCode = 503;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "books_cli binary not found. Run: npm run build:cli" }));
          return;
        }

        const proc = spawn(binPath, ["scan", booksDir], {
          env: {
            ...process.env,
            LIBRARY_PATH: path.resolve(__dirname, "src-tauri/.pkgconfig/lib"),
            PKG_CONFIG_PATH: path.resolve(__dirname, "src-tauri/.pkgconfig"),
          },
        });

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        proc.stdout.pipe(res);
        proc.on("error", (err) => {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });

      server.middlewares.use("/__api/books/delete", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            const target = data.id || data.path;
            if (!target) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing book id or path to delete" }));
              return;
            }

            const binPath = path.resolve(__dirname, "src-tauri/target/debug/books_cli");
            const booksDir = path.resolve(__dirname, "BOOKS");
            const proc = spawn(binPath, ["delete", target, booksDir], {
              env: {
                ...process.env,
                LIBRARY_PATH: path.resolve(__dirname, "src-tauri/.pkgconfig/lib"),
                PKG_CONFIG_PATH: path.resolve(__dirname, "src-tauri/.pkgconfig"),
              },
            });

            let stdout = "";
            let stderr = "";
            proc.stdout.on("data", (d) => (stdout += d.toString()));
            proc.stderr.on("data", (d) => (stderr += d.toString()));

            proc.on("error", (err) => {
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({ ok: false, error: String(err) }));
              }
            });

            proc.on("close", (code) => {
              if (res.headersSent) return;
              if (code === 0) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(stdout || JSON.stringify({ ok: true }));
              } else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({ ok: false, error: stderr.trim() || `Exit code ${code}` }));
              }
            });
          } catch (err) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ ok: false, error: "Invalid JSON body" }));
          }
        });
      });
      server.middlewares.use("/__api/books/save_image", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            const { bookId, filename, dataBase64 } = data;
            if (!bookId || !filename || !dataBase64) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Missing bookId, filename, or dataBase64" }));
              return;
            }

            const cleanBase64 = dataBase64.includes(",") ? dataBase64.split(",")[1] : dataBase64;
            const buffer = Buffer.from(cleanBase64, "base64");
            const targetDir = path.resolve(__dirname, "BOOKS", bookId, "assets", "images");
            fs.mkdirSync(targetDir, { recursive: true });

            const safeFilename = path.basename(filename);
            const targetPath = path.join(targetDir, safeFilename);
            fs.writeFileSync(targetPath, buffer);

            const relPath = `assets/images/${safeFilename}`;
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, path: relPath }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });

      server.middlewares.use("/__api/books/delete_image", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            const { bookId, relativePath } = data;
            if (!bookId || !relativePath || relativePath.includes("..")) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Invalid parameters" }));
              return;
            }

            const targetPath = path.resolve(__dirname, "BOOKS", bookId, relativePath);
            if (fs.existsSync(targetPath)) {
              fs.unlinkSync(targetPath);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, deleted: true }));
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, deleted: false }));
            }
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });

      server.middlewares.use("/__books", (req, res, next) => {
        const decoded = decodeURIComponent(req.url);
        if (decoded.includes("..")) return next();
        const fullPath = path.resolve(__dirname, "BOOKS", decoded.replace(/^\//, ""));
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          const ext = path.extname(fullPath).toLowerCase();
          const mimeTypes = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".svg": "image/svg+xml",
            ".webp": "image/webp",
            ".gif": "image/gif",
          };
          res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
          fs.createReadStream(fullPath).pipe(res);
          return;
        }
        next();
      });
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
