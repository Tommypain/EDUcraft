# EDUcraft Desktop App (v0.0.3)

Cross-platform Desktop Application built with **Tauri v2 + Vite + React (JavaScript)**.

## Project Structure
```
EDUcraft/
├── src/
│   ├── EDUcraft_fixed.jsx      # Core untouched EDUcraft application
│   ├── App.jsx                 # Minimal React App wrapper
│   ├── main.jsx                # React 18 DOM mount
│   └── styles.css              # Tailwind CSS & custom animations/plates
├── src-tauri/
│   ├── Cargo.toml              # Rust Tauri configuration
│   ├── build.rs                # Tauri build script
│   ├── tauri.conf.json         # Tauri v2 application configuration
│   ├── icons/                  # Multi-platform desktop icons
│   └── src/
│       └── main.rs             # Default Tauri main entrypoint
├── index.html                  # HTML entry point with multilingual web fonts
├── package.json                # Project dependencies
└── vite.config.js              # Vite bundler configuration
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
- **Desktop Application (Tauri Window):**
  ```bash
  npm run tauri dev
  ```
- **Web Interface (Browser Only):**
  ```bash
  npm run dev
  ```

### 3. Build for Production
- **Build Desktop Binary / Package:**
  ```bash
  npm run tauri build
  ```
  - **Linux:** Generates `.AppImage` & `.deb` in `src-tauri/target/release/bundle/`
  - **Windows:** Generates `.exe` (NSIS) & `.msi`
  - **macOS:** Generates `.dmg` & `.app`
