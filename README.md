# EDUcraft Desktop App (v0.5.0)

<p align="center">
  <strong>منصة المعرفة والمناهج التفاعلية مفتوحة المصدر</strong><br>
  Cross-platform Interactive Knowledge & Curriculum Desktop Application built with <strong>Tauri v2 + Vite + React + Rust</strong>.
</p>

<p align="center">
  <a href="https://github.com/Tommypain/EDUcraft/releases/latest">
    <img src="https://img.shields.io/github/v/release/Tommypain/EDUcraft?color=success&label=Latest%20Release" alt="Latest Release">
  </a>
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue" alt="Supported Platforms">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

---

## 📥 Downloads & Installation / تنزيل التطبيق

يمكن للمستخدم النهائي تنزيل التطبيق وتثبيته مباشرة واستخدامه **دون الحاجة إلى Node.js أو Rust أو سطر الأوامر (Terminal)**:

👉 **[انقر هنا لتنزيل أحدث إصدار (Download Latest Release)](https://github.com/Tommypain/EDUcraft/releases/latest)**

### حزم التثبيت المتاحة لكل نظام تشغيل (Installers):

| نظام التشغيل (OS) | صيغة الحزمة (Package) | طريقة التشغيل والتثبيت |
| :--- | :--- | :--- |
| **Windows** (10 / 11 64-bit) | `EDUcraft_0.5.0_x64-setup.exe` أو `.msi` | حمّل الملف وشغّل المثبت بنقرة مزدوجة وسيبدأ التطبيق مباشرة. |
| **Linux** (كل التوزيعات) | `EDUcraft_0.5.0_amd64.AppImage` | اضغط كليك يمين -> خصائص -> اسمح بالتشغيل كبرنامج (`chmod +x`) وشغّله فوراً دون تثبيت. |
| **Linux** (Debian / Ubuntu) | `EDUcraft_0.5.0_amd64.deb` | ثبّته عبر مركز البرامج أو عبر الأمر `sudo dpkg -i ...deb`. |
| **macOS** (Apple Silicon M1/M2/M3) | `EDUcraft_0.5.0_aarch64.dmg` | افتح ملف الـ DMG واسحب أيقونة EDUcraft إلى مجلد Applications. |
| **macOS** (Intel x64) | `EDUcraft_0.5.0_x64.dmg` | افتح ملف الـ DMG واسحب أيقونة EDUcraft إلى مجلد Applications. |
| **Portable Web** (أي جهاز) | Standalone Single-File `.html` | ملف واحد مدمج يعمل في أي متصفح بالكامل بدون إنترنت وبدون تثبيت. |

---

## ✨ Features / المميزات الأساسية

1. **شجرة المعرفة التفاعلية (Interactive Knowledge Tree)**: استعراض الفروع والأوراق وتتبع التقدم الدراسي والمسارات التعليمية.
2. **استوديو التحضير وتصميم الصفحات (A4 Canvas Studio)**: محرر مرئي متكامل لإنشاء وتعديل المحتوى بدقة طباعة 1200 DPI مع تصدير PDF فائق الجودة.
3. **13 نوعاً من الأسئلة التفاعلية**: أسئلة فردية، متعددة، صواب وخطأ، مطابقة، ترتيب، تصنيف، نصوص، برمجية، cloze، والمزيد.
4. **تصدير مستقل بدون إنترنت (Zero-CDN Standalone HTML Export)**: تصدير أي كتاب كملف HTML واحد مستقل تماماً مدمج به كافة الخطوط والأكواد والتنسيقات.
5. **إدارة وحفظ وتفريغ قاعدة البيانات (Database Dump & Restore)**: استيراد وتصدير كامل المكتبة والمجموعات مع آليات حماية صارمة لمنع تلف البيانات.

---

## 🛠️ Development & Building / للمطورين والمساهمين

إذا كنت مطوراً وترغب في تشغيل الكود المصدري أو التعديل عليه:

### 1. المتطلبات (Prerequisites)
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (v1.75+)

### 2. تثبيت التبعيات (Install Dependencies)
```bash
npm install
```

### 3. تشغيل التطبيق في وضع التطوير (Development Mode)
- **تطبيق سطح المكتب (Tauri Native Window):**
  ```bash
  npm run tauri dev
  ```
- **واجهة الويب فقط (Vite Browser Preview):**
  ```bash
  npm run dev
  ```

### 4. البناء للإنتاج (Production Build)
- **بناء حزم التثبيت لكافة المنصات:**
  ```bash
  npm run tauri build
  ```
  - **Linux:** ينتج `.AppImage` و `.deb` داخل `src-tauri/target/release/bundle/`
  - **Windows:** ينتج `.exe` (NSIS) و `.msi`
  - **macOS:** ينتج `.dmg` و `.app`

---

## 📂 Project Structure / هيكل المشروع

```text
EDUcraft/
├── .github/workflows/          # CI/CD Automated Multi-platform Release Workflow
├── src/
│   ├── EDUcraft_fixed.jsx      # تطبيق EDUcraft الرئيسي والمكتمل
│   ├── standalone.jsx          # نقطة دخول تصدير الـ HTML المستقل
│   ├── main.jsx                # نقطة تثبيت React 18 DOM
│   └── styles.css              # تصميم Tailwind وألوان وتنسيقات المنصة
├── src-tauri/
│   ├── Cargo.toml              # إعدادات محرك Rust و Tauri
│   ├── tauri.conf.json         # إعدادات نافذة التطبيق والحزم
│   ├── icons/                  # أيقونات كافة أنظمة التشغيل (Windows, macOS, Linux)
│   └── src/
│       ├── lib.rs              # محرك النواة والـ IPC Bridge
│       ├── book_manager/       # مسح وحفظ واستيراد وتصدير الكتب
│       └── export_engine/      # محرك تصدير ملفات الـ HTML والـ PDF المدمجة
├── BOOKS/                      # مسار حفظ وتخزين الكتب محلياً
└── scripts/                    # أدوات التصدير والفحص السريع
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
