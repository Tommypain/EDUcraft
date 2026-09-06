import React, { useState, useMemo, useEffect, useRef, Component } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Library,
  GitBranch,
  Settings,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Languages,
  CircleDot,
  CheckSquare,
  ToggleLeft,
  Type as TypeIcon,
  PenLine,
  TextCursorInput,
  Blocks,
  ArrowLeftRight,
  ListOrdered,
  LayoutGrid,
  Hash,
  Star,
  SlidersHorizontal,
  Check,
  CheckCircle2,
  X,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Layers,
  Palette,
  Pencil,
  Upload,
  FileUp,
  FileDown,
  FileText,
  ImagePlus,
  Folder,
  FolderOpen,
  FolderPlus,
  Folders,
  FolderInput,
  Home,
  Database,
  BookCopy,
  Plus,
  PlusCircle,
  Volume2,
  Trash2,
  Rows3,
  Columns3,
  Sparkles,
  Grid3x3,
  LayoutList,
  Trophy,
  Flame,
  ListFilter,
  ImageOff,
  CalendarDays,
  ListChecks,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Heading2,
  Tag,
  StickyNote,
  AlertTriangle,
  AlertCircle,
  Code2,
  CornerDownLeft,
  Wand2,
  Table as TableIcon,
  AlignLeft,
  Image as ImageIcon,
  Search,
  Printer,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ImportModal } from "./utils/ImportModal.jsx";
import { TitaniumPluginsModal } from "./utils/TitaniumPluginsModal.jsx";
import { SyntaxCodeBlock, LiveCodeEditor } from "./utils/syntax.jsx";
import { KnowledgeTreeEnhanced } from "./utils/KnowledgeTree.jsx";
import masterLibraryData from "./data/educraft_master_library.json";

/* =================================================================
   THEME — one warm system shared by every screen. Untouched from
   the original brief; question-type colors below are untouchable.
================================================================== */
/* =================================================================
   FLAVORS — color palettes ("tastes") the reader can pick in
   Settings, independent of skin (shape) and independent of the
   light/dark toggle: every flavor ships both a light and a dark
   variant so day/night mode keeps working no matter which flavor
   is active. "normal" is the original warm-paper palette; the rest
   are alternate moods curated from color-palette references.
================================================================== */
const FLAVORS = {
  normal: {
    en: "Normal",
    ar: "عادي",
    light: {
      canvas: "#F3EAD9",
      header: "#DCE9DC",
      surface: "#FFFDFB",
      surfaceSoft: "#F8F2E6",
      ink: "#241B13",
      inkSoft: "#6B5D4F",
      hairline: "rgba(36,27,19,0.10)",
      hairlineStrong: "rgba(36,27,19,0.18)",
      accent: "#E8654A",
      accentHover: "#D2543C",
      accentInk: "#FFFDFB",
      accentSoft: "rgba(232,101,74,0.12)",
    },
    dark: {
      canvas: "#17130F",
      header: "#1D2420",
      surface: "#231C16",
      surfaceSoft: "#2A2119",
      ink: "#F3E9DA",
      inkSoft: "rgba(243,233,217,0.62)",
      hairline: "rgba(243,233,217,0.12)",
      hairlineStrong: "rgba(243,233,217,0.22)",
      accent: "#E8654A",
      accentHover: "#F3785D",
      accentInk: "#1D120C",
      accentSoft: "rgba(232,101,74,0.16)",
    },
  },
  inkteal: {
    en: "Ink & Teal",
    ar: "حبر وتركواز",
    light: {
      canvas: "#EAFBFA", header: "#CFF3EF", surface: "#FFFFFF", surfaceSoft: "#E3F7F4",
      ink: "#06232A", inkSoft: "rgba(6,35,42,0.62)", hairline: "rgba(6,35,42,0.10)", hairlineStrong: "rgba(6,35,42,0.18)",
      accent: "#0E7C79", accentHover: "#0A6663", accentInk: "#FFFFFF", accentSoft: "rgba(14,124,121,0.14)",
    },
    dark: {
      canvas: "#011627", header: "#0A2036", surface: "#0F2A42", surfaceSoft: "#132F49",
      ink: "#FDFFFC", inkSoft: "rgba(253,255,252,0.62)", hairline: "rgba(253,255,252,0.12)", hairlineStrong: "rgba(253,255,252,0.22)",
      accent: "#41EAD4", accentHover: "#35CDB9", accentInk: "#011627", accentSoft: "rgba(65,234,212,0.18)",
    },
  },
  sunsetplum: {
    en: "Sunset Plum",
    ar: "برقوق الغروب",
    light: {
      canvas: "#FBF1E6", header: "#F3DEC0", surface: "#FFFFFF", surfaceSoft: "#F7E7D2",
      ink: "#2B0F0A", inkSoft: "rgba(43,15,10,0.62)", hairline: "rgba(43,15,10,0.10)", hairlineStrong: "rgba(43,15,10,0.18)",
      accent: "#FE5917", accentHover: "#E14C10", accentInk: "#FFFFFF", accentSoft: "rgba(254,89,23,0.14)",
    },
    dark: {
      canvas: "#1A0503", header: "#2B0F14", surface: "#241009", surfaceSoft: "#2E140D",
      ink: "#E3D3AE", inkSoft: "rgba(227,211,174,0.62)", hairline: "rgba(227,211,174,0.12)", hairlineStrong: "rgba(227,211,174,0.22)",
      accent: "#FE5917", accentHover: "#FF7738", accentInk: "#1A0503", accentSoft: "rgba(254,89,23,0.20)",
    },
  },
  skymint: {
    en: "Sky Mint",
    ar: "نعناع سماوي",
    light: {
      canvas: "#F1FFE7", header: "#C2E7DA", surface: "#FFFFFF", surfaceSoft: "#E9F5EA",
      ink: "#1A1B41", inkSoft: "rgba(26,27,65,0.62)", hairline: "rgba(26,27,65,0.10)", hairlineStrong: "rgba(26,27,65,0.18)",
      accent: "#6290C3", accentHover: "#4E77A8", accentInk: "#FFFFFF", accentSoft: "rgba(98,144,195,0.14)",
    },
    dark: {
      canvas: "#10112B", header: "#1A1B41", surface: "#171840", surfaceSoft: "#1D1E4A",
      ink: "#F1FFE7", inkSoft: "rgba(241,255,231,0.62)", hairline: "rgba(241,255,231,0.12)", hairlineStrong: "rgba(241,255,231,0.22)",
      accent: "#6EA6DE", accentHover: "#86B7E6", accentInk: "#10112B", accentSoft: "rgba(110,166,222,0.20)",
    },
  },
  amberdusk: {
    en: "Amber Dusk",
    ar: "كهرمان الغسق",
    light: {
      canvas: "#F3F5F7", header: "#E4E9ED", surface: "#FFFFFF", surfaceSoft: "#EAEDF0",
      ink: "#032539", inkSoft: "rgba(3,37,57,0.62)", hairline: "rgba(3,37,57,0.10)", hairlineStrong: "rgba(3,37,57,0.18)",
      accent: "#D98A4F", accentHover: "#C1763F", accentInk: "#FFFFFF", accentSoft: "rgba(217,138,79,0.14)",
    },
    dark: {
      canvas: "#032539", header: "#0D3350", surface: "#0A2E47", surfaceSoft: "#0F3A57",
      ink: "#E4E9ED", inkSoft: "rgba(228,233,237,0.62)", hairline: "rgba(228,233,237,0.12)", hairlineStrong: "rgba(228,233,237,0.22)",
      accent: "#F1AA6F", accentHover: "#F5BC8C", accentInk: "#032539", accentSoft: "rgba(241,170,111,0.20)",
    },
  },
  papayacaramel: {
    en: "Papaya Caramel",
    ar: "كراميل بابايا",
    light: {
      canvas: "#FDECD8", header: "#F7DCC0", surface: "#FFFFFF", surfaceSoft: "#FCE4CD",
      ink: "#4A2E12", inkSoft: "rgba(74,46,18,0.62)", hairline: "rgba(74,46,18,0.10)", hairlineStrong: "rgba(74,46,18,0.18)",
      accent: "#BF7E46", accentHover: "#A76B39", accentInk: "#FFFFFF", accentSoft: "rgba(191,126,70,0.14)",
    },
    dark: {
      canvas: "#241505", header: "#35200C", surface: "#2C1908", surfaceSoft: "#33200D",
      ink: "#FDECD8", inkSoft: "rgba(253,236,216,0.62)", hairline: "rgba(253,236,216,0.12)", hairlineStrong: "rgba(253,236,216,0.22)",
      accent: "#E0A867", accentHover: "#EAB87F", accentInk: "#241505", accentSoft: "rgba(224,168,103,0.20)",
    },
  },
  wasabijade: {
    en: "Wasabi Jade",
    ar: "واسابي وجيد",
    light: {
      canvas: "#F4FAF0", header: "#D7EFFF", surface: "#FFFFFF", surfaceSoft: "#EAF3E4",
      ink: "#26301E", inkSoft: "rgba(38,48,30,0.62)", hairline: "rgba(38,48,30,0.10)", hairlineStrong: "rgba(38,48,30,0.18)",
      accent: "#A9BC1E", accentHover: "#93A419", accentInk: "#FFFFFF", accentSoft: "rgba(169,188,30,0.16)",
    },
    dark: {
      canvas: "#14170F", header: "#1C2015", surface: "#1A1D13", surfaceSoft: "#202417",
      ink: "#EAF3E4", inkSoft: "rgba(234,243,228,0.62)", hairline: "rgba(234,243,228,0.12)", hairlineStrong: "rgba(234,243,228,0.22)",
      accent: "#E9F056", accentHover: "#F1F87A", accentInk: "#14170F", accentSoft: "rgba(233,240,86,0.20)",
    },
  },
};

/* =================================================================
   SKINS — three interchangeable "shape languages" layered on top of
   THEME's colors. Switching skin never touches a color token above
   (and never touches the untouchable question-type palette below);
   it only changes radius / border / shadow / blur / type so the
   same data can look "normal", "liquid glass", or "pixel art".
================================================================== */
const SKINS = {
  normal: {
    id: "normal",
    radiusLg: 20,
    radiusMd: 16,
    radiusSm: 9999,
    border: "1px solid",
    borderW: 1,
    shadow: "none",
    blur: "none",
    surfaceAlpha: 1,
    pixel: false,
    displayFontOverride: null,
    letterSpacing: "normal",
  },
  glass: {
    id: "glass",
    radiusLg: 28,
    radiusMd: 20,
    radiusSm: 9999,
    border: "1px solid",
    borderW: 1,
    shadow: "0 12px 40px rgba(20,20,30,0.14)",
    blur: "blur(18px) saturate(180%)",
    surfaceAlpha: 0.55,
    pixel: false,
    displayFontOverride: null,
    letterSpacing: "normal",
  },
  pixel: {
    id: "pixel",
    radiusLg: 0,
    radiusMd: 0,
    radiusSm: 0,
    border: "3px solid",
    borderW: 3,
    shadow: "5px 5px 0 0 rgba(0,0,0,0.85)",
    blur: "none",
    surfaceAlpha: 1,
    pixel: true,
    displayFontOverride: "'Press Start 2P', 'Space Mono', monospace",
    letterSpacing: "0.02em",
  },
};

/* Border color used by glass/pixel where THEME.hairline is too faint
   (glass wants a bright hairline over blur; pixel wants pure ink). */
function skinBorderColor(skin, theme) {
  if (skin.id === "glass") return theme.hairlineStrong;
  if (skin.id === "pixel") return theme.ink;
  return theme.hairline;
}
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function skinSurface(skin, theme, soft) {
  const base = soft ? theme.surfaceSoft : theme.surface;
  if (skin.surfaceAlpha >= 1) return base;
  // hex or rgb -> translucent surface for the glass skin
  const hex = base.replace("#", "");
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${skin.surfaceAlpha})`;
  }
  return base;
}
/* Shared panel style — feed this to any container (header, card,
   modal, tree panel, deck shell...) so it re-skins automatically. */
function panelStyle(skin, theme, { soft = false, radius = "lg" } = {}) {
  const r = radius === "sm" ? skin.radiusSm : radius === "md" ? skin.radiusMd : skin.radiusLg;
  return {
    background: skinSurface(skin, theme, soft),
    borderRadius: r,
    border: `${skin.border.split(" ")[0]} solid ${skinBorderColor(skin, theme)}`,
    boxShadow: skin.shadow,
    backdropFilter: skin.blur,
    WebkitBackdropFilter: skin.blur,
  };
}

/* =================================================================
   Question-type palette — ported verbatim from the legacy book
   engine. Thirteen types, one color each. Do not restyle these.
================================================================== */
const CORRECT = { bg: "#9BE8C4", border: "#0B2318" };
const INCORRECT = { bg: "#FFD9CE", border: "#7A2A12" };
const ESSAY_BOX = { bg: "#F1F0FF", border: "#B7C3FF", ink: "#10112B" };

const TYPE_META = {
  single: { color: { bg: "#E4FF6E", ink: "#15170B" }, Icon: CircleDot, en: "Single choice", ar: "اختيار واحد" },
  multi: { color: { bg: "#FF8A5B", ink: "#241007" }, Icon: CheckSquare, en: "Multi select", ar: "اختيار متعدد" },
  tf: { color: { bg: "#9BE8C4", ink: "#0B2318" }, Icon: ToggleLeft, en: "True / False", ar: "صح / غلط" },
  short: { color: { bg: "#B7C3FF", ink: "#10112B" }, Icon: TypeIcon, en: "Short answer", ar: "إجابة قصيرة" },
  essay: { color: { bg: "#FFCF5C", ink: "#231a05" }, Icon: PenLine, en: "Essay", ar: "مقالي" },
  fill: { color: { bg: "#FF9ECF", ink: "#2b0a1c" }, Icon: TextCursorInput, en: "Fill the blank", ar: "أكمل الفراغ" },
  cloze: { color: { bg: "#C4B5FD", ink: "#20123A" }, Icon: Blocks, en: "Word bank", ar: "بنك كلمات" },
  match: { color: { bg: "#6EE7B7", ink: "#062B1D" }, Icon: ArrowLeftRight, en: "Matching", ar: "توصيل" },
  order: { color: { bg: "#FDBA74", ink: "#361603" }, Icon: ListOrdered, en: "Ordering", ar: "ترتيب" },
  sort: { color: { bg: "#93C5FD", ink: "#08214D" }, Icon: LayoutGrid, en: "Categorize", ar: "تصنيف" },
  numeric: { color: { bg: "#F472B6", ink: "#380620" }, Icon: Hash, en: "Numeric", ar: "رقمي" },
  rating: { color: { bg: "#FCD34D", ink: "#332200" }, Icon: Star, en: "Self-rating", ar: "تقييم ذاتي" },
  slider: { color: { bg: "#A7F3D0", ink: "#042F1A" }, Icon: SlidersHorizontal, en: "Slider", ar: "شريط تمرير" },
};

const DIFF = {
  en: { Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced", Reflection: "Reflection" },
  ar: { Beginner: "مبتدئ", Intermediate: "متوسط", Advanced: "متقدم", Reflection: "تأمّل" },
};
const TIER = {
  en: { core: "core", extra: "extra", advanced: "advanced tier" },
  ar: { core: "أساسي", extra: "إضافي", advanced: "مستوى متقدم" },
};

/* =================================================================
   Chrome copy — brand strings, nav, and every label that lives
   outside the question engine itself.
================================================================== */
const UI = {
  en: {
    dir: "ltr",
    htmlLang: "en",
    displayFont: "'Space Mono', ui-monospace, monospace",
    bodyFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    brand: "EDUcraft",
    langToggle: "AR",
    navLibrary: "Books",
    navTree: "Tree",
    navEditor: "Editor",
    editorSoon: "Editor — coming soon",
    libraryKicker: "Your library",
    libraryTitle: "Every book grows its own tree.",
    librarySub: "Open a book to see its knowledge tree — branches split into smaller branches, and a few of them link straight across to one another.",
    branchesLabel: "branches",
    questionsLabel: "questions",
    openBook: "Open tree",
    backToLibrary: "Library",
    treeEyebrow: "Knowledge tree",
    treeSub: "Branches split into sub-branches, and a leaf sitting under one can still link straight to a leaf under another. Select a leaf to open its card.",
    legendBranch: "Branch",
    legendLink: "Cross-branch link",
    legendLeaf: "Leaf · tap to open",
    emptyHint: "Pick a highlighted leaf on the tree to open its question card.",
    deckOf: "of",
    deckQuestion: "Question",
    prev: "Previous",
    next: "Next",
    checkAnswer: "Check answer",
    tryAgain: "Try again",
    correctMsg: "Correct.",
    incorrectMsg: "Not quite.",
    revealModel: "Reveal model answer",
    hideModel: "Hide model answer",
    selfGraded: "Self-graded — no single correct answer.",
    accepted: "Accepted",
    bankHint: "Tap a word, then tap the blank to place it.",
    sortHint: "Tap a tag, then tap the bin it belongs in.",
    matchHint: "Tap a selector, then tap what it targets.",
    orderHint: "Use the arrows to put these in the right order.",
    multiCardBadge: (n) => `${n} questions`,
    navSettings: "Settings",
    settingsTitle: "Settings",
    settingsSub: "Personalize how EDUcraft looks and how question cards move.",
    settingsThemeLabel: "Theme",
    themeNormal: "Normal",
    themeNormalDesc: "Warm paper, soft rounded cards.",
    themeGlass: "Liquid glass",
    themeGlassDesc: "Frosted, translucent, floating panels.",
    themePixel: "Pixel art",
    themePixelDesc: "Blocky edges, hard shadows, retro type.",
    settingsCardModeLabel: "Question cards",
    cardModePaged: "Next / Previous",
    cardModePagedDesc: "Page through one question at a time.",
    cardModeScroll: "Scroll",
    cardModeScrollDesc: "All questions in one scrollable card.",
    settingsScrollDirLabel: "Scroll direction",
    scrollDirVertical: "Vertical",
    scrollDirVerticalDesc: "Stack cards above one another.",
    scrollDirHorizontal: "Horizontal",
    scrollDirHorizontalDesc: "Line cards up side by side.",
    coverEdit: "Change cover",
    coverReset: "Use default cover",
    settingsClose: "Close",
    settingsDataLabel: "Data",
    settingsDataSub: "Your progress, plans, covers, and preferences are saved on this device automatically.",
    exportDatabaseBackupLabel: "Export Full Backup",
    restoreDatabaseBackupLabel: "Restore Full Backup",
    exportDatabaseSuccess: "Database backup exported successfully!",
    restoreDatabaseSuccess: "Database restored successfully!",
    restoreDatabaseTitle: "Restore Database Backup",
    restoreModeReplace: "Full Replace (Clean slate & restore dump)",
    restoreModeMerge: "Merge (Add new & update existing)",
    restoreConfirmCta: "Restore Database Now",
    restoreConfirmWarning: "All books will be validated via the Rust engine before writing to disk.",
    exportOptionHtml: "Export as HTML",
    exportOptionJson: "Export as JSON",
    settingsResetLabel: "Reset everything",
    settingsResetConfirm: "This clears all saved progress, to-do/calendar plans, covers, and preferences on this device. This can't be undone. Continue?",
    browseCta: "Browse & practice all questions",
    browseTitle: "All questions",
    browseSub: "Every question in this book, in one place — filter by type, or just scroll.",
    readThroughCta: "Read through",
    readThroughLeafLabel: "Leaf",
    readThroughDone: "That's the whole book — nice work.",
    readThroughBackToTree: "Back to tree",
    scoreLabel: "Score",
    streakLabel: "Streak",
    completionLabel: "Completion",
    filterByType: "Filter by type",
    filterAll: "All",
    fromLeaf: "From",
    settingsFlavorLabel: "Taste",
    settingsFlavorSub: "The color mood — works with any of the themes above, in light or dark.",
    navPlanner: "Planner",
    plannerTitle: "Plan this book.",
    plannerSub: "Set a goal, check off leaves as you go, and see whether you're on pace",
    plannerNoGoalTitle: "No goal set yet",
    plannerNoGoalSub: "Pick a finish date and how much of the book you want done — we'll work out the daily pace for you.",
    plannerGoalDateLabel: "Finish by",
    plannerGoalCountLabel: "Leaves to finish",
    plannerSetGoal: "Set goal",
    plannerEditGoal: "Edit goal",
    plannerClearGoal: "Clear goal",
    plannerCancel: "Cancel",
    plannerTargetLabel: "Goal",
    plannerLeavesUnit: "leaves by",
    plannerStatusAhead: "Ahead of schedule",
    plannerStatusOnTrack: "On track",
    plannerStatusBehind: "Behind schedule",
    plannerStatusNoGoal: "Set a goal to track your status",
    plannerStatusDone: "Goal complete",
    plannerDaysLeft: "Days left",
    plannerRequiredPace: "Needed / day",
    plannerActualPace: "Your pace / day",
    plannerStreakLabel: "Day streak",
    plannerCompletionLabel: "Complete",
    plannerTodoTitle: "To-do",
    plannerTodoSub: "Check off leaves as you finish them — this feeds your calendar and pace above.",
    plannerCalendarTitle: "Activity calendar",
    plannerAllDone: "Every leaf in this book is checked off. Nice work.",
    treePlannerCta: "To-do & calendar",
    treeExportCta: "Export as HTML",
    exportToast: "Downloaded — open the file in any browser, it works fully offline.",
    libraryNewFolder: "New Folder",
    libraryNewEncyclopedia: "New Encyclopedia",
    libraryNewBook: "New Book",
    libraryNewItemBtn: "New",
    libraryCreateItemTitle: "Create New Item",
    libraryCreateBookTitle: "Create New Book",
    libraryCreateFolderTitle: "Create New Folder",
    libraryCreateEncyclopediaTitle: "Create New Encyclopedia",
    libraryMoveTo: "Move to…",
    libraryMoveItemSuccess: "Item moved successfully",
    libraryLocationLabel: "Save Inside",
    libraryTitleLabel: "Title",
    libraryTaglineLabel: "Description or Tagline",
    libraryCoverThemeLabel: "Cover Theme",
    libraryConfirmDeleteCollectionTitle: "Delete Collection",
    libraryConfirmDeleteCollectionBtn: "Delete Collection",
    collectionNamePromptFolder: "Name this folder",
    collectionNamePromptEncyclopedia: "Name this encyclopedia",
    libraryAddToFolder: "Add to…",
    libraryRemoveFromCollection: "Remove",
    libraryDeleteCollection: "Delete",
    libraryDeleteCollectionConfirm: "Delete this collection? The books and sub-items inside will return to the main library shelf.",
    libraryEmptyCollection: "Nothing in here yet. Use the New button or Move option on any book or item to place it here.",
    folderBadge: "Folder",
    encyclopediaBadge: "Encyclopedia",
    booksCountLabel: "books",
    libraryRootCrumb: "Library",
    libraryImportJson: "Import JSON",
    importModalTitle: "Smart JSON Import",
    importModalSub: "Import books, trees, and encyclopedias conforming to EDUcraft Data Schema.",
    importTabUpload: "Upload .json",
    importTabPaste: "Paste JSON",
    importDropzone: "Click or drag & drop a .json file here",
    importPastePlaceholder: "Paste raw JSON content here...",
    importValidateBtn: "Validate & Preview",
    importConfirmBtn: "Confirm & Import to Library",
    importErrorsTitle: "Validation Errors Found",
    importPreviewTitle: "Validated Successfully — Data Preview",
    importConflictTitle: "Book ID already exists in library",
    importConflictReplace: "Replace existing book",
    importConflictRename: "Import as new copy",
    importSuccessTitle: "Import Successful!",
    importSuccessDesc: "Content has been validated and imported into your library.",
    importDoneBtn: "Open Library",
    libraryDeleteBook: "Delete book",
    libraryDeleteBookConfirm: "Are you sure you want to delete this book completely along with all its questions, tree, and study plans? This action cannot be undone.",
    bookFlavorLabel: "Theme flavor",
    treeSearchPlaceholder: "Search branches or leaves…",
    treeFitView: "Fit to view",
    treeZoomIn: "Zoom in",
    treeZoomOut: "Zoom out",
    treeResetZoom: "Reset view",
    treeCollapseAll: "Collapse branches",
    treeExpandAll: "Expand all",
    treeSearchResults: "matching nodes",
    treeNoResults: "No matching nodes found",
    editorEmptyTitle: "No Book Selected",
    editorEmptySub: "Select an existing book from your library to edit, or create a brand new book from scratch.",
    treeEmptyTitle: "Knowledge Tree is Empty",
    treeEmptySub: "Select a book to explore its knowledge tree, or create a new book to build one.",
    plannerEmptyTitle: "Study Planner",
    plannerEmptySub: "Study plans and schedules are tracked per book. Select a book to view or manage its study plan, or create a new book.",
    createNewBookCta: "Create New Book",
    newBookPrompt: "Enter new book title:",
    quickSelectBook: "Or open an existing book:",
    addBranchBtn: "+ Add Branch",
    addLeafBtn: "+ Add Leaf",
    branchTitlePrompt: "Enter branch title:",
    leafTitlePrompt: "Enter leaf title:",
  },
  ar: {
    dir: "rtl",
    htmlLang: "ar",
    displayFont: "'Cairo', 'Tajawal', sans-serif",
    bodyFont: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
    brand: "EDUcraft",
    langToggle: "EN",
    navLibrary: "الكتب",
    navTree: "الشجرة",
    navEditor: "المحرر",
    editorSoon: "المحرر — قريبًا",
    libraryKicker: "مكتبتك",
    libraryTitle: "لكل كتاب شجرته الخاصة.",
    librarySub: "افتح كتاب عشان تشوف شجرة معرفته — الفروع بتتفرّع لفروع أصغر، وبعضها بيترابط مباشرة مع بعضه.",
    branchesLabel: "فروع",
    questionsLabel: "أسئلة",
    openBook: "افتح الشجرة",
    backToLibrary: "المكتبة",
    treeEyebrow: "شجرة المعرفة",
    treeSub: "الفروع بتتفرّع لفروع فرعية، وورقة تحت فرع معيّن ممكن تترابط مباشرة مع ورقة تحت فرع تاني. اختار ورقة عشان تفتح كارتها.",
    legendBranch: "فرع",
    legendLink: "رابط شبكي",
    legendLeaf: "ورقة · دوس تفتح",
    emptyHint: "اختار ورقة متلوّنة في الشجرة عشان تفتح كارت أسئلتها.",
    deckOf: "من",
    deckQuestion: "سؤال",
    prev: "السابق",
    next: "التالي",
    checkAnswer: "تحقق من الإجابة",
    tryAgain: "حاول تاني",
    correctMsg: "إجابة صح.",
    incorrectMsg: "مش تمام.",
    revealModel: "اظهر الإجابة النموذجية",
    hideModel: "اخفِ الإجابة النموذجية",
    selfGraded: "بيتقيّم ذاتيًا — مفيش إجابة واحدة صح.",
    accepted: "الإجابات المقبولة",
    bankHint: "دوس على كلمة، وبعدين دوس على الفراغ اللي هتحطها فيه.",
    sortHint: "دوس على الوسم، وبعدين دوس على الصندوق اللي بيتبعله.",
    matchHint: "دوس على الـ selector، وبعدين دوس على اللي بيستهدفه.",
    orderHint: "استخدم السهام عشان ترتبهم صح.",
    multiCardBadge: (n) => `${n} أسئلة`,
    navSettings: "الإعدادات",
    settingsTitle: "الإعدادات",
    settingsSub: "خصّص شكل EDUcraft وطريقة حركة كاردات الأسئلة.",
    settingsThemeLabel: "الثيم",
    themeNormal: "عادي",
    themeNormalDesc: "خلفية ورقية دافئة وكاردات ناعمة مدورة.",
    themeGlass: "زجاج شفاف",
    themeGlassDesc: "لوحات شفافة وضبابية عائمة.",
    themePixel: "بيكسل آرت",
    themePixelDesc: "حواف حادة وظل صلب وخط ريترو.",
    settingsCardModeLabel: "كاردات الأسئلة",
    cardModePaged: "التالي / السابق",
    cardModePagedDesc: "تقلّب بين الأسئلة سؤال سؤال.",
    cardModeScroll: "سكرول",
    cardModeScrollDesc: "كل الأسئلة جوا كارد واحد قابل للسكرول.",
    settingsScrollDirLabel: "اتجاه السكرول",
    scrollDirVertical: "رأسي",
    scrollDirVerticalDesc: "الكاردات فوق بعض.",
    scrollDirHorizontal: "أفقي",
    scrollDirHorizontalDesc: "الكاردات جنب بعض.",
    coverEdit: "غيّر الغلاف",
    coverReset: "رجّع الغلاف الافتراضي",
    settingsClose: "إغلاق",
    settingsDataLabel: "البيانات",
    settingsDataSub: "تقدمك وخططك (المهام والتقويم) والأغلفة وتفضيلاتك بتتحفظ أوتوماتيك على الجهاز ده.",
    exportDatabaseBackupLabel: "تصدير نسخة احتياطية كاملة",
    restoreDatabaseBackupLabel: "استيراد نسخة احتياطية كاملة",
    exportDatabaseSuccess: "تم تصدير النسخة الاحتياطية لقاعدة البيانات بنجاح!",
    restoreDatabaseSuccess: "تمت استعادة قاعدة البيانات بنجاح!",
    restoreDatabaseTitle: "استعادة نسخة احتياطية لقاعدة البيانات",
    restoreModeReplace: "استبدال كامل (مسح الحالي واستعادة النسخة)",
    restoreModeMerge: "دمج وإضافة (إضافة الجديد وتحديث القائم)",
    restoreConfirmCta: "استعادة قاعدة البيانات الآن",
    restoreConfirmWarning: "سيتم التحقق الصارم من صحة وسلامة كافة الكتب عبر محرك Rust قبل الكتابة على القرص.",
    exportOptionHtml: "تصدير كـ HTML",
    exportOptionJson: "تصدير كـ JSON",
    settingsResetLabel: "إعادة ضبط كل حاجة",
    settingsResetConfirm: "ده هيمسح كل التقدم المحفوظ، خطط المهام والتقويم، الأغلفة، والتفضيلات على الجهاز ده. مينفعش ترجع فيه. تكمل؟",
    browseCta: "تصفح وتدرّب على كل الأسئلة",
    browseTitle: "كل الأسئلة",
    readThroughCta: "اقرأ الكتاب كامل",
    readThroughLeafLabel: "ورقة",
    readThroughDone: "خلصت الكتاب كله — تسلم إيدك.",
    readThroughBackToTree: "ارجع للشجرة",
    browseSub: "كل سؤال في الكتاب ده في مكان واحد — فلتر حسب النوع، أو اسكرول عادي.",
    scoreLabel: "النتيجة",
    streakLabel: "التتابع",
    completionLabel: "نسبة الإنجاز",
    filterByType: "فلتر حسب النوع",
    filterAll: "الكل",
    fromLeaf: "من",
    settingsFlavorLabel: "النكهة",
    settingsFlavorSub: "مزاج الألوان — بتشتغل مع أي ثيم فوق، فاتح أو غامق.",
    navPlanner: "الخطة",
    plannerTitle: "خطّط للكتاب ده.",
    plannerSub: "حدّد هدف، اعلّم على الأوراق اللي بتخلّصها، وشوف ماشي على الخطة ولا لأ",
    plannerNoGoalTitle: "لسه مفيش هدف محدد",
    plannerNoGoalSub: "اختار تاريخ عايز تخلّص فيه، وقد ايه من الكتاب عايز تخلّصه — وإحنا هنحسبلك الوتيرة اليومية.",
    plannerGoalDateLabel: "تخلّص قبل",
    plannerGoalCountLabel: "عدد الأوراق اللي هتخلّصها",
    plannerSetGoal: "حدّد الهدف",
    plannerEditGoal: "عدّل الهدف",
    plannerClearGoal: "امسح الهدف",
    plannerCancel: "إلغاء",
    plannerTargetLabel: "الهدف",
    plannerLeavesUnit: "ورقة، تخلص قبل",
    plannerStatusAhead: "قدام الخطة",
    plannerStatusOnTrack: "ماشي زي ما اتفقنا",
    plannerStatusBehind: "متأخر عن الخطة",
    plannerStatusNoGoal: "حدّد هدف عشان تشوف أداءك",
    plannerStatusDone: "خلّصت الهدف",
    plannerDaysLeft: "الأيام المتبقية",
    plannerRequiredPace: "المطلوب / يوم",
    plannerActualPace: "وتيرتك / يوم",
    plannerStreakLabel: "أيام متتالية",
    plannerCompletionLabel: "نسبة الإنجاز",
    plannerTodoTitle: "قائمة المهام",
    plannerTodoSub: "علّم على كل ورقة تخلّصها — بتتحسب في التقويم وفي وتيرتك فوق.",
    plannerCalendarTitle: "تقويم النشاط",
    plannerAllDone: "خلّصت كل أوراق الكتاب ده. تسلم إيدك.",
    treePlannerCta: "المهام والتقويم",
    treeExportCta: "صدّر كملف HTML",
    libraryNewFolder: "مجلد جديد",
    libraryNewEncyclopedia: "موسوعة جديدة",
    libraryNewBook: "كتاب جديد",
    libraryNewItemBtn: "جديد",
    libraryCreateItemTitle: "إنشاء عنصر جديد",
    libraryCreateBookTitle: "إنشاء كتاب جديد",
    libraryCreateFolderTitle: "إنشاء مجلد جديد",
    libraryCreateEncyclopediaTitle: "إنشاء موسوعة جديدة",
    libraryMoveTo: "نقل إلى…",
    libraryMoveItemSuccess: "تم نقل العنصر بنجاح",
    libraryLocationLabel: "الموقع / الحفظ داخل",
    libraryTitleLabel: "العنوان",
    libraryTaglineLabel: "الوصف أو النبذة المختصرة",
    libraryCoverThemeLabel: "سمة الغلاف",
    libraryConfirmDeleteCollectionTitle: "حذف المجلد / الموسوعة",
    libraryConfirmDeleteCollectionBtn: "تأكيد الحذف",
    collectionNamePromptFolder: "اسم المجلد",
    collectionNamePromptEncyclopedia: "اسم الموسوعة",
    libraryAddToFolder: "نقل إلى…",
    libraryRemoveFromCollection: "إزالة من هنا",
    libraryDeleteCollection: "حذف",
    libraryDeleteCollectionConfirm: "هل تريد حذف هذا المجلد/الموسوعة؟ الكتب والمجلدات الفرعية التي بداخلها ستعود إلى رف المكتبة الرئيسي ولن تُحذف.",
    libraryEmptyCollection: "لا يوجد أي محتوى هنا حالياً. استخدم زر \"جديد\" لإنشاء كتب بداخلها أو زر \"نقل\" لوضع محتويات هنا.",
    folderBadge: "مجلد",
    encyclopediaBadge: "موسوعة",
    booksCountLabel: "عناصر",
    libraryRootCrumb: "المكتبة",
    libraryImportJson: "استيراد JSON",
    importModalTitle: "استيراد JSON الذكي",
    importModalSub: "استيراد كتب، فروع، وموسوعات مطابقة لمعايير EDUcraft Data Schema.",
    importTabUpload: "رفع ملف .json",
    importTabPaste: "لصق نص JSON",
    importDropzone: "اضغط هنا لاختيار ملف .json أو اسحبه وأفلته",
    importPastePlaceholder: "الصق كود الـ JSON هنا...",
    importValidateBtn: "فحص ومعاينة",
    importConfirmBtn: "تأكيد واستيراد إلى المكتبة",
    importErrorsTitle: "أخطاء الفحص (يجب تصحيحها)",
    importPreviewTitle: "تم الفحص بنجاح — معاينة البيانات",
    importConflictTitle: "الكتاب موجود بالفعل في مكتبتك",
    importConflictReplace: "استبدال الموجود بالكامل",
    importConflictRename: "استيراد كنسخة جديدة",
    importSuccessTitle: "تم الاستيراد بنجاح!",
    importSuccessDesc: "تم التحقق من صحة كافة الفروع والأسئلة والصفحات وحفظها في مكتبتك بنجاح.",
    importDoneBtn: "عرض المكتبة الآن",
    libraryDeleteBook: "حذف الكتاب",
    libraryDeleteBookConfirm: "هل أنت متأكد من حذف هذا الكتاب بالكامل مع كافة أسئلته وشجرته وخطة مذاكرته؟ لا يمكن التراجع عن هذا الإجراء.",
    bookFlavorLabel: "نكهة ألوان الكتاب",
    treeSearchPlaceholder: "ابحث في الشجرة والفروع والأوراق…",
    treeFitView: "إعادة ضبط العرض",
    treeZoomIn: "تكبير",
    treeZoomOut: "تصغير",
    treeResetZoom: "إعادة الضبط",
    treeCollapseAll: "طي الفروع",
    treeExpandAll: "فتح الكل",
    treeSearchResults: "عناصر مطابقة",
    treeNoResults: "لا توجد نتائج مطابقة",
    editorEmptyTitle: "لا يوجد كتاب محدد حالياً",
    editorEmptySub: "اختر كتاباً موجوداً من مكتبتك لتعديله، أو أنشئ كتاباً جديداً فارغاً من الصفر.",
    treeEmptyTitle: "شجرة المعرفة فارغة",
    treeEmptySub: "اختر كتاباً لاستكشاف شجرة معرفته، أو أنشئ كتاباً جديداً لبنائها.",
    plannerEmptyTitle: "مخطط الدراسة والتقويم",
    plannerEmptySub: "جداول وخطط الدراسة ترتبط بكل كتاب على حدة. اختر كتاباً لعرض خطته الدراسية أو إدارتها، أو أنشئ كتاباً جديداً.",
    createNewBookCta: "إنشاء كتاب جديد",
    newBookPrompt: "أدخل عنوان الكتاب الجديد:",
    quickSelectBook: "أو افتح كتاباً موجوداً:",
    addBranchBtn: "+ فرع جديد",
    addLeafBtn: "+ ورقة جديدة",
    branchTitlePrompt: "أدخل عنوان الفرع الجديد:",
    leafTitlePrompt: "أدخل عنوان الورقة الجديدة:",
  },
};

/* =================================================================
   BOOKS — this is the merge point of the two source files.
   Each book has a cover, and a knowledge tree *inside* it. Tree
   nodes come in three levels (branch → sub-branch → leaf); a leaf
   holds one *or more* questions, rendered as one card the reader
   pages through. A few leaves cross-link into a parallel branch to
   show this is a network, not a strict hierarchy.
================================================================== */
const VB_W = 800;
const VB_H = 300;
const BRANCH_Y = 44;
const SUB_Y = 156;
const LEAF_Y = 262;

const BOOKS = masterLibraryData.books;

/* =================================================================
   Correctness check — mirrors the legacy engine's switch, unchanged.
================================================================== */
function isCorrect(q, c, value) {
  switch (q.type) {
    case "single":
      return value === c.correct;
    case "multi": {
      if (!Array.isArray(value) || !Array.isArray(c.correct)) return false;
      const numSort = (a, b) => a - b;
      return [...value].sort(numSort).join(",") === [...c.correct].sort(numSort).join(",");
    }
    case "tf":
      return value === c.correct;
    case "short": {
      const normalized = String(value || "").trim().toLowerCase();
      const accepted = Array.isArray(c.accepted) ? c.accepted.map((a) => String(a).trim().toLowerCase()) : [];
      return accepted.includes(normalized);
    }
    case "fill":
      if (!Array.isArray(value)) return false;
      return (c.blanks || []).every((b, i) => (value[i] || "").trim().toLowerCase() === String(b).toLowerCase());
    case "cloze":
      return value === c.correct;
    case "match":
      if (!Array.isArray(value)) return false;
      return (c.left || []).every((_, i) => value[i] === (c.correct || [])[i]);
    case "order":
      if (!Array.isArray(value)) return false;
      return (c.correct || []).every((v, i) => value[i] === v);
    case "sort":
      if (!Array.isArray(value)) return false;
      return (c.items || []).every((it, i) => value[i] === it[1]);
    case "numeric":
      return Math.abs(Number(value) - c.correct) <= (c.tolerance ?? 0);
    case "slider":
      return Math.abs(Number(value) - c.correct) <= (c.tolerance ?? 0);
    default:
      return null;
  }
}

/* =================================================================
   leafCards — turns a leaf's questions into the "bundle" cards a
   deck actually pages through. A leaf can define its own `cards`
   array explicitly (mixed-type bundles of any size, each with an
   optional image pinned top/left/right). Leaves that don't define
   `cards` fall back to one question per card (today's behavior),
   so nothing changes for a leaf until it opts into bundling.
================================================================== */
function leafCards(leaf) {
  if (!leaf) return [];
  if (leaf.cards) return leaf.cards;
  return (leaf.questions || []).map((q, i) => ({
    id: `${leaf.id}-auto-${i}`,
    image: (q.en && q.en.image) || (q.ar && q.ar.image) || q.image || null,
    imagePosition: "top",
    video: q.video || null,
    audio: q.audio || null,
    questions: [q],
  }));
}

/* =================================================================
   Planner helpers — goal/date math + a lightweight month-grid
   builder for the activity calendar. Plans live outside BOOKS
   (App-level state keyed by book id), same pattern as `covers`.
================================================================== */
function defaultPlan() {
  return { targetCount: null, targetDate: null, startDate: null, doneLeafIds: [], log: {} };
}
function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromDateStr(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function daysBetweenStr(a, b) {
  return Math.round((fromDateStr(b) - fromDateStr(a)) / 86400000);
}
function buildMonthMatrix(cursorDate) {
  const year = cursorDate.getFullYear();
  const month = cursorDate.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
function slugify(str) {
  return (
    (str || "book")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "") || "book"
  );
}
function faviconDataUri(cover, letter) {
  const from = (cover && cover.from) || "#E8654A";
  const to = (cover && cover.to) || "#F2C879";
  const L = (letter || "?").toString().slice(0, 1).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="43" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="white" text-anchor="middle">${L}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/* Resolves a folder/encyclopedia into the flat, deduplicated list of
   books it contains — a folder can hold encyclopedias which in turn
   hold books, so this walks one level of nesting recursively while
   guarding against accidental cycles. */
function resolveCollectionBooks(collection, collections, books, seen) {
  seen = seen || new Set();
  if (!collection || seen.has(collection.id)) return [];
  seen.add(collection.id);
  const out = [];
  const pushed = new Set();
  (collection.itemIds || []).forEach((id) => {
    const asBook = books.find((b) => b.id === id);
    if (asBook) {
      if (!pushed.has(asBook.id)) {
        pushed.add(asBook.id);
        out.push(asBook);
      }
      return;
    }
    const asCollection = collections.find((c) => c.id === id);
    if (asCollection) {
      resolveCollectionBooks(asCollection, collections, books, seen).forEach((b) => {
        if (!pushed.has(b.id)) {
          pushed.add(b.id);
          out.push(b);
        }
      });
    }
  });
  return out;
}

/* Resolves a folder/encyclopedia into every collection object in its
   subtree (itself plus nested folders/encyclopedias), so the exported
   file's Library can browse the same nested structure as the live app. */
function resolveCollectionSubtree(collection, collections, seen) {
  seen = seen || new Set();
  if (!collection || seen.has(collection.id)) return [];
  seen.add(collection.id);
  const out = [collection];
  (collection.itemIds || []).forEach((id) => {
    const sub = collections.find((c) => c.id === id);
    if (sub) out.push(...resolveCollectionSubtree(sub, collections, seen));
  });
  return out;
}

/* =================================================================
   Local persistence — settings, progress plans, covers, and
   folders/encyclopedias survive a refresh. Loaded once (lazily) at
   module scope so first paint already reflects saved state.
================================================================== */
/* When this file is running inside a file exported by downloadBookHTML /
   downloadCollectionHTML, window.__EDUCRAFT_EXPORT__ is set (by the tiny
   inline bootstrap script in the exported HTML) *before* this bundle runs,
   and carries the exact book(s)/collections to seed the app with instead
   of the built-in sample BOOKS — see buildExportPayload() below. Each
   export gets its own storage key so progress from different exported
   files (or the live app) never collides. */
function getExportSeed() {
  return typeof window !== "undefined" ? window.__EDUCRAFT_EXPORT__ || null : null;
}
const APP_STORAGE_KEY = (() => {
  const seed = getExportSeed();
  return seed ? "educraft-export-" + seed.id : "educraft-app-state-v1";
})();
function loadAppState() {
  if (typeof window === "undefined") return {};
  try {
    window.localStorage.removeItem("educraft_deleted_books");
    const raw = JSON.parse(window.localStorage.getItem(APP_STORAGE_KEY)) || {};
    return raw;
  } catch (e) {
    return {};
  }
}
function saveAppState(state) {
  if (typeof window === "undefined") return;
  try {
    const copy = { ...state };
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(copy));
  } catch (e) {}
}
function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
/* A collection is a folder (شنطة) or an encyclopedia (موسوعة). Folders
   can hold books and encyclopedias; encyclopedias hold only books —
   both are the same shape so the Library can render them uniformly. */
function parentCollectionOf(itemId, collections) {
  return (collections || []).find((c) => (c.itemIds || []).includes(itemId)) || null;
}
function isDescendantOf(candidateId, ancestorId, collections) {
  if (!candidateId || !ancestorId || candidateId === ancestorId) return false;
  const ancestor = (collections || []).find((c) => c.id === ancestorId);
  if (!ancestor || !ancestor.itemIds) return false;
  if (ancestor.itemIds.includes(candidateId)) return true;
  for (const childId of ancestor.itemIds) {
    if (isDescendantOf(candidateId, childId, collections)) return true;
  }
  return false;
}
function rootLibraryItems(collections, books) {
  const childIds = new Set((collections || []).flatMap((c) => c.itemIds || []));
  return {
    rootCollections: (collections || []).filter((c) => !childIds.has(c.id)),
    rootBooks: (books || []).filter((b) => !childIds.has(b.id)),
  };
}

/* =================================================================
   Shared bits
================================================================== */
function FeedbackBanner({ ok, ui, onRetry, skin = SKINS.normal }) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 border-2 px-4 py-3 text-sm font-semibold"
      style={{
        borderRadius: skin.radiusLg,
        ...(ok ? { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.border } : { background: INCORRECT.bg, borderColor: INCORRECT.border, color: INCORRECT.border }),
      }}
    >
      {ok ? <Check size={16} /> : <X size={16} />}
      <span className="flex-1">{ok ? ui.correctMsg : ui.incorrectMsg}</span>
      <button
        onClick={onRetry}
        className="flex items-center gap-1 border-2 border-current px-3 py-1.5 text-xs font-bold"
        style={{ minHeight: 32, borderRadius: skin.radiusSm }}
      >
        <RotateCcw size={12} /> {ui.tryAgain}
      </button>
    </div>
  );
}

function OptionBtn({ children, state, onClick, theme, dir, disabled, skin = SKINS.normal }) {
  let style = { borderColor: theme.hairlineStrong, background: theme.canvas, color: theme.ink };
  if (state === "correct") style = { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.border };
  else if (state === "incorrect") style = { background: INCORRECT.bg, borderColor: INCORRECT.border, color: INCORRECT.border };
  else if (state === "selected") style = { background: theme.ink, borderColor: theme.ink, color: theme.canvas };
  return (
    <button
      dir={dir}
      onClick={onClick}
      disabled={disabled}
      className="w-full text-start border-2 px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed"
      style={{ ...style, minHeight: 44, borderRadius: skin.radiusMd }}
    >
      {children}
    </button>
  );
}

/* =================================================================
   Per-type bodies — ported from the legacy engine, with two fixes:
   1) Order questions now start pre-filled with the given sequence,
      so "check" works even before the reader drags anything.
   2) The "can I check yet" gate (see canCheck in TypeCard) no longer
      lets an empty multi-select or empty text through.
================================================================== */
function SingleBody({ c, dir, value, setValue, checked, theme, skin = SKINS.normal }) {
  return (
    <div className="flex flex-col gap-2.5">
      {c.options.map((opt, i) => {
        let state;
        if (checked) state = i === c.correct ? "correct" : i === value ? "incorrect" : undefined;
        else state = i === value ? "selected" : undefined;
        return (
          <OptionBtn key={i} dir={dir} theme={theme} skin={skin} state={state} disabled={checked} onClick={() => !checked && setValue(i)}>
            {opt}
          </OptionBtn>
        );
      })}
    </div>
  );
}

function MultiBody({ c, dir, value = [], setValue, checked, theme, skin = SKINS.normal }) {
  const toggle = (i) => !checked && setValue(value.includes(i) ? value.filter((x) => x !== i) : [...value, i]);
  return (
    <div className="flex flex-col gap-2.5">
      {c.options.map((opt, i) => {
        let state;
        const chosen = value.includes(i);
        const correctChoice = c.correct.includes(i);
        if (checked && (chosen || correctChoice)) state = correctChoice && chosen ? "correct" : "incorrect";
        else if (chosen) state = "selected";
        return (
          <OptionBtn key={i} dir={dir} theme={theme} skin={skin} state={state} disabled={checked} onClick={() => toggle(i)}>
            {opt}
          </OptionBtn>
        );
      })}
    </div>
  );
}

function TFBody({ c, value, setValue, checked, lang, theme, skin = SKINS.normal }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[true, false].map((v) => {
        const label = v ? (lang === "ar" ? "صح" : "True") : lang === "ar" ? "غلط" : "False";
        let state;
        if (checked) state = v === c.correct ? "correct" : v === value ? "incorrect" : undefined;
        else state = value === v ? "selected" : undefined;
        return (
          <OptionBtn key={label} theme={theme} skin={skin} state={state} disabled={checked} onClick={() => !checked && setValue(v)}>
            <span className="block text-center font-bold text-base">{label}</span>
          </OptionBtn>
        );
      })}
    </div>
  );
}

function ShortBody({ c, dir, value = "", setValue, checked, ui, theme }) {
  const ok = checked ? isCorrect({ type: "short" }, c, value) : null;
  return (
    <div>
      <input
        dir={dir}
        disabled={checked}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="…"
        className="w-full rounded-2xl border-2 px-4 py-3 text-sm font-medium outline-none"
        style={{
          borderColor: checked ? (ok ? CORRECT.border : INCORRECT.border) : theme.hairlineStrong,
          background: checked ? (ok ? CORRECT.bg : INCORRECT.bg) : theme.canvas,
          color: theme.ink,
          minHeight: 44,
        }}
      />
      {checked && !ok && (
        <p className="mt-2 text-sm" style={{ color: theme.inkSoft }}>
          {ui.accepted}: {c.accepted.join(", ")}
        </p>
      )}
    </div>
  );
}

function EssayBody({ c, dir, value = "", setValue, ui, theme }) {
  const [reveal, setReveal] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <textarea
        dir={dir}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="…"
        className="educraft-textarea w-full resize-none rounded-2xl border-2 px-4 py-3 text-sm outline-none shadow-inner"
        style={{ borderColor: theme.hairlineStrong, background: theme.canvas, color: theme.ink }}
      />
      <button
        onClick={() => setReveal((r) => !r)}
        className="self-start rounded-full border-2 px-4 py-2 text-xs font-bold"
        style={{ borderColor: theme.hairlineStrong, color: theme.ink, minHeight: 40 }}
      >
        {reveal ? ui.hideModel : ui.revealModel}
      </button>
      {reveal && (
        <div dir={dir} className="rounded-2xl border-2 px-4 py-3 text-sm leading-relaxed" style={{ background: ESSAY_BOX.bg, borderColor: ESSAY_BOX.border, color: ESSAY_BOX.ink }}>
          {c.model}
        </div>
      )}
      <p className="text-xs" style={{ color: theme.inkSoft }}>
        {ui.selfGraded}
      </p>
    </div>
  );
}

function FillBody({ c, dir, value = [], setValue, checked, theme }) {
  const parts = c.template.split("___");
  const set = (i, v) => {
    const next = [...value];
    next[i] = v;
    setValue(next);
  };
  return (
    <p dir={dir} className="flex flex-wrap items-center gap-2 text-base leading-loose" style={{ color: theme.ink }}>
      {parts.map((seg, i) => (
        <span key={i} className="contents">
          <span>{seg}</span>
          {i < parts.length - 1 && (
            <input
              dir="auto"
              disabled={checked}
              value={value[i] || ""}
              onChange={(e) => set(i, e.target.value)}
              className="mx-1 w-24 rounded-lg border-2 px-2 py-1 text-center font-mono text-sm outline-none"
              style={{
                borderColor: checked ? ((value[i] || "").trim().toLowerCase() === c.blanks[i].toLowerCase() ? CORRECT.border : INCORRECT.border) : theme.hairlineStrong,
                background: checked ? ((value[i] || "").trim().toLowerCase() === c.blanks[i].toLowerCase() ? CORRECT.bg : INCORRECT.bg) : theme.canvas,
                color: theme.ink,
                minHeight: 36,
              }}
            />
          )}
        </span>
      ))}
    </p>
  );
}

function ClozeBody({ c, dir, value, setValue, checked, ui, theme }) {
  const parts = c.template.split("___");
  const ok = checked ? value === c.correct : null;
  return (
    <div className="flex flex-col gap-4">
      <p dir={dir} className="flex flex-wrap items-center gap-2 text-base leading-loose" style={{ color: theme.ink }}>
        {parts.map((seg, i) => (
          <span key={i} className="contents">
            <span>{seg}</span>
            {i < parts.length - 1 && (
              <button
                onClick={() => !checked && setValue(undefined)}
                disabled={checked}
                className="mx-1 min-w-[80px] rounded-lg border-2 border-dashed px-3 py-1 font-mono text-sm"
                style={{
                  borderColor: checked ? (ok ? CORRECT.border : INCORRECT.border) : theme.hairlineStrong,
                  background: checked ? (ok ? CORRECT.bg : INCORRECT.bg) : theme.canvas,
                  color: theme.ink,
                }}
              >
                {value || "?"}
              </button>
            )}
          </span>
        ))}
      </p>
      <p className="text-xs" style={{ color: theme.inkSoft }}>
        {ui.bankHint}
      </p>
      <div className="flex flex-wrap gap-2">
        {c.bank.map((w) => (
          <button
            key={w}
            dir="ltr"
            disabled={checked || value === w}
            onClick={() => setValue(w)}
            className="rounded-full border-2 px-4 py-2 font-mono text-sm font-semibold disabled:opacity-30"
            style={{ borderColor: theme.hairlineStrong, background: theme.canvas, color: theme.ink, minHeight: 40 }}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchBody({ c, value = {}, setValue, checked, ui, theme }) {
  const [active, setActive] = useState(null);
  const placedRight = Object.values(value);
  const pickLeft = (i) => {
    if (checked) return;
    if (value[i] !== undefined) {
      const next = { ...value };
      delete next[i];
      setValue(next);
      return;
    }
    setActive(i);
  };
  const pickRight = (j) => {
    if (checked || active === null || placedRight.includes(j)) return;
    setValue({ ...value, [active]: j });
    setActive(null);
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs" style={{ color: theme.inkSoft }}>
        {ui.matchHint}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {c.left.map((l, i) => {
            let style = { borderColor: theme.hairlineStrong, background: theme.canvas, color: theme.ink };
            if (checked) style = c.correct[i] === value[i] ? { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.border } : { background: INCORRECT.bg, borderColor: INCORRECT.border, color: INCORRECT.border };
            else if (active === i) style = { background: theme.ink, borderColor: theme.ink, color: theme.canvas };
            else if (value[i] !== undefined) style = { borderColor: theme.accent, background: theme.canvas, color: theme.ink };
            return (
              <button key={i} onClick={() => pickLeft(i)} className="rounded-2xl border-2 px-3 py-2.5 text-start font-mono text-sm font-bold" style={{ ...style, minHeight: 44 }}>
                {l}
                {value[i] !== undefined && <span className="block text-xs font-normal opacity-70 mt-0.5">→ {c.right[value[i]]}</span>}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {c.right.map((r, j) => (
            <button
              key={j}
              disabled={checked || placedRight.includes(j)}
              onClick={() => pickRight(j)}
              className="rounded-2xl border-2 px-3 py-2.5 text-start text-sm disabled:opacity-40"
              style={{ borderColor: theme.hairlineStrong, background: theme.canvas, color: theme.ink, minHeight: 44 }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderBody({ c, value, setValue, checked, ui, theme }) {
  const list = value || c.items;
  const move = (i, dir2) => {
    if (checked) return;
    const j = i + dir2;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setValue(next);
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs" style={{ color: theme.inkSoft }}>
        {ui.orderHint}
      </p>
      <div className="flex flex-col gap-2">
        {list.map((item, i) => {
          const state = checked ? (c.correct[i] === item ? "correct" : "incorrect") : null;
          const style = state === "correct" ? { background: CORRECT.bg, borderColor: CORRECT.border } : state === "incorrect" ? { background: INCORRECT.bg, borderColor: INCORRECT.border } : { background: theme.canvas, borderColor: theme.hairlineStrong };
          return (
            <div key={item} className="flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5" style={{ ...style, color: theme.ink }}>
              <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background: theme.ink, color: theme.canvas }}>
                {i + 1}
              </span>
              <span className="flex-1 font-mono text-sm font-semibold">{item}</span>
              <div className="flex flex-col">
                <button aria-label={ui.prev} disabled={checked || i === 0} onClick={() => move(i, -1)} className="disabled:opacity-20" style={{ color: theme.inkSoft }}>
                  <ArrowUp size={15} />
                </button>
                <button aria-label={ui.next} disabled={checked || i === list.length - 1} onClick={() => move(i, 1)} className="disabled:opacity-20" style={{ color: theme.inkSoft }}>
                  <ArrowDown size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SortBody({ c, value = {}, setValue, checked, ui, theme }) {
  const [active, setActive] = useState(null);
  const unsorted = c.items.filter((_, i) => value[i] === undefined);
  const placeIn = (bin) => {
    if (checked || active === null) return;
    setValue({ ...value, [active]: bin });
    setActive(null);
  };
  const remove = (i) => {
    if (checked) return;
    const next = { ...value };
    delete next[i];
    setValue(next);
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs" style={{ color: theme.inkSoft }}>
        {ui.sortHint}
      </p>
      <div className="flex flex-wrap gap-2 rounded-2xl border-2 border-dashed p-3 min-h-[52px]" style={{ borderColor: theme.hairlineStrong }}>
        {unsorted.length === 0 && (
          <span className="text-xs" style={{ color: theme.inkSoft }}>
            —
          </span>
        )}
        {c.items.map(([label], i) =>
          value[i] === undefined ? (
            <button
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              className="rounded-full border-2 px-3 py-1.5 font-mono text-sm font-semibold"
              style={active === i ? { background: theme.ink, color: theme.canvas, borderColor: theme.ink } : { borderColor: theme.hairlineStrong, color: theme.ink }}
            >
              {label}
            </button>
          ) : null
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {c.bins.map((bin) => (
          <button key={bin} onClick={() => placeIn(bin)} className="flex min-h-[100px] flex-col gap-2 rounded-2xl border-2 p-3 text-start" style={{ borderColor: theme.hairlineStrong, background: theme.canvas }}>
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: theme.inkSoft }}>
              {bin}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {c.items.map(([label, correctBin], i) => {
                if (value[i] !== bin) return null;
                const state = checked ? (correctBin === bin ? "correct" : "incorrect") : null;
                const style = state === "correct" ? { background: CORRECT.bg, borderColor: CORRECT.border } : state === "incorrect" ? { background: INCORRECT.bg, borderColor: INCORRECT.border } : { background: "transparent", borderColor: theme.hairlineStrong };
                return (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(i);
                    }}
                    className="rounded-full border-2 px-2.5 py-1 font-mono text-xs font-semibold"
                    style={{ ...style, color: theme.ink }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NumericBody({ c, value = "", setValue, checked, theme }) {
  const ok = checked ? isCorrect({ type: "numeric" }, c, value) : null;
  return (
    <input
      type="number"
      inputMode="decimal"
      disabled={checked}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="0"
      className="w-32 rounded-2xl border-2 px-4 py-3 text-center font-mono text-lg font-bold outline-none"
      style={{
        borderColor: checked ? (ok ? CORRECT.border : INCORRECT.border) : theme.hairlineStrong,
        background: checked ? (ok ? CORRECT.bg : INCORRECT.bg) : theme.canvas,
        color: theme.ink,
        minHeight: 44,
      }}
    />
  );
}

function RatingBody({ value = 0, setValue }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} aria-label={String(n)} onClick={() => setValue(n)} style={{ minHeight: 40, minWidth: 40 }}>
          <Star size={28} fill={n <= value ? "#FCD34D" : "none"} stroke={n <= value ? "#a8790c" : "#14151A55"} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

function SliderBody({ c, value, setValue, checked, theme }) {
  const v = value ?? (c.min + c.max) / 2;
  const ok = checked ? isCorrect({ type: "slider" }, c, v) : null;
  return (
    <div className="flex flex-col gap-3">
      <input type="range" min={c.min} max={c.max} step={c.step} disabled={checked} value={v} onChange={(e) => setValue(parseFloat(e.target.value))} className="w-full" style={{ accentColor: theme.accent, minHeight: 24 }} />
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono" style={{ color: theme.inkSoft }}>
          {c.min}
        </span>
        <span
          className="rounded-full border-2 px-3 py-1 font-mono text-sm font-bold"
          style={{
            borderColor: checked ? (ok ? CORRECT.border : INCORRECT.border) : theme.hairlineStrong,
            background: checked ? (ok ? CORRECT.bg : INCORRECT.bg) : theme.canvas,
            color: theme.ink,
          }}
        >
          {v}
        </span>
        <span className="font-mono" style={{ color: theme.inkSoft }}>
          {c.max}
        </span>
      </div>
    </div>
  );
}

/* =================================================================
   TypeCard — the fixed anatomy: header (type / subject / difficulty
   · tier, RTL/LTR chip) + a body that switches on type + footer
   (check / feedback). This is the single-question unit; the deck
   below pages through one or more of these inside one outer card.
================================================================== */
/* =================================================================
   QuestionItem — the compact, "many-in-one-card" sibling of TypeCard.
   Same body components and grading logic, but no colored background
   and no per-question image (a QuestionGroupCard owns one shared
   image for the whole bundle) — just a thin left accent bar in the
   question-type color, so several different types can sit inside
   one neutral card without fighting each other visually.
================================================================== */
function QuestionItem({ q, lang, ui, theme, skin = SKINS.normal, onAnswered }) {
  if (!q) return null;
  const c = q[lang] || q.ar || q.en || {};
  const meta = TYPE_META[q.type] || TYPE_META.single || {
    ar: "سؤال", en: "Question", Icon: CircleDot,
    color: { bg: theme.surface, border: theme.hairline, ink: theme.ink }
  };
  const initialValue = q.type === "multi" ? [] : q.type === "match" || q.type === "sort" ? {} : q.type === "order" ? (c.items || []) : undefined;
  const [value, setValue] = useState(initialValue);
  const [checked, setChecked] = useState(false);
  const selfGraded = q.type === "essay" || q.type === "rating";
  const ok = checked && !selfGraded ? isCorrect(q, c, value) : null;
  const answeredRef = useRef(false);

  useEffect(() => {
    if (!selfGraded || answeredRef.current || !onAnswered) return;
    const touched = q.type === "rating" ? value !== undefined && value !== null : typeof value === "string" && value.trim().length > 0;
    if (touched) {
      answeredRef.current = true;
      onAnswered(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleCheck = () => {
    setChecked(true);
    if (!selfGraded && onAnswered && !answeredRef.current) {
      answeredRef.current = true;
      onAnswered(isCorrect(q, c, value));
    }
  };

  const body = (() => {
    switch (q.type) {
      case "single":
        return <SingleBody c={c} dir={c.dir || q.dir} value={value} setValue={setValue} checked={checked} theme={theme} skin={skin} />;
      case "multi":
        return <MultiBody c={c} dir={q.dir} value={value} setValue={setValue} checked={checked} theme={theme} skin={skin} />;
      case "tf":
        return <TFBody c={c} value={value} setValue={setValue} checked={checked} lang={lang} theme={theme} skin={skin} />;
      case "short":
        return <ShortBody c={c} dir={q.dir} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "essay":
        return <EssayBody c={c} dir={q.dir} value={value} setValue={setValue} ui={ui} theme={theme} />;
      case "fill":
        return <FillBody c={c} dir={q.dir} value={value} setValue={setValue} checked={checked} theme={theme} />;
      case "cloze":
        return <ClozeBody c={c} dir={q.dir} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "match":
        return <MatchBody c={c} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "order":
        return <OrderBody c={c} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "sort":
        return <SortBody c={c} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "numeric":
        return <NumericBody c={c} value={value} setValue={setValue} checked={checked} theme={theme} />;
      case "rating":
        return <RatingBody value={value} setValue={setValue} />;
      case "slider":
        return <SliderBody c={c} value={value} setValue={setValue} checked={checked} theme={theme} />;
      default:
        return null;
    }
  })();

  const canCheck = (() => {
    if (value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  })();

  return (
    <div
      className="p-4 sm:p-5 flex flex-col gap-3.5"
      style={{
        background: meta.color.bg,
        color: meta.color.ink,
        borderRadius: skin.radiusMd,
        border: skin.pixel ? `${skin.borderW}px solid ${meta.color.ink}` : "none",
        boxShadow: skin.pixel ? skin.shadow : "none",
      }}
    >
      <div className="flex items-center gap-2">
        <meta.Icon size={14} strokeWidth={2.25} style={{ opacity: 0.75 }} />
        <span className="text-[0.68rem] font-black uppercase tracking-wider" style={{ opacity: 0.75, letterSpacing: skin.letterSpacing }}>
          {meta[lang]} · {DIFF[lang][q.difficulty]}
        </span>
      </div>

      {/* Unified ContentBlocks (optional, rendered before prompt) */}
      {Array.isArray(c.content || q.content) && (c.content || q.content).length > 0 && (
        <div className="flex flex-col gap-2 my-1">
          {(c.content || q.content)
            .filter((b) => b && b.kind !== "pagebreak")
            .map((block, idx) => (
              <PlateBlock key={block.id || idx} block={block} theme={theme} skin={skin} />
            ))}
        </div>
      )}

      <p dir={q.dir} className="text-base font-semibold leading-relaxed">
        {c.prompt || c.template}
      </p>

      {(q.code || c.code) && (
        <SyntaxCodeBlock
          code={typeof (q.code || c.code) === "object" ? (q.code || c.code).src : (q.code || c.code)}
          lang={q.code?.lang || q.code_language || c.code_language || q.codeLang}
          title={typeof (q.code || c.code) === "object" ? (q.code || c.code).title : undefined}
          theme={theme}
          skin={skin}
        />
      )}

      {body}

      {checked && !selfGraded && <FeedbackBanner ok={ok} ui={ui} skin={skin} onRetry={() => setChecked(false)} />}

      {!selfGraded && !checked && (
        <button
          onClick={handleCheck}
          disabled={!canCheck}
          className="self-start px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderRadius: skin.radiusSm, background: "rgba(20,21,26,0.88)", minHeight: 44 }}
        >
          {ui.checkAnswer}
        </button>
      )}
    </div>
  );
}

/* =================================================================
   QuestionGroupCard — a bundle of 1..N questions (any mix of types)
   sharing one card and, optionally, one image pinned to the top,
   left, or right of the bundle. This is the real unit of navigation
   inside a leaf's deck now — a "card" can hold 10 questions, or 5,
   or just 1 — not necessarily one question each.
================================================================== */
function QuestionGroupCard({ group, lang, ui, theme, skin = SKINS.normal, onAnswered }) {
  if (!group) return null;
  const questions = Array.isArray(group.questions) ? group.questions : [];
  const pos = group.imagePosition || "top";
  const hasImage = !!group.image;
  const hasVideo = !!group.video;
  const hasAudio = !!group.audio;
  // The card itself is tinted with the active flavor's header color (so
  // switching flavors visibly recolors the card) — individual questions
  // stay transparent on top of it and keep their own type color only as
  // a thin left accent bar, per "keep the questions' old colors".
  const cardBg = skin.surfaceAlpha >= 1 ? theme.header : hexToRgba(theme.header, skin.surfaceAlpha);
  const cardStyle = { ...panelStyle(skin, theme), background: cardBg };

  const list = (
    <div
      className="flex flex-col gap-5 p-5 sm:p-6 flex-1 min-w-0"
      style={{ maxHeight: "min(60vh, 540px)", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
    >
      {questions.map((q, i) => (
        <QuestionItem
          key={q?.id || i}
          q={q}
          lang={lang}
          ui={ui}
          theme={theme}
          skin={skin}
          onAnswered={onAnswered ? (result) => onAnswered(group.id, i, result) : undefined}
        />
      ))}
    </div>
  );

  // Video/audio are shown as full-width blocks above the question list —
  // independent of the image's top/left/right placement, since a clip or
  // a track doesn't have a meaningful "side" the way a still image does.
  const mediaBlock = hasVideo || hasAudio ? (
    <div className="shrink-0 px-5 pt-5 sm:px-6 sm:pt-6 flex flex-col gap-3">
      {hasVideo && (
        <video src={group.video} controls playsInline className="w-full" style={{ borderRadius: skin.radiusSm || 10, display: "block", maxHeight: 360 }} />
      )}
      {hasAudio && <audio src={group.audio} controls className="w-full" style={{ display: "block" }} />}
    </div>
  ) : null;

  if (!hasImage) {
    return (
      <div className="overflow-hidden" style={cardStyle}>
        {mediaBlock}
        {list}
      </div>
    );
  }

  const imageFit = group.imageFit || "smart";

  const imageBlock = (fullWidth) => {
    let containerStyle = {};
    let imgStyle = { display: "block" };

    if (fullWidth) {
      if (imageFit === "banner") {
        containerStyle = { width: "100%", aspectRatio: "16/9" };
        imgStyle = { ...imgStyle, width: "100%", height: "100%", objectFit: "cover" };
      } else if (imageFit === "compact") {
        containerStyle = { width: "100%", maxHeight: 200, background: "rgba(0,0,0,0.03)", display: "flex", justifyContent: "center", alignItems: "center" };
        imgStyle = { ...imgStyle, maxWidth: "100%", maxHeight: 200, objectFit: "contain" };
      } else {
        // "smart" default: retains natural aspect ratio with sensible ceiling, no awkward cropping!
        containerStyle = { width: "100%", maxHeight: 340, background: "rgba(0,0,0,0.03)", display: "flex", justifyContent: "center", alignItems: "center" };
        imgStyle = { ...imgStyle, maxWidth: "100%", maxHeight: 340, objectFit: "contain" };
      }
    } else {
      containerStyle = { width: "38%", minWidth: 110, alignSelf: "stretch", background: "rgba(0,0,0,0.03)", display: "flex", justifyContent: "center", alignItems: "center" };
      imgStyle = { ...imgStyle, width: "100%", height: "100%", objectFit: imageFit === "banner" ? "cover" : "contain" };
    }

    return (
      <div className="shrink-0 overflow-hidden" style={containerStyle}>
        <img src={group.image} alt="" style={imgStyle} />
      </div>
    );
  };

  if (pos === "top") {
    return (
      <div className="overflow-hidden" style={cardStyle}>
        {imageBlock(true)}
        {mediaBlock}
        {list}
      </div>
    );
  }

  // left / right: an explicit physical side, regardless of reading
  // direction — the reader picked "left" or "right" in Settings/data
  // meaning screen-left or screen-right, not "start" or "end".
  return (
    <div className="overflow-hidden flex flex-col sm:flex-row" style={cardStyle}>
      {pos === "left" && imageBlock(false)}
      <div className="flex flex-col flex-1 min-w-0">
        {mediaBlock}
        {list}
      </div>
      {pos === "right" && imageBlock(false)}
    </div>
  );
}


function TypeCard({ q, lang, ui, theme, skin = SKINS.normal, onAnswered }) {
  if (!q) return null;
  const c = q[lang] || q.ar || q.en || {};
  const meta = TYPE_META[q.type] || TYPE_META.single || {
    ar: "سؤال", en: "Question", Icon: CircleDot,
    color: { bg: theme.surface, border: theme.hairline, ink: theme.ink }
  };
  const initialValue = q.type === "multi" ? [] : q.type === "match" || q.type === "sort" ? {} : q.type === "order" ? (c.items || []) : undefined;
  const [value, setValue] = useState(initialValue);
  const [checked, setChecked] = useState(false);
  const selfGraded = q.type === "essay" || q.type === "rating";
  const ok = checked && !selfGraded ? isCorrect(q, c, value) : null;
  const image = c.image || q.image;
  const answeredRef = useRef(false);

  // Self-graded questions (essay / self-rating) have no "check" button,
  // so completion is marked the first time the reader puts something in —
  // typing an essay answer, or moving the rating slider.
  useEffect(() => {
    if (!selfGraded || answeredRef.current || !onAnswered) return;
    const touched = q.type === "rating" ? value !== undefined && value !== null : typeof value === "string" && value.trim().length > 0;
    if (touched) {
      answeredRef.current = true;
      onAnswered(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleCheck = () => {
    setChecked(true);
    if (!selfGraded && onAnswered && !answeredRef.current) {
      answeredRef.current = true;
      onAnswered(isCorrect(q, c, value));
    }
  };

  const body = (() => {
    switch (q.type) {
      case "single":
        return <SingleBody c={c} dir={c.dir || q.dir} value={value} setValue={setValue} checked={checked} theme={theme} skin={skin} />;
      case "multi":
        return <MultiBody c={c} dir={q.dir} value={value} setValue={setValue} checked={checked} theme={theme} skin={skin} />;
      case "tf":
        return <TFBody c={c} value={value} setValue={setValue} checked={checked} lang={lang} theme={theme} skin={skin} />;
      case "short":
        return <ShortBody c={c} dir={q.dir} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "essay":
        return <EssayBody c={c} dir={q.dir} value={value} setValue={setValue} ui={ui} theme={theme} />;
      case "fill":
        return <FillBody c={c} dir={q.dir} value={value} setValue={setValue} checked={checked} theme={theme} />;
      case "cloze":
        return <ClozeBody c={c} dir={q.dir} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "match":
        return <MatchBody c={c} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "order":
        return <OrderBody c={c} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "sort":
        return <SortBody c={c} value={value} setValue={setValue} checked={checked} ui={ui} theme={theme} />;
      case "numeric":
        return <NumericBody c={c} value={value} setValue={setValue} checked={checked} theme={theme} />;
      case "rating":
        return <RatingBody value={value} setValue={setValue} />;
      case "slider":
        return <SliderBody c={c} value={value} setValue={setValue} checked={checked} theme={theme} />;
      default:
        return null;
    }
  })();

  const canCheck = (() => {
    if (value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  })();

  return (
    <div
      className="p-5 sm:p-6 flex flex-col gap-4"
      style={{
        background: meta.color.bg,
        color: meta.color.ink,
        borderRadius: skin.radiusLg,
        border: skin.pixel ? `${skin.borderW}px solid ${meta.color.ink}` : "none",
        boxShadow: skin.pixel ? skin.shadow : "none",
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <meta.Icon size={16} strokeWidth={2.25} style={{ opacity: 0.75 }} />
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-black uppercase tracking-wider" style={{ opacity: 0.75, letterSpacing: skin.letterSpacing }}>
              {meta[lang]} // {q.subject}
            </span>
            <span className="text-[0.7rem] font-bold uppercase tracking-wide" style={{ opacity: 0.55 }}>
              {DIFF[lang][q.difficulty]} · {TIER[lang][q.tier]}
            </span>
          </div>
        </div>
        <span dir="ltr" className="flex items-center gap-1 px-2 py-1 text-[0.65rem] font-bold" style={{ borderRadius: skin.radiusSm, background: "rgba(255,255,255,0.5)" }}>
          <ArrowLeftRight size={11} /> {q.dir === "rtl" ? "RTL" : "LTR"}
        </span>
      </div>

      {/* Unified ContentBlocks (optional, rendered before prompt) */}
      {Array.isArray(c.content || q.content) && (c.content || q.content).length > 0 && (
        <div className="flex flex-col gap-2 my-1">
          {(c.content || q.content)
            .filter((b) => b && b.kind !== "pagebreak")
            .map((block, idx) => (
              <PlateBlock key={block.id || idx} block={block} theme={theme} skin={skin} />
            ))}
        </div>
      )}

      <p dir={q.dir} className="text-base font-semibold leading-relaxed">
        {c.prompt || c.template}
      </p>

      {(q.code || c.code) && (
        <SyntaxCodeBlock
          code={typeof (q.code || c.code) === "object" ? (q.code || c.code).src : (q.code || c.code)}
          lang={q.code?.lang || q.code_language || c.code_language || q.codeLang}
          title={typeof (q.code || c.code) === "object" ? (q.code || c.code).title : undefined}
          theme={theme}
          skin={skin}
        />
      )}

      {image && (
        <div
          className="w-full overflow-hidden shrink-0"
          style={{ borderRadius: skin.radiusMd, aspectRatio: "16/9", border: skin.pixel ? `${skin.borderW}px solid ${meta.color.ink}` : "none" }}
        >
          <img src={image} alt="" className="w-full h-full" style={{ objectFit: "cover", objectPosition: "center", display: "block" }} />
        </div>
      )}

      {body}

      {checked && !selfGraded && <FeedbackBanner ok={ok} ui={ui} skin={skin} onRetry={() => setChecked(false)} />}

      {!selfGraded && !checked && (
        <button
          onClick={handleCheck}
          disabled={!canCheck}
          className="self-start px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderRadius: skin.radiusSm, background: "rgba(20,21,26,0.88)", minHeight: 44 }}
        >
          {ui.checkAnswer}
        </button>
      )}
    </div>
  );
}

/* =================================================================
   NodeQuestionDeck — "the card that holds more than one question."
   One leaf can carry several questions; this pages through them
   inside a single outer shell instead of stacking separate cards.
================================================================== */
function NodeQuestionDeck({ node, book, lang, ui, theme, dir, skin, cardMode = "paged", scrollDir = "vertical", onAnswered }) {
  const [index, setIndex] = useState(0);
  const cards = useMemo(() => leafCards(node), [node]);
  const multi = cards.length > 1;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const scrolling = cardMode === "scroll" && multi;
  const horizontal = scrolling && scrollDir === "horizontal";
  const totalQuestions = useMemo(() => {
    return cards.reduce((n, g) => n + (Array.isArray(g?.questions) ? g.questions.length : 0), 0);
  }, [cards]);

  useEffect(() => setIndex(0), [node?.id]);

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center educraft-panel-in" style={panelStyle(skin, theme)}>
        <p className="text-sm font-semibold" style={{ color: theme.inkSoft }}>
          {lang === "ar" ? "لا توجد أسئلة أو تمارين مخصصة لهذه الورقة حاليًا." : "No questions or exercises assigned to this leaf yet."}
        </p>
      </div>
    );
  }

  const safeIndex = Math.min(Math.max(0, index), cards.length - 1);
  const currentCard = cards[safeIndex] || cards[0];

  return (
    <div
      className="overflow-hidden educraft-panel-in"
      style={panelStyle(skin, theme)}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 flex-wrap" style={{ borderBottom: `1px solid ${skinBorderColor(skin, theme)}`, background: skinSurface(skin, theme, true) }}>
        <div className="flex items-center gap-2 min-w-0">
          <Layers size={16} color={theme.accent} strokeWidth={2} />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-xs font-semibold truncate" style={{ color: theme.inkSoft }}>
              {book?.[lang]?.title || book?.id}
            </span>
            <span className="text-sm font-bold truncate" style={{ color: theme.ink }}>
              {node?.[lang] || node?.ar || node?.en || node?.id}
            </span>
          </div>
        </div>
        {multi && !scrolling && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1" style={{ borderRadius: skin.radiusSm, background: theme.canvas, color: theme.inkSoft }}>
              {ui.deckQuestion} {safeIndex + 1} {ui.deckOf} {cards.length}
            </span>
            <button
              aria-label={ui.prev}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={safeIndex === 0}
              className="grid place-items-center disabled:opacity-30"
              style={{ width: 32, height: 32, borderRadius: skin.radiusSm, border: `1px solid ${skinBorderColor(skin, theme)}`, color: theme.ink }}
            >
              <PrevIcon size={15} />
            </button>
            <button
              aria-label={ui.next}
              onClick={() => setIndex((i) => Math.min(cards.length - 1, i + 1))}
              disabled={safeIndex === cards.length - 1}
              className="grid place-items-center disabled:opacity-30"
              style={{ width: 32, height: 32, borderRadius: skin.radiusSm, border: `1px solid ${skinBorderColor(skin, theme)}`, color: theme.ink }}
            >
              <NextIcon size={15} />
            </button>
          </div>
        )}
        {scrolling && (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 shrink-0" style={{ borderRadius: skin.radiusSm, background: theme.canvas, color: theme.inkSoft }}>
            {horizontal ? <Columns3 size={12} /> : <Rows3 size={12} />}
            {totalQuestions} {ui.questionsLabel}
          </span>
        )}
      </div>

      {scrolling ? (
        <div
          className="p-2.5 sm:p-3.5 flex gap-3"
          style={{
            flexDirection: horizontal ? "row" : "column",
            overflowX: horizontal ? "auto" : "visible",
            overflowY: horizontal ? "visible" : "auto",
            maxHeight: horizontal ? "none" : "min(70vh, 640px)",
            scrollSnapType: horizontal ? "x mandatory" : "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {cards.map((group, i) => (
            <div key={group?.id || `${node?.id}-${i}`} style={horizontal ? { flex: "0 0 min(88vw, 420px)", scrollSnapAlign: "start" } : undefined}>
              <QuestionGroupCard group={group} lang={lang} ui={ui} theme={theme} skin={skin} onAnswered={onAnswered} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-2.5 sm:p-3.5">
          {currentCard && (
            <QuestionGroupCard key={currentCard?.id || `${node?.id}-${safeIndex}`} group={currentCard} lang={lang} ui={ui} theme={theme} skin={skin} onAnswered={onAnswered} />
          )}
        </div>
      )}

      {multi && !scrolling && (
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {cards.map((_, i) => (
            <button
              key={i}
              aria-label={`${ui.deckQuestion} ${i + 1}`}
              onClick={() => setIndex(i)}
              className="transition-all"
              style={{
                width: i === safeIndex ? 18 : 6,
                height: 6,
                borderRadius: skin.radiusSm,
                background: i === safeIndex ? theme.accent : theme.hairlineStrong,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =================================================================
   TreeErrorBoundary — catches any uncaught render error inside the
   Knowledge Tree and shows a friendly message + retry button instead
   of the dreaded blank white screen.
================================================================== */
class TreeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[KnowledgeTree] Render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      const { theme, skin, lang } = this.props;
      return (
        <div
          className="flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border"
          style={{
            background: theme?.surface || "#fff",
            borderColor: theme?.hairline || "#eee",
            color: theme?.ink || "#111",
            minHeight: 240,
          }}
        >
          <span style={{ fontSize: 36 }}>⚠️</span>
          <p className="text-sm font-semibold text-center" style={{ color: theme?.inkSoft }}>
            {lang === "ar"
              ? "حدث خطأ أثناء تحميل شجرة المعرفة."
              : "An error occurred while rendering the Knowledge Tree."}
          </p>
          <p className="text-xs font-mono text-center opacity-60" style={{ maxWidth: 420 }}>
            {String(this.state.error?.message || this.state.error || "")}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs font-bold px-4 py-2"
            style={{
              borderRadius: skin?.radiusSm || 8,
              background: theme?.accent || "#4F46E5",
              color: theme?.accentInk || "#fff",
            }}
          >
            {lang === "ar" ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* =================================================================
   KnowledgeTree — three rendered levels (branch → sub-branch →
   leaf). Edges are derived generically from each node's `parent`,
   so the same renderer works for any depth. Cross-branch links are
   a second, dashed edge set declared per book. Leaves are keyboard-
   focusable and tap-friendly (not hover-only), and carry a small
   badge when their card holds more than one question.
================================================================== */
function KnowledgeTree({ book, lang, dir, theme, ui, skin, selected, onSelect, doneLeafIds = [] }) {
  return (
    <TreeErrorBoundary theme={theme} skin={skin} lang={lang}>
      <KnowledgeTreeEnhanced
        book={book}
        lang={lang}
        dir={dir}
        theme={theme}
        ui={ui}
        skin={skin}
        selected={selected}
        onSelect={onSelect}
        doneLeafIds={doneLeafIds}
        leafCards={leafCards}
      />
    </TreeErrorBoundary>
  );
}

/* =================================================================
   BookCover — a small illustrated cover (gradient field, a simple
   graphic mark, and a bookmark-ribbon tab) instead of a flat swatch,
   echoing the library reference: every book gets a face of its own.
================================================================== */
function BookCover({ book, theme }) {
  const { from, to, icon } = book.cover;
  const gid = `grad-${book.id}`;
  return (
    <svg viewBox="0 0 160 210" className="w-full h-full" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="160" height="210" rx="14" fill={`url(#${gid})`} />
      <rect x="0" y="0" width="160" height="210" rx="14" fill="black" opacity="0.06" />
      <rect x="10" y="10" width="140" height="190" rx="8" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
      {icon === "code" ? (
        <g stroke="white" strokeOpacity="0.9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M58 78 L38 105 L58 132" />
          <path d="M102 78 L122 105 L102 132" />
          <path d="M88 66 L72 144" />
        </g>
      ) : (
        <g stroke="white" strokeOpacity="0.9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M64 62 C40 62 40 92 64 96 C88 100 88 130 62 130" />
          <circle cx="98" cy="70" r="4" fill="white" stroke="none" />
          <circle cx="98" cy="130" r="4" fill="white" stroke="none" />
        </g>
      )}
      <path d="M114 0 V38 L126 26 L138 38 V0 Z" fill={theme.accent} />
    </svg>
  );
}

/* =================================================================
   EditableCover — wraps BookCover so the reader can replace it with
   their own image. The image is sized with object-fit: cover, so it
   always fills the exact cover box (no stretching, no letterboxing),
   and the corner "bookmark" ribbon still reads on top of it. A small
   pencil button (hover on desktop, always-on on touch) opens a file
   picker; once a custom cover is set, an X lets the reader go back
   to the generated art.
================================================================== */
function EditableCover({ book, theme, skin, ui, coverUrl, onChangeCover, onClearCover, editable = true, radius = 14 }) {
  const inputId = `cover-input-${book.id}`;
  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChangeCover(book.id, reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  return (
    <div className="group/cover relative w-full h-full" style={{ borderRadius: radius, overflow: "hidden" }}>
      {coverUrl ? (
        <img src={coverUrl} alt="" className="w-full h-full" style={{ objectFit: "cover", objectPosition: "center", display: "block" }} />
      ) : (
        <BookCover book={book} theme={theme} />
      )}
      {coverUrl && (
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.35)" }} />
      )}
      {coverUrl && (
        <svg className="absolute top-0 right-0 pointer-events-none" width="26" height="38" viewBox="0 0 26 38">
          <path d="M0 0 H26 V38 L13 27 L0 38 Z" fill={theme.accent} />
        </svg>
      )}
      {editable && (
        <div
          className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover/cover:opacity-100 focus-within:opacity-100 transition-opacity"
          style={{ background: "rgba(10,8,6,0.42)" }}
        >
          <label
            htmlFor={inputId}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center rounded-full cursor-pointer"
            style={{ width: 30, height: 30, background: "rgba(255,255,255,0.92)", color: "#241B13" }}
            aria-label={ui.coverEdit}
            title={ui.coverEdit}
          >
            <Pencil size={13} />
          </label>
          <input id={inputId} type="file" accept="image/*" onChange={handleFile} className="hidden" onClick={(e) => e.stopPropagation()} />
          {coverUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearCover(book.id);
              }}
              className="flex items-center justify-center rounded-full"
              style={{ width: 30, height: 30, background: "rgba(255,255,255,0.92)", color: "#241B13" }}
              aria-label={ui.coverReset}
              title={ui.coverReset}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* =================================================================
   ItemMoveDropdown — Sleek Apple/Thiqa popover menu replacing native select
================================================================== */
function ItemMoveDropdown({
  item,
  itemType, // "book" | "encyclopedia" | "folder"
  collections = [],
  currentParentId = null,
  onMove,
  theme,
  skin,
  lang,
  dir,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("pointerdown", handleClickOutside, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handleClickOutside, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Determine current active parent collection
  const activeParent = collections.find((c) => (c.itemIds || []).includes(item.id));
  const activeParentId = activeParent ? activeParent.id : "root";

  // Destinations:
  // Folders:
  const availableFolders = collections.filter((c) => {
    if (c.kind !== "folder") return false;
    if (itemType === "folder") {
      // Cannot move a folder into itself or any of its descendants
      if (c.id === item.id) return false;
      if (isDescendantOf(c.id, item.id, collections)) return false;
    }
    return true;
  });

  // Encyclopedias: (only books can go into encyclopedias)
  const availableEncyclopedias = itemType === "book" ? collections.filter((c) => c.kind === "encyclopedia") : [];

  const handleSelect = (targetId) => {
    setIsOpen(false);
    if (onMove) {
      onMove(item.id, targetId);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="educraft-btn flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 transition-all cursor-pointer"
        style={{
          borderRadius: skin.radiusSm,
          border: `1.5px solid ${isOpen ? theme.accent : skinBorderColor(skin, theme)}`,
          background: isOpen ? theme.accentSoft : theme.surface,
          color: isOpen ? theme.accent : theme.ink,
        }}
        title={lang === "ar" ? "نقل إلى مجلد أو موسوعة" : "Move to folder or encyclopedia"}
        aria-expanded={isOpen}
      >
        <FolderInput size={12} className={isOpen ? "text-indigo-500" : "opacity-70"} />
        <span>{lang === "ar" ? "نقل" : "Move"}</span>
        <ChevronDown size={10} className={`opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 bottom-full mb-2 end-0 w-60 max-h-72 overflow-y-auto p-1.5 rounded-2xl border flex flex-col gap-1 shadow-2xl educraft-modal-in"
          style={{
            background: theme.surface,
            borderColor: theme.hairlineStrong,
            boxShadow: "0 18px 38px -4px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-start" style={{ color: theme.inkSoft }}>
            {lang === "ar" ? "نقل العنصر إلى..." : "Move item to..."}
          </div>

          {/* Root shelf */}
          <button
            type="button"
            onClick={() => handleSelect("root")}
            className={`flex items-center justify-between w-full px-2.5 py-2 text-xs rounded-xl text-start transition-colors ${
              activeParentId === "root" ? "font-bold shadow-sm" : "hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            style={{
              color: activeParentId === "root" ? theme.accent : theme.ink,
              background: activeParentId === "root" ? theme.accentSoft : "transparent",
            }}
          >
            <div className="flex items-center gap-2 truncate">
              <Home size={13} className="shrink-0 opacity-80" />
              <span className="truncate">{lang === "ar" ? "المكتبة الرئيسية (الرف العام)" : "Main Library Shelf"}</span>
            </div>
            {activeParentId === "root" && <Check size={13} className="shrink-0 text-emerald-500" />}
          </button>

          {/* Folders group */}
          {availableFolders.length > 0 && (
            <>
              <div className="border-t my-1" style={{ borderColor: theme.hairline }} />
              <div className="px-2.5 py-1 text-[10px] font-bold text-start opacity-70 flex items-center gap-1.5" style={{ color: theme.inkSoft }}>
                <Folder size={11} className="text-amber-500" />
                <span>{lang === "ar" ? "المجلدات" : "Folders"}</span>
              </div>
              {availableFolders.map((f) => {
                const isSelected = activeParentId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelect(f.id)}
                    className={`flex items-center justify-between w-full px-2.5 py-2 text-xs rounded-xl text-start transition-colors ${
                      isSelected ? "font-bold shadow-sm" : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    style={{
                      color: isSelected ? theme.accent : theme.ink,
                      background: isSelected ? theme.accentSoft : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FolderOpen size={13} className="shrink-0 text-amber-500" />
                      <span className="truncate">{f.title}</span>
                    </div>
                    {isSelected && <Check size={13} className="shrink-0 text-emerald-500" />}
                  </button>
                );
              })}
            </>
          )}

          {/* Encyclopedias group */}
          {availableEncyclopedias.length > 0 && (
            <>
              <div className="border-t my-1" style={{ borderColor: theme.hairline }} />
              <div className="px-2.5 py-1 text-[10px] font-bold text-start opacity-70 flex items-center gap-1.5" style={{ color: theme.inkSoft }}>
                <BookCopy size={11} className="text-indigo-500" />
                <span>{lang === "ar" ? "الموسوعات" : "Encyclopedias"}</span>
              </div>
              {availableEncyclopedias.map((enc) => {
                const isSelected = activeParentId === enc.id;
                return (
                  <button
                    key={enc.id}
                    type="button"
                    onClick={() => handleSelect(enc.id)}
                    className={`flex items-center justify-between w-full px-2.5 py-2 text-xs rounded-xl text-start transition-colors ${
                      isSelected ? "font-bold shadow-sm" : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    style={{
                      color: isSelected ? theme.accent : theme.ink,
                      background: isSelected ? theme.accentSoft : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BookCopy size={13} className="shrink-0 text-indigo-500" />
                      <span className="truncate">{enc.title}</span>
                    </div>
                    {isSelected && <Check size={13} className="shrink-0 text-emerald-500" />}
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* =================================================================
   CreateItemModal — Modal replacing window.prompt for creating
   Books, Encyclopedias, and Folders
================================================================== */
const BOOK_COVER_PALETTES = [
  { name: "Blue", from: "#3B82F6", to: "#1D4ED8" },
  { name: "Emerald", from: "#10B981", to: "#047857" },
  { name: "Purple", from: "#8B5CF6", to: "#6D28D9" },
  { name: "Amber", from: "#F59E0B", to: "#D97706" },
  { name: "Rose", from: "#F43F5E", to: "#BE123C" },
  { name: "Indigo", from: "#6366F1", to: "#4338CA" },
  { name: "Slate", from: "#475569", to: "#0F172A" },
  { name: "Teal", from: "#14B8A6", to: "#0F766E" },
];

function CreateItemModal({
  isOpen,
  onClose,
  initialKind = "book",
  defaultParentId = null,
  collections = [],
  onCreate,
  theme,
  skin,
  lang,
  dir,
  ui,
}) {
  const [kind, setKind] = useState(initialKind);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [parentId, setParentId] = useState(defaultParentId || "root");
  const [selectedPalette, setSelectedPalette] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setKind(initialKind);
      setTitle("");
      setTagline("");
      setParentId(defaultParentId || "root");
      setSelectedPalette(0);
    }
  }, [isOpen, initialKind, defaultParentId]);

  if (!isOpen) return null;

  const folderDestinations = collections.filter((c) => c.kind === "folder");
  const encyclopediaDestinations = kind === "book" ? collections.filter((c) => c.kind === "encyclopedia") : [];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const pal = BOOK_COVER_PALETTES[selectedPalette] || BOOK_COVER_PALETTES[0];
    const payload = {
      kind,
      title: title.trim(),
      tagline: tagline.trim(),
      parentId: parentId === "root" ? null : parentId,
      cover:
        kind === "book"
          ? {
              from: pal.from,
              to: pal.to,
              icon: "book",
            }
          : undefined,
    };

    onCreate(payload);
    onClose();
  };

  const getKindTitle = () => {
    if (kind === "book") return ui.libraryCreateBookTitle || (lang === "ar" ? "إنشاء كتاب جديد" : "Create New Book");
    if (kind === "encyclopedia") return ui.libraryCreateEncyclopediaTitle || (lang === "ar" ? "إنشاء موسوعة جديدة" : "Create New Encyclopedia");
    return ui.libraryCreateFolderTitle || (lang === "ar" ? "إنشاء مجلد جديد" : "Create New Folder");
  };

  const getKindSub = () => {
    if (kind === "book") return lang === "ar" ? "أدخل تفاصيل الكتاب الجديد واختر موقعه ومظهره لبدء بناء الشجرة." : "Enter book details, select location and theme to start building.";
    if (kind === "encyclopedia") return lang === "ar" ? "الموسوعة هي وعاء يضم عدة كتب ذات صلة ببعضها البعض." : "An encyclopedia groups multiple related books into one container.";
    return lang === "ar" ? "المجلد يساعدك في تنظيم وتصنيف الكتب والموسوعات داخل مجلدات رئيسية وفرعية." : "Folders help you organize books and encyclopedias hierarchically.";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 educraft-modal-in max-h-[90vh] overflow-y-auto"
        style={{
          background: theme.surface,
          borderColor: skinBorderColor(skin, theme),
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{
                background: kind === "book" ? theme.accentSoft : kind === "encyclopedia" ? "rgba(99, 102, 241, 0.15)" : "rgba(245, 158, 11, 0.15)",
                color: kind === "book" ? theme.accent : kind === "encyclopedia" ? "#6366F1" : "#F59E0B",
              }}
            >
              {kind === "book" ? <BookOpen size={24} /> : kind === "encyclopedia" ? <BookCopy size={24} /> : <FolderPlus size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: ui.displayFont, color: theme.ink }}>
                {getKindTitle()}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.inkSoft, lineHeight: 1.4 }}>
                {getKindSub()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: theme.ink }}
            aria-label={ui.closeModal || "Close"}
          >
            <X size={18} />
          </button>
        </div>

        {/* Kind tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl mb-5" style={{ background: theme.hairlineSoft || "rgba(0,0,0,0.04)" }}>
          <button
            type="button"
            onClick={() => setKind("book")}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              kind === "book" ? "shadow-sm" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              background: kind === "book" ? theme.surface : "transparent",
              color: kind === "book" ? theme.accent : theme.ink,
            }}
          >
            <BookOpen size={13} />
            <span>{ui.libraryNewBook || (lang === "ar" ? "كتاب" : "Book")}</span>
          </button>
          <button
            type="button"
            onClick={() => setKind("encyclopedia")}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              kind === "encyclopedia" ? "shadow-sm" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              background: kind === "encyclopedia" ? theme.surface : "transparent",
              color: kind === "encyclopedia" ? "#6366F1" : theme.ink,
            }}
          >
            <BookCopy size={13} />
            <span>{ui.encyclopediaBadge || (lang === "ar" ? "موسوعة" : "Encyclopedia")}</span>
          </button>
          <button
            type="button"
            onClick={() => setKind("folder")}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              kind === "folder" ? "shadow-sm" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              background: kind === "folder" ? theme.surface : "transparent",
              color: kind === "folder" ? "#F59E0B" : theme.ink,
            }}
          >
            <FolderPlus size={13} />
            <span>{ui.folderBadge || (lang === "ar" ? "مجلد" : "Folder")}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: theme.ink }}>
              {ui.libraryTitleLabel || (lang === "ar" ? "العنوان" : "Title")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                kind === "book"
                  ? (lang === "ar" ? "مثال: أساسيات علوم الحاسوب" : "e.g., Computer Science Essentials")
                  : kind === "encyclopedia"
                  ? (lang === "ar" ? "مثال: موسوعة تطوير الويب الشاملة" : "e.g., Fullstack Web Development")
                  : (lang === "ar" ? "مثال: مقررات 2026" : "e.g., Courses 2026")
              }
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all"
              style={{
                background: theme.canvas,
                borderColor: theme.hairlineStrong,
                color: theme.ink,
              }}
              required
            />
          </div>

          {/* Tagline / Subtitle */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: theme.inkSoft }}>
              {ui.libraryTaglineLabel || (lang === "ar" ? "الوصف أو النبذة المختصرة" : "Description / Tagline")}
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder={lang === "ar" ? "نبذة توضيحية اختيارية..." : "Optional brief description..."}
              className="w-full px-3.5 py-2 text-sm rounded-xl border outline-none transition-all"
              style={{
                background: theme.canvas,
                borderColor: theme.hairlineStrong,
                color: theme.ink,
              }}
            />
          </div>

          {/* Location / Parent Picker */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: theme.ink }}>
              {ui.libraryLocationLabel || (lang === "ar" ? "الموقع / الحفظ داخل" : "Location / Save Inside")}
            </label>
            <div className="relative">
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all font-semibold cursor-pointer"
                style={{
                  background: theme.canvas,
                  borderColor: theme.hairlineStrong,
                  color: theme.ink,
                }}
              >
                <option value="root">🏠 {lang === "ar" ? "المكتبة الرئيسية (الرف العام)" : "Main Library (Root)"}</option>
                {folderDestinations.length > 0 && (
                  <optgroup label={lang === "ar" ? "📁 المجلدات" : "📁 Folders"}>
                    {folderDestinations.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.title}
                      </option>
                    ))}
                  </optgroup>
                )}
                {encyclopediaDestinations.length > 0 && (
                  <optgroup label={lang === "ar" ? "📚 الموسوعات" : "📚 Encyclopedias"}>
                    {encyclopediaDestinations.map((enc) => (
                      <option key={enc.id} value={enc.id}>
                        📚 {enc.title}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <div className="absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none opacity-60">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Cover Color Picker (for Books) */}
          {kind === "book" && (
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: theme.inkSoft }}>
                {ui.libraryCoverThemeLabel || (lang === "ar" ? "سمة الغلاف" : "Cover Theme")}
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {BOOK_COVER_PALETTES.map((pal, idx) => {
                  const isSelected = selectedPalette === idx;
                  return (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => setSelectedPalette(idx)}
                      className={`w-8 h-8 rounded-xl transition-all transform flex items-center justify-center cursor-pointer ${
                        isSelected ? "scale-110 shadow-md ring-2 ring-offset-2" : "opacity-85 hover:scale-105"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${pal.from}, ${pal.to})`,
                        ringColor: pal.to,
                      }}
                      title={pal.name}
                    >
                      {isSelected && <Check size={14} className="text-white drop-shadow-sm" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t mt-2" style={{ borderColor: theme.hairline }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              style={{ color: theme.inkSoft }}
            >
              {ui.cancel || (lang === "ar" ? "إلغاء" : "Cancel")}
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="educraft-btn flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: theme.accent,
                color: theme.accentInk,
              }}
            >
              <Plus size={14} />
              <span>{ui.libraryCreateBtn || (lang === "ar" ? "إنشاء" : "Create")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =================================================================
   ConfirmDeleteModal — Custom modal replacing window.confirm
================================================================== */
function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  theme,
  skin,
  lang,
  ui,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl p-6 educraft-modal-in"
        style={{
          background: theme.surface,
          borderColor: skinBorderColor(skin, theme),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-red-500/10 text-red-500">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: theme.ink }}>
              {ui.libraryConfirmDeleteTitle || (lang === "ar" ? "تأكيد الحذف" : "Confirm Deletion")}
            </h3>
            {title && (
              <div className="text-xs font-semibold truncate max-w-xs mt-0.5" style={{ color: theme.accent }}>
                "{title}"
              </div>
            )}
          </div>
        </div>

        <p className="text-sm mb-6" style={{ color: theme.inkSoft, lineHeight: 1.6 }}>
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            style={{ color: theme.ink }}
          >
            {ui.cancel || (lang === "ar" ? "إلغاء" : "Cancel")}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="educraft-btn flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm cursor-pointer"
            style={{ background: "#EF4444" }}
          >
            <Trash2 size={13} />
            <span>{ui.libraryConfirmDeleteBtn || (lang === "ar" ? "تأكيد الحذف" : "Delete")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   LibraryView — the shelf. Each card is the cover + title + a
   quick tally of branches / questions inside that book's tree.
================================================================== */
function LibraryView({
  lang,
  ui,
  theme,
  dir,
  onOpen,
  skin,
  covers,
  onChangeCover,
  onClearCover,
  books,
  collections,
  libraryPath,
  onEnterCollection,
  onCrumb,
  onCreateCollection,
  onDeleteCollection,
  onAssignToCollection,
  onRemoveFromCollection,
  onMoveItem,
  onExportBook,
  onExportCollection,
  onOpenImportModal,
  onDeleteBook,
  plans = {},
  isExporting = false,
  onRescan,
  isScanning = false,
  onExportDatabase,
  onRestoreDatabase,
  onCreateNewBook,
  onOpenPluginsModal,
  disableHtmlExport = false,
}) {
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
  const atRoot = libraryPath.length === 0;
  const currentCollection = atRoot ? null : collections.find((c) => c.id === libraryPath[libraryPath.length - 1]);

  const [exportMenuBookId, setExportMenuBookId] = useState(null);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [createModalConfig, setCreateModalConfig] = useState({ isOpen: false, kind: "book", defaultParentId: null });
  const [deleteConfirmConfig, setDeleteConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

  useEffect(() => {
    if (!exportMenuBookId && !newMenuOpen && !toolsMenuOpen) return;
    const closeAll = () => {
      setExportMenuBookId(null);
      setNewMenuOpen(false);
      setToolsMenuOpen(false);
    };
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, [exportMenuBookId, newMenuOpen, toolsMenuOpen]);

  let itemBooks = [];
  let itemCollections = [];
  if (atRoot) {
    const { rootCollections, rootBooks } = rootLibraryItems(collections, books);
    itemCollections = rootCollections;
    itemBooks = rootBooks;
  } else if (currentCollection) {
    itemCollections = collections.filter((c) => (currentCollection.itemIds || []).includes(c.id));
    itemBooks = books.filter((b) => (currentCollection.itemIds || []).includes(b.id));
  }

  const handleMove = (itemId, targetId) => {
    if (onMoveItem) {
      onMoveItem(itemId, targetId);
    } else {
      if (onRemoveFromCollection) onRemoveFromCollection(itemId);
      if (targetId && targetId !== "root" && onAssignToCollection) {
        onAssignToCollection(itemId, targetId);
      }
    }
  };

  const handleModalCreate = ({ kind, title, tagline, parentId, cover }) => {
    if (kind === "book") {
      if (onCreateNewBook) {
        onCreateNewBook({ title, tagline, parentId, cover });
      }
    } else {
      if (onCreateCollection) {
        onCreateCollection({ kind, title, parentId });
      }
    }
  };

  const CollectionIcon = (kind) => (kind === "encyclopedia" ? BookCopy : FolderOpen);

  return (
    <section>
      {atRoot ? (
        <div className="text-center pt-4 pb-8 max-w-xl mx-auto">
          <p className="text-sm mb-3" style={{ color: theme.inkSoft }}>
            {ui.libraryKicker}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: ui.displayFont, color: theme.ink, lineHeight: 1.3 }}>
            {ui.libraryTitle}
          </h1>
          <p className="text-base" style={{ color: theme.inkSoft, lineHeight: 1.7 }}>
            {ui.librarySub}
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold mb-3 flex-wrap" style={{ color: theme.inkSoft }}>
            <button onClick={() => onCrumb(0)} className="hover:underline flex items-center gap-1 cursor-pointer" style={{ color: theme.inkSoft }}>
              <Home size={12} />
              <span>{ui.libraryRootCrumb}</span>
            </button>
            {libraryPath.map((id, i) => {
              const c = collections.find((x) => x.id === id);
              if (!c) return null;
              const isLast = i === libraryPath.length - 1;
              return (
                <span key={id} className="flex items-center gap-1.5">
                  <ChevronRight size={11} style={{ transform: dir === "rtl" ? "scaleX(-1)" : "none" }} />
                  <button
                    onClick={() => onCrumb(i + 1)}
                    className="hover:underline flex items-center gap-1 cursor-pointer"
                    style={{ color: isLast ? theme.ink : theme.inkSoft, fontWeight: isLast ? "bold" : "normal" }}
                  >
                    {c.kind === "encyclopedia" ? <BookCopy size={11} className="text-indigo-500" /> : <FolderOpen size={11} className="text-amber-500" />}
                    <span>{c.title}</span>
                  </button>
                </span>
              );
            })}
          </div>
          {currentCollection && (
            <div className="flex items-center justify-between gap-3 flex-wrap p-4 rounded-2xl border" style={{ background: theme.surface, borderColor: theme.hairline }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: currentCollection.kind === "encyclopedia" ? "rgba(99, 102, 241, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    color: currentCollection.kind === "encyclopedia" ? "#6366F1" : "#F59E0B",
                  }}
                >
                  {currentCollection.kind === "encyclopedia" ? <BookCopy size={20} /> : <FolderOpen size={20} />}
                </div>
                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full mb-1" style={{ background: theme.accentSoft, color: theme.accent }}>
                    {currentCollection.kind === "encyclopedia" ? ui.encyclopediaBadge : ui.folderBadge}
                  </span>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: ui.displayFont, color: theme.ink }}>
                    {currentCollection.title}
                  </h1>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmConfig({
                    isOpen: true,
                    title: currentCollection.title,
                    message: ui.libraryDeleteCollectionConfirm,
                    onConfirm: () => onDeleteCollection(currentCollection.id),
                  });
                }}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 transition-all hover:opacity-90 cursor-pointer"
                style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${INCORRECT.border}`, color: INCORRECT.border }}
              >
                <Trash2 size={13} />
                {ui.libraryDeleteCollection}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reworked Toolbar (available at Root and inside Collections) */}
      <div className="flex items-center justify-between gap-2.5 mb-6 flex-wrap">
        {/* Left: Creation Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Primary New Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setNewMenuOpen((v) => !v);
              }}
              className="educraft-btn flex items-center gap-2 text-xs font-bold px-3.5 py-2 shadow-sm cursor-pointer"
              style={{
                borderRadius: skin.radiusSm,
                background: theme.accent,
                color: theme.accentInk,
                minHeight: 38,
              }}
              title={ui.libraryNewItemBtn || "New"}
            >
              <Plus size={15} />
              <span>{ui.libraryNewItemBtn || (lang === "ar" ? "جديد" : "New")}</span>
              <ChevronDown size={11} className={`opacity-80 transition-transform duration-200 ${newMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {newMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-40 top-full mt-1.5 start-0 w-56 p-1.5 rounded-2xl shadow-2xl border flex flex-col gap-1 educraft-modal-in"
                style={{
                  background: theme.surface,
                  borderColor: theme.hairlineStrong,
                  boxShadow: "0 16px 36px -4px rgba(0,0,0,0.25)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {/* New Book */}
                <button
                  type="button"
                  onClick={() => {
                    setNewMenuOpen(false);
                    setCreateModalConfig({ isOpen: true, kind: "book", defaultParentId: currentCollection?.id || null });
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-xl text-start transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: theme.ink }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: theme.accentSoft, color: theme.accent }}>
                    <BookOpen size={14} />
                  </div>
                  <div>
                    <div className="font-bold">{ui.libraryNewBook || (lang === "ar" ? "كتاب جديد" : "New Book")}</div>
                    <div className="text-[10px] opacity-70" style={{ color: theme.inkSoft }}>
                      {lang === "ar" ? "منهج تفاعلي وشجرة أسئلة" : "Interactive curriculum"}
                    </div>
                  </div>
                </button>

                {/* New Encyclopedia (allowed at root or in folder) */}
                {(!currentCollection || currentCollection.kind === "folder") && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewMenuOpen(false);
                      setCreateModalConfig({ isOpen: true, kind: "encyclopedia", defaultParentId: currentCollection?.id || null });
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-xl text-start transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    style={{ color: theme.ink }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-indigo-500/10 text-indigo-500">
                      <BookCopy size={14} />
                    </div>
                    <div>
                      <div className="font-bold">{ui.libraryNewEncyclopedia || (lang === "ar" ? "موسوعة جديدة" : "New Encyclopedia")}</div>
                      <div className="text-[10px] opacity-70" style={{ color: theme.inkSoft }}>
                        {lang === "ar" ? "مجموعة كتب شاملة" : "Collection of books"}
                      </div>
                    </div>
                  </button>
                )}

                {/* New Folder (allowed at root or in folder) */}
                {(!currentCollection || currentCollection.kind === "folder") && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewMenuOpen(false);
                      setCreateModalConfig({ isOpen: true, kind: "folder", defaultParentId: currentCollection?.id || null });
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-xl text-start transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    style={{ color: theme.ink }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-500">
                      <FolderPlus size={14} />
                    </div>
                    <div>
                      <div className="font-bold">{currentCollection ? (lang === "ar" ? "مجلد فرعي جديد" : "New Subfolder") : (ui.libraryNewFolder || (lang === "ar" ? "مجلد جديد" : "New Folder"))}</div>
                      <div className="text-[10px] opacity-70" style={{ color: theme.inkSoft }}>
                        {lang === "ar" ? "تنظيم وهيكلة المحتوى" : "Organize books & items"}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick action buttons for fast access */}
          <button
            type="button"
            onClick={() => setCreateModalConfig({ isOpen: true, kind: "book", defaultParentId: currentCollection?.id || null })}
            className="hidden sm:flex educraft-btn items-center gap-1.5 text-xs font-bold px-3 py-2 cursor-pointer"
            style={{
              borderRadius: skin.radiusSm,
              border: `1.5px solid ${skinBorderColor(skin, theme)}`,
              background: theme.surface,
              color: theme.ink,
              minHeight: 38,
            }}
            title={ui.libraryNewBook}
          >
            <BookOpen size={13} style={{ color: theme.accent }} />
            <span>{ui.libraryNewBook || (lang === "ar" ? "كتاب جديد" : "New Book")}</span>
          </button>

          {(!currentCollection || currentCollection.kind === "folder") && (
            <>
              <button
                type="button"
                onClick={() => setCreateModalConfig({ isOpen: true, kind: "encyclopedia", defaultParentId: currentCollection?.id || null })}
                className="hidden md:flex educraft-btn items-center gap-1.5 text-xs font-bold px-3 py-2 cursor-pointer"
                style={{
                  borderRadius: skin.radiusSm,
                  border: `1.5px solid ${skinBorderColor(skin, theme)}`,
                  background: theme.surface,
                  color: theme.ink,
                  minHeight: 38,
                }}
                title={ui.libraryNewEncyclopedia}
              >
                <BookCopy size={13} className="text-indigo-500" />
                <span>{ui.libraryNewEncyclopedia || (lang === "ar" ? "موسوعة جديدة" : "New Encyclopedia")}</span>
              </button>

              <button
                type="button"
                onClick={() => setCreateModalConfig({ isOpen: true, kind: "folder", defaultParentId: currentCollection?.id || null })}
                className="hidden md:flex educraft-btn items-center gap-1.5 text-xs font-bold px-3 py-2 cursor-pointer"
                style={{
                  borderRadius: skin.radiusSm,
                  border: `1.5px solid ${skinBorderColor(skin, theme)}`,
                  background: theme.surface,
                  color: theme.ink,
                  minHeight: 38,
                }}
                title={ui.libraryNewFolder}
              >
                <FolderPlus size={13} className="text-amber-500" />
                <span>{currentCollection ? (lang === "ar" ? "مجلد فرعي" : "Subfolder") : (ui.libraryNewFolder || (lang === "ar" ? "مجلد جديد" : "New Folder"))}</span>
              </button>
            </>
          )}
        </div>

        {/* Right: Tools & Maintenance */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenImportModal}
            className="educraft-btn flex items-center gap-1.5 text-xs font-bold px-3 py-2 cursor-pointer"
            style={{
              borderRadius: skin.radiusSm,
              border: `1.5px solid ${skinBorderColor(skin, theme)}`,
              background: theme.surface,
              color: theme.ink,
              minHeight: 38,
            }}
            title={ui.libraryImportJson}
          >
            <FileUp size={13} style={{ color: theme.accent }} />
            <span className="hidden sm:inline">{ui.libraryImportJson}</span>
          </button>

          {onOpenPluginsModal && (
            <button
              type="button"
              onClick={onOpenPluginsModal}
              className="educraft-btn flex items-center gap-1.5 text-xs font-bold px-3 py-2 cursor-pointer"
              style={{
                borderRadius: skin.radiusSm,
                border: `1.5px solid ${skinBorderColor(skin, theme)}`,
                background: theme.surface,
                color: theme.ink,
                minHeight: 38,
              }}
              title={lang === "ar" ? "إضافات تيتانيوم (Titanium Plugins)" : "Titanium Plugins"}
            >
              <Blocks size={13} className="text-amber-500" />
              <span className="hidden sm:inline">{lang === "ar" ? "الإضافات" : "Plugins"}</span>
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setToolsMenuOpen((v) => !v);
              }}
              className="educraft-btn flex items-center gap-1.5 text-xs font-bold px-3 py-2 cursor-pointer"
              style={{
                borderRadius: skin.radiusSm,
                border: `1.5px solid ${skinBorderColor(skin, theme)}`,
                background: theme.surface,
                color: theme.ink,
                minHeight: 38,
              }}
              title={lang === "ar" ? "أدوات المكتبة وقاعدة البيانات" : "Library Tools & Database"}
            >
              <Database size={13} />
              <span className="hidden md:inline">{lang === "ar" ? "أدوات" : "Tools"}</span>
              <ChevronDown size={10} className="opacity-60" />
            </button>

            {toolsMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-40 top-full mt-1.5 end-0 w-52 p-1.5 rounded-2xl shadow-2xl border flex flex-col gap-1 educraft-modal-in"
                style={{
                  background: theme.surface,
                  borderColor: theme.hairlineStrong,
                  boxShadow: "0 16px 36px -4px rgba(0,0,0,0.25)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {onRescan && (
                  <button
                    type="button"
                    onClick={() => {
                      setToolsMenuOpen(false);
                      onRescan();
                    }}
                    disabled={isScanning}
                    className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold rounded-xl text-start transition-colors hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 cursor-pointer"
                    style={{ color: theme.ink }}
                  >
                    <RotateCcw size={13} className={isScanning ? "animate-spin text-indigo-500" : ""} />
                    <span>{lang === "ar" ? (isScanning ? "جارٍ الفحص..." : "تحديث المكتبة من القرص") : (isScanning ? "Scanning..." : "Rescan Library")}</span>
                  </button>
                )}

                {onExportDatabase && (
                  <button
                    type="button"
                    onClick={() => {
                      setToolsMenuOpen(false);
                      onExportDatabase();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold rounded-xl text-start transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    style={{ color: theme.ink }}
                  >
                    <FileDown size={13} />
                    <span>{ui.exportDatabaseBackupLabel}</span>
                  </button>
                )}

                {onRestoreDatabase && (
                  <button
                    type="button"
                    onClick={() => {
                      setToolsMenuOpen(false);
                      onRestoreDatabase();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold rounded-xl text-start transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    style={{ color: theme.ink }}
                  >
                    <FileUp size={13} />
                    <span>{ui.restoreDatabaseBackupLabel}</span>
                  </button>
                )}

                {onOpenPluginsModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setToolsMenuOpen(false);
                      onOpenPluginsModal();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold rounded-xl text-start transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer border-t pt-2"
                    style={{ color: theme.ink, borderColor: theme.hairline }}
                  >
                    <Blocks size={13} className="text-amber-500" />
                    <span>{lang === "ar" ? "إضافات تيتانيوم (Plugins)" : "Titanium Plugins"}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty shelf state at Root */}
      {atRoot && itemCollections.length === 0 && itemBooks.length === 0 && (
        <div
          className="p-8 sm:p-14 text-center rounded-2xl border flex flex-col items-center justify-center gap-3 my-4 educraft-panel-in"
          style={{ background: theme.surface, borderColor: theme.hairline }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: theme.accentSoft, color: theme.accent }}>
            <BookOpen size={28} />
          </div>
          <h3 className="text-xl font-bold" style={{ fontFamily: ui.displayFont, color: theme.ink }}>
            {lang === "ar" ? "المكتبة فارغة حالياً" : "Your Library is Empty"}
          </h3>
          <p className="text-sm max-w-md" style={{ color: theme.inkSoft, lineHeight: 1.6 }}>
            {lang === "ar"
              ? "ابدأ بإنشاء كتاب جديد لبنائه يدوياً وتطوير شجرة معرفته، أو استورد كتباً مجهزة مسبقاً بصيغة JSON."
              : "Start by creating a new book from scratch to build its knowledge tree, or import existing books via JSON."}
          </p>
          <div className="flex items-center gap-3 mt-3 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setCreateModalConfig({ isOpen: true, kind: "book", defaultParentId: null })}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
              style={{ borderRadius: skin.radiusSm, background: theme.accent, color: theme.accentInk }}
            >
              <Plus size={15} />
              {ui.createNewBookCta}
            </button>
            <button
              type="button"
              onClick={onOpenImportModal}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 transition-all hover:scale-105 cursor-pointer"
              style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink }}
            >
              <FileUp size={15} />
              {ui.libraryImportJson}
            </button>
          </div>
        </div>
      )}

      {/* Empty state inside Collection */}
      {!atRoot && itemCollections.length === 0 && itemBooks.length === 0 && (
        <div
          className="p-8 sm:p-12 text-center rounded-2xl border flex flex-col items-center justify-center gap-3 my-4 educraft-panel-in"
          style={{ background: theme.surface, borderColor: theme.hairline }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: theme.accentSoft, color: theme.accent }}>
            {currentCollection?.kind === "encyclopedia" ? <BookCopy size={24} /> : <FolderOpen size={24} />}
          </div>
          <h3 className="text-lg font-bold" style={{ color: theme.ink }}>
            {currentCollection?.kind === "encyclopedia"
              ? (lang === "ar" ? "الموسوعة فارغة حالياً" : "Encyclopedia is Empty")
              : (lang === "ar" ? "المجلد فارغ حالياً" : "Folder is Empty")}
          </h3>
          <p className="text-xs max-w-sm" style={{ color: theme.inkSoft, lineHeight: 1.6 }}>
            {currentCollection?.kind === "encyclopedia"
              ? (lang === "ar" ? "أضف كتباً إلى هذه الموسوعة أو أنشئ كتاباً جديداً بداخلها مباشرة." : "Add books to this encyclopedia or create a new book inside it.")
              : (lang === "ar" ? "أنشئ كتباً، موسوعات، أو مجلدات فرعية داخل هذا المجلد، أو انقل عناصر إليه من المكتبة." : "Create books, encyclopedias, or subfolders here, or move items into this folder.")}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => setCreateModalConfig({ isOpen: true, kind: "book", defaultParentId: currentCollection.id })}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
              style={{ background: theme.accent, color: theme.accentInk }}
            >
              <Plus size={14} />
              <span>{lang === "ar" ? "إنشاء كتاب هنا" : "Create Book Here"}</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Collections (Folders and Encyclopedias) */}
        {itemCollections.map((col) => {
          const Icon = CollectionIcon(col.kind);
          const childCount = (col.itemIds || []).length;
          return (
            <div
              key={col.id}
              className="group flex gap-4 p-4 text-start"
              style={{ ...panelStyle(skin, theme), cursor: "pointer" }}
              onClick={() => onEnterCollection(col.id)}
              role="button"
              tabIndex={0}
            >
              <div className="shrink-0 grid place-items-center" style={{ width: 96, height: 126, borderRadius: skin.radiusMd * 0.7, background: theme.accentSoft, color: theme.accent }}>
                <Icon size={34} />
              </div>
              <div className="flex flex-1 min-w-0 flex-col justify-between py-1">
                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full mb-1.5" style={{ background: theme.accentSoft, color: theme.accent }}>
                    {col.kind === "encyclopedia" ? ui.encyclopediaBadge : ui.folderBadge}
                  </span>
                  <h3 className="text-lg font-bold leading-snug" style={{ color: theme.ink }}>
                    {col.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <span className="text-xs font-semibold" style={{ color: theme.inkSoft }}>
                    {childCount} {ui.booksCountLabel}
                  </span>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {!disableHtmlExport && onExportCollection && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportCollection(col);
                        }}
                        disabled={isExporting}
                        className="p-1.5 transition-all hover:scale-110 disabled:opacity-40 cursor-pointer"
                        style={{ borderRadius: skin.radiusSm, color: theme.inkSoft }}
                        aria-label={ui.treeExportCta}
                        title={ui.treeExportCta}
                      >
                        <FileDown size={13} />
                      </button>
                    )}
                    {/* Custom Apple-grade Move Dropdown */}
                    <ItemMoveDropdown
                      item={col}
                      itemType={col.kind}
                      collections={collections}
                      currentParentId={currentCollection?.id || null}
                      onMove={handleMove}
                      theme={theme}
                      skin={skin}
                      lang={lang}
                      dir={dir}
                    />
                    {/* Delete collection button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmConfig({
                          isOpen: true,
                          title: col.title,
                          message: ui.libraryDeleteCollectionConfirm,
                          onConfirm: () => onDeleteCollection(col.id),
                        });
                      }}
                      className="p-1.5 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ borderRadius: skin.radiusSm, color: INCORRECT.border }}
                      aria-label={ui.libraryDeleteCollection}
                      title={ui.libraryDeleteCollection}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Books */}
        {itemBooks.map((book) => {
          const branchCount = book.nodes.filter((n) => n.level === "branch").length;
          const questionCount = book.nodes.reduce((sum, n) => sum + (n.level === "leaf" ? leafCards(n).reduce((s, g) => s + g.questions.length, 0) : 0), 0);
          const totalLeaves = book.nodes.filter((n) => n.level === "leaf").length;
          const doneLeaves = (plans[book.id]?.doneLeafIds || []).filter((id) => book.nodes.some((n) => n.id === id)).length;
          const progressPct = totalLeaves > 0 ? Math.round((doneLeaves / totalLeaves) * 100) : 0;

          return (
            <div
              key={book.id}
              className="group flex gap-4 p-4 text-start transition-transform"
              style={{ ...panelStyle(skin, theme), cursor: "pointer" }}
              onClick={() => onOpen(book.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(book.id)}
            >
              <div className="shrink-0" style={{ width: 96, height: 126, borderRadius: skin.radiusMd * 0.7, overflow: "hidden" }}>
                <EditableCover book={book} theme={theme} skin={skin} ui={ui} coverUrl={covers[book.id]} onChangeCover={onChangeCover} onClearCover={onClearCover} radius={skin.radiusMd * 0.7} />
              </div>
              <div className="flex flex-1 min-w-0 flex-col justify-between py-1">
                <div>
                  <h3 className="text-lg font-bold leading-snug mb-1" style={{ color: theme.ink }}>
                    {book[lang]?.title || book.id}
                  </h3>
                  <p className="text-sm" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
                    {book[lang]?.tagline}
                  </p>
                  {book._state && book._state !== "valid" && (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 w-fit">
                      <span>⚠️</span>
                      <span>{book._state === "incomplete" ? (lang === "ar" ? "غير مكتمل" : "Incomplete") : (lang === "ar" ? "تالف" : "Invalid")}</span>
                      {book._error && <span className="opacity-75 truncate max-w-xs font-normal">({book._error})</span>}
                    </div>
                  )}
                  {doneLeaves > 0 && (
                    <div className="mt-2.5 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[11px] font-bold" style={{ color: progressPct === 100 ? "#10B981" : theme.accent }}>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={11} className={progressPct === 100 ? "text-emerald-500" : ""} />
                          {progressPct === 100 ? (lang === "ar" ? "مكتمل بالكامل ✨" : "Fully Completed ✨") : `${doneLeaves}/${totalLeaves} ${lang === "ar" ? "أوراق مكتملة" : "leaves completed"}`}
                        </span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: theme.hairlineStrong }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, background: progressPct === 100 ? "#10B981" : theme.accent }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <span className="text-xs font-semibold" style={{ color: theme.inkSoft }}>
                    {branchCount} {ui.branchesLabel} · {questionCount} {ui.questionsLabel}
                  </span>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {onExportBook && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExportMenuBookId((prev) => (prev === book.id ? null : book.id));
                          }}
                          disabled={isExporting}
                          className="flex items-center gap-0.5 p-1.5 transition-all hover:scale-105 disabled:opacity-40 cursor-pointer"
                          style={{ borderRadius: skin.radiusSm, color: theme.inkSoft }}
                          aria-label={ui.treeExportCta}
                          title={ui.treeExportCta}
                        >
                          <FileDown size={13} />
                          <ChevronDown size={9} className="opacity-60 -me-0.5" />
                        </button>

                        {exportMenuBookId === book.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute z-30 bottom-full mb-1.5 end-0 min-w-[145px] p-1 rounded-xl shadow-xl border flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
                            style={{
                              background: theme.surface,
                              borderColor: theme.hairlineStrong,
                              color: theme.ink,
                            }}
                          >
                            {!disableHtmlExport && (
                              <button
                                type="button"
                                onClick={() => {
                                  setExportMenuBookId(null);
                                  onExportBook(book, "html");
                                }}
                                className="flex items-center gap-2 w-full text-start px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                                style={{ color: theme.ink }}
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span className="flex-1 truncate">{ui.exportOptionHtml}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setExportMenuBookId(null);
                                onExportBook(book, "json");
                              }}
                              className="flex items-center gap-2 w-full text-start px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                              style={{ color: theme.ink }}
                            >
                              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                              <span className="flex-1 truncate">{ui.exportOptionJson}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {onDeleteBook && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBook(book);
                        }}
                        className="p-1.5 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ borderRadius: skin.radiusSm, color: INCORRECT.border }}
                        aria-label={ui.libraryDeleteBook}
                        title={ui.libraryDeleteBook}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    {/* Custom Apple-grade Move Dropdown */}
                    <ItemMoveDropdown
                      item={book}
                      itemType="book"
                      collections={collections}
                      currentParentId={currentCollection?.id || null}
                      onMove={handleMove}
                      theme={theme}
                      skin={skin}
                      lang={lang}
                      dir={dir}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Creation Modal */}
      <CreateItemModal
        isOpen={createModalConfig.isOpen}
        onClose={() => setCreateModalConfig((prev) => ({ ...prev, isOpen: false }))}
        initialKind={createModalConfig.kind}
        defaultParentId={createModalConfig.defaultParentId}
        collections={collections}
        onCreate={handleModalCreate}
        theme={theme}
        skin={skin}
        lang={lang}
        dir={dir}
        ui={ui}
      />

      {/* Confirm Deletion Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmConfig.isOpen}
        onClose={() => setDeleteConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteConfirmConfig.onConfirm}
        title={deleteConfirmConfig.title}
        message={deleteConfirmConfig.message}
        theme={theme}
        skin={skin}
        lang={lang}
        ui={ui}
      />
    </section>
  );
}

/* =================================================================
   TreeView — breadcrumb back to the library, the book's own mini
   cover + title, its knowledge tree, and — once a leaf is picked —
   the question deck for that leaf.
================================================================== */
function TreeView({ book, lang, ui, theme, dir, onBack, skin, selectedLeaf, onSelectLeaf, onBrowse, onReadThrough, onPlanner, onEditor, onExport, covers, onChangeCover, onClearCover, bookFlavorId, onChangeBookFlavor, onDeleteBook, plan }) {
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <section>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5" style={{ color: theme.inkSoft, minHeight: 40 }}>
        <BackIcon size={15} />
        {ui.backToLibrary}
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="shrink-0" style={{ width: 56, height: 74, borderRadius: skin.radiusMd * 0.55, overflow: "hidden" }}>
            <EditableCover book={book} theme={theme} skin={skin} ui={ui} coverUrl={covers[book.id]} onChangeCover={onChangeCover} onClearCover={onClearCover} radius={skin.radiusMd * 0.55} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words" style={{ fontFamily: ui.displayFont, color: theme.ink, lineHeight: 1.25 }}>
              {book[lang]?.title || book.en?.title || book.ar?.title}
            </h1>
            <p className="text-xs sm:text-sm line-clamp-2 mt-0.5" style={{ color: theme.inkSoft }}>
              {book[lang]?.tagline || book.en?.tagline || book.ar?.tagline}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center">
          {onReadThrough && (
            <button
              type="button"
              onClick={onReadThrough}
              className="educraft-btn flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2.5 cursor-pointer"
              style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, background: theme.surface, minHeight: 42 }}
            >
              <BookOpen size={15} style={{ color: theme.accent }} />
              <span className="truncate">{ui.readThroughCta}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onBrowse}
            className="educraft-btn flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2.5 cursor-pointer"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, background: theme.surface, minHeight: 42 }}
          >
            <ListFilter size={15} style={{ color: theme.accent }} />
            <span className="truncate">{ui.browseCta}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap w-full">
        {onChangeBookFlavor && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 max-w-full overflow-x-auto scrollbar-none" style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, background: theme.surface }}>
            <Palette size={13} className="shrink-0" style={{ color: theme.inkSoft }} />
            <span className="text-[11px] font-bold me-1 shrink-0" style={{ color: theme.inkSoft }}>
              {ui.bookFlavorLabel || (lang === "ar" ? "نكهة الكتاب:" : "Flavor:")}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {Object.entries(FLAVORS).map(([fid, f]) => {
                const pal = f[theme === FLAVORS[fid]?.dark ? "dark" : "light"] || f.light;
                const isSelected = bookFlavorId === fid;
                return (
                  <button
                    key={fid}
                    type="button"
                    onClick={() => onChangeBookFlavor(fid)}
                    className="relative p-0.5 rounded-full transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      border: isSelected ? `2px solid ${theme.ink}` : "1.5px solid transparent",
                      boxShadow: isSelected ? `0 0 0 1px ${theme.accent}` : "none",
                    }}
                    title={f[lang] || fid}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex overflow-hidden"
                      style={{ border: `1px solid ${pal.hairlineStrong}` }}
                    >
                      <span className="w-1/2 h-full" style={{ background: pal.canvas }} />
                      <span className="w-1/2 h-full" style={{ background: pal.accent }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {onEditor && (
          <button
            type="button"
            onClick={onEditor}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 cursor-pointer"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
            title={ui.navEditor}
          >
            <Settings size={13} />
            {ui.navEditor}
          </button>
        )}

        <button
          onClick={onPlanner}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 cursor-pointer"
          style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
        >
          <CalendarDays size={13} />
          {ui.treePlannerCta}
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 cursor-pointer"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
          >
            <FileDown size={13} />
            {ui.treeExportCta}
          </button>
        )}
        {onDeleteBook && (
          <button
            onClick={() => {
              onDeleteBook(book);
            }}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 hover:opacity-90 transition-opacity cursor-pointer"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${INCORRECT.border}`, color: INCORRECT.border, minHeight: 36 }}
            title={ui.libraryDeleteBook}
          >
            <Trash2 size={13} />
            {ui.libraryDeleteBook}
          </button>
        )}
      </div>

      {(book?.nodes || []).length === 0 ? (
        <div
          className="p-8 sm:p-14 text-center rounded-2xl border flex flex-col items-center justify-center gap-3 my-4 educraft-panel-in"
          style={{ background: theme.surface, borderColor: theme.hairline }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: theme.accentSoft, color: theme.accent }}>
            <GitBranch size={28} />
          </div>
          <h3 className="text-xl font-bold" style={{ fontFamily: ui.displayFont, color: theme.ink }}>
            {lang === "ar" ? "شجرة هذا الكتاب فارغة" : "This Book's Tree is Empty"}
          </h3>
          <p className="text-sm max-w-md" style={{ color: theme.inkSoft, lineHeight: 1.6 }}>
            {lang === "ar"
              ? "لم تتم إضافة أي فروع أو أوراق بعد. افتح المحرر لبدء إضافة الفروع والكروت والأسئلة يدوياً."
              : "No branches or leaves have been added yet. Open the Editor to start building branches and questions manually."}
          </p>
          {onEditor && (
            <button
              type="button"
              onClick={onEditor}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 shadow-sm transition-all hover:scale-105 cursor-pointer mt-2"
              style={{ borderRadius: skin.radiusSm, background: theme.accent, color: theme.accentInk }}
            >
              <PenLine size={15} />
              {lang === "ar" ? "فتح المحرر لبناء الشجرة" : "Open Editor to Build Tree"}
            </button>
          )}
        </div>
      ) : (
        <div className="p-6 sm:p-8" style={panelStyle(skin, theme)}>
          <p className="text-xs font-semibold mb-2" style={{ color: theme.accent }}>
            {ui.treeEyebrow}
        </p>
        <p className="text-sm mb-6 max-w-lg" style={{ color: theme.inkSoft, lineHeight: 1.7 }}>
          {ui.treeSub}
        </p>
        <KnowledgeTree book={book} lang={lang} dir={dir} theme={theme} ui={ui} skin={skin} selected={selectedLeaf} onSelect={onSelectLeaf} doneLeafIds={plan?.doneLeafIds || []} />
      </div>
      )}
    </section>
  );
}

/* =================================================================
   DeckView — the destination the tree points to. Full-screen home
   for one leaf's question card(s): a breadcrumb back to that book's
   tree, the leaf's name, and the NodeQuestionDeck itself (paged or
   scroll, per Settings). The tree never renders here — this screen
   is reached only by tapping a leaf.
================================================================== */
/* =================================================================
   LeafErrorBoundary — Guarantees clicking a leaf NEVER crashes or opens a blank page.
================================================================== */
class LeafErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[EDUcraft] Leaf render error caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      const { theme, skin, lang, onBack } = this.props;
      return (
        <div
          className="flex flex-col items-center justify-center gap-4 p-8 sm:p-12 rounded-2xl border my-6 text-center"
          style={{
            background: theme?.surface || "#FFFFFF",
            borderColor: theme?.hairlineStrong || "#E5E7EB",
            minHeight: 260
          }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>
            ⚠️
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold" style={{ color: theme?.ink }}>
              {lang === "ar" ? "تعذر عرض محتوى هذه الورقة مؤقتًا" : "Could not load leaf content"}
            </h3>
            <p className="text-xs sm:text-sm mt-1" style={{ color: theme?.inkSoft }}>
              {lang === "ar" ? "حدث خطأ غير متوقع أثناء معالجة بيانات الورقة." : "An unexpected error occurred while rendering this leaf."}
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{
                background: theme?.accent || "#4F46E5",
                color: theme?.accentInk || "#FFFFFF"
              }}
            >
              {lang === "ar" ? "العودة إلى الشجرة" : "Back to Tree"}
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

/* =================================================================
   DeckView — the destination the tree points to. Full-screen home
   for a leaf's content:
   - A4 Educational Sheets (leaf.pageBlocks)
   - Interactive Question Deck (leaf.cards / leaf.questions)
   - Fluid tab switcher when both exist
================================================================== */
function DeckView({ node, book, lang, ui, theme, dir, skin, cardMode, scrollDir, onBack, plan, onToggleLeafDone, onAnswered }) {
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const isDone = plan?.doneLeafIds?.includes(node?.id);

  const hasPages = Boolean(node?.pageBlocks && node.pageBlocks.length > 0);
  const cards = useMemo(() => leafCards(node), [node]);
  const hasCards = cards.length > 0;

  const [activeTab, setActiveTab] = useState(() => (hasPages ? "pages" : "deck"));

  // Ensure active tab points to available content
  useEffect(() => {
    if (hasPages && !hasCards) setActiveTab("pages");
    else if (!hasPages && hasCards) setActiveTab("deck");
  }, [hasPages, hasCards]);

  const leafTitle = node ? (node[lang] || node.ar || node.en || node.id) : "";

  return (
    <LeafErrorBoundary theme={theme} skin={skin} lang={lang} onBack={onBack}>
      <section>
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: theme.inkSoft, minHeight: 40 }}>
            <BackIcon size={15} />
            <span>{book?.[lang]?.title || book?.id}</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tab switcher if both A4 pages and questions exist */}
            {hasPages && hasCards && (
              <div
                className="flex items-center p-1 rounded-xl"
                style={{ background: theme.surface, border: `1px solid ${theme.hairline}` }}
              >
                <button
                  onClick={() => setActiveTab("pages")}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: activeTab === "pages" ? theme.accent : "transparent",
                    color: activeTab === "pages" ? theme.accentInk : theme.inkSoft,
                  }}
                >
                  <FileText size={13} />
                  <span>{lang === "ar" ? "المحتوى والقراءة" : "Study & Reading"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("deck")}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: activeTab === "deck" ? theme.accent : "transparent",
                    color: activeTab === "deck" ? theme.accentInk : theme.inkSoft,
                  }}
                >
                  <Layers size={13} />
                  <span>{lang === "ar" ? "الأسئلة والتمارين" : "Questions"}</span>
                </button>
              </div>
            )}

            {onToggleLeafDone && node && (
              <button
                onClick={() => onToggleLeafDone(node.id)}
                className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl transition-all hover:opacity-90"
                style={{
                  background: isDone ? "#10B981" : theme.surface,
                  color: isDone ? "#FFFFFF" : theme.ink,
                  border: `1.5px solid ${isDone ? "#10B981" : theme.hairlineStrong}`,
                  minHeight: 38
                }}
              >
                <CheckCircle2 size={14} />
                <span>{isDone ? (lang === "ar" ? "مكتملة ومحفوظة ✓" : "Completed ✓") : (lang === "ar" ? "تحديد كمكتملة" : "Mark as completed")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Render Area */}
        {hasPages && activeTab === "pages" ? (
          <SingleLeafA4Preview leaf={node} book={book} lang={lang} theme={theme} skin={skin} />
        ) : hasCards ? (
          <NodeQuestionDeck node={node} book={book} lang={lang} ui={ui} theme={theme} dir={dir} skin={skin} cardMode={cardMode} scrollDir={scrollDir} onAnswered={onAnswered} />
        ) : hasPages ? (
          <SingleLeafA4Preview leaf={node} book={book} lang={lang} theme={theme} skin={skin} />
        ) : (
          <div className="p-10 text-center" style={panelStyle(skin, theme)}>
            <p className="text-base font-bold mb-2" style={{ color: theme.ink }}>
              {leafTitle}
            </p>
            <p className="text-sm font-semibold mb-5" style={{ color: theme.inkSoft }}>
              {lang === "ar" ? "هذه الورقة لا تحتوي على محتوى أو أسئلة بعد." : "This leaf does not contain content or questions yet."}
            </p>
            <button
              onClick={onBack}
              className="text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
              style={{ background: theme.accent, color: theme.accentInk }}
            >
              {ui.backToTree || (lang === "ar" ? "العودة إلى الشجرة" : "Back to Tree")}
            </button>
          </div>
        )}
      </section>
    </LeafErrorBoundary>
  );
}

/* =================================================================
   ReadThroughView — pages through every leaf in the book, once,
   start to finish, in tree order (branch → sub-branch → leaf, as
   the nodes array is authored). Unlike DeckView (one leaf's
   question deck) this steps leaf-to-leaf across the whole book, so
   the reader can "read the book cover to cover" without going back
   to the tree between leaves.
================================================================== */
function ReadThroughView({ book, lang, ui, theme, dir, skin, cardMode, scrollDir, onBack }) {
  const leaves = useMemo(() => book.nodes.filter((n) => n.level === "leaf"), [book]);
  const [index, setIndex] = useState(0);
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;

  useEffect(() => setIndex(0), [book.id]);

  const leaf = leaves[index];
  if (!leaf) {
    return (
      <section>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5" style={{ color: theme.inkSoft, minHeight: 40 }}>
          <BackIcon size={15} />
          {book[lang].title}
        </button>
      </section>
    );
  }

  return (
    <section>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5" style={{ color: theme.inkSoft, minHeight: 40 }}>
        <BackIcon size={15} />
        {book[lang].title}
      </button>

      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={16} color={theme.accent} strokeWidth={2} />
          <span className="text-sm font-semibold truncate" style={{ color: theme.ink }}>
            {ui.readThroughCta}
          </span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 shrink-0" style={{ borderRadius: skin.radiusSm, background: theme.canvas, color: theme.inkSoft }}>
          {ui.readThroughLeafLabel} {index + 1} {ui.deckOf} {leaves.length}
        </span>
      </div>

      <NodeQuestionDeck key={leaf.id} node={leaf} book={book} lang={lang} ui={ui} theme={theme} dir={dir} skin={skin} cardMode={cardMode} scrollDir={scrollDir} />

      <div className="flex items-center justify-between gap-3 mt-5">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 disabled:opacity-30"
          style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 44 }}
        >
          <PrevIcon size={15} />
          {ui.prev}
        </button>
        {index === leaves.length - 1 ? (
          <span className="text-xs font-semibold text-center flex-1" style={{ color: theme.inkSoft }}>
            {ui.readThroughDone}
          </span>
        ) : (
          <button
            onClick={() => setIndex((i) => Math.min(leaves.length - 1, i + 1))}
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 shrink-0"
            style={{ borderRadius: skin.radiusSm, background: theme.accent, color: theme.accentInk, minHeight: 44 }}
          >
            {ui.next}
            <NextIcon size={15} />
          </button>
        )}
      </div>
    </section>
  );
}

/* =================================================================
   BrowseView — every question in the book in one flat, filterable,
   scrollable list, with a small score / streak / completion header.
   Reached from a CTA on the tree ("browse & practice"); the tree
   itself never shows this. Score & streak reset when you leave this
   screen — this is a session practice pass, not a saved gradebook.
================================================================== */
function BrowseView({ book, lang, ui, theme, dir, skin, onBack, bookFlavorId, onChangeBookFlavor }) {
  const allQuestions = useMemo(() => {
    const list = [];
    book.nodes
      .filter((n) => n.level === "leaf")
      .forEach((leaf) => {
        leafCards(leaf).forEach((group) => {
          group.questions.forEach((q, i) => list.push({ q, leaf, key: `${group.id}-${i}` }));
        });
      });
    return list;
  }, [book]);

  const typeCounts = useMemo(() => {
    const counts = {};
    allQuestions.forEach(({ q }) => (counts[q.type] = (counts[q.type] || 0) + 1));
    return counts;
  }, [allQuestions]);

  const gradableTotal = useMemo(() => allQuestions.filter(({ q }) => q.type !== "essay" && q.type !== "rating").length, [allQuestions]);

  const [filterType, setFilterType] = useState("all");
  const [answers, setAnswers] = useState({});
  const [streak, setStreak] = useState(0);

  const handleAnswered = (key) => (result) => {
    setAnswers((a) => ({ ...a, [key]: result }));
    if (result === true) setStreak((s) => s + 1);
    else if (result === false) setStreak(0);
  };

  const scoreCount = Object.values(answers).filter((v) => v === true).length;
  const answeredCount = Object.keys(answers).length;
  const completionPct = allQuestions.length ? Math.round((answeredCount / allQuestions.length) * 100) : 0;

  const filtered = filterType === "all" ? allQuestions : allQuestions.filter(({ q }) => q.type === filterType);
  const typeKeys = Object.keys(TYPE_META).filter((t) => typeCounts[t]);
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const statCard = (bg, ink, label, Icon, content) => (
    <div className="flex flex-col gap-2 p-4" style={{ background: bg, color: ink, borderRadius: skin.radiusLg, border: skin.pixel ? `${skin.borderW}px solid ${ink}` : "none", boxShadow: skin.pixel ? skin.shadow : "none" }}>
      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider" style={{ opacity: 0.75 }}>
        <Icon size={13} strokeWidth={2.5} />
        {label}
      </div>
      {content}
    </div>
  );

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: theme.inkSoft, minHeight: 40 }}>
          <BackIcon size={15} />
          {book[lang].title}
        </button>

        {onChangeBookFlavor && (
          <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, background: theme.surface }}>
            <Palette size={13} style={{ color: theme.inkSoft }} />
            <span className="text-[11px] font-bold me-1" style={{ color: theme.inkSoft }}>
              {ui.bookFlavorLabel || (lang === "ar" ? "نكهة الكتاب:" : "Flavor:")}
            </span>
            <div className="flex items-center gap-1.5">
              {Object.entries(FLAVORS).map(([fid, f]) => {
                const pal = f[theme === FLAVORS[fid]?.dark ? "dark" : "light"] || f.light;
                const isSelected = bookFlavorId === fid;
                return (
                  <button
                    key={fid}
                    onClick={() => onChangeBookFlavor(fid)}
                    className="relative p-0.5 rounded-full transition-transform hover:scale-110"
                    style={{
                      border: isSelected ? `2px solid ${theme.ink}` : "1.5px solid transparent",
                      boxShadow: isSelected ? `0 0 0 1px ${theme.accent}` : "none",
                    }}
                    title={f[lang] || fid}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex overflow-hidden"
                      style={{ border: `1px solid ${pal.hairlineStrong}` }}
                    >
                      <span className="w-1/2 h-full" style={{ background: pal.canvas }} />
                      <span className="w-1/2 h-full" style={{ background: pal.accent }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: ui.displayFont, color: theme.ink }}>
        {ui.browseTitle}
      </h1>
      <p className="text-sm mb-5" style={{ color: theme.inkSoft }}>
        {ui.browseSub}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {statCard(
          TYPE_META.single.color.bg,
          TYPE_META.single.color.ink,
          ui.scoreLabel,
          Trophy,
          <span className="text-3xl font-black">
            {scoreCount}
            <span className="text-base font-bold opacity-60">/{gradableTotal}</span>
          </span>
        )}
        {statCard(TYPE_META.multi.color.bg, TYPE_META.multi.color.ink, ui.streakLabel, Flame, <span className="text-3xl font-black">{streak}</span>)}
      </div>

      <div className="p-4 mb-6" style={{ background: TYPE_META.tf.color.bg, color: TYPE_META.tf.color.ink, borderRadius: skin.radiusLg, border: skin.pixel ? `${skin.borderW}px solid ${TYPE_META.tf.color.ink}` : "none", boxShadow: skin.pixel ? skin.shadow : "none" }}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-xs font-black uppercase tracking-wider" style={{ opacity: 0.75 }}>
            {ui.completionLabel}
          </span>
          <span className="text-xl font-black">{completionPct}%</span>
        </div>
        <div className="w-full" style={{ height: 8, borderRadius: skin.radiusSm, background: "rgba(0,0,0,0.12)" }}>
          <div className="h-full transition-all" style={{ width: `${completionPct}%`, borderRadius: skin.radiusSm, background: TYPE_META.tf.color.ink }} />
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: theme.inkSoft }}>
        {ui.filterByType}
      </p>
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
        <button
          onClick={() => setFilterType("all")}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold"
          style={{
            borderRadius: skin.radiusSm,
            border: `1.5px solid ${filterType === "all" ? theme.ink : skinBorderColor(skin, theme)}`,
            background: filterType === "all" ? theme.ink : theme.canvas,
            color: filterType === "all" ? theme.canvas : theme.ink,
          }}
        >
          {ui.filterAll} {allQuestions.length}
        </button>
        {typeKeys.map((t) => {
          const meta = TYPE_META[t];
          const active = filterType === t;
          return (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold"
              style={{
                borderRadius: skin.radiusSm,
                border: `1.5px solid ${active ? theme.accent : skinBorderColor(skin, theme)}`,
                background: active ? theme.accentSoft : theme.canvas,
                color: theme.ink,
              }}
            >
              <meta.Icon size={13} />
              {meta[lang]} {typeCounts[t]}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(({ q, leaf, key }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold px-1" style={{ color: theme.inkSoft }}>
              {ui.fromLeaf} {leaf[lang]}
            </span>
            <TypeCard q={q} lang={lang} ui={ui} theme={theme} skin={skin} onAnswered={handleAnswered(key)} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* =================================================================
   SettingsPanel — a centered modal reachable from the gear icon in
   the header. Two independent controls: the visual skin (Normal /
   Liquid glass / Pixel art) and how the question deck moves (Paged
   vs Scroll, with a direction sub-choice once Scroll is picked).
================================================================== */
function SettingsPanel({ ui, theme, dir, skinId, onSkinChange, flavorId, onFlavorChange, mode, cardMode, onCardModeChange, scrollDir, onScrollDirChange, voiceEnabled, onVoiceEnabledChange, disableEditorInExport, onDisableEditorInExportChange, disableHtmlExport, onDisableHtmlExportChange, isExportSeed, onClose, onReset, onExportDatabase, onRestoreDatabase }) {
  const skin = SKINS[skinId] || SKINS.normal;
  const themeOptions = [
    { id: "normal", label: ui.themeNormal, desc: ui.themeNormalDesc, Icon: Sun },
    { id: "glass", label: ui.themeGlass, desc: ui.themeGlassDesc, Icon: Sparkles },
    { id: "pixel", label: ui.themePixel, desc: ui.themePixelDesc, Icon: Grid3x3 },
  ];
  const cardModeOptions = [
    { id: "paged", label: ui.cardModePaged, desc: ui.cardModePagedDesc, Icon: LayoutList },
    { id: "scroll", label: ui.cardModeScroll, desc: ui.cardModeScrollDesc, Icon: Rows3 },
  ];
  const scrollDirOptions = [
    { id: "vertical", label: ui.scrollDirVertical, desc: ui.scrollDirVerticalDesc, Icon: Rows3 },
    { id: "horizontal", label: ui.scrollDirHorizontal, desc: ui.scrollDirHorizontalDesc, Icon: Columns3 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,16,10,0.5)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ui.settingsTitle}
    >
      <div
        dir={dir}
        className="educraft-modal-in w-full max-w-md max-h-[85vh] overflow-y-auto p-6"
        style={{ ...panelStyle(skin, theme), boxShadow: skin.id === "normal" ? "0 24px 60px rgba(20,16,10,0.25)" : skin.shadow }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <Palette size={18} color={theme.accent} />
            <h2 className="text-lg font-bold" style={{ color: theme.ink }}>
              {ui.settingsTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center shrink-0"
            style={{ width: 32, height: 32, borderRadius: skin.radiusSm, border: `1px solid ${skinBorderColor(skin, theme)}`, color: theme.ink }}
            aria-label={ui.settingsClose}
          >
            <X size={15} />
          </button>
        </div>
        <p className="text-sm mb-6" style={{ color: theme.inkSoft, lineHeight: 1.6 }}>
          {ui.settingsSub}
        </p>

        {/* Theme */}
        <p className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: theme.inkSoft }}>
          {ui.settingsThemeLabel}
        </p>
        <div className="flex flex-col gap-2 mb-6">
          {themeOptions.map((opt) => {
            const active = skinId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSkinChange(opt.id)}
                className="flex items-center gap-3 text-start px-3.5 py-3"
                style={{
                  borderRadius: skin.radiusMd,
                  border: `${active ? 2 : 1}px solid ${active ? theme.accent : skinBorderColor(skin, theme)}`,
                  background: active ? theme.accentSoft : theme.canvas,
                }}
              >
                <span className="grid place-items-center shrink-0" style={{ width: 34, height: 34, borderRadius: skin.radiusSm, background: active ? theme.accent : theme.surfaceSoft, color: active ? theme.accentInk : theme.ink }}>
                  <opt.Icon size={16} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold" style={{ color: theme.ink }}>
                    {opt.label}
                  </span>
                  <span className="block text-xs" style={{ color: theme.inkSoft }}>
                    {opt.desc}
                  </span>
                </span>
                {active && <Check size={16} color={theme.accent} className="shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Flavor / taste — a color mood, independent of theme + light/dark */}
        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.inkSoft }}>
          {ui.settingsFlavorLabel}
        </p>
        <p className="text-xs mb-2.5" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
          {ui.settingsFlavorSub}
        </p>
        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {Object.entries(FLAVORS).map(([id, f]) => {
            const active = flavorId === id;
            const swatch = f[mode];
            const label = dir === "rtl" ? f.ar : f.en;
            return (
              <button
                key={id}
                onClick={() => onFlavorChange(id)}
                className="flex flex-col items-center gap-1.5 p-1.5"
                title={label}
                aria-label={label}
                style={{
                  borderRadius: skin.radiusMd,
                  border: `${active ? 2 : 1}px solid ${active ? theme.accent : skinBorderColor(skin, theme)}`,
                  background: active ? theme.accentSoft : "transparent",
                }}
              >
                <span
                  className="grid grid-cols-2 overflow-hidden shrink-0"
                  style={{ width: 34, height: 34, borderRadius: skin.radiusSm > 100 ? 9999 : skin.radiusSm * 0.6, border: `1px solid ${skinBorderColor(skin, theme)}` }}
                >
                  <span style={{ background: swatch.canvas }} />
                  <span style={{ background: swatch.accent }} />
                  <span style={{ background: swatch.header }} />
                  <span style={{ background: swatch.ink }} />
                </span>
                <span className="text-[0.65rem] font-bold text-center leading-tight" style={{ color: theme.ink }}>
                  {label}
                </span>
                {active && <Check size={12} color={theme.accent} className="shrink-0 -mt-1" />}
              </button>
            );
          })}
        </div>

        {/* Question card navigation */}
        <p className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: theme.inkSoft }}>
          {ui.settingsCardModeLabel}
        </p>
        <div className="flex flex-col gap-2 mb-2">
          {cardModeOptions.map((opt) => {
            const active = cardMode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onCardModeChange(opt.id)}
                className="flex items-center gap-3 text-start px-3.5 py-3"
                style={{
                  borderRadius: skin.radiusMd,
                  border: `${active ? 2 : 1}px solid ${active ? theme.accent : skinBorderColor(skin, theme)}`,
                  background: active ? theme.accentSoft : theme.canvas,
                }}
              >
                <span className="grid place-items-center shrink-0" style={{ width: 34, height: 34, borderRadius: skin.radiusSm, background: active ? theme.accent : theme.surfaceSoft, color: active ? theme.accentInk : theme.ink }}>
                  <opt.Icon size={16} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold" style={{ color: theme.ink }}>
                    {opt.label}
                  </span>
                  <span className="block text-xs" style={{ color: theme.inkSoft }}>
                    {opt.desc}
                  </span>
                </span>
                {active && <Check size={16} color={theme.accent} className="shrink-0" />}
              </button>
            );
          })}
        </div>

        {cardMode === "scroll" && (
          <div className="flex flex-col gap-2 mt-3 educraft-panel-in">
            <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: theme.inkSoft }}>
              {ui.settingsScrollDirLabel}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {scrollDirOptions.map((opt) => {
                const active = scrollDir === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onScrollDirChange(opt.id)}
                    className="flex flex-col items-center gap-1.5 px-3 py-3"
                    style={{
                      borderRadius: skin.radiusMd,
                      border: `${active ? 2 : 1}px solid ${active ? theme.accent : skinBorderColor(skin, theme)}`,
                      background: active ? theme.accentSoft : theme.canvas,
                    }}
                  >
                    <opt.Icon size={16} color={active ? theme.accent : theme.ink} />
                    <span className="text-xs font-bold" style={{ color: theme.ink }}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${theme.hairline}` }}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={voiceEnabled} onChange={(e) => onVoiceEnabledChange(e.target.checked)} className="mt-0.5" />
            <span>
              <span className="block text-sm font-bold" style={{ color: theme.ink }}>
                {EDITOR_STR[dir === "rtl" ? "ar" : "en"].voiceFeature}
              </span>
              <span className="block text-xs" style={{ color: theme.inkSoft }}>
                {EDITOR_STR[dir === "rtl" ? "ar" : "en"].voiceFeatureSub}
              </span>
            </span>
          </label>
        </div>

        {/* Extracted HTML Editor Lock Setting */}
        {!isExportSeed && (
          <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${theme.hairline}` }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.inkSoft }}>
              {dir === "rtl" ? "حماية النسخ المستخرجة (HTML)" : "Extracted HTML Protection"}
            </p>
            <p className="text-xs mb-3" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
              {dir === "rtl"
                ? "التحكم في صلاحيات وإمكانية التحرير عند استخراج الكتب كملفات HTML مستقلة للطلاب والقراء."
                : "Control whether editor mode is available when exporting standalone HTML files."}
            </p>
            <label
              className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-all hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                borderColor: disableEditorInExport ? theme.accent : skinBorderColor(skin, theme),
                background: disableEditorInExport ? theme.accentSoft : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={!!disableEditorInExport}
                onChange={(e) => onDisableEditorInExportChange && onDisableEditorInExportChange(e.target.checked)}
                className="mt-0.5 accent-red-600 rounded"
              />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold" style={{ color: theme.ink }}>
                  {dir === "rtl" ? "قفل ومنع وضع التحرير في نسخ الـ HTML المستخرجة" : "Lock & Disable Editor in Extracted HTML"}
                </span>
                <span className="block text-xs mt-0.5" style={{ color: theme.inkSoft, lineHeight: 1.4 }}>
                  {dir === "rtl"
                    ? "عند التفعيل، يتم تصدير الكتاب كنسخة قراءة واختبارات فقط، ويتم إخفاء المحرر وأزرار التعديل بالكامل لحماية محتوى الكتاب من التعديل أو العبث."
                    : "When enabled, exported HTML files are strictly locked to reader mode, hiding the editor and all modification tools to protect the curriculum."}
                </span>
              </span>
            </label>

            {/* Complete HTML Export Prevention Setting */}
            <label
              className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-all hover:bg-black/5 dark:hover:bg-white/5 mt-2.5"
              style={{
                borderColor: disableHtmlExport ? theme.accent : skinBorderColor(skin, theme),
                background: disableHtmlExport ? theme.accentSoft : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={!!disableHtmlExport}
                onChange={(e) => onDisableHtmlExportChange && onDisableHtmlExportChange(e.target.checked)}
                className="mt-0.5 accent-amber-600 rounded"
              />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold" style={{ color: theme.ink }}>
                  {dir === "rtl" ? "منع وتجميد تصدير الكتب كـ HTML بالكامل" : "Disable & Block HTML Export Completely"}
                </span>
                <span className="block text-xs mt-0.5" style={{ color: theme.inkSoft, lineHeight: 1.4 }}>
                  {dir === "rtl"
                    ? "عند التفعيل، يتم إخفاء وقفل خيارات تصدير HTML من جميع بطاقات الكتب وشجرة المنهج لحماية المحتوى ومنع توليد ملفات خارجية."
                    : "When enabled, hides and disables HTML export options across all book cards and tree views to protect content from external single-file generation."}
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${theme.hairline}` }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.inkSoft }}>
            {ui.settingsDataLabel}
          </p>
          <p className="text-xs mb-3" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
            {ui.settingsDataSub}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap mb-4">
            {onExportDatabase && (
              <button
                type="button"
                onClick={onExportDatabase}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold transition-all hover:opacity-90"
                style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${theme.hairlineStrong}`, background: theme.surface, color: theme.ink, minHeight: 38 }}
              >
                <FileDown size={14} />
                {ui.exportDatabaseBackupLabel}
              </button>
            )}
            {onRestoreDatabase && (
              <button
                type="button"
                onClick={onRestoreDatabase}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white transition-all hover:opacity-90 shadow-xs"
                style={{ borderRadius: skin.radiusSm, background: theme.accent, minHeight: 38 }}
              >
                <FileUp size={14} />
                {ui.restoreDatabaseBackupLabel}
              </button>
            )}
          </div>
          <button
            onClick={() => {
              if (window.confirm(ui.settingsResetConfirm)) onReset();
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-bold"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${INCORRECT.border}`, color: INCORRECT.border, minHeight: 40 }}
          >
            <RotateCcw size={14} />
            {ui.settingsResetLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   EDITOR MODE v2 — a leaf holds one or more CARDS (leaf.cards), and
   each card holds one or more questions of any type/mix. This
   mirrors the reader engine's own grouping model (leafCards()):
   { id, image, imagePosition, questions:[...] }. Card colors reuse
   TYPE_META natively; nothing about the reader-side palette changes.

   Also: an A4 page-builder (leaf.pageBlocks) with plate types
   (section title / key term / note / warning / important / image /
   manual page-break), and real height-based auto-pagination so long
   content flows onto new A4 pages the way a simple word processor
   would.
================================================================== */
const EDITOR_STR = {
  en: {
    editorTitle: "Editor",
    editorSub: "Pick a leaf, then build its cards or its printed pages.",
    addQuestion: "Add question",
    noLeaf: "Pick a leaf on the left to start editing.",
    prompt: "Prompt",
    voice: "Voice", voiceOn: "Voice enabled",
    code: "Code box", codeLang: "Language",
    linked: "Related to",
    linkedHint: "Search a leaf to link…",
    linkToBlockHint: "Link to a specific plate, or the whole leaf",
    linkWholeLeaf: "Whole leaf",
    incomingLinks: "Linked from",
    delete: "Delete question",
    tabCards: "Cards", tabPages: "A4 pages",
    options: "Options", correct: "Correct", addOption: "Add option",
    accepted: "Accepted answers (comma separated)",
    modelAnswer: "Model answer",
    template: "Template (use ___ for the blank)",
    blanks: "Blanks (comma separated, in order)",
    bank: "Word bank (comma separated)",
    correctWord: "Correct word",
    left: "Left side", right: "Right side",
    items: "Items (in correct order)",
    bins: "Bins (comma separated)",
    sortItems: "Items — one \"label:bin\" per line",
    min: "Min", max: "Max", step: "Step", tolerance: "Tolerance",
    trueLabel: "True", falseLabel: "False",
    voiceFeature: "Voice feature",
    voiceFeatureSub: "Show or hide the voice slot on question cards everywhere.",
    card: "Card", newCard: "New card", deleteCard: "Delete card",
    cardImage: "Card image", posTop: "Top", posRight: "Right", posLeft: "Left", posNone: "None",
    cardVideo: "Card video", cardAudio: "Card audio",
    uploadVideo: "Upload video", uploadAudio: "Upload audio", removeMedia: "Remove",
    noQuestionsInCard: "This card is empty — add a question.",
    pagesSub: "Build the printed A4 version — plates, images, and page breaks.",
    addBlock: "Add block",
    genFromCards: "Generate from this leaf's cards",
    pagePalette: "Page palette",
    insertGroup: "Insert", pageGroup: "Page", zoomOut: "Zoom out", zoomIn: "Zoom in", zoomFit: "Fit width", zoomReset: "100%",
    blockSectionTitle: "Section title", blockKeyterm: "Key term", blockNote: "Note", blockWarning: "Warning", blockImportant: "Important", blockImage: "Image", blockCode: "Code box", blockPagebreak: "Page break",
    blockTextKind: "Free text", blockTable: "Table",
    blockTitle: "Title", blockText: "Text", imageUrl: "Image URL", imageCaption: "Caption", imageTitle: "Image title", imageMeta: "Source / note",
    uploadImage: "Upload image", chooseImageFile: "Choose image file", dropImageHere: "Drop image here or click to browse", orEnterUrl: "Or paste image URL",
    tableHeaders: "Headers (comma-separated)", tableRows: "Rows (one row per line, cells separated by commas)",
    pageOf: (n, total) => `Page ${n} of ${total}`,
    moveUp: "Move up", moveDown: "Move down", removeBlock: "Remove",
    files: "Files",
    importBookJson: "Import book (JSON)",
    exportBookJson: "Export book (JSON)",
    importOrderedImages: "Import a folder of images — sorted 0,1,2… and assigned to cards in order",
    importManifestFolder: "Import a folder containing a manifest.json + its images",
    importDone: (n) => `Imported ${n} image(s).`,
    importNoManifest: "No manifest.json found in that folder.",
    importSkipped: (n) => `${n} item(s) pointed to a leaf id that doesn't exist in this book.`,
    cardNote: "Note",
    emptyBook: "This book has no printed pages yet.",
  },
  ar: {
    editorTitle: "المحرر",
    editorSub: "اختار ورقة، وابني كاردات أسئلتها أو صفحاتها المطبوعة.",
    addQuestion: "إضافة سؤال",
    noLeaf: "اختار ورقة من الشمال عشان تبدأ التحرير.",
    prompt: "نص السؤال",
    voice: "صوت", voiceOn: "الصوت مفعّل",
    code: "صندوق كود", codeLang: "اللغة",
    linked: "مرتبط بـ",
    linkedHint: "دوّر على ورقة تربطها…",
    linkToBlockHint: "اربط بعنصر معين في صفحاتها، أو بالورقة كلها",
    linkWholeLeaf: "الورقة كلها",
    incomingLinks: "روابط واردة من",
    delete: "احذف السؤال",
    tabCards: "الكاردات", tabPages: "صفحات A4",
    options: "الاختيارات", correct: "الصح", addOption: "إضافة اختيار",
    accepted: "إجابات مقبولة (افصل بفاصلة)",
    modelAnswer: "الإجابة النموذجية",
    template: "النص (استخدم ___ للفراغ)",
    blanks: "الفراغات (افصل بفاصلة، بالترتيب)",
    bank: "بنك الكلمات (افصل بفاصلة)",
    correctWord: "الكلمة الصح",
    left: "العمود الأول", right: "العمود التاني",
    items: "العناصر (بالترتيب الصح)",
    bins: "الصناديق (افصل بفاصلة)",
    sortItems: "العناصر — \"العنصر:الصندوق\" كل سطر لوحده",
    min: "أقل قيمة", max: "أعلى قيمة", step: "الخطوة", tolerance: "هامش الخطأ",
    trueLabel: "صح", falseLabel: "غلط",
    voiceFeature: "ميزة الصوت",
    voiceFeatureSub: "إظهار أو إخفاء مكان الصوت في كاردات الأسئلة في كل مكان.",
    card: "كارد", newCard: "كارد جديد", deleteCard: "احذف الكارد",
    cardImage: "صورة الكارد", posTop: "فوق", posRight: "يمين", posLeft: "شمال", posNone: "بدون",
    cardVideo: "فيديو الكارد", cardAudio: "صوت الكارد",
    uploadVideo: "رفع فيديو", uploadAudio: "رفع صوت", removeMedia: "إزالة",
    noQuestionsInCard: "الكارد ده فاضي — ضيف سؤال.",
    pagesSub: "ابني النسخة المطبوعة A4 — بلايتس وصور وفواصل صفحات.",
    addBlock: "إضافة عنصر",
    genFromCards: "ولّد من كاردات الورقة دي",
    pagePalette: "باليتة الصفحة",
    insertGroup: "إدراج", pageGroup: "الصفحة", zoomOut: "تصغير", zoomIn: "تكبير", zoomFit: "ملائمة العرض", zoomReset: "100%",
    blockSectionTitle: "عنوان قسم", blockKeyterm: "مصطلح مفتاحي", blockNote: "ملاحظة", blockWarning: "تحذير", blockImportant: "مهم", blockImage: "صورة", blockCode: "صندوق كود", blockPagebreak: "فاصل صفحة",
    blockTextKind: "نص حر", blockTable: "جدول",
    blockTitle: "العنوان", blockText: "النص", imageUrl: "رابط الصورة", imageCaption: "التعليق", imageTitle: "عنوان الصورة", imageMeta: "المصدر / ملاحظة",
    uploadImage: "رفع صورة", chooseImageFile: "اختر صورة", dropImageHere: "اسحب الصورة هنا أو اضغط للاختيار", orEnterUrl: "أو الصق رابط الصورة (URL)",
    tableHeaders: "عناوين الأعمدة (مفصولة بفاصلة)", tableRows: "الصفوف (كل صف في سطر، والخلايا مفصولة بفاصلة)",
    pageOf: (n, total) => `صفحة ${n} من ${total}`,
    moveUp: "لأعلى", moveDown: "لأسفل", removeBlock: "إزالة",
    files: "ملفات",
    importBookJson: "استيراد الكتاب (JSON)",
    exportBookJson: "تصدير الكتاب (JSON)",
    importOrderedImages: "استيراد فولدر صور — مرتبة 0،1،2… وتتوزع على الكاردات بالترتيب",
    importManifestFolder: "استيراد فولدر فيه manifest.json + الصور بتاعته",
    importDone: (n) => `تم استيراد ${n} صورة.`,
    importNoManifest: "مافيش ملف manifest.json جوا الفولدر ده.",
    importSkipped: (n) => `${n} عنصر بيشاور على ورقة مش موجودة في الكتاب ده.`,
    cardNote: "ملاحظة",
    emptyBook: "الكتاب ده لسه ماعندوش صفحات مطبوعة.",
  },
};

function FieldRow({ label, theme, children }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: theme.inkSoft }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, theme, skin, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(type === "number" ? e.target.valueAsNumber : e.target.value)}
      placeholder={placeholder}
      className="educraft-input w-full text-xs font-medium px-3.5 py-2 rounded-xl border outline-none shadow-2xs transition-all"
      style={{ borderColor: theme.hairlineStrong, background: theme.surface, color: theme.ink }}
    />
  );
}

/* Rich text field: Bold, text color, font, and BDI/direction wrapping
   on the current selection — a minimal but real toolbar. */
function RichField({ value, onChange, theme, skin, placeholder, minHeight = 76 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const exec = (cmd, val) => {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(ref.current.innerHTML);
  };
  const wrapBdi = (forceDir) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const bdi = document.createElement("bdi");
    if (forceDir) bdi.setAttribute("dir", forceDir);
    try {
      range.surroundContents(bdi);
    } catch (e) {}
    onChange(ref.current.innerHTML);
  };
  const COLORS = ["#241B13", "#E8654A", "#0E7C79", "#8B5CF6", "#D97706", "#E11D48"];
  const btnStyle = { borderRadius: 8, color: theme.ink, background: theme.surface, border: `1px solid ${theme.hairlineStrong}` };
  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-1.5 mb-2 p-1.5 rounded-xl border shadow-2xs"
        style={{ background: theme.surfaceSoft, borderColor: theme.hairlineStrong }}
      >
        <button
          type="button"
          onClick={() => exec("bold")}
          className="educraft-btn w-7 h-7 rounded-lg grid place-items-center font-black text-xs cursor-pointer border shadow-2xs hover:bg-black/5"
          style={btnStyle}
          title="Bold"
        >
          B
        </button>
        <div className="flex items-center gap-1 px-1">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => exec("foreColor", c)}
              className="educraft-btn w-4.5 h-4.5 rounded-full shrink-0 cursor-pointer shadow-2xs hover:scale-115 transition-transform"
              style={{ background: c, border: `1px solid ${theme.hairlineStrong}` }}
              title={c}
            />
          ))}
        </div>
        <select
          onChange={(e) => e.target.value && exec("fontName", e.target.value)}
          className="text-xs font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer"
          style={{ ...btnStyle, maxWidth: 84 }}
          defaultValue=""
        >
          <option value="" disabled>
            Aa
          </option>
          <option value="monospace">Mono</option>
          <option value="Georgia">Serif</option>
          <option value="sans-serif">Sans</option>
        </select>
        <span className="w-px h-5 mx-0.5 bg-black/15 dark:bg-white/15" />
        <button
          type="button"
          onClick={() => wrapBdi("auto")}
          className="educraft-btn text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer hover:bg-black/5"
          style={btnStyle}
          title="BDI — auto isolate"
        >
          bdi
        </button>
        <button
          type="button"
          onClick={() => wrapBdi("ltr")}
          className="educraft-btn text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer hover:bg-black/5"
          style={btnStyle}
        >
          LTR
        </button>
        <button
          type="button"
          onClick={() => wrapBdi("rtl")}
          className="educraft-btn text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer hover:bg-black/5"
          style={btnStyle}
        >
          RTL
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        dir="auto"
        onInput={() => onChange(ref.current.innerHTML)}
        className="educraft-textarea w-full text-xs font-medium px-3.5 py-2.5 outline-none rounded-xl border shadow-inner transition-all"
        style={{ minHeight, borderColor: theme.hairlineStrong, background: theme.surface, color: theme.ink, lineHeight: 1.7 }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

/* Per-type answer fields — mirrors the exact shape each reader-side
   Body component expects. */
function QuestionFields({ q, lang, onChangeLang, theme, skin, t }) {
  const c = q[lang] || {};
  const set = (patch) => onChangeLang({ ...c, ...patch });
  switch (q.type) {
    case "single":
    case "multi": {
      const opts = c.options || [];
      const isMulti = q.type === "multi";
      const toggleCorrect = (i) => {
        if (isMulti) {
          const cur = Array.isArray(c.correct) ? c.correct : [];
          set({ correct: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i].sort((a, b) => a - b) });
        } else set({ correct: i });
      };
      return (
        <FieldRow label={t.options} theme={theme}>
          {opts.map((o, i) => {
            const active = isMulti ? (c.correct || []).includes(i) : c.correct === i;
            return (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <button
                  type="button"
                  onClick={() => toggleCorrect(i)}
                  className="w-6 h-6 shrink-0 grid place-items-center"
                  style={{ borderRadius: isMulti ? 6 : 999, border: `2px solid ${theme.accent}`, background: active ? theme.accent : "transparent" }}
                >
                  {active && <Check size={12} color={theme.accentInk} />}
                </button>
                <input
                  value={o}
                  onChange={(e) => {
                    const n = [...opts];
                    n[i] = e.target.value;
                    set({ options: n });
                  }}
                  className="flex-1 text-sm px-2.5 py-1.5"
                  style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.ink }}
                />
                <button type="button" onClick={() => set({ options: opts.filter((_, x) => x !== i) })} style={{ color: theme.inkSoft }}>
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => set({ options: [...opts, ""] })}
            className="text-xs font-bold px-2.5 py-1.5"
            style={{ borderRadius: skin.radiusSm, border: `1px dashed ${theme.hairlineStrong}`, color: theme.accent }}
          >
            + {t.addOption}
          </button>
        </FieldRow>
      );
    }
    case "tf":
      return (
        <FieldRow label={t.correct} theme={theme}>
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => set({ correct: v })}
                className="flex-1 text-sm font-bold py-2"
                style={{ borderRadius: skin.radiusSm, background: c.correct === v ? theme.accent : theme.surface, color: c.correct === v ? theme.accentInk : theme.ink, border: `1px solid ${theme.hairline}` }}
              >
                {v ? t.trueLabel : t.falseLabel}
              </button>
            ))}
          </div>
        </FieldRow>
      );
    case "short":
      return (
        <FieldRow label={t.accepted} theme={theme}>
          <TextInput theme={theme} skin={skin} value={(c.accepted || []).join(", ")} onChange={(v) => set({ accepted: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        </FieldRow>
      );
    case "essay":
      return (
        <FieldRow label={t.modelAnswer} theme={theme}>
          <textarea
            value={c.model || ""}
            onChange={(e) => set({ model: e.target.value })}
            rows={3}
            className="educraft-textarea w-full text-xs px-3 py-2 rounded-xl border outline-none shadow-inner"
            style={{ borderColor: theme.hairline, background: theme.surface, color: theme.ink }}
          />
        </FieldRow>
      );
    case "fill":
      return (
        <>
          <FieldRow label={t.template} theme={theme}>
            <TextInput theme={theme} skin={skin} value={c.template} onChange={(v) => set({ template: v })} />
          </FieldRow>
          <FieldRow label={t.blanks} theme={theme}>
            <TextInput theme={theme} skin={skin} value={(c.blanks || []).join(", ")} onChange={(v) => set({ blanks: v.split(",").map((s) => s.trim()) })} />
          </FieldRow>
        </>
      );
    case "cloze":
      return (
        <>
          <FieldRow label={t.template} theme={theme}>
            <TextInput theme={theme} skin={skin} value={c.template} onChange={(v) => set({ template: v })} />
          </FieldRow>
          <FieldRow label={t.bank} theme={theme}>
            <TextInput theme={theme} skin={skin} value={(c.bank || []).join(", ")} onChange={(v) => set({ bank: v.split(",").map((s) => s.trim()) })} />
          </FieldRow>
          <FieldRow label={t.correctWord} theme={theme}>
            <TextInput theme={theme} skin={skin} value={c.correct} onChange={(v) => set({ correct: v })} />
          </FieldRow>
        </>
      );
    case "match":
      return (
        <>
          <FieldRow label={t.left} theme={theme}>
            <TextInput theme={theme} skin={skin} value={(c.left || []).join(", ")} onChange={(v) => set({ left: v.split(",").map((s) => s.trim()) })} />
          </FieldRow>
          <FieldRow label={t.right} theme={theme}>
            <TextInput theme={theme} skin={skin} value={(c.right || []).join(", ")} onChange={(v) => set({ right: v.split(",").map((s) => s.trim()) })} />
          </FieldRow>
          <FieldRow label={t.correct} theme={theme}>
            <TextInput theme={theme} skin={skin} value={(c.correct || []).join(", ")} onChange={(v) => set({ correct: v.split(",").map((s) => parseInt(s.trim(), 10)) })} />
          </FieldRow>
        </>
      );
    case "order":
      return (
        <>
          <FieldRow label={t.items} theme={theme}>
            <TextInput theme={theme} skin={skin} value={(c.items || []).join(", ")} onChange={(v) => set({ items: v.split(",").map((s) => s.trim()) })} />
          </FieldRow>
          <FieldRow label={t.correct} theme={theme}>
            <TextInput theme={theme} skin={skin} value={(c.correct || []).join(", ")} onChange={(v) => set({ correct: v.split(",").map((s) => s.trim()) })} />
          </FieldRow>
        </>
      );
    case "sort":
      return (
        <>
          <FieldRow label={t.bins} theme={theme}>
            <TextInput theme={theme} skin={skin} value={(c.bins || []).join(", ")} onChange={(v) => set({ bins: v.split(",").map((s) => s.trim()) })} />
          </FieldRow>
          <FieldRow label={t.sortItems} theme={theme}>
            <textarea
              value={(c.items || []).map((p) => p.join(":")).join("\n")}
              onChange={(e) => set({ items: e.target.value.split("\n").filter(Boolean).map((l) => l.split(":").map((s) => s.trim())) })}
              rows={4}
              className="educraft-textarea w-full text-xs px-3 py-2 rounded-xl border outline-none shadow-inner"
              style={{ borderColor: theme.hairline, background: theme.surface, color: theme.ink, fontFamily: "monospace" }}
            />
          </FieldRow>
        </>
      );
    case "numeric":
      return (
        <div className="grid grid-cols-2 gap-2">
          <FieldRow label={t.correct} theme={theme}>
            <TextInput type="number" theme={theme} skin={skin} value={c.correct} onChange={(v) => set({ correct: v })} />
          </FieldRow>
          <FieldRow label={t.tolerance} theme={theme}>
            <TextInput type="number" theme={theme} skin={skin} value={c.tolerance} onChange={(v) => set({ tolerance: v })} />
          </FieldRow>
        </div>
      );
    case "rating":
      return null;
    case "slider":
      return (
        <div className="grid grid-cols-2 gap-2">
          <FieldRow label={t.min} theme={theme}>
            <TextInput type="number" theme={theme} skin={skin} value={c.min} onChange={(v) => set({ min: v })} />
          </FieldRow>
          <FieldRow label={t.max} theme={theme}>
            <TextInput type="number" theme={theme} skin={skin} value={c.max} onChange={(v) => set({ max: v })} />
          </FieldRow>
          <FieldRow label={t.step} theme={theme}>
            <TextInput type="number" theme={theme} skin={skin} value={c.step} onChange={(v) => set({ step: v })} />
          </FieldRow>
          <FieldRow label={t.correct} theme={theme}>
            <TextInput type="number" theme={theme} skin={skin} value={c.correct} onChange={(v) => set({ correct: v })} />
          </FieldRow>
          <FieldRow label={t.tolerance} theme={theme}>
            <TextInput type="number" theme={theme} skin={skin} value={c.tolerance} onChange={(v) => set({ tolerance: v })} />
          </FieldRow>
        </div>
      );
    default:
      return null;
  }
}

/* Link items are either a bare leafId string (legacy — links the
   whole leaf) or { leafId, blockId } (links one specific A4 plate —
   a note/keyterm/etc — inside that leaf's pageBlocks). These three
   helpers keep every call site agnostic to which shape it's holding. */
function linkLeafId(link) {
  return typeof link === "string" ? link : link.leafId;
}
function linkBlockId(link) {
  return typeof link === "string" ? null : link.blockId || null;
}
function linkKey(link) {
  return typeof link === "string" ? link : `${link.leafId}::${link.blockId || ""}`;
}
function linkBlockLabel(leaf, blockId, t) {
  if (!leaf || !blockId) return null;
  const b = (leaf.pageBlocks || []).find((x) => x.id === blockId);
  if (!b) return null;
  return b.title || b.text?.slice(0, 24) || t[`block${b.kind[0].toUpperCase()}${b.kind.slice(1)}`] || b.kind;
}

/* Search-to-link combobox. Pick a leaf, then optionally narrow the
   link down to one specific plate inside that leaf's A4 pages —
   otherwise it links the whole leaf, same as before. */
function LinkPicker({ allLeaves, currentLeafId, linkedTo, lang, theme, skin, t, onChange }) {
  const [query, setQuery] = useState("");
  const [pendingLeafId, setPendingLeafId] = useState(null);
  const list = linkedTo || [];
  const linkedLeafIds = list.map(linkLeafId);
  const options = allLeaves.filter((l) => l.id !== currentLeafId && (lang === "ar" ? l.ar : l.en).toLowerCase().includes(query.toLowerCase()));
  const pendingLeaf = pendingLeafId ? allLeaves.find((l) => l.id === pendingLeafId) : null;
  const pendingBlocks = pendingLeaf ? (pendingLeaf.pageBlocks || []).filter((b) => b.kind !== "pagebreak") : [];

  const addLink = (link) => {
    onChange([...list, link]);
    setQuery("");
    setPendingLeafId(null);
  };

  return (
    <div>
      {list.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {list.map((link, i) => {
            const l = allLeaves.find((x) => x.id === linkLeafId(link));
            if (!l) return null;
            const blockId = linkBlockId(link);
            const blockLabel = blockId ? linkBlockLabel(l, blockId, t) : null;
            return (
              <span key={linkKey(link) + i} className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1" style={{ borderRadius: 999, background: theme.accent, color: theme.accentInk }}>
                {lang === "ar" ? l.ar : l.en}
                {blockLabel && <span style={{ opacity: 0.8, fontWeight: 600 }}>› {blockLabel}</span>}
                <button type="button" onClick={() => onChange(list.filter((_, idx) => idx !== i))}>
                  <X size={11} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {pendingLeaf ? (
        <div className="p-2" style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairlineStrong}`, background: theme.surface }}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>
              {t.linkToBlockHint} — {lang === "ar" ? pendingLeaf.ar : pendingLeaf.en}
            </p>
            <button type="button" onClick={() => setPendingLeafId(null)} className="text-[11px] font-bold" style={{ color: theme.accent }}>
              <X size={12} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => addLink(pendingLeaf.id)}
              className="text-[11px] font-bold px-2.5 py-1"
              style={{ borderRadius: 999, border: `1.5px dashed ${theme.accent}`, color: theme.accent }}
            >
              {t.linkWholeLeaf}
            </button>
            {pendingBlocks.map((b) => {
              const pendingKinds = plateKindsFor(paletteById(pendingLeaf.pagePaletteId || 1));
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => addLink({ leafId: pendingLeaf.id, blockId: b.id })}
                  className="text-[11px] font-bold px-2.5 py-1"
                  style={{ borderRadius: 999, background: pendingKinds[b.kind]?.bg || theme.surfaceSoft, color: pendingKinds[b.kind]?.fg || theme.ink }}
                >
                  {linkBlockLabel(pendingLeaf, b.id, t)}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative">
          <TextInput theme={theme} skin={skin} value={query} onChange={setQuery} placeholder={t.linkedHint} />
          {query && options.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto" style={{ borderRadius: skin.radiusSm, background: theme.surface, border: `1px solid ${theme.hairlineStrong}`, boxShadow: skin.shadow }}>
              {options.slice(0, 8).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    if ((l.pageBlocks || []).some((b) => b.kind !== "pagebreak")) {
                      setPendingLeafId(l.id);
                      setQuery("");
                    } else {
                      addLink(l.id);
                    }
                  }}
                  className="w-full text-start text-xs px-3 py-2 flex items-center justify-between gap-2"
                  style={{ color: theme.ink }}
                >
                  <span>{lang === "ar" ? l.ar : l.en}</span>
                  {linkedLeafIds.includes(l.id) && (
                    <span className="text-[10px]" style={{ color: theme.inkSoft }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* One question inside a card: prompt (rich), type fields, voice,
   code, links. Image now lives on the card, not the question. */
function QuestionEditorRow({ q, lang, theme, skin, t, onUpdate, onDelete, allLeaves, currentLeafId, voiceEnabled }) {
  const meta = TYPE_META[q.type];
  const c = q[lang] || {};
  const textKey = c.template !== undefined ? "template" : "prompt";
  const setLangObj = (patch) => onUpdate({ [lang]: { ...c, ...patch } });
  const setText = (html) => setLangObj({ [textKey]: html });

  return (
    <div style={{ borderRadius: 12, border: `1px solid ${theme.hairline}`, overflow: "hidden" }}>
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5" style={{ background: theme.surfaceSoft, borderBottom: `1px solid ${theme.hairline}`, color: theme.ink }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold" style={{ background: theme.accentSoft, color: theme.accent, border: `1px solid ${theme.accent}33` }}>
            <meta.Icon size={13} />
            <span>{lang === "ar" ? meta.ar : meta.en}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="educraft-btn w-6 h-6 grid place-items-center rounded-md cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
          style={{ color: theme.inkSoft }}
          title={t.delete}
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="p-3.5" style={{ background: theme.surface }}>
        <FieldRow label={t.prompt} theme={theme}>
          <RichField key={q.id + lang} value={c[textKey] || ""} onChange={setText} theme={theme} skin={skin} placeholder={t.prompt} />
        </FieldRow>

        <QuestionFields q={q} lang={lang} onChangeLang={setLangObj} theme={theme} skin={skin} t={t} />

        {voiceEnabled && (
          <FieldRow label={t.voice} theme={theme}>
            <TextInput theme={theme} skin={skin} value={q.voice?.url} onChange={(v) => onUpdate({ voice: { ...(q.voice || {}), url: v } })} placeholder="https://…" />
            <label className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold" style={{ color: theme.inkSoft }}>
              <input type="checkbox" checked={!!q.voice?.enabled} onChange={(e) => onUpdate({ voice: { ...(q.voice || {}), enabled: e.target.checked } })} />
              {t.voiceOn}
            </label>
          </FieldRow>
        )}

        <FieldRow label={t.code} theme={theme}>
          <div className="flex gap-2 mb-1.5 items-center">
            <TextInput theme={theme} skin={skin} value={q.code?.lang} onChange={(v) => onUpdate({ code: { ...(q.code || {}), lang: v } })} placeholder={t.codeLang} />
            <label className="flex items-center gap-1.5 text-xs font-semibold shrink-0 px-2" style={{ color: theme.inkSoft }}>
              <input type="checkbox" checked={!!q.code?.enabled} onChange={(e) => onUpdate({ code: { ...(q.code || {}), enabled: e.target.checked } })} />
              {t.code}
            </label>
          </div>
          {q.code?.enabled && (
            <textarea
              value={q.code?.src || ""}
              onChange={(e) => onUpdate({ code: { ...(q.code || {}), src: e.target.value } })}
              rows={4}
              className="educraft-textarea w-full text-xs font-mono px-3 py-2 rounded-xl border outline-none shadow-inner"
              style={{ borderColor: theme.hairline, background: theme.canvas, color: theme.ink, fontFamily: "'Space Mono', monospace" }}
            />
          )}
        </FieldRow>

        <FieldRow label={t.linked} theme={theme}>
          <LinkPicker allLeaves={allLeaves} currentLeafId={currentLeafId} linkedTo={q.linkedTo} lang={lang} theme={theme} skin={skin} t={t} onChange={(v) => onUpdate({ linkedTo: v })} />
        </FieldRow>
      </div>
    </div>
  );
}

/* A CARD: one image slot + any number of mixed-type questions. */
/* =================================================================
   MediaUploadField — video/audio uploader for a card, mirroring the
   image field: picks a file, reads it as a base64 data URI (same
   guarantee as card.image — embedded at upload time, not export
   time), and shows a live <video>/<audio> preview plus a rough size
   readout so a large clip doesn't silently balloon the export.
================================================================== */
function MediaUploadField({ label, uploadLabel, removeLabel, accept, value, onChange, theme, skin, kind }) {
  const inputId = useRef(`media-${kind}-${Math.random().toString(36).slice(2, 8)}`).current;
  const [busy, setBusy] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataURL(file);
      onChange(dataUrl);
    } finally {
      setBusy(false);
    }
  };
  // data URIs are ~4/3 the size of the raw bytes (base64 overhead) —
  // this is a quick heads-up, not a precise export-size calculator.
  const approxMB = value ? Math.round(((value.length * 0.75) / (1024 * 1024)) * 10) / 10 : 0;

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.inkSoft }}>
          {label}
        </p>
        {value && (
          <span className="text-[10px] font-semibold" style={{ color: theme.inkSoft }}>
            ~{approxMB} MB
          </span>
        )}
      </div>

      {value ? (
        <div className="flex flex-col gap-1.5 p-2 rounded-xl border" style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}>
          {kind === "video" ? (
            <video src={value} controls playsInline className="w-full rounded-lg" style={{ maxHeight: 140, background: "#000" }} />
          ) : (
            <audio src={value} controls className="w-full" />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="educraft-btn self-start text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer"
            style={{ color: "#991B1B", background: "#FEE2E2", borderColor: "#FECACA" }}
          >
            {removeLabel}
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="educraft-btn flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 cursor-pointer rounded-xl border border-dashed transition-colors"
          style={{ borderColor: theme.hairlineStrong, color: theme.inkSoft, background: theme.surfaceSoft }}
        >
          {busy ? "…" : uploadLabel}
        </label>
      )}
      <input id={inputId} type="file" accept={accept} onChange={handleFile} className="hidden" />
    </div>
  );
}

function CardImageUploader({ image, onChange, theme, skin, t, lang }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file || !IMAGE_EXT_RE.test(file.name)) return;
    fileToDataURL(file).then((url) => onChange(url));
  };

  return (
    <div className="mb-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className="relative group flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all overflow-hidden"
        style={{
          height: 120,
          borderColor: dragOver ? theme.accent : theme.hairlineStrong,
          background: image ? theme.surface : (dragOver ? theme.accentSoft : theme.surface),
        }}
      >
        {image ? (
          <>
            <img src={image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="educraft-btn text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white text-stone-900 shadow-sm cursor-pointer"
              >
                {lang === "ar" ? "تغيير الصورة" : "Change Image"}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="educraft-btn text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-red-600 text-white shadow-sm cursor-pointer"
              >
                {lang === "ar" ? "حذف" : "Remove"}
              </button>
            </div>
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 cursor-pointer p-3 text-center w-full h-full"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: theme.accentSoft, color: theme.accent }}>
              <ImagePlus size={15} />
            </div>
            <p className="text-xs font-bold" style={{ color: theme.ink }}>
              {lang === "ar" ? "اسحب صورة هنا أو انقر لاختيار ملف" : "Drop image here or click to browse"}
            </p>
            <p className="text-[10px]" style={{ color: theme.inkSoft }}>
              PNG, JPG, SVG, WebP
            </p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <div className="flex items-center gap-2 mt-1.5">
        <TextInput
          theme={theme}
          skin={skin}
          value={image || ""}
          onChange={onChange}
          placeholder={lang === "ar" ? "أو ضع رابط صورة خارجي (https://...)" : "Or enter external image URL (https://...)"}
        />
      </div>
    </div>
  );
}

function CardEditor({ card, lang, theme, skin, t, onUpdateCard, onDeleteCard, allLeaves, currentLeafId, voiceEnabled }) {
  const pos = card.imagePosition || "top";
  const qRefs = useRef({});
  const updateQ = (i, patch) => onUpdateCard({ questions: card.questions.map((qq, idx) => (idx === i ? { ...qq, ...patch } : qq)) });
  const deleteQ = (i) => onUpdateCard({ questions: card.questions.filter((_, idx) => idx !== i) });
  const addQ = (type) => {
    const base = { id: `${card.id}-${Date.now()}`, type, subject: "", difficulty: "Beginner", tier: "core", dir: "ltr", en: { prompt: "" }, ar: { prompt: "" } };
    onUpdateCard({ questions: [...card.questions, base] });
  };
  const jumpTo = (id) => qRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });

  // union of every link (leaf- or block-level) across this card's
  // questions, plus any card-wide links (e.g. set by a manifest
  // import) — deduped by leaf+block, shown as tag chips
  const allCardLinks = [...(card.cardLinkedTo || []), ...card.questions.flatMap((q) => q.linkedTo || [])];
  const linkedItems = Array.from(new Map(allCardLinks.map((l) => [linkKey(l), l])).values());

  return (
    <div className="educraft-panel-in shadow-xs" style={{ borderRadius: 20, border: `1px solid ${theme.hairlineStrong}`, background: theme.surface, padding: 18 }}>
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.inkSoft }}>
          {t.cardImage}
        </p>
        <button
          onClick={onDeleteCard}
          className="educraft-btn text-xs font-bold px-3 py-1.5 shrink-0 cursor-pointer rounded-xl border shadow-2xs transition-colors hover:bg-red-100"
          style={{ color: "#991B1B", background: "#FEE2E2", borderColor: "#FECACA" }}
        >
          {t.deleteCard}
        </button>
      </div>

      <CardImageUploader
        image={card.image}
        onChange={(url) => onUpdateCard({ image: url })}
        theme={theme}
        skin={skin}
        t={t}
        lang={lang}
      />

      {card.image && (
        <div className="flex flex-col gap-2 mt-2 mb-3 p-2.5 rounded-xl border" style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}>
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <span className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>
              {lang === "ar" ? "موضع الصورة:" : "Placement:"}
            </span>
            <div className="flex gap-1">
              {[
                ["top", t.posTop],
                ["right", t.posRight],
                ["left", t.posLeft],
                ["none", t.posNone],
              ].map(([p, label]) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onUpdateCard({ imagePosition: p })}
                  className="educraft-btn text-[10.5px] font-bold px-2 py-0.5 cursor-pointer rounded-lg"
                  style={{
                    background: pos === p ? theme.accentSoft : theme.surface,
                    color: pos === p ? theme.accent : theme.inkSoft,
                    border: pos === p ? `1px solid ${theme.accent}44` : `1px solid ${theme.hairline}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 flex-wrap">
            <span className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>
              {lang === "ar" ? "تناسب الحجم:" : "Sizing Mode:"}
            </span>
            <div className="flex gap-1">
              {[
                ["smart", lang === "ar" ? "ذكي متناسق" : "Smart Fit"],
                ["compact", lang === "ar" ? "مدمج" : "Compact"],
                ["banner", lang === "ar" ? "عريض" : "Banner"],
              ].map(([fit, label]) => {
                const active = (card.imageFit || "smart") === fit;
                return (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => onUpdateCard({ imageFit: fit })}
                    className="educraft-btn text-[10.5px] font-bold px-2 py-0.5 cursor-pointer rounded-lg"
                    style={{
                      background: active ? theme.accentSoft : theme.surface,
                      color: active ? theme.accent : theme.inkSoft,
                      border: active ? `1px solid ${theme.accent}44` : `1px solid ${theme.hairline}`,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <MediaUploadField
          label={t.cardVideo}
          uploadLabel={t.uploadVideo}
          removeLabel={t.removeMedia}
          accept="video/*"
          value={card.video}
          onChange={(v) => onUpdateCard({ video: v })}
          theme={theme}
          skin={skin}
          kind="video"
        />
        <MediaUploadField
          label={t.cardAudio}
          uploadLabel={t.uploadAudio}
          removeLabel={t.removeMedia}
          accept="audio/*"
          value={card.audio}
          onChange={(v) => onUpdateCard({ audio: v })}
          theme={theme}
          skin={skin}
          kind="audio"
        />
      </div>

      <input
        value={card.note || ""}
        onChange={(e) => onUpdateCard({ note: e.target.value })}
        placeholder={t.cardNote}
        dir="auto"
        className="educraft-input w-full text-xs font-medium px-3.5 py-2 mb-3.5 rounded-xl border outline-none shadow-2xs"
        style={{ borderColor: theme.hairlineStrong, background: theme.surfaceSoft, color: theme.ink }}
      />

      {/* chip strip: questions + aggregated knowledge-link tags, mixed like the sketch */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3">
        {card.questions.map((q, i) => {
          const meta = TYPE_META[q.type];
          return (
            <button
              key={q.id || i}
              onClick={() => jumpTo(q.id)}
              className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5"
              style={{ borderRadius: 999, background: meta.color.bg, color: meta.color.ink }}
            >
              <meta.Icon size={12} />
              {lang === "ar" ? meta.ar : meta.en}
            </button>
          );
        })}
        {linkedItems.map((link, i) => {
          const l = allLeaves.find((x) => x.id === linkLeafId(link));
          if (!l) return null;
          const blockId = linkBlockId(link);
          const blockLabel = blockId ? linkBlockLabel(l, blockId, t) : null;
          return (
            <span
              key={linkKey(link) + i}
              className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5"
              style={{ borderRadius: 999, background: "transparent", border: `1.5px dashed ${theme.accent}`, color: theme.accent }}
            >
              <GitBranch size={11} />
              {lang === "ar" ? l.ar : l.en}
              {blockLabel && <span style={{ opacity: 0.8 }}>› {blockLabel}</span>}
            </span>
          );
        })}
        <div className="relative group shrink-0">
          <button className="w-7 h-7 grid place-items-center" style={{ borderRadius: 999, border: `1.5px dashed ${theme.hairlineStrong}`, color: theme.ink }} title={t.addQuestion}>
            +
          </button>
          <div
            className="hidden group-hover:grid absolute z-10 mt-1 grid-cols-4 gap-1 p-2"
            style={{ borderRadius: skin.radiusSm, background: theme.surface, border: `1px solid ${theme.hairlineStrong}`, boxShadow: skin.shadow }}
          >
            {Object.entries(TYPE_META).map(([key, meta]) => (
              <button key={key} onClick={() => addQ(key)} className="w-7 h-7 grid place-items-center" style={{ borderRadius: 999, background: meta.color.bg, color: meta.color.ink }} title={lang === "ar" ? meta.ar : meta.en}>
                <meta.Icon size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {card.questions.map((q, i) => (
          <div key={q.id || i} ref={(el) => (qRefs.current[q.id] = el)}>
            <QuestionEditorRow
              q={q}
              lang={lang}
              theme={theme}
              skin={skin}
              t={t}
              voiceEnabled={voiceEnabled}
              allLeaves={allLeaves}
              currentLeafId={currentLeafId}
              onUpdate={(patch) => updateQ(i, patch)}
              onDelete={() => deleteQ(i)}
            />
          </div>
        ))}
        {card.questions.length === 0 && (
          <p className="text-xs" style={{ color: theme.inkSoft }}>
            {t.noQuestionsInCard}
          </p>
        )}
      </div>
    </div>
  );
}

/* Geometric branch -> sub-branch -> leaf list. */
function EditorLeafNav({ book, lang, theme, skin, selectedLeafId, onSelect, onAddBranch, onAddLeaf }) {
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranchTitle, setNewBranchTitle] = useState("");
  const [addingLeafToId, setAddingLeafToId] = useState(null);
  const [newLeafTitle, setNewLeafTitle] = useState("");
  const [collapsedBranches, setCollapsedBranches] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const branches = (book?.nodes || []).filter((n) => n.level === "branch");
  const subOf = (bid) => (book?.nodes || []).filter((n) => n.level === "sub" && n.parent === bid);
  const leavesOf = (sid) => (book?.nodes || []).filter((n) => n.level === "leaf" && n.parent === sid);

  const toggleCollapse = (bid) => {
    setCollapsedBranches((prev) => ({ ...prev, [bid]: !prev[bid] }));
  };

  const handleCommitBranch = () => {
    const trimmed = newBranchTitle.trim();
    if (trimmed && onAddBranch) {
      onAddBranch(trimmed);
      setNewBranchTitle("");
      setIsAddingBranch(false);
    }
  };

  const handleCommitLeaf = (parentId) => {
    const trimmed = newLeafTitle.trim();
    if (trimmed && onAddLeaf) {
      onAddLeaf(parentId, trimmed);
      setNewLeafTitle("");
      setAddingLeafToId(null);
    }
  };

  const LeafButton = ({ l }) => {
    const isSelected = selectedLeafId === l.id;
    const title = (lang === "ar" ? l.ar : l.en) || l.en || l.ar || "";
    if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return null;
    }
    return (
      <button
        key={l.id}
        type="button"
        onClick={() => onSelect(l.id)}
        className="educraft-btn w-full text-start text-xs px-3 py-2 flex items-center justify-between gap-2.5 cursor-pointer transition-all rounded-xl relative group shadow-2xs"
        style={{
          background: isSelected ? theme.accentSoft : "transparent",
          color: isSelected ? theme.accent : theme.ink,
          border: isSelected ? `1px solid ${theme.accent}44` : "1px solid transparent",
        }}
        title={title}
      >
        {isSelected && (
          <span
            className="absolute start-0 top-1.5 bottom-1.5 w-1 rounded-full shadow-xs"
            style={{ background: theme.accent }}
          />
        )}
        <span className="line-clamp-2 leading-relaxed flex-1 ps-1 font-semibold text-[11px] sm:text-xs">
          {title}
        </span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 tabular-nums shadow-2xs"
          style={{
            background: isSelected ? `${theme.accent}25` : theme.surfaceSoft,
            color: isSelected ? theme.accent : theme.inkSoft,
            border: `1px solid ${isSelected ? `${theme.accent}44` : theme.hairline}`,
          }}
        >
          {(l.questions || []).length}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Sidebar Header with Outline title and + Branch CTA */}
      <div className="flex items-center justify-between gap-1 pb-2 border-b" style={{ borderColor: theme.hairline }}>
        <div className="flex items-center gap-1.5">
          <BookOpen size={14} style={{ color: theme.accent }} />
          <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.ink }}>
            {lang === "ar" ? "الهيكل والمحتوى" : "Curriculum Outline"}
          </span>
        </div>
        {onAddBranch && (
          <button
            type="button"
            onClick={() => {
              setIsAddingBranch((v) => !v);
              setNewBranchTitle("");
            }}
            className="educraft-btn flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer shadow-2xs"
            style={{
              background: isAddingBranch ? theme.accent : theme.accentSoft,
              color: isAddingBranch ? theme.accentInk : theme.accent,
              border: `1px solid ${theme.accent}33`,
            }}
            title={lang === "ar" ? "إضافة فرع رئيسي جديد" : "Add new branch"}
          >
            <Plus size={12} />
            <span>{lang === "ar" ? "فرع" : "Branch"}</span>
          </button>
        )}
      </div>

      {/* Inline New Branch Input Box */}
      {isAddingBranch && (
        <div
          className="p-2.5 rounded-xl border shadow-sm educraft-panel-in flex flex-col gap-2"
          style={{ background: theme.surface, borderColor: theme.accent }}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: theme.accent }}>
            <FolderPlus size={13} />
            <span>{lang === "ar" ? "فرع رئيسي جديد:" : "New Branch Title:"}</span>
          </div>
          <input
            type="text"
            autoFocus
            value={newBranchTitle}
            onChange={(e) => setNewBranchTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCommitBranch();
              else if (e.key === "Escape") setIsAddingBranch(false);
            }}
            placeholder={lang === "ar" ? "اكتب اسم الفرع واضغط Enter..." : "Type branch name & hit Enter..."}
            className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border outline-none"
            style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsAddingBranch(false)}
              className="educraft-btn text-[11px] font-bold px-2 py-1 rounded-md cursor-pointer"
              style={{ color: theme.inkSoft }}
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={handleCommitBranch}
              className="educraft-btn text-[11px] font-bold px-3 py-1 rounded-md cursor-pointer shadow-2xs"
              style={{ background: theme.accent, color: theme.accentInk }}
            >
              {lang === "ar" ? "حفظ الفرع" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Quick Search Filter with Search Icon and Clear Button */}
      {branches.length > 1 && (
        <div className="relative">
          <Search size={13} className="absolute start-2.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" style={{ color: theme.ink }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "بحث في أوراق المنهج..." : "Filter leaves..."}
            className="w-full text-xs ps-8 pe-7 py-2 rounded-xl border outline-none transition-all"
            style={{ background: theme.surfaceSoft, borderColor: theme.hairlineStrong, color: theme.ink }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold opacity-60 hover:opacity-100"
              style={{ color: theme.ink }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {branches.length === 0 ? (
        <div className="p-4 text-center rounded-xl border flex flex-col items-center gap-2.5" style={{ background: theme.surfaceSoft, borderColor: theme.hairline }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: theme.accentSoft, color: theme.accent }}>
            <GitBranch size={18} />
          </div>
          <p className="text-xs font-medium" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
            {lang === "ar" ? "هذا الكتاب لا يحتوي على أي فروع بعد. ابدأ بإضافة فرعك الأول:" : "Book has no branches yet. Add your first branch:"}
          </p>
          {onAddBranch && (
            <button
              type="button"
              onClick={() => setIsAddingBranch(true)}
              className="educraft-btn w-full text-xs font-bold py-2 flex items-center justify-center gap-1.5 shadow-sm rounded-xl cursor-pointer"
              style={{ background: theme.accent, color: theme.accentInk }}
            >
              <Plus size={13} />
              {lang === "ar" ? "إضافة فرع جديد" : "Add New Branch"}
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[75vh] overflow-y-auto pe-1">
          {branches.map((b) => {
            const isCollapsed = !!collapsedBranches[b.id];
            const directLeaves = leavesOf(b.id);
            const subs = subOf(b.id);
            const isAddingLeafHere = addingLeafToId === b.id;

            return (
              <div
                key={b.id}
                className="rounded-2xl p-2 transition-all border shadow-2xs"
                style={{ background: theme.surface, borderColor: theme.hairline }}
              >
                {/* Branch Header */}
                <div className="flex items-center justify-between gap-1 mb-1 px-1">
                  <div
                    onClick={() => toggleCollapse(b.id)}
                    className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 select-none py-1 group"
                  >
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200 shrink-0"
                      style={{
                        color: theme.accent,
                        transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                      }}
                    />
                    <span className="text-xs font-black tracking-tight truncate group-hover:opacity-85" style={{ color: theme.ink }}>
                      {lang === "ar" ? b.ar : b.en}
                    </span>
                  </div>
                  {onAddLeaf && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddingLeafToId(isAddingLeafHere ? null : b.id);
                        setNewLeafTitle("");
                      }}
                      className="educraft-btn text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer border shadow-2xs"
                      style={{
                        background: isAddingLeafHere ? theme.accent : theme.surfaceSoft,
                        color: isAddingLeafHere ? theme.accentInk : theme.inkSoft,
                        borderColor: theme.hairlineStrong,
                      }}
                      title={lang === "ar" ? "إضافة ورقة لهذا الفرع" : "Add leaf to this branch"}
                    >
                      <Plus size={11} />
                      <span>{lang === "ar" ? "ورقة" : "Leaf"}</span>
                    </button>
                  )}
                </div>

                {/* Inline New Leaf Box for Branch */}
                {isAddingLeafHere && (
                  <div
                    className="p-2 my-1.5 rounded-lg border shadow-xs educraft-panel-in flex flex-col gap-1.5"
                    style={{ background: theme.surface, borderColor: theme.accent }}
                  >
                    <input
                      type="text"
                      autoFocus
                      value={newLeafTitle}
                      onChange={(e) => setNewLeafTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCommitLeaf(b.id);
                        else if (e.key === "Escape") setAddingLeafToId(null);
                      }}
                      placeholder={lang === "ar" ? "عنوان الورقة الجديدة..." : "New leaf title..."}
                      className="w-full text-xs font-medium px-2 py-1 rounded border outline-none"
                      style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
                    />
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setAddingLeafToId(null)}
                        className="educraft-btn text-[10px] font-bold px-2 py-0.5"
                        style={{ color: theme.inkSoft }}
                      >
                        {lang === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCommitLeaf(b.id)}
                        className="educraft-btn text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ background: theme.accent, color: theme.accentInk }}
                      >
                        {lang === "ar" ? "إضافة" : "Add"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Branch Children (Leaves and Sub-branches) */}
                {!isCollapsed && (
                  <div className="flex flex-col gap-1 ps-2.5 mt-1" style={{ borderInlineStart: `2px solid ${theme.hairlineStrong}` }}>
                    {directLeaves.map((l) => (
                      <LeafButton key={l.id} l={l} />
                    ))}

                    {subs.map((s) => {
                      const isSubAddingLeaf = addingLeafToId === s.id;
                      return (
                        <div key={s.id} className="mt-1">
                          <div className="flex items-center justify-between gap-1 mb-1 px-1">
                            <span className="text-[11px] font-bold truncate" style={{ color: theme.inkSoft }}>
                              {lang === "ar" ? s.ar : s.en}
                            </span>
                            {onAddLeaf && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAddingLeafToId(isSubAddingLeaf ? null : s.id);
                                  setNewLeafTitle("");
                                }}
                                className="educraft-btn text-[9px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5 shrink-0 cursor-pointer border"
                                style={{
                                  background: isSubAddingLeaf ? theme.accent : theme.surface,
                                  color: isSubAddingLeaf ? theme.accentInk : theme.ink,
                                  borderColor: theme.hairline,
                                }}
                                title={lang === "ar" ? "إضافة ورقة" : "Add leaf"}
                              >
                                <Plus size={8} />
                                <span>{lang === "ar" ? "ورقة" : "Leaf"}</span>
                              </button>
                            )}
                          </div>

                          {isSubAddingLeaf && (
                            <div
                              className="p-2 my-1 rounded-lg border shadow-xs educraft-panel-in flex flex-col gap-1.5"
                              style={{ background: theme.surface, borderColor: theme.accent }}
                            >
                              <input
                                type="text"
                                autoFocus
                                value={newLeafTitle}
                                onChange={(e) => setNewLeafTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleCommitLeaf(s.id);
                                  else if (e.key === "Escape") setAddingLeafToId(null);
                                }}
                                placeholder={lang === "ar" ? "عنوان الورقة..." : "Leaf title..."}
                                className="w-full text-xs font-medium px-2 py-1 rounded border outline-none"
                                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
                              />
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setAddingLeafToId(null)}
                                  className="educraft-btn text-[10px] font-bold px-2 py-0.5"
                                  style={{ color: theme.inkSoft }}
                                >
                                  {lang === "ar" ? "إلغاء" : "Cancel"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCommitLeaf(s.id)}
                                  className="educraft-btn text-[10px] font-bold px-2 py-0.5 rounded"
                                  style={{ background: theme.accent, color: theme.accentInk }}
                                >
                                  {lang === "ar" ? "إضافة" : "Add"}
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col gap-1 ps-2">
                            {leavesOf(s.id).map((l) => (
                              <LeafButton key={l.id} l={l} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* The 60 ثِقة plate palettes (from all-60-plates.html), each a full
   {PageBG,HeaderColor,SectionBG,SectionFrame,KeyBG,KeyFrame,KeyText,
   NoteBG,NoteFrame,NoteText,BodyText,WarningBG,WarningFrame,WarningText,
   ImportantText,HighlightBG} set — the A4 page builder's palette picker
   pulls PLATE_KINDS + page colors straight from whichever one is active. */
const PAGE_PALETTES = [
  { id: 1, name: "كلاسيك أكاديمي", en: "Classic Academic", PageBG: "#F8F5F0", HeaderColor: "#2E4060", SectionBG: "#E8874A", SectionFrame: "#C96B2F", KeyBG: "#E8F7F9", KeyFrame: "#4C9DB0", KeyText: "#1A6B7A", NoteBG: "#F0EDF7", NoteFrame: "#655A7C", NoteText: "#3B3050", BodyText: "#000000", WarningBG: "#F2F4E6", WarningFrame: "#84922A", WarningText: "#626D17", ImportantText: "#14428F", HighlightBG: "#D9E0F2" },
  { id: 2, name: "أزرق محايد", en: "Neutral Blue", PageBG: "#F5F8FA", HeaderColor: "#1B3A5C", SectionBG: "#2E6F9E", SectionFrame: "#1F4F73", KeyBG: "#E6F2F8", KeyFrame: "#3E8FBF", KeyText: "#14506E", NoteBG: "#EAEFF5", NoteFrame: "#52688A", NoteText: "#2A3A52", BodyText: "#000000", WarningBG: "#E8E6F4", WarningFrame: "#4934B2", WarningText: "#26176D", ImportantText: "#8F4514", HighlightBG: "#F2ECD9" },
  { id: 3, name: "رمادي أنيق", en: "Slate Gray", PageBG: "#F7F7F6", HeaderColor: "#33363B", SectionBG: "#6E5046", SectionFrame: "#4F3A33", KeyBG: "#EDEDEA", KeyFrame: "#8A8580", KeyText: "#3A3833", NoteBG: "#F1ECEA", NoteFrame: "#8C6F62", NoteText: "#4A3A32", BodyText: "#000000", WarningBG: "#F4F4E6", WarningFrame: "#92922A", WarningText: "#6D6D17", ImportantText: "#14148F", HighlightBG: "#D9E3F2" },
  { id: 4, name: "باستيل وردي", en: "Soft Rose", PageBG: "#FDF6F5", HeaderColor: "#8C4B5A", SectionBG: "#E8A0AC", SectionFrame: "#C97584", KeyBG: "#FCEDEF", KeyFrame: "#D98A9A", KeyText: "#8A3D4C", NoteBG: "#FBF0E9", NoteFrame: "#C99E84", NoteText: "#6E4A36", BodyText: "#000000", WarningBG: "#F4EEE6", WarningFrame: "#B27D34", WarningText: "#6D4917", ImportantText: "#127481", HighlightBG: "#D9EEF2" },
  { id: 5, name: "باستيل نعناعي", en: "Mint Pastel", PageBG: "#F4FAF7", HeaderColor: "#2F6B57", SectionBG: "#6FBFA0", SectionFrame: "#409478", KeyBG: "#E7F7F1", KeyFrame: "#52B399", KeyText: "#1F6B53", NoteBG: "#EEF6F8", NoteFrame: "#6FA8B5", NoteText: "#2C5A66", BodyText: "#000000", WarningBG: "#E6EFF4", WarningFrame: "#3484B2", WarningText: "#174E6D", ImportantText: "#8F1452", HighlightBG: "#F2D9DA" },
  { id: 6, name: "باستيل لافندر", en: "Lavender Pastel", PageBG: "#F8F6FB", HeaderColor: "#4A3F73", SectionBG: "#9A8AC7", SectionFrame: "#6F5DA3", KeyBG: "#EFEAF8", KeyFrame: "#8470B8", KeyText: "#4B3A7A", NoteBG: "#EAF0F6", NoteFrame: "#7E93B0", NoteText: "#354A66", BodyText: "#000000", WarningBG: "#F4E6F4", WarningFrame: "#B234B0", WarningText: "#6D176C", ImportantText: "#4C7411", HighlightBG: "#E3F2D9" },
  { id: 7, name: "باستيل خوخي", en: "Peach Pastel", PageBG: "#FDF8F1", HeaderColor: "#8A5A2E", SectionBG: "#EFA85E", SectionFrame: "#D1873A", KeyBG: "#FCEFE0", KeyFrame: "#E0A05C", KeyText: "#7A4C20", NoteBG: "#FAF3E6", NoteFrame: "#C9A06A", NoteText: "#6B4E2A", BodyText: "#000000", WarningBG: "#F1F4E6", WarningFrame: "#7E9A2D", WarningText: "#576D17", ImportantText: "#14478F", HighlightBG: "#D9DDF2" },
  { id: 8, name: "ليلي أزرق", en: "Midnight Blue", PageBG: "#1B1F2A", HeaderColor: "#E8ECF2", SectionBG: "#3D6FB4", SectionFrame: "#6E9CDB", KeyBG: "#223240", KeyFrame: "#5EC3D6", KeyText: "#8FE3F0", NoteBG: "#282235", NoteFrame: "#9E8FD6", NoteText: "#C9BBF5", BodyText: "#E6E8EC", WarningBG: "#31244C", WarningFrame: "#774DCB", WarningText: "#BBA5E9", ImportantText: "#8999E6", HighlightBG: "#403D1C" },
  { id: 9, name: "ليلي بنفسجي", en: "Deep Violet", PageBG: "#201A2B", HeaderColor: "#F0E9F7", SectionBG: "#8A5FBF", SectionFrame: "#AE8AE0", KeyBG: "#271F38", KeyFrame: "#4FB3A8", KeyText: "#8FE0D4", NoteBG: "#2A2230", NoteFrame: "#C99A6B", NoteText: "#EAC79A", BodyText: "#EDE7F4", WarningBG: "#4C2444", WarningFrame: "#CB4DB2", WarningText: "#E9A5DB", ImportantText: "#CA89E6", HighlightBG: "#24401C" },
  { id: 10, name: "ليلي أخضر", en: "Forest Night", PageBG: "#16201C", HeaderColor: "#E6F0EA", SectionBG: "#3E8E68", SectionFrame: "#63B58A", KeyBG: "#1C2A24", KeyFrame: "#5BAFA0", KeyText: "#9FE3D4", NoteBG: "#20251F", NoteFrame: "#A9A45E", NoteText: "#E1DC9E", BodyText: "#E7EDE9", WarningBG: "#24414C", WarningFrame: "#4DA9CB", WarningText: "#A5D6E9", ImportantText: "#89E6D1", HighlightBG: "#401C21" },
  { id: 11, name: "طبي إكلينيكي", en: "Clinical Teal", PageBG: "#FAFCFD", HeaderColor: "#0E5C73", SectionBG: "#1C8FA8", SectionFrame: "#146C82", KeyBG: "#E3F6F4", KeyFrame: "#2BA89A", KeyText: "#0E6B5F", NoteBG: "#EAF4FB", NoteFrame: "#4A8FBF", NoteText: "#1B4F75", BodyText: "#000000", WarningBG: "#E6E7F4", WarningFrame: "#343DB2", WarningText: "#171D6D", ImportantText: "#8F3D14", HighlightBG: "#F2E6D9" },
  { id: 12, name: "هندسي تقني", en: "Tech Amber", PageBG: "#F6F7F8", HeaderColor: "#22272E", SectionBG: "#E0A12C", SectionFrame: "#B8821B", KeyBG: "#E9EEF2", KeyFrame: "#4A6B8A", KeyText: "#1F3A52", NoteBG: "#EEEDEA", NoteFrame: "#8C8275", NoteText: "#4A4338", BodyText: "#000000", WarningBG: "#EFF4E6", WarningFrame: "#6E9A2D", WarningText: "#4B6D17", ImportantText: "#8F5214", HighlightBG: "#D9D9F2" },
  { id: 13, name: "طبيعي ترابي", en: "Natural Earth", PageBG: "#F7F5EE", HeaderColor: "#4A4520", SectionBG: "#8A9B5E", SectionFrame: "#677A3E", KeyBG: "#EFF1E3", KeyFrame: "#7E9460", KeyText: "#435228", NoteBG: "#F1E9DE", NoteFrame: "#A07D52", NoteText: "#5C4327", BodyText: "#000000", WarningBG: "#E6F4E6", WarningFrame: "#2FA232", WarningText: "#176D1A", ImportantText: "#14308F", HighlightBG: "#E8D9F2" },
  { id: 14, name: "ملكي ذهبي", en: "Royal Gold", PageBG: "#F9F7F1", HeaderColor: "#1F2A4A", SectionBG: "#B68A3E", SectionFrame: "#8C6A26", KeyBG: "#F3EEE0", KeyFrame: "#A9842F", KeyText: "#6B4F18", NoteBG: "#EFEAF1", NoteFrame: "#7A4F5E", NoteText: "#5A2E3C", BodyText: "#000000", WarningBG: "#EFF4E6", WarningFrame: "#709A2D", WarningText: "#4C6D17", ImportantText: "#14338F", HighlightBG: "#D9DAF2" },
  { id: 15, name: "عصري جريء", en: "Bold Modern", PageBG: "#FBFBFA", HeaderColor: "#1A2E35", SectionBG: "#EB5E55", SectionFrame: "#C73E36", KeyBG: "#E3F4F2", KeyFrame: "#1FA39A", KeyText: "#0E6760", NoteBG: "#FDF1E3", NoteFrame: "#E0A23A", NoteText: "#7A4E12", BodyText: "#000000", WarningBG: "#F4F2E6", WarningFrame: "#A69030", WarningText: "#6D5D17", ImportantText: "#14148F", HighlightBG: "#D9E8F2" },
  { id: 16, name: "أحمر مرجاني", en: "Coral Red", PageBG: "#F7F3F3", HeaderColor: "#511F1F", SectionBG: "#C84141", SectionFrame: "#9D2525", KeyBG: "#E5F5ED", KeyFrame: "#3B9B6B", KeyText: "#1F6B45", NoteBG: "#EEEAF5", NoteFrame: "#654B9B", NoteText: "#3E2B64", BodyText: "#000000", WarningBG: "#F4F1E6", WarningFrame: "#A68930", WarningText: "#6D5817", ImportantText: "#117474", HighlightBG: "#D9EAF2" },
  { id: 17, name: "أخضر زمردي", en: "Emerald Green", PageBG: "#F3F7F4", HeaderColor: "#1F512E", SectionBG: "#268241", SectionFrame: "#124E24", KeyBG: "#F2E5F5", KeyFrame: "#9B43B1", KeyText: "#5B1F6B", NoteBG: "#F5F1EA", NoteFrame: "#9B7D4B", NoteText: "#644F2B", BodyText: "#000000", WarningBG: "#E6F4F4", WarningFrame: "#2F9DA2", WarningText: "#176A6D", ImportantText: "#8F1470", HighlightBG: "#F2D9E2" },
  { id: 18, name: "أرجواني", en: "Purple Majesty", PageBG: "#F5F3F7", HeaderColor: "#3C1F51", SectionBG: "#9041C8", SectionFrame: "#6B259D", KeyBG: "#F4F5E5", KeyFrame: "#899037", KeyText: "#646B1F", NoteBG: "#EAF5F4", NoteFrame: "#499791", NoteText: "#2B645F", BodyText: "#000000", WarningBG: "#F4E6F0", WarningFrame: "#B23488", WarningText: "#6D1751", ImportantText: "#427411", HighlightBG: "#DBF2D9" },
  { id: 19, name: "ذهبي فاتح", en: "Pale Gold", PageBG: "#F7F6F3", HeaderColor: "#514B1F", SectionBG: "#7E7325", SectionFrame: "#4A4311", KeyBG: "#E5EFF5", KeyFrame: "#4388B1", KeyText: "#1F4E6B", NoteBG: "#F5EAF3", NoteFrame: "#9B4B8A", NoteText: "#642B58", BodyText: "#000000", WarningBG: "#EBF4E6", WarningFrame: "#589E2E", WarningText: "#376D17", ImportantText: "#14338F", HighlightBG: "#DED9F2" },
  { id: 20, name: "سماوي", en: "Sky Cyan", PageBG: "#F3F6F7", HeaderColor: "#1F4951", SectionBG: "#297D8E", SectionFrame: "#154F5B", KeyBG: "#F5E5EA", KeyFrame: "#B14368", KeyText: "#6B1F38", NoteBG: "#F0F5EA", NoteFrame: "#709749", NoteText: "#47642B", BodyText: "#000000", WarningBG: "#E6E7F4", WarningFrame: "#343EB2", WarningText: "#171E6D", ImportantText: "#8F3314", HighlightBG: "#F2E6D9" },
  { id: 21, name: "فوشيا", en: "Fuchsia Pop", PageBG: "#F7F3F5", HeaderColor: "#511F3A", SectionBG: "#C73D88", SectionFrame: "#992463", KeyBG: "#E6F5E5", KeyFrame: "#409F3C", KeyText: "#226B1F", NoteBG: "#EAEDF5", NoteFrame: "#4B5B9B", NoteText: "#2B3764", BodyText: "#000000", WarningBG: "#F4E9E6", WarningFrame: "#B24E34", WarningText: "#6D2917", ImportantText: "#117845", HighlightBG: "#D9F2ED" },
  { id: 22, name: "أخضر ربيعي", en: "Spring Leaf", PageBG: "#F4F7F3", HeaderColor: "#2B511F", SectionBG: "#3D8226", SectionFrame: "#214E12", KeyBG: "#E9E5F5", KeyFrame: "#5F43B1", KeyText: "#321F6B", NoteBG: "#F5EBEA", NoteFrame: "#9B514B", NoteText: "#64302B", BodyText: "#000000", WarningBG: "#E6F4ED", WarningFrame: "#2E9E66", WarningText: "#176D42", ImportantText: "#70148F", HighlightBG: "#F2D9F0" },
  { id: 23, name: "أزرق نيلي", en: "Indigo Dusk", PageBG: "#F3F3F7", HeaderColor: "#211F51", SectionBG: "#4741C8", SectionFrame: "#2A259D", KeyBG: "#F5EEE5", KeyFrame: "#B17F43", KeyText: "#6B481F", NoteBG: "#EAF5EE", NoteFrame: "#4B9B69", NoteText: "#2B6440", BodyText: "#000000", WarningBG: "#F1E6F4", WarningFrame: "#9834B2", WarningText: "#5C176D", ImportantText: "#6B6B0F", HighlightBG: "#E9F2D9" },
  { id: 24, name: "برتقالي دافئ", en: "Warm Amber", PageBG: "#F7F4F3", HeaderColor: "#51301F", SectionBG: "#B25E34", SectionFrame: "#803F1E", KeyBG: "#E5F5F3", KeyFrame: "#3B9B8B", KeyText: "#1F6B5E", NoteBG: "#F1EAF5", NoteFrame: "#804B9B", NoteText: "#512B64", BodyText: "#000000", WarningBG: "#F3F4E6", WarningFrame: "#8A922A", WarningText: "#666D17", ImportantText: "#14708F", HighlightBG: "#D9E1F2" },
  { id: 25, name: "نعناعي غامق", en: "Deep Mint", PageBG: "#F3F7F5", HeaderColor: "#1F513E", SectionBG: "#268260", SectionFrame: "#124E38", KeyBG: "#F5E5F3", KeyFrame: "#B143A4", KeyText: "#6B1F61", NoteBG: "#F5F5EA", NoteFrame: "#949147", NoteText: "#64622B", BodyText: "#000000", WarningBG: "#E6EFF4", WarningFrame: "#3482B2", WarningText: "#174D6D", ImportantText: "#8F1452", HighlightBG: "#F2D9DA" },
  { id: 26, name: "موف", en: "Mauve Velvet", PageBG: "#F7F3F7", HeaderColor: "#4D1F51", SectionBG: "#BA39C6", SectionFrame: "#8B2395", KeyBG: "#EEF5E5", KeyFrame: "#70983A", KeyText: "#4B6B1F", NoteBG: "#EAF2F5", NoteFrame: "#4B879B", NoteText: "#2B5664", BodyText: "#000000", WarningBG: "#F4E6EB", WarningFrame: "#B2345E", WarningText: "#6D1734", ImportantText: "#117811", HighlightBG: "#D9F2DF" },
  { id: 27, name: "ليموني", en: "Lime Zest", PageBG: "#F6F7F3", HeaderColor: "#47511F", SectionBG: "#687B24", SectionFrame: "#3B4610", KeyBG: "#E5EAF5", KeyFrame: "#4363B1", KeyText: "#1F356B", NoteBG: "#F5EAEF", NoteFrame: "#9B4B6F", NoteText: "#642B45", BodyText: "#000000", WarningBG: "#E6F4E6", WarningFrame: "#33A22F", WarningText: "#1A6D17", ImportantText: "#33148F", HighlightBG: "#E7D9F2" },
  { id: 28, name: "أزرق سماء", en: "Cerulean Sky", PageBG: "#F3F5F7", HeaderColor: "#1F3851", SectionBG: "#3678BA", SectionFrame: "#205488", KeyBG: "#F5E5E5", KeyFrame: "#B14343", KeyText: "#6B1F1F", NoteBG: "#ECF5EA", NoteFrame: "#589B4B", NoteText: "#34642B", BodyText: "#000000", WarningBG: "#EAE6F4", WarningFrame: "#5334B2", WarningText: "#2D176D", ImportantText: "#8F5214", HighlightBG: "#F2EED9" },
  { id: 29, name: "توتي فروتي", en: "Berry Punch", PageBG: "#F7F3F3", HeaderColor: "#511F29", SectionBG: "#C8415D", SectionFrame: "#9D253E", KeyBG: "#E5F5EA", KeyFrame: "#3C9F59", KeyText: "#1F6B35", NoteBG: "#ECEAF5", NoteFrame: "#554B9B", NoteText: "#322B64", BodyText: "#000000", WarningBG: "#F4EEE6", WarningFrame: "#B27834", WarningText: "#6D4617", ImportantText: "#117474", HighlightBG: "#D9EFF2" },
  { id: 30, name: "أخضر زمردي 2", en: "Emerald Mint", PageBG: "#F3F7F3", HeaderColor: "#1F5123", SectionBG: "#27862F", SectionFrame: "#135319", KeyBG: "#EFE5F5", KeyFrame: "#8443B1", KeyText: "#4B1F6B", NoteBG: "#F5EFEA", NoteFrame: "#9B6C4B", NoteText: "#64432B", BodyText: "#000000", WarningBG: "#E6F4F2", WarningFrame: "#2E9E8B", WarningText: "#176D5F", ImportantText: "#8F148F", HighlightBG: "#F2D9E8" },
  { id: 31, name: "بنفسجي ملكي", en: "Imperial Violet", PageBG: "#F4F3F7", HeaderColor: "#321F51", SectionBG: "#7441C8", SectionFrame: "#52259D", KeyBG: "#F5F3E5", KeyFrame: "#988C3A", KeyText: "#6B611F", NoteBG: "#EAF5F2", NoteFrame: "#4B9B84", NoteText: "#2B6453", BodyText: "#000000", WarningBG: "#F4E6F2", WarningFrame: "#B234A2", WarningText: "#6D1762", ImportantText: "#587010", HighlightBG: "#E0F2D9" },
  { id: 32, name: "كهرماني", en: "Golden Amber", PageBG: "#F7F6F3", HeaderColor: "#51411F", SectionBG: "#8E6D29", SectionFrame: "#5B4415", KeyBG: "#E5F2F5", KeyFrame: "#4198AA", KeyText: "#1F5E6B", NoteBG: "#F5EAF5", NoteFrame: "#9B4B9B", NoteText: "#642B64", BodyText: "#000000", WarningBG: "#EEF4E6", WarningFrame: "#6C9A2D", WarningText: "#496D17", ImportantText: "#14338F", HighlightBG: "#D9D9F2" },
  { id: 33, name: "تركواز", en: "Ocean Turquoise", PageBG: "#F3F7F7", HeaderColor: "#1F514F", SectionBG: "#257E7B", SectionFrame: "#114A48", KeyBG: "#F5E5EE", KeyFrame: "#B1437F", KeyText: "#6B1F48", NoteBG: "#F2F5EA", NoteFrame: "#809749", NoteText: "#53642B", BodyText: "#000000", WarningBG: "#E6EAF4", WarningFrame: "#3457B2", WarningText: "#17306D", ImportantText: "#8F1414", HighlightBG: "#F2E0D9" },
  { id: 34, name: "فوشيا 2", en: "Vivid Fuchsia", PageBG: "#F7F3F6", HeaderColor: "#511F45", SectionBG: "#C639A2", SectionFrame: "#952378", KeyBG: "#E9F5E5", KeyFrame: "#539B3B", KeyText: "#326B1F", NoteBG: "#EAEFF5", NoteFrame: "#4B6C9B", NoteText: "#2B4364", BodyText: "#000000", WarningBG: "#F4E6E6", WarningFrame: "#B23434", WarningText: "#6D1817", ImportantText: "#11782B", HighlightBG: "#D9F2E8" },
  { id: 35, name: "أخضر ربيعي 2", en: "Meadow Green", PageBG: "#F5F7F3", HeaderColor: "#36511F", SectionBG: "#508226", SectionFrame: "#2E4E12", KeyBG: "#E6E5F5", KeyFrame: "#4843B1", KeyText: "#221F6B", NoteBG: "#F5EAEC", NoteFrame: "#9B4B54", NoteText: "#642B32", BodyText: "#000000", WarningBG: "#E6F4EA", WarningFrame: "#2FA251", WarningText: "#176D30", ImportantText: "#52148F", HighlightBG: "#EFD9F2" },
  { id: 36, name: "أزرق نيلي 2", en: "Cobalt Indigo", PageBG: "#F3F3F7", HeaderColor: "#1F2751", SectionBG: "#4157C8", SectionFrame: "#25399D", KeyBG: "#F5EBE5", KeyFrame: "#B16843", KeyText: "#6B381F", NoteBG: "#EAF5EC", NoteFrame: "#4B9B58", NoteText: "#2B6435", BodyText: "#000000", WarningBG: "#EEE6F4", WarningFrame: "#7E34B2", WarningText: "#4A176D", ImportantText: "#6B6B0F", HighlightBG: "#EEF2D9" },
  { id: 37, name: "أحمر مرجاني 2", en: "Sunset Coral", PageBG: "#F7F3F3", HeaderColor: "#51251F", SectionBG: "#C64B39", SectionFrame: "#953123", KeyBG: "#E5F5EF", KeyFrame: "#3B9B77", KeyText: "#1F6B4F", NoteBG: "#EFEAF5", NoteFrame: "#704B9B", NoteText: "#452B64", BodyText: "#000000", WarningBG: "#F4F3E6", WarningFrame: "#9A8D2D", WarningText: "#6D6317", ImportantText: "#117474", HighlightBG: "#D9E6F2" },
  { id: 38, name: "أخضر زمردي 3", en: "Jade Forest", PageBG: "#F3F7F4", HeaderColor: "#1F5134", SectionBG: "#26824D", SectionFrame: "#124E2C", KeyBG: "#F4E5F5", KeyFrame: "#A943B1", KeyText: "#651F6B", NoteBG: "#F5F2EA", NoteFrame: "#9B874B", NoteText: "#64562B", BodyText: "#000000", WarningBG: "#E6F2F4", WarningFrame: "#3298AE", WarningText: "#175E6D", ImportantText: "#8F1470", HighlightBG: "#F2D9DF" },
  { id: 39, name: "أرجواني 2", en: "Amethyst Glow", PageBG: "#F6F3F7", HeaderColor: "#431F51", SectionBG: "#A141C8", SectionFrame: "#7A259D", KeyBG: "#F2F5E5", KeyFrame: "#809438", KeyText: "#5B6B1F", NoteBG: "#EAF5F5", NoteFrame: "#4B979B", NoteText: "#2B6164", BodyText: "#000000", WarningBG: "#F4E6EE", WarningFrame: "#B23478", WarningText: "#6D1746", ImportantText: "#2B7811", HighlightBG: "#D9F2DA" },
  { id: 40, name: "ذهبي فاتح 2", en: "Antique Gold", PageBG: "#F7F7F3", HeaderColor: "#51511F", SectionBG: "#767722", SectionFrame: "#424210", KeyBG: "#E5EDF5", KeyFrame: "#437AB1", KeyText: "#1F456B", NoteBG: "#F5EAF1", NoteFrame: "#9B4B80", NoteText: "#642B51", BodyText: "#000000", WarningBG: "#E9F4E6", WarningFrame: "#4AA22F", WarningText: "#2C6D17", ImportantText: "#14148F", HighlightBG: "#E2D9F2" },
  { id: 41, name: "سماوي 2", en: "Aegean Cyan", PageBG: "#F3F6F7", HeaderColor: "#1F4251", SectionBG: "#2E7D9E", SectionFrame: "#19536B", KeyBG: "#F5E5E8", KeyFrame: "#B1435A", KeyText: "#6B1F2F", NoteBG: "#EEF5EA", NoteFrame: "#689B4B", NoteText: "#40642B", BodyText: "#000000", WarningBG: "#E7E6F4", WarningFrame: "#3934B2", WarningText: "#1B176D", ImportantText: "#8F3314", HighlightBG: "#F2E9D9" },
  { id: 42, name: "وردي غامق", en: "Crimson Rose", PageBG: "#F7F3F4", HeaderColor: "#511F34", SectionBG: "#C84179", SectionFrame: "#9D2556", KeyBG: "#E5F5E7", KeyFrame: "#3C9F45", KeyText: "#1F6B26", NoteBG: "#EAEBF5", NoteFrame: "#4B519B", NoteText: "#2B2F64", BodyText: "#000000", WarningBG: "#F4EBE6", WarningFrame: "#B25E34", WarningText: "#6D3417", ImportantText: "#11745B", HighlightBG: "#D9F2F0" },
  { id: 43, name: "أخضر ربيعي 3", en: "Alpine Green", PageBG: "#F3F7F3", HeaderColor: "#25511F", SectionBG: "#318226", SectionFrame: "#1A4E12", KeyBG: "#EBE5F5", KeyFrame: "#6D43B1", KeyText: "#3C1F6B", NoteBG: "#F5EDEA", NoteFrame: "#9B5C4B", NoteText: "#64372B", BodyText: "#000000", WarningBG: "#E6F4EF", WarningFrame: "#2E9E75", WarningText: "#176D4E", ImportantText: "#8F148F", HighlightBG: "#F2D9ED" },
  { id: 44, name: "بنفسجي ملكي 2", en: "Royal Iris", PageBG: "#F3F3F7", HeaderColor: "#271F51", SectionBG: "#5841C8", SectionFrame: "#39259D", KeyBG: "#F5F0E5", KeyFrame: "#AA8741", KeyText: "#6B521F", NoteBG: "#EAF5F0", NoteFrame: "#4B9B73", NoteText: "#2B6448", BodyText: "#000000", WarningBG: "#F3E6F4", WarningFrame: "#A834B2", WarningText: "#67176D", ImportantText: "#6B6B0F", HighlightBG: "#E5F2D9" },
  { id: 45, name: "برتقالي دافئ 2", en: "Terracotta", PageBG: "#F7F5F3", HeaderColor: "#51361F", SectionBG: "#A2642F", SectionFrame: "#70421A", KeyBG: "#E5F5F5", KeyFrame: "#3B9B98", KeyText: "#1F6B68", NoteBG: "#F3EAF5", NoteFrame: "#8A4B9B", NoteText: "#582B64", BodyText: "#000000", WarningBG: "#F1F4E6", WarningFrame: "#80962C", WarningText: "#5B6D17", ImportantText: "#14528F", HighlightBG: "#D9DEF2" },
  { id: 46, name: "نعناعي غامق 2", en: "Spearmint", PageBG: "#F3F7F6", HeaderColor: "#1F5145", SectionBG: "#26826C", SectionFrame: "#124E40", KeyBG: "#F5E5F1", KeyFrame: "#B14395", KeyText: "#6B1F57", NoteBG: "#F4F5EA", NoteFrame: "#8D9447", NoteText: "#5F642B", BodyText: "#000000", WarningBG: "#E6EDF4", WarningFrame: "#3471B2", WarningText: "#17416D", ImportantText: "#8F1433", HighlightBG: "#F2DBD9" },
  { id: 47, name: "موف 2", en: "Heather Mauve", PageBG: "#F7F3F7", HeaderColor: "#511F4F", SectionBG: "#BE37B8", SectionFrame: "#8C2188", KeyBG: "#ECF5E5", KeyFrame: "#679B3B", KeyText: "#416B1F", NoteBG: "#EAF1F5", NoteFrame: "#4B7C9B", NoteText: "#2B4E64", BodyText: "#000000", WarningBG: "#F4E6E9", WarningFrame: "#B2344E", WarningText: "#6D1729", ImportantText: "#117811", HighlightBG: "#D9F2E2" },
  { id: 48, name: "ليموني 2", en: "Chartreuse", PageBG: "#F6F7F3", HeaderColor: "#40511F", SectionBG: "#607E25", SectionFrame: "#374A11", KeyBG: "#E5E8F5", KeyFrame: "#4355B1", KeyText: "#1F2B6B", NoteBG: "#F5EAEE", NoteFrame: "#9B4B65", NoteText: "#642B3E", BodyText: "#000000", WarningBG: "#E6F4E7", WarningFrame: "#2FA239", WarningText: "#176D1F", ImportantText: "#33148F", HighlightBG: "#EAD9F2" },
  { id: 49, name: "أزرق سماء 2", en: "Horizon Blue", PageBG: "#F3F4F7", HeaderColor: "#1F3251", SectionBG: "#4173C8", SectionFrame: "#25519D", KeyBG: "#F5E7E5", KeyFrame: "#B15243", KeyText: "#6B291F", NoteBG: "#EBF5EA", NoteFrame: "#4E9B4B", NoteText: "#2D642B", BodyText: "#000000", WarningBG: "#EBE6F4", WarningFrame: "#6434B2", WarningText: "#38176D", ImportantText: "#7D6212", HighlightBG: "#F2F1D9" },
  { id: 50, name: "توتي فروتي 2", en: "Ruby Berry", PageBG: "#F7F3F3", HeaderColor: "#511F23", SectionBG: "#C8414C", SectionFrame: "#9D252E", KeyBG: "#E5F5EC", KeyFrame: "#3C9F66", KeyText: "#1F6B3F", NoteBG: "#EDEAF5", NoteFrame: "#5F4B9B", NoteText: "#392B64", BodyText: "#000000", WarningBG: "#F4F0E6", WarningFrame: "#AE8532", WarningText: "#6D5117", ImportantText: "#117474", HighlightBG: "#D9ECF2" },
  { id: 51, name: "أخضر زمردي 4", en: "Viridian", PageBG: "#F3F7F4", HeaderColor: "#1F512A", SectionBG: "#27863B", SectionFrame: "#135321", KeyBG: "#F1E5F5", KeyFrame: "#9243B1", KeyText: "#551F6B", NoteBG: "#F5F0EA", NoteFrame: "#9B764B", NoteText: "#644A2B", BodyText: "#000000", WarningBG: "#E6F4F4", WarningFrame: "#2E9E9A", WarningText: "#176D6A", ImportantText: "#8F1470", HighlightBG: "#F2D9E4" },
  { id: 52, name: "أرجواني 3", en: "Orchid Purple", PageBG: "#F5F3F7", HeaderColor: "#381F51", SectionBG: "#8541C8", SectionFrame: "#61259D", KeyBG: "#F5F5E5", KeyFrame: "#909037", KeyText: "#6A6B1F", NoteBG: "#EAF5F3", NoteFrame: "#49978B", NoteText: "#2B645B", BodyText: "#000000", WarningBG: "#F4E6F1", WarningFrame: "#B23492", WarningText: "#6D1758", ImportantText: "#427411", HighlightBG: "#DDF2D9" },
  { id: 53, name: "كهرماني 2", en: "Honey Gold", PageBG: "#F7F6F3", HeaderColor: "#51471F", SectionBG: "#867327", SectionFrame: "#534613", KeyBG: "#E5F0F5", KeyFrame: "#4391B1", KeyText: "#1F546B", NoteBG: "#F5EAF4", NoteFrame: "#9B4B90", NoteText: "#642B5D", BodyText: "#000000", WarningBG: "#ECF4E6", WarningFrame: "#609E2E", WarningText: "#3E6D17", ImportantText: "#14338F", HighlightBG: "#DCD9F2" },
  { id: 54, name: "تركواز 2", en: "Deep Turquoise", PageBG: "#F3F7F7", HeaderColor: "#1F4D51", SectionBG: "#277E86", SectionFrame: "#134D53", KeyBG: "#F5E5EC", KeyFrame: "#B14371", KeyText: "#6B1F3E", NoteBG: "#F1F5EA", NoteFrame: "#769749", NoteText: "#4C642B", BodyText: "#000000", WarningBG: "#E6E8F4", WarningFrame: "#3449B2", WarningText: "#17256D", ImportantText: "#8F1414", HighlightBG: "#F2E3D9" },
  { id: 55, name: "فوشيا 3", en: "Magenta Bloom", PageBG: "#F7F3F5", HeaderColor: "#511F3E", SectionBG: "#C73D93", SectionFrame: "#99246C", KeyBG: "#E7F5E5", KeyFrame: "#489F3C", KeyText: "#286B1F", NoteBG: "#EAEDF5", NoteFrame: "#4B629B", NoteText: "#2B3B64", BodyText: "#000000", WarningBG: "#F4E8E6", WarningFrame: "#B24434", WarningText: "#6D2217", ImportantText: "#117845", HighlightBG: "#D9F2EB" },
  { id: 56, name: "أخضر ربيعي 4", en: "Basil Green", PageBG: "#F4F7F3", HeaderColor: "#2F511F", SectionBG: "#448226", SectionFrame: "#264E12", KeyBG: "#E8E5F5", KeyFrame: "#5643B1", KeyText: "#2C1F6B", NoteBG: "#F5EAEA", NoteFrame: "#9B4B4B", NoteText: "#642B2B", BodyText: "#000000", WarningBG: "#E6F4EC", WarningFrame: "#2FA260", WarningText: "#176D3C", ImportantText: "#70148F", HighlightBG: "#F2D9F2" },
  { id: 57, name: "أزرق نيلي 3", en: "Midnight Indigo", PageBG: "#F3F3F7", HeaderColor: "#1F2151", SectionBG: "#4146C8", SectionFrame: "#25299D", KeyBG: "#F5EDE5", KeyFrame: "#B17643", KeyText: "#6B421F", NoteBG: "#EAF5EE", NoteFrame: "#4B9B62", NoteText: "#2B643C", BodyText: "#000000", WarningBG: "#F0E6F4", WarningFrame: "#8E34B2", WarningText: "#55176D", ImportantText: "#6B6B0F", HighlightBG: "#EBF2D9" },
  { id: 58, name: "برتقالي دافئ 3", en: "Spiced Orange", PageBG: "#F7F4F3", HeaderColor: "#512C1F", SectionBG: "#BA5836", SectionFrame: "#883B20", KeyBG: "#E5F5F1", KeyFrame: "#3B9B84", KeyText: "#1F6B58", NoteBG: "#F1EAF5", NoteFrame: "#7A4B9B", NoteText: "#4C2B64", BodyText: "#000000", WarningBG: "#F4F4E6", WarningFrame: "#91922A", WarningText: "#6D6D17", ImportantText: "#14708F", HighlightBG: "#D9E3F2" },
  { id: 59, name: "نعناعي غامق 3", en: "Pine Mint", PageBG: "#F3F7F5", HeaderColor: "#1F513A", SectionBG: "#268259", SectionFrame: "#124E33", KeyBG: "#F5E5F4", KeyFrame: "#B143AC", KeyText: "#6B1F67", NoteBG: "#F5F4EA", NoteFrame: "#978E49", NoteText: "#645D2B", BodyText: "#000000", WarningBG: "#E6F0F4", WarningFrame: "#348BB2", WarningText: "#17536D", ImportantText: "#8F1452", HighlightBG: "#F2D9DC" },
  { id: 60, name: "موف 3", en: "Royal Mauve", PageBG: "#F6F3F7", HeaderColor: "#491F51", SectionBG: "#B241C8", SectionFrame: "#8A259D", KeyBG: "#F0F5E5", KeyFrame: "#78983A", KeyText: "#516B1F", NoteBG: "#EAF3F5", NoteFrame: "#4B8D9B", NoteText: "#2B5A64", BodyText: "#000000", WarningBG: "#F4E6EC", WarningFrame: "#B23468", WarningText: "#6D173B", ImportantText: "#2B7811", HighlightBG: "#D9F2DD" },
];

/* Builds a PLATE_KINDS-shaped object (box colors per plate kind) out
   of one of the 60 palettes above — this is what actually renders,
   so switching palettes recolors every plate on the page instantly. */
function plateKindsFor(palette) {
  const p = palette || PAGE_PALETTES[0];
  return {
    sectionTitle: { bg: p.SectionBG || "#E8874A", fg: "#FFFFFF", border: p.SectionFrame || "#C96B2F", bar: true },
    keyterm: { bg: p.KeyBG || "#E8F7F9", fg: p.KeyText || "#1A6B7A", border: p.KeyFrame || "#4C9DB0" },
    note: { bg: p.NoteBG || "#F0EDF7", fg: p.NoteText || "#3B3050", border: p.NoteFrame || "#655A7C" },
    warning: { bg: p.WarningBG || "#F2F4E6", fg: p.WarningText || "#626D17", border: p.WarningFrame || "#84922A", strong: true },
    important: { bg: p.HighlightBG || "#D9E0F2", fg: p.ImportantText || "#14428F", border: p.ImportantText || "#14428F", strong: true },
    code: { bg: "#0D0D0D", fg: "#D4D4D4", border: "#2A2A2A" },
  };
}
function paletteById(id) {
  if (!id) return PAGE_PALETTES[0];
  const num = Number(id);
  return PAGE_PALETTES.find((p) => p.id === id || p.id === num) || PAGE_PALETTES[0];
}
/* fallback used only where a leaf/palette context isn't available */
const PLATE_KINDS = plateKindsFor(PAGE_PALETTES[0]);
const PAGE_FONT = "'Amiri','Noto Naskh Arabic','Traditional Arabic',serif";

function BlockRow({ block, t, theme, skin, kinds, bookId, onUpdate, onDelete, onMove }) {
  const kind = block.kind;
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        try {
          const oldUrl = block.imageUrl;
          const savedRelPath = await saveBookImageFs(bookId || "custom", file.name, dataUrl);
          if (oldUrl && oldUrl.startsWith("assets/images/") && oldUrl !== savedRelPath) {
            await deleteBookImageFs(bookId || "custom", oldUrl);
          }
          onUpdate({ imageUrl: savedRelPath, isPlaceholder: false });
        } catch (err) {
          console.error("Image upload failed:", err);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = async () => {
    if (block.imageUrl && block.imageUrl.startsWith("assets/images/")) {
      await deleteBookImageFs(bookId || "custom", block.imageUrl);
    }
    onUpdate({ imageUrl: "", isPlaceholder: true });
  };

  return (
    <div className="p-3 mb-2.5 rounded-2xl border transition-all shadow-2xs hover:shadow-xs" style={{ background: theme.surface, borderColor: theme.hairlineStrong }}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <div className="relative flex-1">
          <select
            value={kind}
            onChange={(e) => onUpdate({ kind: e.target.value })}
            className="w-full text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer appearance-none pe-7 shadow-2xs transition-colors"
            style={{ background: theme.surfaceSoft, borderColor: theme.hairlineStrong, color: theme.ink }}
          >
            <option value="sectionTitle">{t.blockSectionTitle}</option>
            <option value="text">{t.blockTextKind}</option>
            <option value="table">{t.blockTable}</option>
            <option value="keyterm">{t.blockKeyterm}</option>
            <option value="note">{t.blockNote}</option>
            <option value="warning">{t.blockWarning}</option>
            <option value="important">{t.blockImportant}</option>
            <option value="image">{t.blockImage}</option>
            <option value="code">{t.blockCode}</option>
            <option value="pagebreak">{t.blockPagebreak}</option>
          </select>
          <ChevronDown size={12} className="absolute end-2.5 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" style={{ color: theme.ink }} />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onMove !== "function") return;
              const res = onMove(-1);
              if (typeof res === "function") res();
            }}
            className="educraft-btn w-7 h-7 rounded-lg grid place-items-center cursor-pointer border shadow-2xs hover:bg-black/5"
            style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
            title={t.moveUp}
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onMove !== "function") return;
              const res = onMove(1);
              if (typeof res === "function") res();
            }}
            className="educraft-btn w-7 h-7 rounded-lg grid place-items-center cursor-pointer border shadow-2xs hover:bg-black/5"
            style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
            title={t.moveDown}
          >
            <ArrowDown size={12} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="educraft-btn w-7 h-7 rounded-lg grid place-items-center cursor-pointer border shadow-2xs hover:bg-red-50"
            style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: "#C0392B" }}
            title={t.removeBlock}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {kind === "pagebreak" ? (
        <p className="text-[11px] font-semibold text-center py-2" style={{ color: theme.inkSoft }}>
          — {t.blockPagebreak} —
        </p>
      ) : kind === "text" ? (
        <textarea
          value={block.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={3}
          dir="auto"
          className="educraft-textarea w-full text-xs font-medium px-3 py-2 rounded-xl border outline-none shadow-inner"
          style={{ borderColor: theme.hairlineStrong, background: theme.surfaceSoft, color: theme.ink }}
          placeholder={t.blockText}
        />
      ) : kind === "table" ? (
        <div className="flex flex-col gap-1.5">
          <TextInput theme={theme} skin={skin} value={block.title || ""} onChange={(v) => onUpdate({ title: v })} placeholder={t.blockTitle} />
          <TextInput
            theme={theme}
            skin={skin}
            value={Array.isArray(block.headers) ? block.headers.join(", ") : (block.headers || "")}
            onChange={(v) => {
              const headersArr = v.split(",").map((s) => s.trim());
              onUpdate({ headers: headersArr });
            }}
            placeholder={t.tableHeaders}
          />
          <textarea
            value={Array.isArray(block.rows) ? block.rows.map((r) => (Array.isArray(r) ? r.join(", ") : r)).join("\n") : (block.rows || "")}
            onChange={(e) => {
              const lines = e.target.value.split("\n");
              const rowsArr = lines.map((line) => line.split(",").map((cell) => cell.trim()));
              onUpdate({ rows: rowsArr });
            }}
            rows={4}
            dir="auto"
            className="educraft-textarea w-full text-xs font-mono px-3 py-2 rounded-xl border outline-none shadow-inner"
            style={{ borderColor: theme.hairlineStrong, background: theme.surfaceSoft, color: theme.ink }}
            placeholder={t.tableRows}
          />
          <TextInput theme={theme} skin={skin} value={block.caption || ""} onChange={(v) => onUpdate({ caption: v })} placeholder={t.imageCaption} />
        </div>
      ) : kind === "image" ? (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
            }}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
            style={{
              borderRadius: 8,
              borderColor: isDragOver ? "#3b82f6" : theme.hairline,
              background: isDragOver ? "rgba(59,130,246,0.08)" : theme.surfaceSoft,
            }}
          >
            {block.imageUrl ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <img
                    src={resolveBookImageUrl(bookId, block.imageUrl)}
                    alt=""
                    className="w-10 h-10 object-cover rounded shrink-0 border"
                  />
                  <span className="text-xs truncate font-medium" style={{ color: theme.ink }}>
                    {block.imageUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearImage();
                  }}
                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon size={20} style={{ color: theme.inkSoft }} />
                <span className="text-xs font-semibold" style={{ color: theme.ink }}>
                  {isUploading ? "..." : (t.dropImageHere || "Drop image or click to choose")}
                </span>
                <span className="text-[10px]" style={{ color: theme.inkSoft }}>
                  PNG, JPG, SVG, WebP
                </span>
              </>
            )}
          </div>

          {/* Smart Image Dimension & Alignment Controls */}
          <div className="flex flex-col gap-2 p-2 rounded-xl border" style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}>
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[10.5px] font-bold" style={{ color: theme.inkSoft }}>
                العرض:
              </span>
              <div className="flex gap-1">
                {[
                  ["25%", "25%"],
                  ["50%", "50%"],
                  ["75%", "75%"],
                  ["100%", "100%"],
                ].map(([w, label]) => {
                  const active = (block.width || "100%") === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => onUpdate({ width: w })}
                      className="educraft-btn text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer"
                      style={{
                        background: active ? theme.accentSoft : theme.surface,
                        color: active ? theme.accent : theme.inkSoft,
                        border: active ? `1px solid ${theme.accent}44` : `1px solid ${theme.hairline}`,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[10.5px] font-bold" style={{ color: theme.inkSoft }}>
                المحاذاة:
              </span>
              <div className="flex gap-1">
                {[
                  ["left", "يسار"],
                  ["center", "وسط"],
                  ["right", "يمين"],
                ].map(([al, label]) => {
                  const active = (block.align || "center") === al;
                  return (
                    <button
                      key={al}
                      type="button"
                      onClick={() => onUpdate({ align: al })}
                      className="educraft-btn text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer"
                      style={{
                        background: active ? theme.accentSoft : theme.surface,
                        color: active ? theme.accent : theme.inkSoft,
                        border: active ? `1px solid ${theme.accent}44` : `1px solid ${theme.hairline}`,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[10.5px] font-bold" style={{ color: theme.inkSoft }}>
                التناسب:
              </span>
              <div className="flex gap-1">
                {[
                  ["auto", "تلقائي ذكي"],
                  ["16/9", "16:9"],
                  ["4/3", "4:3"],
                  ["1/1", "1:1"],
                ].map(([asp, label]) => {
                  const active = (block.aspectRatio || "auto") === asp;
                  return (
                    <button
                      key={asp}
                      type="button"
                      onClick={() => onUpdate({ aspectRatio: asp })}
                      className="educraft-btn text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer"
                      style={{
                        background: active ? theme.accentSoft : theme.surface,
                        color: active ? theme.accent : theme.inkSoft,
                        border: active ? `1px solid ${theme.accent}44` : `1px solid ${theme.hairline}`,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <TextInput
            theme={theme}
            skin={skin}
            value={block.imageUrl || ""}
            onChange={(v) => onUpdate({ imageUrl: v, isPlaceholder: !v })}
            placeholder={t.orEnterUrl || t.imageUrl}
          />
          <div className="grid grid-cols-2 gap-1.5">
            <TextInput theme={theme} skin={skin} value={block.title || ""} onChange={(v) => onUpdate({ title: v })} placeholder={t.imageTitle} />
            <TextInput theme={theme} skin={skin} value={block.meta || ""} onChange={(v) => onUpdate({ meta: v })} placeholder={t.imageMeta} />
          </div>
          <textarea
            value={block.caption || ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            rows={2}
            dir="auto"
            className="educraft-textarea w-full text-xs font-medium px-3 py-2 rounded-xl border outline-none shadow-inner"
            style={{ borderColor: theme.hairlineStrong, background: theme.surfaceSoft, color: theme.ink }}
            placeholder={t.imageCaption}
          />
        </div>
      ) : kind === "code" ? (
        <LiveCodeEditor
          code={block.text || ""}
          lang={block.codeLang || block.lang}
          title={block.title}
          theme={theme}
          skin={skin}
          onUpdate={onUpdate}
          placeholder={t.blockText}
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          {kind !== "sectionTitle" && <TextInput theme={theme} skin={skin} value={block.title || ""} onChange={(v) => onUpdate({ title: v })} placeholder={t.blockTitle} />}
          <textarea
            value={block.text || ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={2}
            dir="auto"
            className="educraft-textarea w-full text-xs font-medium px-3 py-2 rounded-xl border outline-none shadow-inner"
            style={{ borderColor: theme.hairlineStrong, background: theme.surfaceSoft, color: theme.ink }}
            placeholder={t.blockText}
          />
        </div>
      )}
    </div>
  );
}

function PlateBlock({ block, style, kinds, bookId = null, theme = null, skin = null }) {
  if (!block) return null;
  const K = kinds || PLATE_KINDS;
  const safeSectionBorder = K.sectionTitle?.border || "#cbd5e1";
  const safeSectionBg = K.sectionTitle?.bg || "#f1f5f9";
  const safeSectionFg = K.sectionTitle?.fg || "#0f172a";
  const kind = K[block.kind] || K.note || { bg: "#f8fafc", fg: "#0f172a", border: "#cbd5e1" };
  if (block.kind === "pagebreak") return null;

  if (block.kind === "text") {
    return (
      <div
        style={{
          margin: "8px 0",
          fontSize: 13.5,
          lineHeight: 1.85,
          color: "#241B13",
          ...style,
        }}
        dir="auto"
      >
        <p style={{ margin: 0 }}>{block.text}</p>
      </div>
    );
  }

  if (block.kind === "table") {
    const headers = Array.isArray(block.headers) ? block.headers : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];
    const borderColor = safeSectionBorder;
    const headerBg = safeSectionBg;
    const headerFg = safeSectionFg;

    return (
      <div
        style={{
          margin: "12px 0",
          borderRadius: 12,
          overflow: "hidden",
          border: `1.5px solid ${borderColor}`,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          ...style,
        }}
      >
        {block.title && (
          <div
            style={{
              padding: "9px 14px",
              fontWeight: 800,
              fontSize: 13,
              background: headerBg,
              color: headerFg,
              borderBottom: `1.5px solid ${borderColor}`,
            }}
          >
            {block.title}
          </div>
        )}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "start" }}>
            {headers.length > 0 && (
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: `1.5px solid ${borderColor}` }}>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "8px 12px",
                        fontWeight: 700,
                        color: "#334155",
                        textAlign: "inherit",
                        borderInlineEnd: i < headers.length - 1 ? "1px solid #e2e8f0" : "none",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: rIdx < rows.length - 1 ? "1px solid #f1f5f9" : "none",
                    background: rIdx % 2 === 1 ? "#fafafa" : "#fff",
                  }}
                >
                  {(Array.isArray(row) ? row : []).map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        padding: "8px 12px",
                        color: "#1e293b",
                        verticalAlign: "top",
                        borderInlineEnd: cIdx < (row.length - 1) ? "1px solid #f1f5f9" : "none",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {block.caption && (
          <div style={{ padding: "6px 14px", fontSize: 11, color: "#64748b", fontStyle: "italic", borderTop: "1px solid #f1f5f9" }}>
            {block.caption}
          </div>
        )}
      </div>
    );
  }

  if (block.kind === "image") {
    const isPlaceholder = block.isPlaceholder || !block.imageUrl;
    const resolvedUrl = block.imageUrl ? resolveBookImageUrl(bookId || block._bookId, block.imageUrl) : "";
    const imgWidth = block.width || "100%";
    const imgAlign = block.align || "center";
    const imgFit = block.fitMode || "smart";
    const imgAspect = block.aspectRatio || (imgFit === "smart" ? "auto" : "16/9");
    const imgMaxH = block.maxHeight || (imgFit === "smart" ? "380px" : "480px");

    const alignStyle =
      imgAlign === "center"
        ? { margin: "10px auto" }
        : imgAlign === "left"
        ? { margin: "10px auto 10px 0" }
        : { margin: "10px 0 10px auto" };

    return (
      <div
        style={{
          width: imgWidth,
          maxWidth: "100%",
          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          border: `1.5px solid ${safeSectionBorder}`,
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
          ...alignStyle,
          ...style,
        }}
      >
        {isPlaceholder ? (
          <div
            style={{
              width: "100%",
              height: imgWidth === "100%" ? 140 : 110,
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              gap: 6,
              padding: 14,
              borderBottom: "1px dashed #cbd5e1",
            }}
          >
            <ImageIcon size={imgWidth === "100%" ? 26 : 20} style={{ opacity: 0.6 }} />
            <span style={{ fontSize: 11, fontWeight: 700 }}>
              {block.alt || (block.title ? `${block.title}` : "صورة توضيحية")}
            </span>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#00000006",
              overflow: "hidden",
            }}
          >
            <img
              src={resolvedUrl}
              alt={block.alt || block.title || ""}
              style={{
                width: "100%",
                maxHeight: imgMaxH,
                aspectRatio: imgAspect,
                objectFit: imgFit === "cover" ? "cover" : "contain",
                display: "block",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        {(block.title || block.caption || block.meta) && (
          <div style={{ padding: "8px 12px 10px", background: "#fff" }}>
            {block.title && <p style={{ fontWeight: 800, color: safeSectionBorder, margin: "0 0 3px", fontSize: 12.5 }}>{block.title}</p>}
            {block.caption && (
              <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.6, color: "#241B13" }} dir="auto">
                {block.caption}
              </p>
            )}
            {block.meta && <p style={{ margin: "3px 0 0", fontSize: 10, color: "#7a7a7a" }}>{block.meta}</p>}
          </div>
        )}
      </div>
    );
  }
  if (block.kind === "code") {
    return (
      <SyntaxCodeBlock
        code={block.text}
        lang={block.codeLang || block.lang}
        title={block.title}
        theme={theme}
        skin={skin}
        style={{
          margin: "10px 0",
          ...style,
        }}
      />
    );
  }
  if (block.kind === "sectionTitle") {
    return (
      <div style={{ background: kind?.bg || safeSectionBg, color: kind?.fg || safeSectionFg, borderRadius: 10, padding: "10px 16px", margin: "14px 0 10px", fontWeight: 800, fontSize: 15, ...style }}>
        {block.text}
      </div>
    );
  }
  const safeKind = kind || K.note;
  return (
    <div
      style={{
        background: safeKind.bg,
        color: safeKind.fg,
        borderRadius: 12,
        border: `${safeKind.strong ? 2 : 1.5}px solid ${safeKind.border}`,
        padding: "10px 14px",
        margin: "10px 0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {block.title && <p style={{ fontWeight: 800, fontSize: 12, margin: "0 0 4px" }}>{block.title}</p>}
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7 }} dir="auto">
        {block.text}
      </p>
    </div>
  );
}

/* Measures and partitions blocks into A4 pages with zero lag.
   Pre-calculates pages synchronously in useMemo so that the page
   mounts instantaneously (< 15ms) without layout thrashing. */
const A4_CONTENT_HEIGHT_MM = 265; // 297mm - 2*16mm margin approx

function estimateBlockHeight(b) {
  if (!b) return 0;
  if (b.kind === "pagebreak") return 0;
  if (b.kind === "sectionTitle") return 55;
  if (b.kind === "table") {
    const rows = Array.isArray(b.rows) ? b.rows.length : 1;
    return 65 + rows * 28;
  }
  if (b.kind === "image") {
    return b.isPlaceholder || !b.imageUrl ? 150 : 280;
  }
  if (b.kind === "code") {
    const lines = (b.text || "").split("\n").length;
    return 55 + lines * 18;
  }
  if (b.kind === "text") {
    const len = (b.text || "").length;
    return Math.max(45, Math.ceil(len / 75) * 26 + 18);
  }
  // note, warning, important, keyterm
  const textLen = (b.text || "").length;
  return Math.max(70, Math.ceil(textLen / 65) * 24 + 40);
}

function partitionBlocksEstimated(blocks) {
  if (!blocks || !blocks.length) return [];
  const capacityPx = A4_CONTENT_HEIGHT_MM * 3.7795;
  let acc = 0;
  let cur = [];
  const result = [];
  blocks.forEach((b) => {
    if (b.kind === "pagebreak") {
      result.push(cur);
      cur = [];
      acc = 0;
      return;
    }
    const h = estimateBlockHeight(b);
    if (acc + h > capacityPx && cur.length) {
      result.push(cur);
      cur = [];
      acc = 0;
    }
    cur.push(b);
    acc += h;
  });
  if (cur.length || result.length === 0) {
    result.push(cur);
  }
  return result;
}

function usePagedBlocks(blocks) {
  const measureRef = useRef(null);
  const estimated = useMemo(() => partitionBlocksEstimated(blocks), [blocks]);
  const [pages, setPages] = useState(estimated);

  useEffect(() => {
    setPages(partitionBlocksEstimated(blocks));
  }, [blocks]);

  return { pages: pages.length ? pages : (estimated.length ? estimated : []), measureRef };
}

/* =================================================================
   Zoom-to-fit page canvas — the A4 pages used to render at their real
   CSS size (210mm × 297mm ≈ 794×1123px), so a short leaf's page mostly
   showed as a giant blank rectangle below the visible viewport. This
   scales the whole page stack down (or up) to fit the available width
   — the same "fit width" behavior Word/PowerPoint/Google Docs use —
   using the CSS `zoom` property so layout height shrinks along with
   it instead of leaving reserved blank space. A small +/- control lets
   the user zoom in for fine editing, and "fit" snaps back to 100% of
   the container width. */
const A4_PAGE_WIDTH_PX = 210 * 3.7795;
function useFitScale() {
  const containerRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);
  const [zoomOverride, setZoomOverride] = useState(null); // null = auto-fit
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let rafId = null;
    const safeRaf = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function" ? window.requestAnimationFrame : (fn) => setTimeout(fn, 16);
    const safeCaf = typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function" ? window.cancelAnimationFrame : (id) => clearTimeout(id);
    const compute = () => {
      if (rafId) safeCaf(rafId);
      rafId = safeRaf(() => {
        if (!el) return;
        const available = el.clientWidth - 24;
        if (available <= 0) return;
        const fit = Math.min(1.0, Math.max(0.35, Math.round((available / A4_PAGE_WIDTH_PX) * 100) / 100));
        setFitScale((prev) => (Math.abs(prev - fit) >= 0.02 ? fit : prev));
      });
    };
    compute();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(compute);
      ro.observe(el);
      return () => {
        if (rafId) safeCaf(rafId);
        ro.disconnect();
      };
    } else if (typeof window !== "undefined") {
      window.addEventListener("resize", compute);
      return () => {
        if (rafId) safeCaf(rafId);
        window.removeEventListener("resize", compute);
      };
    }
  }, []);
  const scale = zoomOverride ?? fitScale;
  const zoomIn = () => setZoomOverride((prev) => Math.min(2, Math.round(((prev ?? fitScale) + 0.1) * 100) / 100));
  const zoomOut = () => setZoomOverride((prev) => Math.max(0.35, Math.round(((prev ?? fitScale) - 0.1) * 100) / 100));
  const zoomFit = () => setZoomOverride(null);
  return { containerRef, scale, zoomIn, zoomOut, zoomFit, isFit: zoomOverride == null };
}

function ZoomBar({ t, theme, skin, scale, onZoomOut, onZoomIn, onFit, isFit }) {
  return (
    <div className="flex items-center justify-end gap-1.5 mb-2.5">
      <div className="inline-flex items-center p-1 rounded-xl educraft-glass border shadow-2xs gap-1" style={{ borderColor: theme.hairline }}>
        <button
          type="button"
          onClick={onZoomOut}
          className="educraft-btn w-7 h-7 grid place-items-center shrink-0 cursor-pointer rounded-lg border shadow-2xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ borderColor: theme.hairline, color: theme.ink, background: theme.surface }}
          title={t.zoomOut}
        >
          <ZoomOut size={13} />
        </button>
        <button
          type="button"
          onClick={onFit}
          className="educraft-btn text-[11px] font-bold px-2.5 h-7 shrink-0 cursor-pointer rounded-lg border shadow-2xs transition-colors"
          style={{
            borderColor: isFit ? `${theme.accent}44` : theme.hairline,
            background: isFit ? theme.accentSoft : theme.surface,
            color: isFit ? theme.accent : theme.ink,
          }}
          title={t.zoomFit}
        >
          {isFit ? <Maximize2 size={11} className="inline -mt-0.5 me-1" /> : null}
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          className="educraft-btn w-7 h-7 grid place-items-center shrink-0 cursor-pointer rounded-lg border shadow-2xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ borderColor: theme.hairline, color: theme.ink, background: theme.surface }}
          title={t.zoomIn}
        >
          <ZoomIn size={13} />
        </button>
      </div>
    </div>
  );
}

/* Office-style ribbon primitives: a labeled group of tool buttons
   (icon on top, short caption below), separated by thin dividers —
   the same shape as Word/PowerPoint's Home/Insert ribbon tabs. The
   whole bar scrolls horizontally on narrow screens instead of wrapping
   or overflowing, so it stays usable on phones and tablets too. */
function RibbonGroup({ label, children }) {
  return (
    <div className="flex flex-col items-center shrink-0 px-1 py-0.5">
      <div className="flex items-center gap-1.5 flex-1">{children}</div>
      <p className="text-center text-[10px] font-bold uppercase tracking-wider mt-1 px-1 opacity-50 select-none">
        {label}
      </p>
    </div>
  );
}
function RibbonDivider({ theme }) {
  return <div className="self-center w-px h-8 mx-1 shrink-0 opacity-20" style={{ background: theme.ink }} />;
}
function RibbonButton({ icon: Icon, label, active, onClick, theme, skin, tone }) {
  const iconFg = tone?.fg || (active ? theme.accent : theme.ink);
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="educraft-btn flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 shrink-0 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-2xs"
      style={{
        minWidth: 54,
        background: active ? theme.accentSoft : "transparent",
        color: active ? theme.accent : theme.ink,
        border: active ? `1px solid ${theme.accent}44` : "1px solid transparent",
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform"
        style={{
          background: tone?.bg || (active ? `${theme.accent}20` : theme.surfaceSoft),
          color: iconFg,
          border: `1px solid ${tone?.border || theme.hairline}`,
        }}
      >
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <span
        className="text-[10px] font-bold leading-none whitespace-nowrap text-center truncate max-w-[68px]"
        style={{ color: active ? theme.accent : theme.ink }}
      >
        {label}
      </span>
    </button>
  );
}

/* Builds one continuous plate stream for the whole book — every
   leaf's own A4 plates, in tree order (branch -> sub -> leaf), each
   leaf starting on a fresh page and carrying its own palette and
   title with it — so scrolling this feels like flipping through the
   finished printed book instead of one leaf at a time. */
function buildFullBookBlocks(book, lang) {
  const branches = book.nodes.filter((n) => n.level === "branch");
  const subOf = (bid) => book.nodes.filter((n) => n.level === "sub" && n.parent === bid);
  const leavesOf = (sid) => book.nodes.filter((n) => n.level === "leaf" && n.parent === sid);
  const out = [];
  let first = true;
  branches.forEach((br) => {
    subOf(br.id).forEach((sub) => {
      leavesOf(sub.id).forEach((leaf) => {
        const blocks = leaf.pageBlocks || [];
        if (!blocks.length) return;
        if (!first) out.push({ id: `${leaf.id}-fb-break`, kind: "pagebreak", _leafId: leaf.id, _isLeafBreak: true });
        first = false;
        const leafTitle = lang === "ar" ? leaf.ar : leaf.en;
        const branchTitle = lang === "ar" ? br.ar : br.en;
        const paletteId = leaf.pagePaletteId || book?.defaultPagePaletteId || 1;
        blocks.forEach((b, i) => {
          out.push({
            ...b,
            id: `${leaf.id}-fb-${b.id || i}`,
            _origId: b.id,
            _leafId: leaf.id,
            _leaf: leaf,
            _blockIndex: i,
            _leafTitle: leafTitle,
            _branchTitle: branchTitle,
            _paletteId: paletteId,
          });
        });
      });
    });
  });
  return out;
}

/* Interactive Direct-on-Canvas block wrapper for A4 sheets */
function CanvasBlockWrapper({
  block,
  kinds,
  palette,
  theme,
  skin,
  lang,
  bookId,
  onUpdate,
  onDelete,
  onMove,
  onInsertBelow,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const fileInputRef = useRef(null);

  const kind = block.kind;
  const K = (kinds && (kinds[kind] || kinds.note)) || {};

  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        try {
          const oldUrl = block.imageUrl;
          const savedRelPath = await saveBookImageFs(bookId || "custom", file.name, dataUrl);
          if (oldUrl && oldUrl.startsWith("assets/images/") && oldUrl !== savedRelPath) {
            await deleteBookImageFs(bookId || "custom", oldUrl);
          }
          onUpdate({ imageUrl: savedRelPath, isPlaceholder: false });
        } catch (err) {
          console.warn("Filesystem image save fallback to dataUrl:", err);
          onUpdate({ imageUrl: dataUrl, isPlaceholder: false });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {}
  };

  return (
    <div
      className="relative group my-1.5 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowAddMenu(false);
      }}
      style={{
        borderRadius: 14,
        outline: isEditing
          ? `2px solid ${theme.accent}`
          : isHovered
          ? `1.5px dashed ${theme.accent}66`
          : "1.5px solid transparent",
        outlineOffset: 3,
      }}
    >
      {/* Floating Action Toolbar on hover or active */}
      {(isHovered || isEditing) && (
        <div
          className="absolute -top-3.5 end-3 z-30 flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border backdrop-blur-md educraft-modal-in"
          style={{
            background: theme.surface,
            borderColor: theme.hairlineStrong,
            color: theme.ink,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md" style={{ background: theme.accentSoft, color: theme.accent }}>
            {kind}
          </span>
          <div className="w-[1px] h-3 bg-black/10 mx-0.5" />
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="w-6 h-6 rounded-md grid place-items-center cursor-pointer transition-colors"
            style={{
              background: isEditing ? theme.accent : theme.surfaceSoft,
              color: isEditing ? theme.accentInk : theme.ink,
            }}
            title={isEditing ? (lang === "ar" ? "حفظ وعرض" : "Done") : (lang === "ar" ? "تعديل مباشر" : "Edit block")}
          >
            {isEditing ? <Check size={12} strokeWidth={3} /> : <Pencil size={11} />}
          </button>
          {onMove && (
            <>
              <button
                type="button"
                onClick={() => onMove(-1)}
                className="w-6 h-6 rounded-md grid place-items-center cursor-pointer hover:bg-black/5"
                title={lang === "ar" ? "تحريك لأعلى" : "Move up"}
              >
                <ArrowUp size={11} />
              </button>
              <button
                type="button"
                onClick={() => onMove(1)}
                className="w-6 h-6 rounded-md grid place-items-center cursor-pointer hover:bg-black/5"
                title={lang === "ar" ? "تحريك لأسفل" : "Move down"}
              >
                <ArrowDown size={11} />
              </button>
            </>
          )}
          {onInsertBelow && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="w-6 h-6 rounded-md grid place-items-center cursor-pointer hover:bg-black/5"
                title={lang === "ar" ? "إدراج عنصر تحته" : "Insert below"}
              >
                <Plus size={12} />
              </button>
              {showAddMenu && (
                <div
                  className="absolute start-0 top-full mt-1.5 p-1.5 rounded-xl border shadow-xl z-50 flex flex-col gap-0.5 min-w-[140px] educraft-modal-in"
                  style={{ background: theme.surface, borderColor: theme.hairline }}
                >
                  {[
                    ["text", lang === "ar" ? "نص حر" : "Text"],
                    ["sectionTitle", lang === "ar" ? "عنوان رئيسي" : "Section Title"],
                    ["note", lang === "ar" ? "ملاحظة" : "Note"],
                    ["keyterm", lang === "ar" ? "مصطلح رئيسي" : "Key Term"],
                    ["warning", lang === "ar" ? "تنبيه" : "Warning"],
                    ["important", lang === "ar" ? "هام جداً" : "Important"],
                    ["image", lang === "ar" ? "صورة" : "Image"],
                    ["table", lang === "ar" ? "جدول" : "Table"],
                    ["code", lang === "ar" ? "صندوق كود" : "Code"],
                  ].map(([k, lbl]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        onInsertBelow(k);
                        setShowAddMenu(false);
                      }}
                      className="text-start px-2 py-1 text-xs font-bold rounded-lg hover:bg-black/5 cursor-pointer"
                      style={{ color: theme.ink }}
                    >
                      + {lbl}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-6 h-6 rounded-md grid place-items-center cursor-pointer hover:bg-red-50 text-red-600"
              title={lang === "ar" ? "حذف العنصر" : "Delete block"}
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      )}

      {/* Main Block Rendering / Direct On-Canvas Editing */}
      {isEditing ? (
        <div
          className="p-3.5 rounded-2xl border shadow-lg flex flex-col gap-2.5 educraft-modal-in"
          style={{
            background: theme.surface,
            borderColor: theme.accent,
            color: theme.ink,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: theme.hairline }}>
            <span className="text-xs font-black" style={{ color: theme.accent }}>
              {lang === "ar" ? `تعديل مباشر: ${kind}` : `Direct Edit: ${kind}`}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="educraft-btn text-xs font-bold px-3 py-1 rounded-lg cursor-pointer shadow-2xs"
              style={{ background: theme.accent, color: theme.accentInk }}
            >
              {lang === "ar" ? "تم وحفظ" : "Done"}
            </button>
          </div>

          {kind === "sectionTitle" ? (
            <input
              type="text"
              autoFocus
              dir="auto"
              value={block.text || ""}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full text-base font-bold px-3 py-2 rounded-xl border outline-none shadow-inner"
              style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
              placeholder={lang === "ar" ? "عنوان القسم..." : "Section title..."}
            />
          ) : kind === "text" ? (
            <textarea
              autoFocus
              dir="auto"
              rows={4}
              value={block.text || ""}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full text-sm font-medium px-3 py-2 rounded-xl border outline-none shadow-inner leading-relaxed"
              style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
              placeholder={lang === "ar" ? "اكتب النص هنا..." : "Type text here..."}
            />
          ) : kind === "image" ? (
            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="educraft-btn text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer flex items-center gap-1.5"
                  style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
                >
                  <Upload size={12} />
                  {lang === "ar" ? "اختيار / استبدال صورة من الجهاز" : "Choose / Replace File"}
                </button>
                {block.imageUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdate({ imageUrl: "", isPlaceholder: true })}
                    className="text-xs text-red-600 font-bold px-2 py-1 rounded cursor-pointer"
                  >
                    {lang === "ar" ? "إزالة الصورة" : "Remove"}
                  </button>
                )}
              </div>

              {/* Dimension Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>
                  {lang === "ar" ? "العرض:" : "Width:"}
                </span>
                {["25%", "50%", "75%", "100%"].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => onUpdate({ width: w })}
                    className="text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer border"
                    style={{
                      background: (block.width || "100%") === w ? theme.accentSoft : theme.surface,
                      borderColor: (block.width || "100%") === w ? theme.accent : theme.hairline,
                      color: (block.width || "100%") === w ? theme.accent : theme.inkSoft,
                    }}
                  >
                    {w}
                  </button>
                ))}
                <span className="text-[11px] font-bold ms-2" style={{ color: theme.inkSoft }}>
                  {lang === "ar" ? "المحاذاة:" : "Align:"}
                </span>
                {[
                  ["center", lang === "ar" ? "وسط" : "Center"],
                  ["left", lang === "ar" ? "يسار" : "Left"],
                  ["right", lang === "ar" ? "يمين" : "Right"],
                ].map(([al, lbl]) => (
                  <button
                    key={al}
                    type="button"
                    onClick={() => onUpdate({ align: al })}
                    className="text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer border"
                    style={{
                      background: (block.align || "center") === al ? theme.accentSoft : theme.surface,
                      borderColor: (block.align || "center") === al ? theme.accent : theme.hairline,
                      color: (block.align || "center") === al ? theme.accent : theme.inkSoft,
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <input
                type="text"
                dir="auto"
                value={block.title || ""}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={lang === "ar" ? "عنوان الصورة (اختياري)..." : "Image title..."}
                className="w-full text-xs font-bold px-3 py-1.5 rounded-xl border outline-none shadow-inner"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
              />
              <input
                type="text"
                dir="auto"
                value={block.caption || ""}
                onChange={(e) => onUpdate({ caption: e.target.value })}
                placeholder={lang === "ar" ? "شرح / تعليق أسفل الصورة..." : "Image caption..."}
                className="w-full text-xs font-medium px-3 py-1.5 rounded-xl border outline-none shadow-inner"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
              />
            </div>
          ) : kind === "table" ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                dir="auto"
                value={block.title || ""}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={lang === "ar" ? "عنوان الجدول..." : "Table title..."}
                className="w-full text-xs font-bold px-3 py-1.5 rounded-xl border outline-none shadow-inner"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
              />
              <input
                type="text"
                dir="auto"
                value={Array.isArray(block.headers) ? block.headers.join(", ") : (block.headers || "")}
                onChange={(e) => onUpdate({ headers: e.target.value.split(",").map((s) => s.trim()) })}
                placeholder={lang === "ar" ? "عناوين الأعمدة مفصولة بفواصل (العمود 1, العمود 2)..." : "Headers separated by commas..."}
                className="w-full text-xs font-medium px-3 py-1.5 rounded-xl border outline-none shadow-inner"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
              />
              <textarea
                dir="auto"
                rows={3}
                value={Array.isArray(block.rows) ? block.rows.map((r) => (Array.isArray(r) ? r.join(", ") : r)).join("\n") : (block.rows || "")}
                onChange={(e) => {
                  const lines = e.target.value.split("\n");
                  onUpdate({ rows: lines.map((l) => l.split(",").map((c) => c.trim())) });
                }}
                placeholder={lang === "ar" ? "صفوف الجدول (كل صف في سطر، والخلايا مفصولة بفواصل)..." : "Rows (each row on a line, cells comma-separated)..."}
                className="w-full text-xs font-mono px-3 py-1.5 rounded-xl border outline-none shadow-inner"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
              />
            </div>
          ) : kind === "code" ? (
            <textarea
              dir="ltr"
              rows={4}
              value={block.text || ""}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full text-xs font-mono px-3 py-2 rounded-xl border outline-none shadow-inner"
              style={{ background: "#1e1e1e", color: "#d4d4d4", borderColor: theme.hairline }}
              placeholder="// Code here..."
            />
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                dir="auto"
                value={block.title || ""}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={lang === "ar" ? "عنوان الملاحظة / التنبيه..." : "Card title..."}
                className="w-full text-xs font-bold px-3 py-1.5 rounded-xl border outline-none shadow-inner"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
              />
              <textarea
                dir="auto"
                rows={3}
                value={block.text || ""}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border outline-none shadow-inner leading-relaxed"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
                placeholder={lang === "ar" ? "محتوى البطاقة..." : "Content..."}
              />
            </div>
          )}
        </div>
      ) : kind === "image" && (block.isPlaceholder || !block.imageUrl) ? (
        <div
          className="p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group/uploader hover:shadow-sm my-1"
          style={{
            background: isHovered ? `${theme.accent}0d` : theme.surfaceSoft,
            borderColor: isHovered ? theme.accent : theme.hairlineStrong,
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <div
            className="w-12 h-12 rounded-2xl grid place-items-center shadow-2xs transition-transform group-hover/uploader:scale-110"
            style={{ background: theme.surface, color: theme.accent }}
          >
            <ImagePlus size={24} />
          </div>
          <div className="text-center">
            <p className="text-xs font-black mb-1" style={{ color: theme.ink }}>
              {lang === "ar" ? "اضغط لرفع صورة من الجهاز أو اسحبها إلى هنا" : "Click to upload an image from device or drop it here"}
            </p>
            <p className="text-[10px] font-semibold opacity-70" style={{ color: theme.inkSoft }}>
              {lang === "ar" ? "يدعم ملفات PNG, JPG, WebP, SVG بأعلى جودة" : "Supports PNG, JPG, WebP, SVG in full resolution"}
            </p>
          </div>
          <button
            type="button"
            className="educraft-btn text-[11px] font-bold px-3.5 py-1.5 rounded-xl border shadow-2xs cursor-pointer hover:scale-105 transition-all flex items-center gap-1.5"
            style={{ background: theme.accent, color: theme.accentInk, borderColor: "transparent" }}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Upload size={12} />
            <span>{lang === "ar" ? "اختيار صورة من الجهاز" : "Choose File from Device"}</span>
          </button>
        </div>
      ) : (
        <div onDoubleClick={() => setIsEditing(true)} className="relative group/canvasImg">
          <PlateBlock block={block} kinds={kinds} theme={theme} skin={skin} bookId={bookId} />
          {kind === "image" && block.imageUrl && (
            <div
              className="absolute top-2 end-2 opacity-0 group-hover/canvasImg:opacity-100 transition-opacity flex items-center gap-1.5 p-1 rounded-xl shadow-md border backdrop-blur-md z-20"
              style={{ background: `${theme.surface}f0`, borderColor: theme.hairlineStrong }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="educraft-btn flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border cursor-pointer hover:bg-black/5"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
                title={lang === "ar" ? "استبدال الصورة من الجهاز" : "Replace image"}
              >
                <Upload size={10} />
                <span>{lang === "ar" ? "استبدال" : "Replace"}</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ imageUrl: "", isPlaceholder: true })}
                className="educraft-btn text-[10px] font-black px-2 py-1 rounded-lg border cursor-pointer hover:bg-red-50 text-red-600"
                style={{ background: theme.surfaceSoft, borderColor: theme.hairline }}
                title={lang === "ar" ? "حذف الصورة" : "Remove image"}
              >
                <Trash2 size={10} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Whole-book A4 studio preview with full authoring ribbon and interactive manual editing */
function FullBookA4Preview({
  book,
  lang,
  t,
  theme,
  skin,
  docTitle,
  bookId,
  onUpdateBook,
  onUpdateLeaf,
  readOnly = false,
}) {
  const blocks = useMemo(() => buildFullBookBlocks(book, lang), [book, lang]);
  const allLeaves = useMemo(() => book.nodes.filter((n) => n.level === "leaf"), [book]);
  const [targetLeafId, setTargetLeafId] = useState(allLeaves[0]?.id || null);
  const [palettePickerOpen, setPalettePickerOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [readerMode, setReaderMode] = useState(() => (typeof window !== "undefined" && window.innerWidth < 768 ? "flow" : "paged"));

  const activeLeaf = allLeaves.find((l) => l.id === targetLeafId) || allLeaves[0];
  const activePalette = paletteById(activeLeaf?.pagePaletteId || book?.defaultPagePaletteId || 1);
  const activeKinds = plateKindsFor(activePalette);

  const { pages, measureRef } = usePagedBlocks(blocks);
  const { containerRef, scale, zoomIn, zoomOut, zoomFit, isFit } = useFitScale();

  const addBlockToTargetLeaf = (kind) => {
    if (!activeLeaf) return;
    const currentBlocks = activeLeaf.pageBlocks || [];
    const baseId = `${activeLeaf.id}-b-${Date.now()}`;
    let newBlock;
    if (kind === "table") {
      newBlock = {
        id: baseId,
        kind,
        title: "",
        headers: [lang === "ar" ? "العمود 1" : "Column 1", lang === "ar" ? "العمود 2" : "Column 2"],
        rows: [[lang === "ar" ? "خلية 1" : "Cell 1", lang === "ar" ? "خلية 2" : "Cell 2"]],
        caption: "",
      };
    } else if (kind === "text") {
      newBlock = { id: baseId, kind, text: "" };
    } else if (kind === "image") {
      newBlock = { id: baseId, kind, title: "", imageUrl: "", caption: "", isPlaceholder: true };
    } else {
      newBlock = { id: baseId, kind, title: "", text: "", imageUrl: "", caption: "" };
    }
    const nextBlocks = [...currentBlocks, newBlock];
    if (onUpdateLeaf) {
      onUpdateLeaf(activeLeaf.id, { pageBlocks: nextBlocks });
    } else if (onUpdateBook) {
      onUpdateBook((prev) => {
        const base = prev || book;
        return {
          ...base,
          nodes: (base?.nodes || []).map((n) => (n.id === activeLeaf.id ? { ...n, pageBlocks: nextBlocks } : n)),
        };
      });
    }
  };

  const updateBlockInLeaf = (leafId, blockIdx, patch) => {
    const target = book.nodes.find((n) => n.id === leafId);
    if (!target) return;
    const current = target.pageBlocks || [];
    const next = current.map((b, idx) => (idx === blockIdx ? { ...b, ...patch } : b));
    if (onUpdateLeaf) onUpdateLeaf(leafId, { pageBlocks: next });
    else if (onUpdateBook) {
      onUpdateBook((prev) => {
        const base = prev || book;
        return {
          ...base,
          nodes: (base?.nodes || []).map((n) => (n.id === leafId ? { ...n, pageBlocks: next } : n)),
        };
      });
    }
  };

  const deleteBlockInLeaf = (leafId, blockIdx) => {
    const target = book.nodes.find((n) => n.id === leafId);
    if (!target) return;
    const current = target.pageBlocks || [];
    const next = current.filter((_, idx) => idx !== blockIdx);
    if (onUpdateLeaf) onUpdateLeaf(leafId, { pageBlocks: next });
    else if (onUpdateBook) {
      onUpdateBook((prev) => {
        const base = prev || book;
        return {
          ...base,
          nodes: (base?.nodes || []).map((n) => (n.id === leafId ? { ...n, pageBlocks: next } : n)),
        };
      });
    }
  };

  const moveBlockInLeaf = (leafId, blockIdx, dir) => {
    const target = book.nodes.find((n) => n.id === leafId);
    if (!target) return;
    const current = [...(target.pageBlocks || [])];
    const j = blockIdx + dir;
    if (j < 0 || j >= current.length) return;
    [current[blockIdx], current[j]] = [current[j], current[blockIdx]];
    if (onUpdateLeaf) onUpdateLeaf(leafId, { pageBlocks: current });
    else if (onUpdateBook) {
      onUpdateBook((prev) => {
        const base = prev || book;
        return {
          ...base,
          nodes: (base?.nodes || []).map((n) => (n.id === leafId ? { ...n, pageBlocks: current } : n)),
        };
      });
    }
  };

  const insertBelowInLeaf = (leafId, blockIdx, newKind) => {
    const target = book.nodes.find((n) => n.id === leafId);
    if (!target) return;
    const current = [...(target.pageBlocks || [])];
    const baseId = `${leafId}-b-${Date.now()}`;
    let newBlock;
    if (newKind === "table") {
      newBlock = {
        id: baseId,
        kind: newKind,
        title: "",
        headers: [lang === "ar" ? "العمود 1" : "Column 1", lang === "ar" ? "العمود 2" : "Column 2"],
        rows: [[lang === "ar" ? "خلية 1" : "Cell 1", lang === "ar" ? "خلية 2" : "Cell 2"]],
        caption: "",
      };
    } else if (newKind === "text") {
      newBlock = { id: baseId, kind: newKind, text: "" };
    } else if (newKind === "image") {
      newBlock = { id: baseId, kind: newKind, title: "", imageUrl: "", caption: "", isPlaceholder: true };
    } else {
      newBlock = { id: baseId, kind: newKind, title: "", text: "", imageUrl: "", caption: "" };
    }
    current.splice(blockIdx + 1, 0, newBlock);
    if (onUpdateLeaf) onUpdateLeaf(leafId, { pageBlocks: current });
    else if (onUpdateBook) {
      onUpdateBook((prev) => {
        const base = prev || book;
        return {
          ...base,
          nodes: (base?.nodes || []).map((n) => (n.id === leafId ? { ...n, pageBlocks: current } : n)),
        };
      });
    }
  };

  const BLOCK_KINDS = [
    ["sectionTitle", t.blockSectionTitle, Heading2],
    ["text", t.blockTextKind || "Text", AlignLeft],
    ["table", t.blockTable || "Table", TableIcon],
    ["keyterm", t.blockKeyterm, Tag],
    ["note", t.blockNote, StickyNote],
    ["warning", t.blockWarning, AlertTriangle],
    ["important", t.blockImportant, AlertCircle],
    ["image", t.blockImage, ImagePlus],
    ["code", t.blockCode, Code2],
    ["pagebreak", t.blockPagebreak, CornerDownLeft],
  ];

  return (
    <div className="flex flex-col gap-3 min-w-0 w-full">
      {/* Floating 60 Palettes Modal for All Book Pages */}
      <PlatePaletteModal
        isOpen={palettePickerOpen}
        onClose={() => setPalettePickerOpen(false)}
        selectedId={activePalette.id}
        onSelect={(id) => {
          if (onUpdateBook) {
            onUpdateBook((prev) => {
              const base = prev || book;
              const updatedNodes = (base?.nodes || []).map((n) =>
                n.level === "leaf" || n.pagePaletteId !== undefined ? { ...n, pagePaletteId: id } : n
              );
              return {
                ...base,
                defaultPagePaletteId: id,
                nodes: updatedNodes,
              };
            });
          }
          if (activeLeaf && onUpdateLeaf) {
            onUpdateLeaf(activeLeaf.id, { pagePaletteId: id });
          }
        }}
        lang={lang}
        theme={theme}
        skin={skin}
        isFullBook={true}
        scopeLabel={lang === "ar" ? "تطبيق على كامل صفحات الكتاب" : "Apply to All Book Pages"}
      />

      {/* High-Definition Multi-Page PDF Exporter Modal */}
      <PdfExportModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        totalPages={pages.length}
        currentPageIndex={0}
        docTitle={docTitle || (book ? (lang === "ar" ? book.ar : book.en) : "EDUcraft_Book")}
        lang={lang}
        theme={theme}
        skin={skin}
      />

      {/* RIBBON TOOLBAR — Active Across All Book Pages (Editor mode only) */}
      {!readOnly && (
        <div className="overflow-x-auto educraft-glass shadow-xs mb-3" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}` }}>
        <div className="flex items-center gap-2 p-2 w-max min-w-full">
          {/* Target Leaf Selector */}
          <RibbonGroup label={lang === "ar" ? "الصفحة المستهدفة" : "Target Page"}>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl border" style={{ background: theme.surfaceSoft, borderColor: theme.hairline }}>
              <span className="text-xs font-bold shrink-0" style={{ color: theme.accent }}>
                🎯
              </span>
              <select
                value={targetLeafId || ""}
                onChange={(e) => setTargetLeafId(e.target.value)}
                className="text-xs font-bold bg-transparent outline-none cursor-pointer max-w-[180px] truncate"
                style={{ color: theme.ink }}
              >
                {allLeaves.map((l) => (
                  <option key={l.id} value={l.id}>
                    {lang === "ar" ? l.ar : l.en}
                  </option>
                ))}
              </select>
            </div>
          </RibbonGroup>

          <RibbonDivider theme={theme} />

          {/* Palette Picker */}
          <RibbonGroup label={t.pageGroup}>
            <button
              type="button"
              onClick={() => setPalettePickerOpen(true)}
              className="educraft-btn flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer shadow-2xs"
              style={{
                background: activePalette.PageBG,
                borderColor: theme.hairline,
                color: activePalette.HeaderColor,
              }}
              title="60 Palettes Picker"
            >
              <div
                className="w-4 h-4 rounded-full border shadow-2xs shrink-0"
                style={{ background: activePalette.SectionBG, borderColor: activePalette.HeaderColor }}
              />
              <span className="text-xs font-bold whitespace-nowrap">{activePalette.en || activePalette.name}</span>
              <ChevronDown size={12} className="opacity-70" />
            </button>
          </RibbonGroup>

          <RibbonDivider theme={theme} />

          {/* Insert Tools */}
          <RibbonGroup label={t.insertGroup}>
            {BLOCK_KINDS.map(([kind, label, Icon]) => (
              <RibbonButton
                key={kind}
                icon={Icon}
                label={label}
                theme={theme}
                skin={skin}
                onClick={() => addBlockToTargetLeaf(kind)}
                tone={activeKinds[kind]}
              />
            ))}
          </RibbonGroup>

          <RibbonDivider theme={theme} />

          {/* Focus Mode */}
          <RibbonGroup label={lang === "ar" ? "العرض" : "View"}>
            <button
              type="button"
              onClick={() => setFocusMode(!focusMode)}
              className="educraft-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer shadow-2xs text-xs font-bold transition-all"
              style={{
                background: focusMode ? theme.accent : theme.surfaceSoft,
                color: focusMode ? theme.accentInk : theme.ink,
                borderColor: focusMode ? theme.accent : theme.hairline,
              }}
            >
              {focusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{focusMode ? (lang === "ar" ? "إظهار الهامش" : "Restore Margin") : (lang === "ar" ? "صفحة كاملة (Focus)" : "Focus Canvas")}</span>
            </button>
            <button
              type="button"
              onClick={() => setReaderMode((m) => (m === "flow" ? "paged" : "flow"))}
              className="educraft-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer shadow-2xs text-xs font-bold transition-all"
              style={{
                background: readerMode === "flow" ? theme.accent : theme.surfaceSoft,
                color: readerMode === "flow" ? (theme.accentInk || "#ffffff") : theme.ink,
                borderColor: readerMode === "flow" ? theme.accent : theme.hairline,
              }}
              title={lang === "ar" ? "معاينة القراءة الانسيابية للجوال" : "Preview Mobile Flow"}
            >
              <span>{readerMode === "flow" ? (lang === "ar" ? "📄 شيتات A4" : "📄 A4 Pages") : (lang === "ar" ? "📱 عرض الجوال" : "📱 Mobile Flow")}</span>
            </button>
          </RibbonGroup>

          <RibbonDivider theme={theme} />

          {/* Export / Print RibbonGroup */}
          <RibbonGroup label={lang === "ar" ? "تصدير وطباعة" : "Export & Print"}>
            <button
              type="button"
              onClick={() => setPdfModalOpen(true)}
              className="educraft-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer shadow-2xs text-xs font-black transition-all hover:scale-[1.02] hover:brightness-105"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                color: "#ffffff",
                borderColor: "#dc2626",
              }}
              title={lang === "ar" ? "تصدير جميع الصفحات إلى PDF بدقة حتى 1200 DPI" : "Export all pages to PDF up to 1200 DPI"}
            >
              <FileDown size={14} />
              <span>{lang === "ar" ? "تصدير PDF (حتى 1200 DPI)" : "Export PDF (1200 DPI)"}</span>
            </button>
          </RibbonGroup>
        </div>
      </div>
      )}

      {/* Clean Distraction-Free Reader Header (Read-Through View) */}
      {readOnly && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border mb-3 educraft-glass shadow-xs flex-wrap"
          style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen size={17} style={{ color: theme.accent }} />
            <span className="text-xs sm:text-sm font-black truncate" style={{ color: theme.ink }}>
              {docTitle}
            </span>
            <span
              className="text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0"
              style={{ background: theme.accentSoft, color: theme.accent }}
            >
              {lang === "ar" ? "وضع القراءة" : "Reader"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 ms-auto flex-wrap">
            {/* Flow vs Paged switcher */}
            <div className="flex items-center p-0.5 rounded-xl border" style={{ borderColor: theme.hairlineStrong, background: theme.surface }}>
              <button
                type="button"
                onClick={() => setReaderMode("flow")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${readerMode === "flow" ? "shadow-2xs" : "opacity-70 hover:opacity-100"}`}
                style={{
                  background: readerMode === "flow" ? theme.accent : "transparent",
                  color: readerMode === "flow" ? (theme.accentInk || "#ffffff") : theme.ink,
                }}
              >
                {lang === "ar" ? "📱 انسيابي (موبايل)" : "📱 Mobile Flow"}
              </button>
              <button
                type="button"
                onClick={() => setReaderMode("paged")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${readerMode === "paged" ? "shadow-2xs" : "opacity-70 hover:opacity-100"}`}
                style={{
                  background: readerMode === "paged" ? theme.accent : "transparent",
                  color: readerMode === "paged" ? (theme.accentInk || "#ffffff") : theme.ink,
                }}
              >
                {lang === "ar" ? "📄 شيتات A4" : "📄 A4 Pages"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPdfModalOpen(true)}
              className="educraft-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                color: "#ffffff",
                borderColor: "#dc2626",
              }}
              title={lang === "ar" ? "تصدير PDF" : "Export PDF"}
            >
              <FileDown size={13} />
              <span className="hidden sm:inline">{lang === "ar" ? "تصدير PDF" : "Export PDF"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden measuring pass enclosed in zero-size clipped container */}
      <div style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, overflow: "hidden", visibility: "hidden", pointerEvents: "none", zIndex: -9999 }}>
        <div ref={measureRef} style={{ width: "182mm", fontFamily: PAGE_FONT, fontSize: 15, lineHeight: 1.9 }}>
          {blocks.map((b, i) => (
            <div key={b.id || i}>
              <PlateBlock block={b} kinds={plateKindsFor(paletteById(b._paletteId || 1))} theme={theme} skin={skin} />
            </div>
          ))}
        </div>
      </div>

      <div className={`grid ${focusMode || readOnly ? "grid-cols-1" : "xl:grid-cols-[minmax(0,1fr)_260px] 2xl:grid-cols-[minmax(0,1fr)_280px] grid-cols-1"} gap-4 items-start min-w-0 w-full`}>
        {/* CANVAS OR CONTINUOUS FLOW READER */}
        {readerMode === "flow" ? (
          <div className="order-1 min-w-0 w-full max-w-3xl mx-auto flex flex-col gap-6 py-2 px-1 sm:px-4">
            {allLeaves.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border" style={{ background: theme.surface, borderColor: theme.hairline }}>
                <p className="text-sm font-semibold" style={{ color: theme.inkSoft }}>
                  {t.emptyBook}
                </p>
              </div>
            ) : (
              allLeaves.map((leaf) => {
                const leafBlocks = leaf.pageBlocks || [];
                if (!leafBlocks.length) return null;
                const palette = paletteById(leaf.pagePaletteId || book?.defaultPagePaletteId || 1);
                const kinds = plateKindsFor(palette);
                const leafTitle = lang === "ar" ? leaf.ar : leaf.en;
                const branch = (book?.nodes || []).find((n) => n.id === leaf.parent);
                const branchTitle = branch ? (lang === "ar" ? branch.ar : branch.en) : "";

                return (
                  <article
                    key={leaf.id}
                    dir="rtl"
                    className="rounded-2xl border p-4 sm:p-7 transition-all shadow-xs"
                    style={{
                      background: palette.PageBG || theme.surface,
                      borderColor: theme.hairlineStrong,
                      color: palette.BodyText || theme.ink,
                      fontFamily: PAGE_FONT,
                    }}
                  >
                    <div
                      className="flex items-center justify-between pb-3 mb-4 border-b gap-3 flex-wrap"
                      style={{ borderColor: palette.HeaderColor ? `${palette.HeaderColor}33` : theme.hairline }}
                    >
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        {branchTitle && (
                          <span
                            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0"
                            style={{ background: theme.accentSoft, color: theme.accent }}
                          >
                            {branchTitle}
                          </span>
                        )}
                        <h2
                          className="text-base sm:text-lg font-black m-0 leading-tight"
                          style={{ color: palette.HeaderColor || theme.ink }}
                        >
                          {leafTitle}
                        </h2>
                      </div>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md opacity-60"
                        style={{ background: `${palette.HeaderColor || theme.accent}15`, color: palette.HeaderColor || theme.ink }}
                      >
                        {lang === "ar" ? `${leafBlocks.length} كتلة` : `${leafBlocks.length} blocks`}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3.5">
                      {leafBlocks.map((b, bi) => (
                        <div key={b.id || bi} className="w-full min-w-0">
                          <PlateBlock block={b} kinds={kinds} bookId={bookId || book?.id} theme={theme} skin={skin} />
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        ) : (
          <div className="order-1 min-w-0 overflow-hidden">
            <ZoomBar t={t} theme={theme} skin={skin} scale={scale} onZoomOut={zoomOut} onZoomIn={zoomIn} onFit={zoomFit} isFit={isFit} />

          <div ref={containerRef} className="overflow-x-auto overflow-y-visible flex justify-center py-2">
            <div style={{ zoom: scale, transition: "zoom 0.22s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <div className="flex flex-col gap-8 items-center py-2">
                {pages.length === 0 || (pages.length === 1 && pages[0].length === 0) ? (
                  activeLeaf ? (
                    <div
                      dir="rtl"
                      className="educraft-paper-sheet transition-all relative"
                      style={{
                        width: "210mm",
                        minHeight: "297mm",
                        background: activePalette.PageBG,
                        color: activePalette.BodyText,
                        padding: "16mm 14mm",
                        borderRadius: 6,
                        fontFamily: PAGE_FONT,
                        fontSize: 15,
                        lineHeight: 1.9,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingBottom: "0.6rem",
                          marginBottom: "1rem",
                          borderBottom: `2px solid ${activePalette.HeaderColor}`,
                          color: activePalette.HeaderColor,
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        <span>{docTitle}</span>
                        <span>{lang === "ar" ? activeLeaf.ar : activeLeaf.en}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-sm font-bold mb-2" style={{ color: activePalette.HeaderColor }}>
                          {lang === "ar" ? "الصفحة جاهزة لإضافة المحتوى" : "This page is ready for content"}
                        </p>
                        <p className="text-xs mb-6 max-w-sm opacity-70" style={{ color: activePalette.BodyText }}>
                          {lang === "ar"
                            ? "استخدم شريط الأدوات بالأعلى لإدراج عناوين، نصوص، جداول أو صور — أو اضغط على الزر أدناه لإضافة أول عنصر."
                            : "Use the ribbon tools above to insert titles, text, tables, or images — or click the button below to add your first block."}
                        </p>
                        <button
                          type="button"
                          onClick={() => addBlockToTargetLeaf("text")}
                          className="educraft-btn flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl border shadow-sm cursor-pointer"
                          style={{ background: activePalette.SectionBG, color: activePalette.HeaderColor, borderColor: activePalette.SectionFrame }}
                        >
                          <Plus size={14} />
                          <span>{lang === "ar" ? "إضافة أول كتلة لهذه الصفحة" : "Add First Block to Page"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-2xl border" style={{ background: theme.surface, borderColor: theme.hairline }}>
                      <p className="text-sm font-semibold" style={{ color: theme.inkSoft }}>
                        {t.emptyBook}
                      </p>
                    </div>
                  )
                ) : (
                  pages.map((pageBlocks, pi) => {
                    const owner = pageBlocks[0];
                    const leafId = owner?._leafId;
                    const isTargetPage = leafId && leafId === targetLeafId;
                    const palette = paletteById(owner?._paletteId || 1);
                    const kinds = plateKindsFor(palette);

                    return (
                      <div
                        key={pi}
                        dir="rtl"
                        onClick={() => {
                          if (!readOnly && leafId && leafId !== targetLeafId) setTargetLeafId(leafId);
                        }}
                        className={`educraft-paper-sheet transition-all relative ${readOnly ? "" : "cursor-pointer"}`}
                        style={{
                          width: "210mm",
                          minHeight: "297mm",
                          background: palette.PageBG,
                          color: palette.BodyText,
                          padding: "16mm 14mm",
                          boxShadow: !readOnly && isTargetPage
                            ? `0 0 0 3px ${theme.accent}, 0 12px 36px -4px rgba(0,0,0,0.18)`
                            : "0 4px 24px rgba(0,0,0,0.12)",
                          borderRadius: 6,
                          fontFamily: PAGE_FONT,
                          fontSize: 15,
                          lineHeight: 1.9,
                        }}
                      >
                        {/* Page Top Bar */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: "0.6rem",
                            marginBottom: "1rem",
                            borderBottom: `2px solid ${palette.HeaderColor}`,
                            color: palette.HeaderColor,
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          <span>{docTitle}</span>
                          <div className="flex items-center gap-2">
                            {!readOnly && isTargetPage && (
                              <span
                                className="text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs"
                                style={{ background: theme.accent, color: theme.accentInk }}
                              >
                                {lang === "ar" ? "🎯 الصفحة النشطة للتحرير" : "🎯 Active Target"}
                              </span>
                            )}
                            <span>{owner?._branchTitle ? `${owner._branchTitle} — ${owner._leafTitle}` : owner?._leafTitle}</span>
                          </div>
                        </div>

                        {/* Render page blocks */}
                        {pageBlocks.map((b, i) => {
                          const blockLeafId = b._leafId;
                          const blockIdx = typeof b._blockIndex === "number" ? b._blockIndex : i;

                          if (readOnly) {
                            return (
                              <PlateBlock
                                key={b.id || i}
                                block={b}
                                kinds={kinds}
                                theme={theme}
                                skin={skin}
                              />
                            );
                          }

                          return (
                            <CanvasBlockWrapper
                              key={b.id || i}
                              block={b}
                              kinds={kinds}
                              palette={palette}
                              theme={theme}
                              skin={skin}
                              lang={lang}
                              bookId={bookId}
                              onUpdate={(patch) => updateBlockInLeaf(blockLeafId, blockIdx, patch)}
                              onDelete={() => deleteBlockInLeaf(blockLeafId, blockIdx)}
                              onMove={(dir) => moveBlockInLeaf(blockLeafId, blockIdx, dir)}
                              onInsertBelow={(k) => insertBelowInLeaf(blockLeafId, blockIdx, k)}
                            />
                          );
                        })}

                        {/* Add Block to this leaf quick button (Editor mode only) */}
                        {!readOnly && leafId && (
                          <div className="mt-4 flex justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTargetLeafId(leafId);
                                const target = book.nodes.find((n) => n.id === leafId);
                                const current = target?.pageBlocks || [];
                                const baseId = `${leafId}-b-${Date.now()}`;
                                const newBlock = { id: baseId, kind: "text", text: "" };
                                if (onUpdateLeaf) onUpdateLeaf(leafId, { pageBlocks: [...current, newBlock] });
                              }}
                              className="educraft-btn flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-xl border border-dashed hover:border-solid cursor-pointer shadow-2xs opacity-70 hover:opacity-100 transition-all"
                              style={{ background: `${palette.HeaderColor}0d`, borderColor: palette.HeaderColor, color: palette.HeaderColor }}
                            >
                              <Plus size={12} />
                              <span>{lang === "ar" ? "إضافة عنصر جديد لأسفل هذه الصفحة" : "+ Add Block to This Leaf"}</span>
                            </button>
                          </div>
                        )}

                        <p style={{ position: "relative", top: "8mm", textAlign: "center", fontSize: 10, color: "#b3a692" }}>
                          {t.pageOf(pi + 1, pages.length)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* TASK PANE (Inspector for active target leaf in All Book Pages - Editor mode only) */}
        {!readOnly && !focusMode && activeLeaf && (
          <div className="order-2 p-3 min-w-0 w-full" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}`, background: theme.surface, alignSelf: "start" }}>
            <div className="flex items-center justify-between gap-1 mb-2 pb-1 border-b" style={{ borderColor: theme.hairline }}>
              <p className="text-[10px] font-bold uppercase tracking-wide truncate" style={{ color: theme.inkSoft }}>
                {lang === "ar" ? "عناصر: " : "Blocks: "}
                <span style={{ color: theme.accent }}>{lang === "ar" ? activeLeaf.ar : activeLeaf.en}</span>
              </p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: theme.accentSoft, color: theme.accent }}>
                {(activeLeaf.pageBlocks || []).length}
              </span>
            </div>
            <div className="max-h-[40vh] xl:max-h-[70vh] overflow-y-auto">
              {(activeLeaf.pageBlocks || []).map((b, i) => (
                <BlockRow
                  key={b.id || i}
                  block={b}
                  t={t}
                  theme={theme}
                  skin={skin}
                  kinds={activeKinds}
                  bookId={bookId}
                  onUpdate={(p) => updateBlockInLeaf(activeLeaf.id, i, p)}
                  onDelete={() => deleteBlockInLeaf(activeLeaf.id, i)}
                  onMove={(dir) => moveBlockInLeaf(activeLeaf.id, i, dir)}
                />
              ))}
              {(activeLeaf.pageBlocks || []).length === 0 && (
                <div className="text-center py-6">
                  <p className="text-xs mb-3" style={{ color: theme.inkSoft }}>
                    {lang === "ar" ? "لا توجد عناصر بعد في هذه الصفحة" : "No blocks in this page yet"}
                  </p>
                  <button
                    type="button"
                    onClick={() => addBlockToTargetLeaf("text")}
                    className="educraft-btn text-xs font-bold px-3 py-1.5 rounded-lg border"
                    style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
                  >
                    + {t.blockTextKind || "Text"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Read-only single-leaf A4 preview for DeckView when viewing educational reading sheets */
function SingleLeafA4Preview({ leaf, book, lang, theme, skin }) {
  const blocks = leaf?.pageBlocks || [];
  const palette = paletteById(leaf?.pagePaletteId || 1);
  const kinds = plateKindsFor(palette);
  const { pages, measureRef } = usePagedBlocks(blocks);
  const { containerRef, scale, zoomIn, zoomOut, zoomFit, isFit } = useFitScale();
  const [readerMode, setReaderMode] = useState(() => (typeof window !== "undefined" && window.innerWidth < 768 ? "flow" : "paged"));
  const t = EDITOR_STR[lang] || EDITOR_STR.ar;
  const docTitle = lang === "ar" ? book?.ar?.title : book?.en?.title;
  const leafTitle = leaf ? (lang === "ar" ? (leaf.ar || leaf.en) : (leaf.en || leaf.ar)) : "";

  if (!blocks.length) {
    return (
      <div className="p-8 text-center" style={panelStyle(skin, theme)}>
        <p className="text-sm font-semibold" style={{ color: theme.inkSoft }}>
          {lang === "ar" ? "لا توجد صفحات أو شيتات A4 في هذه الورقة." : "No A4 pages in this leaf."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      {/* Hidden measuring pass enclosed in zero-size clipped container so it never expands document width */}
      <div style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, overflow: "hidden", visibility: "hidden", pointerEvents: "none", zIndex: -9999 }}>
        <div ref={measureRef} style={{ width: "182mm", fontFamily: PAGE_FONT, fontSize: 15, lineHeight: 1.9 }}>
          {blocks.map((b, i) => (
            <PlateBlock key={b.id || i} block={b} kinds={kinds} theme={theme} skin={skin} />
          ))}
        </div>
      </div>

      {/* Reader mode toggle bar */}
      <div
        className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl border mb-4 flex-wrap educraft-glass shadow-2xs"
        style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={16} style={{ color: theme.accent }} />
          <span className="text-xs sm:text-sm font-black truncate" style={{ color: theme.ink }}>
            {leafTitle}
          </span>
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: theme.accentSoft, color: theme.accent }}
          >
            {lang === "ar" ? `${blocks.length} كتلة` : `${blocks.length} blocks`}
          </span>
        </div>

        <div className="flex items-center p-0.5 rounded-xl border ms-auto" style={{ borderColor: theme.hairlineStrong, background: theme.surface }}>
          <button
            type="button"
            onClick={() => setReaderMode("flow")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${readerMode === "flow" ? "shadow-2xs" : "opacity-70 hover:opacity-100"}`}
            style={{
              background: readerMode === "flow" ? theme.accent : "transparent",
              color: readerMode === "flow" ? (theme.accentInk || "#ffffff") : theme.ink,
            }}
          >
            {lang === "ar" ? "📱 قراءة انسيابية" : "📱 Mobile Flow"}
          </button>
          <button
            type="button"
            onClick={() => setReaderMode("paged")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${readerMode === "paged" ? "shadow-2xs" : "opacity-70 hover:opacity-100"}`}
            style={{
              background: readerMode === "paged" ? theme.accent : "transparent",
              color: readerMode === "paged" ? (theme.accentInk || "#ffffff") : theme.ink,
            }}
          >
            {lang === "ar" ? "📄 شيتات A4" : "📄 A4 Pages"}
          </button>
        </div>
      </div>

      {readerMode === "flow" ? (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 py-1 min-w-0">
          <article
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="rounded-2xl border p-4 sm:p-7 transition-all shadow-xs"
            style={{
              background: palette.PageBG || theme.surface,
              borderColor: theme.hairlineStrong,
              color: palette.BodyText || theme.ink,
              fontFamily: PAGE_FONT,
            }}
          >
            <div
              className="pb-3 mb-4 border-b flex items-center justify-between gap-2"
              style={{ borderColor: palette.HeaderColor ? `${palette.HeaderColor}33` : theme.hairline }}
            >
              <div>
                <span className="text-[11px] font-bold opacity-70 block mb-0.5" style={{ color: palette.HeaderColor || theme.inkSoft }}>
                  {docTitle}
                </span>
                <h2 className="text-base sm:text-lg font-black m-0 leading-snug" style={{ color: palette.HeaderColor || theme.ink }}>
                  {leafTitle}
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {blocks.map((b, i) => (
                <div key={b.id || i} className="w-full min-w-0">
                  <PlateBlock block={b} kinds={kinds} bookId={book?.id} theme={theme} skin={skin} />
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : (
        <>
          <ZoomBar t={t} theme={theme} skin={skin} scale={scale} onZoomOut={zoomOut} onZoomIn={zoomIn} onFit={zoomFit} isFit={isFit} />

          <div ref={containerRef} className="overflow-x-auto overflow-y-visible flex justify-center py-2">
            <div style={{ zoom: scale, transition: "zoom 0.22s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <div className="flex flex-col gap-6 items-center py-2">
                {pages.map((pageBlocks, pi) => (
                  <div
                    key={pi}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    className="educraft-paper-sheet"
                    style={{
                      width: "210mm",
                      minHeight: "297mm",
                      background: palette.PageBG,
                      color: palette.BodyText,
                      padding: "16mm 14mm",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                      borderRadius: 4,
                      fontFamily: PAGE_FONT,
                      fontSize: 15,
                      lineHeight: 1.9,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "0.6rem",
                        marginBottom: "1rem",
                        borderBottom: `2px solid ${palette.HeaderColor}`,
                        color: palette.HeaderColor,
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      <span>{docTitle}</span>
                      <span>{leafTitle}</span>
                    </div>

                    {pageBlocks.map((b, i) => (
                      <PlateBlock key={b.id || i} block={b} kinds={kinds} theme={theme} skin={skin} />
                    ))}
                    <p style={{ position: "relative", top: "8mm", textAlign: "center", fontSize: 10, color: "#b3a692" }}>
                      {t.pageOf(pi + 1, pages.length)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Floating modal for selecting from all 60 Thiqa A4 Plate Palettes */
function PlatePaletteModal({ isOpen, onClose, selectedId, onSelect, lang, theme, skin, isFullBook = false, scopeLabel }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: "all", en: "All (60)", ar: "الكل (60)" },
    { id: "academic", en: "Academic & Neutral", ar: "أكاديمي ومحايد", ids: [1, 2, 3, 11, 12, 14, 23, 36] },
    { id: "pastel", en: "Soft Pastel", ar: "باستيل وناعم", ids: [4, 5, 6, 7, 19, 28, 40] },
    { id: "dark", en: "Night & Dark", ar: "ليلي وداكن", ids: [8, 9, 10] },
    { id: "vibrant", en: "Vibrant & Rich", ar: "حيوي ومتنوع", ids: [13, 15, 16, 17, 18, 20, 21, 22, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60] },
  ];

  const filtered = PAGE_PALETTES.filter((p) => {
    if (filterCat !== "all") {
      const cat = categories.find((c) => c.id === filterCat);
      if (cat && cat.ids && !cat.ids.includes(p.id)) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        (p.en && p.en.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        String(p.id).includes(q)
      );
    }
    return true;
  });

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 transition-opacity"
      style={{ animation: "educraftFadeIn 0.18s ease-out forwards" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden educraft-modal-in"
        style={{
          background: theme.surface,
          borderColor: theme.hairlineStrong,
          color: theme.ink,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-3"
          style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl grid place-items-center shadow-xs"
              style={{ background: theme.accentSoft, color: theme.accent }}
            >
              <Palette size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black tracking-tight" style={{ color: theme.ink }}>
                  60 Document & Print Plates
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: theme.accentSoft, color: theme.accent }}>
                  {scopeLabel || (isFullBook ? (lang === "ar" ? "تطبيق على كامل الكتاب" : "Full Book") : (lang === "ar" ? "هذه الصفحة" : "This Page"))}
                </span>
              </div>
              <p className="text-xs font-medium" style={{ color: theme.inkSoft }}>
                {isFullBook
                  ? (lang === "ar" ? "اختر قالباً لونياً ليتم تطبيقه وتوحيده فوراً على جميع صفحات الكتاب" : "Choose any plate to apply immediately across all pages of the book")
                  : (lang === "ar" ? "اختر قالباً لونياً لتطبيقه على صفحة A4 الحالية" : "Click any plate to preview instantly on the A4 page canvas")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="educraft-btn w-9 h-9 rounded-xl grid place-items-center cursor-pointer border shadow-2xs"
            style={{ background: theme.surface, borderColor: theme.hairline, color: theme.inkSoft }}
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3" style={{ borderColor: theme.hairline, background: theme.surface }}>
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or plate # (e.g. Mint, Midnight, Amber, 14)..."
              className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border outline-none pe-8 shadow-2xs"
              style={{ background: theme.surfaceSoft, borderColor: theme.hairline, color: theme.ink }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs font-bold cursor-pointer"
                style={{ color: theme.inkSoft }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCat(cat.id)}
                className="educraft-btn text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs"
                style={{
                  background: filterCat === cat.id ? theme.accent : theme.surfaceSoft,
                  color: filterCat === cat.id ? theme.accentInk : theme.inkSoft,
                  border: `1px solid ${filterCat === cat.id ? theme.accent : theme.hairline}`,
                }}
              >
                {cat.en}
              </button>
            ))}
          </div>
        </div>

        {/* 60 Palettes Grid */}
        <div className="p-6 overflow-y-auto max-h-[62vh]" style={{ background: theme.canvas }}>
          {filtered.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center gap-2">
              <Palette size={32} style={{ color: theme.inkSoft, opacity: 0.5 }} />
              <p className="text-sm font-semibold" style={{ color: theme.inkSoft }}>
                No palettes match "{search}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filtered.map((p) => {
                const isSelected = selectedId === p.id;
                const enTitle = p.en || p.name;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelect(p.id)}
                    className="educraft-btn group relative p-3 rounded-2xl border text-start flex flex-col justify-between gap-2.5 cursor-pointer transition-all"
                    style={{
                      background: theme.surface,
                      borderColor: isSelected ? theme.accent : theme.hairline,
                      boxShadow: isSelected
                        ? `0 0 0 2.5px ${theme.accent}, 0 8px 24px rgba(0,0,0,0.12)`
                        : "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Realistic Mini A4 Sheet Preview */}
                    <div
                      className="w-full aspect-[1/1.32] rounded-xl border p-2 flex flex-col justify-between overflow-hidden shadow-sm relative transition-transform group-hover:scale-[1.02]"
                      style={{
                        background: p.PageBG,
                        borderColor: `${p.HeaderColor}33`,
                      }}
                    >
                      {/* Sheet Header line */}
                      <div className="flex items-center justify-between pb-1 border-b" style={{ borderColor: `${p.HeaderColor}44` }}>
                        <div className="h-1.5 w-1/2 rounded-full" style={{ background: p.HeaderColor }} />
                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: p.SectionBG }} />
                      </div>

                      {/* Section card with accent frame */}
                      <div
                        className="rounded p-1.5 flex flex-col gap-1 border"
                        style={{
                          background: `${p.SectionBG}18`,
                          borderColor: p.SectionFrame || p.SectionBG,
                        }}
                      >
                        <div className="h-2 w-3/4 rounded" style={{ background: p.SectionBG }} />
                        <div className="h-1 w-full rounded-full opacity-40" style={{ background: p.BodyText }} />
                        <div className="h-1 w-2/3 rounded-full opacity-40" style={{ background: p.BodyText }} />
                      </div>

                      {/* Note card / keyframe */}
                      <div
                        className="rounded px-1.5 py-1 flex items-center gap-1 border"
                        style={{
                          background: p.NoteBG || `${p.KeyBG}33`,
                          borderColor: p.NoteFrame || p.KeyFrame,
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.KeyFrame || p.HeaderColor }} />
                        <div className="h-1 w-3/4 rounded-full opacity-60" style={{ background: p.NoteText || p.KeyText }} />
                      </div>

                      {/* Selection Checkmark Badge */}
                      {isSelected && (
                        <div
                          className="absolute end-1.5 top-1.5 w-5 h-5 rounded-full grid place-items-center shadow-md"
                          style={{ background: theme.accent, color: theme.accentInk }}
                        >
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Card Label Information */}
                    <div className="flex flex-col gap-0.5 w-full min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className="text-[11px] font-black tracking-tight truncate flex-1"
                          style={{ color: isSelected ? theme.accent : theme.ink }}
                          title={enTitle}
                        >
                          {enTitle}
                        </span>
                        <span
                          className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 font-mono"
                          style={{ background: theme.surfaceSoft, color: theme.inkSoft }}
                        >
                          #{p.id < 10 ? `0${p.id}` : p.id}
                        </span>
                      </div>
                      {p.name && (
                        <span className="text-[10px] font-semibold truncate opacity-60" dir="rtl">
                          {p.name}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-3.5 border-t flex-wrap gap-3"
          style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: theme.inkSoft }}>
              Selected Plate:
            </span>
            <span
              className="text-xs font-black px-2.5 py-1 rounded-xl shadow-2xs"
              style={{ background: theme.surface, color: theme.accent, border: `1px solid ${theme.hairline}` }}
            >
              #{selectedId} {PAGE_PALETTES.find((p) => p.id === selectedId)?.en || PAGE_PALETTES.find((p) => p.id === selectedId)?.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="educraft-btn text-xs font-bold px-6 py-2 rounded-xl cursor-pointer shadow-sm"
            style={{ background: theme.accent, color: theme.accentInk }}
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* =========================================================================
   MODAL: High-Definition A4 Multi-Page PDF Exporter (Customizable up to 1200 DPI)
   ========================================================================= */
function parsePageRange(rangeStr, totalPages) {
  if (!rangeStr || !rangeStr.trim()) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  const parts = rangeStr.split(/[,،]/);
  const indices = new Set();
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.includes("-") || trimmed.includes("—")) {
      const [startStr, endStr] = trimmed.split(/[-—]/);
      const start = parseInt(startStr.trim(), 10);
      const end = parseInt(endStr.trim(), 10);
      if (!isNaN(start) && !isNaN(end)) {
        const s = Math.max(1, Math.min(start, end));
        const e = Math.min(totalPages, Math.max(start, end));
        for (let i = s; i <= e; i++) {
          indices.add(i - 1);
        }
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        indices.add(p - 1);
      }
    }
  }
  const result = Array.from(indices).sort((a, b) => a - b);
  return result.length > 0 ? result : Array.from({ length: totalPages }, (_, i) => i);
}

function PdfExportModal({
  isOpen,
  onClose,
  totalPages = 1,
  currentPageIndex = 0,
  docTitle = "EDUcraft_Document",
  lang = "ar",
  theme,
  skin,
}) {
  const [dpiPreset, setDpiPreset] = useState(300);
  const [customDpi, setCustomDpi] = useState(300);
  const [isCustom, setIsCustom] = useState(false);
  const [scope, setScope] = useState("all");
  const [pageRangeStr, setPageRangeStr] = useState(`1-${Math.max(1, totalPages)}`);
  const [showRasterSection, setShowRasterSection] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, pct: 0, text: "" });
  const [errorMsg, setErrorMsg] = useState(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (totalPages) {
      setPageRangeStr(`1-${totalPages}`);
    }
  }, [totalPages]);

  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isExporting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isExporting, onClose]);

  if (!isOpen) return null;

  const activeDpi = isCustom ? Math.min(1200, Math.max(72, Number(customDpi) || 300)) : dpiPreset;

  const presets = [
    {
      dpi: 150,
      title: lang === "ar" ? "150 DPI — مسودة سريعة" : "150 DPI — Fast Draft",
      desc: lang === "ar" ? "معالجة فائقة السرعة وحجم ملف خفيف للمشاركة السريعة" : "Ultra-fast generation & light file size for quick sharing",
      tag: lang === "ar" ? "مسودة" : "Draft",
      tagColor: "#64748b",
    },
    {
      dpi: 300,
      title: lang === "ar" ? "300 DPI — جودة قياسية (مُوصى به)" : "300 DPI — Standard Print (Recommended)",
      desc: lang === "ar" ? "الدقة المعيارية المعتمدة للكتب والمطبوعات الورقية" : "Industry standard print quality with optimal crispness",
      tag: lang === "ar" ? "مُوصى به" : "Recommended",
      tagColor: theme.accent,
      recommended: true,
    },
    {
      dpi: 600,
      title: lang === "ar" ? "600 DPI — فائقة الدقة (Ultra HD)" : "600 DPI — Ultra HD Resolution",
      desc: lang === "ar" ? "حدة استثنائية لخطوط النسخ والرقعة والجداول الدقيقة" : "Super-sharp typography, tables and fine equations",
      tag: "Ultra HD",
      tagColor: "#8b5cf6",
    },
    {
      dpi: 1200,
      title: lang === "ar" ? "1200 DPI — مطابع دور النشر (Master Press)" : "1200 DPI — Master Press Grade",
      desc: lang === "ar" ? "أقصى دقة مطبعية ممكنة حتى 1200 DPI لطباعة الأوفست الفاخرة" : "Maximum possible fidelity up to 1200 DPI for commercial offset presses",
      tag: "Pro 1200 DPI",
      tagColor: "#ef4444",
    },
  ];

  const handleStartExport = async () => {
    try {
      setIsExporting(true);
      setErrorMsg(null);
      cancelRef.current = false;

      // 1. Find all paper sheets in DOM
      const sheets = Array.from(document.querySelectorAll(".educraft-paper-sheet"));
      if (!sheets.length) {
        throw new Error(
          lang === "ar"
            ? "لم يتم العثور على صفحات لعرضها. يرجى التأكد من أن الصفحات معروضة على الشاشة."
            : "No printable pages found. Please ensure pages are rendered."
        );
      }

      // 2. Filter target pages
      let targetIndices = [];
      if (scope === "current") {
        targetIndices = [Math.min(currentPageIndex, sheets.length - 1)];
      } else if (scope === "range") {
        targetIndices = parsePageRange(pageRangeStr, sheets.length);
      } else {
        targetIndices = sheets.map((_, i) => i);
      }

      if (!targetIndices.length) {
        throw new Error(
          lang === "ar" ? "نطاق الصفحات المحدد غير صالح أو فارغ." : "Selected page range is invalid or empty."
        );
      }

      const totalToExport = targetIndices.length;
      setProgress({
        current: 0,
        total: totalToExport,
        pct: 0,
        text: lang === "ar" ? "جاري تهيئة محرّك التصدير..." : "Initializing export engine...",
      });

      // 3. Initialize jsPDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const targetDpi = isCustom ? Math.min(1200, Math.max(72, Number(customDpi) || 300)) : dpiPreset;
      const canvasScale = targetDpi / 96;

      // 4. Sequential render loop
      for (let i = 0; i < targetIndices.length; i++) {
        if (cancelRef.current) {
          setIsExporting(false);
          setProgress({ current: 0, total: 0, pct: 0, text: "" });
          return;
        }

        const pageIdx = targetIndices[i];
        const sheetEl = sheets[pageIdx];

        setProgress({
          current: i + 1,
          total: totalToExport,
          pct: Math.round(((i + 0.2) / totalToExport) * 100),
          text:
            lang === "ar"
              ? `معالجة الصفحة ${i + 1} من ${totalToExport} (دقة ${targetDpi} DPI)...`
              : `Processing page ${i + 1} of ${totalToExport} (${targetDpi} DPI)...`,
        });

        // Small yield so browser draws progress
        await new Promise((r) => setTimeout(r, 50));

        let canvas = null;
        try {
          canvas = await html2canvas(sheetEl, {
            scale: canvasScale,
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: null,
            onclone: (clonedDoc, clonedEl) => {
              // Reset zoom & transform on all parents
              let cur = clonedEl;
              while (cur && cur !== clonedDoc.body) {
                if (cur.style) {
                  cur.style.zoom = "1";
                  cur.style.transform = "none";
                }
                cur = cur.parentElement;
              }
              // Clean up borders, shadows and editor buttons
              clonedEl.style.boxShadow = "none";
              clonedEl.style.outline = "none";
              clonedEl.style.margin = "0";
              clonedEl.style.borderRadius = "0";
              clonedEl.querySelectorAll("button, .educraft-block-toolbar, [data-editor-controls]").forEach((btn) => {
                btn.style.display = "none";
              });
            },
          });
        } catch (captureErr) {
          console.error("Page capture error:", captureErr);
          throw new Error(
            lang === "ar"
              ? `فشلت معالجة الصفحة ${pageIdx + 1}: ${captureErr.message || captureErr}`
              : `Error capturing page ${pageIdx + 1}: ${captureErr.message || captureErr}`
          );
        }

        if (cancelRef.current) {
          if (canvas) {
            canvas.width = 1;
            canvas.height = 1;
          }
          setIsExporting(false);
          return;
        }

        const imgData = canvas.toDataURL("image/jpeg", 0.94);

        if (i > 0) {
          pdf.addPage("a4", "portrait");
        }
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");

        // Immediate memory release
        canvas.width = 1;
        canvas.height = 1;
        canvas = null;

        setProgress({
          current: i + 1,
          total: totalToExport,
          pct: Math.round(((i + 1) / totalToExport) * 100),
          text:
            lang === "ar"
              ? `اكتملت الصفحة ${i + 1} من ${totalToExport}`
              : `Page ${i + 1} of ${totalToExport} completed`,
        });

        await new Promise((r) => setTimeout(r, 40));
      }

      // 5. Download file
      const safeDocName = (docTitle || "EDUcraft_Book")
        .replace(/[/\\?%*:|"<>]/g, "_")
        .trim();
      pdf.save(`${safeDocName}_${targetDpi}dpi.pdf`);

      setIsExporting(false);
      setProgress({
        current: totalToExport,
        total: totalToExport,
        pct: 100,
        text: lang === "ar" ? "✅ تم تصدير وتحميل ملف PDF بنجاح!" : "✅ PDF exported and downloaded successfully!",
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error("PDF Export failed:", err);
      setIsExporting(false);
      setErrorMsg(err?.message || (lang === "ar" ? "فشل تصدير ملف PDF" : "Failed to export PDF"));
    }
  };

  const handleInstantVectorPrint = () => {
    // 1. Filter sheets according to selected scope
    const sheets = Array.from(document.querySelectorAll(".educraft-paper-sheet"));
    let targetIndices = [];
    if (scope === "current") {
      targetIndices = [Math.min(currentPageIndex, sheets.length - 1)];
    } else if (scope === "range") {
      targetIndices = parsePageRange(pageRangeStr, sheets.length);
    } else {
      targetIndices = sheets.map((_, i) => i);
    }

    const targetSet = new Set(targetIndices);
    const hiddenSheets = [];
    sheets.forEach((sheet, idx) => {
      if (!targetSet.has(idx)) {
        sheet.classList.add("print-hidden-sheet");
        hiddenSheets.push(sheet);
      }
    });

    onClose();
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        hiddenSheets.forEach((el) => el.classList.remove("print-hidden-sheet"));
      }, 1500);
    }, 200);
  };

  const handleBrowserPrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 transition-opacity"
      style={{ animation: "educraftFadeIn 0.18s ease-out forwards" }}
      onClick={() => {
        if (!isExporting) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden educraft-modal-in"
        style={{
          background: theme.surface,
          borderColor: theme.hairlineStrong,
          color: theme.ink,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b gap-3"
          style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl grid place-items-center shadow-xs text-white"
              style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" }}
            >
              <FileDown size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight" style={{ color: theme.ink }}>
                  {lang === "ar" ? "تصدير صفحات A4 إلى PDF فائق الدقة" : "Export A4 Pages to High-Definition PDF"}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  {lang === "ar" ? "حتى 1200 DPI" : "Up to 1200 DPI"}
                </span>
              </div>
              <p className="text-xs font-medium opacity-75" style={{ color: theme.inkSoft }}>
                {lang === "ar"
                  ? "تصدير عالي النقاء بدقة مطابع دور النشر للكتب والمستندات التعليمية"
                  : "Studio-grade multi-page document export for publishing and offset printing"}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            className="educraft-btn w-9 h-9 rounded-xl grid place-items-center cursor-pointer border shadow-2xs disabled:opacity-40"
            style={{ background: theme.surface, borderColor: theme.hairline, color: theme.inkSoft }}
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 flex-1">
          {/* 1. Page Scope Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black flex items-center gap-1.5" style={{ color: theme.ink }}>
              <Layers size={14} style={{ color: theme.accent }} />
              <span>{lang === "ar" ? "الصفحات المطلوب تصديرها:" : "Page Selection Scope:"}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setScope("all")}
                className="educraft-btn p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all"
                style={{
                  background: scope === "all" ? theme.accentSoft : theme.surfaceSoft,
                  borderColor: scope === "all" ? theme.accent : theme.hairline,
                  color: scope === "all" ? theme.accent : theme.ink,
                }}
              >
                {lang === "ar" ? `جميع الصفحات (${totalPages})` : `All Pages (${totalPages})`}
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setScope("current")}
                className="educraft-btn p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all"
                style={{
                  background: scope === "current" ? theme.accentSoft : theme.surfaceSoft,
                  borderColor: scope === "current" ? theme.accent : theme.hairline,
                  color: scope === "current" ? theme.accent : theme.ink,
                }}
              >
                {lang === "ar" ? `الصفحة الحالية (${currentPageIndex + 1})` : `Current Page (${currentPageIndex + 1})`}
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setScope("range")}
                className="educraft-btn p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all"
                style={{
                  background: scope === "range" ? theme.accentSoft : theme.surfaceSoft,
                  borderColor: scope === "range" ? theme.accent : theme.hairline,
                  color: scope === "range" ? theme.accent : theme.ink,
                }}
              >
                {lang === "ar" ? "نطاق محدد" : "Custom Range"}
              </button>
            </div>

            {scope === "range" && (
              <div className="flex items-center gap-2 mt-1 p-2 rounded-xl border" style={{ background: theme.surfaceSoft, borderColor: theme.hairline }}>
                <span className="text-xs font-semibold shrink-0" style={{ color: theme.inkSoft }}>
                  {lang === "ar" ? "أرقام الصفحات:" : "Page numbers:"}
                </span>
                <input
                  type="text"
                  disabled={isExporting}
                  value={pageRangeStr}
                  onChange={(e) => setPageRangeStr(e.target.value)}
                  placeholder="مثال: 1-3 أو 1, 3, 5"
                  className="flex-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border outline-none"
                  style={{ background: theme.surface, borderColor: theme.hairline, color: theme.ink }}
                />
              </div>
            )}
          </div>

          {/* 2. Instant High-Speed Vector PDF Hero Banner */}
          <div
            className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.09) 0%, rgba(5, 150, 105, 0.16) 100%)",
              borderColor: "rgba(16, 185, 129, 0.45)",
            }}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white grid place-items-center shrink-0 shadow-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-100">
                    {lang === "ar" ? "⚡ تصدير فوري فائق السرعة (Vector PDF — ثانيتان فقط)" : "⚡ Instant Ultra-Fast Vector PDF (2 Seconds)"}
                  </h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                    {lang === "ar" ? "مُوصى به (فائق السرعة)" : "Recommended (Fast)"}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-emerald-900/90 dark:text-emerald-200 mt-1 leading-relaxed">
                  {lang === "ar"
                    ? "تصدير شعاعي كامل عبر محرك النظام C++/WebKit في ثانيتين فقط! نصوص واضحة 100% وقابلة للبحث مع أبعاد A4 دقيقة وحجم ملف خفيف جداً."
                    : "Instant C++/WebKit native vector export in ~2 seconds. 100% sharp searchable typography, exact A4 pagination, ultra-compact size."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInstantVectorPrint}
              className="educraft-btn shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Printer size={15} />
              <span>{lang === "ar" ? "تصدير فوري الآن" : "Export Instant Vector"}</span>
            </button>
          </div>

          {/* 3. Collapsible Legacy Raster / Canvas Export Section */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}>
            <button
              type="button"
              onClick={() => setShowRasterSection(!showRasterSection)}
              className="w-full flex items-center justify-between p-3.5 text-start cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} style={{ color: theme.inkSoft }} />
                <span className="text-xs font-bold" style={{ color: theme.ink }}>
                  {lang === "ar"
                    ? "خيارات متقدمة: تصدير نقطي بصور عالية الدقة (Legacy Canvas Raster — بطيء)"
                    : "Advanced: Custom Raster Image Export (Legacy Canvas — Slow)"}
                </span>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: theme.accent }}>
                {showRasterSection ? "▲" : "▼"}
              </span>
            </button>

            {showRasterSection && (
              <div className="p-4 pt-1 flex flex-col gap-4 border-t" style={{ borderColor: theme.hairline }}>
                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5 text-xs"
                  style={{ background: "#fff7ed", borderColor: "#fed7aa", color: "#9a3412" }}
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  <p className="leading-relaxed text-[11px]">
                    {lang === "ar"
                      ? "⚠️ تنبيه: المعالجة النقطية تحوّل كل صفحة لصورة عالية الدقة بكسل-بكسل، مما قد يستغرق دقيقة إلى 3 دقائق. للحصول على تصدير فوري فائق الدقة في ثانيتين، استخدم التصدير الشعاعي بالأعلى."
                      : "⚠️ Note: Raster export renders each page into high-DPI canvas bitmaps, taking 1-3 minutes. Use the Instant Vector Export above for ~2s export."}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold" style={{ color: theme.ink }}>
                    <span>{lang === "ar" ? "دقة وضوح الطباعة (DPI):" : "Print Resolution (DPI):"}</span>
                  </label>
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => setIsCustom(!isCustom)}
                    className="text-xs font-bold cursor-pointer underline hover:opacity-80"
                    style={{ color: theme.accent }}
                  >
                    {isCustom
                      ? lang === "ar" ? "العودة للخيارات الجاهزة" : "Back to presets"
                      : lang === "ar" ? "تحديد DPI مخصص يدوياً" : "Custom DPI input"}
                  </button>
                </div>

                {!isCustom ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {presets.map((p) => {
                      const isSelected = dpiPreset === p.dpi;
                      return (
                        <div
                          key={p.dpi}
                          onClick={() => !isExporting && setDpiPreset(p.dpi)}
                          className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1 ${
                            isSelected ? "shadow-md" : "hover:border-black/20 opacity-85 hover:opacity-100"
                          }`}
                          style={{
                            background: isSelected ? theme.accentSoft : theme.surface,
                            borderColor: isSelected ? theme.accent : theme.hairline,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black" style={{ color: isSelected ? theme.accent : theme.ink }}>
                              {p.title}
                            </span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: isSelected ? theme.accent : theme.surfaceSoft,
                                color: isSelected ? theme.accentInk : p.tagColor,
                                border: `1px solid ${theme.hairline}`,
                              }}
                            >
                              {p.tag}
                            </span>
                          </div>
                          <p className="text-[10px] font-medium leading-normal" style={{ color: theme.inkSoft }}>
                            {p.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border flex flex-col gap-2.5" style={{ background: theme.surface, borderColor: theme.hairline }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: theme.ink }}>
                        {lang === "ar" ? "اختر قيمة DPI من 72 حتى 1200:" : "Enter DPI between 72 and 1200:"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={72}
                          max={1200}
                          step={25}
                          disabled={isExporting}
                          value={customDpi}
                          onChange={(e) => setCustomDpi(e.target.value)}
                          className="w-20 text-center font-mono font-black text-xs px-2 py-1 rounded-lg border outline-none"
                          style={{ background: theme.surface, borderColor: theme.accent, color: theme.accent }}
                        />
                        <span className="text-xs font-black" style={{ color: theme.accent }}>
                          DPI
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={72}
                      max={1200}
                      step={25}
                      disabled={isExporting}
                      value={customDpi}
                      onChange={(e) => setCustomDpi(Number(e.target.value))}
                      className="w-full cursor-pointer accent-red-600"
                    />
                  </div>
                )}

                {/* Start raster export button inside this section */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={handleStartExport}
                    className="educraft-btn flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-xl border shadow-sm cursor-pointer disabled:opacity-60 transition-all text-white"
                    style={{
                      background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
                      borderColor: "#475569",
                    }}
                  >
                    <FileDown size={14} />
                    <span>
                      {isExporting
                        ? lang === "ar" ? "جاري التصدير النقطي..." : "Exporting Raster..."
                        : lang === "ar" ? `بدء التصدير النقطي (${activeDpi} DPI)` : `Start Raster Export (${activeDpi} DPI)`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar (Visible during export) */}
          {isExporting && (
            <div
              className="p-4 rounded-2xl border flex flex-col gap-2.5 educraft-modal-in shadow-inner"
              style={{ background: theme.surfaceSoft, borderColor: theme.hairlineStrong }}
            >
              <div className="flex items-center justify-between text-xs font-black">
                <span style={{ color: theme.accent }}>{progress.text}</span>
                <span className="font-mono" style={{ color: theme.ink }}>
                  {progress.pct}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-black/10 relative">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress.pct}%`,
                    background: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)",
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-semibold" style={{ color: theme.inkSoft }}>
                  {lang === "ar"
                    ? `صفحة ${progress.current} من ${progress.total}`
                    : `Page ${progress.current} of ${progress.total}`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    cancelRef.current = true;
                  }}
                  className="text-xs text-red-600 font-black cursor-pointer hover:underline"
                >
                  {lang === "ar" ? "إلغاء التصدير" : "Cancel"}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl border bg-red-50 border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t gap-3 flex-wrap"
          style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}
        >
          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            className="educraft-btn text-xs font-bold px-4 py-2 rounded-xl border cursor-pointer disabled:opacity-40"
            style={{ background: theme.surface, borderColor: theme.hairline, color: theme.inkSoft }}
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>

          <div className="flex items-center gap-2.5 ms-auto">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleBrowserPrint}
              className="educraft-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer disabled:opacity-40"
              style={{ background: theme.surface, borderColor: theme.hairline, color: theme.ink }}
              title={lang === "ar" ? "طباعة المتصفح السريعة المباشرة" : "Direct browser print"}
            >
              <Printer size={14} />
              <span>{lang === "ar" ? "طباعة المتصفح المباشرة" : "Browser Print"}</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleInstantVectorPrint}
              className="educraft-btn flex items-center gap-2 text-xs font-black px-6 py-2.5 rounded-xl border shadow-lg cursor-pointer disabled:opacity-60 transition-all hover:scale-[1.02] text-white"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderColor: "#059669",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              }}
            >
              <Sparkles size={15} />
              <span>
                {lang === "ar" ? "⚡ بدء التصدير الفوري (Vector PDF — ثانيتان)" : "⚡ Export Instant Vector PDF (2s)"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function A4PageBuilder({ leaf, lang, theme, skin, t, onUpdateLeaf, allLeavesCards, docTitle, pageTitle, bookId }) {
  const [palettePickerOpen, setPalettePickerOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const blocks = leaf.pageBlocks || [];
  const palette = paletteById(leaf.pagePaletteId || 1);
  const kinds = plateKindsFor(palette);
  const setBlocks = (next) => onUpdateLeaf({ pageBlocks: next });
  const updateBlock = (i, patch) => setBlocks(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const deleteBlock = (i) => {
    const target = blocks[i];
    if (target && target.kind === "image" && target.imageUrl && target.imageUrl.startsWith("assets/images/")) {
      deleteBookImageFs(bookId, target.imageUrl);
    }
    setBlocks(blocks.filter((_, idx) => idx !== i));
  };
  const moveBlock = (i, dir) => () => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    setBlocks(next);
  };
  const addBlock = (kind) => {
    const baseId = `${leaf.id}-b-${Date.now()}`;
    if (kind === "table") {
      setBlocks([...blocks, { id: baseId, kind, title: "", headers: [lang === "ar" ? "العمود 1" : "Column 1", lang === "ar" ? "العمود 2" : "Column 2"], rows: [[lang === "ar" ? "خلية 1" : "Cell 1", lang === "ar" ? "خلية 2" : "Cell 2"]], caption: "" }]);
    } else if (kind === "text") {
      setBlocks([...blocks, { id: baseId, kind, text: "" }]);
    } else if (kind === "image") {
      setBlocks([...blocks, { id: baseId, kind, title: "", imageUrl: "", caption: "", isPlaceholder: true }]);
    } else {
      setBlocks([...blocks, { id: baseId, kind, title: "", text: "", imageUrl: "", caption: "" }]);
    }
  };
  const generateFromCards = () => {
    const cards = allLeavesCards;
    const gen = [{ id: `${leaf.id}-b-title`, kind: "sectionTitle", text: lang === "ar" ? leaf.ar : leaf.en }];
    cards.forEach((card) => {
      if (card.image) gen.push({ id: `${card.id}-img`, kind: "image", imageUrl: card.image, caption: "" });
      card.questions.forEach((q) => {
        const c = q[lang] || {};
        gen.push({ id: `${q.id}-b`, kind: "note", title: (TYPE_META[q.type] || {})[lang] || q.type, text: c.prompt || c.template || "" });
      });
    });
    setBlocks(gen);
  };

  const { pages, measureRef } = usePagedBlocks(blocks);
  const displayPages = pages.length > 0 ? pages : [[]];
  const { containerRef, scale, zoomIn, zoomOut, zoomFit, isFit } = useFitScale();

  const BLOCK_KINDS = [
    ["sectionTitle", t.blockSectionTitle, Heading2],
    ["text", t.blockTextKind || "Text", AlignLeft],
    ["table", t.blockTable || "Table", TableIcon],
    ["keyterm", t.blockKeyterm, Tag],
    ["note", t.blockNote, StickyNote],
    ["warning", t.blockWarning, AlertTriangle],
    ["important", t.blockImportant, AlertCircle],
    ["image", t.blockImage, ImagePlus],
    ["code", t.blockCode, Code2],
    ["pagebreak", t.blockPagebreak, CornerDownLeft],
  ];

  return (
    <div className="flex flex-col gap-3 min-w-0 w-full">
      {/* Floating 60 Palettes Modal */}
      <PlatePaletteModal
        isOpen={palettePickerOpen}
        onClose={() => setPalettePickerOpen(false)}
        selectedId={palette.id}
        onSelect={(id) => onUpdateLeaf({ pagePaletteId: id })}
        lang={lang}
        theme={theme}
        skin={skin}
        isFullBook={false}
        scopeLabel={lang === "ar" ? "الصفحة المحددة" : "This Page"}
      />

      {/* High-Definition Multi-Page PDF Exporter Modal */}
      <PdfExportModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        totalPages={pages.length}
        currentPageIndex={0}
        docTitle={`${docTitle || "EDUcraft"} - ${pageTitle || (lang === "ar" ? leaf.ar : leaf.en) || "Page"}`}
        lang={lang}
        theme={theme}
        skin={skin}
      />

      {/* RIBBON — grouped tool buttons */}
      <div className="overflow-x-auto educraft-glass shadow-xs mb-3" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}` }}>
        <div className="flex items-center gap-2 p-2 w-max min-w-full">
          <RibbonGroup label={t.pageGroup}>
            <button
              type="button"
              onClick={() => setPalettePickerOpen(true)}
              className="educraft-btn flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer shadow-2xs"
              style={{
                background: palette.PageBG,
                borderColor: theme.hairline,
                color: palette.HeaderColor,
              }}
              title="Open 60 Palettes Picker"
            >
              <div
                className="w-4 h-4 rounded-full border shadow-2xs shrink-0"
                style={{ background: palette.SectionBG, borderColor: palette.HeaderColor }}
              />
              <span className="text-xs font-bold whitespace-nowrap">{palette.en || palette.name}</span>
              <ChevronDown size={12} className="opacity-70" />
            </button>
          </RibbonGroup>

          <RibbonDivider theme={theme} />

          <RibbonGroup label={t.insertGroup}>
            {BLOCK_KINDS.map(([kind, label, Icon]) => (
              <RibbonButton key={kind} icon={Icon} label={label} theme={theme} skin={skin} onClick={() => addBlock(kind)} tone={kinds[kind]} />
            ))}
          </RibbonGroup>

          <RibbonDivider theme={theme} />

          <RibbonGroup label={t.addBlock}>
            <RibbonButton icon={Wand2} label={t.genFromCards} theme={theme} skin={skin} onClick={generateFromCards} />
          </RibbonGroup>

          <RibbonDivider theme={theme} />

          {/* Focus Mode Canvas Button */}
          <RibbonGroup label={lang === "ar" ? "العرض" : "View"}>
            <button
              type="button"
              onClick={() => setFocusMode(!focusMode)}
              className="educraft-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer shadow-2xs text-xs font-bold transition-all"
              style={{
                background: focusMode ? theme.accent : theme.surfaceSoft,
                color: focusMode ? theme.accentInk : theme.ink,
                borderColor: focusMode ? theme.accent : theme.hairline,
              }}
              title={focusMode ? (lang === "ar" ? "إظهار الشريط الجانبي" : "Show Sidebar") : (lang === "ar" ? "وضع الصفحة الكاملة المباشر" : "Direct Full-Page Focus Canvas")}
            >
              {focusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>
                {focusMode
                  ? (lang === "ar" ? "إظهار الشريط الجانبي" : "Show Sidebar")
                  : (lang === "ar" ? "صفحة كاملة (Focus)" : "Focus Canvas")}
              </span>
            </button>
          </RibbonGroup>

          <RibbonDivider theme={theme} />

          {/* Export / Print RibbonGroup */}
          <RibbonGroup label={lang === "ar" ? "تصدير وطباعة" : "Export & Print"}>
            <button
              type="button"
              onClick={() => setPdfModalOpen(true)}
              className="educraft-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer shadow-2xs text-xs font-black transition-all hover:scale-[1.02] hover:brightness-105"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                color: "#ffffff",
                borderColor: "#dc2626",
              }}
              title={lang === "ar" ? "تصدير الصفحة إلى PDF بدقة حتى 1200 DPI" : "Export page to PDF up to 1200 DPI"}
            >
              <FileDown size={14} />
              <span>{lang === "ar" ? "تصدير PDF (حتى 1200 DPI)" : "Export PDF (1200 DPI)"}</span>
            </button>
          </RibbonGroup>
        </div>
      </div>

      <div className={`grid ${focusMode ? "grid-cols-1" : "xl:grid-cols-[minmax(0,1fr)_260px] 2xl:grid-cols-[minmax(0,1fr)_280px] grid-cols-1"} gap-4 items-start min-w-0 w-full`}>
        {/* CANVAS */}
        <div className="order-1 min-w-0">
          <ZoomBar t={t} theme={theme} skin={skin} scale={scale} onZoomOut={zoomOut} onZoomIn={zoomIn} onFit={zoomFit} isFit={isFit} />

          {/* hidden measuring pass enclosed in zero-size clipped container */}
          <div style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, overflow: "hidden", visibility: "hidden", pointerEvents: "none", zIndex: -9999 }}>
            <div ref={measureRef} style={{ width: "182mm", fontFamily: PAGE_FONT, fontSize: 15, lineHeight: 1.9 }}>
              {blocks.map((b, i) => (
                <PlateBlock key={b.id || i} block={b} kinds={kinds} theme={theme} skin={skin} />
              ))}
            </div>
          </div>

          <div ref={containerRef} className="overflow-x-auto overflow-y-visible flex justify-center py-2">
            <div style={{ zoom: scale, transition: "zoom 0.22s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <div className="flex flex-col gap-6 items-center py-2">
                {displayPages.map((pageBlocks, pi) => (
                  <div
                    key={pi}
                    dir="rtl"
                    className="educraft-paper-sheet"
                    style={{ width: "210mm", minHeight: "297mm", background: palette.PageBG, color: palette.BodyText, padding: "16mm 14mm", borderRadius: 6, fontFamily: PAGE_FONT, fontSize: 15, lineHeight: 1.9 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "0.6rem",
                        marginBottom: pi === 0 ? "0.6rem" : "1rem",
                        borderBottom: `2px solid ${palette.HeaderColor}`,
                        color: palette.HeaderColor,
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      <span>{docTitle}</span>
                      <span>{pageTitle}</span>
                    </div>

                    {pi === 0 && (
                      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: palette.HeaderColor }}>{docTitle}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: palette.SectionBG, marginTop: 4 }}>{pageTitle}</div>
                        <hr style={{ border: "none", borderTop: `1.4pt solid ${palette.SectionFrame}`, width: "50%", margin: "0.8rem auto" }} />
                      </div>
                    )}

                    {pageBlocks.map((b, i) => {
                      const origIdx = blocks.findIndex((x) => x.id === b.id);
                      const blockIndex = origIdx !== -1 ? origIdx : i;
                      return (
                        <CanvasBlockWrapper
                          key={b.id || i}
                          block={b}
                          kinds={kinds}
                          palette={palette}
                          theme={theme}
                          skin={skin}
                          lang={lang}
                          bookId={bookId}
                          onUpdate={(patch) => updateBlock(blockIndex, patch)}
                          onDelete={() => deleteBlock(blockIndex)}
                          onMove={(dir) => moveBlock(blockIndex, dir)()}
                          onInsertBelow={(newKind) => {
                            const baseId = `${leaf.id}-b-${Date.now()}`;
                            let newBlock;
                            if (newKind === "table") {
                              newBlock = {
                                id: baseId,
                                kind: newKind,
                                title: "",
                                headers: [lang === "ar" ? "العمود 1" : "Column 1", lang === "ar" ? "العمود 2" : "Column 2"],
                                rows: [[lang === "ar" ? "خلية 1" : "Cell 1", lang === "ar" ? "خلية 2" : "Cell 2"]],
                                caption: "",
                              };
                            } else if (newKind === "text") {
                              newBlock = { id: baseId, kind: newKind, text: "" };
                            } else if (newKind === "image") {
                              newBlock = { id: baseId, kind: newKind, title: "", imageUrl: "", caption: "", isPlaceholder: true };
                            } else {
                              newBlock = { id: baseId, kind: newKind, title: "", text: "", imageUrl: "", caption: "" };
                            }
                            const next = [...blocks];
                            next.splice(blockIndex + 1, 0, newBlock);
                            setBlocks(next);
                          }}
                        />
                      );
                    })}

                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={() => addBlock("text")}
                        className="educraft-btn flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-xl border border-dashed hover:border-solid cursor-pointer shadow-2xs opacity-70 hover:opacity-100 transition-all"
                        style={{ background: `${palette.HeaderColor}0d`, borderColor: palette.HeaderColor, color: palette.HeaderColor }}
                      >
                        <Plus size={12} />
                        <span>{lang === "ar" ? "إضافة عنصر جديد لأسفل هذه الصفحة" : "+ Add Block to Page"}</span>
                      </button>
                    </div>

                    <p style={{ position: "relative", top: "8mm", textAlign: "center", fontSize: 10, color: "#b3a692" }}>{t.pageOf(pi + 1, displayPages.length)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TASK PANE (hidden when in Focus Mode) */}
        {!focusMode && (
          <div className="order-2 p-3 min-w-0 w-full" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}`, background: theme.surface, alignSelf: "start" }}>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: theme.inkSoft }}>
              {t.addBlock}
            </p>
            <div className="max-h-[40vh] xl:max-h-[70vh] overflow-y-auto">
              {blocks.map((b, i) => (
                <BlockRow
                  key={b.id || i}
                  block={b}
                  t={t}
                  theme={theme}
                  skin={skin}
                  kinds={kinds}
                  bookId={bookId}
                  onUpdate={(p) => updateBlock(i, p)}
                  onDelete={() => deleteBlock(i)}
                  onMove={(dir) => moveBlock(i, dir)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* "0, 1, 2…" style ordering by the leading number in the filename,
   falling back to plain alphabetical. */
function naturalNameSort(a, b) {
  const na = a.match(/\d+/);
  const nb = b.match(/\d+/);
  if (na && nb) {
    const diff = parseInt(na[0], 10) - parseInt(nb[0], 10);
    if (diff !== 0) return diff;
  }
  return a.localeCompare(b);
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg)$/i;

/* Applies a manifest.json (found inside a selected folder, alongside
   its images) onto the given book: each item says which image goes
   to which branch/leaf/card/question, an optional info note, and
   optional cross-links to other leaves — including in other
   branches. Unmatched leaf ids are skipped (reported to the caller). */
function applyImageManifest(book, manifest, dataMap) {
  let nodes = book.nodes.map((n) => ({ ...n }));
  const skipped = [];
  (manifest.items || []).forEach((item) => {
    const leafIdx = nodes.findIndex((n) => n.id === item.leafId && n.level === "leaf");
    if (leafIdx === -1) {
      skipped.push(item.leafId);
      return;
    }
    const leaf = { ...nodes[leafIdx] };
    let cards = (leaf.cards || leafCards(leaf)).map((c) => ({ ...c, questions: [...c.questions] }));
    const imageData = item.image ? dataMap[item.image] : null;
    let cardIdx = item.cardId ? cards.findIndex((c) => c.id === item.cardId) : -1;
    let card;
    if (cardIdx === -1) {
      card = { id: item.cardId || `${leaf.id}-card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, image: imageData || null, imagePosition: "top", questions: [], note: item.info || "" };
      cards = [...cards, card];
      cardIdx = cards.length - 1;
    } else {
      card = { ...cards[cardIdx] };
      if (imageData) card.image = imageData;
      if (item.info) card.note = item.info;
    }
    const extraLinks = (item.linkedTo || [])
      .map((l) => (typeof l === "string" ? l : l.leafId ? (l.blockId ? { leafId: l.leafId, blockId: l.blockId } : l.leafId) : null))
      .filter(Boolean);
    if (item.questionId) {
      const qIdx = card.questions.findIndex((q) => q.id === item.questionId);
      if (qIdx !== -1 && extraLinks.length) {
        const q = { ...card.questions[qIdx] };
        q.linkedTo = Array.from(new Map([...(q.linkedTo || []), ...extraLinks].map((l) => [linkKey(l), l])).values());
        card.questions = card.questions.map((qq, i) => (i === qIdx ? q : qq));
      }
    } else if (extraLinks.length) {
      card.cardLinkedTo = Array.from(new Map([...(card.cardLinkedTo || []), ...extraLinks].map((l) => [linkKey(l), l])).values());
    }
    cards[cardIdx] = card;
    leaf.cards = cards;
    leaf.questions = cards.flatMap((c) => c.questions);
    nodes[leafIdx] = leaf;
  });
  return { book: { ...book, nodes }, skipped };
}

/* Right-side capsule ribbon — "Files" group is real (export/import
   the current book as JSON); the rest are quick shortcuts into the
   card being edited. */
function EditorRibbon({ book, lang, theme, t, onImportBook, addCard, addQuestionOfType, voiceEnabled, onVoiceEnabledChange, onImportOrderedImages, onImportManifestFolder, importStatus }) {
  const fileRef = useRef(null);
  const orderedImagesRef = useRef(null);
  const manifestFolderRef = useRef(null);
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        onImportBook(parsed);
      } catch (err) {}
    };
    reader.readAsText(f);
    e.target.value = "";
  };
  const groupStyle = { background: theme.surface, borderRadius: 18, border: `1px solid ${theme.hairlineStrong}`, padding: 12 };
  return (
    <div className="flex flex-col gap-3 w-full md:w-[220px] shrink-0">
      {/* Files & Export Panel */}
      <div style={groupStyle} className="shadow-xs">
        <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b" style={{ borderColor: theme.hairline }}>
          <FolderOpen size={13} style={{ color: theme.accent }} />
          <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: theme.ink }}>
            {t.files}
          </span>
        </div>
        <div className="flex gap-1.5 mb-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="educraft-btn flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-xl border cursor-pointer shadow-2xs hover:bg-black/5"
            style={{ background: theme.surfaceSoft, borderColor: theme.hairlineStrong, color: theme.ink }}
            title={t.importBookJson}
          >
            <FileUp size={13} style={{ color: theme.accent }} />
            <span>{lang === "ar" ? "استيراد" : "Import"}</span>
          </button>
          <button
            type="button"
            onClick={() => downloadJSON(`${book.id}.json`, book)}
            className="educraft-btn flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-xl border cursor-pointer shadow-2xs hover:bg-black/5"
            style={{ background: theme.surfaceSoft, borderColor: theme.hairlineStrong, color: theme.ink }}
            title={t.exportBookJson}
          >
            <FileDown size={13} style={{ color: theme.accent }} />
            <span>{lang === "ar" ? "تصدير" : "Export"}</span>
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onFile} className="hidden" />
        </div>
        <button
          type="button"
          onClick={() => orderedImagesRef.current?.click()}
          className="educraft-btn w-full flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 mb-1.5 rounded-xl border cursor-pointer shadow-2xs hover:bg-black/5"
          style={{ background: theme.surfaceSoft, borderColor: theme.hairlineStrong, color: theme.ink }}
          title={t.importOrderedImages}
        >
          <ImagePlus size={13} style={{ color: theme.accent }} />
          <span>{lang === "ar" ? "صور مرقمة 0·1·2" : "Numbered Images"}</span>
        </button>
        <input
          ref={orderedImagesRef}
          type="file"
          accept="image/*"
          multiple
          webkitdirectory=""
          directory=""
          onChange={(e) => {
            onImportOrderedImages(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => manifestFolderRef.current?.click()}
          className="educraft-btn w-full flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-xl border cursor-pointer shadow-2xs hover:bg-black/5"
          style={{ background: theme.surfaceSoft, borderColor: theme.hairlineStrong, color: theme.ink }}
          title={t.importManifestFolder}
        >
          <FolderOpen size={13} style={{ color: theme.accent }} />
          <span>{lang === "ar" ? "مجلد مانيفست" : "Manifest Folder"}</span>
        </button>
        <input
          ref={manifestFolderRef}
          type="file"
          multiple
          webkitdirectory=""
          directory=""
          onChange={(e) => {
            onImportManifestFolder(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
        {importStatus && (
          <p className="text-[10px] mt-2 p-2 rounded-xl font-bold text-center border" style={{ background: importStatus.ok ? `${theme.accent}15` : "#C0392B15", color: importStatus.ok ? theme.accent : "#C0392B", borderColor: importStatus.ok ? `${theme.accent}33` : "#C0392B33" }}>
            {importStatus.text}
          </p>
        )}
      </div>

      {/* Card Actions */}
      <div style={groupStyle} className="shadow-xs">
        <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b" style={{ borderColor: theme.hairline }}>
          <LayoutGrid size={13} style={{ color: theme.accent }} />
          <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: theme.ink }}>
            {t.card}
          </span>
        </div>
        <button
          type="button"
          onClick={addCard}
          className="educraft-btn w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl cursor-pointer shadow-sm border transition-transform"
          style={{ background: theme.accent, color: theme.accentInk, borderColor: theme.accent }}
        >
          <Plus size={15} />
          <span>{t.newCard}</span>
        </button>
      </div>

      {/* Questions Palette with Readable Labels */}
      <div style={groupStyle} className="shadow-2xs">
        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b" style={{ borderColor: theme.hairline }}>
          <PlusCircle size={12} style={{ color: theme.accent }} />
          <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.ink }}>
            {t.addQuestion}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-1.5 max-h-60 overflow-y-auto pe-0.5 custom-scrollbar">
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              onClick={() => addQuestionOfType(key)}
              className="educraft-btn text-start flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer border transition-all group"
              style={{
                background: theme.surfaceSoft,
                borderColor: theme.hairline,
                color: theme.ink,
              }}
              title={lang === "ar" ? meta.ar : meta.en}
            >
              <div
                className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105"
                style={{ background: meta.color.bg, color: meta.color.ink }}
              >
                <meta.Icon size={11} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-semibold truncate tracking-tight">
                {lang === "ar" ? meta.ar : meta.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice / TTS Toggle */}
      <div style={groupStyle} className="shadow-2xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(e) => onVoiceEnabledChange(e.target.checked)}
            className="cursor-pointer"
          />
          <Volume2 size={13} style={{ color: theme.accent }} />
          <span className="text-[10px] font-bold" style={{ color: theme.ink }}>
            {t.voiceFeature}
          </span>
        </label>
      </div>
    </div>
  );
}

function EditorBreadcrumb({ book, lang, leaf, card, theme, onBackToTree }) {
  const branch = leaf && book?.nodes ? book.nodes.find((n) => n.id === leaf.parent || n.id === book.nodes.find((s) => s.id === leaf.parent)?.parent) : null;
  const bookTitle = (lang === "ar" ? book?.ar?.title : book?.en?.title) || book?.en?.title || book?.ar?.title || "";
  const branchTitle = branch ? (lang === "ar" ? branch.ar : branch.en) : "";
  const leafTitle = leaf ? (lang === "ar" ? leaf.ar : leaf.en) : "";

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold flex-wrap">
      <button
        type="button"
        onClick={onBackToTree}
        className="educraft-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer transition-all hover:shadow-sm"
        style={{ background: theme.surface, borderColor: theme.hairlineStrong, color: theme.ink }}
        title={lang === "ar" ? "عرض شجرة المعرفة" : "View knowledge tree"}
      >
        <BookOpen size={13} style={{ color: theme.accent }} />
        <span className="font-bold">{bookTitle}</span>
      </button>

      {branchTitle && (
        <>
          <ChevronRight size={12} className="opacity-40" />
          <span
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
            style={{ color: theme.inkSoft }}
          >
            <GitBranch size={12} className="opacity-70" />
            <span>{branchTitle}</span>
          </span>
        </>
      )}

      {leafTitle && (
        <>
          <ChevronRight size={12} className="opacity-40" />
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold text-xs"
            style={{ background: theme.accentSoft, color: theme.accent, border: `1px solid ${theme.accent}33` }}
          >
            <FileText size={12} />
            <span className="max-w-[240px] truncate">{leafTitle}</span>
          </span>
        </>
      )}
    </div>
  );
}

function EditorView({ book, lang, theme, skin, voiceEnabled, onVoiceEnabledChange, onUpdateBook, onChangeBookFlavor, bookFlavorId, onBackToTree }) {
  const t = EDITOR_STR[lang];
  const [tab, setTab] = useState("cards");
  const [selectedLeafId, setSelectedLeafId] = useState(
    () => (book?.nodes || []).find((n) => n.level === "leaf")?.id || null,
  );
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [previewWholeBook, setPreviewWholeBook] = useState(false);

  const allLeaves = useMemo(() => (book?.nodes || []).filter((n) => n.level === "leaf"), [book]);
  const leaf = allLeaves.find((l) => l.id === selectedLeafId) || null;
  const cards = leaf ? leafCards(leaf) : [];
  const card = cards[selectedCardIdx];

  useEffect(() => {
    if (!selectedLeafId && allLeaves.length > 0) {
      setSelectedLeafId(allLeaves[0].id);
    }
  }, [allLeaves, selectedLeafId]);

  const handleAddBranch = (titleOverride) => {
    const raw = typeof titleOverride === "string" ? titleOverride.trim() : null;
    const title = raw || (typeof window !== "undefined" ? window.prompt(lang === "ar" ? "أدخل عنوان الفرع الجديد:" : "Enter new branch title:") : "")?.trim();
    if (!title) return;
    const branchId = `branch-${Date.now()}`;
    const newBranch = {
      id: branchId,
      level: "branch",
      parent: null,
      en: title,
      ar: title,
    };
    onUpdateBook((prev) => ({ ...prev, nodes: [...(prev?.nodes || []), newBranch] }));
  };

  const handleAddLeaf = (parentId, titleOverride) => {
    const raw = typeof titleOverride === "string" ? titleOverride.trim() : null;
    const title = raw || (typeof window !== "undefined" ? window.prompt(lang === "ar" ? "أدخل عنوان الورقة الجديدة:" : "Enter new leaf title:") : "")?.trim();
    if (!title) return;
    const newLeafId = `leaf-${Date.now().toString(36)}`;
    const newLeaf = {
      id: newLeafId,
      level: "leaf",
      parent: parentId,
      en: title,
      ar: title,
      cards: [{ id: `card-${newLeafId}-0`, image: null, imagePosition: "top", questions: [] }],
      questions: [],
    };
    onUpdateBook((prev) => ({ ...prev, nodes: [...(prev?.nodes || []), newLeaf] }));
    setSelectedLeafId(newLeafId);
    setSelectedCardIdx(0);
  };

  // reverse index: who links to the selected leaf, from anywhere in
  // the book — a question, a whole card, or one specific A4 plate.
  const incomingLinks = useMemo(() => {
    if (!selectedLeafId) return [];
    const hits = [];
    allLeaves.forEach((srcLeaf) => {
      leafCards(srcLeaf).forEach((c) => {
        const allLinks = [...(c.cardLinkedTo || []), ...c.questions.flatMap((q) => q.linkedTo || [])];
        allLinks.forEach((link) => {
          if (linkLeafId(link) === selectedLeafId) hits.push({ srcLeaf, blockId: linkBlockId(link) });
        });
      });
    });
    const seen = new Set();
    return hits.filter((h) => {
      const k = h.srcLeaf.id + "::" + (h.blockId || "");
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [allLeaves, selectedLeafId]);

  const patchLeaf = (patchFn) => {
    onUpdateBook((prev) => {
      const base = prev || book;
      return {
        ...base,
        nodes: (base?.nodes || []).map((n) => (n.id === selectedLeafId ? patchFn(n) : n)),
      };
    });
  };
  const setCards = (nextCards) => patchLeaf((n) => ({ ...n, cards: nextCards, questions: nextCards.flatMap((c) => c.questions) }));
  const updateCard = (idx, patch) => setCards(cards.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  const deleteCard = (idx) => {
    setCards(cards.filter((_, i) => i !== idx));
    setSelectedCardIdx(0);
  };
  const addCard = () => {
    const nextCards = [...cards, { id: `${selectedLeafId}-card-${Date.now()}`, image: null, imagePosition: "top", video: null, audio: null, questions: [] }];
    setCards(nextCards);
    setSelectedCardIdx(nextCards.length - 1);
  };

  const addQuestionOfTypeToActiveCard = (type) => {
    if (!card) return;
    const base = { id: `${card.id}-${Date.now()}`, type, subject: "", difficulty: "Beginner", tier: "core", dir: "ltr", en: { prompt: "" }, ar: { prompt: "" } };
    updateCard(selectedCardIdx, { questions: [...card.questions, base] });
  };
  const importBook = (parsedBook) => onUpdateBook(() => parsedBook);

  const [importStatus, setImportStatus] = useState(null);

  const importOrderedImages = async (fileList) => {
    if (!leaf) return;
    const files = Array.from(fileList).filter((f) => IMAGE_EXT_RE.test(f.name));
    files.sort((a, b) => naturalNameSort(a.name, b.name));
    const dataUrls = await Promise.all(files.map(fileToDataURL));
    const nextCards = [...cards];
    dataUrls.forEach((url, i) => {
      if (nextCards[i]) nextCards[i] = { ...nextCards[i], image: url };
      else nextCards.push({ id: `${selectedLeafId}-card-${Date.now()}-${i}`, image: url, imagePosition: "top", questions: [] });
    });
    setCards(nextCards);
    setImportStatus({ ok: true, text: t.importDone(dataUrls.length) });
  };

  const importManifestFolder = async (fileList) => {
    const files = Array.from(fileList);
    const manifestFile = files.find((f) => /manifest.*\.json$/i.test(f.name) || /\.json$/i.test(f.name));
    if (!manifestFile) {
      setImportStatus({ ok: false, text: t.importNoManifest });
      return;
    }
    const manifest = JSON.parse(await manifestFile.text());
    const imageFiles = files.filter((f) => IMAGE_EXT_RE.test(f.name));
    const dataMap = {};
    for (const f of imageFiles) dataMap[f.name] = await fileToDataURL(f);
    const { book: nextBook, skipped } = applyImageManifest(book, manifest, dataMap);
    onUpdateBook(() => nextBook);
    const count = (manifest.items || []).length - skipped.length;
    setImportStatus({ ok: skipped.length === 0, text: skipped.length ? `${t.importDone(count)} ${t.importSkipped(skipped.length)}` : t.importDone(count) });
  };

  return (
    <div
      className="educraft-panel-in"
      style={{
        background: `linear-gradient(180deg, ${theme.accentSoft} 0%, ${theme.canvas} 55%)`,
        borderRadius: 20,
        padding: 16,
        border: `1px solid ${theme.hairline}`,
      }}
    >
      {/* Apple-grade Frosted Glass Top Navigation Header */}
      <div
        className="flex items-center justify-between flex-wrap gap-3 mb-5 p-2 rounded-2xl educraft-glass shadow-xs"
        style={{ borderColor: theme.hairline }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <EditorBreadcrumb book={book} lang={lang} leaf={leaf} card={card} theme={theme} onBackToTree={onBackToTree} />
          {onChangeBookFlavor && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border shadow-2xs" style={{ background: theme.surface, borderColor: theme.hairline }}>
              <Palette size={12} style={{ color: theme.inkSoft }} />
              <div className="flex items-center gap-1">
                {Object.entries(FLAVORS).map(([fid, f]) => {
                  const pal = f[theme === FLAVORS[fid]?.dark ? "dark" : "light"] || f.light;
                  const isSelected = (bookFlavorId || book.flavorId) === fid;
                  return (
                    <button
                      key={fid}
                      type="button"
                      onClick={() => onChangeBookFlavor(fid)}
                      className="educraft-btn relative p-0.5 rounded-full cursor-pointer transition-transform"
                      style={{
                        transform: isSelected ? "scale(1.15)" : "scale(1)",
                        boxShadow: isSelected ? `0 0 0 1.5px ${theme.accent}` : "none",
                      }}
                      title={f[lang] || fid}
                    >
                      <div className="w-3.5 h-3.5 rounded-full flex overflow-hidden shadow-2xs" style={{ border: `1px solid ${pal.hairlineStrong}` }}>
                        <div className="w-1/2 h-full" style={{ background: pal.accent }} />
                        <div className="w-1/2 h-full" style={{ background: pal.canvas }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Apple/macOS Segmented Tab Switcher */}
        <div
          className="flex items-center p-1 rounded-xl border shadow-inner"
          style={{ background: theme.surfaceSoft, borderColor: theme.hairline }}
        >
          {[
            ["cards", t.tabCards, LayoutGrid],
            ["pages", t.tabPages, FileText],
            ["all_pages", lang === "ar" ? "كل صفحات الكتاب" : "All Book Pages", Library],
          ].map(([id, label, Icon]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className="educraft-btn flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                style={{
                  background: active ? theme.surface : "transparent",
                  color: active ? theme.accent : theme.inkSoft,
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" : "none",
                  border: active ? `1px solid ${theme.hairlineStrong}` : "1px solid transparent",
                }}
              >
                <Icon size={13} style={{ color: active ? theme.accent : theme.inkSoft }} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-4 min-w-0 items-start">
        <div className="p-3 shrink-0" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}`, background: theme.surface, alignSelf: "start" }}>
          <EditorLeafNav
            book={book}
            lang={lang}
            theme={theme}
            skin={skin}
            selectedLeafId={selectedLeafId}
            onSelect={(id) => {
              setSelectedLeafId(id);
              setSelectedCardIdx(0);
            }}
            onAddBranch={handleAddBranch}
            onAddLeaf={handleAddLeaf}
          />
        </div>

        <div className="min-w-0 w-full">
          {!previewWholeBook && !leaf ? (
            <div className="p-8 text-center rounded-2xl border flex flex-col items-center justify-center gap-3 my-4" style={{ background: theme.surface, borderColor: theme.hairline }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: theme.accentSoft, color: theme.accent }}>
                <GitBranch size={24} />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.ink }}>
                {lang === "ar" ? "لم يتم تحديد أي ورقة" : "No leaf selected"}
              </h3>
              <p className="text-xs max-w-sm" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
                {(book?.nodes || []).length === 0
                  ? (lang === "ar" ? "هذا الكتاب فارغ تماماً من الفروع. ابدأ بإضافة فرعك الأول لبناء شجرة المعرفة." : "This book has no branches yet. Add your first branch to start building the knowledge tree.")
                  : (lang === "ar" ? "اختر ورقة من القائمة الجانبية لتعديلها، أو اضغط على '+ ورقة' لإضافة ورقة جديدة." : "Select a leaf from the outline on the left, or click '+ Leaf' to add a new leaf.")}
              </p>
              {(book?.nodes || []).length === 0 && (
                <button
                  type="button"
                  onClick={() => handleAddBranch()}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 shadow-sm transition-all hover:scale-105 cursor-pointer"
                  style={{ borderRadius: skin.radiusSm, background: theme.accent, color: theme.accentInk }}
                >
                  <Plus size={14} />
                  {lang === "ar" ? "إضافة أول فرع للكتاب" : "Add First Branch"}
                </button>
              )}
            </div>
          ) : (
            !previewWholeBook && (
              <>
                {incomingLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[11px] font-bold" style={{ color: theme.inkSoft }}>
                      {t.incomingLinks}
                    </span>
                    {incomingLinks.map(({ srcLeaf, blockId }, i) => {
                      const blockLabel = blockId ? linkBlockLabel(srcLeaf, blockId, t) : null;
                      return (
                        <button
                          key={srcLeaf.id + "::" + (blockId || "") + i}
                          onClick={() => {
                            setSelectedLeafId(srcLeaf.id);
                            setSelectedCardIdx(0);
                          }}
                          className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1"
                          style={{ borderRadius: 999, background: theme.surface, border: `1.5px dashed ${theme.accent}`, color: theme.accent }}
                        >
                          <GitBranch size={11} />
                          {lang === "ar" ? srcLeaf.ar : srcLeaf.en}
                          {blockLabel && <span style={{ opacity: 0.8 }}>› {blockLabel}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )
          )}

          {tab === "all_pages" ? (
            <div className="flex-1 min-w-0">
              <FullBookA4Preview
                book={book}
                lang={lang}
                t={t}
                theme={theme}
                skin={skin}
                docTitle={lang === "ar" ? book.ar?.title : book.en?.title}
                bookId={book.id}
                onUpdateBook={onUpdateBook}
                onUpdateLeaf={(targetId, patch) => {
                  onUpdateBook((prev) => {
                    const base = prev || book;
                    return {
                      ...base,
                      nodes: (base?.nodes || []).map((n) => (n.id === targetId ? { ...n, ...patch } : n)),
                    };
                  });
                }}
              />
            </div>
          ) : tab === "pages" ? (
            <>
              {!leaf ? (
                <p className="text-sm" style={{ color: theme.inkSoft }}>
                  {t.noLeaf}
                </p>
              ) : (
                <A4PageBuilder
                  leaf={leaf}
                  lang={lang}
                  theme={theme}
                  skin={skin}
                  t={t}
                  bookId={book.id}
                  onUpdateLeaf={(patch) => patchLeaf((n) => ({ ...n, ...patch }))}
                  allLeavesCards={cards}
                  docTitle={lang === "ar" ? book.ar?.title : book.en?.title}
                  pageTitle={lang === "ar" ? leaf.ar : leaf.en}
                />
              )}
            </>
          ) : (
            leaf && (
              <div className="flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center gap-1.5 p-1 rounded-2xl border shadow-inner mb-4 overflow-x-auto"
                    style={{ background: theme.surfaceSoft, borderColor: theme.hairline }}
                  >
                    {cards.map((c, i) => {
                      const active = selectedCardIdx === i;
                      return (
                        <button
                          key={c.id || i}
                          type="button"
                          onClick={() => setSelectedCardIdx(i)}
                          className="educraft-btn text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer transition-all shrink-0"
                          style={{
                            background: active ? theme.surface : "transparent",
                            color: active ? theme.accent : theme.inkSoft,
                            boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" : "none",
                            border: active ? `1px solid ${theme.hairlineStrong}` : "1px solid transparent",
                          }}
                        >
                          {t.card} {i + 1}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={addCard}
                      className="educraft-btn text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all shrink-0 flex items-center gap-1 opacity-70 hover:opacity-100"
                      style={{ color: theme.accent }}
                      title={t.newCard}
                    >
                      <Plus size={13} />
                      <span>{t.newCard}</span>
                    </button>
                  </div>

                  {card && (
                    <CardEditor
                      card={card}
                      lang={lang}
                      theme={theme}
                      skin={skin}
                      t={t}
                      voiceEnabled={voiceEnabled}
                      allLeaves={allLeaves}
                      currentLeafId={selectedLeafId}
                      onUpdateCard={(patch) => updateCard(selectedCardIdx, patch)}
                      onDeleteCard={() => deleteCard(selectedCardIdx)}
                    />
                  )}
                </div>

                <EditorRibbon
                  book={book}
                  lang={lang}
                  theme={theme}
                  t={t}
                  onImportBook={importBook}
                  addCard={addCard}
                  addQuestionOfType={addQuestionOfTypeToActiveCard}
                  voiceEnabled={voiceEnabled}
                  onVoiceEnabledChange={onVoiceEnabledChange}
                  onImportOrderedImages={importOrderedImages}
                  onImportManifestFolder={importManifestFolder}
                  importStatus={importStatus}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   Page
================================================================== */
/* =================================================================
   PlannerView — per-book to-do list + calendar + pace dashboard.
   Set a finish date (and how much of the book), and this works out
   the daily pace, tracks a streak, and shows an ahead/on-track/
   behind status by comparing actual progress to the ideal pace.
================================================================== */
function PlannerView({ book, lang, ui, theme, dir, skin, plan, onUpdatePlan }) {
  const leaves = useMemo(() => book.nodes.filter((n) => n.level === "leaf"), [book]);
  const totalLeaves = leaves.length;
  const validIds = useMemo(() => new Set(leaves.map((l) => l.id)), [leaves]);
  const doneSet = useMemo(() => new Set((plan.doneLeafIds || []).filter((id) => validIds.has(id))), [plan.doneLeafIds, validIds]);
  const doneCount = doneSet.size;

  const today = new Date();
  const todayStr = toDateStr(today);
  const hasGoal = !!plan.targetDate;
  const locale = lang === "ar" ? "ar-EG" : "en-US";

  const [editingGoal, setEditingGoal] = useState(!hasGoal);
  const [draftDate, setDraftDate] = useState(plan.targetDate || "");
  const [draftCount, setDraftCount] = useState(plan.targetCount || totalLeaves || 1);

  const targetCount = Math.max(1, Math.min(totalLeaves || 1, plan.targetCount || totalLeaves || 1));
  const remaining = Math.max(0, targetCount - doneCount);
  const totalDaysPlan = hasGoal ? Math.max(1, daysBetweenStr(plan.startDate || todayStr, plan.targetDate)) : null;
  const elapsedDays = plan.startDate ? Math.max(1, daysBetweenStr(plan.startDate, todayStr) + 1) : 1;
  const daysLeft = hasGoal ? Math.max(0, daysBetweenStr(todayStr, plan.targetDate)) : null;
  const idealPerDay = hasGoal ? targetCount / totalDaysPlan : null;
  const expectedByToday = hasGoal ? Math.min(targetCount, idealPerDay * elapsedDays) : null;
  const actualPerDay = doneCount / elapsedDays;
  const requiredPerDayNow = hasGoal ? (daysLeft > 0 ? remaining / daysLeft : remaining) : null;

  let status = "no-goal";
  if (hasGoal) {
    if (remaining === 0) status = "done";
    else {
      const diff = doneCount - expectedByToday;
      if (diff >= 0.5) status = "ahead";
      else if (diff <= -0.5) status = "behind";
      else status = "on-track";
    }
  }
  const statusMeta = {
    "no-goal": { label: ui.plannerStatusNoGoal, bg: theme.surfaceSoft, ink: theme.inkSoft, Icon: Target },
    ahead: { label: ui.plannerStatusAhead, bg: CORRECT.bg, ink: CORRECT.border, Icon: TrendingUp },
    "on-track": { label: ui.plannerStatusOnTrack, bg: theme.accentSoft, ink: theme.ink, Icon: Minus },
    behind: { label: ui.plannerStatusBehind, bg: INCORRECT.bg, ink: INCORRECT.border, Icon: TrendingDown },
    done: { label: ui.plannerStatusDone, bg: CORRECT.bg, ink: CORRECT.border, Icon: Trophy },
  }[status];

  const streak = useMemo(() => {
    const log = plan.log || {};
    let s = 0;
    let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!log[toDateStr(cursor)]) cursor.setDate(cursor.getDate() - 1);
    while ((log[toDateStr(cursor)] || 0) > 0) {
      s++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.log]);

  const pctComplete = totalLeaves ? Math.round((doneCount / totalLeaves) * 100) : 0;

  const toggleLeaf = (leafId) => {
    onUpdatePlan((p) => {
      const donePrev = p.doneLeafIds || [];
      const logPrev = p.log || {};
      const isDone = donePrev.includes(leafId);
      const nextIds = isDone ? donePrev.filter((id) => id !== leafId) : [...donePrev, leafId];
      const nextLog = { ...logPrev, [todayStr]: Math.max(0, (logPrev[todayStr] || 0) + (isDone ? -1 : 1)) };
      return { ...p, doneLeafIds: nextIds, log: nextLog };
    });
  };
  const saveGoal = () => {
    if (!draftDate) return;
    onUpdatePlan((p) => ({
      ...p,
      targetDate: draftDate,
      targetCount: Math.max(1, Math.min(totalLeaves || 1, Number(draftCount) || totalLeaves || 1)),
      startDate: p.startDate || todayStr,
    }));
    setEditingGoal(false);
  };
  const clearGoal = () => {
    onUpdatePlan((p) => ({ ...p, targetDate: null, targetCount: null, startDate: null }));
    setDraftDate("");
    setEditingGoal(true);
  };

  const groups = useMemo(() => {
    const branchOf = (leaf) => {
      const sub = book.nodes.find((n) => n.id === leaf.parent);
      const branch = sub ? book.nodes.find((n) => n.id === sub.parent) : null;
      return branch || sub || leaf;
    };
    const map = new Map();
    leaves.forEach((leaf) => {
      const b = branchOf(leaf);
      if (!map.has(b.id)) map.set(b.id, { branch: b, leaves: [] });
      map.get(b.id).leaves.push(leaf);
    });
    return Array.from(map.values());
  }, [leaves, book]);

  const [calCursor, setCalCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const monthMatrix = useMemo(() => buildMonthMatrix(calCursor), [calCursor]);
  const weekdayLabels = useMemo(() => {
    const ref = new Date(2023, 0, 1); // a Sunday
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(ref);
      d.setDate(ref.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: "narrow" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const inputStyle = {
    borderRadius: skin.radiusSm === 9999 ? 10 : skin.radiusSm,
    border: `1.5px solid ${skinBorderColor(skin, theme)}`,
    background: theme.surface,
    color: theme.ink,
  };

  const tile = (label, value, sub, Icon) => (
    <div className="flex flex-col gap-1.5 p-4" style={panelStyle(skin, theme, { soft: true })}>
      <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider" style={{ color: theme.inkSoft }}>
        <Icon size={12} />
        {label}
      </div>
      <span className="text-2xl font-black" style={{ color: theme.ink, fontFamily: ui.displayFont }}>
        {value}
      </span>
      {sub && (
        <span className="text-[11px] font-semibold" style={{ color: theme.inkSoft }}>
          {sub}
        </span>
      )}
    </div>
  );

  return (
    <section>
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: ui.displayFont, color: theme.ink }}>
        {ui.plannerTitle}
      </h1>
      <p className="text-sm mb-6" style={{ color: theme.inkSoft }}>
        {ui.plannerSub} — {book[lang].title}
      </p>

      {/* goal panel */}
      <div className="p-5 mb-5" style={panelStyle(skin, theme)}>
        {editingGoal ? (
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide mb-1" style={{ color: theme.ink }}>
              {hasGoal ? ui.plannerEditGoal : ui.plannerNoGoalTitle}
            </h3>
            {!hasGoal && (
              <p className="text-xs mb-4 max-w-md" style={{ color: theme.inkSoft }}>
                {ui.plannerNoGoalSub}
              </p>
            )}
            <div className="flex flex-wrap items-end gap-4 mt-3">
              <label className="flex flex-col gap-1.5 text-xs font-bold" style={{ color: theme.inkSoft }}>
                {ui.plannerGoalDateLabel}
                <input type="date" value={draftDate} min={todayStr} onChange={(e) => setDraftDate(e.target.value)} className="px-3 py-2 text-sm font-semibold" style={{ ...inputStyle, minHeight: 40 }} />
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-bold" style={{ color: theme.inkSoft }}>
                {ui.plannerGoalCountLabel} <span className="font-normal opacity-70">/{totalLeaves}</span>
                <input type="number" min={1} max={totalLeaves || 1} value={draftCount} onChange={(e) => setDraftCount(e.target.value)} className="px-3 py-2 text-sm font-semibold w-24" style={{ ...inputStyle, minHeight: 40 }} />
              </label>
              <button
                onClick={saveGoal}
                disabled={!draftDate}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold"
                style={{ borderRadius: skin.radiusSm, background: theme.accent, color: theme.accentInk, minHeight: 40, opacity: draftDate ? 1 : 0.5 }}
              >
                <Target size={14} />
                {ui.plannerSetGoal}
              </button>
              {hasGoal && (
                <button onClick={() => setEditingGoal(false)} className="px-3 py-2.5 text-sm font-bold" style={{ color: theme.inkSoft, minHeight: 40 }}>
                  {ui.plannerCancel}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide mb-1.5" style={{ color: theme.inkSoft }}>
                {ui.plannerTargetLabel}
              </h3>
              <p className="text-lg font-bold" style={{ color: theme.ink, fontFamily: ui.displayFont }}>
                {targetCount} {ui.plannerLeavesUnit} {fromDateStr(plan.targetDate).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingGoal(true)} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold" style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}>
                <Pencil size={12} />
                {ui.plannerEditGoal}
              </button>
              <button onClick={clearGoal} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold" style={{ color: theme.inkSoft, minHeight: 36 }}>
                <X size={12} />
                {ui.plannerClearGoal}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* status banner */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 mb-5"
        style={{ background: statusMeta.bg, color: statusMeta.ink, borderRadius: skin.radiusLg, border: skin.pixel ? `${skin.borderW}px solid ${statusMeta.ink}` : "none", boxShadow: skin.pixel ? skin.shadow : "none" }}
      >
        <statusMeta.Icon size={20} strokeWidth={2.5} />
        <span className="text-sm font-black">{statusMeta.label}</span>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {tile(ui.plannerCompletionLabel, `${pctComplete}%`, `${doneCount}/${totalLeaves}`, CheckSquare)}
        {tile(ui.plannerDaysLeft, hasGoal ? daysLeft : "—", null, CalendarDays)}
        {tile(ui.plannerRequiredPace, hasGoal ? requiredPerDayNow.toFixed(1) : "—", null, Target)}
        {tile(ui.plannerActualPace, actualPerDay.toFixed(1), null, TrendingUp)}
        {tile(ui.plannerStreakLabel, streak, null, Flame)}
      </div>

      {/* calendar */}
      <div className="p-5 mb-5" style={panelStyle(skin, theme)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-1.5" style={{ color: theme.ink }}>
            <CalendarDays size={14} />
            {ui.plannerCalendarTitle}
          </h3>
          <div className="flex items-center gap-1">
            <button onClick={() => setCalCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))} className="p-1.5" style={{ borderRadius: skin.radiusSm, color: theme.inkSoft, minHeight: 32, minWidth: 32 }} aria-label="prev month">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold w-32 text-center" style={{ color: theme.ink }}>
              {calCursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
            </span>
            <button onClick={() => setCalCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))} className="p-1.5" style={{ borderRadius: skin.radiusSm, color: theme.inkSoft, minHeight: 32, minWidth: 32 }} aria-label="next month">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {weekdayLabels.map((w, i) => (
            <div key={i} className="text-center text-[10px] font-bold" style={{ color: theme.inkSoft }}>
              {w}
            </div>
          ))}
        </div>
        {monthMatrix.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5 mb-1.5">
            {week.map((day, di) => {
              if (!day) return <div key={di} />;
              const ds = toDateStr(day);
              const count = plan.log[ds] || 0;
              const isToday = ds === todayStr;
              const isFuture = day > today;
              const alpha = count > 0 ? Math.min(0.24 * count + 0.22, 1) : 0;
              return (
                <div
                  key={di}
                  className="aspect-square flex items-center justify-center text-[10px] font-bold"
                  title={`${ds}: ${count}`}
                  style={{
                    borderRadius: 8,
                    background: count > 0 ? hexToRgba(theme.accent, alpha) : isFuture ? "transparent" : hexToRgba(theme.ink, 0.04),
                    color: theme.ink,
                    border: isToday ? `1.5px solid ${theme.accent}` : `1px solid ${skinBorderColor(skin, theme)}`,
                    opacity: isFuture ? 0.4 : 1,
                  }}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* to-do list */}
      <div className="p-5" style={panelStyle(skin, theme)}>
        <h3 className="text-sm font-black uppercase tracking-wide mb-1 flex items-center gap-1.5" style={{ color: theme.ink }}>
          <ListChecks size={14} />
          {ui.plannerTodoTitle}
        </h3>
        <p className="text-xs mb-4" style={{ color: theme.inkSoft }}>
          {ui.plannerTodoSub}
        </p>

        {totalLeaves > 0 && doneCount === totalLeaves && (
          <div className="flex items-center gap-2 px-3.5 py-3 mb-4 text-sm font-semibold" style={{ background: CORRECT.bg, color: CORRECT.border, borderRadius: skin.radiusMd }}>
            <Check size={16} />
            {ui.plannerAllDone}
          </div>
        )}

        <div className="flex flex-col gap-5">
          {groups.map(({ branch, leaves: gLeaves }) => (
            <div key={branch.id}>
              <p className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: theme.inkSoft }}>
                {branch[lang]}
              </p>
              <div className="flex flex-col gap-1.5">
                {gLeaves.map((leaf) => {
                  const isDone = doneSet.has(leaf.id);
                  return (
                    <button
                      key={leaf.id}
                      onClick={() => toggleLeaf(leaf.id)}
                      className="flex items-center gap-3 px-3.5 py-2.5 w-full text-start transition-colors"
                      style={{ borderRadius: skin.radiusMd, border: `1.5px solid ${isDone ? theme.accent : skinBorderColor(skin, theme)}`, background: isDone ? theme.accentSoft : "transparent", minHeight: 44 }}
                    >
                      <span
                        className="grid place-items-center shrink-0"
                        style={{ width: 20, height: 20, borderRadius: skin.radiusSm === 9999 ? 999 : 6, border: `1.5px solid ${isDone ? theme.accent : theme.hairlineStrong}`, background: isDone ? theme.accent : "transparent" }}
                      >
                        {isDone && <Check size={12} color={theme.accentInk} strokeWidth={3} />}
                      </span>
                      <span className="text-sm font-semibold flex-1" style={{ color: theme.ink, textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.6 : 1 }}>
                        {leaf[lang]}
                      </span>
                      <span className="text-[11px] font-bold shrink-0" style={{ color: theme.inkSoft }}>
                        {leaf.questions.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Filesystem-Based Book Discovery & Management ────────────────────────── */
async function scanBooksFs(customDir = null) {
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return await invoke("scan_books_dir", { dir: customDir });
    } catch (err) {
      console.error("[EDUcraft BookManager] Tauri scan_books_dir error:", err);
      throw err;
    }
  }

  // Web Browser / Dev Server Bridge
  try {
    const res = await fetch("/__api/books/scan");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[EDUcraft BookManager] Dev bridge scan error:", err);
  }
  return null;
}

async function saveImportedBookFs(bookId, finalJson) {
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return await invoke("import_book_commit_cmd", { bookId, finalJson });
    } catch (err) {
      console.error("[EDUcraft BookManager] Tauri import_book_commit_cmd error:", err);
      throw err;
    }
  }

  // Web Browser / Dev Server Bridge
  const res = await fetch("/__api/books/import_commit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, finalJson }),
  });
  if (res.ok) {
    return await res.json().catch(() => ({ ok: true }));
  } else {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

async function deleteBookFs(id, path = null) {
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return await invoke("delete_book_fs", { id, path });
    } catch (err) {
      console.error("[EDUcraft BookManager] Tauri delete_book_fs error:", err);
      throw err;
    }
  }

  // Web Browser / Dev Server Bridge
  const res = await fetch("/__api/books/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, path }),
  });
  if (res.ok) {
    return true;
  } else {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

function resolveBookImageUrl(bookId, imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
    return imageUrl;
  }
  if (!bookId) return imageUrl;
  if (isTauriEnv()) {
    return `https://asset.localhost/${bookId}/${imageUrl}`;
  }
  return `/__books/${bookId}/${imageUrl}`;
}

async function saveBookImageFs(bookId, filename, dataBase64) {
  if (!bookId || !filename || !dataBase64) throw new Error("Missing bookId, filename, or data");
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return await invoke("save_book_image", { bookId, filename, dataBase64 });
    } catch (err) {
      console.error("[EDUcraft BookManager] Tauri save_book_image error:", err);
      throw err;
    }
  }

  const res = await fetch("/__api/books/save_image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, filename, dataBase64 }),
  });
  if (res.ok) {
    const json = await res.json();
    return json.path;
  }
  throw new Error("Failed to save image to book folder");
}

async function deleteBookImageFs(bookId, relativePath) {
  if (!bookId || !relativePath || !relativePath.startsWith("assets/images/")) return false;
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return await invoke("delete_book_image", { bookId, relativePath });
    } catch (err) {
      console.error("[EDUcraft BookManager] Tauri delete_book_image error:", err);
      return false;
    }
  }

  try {
    const res = await fetch("/__api/books/delete_image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, relativePath }),
    });
    return res.ok;
  } catch (err) {
    console.error("[EDUcraft BookManager] Delete image error:", err);
    return false;
  }
}

function RestoreDatabaseModal({ isOpen, onClose, dumpData, onConfirm, isRestoring, lang, ui, theme, skin }) {
  const [mode, setMode] = useState("merge");
  if (!isOpen || !dumpData) return null;

  const bookCount = Array.isArray(dumpData.books) ? dumpData.books.length : 0;
  const colCount = Array.isArray(dumpData.collections) ? dumpData.collections.length : 0;
  const dateStr = dumpData.exportedAt || "-";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restore-db-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={() => !isRestoring && onClose()}
    >
      <div
        className="w-full max-w-lg p-6 rounded-2xl shadow-2xl border flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
        style={{
          background: theme.surface,
          borderColor: theme.hairlineStrong,
          color: theme.ink,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-500 shrink-0">
              <FileUp size={20} />
            </div>
            <div>
              <h3 id="restore-db-title" className="text-base font-bold">
                {ui.restoreDatabaseTitle}
              </h3>
              <p className="text-xs font-mono opacity-60">
                {dateStr} • v{dumpData.version || "1.0"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRestoring}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Summary Card */}
        <div
          className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border text-xs"
          style={{ background: theme.surfaceSoft, borderColor: theme.hairline }}
        >
          <div>
            <span className="opacity-60 block">{lang === "ar" ? "عدد الكتب في النسخة:" : "Books in dump:"}</span>
            <span className="font-bold text-sm">{bookCount}</span>
          </div>
          <div>
            <span className="opacity-60 block">{lang === "ar" ? "الموسوعات والمجموعات:" : "Collections:"}</span>
            <span className="font-bold text-sm">{colCount}</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider opacity-70">
            {lang === "ar" ? "اختر طريقة الاستعادة:" : "Select restore strategy:"}
          </label>
          <label
            className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
            style={{
              borderColor: mode === "merge" ? theme.accent : theme.hairline,
              background: mode === "merge" ? theme.accentSoft : "transparent",
            }}
          >
            <input
              type="radio"
              name="restoreMode"
              value="merge"
              checked={mode === "merge"}
              onChange={() => setMode("merge")}
              className="mt-0.5"
            />
            <div>
              <span className="block text-xs font-bold">{ui.restoreModeMerge}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">
                {lang === "ar"
                  ? "يضيف الكتب غير الموجودة ويحدّث الموجود دون حذف بقية كتبك الحالية."
                  : "Adds new books and updates existing ones without deleting current books."}
              </span>
            </div>
          </label>

          <label
            className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
            style={{
              borderColor: mode === "full_replace" ? "#EF4444" : theme.hairline,
              background: mode === "full_replace" ? "rgba(239, 68, 68, 0.08)" : "transparent",
            }}
          >
            <input
              type="radio"
              name="restoreMode"
              value="full_replace"
              checked={mode === "full_replace"}
              onChange={() => setMode("full_replace")}
              className="mt-0.5 text-red-600"
            />
            <div>
              <span className="block text-xs font-bold text-red-600 dark:text-red-400">{ui.restoreModeReplace}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">
                {lang === "ar"
                  ? "يمسح كل الكتب الحالية ويستبدلها بالكامل بمحتوى النسخة الاحتياطية."
                  : "Clears all current books and replaces them entirely with the backup contents."}
              </span>
            </div>
          </label>
        </div>

        {/* Warning Notice */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
          <p className="font-semibold mb-0.5">
            {lang === "ar" ? "فحص الجودة التلقائي (Zero Corruption Guarantee):" : "Rust Engine Verification:"}
          </p>
          <p>{ui.restoreConfirmWarning}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isRestoring}
            className="px-4 py-2 text-xs font-bold rounded-xl border transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
          >
            {ui.cancel || (lang === "ar" ? "إلغاء" : "Cancel")}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(mode)}
            disabled={isRestoring}
            className="px-4 py-2 text-xs font-bold rounded-xl text-white flex items-center gap-1.5 transition-opacity disabled:opacity-50 shadow-sm"
            style={{ background: mode === "full_replace" ? "#DC2626" : theme.accent }}
          >
            {isRestoring ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileUp size={13} />
            )}
            {isRestoring ? (lang === "ar" ? "جارٍ التحقق والاستعادة..." : "Restoring...") : ui.restoreConfirmCta}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewEmptyState({
  icon: Icon,
  title,
  sub,
  theme,
  skin,
  ui,
  books = [],
  lang = "en",
  onSelectBook,
  onCreateBook,
}) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center p-8 sm:p-14 max-w-lg mx-auto"
      style={{
        ...panelStyle(skin, theme, { soft: true }),
        borderRadius: skin.radiusLg,
        minHeight: 340,
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
        style={{ background: theme.accentSoft, color: theme.accent }}
      >
        <Icon size={32} />
      </div>
      <h2
        className="text-xl sm:text-2xl font-bold mb-2.5"
        style={{ fontFamily: ui.displayFont, color: theme.ink }}
      >
        {title}
      </h2>
      <p className="text-sm mb-7 max-w-md" style={{ color: theme.inkSoft, lineHeight: 1.65 }}>
        {sub}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onCreateBook && (
          <button
            type="button"
            onClick={onCreateBook}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
            style={{
              borderRadius: skin.radiusSm,
              background: theme.accent,
              color: theme.accentInk,
            }}
          >
            <Plus size={16} />
            {ui.createNewBookCta}
          </button>
        )}
        {books && books.length > 0 && onSelectBook && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) onSelectBook(e.target.value);
              }}
              defaultValue=""
              className="text-xs font-bold px-3 py-2.5 cursor-pointer"
              style={{
                borderRadius: skin.radiusSm,
                border: `1.5px solid ${skinBorderColor(skin, theme)}`,
                background: theme.surface,
                color: theme.ink,
              }}
            >
              <option value="" disabled>
                {ui.quickSelectBook}
              </option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {(lang === "ar" ? b.ar?.title : b.en?.title) || b.en?.title || b.ar?.title || b.id}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("[EDUcraft ErrorBoundary caught error]:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      const { theme, skin, ui, onReset } = this.props;
      return (
        <div
          className="flex flex-col items-center justify-center text-center p-8 sm:p-14 max-w-lg mx-auto my-8 educraft-panel-in"
          style={{
            ...panelStyle(skin, theme, { soft: true }),
            borderRadius: skin?.radiusLg || 16,
            minHeight: 320,
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-amber-600 bg-amber-500/10 shadow-sm"
          >
            <RotateCcw size={30} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: theme?.ink || "#111827" }}>
            {ui?.errorOccurred || (this.props.lang === "ar" ? "حدث خطأ غير متوقع في العرض" : "Something went wrong")}
          </h2>
          <p className="text-sm mb-6 max-w-md opacity-75" style={{ color: theme?.inkSoft || "#6b7280", lineHeight: 1.6 }}>
            {this.state.error?.message || (this.props.lang === "ar" ? "يمكنك العودة إلى المكتبة لمتابعة عملك بأمان." : "You can return to your library safely.")}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (onReset) onReset();
              }}
              className="educraft-btn text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm"
              style={{ background: theme?.accent || "#3B82F6", color: theme?.accentInk || "#ffffff" }}
            >
              {ui?.navLibrary || "Back to Library"}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="educraft-btn text-xs font-bold px-4 py-2.5 rounded-xl border cursor-pointer"
              style={{ borderColor: theme?.hairline || "#d1d5db", color: theme?.ink || "#111827", background: theme?.surface || "#ffffff" }}
            >
              {ui?.tryAgain || "Reload Page"}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* onExportBook / onExportCollection are injected by the top-level
   EDUcraft.jsx wrapper (see that file) — they build the actual
   downloadable .html file using the pre-bundled export assets. This
   component tree itself has no idea how export works; that keeps the
   bundle built for *inside* an exported file (which has no export
   handler and simply hides the Export button — see TreeView) free of
   ever embedding another copy of itself. */
function EDUcraftApp({ onExportBook, onExportCollection } = {}) {
  const EXPORT = useMemo(() => getExportSeed(), []);
  const [saved] = useState(() => loadAppState());
  const initialBooks = useMemo(() => {
    const deletedIds = new Set(saved.deletedBookIds || []);
    const sourceBooks = ((EXPORT ? EXPORT.books : BOOKS) || []).filter((b) => !deletedIds.has(b.id));
    if (saved.customBooks && Array.isArray(saved.customBooks)) {
      const existingIds = new Set(sourceBooks.map((b) => b.id));
      return [...sourceBooks, ...saved.customBooks.filter((b) => !existingIds.has(b.id) && !deletedIds.has(b.id))];
    }
    return sourceBooks;
  }, [EXPORT, saved.customBooks, saved.deletedBookIds]);

  const [lang, setLang] = useState(saved.lang || (EXPORT && EXPORT.lang) || "en");
  const [mode, setMode] = useState(saved.mode || "light");
  const [view, setView] = useState(EXPORT && EXPORT.books && EXPORT.books.length === 1 && (!EXPORT.collections || EXPORT.collections.length === 0) ? "tree" : "library");
  const [books, setBooks] = useState(initialBooks);
  const [bookId, setBookId] = useState(() => {
    if (EXPORT) return EXPORT.startBookId || (EXPORT.books[0] && EXPORT.books[0].id) || "";
    return initialBooks[0] ? initialBooks[0].id : "";
  });
  const [leafId, setLeafId] = useState(null);
  const [skinId, setSkinId] = useState(saved.skinId || (EXPORT && EXPORT.skinId) || "normal");
  const [flavorId, setFlavorId] = useState(saved.flavorId || (EXPORT && EXPORT.flavorId) || "normal");
  const [cardMode, setCardMode] = useState(saved.cardMode || "paged");
  const [scrollDir, setScrollDir] = useState(saved.scrollDir || "vertical");
  const [covers, setCovers] = useState(() => {
    const exportCovers = (EXPORT && EXPORT.covers) || {};
    const savedCovers = (saved && saved.covers) || {};
    return { ...exportCovers, ...savedCovers };
  });
  const [plans, setPlans] = useState(() => {
    const exportPlans = (EXPORT && EXPORT.plans) || {};
    const savedPlans = (saved && saved.plans) || {};
    return { ...exportPlans, ...savedPlans };
  });
  const [bookFlavors, setBookFlavors] = useState(() => {
    const exportFlavors = (EXPORT && EXPORT.bookFlavors) || {};
    const savedFlavors = (saved && saved.bookFlavors) || {};
    return { ...exportFlavors, ...savedFlavors };
  });
  const [collections, setCollections] = useState(() => {
    if (EXPORT && EXPORT.collections && EXPORT.collections.length > 0) return EXPORT.collections;
    return (saved && saved.collections) || [];
  });
  const [libraryPath, setLibraryPath] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(saved.voiceEnabled !== false);
  const [exportToast, setExportToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [confirmDeleteBook, setConfirmDeleteBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [restoreModalData, setRestoreModalData] = useState(null);
  const [isRestoringDb, setIsRestoringDb] = useState(false);
  const [isExportingDb, setIsExportingDb] = useState(false);
  const dbFileInputRef = useRef(null);

  const isEditorDisabled = Boolean(EXPORT && EXPORT.disableEditor);
  const isStandalone = Boolean(EXPORT);
  const [disableEditorInExport, setDisableEditorInExport] = useState(() => Boolean(saved.disableEditorInExport));
  const [disableHtmlExport, setDisableHtmlExport] = useState(() => Boolean(saved.disableHtmlExport));
  const [pluginsModalOpen, setPluginsModalOpen] = useState(false);

  const handleDisableEditorInExportChange = (val) => {
    setDisableEditorInExport(val);
    const current = loadAppState();
    saveAppState({ ...current, disableEditorInExport: val });
  };

  const handleDisableHtmlExportChange = (val) => {
    setDisableHtmlExport(val);
    const current = loadAppState();
    saveAppState({ ...current, disableHtmlExport: val });
  };

  useEffect(() => {
    if (isEditorDisabled && view === "editor") {
      setView("tree");
    }
  }, [isEditorDisabled, view]);

  const handleExportFullDatabase = async () => {
    if (isExportingDb) return;
    setIsExportingDb(true);
    setExportToast({
      type: "info",
      message: lang === "ar" ? "جارٍ استخراج وتجميع قاعدة البيانات بالكامل عبر محرك Rust..." : "Exporting full database dump via Rust engine...",
    });
    try {
      const jsonStr = await exportFullDatabaseViaRust(collections, bookFlavors, covers, plans);
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `educraft-database-backup-${dateStr}.json`;
      downloadBlob(jsonStr, filename, "application/json; charset=utf-8");
      setExportToast({
        type: "success",
        message: ui.exportDatabaseSuccess,
      });
    } catch (err) {
      console.error("[EDUcraft DatabaseDump] Export failed:", err);
      setExportToast({
        type: "error",
        message: lang === "ar" ? `فشل استخراج قاعدة البيانات: ${err?.message || err}` : `Failed to export database: ${err?.message || err}`,
      });
    } finally {
      setIsExportingDb(false);
      setTimeout(() => {
        setExportToast((prev) => (prev?.type === "success" ? null : prev));
      }, 4000);
    }
  };

  const handleSelectRestoreFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.books)) {
          alert(lang === "ar" ? "الملف المحدد ليس نسخة احتياطية صالحة لقاعدة بيانات EDUcraft (يجب أن يحتوي على مصفوفة books)." : "Selected file is not a valid EDUcraft database backup (missing books array).");
          return;
        }
        setRestoreModalData(parsed);
      } catch (err) {
        alert(lang === "ar" ? `خطأ في قراءة ملف JSON: ${err.message}` : `JSON parse error: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExecuteRestore = async (restoreMode) => {
    if (!restoreModalData || isRestoringDb) return;
    setIsRestoringDb(true);
    try {
      const report = await importFullDatabaseViaRust(restoreModalData, restoreMode);
      if (report && report.success) {
        if (restoreMode === "full_replace") {
          setCollections(restoreModalData.collections || []);
          setCovers(restoreModalData.covers || {});
          setPlans(restoreModalData.plans || {});
          setBookFlavors(restoreModalData.bookFlavors || {});
          saveAppState({
            ...loadAppState(),
            collections: restoreModalData.collections || [],
            covers: restoreModalData.covers || {},
            plans: restoreModalData.plans || {},
            bookFlavors: restoreModalData.bookFlavors || {},
          });
        } else {
          setCollections((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const newCols = (restoreModalData.collections || []).filter((c) => !existingIds.has(c.id));
            return [...prev, ...newCols];
          });
          setCovers((prev) => ({ ...prev, ...(restoreModalData.covers || {}) }));
          setPlans((prev) => ({ ...prev, ...(restoreModalData.plans || {}) }));
          setBookFlavors((prev) => ({ ...prev, ...(restoreModalData.bookFlavors || {}) }));
          saveAppState({
            ...loadAppState(),
            covers: { ...(loadAppState().covers || {}), ...(restoreModalData.covers || {}) },
            plans: { ...(loadAppState().plans || {}), ...(restoreModalData.plans || {}) },
            bookFlavors: { ...(loadAppState().bookFlavors || {}), ...(restoreModalData.bookFlavors || {}) },
          });
        }

        await rescanBooks(true);

        setRestoreModalData(null);
        setExportToast({
          type: "success",
          message: lang === "ar"
            ? `تمت استعادة قاعدة البيانات بنجاح (${report.restored_books_count} كتاب)!`
            : `Successfully restored database (${report.restored_books_count} books)!`,
        });
      }
    } catch (err) {
      console.error("[EDUcraft DatabaseDump] Restore failed:", err);
      alert(lang === "ar" ? `فشلت استعادة قاعدة البيانات: ${err?.message || err}` : `Database restore failed: ${err?.message || err}`);
    } finally {
      setIsRestoringDb(false);
      setTimeout(() => {
        setExportToast((prev) => (prev?.type === "success" ? null : prev));
      }, 4500);
    }
  };

  const rescanBooks = async (silent = false) => {
    if (EXPORT) return;
    setIsScanning(true);
    if (!silent) {
      setExportToast({
        type: "info",
        message: lang === "ar" ? "جارٍ فحص مجلد الكتب وتحديث المكتبة..." : "Scanning books folder and updating library...",
      });
    }

    try {
      const scanResult = await scanBooksFs();
      if (scanResult && Array.isArray(scanResult.books)) {
        const mappedBooks = scanResult.books
          .filter((b) => b.state === "valid" && b.book)
          .map((b) => ({
            ...b.book,
            _sourcePath: b.path,
            _isDir: b.is_dir,
            _state: b.state,
            _mtimeMs: b.mtime_ms,
          }));

        const invalidBooks = scanResult.books
          .filter((b) => b.state !== "valid")
          .map((b) => ({
            id: b.id,
            cover: "linear-gradient(135deg, #4b5563, #1f2937)",
            ar: { title: b.title_ar || b.id, tagline: b.error || "كتاب غير صالح أو غير مكتمل" },
            en: { title: b.title_en || b.id, tagline: b.error || "Invalid or incomplete book" },
            nodes: [],
            _sourcePath: b.path,
            _isDir: b.is_dir,
            _state: b.state,
            _error: b.error,
            _mtimeMs: b.mtime_ms,
          }));

        const allDiscovered = [...mappedBooks, ...invalidBooks];
        setBooks(allDiscovered);

        // Keep deletedBookIds strictly in sync with disk truth
        try {
          const currentSaved = loadAppState();
          const diskIdSet = new Set(allDiscovered.map((b) => b.id));
          const updatedDeletedIds = (BOOKS || [])
            .map((b) => b.id)
            .filter((id) => !diskIdSet.has(id));
          saveAppState({
            ...currentSaved,
            deletedBookIds: updatedDeletedIds,
          });
        } catch (_) {}

        setBookId((prevId) => {
          const stillExists = allDiscovered.some((b) => b.id === prevId);
          if (!stillExists) {
            setView("library");
            setLeafId(null);
            return allDiscovered[0]?.id || "";
          }
          return prevId;
        });

        if (!silent) {
          setExportToast({
            type: "success",
            message:
              lang === "ar"
                ? `تم تحديث المكتبة بنجاح (${scanResult.valid_count} كتاب صالح)`
                : `Library updated successfully (${scanResult.valid_count} valid books)`,
          });
        }
      }
    } catch (err) {
      console.error("[EDUcraft BookManager] Rescan error:", err);
      if (!silent) {
        setExportToast({
          type: "error",
          message: lang === "ar" ? `فشل فحص مجلد الكتب: ${err?.message || err}` : `Failed to scan books: ${err?.message || err}`,
        });
      }
    } finally {
      setIsScanning(false);
      if (!silent) {
        setTimeout(() => {
          setExportToast((prev) => (prev?.type === "success" ? null : prev));
        }, 3500);
      }
    }
  };

  useEffect(() => {
    rescanBooks(true);
  }, []);

  const handleExportBook = async (bookToExport, exportLang, exportTheme, exportUi, exportSkin, exportCovers) => {
    if (disableHtmlExport) {
      setExportToast({
        type: "error",
        message: exportLang === "ar" ? "تم منع تصدير HTML: هذا الخيار معطل في إعدادات التطبيق." : "HTML Export is disabled in application settings.",
      });
      setTimeout(() => setExportToast(null), 4000);
      return;
    }
    if (isExporting || !onExportBook) return;
    setIsExporting(true);
    const bTitle = bookToExport?.[exportLang]?.title || bookToExport?.id || "Book";
    setExportToast({
      type: "info",
      message: exportLang === "ar" ? `جارٍ استخراج وتصدير "${bTitle}" عبر محرك Rust...` : `Exporting "${bTitle}" via Rust engine...`,
    });
    try {
      const res = await onExportBook(bookToExport, exportLang, exportTheme, exportUi, exportSkin, exportCovers, disableEditorInExport);
      if (res) {
        setExportToast({
          type: "success",
          message: exportLang === "ar" ? `تم استخراج وتصدير "${bTitle}" بنجاح!` : `Successfully exported "${bTitle}"!`,
        });
      } else {
        setExportToast(null);
      }
    } catch (err) {
      console.error("[EDUcraft] Export failed:", err);
      setExportToast({
        type: "error",
        message: exportLang === "ar" ? `فشل التصدير: ${err?.message || err}` : `Export failed: ${err?.message || err}`,
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportToast((prev) => (prev?.type === "success" ? null : prev));
      }, 4000);
    }
  };

  /* ---------------------------------------------------------------------------
     SINGLE BOOK JSON EXPORT vs FULL DATABASE DUMP:
     - "Export Full Backup" (in the top toolbar) exports the ENTIRE system state:
       all books from BOOKS/, all collections, all bookFlavors, all covers, all plans.
     - "Export as JSON" here exports ONLY this single book's complete schema
       (id, nodes, pageBlocks, questions, metadata) so it can be re-imported directly
       via the "Import JSON" button on any EDUcraft installation or shared with others.
     --------------------------------------------------------------------------- */
  const handleExportSingleBookJson = async (bookToExport) => {
    if (!bookToExport) return;
    const bTitle = bookToExport?.[lang]?.title || bookToExport?.id || "Book";
    const bFid = bookFlavors[bookToExport.id] || flavorId;
    const bCover = covers[bookToExport.id] || bookToExport.cover || null;

    const singleBookPayload = {
      id: bookToExport.id,
      cover: bCover,
      en: bookToExport.en || { title: bookToExport.title_en || bookToExport.id, tagline: bookToExport.tagline_en || "" },
      ar: bookToExport.ar || { title: bookToExport.title_ar || bookToExport.id, tagline: bookToExport.tagline_ar || "" },
      title_ar: bookToExport.title_ar || bookToExport.ar?.title || "",
      title_en: bookToExport.title_en || bookToExport.en?.title || "",
      tagline_ar: bookToExport.tagline_ar || bookToExport.ar?.tagline || "",
      tagline_en: bookToExport.tagline_en || bookToExport.en?.tagline || "",
      flavorId: bFid,
      crossLinks: bookToExport.crossLinks || [],
      nodes: bookToExport.nodes || [],
      pageBlocks: bookToExport.pageBlocks || {},
      questions: bookToExport.questions || [],
    };

    const jsonStr = JSON.stringify(singleBookPayload, null, 2);
    const safeTitle = slugify(bookToExport[lang]?.title || bookToExport.id || "book");
    const filename = `${safeTitle || bookToExport.id || "book"}.json`;

    downloadBlob(jsonStr, filename, "application/json; charset=utf-8");

    setExportToast({
      type: "success",
      message: lang === "ar"
        ? `تم تصدير كتاب "${bTitle}" كملف JSON بنجاح!`
        : `Exported "${bTitle}" as JSON successfully!`,
    });
    setTimeout(() => {
      setExportToast((prev) => (prev?.type === "success" ? null : prev));
    }, 3500);
  };

  const handleExportCollection = async (colToExport, allBooks, allCols, exportLang, exportTheme, exportUi, exportSkin, exportCovers) => {
    if (disableHtmlExport) {
      setExportToast({
        type: "error",
        message: exportLang === "ar" ? "تم منع تصدير HTML: هذا الخيار معطل في إعدادات التطبيق." : "HTML Export is disabled in application settings.",
      });
      setTimeout(() => setExportToast(null), 4000);
      return;
    }
    if (isExporting || !onExportCollection) return;
    setIsExporting(true);
    setExportToast({
      type: "info",
      message: exportLang === "ar" ? `جارٍ استخراج وتصدير المجموعة "${colToExport.title}" عبر محرك Rust...` : `Exporting collection "${colToExport.title}" via Rust engine...`,
    });
    try {
      const res = await onExportCollection(colToExport, allBooks, allCols, exportLang, exportTheme, exportUi, exportSkin, exportCovers, disableEditorInExport);
      if (res) {
        setExportToast({
          type: "success",
          message: exportLang === "ar" ? `تم استخراج وتصدير المجموعة "${colToExport.title}" بنجاح!` : `Successfully exported collection "${colToExport.title}"!`,
        });
      } else {
        setExportToast(null);
      }
    } catch (err) {
      console.error("[EDUcraft] Collection export failed:", err);
      setExportToast({
        type: "error",
        message: exportLang === "ar" ? `فشل تصدير المجموعة: ${err?.message || err}` : `Failed to export collection: ${err?.message || err}`,
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportToast((prev) => (prev?.type === "success" ? null : prev));
      }, 4000);
    }
  };

  const setBookFlavor = (bid, fid) => setBookFlavors((prev) => ({ ...prev, [bid]: fid }));

  const requestDeleteBook = (bookToDelete) => {
    const target = typeof bookToDelete === "string" ? books.find((b) => b.id === bookToDelete) : bookToDelete;
    if (target) {
      setConfirmDeleteBook(target);
    }
  };

  const executeDeleteBook = async () => {
    if (!confirmDeleteBook || isDeleting) return;
    setIsDeleting(true);
    const target = confirmDeleteBook;
    const targetId = target.id;
    const pathHint = target._sourcePath || target.path || null;
    const title = target[lang]?.title || targetId;

    try {
      // 1. Mandatory backend deletion by id (never skipped!)
      await deleteBookFs(targetId, pathHint);

      setExportToast({
        type: "success",
        message: lang === "ar" ? `تم حذف كتاب "${title}" نهائيًا من القرص` : `Permanently deleted "${title}" from disk`,
      });
      setConfirmDeleteBook(null);

      // 2. Clear all associated metadata from React state
      setCovers((prev) => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });
      setPlans((prev) => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });
      setBookFlavors((prev) => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });
      setCollections((prev) =>
        prev.map((c) => ({
          ...c,
          itemIds: (c.itemIds || []).filter((id) => id !== targetId),
        }))
      );

      // 3. Clear all associated metadata from persistent storage
      const currentSaved = loadAppState();
      const existingDeleted = new Set(currentSaved.deletedBookIds || []);
      existingDeleted.add(targetId);
      currentSaved.deletedBookIds = Array.from(existingDeleted);
      if (currentSaved.customBooks) {
        currentSaved.customBooks = currentSaved.customBooks.filter((b) => b.id !== targetId);
      }
      if (currentSaved.covers) delete currentSaved.covers[targetId];
      if (currentSaved.plans) delete currentSaved.plans[targetId];
      if (currentSaved.bookFlavors) delete currentSaved.bookFlavors[targetId];
      if (currentSaved.collections) {
        currentSaved.collections = currentSaved.collections.map((c) => ({
          ...c,
          itemIds: (c.itemIds || []).filter((id) => id !== targetId),
        }));
      }
      saveAppState(currentSaved);

      if (bookId === targetId) {
        setView("library");
        setLeafId(null);
      }

      // 4. Mandatory Real Re-fetch from backend (never rely on just local state filtering!)
      await rescanBooks(true);
    } catch (err) {
      console.error("[EDUcraft BookManager] Delete failed:", err);
      setExportToast({
        type: "error",
        message: lang === "ar" ? `فشل حذف الكتاب من القرص: ${err?.message || err}` : `Failed to delete book from disk: ${err?.message || err}`,
      });
    } finally {
      setIsDeleting(false);
      setTimeout(() => {
        setExportToast((prev) => (prev?.type === "success" ? null : prev));
      }, 4000);
    }
  };

  const handleImportSuccess = async ({ books: newBooks, collections: newCols, plans: newPlans, targetBookId, newlyImportedBooks = [] }) => {
    // 1. Physical commit of all imported books to BOOKS/{book_id}/book.json on disk
    const booksToCommit = newlyImportedBooks.length > 0
      ? newlyImportedBooks
      : (newBooks || []).filter((b) => !BOOKS.some((def) => def.id === b.id));

    const currentSaved = loadAppState();
    const deletedSet = new Set(currentSaved.deletedBookIds || []);

    for (const book of booksToCommit) {
      deletedSet.delete(book.id);
      try {
        const cleanBook = { ...book };
        // Process inline base64 images if present
        if (cleanBook.pageBlocks) {
          for (const [leafId, blocks] of Object.entries(cleanBook.pageBlocks)) {
            if (Array.isArray(blocks)) {
              for (let i = 0; i < blocks.length; i++) {
                const blk = blocks[i];
                if ((blk.kind === "image" || blk.type === "image") && blk.url?.startsWith("data:image/")) {
                  const ext = blk.url.includes("image/png") ? "png" : blk.url.includes("image/jpeg") ? "jpg" : "png";
                  const imgName = `img_${leafId}_${i}_${Date.now()}.${ext}`;
                  try {
                    const savedImg = await saveBookImageFs(cleanBook.id, imgName, blk.url);
                    if (savedImg?.path) {
                      blk.url = savedImg.path;
                    }
                  } catch (e) {
                    console.warn("[EDUcraft Import] Failed to save inline base64 image:", e);
                  }
                }
              }
            }
          }
        }

        const jsonStr = JSON.stringify(cleanBook, null, 2);
        await saveImportedBookFs(cleanBook.id, jsonStr);
      } catch (err) {
        console.error(`[EDUcraft Import] Failed to physically save book ${book.id} to disk:`, err);
      }
    }

    currentSaved.deletedBookIds = Array.from(deletedSet);
    saveAppState(currentSaved);

    setCollections(newCols);
    if (newPlans && Object.keys(newPlans).length > 0) {
      setPlans((prev) => ({ ...prev, ...newPlans }));
    }

    // 2. Physical Rescan from disk (single source of truth) so newly written book appears natively
    await rescanBooks(true);

    if (targetBookId) {
      setBookId(targetBookId);
    }
  };

  const handleCreateNewBook = async (options) => {
    let title = "";
    let arTitle = "";
    let enTitle = "";
    let tagline = "";
    let parentId = null;
    let cover = null;

    if (typeof options === "string") {
      title = options.trim();
    } else if (options && typeof options === "object") {
      title = (options.title || options.arTitle || options.enTitle || "").trim();
      arTitle = (options.arTitle || title).trim();
      enTitle = (options.enTitle || title).trim();
      tagline = (options.tagline || "").trim();
      parentId = options.parentId || null;
      cover = options.cover || null;
    }

    if (!title) {
      title = lang === "ar" ? "كتاب جديد" : "New Book";
    }

    // Generate safe slug id
    const baseSlug = (enTitle || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const safeId = baseSlug || `book-${Date.now().toString(36)}`;
    let finalId = safeId;
    let counter = 1;
    while (books.some((b) => b.id === finalId)) {
      finalId = `${safeId}-${counter++}`;
    }

    const newBook = {
      id: finalId,
      cover: cover || {
        from: "#3B82F6",
        to: "#1D4ED8",
        icon: "book",
      },
      en: {
        title: enTitle || title,
        tagline: tagline || (lang === "en" ? "Interactive learning book" : "Manual curriculum"),
      },
      ar: {
        title: arTitle || title,
        tagline: tagline || (lang === "ar" ? "كتاب تعليمي تفاعلي" : "منهج تعليمي يدوي"),
      },
      flavorId: flavorId || "nord",
      nodes: [],
      pageBlocks: {},
      questions: [],
    };

    // 1. Physically persist to disk (single source of truth)
    try {
      await saveImportedBookFs(newBook.id, JSON.stringify(newBook, null, 2));
    } catch (err) {
      console.error("[EDUcraft Create Book] Physical save failed:", err);
    }

    // 2. Remove from deletedBookIds if it was deleted previously
    const currentSaved = loadAppState();
    if (currentSaved.deletedBookIds && Array.isArray(currentSaved.deletedBookIds)) {
      currentSaved.deletedBookIds = currentSaved.deletedBookIds.filter((id) => id !== newBook.id);
      saveAppState(currentSaved);
    }

    // 3. Update React state, file into parentId if given, set active bookId, and switch view to editor
    setBooks((prev) => [...prev.filter((b) => b.id !== newBook.id), newBook]);
    if (parentId && parentId !== "root") {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, itemIds: Array.from(new Set([...(c.itemIds || []), finalId])) }
            : c
        )
      );
    }
    setBookId(newBook.id);
    setView("editor");
  };

  const ui = UI[lang] || UI.ar || UI.en;
  const flavor = FLAVORS[flavorId] || FLAVORS.normal;
  const theme = (flavor && flavor[mode]) || (FLAVORS.normal && FLAVORS.normal[mode]) || FLAVORS.normal.light;
  const currentBook = books.find((b) => b.id === bookId) || books[0] || BOOKS[0] || null;
  const currentBookFlavorId = (currentBook && bookFlavors[currentBook.id]) || flavorId;
  const bFlavor = FLAVORS[currentBookFlavorId] || flavor;
  const bookTheme = (bFlavor && bFlavor[mode]) || theme;
  const skin = SKINS[skinId] || SKINS.normal;
  const dir = ui.dir || "rtl";
  const saveBookTimeoutRef = useRef(null);
  const persistBookDebounced = (bookToSave) => {
    if (!bookToSave) return;
    if (saveBookTimeoutRef.current) clearTimeout(saveBookTimeoutRef.current);
    saveBookTimeoutRef.current = setTimeout(() => {
      try {
        saveImportedBookFs(bookToSave.id, JSON.stringify(bookToSave, null, 2)).catch((err) => {
          console.warn("[EDUcraft Save] Disk sync warning:", err);
        });
      } catch (err) {
        console.warn("[EDUcraft Save] JSON stringify warning:", err);
      }
    }, 350);
  };

  const updateCurrentBook = (fn) => {
    setBooks((prev) => {
      const updated = prev.map((b) => {
        if (!currentBook || b.id !== currentBook.id) return b;
        return typeof fn === "function" ? fn(b) : { ...b, ...fn };
      });
      const target = updated.find((b) => b.id === currentBook?.id);
      if (target) {
        persistBookDebounced(target);
      }
      return updated;
    });
  };
  const currentPlan = (currentBook && plans[currentBook.id]) || defaultPlan();
  const updateCurrentPlan = (fn) => {
    if (!currentBook) return;
    setPlans((prev) => ({ ...prev, [currentBook.id]: fn(prev[currentBook.id] || defaultPlan()) }));
  };

  const toggleLeafDone = (lid) => {
    const targetLeafId = lid || leafId;
    if (!targetLeafId) return;
    updateCurrentPlan((p) => {
      const isDone = (p.doneLeafIds || []).includes(targetLeafId);
      const nextDone = isDone
        ? p.doneLeafIds.filter((id) => id !== targetLeafId)
        : [...(p.doneLeafIds || []), targetLeafId];
      const today = toDateStr(new Date());
      const nextLog = { ...(p.log || {}) };
      if (!isDone) {
        nextLog[today] = (nextLog[today] || 0) + 1;
      }
      return { ...p, doneLeafIds: nextDone, log: nextLog };
    });
  };

  const handleDeckAnswer = (groupId, qIndex, result) => {
    const today = toDateStr(new Date());
    updateCurrentPlan((p) => {
      const nextLog = { ...(p.log || {}) };
      nextLog[today] = (nextLog[today] || 0) + 1;
      return { ...p, log: nextLog };
    });
  };

  useEffect(() => {
    const customBooks = books.filter((b) => !BOOKS.some((def) => def.id === b.id));
    const currentSaved = loadAppState();
    saveAppState({
      ...currentSaved,
      lang,
      mode,
      skinId,
      flavorId,
      bookFlavors,
      cardMode,
      scrollDir,
      voiceEnabled,
      covers,
      plans,
      collections,
      customBooks,
    });
  }, [lang, mode, skinId, flavorId, bookFlavors, cardMode, scrollDir, voiceEnabled, covers, plans, collections, books]);

  const resetAll = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("educraft_deleted_books");
      } catch (e) {}
    }
    saveAppState({});
    setDeletedBookIds([]);
    setLang("en");
    setMode("light");
    setSkinId("normal");
    setFlavorId("normal");
    setBookFlavors({});
    setCardMode("paged");
    setScrollDir("vertical");
    setVoiceEnabled(true);
    setCovers({});
    setPlans({});
    setCollections([]);
    setLibraryPath([]);
    setBooks(EXPORT ? EXPORT.books : BOOKS);
    setBookId(EXPORT ? EXPORT.startBookId || EXPORT.books[0].id : BOOKS[0].id);
    setLeafId(null);
    setView("library");
  };

  const openBook = (id) => {
    setBookId(id);
    setLeafId(null);
    setView("tree");
  };
  const openLeaf = (id) => {
    setLeafId(id);
    setView("deck");
  };
  const leafById = useMemo(() => (currentBook && Array.isArray(currentBook.nodes) ? Object.fromEntries(currentBook.nodes.filter((n) => n.level === "leaf").map((n) => [n.id, n])) : {}), [currentBook]);
  const currentLeaf = leafId ? leafById[leafId] : null;
  const setCover = (id, url) => setCovers((c) => ({ ...c, [id]: url }));
  const clearCover = (id) =>
    setCovers((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const createCollection = (options) => {
    let kind = "folder";
    let title = "";
    let parentId = null;
    if (typeof options === "string") {
      kind = options;
      title = kind === "encyclopedia" ? (lang === "ar" ? "موسوعة جديدة" : "New Encyclopedia") : (lang === "ar" ? "مجلد جديد" : "New Folder");
    } else if (options && typeof options === "object") {
      kind = options.kind || "folder";
      title = (options.title || "").trim();
      parentId = options.parentId || null;
    }
    if (!title) return;
    const newCol = { id: uid(kind), kind, title, itemIds: [] };
    setCollections((prev) => {
      let next = [...prev, newCol];
      if (parentId && parentId !== "root") {
        next = next.map((c) =>
          c.id === parentId
            ? { ...c, itemIds: Array.from(new Set([...(c.itemIds || []), newCol.id])) }
            : c
        );
      }
      return next;
    });
  };

  const deleteCollection = (id) => {
    setCollections((prev) =>
      prev
        .filter((c) => c.id !== id)
        .map((c) => ({
          ...c,
          itemIds: (c.itemIds || []).filter((x) => x !== id),
        }))
    );
    setLibraryPath((prev) => {
      const idx = prev.indexOf(id);
      if (idx !== -1) return prev.slice(0, idx);
      return prev.filter((x) => x !== id);
    });
  };

  const moveToCollection = (itemId, targetCollectionId) => {
    setCollections((prev) => {
      const cleaned = prev.map((c) => ({
        ...c,
        itemIds: (c.itemIds || []).filter((id) => id !== itemId),
      }));
      if (targetCollectionId && targetCollectionId !== "root") {
        return cleaned.map((c) =>
          c.id === targetCollectionId
            ? { ...c, itemIds: Array.from(new Set([...(c.itemIds || []), itemId])) }
            : c
        );
      }
      return cleaned;
    });
  };

  const assignToCollection = (itemId, collectionId) => {
    moveToCollection(itemId, collectionId);
  };
  const removeFromCollection = (itemId) => {
    moveToCollection(itemId, "root");
  };
  const enterCollection = (id) => setLibraryPath((prev) => [...prev, id]);
  const crumbTo = (depth) => setLibraryPath((prev) => prev.slice(0, depth));

  const displayFont = skin.displayFontOverride || ui.displayFont;

  return (
    <div
      dir={dir}
      lang={ui.htmlLang}
      className="min-h-screen w-full"
      style={{ background: theme.canvas, color: theme.ink, fontFamily: ui.bodyFont }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&family=Cairo:wght@500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Press+Start+2P&display=swap');
        /* Fixes the stray white/default strip that used to show above the
           header: the browser's default body margin let the page's own
           white background peek through before our canvas color painted. */
        html, body { margin: 0; padding: 0; max-width: 100vw; overflow-x: clip; background: ${theme.canvas}; }
        #root, #__next { background: ${theme.canvas}; max-width: 100vw; overflow-x: clip; width: 100%; min-width: 0; }
        .educraft-root { width: 100%; max-width: 100vw; box-sizing: border-box; }
        .educraft-root * { box-sizing: border-box; }
        .educraft-root button { font: inherit; cursor: pointer; }
        .educraft-root button:disabled { cursor: not-allowed; }
        .educraft-root input, .educraft-root textarea { font: inherit; }
        .educraft-root button:focus-visible,
        .educraft-root a:focus-visible,
        .educraft-root input:focus-visible,
        .educraft-root textarea:focus-visible,
        .educraft-root g:focus-visible rect { outline: 2px solid ${theme.accent}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .educraft-root * { animation: none !important; transition: none !important; }
        }
        @keyframes educraft-rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes educraft-pop {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .educraft-panel-in { animation: educraft-rise .3s ease both; }
        .educraft-modal-in { animation: educraft-pop .22s ease both; }
        .educraft-btn {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.15s ease,
                      border-color 0.15s ease,
                      color 0.15s ease;
        }
        .educraft-btn:hover {
          transform: translateY(-1px);
        }
        .educraft-btn:active {
          transform: scale(0.97) !important;
        }
        .educraft-pill {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .educraft-pill:active {
          transform: scale(0.96);
        }
      `}</style>

      <div className={`educraft-root w-full ${view === "editor" ? "max-w-[1560px]" : "max-w-5xl"} mx-auto px-2.5 sm:px-8 pb-28 md:pb-16 transition-all duration-300 min-w-0`}>
        {/* header */}
        <header
          className="flex items-center justify-between gap-2 sm:gap-4 mt-3 sm:mt-6 px-3.5 sm:px-5 py-2.5 sm:py-3.5"
          style={{
            background: skin.surfaceAlpha >= 1 ? theme.header : hexToRgba(theme.header, skin.surfaceAlpha),
            borderRadius: skin.radiusLg,
            border: `${skin.borderW}px solid ${skinBorderColor(skin, theme)}`,
            boxShadow: skin.shadow,
            backdropFilter: skin.blur,
            WebkitBackdropFilter: skin.blur,
          }}
        >
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen size={20} color={theme.ink} strokeWidth={2} />
            <span className="text-base sm:text-lg font-bold" style={{ fontFamily: displayFont, color: theme.ink, letterSpacing: skin.letterSpacing }}>
              {ui.brand}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => setView("library")}
              className="educraft-btn flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 cursor-pointer"
              style={{
                borderRadius: skin.radiusSm,
                color: view === "library" ? theme.accent : theme.inkSoft,
                background: view === "library" ? theme.accentSoft : "transparent",
                border: view === "library" ? `1px solid ${theme.accent}33` : "1px solid transparent",
                fontWeight: view === "library" ? 700 : 500,
              }}
            >
              <Library size={14} style={{ color: view === "library" ? theme.accent : theme.inkSoft }} />
              {ui.navLibrary}
            </button>
            <button
              type="button"
              onClick={() => setView("tree")}
              className="educraft-btn flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 cursor-pointer"
              style={{
                borderRadius: skin.radiusSm,
                color: view === "tree" ? theme.accent : theme.inkSoft,
                background: view === "tree" ? theme.accentSoft : "transparent",
                border: view === "tree" ? `1px solid ${theme.accent}33` : "1px solid transparent",
                fontWeight: view === "tree" ? 700 : 500,
              }}
            >
              <GitBranch size={14} style={{ color: view === "tree" ? theme.accent : theme.inkSoft }} />
              {ui.navTree}
            </button>
            {!isEditorDisabled && (
              <button
                type="button"
                onClick={() => setView("editor")}
                className="educraft-btn flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 cursor-pointer"
                style={{
                  borderRadius: skin.radiusSm,
                  color: view === "editor" ? theme.accent : theme.inkSoft,
                  background: view === "editor" ? theme.accentSoft : "transparent",
                  border: view === "editor" ? `1px solid ${theme.accent}33` : "1px solid transparent",
                  fontWeight: view === "editor" ? 700 : 500,
                }}
              >
                <Settings size={14} style={{ color: view === "editor" ? theme.accent : theme.inkSoft }} />
                {ui.navEditor}
              </button>
            )}
            <button
              type="button"
              onClick={() => setView("planner")}
              className="educraft-btn flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 cursor-pointer"
              style={{
                borderRadius: skin.radiusSm,
                color: view === "planner" ? theme.accent : theme.inkSoft,
                background: view === "planner" ? theme.accentSoft : "transparent",
                border: view === "planner" ? `1px solid ${theme.accent}33` : "1px solid transparent",
                fontWeight: view === "planner" ? 700 : 500,
              }}
            >
              <CalendarDays size={14} style={{ color: view === "planner" ? theme.accent : theme.inkSoft }} />
              {ui.navPlanner}
            </button>
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
              className="educraft-btn flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 sm:py-2 cursor-pointer"
              style={{ borderRadius: skin.radiusSm, color: theme.ink, minHeight: 36 }}
              aria-label="Toggle language"
            >
              <Languages size={15} />
              <span>{ui.langToggle}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
              className="educraft-btn p-2 cursor-pointer flex items-center justify-center"
              style={{ borderRadius: skin.radiusSm, color: theme.ink, minHeight: 36, minWidth: 36 }}
              aria-label="Toggle theme"
            >
              {mode === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button
              type="button"
              onClick={() => setPluginsModalOpen(true)}
              className="educraft-btn p-2 cursor-pointer flex items-center justify-center relative"
              style={{ borderRadius: skin.radiusSm, color: theme.ink, minHeight: 36, minWidth: 36 }}
              aria-label={lang === "ar" ? "إضافات تيتانيوم (Titanium Plugins)" : "Titanium Plugins"}
              title={lang === "ar" ? "إضافات تيتانيوم (Titanium Plugins)" : "Titanium Plugins"}
            >
              <Blocks size={15} />
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="educraft-btn p-2 cursor-pointer flex items-center justify-center"
              style={{ borderRadius: skin.radiusSm, color: theme.ink, minHeight: 36, minWidth: 36 }}
              aria-label={ui.navSettings}
              title={ui.navSettings}
            >
              <Settings size={15} />
            </button>
          </div>
        </header>

        <ErrorBoundary theme={theme} skin={skin} ui={ui} lang={lang} onReset={() => setView("library")}>
        <div className="pt-8">
          {view === "library" ? (
            <LibraryView
              lang={lang}
              ui={ui}
              theme={theme}
              dir={dir}
              onOpen={openBook}
              skin={skin}
              covers={covers}
              onChangeCover={setCover}
              onClearCover={clearCover}
              books={books}
              collections={collections}
              libraryPath={libraryPath}
              onEnterCollection={enterCollection}
              onCrumb={crumbTo}
              onCreateCollection={createCollection}
              onDeleteCollection={deleteCollection}
              onAssignToCollection={assignToCollection}
              onRemoveFromCollection={removeFromCollection}
              onMoveItem={moveToCollection}
              onCreateNewBook={handleCreateNewBook}
              onExportBook={!isStandalone && onExportBook ? (book, format = "html") => {
                if (format === "json") {
                  handleExportSingleBookJson(book);
                } else {
                  const bFid = (book && bookFlavors[book.id]) || flavorId;
                  const bTheme = FLAVORS[bFid] ? FLAVORS[bFid][mode] : theme;
                  handleExportBook(book, lang, bTheme, ui, skin, covers);
                }
              } : undefined}
              onExportCollection={!isStandalone && onExportCollection ? (col) => handleExportCollection(col, books, collections, lang, theme, ui, skin, covers) : undefined}
              isExporting={isExporting}
              onRescan={() => rescanBooks(false)}
              isScanning={isScanning}
              onOpenImportModal={() => setImportModalOpen(true)}
              onOpenPluginsModal={() => setPluginsModalOpen(true)}
              disableHtmlExport={disableHtmlExport}
              onDeleteBook={isStandalone ? undefined : requestDeleteBook}
              plans={plans}
              onExportDatabase={handleExportFullDatabase}
              onRestoreDatabase={() => dbFileInputRef.current?.click()}
            />
          ) : view === "tree" ? (
            currentBook ? (
              <TreeView
                key={currentBook.id}
                book={currentBook}
                lang={lang}
                ui={ui}
                theme={bookTheme}
                dir={dir}
                onBack={() => setView("library")}
                skin={skin}
                selectedLeaf={leafId}
                onSelectLeaf={openLeaf}
                onBrowse={() => setView("browse")}
                onReadThrough={() => setView("readthrough")}
                onPlanner={() => setView("planner")}
                onEditor={isEditorDisabled ? undefined : () => setView("editor")}
                onExport={!isStandalone && !disableHtmlExport && onExportBook ? () => handleExportBook(currentBook, lang, bookTheme, ui, skin, covers) : undefined}
                covers={covers}
                onChangeCover={setCover}
                onClearCover={clearCover}
                bookFlavorId={currentBookFlavorId}
                onChangeBookFlavor={(fid) => setBookFlavor(currentBook.id, fid)}
                onDeleteBook={isStandalone ? undefined : requestDeleteBook}
                plan={currentPlan}
              />
            ) : (
              <ViewEmptyState
                icon={GitBranch}
                title={ui.treeEmptyTitle}
                sub={ui.treeEmptySub}
                theme={theme}
                skin={skin}
                ui={ui}
                books={books}
                lang={lang}
                onSelectBook={(id) => {
                  setBookId(id);
                  setView("tree");
                }}
                onCreateBook={() => handleCreateNewBook()}
              />
            )
          ) : view === "editor" && !isEditorDisabled ? (
            currentBook ? (
              <div key={currentBook.id} className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button
                    onClick={() => setView("tree")}
                    className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                    style={{ color: bookTheme.inkSoft, minHeight: 40 }}
                  >
                    {dir === "rtl" ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                    {currentBook[lang]?.title || currentBook.en?.title || currentBook.ar?.title}
                  </button>
                  {books.length > 1 && (
                    <select
                      value={currentBook.id}
                      onChange={(e) => setBookId(e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 cursor-pointer"
                      style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, background: theme.surface, color: theme.ink }}
                    >
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {(lang === "ar" ? b.ar?.title : b.en?.title) || b.en?.title || b.ar?.title || b.id}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <EditorView
                  book={currentBook}
                  lang={lang}
                  theme={bookTheme}
                  skin={skin}
                  voiceEnabled={voiceEnabled}
                  onVoiceEnabledChange={setVoiceEnabled}
                  onUpdateBook={updateCurrentBook}
                  onChangeBookFlavor={(fid) => setBookFlavor(currentBook.id, fid)}
                  bookFlavorId={currentBookFlavorId}
                  onBackToTree={() => setView("tree")}
                />
              </div>
            ) : (
              <ViewEmptyState
                icon={PenLine}
                title={ui.editorEmptyTitle}
                sub={ui.editorEmptySub}
                theme={theme}
                skin={skin}
                ui={ui}
                books={books}
                lang={lang}
                onSelectBook={(id) => {
                  setBookId(id);
                  setView("editor");
                }}
                onCreateBook={() => handleCreateNewBook()}
              />
            )
          ) : view === "planner" ? (
            currentBook ? (
              <div key={currentBook.id} className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button
                    onClick={() => setView("tree")}
                    className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                    style={{ color: bookTheme.inkSoft, minHeight: 40 }}
                  >
                    {dir === "rtl" ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                    {currentBook[lang]?.title || currentBook.en?.title || currentBook.ar?.title}
                  </button>
                  {books.length > 1 && (
                    <select
                      value={currentBook.id}
                      onChange={(e) => setBookId(e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 cursor-pointer"
                      style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, background: theme.surface, color: theme.ink }}
                    >
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {(lang === "ar" ? b.ar?.title : b.en?.title) || b.en?.title || b.ar?.title || b.id}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <PlannerView
                  book={currentBook}
                  lang={lang}
                  ui={ui}
                  theme={bookTheme}
                  dir={dir}
                  skin={skin}
                  plan={currentPlan}
                  onUpdatePlan={updateCurrentPlan}
                />
              </div>
            ) : (
              <ViewEmptyState
                icon={CalendarDays}
                title={ui.plannerEmptyTitle}
                sub={ui.plannerEmptySub}
                theme={theme}
                skin={skin}
                ui={ui}
                books={books}
                lang={lang}
                onSelectBook={(id) => {
                  setBookId(id);
                  setView("planner");
                }}
                onCreateBook={() => handleCreateNewBook()}
              />
            )
          ) : view === "browse" ? (
            currentBook ? (
              <BrowseView
                key={currentBook.id}
                book={currentBook}
                lang={lang}
                ui={ui}
                theme={bookTheme}
                dir={dir}
                skin={skin}
                onBack={() => setView("tree")}
                bookFlavorId={currentBookFlavorId}
                onChangeBookFlavor={(fid) => setBookFlavor(currentBook.id, fid)}
              />
            ) : (
              <ViewEmptyState
                icon={ListFilter}
                title={ui.treeEmptyTitle}
                sub={ui.treeEmptySub}
                theme={theme}
                skin={skin}
                ui={ui}
                books={books}
                lang={lang}
                onSelectBook={(id) => {
                  setBookId(id);
                  setView("browse");
                }}
                onCreateBook={() => handleCreateNewBook()}
              />
            )
          ) : view === "readthrough" ? (
            currentBook ? (
              <section key={currentBook.id} className="w-full min-w-0">
                <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                  <button
                    onClick={() => setView("tree")}
                    className="flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: bookTheme.inkSoft, minHeight: 40 }}
                  >
                    {dir === "rtl" ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                    {currentBook[lang]?.title || currentBook.en?.title || currentBook.ar?.title}
                  </button>
                  <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, bookTheme)}`, background: bookTheme.surface }}>
                    <Palette size={13} style={{ color: bookTheme.inkSoft }} />
                    <span className="text-[11px] font-bold me-1" style={{ color: bookTheme.inkSoft }}>
                      {ui.bookFlavorLabel || (lang === "ar" ? "نكهة الكتاب:" : "Flavor:")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {Object.entries(FLAVORS).map(([fid, f]) => {
                        const pal = f[bookTheme === FLAVORS[fid]?.dark ? "dark" : "light"] || f.light;
                        const isSelected = currentBookFlavorId === fid;
                        return (
                          <button
                            key={fid}
                            onClick={() => setBookFlavor(currentBook.id, fid)}
                            className="relative p-0.5 rounded-full transition-transform hover:scale-110"
                            style={{
                              border: isSelected ? `2px solid ${bookTheme.ink}` : "1.5px solid transparent",
                              boxShadow: isSelected ? `0 0 0 1px ${bookTheme.accent}` : "none",
                            }}
                            title={f[lang] || fid}
                          >
                            <div
                              className="w-4 h-4 rounded-full flex overflow-hidden"
                              style={{ border: `1px solid ${pal.hairlineStrong}` }}
                            >
                              <span className="w-1/2 h-full" style={{ background: pal.canvas }} />
                              <span className="w-1/2 h-full" style={{ background: pal.accent }} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <FullBookA4Preview
                  book={currentBook}
                  lang={lang}
                  t={EDITOR_STR[lang]}
                  theme={bookTheme}
                  skin={skin}
                  docTitle={lang === "ar" ? currentBook.ar?.title : currentBook.en?.title}
                  readOnly={true}
                />
              </section>
            ) : (
              <ViewEmptyState
                icon={BookOpen}
                title={ui.editorEmptyTitle}
                sub={ui.editorEmptySub}
                theme={theme}
                skin={skin}
                ui={ui}
                books={books}
                lang={lang}
                onSelectBook={(id) => {
                  setBookId(id);
                  setView("readthrough");
                }}
                onCreateBook={() => handleCreateNewBook()}
              />
            )
          ) : currentLeaf && currentBook ? (
            <DeckView
              key={currentLeaf.id}
              node={currentLeaf}
              book={currentBook}
              lang={lang}
              ui={ui}
              theme={bookTheme}
              dir={dir}
              skin={skin}
              cardMode={cardMode}
              scrollDir={scrollDir}
              onBack={() => setView("tree")}
              plan={currentPlan}
              onToggleLeafDone={toggleLeafDone}
              onAnswered={handleDeckAnswer}
            />
          ) : currentBook ? (
            <TreeView
              key={currentBook.id}
              book={currentBook}
              lang={lang}
              ui={ui}
              theme={bookTheme}
              dir={dir}
              onBack={() => setView("library")}
              skin={skin}
              selectedLeaf={leafId}
              onSelectLeaf={openLeaf}
              onBrowse={() => setView("browse")}
              onReadThrough={() => setView("readthrough")}
              onPlanner={() => setView("planner")}
              onEditor={isEditorDisabled ? undefined : () => setView("editor")}
              onExport={!isStandalone && !disableHtmlExport && onExportBook ? () => handleExportBook(currentBook, lang, bookTheme, ui, skin, covers) : undefined}
              covers={covers}
              onChangeCover={setCover}
              onClearCover={clearCover}
              bookFlavorId={currentBookFlavorId}
              onChangeBookFlavor={(fid) => setBookFlavor(currentBook.id, fid)}
              onDeleteBook={isStandalone ? undefined : requestDeleteBook}
              plan={currentPlan}
            />
          ) : (
            <LibraryView
              lang={lang}
              ui={ui}
              theme={theme}
              dir={dir}
              onOpen={openBook}
              skin={skin}
              covers={covers}
              onChangeCover={setCover}
              onClearCover={clearCover}
              books={books}
              collections={collections}
              libraryPath={libraryPath}
              onEnterCollection={enterCollection}
              onCrumb={crumbTo}
              onCreateCollection={createCollection}
              onDeleteCollection={deleteCollection}
              onAssignToCollection={assignToCollection}
              onRemoveFromCollection={removeFromCollection}
              onMoveItem={moveToCollection}
              onCreateNewBook={handleCreateNewBook}
              onExportBook={!isStandalone && onExportBook ? (book, format = "html") => {
                if (format === "json") {
                  handleExportSingleBookJson(book);
                } else {
                  const bFid = (book && bookFlavors[book.id]) || flavorId;
                  const bTheme = FLAVORS[bFid] ? FLAVORS[bFid][mode] : theme;
                  handleExportBook(book, lang, bTheme, ui, skin, covers);
                }
              } : undefined}
              onExportCollection={!isStandalone && onExportCollection ? (col) => handleExportCollection(col, books, collections, lang, theme, ui, skin, covers) : undefined}
              isExporting={isExporting}
              onRescan={() => rescanBooks(false)}
              isScanning={isScanning}
              onOpenImportModal={() => setImportModalOpen(true)}
              onOpenPluginsModal={() => setPluginsModalOpen(true)}
              disableHtmlExport={disableHtmlExport}
              onDeleteBook={isStandalone ? undefined : requestDeleteBook}
              plans={plans}
              onExportDatabase={handleExportFullDatabase}
              onRestoreDatabase={() => dbFileInputRef.current?.click()}
            />
          )}
        </div>
        </ErrorBoundary>
      </div>

      {settingsOpen && (
        <SettingsPanel
          ui={ui}
          theme={theme}
          dir={dir}
          skinId={skinId}
          onSkinChange={setSkinId}
          flavorId={flavorId}
          onFlavorChange={setFlavorId}
          mode={mode}
          cardMode={cardMode}
          onCardModeChange={setCardMode}
          scrollDir={scrollDir}
          onScrollDirChange={setScrollDir}
          voiceEnabled={voiceEnabled}
          onVoiceEnabledChange={setVoiceEnabled}
          disableEditorInExport={disableEditorInExport}
          onDisableEditorInExportChange={handleDisableEditorInExportChange}
          disableHtmlExport={disableHtmlExport}
          onDisableHtmlExportChange={handleDisableHtmlExportChange}
          isExportSeed={Boolean(EXPORT)}
          onClose={() => setSettingsOpen(false)}
          onReset={resetAll}
          onExportDatabase={handleExportFullDatabase}
          onRestoreDatabase={() => dbFileInputRef.current?.click()}
        />
      )}

      {/* Hidden file input for database dump restoration */}
      <input
        type="file"
        ref={dbFileInputRef}
        accept=".json"
        onChange={handleSelectRestoreFile}
        style={{ display: "none" }}
      />

      {restoreModalData && (
        <RestoreDatabaseModal
          isOpen={!!restoreModalData}
          onClose={() => setRestoreModalData(null)}
          dumpData={restoreModalData}
          onConfirm={handleExecuteRestore}
          isRestoring={isRestoringDb}
          lang={lang}
          ui={ui}
          theme={theme}
          skin={skin}
        />
      )}

      {importModalOpen && (
        <ImportModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
          existingBooks={books}
          existingCollections={collections}
          ui={ui}
          lang={lang}
          dir={dir}
          theme={theme}
          skin={skin}
        />
      )}

      {pluginsModalOpen && (
        <TitaniumPluginsModal
          isOpen={pluginsModalOpen}
          onClose={() => setPluginsModalOpen(false)}
          lang={lang}
          dir={dir}
          theme={theme}
          skin={skin}
        />
      )}
      {/* Toast Notification Container (compliant with Web Interface Guidelines) */}
      {exportToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-3 duration-200"
          style={{
            background: exportToast.type === "error" ? "#EF4444" : exportToast.type === "success" ? "#10B981" : theme.surface,
            color: exportToast.type === "info" ? theme.ink : "#FFFFFF",
            borderColor: exportToast.type === "info" ? theme.hairlineStrong : "transparent",
            maxWidth: "90vw",
            boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
          }}
        >
          {exportToast.type === "info" ? (
            <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
          ) : exportToast.type === "success" ? (
            <CheckCircle2 size={16} className="shrink-0 text-white" />
          ) : (
            <span className="text-base shrink-0">⚠️</span>
          )}
          <span className="truncate">{exportToast.message}</span>
          <button
            onClick={() => setExportToast(null)}
            className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity shrink-0"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Real Filesystem Delete Confirmation Modal (Web Interface Guidelines compliant) */}
      {confirmDeleteBook && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => !isDeleting && setConfirmDeleteBook(null)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl shadow-2xl border flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
            style={{
              background: theme.surface,
              borderColor: theme.hairlineStrong,
              color: theme.ink,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 shrink-0">
                <Trash2 size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="delete-dialog-title" className="text-base font-bold">
                  {lang === "ar" ? "حذف كتاب نهائيًا من القرص" : "Permanently Delete Book"}
                </h3>
                <p className="text-xs truncate font-medium mt-0.5" style={{ color: theme.inkSoft }}>
                  {confirmDeleteBook[lang]?.title || confirmDeleteBook.id}
                </p>
              </div>
            </div>

            <div className="text-xs leading-relaxed p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400">
              <p className="font-semibold mb-1">
                {lang === "ar" ? "تحذير: هذا الحذف حقيقي على نظام الملفات!" : "Warning: This action deletes physical files!"}
              </p>
              <p>
                {lang === "ar"
                  ? "سيتم مسح مجلد الكتاب وملفاته بالكامل من القرص الصلب. لا يمكن التراجع عن هذا الإجراء."
                  : "The book folder and its contents will be permanently deleted from your storage. This cannot be undone."}
              </p>
              {confirmDeleteBook._sourcePath && (
                <code className="block mt-2 text-[11px] p-1.5 rounded bg-black/10 dark:bg-white/5 truncate font-mono text-gray-700 dark:text-gray-300">
                  {confirmDeleteBook._sourcePath}
                </code>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteBook(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold rounded-xl border transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
              >
                {ui.cancel || (lang === "ar" ? "إلغاء" : "Cancel")}
              </button>
              <button
                type="button"
                onClick={executeDeleteBook}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                {lang === "ar" ? (isDeleting ? "جارٍ الحذف..." : "حذف نهائي من القرص") : (isDeleting ? "Deleting..." : "Delete from disk")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile App Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden flex items-center justify-around px-2 py-1 educraft-glass border-t shadow-lg"
        style={{
          background: skin.surfaceAlpha >= 1 ? theme.header : hexToRgba(theme.header, Math.max(skin.surfaceAlpha, 0.92)),
          borderColor: skinBorderColor(skin, theme),
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          paddingBottom: "max(0.4rem, env(safe-area-inset-bottom, 0.4rem))",
        }}
        aria-label="Mobile Navigation"
      >
        <button
          type="button"
          onClick={() => setView("library")}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer min-w-0"
          style={{
            color: view === "library" ? theme.accent : theme.inkSoft,
            fontWeight: view === "library" ? 700 : 500,
          }}
        >
          <div
            className="p-1 rounded-lg transition-all"
            style={{
              background: view === "library" ? theme.accentSoft : "transparent",
            }}
          >
            <Library size={18} style={{ color: view === "library" ? theme.accent : theme.inkSoft }} />
          </div>
          <span className="text-[10px] leading-none truncate max-w-full">{ui.navLibrary}</span>
        </button>

        <button
          type="button"
          onClick={() => setView("tree")}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer min-w-0"
          style={{
            color: view === "tree" ? theme.accent : theme.inkSoft,
            fontWeight: view === "tree" ? 700 : 500,
          }}
        >
          <div
            className="p-1 rounded-lg transition-all"
            style={{
              background: view === "tree" ? theme.accentSoft : "transparent",
            }}
          >
            <GitBranch size={18} style={{ color: view === "tree" ? theme.accent : theme.inkSoft }} />
          </div>
          <span className="text-[10px] leading-none truncate max-w-full">{ui.navTree}</span>
        </button>

        {!isEditorDisabled && (
          <button
            type="button"
            onClick={() => setView("editor")}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer min-w-0"
            style={{
              color: view === "editor" ? theme.accent : theme.inkSoft,
              fontWeight: view === "editor" ? 700 : 500,
            }}
          >
            <div
              className="p-1 rounded-lg transition-all"
              style={{
                background: view === "editor" ? theme.accentSoft : "transparent",
              }}
            >
              <Settings size={18} style={{ color: view === "editor" ? theme.accent : theme.inkSoft }} />
            </div>
            <span className="text-[10px] leading-none truncate max-w-full">{ui.navEditor}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setView("planner")}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer min-w-0"
          style={{
            color: view === "planner" ? theme.accent : theme.inkSoft,
            fontWeight: view === "planner" ? 700 : 500,
          }}
        >
          <div
            className="p-1 rounded-lg transition-all"
            style={{
              background: view === "planner" ? theme.accentSoft : "transparent",
            }}
          >
            <CalendarDays size={18} style={{ color: view === "planner" ? theme.accent : theme.inkSoft }} />
          </div>
          <span className="text-[10px] leading-none truncate max-w-full">{ui.navPlanner}</span>
        </button>
      </nav>
    </div>
  );
}



/* =================================================================
   RUST EXPORT ARCHITECTURE — Book and collection exports are handled
   exclusively by the Rust backend engine (src-tauri/src/export_engine).
   The frontend communicates via Tauri IPC commands `export_book` and
   `export_collection`, ensuring type safety, validation, and zero
   UI drift.
================================================================== */
function skinIdOf(skin) {
  return Object.keys(SKINS).find((k) => SKINS[k] === skin) || "normal";
}
function flavorIdOf(theme) {
  return Object.keys(FLAVORS).find((k) => FLAVORS[k].light === theme || FLAVORS[k].dark === theme) || "normal";
}

/* ─── Tauri environment check ────────────────────────────────────────────── */
function isTauriEnv() {
  return typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;
}

function downloadBlob(content, filename, mimeType = "text/html; charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ─── Rust-Powered Full Database Export & Restore ────────────────────────── */
async function exportFullDatabaseViaRust(collections, bookFlavors, covers, plans) {
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return await invoke("export_full_database", { collections, bookFlavors, covers, plans });
    } catch (err) {
      console.error("[EDUcraft DatabaseDump] Tauri export error:", err);
      throw err;
    }
  }

  const res = await fetch("/__api/database/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collections, bookFlavors, covers, plans }),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `HTTP ${res.status}`);
  }
  return await res.text();
}

async function importFullDatabaseViaRust(dumpData, mode = "merge") {
  const dumpJson = typeof dumpData === "string" ? dumpData : JSON.stringify(dumpData);
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return await invoke("import_full_database", { dumpJson, mode });
    } catch (err) {
      console.error("[EDUcraft DatabaseDump] Tauri restore error:", err);
      throw err;
    }
  }

  const res = await fetch("/__api/database/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dump: typeof dumpData === "string" ? JSON.parse(dumpData) : dumpData, mode }),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `HTTP ${res.status}`);
  }
  return await res.json();
}

/* ─── Rust-Powered Book Export ─────────────────────────────────────────────── */
async function exportBookViaRust(book, lang, theme, ui, skin, covers, disableEditorInExport) {
  covers = covers || {};
  const currentFlavor = flavorIdOf(theme);
  const title = book?.[lang]?.title || book?.id;
  const filename = `${slugify(title) || book?.id || "book"}.html`;
  const seed = {
    id: book.id,
    startBookId: book.id,
    books: [book],
    collections: [],
    lang,
    skinId: skinIdOf(skin),
    flavorId: currentFlavor,
    bookFlavors: { [book.id]: currentFlavor },
    covers: covers[book.id] ? { [book.id]: covers[book.id] } : {},
    disableEditor: Boolean(disableEditorInExport),
  };

  // 1. Tauri desktop application path
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const savedPath = await invoke("export_book", { seed, outputPath: null });
      return savedPath;
    } catch (err) {
      console.error("[EDUcraft Rust Exporter] Tauri export_book error:", err);
      throw err;
    }
  }

  // 2. Web browser / Vite dev server path: Call Rust exporter bridge via HTTP
  try {
    const res = await fetch("/__api/export_book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seed),
    });

    if (res.ok) {
      const html = await res.text();
      downloadBlob(html, filename);
      return filename;
    } else {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("[EDUcraft Rust Exporter] Dev server bridge error:", err);
    throw err;
  }
}

/* ─── Rust-Powered Collection Export ───────────────────────────────────────── */
async function exportCollectionViaRust(collection, books, collections, lang, theme, ui, skin, covers, disableEditorInExport) {
  covers = covers || {};
  const currentFlavor = flavorIdOf(theme);
  const subtree = resolveCollectionSubtree(collection, collections || []);
  const flatBooks = resolveCollectionBooks(collection, collections || [], books);
  const filename = `${slugify(collection.title) || collection.id || "collection"}.html`;
  const seedCovers = {};
  const seedFlavors = {};
  flatBooks.forEach((b) => {
    if (covers[b.id]) seedCovers[b.id] = covers[b.id];
    seedFlavors[b.id] = currentFlavor;
  });
  const seed = {
    id: collection.id,
    startBookId: flatBooks[0] ? flatBooks[0].id : null,
    books: flatBooks,
    collections: subtree,
    lang,
    skinId: skinIdOf(skin),
    flavorId: currentFlavor,
    bookFlavors: seedFlavors,
    covers: seedCovers,
    disableEditor: Boolean(disableEditorInExport),
  };

  // 1. Tauri desktop application path
  if (isTauriEnv()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const savedPath = await invoke("export_collection", {
        seed,
        collectionTitle: collection.title,
        outputPath: null,
      });
      return savedPath;
    } catch (err) {
      console.error("[EDUcraft Rust Exporter] Tauri export_collection error:", err);
      throw err;
    }
  }

  // 2. Web browser / Vite dev server path: Call Rust exporter bridge via HTTP
  try {
    const res = await fetch("/__api/export_collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seed),
    });

    if (res.ok) {
      const html = await res.text();
      downloadBlob(html, filename);
      return filename;
    } else {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("[EDUcraft Rust Exporter] Dev server collection bridge error:", err);
    throw err;
  }
}

export default function EDUcraft() {
  return (
    <ErrorBoundary onReset={() => window.location.reload()}>
      <EDUcraftApp onExportBook={exportBookViaRust} onExportCollection={exportCollectionViaRust} />
    </ErrorBoundary>
  );
}
