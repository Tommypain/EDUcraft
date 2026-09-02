import React, { useState, useMemo, useEffect, useRef } from "react";
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
  X,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Layers,
  Palette,
  Pencil,
  Upload,
  FileUp,
  FileDown,
  ImagePlus,
  FolderOpen,
  FolderPlus,
  Folders,
  BookCopy,
  Plus,
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
  Heading2,
  Tag,
  StickyNote,
  AlertTriangle,
  AlertCircle,
  Code2,
  CornerDownLeft,
  Wand2,
} from "lucide-react";
import { ImportModal } from "./utils/ImportModal.jsx";
import { SyntaxCodeBlock } from "./utils/syntax.jsx";
import { KnowledgeTreeEnhanced } from "./utils/KnowledgeTree.jsx";
import masterLibraryData from "./data/educraft_master_library.json";
import { EDUCRAFT_EXPORT_BUNDLE_JS, EDUCRAFT_EXPORT_TAILWIND_CSS } from "./data/export_bundle_data.js";

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
    libraryNewFolder: "New folder",
    libraryNewEncyclopedia: "New encyclopedia",
    collectionNamePromptFolder: "Name this folder",
    collectionNamePromptEncyclopedia: "Name this encyclopedia",
    libraryAddToFolder: "Add to…",
    libraryRemoveFromCollection: "Remove",
    libraryDeleteCollection: "Delete",
    libraryDeleteCollectionConfirm: "Delete this — the books and encyclopedias inside go back to the main library. Continue?",
    libraryEmptyCollection: "Nothing in here yet. Go back to the library and use \"Add to…\" on a book or encyclopedia to file it here.",
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
    exportToast: "اتحمّل — افتح الملف بأي متصفح، وهيشتغل من غير نت خالص.",
    libraryNewFolder: "شنطة جديدة",
    libraryNewEncyclopedia: "موسوعة جديدة",
    collectionNamePromptFolder: "اسم الشنطة",
    collectionNamePromptEncyclopedia: "اسم الموسوعة",
    libraryAddToFolder: "ضيفه لـ…",
    libraryRemoveFromCollection: "شيله من هنا",
    libraryDeleteCollection: "احذف",
    libraryDeleteCollectionConfirm: "هتمسح ده — الكتب والموسوعات اللي جواه هترجع للمكتبة الرئيسية. تكمل؟",
    libraryEmptyCollection: "مفيش حاجة هنا لسه. ارجع للمكتبة واستخدم \"ضيفه لـ…\" على أي كتاب أو موسوعة عشان تحطه هنا.",
    folderBadge: "شنطة",
    encyclopediaBadge: "موسوعة",
    booksCountLabel: "كتب",
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
    case "multi":
      if (!Array.isArray(value)) return false;
      return [...value].sort().join(",") === [...c.correct].sort().join(",");
    case "tf":
      return value === c.correct;
    case "short":
      return c.accepted.includes(String(value || "").trim().toLowerCase());
    case "fill":
      return c.blanks.every((b, i) => (value[i] || "").trim().toLowerCase() === b.toLowerCase());
    case "cloze":
      return value === c.correct;
    case "match":
      return c.left.every((_, i) => value[i] === c.correct[i]);
    case "order":
      return c.correct.every((v, i) => value[i] === v);
    case "sort":
      return c.items.every((it, i) => value[i] === it[1]);
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
  if (leaf.cards) return leaf.cards;
  return leaf.questions.map((q, i) => ({
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
    return JSON.parse(window.localStorage.getItem(APP_STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveAppState(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}
function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
/* A collection is a folder (شنطة) or an encyclopedia (موسوعة). Folders
   can hold books and encyclopedias; encyclopedias hold only books —
   both are the same shape so the Library can render them uniformly. */
function parentCollectionOf(itemId, collections) {
  return collections.find((c) => c.itemIds.includes(itemId)) || null;
}
function rootLibraryItems(collections, books) {
  const childIds = new Set(collections.flatMap((c) => c.itemIds));
  return {
    rootCollections: collections.filter((c) => !childIds.has(c.id)),
    rootBooks: books.filter((b) => !childIds.has(b.id)),
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
        className="w-full resize-none rounded-2xl border-2 px-4 py-3 text-sm outline-none"
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
  const c = q[lang];
  const meta = TYPE_META[q.type];
  const initialValue = q.type === "multi" ? [] : q.type === "match" || q.type === "sort" ? {} : q.type === "order" ? c.items : undefined;
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

      <p dir={q.dir} className="text-base font-semibold leading-relaxed">
        {c.prompt || c.template}
      </p>

      {(q.code || c.code) && (
        <SyntaxCodeBlock
          code={typeof (q.code || c.code) === "object" ? (q.code || c.code).src : (q.code || c.code)}
          lang={q.code?.lang || q.code_language || c.code_language || q.codeLang}
          title={typeof (q.code || c.code) === "object" ? (q.code || c.code).title : undefined}
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
      {group.questions.map((q, i) => (
        <QuestionItem
          key={i}
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

  const imageBlock = (fullWidth) => (
    <div
      className="shrink-0"
      style={
        fullWidth
          ? { width: "100%", aspectRatio: "16/9" }
          : { width: "38%", minWidth: 110, alignSelf: "stretch" }
      }
    >
      <img src={group.image} alt="" className="w-full h-full" style={{ objectFit: "cover", objectPosition: "center", display: "block" }} />
    </div>
  );

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
  const c = q[lang];
  const meta = TYPE_META[q.type];
  const initialValue = q.type === "multi" ? [] : q.type === "match" || q.type === "sort" ? {} : q.type === "order" ? c.items : undefined;
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

      <p dir={q.dir} className="text-base font-semibold leading-relaxed">
        {c.prompt || c.template}
      </p>

      {(q.code || c.code) && (
        <SyntaxCodeBlock
          code={typeof (q.code || c.code) === "object" ? (q.code || c.code).src : (q.code || c.code)}
          lang={q.code?.lang || q.code_language || c.code_language || q.codeLang}
          title={typeof (q.code || c.code) === "object" ? (q.code || c.code).title : undefined}
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
function NodeQuestionDeck({ node, book, lang, ui, theme, dir, skin, cardMode = "paged", scrollDir = "vertical" }) {
  const [index, setIndex] = useState(0);
  const cards = useMemo(() => leafCards(node), [node]);
  const multi = cards.length > 1;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const scrolling = cardMode === "scroll" && multi;
  const horizontal = scrolling && scrollDir === "horizontal";
  const totalQuestions = cards.reduce((n, g) => n + g.questions.length, 0);

  useEffect(() => setIndex(0), [node.id]);

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
              {book[lang].title}
            </span>
            <span className="text-sm font-bold truncate" style={{ color: theme.ink }}>
              {node[lang]}
            </span>
          </div>
        </div>
        {multi && !scrolling && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1" style={{ borderRadius: skin.radiusSm, background: theme.canvas, color: theme.inkSoft }}>
              {ui.deckQuestion} {index + 1} {ui.deckOf} {cards.length}
            </span>
            <button
              aria-label={ui.prev}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="grid place-items-center disabled:opacity-30"
              style={{ width: 32, height: 32, borderRadius: skin.radiusSm, border: `1px solid ${skinBorderColor(skin, theme)}`, color: theme.ink }}
            >
              <PrevIcon size={15} />
            </button>
            <button
              aria-label={ui.next}
              onClick={() => setIndex((i) => Math.min(cards.length - 1, i + 1))}
              disabled={index === cards.length - 1}
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
            <div key={group.id || `${node.id}-${i}`} style={horizontal ? { flex: "0 0 min(88vw, 420px)", scrollSnapAlign: "start" } : undefined}>
              <QuestionGroupCard group={group} lang={lang} ui={ui} theme={theme} skin={skin} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-2.5 sm:p-3.5">
          <QuestionGroupCard key={cards[index].id || `${node.id}-${index}`} group={cards[index]} lang={lang} ui={ui} theme={theme} skin={skin} />
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
                width: i === index ? 18 : 6,
                height: 6,
                borderRadius: skin.radiusSm,
                background: i === index ? theme.accent : theme.hairlineStrong,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
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
   LibraryView — the shelf. Each card is the cover + title + a
   quick tally of branches / questions inside that book's tree.
================================================================== */
function LibraryView({ lang, ui, theme, dir, onOpen, skin, covers, onChangeCover, onClearCover, books, collections, libraryPath, onEnterCollection, onCrumb, onCreateCollection, onDeleteCollection, onAssignToCollection, onRemoveFromCollection, onExportBook, onExportCollection, onOpenImportModal, onDeleteBook, plans = {} }) {
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
  const atRoot = libraryPath.length === 0;
  const currentCollection = atRoot ? null : collections.find((c) => c.id === libraryPath[libraryPath.length - 1]);

  let itemBooks = [];
  let itemCollections = [];
  if (atRoot) {
    const { rootCollections, rootBooks } = rootLibraryItems(collections, books);
    itemCollections = rootCollections;
    itemBooks = rootBooks;
  } else if (currentCollection) {
    itemCollections = collections.filter((c) => currentCollection.itemIds.includes(c.id));
    itemBooks = books.filter((b) => currentCollection.itemIds.includes(b.id));
  }

  // where a root-level item can be filed: folders take books+encyclopedias, encyclopedias take books only
  const foldersAvailable = collections.filter((c) => c.kind === "folder");
  const targetsFor = (kind) => (kind === "book" ? collections.filter((c) => c.kind === "folder" || c.kind === "encyclopedia") : foldersAvailable);

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
            <button onClick={() => onCrumb(0)} className="hover:underline" style={{ color: theme.inkSoft }}>
              {ui.libraryRootCrumb}
            </button>
            {libraryPath.map((id, i) => {
              const c = collections.find((x) => x.id === id);
              if (!c) return null;
              return (
                <span key={id} className="flex items-center gap-1.5">
                  <ChevronRight size={11} style={{ transform: dir === "rtl" ? "scaleX(-1)" : "none" }} />
                  <button onClick={() => onCrumb(i + 1)} className="hover:underline" style={{ color: i === libraryPath.length - 1 ? theme.ink : theme.inkSoft }}>
                    {c.title}
                  </button>
                </span>
              );
            })}
          </div>
          {currentCollection && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-2xl font-bold" style={{ fontFamily: ui.displayFont, color: theme.ink }}>
                {currentCollection.title}
              </h1>
              <button
                onClick={() => onDeleteCollection(currentCollection.id)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5"
                style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${INCORRECT.border}`, color: INCORRECT.border }}
              >
                <Trash2 size={12} />
                {ui.libraryDeleteCollection}
              </button>
            </div>
          )}
        </div>
      )}

      {atRoot && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 text-white shadow-sm"
            style={{ borderRadius: skin.radiusSm, background: theme.accent, border: `1.5px solid ${theme.accent}`, minHeight: 36 }}
            title={ui.libraryImportJson}
          >
            <FileUp size={13} />
            {ui.libraryImportJson}
          </button>
          <button
            onClick={() => onCreateCollection("folder")}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
          >
            <FolderPlus size={13} />
            {ui.libraryNewFolder}
          </button>
          <button
            onClick={() => onCreateCollection("encyclopedia")}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
          >
            <Plus size={13} />
            {ui.libraryNewEncyclopedia}
          </button>
        </div>
      )}

      {!atRoot && itemCollections.length === 0 && itemBooks.length === 0 && (
        <p className="text-sm p-5" style={{ ...panelStyle(skin, theme, { soft: true }), color: theme.inkSoft }}>
          {ui.libraryEmptyCollection}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {itemCollections.map((col) => {
          const Icon = CollectionIcon(col.kind);
          const childCount = col.itemIds.length;
          return (
            <div key={col.id} className="group flex gap-4 p-4 text-start" style={{ ...panelStyle(skin, theme), cursor: "pointer" }} onClick={() => onEnterCollection(col.id)} role="button" tabIndex={0}>
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
                  <div className="flex items-center gap-1.5">
                    {onExportCollection && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportCollection(col);
                        }}
                        className="p-1.5"
                        style={{ borderRadius: skin.radiusSm, color: theme.inkSoft }}
                        aria-label={ui.treeExportCta}
                        title={ui.treeExportCta}
                      >
                        <FileDown size={13} />
                      </button>
                    )}
                    {atRoot ? (
                    col.kind === "encyclopedia" && foldersAvailable.length > 0 ? (
                      <select
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => e.target.value && onAssignToCollection(col.id, e.target.value)}
                        defaultValue=""
                        className="text-[11px] font-bold px-2 py-1"
                        style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, background: theme.surface, color: theme.ink }}
                      >
                        <option value="">{ui.libraryAddToFolder}</option>
                        {foldersAvailable.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <ArrowIcon size={14} style={{ color: theme.inkSoft }} />
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromCollection(col.id);
                      }}
                      className="text-[11px] font-bold px-2 py-1"
                      style={{ borderRadius: skin.radiusSm, color: theme.inkSoft }}
                    >
                      <X size={11} className="inline" /> {ui.libraryRemoveFromCollection}
                    </button>
                  )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {itemBooks.map((book) => {
          const branchCount = book.nodes.filter((n) => n.level === "branch").length;
          const questionCount = book.nodes.reduce((sum, n) => sum + (n.level === "leaf" ? leafCards(n).reduce((s, g) => s + g.questions.length, 0) : 0), 0);
          const totalLeaves = book.nodes.filter((n) => n.level === "leaf").length;
          const doneLeaves = (plans[book.id]?.doneLeafIds || []).filter((id) => book.nodes.some((n) => n.id === id)).length;
          const progressPct = totalLeaves > 0 ? Math.round((doneLeaves / totalLeaves) * 100) : 0;
          const targets = targetsFor("book");
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
                    {book[lang].title}
                  </h3>
                  <p className="text-sm" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
                    {book[lang].tagline}
                  </p>
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
                  <div className="flex items-center gap-1.5">
                    {onExportBook && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportBook(book);
                        }}
                        className="p-1.5"
                        style={{ borderRadius: skin.radiusSm, color: theme.inkSoft }}
                        aria-label={ui.treeExportCta}
                        title={ui.treeExportCta}
                      >
                        <FileDown size={13} />
                      </button>
                    )}
                    {onDeleteBook && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(ui.libraryDeleteBookConfirm)) {
                            onDeleteBook(book.id);
                          }
                        }}
                        className="p-1.5 hover:opacity-100 transition-opacity"
                        style={{ borderRadius: skin.radiusSm, color: INCORRECT.border }}
                        aria-label={ui.libraryDeleteBook}
                        title={ui.libraryDeleteBook}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    {atRoot ? (
                    targets.length > 0 ? (
                      <select
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => e.target.value && onAssignToCollection(book.id, e.target.value)}
                        defaultValue=""
                        className="text-[11px] font-bold px-2 py-1"
                        style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, background: theme.surface, color: theme.ink }}
                      >
                        <option value="">{ui.libraryAddToFolder}</option>
                        {targets.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors" style={{ background: theme.accentSoft, color: theme.accent }}>
                        {ui.openBook}
                        <ArrowIcon size={12} />
                      </span>
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromCollection(book.id);
                      }}
                      className="text-[11px] font-bold px-2 py-1"
                      style={{ borderRadius: skin.radiusSm, color: theme.inkSoft }}
                    >
                      <X size={11} className="inline" /> {ui.libraryRemoveFromCollection}
                    </button>
                  )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =================================================================
   TreeView — breadcrumb back to the library, the book's own mini
   cover + title, its knowledge tree, and — once a leaf is picked —
   the question deck for that leaf.
================================================================== */
function TreeView({ book, lang, ui, theme, dir, onBack, skin, selectedLeaf, onSelectLeaf, onBrowse, onReadThrough, onPlanner, onExport, covers, onChangeCover, onClearCover, bookFlavorId, onChangeBookFlavor, onDeleteBook }) {
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <section>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5" style={{ color: theme.inkSoft, minHeight: 40 }}>
        <BackIcon size={15} />
        {ui.backToLibrary}
      </button>

      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="shrink-0" style={{ width: 56, height: 74, borderRadius: skin.radiusMd * 0.55, overflow: "hidden" }}>
            <EditableCover book={book} theme={theme} skin={skin} ui={ui} coverUrl={covers[book.id]} onChangeCover={onChangeCover} onClearCover={onClearCover} radius={skin.radiusMd * 0.55} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: ui.displayFont, color: theme.ink, lineHeight: 1.25 }}>
              {book[lang].title}
            </h1>
            <p className="text-sm" style={{ color: theme.inkSoft }}>
              {book[lang].tagline}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onReadThrough && (
            <button
              onClick={onReadThrough}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2.5"
              style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 44 }}
            >
              <BookOpen size={15} />
              {ui.readThroughCta}
            </button>
          )}
          <button
            onClick={onBrowse}
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2.5"
            style={{ borderRadius: skin.radiusSm, background: theme.accent, color: theme.accentInk, minHeight: 44 }}
          >
            <ListFilter size={15} />
            {ui.browseCta}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {/* Per-Book Flavor Swatches Picker */}
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

        <button
          onClick={onPlanner}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2"
          style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
        >
          <CalendarDays size={13} />
          {ui.treePlannerCta}
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
          >
            <FileDown size={13} />
            {ui.treeExportCta}
          </button>
        )}
        {onDeleteBook && (
          <button
            onClick={() => {
              if (window.confirm(ui.libraryDeleteBookConfirm)) {
                onDeleteBook(book.id);
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 hover:opacity-90 transition-opacity"
            style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${INCORRECT.border}`, color: INCORRECT.border, minHeight: 36 }}
            title={ui.libraryDeleteBook}
          >
            <Trash2 size={13} />
            {ui.libraryDeleteBook}
          </button>
        )}
      </div>

      {/* The tree is navigation only: it maps how branches, sub-branches
          and leaves relate to one another (including the dashed cross-
          branch links). Tapping a leaf never shows questions here — it
          takes you to a dedicated question-deck screen (see DeckView). */}
      <div className="p-6 sm:p-8" style={panelStyle(skin, theme)}>
        <p className="text-xs font-semibold mb-2" style={{ color: theme.accent }}>
          {ui.treeEyebrow}
        </p>
        <p className="text-sm mb-6 max-w-lg" style={{ color: theme.inkSoft, lineHeight: 1.7 }}>
          {ui.treeSub}
        </p>
        <KnowledgeTree book={book} lang={lang} dir={dir} theme={theme} ui={ui} skin={skin} selected={selectedLeaf} onSelect={onSelectLeaf} doneLeafIds={plan?.doneLeafIds || []} />
      </div>
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
function DeckView({ node, book, lang, ui, theme, dir, skin, cardMode, scrollDir, onBack, plan, onToggleLeafDone, onAnswered }) {
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const isDone = plan?.doneLeafIds?.includes(node.id);
  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: theme.inkSoft, minHeight: 40 }}>
          <BackIcon size={15} />
          {book[lang].title}
        </button>
        {onToggleLeafDone && (
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
      <NodeQuestionDeck node={node} book={book} lang={lang} ui={ui} theme={theme} dir={dir} skin={skin} cardMode={cardMode} scrollDir={scrollDir} onAnswered={onAnswered} />
    </section>
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
function BrowseView({ book, lang, ui, theme, dir, skin, onBack }) {
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
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5" style={{ color: theme.inkSoft, minHeight: 40 }}>
        <BackIcon size={15} />
        {book[lang].title}
      </button>

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
function SettingsPanel({ ui, theme, dir, skinId, onSkinChange, flavorId, onFlavorChange, mode, cardMode, onCardModeChange, scrollDir, onScrollDirChange, voiceEnabled, onVoiceEnabledChange, onClose, onReset }) {
  const skin = SKINS[skinId];
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

        <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${theme.hairline}` }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.inkSoft }}>
            {ui.settingsDataLabel}
          </p>
          <p className="text-xs mb-3" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
            {ui.settingsDataSub}
          </p>
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
    blockTitle: "Title", blockText: "Text", imageUrl: "Image URL", imageCaption: "Caption", imageTitle: "Image title", imageMeta: "Source / note",
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
    blockTitle: "العنوان", blockText: "النص", imageUrl: "رابط الصورة", imageCaption: "التعليق", imageTitle: "عنوان الصورة", imageMeta: "المصدر / ملاحظة",
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
      className="w-full text-sm px-3 py-2"
      style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.ink }}
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
  const btnStyle = { borderRadius: 6, color: theme.ink, background: theme.surface, border: `1px solid ${theme.hairline}` };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5 p-1.5" style={{ borderRadius: skin.radiusSm, background: theme.surfaceSoft, border: `1px solid ${theme.hairline}` }}>
        <button type="button" onClick={() => exec("bold")} className="w-7 h-7 grid place-items-center font-black text-xs" style={btnStyle} title="Bold">
          B
        </button>
        {COLORS.map((c) => (
          <button key={c} type="button" onClick={() => exec("foreColor", c)} className="w-5 h-5 rounded-full shrink-0" style={{ background: c, border: `1px solid ${theme.hairlineStrong}` }} title={c} />
        ))}
        <select onChange={(e) => e.target.value && exec("fontName", e.target.value)} className="text-xs px-1.5 py-1" style={{ ...btnStyle, maxWidth: 84 }} defaultValue="">
          <option value="" disabled>
            Aa
          </option>
          <option value="monospace">Mono</option>
          <option value="Georgia">Serif</option>
          <option value="sans-serif">Sans</option>
        </select>
        <span className="w-px h-5 mx-0.5" style={{ background: theme.hairlineStrong }} />
        <button type="button" onClick={() => wrapBdi("auto")} className="text-[10px] font-bold px-2 py-1" style={btnStyle} title="BDI — auto isolate">
          bdi
        </button>
        <button type="button" onClick={() => wrapBdi("ltr")} className="text-[10px] font-bold px-2 py-1" style={btnStyle}>
          LTR
        </button>
        <button type="button" onClick={() => wrapBdi("rtl")} className="text-[10px] font-bold px-2 py-1" style={btnStyle}>
          RTL
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        dir="auto"
        onInput={() => onChange(ref.current.innerHTML)}
        className="w-full text-sm px-3 py-2.5 outline-none"
        style={{ minHeight, borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.ink, lineHeight: 1.7 }}
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
            className="w-full text-sm px-3 py-2"
            style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.ink }}
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
              className="w-full text-sm px-3 py-2"
              style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.ink, fontFamily: "monospace" }}
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
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5" style={{ background: meta.color.bg, color: meta.color.ink }}>
        <div className="flex items-center gap-2">
          <meta.Icon size={14} />
          <span className="text-xs font-bold">{lang === "ar" ? meta.ar : meta.en}</span>
        </div>
        <button onClick={onDelete} className="w-6 h-6 grid place-items-center" style={{ borderRadius: 999, background: "rgba(0,0,0,0.12)" }} title={t.delete}>
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
              className="w-full text-sm px-3 py-2"
              style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: theme.canvas, color: theme.ink, fontFamily: "'Space Mono', monospace" }}
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
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: theme.inkSoft }}>
          {label}
        </p>
        {value && (
          <span className="text-[10px] font-semibold" style={{ color: theme.inkSoft }}>
            ~{approxMB} MB
          </span>
        )}
      </div>

      {value ? (
        <div className="flex flex-col gap-1.5">
          {kind === "video" ? (
            <video src={value} controls playsInline className="w-full" style={{ borderRadius: skin.radiusSm, maxHeight: 160, background: "#000" }} />
          ) : (
            <audio src={value} controls className="w-full" />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="self-start text-[11px] font-bold px-2 py-1"
            style={{ borderRadius: 6, color: "#7A2A12", background: "#FFD9CE" }}
          >
            {removeLabel}
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex items-center justify-center text-xs font-bold px-3 py-2.5 cursor-pointer"
          style={{ borderRadius: skin.radiusSm, border: `1px dashed ${theme.hairlineStrong}`, color: theme.inkSoft, background: theme.surface }}
        >
          {busy ? "…" : uploadLabel}
        </label>
      )}
      <input id={inputId} type="file" accept={accept} onChange={handleFile} className="hidden" />
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
    <div className="educraft-panel-in" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairlineStrong}`, background: theme.surfaceSoft, padding: 14 }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-xs font-bold" style={{ color: theme.inkSoft }}>
          {t.cardImage}
        </p>
        <button onClick={onDeleteCard} className="text-xs font-bold px-2.5 py-1.5 shrink-0" style={{ borderRadius: 8, color: "#7A2A12", background: "#FFD9CE" }}>
          {t.deleteCard}
        </button>
      </div>

      <div
        className="mb-2"
        style={{
          height: 110,
          borderRadius: 12,
          overflow: "hidden",
          background: card.image ? undefined : "repeating-linear-gradient(45deg, " + theme.surface + ", " + theme.surface + " 8px, " + theme.hairline + " 8px, " + theme.hairline + " 16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {card.image ? (
          <img src={card.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span className="text-xs font-semibold" style={{ color: theme.inkSoft }}>
            {t.cardImage}
          </span>
        )}
      </div>
      <TextInput theme={theme} skin={skin} value={card.image} onChange={(v) => onUpdateCard({ image: v })} placeholder="https://…" />
      <div className="flex gap-1.5 mt-1.5 mb-3">
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
            className="text-[11px] font-bold px-2 py-1"
            style={{ borderRadius: 6, background: pos === p ? theme.accent : theme.surface, color: pos === p ? theme.accentInk : theme.ink }}
          >
            {label}
          </button>
        ))}
      </div>

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

      <input
        value={card.note || ""}
        onChange={(e) => onUpdateCard({ note: e.target.value })}
        placeholder={t.cardNote}
        dir="auto"
        className="w-full text-xs px-3 py-2 mb-3"
        style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.inkSoft }}
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
function EditorLeafNav({ book, lang, theme, selectedLeafId, onSelect }) {
  const branches = book.nodes.filter((n) => n.level === "branch");
  const subOf = (bid) => book.nodes.filter((n) => n.level === "sub" && n.parent === bid);
  const leavesOf = (sid) => book.nodes.filter((n) => n.level === "leaf" && n.parent === sid);
  return (
    <div className="flex flex-col gap-3">
      {branches.map((b) => (
        <div key={b.id}>
          <p className="text-xs font-black uppercase tracking-wide mb-1.5 flex items-center gap-1.5" style={{ color: theme.accent }}>
            <GitBranch size={12} /> {lang === "ar" ? b.ar : b.en}
          </p>
          <div className="flex flex-col gap-2 ps-3" style={{ borderInlineStart: `2px solid ${theme.hairline}` }}>
            {subOf(b.id).map((s) => (
              <div key={s.id}>
                <p className="text-[11px] font-bold mb-1" style={{ color: theme.inkSoft }}>
                  {lang === "ar" ? s.ar : s.en}
                </p>
                <div className="flex flex-col gap-1 ps-2">
                  {leavesOf(s.id).map((l) => (
                    <button
                      key={l.id}
                      onClick={() => onSelect(l.id)}
                      className="text-start text-xs font-semibold px-2.5 py-1.5 flex items-center justify-between gap-2"
                      style={{ borderRadius: 8, background: selectedLeafId === l.id ? theme.accentSoft : "transparent", color: theme.ink, border: `1px solid ${selectedLeafId === l.id ? theme.accent : "transparent"}` }}
                    >
                      <span>{lang === "ar" ? l.ar : l.en}</span>
                      <span className="text-[10px]" style={{ color: theme.inkSoft }}>
                        {(l.questions || []).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* The 60 ثِقة plate palettes (from all-60-plates.html), each a full
   {PageBG,HeaderColor,SectionBG,SectionFrame,KeyBG,KeyFrame,KeyText,
   NoteBG,NoteFrame,NoteText,BodyText,WarningBG,WarningFrame,WarningText,
   ImportantText,HighlightBG} set — the A4 page builder's palette picker
   pulls PLATE_KINDS + page colors straight from whichever one is active. */
const PAGE_PALETTES = [
  { id: 1, name: "كلاسيك أكاديمي", PageBG: "#F8F5F0", HeaderColor: "#2E4060", SectionBG: "#E8874A", SectionFrame: "#C96B2F", KeyBG: "#E8F7F9", KeyFrame: "#4C9DB0", KeyText: "#1A6B7A", NoteBG: "#F0EDF7", NoteFrame: "#655A7C", NoteText: "#3B3050", BodyText: "#000000", WarningBG: "#F2F4E6", WarningFrame: "#84922A", WarningText: "#626D17", ImportantText: "#14428F", HighlightBG: "#D9E0F2" },
  { id: 2, name: "أزرق محايد", PageBG: "#F5F8FA", HeaderColor: "#1B3A5C", SectionBG: "#2E6F9E", SectionFrame: "#1F4F73", KeyBG: "#E6F2F8", KeyFrame: "#3E8FBF", KeyText: "#14506E", NoteBG: "#EAEFF5", NoteFrame: "#52688A", NoteText: "#2A3A52", BodyText: "#000000", WarningBG: "#E8E6F4", WarningFrame: "#4934B2", WarningText: "#26176D", ImportantText: "#8F4514", HighlightBG: "#F2ECD9" },
  { id: 3, name: "رمادي أنيق", PageBG: "#F7F7F6", HeaderColor: "#33363B", SectionBG: "#6E5046", SectionFrame: "#4F3A33", KeyBG: "#EDEDEA", KeyFrame: "#8A8580", KeyText: "#3A3833", NoteBG: "#F1ECEA", NoteFrame: "#8C6F62", NoteText: "#4A3A32", BodyText: "#000000", WarningBG: "#F4F4E6", WarningFrame: "#92922A", WarningText: "#6D6D17", ImportantText: "#14148F", HighlightBG: "#D9E3F2" },
  { id: 4, name: "باستيل وردي", PageBG: "#FDF6F5", HeaderColor: "#8C4B5A", SectionBG: "#E8A0AC", SectionFrame: "#C97584", KeyBG: "#FCEDEF", KeyFrame: "#D98A9A", KeyText: "#8A3D4C", NoteBG: "#FBF0E9", NoteFrame: "#C99E84", NoteText: "#6E4A36", BodyText: "#000000", WarningBG: "#F4EEE6", WarningFrame: "#B27D34", WarningText: "#6D4917", ImportantText: "#127481", HighlightBG: "#D9EEF2" },
  { id: 5, name: "باستيل نعناعي", PageBG: "#F4FAF7", HeaderColor: "#2F6B57", SectionBG: "#6FBFA0", SectionFrame: "#409478", KeyBG: "#E7F7F1", KeyFrame: "#52B399", KeyText: "#1F6B53", NoteBG: "#EEF6F8", NoteFrame: "#6FA8B5", NoteText: "#2C5A66", BodyText: "#000000", WarningBG: "#E6EFF4", WarningFrame: "#3484B2", WarningText: "#174E6D", ImportantText: "#8F1452", HighlightBG: "#F2D9DA" },
  { id: 6, name: "باستيل لافندر", PageBG: "#F8F6FB", HeaderColor: "#4A3F73", SectionBG: "#9A8AC7", SectionFrame: "#6F5DA3", KeyBG: "#EFEAF8", KeyFrame: "#8470B8", KeyText: "#4B3A7A", NoteBG: "#EAF0F6", NoteFrame: "#7E93B0", NoteText: "#354A66", BodyText: "#000000", WarningBG: "#F4E6F4", WarningFrame: "#B234B0", WarningText: "#6D176C", ImportantText: "#4C7411", HighlightBG: "#E3F2D9" },
  { id: 7, name: "باستيل خوخي", PageBG: "#FDF8F1", HeaderColor: "#8A5A2E", SectionBG: "#EFA85E", SectionFrame: "#D1873A", KeyBG: "#FCEFE0", KeyFrame: "#E0A05C", KeyText: "#7A4C20", NoteBG: "#FAF3E6", NoteFrame: "#C9A06A", NoteText: "#6B4E2A", BodyText: "#000000", WarningBG: "#F1F4E6", WarningFrame: "#7E9A2D", WarningText: "#576D17", ImportantText: "#14478F", HighlightBG: "#D9DDF2" },
  { id: 8, name: "ليلي أزرق", PageBG: "#1B1F2A", HeaderColor: "#E8ECF2", SectionBG: "#3D6FB4", SectionFrame: "#6E9CDB", KeyBG: "#223240", KeyFrame: "#5EC3D6", KeyText: "#8FE3F0", NoteBG: "#282235", NoteFrame: "#9E8FD6", NoteText: "#C9BBF5", BodyText: "#E6E8EC", WarningBG: "#31244C", WarningFrame: "#774DCB", WarningText: "#BBA5E9", ImportantText: "#8999E6", HighlightBG: "#403D1C" },
  { id: 9, name: "ليلي بنفسجي", PageBG: "#201A2B", HeaderColor: "#F0E9F7", SectionBG: "#8A5FBF", SectionFrame: "#AE8AE0", KeyBG: "#271F38", KeyFrame: "#4FB3A8", KeyText: "#8FE0D4", NoteBG: "#2A2230", NoteFrame: "#C99A6B", NoteText: "#EAC79A", BodyText: "#EDE7F4", WarningBG: "#4C2444", WarningFrame: "#CB4DB2", WarningText: "#E9A5DB", ImportantText: "#CA89E6", HighlightBG: "#24401C" },
  { id: 10, name: "ليلي أخضر", PageBG: "#16201C", HeaderColor: "#E6F0EA", SectionBG: "#3E8E68", SectionFrame: "#63B58A", KeyBG: "#1C2A24", KeyFrame: "#5BAFA0", KeyText: "#9FE3D4", NoteBG: "#20251F", NoteFrame: "#A9A45E", NoteText: "#E1DC9E", BodyText: "#E7EDE9", WarningBG: "#24414C", WarningFrame: "#4DA9CB", WarningText: "#A5D6E9", ImportantText: "#89E6D1", HighlightBG: "#401C21" },
  { id: 11, name: "طبي إكلينيكي", PageBG: "#FAFCFD", HeaderColor: "#0E5C73", SectionBG: "#1C8FA8", SectionFrame: "#146C82", KeyBG: "#E3F6F4", KeyFrame: "#2BA89A", KeyText: "#0E6B5F", NoteBG: "#EAF4FB", NoteFrame: "#4A8FBF", NoteText: "#1B4F75", BodyText: "#000000", WarningBG: "#E6E7F4", WarningFrame: "#343DB2", WarningText: "#171D6D", ImportantText: "#8F3D14", HighlightBG: "#F2E6D9" },
  { id: 12, name: "هندسي تقني", PageBG: "#F6F7F8", HeaderColor: "#22272E", SectionBG: "#E0A12C", SectionFrame: "#B8821B", KeyBG: "#E9EEF2", KeyFrame: "#4A6B8A", KeyText: "#1F3A52", NoteBG: "#EEEDEA", NoteFrame: "#8C8275", NoteText: "#4A4338", BodyText: "#000000", WarningBG: "#EFF4E6", WarningFrame: "#6E9A2D", WarningText: "#4B6D17", ImportantText: "#8F5214", HighlightBG: "#D9D9F2" },
  { id: 13, name: "طبيعي ترابي", PageBG: "#F7F5EE", HeaderColor: "#4A4520", SectionBG: "#8A9B5E", SectionFrame: "#677A3E", KeyBG: "#EFF1E3", KeyFrame: "#7E9460", KeyText: "#435228", NoteBG: "#F1E9DE", NoteFrame: "#A07D52", NoteText: "#5C4327", BodyText: "#000000", WarningBG: "#E6F4E6", WarningFrame: "#2FA232", WarningText: "#176D1A", ImportantText: "#14308F", HighlightBG: "#E8D9F2" },
  { id: 14, name: "ملكي ذهبي", PageBG: "#F9F7F1", HeaderColor: "#1F2A4A", SectionBG: "#B68A3E", SectionFrame: "#8C6A26", KeyBG: "#F3EEE0", KeyFrame: "#A9842F", KeyText: "#6B4F18", NoteBG: "#EFEAF1", NoteFrame: "#7A4F5E", NoteText: "#5A2E3C", BodyText: "#000000", WarningBG: "#EFF4E6", WarningFrame: "#709A2D", WarningText: "#4C6D17", ImportantText: "#14338F", HighlightBG: "#D9DAF2" },
  { id: 15, name: "عصري جريء", PageBG: "#FBFBFA", HeaderColor: "#1A2E35", SectionBG: "#EB5E55", SectionFrame: "#C73E36", KeyBG: "#E3F4F2", KeyFrame: "#1FA39A", KeyText: "#0E6760", NoteBG: "#FDF1E3", NoteFrame: "#E0A23A", NoteText: "#7A4E12", BodyText: "#000000", WarningBG: "#F4F2E6", WarningFrame: "#A69030", WarningText: "#6D5D17", ImportantText: "#14148F", HighlightBG: "#D9E8F2" },
  { id: 16, name: "أحمر مرجاني", PageBG: "#F7F3F3", HeaderColor: "#511F1F", SectionBG: "#C84141", SectionFrame: "#9D2525", KeyBG: "#E5F5ED", KeyFrame: "#3B9B6B", KeyText: "#1F6B45", NoteBG: "#EEEAF5", NoteFrame: "#654B9B", NoteText: "#3E2B64", BodyText: "#000000", WarningBG: "#F4F1E6", WarningFrame: "#A68930", WarningText: "#6D5817", ImportantText: "#117474", HighlightBG: "#D9EAF2" },
  { id: 17, name: "أخضر زمردي", PageBG: "#F3F7F4", HeaderColor: "#1F512E", SectionBG: "#268241", SectionFrame: "#124E24", KeyBG: "#F2E5F5", KeyFrame: "#9B43B1", KeyText: "#5B1F6B", NoteBG: "#F5F1EA", NoteFrame: "#9B7D4B", NoteText: "#644F2B", BodyText: "#000000", WarningBG: "#E6F4F4", WarningFrame: "#2F9DA2", WarningText: "#176A6D", ImportantText: "#8F1470", HighlightBG: "#F2D9E2" },
  { id: 18, name: "أرجواني", PageBG: "#F5F3F7", HeaderColor: "#3C1F51", SectionBG: "#9041C8", SectionFrame: "#6B259D", KeyBG: "#F4F5E5", KeyFrame: "#899037", KeyText: "#646B1F", NoteBG: "#EAF5F4", NoteFrame: "#499791", NoteText: "#2B645F", BodyText: "#000000", WarningBG: "#F4E6F0", WarningFrame: "#B23488", WarningText: "#6D1751", ImportantText: "#427411", HighlightBG: "#DBF2D9" },
  { id: 19, name: "ذهبي فاتح", PageBG: "#F7F6F3", HeaderColor: "#514B1F", SectionBG: "#7E7325", SectionFrame: "#4A4311", KeyBG: "#E5EFF5", KeyFrame: "#4388B1", KeyText: "#1F4E6B", NoteBG: "#F5EAF3", NoteFrame: "#9B4B8A", NoteText: "#642B58", BodyText: "#000000", WarningBG: "#EBF4E6", WarningFrame: "#589E2E", WarningText: "#376D17", ImportantText: "#14338F", HighlightBG: "#DED9F2" },
  { id: 20, name: "سماوي", PageBG: "#F3F6F7", HeaderColor: "#1F4951", SectionBG: "#297D8E", SectionFrame: "#154F5B", KeyBG: "#F5E5EA", KeyFrame: "#B14368", KeyText: "#6B1F38", NoteBG: "#F0F5EA", NoteFrame: "#709749", NoteText: "#47642B", BodyText: "#000000", WarningBG: "#E6E7F4", WarningFrame: "#343EB2", WarningText: "#171E6D", ImportantText: "#8F3314", HighlightBG: "#F2E6D9" },
  { id: 21, name: "فوشيا", PageBG: "#F7F3F5", HeaderColor: "#511F3A", SectionBG: "#C73D88", SectionFrame: "#992463", KeyBG: "#E6F5E5", KeyFrame: "#409F3C", KeyText: "#226B1F", NoteBG: "#EAEDF5", NoteFrame: "#4B5B9B", NoteText: "#2B3764", BodyText: "#000000", WarningBG: "#F4E9E6", WarningFrame: "#B24E34", WarningText: "#6D2917", ImportantText: "#117845", HighlightBG: "#D9F2ED" },
  { id: 22, name: "أخضر ربيعي", PageBG: "#F4F7F3", HeaderColor: "#2B511F", SectionBG: "#3D8226", SectionFrame: "#214E12", KeyBG: "#E9E5F5", KeyFrame: "#5F43B1", KeyText: "#321F6B", NoteBG: "#F5EBEA", NoteFrame: "#9B514B", NoteText: "#64302B", BodyText: "#000000", WarningBG: "#E6F4ED", WarningFrame: "#2E9E66", WarningText: "#176D42", ImportantText: "#70148F", HighlightBG: "#F2D9F0" },
  { id: 23, name: "أزرق نيلي", PageBG: "#F3F3F7", HeaderColor: "#211F51", SectionBG: "#4741C8", SectionFrame: "#2A259D", KeyBG: "#F5EEE5", KeyFrame: "#B17F43", KeyText: "#6B481F", NoteBG: "#EAF5EE", NoteFrame: "#4B9B69", NoteText: "#2B6440", BodyText: "#000000", WarningBG: "#F1E6F4", WarningFrame: "#9834B2", WarningText: "#5C176D", ImportantText: "#6B6B0F", HighlightBG: "#E9F2D9" },
  { id: 24, name: "برتقالي دافئ", PageBG: "#F7F4F3", HeaderColor: "#51301F", SectionBG: "#B25E34", SectionFrame: "#803F1E", KeyBG: "#E5F5F3", KeyFrame: "#3B9B8B", KeyText: "#1F6B5E", NoteBG: "#F1EAF5", NoteFrame: "#804B9B", NoteText: "#512B64", BodyText: "#000000", WarningBG: "#F3F4E6", WarningFrame: "#8A922A", WarningText: "#666D17", ImportantText: "#14708F", HighlightBG: "#D9E1F2" },
  { id: 25, name: "نعناعي غامق", PageBG: "#F3F7F5", HeaderColor: "#1F513E", SectionBG: "#268260", SectionFrame: "#124E38", KeyBG: "#F5E5F3", KeyFrame: "#B143A4", KeyText: "#6B1F61", NoteBG: "#F5F5EA", NoteFrame: "#949147", NoteText: "#64622B", BodyText: "#000000", WarningBG: "#E6EFF4", WarningFrame: "#3482B2", WarningText: "#174D6D", ImportantText: "#8F1452", HighlightBG: "#F2D9DA" },
  { id: 26, name: "موف", PageBG: "#F7F3F7", HeaderColor: "#4D1F51", SectionBG: "#BA39C6", SectionFrame: "#8B2395", KeyBG: "#EEF5E5", KeyFrame: "#70983A", KeyText: "#4B6B1F", NoteBG: "#EAF2F5", NoteFrame: "#4B879B", NoteText: "#2B5664", BodyText: "#000000", WarningBG: "#F4E6EB", WarningFrame: "#B2345E", WarningText: "#6D1734", ImportantText: "#117811", HighlightBG: "#D9F2DF" },
  { id: 27, name: "ليموني", PageBG: "#F6F7F3", HeaderColor: "#47511F", SectionBG: "#687B24", SectionFrame: "#3B4610", KeyBG: "#E5EAF5", KeyFrame: "#4363B1", KeyText: "#1F356B", NoteBG: "#F5EAEF", NoteFrame: "#9B4B6F", NoteText: "#642B45", BodyText: "#000000", WarningBG: "#E6F4E6", WarningFrame: "#33A22F", WarningText: "#1A6D17", ImportantText: "#33148F", HighlightBG: "#E7D9F2" },
  { id: 28, name: "أزرق سماء", PageBG: "#F3F5F7", HeaderColor: "#1F3851", SectionBG: "#3678BA", SectionFrame: "#205488", KeyBG: "#F5E5E5", KeyFrame: "#B14343", KeyText: "#6B1F1F", NoteBG: "#ECF5EA", NoteFrame: "#589B4B", NoteText: "#34642B", BodyText: "#000000", WarningBG: "#EAE6F4", WarningFrame: "#5334B2", WarningText: "#2D176D", ImportantText: "#8F5214", HighlightBG: "#F2EED9" },
  { id: 29, name: "توتي فروتي", PageBG: "#F7F3F3", HeaderColor: "#511F29", SectionBG: "#C8415D", SectionFrame: "#9D253E", KeyBG: "#E5F5EA", KeyFrame: "#3C9F59", KeyText: "#1F6B35", NoteBG: "#ECEAF5", NoteFrame: "#554B9B", NoteText: "#322B64", BodyText: "#000000", WarningBG: "#F4EEE6", WarningFrame: "#B27834", WarningText: "#6D4617", ImportantText: "#117474", HighlightBG: "#D9EFF2" },
  { id: 30, name: "أخضر زمردي 2", PageBG: "#F3F7F3", HeaderColor: "#1F5123", SectionBG: "#27862F", SectionFrame: "#135319", KeyBG: "#EFE5F5", KeyFrame: "#8443B1", KeyText: "#4B1F6B", NoteBG: "#F5EFEA", NoteFrame: "#9B6C4B", NoteText: "#64432B", BodyText: "#000000", WarningBG: "#E6F4F2", WarningFrame: "#2E9E8B", WarningText: "#176D5F", ImportantText: "#8F148F", HighlightBG: "#F2D9E8" },
  { id: 31, name: "بنفسجي ملكي", PageBG: "#F4F3F7", HeaderColor: "#321F51", SectionBG: "#7441C8", SectionFrame: "#52259D", KeyBG: "#F5F3E5", KeyFrame: "#988C3A", KeyText: "#6B611F", NoteBG: "#EAF5F2", NoteFrame: "#4B9B84", NoteText: "#2B6453", BodyText: "#000000", WarningBG: "#F4E6F2", WarningFrame: "#B234A2", WarningText: "#6D1762", ImportantText: "#587010", HighlightBG: "#E0F2D9" },
  { id: 32, name: "كهرماني", PageBG: "#F7F6F3", HeaderColor: "#51411F", SectionBG: "#8E6D29", SectionFrame: "#5B4415", KeyBG: "#E5F2F5", KeyFrame: "#4198AA", KeyText: "#1F5E6B", NoteBG: "#F5EAF5", NoteFrame: "#9B4B9B", NoteText: "#642B64", BodyText: "#000000", WarningBG: "#EEF4E6", WarningFrame: "#6C9A2D", WarningText: "#496D17", ImportantText: "#14338F", HighlightBG: "#D9D9F2" },
  { id: 33, name: "تركواز", PageBG: "#F3F7F7", HeaderColor: "#1F514F", SectionBG: "#257E7B", SectionFrame: "#114A48", KeyBG: "#F5E5EE", KeyFrame: "#B1437F", KeyText: "#6B1F48", NoteBG: "#F2F5EA", NoteFrame: "#809749", NoteText: "#53642B", BodyText: "#000000", WarningBG: "#E6EAF4", WarningFrame: "#3457B2", WarningText: "#17306D", ImportantText: "#8F1414", HighlightBG: "#F2E0D9" },
  { id: 34, name: "فوشيا 2", PageBG: "#F7F3F6", HeaderColor: "#511F45", SectionBG: "#C639A2", SectionFrame: "#952378", KeyBG: "#E9F5E5", KeyFrame: "#539B3B", KeyText: "#326B1F", NoteBG: "#EAEFF5", NoteFrame: "#4B6C9B", NoteText: "#2B4364", BodyText: "#000000", WarningBG: "#F4E6E6", WarningFrame: "#B23434", WarningText: "#6D1817", ImportantText: "#11782B", HighlightBG: "#D9F2E8" },
  { id: 35, name: "أخضر ربيعي 2", PageBG: "#F5F7F3", HeaderColor: "#36511F", SectionBG: "#508226", SectionFrame: "#2E4E12", KeyBG: "#E6E5F5", KeyFrame: "#4843B1", KeyText: "#221F6B", NoteBG: "#F5EAEC", NoteFrame: "#9B4B54", NoteText: "#642B32", BodyText: "#000000", WarningBG: "#E6F4EA", WarningFrame: "#2FA251", WarningText: "#176D30", ImportantText: "#52148F", HighlightBG: "#EFD9F2" },
  { id: 36, name: "أزرق نيلي 2", PageBG: "#F3F3F7", HeaderColor: "#1F2751", SectionBG: "#4157C8", SectionFrame: "#25399D", KeyBG: "#F5EBE5", KeyFrame: "#B16843", KeyText: "#6B381F", NoteBG: "#EAF5EC", NoteFrame: "#4B9B58", NoteText: "#2B6435", BodyText: "#000000", WarningBG: "#EEE6F4", WarningFrame: "#7E34B2", WarningText: "#4A176D", ImportantText: "#6B6B0F", HighlightBG: "#EEF2D9" },
  { id: 37, name: "أحمر مرجاني 2", PageBG: "#F7F3F3", HeaderColor: "#51251F", SectionBG: "#C64B39", SectionFrame: "#953123", KeyBG: "#E5F5EF", KeyFrame: "#3B9B77", KeyText: "#1F6B4F", NoteBG: "#EFEAF5", NoteFrame: "#704B9B", NoteText: "#452B64", BodyText: "#000000", WarningBG: "#F4F3E6", WarningFrame: "#9A8D2D", WarningText: "#6D6317", ImportantText: "#117474", HighlightBG: "#D9E6F2" },
  { id: 38, name: "أخضر زمردي 3", PageBG: "#F3F7F4", HeaderColor: "#1F5134", SectionBG: "#26824D", SectionFrame: "#124E2C", KeyBG: "#F4E5F5", KeyFrame: "#A943B1", KeyText: "#651F6B", NoteBG: "#F5F2EA", NoteFrame: "#9B874B", NoteText: "#64562B", BodyText: "#000000", WarningBG: "#E6F2F4", WarningFrame: "#3298AE", WarningText: "#175E6D", ImportantText: "#8F1470", HighlightBG: "#F2D9DF" },
  { id: 39, name: "أرجواني 2", PageBG: "#F6F3F7", HeaderColor: "#431F51", SectionBG: "#A141C8", SectionFrame: "#7A259D", KeyBG: "#F2F5E5", KeyFrame: "#809438", KeyText: "#5B6B1F", NoteBG: "#EAF5F5", NoteFrame: "#4B979B", NoteText: "#2B6164", BodyText: "#000000", WarningBG: "#F4E6EE", WarningFrame: "#B23478", WarningText: "#6D1746", ImportantText: "#2B7811", HighlightBG: "#D9F2DA" },
  { id: 40, name: "ذهبي فاتح 2", PageBG: "#F7F7F3", HeaderColor: "#51511F", SectionBG: "#767722", SectionFrame: "#424210", KeyBG: "#E5EDF5", KeyFrame: "#437AB1", KeyText: "#1F456B", NoteBG: "#F5EAF1", NoteFrame: "#9B4B80", NoteText: "#642B51", BodyText: "#000000", WarningBG: "#E9F4E6", WarningFrame: "#4AA22F", WarningText: "#2C6D17", ImportantText: "#14148F", HighlightBG: "#E2D9F2" },
  { id: 41, name: "سماوي 2", PageBG: "#F3F6F7", HeaderColor: "#1F4251", SectionBG: "#2E7D9E", SectionFrame: "#19536B", KeyBG: "#F5E5E8", KeyFrame: "#B1435A", KeyText: "#6B1F2F", NoteBG: "#EEF5EA", NoteFrame: "#689B4B", NoteText: "#40642B", BodyText: "#000000", WarningBG: "#E7E6F4", WarningFrame: "#3934B2", WarningText: "#1B176D", ImportantText: "#8F3314", HighlightBG: "#F2E9D9" },
  { id: 42, name: "وردي غامق", PageBG: "#F7F3F4", HeaderColor: "#511F34", SectionBG: "#C84179", SectionFrame: "#9D2556", KeyBG: "#E5F5E7", KeyFrame: "#3C9F45", KeyText: "#1F6B26", NoteBG: "#EAEBF5", NoteFrame: "#4B519B", NoteText: "#2B2F64", BodyText: "#000000", WarningBG: "#F4EBE6", WarningFrame: "#B25E34", WarningText: "#6D3417", ImportantText: "#11745B", HighlightBG: "#D9F2F0" },
  { id: 43, name: "أخضر ربيعي 3", PageBG: "#F3F7F3", HeaderColor: "#25511F", SectionBG: "#318226", SectionFrame: "#1A4E12", KeyBG: "#EBE5F5", KeyFrame: "#6D43B1", KeyText: "#3C1F6B", NoteBG: "#F5EDEA", NoteFrame: "#9B5C4B", NoteText: "#64372B", BodyText: "#000000", WarningBG: "#E6F4EF", WarningFrame: "#2E9E75", WarningText: "#176D4E", ImportantText: "#8F148F", HighlightBG: "#F2D9ED" },
  { id: 44, name: "بنفسجي ملكي 2", PageBG: "#F3F3F7", HeaderColor: "#271F51", SectionBG: "#5841C8", SectionFrame: "#39259D", KeyBG: "#F5F0E5", KeyFrame: "#AA8741", KeyText: "#6B521F", NoteBG: "#EAF5F0", NoteFrame: "#4B9B73", NoteText: "#2B6448", BodyText: "#000000", WarningBG: "#F3E6F4", WarningFrame: "#A834B2", WarningText: "#67176D", ImportantText: "#6B6B0F", HighlightBG: "#E5F2D9" },
  { id: 45, name: "برتقالي دافئ 2", PageBG: "#F7F5F3", HeaderColor: "#51361F", SectionBG: "#A2642F", SectionFrame: "#70421A", KeyBG: "#E5F5F5", KeyFrame: "#3B9B98", KeyText: "#1F6B68", NoteBG: "#F3EAF5", NoteFrame: "#8A4B9B", NoteText: "#582B64", BodyText: "#000000", WarningBG: "#F1F4E6", WarningFrame: "#80962C", WarningText: "#5B6D17", ImportantText: "#14528F", HighlightBG: "#D9DEF2" },
  { id: 46, name: "نعناعي غامق 2", PageBG: "#F3F7F6", HeaderColor: "#1F5145", SectionBG: "#26826C", SectionFrame: "#124E40", KeyBG: "#F5E5F1", KeyFrame: "#B14395", KeyText: "#6B1F57", NoteBG: "#F4F5EA", NoteFrame: "#8D9447", NoteText: "#5F642B", BodyText: "#000000", WarningBG: "#E6EDF4", WarningFrame: "#3471B2", WarningText: "#17416D", ImportantText: "#8F1433", HighlightBG: "#F2DBD9" },
  { id: 47, name: "موف 2", PageBG: "#F7F3F7", HeaderColor: "#511F4F", SectionBG: "#BE37B8", SectionFrame: "#8C2188", KeyBG: "#ECF5E5", KeyFrame: "#679B3B", KeyText: "#416B1F", NoteBG: "#EAF1F5", NoteFrame: "#4B7C9B", NoteText: "#2B4E64", BodyText: "#000000", WarningBG: "#F4E6E9", WarningFrame: "#B2344E", WarningText: "#6D1729", ImportantText: "#117811", HighlightBG: "#D9F2E2" },
  { id: 48, name: "ليموني 2", PageBG: "#F6F7F3", HeaderColor: "#40511F", SectionBG: "#607E25", SectionFrame: "#374A11", KeyBG: "#E5E8F5", KeyFrame: "#4355B1", KeyText: "#1F2B6B", NoteBG: "#F5EAEE", NoteFrame: "#9B4B65", NoteText: "#642B3E", BodyText: "#000000", WarningBG: "#E6F4E7", WarningFrame: "#2FA239", WarningText: "#176D1F", ImportantText: "#33148F", HighlightBG: "#EAD9F2" },
  { id: 49, name: "أزرق سماء 2", PageBG: "#F3F4F7", HeaderColor: "#1F3251", SectionBG: "#4173C8", SectionFrame: "#25519D", KeyBG: "#F5E7E5", KeyFrame: "#B15243", KeyText: "#6B291F", NoteBG: "#EBF5EA", NoteFrame: "#4E9B4B", NoteText: "#2D642B", BodyText: "#000000", WarningBG: "#EBE6F4", WarningFrame: "#6434B2", WarningText: "#38176D", ImportantText: "#7D6212", HighlightBG: "#F2F1D9" },
  { id: 50, name: "توتي فروتي 2", PageBG: "#F7F3F3", HeaderColor: "#511F23", SectionBG: "#C8414C", SectionFrame: "#9D252E", KeyBG: "#E5F5EC", KeyFrame: "#3C9F66", KeyText: "#1F6B3F", NoteBG: "#EDEAF5", NoteFrame: "#5F4B9B", NoteText: "#392B64", BodyText: "#000000", WarningBG: "#F4F0E6", WarningFrame: "#AE8532", WarningText: "#6D5117", ImportantText: "#117474", HighlightBG: "#D9ECF2" },
  { id: 51, name: "أخضر زمردي 4", PageBG: "#F3F7F4", HeaderColor: "#1F512A", SectionBG: "#27863B", SectionFrame: "#135321", KeyBG: "#F1E5F5", KeyFrame: "#9243B1", KeyText: "#551F6B", NoteBG: "#F5F0EA", NoteFrame: "#9B764B", NoteText: "#644A2B", BodyText: "#000000", WarningBG: "#E6F4F4", WarningFrame: "#2E9E9A", WarningText: "#176D6A", ImportantText: "#8F1470", HighlightBG: "#F2D9E4" },
  { id: 52, name: "أرجواني 3", PageBG: "#F5F3F7", HeaderColor: "#381F51", SectionBG: "#8541C8", SectionFrame: "#61259D", KeyBG: "#F5F5E5", KeyFrame: "#909037", KeyText: "#6A6B1F", NoteBG: "#EAF5F3", NoteFrame: "#49978B", NoteText: "#2B645B", BodyText: "#000000", WarningBG: "#F4E6F1", WarningFrame: "#B23492", WarningText: "#6D1758", ImportantText: "#427411", HighlightBG: "#DDF2D9" },
  { id: 53, name: "كهرماني 2", PageBG: "#F7F6F3", HeaderColor: "#51471F", SectionBG: "#867327", SectionFrame: "#534613", KeyBG: "#E5F0F5", KeyFrame: "#4391B1", KeyText: "#1F546B", NoteBG: "#F5EAF4", NoteFrame: "#9B4B90", NoteText: "#642B5D", BodyText: "#000000", WarningBG: "#ECF4E6", WarningFrame: "#609E2E", WarningText: "#3E6D17", ImportantText: "#14338F", HighlightBG: "#DCD9F2" },
  { id: 54, name: "تركواز 2", PageBG: "#F3F7F7", HeaderColor: "#1F4D51", SectionBG: "#277E86", SectionFrame: "#134D53", KeyBG: "#F5E5EC", KeyFrame: "#B14371", KeyText: "#6B1F3E", NoteBG: "#F1F5EA", NoteFrame: "#769749", NoteText: "#4C642B", BodyText: "#000000", WarningBG: "#E6E8F4", WarningFrame: "#3449B2", WarningText: "#17256D", ImportantText: "#8F1414", HighlightBG: "#F2E3D9" },
  { id: 55, name: "فوشيا 3", PageBG: "#F7F3F5", HeaderColor: "#511F3E", SectionBG: "#C73D93", SectionFrame: "#99246C", KeyBG: "#E7F5E5", KeyFrame: "#489F3C", KeyText: "#286B1F", NoteBG: "#EAEDF5", NoteFrame: "#4B629B", NoteText: "#2B3B64", BodyText: "#000000", WarningBG: "#F4E8E6", WarningFrame: "#B24434", WarningText: "#6D2217", ImportantText: "#117845", HighlightBG: "#D9F2EB" },
  { id: 56, name: "أخضر ربيعي 4", PageBG: "#F4F7F3", HeaderColor: "#2F511F", SectionBG: "#448226", SectionFrame: "#264E12", KeyBG: "#E8E5F5", KeyFrame: "#5643B1", KeyText: "#2C1F6B", NoteBG: "#F5EAEA", NoteFrame: "#9B4B4B", NoteText: "#642B2B", BodyText: "#000000", WarningBG: "#E6F4EC", WarningFrame: "#2FA260", WarningText: "#176D3C", ImportantText: "#70148F", HighlightBG: "#F2D9F2" },
  { id: 57, name: "أزرق نيلي 3", PageBG: "#F3F3F7", HeaderColor: "#1F2151", SectionBG: "#4146C8", SectionFrame: "#25299D", KeyBG: "#F5EDE5", KeyFrame: "#B17643", KeyText: "#6B421F", NoteBG: "#EAF5EE", NoteFrame: "#4B9B62", NoteText: "#2B643C", BodyText: "#000000", WarningBG: "#F0E6F4", WarningFrame: "#8E34B2", WarningText: "#55176D", ImportantText: "#6B6B0F", HighlightBG: "#EBF2D9" },
  { id: 58, name: "برتقالي دافئ 3", PageBG: "#F7F4F3", HeaderColor: "#512C1F", SectionBG: "#BA5836", SectionFrame: "#883B20", KeyBG: "#E5F5F1", KeyFrame: "#3B9B84", KeyText: "#1F6B58", NoteBG: "#F1EAF5", NoteFrame: "#7A4B9B", NoteText: "#4C2B64", BodyText: "#000000", WarningBG: "#F4F4E6", WarningFrame: "#91922A", WarningText: "#6D6D17", ImportantText: "#14708F", HighlightBG: "#D9E3F2" },
  { id: 59, name: "نعناعي غامق 3", PageBG: "#F3F7F5", HeaderColor: "#1F513A", SectionBG: "#268259", SectionFrame: "#124E33", KeyBG: "#F5E5F4", KeyFrame: "#B143AC", KeyText: "#6B1F67", NoteBG: "#F5F4EA", NoteFrame: "#978E49", NoteText: "#645D2B", BodyText: "#000000", WarningBG: "#E6F0F4", WarningFrame: "#348BB2", WarningText: "#17536D", ImportantText: "#8F1452", HighlightBG: "#F2D9DC" },
  { id: 60, name: "موف 3", PageBG: "#F6F3F7", HeaderColor: "#491F51", SectionBG: "#B241C8", SectionFrame: "#8A259D", KeyBG: "#F0F5E5", KeyFrame: "#78983A", KeyText: "#516B1F", NoteBG: "#EAF3F5", NoteFrame: "#4B8D9B", NoteText: "#2B5A64", BodyText: "#000000", WarningBG: "#F4E6EC", WarningFrame: "#B23468", WarningText: "#6D173B", ImportantText: "#2B7811", HighlightBG: "#D9F2DD" },
];

/* Builds a PLATE_KINDS-shaped object (box colors per plate kind) out
   of one of the 60 palettes above — this is what actually renders,
   so switching palettes recolors every plate on the page instantly. */
function plateKindsFor(palette) {
  return {
    sectionTitle: { bg: palette.SectionBG, fg: "#FFFFFF", border: palette.SectionFrame, bar: true },
    keyterm: { bg: palette.KeyBG, fg: palette.KeyText, border: palette.KeyFrame },
    note: { bg: palette.NoteBG, fg: palette.NoteText, border: palette.NoteFrame },
    warning: { bg: palette.WarningBG, fg: palette.WarningText, border: palette.WarningFrame, strong: true },
    important: { bg: palette.HighlightBG, fg: palette.ImportantText, border: palette.ImportantText, strong: true },
    code: { bg: "#0D0D0D", fg: "#D4D4D4", border: "#2A2A2A" },
  };
}
function paletteById(id) {
  return PAGE_PALETTES.find((p) => p.id === id) || PAGE_PALETTES[0];
}
/* fallback used only where a leaf/palette context isn't available */
const PLATE_KINDS = plateKindsFor(PAGE_PALETTES[0]);
const PAGE_FONT = "'Amiri','Noto Naskh Arabic','Traditional Arabic',serif";

function BlockRow({ block, t, theme, skin, kinds, onUpdate, onDelete, onMove }) {
  const kind = block.kind;
  return (
    <div className="p-2.5 mb-2" style={{ borderRadius: 10, border: `1px solid ${theme.hairline}`, background: theme.surface }}>
      <div className="flex items-center gap-1.5 mb-2">
        <select
          value={kind}
          onChange={(e) => onUpdate({ kind: e.target.value })}
          className="text-xs font-bold px-2 py-1.5"
          style={{ borderRadius: 6, border: `1px solid ${theme.hairline}`, background: theme.surfaceSoft, color: theme.ink }}
        >
          <option value="sectionTitle">{t.blockSectionTitle}</option>
          <option value="keyterm">{t.blockKeyterm}</option>
          <option value="note">{t.blockNote}</option>
          <option value="warning">{t.blockWarning}</option>
          <option value="important">{t.blockImportant}</option>
          <option value="image">{t.blockImage}</option>
          <option value="code">{t.blockCode}</option>
          <option value="pagebreak">{t.blockPagebreak}</option>
        </select>
        <div className="flex items-center gap-1 ms-auto">
          <button onClick={onMove(-1)} className="w-6 h-6 grid place-items-center" style={{ borderRadius: 6, color: theme.ink }} title={t.moveUp}>
            <ArrowUp size={13} />
          </button>
          <button onClick={onMove(1)} className="w-6 h-6 grid place-items-center" style={{ borderRadius: 6, color: theme.ink }} title={t.moveDown}>
            <ArrowDown size={13} />
          </button>
          <button onClick={onDelete} className="w-6 h-6 grid place-items-center" style={{ borderRadius: 6, color: "#C0392B" }} title={t.removeBlock}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {kind === "pagebreak" ? (
        <p className="text-[11px]" style={{ color: theme.inkSoft }}>
          — {t.blockPagebreak} —
        </p>
      ) : kind === "image" ? (
        <div className="flex flex-col gap-1.5">
          <TextInput theme={theme} skin={skin} value={block.imageUrl} onChange={(v) => onUpdate({ imageUrl: v })} placeholder={t.imageUrl} />
          <div className="grid grid-cols-2 gap-1.5">
            <TextInput theme={theme} skin={skin} value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder={t.imageTitle} />
            <TextInput theme={theme} skin={skin} value={block.meta} onChange={(v) => onUpdate({ meta: v })} placeholder={t.imageMeta} />
          </div>
          <textarea
            value={block.caption || ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            rows={2}
            dir="auto"
            className="w-full text-sm px-2.5 py-1.5"
            style={{ borderRadius: 6, border: `1px solid ${theme.hairline}`, background: theme.surfaceSoft, color: theme.ink }}
            placeholder={t.imageCaption}
          />
        </div>
      ) : kind === "code" ? (
        <textarea
          value={block.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={4}
          dir="ltr"
          className="w-full text-sm px-2.5 py-1.5"
          style={{ borderRadius: 6, border: `1px solid ${theme.hairline}`, background: "#0D0D0D", color: "#D4D4D4", fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace" }}
          placeholder={t.blockText}
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          {kind !== "sectionTitle" && <TextInput theme={theme} skin={skin} value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder={t.blockTitle} />}
          <textarea
            value={block.text || ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={2}
            dir="auto"
            className="w-full text-sm px-2.5 py-1.5"
            style={{ borderRadius: 6, border: `1px solid ${theme.hairline}`, background: theme.surfaceSoft, color: theme.ink }}
            placeholder={t.blockText}
          />
        </div>
      )}
    </div>
  );
}

function PlateBlock({ block, style, kinds }) {
  const K = kinds || PLATE_KINDS;
  const kind = K[block.kind];
  if (block.kind === "pagebreak") return null;
  if (block.kind === "image") {
    // matches template.html's .media-card: white card, framed in the
    // section color, image on top, title/desc/meta stacked below.
    return (
      <div
        style={{
          margin: "10px 0",
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          border: `1.5px solid ${K.sectionTitle.border}`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
          ...style,
        }}
      >
        {block.imageUrl && <img src={block.imageUrl} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />}
        {(block.title || block.caption || block.meta) && (
          <div style={{ padding: "10px 14px 12px" }}>
            {block.title && <p style={{ fontWeight: 800, color: K.sectionTitle.border, margin: "0 0 4px", fontSize: 13 }}>{block.title}</p>}
            {block.caption && (
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: "#241B13" }} dir="auto">
                {block.caption}
              </p>
            )}
            {block.meta && <p style={{ margin: "4px 0 0", fontSize: 10.5, color: "#7a7a7a" }}>{block.meta}</p>}
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
        style={{
          margin: "10px 0",
          ...style,
        }}
      />
    );
  }
  if (block.kind === "sectionTitle") {
    return (
      <div style={{ background: kind.bg, color: kind.fg, borderRadius: 10, padding: "10px 16px", margin: "14px 0 10px", fontWeight: 800, fontSize: 15, ...style }}>
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

/* Measures each block's real rendered height, then buckets blocks
   into A4 pages — a manual "page break" block always forces a new
   page, like Word. */
const A4_CONTENT_HEIGHT_MM = 265; // 297mm - 2*16mm margin approx
function usePagedBlocks(blocks) {
  const measureRef = useRef(null);
  const [pages, setPages] = useState([]);
  useEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const capacityPx = A4_CONTENT_HEIGHT_MM * 3.7795;
    const children = Array.from(node.children);
    let acc = 0;
    let cur = [];
    const result = [];
    blocks.forEach((b, i) => {
      if (b.kind === "pagebreak") {
        result.push(cur);
        cur = [];
        acc = 0;
        return;
      }
      const h = children[i] ? children[i].getBoundingClientRect().height + 4 : 40;
      if (acc + h > capacityPx && cur.length) {
        result.push(cur);
        cur = [];
        acc = 0;
      }
      cur.push(b);
      acc += h;
    });
    result.push(cur);
    setPages(result.filter((p, i) => p.length || i === 0));
  }, [blocks]);
  return { pages: pages.length ? pages : [blocks], measureRef };
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
    const compute = () => {
      const available = el.clientWidth - 16;
      const fit = available > 0 ? Math.min(1.15, Math.max(0.2, available / A4_PAGE_WIDTH_PX)) : 1;
      setFitScale(fit);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = zoomOverride ?? fitScale;
  const zoomIn = () => setZoomOverride(Math.min(2, Math.round((scale + 0.15) * 100) / 100));
  const zoomOut = () => setZoomOverride(Math.max(0.2, Math.round((scale - 0.15) * 100) / 100));
  const zoomFit = () => setZoomOverride(null);
  return { containerRef, scale, zoomIn, zoomOut, zoomFit, isFit: zoomOverride == null };
}

function ZoomBar({ t, theme, skin, scale, onZoomOut, onZoomIn, onFit, isFit }) {
  return (
    <div className="flex items-center justify-end gap-1 mb-2">
      <button onClick={onZoomOut} className="w-7 h-7 grid place-items-center shrink-0" style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, color: theme.ink }} title={t.zoomOut}>
        <ZoomOut size={13} />
      </button>
      <button
        onClick={onFit}
        className="text-[11px] font-bold px-2.5 h-7 shrink-0"
        style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: isFit ? theme.accentSoft : "transparent", color: isFit ? theme.accent : theme.ink }}
        title={t.zoomFit}
      >
        {isFit ? <Maximize2 size={12} className="inline -mt-0.5 me-1" /> : null}
        {Math.round(scale * 100)}%
      </button>
      <button onClick={onZoomIn} className="w-7 h-7 grid place-items-center shrink-0" style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, color: theme.ink }} title={t.zoomIn}>
        <ZoomIn size={13} />
      </button>
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
    <div className="flex flex-col items-stretch shrink-0">
      <div className="flex items-end gap-1 px-1 flex-1">{children}</div>
      <p className="text-center text-[9px] font-semibold uppercase tracking-wide mt-1 px-1" style={{ opacity: 0.6 }}>
        {label}
      </p>
    </div>
  );
}
function RibbonDivider({ theme }) {
  return <div className="self-stretch w-px my-1.5 shrink-0" style={{ background: theme.hairline }} />;
}
function RibbonButton({ icon: Icon, label, active, onClick, theme, skin, tone }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 shrink-0"
      style={{
        borderRadius: skin.radiusSm,
        minWidth: 52,
        background: active ? theme.accentSoft : "transparent",
        color: tone?.fg || (active ? theme.accent : theme.ink),
        border: `1px solid ${active ? theme.accent : "transparent"}`,
      }}
    >
      <Icon size={16} />
      <span className="text-[9px] font-bold leading-none whitespace-nowrap">{label}</span>
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
        if (!first) out.push({ id: `${leaf.id}-fb-break`, kind: "pagebreak" });
        first = false;
        const leafTitle = lang === "ar" ? leaf.ar : leaf.en;
        const branchTitle = lang === "ar" ? br.ar : br.en;
        const paletteId = leaf.pagePaletteId || 1;
        blocks.forEach((b, i) => {
          out.push({ ...b, id: `${leaf.id}-fb-${b.id || i}`, _leafTitle: leafTitle, _branchTitle: branchTitle, _paletteId: paletteId });
        });
      });
    });
  });
  return out;
}

/* Read-only, whole-book A4 preview — for a reviewer who wants to
   page through every leaf's printed pages back to back, the same
   way the reader view lets someone go through every question in the
   book rather than one card at a time. */
function FullBookA4Preview({ book, lang, t, theme, skin, docTitle }) {
  const blocks = useMemo(() => buildFullBookBlocks(book, lang), [book, lang]);
  const { pages, measureRef } = usePagedBlocks(blocks);
  const { containerRef, scale, zoomIn, zoomOut, zoomFit, isFit } = useFitScale();

  if (!blocks.length) {
    return (
      <p className="text-sm" style={{ color: "#00000088" }}>
        {t.emptyBook}
      </p>
    );
  }

  return (
    <div>
      <div ref={measureRef} style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", width: "182mm", top: -99999, fontFamily: PAGE_FONT, fontSize: 15, lineHeight: 1.9 }}>
        {blocks.map((b, i) => (
          <PlateBlock key={b.id || i} block={b} kinds={plateKindsFor(paletteById(b._paletteId || 1))} />
        ))}
      </div>

      <ZoomBar t={t} theme={theme} skin={skin} scale={scale} onZoomOut={zoomOut} onZoomIn={zoomIn} onFit={zoomFit} isFit={isFit} />

      <div ref={containerRef} className="overflow-x-auto">
        <div style={{ zoom: scale }}>
          <div className="flex flex-col gap-6 items-center py-2">
            {pages.map((pageBlocks, pi) => {
              const owner = pageBlocks[0];
              const palette = paletteById(owner?._paletteId || 1);
              return (
                <div
                  key={pi}
                  dir="rtl"
                  style={{ width: "210mm", minHeight: "297mm", background: palette.PageBG, color: palette.BodyText, padding: "16mm 14mm", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", borderRadius: 4, fontFamily: PAGE_FONT, fontSize: 15, lineHeight: 1.9 }}
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
                    <span>{owner?._branchTitle ? `${owner._branchTitle} — ${owner._leafTitle}` : owner?._leafTitle}</span>
                  </div>

                  {pageBlocks.map((b, i) => (
                    <PlateBlock key={b.id || i} block={b} kinds={plateKindsFor(paletteById(b._paletteId || 1))} />
                  ))}
                  <p style={{ position: "relative", top: "8mm", textAlign: "center", fontSize: 10, color: "#b3a692" }}>{t.pageOf(pi + 1, pages.length)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function A4PageBuilder({ leaf, lang, theme, skin, t, onUpdateLeaf, allLeavesCards, docTitle, pageTitle }) {
  const blocks = leaf.pageBlocks || [];
  const palette = paletteById(leaf.pagePaletteId || 1);
  const kinds = plateKindsFor(palette);
  const setBlocks = (next) => onUpdateLeaf({ pageBlocks: next });
  const updateBlock = (i, patch) => setBlocks(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const deleteBlock = (i) => setBlocks(blocks.filter((_, idx) => idx !== i));
  const moveBlock = (i, dir) => () => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    setBlocks(next);
  };
  const addBlock = (kind) => setBlocks([...blocks, { id: `${leaf.id}-b-${Date.now()}`, kind, title: "", text: "", imageUrl: "", caption: "" }]);
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
  const { containerRef, scale, zoomIn, zoomOut, zoomFit, isFit } = useFitScale();

  const BLOCK_KINDS = [
    ["sectionTitle", t.blockSectionTitle, Heading2],
    ["keyterm", t.blockKeyterm, Tag],
    ["note", t.blockNote, StickyNote],
    ["warning", t.blockWarning, AlertTriangle],
    ["important", t.blockImportant, AlertCircle],
    ["image", t.blockImage, ImagePlus],
    ["code", t.blockCode, Code2],
    ["pagebreak", t.blockPagebreak, CornerDownLeft],
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* RIBBON — grouped tool buttons, Word/PowerPoint-style: icon on
          top, short caption below each group. Scrolls horizontally
          instead of wrapping, so it stays usable on phones. */}
      <div className="overflow-x-auto" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}`, background: theme.surface }}>
        <div className="flex items-start gap-1 p-2 w-max min-w-full">
          <RibbonGroup label={t.pageGroup}>
            <div className="flex flex-col items-center gap-1 px-1 py-1">
              <div className="grid grid-cols-8 gap-1">
                {PAGE_PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onUpdateLeaf({ pagePaletteId: p.id })}
                    title={p.name}
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{
                      background: p.SectionBG,
                      border: `2px solid ${palette.id === p.id ? theme.ink : "transparent"}`,
                      boxShadow: palette.id === p.id ? `0 0 0 2px ${theme.accent}` : "none",
                    }}
                  />
                ))}
              </div>
              <p className="text-[9px] font-semibold whitespace-nowrap" style={{ color: theme.inkSoft }}>
                {palette.name}
              </p>
            </div>
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
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-4 items-start">
        {/* CANVAS — comes first in the DOM so it shows before the task
            pane when this stacks to one column on small screens. */}
        <div className="order-1 min-w-0">
          <ZoomBar t={t} theme={theme} skin={skin} scale={scale} onZoomOut={zoomOut} onZoomIn={zoomIn} onFit={zoomFit} isFit={isFit} />

          {/* hidden measuring pass — same width, invisible */}
          <div ref={measureRef} style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", width: "182mm", top: -99999, fontFamily: PAGE_FONT, fontSize: 15, lineHeight: 1.9 }}>
            {blocks.map((b, i) => (
              <PlateBlock key={b.id || i} block={b} kinds={kinds} />
            ))}
          </div>

          <div ref={containerRef} className="overflow-x-auto">
            <div style={{ zoom: scale }}>
              <div className="flex flex-col gap-6 items-center py-2">
                {pages.map((pageBlocks, pi) => (
                  <div
                    key={pi}
                    dir="rtl"
                    style={{ width: "210mm", minHeight: "297mm", background: palette.PageBG, color: palette.BodyText, padding: "16mm 14mm", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", borderRadius: 4, fontFamily: PAGE_FONT, fontSize: 15, lineHeight: 1.9 }}
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

                    {pageBlocks.map((b, i) => (
                      <PlateBlock key={b.id || i} block={b} kinds={kinds} />
                    ))}
                    <p style={{ position: "relative", top: "8mm", textAlign: "center", fontSize: 10, color: "#b3a692" }}>{t.pageOf(pi + 1, pages.length)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TASK PANE — the editable block list, Word "Styles pane"
            style: a slim column beside the canvas on wide screens,
            a full-width panel below it once the layout stacks. */}
        <div className="order-2 p-3" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}`, background: theme.surface, alignSelf: "start" }}>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: theme.inkSoft }}>
            {t.addBlock}
          </p>
          <div className="max-h-[40vh] lg:max-h-[70vh] overflow-y-auto">
            {blocks.map((b, i) => (
              <BlockRow key={b.id || i} block={b} t={t} theme={theme} skin={skin} kinds={kinds} onUpdate={(p) => updateBlock(i, p)} onDelete={() => deleteBlock(i)} onMove={(dir) => moveBlock(i, dir)} />
            ))}
          </div>
        </div>
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
  const groupStyle = { background: theme.surface, borderRadius: 14, border: `1px solid ${theme.hairline}`, padding: 8 };
  const iconBtn = { height: 28, borderRadius: 8, background: theme.surfaceSoft, display: "grid", placeItems: "center", color: theme.ink };
  return (
    <div className="flex flex-col gap-2" style={{ width: 150 }}>
      <div style={groupStyle}>
        <p className="text-[9px] font-bold uppercase mb-1.5" style={{ color: theme.inkSoft }}>
          {t.files}
        </p>
        <div className="flex gap-1.5 mb-1.5">
          <button onClick={() => fileRef.current?.click()} className="flex-1" style={iconBtn} title={t.importBookJson}>
            <FileUp size={14} />
          </button>
          <button onClick={() => downloadJSON(`${book.id}.json`, book)} className="flex-1" style={iconBtn} title={t.exportBookJson}>
            <FileDown size={14} />
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onFile} className="hidden" />
        </div>
        <button onClick={() => orderedImagesRef.current?.click()} className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 mb-1.5" style={{ borderRadius: 8, background: theme.surfaceSoft, color: theme.ink }} title={t.importOrderedImages}>
          <ImagePlus size={12} /> 0·1·2
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
        <button onClick={() => manifestFolderRef.current?.click()} className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5" style={{ borderRadius: 8, background: theme.surfaceSoft, color: theme.ink }} title={t.importManifestFolder}>
          <FolderOpen size={12} /> manifest
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
          <p className="text-[9px] mt-1.5" style={{ color: importStatus.ok ? theme.accent : "#C0392B" }}>
            {importStatus.text}
          </p>
        )}
      </div>
      <div style={groupStyle}>
        <p className="text-[9px] font-bold uppercase mb-1.5" style={{ color: theme.inkSoft }}>
          {t.card}
        </p>
        <button onClick={addCard} className="w-full text-[10px] font-bold py-1.5" style={{ borderRadius: 8, background: theme.accentSoft, color: theme.accent }}>
          + {t.newCard}
        </button>
      </div>
      <div style={groupStyle}>
        <p className="text-[9px] font-bold uppercase mb-1.5" style={{ color: theme.inkSoft }}>
          {t.addQuestion}
        </p>
        <div className="grid grid-cols-3 gap-1 max-h-40 overflow-y-auto">
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <button key={key} onClick={() => addQuestionOfType(key)} className="h-7 grid place-items-center" style={{ borderRadius: 7, background: meta.color.bg, color: meta.color.ink }} title={lang === "ar" ? meta.ar : meta.en}>
              <meta.Icon size={12} />
            </button>
          ))}
        </div>
      </div>
      <div style={groupStyle}>
        <label className="flex items-start gap-1.5 cursor-pointer">
          <input type="checkbox" checked={voiceEnabled} onChange={(e) => onVoiceEnabledChange(e.target.checked)} className="mt-0.5" />
          <span className="text-[10px] font-semibold" style={{ color: theme.ink }}>
            {t.voiceFeature}
          </span>
        </label>
      </div>
    </div>
  );
}

function EditorBreadcrumb({ book, lang, leaf, card, theme }) {
  const branch = leaf ? book.nodes.find((n) => n.id === book.nodes.find((s) => s.id === leaf.parent)?.parent) : null;
  const steps = [
    { n: 1, active: true, label: lang === "ar" ? book.ar?.title : book.en?.title },
    { n: 2, active: !!leaf, label: branch ? (lang === "ar" ? branch.ar : branch.en) : "" },
    { n: 3, active: !!leaf, label: leaf ? (lang === "ar" ? leaf.ar : leaf.en) : "" },
    { n: 4, active: !!card, label: card ? "" : "" },
  ];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((s, i) => (
        <span key={s.n} className="flex items-center gap-2">
          <span
            className="w-6 h-6 grid place-items-center text-[10px] font-bold shrink-0"
            style={{ borderRadius: 999, background: s.active ? theme.accent : theme.surface, color: s.active ? theme.accentInk : theme.inkSoft, border: `1px solid ${s.active ? theme.accent : theme.hairline}` }}
          >
            {s.n}
          </span>
          {s.label && (
            <span className="text-[11px] font-semibold" style={{ color: theme.inkSoft }}>
              {s.label}
            </span>
          )}
          {i < steps.length - 1 && (
            <span style={{ color: theme.hairlineStrong }}>›</span>
          )}
        </span>
      ))}
    </div>
  );
}

function EditorView({ book, lang, theme, skin, voiceEnabled, onVoiceEnabledChange, onUpdateBook }) {
  const t = EDITOR_STR[lang];
  const [tab, setTab] = useState("cards");
  const [selectedLeafId, setSelectedLeafId] = useState(null);
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [previewWholeBook, setPreviewWholeBook] = useState(false);

  const allLeaves = useMemo(() => book.nodes.filter((n) => n.level === "leaf"), [book]);
  const leaf = allLeaves.find((l) => l.id === selectedLeafId) || null;
  const cards = leaf ? leafCards(leaf) : [];
  const card = cards[selectedCardIdx];

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
    onUpdateBook((prev) => ({ ...prev, nodes: prev.nodes.map((n) => (n.id === selectedLeafId ? patchFn(n) : n)) }));
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
    <div className="educraft-panel-in" style={{ background: `linear-gradient(180deg, ${theme.accentSoft} 0%, ${theme.canvas} 55%)`, borderRadius: 20, padding: 16 }}>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <EditorBreadcrumb book={book} lang={lang} leaf={leaf} card={card} theme={theme} />
        <div className="flex items-center gap-2">
          {[
            ["cards", t.tabCards],
            ["pages", t.tabPages],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="text-sm font-bold px-3.5 py-2"
              style={{ borderRadius: skin.radiusSm, background: tab === id ? theme.accent : theme.surface, color: tab === id ? theme.accentInk : theme.ink }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-4">
        <div className="p-3" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}`, background: theme.surface, alignSelf: "start" }}>
          <EditorLeafNav
            book={book}
            lang={lang}
            theme={theme}
            selectedLeafId={selectedLeafId}
            onSelect={(id) => {
              setSelectedLeafId(id);
              setSelectedCardIdx(0);
            }}
          />
        </div>

        <div>
          {!previewWholeBook && !leaf ? (
            <p className="text-sm" style={{ color: theme.inkSoft }}>
              {t.noLeaf}
            </p>
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

          {tab === "pages" ? (
            <>
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <p className="text-xs" style={{ color: theme.inkSoft }}>
                  {previewWholeBook ? t.wholeBookSub : t.pagesSub}
                </p>
                <button
                  onClick={() => setPreviewWholeBook((v) => !v)}
                  className="text-xs font-bold px-3 py-1.5 flex items-center gap-1.5"
                  style={{ borderRadius: skin.radiusSm, background: previewWholeBook ? theme.accent : theme.surface, color: previewWholeBook ? theme.accentInk : theme.ink, border: `1px solid ${theme.hairline}` }}
                >
                  <Library size={13} />
                  {previewWholeBook ? t.backToLeafPages : t.previewWholeBook}
                </button>
              </div>
              {previewWholeBook ? (
                <FullBookA4Preview book={book} lang={lang} t={t} theme={theme} skin={skin} docTitle={lang === "ar" ? book.ar?.title : book.en?.title} />
              ) : !leaf ? (
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
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {cards.map((c, i) => (
                      <button
                        key={c.id || i}
                        onClick={() => setSelectedCardIdx(i)}
                        className="text-xs font-bold px-3 py-1.5"
                        style={{ borderRadius: 999, background: selectedCardIdx === i ? theme.accent : theme.surface, color: selectedCardIdx === i ? theme.accentInk : theme.ink }}
                      >
                        {t.card} {i + 1}
                      </button>
                    ))}
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
  const doneSet = useMemo(() => new Set(plan.doneLeafIds.filter((id) => validIds.has(id))), [plan.doneLeafIds, validIds]);
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
    let s = 0;
    let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!plan.log[toDateStr(cursor)]) cursor.setDate(cursor.getDate() - 1);
    while ((plan.log[toDateStr(cursor)] || 0) > 0) {
      s++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.log]);

  const pctComplete = totalLeaves ? Math.round((doneCount / totalLeaves) * 100) : 0;

  const toggleLeaf = (leafId) => {
    onUpdatePlan((p) => {
      const isDone = p.doneLeafIds.includes(leafId);
      const nextIds = isDone ? p.doneLeafIds.filter((id) => id !== leafId) : [...p.doneLeafIds, leafId];
      const nextLog = { ...p.log, [todayStr]: Math.max(0, (p.log[todayStr] || 0) + (isDone ? -1 : 1)) };
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
  const [deletedBookIds, setDeletedBookIds] = useState(() => saved.deletedBookIds || []);
  const initialBooks = useMemo(() => {
    if (EXPORT) return EXPORT.books;
    const deletedSet = new Set(saved.deletedBookIds || []);
    const base = BOOKS.filter((b) => !deletedSet.has(b.id));
    if (saved.customBooks && Array.isArray(saved.customBooks)) {
      const custom = saved.customBooks.filter((b) => !deletedSet.has(b.id));
      const existingIds = new Set(base.map((b) => b.id));
      return [...base, ...custom.filter((b) => !existingIds.has(b.id))];
    }
    return base;
  }, [EXPORT, saved.deletedBookIds, saved.customBooks]);

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
  const [covers, setCovers] = useState(saved.covers || (EXPORT && EXPORT.covers) || {});
  const [plans, setPlans] = useState(saved.plans || (EXPORT && EXPORT.plans) || {});
  const [bookFlavors, setBookFlavors] = useState(saved.bookFlavors || (EXPORT && EXPORT.bookFlavors) || {});
  const [collections, setCollections] = useState(saved.collections || (EXPORT && EXPORT.collections) || []);
  const [libraryPath, setLibraryPath] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(saved.voiceEnabled !== false);

  const setBookFlavor = (bid, fid) => setBookFlavors((prev) => ({ ...prev, [bid]: fid }));

  const deleteBook = (deleteId) => {
    setDeletedBookIds((prev) => [...new Set([...(prev || []), deleteId])]);
    setBooks((prev) => prev.filter((b) => b.id !== deleteId));
    setCovers((prev) => {
      const next = { ...prev };
      delete next[deleteId];
      return next;
    });
    setPlans((prev) => {
      const next = { ...prev };
      delete next[deleteId];
      return next;
    });
    setBookFlavors((prev) => {
      const next = { ...prev };
      delete next[deleteId];
      return next;
    });
    setCollections((prev) =>
      prev.map((c) => ({
        ...c,
        itemIds: (c.itemIds || []).filter((id) => id !== deleteId)
      }))
    );
    if (bookId === deleteId) {
      setView("library");
      setLeafId(null);
    }
  };

  const handleImportSuccess = ({ books: newBooks, collections: newCols, plans: newPlans, targetBookId }) => {
    setBooks(newBooks);
    setCollections(newCols);
    if (newPlans && Object.keys(newPlans).length > 0) {
      setPlans((prev) => ({ ...prev, ...newPlans }));
    }
    if (targetBookId) {
      setDeletedBookIds((prev) => (prev || []).filter((id) => id !== targetBookId));
      setBookId(targetBookId);
    }
  };

  const ui = UI[lang];
  const theme = FLAVORS[flavorId][mode];
  const currentBook = books.find((b) => b.id === bookId) || books[0] || BOOKS[0];
  const currentBookFlavorId = (currentBook && bookFlavors[currentBook.id]) || flavorId;
  const bookTheme = FLAVORS[currentBookFlavorId] ? FLAVORS[currentBookFlavorId][mode] : theme;
  const skin = SKINS[skinId];
  const dir = ui.dir;
  const updateCurrentBook = (fn) => setBooks((prev) => prev.map((b) => (b.id === currentBook.id ? fn(b) : b)));
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
    saveAppState({
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
      deletedBookIds,
      customBooks
    });
  }, [lang, mode, skinId, flavorId, bookFlavors, cardMode, scrollDir, voiceEnabled, covers, plans, collections, deletedBookIds, books]);

  const resetAll = () => {
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
  const leafById = useMemo(() => Object.fromEntries(currentBook.nodes.filter((n) => n.level === "leaf").map((n) => [n.id, n])), [currentBook]);
  const currentLeaf = leafId ? leafById[leafId] : null;
  const setCover = (id, url) => setCovers((c) => ({ ...c, [id]: url }));
  const clearCover = (id) =>
    setCovers((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const createCollection = (kind) => {
    const name = window.prompt(kind === "encyclopedia" ? ui.collectionNamePromptEncyclopedia : ui.collectionNamePromptFolder);
    if (!name || !name.trim()) return;
    setCollections((prev) => [...prev, { id: uid(kind), kind, title: name.trim(), itemIds: [] }]);
  };
  const deleteCollection = (id) => {
    if (!window.confirm(ui.libraryDeleteCollectionConfirm)) return;
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setLibraryPath((prev) => prev.filter((x) => x !== id));
  };
  const assignToCollection = (itemId, collectionId) => {
    setCollections((prev) => prev.map((c) => (c.id === collectionId ? { ...c, itemIds: Array.from(new Set([...c.itemIds, itemId])) } : c)));
  };
  const removeFromCollection = (itemId) => {
    setCollections((prev) => prev.map((c) => (c.itemIds.includes(itemId) ? { ...c, itemIds: c.itemIds.filter((x) => x !== itemId) } : c)));
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
        html, body { margin: 0; padding: 0; background: ${theme.canvas}; }
        #root, #__next { background: ${theme.canvas}; }
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
        .educraft-hero-in { animation: educraft-rise .45s ease both; }
        .educraft-panel-in { animation: educraft-rise .3s ease both; }
        .educraft-modal-in { animation: educraft-pop .22s ease both; }
      `}</style>

      <div className="educraft-root max-w-5xl mx-auto px-5 sm:px-8 pb-16">
        {/* header */}
        <header
          className="flex items-center justify-between gap-4 mt-6 px-5 py-3.5 flex-wrap"
          style={{
            background: skin.surfaceAlpha >= 1 ? theme.header : hexToRgba(theme.header, skin.surfaceAlpha),
            borderRadius: skin.radiusLg,
            border: `${skin.borderW}px solid ${skinBorderColor(skin, theme)}`,
            boxShadow: skin.shadow,
            backdropFilter: skin.blur,
            WebkitBackdropFilter: skin.blur,
          }}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={20} color={theme.ink} strokeWidth={2} />
            <span className="text-lg font-bold" style={{ fontFamily: displayFont, color: theme.ink, letterSpacing: skin.letterSpacing }}>
              {ui.brand}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setView("library")}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 transition-colors"
              style={{ borderRadius: skin.radiusSm, color: view === "library" ? theme.accentInk : theme.ink, background: view === "library" ? theme.accent : "transparent" }}
            >
              <Library size={14} />
              {ui.navLibrary}
            </button>
            <button
              onClick={() => setView("tree")}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 transition-colors"
              style={{ borderRadius: skin.radiusSm, color: view === "tree" ? theme.accentInk : theme.ink, background: view === "tree" ? theme.accent : "transparent" }}
            >
              <GitBranch size={14} />
              {ui.navTree}
            </button>
            <button
              onClick={() => setView("editor")}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 transition-colors"
              style={{ borderRadius: skin.radiusSm, color: view === "editor" ? theme.accentInk : theme.ink, background: view === "editor" ? theme.accent : "transparent" }}
            >
              <Settings size={14} />
              {ui.navEditor}
            </button>
            <button
              onClick={() => setView("planner")}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 transition-colors"
              style={{ borderRadius: skin.radiusSm, color: view === "planner" ? theme.accentInk : theme.ink, background: view === "planner" ? theme.accent : "transparent" }}
            >
              <CalendarDays size={14} />
              {ui.navPlanner}
            </button>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-2"
              style={{ borderRadius: skin.radiusSm, color: theme.ink, minHeight: 40 }}
              aria-label="Toggle language"
            >
              <Languages size={16} />
              {ui.langToggle}
            </button>
            <button
              onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
              className="p-2"
              style={{ borderRadius: skin.radiusSm, color: theme.ink, minHeight: 40, minWidth: 40 }}
              aria-label="Toggle theme"
            >
              {mode === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2"
              style={{ borderRadius: skin.radiusSm, color: theme.ink, minHeight: 40, minWidth: 40 }}
              aria-label={ui.navSettings}
              title={ui.navSettings}
            >
              <Settings size={16} />
            </button>
          </div>

          {/* mobile nav row */}
          <nav className="flex md:hidden items-center gap-1 w-full justify-center pt-1">
            <button
              onClick={() => setView("library")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors"
              style={{ borderRadius: skin.radiusSm, color: view === "library" ? theme.accentInk : theme.ink, background: view === "library" ? theme.accent : "transparent" }}
            >
              <Library size={13} />
              {ui.navLibrary}
            </button>
            <button
              onClick={() => setView("tree")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors"
              style={{ borderRadius: skin.radiusSm, color: view === "tree" ? theme.accentInk : theme.ink, background: view === "tree" ? theme.accent : "transparent" }}
            >
              <GitBranch size={13} />
              {ui.navTree}
            </button>
            <button
              onClick={() => setView("editor")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors"
              style={{ borderRadius: skin.radiusSm, color: view === "editor" ? theme.accentInk : theme.ink, background: view === "editor" ? theme.accent : "transparent" }}
            >
              <Settings size={13} />
              {ui.navEditor}
            </button>
            <button
              onClick={() => setView("planner")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors"
              style={{ borderRadius: skin.radiusSm, color: view === "planner" ? theme.accentInk : theme.ink, background: view === "planner" ? theme.accent : "transparent" }}
            >
              <CalendarDays size={13} />
              {ui.navPlanner}
            </button>
          </nav>
        </header>

        <div className="educraft-hero-in pt-8">
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
              onExportBook={onExportBook ? (book) => onExportBook(book, lang, theme, ui, skin, covers) : undefined}
              onExportCollection={onExportCollection ? (col) => onExportCollection(col, books, collections, lang, theme, ui, skin, covers) : undefined}
              onOpenImportModal={() => setImportModalOpen(true)}
              onDeleteBook={deleteBook}
              plans={plans}
            />
          ) : view === "tree" ? (
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
              onExport={onExportBook ? () => onExportBook(currentBook, lang, bookTheme, ui, skin, covers) : undefined}
              covers={covers}
              onChangeCover={setCover}
              onClearCover={clearCover}
              bookFlavorId={currentBookFlavorId}
              onChangeBookFlavor={(fid) => setBookFlavor(currentBook.id, fid)}
              onDeleteBook={deleteBook}
              plan={currentPlan}
            />
          ) : view === "browse" ? (
            <BrowseView key={currentBook.id} book={currentBook} lang={lang} ui={ui} theme={bookTheme} dir={dir} skin={skin} onBack={() => setView("tree")} />
          ) : view === "readthrough" ? (
            <section key={currentBook.id}>
              <button
                onClick={() => setView("tree")}
                className="flex items-center gap-1.5 text-sm font-semibold mb-5"
                style={{ color: bookTheme.inkSoft, minHeight: 40 }}
              >
                {dir === "rtl" ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                {currentBook[lang].title}
              </button>
              <FullBookA4Preview
                book={currentBook}
                lang={lang}
                t={EDITOR_STR[lang]}
                theme={bookTheme}
                skin={skin}
                docTitle={lang === "ar" ? currentBook.ar?.title : currentBook.en?.title}
              />
            </section>
          ) : view === "editor" ? (
            <EditorView
              key={currentBook.id}
              book={currentBook}
              lang={lang}
              theme={bookTheme}
              skin={skin}
              voiceEnabled={voiceEnabled}
              onVoiceEnabledChange={setVoiceEnabled}
              onUpdateBook={updateCurrentBook}
            />
          ) : view === "planner" ? (
            <PlannerView key={currentBook.id} book={currentBook} lang={lang} ui={ui} theme={bookTheme} dir={dir} skin={skin} plan={currentPlan} onUpdatePlan={updateCurrentPlan} />
          ) : currentLeaf ? (
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
          ) : (
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
              onExport={onExportBook ? () => onExportBook(currentBook, lang, bookTheme, ui, skin, covers) : undefined}
              covers={covers}
              onChangeCover={setCover}
              onClearCover={clearCover}
              bookFlavorId={currentBookFlavorId}
              onChangeBookFlavor={(fid) => setBookFlavor(currentBook.id, fid)}
              onDeleteBook={deleteBook}
              plan={currentPlan}
            />
          )}
        </div>
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
          onClose={() => setSettingsOpen(false)}
          onReset={resetAll}
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
    </div>
  );
}



/* =================================================================
   EXPORT — everything below is what used to live in a separate
   generated/ folder + a thin EDUcraft.jsx wrapper (see the project
   version of this deliverable if you want the multi-file, more
   maintainable form with `npm run build:export`). Merged into one
   file here so this single .jsx is fully self-contained and portable
   to any environment that only accepts one file.

   EDUCRAFT_EXPORT_BUNDLE_JS is this exact component tree (everything
   above) bundled once with React + ReactDOM + lucide-react by esbuild.
   EDUCRAFT_EXPORT_TAILWIND_CSS is the exact compiled Tailwind CSS for
   every class name used above. Exporting a book/collection just wraps
   these two constants + the book's own JSON data (images/video/audio
   already base64 from MediaUploadField) into one offline .html file —
   it is never a re-implementation of the UI, so it can never drift
   from what this file actually renders.
================================================================== */
// EDUCRAFT_EXPORT_BUNDLE_JS & EDUCRAFT_EXPORT_TAILWIND_CSS imported from src/data/export_bundle_data.js

function escapeHtml(str) {
  return (str == null ? "" : String(str)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeScriptClose(str) {
  return str.replace(/<\/(script)/gi, "<\\/$1");
}
const EXPORT_FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Press+Start+2P&family=Inter:wght@400;500;600;700&family=Cairo:wght@500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">`;

function buildExportHTML({ title, favicon, lang, dir, seed }) {
  const payload = JSON.stringify(seed).replace(/</g, "\\u003c");
  const bundleJs = escapeScriptClose(EDUCRAFT_EXPORT_BUNDLE_JS);
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="icon" href="${favicon}">
${EXPORT_FONT_LINKS}
<style>${EDUCRAFT_EXPORT_TAILWIND_CSS}</style>
</head>
<body>
<div id="root"></div>
<script>window.__EDUCRAFT_EXPORT__ = ${payload};</script>
<script>${bundleJs}</script>
</body>
</html>`;
}

function downloadHTMLFile(filename, html) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function skinIdOf(skin) {
  return Object.keys(SKINS).find((k) => SKINS[k] === skin) || "normal";
}
function flavorIdOf(theme) {
  return Object.keys(FLAVORS).find((k) => FLAVORS[k].light === theme || FLAVORS[k].dark === theme) || "normal";
}

function downloadBookHTML(book, lang, theme, ui, skin, covers) {
  covers = covers || {};
  const currentFlavor = flavorIdOf(theme);
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
  };
  const favicon = faviconDataUri(book.cover, book[lang].title);
  const html = buildExportHTML({ title: book[lang].title, favicon, lang, dir: ui.dir, seed });
  downloadHTMLFile(`${slugify(book[lang].title)}.html`, html);
}

function downloadCollectionHTML(collection, books, collections, lang, theme, ui, skin, covers) {
  covers = covers || {};
  const currentFlavor = flavorIdOf(theme);
  const subtree = resolveCollectionSubtree(collection, collections || []);
  const flatBooks = resolveCollectionBooks(collection, collections || [], books);
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
  };
  const favicon = faviconDataUri({ from: flatBooks[0]?.cover?.from, to: flatBooks[0]?.cover?.to }, collection.title);
  const html = buildExportHTML({ title: collection.title, favicon, lang, dir: ui.dir, seed });
  downloadHTMLFile(`${slugify(collection.title)}.html`, html);
}

export default function EDUcraft() {
  return <EDUcraftApp onExportBook={downloadBookHTML} onExportCollection={downloadCollectionHTML} />;
}
