# EDUcraft

### What is EDUcraft?
EDUcraft is a lightweight, high-performance cross-platform desktop application designed to provide an interactive educational authoring and crafting environment.

---

### Technology
- **Frontend**: React (JSX) + CSS
- **Build Tool**: Vite
- **Backend**: Rust + Tauri 2
- **IPC**: Tauri 2 Commands & Events

---

### Development

#### 1. Frontend Development (Browser Preview)
Run the Vite development server to test UI and components in any web browser:
```bash
npm install
npm run dev
```

#### 2. Desktop Development (Tauri + Native Backend)
Run the native cross-platform desktop application:
```bash
npm run tauri dev
```

---

### Build

To package and compile EDUcraft for production:

```bash
npm run tauri build
```

This compiles both the frontend bundle and the native Rust binary into platform-native installers and executables.

---

### Platform Prerequisites

EDUcraft targets Linux, Windows, and macOS:

- **Linux (Fedora / RHEL)**:
  ```bash
  sudo dnf install webkit2gtk4.1-devel gtk3-devel openssl-devel libappindicator-gtk3-devel librsvg2-devel
  ```
- **Linux (Ubuntu / Debian)**:
  ```bash
  sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
  ```
- **Windows**:
  - Microsoft Visual Studio C++ Build Tools
  - WebView2 (installed by default on Windows 10 & 11)
- **macOS**:
  - Xcode Command Line Tools: `xcode-select --install`

---

### Version

```text
0.0.1
```
