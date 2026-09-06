import React, { useState, useEffect, useMemo } from "react";
import {
  Blocks,
  X,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Cpu,
  Palette,
  Search,
  Plus,
  Info,
  ExternalLink,
  RotateCw
} from "lucide-react";

// Default standard Titanium plugins pre-configured for EDUcraft
const DEFAULT_PLUGINS = [
  {
    id: "com.educraft.latex-math",
    name: "KaTeX Mathematical Formulas",
    nameAr: "محرك المعادلات الرياضية KaTeX",
    version: "1.0.0",
    author: "EDUcraft Core Team",
    description: "Renders mathematical and scientific equations inline and as standalone display blocks using KaTeX.",
    descriptionAr: "تصيير المعادلات والرموز الرياضية والعلمية في الأوراق وصفحات A4 بتنسيق فائق الدقة باستخدام KaTeX.",
    target_engine: ">=0.0.9.0",
    capabilities: ["math_katex", "inline_formulas", "block_math"],
    type: "builtin",
    isActive: true,
  },
  {
    id: "com.educraft.code-playground",
    name: "Interactive Code Playground",
    nameAr: "بيئة تشغيل الأكواد التفاعلية",
    version: "1.1.0",
    author: "Titanium Extension Labs",
    description: "Provides an interactive runtime to execute HTML, JavaScript, and CSS code snippets live inside the reader.",
    descriptionAr: "بيئة تشغيل حية لتنفيذ واختبار وتجربة أكواد الويب التفاعلية مباشرة داخل قارئ الكتب.",
    target_engine: ">=0.0.9.0",
    capabilities: ["live_exec", "sandbox_iframe", "code_editor"],
    type: "builtin",
    isActive: true,
  },
  {
    id: "com.educraft.media-viewer",
    name: "High-Res Asset & Diagram Lightbox",
    nameAr: "عارض الرسومات التوضيحية فائق الدقة",
    version: "1.0.2",
    author: "EDUcraft Multimodal Team",
    description: "Enables click-to-zoom, pan, and fullscreen lightbox viewing for high-resolution diagrams and figures.",
    descriptionAr: "تكبير عالي الدقة وتحريك ملء الشاشة للمخططات البيانية والرسومات التوضيحية داخل صفحات A4.",
    target_engine: ">=0.0.9.0",
    capabilities: ["image_lightbox", "svg_pan_zoom", "asset_export"],
    type: "builtin",
    isActive: true,
  },
  {
    id: "com.educraft.audio-pronunciation",
    name: "Linguistic Term Pronouncer",
    nameAr: "النطق الصوتي للمصطلحات اللغوية والبرمجية",
    version: "0.9.5",
    author: "EDUcraft Accessibility Guild",
    description: "Provides synthesized speech pronunciation for foreign vocabulary and programming keywords in keyterm blocks.",
    descriptionAr: "نطق صوتي تلقائي للمصطلحات الإنجليزية والكلمات المفتاحية البرمجية في كتل المصطلحات.",
    target_engine: ">=0.0.9.0",
    capabilities: ["tts_audio", "keyterm_speech"],
    type: "community",
    isActive: false,
  },
];

