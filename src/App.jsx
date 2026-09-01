import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function App() {
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");
  const [sysInfo, setSysInfo] = useState(null);
  const [isTauri, setIsTauri] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if running inside Tauri desktop runtime
    const isDesktop = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
    setIsTauri(isDesktop);

    async function loadSystemInfo() {
      try {
        const info = await invoke("get_system_info");
        setSysInfo(info);
      } catch (err) {
        setSysInfo({
          os: navigator.platform || "Web Browser",
          arch: "Web Runtime",
          family: "Standard Browser",
          mode: "Browser Preview",
        });
      }
    }

    loadSystemInfo();
  }, []);

  async function handleGreet(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await invoke("greet", { name: name.trim() });
      setGreetMsg(response);
    } catch (err) {
      setGreetMsg(`[Browser Mode] Hello, ${name.trim()}! Welcome to EDUcraft.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <img src="/icon.png" alt="EDUcraft Logo" className="brand-logo" />
          <div>
            <h1 className="brand-title">EDUcraft</h1>
            <p className="brand-subtitle">Cross-Platform Educational Application &bull; v0.0.1</p>
          </div>
        </div>

        <div className="status-badge" data-tauri={isTauri}>
          <span className="status-dot"></span>
          <span>{isTauri ? "Tauri Desktop Environment" : "Browser Preview Mode"}</span>
        </div>
      </header>

      <main className="app-main">
        <section className="card intro-card">
          <h2>Project Foundation Initialized</h2>
          <p>
            EDUcraft is configured with a modular, flat architecture powered by <strong>Tauri 2</strong>, <strong>Rust</strong>, and <strong>React + Vite</strong>.
          </p>

          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🦀</span>
              <div className="feature-text">
                <strong>Rust Backend</strong>
                <p>Native system performance and secure file operations via Tauri 2.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">⚛️</span>
              <div className="feature-text">
                <strong>React + Vite</strong>
                <p>Fast HMR frontend rendering with standard JSX and CSS styling.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              <div className="feature-text">
                <strong>Tauri IPC</strong>
                <p>Type-safe asynchronous communication between React and Rust.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <div className="feature-text">
                <strong>Cross-Platform</strong>
                <p>Unified codebase targeting Linux, Windows, and macOS desktops.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card ipc-card">
          <h2>Tauri IPC Verification</h2>
          <p>Test bidirectional communication between the React frontend and Rust native backend:</p>

          <form onSubmit={handleGreet} className="greet-form">
            <input
              type="text"
              className="input-field"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Invoking..." : "Invoke Rust Command"}
            </button>
          </form>

          {greetMsg && (
            <div className="result-box">
              <span className="result-label">Backend Response:</span>
              <p className="result-message">{greetMsg}</p>
            </div>
          )}
        </section>

        {sysInfo && (
          <section className="card sysinfo-card">
            <h2>System &amp; Runtime Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Operating System</span>
                <span className="info-value">{sysInfo.os}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Architecture</span>
                <span className="info-value">{sysInfo.arch}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Family / Mode</span>
                <span className="info-value">{sysInfo.family || sysInfo.mode}</span>
              </div>
              <div className="info-item">
                <span className="info-label">App Version</span>
                <span className="info-value">0.0.1</span>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>EDUcraft &bull; Initialized with Tauri 2 &bull; Linux, Windows, macOS</p>
      </footer>
    </div>
  );
}
