import React, { useState, useRef } from "react";
import {
  FileUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  BookOpen,
  FolderOpen,
  Folder,
  BookCopy,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Image as ImageIcon,
  UploadCloud,
  HelpCircle
} from "lucide-react";
import { parseJSONSafely, validatePayload } from "./importer.js";

export function ImportModal({
  isOpen,
  onClose,
  onImportSuccess,
  existingBooks = [],
  existingCollections = [],
  ui,
  lang = "ar",
  dir = "rtl",
  theme,
  skin
}) {
  const [tab, setTab] = useState("upload");
  const [jsonText, setJsonText] = useState("");
  const [fileName, setFileName] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [step, setStep] = useState("input"); // "input" | "images" | "preview" | "success"
  const [conflictChoices, setConflictChoices] = useState({}); // { [bookId]: "replace" | "rename" }
  const [copied, setCopied] = useState(false);
  const [detectedImages, setDetectedImages] = useState([]);
  const [folderPathInput, setFolderPathInput] = useState("");

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const filesInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setJsonText(text);
        processValidation(text);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const processValidation = (rawText) => {
    setParseError(null);
    setValidationResult(null);

    const { data, error } = parseJSONSafely(rawText);
    if (error) {
      setParseError(error);
      setStep("input");
      return;
    }

    const res = validatePayload(data, existingBooks, existingCollections);
    setValidationResult(res);

    // Default conflict choices to "replace"
    const initialChoices = {};
    res.conflicts.forEach((c) => {
      initialChoices[c.id] = "replace";
    });
    setConflictChoices(initialChoices);

    const imgs = res.referencedImages || [];
    setDetectedImages(imgs);

    if (res.valid) {
      if (imgs.length > 0) {
        setStep("images");
      } else {
        setStep("preview");
      }
    } else {
      setStep("input");
    }
  };

  const handleManualValidate = () => {
    if (!jsonText.trim()) return;
    processValidation(jsonText);
  };

  // Handle folder or multiple image files selection
  const handleImageFilesLoaded = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const fileMap = new Map();
    files.forEach((f) => {
      fileMap.set(f.name.toLowerCase(), f);
    });

    const promises = detectedImages.map((img) => {
      const file = fileMap.get(img.filename.toLowerCase());
      if (file) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({ id: img.id, url: e.target?.result });
          };
          reader.onerror = () => resolve({ id: img.id, url: null });
          reader.readAsDataURL(file);
        });
      }
      return Promise.resolve({ id: img.id, url: img.resolvedUrl });
    });

    Promise.all(promises).then((results) => {
      const resMap = new Map(results.map((r) => [r.id, r.url]));
      setDetectedImages((prev) =>
        prev.map((item) => ({
          ...item,
          resolvedUrl: resMap.get(item.id) || item.resolvedUrl,
        }))
      );
    });
  };

  const applyResolvedImagesToBooks = () => {
    const urlMap = new Map();
    detectedImages.forEach((img) => {
      if (img.resolvedUrl) {
        urlMap.set(img.filename.toLowerCase(), img.resolvedUrl);
        urlMap.set(img.path, img.resolvedUrl);
      }
    });

    if (urlMap.size > 0 && validationResult?.parsedBooks) {
      validationResult.parsedBooks.forEach((book) => {
        (book.nodes || []).forEach((node) => {
          // 1. PageBlocks
          (node.extra?.pageBlocks || []).forEach((block) => {
            if (block.imageUrl) {
              const fname = block.imageUrl.split("/").pop().split("\\").pop().toLowerCase();
              if (urlMap.has(fname)) block.imageUrl = urlMap.get(fname);
              else if (urlMap.has(block.imageUrl)) block.imageUrl = urlMap.get(block.imageUrl);
            }
            if (block.src && block.kind === "image") {
              const fname = block.src.split("/").pop().split("\\").pop().toLowerCase();
              if (urlMap.has(fname)) block.src = urlMap.get(fname);
              else if (urlMap.has(block.src)) block.src = urlMap.get(block.src);
            }
          });
          // 2. Cards
          (node.extra?.cards || []).forEach((card) => {
            if (card.image) {
              const fname = card.image.split("/").pop().split("\\").pop().toLowerCase();
              if (urlMap.has(fname)) card.image = urlMap.get(fname);
              else if (urlMap.has(card.image)) card.image = urlMap.get(card.image);
            }
          });
          // 3. Questions
          (node.extra?.questions || []).forEach((q) => {
            if (q.image) {
              const fname = q.image.split("/").pop().split("\\").pop().toLowerCase();
              if (urlMap.has(fname)) q.image = urlMap.get(fname);
            }
            if (q.ar?.image) {
              const fname = q.ar.image.split("/").pop().split("\\").pop().toLowerCase();
              if (urlMap.has(fname)) q.ar.image = urlMap.get(fname);
            }
            if (q.en?.image) {
              const fname = q.en.image.split("/").pop().split("\\").pop().toLowerCase();
              if (urlMap.has(fname)) q.en.image = urlMap.get(fname);
            }
          });
        });
      });
    }
  };

  const handleExecuteImport = () => {
    if (!validationResult || !validationResult.valid) return;

    // Apply any resolved images
    applyResolvedImagesToBooks();

    let finalBooks = [...existingBooks];
    let finalCollections = [...existingCollections];
    let targetBookId = null;

    const newlyImportedBooks = [];

    // Process books with conflict resolution
    validationResult.parsedBooks.forEach((importedBook) => {
      const isConflict = existingBooks.some((b) => b.id === importedBook.id);
      const choice = conflictChoices[importedBook.id] || "replace";

      let bookToAdd = { ...importedBook };

      if (isConflict) {
        if (choice === "replace") {
          finalBooks = finalBooks.map((b) => (b.id === bookToAdd.id ? bookToAdd : b));
        } else if (choice === "rename") {
          const newId = `${bookToAdd.id}-${Date.now().toString(36)}`;
          bookToAdd = {
            ...bookToAdd,
            id: newId,
            ar: { ...bookToAdd.ar, title: `${bookToAdd.ar?.title || ""} (نسخة)` },
            en: { ...bookToAdd.en, title: `${bookToAdd.en?.title || ""} (Copy)` }
          };
          finalBooks.push(bookToAdd);
        }
      } else {
        finalBooks.push(bookToAdd);
      }
      newlyImportedBooks.push(bookToAdd);
      if (!targetBookId) targetBookId = bookToAdd.id;
    });

    // Process collections
    validationResult.parsedCollections.forEach((importedCol) => {
      const isConflict = existingCollections.some((c) => c.id === importedCol.id);
      if (isConflict) {
        finalCollections = finalCollections.map((c) => (c.id === importedCol.id ? importedCol : c));
      } else {
        finalCollections.push(importedCol);
      }
    });

    onImportSuccess({
      books: finalBooks,
      collections: finalCollections,
      plans: validationResult.parsedPlans || null,
      targetBookId
    });

    setStep("success");
  };

  const copyErrors = () => {
    const errorList = (validationResult?.errors || []).join("\n");
    navigator.clipboard.writeText(errorList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setJsonText("");
    setFileName("");
    setValidationResult(null);
    setParseError(null);
    setDetectedImages([]);
    setFolderPathInput("");
    setStep("input");
  };

  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
  const resolvedImagesCount = detectedImages.filter((img) => img.resolvedUrl).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,16,10,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        dir={dir}
        className="educraft-modal-in w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 flex flex-col gap-5"
        style={{
          background: theme.surface,
          color: theme.ink,
          borderRadius: skin.radiusLg,
          border: `1.5px solid ${theme.hairline}`,
          boxShadow: skin.id === "pixel" ? skin.shadow : "0 24px 60px rgba(0,0,0,0.3)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b pb-4" style={{ borderColor: theme.hairline }}>
          <div className="flex items-center gap-3">
            <div
              className="grid place-items-center rounded-xl shrink-0"
              style={{ width: 40, height: 40, background: theme.accentSoft, color: theme.accent }}
            >
              <FileUp size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: ui.displayFont }}>
                {ui.importModalTitle || (lang === "ar" ? "استيراد JSON الذكي" : "Smart JSON Import")}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.inkSoft }}>
                {ui.importModalSub || (lang === "ar" ? "استيراد كتب، فروع، وموسوعات مطابقة لمعايير EDUcraft Data Schema" : "Import books, nodes, and encyclopedias conforming to EDUcraft Data Schema")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center rounded-lg shrink-0 transition-opacity hover:opacity-75 cursor-pointer"
            style={{ width: 32, height: 32, border: `1px solid ${theme.hairline}`, color: theme.ink }}
          >
            <X size={16} />
          </button>
        </div>

        {/* STEP 1: INPUT */}
        {step === "input" && (
          <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: theme.canvas, border: `1px solid ${theme.hairline}` }}>
              <button
                onClick={() => setTab("upload")}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold transition-all rounded-lg cursor-pointer"
                style={{
                  background: tab === "upload" ? theme.surface : "transparent",
                  color: tab === "upload" ? theme.accent : theme.inkSoft,
                  boxShadow: tab === "upload" ? "0 2px 8px rgba(0,0,0,0.06)" : "none"
                }}
              >
                <FileUp size={14} />
                {ui.importTabUpload || (lang === "ar" ? "رفع ملف .json" : "Upload .json")}
              </button>
              <button
                onClick={() => setTab("paste")}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold transition-all rounded-lg cursor-pointer"
                style={{
                  background: tab === "paste" ? theme.surface : "transparent",
                  color: tab === "paste" ? theme.accent : theme.inkSoft,
                  boxShadow: tab === "paste" ? "0 2px 8px rgba(0,0,0,0.06)" : "none"
                }}
              >
                <FileText size={14} />
                {ui.importTabPaste || (lang === "ar" ? "لصق نص JSON" : "Paste JSON Text")}
              </button>
            </div>

            {/* Upload Zone */}
            {tab === "upload" && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-colors"
                style={{ borderColor: theme.hairline, background: theme.canvas }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="grid place-items-center w-12 h-12 rounded-full" style={{ background: theme.accentSoft, color: theme.accent }}>
                  <FileUp size={22} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">{fileName ? fileName : (ui.importDropzone || (lang === "ar" ? "اضغط هنا لاختيار ملف .json" : "Click to select a .json file"))}</p>
                  <p className="text-xs mt-1" style={{ color: theme.inkSoft }}>
                    {lang === "ar" ? "يدعم الكتب المفردة، الموسوعات، وباقات المكتبة الكاملة" : "Supports single books, encyclopedias, and master library bundles"}
                  </p>
                </div>
              </div>
            )}

            {/* Paste Area */}
            {tab === "paste" && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={ui.importPastePlaceholder || (lang === "ar" ? "الصق كود الـ JSON هنا..." : "Paste your raw JSON content here...")}
                  rows={8}
                  dir="ltr"
                  className="w-full p-3 font-mono text-xs rounded-xl outline-none focus:ring-2"
                  style={{
                    background: theme.canvas,
                    color: theme.ink,
                    border: `1px solid ${theme.hairline}`,
                    lineHeight: 1.6
                  }}
                />
                <button
                  onClick={handleManualValidate}
                  disabled={!jsonText.trim()}
                  className="self-end px-5 py-2.5 text-xs font-bold text-white rounded-lg disabled:opacity-40 cursor-pointer"
                  style={{ background: theme.accent }}
                >
                  {ui.importValidateBtn || (lang === "ar" ? "فحص ومعاينة" : "Validate & Preview")}
                </button>
              </div>
            )}

            {/* Parse Error Notification */}
            {parseError && (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertCircle size={16} />
                  <span>{lang === "ar" ? "خطأ في تركيب الـ JSON (Syntax Error)" : "JSON Syntax Error"}</span>
                </div>
                <p className="text-xs font-mono">{parseError.message}</p>
                {parseError.line && (
                  <p className="text-xs font-bold mt-1">
                    {lang === "ar" ? `السطر: ${parseError.line}، العمود: ${parseError.col}` : `Line: ${parseError.line}, Column: ${parseError.col}`}
                  </p>
                )}
              </div>
            )}

            {/* Schema Validation Errors */}
            {validationResult && !validationResult.valid && (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertCircle size={16} />
                    <span>{ui.importErrorsTitle || (lang === "ar" ? `أخطاء الفحص (${validationResult.errors.length})` : `Validation Errors (${validationResult.errors.length})`)}</span>
                  </div>
                  <button
                    onClick={copyErrors}
                    className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/20 cursor-pointer"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? (lang === "ar" ? "تم النسخ" : "Copied") : (lang === "ar" ? "نسخ الأخطاء" : "Copy Errors")}
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto flex flex-col gap-1 text-xs font-mono leading-relaxed">
                  {validationResult.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="opacity-60">{i + 1}.</span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 (OPTIONAL): IMAGES & ASSET FOLDER LINKING */}
        {step === "images" && (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                <ImageIcon size={18} className="shrink-0" />
                <span>
                  {lang === "ar"
                    ? `تم اكتشاف ${detectedImages.length} صورة مشار إليها داخل هذا الكتاب`
                    : `Detected ${detectedImages.length} image references in this book`}
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20">
                {resolvedImagesCount}/{detectedImages.length} {lang === "ar" ? "تم الربط" : "linked"}
              </span>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: theme.inkSoft }}>
              {lang === "ar"
                ? "حدد مجلد الصور على جهازك أو اختر ملفات الصور مباشرة لمطابقة وتضمين الصور فورياً دون روابط مكسورة:"
                : "Select the images directory on your device or pick image files to match and embed them immediately:"}
            </p>

            {/* Folder & Files Picker Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <input
                ref={folderInputRef}
                type="file"
                webkitdirectory=""
                directory=""
                multiple
                onChange={(e) => handleImageFilesLoaded(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer transition-transform hover:scale-[1.02]"
                style={{ background: theme.accent }}
              >
                <FolderOpen size={15} />
                <span>{lang === "ar" ? "تحديد مجلد الصور (Folder)" : "Select Images Folder"}</span>
              </button>

              <input
                ref={filesInputRef}
                type="file"
                multiple
                accept="image/*,.svg"
                onChange={(e) => handleImageFilesLoaded(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => filesInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: theme.hairline, color: theme.ink }}
              >
                <UploadCloud size={15} />
                <span>{lang === "ar" ? "اختيار ملفات الصور يدوياً" : "Select Image Files"}</span>
              </button>
            </div>

            {/* Images Table / List */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto border rounded-xl p-2" style={{ background: theme.canvas, borderColor: theme.hairline }}>
              {detectedImages.map((img) => (
                <div
                  key={img.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg border text-xs"
                  style={{
                    background: theme.surface,
                    borderColor: img.resolvedUrl ? "rgba(16,185,129,0.3)" : theme.hairline,
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {img.resolvedUrl ? (
                      <img
                        src={img.resolvedUrl}
                        alt={img.filename}
                        className="w-8 h-8 rounded object-cover border shrink-0"
                        style={{ borderColor: theme.hairline }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded grid place-items-center bg-black/5 dark:bg-white/5 shrink-0 opacity-60">
                        <ImageIcon size={14} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-bold block truncate" style={{ color: theme.ink }}>
                        {img.filename}
                      </span>
                      <span className="text-[10px] block truncate" style={{ color: theme.inkSoft }}>
                        {img.location} • <span className="font-mono">{img.path}</span>
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      img.resolvedUrl
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {img.resolvedUrl ? (lang === "ar" ? "✅ تم الربط" : "Linked") : (lang === "ar" ? "⏳ بانتظار الملف" : "Pending")}
                  </span>
                </div>
              ))}
            </div>

            {/* Image step navigation */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: theme.hairline }}>
              <button
                type="button"
                onClick={() => setStep("input")}
                className="px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer"
                style={{ borderColor: theme.hairline, color: theme.ink }}
              >
                {lang === "ar" ? "رجوع" : "Back"}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep("preview")}
                  className="px-4 py-2 text-xs font-bold rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
                  style={{ color: theme.inkSoft }}
                >
                  {lang === "ar" ? "تخطي بدون صور" : "Skip without images"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyResolvedImagesToBooks();
                    setStep("preview");
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white rounded-lg cursor-pointer"
                  style={{ background: theme.accent }}
                >
                  <span>{lang === "ar" ? "متابعة للمعاينة" : "Continue to Preview"}</span>
                  <ArrowIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW & CONFLICT RESOLUTION */}
        {step === "preview" && validationResult && (
          <div className="flex flex-col gap-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: theme.accentSoft, color: theme.accent }}>
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 size={16} />
                <span>{ui.importPreviewTitle || (lang === "ar" ? "تم الفحص بنجاح — معاينة البيانات" : "Validated Successfully — Data Preview")}</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full" style={{ background: theme.surface, color: theme.accent }}>
                {validationResult.type}
              </span>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border flex flex-col" style={{ background: theme.canvas, borderColor: theme.hairline }}>
                <span className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>{lang === "ar" ? "الكتب" : "Books"}</span>
                <span className="text-lg font-black mt-0.5">{validationResult.totalStats.booksCount}</span>
              </div>
              <div className="p-3 rounded-xl border flex flex-col" style={{ background: theme.canvas, borderColor: theme.hairline }}>
                <span className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>{lang === "ar" ? "الأوراق" : "Leaves"}</span>
                <span className="text-lg font-black mt-0.5">{validationResult.totalStats.leavesCount}</span>
              </div>
              <div className="p-3 rounded-xl border flex flex-col" style={{ background: theme.canvas, borderColor: theme.hairline }}>
                <span className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>{lang === "ar" ? "الأسئلة" : "Questions"}</span>
                <span className="text-lg font-black mt-0.5">{validationResult.totalStats.questionsCount}</span>
              </div>
              <div className="p-3 rounded-xl border flex flex-col" style={{ background: theme.canvas, borderColor: theme.hairline }}>
                <span className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>{lang === "ar" ? "صفحات A4" : "Page Blocks"}</span>
                <span className="text-lg font-black mt-0.5">{validationResult.totalStats.pageBlocksCount}</span>
              </div>
            </div>

            {/* List of Books to Import */}
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {validationResult.parsedBooks.map((b) => {
                const isConflict = existingBooks.some((ex) => ex.id === b.id);
                return (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl border flex flex-col gap-2"
                    style={{ background: theme.canvas, borderColor: isConflict ? theme.accent : theme.hairline }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} color={b.cover?.from || theme.accent} />
                        <span className="text-xs font-bold">{b.ar?.title || b.en?.title || b.id}</span>
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: theme.inkSoft }}>ID: {b.id}</span>
                    </div>

                    {/* Conflict Handler */}
                    {isConflict && (
                      <div className="mt-1 pt-2 border-t flex flex-col gap-1.5" style={{ borderColor: theme.hairline }}>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: theme.accent }}>
                          <AlertTriangle size={13} />
                          <span>{ui.importConflictTitle || (lang === "ar" ? "الكتاب موجود بالفعل في مكتبتك" : "Book ID already exists")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`conflict-${b.id}`}
                              checked={conflictChoices[b.id] === "replace"}
                              onChange={() => setConflictChoices((prev) => ({ ...prev, [b.id]: "replace" }))}
                            />
                            <span>{ui.importConflictReplace || (lang === "ar" ? "استبدال الموجود" : "Replace existing")}</span>
                          </label>
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`conflict-${b.id}`}
                              checked={conflictChoices[b.id] === "rename"}
                              onChange={() => setConflictChoices((prev) => ({ ...prev, [b.id]: "rename" }))}
                            />
                            <span>{ui.importConflictRename || (lang === "ar" ? "استيراد كنسخة جديدة" : "Import as new copy")}</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: theme.hairline }}>
              <button
                onClick={() => setStep(detectedImages.length > 0 ? "images" : "input")}
                className="px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer"
                style={{ borderColor: theme.hairline, color: theme.ink }}
              >
                {lang === "ar" ? "رجوع" : "Back"}
              </button>
              <button
                onClick={handleExecuteImport}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-lg shadow-md cursor-pointer"
                style={{ background: theme.accent }}
              >
                <CheckCircle2 size={14} />
                <span>{ui.importConfirmBtn || (lang === "ar" ? "تأكيد واستيراد إلى المكتبة" : "Confirm & Import to Library")}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
            <div className="grid place-items-center w-14 h-14 rounded-full" style={{ background: theme.accentSoft, color: theme.accent }}>
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{ui.importSuccessTitle || (lang === "ar" ? "تم الاستيراد بنجاح!" : "Import Successful!")}</h3>
              <p className="text-xs mt-1 max-w-sm" style={{ color: theme.inkSoft }}>
                {ui.importSuccessDesc || (lang === "ar" ? "تم التحقق من صحة كافة الفروع والأسئلة والصفحات وحفظها في مكتبتك بنجاح." : "All branches, questions, and pages have been validated and saved to your library.")}
              </p>
            </div>
            <button
              onClick={() => {
                resetAll();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-lg mt-2 cursor-pointer"
              style={{ background: theme.accent }}
            >
              <span>{ui.importDoneBtn || (lang === "ar" ? "عرض المكتبة الآن" : "Open Library Now")}</span>
              <ArrowIcon size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