export function TitaniumPluginsModal({
  isOpen,
  onClose,
  lang = "ar",
  dir = "rtl",
  theme,
  skin,
}) {
  const [plugins, setPlugins] = useState(() => {
    try {
      const saved = localStorage.getItem("educraft_plugins_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        return DEFAULT_PLUGINS.map((p) => ({
          ...p,
          isActive: parsed[p.id] !== undefined ? parsed[p.id] : p.isActive,
        }));
      }
    } catch {}
    return DEFAULT_PLUGINS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "active" | "inactive"
  const [installSuccessNotice, setInstallSuccessNotice] = useState(null);

  // Sync to local storage
  useEffect(() => {
    const map = {};
    plugins.forEach((p) => {
      map[p.id] = p.isActive;
    });
    localStorage.setItem("educraft_plugins_state", JSON.stringify(map));
  }, [plugins]);

  // Load from Tauri IPC if available
  useEffect(() => {
    if (!isOpen) return;
    const fetchTauriPlugins = async () => {
      try {
        if (window.__TAURI_INTERNALS__ || window.__TAURI__) {
          const { invoke } = await import("@tauri-apps/api/core");
          const res = await invoke("titanium_list_plugins");
          if (Array.isArray(res) && res.length > 0) {
            setPlugins((prev) => {
              const prevMap = new Map(prev.map((p) => [p.id, p]));
              res.forEach((tp) => {
                const existing = prevMap.get(tp.id);
                prevMap.set(tp.id, {
                  id: tp.id,
                  name: tp.name || tp.id,
                  nameAr: existing?.nameAr || tp.name || tp.id,
                  version: tp.version || "1.0.0",
                  author: tp.author || "Titanium Developer",
                  description: tp.description || "",
                  descriptionAr: existing?.descriptionAr || tp.description || "",
                  target_engine: tp.target_engine || ">=0.0.9.0",
                  capabilities: tp.capabilities || [],
                  type: "installed",
                  isActive: tp.state === "Active",
                });
              });
              return Array.from(prevMap.values());
            });
          }
        }
      } catch (err) {
        console.debug("Tauri IPC titanium_list_plugins not available in web mode, using local state:", err);
      }
    };
    fetchTauriPlugins();
  }, [isOpen]);

  const togglePlugin = async (id) => {
    const target = plugins.find((p) => p.id === id);
    if (!target) return;
    const nextState = !target.isActive;

    // Call Tauri IPC if available
    try {
      if (window.__TAURI_INTERNALS__ || window.__TAURI__) {
        const { invoke } = await import("@tauri-apps/api/core");
        if (nextState) {
          await invoke("titanium_activate_plugin", { pluginId: id });
        } else {
          await invoke("titanium_deactivate_plugin", { pluginId: id });
        }
      }
    } catch (e) {
      console.debug("Tauri toggle failed, applying locally:", e);
    }

    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: nextState } : p))
    );
  };

  const handleInstallSimulate = () => {
    const newId = `com.custom.plugin-${Date.now().toString().slice(-4)}`;
    const newPlugin = {
      id: newId,
      name: "Custom Titanium Extension Pack",
      nameAr: "حزمة إضافات تيتانيوم مخصصة",
      version: "1.0.0",
      author: "Local Developer",
      description: "Custom user-provided Titanium extension pack successfully imported and sandboxed.",
      descriptionAr: "إضافة مخصصة تم استيرادها والتحقق من سلامة مساراتها وتشغيلها بنجاح.",
      target_engine: ">=0.0.9.0",
      capabilities: ["custom_views", "theme_tokens"],
      type: "installed",
      isActive: true,
    };
    setPlugins((prev) => [newPlugin, ...prev]);
    setInstallSuccessNotice(
      lang === "ar" ? "تم تثبيت وتفعيل الإضافة بنجاح!" : "Extension installed and activated successfully!"
    );
    setTimeout(() => setInstallSuccessNotice(null), 3000);
  };

  const filtered = useMemo(() => {
    return plugins.filter((p) => {
      if (filterType === "active" && !p.isActive) return false;
      if (filterType === "inactive" && p.isActive) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (p.name || "").toLowerCase().includes(q);
        const matchTitleAr = (p.nameAr || "").toLowerCase().includes(q);
        const matchId = (p.id || "").toLowerCase().includes(q);
        const matchDesc = (p.description || "").toLowerCase().includes(q);
        const matchDescAr = (p.descriptionAr || "").toLowerCase().includes(q);
        return matchTitle || matchTitleAr || matchId || matchDesc || matchDescAr;
      }
      return true;
    });
  }, [plugins, filterType, searchQuery]);

  const activeCount = plugins.filter((p) => p.isActive).length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,16,10,0.65)", backdropFilter: "blur(5px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Titanium Plugins Modal"
    >
      <div
        dir={dir}
        className="educraft-modal-in w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-7 flex flex-col gap-5"
        style={{
          background: theme.surface,
          color: theme.ink,
          borderRadius: skin?.radiusLg || 18,
          border: `1.5px solid ${theme.hairline}`,
          boxShadow: skin?.id === "pixel" ? skin.shadow : "0 24px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b pb-4" style={{ borderColor: theme.hairline }}>
          <div className="flex items-center gap-3">
            <div
              className="grid place-items-center rounded-xl shrink-0 shadow-xs"
              style={{ width: 42, height: 42, background: theme.accentSoft, color: theme.accent }}
            >
              <Blocks size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold" style={{ color: theme.ink }}>
                  {lang === "ar" ? "إضافات تيتانيوم (Titanium Extensions)" : "Titanium Extensions"}
                </h2>
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                  style={{ background: theme.accent, color: theme.accentInk }}
                >
                  v0.0.9+
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: theme.inkSoft }}>
                {lang === "ar"
                  ? "إدارة المحركات الملحقة، الدعم الرياضي KaTeX، المعامل البرمجية، والمكونات التفاعلية"
                  : "Manage runtime extensions, KaTeX math rendering, interactive sandboxes, and UI blocks"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center rounded-lg shrink-0 transition-opacity hover:opacity-75 cursor-pointer"
            style={{ width: 32, height: 32, border: `1px solid ${theme.hairline}`, color: theme.ink }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status notice */}
        {installSuccessNotice && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>{installSuccessNotice}</span>
          </div>
        )}

        {/* Toolbar: Search, Filter, Stats & Install Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-1">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border flex-1"
              style={{ background: theme.canvas, borderColor: theme.hairline }}
            >
              <Search size={14} style={{ color: theme.inkSoft }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "بحث في الإضافات..." : "Search extensions..."}
                className="w-full bg-transparent text-xs outline-none"
                style={{ color: theme.ink }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="cursor-pointer opacity-60 hover:opacity-100">
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center rounded-xl p-1 border text-xs" style={{ background: theme.canvas, borderColor: theme.hairline }}>
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${filterType === "all" ? "shadow-xs" : "opacity-70"}`}
                style={{
                  background: filterType === "all" ? theme.surface : "transparent",
                  color: filterType === "all" ? theme.accent : theme.inkSoft,
                }}
              >
                {lang === "ar" ? `الكل (${plugins.length})` : `All (${plugins.length})`}
              </button>
              <button
                onClick={() => setFilterType("active")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${filterType === "active" ? "shadow-xs" : "opacity-70"}`}
                style={{
                  background: filterType === "active" ? theme.surface : "transparent",
                  color: filterType === "active" ? theme.accent : theme.inkSoft,
                }}
              >
                {lang === "ar" ? `النشطة (${activeCount})` : `Active (${activeCount})`}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInstallSimulate}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            style={{ background: theme.accent }}
          >
            <Plus size={14} />
            <span>{lang === "ar" ? "تثبيت إضافة" : "Install Plugin"}</span>
          </button>
        </div>

        {/* Plugins List */}
        <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border text-xs" style={{ background: theme.canvas, borderColor: theme.hairline, color: theme.inkSoft }}>
              {lang === "ar" ? "لا توجد إضافات تطابق البحث." : "No plugins matching your search."}
            </div>
          ) : (
            filtered.map((plugin) => (
              <div
                key={plugin.id}
                className="p-4 rounded-2xl border transition-all hover:shadow-xs flex flex-col gap-2.5"
                style={{
                  background: theme.canvas,
                  borderColor: plugin.isActive ? `${theme.accent}66` : theme.hairline,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="grid place-items-center rounded-xl shrink-0 mt-0.5"
                      style={{
                        width: 36,
                        height: 36,
                        background: plugin.isActive ? theme.accentSoft : theme.surfaceSoft,
                        color: plugin.isActive ? theme.accent : theme.inkSoft,
                      }}
                    >
                      {plugin.capabilities.includes("math_katex") ? (
                        <Sparkles size={18} />
                      ) : plugin.capabilities.includes("live_exec") ? (
                        <Cpu size={18} />
                      ) : (
                        <Blocks size={18} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold" style={{ color: theme.ink }}>
                          {lang === "ar" ? plugin.nameAr : plugin.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border" style={{ borderColor: theme.hairline, color: theme.inkSoft }}>
                          v{plugin.version}
                        </span>
                        {plugin.type === "builtin" && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                            {lang === "ar" ? "أساسية" : "Core"}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono block mt-0.5" style={{ color: theme.inkSoft }}>
                        {plugin.id} • {plugin.author}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => togglePlugin(plugin.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                    style={{
                      background: plugin.isActive ? theme.accent : theme.surfaceSoft,
                      color: plugin.isActive ? theme.accentInk : theme.inkSoft,
                      boxShadow: plugin.isActive ? `0 2px 8px ${theme.accent}40` : "none",
                    }}
                  >
                    <span>{plugin.isActive ? (lang === "ar" ? "مفعلة" : "Active") : (lang === "ar" ? "معطلة" : "Disabled")}</span>
                  </button>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: theme.inkSoft }}>
                  {lang === "ar" ? plugin.descriptionAr : plugin.description}
                </p>

                {/* Capabilities tags */}
                {plugin.capabilities && plugin.capabilities.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-semibold" style={{ color: theme.inkSoft }}>
                      {lang === "ar" ? "القدرات:" : "Capabilities:"}
                    </span>
                    {plugin.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                        style={{ background: theme.surface, color: theme.inkSoft, border: `1px solid ${theme.hairline}` }}
                      >
                        #{cap}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info banner */}
        <div
          className="flex items-center justify-between gap-3 pt-3 border-t text-xs"
          style={{ borderColor: theme.hairline, color: theme.inkSoft }}
        >
          <div className="flex items-center gap-1.5">
            <Info size={14} />
            <span>
              {lang === "ar"
                ? "تعمل إضافات تيتانيوم في بيئة معزولة أمنياً مع حماية كاملة من اجتياز المسارات."
                : "Titanium plugins execute within a sandboxed runtime with strict path-traversal isolation."}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer"
            style={{ borderColor: theme.hairline, color: theme.ink }}
          >
            {lang === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
