import React, { useMemo } from "react";
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
  return "rust"; // Default programming language in curriculum
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

export function SyntaxCodeBlock({ code, lang, title, style = {}, className = "" }) {
  const normalizedLang = detectLanguage(code, lang);
  const highlightedHtml = useMemo(() => highlightCode(code, normalizedLang), [code, normalizedLang]);

  return (
    <div
      className={`educraft-code-box rounded-xl overflow-hidden my-2.5 border border-[#333333] shadow-md ${className}`}
      style={{
        background: "#161616",
        direction: "ltr",
        textAlign: "left",
        ...style
      }}
    >
      {(title || normalizedLang) && (
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#202020] border-b border-[#303030] text-[11px] font-mono text-zinc-400 select-none">
          <span className="font-bold text-zinc-300">{title || normalizedLang}</span>
          <span className="uppercase text-[9px] tracking-wider px-1.5 py-0.5 rounded bg-[#2A2A2A] text-amber-400">
            {normalizedLang}
          </span>
        </div>
      )}
      <pre
        className="p-3.5 m-0 overflow-x-auto font-mono text-[12.5px] leading-relaxed select-text"
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, 'Space Mono', monospace",
          color: "#E6EDF3",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
}
