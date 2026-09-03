import React, { useMemo, useState, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-rust.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-markup.js"; // HTML / XML
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-bash.js";
import { Check, Copy } from "lucide-react";

export const SUPPORTED_LANGS = [
  { id: "rust", label: "Rust" },
  { id: "typescript", label: "TypeScript" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "markup", label: "HTML / XML" },
  { id: "css", label: "CSS" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash / Shell" },
  { id: "json", label: "JSON" },
];

const LANG_MAP = {
  rs: "rust",
  rust: "rust",
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  html: "markup",
  xml: "markup",
  markup: "markup",
  css: "css",
  py: "python",
  python: "python",
  json: "json",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  shell: "bash"
};

export function detectLanguage(code, explicitLang) {
  if (explicitLang && LANG_MAP[explicitLang.toLowerCase()]) {
    return LANG_MAP[explicitLang.toLowerCase()];
  }
  const str = String(code || "").trim();
  if (str.startsWith("<") && (str.includes("</") || str.includes("/>") || str.includes("<!DOCTYPE"))) {
    return "markup";
  }
  if (str.startsWith("{") && str.endsWith("}") && str.includes("\":")) {
    return "json";
  }
  if (str.includes("fn ") || str.includes("let mut ") || str.includes("impl ") || str.includes("println!")) {
    return "rust";
  }
  if (str.includes("const ") || str.includes("function ") || str.includes("=>") || str.includes("import ")) {
    return "javascript";
  }
  if (str.includes("def ") || str.includes("import ") || str.includes("elif ") || str.includes("print(")) {
    return "python";
  }
  if (str.includes("SELECT ") || str.includes("CREATE TABLE") || str.includes("INSERT INTO")) {
    return "sql";
  }
  return "rust";
}

export function highlightCode(code, lang) {
  const normalizedLang = detectLanguage(code, lang);
  const grammar = Prism.languages[normalizedLang] || Prism.languages.rust || Prism.languages.javascript;
  try {
    return Prism.highlight(String(code || ""), grammar, normalizedLang);
  } catch (e) {
    return String(code || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

export function SyntaxCodeBlock({ code, lang, title, style = {}, className = "", theme, skin }) {
  const normalizedLang = detectLanguage(code, lang);
  const highlightedHtml = useMemo(() => highlightCode(code, normalizedLang), [code, normalizedLang]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(String(code));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Skin integration
  const isPixel = skin?.pixel;
  const isGlass = skin?.id === "glass";
  const radius = isPixel ? 0 : skin?.radiusMd || 12;
  const bg = isGlass ? "rgba(18, 18, 22, 0.85)" : isPixel ? "#000000" : "#121214";
  const border = isPixel
    ? `2px solid ${theme?.hairlineStrong || "#fff"}`
    : isGlass
    ? "1px solid rgba(255, 255, 255, 0.14)"
    : "1px solid #282828";
  const shadow = isPixel ? skin?.shadow : "0 4px 20px rgba(0,0,0,0.3)";

  return (
    <div
      className={`educraft-code-box overflow-hidden my-3 ${className}`}
      style={{
        background: bg,
        border,
        borderRadius: radius,
        boxShadow: shadow,
        backdropFilter: isGlass ? "blur(14px)" : "none",
        direction: "ltr",
        textAlign: "left",
        ...style,
      }}
    >
      <div
        className="flex items-center justify-between px-3.5 py-1.5 select-none"
        style={{
          background: isGlass ? "rgba(255,255,255,0.05)" : "#1B1B1E",
          borderBottom: isGlass ? "1px solid rgba(255,255,255,0.08)" : "1px solid #282828",
          fontSize: 11,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-300">{title || normalizedLang}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="uppercase text-[9px] font-bold tracking-wider px-2 py-0.5 rounded"
            style={{
              background: theme?.accentSoft || "#2A2A2A",
              color: theme?.accent || "#F59E0B",
            }}
          >
            {normalizedLang}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
      <pre
        className="p-3.5 m-0 overflow-x-auto font-mono text-[12.5px] leading-relaxed select-text"
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, 'Space Mono', monospace",
          color: "#E6EDF3",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
}

export function LiveCodeEditor({ code, lang, title, onUpdate, theme, skin, placeholder = "Enter code here..." }) {
  const normalizedLang = detectLanguage(code, lang);
  const highlightedHtml = useMemo(() => highlightCode(code, normalizedLang), [code, normalizedLang]);
  const preRef = useRef(null);

  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const isPixel = skin?.pixel;
  const isGlass = skin?.id === "glass";
  const radius = isPixel ? 0 : 8;

  return (
    <div
      className="flex flex-col overflow-hidden border"
      style={{
        borderRadius: radius,
        borderColor: theme?.hairline || "#333",
        background: isGlass ? "rgba(18, 18, 22, 0.85)" : "#0F0F11",
      }}
    >
      {/* Editor Header */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-1.5 border-b"
        style={{
          background: isGlass ? "rgba(255,255,255,0.04)" : "#18181B",
          borderColor: theme?.hairline || "#282828",
        }}
      >
        <input
          type="text"
          value={title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Code snippet title..."
          className="text-xs font-medium px-2 py-1 rounded bg-transparent border text-zinc-200 outline-none w-1/2"
          style={{ borderColor: theme?.hairline || "#333" }}
        />
        <select
          value={normalizedLang}
          onChange={(e) => onUpdate({ codeLang: e.target.value })}
          className="text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer"
          style={{
            background: "#27272A",
            color: theme?.accent || "#F59E0B",
            border: `1px solid ${theme?.hairline || "#3F3F46"}`,
          }}
        >
          {SUPPORTED_LANGS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Editor Overlay Canvas: textarea on top, highlighted pre underneath */}
      <div className="relative w-full" style={{ minHeight: 120 }}>
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 p-3 m-0 overflow-hidden font-mono text-[13px] leading-relaxed pointer-events-none select-none"
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            color: "#E6EDF3",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: (highlightedHtml || "") + "\n" }}
        />
        <textarea
          value={code || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          onScroll={handleScroll}
          rows={5}
          dir="ltr"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder={placeholder}
          className="relative w-full p-3 font-mono text-[13px] leading-relaxed bg-transparent resize-y outline-none"
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            color: "transparent",
            caretColor: "#FFFFFF",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        />
      </div>
    </div>
  );
}
