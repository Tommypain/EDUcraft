import { useState, useMemo, useEffect, useRef } from "react";
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

const BOOKS = [
  {
    id: "web-foundations",
    cover: { from: "#F2C879", to: "#E8654A", icon: "code" },
    en: { title: "HTML & CSS Foundations", tagline: "Structure the page, then dress it." },
    ar: { title: "أساسيات HTML و CSS", tagline: "ابني الصفحة، وبعدين لبّسها." },
    crossLinks: [
      ["a1a", "b2a"],
      ["a2a", "b1a"],
    ],
    nodes: [
      { id: "a", level: "branch", x: 200, y: BRANCH_Y, en: "Structure", ar: "البنية" },
      { id: "b", level: "branch", x: 629, y: BRANCH_Y, en: "Styling", ar: "التنسيق" },

      { id: "a1", level: "sub", parent: "a", x: 114, y: SUB_Y, en: "Elements", ar: "العناصر" },
      { id: "a2", level: "sub", parent: "a", x: 286, y: SUB_Y, en: "Semantics", ar: "الدلالات" },
      { id: "b1", level: "sub", parent: "b", x: 514, y: SUB_Y, en: "Layout", ar: "التخطيط" },
      { id: "b2", level: "sub", parent: "b", x: 743, y: SUB_Y, en: "Selectors", ar: "المحددات" },

      {
        id: "a1a",
        level: "leaf",
        parent: "a1",
        x: 57,
        y: LEAF_Y,
        en: "Lists",
        ar: "القوائم",
        questions: [
          {
            type: "single",
            subject: "HTML",
            difficulty: "Beginner",
            tier: "core",
            dir: "ltr",
            en: { prompt: "Which HTML element defines an ordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correct: 1 },
            ar: { prompt: "أنهي عنصر HTML بيعرّف قائمة مرقّمة؟", options: ["<ul>", "<ol>", "<li>", "<dl>"], correct: 1 },
          },
          {
            type: "short",
            subject: "CSS",
            difficulty: "Beginner",
            tier: "core",
            dir: "ltr",
            en: { prompt: "Which CSS property changes the color of text?", accepted: ["color"] },
            ar: { prompt: "أنهي خاصية CSS بتغيّر لون النص؟", accepted: ["color"] },
          },
        ],
        pagePaletteId: 2,
        pageBlocks: [
          { id: "a1a-p-title", kind: "sectionTitle", text: "Lists" },
          { id: "a1a-p-key1", kind: "keyterm", title: "<ul> vs <ol>", text: "<ul> is an unordered (bulleted) list; <ol> is an ordered (numbered) list. Both hold <li> items." },
          { id: "a1a-p-note1", kind: "note", title: "Nesting", text: "You can nest a full <ul> or <ol> inside a single <li> to build sub-lists." },
          { id: "a1a-p-code1", kind: "code", title: "Example", text: "<ol>\n  <li>Preheat oven</li>\n  <li>Mix ingredients</li>\n  <li>Bake</li>\n</ol>" },
          { id: "a1a-p-important1", kind: "important", title: "Accessibility", text: "Screen readers announce list length automatically — use real <ul>/<ol> markup instead of styled <div>s." },
        ],
      },
      {
        id: "a1b",
        level: "leaf",
        parent: "a1",
        x: 171,
        y: LEAF_Y,
        en: "Links",
        ar: "الروابط",
        questions: [
          {
            type: "fill",
            subject: "HTML",
            difficulty: "Beginner",
            tier: "core",
            dir: "ltr",
            en: { template: "The ___ tag defines a hyperlink, and its ___ attribute specifies the destination URL.", blanks: ["a", "href"] },
            ar: { template: "الوسم ___ بيعرّف رابط تشعبي، وخاصية ___ بتحدد رابط الوجهة.", blanks: ["a", "href"] },
          },
        ],
      },
      {
        id: "a2a",
        level: "leaf",
        parent: "a2",
        x: 286,
        y: LEAF_Y,
        en: "Tag roles",
        ar: "أدوار الوسوم",
        questions: [
          {
            type: "sort",
            subject: "HTML",
            difficulty: "Beginner",
            tier: "core",
            dir: "ltr",
            en: { prompt: "Sort each tag into its default display role.", bins: ["Block", "Inline"], items: [["<div>", "Block"], ["<span>", "Inline"], ["<p>", "Block"], ["<a>", "Inline"]] },
            ar: { prompt: "رتّب كل tag حسب نوع العرض الافتراضي بتاعه.", bins: ["Block", "Inline"], items: [["<div>", "Block"], ["<span>", "Inline"], ["<p>", "Block"], ["<a>", "Inline"]] },
          },
        ],
      },
      {
        id: "b1a",
        level: "leaf",
        parent: "b1",
        x: 400,
        y: LEAF_Y,
        en: "Flexbox",
        ar: "فلكس بوكس",
        cards: [
          {
            id: "b1a-card1",
            image: "https://picsum.photos/seed/flexbox-diagram/640/360",
            imagePosition: "top",
            questions: [
              {
                type: "single",
                subject: "CSS",
                difficulty: "Intermediate",
                tier: "core",
                dir: "ltr",
                en: { prompt: "Which property controls the gap between a flex container's items?", options: ["gap", "margin", "align-items", "justify-content"], correct: 0 },
                ar: { prompt: "أنهي خاصية بتتحكم في المسافة بين عناصر الـ flex container؟", options: ["gap", "margin", "align-items", "justify-content"], correct: 0 },
              },
              {
                type: "tf",
                subject: "CSS",
                difficulty: "Intermediate",
                tier: "core",
                dir: "ltr",
                en: { prompt: "In Flexbox, justify-content controls alignment along the cross axis.", correct: false },
                ar: { prompt: "في الـ Flexbox، خاصية justify-content بتتحكم في المحاذاة على المحور العرضي.", correct: false },
              },
            ],
          },
        ],
        questions: [],
        pagePaletteId: 1,
        pageBlocks: [
          { id: "b1a-p-title", kind: "sectionTitle", text: "Flexbox" },
          { id: "b1a-p-key1", kind: "keyterm", title: "flex container", text: "The parent element with display: flex set on it. Every direct child becomes a flex item." },
          { id: "b1a-p-note1", kind: "note", title: "Main axis vs cross axis", text: "By default the main axis runs horizontally (row) and the cross axis runs vertically. flex-direction: column flips this." },
          { id: "b1a-p-img1", kind: "image", imageUrl: "https://picsum.photos/seed/flexbox-diagram/640/360", caption: "Flex container with three items aligned along the main axis." },
          { id: "b1a-p-code1", kind: "code", title: "Basic flex container", text: ".container {\n  display: flex;\n  gap: 12px;\n  justify-content: space-between;\n  align-items: center;\n}" },
          { id: "b1a-p-warn1", kind: "warning", title: "Common mistake", text: "justify-content aligns items along the MAIN axis, not the cross axis — align-items handles the cross axis." },
          { id: "b1a-p-important1", kind: "important", title: "Remember", text: "gap works on flex containers just like it does on grid — no more negative-margin hacks for spacing." },
          { id: "b1a-p-break1", kind: "pagebreak" },
          { id: "b1a-p-title2", kind: "sectionTitle", text: "Quick recap" },
          { id: "b1a-p-note2", kind: "note", title: "Shrink / grow / basis", text: "flex-grow, flex-shrink, and flex-basis (shorthand: flex) control how each item resizes to fill the container." },
        ],
      },
      {
        id: "b1b",
        level: "leaf",
        parent: "b1",
        x: 514,
        y: LEAF_Y,
        en: "Box model",
        ar: "نموذج الصندوق",
        questions: [
          {
            type: "order",
            subject: "CSS",
            difficulty: "Intermediate",
            tier: "core",
            dir: "ltr",
            en: { prompt: "Arrange the CSS box model from the inside out.", items: ["margin", "content", "border", "padding"], correct: ["content", "padding", "border", "margin"] },
            ar: { prompt: "رتّب مكونات الـ CSS box model من الجوه للبرّه.", items: ["margin", "content", "border", "padding"], correct: ["content", "padding", "border", "margin"] },
          },
        ],
      },
      {
        id: "b1c",
        level: "leaf",
        parent: "b1",
        x: 629,
        y: LEAF_Y,
        en: "Units",
        ar: "الوحدات",
        questions: [
          {
            type: "multi",
            subject: "CSS",
            difficulty: "Intermediate",
            tier: "core",
            dir: "ltr",
            en: { prompt: "Select every value that is a valid CSS length or size unit.", options: ["px", "rgb", "em", "vh", "deg"], correct: [0, 2, 3] },
            ar: { prompt: "اختار كل قيمة تعتبر وحدة طول أو حجم صحيحة في CSS.", options: ["px", "rgb", "em", "vh", "deg"], correct: [0, 2, 3] },
          },
        ],
      },
      {
        id: "b2a",
        level: "leaf",
        parent: "b2",
        x: 743,
        y: LEAF_Y,
        en: "Matching",
        ar: "التوصيل",
        questions: [
          {
            type: "match",
            subject: "CSS",
            difficulty: "Intermediate",
            tier: "core",
            dir: "ltr",
            en: {
              prompt: "Match each selector to what it targets.",
              left: [".card", "#hero", "*", "a:hover"],
              right: ["A link while the pointer is over it", "Every element on the page", "A single unique element by id", "Any element with a given class"],
              correct: [3, 2, 1, 0],
            },
            ar: {
              prompt: "وصّل كل selector باللي بيستهدفه.",
              left: [".card", "#hero", "*", "a:hover"],
              right: ["لينك وقت ما المؤشر فوقه", "كل عنصر في الصفحة", "عنصر واحد فريد بالـ id", "أي عنصر بكلاس معيّن"],
              correct: [3, 2, 1, 0],
            },
          },
        ],
      },
    ],
  },
  {
    id: "js-deep-dive",
    cover: { from: "#6EE7B7", to: "#1F6B47", icon: "brackets" },
    en: { title: "JavaScript Deep Dive", tagline: "Arrays, async, and a gut check." },
    ar: { title: "جافاسكريبت بعمق", tagline: "مصفوفات، برمجة غير متزامنة، وتقييم ذاتي." },
    crossLinks: [["a1a", "b1a"]],
    nodes: [
      { id: "a", level: "branch", x: 267, y: BRANCH_Y, en: "Fundamentals", ar: "الأساسيات" },
      { id: "b", level: "branch", x: 667, y: BRANCH_Y, en: "Reflection", ar: "تأمّل" },

      { id: "a1", level: "sub", parent: "a", x: 133, y: SUB_Y, en: "Arrays", ar: "المصفوفات" },
      { id: "a2", level: "sub", parent: "a", x: 400, y: SUB_Y, en: "Async", ar: "غير متزامن" },
      { id: "b1", level: "sub", parent: "b", x: 667, y: SUB_Y, en: "Self-check", ar: "تقييم ذاتي" },

      {
        id: "a1a",
        level: "leaf",
        parent: "a1",
        x: 133,
        y: LEAF_Y,
        en: "Array methods",
        ar: "دوال المصفوفات",
        cards: [
          {
            id: "a1a-card1",
            image: "https://picsum.photos/seed/array-methods/480/480",
            imagePosition: "right",
            questions: [
              {
                type: "cloze",
                subject: "JavaScript",
                difficulty: "Intermediate",
                tier: "extra",
                dir: "rtl",
                en: { template: "The ___ method returns the first array element that satisfies a condition.", bank: ["find", "filter", "map", "reduce"], correct: "find" },
                ar: { template: "الدالة ___ بترجع أول عنصر في المصفوفة بيحقق شرط معيّن.", bank: ["find", "filter", "map", "reduce"], correct: "find" },
              },
              {
                type: "numeric",
                subject: "JavaScript",
                difficulty: "Advanced",
                tier: "advanced",
                dir: "ltr",
                en: { prompt: "At most how many parameters can the callback passed to Array.prototype.reduce receive?", correct: 4, tolerance: 0 },
                ar: { prompt: "أد ايه أقصى عدد باراميترات ممكن الـ callback بتاع reduce ياخدها؟", correct: 4, tolerance: 0 },
              },
            ],
          },
        ],
        questions: [],
      },
      {
        id: "a2a",
        level: "leaf",
        parent: "a2",
        x: 400,
        y: LEAF_Y,
        en: "Promises",
        ar: "الـ Promises",
        questions: [
          {
            type: "essay",
            subject: "JavaScript",
            difficulty: "Advanced",
            tier: "extra",
            dir: "rtl",
            en: {
              prompt: "Explain the difference between synchronous and asynchronous code in JavaScript, and why we use Promises.",
              model: "Synchronous code runs top to bottom, blocking until each line finishes. Asynchronous code (like fetch()) lets the rest of the page keep running, and reports back through a Promise once the result is ready.",
            },
            ar: {
              prompt: "اشرح الفرق بين الكود الـ Synchronous والـ Asynchronous في جافاسكريبت، ولية بنستخدم Promises.",
              model: "الكود المتزامن بيتنفذ سطر سطر ومحدش بيكمل قبل ما اللي قبله يخلص. الكود الغير متزامن زي fetch() بيسمح للصفحة تكمل شغلها من غير ما تتوقف، وبيرجع النتيجة عن طريق Promise لما تجهز.",
            },
          },
        ],
      },
      {
        id: "b1a",
        level: "leaf",
        parent: "b1",
        x: 667,
        y: LEAF_Y,
        en: "Confidence",
        ar: "الثقة",
        questions: [
          {
            type: "rating",
            subject: "Self-check",
            difficulty: "Reflection",
            tier: "extra",
            dir: "ltr",
            en: { prompt: "How confident do you feel about CSS Grid right now?" },
            ar: { prompt: "أد ايه إحساسك بالثقة في CSS Grid دلوقتي؟" },
          },
          {
            type: "slider",
            subject: "CSS",
            difficulty: "Intermediate",
            tier: "core",
            dir: "ltr",
            en: { prompt: "Drag the slider to the opacity value that makes an element exactly half transparent.", min: 0, max: 1, step: 0.05, correct: 0.5, tolerance: 0.05 },
            ar: { prompt: "حرّك السلايدر لقيمة الـ opacity اللي بتخلي العنصر شفاف بنص القيمة بالظبط.", min: 0, max: 1, step: 0.05, correct: 0.5, tolerance: 0.05 },
          },
        ],
      },
    ],
  },
];

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
function KnowledgeTree({ book, lang, dir, theme, ui, skin, selected, onSelect }) {
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
function LibraryView({ lang, ui, theme, dir, onOpen, skin, covers, onChangeCover, onClearCover, books, collections, libraryPath, onEnterCollection, onCrumb, onCreateCollection, onDeleteCollection, onAssignToCollection, onRemoveFromCollection, onExportBook, onExportCollection, onOpenImportModal, onDeleteBook }) {
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
        <KnowledgeTree book={book} lang={lang} dir={dir} theme={theme} ui={ui} skin={skin} selected={selectedLeaf} onSelect={onSelectLeaf} />
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
function DeckView({ node, book, lang, ui, theme, dir, skin, cardMode, scrollDir, onBack }) {
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  return (
    <section>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5" style={{ color: theme.inkSoft, minHeight: 40 }}>
        <BackIcon size={15} />
        {book[lang].title}
      </button>
      <NodeQuestionDeck node={node} book={book} lang={lang} ui={ui} theme={theme} dir={dir} skin={skin} cardMode={cardMode} scrollDir={scrollDir} />
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
  const [lang, setLang] = useState(saved.lang || (EXPORT && EXPORT.lang) || "en");
  const [mode, setMode] = useState(saved.mode || "light");
  const [view, setView] = useState("library");
  const [books, setBooks] = useState(EXPORT ? EXPORT.books : BOOKS);
  const [bookId, setBookId] = useState(EXPORT ? EXPORT.startBookId || EXPORT.books[0].id : BOOKS[0].id);
  const [leafId, setLeafId] = useState(null);
  const [skinId, setSkinId] = useState(saved.skinId || (EXPORT && EXPORT.skinId) || "normal");
  const [flavorId, setFlavorId] = useState(saved.flavorId || (EXPORT && EXPORT.flavorId) || "normal");
  const [cardMode, setCardMode] = useState(saved.cardMode || "paged");
  const [scrollDir, setScrollDir] = useState(saved.scrollDir || "vertical");
  const [covers, setCovers] = useState(saved.covers || (EXPORT && EXPORT.covers) || {});
  const [plans, setPlans] = useState(saved.plans || {});
  const [bookFlavors, setBookFlavors] = useState(saved.bookFlavors || {});
  const [collections, setCollections] = useState(saved.collections || (EXPORT && EXPORT.collections) || []);
  const [libraryPath, setLibraryPath] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(saved.voiceEnabled !== false);

  const setBookFlavor = (bid, fid) => setBookFlavors((prev) => ({ ...prev, [bid]: fid }));

  const deleteBook = (deleteId) => {
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
        itemIds: c.itemIds.filter((id) => id !== deleteId)
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
      setBookId(targetBookId);
    }
  };

  const ui = UI[lang];
  const theme = FLAVORS[flavorId][mode];
  const currentBook = books.find((b) => b.id === bookId) || books[0];
  const currentBookFlavorId = (currentBook && bookFlavors[currentBook.id]) || flavorId;
  const bookTheme = FLAVORS[currentBookFlavorId] ? FLAVORS[currentBookFlavorId][mode] : theme;
  const skin = SKINS[skinId];
  const dir = ui.dir;
  const updateCurrentBook = (fn) => setBooks((prev) => prev.map((b) => (b.id === currentBook.id ? fn(b) : b)));
  const currentPlan = plans[bookId] || defaultPlan();
  const updateCurrentPlan = (fn) => setPlans((prev) => ({ ...prev, [bookId]: fn(prev[bookId] || defaultPlan()) }));

  useEffect(() => {
    saveAppState({ lang, mode, skinId, flavorId, bookFlavors, cardMode, scrollDir, voiceEnabled, covers, plans, collections });
  }, [lang, mode, skinId, flavorId, bookFlavors, cardMode, scrollDir, voiceEnabled, covers, plans, collections]);

  const resetAll = () => {
    saveAppState({});
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
const EDUCRAFT_EXPORT_BUNDLE_JS = "(()=>{var Vp=Object.create;var Li=Object.defineProperty;var Kp=Object.getOwnPropertyDescriptor;var $p=Object.getOwnPropertyNames;var jp=Object.getPrototypeOf,Xp=Object.prototype.hasOwnProperty;var It=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(a){throw t=0,a}};var Qp=(e,t,a,o)=>{if(t&&typeof t==\"object\"||typeof t==\"function\")for(let r of $p(t))!Xp.call(e,r)&&r!==a&&Li(e,r,{get:()=>t[r],enumerable:!(o=Kp(t,r))||o.enumerable});return e};var Ut=(e,t,a)=>(a=e!=null?Vp(jp(e)):{},Qp(t||!e||!e.__esModule?Li(a,\"default\",{value:e,enumerable:!0}):a,e));var Ti=It(z=>{\"use strict\";var No=Symbol.for(\"react.element\"),Zp=Symbol.for(\"react.portal\"),Yp=Symbol.for(\"react.fragment\"),Jp=Symbol.for(\"react.strict_mode\"),em=Symbol.for(\"react.profiler\"),tm=Symbol.for(\"react.provider\"),am=Symbol.for(\"react.context\"),om=Symbol.for(\"react.forward_ref\"),rm=Symbol.for(\"react.suspense\"),lm=Symbol.for(\"react.memo\"),nm=Symbol.for(\"react.lazy\"),ki=Symbol.iterator;function sm(e){return e===null||typeof e!=\"object\"?null:(e=ki&&e[ki]||e[\"@@iterator\"],typeof e==\"function\"?e:null)}var Ci={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ii=Object.assign,Fi={};function qa(e,t,a){this.props=e,this.context=t,this.refs=Fi,this.updater=a||Ci}qa.prototype.isReactComponent={};qa.prototype.setState=function(e,t){if(typeof e!=\"object\"&&typeof e!=\"function\"&&e!=null)throw Error(\"setState(...): takes an object of state variables to update or a function which returns an object of state variables.\");this.updater.enqueueSetState(this,e,t,\"setState\")};qa.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,\"forceUpdate\")};function wi(){}wi.prototype=qa.prototype;function Kn(e,t,a){this.props=e,this.context=t,this.refs=Fi,this.updater=a||Ci}var $n=Kn.prototype=new wi;$n.constructor=Kn;Ii($n,qa.prototype);$n.isPureReactComponent=!0;var vi=Array.isArray,bi=Object.prototype.hasOwnProperty,jn={current:null},Bi={key:!0,ref:!0,__self:!0,__source:!0};function Ei(e,t,a){var o,r={},l=null,s=null;if(t!=null)for(o in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(l=\"\"+t.key),t)bi.call(t,o)&&!Bi.hasOwnProperty(o)&&(r[o]=t[o]);var u=arguments.length-2;if(u===1)r.children=a;else if(1<u){for(var i=Array(u),d=0;d<u;d++)i[d]=arguments[d+2];r.children=i}if(e&&e.defaultProps)for(o in u=e.defaultProps,u)r[o]===void 0&&(r[o]=u[o]);return{$$typeof:No,type:e,key:l,ref:s,props:r,_owner:jn.current}}function um(e,t){return{$$typeof:No,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Xn(e){return typeof e==\"object\"&&e!==null&&e.$$typeof===No}function im(e){var t={\"=\":\"=0\",\":\":\"=2\"};return\"$\"+e.replace(/[=:]/g,function(a){return t[a]})}var Si=/\\/+/g;function Vn(e,t){return typeof e==\"object\"&&e!==null&&e.key!=null?im(\"\"+e.key):t.toString(36)}function il(e,t,a,o,r){var l=typeof e;(l===\"undefined\"||l===\"boolean\")&&(e=null);var s=!1;if(e===null)s=!0;else switch(l){case\"string\":case\"number\":s=!0;break;case\"object\":switch(e.$$typeof){case No:case Zp:s=!0}}if(s)return s=e,r=r(s),e=o===\"\"?\".\"+Vn(s,0):o,vi(r)?(a=\"\",e!=null&&(a=e.replace(Si,\"$&/\")+\"/\"),il(r,t,a,\"\",function(d){return d})):r!=null&&(Xn(r)&&(r=um(r,a+(!r.key||s&&s.key===r.key?\"\":(\"\"+r.key).replace(Si,\"$&/\")+\"/\")+e)),t.push(r)),1;if(s=0,o=o===\"\"?\".\":o+\":\",vi(e))for(var u=0;u<e.length;u++){l=e[u];var i=o+Vn(l,u);s+=il(l,t,a,i,r)}else if(i=sm(e),typeof i==\"function\")for(e=i.call(e),u=0;!(l=e.next()).done;)l=l.value,i=o+Vn(l,u++),s+=il(l,t,a,i,r);else if(l===\"object\")throw t=String(e),Error(\"Objects are not valid as a React child (found: \"+(t===\"[object Object]\"?\"object with keys {\"+Object.keys(e).join(\", \")+\"}\":t)+\"). If you meant to render a collection of children, use an array instead.\");return s}function ul(e,t,a){if(e==null)return e;var o=[],r=0;return il(e,o,\"\",\"\",function(l){return t.call(a,l,r++)}),o}function dm(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(a){(e._status===0||e._status===-1)&&(e._status=1,e._result=a)},function(a){(e._status===0||e._status===-1)&&(e._status=2,e._result=a)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var De={current:null},dl={transition:null},cm={ReactCurrentDispatcher:De,ReactCurrentBatchConfig:dl,ReactCurrentOwner:jn};function Di(){throw Error(\"act(...) is not supported in production builds of React.\")}z.Children={map:ul,forEach:function(e,t,a){ul(e,function(){t.apply(this,arguments)},a)},count:function(e){var t=0;return ul(e,function(){t++}),t},toArray:function(e){return ul(e,function(t){return t})||[]},only:function(e){if(!Xn(e))throw Error(\"React.Children.only expected to receive a single React element child.\");return e}};z.Component=qa;z.Fragment=Yp;z.Profiler=em;z.PureComponent=Kn;z.StrictMode=Jp;z.Suspense=rm;z.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=cm;z.act=Di;z.cloneElement=function(e,t,a){if(e==null)throw Error(\"React.cloneElement(...): The argument must be a React element, but you passed \"+e+\".\");var o=Ii({},e.props),r=e.key,l=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,s=jn.current),t.key!==void 0&&(r=\"\"+t.key),e.type&&e.type.defaultProps)var u=e.type.defaultProps;for(i in t)bi.call(t,i)&&!Bi.hasOwnProperty(i)&&(o[i]=t[i]===void 0&&u!==void 0?u[i]:t[i])}var i=arguments.length-2;if(i===1)o.children=a;else if(1<i){u=Array(i);for(var d=0;d<i;d++)u[d]=arguments[d+2];o.children=u}return{$$typeof:No,type:e.type,key:r,ref:l,props:o,_owner:s}};z.createContext=function(e){return e={$$typeof:am,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:tm,_context:e},e.Consumer=e};z.createElement=Ei;z.createFactory=function(e){var t=Ei.bind(null,e);return t.type=e,t};z.createRef=function(){return{current:null}};z.forwardRef=function(e){return{$$typeof:om,render:e}};z.isValidElement=Xn;z.lazy=function(e){return{$$typeof:nm,_payload:{_status:-1,_result:e},_init:dm}};z.memo=function(e,t){return{$$typeof:lm,type:e,compare:t===void 0?null:t}};z.startTransition=function(e){var t=dl.transition;dl.transition={};try{e()}finally{dl.transition=t}};z.unstable_act=Di;z.useCallback=function(e,t){return De.current.useCallback(e,t)};z.useContext=function(e){return De.current.useContext(e)};z.useDebugValue=function(){};z.useDeferredValue=function(e){return De.current.useDeferredValue(e)};z.useEffect=function(e,t){return De.current.useEffect(e,t)};z.useId=function(){return De.current.useId()};z.useImperativeHandle=function(e,t,a){return De.current.useImperativeHandle(e,t,a)};z.useInsertionEffect=function(e,t){return De.current.useInsertionEffect(e,t)};z.useLayoutEffect=function(e,t){return De.current.useLayoutEffect(e,t)};z.useMemo=function(e,t){return De.current.useMemo(e,t)};z.useReducer=function(e,t,a){return De.current.useReducer(e,t,a)};z.useRef=function(e){return De.current.useRef(e)};z.useState=function(e){return De.current.useState(e)};z.useSyncExternalStore=function(e,t,a){return De.current.useSyncExternalStore(e,t,a)};z.useTransition=function(){return De.current.useTransition()};z.version=\"18.3.1\"});var _a=It((l1,Ai)=>{\"use strict\";Ai.exports=Ti()});var Wi=It(te=>{\"use strict\";function Jn(e,t){var a=e.length;e.push(t);e:for(;0<a;){var o=a-1>>>1,r=e[o];if(0<cl(r,t))e[o]=t,e[a]=r,a=o;else break e}}function tt(e){return e.length===0?null:e[0]}function pl(e){if(e.length===0)return null;var t=e[0],a=e.pop();if(a!==t){e[0]=a;e:for(var o=0,r=e.length,l=r>>>1;o<l;){var s=2*(o+1)-1,u=e[s],i=s+1,d=e[i];if(0>cl(u,a))i<r&&0>cl(d,u)?(e[o]=d,e[i]=a,o=i):(e[o]=u,e[s]=a,o=s);else if(i<r&&0>cl(d,a))e[o]=d,e[i]=a,o=i;else break e}}return t}function cl(e,t){var a=e.sortIndex-t.sortIndex;return a!==0?a:e.id-t.id}typeof performance==\"object\"&&typeof performance.now==\"function\"?(Pi=performance,te.unstable_now=function(){return Pi.now()}):(Qn=Date,Ni=Qn.now(),te.unstable_now=function(){return Qn.now()-Ni});var Pi,Qn,Ni,gt=[],Wt=[],fm=1,$e=null,Ie=3,ml=!1,ka=!1,Ro=!1,Hi=typeof setTimeout==\"function\"?setTimeout:null,Gi=typeof clearTimeout==\"function\"?clearTimeout:null,Mi=typeof setImmediate!=\"undefined\"?setImmediate:null;typeof navigator!=\"undefined\"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function es(e){for(var t=tt(Wt);t!==null;){if(t.callback===null)pl(Wt);else if(t.startTime<=e)pl(Wt),t.sortIndex=t.expirationTime,Jn(gt,t);else break;t=tt(Wt)}}function ts(e){if(Ro=!1,es(e),!ka)if(tt(gt)!==null)ka=!0,os(as);else{var t=tt(Wt);t!==null&&rs(ts,t.startTime-e)}}function as(e,t){ka=!1,Ro&&(Ro=!1,Gi(Ho),Ho=-1),ml=!0;var a=Ie;try{for(es(t),$e=tt(gt);$e!==null&&(!($e.expirationTime>t)||e&&!Ui());){var o=$e.callback;if(typeof o==\"function\"){$e.callback=null,Ie=$e.priorityLevel;var r=o($e.expirationTime<=t);t=te.unstable_now(),typeof r==\"function\"?$e.callback=r:$e===tt(gt)&&pl(gt),es(t)}else pl(gt);$e=tt(gt)}if($e!==null)var l=!0;else{var s=tt(Wt);s!==null&&rs(ts,s.startTime-t),l=!1}return l}finally{$e=null,Ie=a,ml=!1}}var gl=!1,fl=null,Ho=-1,Oi=5,zi=-1;function Ui(){return!(te.unstable_now()-zi<Oi)}function Zn(){if(fl!==null){var e=te.unstable_now();zi=e;var t=!0;try{t=fl(!0,e)}finally{t?Mo():(gl=!1,fl=null)}}else gl=!1}var Mo;typeof Mi==\"function\"?Mo=function(){Mi(Zn)}:typeof MessageChannel!=\"undefined\"?(Yn=new MessageChannel,Ri=Yn.port2,Yn.port1.onmessage=Zn,Mo=function(){Ri.postMessage(null)}):Mo=function(){Hi(Zn,0)};var Yn,Ri;function os(e){fl=e,gl||(gl=!0,Mo())}function rs(e,t){Ho=Hi(function(){e(te.unstable_now())},t)}te.unstable_IdlePriority=5;te.unstable_ImmediatePriority=1;te.unstable_LowPriority=4;te.unstable_NormalPriority=3;te.unstable_Profiling=null;te.unstable_UserBlockingPriority=2;te.unstable_cancelCallback=function(e){e.callback=null};te.unstable_continueExecution=function(){ka||ml||(ka=!0,os(as))};te.unstable_forceFrameRate=function(e){0>e||125<e?console.error(\"forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported\"):Oi=0<e?Math.floor(1e3/e):5};te.unstable_getCurrentPriorityLevel=function(){return Ie};te.unstable_getFirstCallbackNode=function(){return tt(gt)};te.unstable_next=function(e){switch(Ie){case 1:case 2:case 3:var t=3;break;default:t=Ie}var a=Ie;Ie=t;try{return e()}finally{Ie=a}};te.unstable_pauseExecution=function(){};te.unstable_requestPaint=function(){};te.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var a=Ie;Ie=e;try{return t()}finally{Ie=a}};te.unstable_scheduleCallback=function(e,t,a){var o=te.unstable_now();switch(typeof a==\"object\"&&a!==null?(a=a.delay,a=typeof a==\"number\"&&0<a?o+a:o):a=o,e){case 1:var r=-1;break;case 2:r=250;break;case 5:r=1073741823;break;case 4:r=1e4;break;default:r=5e3}return r=a+r,e={id:fm++,callback:t,priorityLevel:e,startTime:a,expirationTime:r,sortIndex:-1},a>o?(e.sortIndex=a,Jn(Wt,e),tt(gt)===null&&e===tt(Wt)&&(Ro?(Gi(Ho),Ho=-1):Ro=!0,rs(ts,a-o))):(e.sortIndex=r,Jn(gt,e),ka||ml||(ka=!0,os(as))),e};te.unstable_shouldYield=Ui;te.unstable_wrapCallback=function(e){var t=Ie;return function(){var a=Ie;Ie=t;try{return e.apply(this,arguments)}finally{Ie=a}}}});var _i=It((s1,qi)=>{\"use strict\";qi.exports=Wi()});var Xf=It(Ve=>{\"use strict\";var pm=_a(),qe=_i();function w(e){for(var t=\"https://reactjs.org/docs/error-decoder.html?invariant=\"+e,a=1;a<arguments.length;a++)t+=\"&args[]=\"+encodeURIComponent(arguments[a]);return\"Minified React error #\"+e+\"; visit \"+t+\" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.\"}var Zd=new Set,lr={};function Pa(e,t){fo(e,t),fo(e+\"Capture\",t)}function fo(e,t){for(lr[e]=t,e=0;e<t.length;e++)Zd.add(t[e])}var Dt=!(typeof window==\"undefined\"||typeof window.document==\"undefined\"||typeof window.document.createElement==\"undefined\"),bs=Object.prototype.hasOwnProperty,mm=/^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$/,Vi={},Ki={};function gm(e){return bs.call(Ki,e)?!0:bs.call(Vi,e)?!1:mm.test(e)?Ki[e]=!0:(Vi[e]=!0,!1)}function xm(e,t,a,o){if(a!==null&&a.type===0)return!1;switch(typeof t){case\"function\":case\"symbol\":return!0;case\"boolean\":return o?!1:a!==null?!a.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!==\"data-\"&&e!==\"aria-\");default:return!1}}function hm(e,t,a,o){if(t===null||typeof t==\"undefined\"||xm(e,t,a,o))return!0;if(o)return!1;if(a!==null)switch(a.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Pe(e,t,a,o,r,l,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=r,this.mustUseProperty=a,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=s}var Se={};\"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style\".split(\" \").forEach(function(e){Se[e]=new Pe(e,0,!1,e,null,!1,!1)});[[\"acceptCharset\",\"accept-charset\"],[\"className\",\"class\"],[\"htmlFor\",\"for\"],[\"httpEquiv\",\"http-equiv\"]].forEach(function(e){var t=e[0];Se[t]=new Pe(t,1,!1,e[1],null,!1,!1)});[\"contentEditable\",\"draggable\",\"spellCheck\",\"value\"].forEach(function(e){Se[e]=new Pe(e,2,!1,e.toLowerCase(),null,!1,!1)});[\"autoReverse\",\"externalResourcesRequired\",\"focusable\",\"preserveAlpha\"].forEach(function(e){Se[e]=new Pe(e,2,!1,e,null,!1,!1)});\"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope\".split(\" \").forEach(function(e){Se[e]=new Pe(e,3,!1,e.toLowerCase(),null,!1,!1)});[\"checked\",\"multiple\",\"muted\",\"selected\"].forEach(function(e){Se[e]=new Pe(e,3,!0,e,null,!1,!1)});[\"capture\",\"download\"].forEach(function(e){Se[e]=new Pe(e,4,!1,e,null,!1,!1)});[\"cols\",\"rows\",\"size\",\"span\"].forEach(function(e){Se[e]=new Pe(e,6,!1,e,null,!1,!1)});[\"rowSpan\",\"start\"].forEach(function(e){Se[e]=new Pe(e,5,!1,e.toLowerCase(),null,!1,!1)});var Lu=/[\\-:]([a-z])/g;function ku(e){return e[1].toUpperCase()}\"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height\".split(\" \").forEach(function(e){var t=e.replace(Lu,ku);Se[t]=new Pe(t,1,!1,e,null,!1,!1)});\"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type\".split(\" \").forEach(function(e){var t=e.replace(Lu,ku);Se[t]=new Pe(t,1,!1,e,\"http://www.w3.org/1999/xlink\",!1,!1)});[\"xml:base\",\"xml:lang\",\"xml:space\"].forEach(function(e){var t=e.replace(Lu,ku);Se[t]=new Pe(t,1,!1,e,\"http://www.w3.org/XML/1998/namespace\",!1,!1)});[\"tabIndex\",\"crossOrigin\"].forEach(function(e){Se[e]=new Pe(e,1,!1,e.toLowerCase(),null,!1,!1)});Se.xlinkHref=new Pe(\"xlinkHref\",1,!1,\"xlink:href\",\"http://www.w3.org/1999/xlink\",!0,!1);[\"src\",\"href\",\"action\",\"formAction\"].forEach(function(e){Se[e]=new Pe(e,1,!1,e.toLowerCase(),null,!0,!0)});function vu(e,t,a,o){var r=Se.hasOwnProperty(t)?Se[t]:null;(r!==null?r.type!==0:o||!(2<t.length)||t[0]!==\"o\"&&t[0]!==\"O\"||t[1]!==\"n\"&&t[1]!==\"N\")&&(hm(t,a,r,o)&&(a=null),o||r===null?gm(t)&&(a===null?e.removeAttribute(t):e.setAttribute(t,\"\"+a)):r.mustUseProperty?e[r.propertyName]=a===null?r.type===3?!1:\"\":a:(t=r.attributeName,o=r.attributeNamespace,a===null?e.removeAttribute(t):(r=r.type,a=r===3||r===4&&a===!0?\"\":\"\"+a,o?e.setAttributeNS(o,t,a):e.setAttribute(t,a))))}var Nt=pm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,xl=Symbol.for(\"react.element\"),$a=Symbol.for(\"react.portal\"),ja=Symbol.for(\"react.fragment\"),Su=Symbol.for(\"react.strict_mode\"),Bs=Symbol.for(\"react.profiler\"),Yd=Symbol.for(\"react.provider\"),Jd=Symbol.for(\"react.context\"),Cu=Symbol.for(\"react.forward_ref\"),Es=Symbol.for(\"react.suspense\"),Ds=Symbol.for(\"react.suspense_list\"),Iu=Symbol.for(\"react.memo\"),_t=Symbol.for(\"react.lazy\"),ec=Symbol.for(\"react.offscreen\"),$i=Symbol.iterator;function Go(e){return e===null||typeof e!=\"object\"?null:(e=$i&&e[$i]||e[\"@@iterator\"],typeof e==\"function\"?e:null)}var ie=Object.assign,ls;function Ko(e){if(ls===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\\n( *(at )?)/);ls=t&&t[1]||\"\"}return`\n`+ls+e}var ns=!1;function ss(e,t){if(!e||ns)return\"\";ns=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,\"props\",{set:function(){throw Error()}}),typeof Reflect==\"object\"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var o=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){o=d}e.call(t.prototype)}else{try{throw Error()}catch(d){o=d}e()}}catch(d){if(d&&o&&typeof d.stack==\"string\"){for(var r=d.stack.split(`\n`),l=o.stack.split(`\n`),s=r.length-1,u=l.length-1;1<=s&&0<=u&&r[s]!==l[u];)u--;for(;1<=s&&0<=u;s--,u--)if(r[s]!==l[u]){if(s!==1||u!==1)do if(s--,u--,0>u||r[s]!==l[u]){var i=`\n`+r[s].replace(\" at new \",\" at \");return e.displayName&&i.includes(\"<anonymous>\")&&(i=i.replace(\"<anonymous>\",e.displayName)),i}while(1<=s&&0<=u);break}}}finally{ns=!1,Error.prepareStackTrace=a}return(e=e?e.displayName||e.name:\"\")?Ko(e):\"\"}function ym(e){switch(e.tag){case 5:return Ko(e.type);case 16:return Ko(\"Lazy\");case 13:return Ko(\"Suspense\");case 19:return Ko(\"SuspenseList\");case 0:case 2:case 15:return e=ss(e.type,!1),e;case 11:return e=ss(e.type.render,!1),e;case 1:return e=ss(e.type,!0),e;default:return\"\"}}function Ts(e){if(e==null)return null;if(typeof e==\"function\")return e.displayName||e.name||null;if(typeof e==\"string\")return e;switch(e){case ja:return\"Fragment\";case $a:return\"Portal\";case Bs:return\"Profiler\";case Su:return\"StrictMode\";case Es:return\"Suspense\";case Ds:return\"SuspenseList\"}if(typeof e==\"object\")switch(e.$$typeof){case Jd:return(e.displayName||\"Context\")+\".Consumer\";case Yd:return(e._context.displayName||\"Context\")+\".Provider\";case Cu:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||\"\",e=e!==\"\"?\"ForwardRef(\"+e+\")\":\"ForwardRef\"),e;case Iu:return t=e.displayName||null,t!==null?t:Ts(e.type)||\"Memo\";case _t:t=e._payload,e=e._init;try{return Ts(e(t))}catch(a){}}return null}function Lm(e){var t=e.type;switch(e.tag){case 24:return\"Cache\";case 9:return(t.displayName||\"Context\")+\".Consumer\";case 10:return(t._context.displayName||\"Context\")+\".Provider\";case 18:return\"DehydratedFragment\";case 11:return e=t.render,e=e.displayName||e.name||\"\",t.displayName||(e!==\"\"?\"ForwardRef(\"+e+\")\":\"ForwardRef\");case 7:return\"Fragment\";case 5:return t;case 4:return\"Portal\";case 3:return\"Root\";case 6:return\"Text\";case 16:return Ts(t);case 8:return t===Su?\"StrictMode\":\"Mode\";case 22:return\"Offscreen\";case 12:return\"Profiler\";case 21:return\"Scope\";case 13:return\"Suspense\";case 19:return\"SuspenseList\";case 25:return\"TracingMarker\";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t==\"function\")return t.displayName||t.name||null;if(typeof t==\"string\")return t}return null}function ra(e){switch(typeof e){case\"boolean\":case\"number\":case\"string\":case\"undefined\":return e;case\"object\":return e;default:return\"\"}}function tc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===\"input\"&&(t===\"checkbox\"||t===\"radio\")}function km(e){var t=tc(e)?\"checked\":\"value\",a=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=\"\"+e[t];if(!e.hasOwnProperty(t)&&typeof a!=\"undefined\"&&typeof a.get==\"function\"&&typeof a.set==\"function\"){var r=a.get,l=a.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return r.call(this)},set:function(s){o=\"\"+s,l.call(this,s)}}),Object.defineProperty(e,t,{enumerable:a.enumerable}),{getValue:function(){return o},setValue:function(s){o=\"\"+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function hl(e){e._valueTracker||(e._valueTracker=km(e))}function ac(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),o=\"\";return e&&(o=tc(e)?e.checked?\"true\":\"false\":e.value),e=o,e!==a?(t.setValue(e),!0):!1}function Vl(e){if(e=e||(typeof document!=\"undefined\"?document:void 0),typeof e==\"undefined\")return null;try{return e.activeElement||e.body}catch(t){return e.body}}function As(e,t){var a=t.checked;return ie({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a!=null?a:e._wrapperState.initialChecked})}function ji(e,t){var a=t.defaultValue==null?\"\":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;a=ra(t.value!=null?t.value:a),e._wrapperState={initialChecked:o,initialValue:a,controlled:t.type===\"checkbox\"||t.type===\"radio\"?t.checked!=null:t.value!=null}}function oc(e,t){t=t.checked,t!=null&&vu(e,\"checked\",t,!1)}function Ps(e,t){oc(e,t);var a=ra(t.value),o=t.type;if(a!=null)o===\"number\"?(a===0&&e.value===\"\"||e.value!=a)&&(e.value=\"\"+a):e.value!==\"\"+a&&(e.value=\"\"+a);else if(o===\"submit\"||o===\"reset\"){e.removeAttribute(\"value\");return}t.hasOwnProperty(\"value\")?Ns(e,t.type,a):t.hasOwnProperty(\"defaultValue\")&&Ns(e,t.type,ra(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Xi(e,t,a){if(t.hasOwnProperty(\"value\")||t.hasOwnProperty(\"defaultValue\")){var o=t.type;if(!(o!==\"submit\"&&o!==\"reset\"||t.value!==void 0&&t.value!==null))return;t=\"\"+e._wrapperState.initialValue,a||t===e.value||(e.value=t),e.defaultValue=t}a=e.name,a!==\"\"&&(e.name=\"\"),e.defaultChecked=!!e._wrapperState.initialChecked,a!==\"\"&&(e.name=a)}function Ns(e,t,a){(t!==\"number\"||Vl(e.ownerDocument)!==e)&&(a==null?e.defaultValue=\"\"+e._wrapperState.initialValue:e.defaultValue!==\"\"+a&&(e.defaultValue=\"\"+a))}var $o=Array.isArray;function lo(e,t,a,o){if(e=e.options,t){t={};for(var r=0;r<a.length;r++)t[\"$\"+a[r]]=!0;for(a=0;a<e.length;a++)r=t.hasOwnProperty(\"$\"+e[a].value),e[a].selected!==r&&(e[a].selected=r),r&&o&&(e[a].defaultSelected=!0)}else{for(a=\"\"+ra(a),t=null,r=0;r<e.length;r++){if(e[r].value===a){e[r].selected=!0,o&&(e[r].defaultSelected=!0);return}t!==null||e[r].disabled||(t=e[r])}t!==null&&(t.selected=!0)}}function Ms(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(w(91));return ie({},t,{value:void 0,defaultValue:void 0,children:\"\"+e._wrapperState.initialValue})}function Qi(e,t){var a=t.value;if(a==null){if(a=t.children,t=t.defaultValue,a!=null){if(t!=null)throw Error(w(92));if($o(a)){if(1<a.length)throw Error(w(93));a=a[0]}t=a}t==null&&(t=\"\"),a=t}e._wrapperState={initialValue:ra(a)}}function rc(e,t){var a=ra(t.value),o=ra(t.defaultValue);a!=null&&(a=\"\"+a,a!==e.value&&(e.value=a),t.defaultValue==null&&e.defaultValue!==a&&(e.defaultValue=a)),o!=null&&(e.defaultValue=\"\"+o)}function Zi(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==\"\"&&t!==null&&(e.value=t)}function lc(e){switch(e){case\"svg\":return\"http://www.w3.org/2000/svg\";case\"math\":return\"http://www.w3.org/1998/Math/MathML\";default:return\"http://www.w3.org/1999/xhtml\"}}function Rs(e,t){return e==null||e===\"http://www.w3.org/1999/xhtml\"?lc(t):e===\"http://www.w3.org/2000/svg\"&&t===\"foreignObject\"?\"http://www.w3.org/1999/xhtml\":e}var yl,nc=(function(e){return typeof MSApp!=\"undefined\"&&MSApp.execUnsafeLocalFunction?function(t,a,o,r){MSApp.execUnsafeLocalFunction(function(){return e(t,a,o,r)})}:e})(function(e,t){if(e.namespaceURI!==\"http://www.w3.org/2000/svg\"||\"innerHTML\"in e)e.innerHTML=t;else{for(yl=yl||document.createElement(\"div\"),yl.innerHTML=\"<svg>\"+t.valueOf().toString()+\"</svg>\",t=yl.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function nr(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var Qo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},vm=[\"Webkit\",\"ms\",\"Moz\",\"O\"];Object.keys(Qo).forEach(function(e){vm.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Qo[t]=Qo[e]})});function sc(e,t,a){return t==null||typeof t==\"boolean\"||t===\"\"?\"\":a||typeof t!=\"number\"||t===0||Qo.hasOwnProperty(e)&&Qo[e]?(\"\"+t).trim():t+\"px\"}function uc(e,t){e=e.style;for(var a in t)if(t.hasOwnProperty(a)){var o=a.indexOf(\"--\")===0,r=sc(a,t[a],o);a===\"float\"&&(a=\"cssFloat\"),o?e.setProperty(a,r):e[a]=r}}var Sm=ie({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Hs(e,t){if(t){if(Sm[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(w(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(w(60));if(typeof t.dangerouslySetInnerHTML!=\"object\"||!(\"__html\"in t.dangerouslySetInnerHTML))throw Error(w(61))}if(t.style!=null&&typeof t.style!=\"object\")throw Error(w(62))}}function Gs(e,t){if(e.indexOf(\"-\")===-1)return typeof t.is==\"string\";switch(e){case\"annotation-xml\":case\"color-profile\":case\"font-face\":case\"font-face-src\":case\"font-face-uri\":case\"font-face-format\":case\"font-face-name\":case\"missing-glyph\":return!1;default:return!0}}var Os=null;function Fu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var zs=null,no=null,so=null;function Yi(e){if(e=Ir(e)){if(typeof zs!=\"function\")throw Error(w(280));var t=e.stateNode;t&&(t=kn(t),zs(e.stateNode,e.type,t))}}function ic(e){no?so?so.push(e):so=[e]:no=e}function dc(){if(no){var e=no,t=so;if(so=no=null,Yi(e),t)for(e=0;e<t.length;e++)Yi(t[e])}}function cc(e,t){return e(t)}function fc(){}var us=!1;function pc(e,t,a){if(us)return e(t,a);us=!0;try{return cc(e,t,a)}finally{us=!1,(no!==null||so!==null)&&(fc(),dc())}}function sr(e,t){var a=e.stateNode;if(a===null)return null;var o=kn(a);if(o===null)return null;a=o[t];e:switch(t){case\"onClick\":case\"onClickCapture\":case\"onDoubleClick\":case\"onDoubleClickCapture\":case\"onMouseDown\":case\"onMouseDownCapture\":case\"onMouseMove\":case\"onMouseMoveCapture\":case\"onMouseUp\":case\"onMouseUpCapture\":case\"onMouseEnter\":(o=!o.disabled)||(e=e.type,o=!(e===\"button\"||e===\"input\"||e===\"select\"||e===\"textarea\")),e=!o;break e;default:e=!1}if(e)return null;if(a&&typeof a!=\"function\")throw Error(w(231,t,typeof a));return a}var Us=!1;if(Dt)try{Va={},Object.defineProperty(Va,\"passive\",{get:function(){Us=!0}}),window.addEventListener(\"test\",Va,Va),window.removeEventListener(\"test\",Va,Va)}catch(e){Us=!1}var Va;function Cm(e,t,a,o,r,l,s,u,i){var d=Array.prototype.slice.call(arguments,3);try{t.apply(a,d)}catch(p){this.onError(p)}}var Zo=!1,Kl=null,$l=!1,Ws=null,Im={onError:function(e){Zo=!0,Kl=e}};function Fm(e,t,a,o,r,l,s,u,i){Zo=!1,Kl=null,Cm.apply(Im,arguments)}function wm(e,t,a,o,r,l,s,u,i){if(Fm.apply(this,arguments),Zo){if(Zo){var d=Kl;Zo=!1,Kl=null}else throw Error(w(198));$l||($l=!0,Ws=d)}}function Na(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function mc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ji(e){if(Na(e)!==e)throw Error(w(188))}function bm(e){var t=e.alternate;if(!t){if(t=Na(e),t===null)throw Error(w(188));return t!==e?null:e}for(var a=e,o=t;;){var r=a.return;if(r===null)break;var l=r.alternate;if(l===null){if(o=r.return,o!==null){a=o;continue}break}if(r.child===l.child){for(l=r.child;l;){if(l===a)return Ji(r),e;if(l===o)return Ji(r),t;l=l.sibling}throw Error(w(188))}if(a.return!==o.return)a=r,o=l;else{for(var s=!1,u=r.child;u;){if(u===a){s=!0,a=r,o=l;break}if(u===o){s=!0,o=r,a=l;break}u=u.sibling}if(!s){for(u=l.child;u;){if(u===a){s=!0,a=l,o=r;break}if(u===o){s=!0,o=l,a=r;break}u=u.sibling}if(!s)throw Error(w(189))}}if(a.alternate!==o)throw Error(w(190))}if(a.tag!==3)throw Error(w(188));return a.stateNode.current===a?e:t}function gc(e){return e=bm(e),e!==null?xc(e):null}function xc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=xc(e);if(t!==null)return t;e=e.sibling}return null}var hc=qe.unstable_scheduleCallback,ed=qe.unstable_cancelCallback,Bm=qe.unstable_shouldYield,Em=qe.unstable_requestPaint,pe=qe.unstable_now,Dm=qe.unstable_getCurrentPriorityLevel,wu=qe.unstable_ImmediatePriority,yc=qe.unstable_UserBlockingPriority,jl=qe.unstable_NormalPriority,Tm=qe.unstable_LowPriority,Lc=qe.unstable_IdlePriority,xn=null,Lt=null;function Am(e){if(Lt&&typeof Lt.onCommitFiberRoot==\"function\")try{Lt.onCommitFiberRoot(xn,e,void 0,(e.current.flags&128)===128)}catch(t){}}var nt=Math.clz32?Math.clz32:Mm,Pm=Math.log,Nm=Math.LN2;function Mm(e){return e>>>=0,e===0?32:31-(Pm(e)/Nm|0)|0}var Ll=64,kl=4194304;function jo(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Xl(e,t){var a=e.pendingLanes;if(a===0)return 0;var o=0,r=e.suspendedLanes,l=e.pingedLanes,s=a&268435455;if(s!==0){var u=s&~r;u!==0?o=jo(u):(l&=s,l!==0&&(o=jo(l)))}else s=a&~r,s!==0?o=jo(s):l!==0&&(o=jo(l));if(o===0)return 0;if(t!==0&&t!==o&&(t&r)===0&&(r=o&-o,l=t&-t,r>=l||r===16&&(l&4194240)!==0))return t;if((o&4)!==0&&(o|=a&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)a=31-nt(t),r=1<<a,o|=e[a],t&=~r;return o}function Rm(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Hm(e,t){for(var a=e.suspendedLanes,o=e.pingedLanes,r=e.expirationTimes,l=e.pendingLanes;0<l;){var s=31-nt(l),u=1<<s,i=r[s];i===-1?((u&a)===0||(u&o)!==0)&&(r[s]=Rm(u,t)):i<=t&&(e.expiredLanes|=u),l&=~u}}function qs(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function kc(){var e=Ll;return Ll<<=1,(Ll&4194240)===0&&(Ll=64),e}function is(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function Sr(e,t,a){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-nt(t),e[t]=a}function Gm(e,t){var a=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<a;){var r=31-nt(a),l=1<<r;t[r]=0,o[r]=-1,e[r]=-1,a&=~l}}function bu(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var o=31-nt(a),r=1<<o;r&t|e[o]&t&&(e[o]|=t),a&=~r}}var X=0;function vc(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Sc,Bu,Cc,Ic,Fc,_s=!1,vl=[],Qt=null,Zt=null,Yt=null,ur=new Map,ir=new Map,Kt=[],Om=\"mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit\".split(\" \");function td(e,t){switch(e){case\"focusin\":case\"focusout\":Qt=null;break;case\"dragenter\":case\"dragleave\":Zt=null;break;case\"mouseover\":case\"mouseout\":Yt=null;break;case\"pointerover\":case\"pointerout\":ur.delete(t.pointerId);break;case\"gotpointercapture\":case\"lostpointercapture\":ir.delete(t.pointerId)}}function Oo(e,t,a,o,r,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:a,eventSystemFlags:o,nativeEvent:l,targetContainers:[r]},t!==null&&(t=Ir(t),t!==null&&Bu(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,r!==null&&t.indexOf(r)===-1&&t.push(r),e)}function zm(e,t,a,o,r){switch(t){case\"focusin\":return Qt=Oo(Qt,e,t,a,o,r),!0;case\"dragenter\":return Zt=Oo(Zt,e,t,a,o,r),!0;case\"mouseover\":return Yt=Oo(Yt,e,t,a,o,r),!0;case\"pointerover\":var l=r.pointerId;return ur.set(l,Oo(ur.get(l)||null,e,t,a,o,r)),!0;case\"gotpointercapture\":return l=r.pointerId,ir.set(l,Oo(ir.get(l)||null,e,t,a,o,r)),!0}return!1}function wc(e){var t=Ca(e.target);if(t!==null){var a=Na(t);if(a!==null){if(t=a.tag,t===13){if(t=mc(a),t!==null){e.blockedOn=t,Fc(e.priority,function(){Cc(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ml(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=Vs(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(a===null){a=e.nativeEvent;var o=new a.constructor(a.type,a);Os=o,a.target.dispatchEvent(o),Os=null}else return t=Ir(a),t!==null&&Bu(t),e.blockedOn=a,!1;t.shift()}return!0}function ad(e,t,a){Ml(e)&&a.delete(t)}function Um(){_s=!1,Qt!==null&&Ml(Qt)&&(Qt=null),Zt!==null&&Ml(Zt)&&(Zt=null),Yt!==null&&Ml(Yt)&&(Yt=null),ur.forEach(ad),ir.forEach(ad)}function zo(e,t){e.blockedOn===t&&(e.blockedOn=null,_s||(_s=!0,qe.unstable_scheduleCallback(qe.unstable_NormalPriority,Um)))}function dr(e){function t(r){return zo(r,e)}if(0<vl.length){zo(vl[0],e);for(var a=1;a<vl.length;a++){var o=vl[a];o.blockedOn===e&&(o.blockedOn=null)}}for(Qt!==null&&zo(Qt,e),Zt!==null&&zo(Zt,e),Yt!==null&&zo(Yt,e),ur.forEach(t),ir.forEach(t),a=0;a<Kt.length;a++)o=Kt[a],o.blockedOn===e&&(o.blockedOn=null);for(;0<Kt.length&&(a=Kt[0],a.blockedOn===null);)wc(a),a.blockedOn===null&&Kt.shift()}var uo=Nt.ReactCurrentBatchConfig,Ql=!0;function Wm(e,t,a,o){var r=X,l=uo.transition;uo.transition=null;try{X=1,Eu(e,t,a,o)}finally{X=r,uo.transition=l}}function qm(e,t,a,o){var r=X,l=uo.transition;uo.transition=null;try{X=4,Eu(e,t,a,o)}finally{X=r,uo.transition=l}}function Eu(e,t,a,o){if(Ql){var r=Vs(e,t,a,o);if(r===null)xs(e,t,o,Zl,a),td(e,o);else if(zm(r,e,t,a,o))o.stopPropagation();else if(td(e,o),t&4&&-1<Om.indexOf(e)){for(;r!==null;){var l=Ir(r);if(l!==null&&Sc(l),l=Vs(e,t,a,o),l===null&&xs(e,t,o,Zl,a),l===r)break;r=l}r!==null&&o.stopPropagation()}else xs(e,t,o,null,a)}}var Zl=null;function Vs(e,t,a,o){if(Zl=null,e=Fu(o),e=Ca(e),e!==null)if(t=Na(e),t===null)e=null;else if(a=t.tag,a===13){if(e=mc(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Zl=e,null}function bc(e){switch(e){case\"cancel\":case\"click\":case\"close\":case\"contextmenu\":case\"copy\":case\"cut\":case\"auxclick\":case\"dblclick\":case\"dragend\":case\"dragstart\":case\"drop\":case\"focusin\":case\"focusout\":case\"input\":case\"invalid\":case\"keydown\":case\"keypress\":case\"keyup\":case\"mousedown\":case\"mouseup\":case\"paste\":case\"pause\":case\"play\":case\"pointercancel\":case\"pointerdown\":case\"pointerup\":case\"ratechange\":case\"reset\":case\"resize\":case\"seeked\":case\"submit\":case\"touchcancel\":case\"touchend\":case\"touchstart\":case\"volumechange\":case\"change\":case\"selectionchange\":case\"textInput\":case\"compositionstart\":case\"compositionend\":case\"compositionupdate\":case\"beforeblur\":case\"afterblur\":case\"beforeinput\":case\"blur\":case\"fullscreenchange\":case\"focus\":case\"hashchange\":case\"popstate\":case\"select\":case\"selectstart\":return 1;case\"drag\":case\"dragenter\":case\"dragexit\":case\"dragleave\":case\"dragover\":case\"mousemove\":case\"mouseout\":case\"mouseover\":case\"pointermove\":case\"pointerout\":case\"pointerover\":case\"scroll\":case\"toggle\":case\"touchmove\":case\"wheel\":case\"mouseenter\":case\"mouseleave\":case\"pointerenter\":case\"pointerleave\":return 4;case\"message\":switch(Dm()){case wu:return 1;case yc:return 4;case jl:case Tm:return 16;case Lc:return 536870912;default:return 16}default:return 16}}var jt=null,Du=null,Rl=null;function Bc(){if(Rl)return Rl;var e,t=Du,a=t.length,o,r=\"value\"in jt?jt.value:jt.textContent,l=r.length;for(e=0;e<a&&t[e]===r[e];e++);var s=a-e;for(o=1;o<=s&&t[a-o]===r[l-o];o++);return Rl=r.slice(e,1<o?1-o:void 0)}function Hl(e){var t=e.keyCode;return\"charCode\"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Sl(){return!0}function od(){return!1}function _e(e){function t(a,o,r,l,s){this._reactName=a,this._targetInst=r,this.type=o,this.nativeEvent=l,this.target=s,this.currentTarget=null;for(var u in e)e.hasOwnProperty(u)&&(a=e[u],this[u]=a?a(l):l[u]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Sl:od,this.isPropagationStopped=od,this}return ie(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!=\"unknown\"&&(a.returnValue=!1),this.isDefaultPrevented=Sl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!=\"unknown\"&&(a.cancelBubble=!0),this.isPropagationStopped=Sl)},persist:function(){},isPersistent:Sl}),t}var Lo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Tu=_e(Lo),Cr=ie({},Lo,{view:0,detail:0}),_m=_e(Cr),ds,cs,Uo,hn=ie({},Cr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Au,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return\"movementX\"in e?e.movementX:(e!==Uo&&(Uo&&e.type===\"mousemove\"?(ds=e.screenX-Uo.screenX,cs=e.screenY-Uo.screenY):cs=ds=0,Uo=e),ds)},movementY:function(e){return\"movementY\"in e?e.movementY:cs}}),rd=_e(hn),Vm=ie({},hn,{dataTransfer:0}),Km=_e(Vm),$m=ie({},Cr,{relatedTarget:0}),fs=_e($m),jm=ie({},Lo,{animationName:0,elapsedTime:0,pseudoElement:0}),Xm=_e(jm),Qm=ie({},Lo,{clipboardData:function(e){return\"clipboardData\"in e?e.clipboardData:window.clipboardData}}),Zm=_e(Qm),Ym=ie({},Lo,{data:0}),ld=_e(Ym),Jm={Esc:\"Escape\",Spacebar:\" \",Left:\"ArrowLeft\",Up:\"ArrowUp\",Right:\"ArrowRight\",Down:\"ArrowDown\",Del:\"Delete\",Win:\"OS\",Menu:\"ContextMenu\",Apps:\"ContextMenu\",Scroll:\"ScrollLock\",MozPrintableKey:\"Unidentified\"},eg={8:\"Backspace\",9:\"Tab\",12:\"Clear\",13:\"Enter\",16:\"Shift\",17:\"Control\",18:\"Alt\",19:\"Pause\",20:\"CapsLock\",27:\"Escape\",32:\" \",33:\"PageUp\",34:\"PageDown\",35:\"End\",36:\"Home\",37:\"ArrowLeft\",38:\"ArrowUp\",39:\"ArrowRight\",40:\"ArrowDown\",45:\"Insert\",46:\"Delete\",112:\"F1\",113:\"F2\",114:\"F3\",115:\"F4\",116:\"F5\",117:\"F6\",118:\"F7\",119:\"F8\",120:\"F9\",121:\"F10\",122:\"F11\",123:\"F12\",144:\"NumLock\",145:\"ScrollLock\",224:\"Meta\"},tg={Alt:\"altKey\",Control:\"ctrlKey\",Meta:\"metaKey\",Shift:\"shiftKey\"};function ag(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=tg[e])?!!t[e]:!1}function Au(){return ag}var og=ie({},Cr,{key:function(e){if(e.key){var t=Jm[e.key]||e.key;if(t!==\"Unidentified\")return t}return e.type===\"keypress\"?(e=Hl(e),e===13?\"Enter\":String.fromCharCode(e)):e.type===\"keydown\"||e.type===\"keyup\"?eg[e.keyCode]||\"Unidentified\":\"\"},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Au,charCode:function(e){return e.type===\"keypress\"?Hl(e):0},keyCode:function(e){return e.type===\"keydown\"||e.type===\"keyup\"?e.keyCode:0},which:function(e){return e.type===\"keypress\"?Hl(e):e.type===\"keydown\"||e.type===\"keyup\"?e.keyCode:0}}),rg=_e(og),lg=ie({},hn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),nd=_e(lg),ng=ie({},Cr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Au}),sg=_e(ng),ug=ie({},Lo,{propertyName:0,elapsedTime:0,pseudoElement:0}),ig=_e(ug),dg=ie({},hn,{deltaX:function(e){return\"deltaX\"in e?e.deltaX:\"wheelDeltaX\"in e?-e.wheelDeltaX:0},deltaY:function(e){return\"deltaY\"in e?e.deltaY:\"wheelDeltaY\"in e?-e.wheelDeltaY:\"wheelDelta\"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),cg=_e(dg),fg=[9,13,27,32],Pu=Dt&&\"CompositionEvent\"in window,Yo=null;Dt&&\"documentMode\"in document&&(Yo=document.documentMode);var pg=Dt&&\"TextEvent\"in window&&!Yo,Ec=Dt&&(!Pu||Yo&&8<Yo&&11>=Yo),sd=\" \",ud=!1;function Dc(e,t){switch(e){case\"keyup\":return fg.indexOf(t.keyCode)!==-1;case\"keydown\":return t.keyCode!==229;case\"keypress\":case\"mousedown\":case\"focusout\":return!0;default:return!1}}function Tc(e){return e=e.detail,typeof e==\"object\"&&\"data\"in e?e.data:null}var Xa=!1;function mg(e,t){switch(e){case\"compositionend\":return Tc(t);case\"keypress\":return t.which!==32?null:(ud=!0,sd);case\"textInput\":return e=t.data,e===sd&&ud?null:e;default:return null}}function gg(e,t){if(Xa)return e===\"compositionend\"||!Pu&&Dc(e,t)?(e=Bc(),Rl=Du=jt=null,Xa=!1,e):null;switch(e){case\"paste\":return null;case\"keypress\":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case\"compositionend\":return Ec&&t.locale!==\"ko\"?null:t.data;default:return null}}var xg={color:!0,date:!0,datetime:!0,\"datetime-local\":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function id(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===\"input\"?!!xg[e.type]:t===\"textarea\"}function Ac(e,t,a,o){ic(o),t=Yl(t,\"onChange\"),0<t.length&&(a=new Tu(\"onChange\",\"change\",null,a,o),e.push({event:a,listeners:t}))}var Jo=null,cr=null;function hg(e){qc(e,0)}function yn(e){var t=Ya(e);if(ac(t))return e}function yg(e,t){if(e===\"change\")return t}var Pc=!1;Dt&&(Dt?(Il=\"oninput\"in document,Il||(ps=document.createElement(\"div\"),ps.setAttribute(\"oninput\",\"return;\"),Il=typeof ps.oninput==\"function\"),Cl=Il):Cl=!1,Pc=Cl&&(!document.documentMode||9<document.documentMode));var Cl,Il,ps;function dd(){Jo&&(Jo.detachEvent(\"onpropertychange\",Nc),cr=Jo=null)}function Nc(e){if(e.propertyName===\"value\"&&yn(cr)){var t=[];Ac(t,cr,e,Fu(e)),pc(hg,t)}}function Lg(e,t,a){e===\"focusin\"?(dd(),Jo=t,cr=a,Jo.attachEvent(\"onpropertychange\",Nc)):e===\"focusout\"&&dd()}function kg(e){if(e===\"selectionchange\"||e===\"keyup\"||e===\"keydown\")return yn(cr)}function vg(e,t){if(e===\"click\")return yn(t)}function Sg(e,t){if(e===\"input\"||e===\"change\")return yn(t)}function Cg(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ut=typeof Object.is==\"function\"?Object.is:Cg;function fr(e,t){if(ut(e,t))return!0;if(typeof e!=\"object\"||e===null||typeof t!=\"object\"||t===null)return!1;var a=Object.keys(e),o=Object.keys(t);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var r=a[o];if(!bs.call(t,r)||!ut(e[r],t[r]))return!1}return!0}function cd(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function fd(e,t){var a=cd(e);e=0;for(var o;a;){if(a.nodeType===3){if(o=e+a.textContent.length,e<=t&&o>=t)return{node:a,offset:t-e};e=o}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=cd(a)}}function Mc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Mc(e,t.parentNode):\"contains\"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Rc(){for(var e=window,t=Vl();t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href==\"string\"}catch(o){a=!1}if(a)e=t.contentWindow;else break;t=Vl(e.document)}return t}function Nu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===\"input\"&&(e.type===\"text\"||e.type===\"search\"||e.type===\"tel\"||e.type===\"url\"||e.type===\"password\")||t===\"textarea\"||e.contentEditable===\"true\")}function Ig(e){var t=Rc(),a=e.focusedElem,o=e.selectionRange;if(t!==a&&a&&a.ownerDocument&&Mc(a.ownerDocument.documentElement,a)){if(o!==null&&Nu(a)){if(t=o.start,e=o.end,e===void 0&&(e=t),\"selectionStart\"in a)a.selectionStart=t,a.selectionEnd=Math.min(e,a.value.length);else if(e=(t=a.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var r=a.textContent.length,l=Math.min(o.start,r);o=o.end===void 0?l:Math.min(o.end,r),!e.extend&&l>o&&(r=o,o=l,l=r),r=fd(a,l);var s=fd(a,o);r&&s&&(e.rangeCount!==1||e.anchorNode!==r.node||e.anchorOffset!==r.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(r.node,r.offset),e.removeAllRanges(),l>o?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=a;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof a.focus==\"function\"&&a.focus(),a=0;a<t.length;a++)e=t[a],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Fg=Dt&&\"documentMode\"in document&&11>=document.documentMode,Qa=null,Ks=null,er=null,$s=!1;function pd(e,t,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;$s||Qa==null||Qa!==Vl(o)||(o=Qa,\"selectionStart\"in o&&Nu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),er&&fr(er,o)||(er=o,o=Yl(Ks,\"onSelect\"),0<o.length&&(t=new Tu(\"onSelect\",\"select\",null,t,a),e.push({event:t,listeners:o}),t.target=Qa)))}function Fl(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a[\"Webkit\"+e]=\"webkit\"+t,a[\"Moz\"+e]=\"moz\"+t,a}var Za={animationend:Fl(\"Animation\",\"AnimationEnd\"),animationiteration:Fl(\"Animation\",\"AnimationIteration\"),animationstart:Fl(\"Animation\",\"AnimationStart\"),transitionend:Fl(\"Transition\",\"TransitionEnd\")},ms={},Hc={};Dt&&(Hc=document.createElement(\"div\").style,\"AnimationEvent\"in window||(delete Za.animationend.animation,delete Za.animationiteration.animation,delete Za.animationstart.animation),\"TransitionEvent\"in window||delete Za.transitionend.transition);function Ln(e){if(ms[e])return ms[e];if(!Za[e])return e;var t=Za[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in Hc)return ms[e]=t[a];return e}var Gc=Ln(\"animationend\"),Oc=Ln(\"animationiteration\"),zc=Ln(\"animationstart\"),Uc=Ln(\"transitionend\"),Wc=new Map,md=\"abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel\".split(\" \");function na(e,t){Wc.set(e,t),Pa(t,[e])}for(wl=0;wl<md.length;wl++)bl=md[wl],gd=bl.toLowerCase(),xd=bl[0].toUpperCase()+bl.slice(1),na(gd,\"on\"+xd);var bl,gd,xd,wl;na(Gc,\"onAnimationEnd\");na(Oc,\"onAnimationIteration\");na(zc,\"onAnimationStart\");na(\"dblclick\",\"onDoubleClick\");na(\"focusin\",\"onFocus\");na(\"focusout\",\"onBlur\");na(Uc,\"onTransitionEnd\");fo(\"onMouseEnter\",[\"mouseout\",\"mouseover\"]);fo(\"onMouseLeave\",[\"mouseout\",\"mouseover\"]);fo(\"onPointerEnter\",[\"pointerout\",\"pointerover\"]);fo(\"onPointerLeave\",[\"pointerout\",\"pointerover\"]);Pa(\"onChange\",\"change click focusin focusout input keydown keyup selectionchange\".split(\" \"));Pa(\"onSelect\",\"focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange\".split(\" \"));Pa(\"onBeforeInput\",[\"compositionend\",\"keypress\",\"textInput\",\"paste\"]);Pa(\"onCompositionEnd\",\"compositionend focusout keydown keypress keyup mousedown\".split(\" \"));Pa(\"onCompositionStart\",\"compositionstart focusout keydown keypress keyup mousedown\".split(\" \"));Pa(\"onCompositionUpdate\",\"compositionupdate focusout keydown keypress keyup mousedown\".split(\" \"));var Xo=\"abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting\".split(\" \"),wg=new Set(\"cancel close invalid load scroll toggle\".split(\" \").concat(Xo));function hd(e,t,a){var o=e.type||\"unknown-event\";e.currentTarget=a,wm(o,t,void 0,e),e.currentTarget=null}function qc(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var o=e[a],r=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var s=o.length-1;0<=s;s--){var u=o[s],i=u.instance,d=u.currentTarget;if(u=u.listener,i!==l&&r.isPropagationStopped())break e;hd(r,u,d),l=i}else for(s=0;s<o.length;s++){if(u=o[s],i=u.instance,d=u.currentTarget,u=u.listener,i!==l&&r.isPropagationStopped())break e;hd(r,u,d),l=i}}}if($l)throw e=Ws,$l=!1,Ws=null,e}function oe(e,t){var a=t[Ys];a===void 0&&(a=t[Ys]=new Set);var o=e+\"__bubble\";a.has(o)||(_c(t,e,2,!1),a.add(o))}function gs(e,t,a){var o=0;t&&(o|=4),_c(a,e,o,t)}var Bl=\"_reactListening\"+Math.random().toString(36).slice(2);function pr(e){if(!e[Bl]){e[Bl]=!0,Zd.forEach(function(a){a!==\"selectionchange\"&&(wg.has(a)||gs(a,!1,e),gs(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Bl]||(t[Bl]=!0,gs(\"selectionchange\",!1,t))}}function _c(e,t,a,o){switch(bc(t)){case 1:var r=Wm;break;case 4:r=qm;break;default:r=Eu}a=r.bind(null,t,a,e),r=void 0,!Us||t!==\"touchstart\"&&t!==\"touchmove\"&&t!==\"wheel\"||(r=!0),o?r!==void 0?e.addEventListener(t,a,{capture:!0,passive:r}):e.addEventListener(t,a,!0):r!==void 0?e.addEventListener(t,a,{passive:r}):e.addEventListener(t,a,!1)}function xs(e,t,a,o,r){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var s=o.tag;if(s===3||s===4){var u=o.stateNode.containerInfo;if(u===r||u.nodeType===8&&u.parentNode===r)break;if(s===4)for(s=o.return;s!==null;){var i=s.tag;if((i===3||i===4)&&(i=s.stateNode.containerInfo,i===r||i.nodeType===8&&i.parentNode===r))return;s=s.return}for(;u!==null;){if(s=Ca(u),s===null)return;if(i=s.tag,i===5||i===6){o=l=s;continue e}u=u.parentNode}}o=o.return}pc(function(){var d=l,p=Fu(a),f=[];e:{var g=Wc.get(e);if(g!==void 0){var y=Tu,k=e;switch(e){case\"keypress\":if(Hl(a)===0)break e;case\"keydown\":case\"keyup\":y=rg;break;case\"focusin\":k=\"focus\",y=fs;break;case\"focusout\":k=\"blur\",y=fs;break;case\"beforeblur\":case\"afterblur\":y=fs;break;case\"click\":if(a.button===2)break e;case\"auxclick\":case\"dblclick\":case\"mousedown\":case\"mousemove\":case\"mouseup\":case\"mouseout\":case\"mouseover\":case\"contextmenu\":y=rd;break;case\"drag\":case\"dragend\":case\"dragenter\":case\"dragexit\":case\"dragleave\":case\"dragover\":case\"dragstart\":case\"drop\":y=Km;break;case\"touchcancel\":case\"touchend\":case\"touchmove\":case\"touchstart\":y=sg;break;case Gc:case Oc:case zc:y=Xm;break;case Uc:y=ig;break;case\"scroll\":y=_m;break;case\"wheel\":y=cg;break;case\"copy\":case\"cut\":case\"paste\":y=Zm;break;case\"gotpointercapture\":case\"lostpointercapture\":case\"pointercancel\":case\"pointerdown\":case\"pointermove\":case\"pointerout\":case\"pointerover\":case\"pointerup\":y=nd}var v=(t&4)!==0,I=!v&&e===\"scroll\",x=v?g!==null?g+\"Capture\":null:g;v=[];for(var c=d,m;c!==null;){m=c;var h=m.stateNode;if(m.tag===5&&h!==null&&(m=h,x!==null&&(h=sr(c,x),h!=null&&v.push(mr(c,h,m)))),I)break;c=c.return}0<v.length&&(g=new y(g,k,null,a,p),f.push({event:g,listeners:v}))}}if((t&7)===0){e:{if(g=e===\"mouseover\"||e===\"pointerover\",y=e===\"mouseout\"||e===\"pointerout\",g&&a!==Os&&(k=a.relatedTarget||a.fromElement)&&(Ca(k)||k[Tt]))break e;if((y||g)&&(g=p.window===p?p:(g=p.ownerDocument)?g.defaultView||g.parentWindow:window,y?(k=a.relatedTarget||a.toElement,y=d,k=k?Ca(k):null,k!==null&&(I=Na(k),k!==I||k.tag!==5&&k.tag!==6)&&(k=null)):(y=null,k=d),y!==k)){if(v=rd,h=\"onMouseLeave\",x=\"onMouseEnter\",c=\"mouse\",(e===\"pointerout\"||e===\"pointerover\")&&(v=nd,h=\"onPointerLeave\",x=\"onPointerEnter\",c=\"pointer\"),I=y==null?g:Ya(y),m=k==null?g:Ya(k),g=new v(h,c+\"leave\",y,a,p),g.target=I,g.relatedTarget=m,h=null,Ca(p)===d&&(v=new v(x,c+\"enter\",k,a,p),v.target=m,v.relatedTarget=I,h=v),I=h,y&&k)t:{for(v=y,x=k,c=0,m=v;m;m=Ka(m))c++;for(m=0,h=x;h;h=Ka(h))m++;for(;0<c-m;)v=Ka(v),c--;for(;0<m-c;)x=Ka(x),m--;for(;c--;){if(v===x||x!==null&&v===x.alternate)break t;v=Ka(v),x=Ka(x)}v=null}else v=null;y!==null&&yd(f,g,y,v,!1),k!==null&&I!==null&&yd(f,I,k,v,!0)}}e:{if(g=d?Ya(d):window,y=g.nodeName&&g.nodeName.toLowerCase(),y===\"select\"||y===\"input\"&&g.type===\"file\")var L=yg;else if(id(g))if(Pc)L=Sg;else{L=kg;var F=Lg}else(y=g.nodeName)&&y.toLowerCase()===\"input\"&&(g.type===\"checkbox\"||g.type===\"radio\")&&(L=vg);if(L&&(L=L(e,d))){Ac(f,L,a,p);break e}F&&F(e,g,d),e===\"focusout\"&&(F=g._wrapperState)&&F.controlled&&g.type===\"number\"&&Ns(g,\"number\",g.value)}switch(F=d?Ya(d):window,e){case\"focusin\":(id(F)||F.contentEditable===\"true\")&&(Qa=F,Ks=d,er=null);break;case\"focusout\":er=Ks=Qa=null;break;case\"mousedown\":$s=!0;break;case\"contextmenu\":case\"mouseup\":case\"dragend\":$s=!1,pd(f,a,p);break;case\"selectionchange\":if(Fg)break;case\"keydown\":case\"keyup\":pd(f,a,p)}var b;if(Pu)e:{switch(e){case\"compositionstart\":var C=\"onCompositionStart\";break e;case\"compositionend\":C=\"onCompositionEnd\";break e;case\"compositionupdate\":C=\"onCompositionUpdate\";break e}C=void 0}else Xa?Dc(e,a)&&(C=\"onCompositionEnd\"):e===\"keydown\"&&a.keyCode===229&&(C=\"onCompositionStart\");C&&(Ec&&a.locale!==\"ko\"&&(Xa||C!==\"onCompositionStart\"?C===\"onCompositionEnd\"&&Xa&&(b=Bc()):(jt=p,Du=\"value\"in jt?jt.value:jt.textContent,Xa=!0)),F=Yl(d,C),0<F.length&&(C=new ld(C,e,null,a,p),f.push({event:C,listeners:F}),b?C.data=b:(b=Tc(a),b!==null&&(C.data=b)))),(b=pg?mg(e,a):gg(e,a))&&(d=Yl(d,\"onBeforeInput\"),0<d.length&&(p=new ld(\"onBeforeInput\",\"beforeinput\",null,a,p),f.push({event:p,listeners:d}),p.data=b))}qc(f,t)})}function mr(e,t,a){return{instance:e,listener:t,currentTarget:a}}function Yl(e,t){for(var a=t+\"Capture\",o=[];e!==null;){var r=e,l=r.stateNode;r.tag===5&&l!==null&&(r=l,l=sr(e,a),l!=null&&o.unshift(mr(e,l,r)),l=sr(e,t),l!=null&&o.push(mr(e,l,r))),e=e.return}return o}function Ka(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function yd(e,t,a,o,r){for(var l=t._reactName,s=[];a!==null&&a!==o;){var u=a,i=u.alternate,d=u.stateNode;if(i!==null&&i===o)break;u.tag===5&&d!==null&&(u=d,r?(i=sr(a,l),i!=null&&s.unshift(mr(a,i,u))):r||(i=sr(a,l),i!=null&&s.push(mr(a,i,u)))),a=a.return}s.length!==0&&e.push({event:t,listeners:s})}var bg=/\\r\\n?/g,Bg=/\\u0000|\\uFFFD/g;function Ld(e){return(typeof e==\"string\"?e:\"\"+e).replace(bg,`\n`).replace(Bg,\"\")}function El(e,t,a){if(t=Ld(t),Ld(e)!==t&&a)throw Error(w(425))}function Jl(){}var js=null,Xs=null;function Qs(e,t){return e===\"textarea\"||e===\"noscript\"||typeof t.children==\"string\"||typeof t.children==\"number\"||typeof t.dangerouslySetInnerHTML==\"object\"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Zs=typeof setTimeout==\"function\"?setTimeout:void 0,Eg=typeof clearTimeout==\"function\"?clearTimeout:void 0,kd=typeof Promise==\"function\"?Promise:void 0,Dg=typeof queueMicrotask==\"function\"?queueMicrotask:typeof kd!=\"undefined\"?function(e){return kd.resolve(null).then(e).catch(Tg)}:Zs;function Tg(e){setTimeout(function(){throw e})}function hs(e,t){var a=t,o=0;do{var r=a.nextSibling;if(e.removeChild(a),r&&r.nodeType===8)if(a=r.data,a===\"/$\"){if(o===0){e.removeChild(r),dr(t);return}o--}else a!==\"$\"&&a!==\"$?\"&&a!==\"$!\"||o++;a=r}while(a);dr(t)}function Jt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===\"$\"||t===\"$!\"||t===\"$?\")break;if(t===\"/$\")return null}}return e}function vd(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a===\"$\"||a===\"$!\"||a===\"$?\"){if(t===0)return e;t--}else a===\"/$\"&&t++}e=e.previousSibling}return null}var ko=Math.random().toString(36).slice(2),yt=\"__reactFiber$\"+ko,gr=\"__reactProps$\"+ko,Tt=\"__reactContainer$\"+ko,Ys=\"__reactEvents$\"+ko,Ag=\"__reactListeners$\"+ko,Pg=\"__reactHandles$\"+ko;function Ca(e){var t=e[yt];if(t)return t;for(var a=e.parentNode;a;){if(t=a[Tt]||a[yt]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=vd(e);e!==null;){if(a=e[yt])return a;e=vd(e)}return t}e=a,a=e.parentNode}return null}function Ir(e){return e=e[yt]||e[Tt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Ya(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(w(33))}function kn(e){return e[gr]||null}var Js=[],Ja=-1;function sa(e){return{current:e}}function re(e){0>Ja||(e.current=Js[Ja],Js[Ja]=null,Ja--)}function ae(e,t){Ja++,Js[Ja]=e.current,e.current=t}var la={},Be=sa(la),He=sa(!1),Ba=la;function po(e,t){var a=e.type.contextTypes;if(!a)return la;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var r={},l;for(l in a)r[l]=t[l];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=r),r}function Ge(e){return e=e.childContextTypes,e!=null}function en(){re(He),re(Be)}function Sd(e,t,a){if(Be.current!==la)throw Error(w(168));ae(Be,t),ae(He,a)}function Vc(e,t,a){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!=\"function\")return a;o=o.getChildContext();for(var r in o)if(!(r in t))throw Error(w(108,Lm(e)||\"Unknown\",r));return ie({},a,o)}function tn(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||la,Ba=Be.current,ae(Be,e),ae(He,He.current),!0}function Cd(e,t,a){var o=e.stateNode;if(!o)throw Error(w(169));a?(e=Vc(e,t,Ba),o.__reactInternalMemoizedMergedChildContext=e,re(He),re(Be),ae(Be,e)):re(He),ae(He,a)}var wt=null,vn=!1,ys=!1;function Kc(e){wt===null?wt=[e]:wt.push(e)}function Ng(e){vn=!0,Kc(e)}function ua(){if(!ys&&wt!==null){ys=!0;var e=0,t=X;try{var a=wt;for(X=1;e<a.length;e++){var o=a[e];do o=o(!0);while(o!==null)}wt=null,vn=!1}catch(r){throw wt!==null&&(wt=wt.slice(e+1)),hc(wu,ua),r}finally{X=t,ys=!1}}return null}var eo=[],to=0,an=null,on=0,je=[],Xe=0,Ea=null,bt=1,Bt=\"\";function va(e,t){eo[to++]=on,eo[to++]=an,an=e,on=t}function $c(e,t,a){je[Xe++]=bt,je[Xe++]=Bt,je[Xe++]=Ea,Ea=e;var o=bt;e=Bt;var r=32-nt(o)-1;o&=~(1<<r),a+=1;var l=32-nt(t)+r;if(30<l){var s=r-r%5;l=(o&(1<<s)-1).toString(32),o>>=s,r-=s,bt=1<<32-nt(t)+r|a<<r|o,Bt=l+e}else bt=1<<l|a<<r|o,Bt=e}function Mu(e){e.return!==null&&(va(e,1),$c(e,1,0))}function Ru(e){for(;e===an;)an=eo[--to],eo[to]=null,on=eo[--to],eo[to]=null;for(;e===Ea;)Ea=je[--Xe],je[Xe]=null,Bt=je[--Xe],je[Xe]=null,bt=je[--Xe],je[Xe]=null}var We=null,Ue=null,ne=!1,lt=null;function jc(e,t){var a=Qe(5,null,null,0);a.elementType=\"DELETED\",a.stateNode=t,a.return=e,t=e.deletions,t===null?(e.deletions=[a],e.flags|=16):t.push(a)}function Id(e,t){switch(e.tag){case 5:var a=e.type;return t=t.nodeType!==1||a.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,We=e,Ue=Jt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===\"\"||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,We=e,Ue=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(a=Ea!==null?{id:bt,overflow:Bt}:null,e.memoizedState={dehydrated:t,treeContext:a,retryLane:1073741824},a=Qe(18,null,null,0),a.stateNode=t,a.return=e,e.child=a,We=e,Ue=null,!0):!1;default:return!1}}function eu(e){return(e.mode&1)!==0&&(e.flags&128)===0}function tu(e){if(ne){var t=Ue;if(t){var a=t;if(!Id(e,t)){if(eu(e))throw Error(w(418));t=Jt(a.nextSibling);var o=We;t&&Id(e,t)?jc(o,a):(e.flags=e.flags&-4097|2,ne=!1,We=e)}}else{if(eu(e))throw Error(w(418));e.flags=e.flags&-4097|2,ne=!1,We=e}}}function Fd(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;We=e}function Dl(e){if(e!==We)return!1;if(!ne)return Fd(e),ne=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!==\"head\"&&t!==\"body\"&&!Qs(e.type,e.memoizedProps)),t&&(t=Ue)){if(eu(e))throw Xc(),Error(w(418));for(;t;)jc(e,t),t=Jt(t.nextSibling)}if(Fd(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(w(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var a=e.data;if(a===\"/$\"){if(t===0){Ue=Jt(e.nextSibling);break e}t--}else a!==\"$\"&&a!==\"$!\"&&a!==\"$?\"||t++}e=e.nextSibling}Ue=null}}else Ue=We?Jt(e.stateNode.nextSibling):null;return!0}function Xc(){for(var e=Ue;e;)e=Jt(e.nextSibling)}function mo(){Ue=We=null,ne=!1}function Hu(e){lt===null?lt=[e]:lt.push(e)}var Mg=Nt.ReactCurrentBatchConfig;function Wo(e,t,a){if(e=a.ref,e!==null&&typeof e!=\"function\"&&typeof e!=\"object\"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(w(309));var o=a.stateNode}if(!o)throw Error(w(147,e));var r=o,l=\"\"+e;return t!==null&&t.ref!==null&&typeof t.ref==\"function\"&&t.ref._stringRef===l?t.ref:(t=function(s){var u=r.refs;s===null?delete u[l]:u[l]=s},t._stringRef=l,t)}if(typeof e!=\"string\")throw Error(w(284));if(!a._owner)throw Error(w(290,e))}return e}function Tl(e,t){throw e=Object.prototype.toString.call(t),Error(w(31,e===\"[object Object]\"?\"object with keys {\"+Object.keys(t).join(\", \")+\"}\":e))}function wd(e){var t=e._init;return t(e._payload)}function Qc(e){function t(x,c){if(e){var m=x.deletions;m===null?(x.deletions=[c],x.flags|=16):m.push(c)}}function a(x,c){if(!e)return null;for(;c!==null;)t(x,c),c=c.sibling;return null}function o(x,c){for(x=new Map;c!==null;)c.key!==null?x.set(c.key,c):x.set(c.index,c),c=c.sibling;return x}function r(x,c){return x=oa(x,c),x.index=0,x.sibling=null,x}function l(x,c,m){return x.index=m,e?(m=x.alternate,m!==null?(m=m.index,m<c?(x.flags|=2,c):m):(x.flags|=2,c)):(x.flags|=1048576,c)}function s(x){return e&&x.alternate===null&&(x.flags|=2),x}function u(x,c,m,h){return c===null||c.tag!==6?(c=Fs(m,x.mode,h),c.return=x,c):(c=r(c,m),c.return=x,c)}function i(x,c,m,h){var L=m.type;return L===ja?p(x,c,m.props.children,h,m.key):c!==null&&(c.elementType===L||typeof L==\"object\"&&L!==null&&L.$$typeof===_t&&wd(L)===c.type)?(h=r(c,m.props),h.ref=Wo(x,c,m),h.return=x,h):(h=_l(m.type,m.key,m.props,null,x.mode,h),h.ref=Wo(x,c,m),h.return=x,h)}function d(x,c,m,h){return c===null||c.tag!==4||c.stateNode.containerInfo!==m.containerInfo||c.stateNode.implementation!==m.implementation?(c=ws(m,x.mode,h),c.return=x,c):(c=r(c,m.children||[]),c.return=x,c)}function p(x,c,m,h,L){return c===null||c.tag!==7?(c=ba(m,x.mode,h,L),c.return=x,c):(c=r(c,m),c.return=x,c)}function f(x,c,m){if(typeof c==\"string\"&&c!==\"\"||typeof c==\"number\")return c=Fs(\"\"+c,x.mode,m),c.return=x,c;if(typeof c==\"object\"&&c!==null){switch(c.$$typeof){case xl:return m=_l(c.type,c.key,c.props,null,x.mode,m),m.ref=Wo(x,null,c),m.return=x,m;case $a:return c=ws(c,x.mode,m),c.return=x,c;case _t:var h=c._init;return f(x,h(c._payload),m)}if($o(c)||Go(c))return c=ba(c,x.mode,m,null),c.return=x,c;Tl(x,c)}return null}function g(x,c,m,h){var L=c!==null?c.key:null;if(typeof m==\"string\"&&m!==\"\"||typeof m==\"number\")return L!==null?null:u(x,c,\"\"+m,h);if(typeof m==\"object\"&&m!==null){switch(m.$$typeof){case xl:return m.key===L?i(x,c,m,h):null;case $a:return m.key===L?d(x,c,m,h):null;case _t:return L=m._init,g(x,c,L(m._payload),h)}if($o(m)||Go(m))return L!==null?null:p(x,c,m,h,null);Tl(x,m)}return null}function y(x,c,m,h,L){if(typeof h==\"string\"&&h!==\"\"||typeof h==\"number\")return x=x.get(m)||null,u(c,x,\"\"+h,L);if(typeof h==\"object\"&&h!==null){switch(h.$$typeof){case xl:return x=x.get(h.key===null?m:h.key)||null,i(c,x,h,L);case $a:return x=x.get(h.key===null?m:h.key)||null,d(c,x,h,L);case _t:var F=h._init;return y(x,c,m,F(h._payload),L)}if($o(h)||Go(h))return x=x.get(m)||null,p(c,x,h,L,null);Tl(c,h)}return null}function k(x,c,m,h){for(var L=null,F=null,b=c,C=c=0,N=null;b!==null&&C<m.length;C++){b.index>C?(N=b,b=null):N=b.sibling;var P=g(x,b,m[C],h);if(P===null){b===null&&(b=N);break}e&&b&&P.alternate===null&&t(x,b),c=l(P,c,C),F===null?L=P:F.sibling=P,F=P,b=N}if(C===m.length)return a(x,b),ne&&va(x,C),L;if(b===null){for(;C<m.length;C++)b=f(x,m[C],h),b!==null&&(c=l(b,c,C),F===null?L=b:F.sibling=b,F=b);return ne&&va(x,C),L}for(b=o(x,b);C<m.length;C++)N=y(b,x,C,m[C],h),N!==null&&(e&&N.alternate!==null&&b.delete(N.key===null?C:N.key),c=l(N,c,C),F===null?L=N:F.sibling=N,F=N);return e&&b.forEach(function(M){return t(x,M)}),ne&&va(x,C),L}function v(x,c,m,h){var L=Go(m);if(typeof L!=\"function\")throw Error(w(150));if(m=L.call(m),m==null)throw Error(w(151));for(var F=L=null,b=c,C=c=0,N=null,P=m.next();b!==null&&!P.done;C++,P=m.next()){b.index>C?(N=b,b=null):N=b.sibling;var M=g(x,b,P.value,h);if(M===null){b===null&&(b=N);break}e&&b&&M.alternate===null&&t(x,b),c=l(M,c,C),F===null?L=M:F.sibling=M,F=M,b=N}if(P.done)return a(x,b),ne&&va(x,C),L;if(b===null){for(;!P.done;C++,P=m.next())P=f(x,P.value,h),P!==null&&(c=l(P,c,C),F===null?L=P:F.sibling=P,F=P);return ne&&va(x,C),L}for(b=o(x,b);!P.done;C++,P=m.next())P=y(b,x,C,P.value,h),P!==null&&(e&&P.alternate!==null&&b.delete(P.key===null?C:P.key),c=l(P,c,C),F===null?L=P:F.sibling=P,F=P);return e&&b.forEach(function(E){return t(x,E)}),ne&&va(x,C),L}function I(x,c,m,h){if(typeof m==\"object\"&&m!==null&&m.type===ja&&m.key===null&&(m=m.props.children),typeof m==\"object\"&&m!==null){switch(m.$$typeof){case xl:e:{for(var L=m.key,F=c;F!==null;){if(F.key===L){if(L=m.type,L===ja){if(F.tag===7){a(x,F.sibling),c=r(F,m.props.children),c.return=x,x=c;break e}}else if(F.elementType===L||typeof L==\"object\"&&L!==null&&L.$$typeof===_t&&wd(L)===F.type){a(x,F.sibling),c=r(F,m.props),c.ref=Wo(x,F,m),c.return=x,x=c;break e}a(x,F);break}else t(x,F);F=F.sibling}m.type===ja?(c=ba(m.props.children,x.mode,h,m.key),c.return=x,x=c):(h=_l(m.type,m.key,m.props,null,x.mode,h),h.ref=Wo(x,c,m),h.return=x,x=h)}return s(x);case $a:e:{for(F=m.key;c!==null;){if(c.key===F)if(c.tag===4&&c.stateNode.containerInfo===m.containerInfo&&c.stateNode.implementation===m.implementation){a(x,c.sibling),c=r(c,m.children||[]),c.return=x,x=c;break e}else{a(x,c);break}else t(x,c);c=c.sibling}c=ws(m,x.mode,h),c.return=x,x=c}return s(x);case _t:return F=m._init,I(x,c,F(m._payload),h)}if($o(m))return k(x,c,m,h);if(Go(m))return v(x,c,m,h);Tl(x,m)}return typeof m==\"string\"&&m!==\"\"||typeof m==\"number\"?(m=\"\"+m,c!==null&&c.tag===6?(a(x,c.sibling),c=r(c,m),c.return=x,x=c):(a(x,c),c=Fs(m,x.mode,h),c.return=x,x=c),s(x)):a(x,c)}return I}var go=Qc(!0),Zc=Qc(!1),rn=sa(null),ln=null,ao=null,Gu=null;function Ou(){Gu=ao=ln=null}function zu(e){var t=rn.current;re(rn),e._currentValue=t}function au(e,t,a){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===a)break;e=e.return}}function io(e,t){ln=e,Gu=ao=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Re=!0),e.firstContext=null)}function Ye(e){var t=e._currentValue;if(Gu!==e)if(e={context:e,memoizedValue:t,next:null},ao===null){if(ln===null)throw Error(w(308));ao=e,ln.dependencies={lanes:0,firstContext:e}}else ao=ao.next=e;return t}var Ia=null;function Uu(e){Ia===null?Ia=[e]:Ia.push(e)}function Yc(e,t,a,o){var r=t.interleaved;return r===null?(a.next=a,Uu(t)):(a.next=r.next,r.next=a),t.interleaved=a,At(e,o)}function At(e,t){e.lanes|=t;var a=e.alternate;for(a!==null&&(a.lanes|=t),a=e,e=e.return;e!==null;)e.childLanes|=t,a=e.alternate,a!==null&&(a.childLanes|=t),a=e,e=e.return;return a.tag===3?a.stateNode:null}var Vt=!1;function Wu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Jc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Et(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function ea(e,t,a){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(W&2)!==0){var r=o.pending;return r===null?t.next=t:(t.next=r.next,r.next=t),o.pending=t,At(e,a)}return r=o.interleaved,r===null?(t.next=t,Uu(o)):(t.next=r.next,r.next=t),o.interleaved=t,At(e,a)}function Gl(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,a|=o,t.lanes=a,bu(e,a)}}function bd(e,t){var a=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var r=null,l=null;if(a=a.firstBaseUpdate,a!==null){do{var s={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};l===null?r=l=s:l=l.next=s,a=a.next}while(a!==null);l===null?r=l=t:l=l.next=t}else r=l=t;a={baseState:o.baseState,firstBaseUpdate:r,lastBaseUpdate:l,shared:o.shared,effects:o.effects},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}function nn(e,t,a,o){var r=e.updateQueue;Vt=!1;var l=r.firstBaseUpdate,s=r.lastBaseUpdate,u=r.shared.pending;if(u!==null){r.shared.pending=null;var i=u,d=i.next;i.next=null,s===null?l=d:s.next=d,s=i;var p=e.alternate;p!==null&&(p=p.updateQueue,u=p.lastBaseUpdate,u!==s&&(u===null?p.firstBaseUpdate=d:u.next=d,p.lastBaseUpdate=i))}if(l!==null){var f=r.baseState;s=0,p=d=i=null,u=l;do{var g=u.lane,y=u.eventTime;if((o&g)===g){p!==null&&(p=p.next={eventTime:y,lane:0,tag:u.tag,payload:u.payload,callback:u.callback,next:null});e:{var k=e,v=u;switch(g=t,y=a,v.tag){case 1:if(k=v.payload,typeof k==\"function\"){f=k.call(y,f,g);break e}f=k;break e;case 3:k.flags=k.flags&-65537|128;case 0:if(k=v.payload,g=typeof k==\"function\"?k.call(y,f,g):k,g==null)break e;f=ie({},f,g);break e;case 2:Vt=!0}}u.callback!==null&&u.lane!==0&&(e.flags|=64,g=r.effects,g===null?r.effects=[u]:g.push(u))}else y={eventTime:y,lane:g,tag:u.tag,payload:u.payload,callback:u.callback,next:null},p===null?(d=p=y,i=f):p=p.next=y,s|=g;if(u=u.next,u===null){if(u=r.shared.pending,u===null)break;g=u,u=g.next,g.next=null,r.lastBaseUpdate=g,r.shared.pending=null}}while(!0);if(p===null&&(i=f),r.baseState=i,r.firstBaseUpdate=d,r.lastBaseUpdate=p,t=r.shared.interleaved,t!==null){r=t;do s|=r.lane,r=r.next;while(r!==t)}else l===null&&(r.shared.lanes=0);Ta|=s,e.lanes=s,e.memoizedState=f}}function Bd(e,t,a){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],r=o.callback;if(r!==null){if(o.callback=null,o=a,typeof r!=\"function\")throw Error(w(191,r));r.call(o)}}}var Fr={},kt=sa(Fr),xr=sa(Fr),hr=sa(Fr);function Fa(e){if(e===Fr)throw Error(w(174));return e}function qu(e,t){switch(ae(hr,t),ae(xr,e),ae(kt,Fr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Rs(null,\"\");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Rs(t,e)}re(kt),ae(kt,t)}function xo(){re(kt),re(xr),re(hr)}function ef(e){Fa(hr.current);var t=Fa(kt.current),a=Rs(t,e.type);t!==a&&(ae(xr,e),ae(kt,a))}function _u(e){xr.current===e&&(re(kt),re(xr))}var se=sa(0);function sn(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data===\"$?\"||a.data===\"$!\"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ls=[];function Vu(){for(var e=0;e<Ls.length;e++)Ls[e]._workInProgressVersionPrimary=null;Ls.length=0}var Ol=Nt.ReactCurrentDispatcher,ks=Nt.ReactCurrentBatchConfig,Da=0,ue=null,xe=null,ye=null,un=!1,tr=!1,yr=0,Rg=0;function Fe(){throw Error(w(321))}function Ku(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!ut(e[a],t[a]))return!1;return!0}function $u(e,t,a,o,r,l){if(Da=l,ue=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Ol.current=e===null||e.memoizedState===null?zg:Ug,e=a(o,r),tr){l=0;do{if(tr=!1,yr=0,25<=l)throw Error(w(301));l+=1,ye=xe=null,t.updateQueue=null,Ol.current=Wg,e=a(o,r)}while(tr)}if(Ol.current=dn,t=xe!==null&&xe.next!==null,Da=0,ye=xe=ue=null,un=!1,t)throw Error(w(300));return e}function ju(){var e=yr!==0;return yr=0,e}function ht(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ye===null?ue.memoizedState=ye=e:ye=ye.next=e,ye}function Je(){if(xe===null){var e=ue.alternate;e=e!==null?e.memoizedState:null}else e=xe.next;var t=ye===null?ue.memoizedState:ye.next;if(t!==null)ye=t,xe=e;else{if(e===null)throw Error(w(310));xe=e,e={memoizedState:xe.memoizedState,baseState:xe.baseState,baseQueue:xe.baseQueue,queue:xe.queue,next:null},ye===null?ue.memoizedState=ye=e:ye=ye.next=e}return ye}function Lr(e,t){return typeof t==\"function\"?t(e):t}function vs(e){var t=Je(),a=t.queue;if(a===null)throw Error(w(311));a.lastRenderedReducer=e;var o=xe,r=o.baseQueue,l=a.pending;if(l!==null){if(r!==null){var s=r.next;r.next=l.next,l.next=s}o.baseQueue=r=l,a.pending=null}if(r!==null){l=r.next,o=o.baseState;var u=s=null,i=null,d=l;do{var p=d.lane;if((Da&p)===p)i!==null&&(i=i.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),o=d.hasEagerState?d.eagerState:e(o,d.action);else{var f={lane:p,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};i===null?(u=i=f,s=o):i=i.next=f,ue.lanes|=p,Ta|=p}d=d.next}while(d!==null&&d!==l);i===null?s=o:i.next=u,ut(o,t.memoizedState)||(Re=!0),t.memoizedState=o,t.baseState=s,t.baseQueue=i,a.lastRenderedState=o}if(e=a.interleaved,e!==null){r=e;do l=r.lane,ue.lanes|=l,Ta|=l,r=r.next;while(r!==e)}else r===null&&(a.lanes=0);return[t.memoizedState,a.dispatch]}function Ss(e){var t=Je(),a=t.queue;if(a===null)throw Error(w(311));a.lastRenderedReducer=e;var o=a.dispatch,r=a.pending,l=t.memoizedState;if(r!==null){a.pending=null;var s=r=r.next;do l=e(l,s.action),s=s.next;while(s!==r);ut(l,t.memoizedState)||(Re=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),a.lastRenderedState=l}return[l,o]}function tf(){}function af(e,t){var a=ue,o=Je(),r=t(),l=!ut(o.memoizedState,r);if(l&&(o.memoizedState=r,Re=!0),o=o.queue,Xu(lf.bind(null,a,o,e),[e]),o.getSnapshot!==t||l||ye!==null&&ye.memoizedState.tag&1){if(a.flags|=2048,kr(9,rf.bind(null,a,o,r,t),void 0,null),Le===null)throw Error(w(349));(Da&30)!==0||of(a,t,r)}return r}function of(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=ue.updateQueue,t===null?(t={lastEffect:null,stores:null},ue.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function rf(e,t,a,o){t.value=a,t.getSnapshot=o,nf(t)&&sf(e)}function lf(e,t,a){return a(function(){nf(t)&&sf(e)})}function nf(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!ut(e,a)}catch(o){return!0}}function sf(e){var t=At(e,1);t!==null&&st(t,e,1,-1)}function Ed(e){var t=ht();return typeof e==\"function\"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Lr,lastRenderedState:e},t.queue=e,e=e.dispatch=Og.bind(null,ue,e),[t.memoizedState,e]}function kr(e,t,a,o){return e={tag:e,create:t,destroy:a,deps:o,next:null},t=ue.updateQueue,t===null?(t={lastEffect:null,stores:null},ue.updateQueue=t,t.lastEffect=e.next=e):(a=t.lastEffect,a===null?t.lastEffect=e.next=e:(o=a.next,a.next=e,e.next=o,t.lastEffect=e)),e}function uf(){return Je().memoizedState}function zl(e,t,a,o){var r=ht();ue.flags|=e,r.memoizedState=kr(1|t,a,void 0,o===void 0?null:o)}function Sn(e,t,a,o){var r=Je();o=o===void 0?null:o;var l=void 0;if(xe!==null){var s=xe.memoizedState;if(l=s.destroy,o!==null&&Ku(o,s.deps)){r.memoizedState=kr(t,a,l,o);return}}ue.flags|=e,r.memoizedState=kr(1|t,a,l,o)}function Dd(e,t){return zl(8390656,8,e,t)}function Xu(e,t){return Sn(2048,8,e,t)}function df(e,t){return Sn(4,2,e,t)}function cf(e,t){return Sn(4,4,e,t)}function ff(e,t){if(typeof t==\"function\")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function pf(e,t,a){return a=a!=null?a.concat([e]):null,Sn(4,4,ff.bind(null,t,e),a)}function Qu(){}function mf(e,t){var a=Je();t=t===void 0?null:t;var o=a.memoizedState;return o!==null&&t!==null&&Ku(t,o[1])?o[0]:(a.memoizedState=[e,t],e)}function gf(e,t){var a=Je();t=t===void 0?null:t;var o=a.memoizedState;return o!==null&&t!==null&&Ku(t,o[1])?o[0]:(e=e(),a.memoizedState=[e,t],e)}function xf(e,t,a){return(Da&21)===0?(e.baseState&&(e.baseState=!1,Re=!0),e.memoizedState=a):(ut(a,t)||(a=kc(),ue.lanes|=a,Ta|=a,e.baseState=!0),t)}function Hg(e,t){var a=X;X=a!==0&&4>a?a:4,e(!0);var o=ks.transition;ks.transition={};try{e(!1),t()}finally{X=a,ks.transition=o}}function hf(){return Je().memoizedState}function Gg(e,t,a){var o=aa(e);if(a={lane:o,action:a,hasEagerState:!1,eagerState:null,next:null},yf(e))Lf(t,a);else if(a=Yc(e,t,a,o),a!==null){var r=Ae();st(a,e,o,r),kf(a,t,o)}}function Og(e,t,a){var o=aa(e),r={lane:o,action:a,hasEagerState:!1,eagerState:null,next:null};if(yf(e))Lf(t,r);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var s=t.lastRenderedState,u=l(s,a);if(r.hasEagerState=!0,r.eagerState=u,ut(u,s)){var i=t.interleaved;i===null?(r.next=r,Uu(t)):(r.next=i.next,i.next=r),t.interleaved=r;return}}catch(d){}a=Yc(e,t,r,o),a!==null&&(r=Ae(),st(a,e,o,r),kf(a,t,o))}}function yf(e){var t=e.alternate;return e===ue||t!==null&&t===ue}function Lf(e,t){tr=un=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function kf(e,t,a){if((a&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,a|=o,t.lanes=a,bu(e,a)}}var dn={readContext:Ye,useCallback:Fe,useContext:Fe,useEffect:Fe,useImperativeHandle:Fe,useInsertionEffect:Fe,useLayoutEffect:Fe,useMemo:Fe,useReducer:Fe,useRef:Fe,useState:Fe,useDebugValue:Fe,useDeferredValue:Fe,useTransition:Fe,useMutableSource:Fe,useSyncExternalStore:Fe,useId:Fe,unstable_isNewReconciler:!1},zg={readContext:Ye,useCallback:function(e,t){return ht().memoizedState=[e,t===void 0?null:t],e},useContext:Ye,useEffect:Dd,useImperativeHandle:function(e,t,a){return a=a!=null?a.concat([e]):null,zl(4194308,4,ff.bind(null,t,e),a)},useLayoutEffect:function(e,t){return zl(4194308,4,e,t)},useInsertionEffect:function(e,t){return zl(4,2,e,t)},useMemo:function(e,t){var a=ht();return t=t===void 0?null:t,e=e(),a.memoizedState=[e,t],e},useReducer:function(e,t,a){var o=ht();return t=a!==void 0?a(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=Gg.bind(null,ue,e),[o.memoizedState,e]},useRef:function(e){var t=ht();return e={current:e},t.memoizedState=e},useState:Ed,useDebugValue:Qu,useDeferredValue:function(e){return ht().memoizedState=e},useTransition:function(){var e=Ed(!1),t=e[0];return e=Hg.bind(null,e[1]),ht().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,a){var o=ue,r=ht();if(ne){if(a===void 0)throw Error(w(407));a=a()}else{if(a=t(),Le===null)throw Error(w(349));(Da&30)!==0||of(o,t,a)}r.memoizedState=a;var l={value:a,getSnapshot:t};return r.queue=l,Dd(lf.bind(null,o,l,e),[e]),o.flags|=2048,kr(9,rf.bind(null,o,l,a,t),void 0,null),a},useId:function(){var e=ht(),t=Le.identifierPrefix;if(ne){var a=Bt,o=bt;a=(o&~(1<<32-nt(o)-1)).toString(32)+a,t=\":\"+t+\"R\"+a,a=yr++,0<a&&(t+=\"H\"+a.toString(32)),t+=\":\"}else a=Rg++,t=\":\"+t+\"r\"+a.toString(32)+\":\";return e.memoizedState=t},unstable_isNewReconciler:!1},Ug={readContext:Ye,useCallback:mf,useContext:Ye,useEffect:Xu,useImperativeHandle:pf,useInsertionEffect:df,useLayoutEffect:cf,useMemo:gf,useReducer:vs,useRef:uf,useState:function(){return vs(Lr)},useDebugValue:Qu,useDeferredValue:function(e){var t=Je();return xf(t,xe.memoizedState,e)},useTransition:function(){var e=vs(Lr)[0],t=Je().memoizedState;return[e,t]},useMutableSource:tf,useSyncExternalStore:af,useId:hf,unstable_isNewReconciler:!1},Wg={readContext:Ye,useCallback:mf,useContext:Ye,useEffect:Xu,useImperativeHandle:pf,useInsertionEffect:df,useLayoutEffect:cf,useMemo:gf,useReducer:Ss,useRef:uf,useState:function(){return Ss(Lr)},useDebugValue:Qu,useDeferredValue:function(e){var t=Je();return xe===null?t.memoizedState=e:xf(t,xe.memoizedState,e)},useTransition:function(){var e=Ss(Lr)[0],t=Je().memoizedState;return[e,t]},useMutableSource:tf,useSyncExternalStore:af,useId:hf,unstable_isNewReconciler:!1};function ot(e,t){if(e&&e.defaultProps){t=ie({},t),e=e.defaultProps;for(var a in e)t[a]===void 0&&(t[a]=e[a]);return t}return t}function ou(e,t,a,o){t=e.memoizedState,a=a(o,t),a=a==null?t:ie({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Cn={isMounted:function(e){return(e=e._reactInternals)?Na(e)===e:!1},enqueueSetState:function(e,t,a){e=e._reactInternals;var o=Ae(),r=aa(e),l=Et(o,r);l.payload=t,a!=null&&(l.callback=a),t=ea(e,l,r),t!==null&&(st(t,e,r,o),Gl(t,e,r))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var o=Ae(),r=aa(e),l=Et(o,r);l.tag=1,l.payload=t,a!=null&&(l.callback=a),t=ea(e,l,r),t!==null&&(st(t,e,r,o),Gl(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=Ae(),o=aa(e),r=Et(a,o);r.tag=2,t!=null&&(r.callback=t),t=ea(e,r,o),t!==null&&(st(t,e,o,a),Gl(t,e,o))}};function Td(e,t,a,o,r,l,s){return e=e.stateNode,typeof e.shouldComponentUpdate==\"function\"?e.shouldComponentUpdate(o,l,s):t.prototype&&t.prototype.isPureReactComponent?!fr(a,o)||!fr(r,l):!0}function vf(e,t,a){var o=!1,r=la,l=t.contextType;return typeof l==\"object\"&&l!==null?l=Ye(l):(r=Ge(t)?Ba:Be.current,o=t.contextTypes,l=(o=o!=null)?po(e,r):la),t=new t(a,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Cn,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=r,e.__reactInternalMemoizedMaskedChildContext=l),t}function Ad(e,t,a,o){e=t.state,typeof t.componentWillReceiveProps==\"function\"&&t.componentWillReceiveProps(a,o),typeof t.UNSAFE_componentWillReceiveProps==\"function\"&&t.UNSAFE_componentWillReceiveProps(a,o),t.state!==e&&Cn.enqueueReplaceState(t,t.state,null)}function ru(e,t,a,o){var r=e.stateNode;r.props=a,r.state=e.memoizedState,r.refs={},Wu(e);var l=t.contextType;typeof l==\"object\"&&l!==null?r.context=Ye(l):(l=Ge(t)?Ba:Be.current,r.context=po(e,l)),r.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l==\"function\"&&(ou(e,t,l,a),r.state=e.memoizedState),typeof t.getDerivedStateFromProps==\"function\"||typeof r.getSnapshotBeforeUpdate==\"function\"||typeof r.UNSAFE_componentWillMount!=\"function\"&&typeof r.componentWillMount!=\"function\"||(t=r.state,typeof r.componentWillMount==\"function\"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount==\"function\"&&r.UNSAFE_componentWillMount(),t!==r.state&&Cn.enqueueReplaceState(r,r.state,null),nn(e,a,r,o),r.state=e.memoizedState),typeof r.componentDidMount==\"function\"&&(e.flags|=4194308)}function ho(e,t){try{var a=\"\",o=t;do a+=ym(o),o=o.return;while(o);var r=a}catch(l){r=`\nError generating stack: `+l.message+`\n`+l.stack}return{value:e,source:t,stack:r,digest:null}}function Cs(e,t,a){return{value:e,source:null,stack:a!=null?a:null,digest:t!=null?t:null}}function lu(e,t){try{console.error(t.value)}catch(a){setTimeout(function(){throw a})}}var qg=typeof WeakMap==\"function\"?WeakMap:Map;function Sf(e,t,a){a=Et(-1,a),a.tag=3,a.payload={element:null};var o=t.value;return a.callback=function(){fn||(fn=!0,gu=o),lu(e,t)},a}function Cf(e,t,a){a=Et(-1,a),a.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o==\"function\"){var r=t.value;a.payload=function(){return o(r)},a.callback=function(){lu(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch==\"function\"&&(a.callback=function(){lu(e,t),typeof o!=\"function\"&&(ta===null?ta=new Set([this]):ta.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:\"\"})}),a}function Pd(e,t,a){var o=e.pingCache;if(o===null){o=e.pingCache=new qg;var r=new Set;o.set(t,r)}else r=o.get(t),r===void 0&&(r=new Set,o.set(t,r));r.has(a)||(r.add(a),e=ox.bind(null,e,t,a),t.then(e,e))}function Nd(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Md(e,t,a,o,r){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(t=Et(-1,1),t.tag=2,ea(a,t,1))),a.lanes|=1),e):(e.flags|=65536,e.lanes=r,e)}var _g=Nt.ReactCurrentOwner,Re=!1;function Te(e,t,a,o){t.child=e===null?Zc(t,null,a,o):go(t,e.child,a,o)}function Rd(e,t,a,o,r){a=a.render;var l=t.ref;return io(t,r),o=$u(e,t,a,o,l,r),a=ju(),e!==null&&!Re?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Pt(e,t,r)):(ne&&a&&Mu(t),t.flags|=1,Te(e,t,o,r),t.child)}function Hd(e,t,a,o,r){if(e===null){var l=a.type;return typeof l==\"function\"&&!ri(l)&&l.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(t.tag=15,t.type=l,If(e,t,l,o,r)):(e=_l(a.type,null,o,t,t.mode,r),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,(e.lanes&r)===0){var s=l.memoizedProps;if(a=a.compare,a=a!==null?a:fr,a(s,o)&&e.ref===t.ref)return Pt(e,t,r)}return t.flags|=1,e=oa(l,o),e.ref=t.ref,e.return=t,t.child=e}function If(e,t,a,o,r){if(e!==null){var l=e.memoizedProps;if(fr(l,o)&&e.ref===t.ref)if(Re=!1,t.pendingProps=o=l,(e.lanes&r)!==0)(e.flags&131072)!==0&&(Re=!0);else return t.lanes=e.lanes,Pt(e,t,r)}return nu(e,t,a,o,r)}function Ff(e,t,a){var o=t.pendingProps,r=o.children,l=e!==null?e.memoizedState:null;if(o.mode===\"hidden\")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ae(ro,ze),ze|=a;else{if((a&1073741824)===0)return e=l!==null?l.baseLanes|a:a,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ae(ro,ze),ze|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=l!==null?l.baseLanes:a,ae(ro,ze),ze|=o}else l!==null?(o=l.baseLanes|a,t.memoizedState=null):o=a,ae(ro,ze),ze|=o;return Te(e,t,r,a),t.child}function wf(e,t){var a=t.ref;(e===null&&a!==null||e!==null&&e.ref!==a)&&(t.flags|=512,t.flags|=2097152)}function nu(e,t,a,o,r){var l=Ge(a)?Ba:Be.current;return l=po(t,l),io(t,r),a=$u(e,t,a,o,l,r),o=ju(),e!==null&&!Re?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Pt(e,t,r)):(ne&&o&&Mu(t),t.flags|=1,Te(e,t,a,r),t.child)}function Gd(e,t,a,o,r){if(Ge(a)){var l=!0;tn(t)}else l=!1;if(io(t,r),t.stateNode===null)Ul(e,t),vf(t,a,o),ru(t,a,o,r),o=!0;else if(e===null){var s=t.stateNode,u=t.memoizedProps;s.props=u;var i=s.context,d=a.contextType;typeof d==\"object\"&&d!==null?d=Ye(d):(d=Ge(a)?Ba:Be.current,d=po(t,d));var p=a.getDerivedStateFromProps,f=typeof p==\"function\"||typeof s.getSnapshotBeforeUpdate==\"function\";f||typeof s.UNSAFE_componentWillReceiveProps!=\"function\"&&typeof s.componentWillReceiveProps!=\"function\"||(u!==o||i!==d)&&Ad(t,s,o,d),Vt=!1;var g=t.memoizedState;s.state=g,nn(t,o,s,r),i=t.memoizedState,u!==o||g!==i||He.current||Vt?(typeof p==\"function\"&&(ou(t,a,p,o),i=t.memoizedState),(u=Vt||Td(t,a,u,o,g,i,d))?(f||typeof s.UNSAFE_componentWillMount!=\"function\"&&typeof s.componentWillMount!=\"function\"||(typeof s.componentWillMount==\"function\"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount==\"function\"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount==\"function\"&&(t.flags|=4194308)):(typeof s.componentDidMount==\"function\"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=i),s.props=o,s.state=i,s.context=d,o=u):(typeof s.componentDidMount==\"function\"&&(t.flags|=4194308),o=!1)}else{s=t.stateNode,Jc(e,t),u=t.memoizedProps,d=t.type===t.elementType?u:ot(t.type,u),s.props=d,f=t.pendingProps,g=s.context,i=a.contextType,typeof i==\"object\"&&i!==null?i=Ye(i):(i=Ge(a)?Ba:Be.current,i=po(t,i));var y=a.getDerivedStateFromProps;(p=typeof y==\"function\"||typeof s.getSnapshotBeforeUpdate==\"function\")||typeof s.UNSAFE_componentWillReceiveProps!=\"function\"&&typeof s.componentWillReceiveProps!=\"function\"||(u!==f||g!==i)&&Ad(t,s,o,i),Vt=!1,g=t.memoizedState,s.state=g,nn(t,o,s,r);var k=t.memoizedState;u!==f||g!==k||He.current||Vt?(typeof y==\"function\"&&(ou(t,a,y,o),k=t.memoizedState),(d=Vt||Td(t,a,d,o,g,k,i)||!1)?(p||typeof s.UNSAFE_componentWillUpdate!=\"function\"&&typeof s.componentWillUpdate!=\"function\"||(typeof s.componentWillUpdate==\"function\"&&s.componentWillUpdate(o,k,i),typeof s.UNSAFE_componentWillUpdate==\"function\"&&s.UNSAFE_componentWillUpdate(o,k,i)),typeof s.componentDidUpdate==\"function\"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate==\"function\"&&(t.flags|=1024)):(typeof s.componentDidUpdate!=\"function\"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!=\"function\"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=k),s.props=o,s.state=k,s.context=i,o=d):(typeof s.componentDidUpdate!=\"function\"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!=\"function\"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),o=!1)}return su(e,t,a,o,l,r)}function su(e,t,a,o,r,l){wf(e,t);var s=(t.flags&128)!==0;if(!o&&!s)return r&&Cd(t,a,!1),Pt(e,t,l);o=t.stateNode,_g.current=t;var u=s&&typeof a.getDerivedStateFromError!=\"function\"?null:o.render();return t.flags|=1,e!==null&&s?(t.child=go(t,e.child,null,l),t.child=go(t,null,u,l)):Te(e,t,u,l),t.memoizedState=o.state,r&&Cd(t,a,!0),t.child}function bf(e){var t=e.stateNode;t.pendingContext?Sd(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Sd(e,t.context,!1),qu(e,t.containerInfo)}function Od(e,t,a,o,r){return mo(),Hu(r),t.flags|=256,Te(e,t,a,o),t.child}var uu={dehydrated:null,treeContext:null,retryLane:0};function iu(e){return{baseLanes:e,cachePool:null,transitions:null}}function Bf(e,t,a){var o=t.pendingProps,r=se.current,l=!1,s=(t.flags&128)!==0,u;if((u=s)||(u=e!==null&&e.memoizedState===null?!1:(r&2)!==0),u?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(r|=1),ae(se,r&1),e===null)return tu(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data===\"$!\"?t.lanes=8:t.lanes=1073741824,null):(s=o.children,e=o.fallback,l?(o=t.mode,l=t.child,s={mode:\"hidden\",children:s},(o&1)===0&&l!==null?(l.childLanes=0,l.pendingProps=s):l=wn(s,o,0,null),e=ba(e,o,a,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=iu(a),t.memoizedState=uu,e):Zu(t,s));if(r=e.memoizedState,r!==null&&(u=r.dehydrated,u!==null))return Vg(e,t,s,o,u,r,a);if(l){l=o.fallback,s=t.mode,r=e.child,u=r.sibling;var i={mode:\"hidden\",children:o.children};return(s&1)===0&&t.child!==r?(o=t.child,o.childLanes=0,o.pendingProps=i,t.deletions=null):(o=oa(r,i),o.subtreeFlags=r.subtreeFlags&14680064),u!==null?l=oa(u,l):(l=ba(l,s,a,null),l.flags|=2),l.return=t,o.return=t,o.sibling=l,t.child=o,o=l,l=t.child,s=e.child.memoizedState,s=s===null?iu(a):{baseLanes:s.baseLanes|a,cachePool:null,transitions:s.transitions},l.memoizedState=s,l.childLanes=e.childLanes&~a,t.memoizedState=uu,o}return l=e.child,e=l.sibling,o=oa(l,{mode:\"visible\",children:o.children}),(t.mode&1)===0&&(o.lanes=a),o.return=t,o.sibling=null,e!==null&&(a=t.deletions,a===null?(t.deletions=[e],t.flags|=16):a.push(e)),t.child=o,t.memoizedState=null,o}function Zu(e,t){return t=wn({mode:\"visible\",children:t},e.mode,0,null),t.return=e,e.child=t}function Al(e,t,a,o){return o!==null&&Hu(o),go(t,e.child,null,a),e=Zu(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Vg(e,t,a,o,r,l,s){if(a)return t.flags&256?(t.flags&=-257,o=Cs(Error(w(422))),Al(e,t,s,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=o.fallback,r=t.mode,o=wn({mode:\"visible\",children:o.children},r,0,null),l=ba(l,r,s,null),l.flags|=2,o.return=t,l.return=t,o.sibling=l,t.child=o,(t.mode&1)!==0&&go(t,e.child,null,s),t.child.memoizedState=iu(s),t.memoizedState=uu,l);if((t.mode&1)===0)return Al(e,t,s,null);if(r.data===\"$!\"){if(o=r.nextSibling&&r.nextSibling.dataset,o)var u=o.dgst;return o=u,l=Error(w(419)),o=Cs(l,o,void 0),Al(e,t,s,o)}if(u=(s&e.childLanes)!==0,Re||u){if(o=Le,o!==null){switch(s&-s){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=(r&(o.suspendedLanes|s))!==0?0:r,r!==0&&r!==l.retryLane&&(l.retryLane=r,At(e,r),st(o,e,r,-1))}return oi(),o=Cs(Error(w(421))),Al(e,t,s,o)}return r.data===\"$?\"?(t.flags|=128,t.child=e.child,t=rx.bind(null,e),r._reactRetry=t,null):(e=l.treeContext,Ue=Jt(r.nextSibling),We=t,ne=!0,lt=null,e!==null&&(je[Xe++]=bt,je[Xe++]=Bt,je[Xe++]=Ea,bt=e.id,Bt=e.overflow,Ea=t),t=Zu(t,o.children),t.flags|=4096,t)}function zd(e,t,a){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),au(e.return,t,a)}function Is(e,t,a,o,r){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:r}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=o,l.tail=a,l.tailMode=r)}function Ef(e,t,a){var o=t.pendingProps,r=o.revealOrder,l=o.tail;if(Te(e,t,o.children,a),o=se.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&zd(e,a,t);else if(e.tag===19)zd(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(ae(se,o),(t.mode&1)===0)t.memoizedState=null;else switch(r){case\"forwards\":for(a=t.child,r=null;a!==null;)e=a.alternate,e!==null&&sn(e)===null&&(r=a),a=a.sibling;a=r,a===null?(r=t.child,t.child=null):(r=a.sibling,a.sibling=null),Is(t,!1,r,a,l);break;case\"backwards\":for(a=null,r=t.child,t.child=null;r!==null;){if(e=r.alternate,e!==null&&sn(e)===null){t.child=r;break}e=r.sibling,r.sibling=a,a=r,r=e}Is(t,!0,a,null,l);break;case\"together\":Is(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ul(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Pt(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),Ta|=t.lanes,(a&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(w(153));if(t.child!==null){for(e=t.child,a=oa(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=oa(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function Kg(e,t,a){switch(t.tag){case 3:bf(t),mo();break;case 5:ef(t);break;case 1:Ge(t.type)&&tn(t);break;case 4:qu(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,r=t.memoizedProps.value;ae(rn,o._currentValue),o._currentValue=r;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(ae(se,se.current&1),t.flags|=128,null):(a&t.child.childLanes)!==0?Bf(e,t,a):(ae(se,se.current&1),e=Pt(e,t,a),e!==null?e.sibling:null);ae(se,se.current&1);break;case 19:if(o=(a&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Ef(e,t,a);t.flags|=128}if(r=t.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ae(se,se.current),o)break;return null;case 22:case 23:return t.lanes=0,Ff(e,t,a)}return Pt(e,t,a)}var Df,du,Tf,Af;Df=function(e,t){for(var a=t.child;a!==null;){if(a.tag===5||a.tag===6)e.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===t)break;for(;a.sibling===null;){if(a.return===null||a.return===t)return;a=a.return}a.sibling.return=a.return,a=a.sibling}};du=function(){};Tf=function(e,t,a,o){var r=e.memoizedProps;if(r!==o){e=t.stateNode,Fa(kt.current);var l=null;switch(a){case\"input\":r=As(e,r),o=As(e,o),l=[];break;case\"select\":r=ie({},r,{value:void 0}),o=ie({},o,{value:void 0}),l=[];break;case\"textarea\":r=Ms(e,r),o=Ms(e,o),l=[];break;default:typeof r.onClick!=\"function\"&&typeof o.onClick==\"function\"&&(e.onclick=Jl)}Hs(a,o);var s;a=null;for(d in r)if(!o.hasOwnProperty(d)&&r.hasOwnProperty(d)&&r[d]!=null)if(d===\"style\"){var u=r[d];for(s in u)u.hasOwnProperty(s)&&(a||(a={}),a[s]=\"\")}else d!==\"dangerouslySetInnerHTML\"&&d!==\"children\"&&d!==\"suppressContentEditableWarning\"&&d!==\"suppressHydrationWarning\"&&d!==\"autoFocus\"&&(lr.hasOwnProperty(d)?l||(l=[]):(l=l||[]).push(d,null));for(d in o){var i=o[d];if(u=r!=null?r[d]:void 0,o.hasOwnProperty(d)&&i!==u&&(i!=null||u!=null))if(d===\"style\")if(u){for(s in u)!u.hasOwnProperty(s)||i&&i.hasOwnProperty(s)||(a||(a={}),a[s]=\"\");for(s in i)i.hasOwnProperty(s)&&u[s]!==i[s]&&(a||(a={}),a[s]=i[s])}else a||(l||(l=[]),l.push(d,a)),a=i;else d===\"dangerouslySetInnerHTML\"?(i=i?i.__html:void 0,u=u?u.__html:void 0,i!=null&&u!==i&&(l=l||[]).push(d,i)):d===\"children\"?typeof i!=\"string\"&&typeof i!=\"number\"||(l=l||[]).push(d,\"\"+i):d!==\"suppressContentEditableWarning\"&&d!==\"suppressHydrationWarning\"&&(lr.hasOwnProperty(d)?(i!=null&&d===\"onScroll\"&&oe(\"scroll\",e),l||u===i||(l=[])):(l=l||[]).push(d,i))}a&&(l=l||[]).push(\"style\",a);var d=l;(t.updateQueue=d)&&(t.flags|=4)}};Af=function(e,t,a,o){a!==o&&(t.flags|=4)};function qo(e,t){if(!ne)switch(e.tailMode){case\"hidden\":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case\"collapsed\":a=e.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function we(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,o=0;if(t)for(var r=e.child;r!==null;)a|=r.lanes|r.childLanes,o|=r.subtreeFlags&14680064,o|=r.flags&14680064,r.return=e,r=r.sibling;else for(r=e.child;r!==null;)a|=r.lanes|r.childLanes,o|=r.subtreeFlags,o|=r.flags,r.return=e,r=r.sibling;return e.subtreeFlags|=o,e.childLanes=a,t}function $g(e,t,a){var o=t.pendingProps;switch(Ru(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return we(t),null;case 1:return Ge(t.type)&&en(),we(t),null;case 3:return o=t.stateNode,xo(),re(He),re(Be),Vu(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(Dl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,lt!==null&&(yu(lt),lt=null))),du(e,t),we(t),null;case 5:_u(t);var r=Fa(hr.current);if(a=t.type,e!==null&&t.stateNode!=null)Tf(e,t,a,o,r),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(w(166));return we(t),null}if(e=Fa(kt.current),Dl(t)){o=t.stateNode,a=t.type;var l=t.memoizedProps;switch(o[yt]=t,o[gr]=l,e=(t.mode&1)!==0,a){case\"dialog\":oe(\"cancel\",o),oe(\"close\",o);break;case\"iframe\":case\"object\":case\"embed\":oe(\"load\",o);break;case\"video\":case\"audio\":for(r=0;r<Xo.length;r++)oe(Xo[r],o);break;case\"source\":oe(\"error\",o);break;case\"img\":case\"image\":case\"link\":oe(\"error\",o),oe(\"load\",o);break;case\"details\":oe(\"toggle\",o);break;case\"input\":ji(o,l),oe(\"invalid\",o);break;case\"select\":o._wrapperState={wasMultiple:!!l.multiple},oe(\"invalid\",o);break;case\"textarea\":Qi(o,l),oe(\"invalid\",o)}Hs(a,l),r=null;for(var s in l)if(l.hasOwnProperty(s)){var u=l[s];s===\"children\"?typeof u==\"string\"?o.textContent!==u&&(l.suppressHydrationWarning!==!0&&El(o.textContent,u,e),r=[\"children\",u]):typeof u==\"number\"&&o.textContent!==\"\"+u&&(l.suppressHydrationWarning!==!0&&El(o.textContent,u,e),r=[\"children\",\"\"+u]):lr.hasOwnProperty(s)&&u!=null&&s===\"onScroll\"&&oe(\"scroll\",o)}switch(a){case\"input\":hl(o),Xi(o,l,!0);break;case\"textarea\":hl(o),Zi(o);break;case\"select\":case\"option\":break;default:typeof l.onClick==\"function\"&&(o.onclick=Jl)}o=r,t.updateQueue=o,o!==null&&(t.flags|=4)}else{s=r.nodeType===9?r:r.ownerDocument,e===\"http://www.w3.org/1999/xhtml\"&&(e=lc(a)),e===\"http://www.w3.org/1999/xhtml\"?a===\"script\"?(e=s.createElement(\"div\"),e.innerHTML=\"<script><\\/script>\",e=e.removeChild(e.firstChild)):typeof o.is==\"string\"?e=s.createElement(a,{is:o.is}):(e=s.createElement(a),a===\"select\"&&(s=e,o.multiple?s.multiple=!0:o.size&&(s.size=o.size))):e=s.createElementNS(e,a),e[yt]=t,e[gr]=o,Df(e,t,!1,!1),t.stateNode=e;e:{switch(s=Gs(a,o),a){case\"dialog\":oe(\"cancel\",e),oe(\"close\",e),r=o;break;case\"iframe\":case\"object\":case\"embed\":oe(\"load\",e),r=o;break;case\"video\":case\"audio\":for(r=0;r<Xo.length;r++)oe(Xo[r],e);r=o;break;case\"source\":oe(\"error\",e),r=o;break;case\"img\":case\"image\":case\"link\":oe(\"error\",e),oe(\"load\",e),r=o;break;case\"details\":oe(\"toggle\",e),r=o;break;case\"input\":ji(e,o),r=As(e,o),oe(\"invalid\",e);break;case\"option\":r=o;break;case\"select\":e._wrapperState={wasMultiple:!!o.multiple},r=ie({},o,{value:void 0}),oe(\"invalid\",e);break;case\"textarea\":Qi(e,o),r=Ms(e,o),oe(\"invalid\",e);break;default:r=o}Hs(a,r),u=r;for(l in u)if(u.hasOwnProperty(l)){var i=u[l];l===\"style\"?uc(e,i):l===\"dangerouslySetInnerHTML\"?(i=i?i.__html:void 0,i!=null&&nc(e,i)):l===\"children\"?typeof i==\"string\"?(a!==\"textarea\"||i!==\"\")&&nr(e,i):typeof i==\"number\"&&nr(e,\"\"+i):l!==\"suppressContentEditableWarning\"&&l!==\"suppressHydrationWarning\"&&l!==\"autoFocus\"&&(lr.hasOwnProperty(l)?i!=null&&l===\"onScroll\"&&oe(\"scroll\",e):i!=null&&vu(e,l,i,s))}switch(a){case\"input\":hl(e),Xi(e,o,!1);break;case\"textarea\":hl(e),Zi(e);break;case\"option\":o.value!=null&&e.setAttribute(\"value\",\"\"+ra(o.value));break;case\"select\":e.multiple=!!o.multiple,l=o.value,l!=null?lo(e,!!o.multiple,l,!1):o.defaultValue!=null&&lo(e,!!o.multiple,o.defaultValue,!0);break;default:typeof r.onClick==\"function\"&&(e.onclick=Jl)}switch(a){case\"button\":case\"input\":case\"select\":case\"textarea\":o=!!o.autoFocus;break e;case\"img\":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return we(t),null;case 6:if(e&&t.stateNode!=null)Af(e,t,e.memoizedProps,o);else{if(typeof o!=\"string\"&&t.stateNode===null)throw Error(w(166));if(a=Fa(hr.current),Fa(kt.current),Dl(t)){if(o=t.stateNode,a=t.memoizedProps,o[yt]=t,(l=o.nodeValue!==a)&&(e=We,e!==null))switch(e.tag){case 3:El(o.nodeValue,a,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&El(o.nodeValue,a,(e.mode&1)!==0)}l&&(t.flags|=4)}else o=(a.nodeType===9?a:a.ownerDocument).createTextNode(o),o[yt]=t,t.stateNode=o}return we(t),null;case 13:if(re(se),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ne&&Ue!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Xc(),mo(),t.flags|=98560,l=!1;else if(l=Dl(t),o!==null&&o.dehydrated!==null){if(e===null){if(!l)throw Error(w(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(w(317));l[yt]=t}else mo(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;we(t),l=!1}else lt!==null&&(yu(lt),lt=null),l=!0;if(!l)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=a,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(se.current&1)!==0?he===0&&(he=3):oi())),t.updateQueue!==null&&(t.flags|=4),we(t),null);case 4:return xo(),du(e,t),e===null&&pr(t.stateNode.containerInfo),we(t),null;case 10:return zu(t.type._context),we(t),null;case 17:return Ge(t.type)&&en(),we(t),null;case 19:if(re(se),l=t.memoizedState,l===null)return we(t),null;if(o=(t.flags&128)!==0,s=l.rendering,s===null)if(o)qo(l,!1);else{if(he!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=sn(e),s!==null){for(t.flags|=128,qo(l,!1),o=s.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=a,a=t.child;a!==null;)l=a,e=o,l.flags&=14680066,s=l.alternate,s===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=s.childLanes,l.lanes=s.lanes,l.child=s.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=s.memoizedProps,l.memoizedState=s.memoizedState,l.updateQueue=s.updateQueue,l.type=s.type,e=s.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),a=a.sibling;return ae(se,se.current&1|2),t.child}e=e.sibling}l.tail!==null&&pe()>yo&&(t.flags|=128,o=!0,qo(l,!1),t.lanes=4194304)}else{if(!o)if(e=sn(s),e!==null){if(t.flags|=128,o=!0,a=e.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),qo(l,!0),l.tail===null&&l.tailMode===\"hidden\"&&!s.alternate&&!ne)return we(t),null}else 2*pe()-l.renderingStartTime>yo&&a!==1073741824&&(t.flags|=128,o=!0,qo(l,!1),t.lanes=4194304);l.isBackwards?(s.sibling=t.child,t.child=s):(a=l.last,a!==null?a.sibling=s:t.child=s,l.last=s)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=pe(),t.sibling=null,a=se.current,ae(se,o?a&1|2:a&1),t):(we(t),null);case 22:case 23:return ai(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(ze&1073741824)!==0&&(we(t),t.subtreeFlags&6&&(t.flags|=8192)):we(t),null;case 24:return null;case 25:return null}throw Error(w(156,t.tag))}function jg(e,t){switch(Ru(t),t.tag){case 1:return Ge(t.type)&&en(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return xo(),re(He),re(Be),Vu(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return _u(t),null;case 13:if(re(se),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(w(340));mo()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return re(se),null;case 4:return xo(),null;case 10:return zu(t.type._context),null;case 22:case 23:return ai(),null;case 24:return null;default:return null}}var Pl=!1,be=!1,Xg=typeof WeakSet==\"function\"?WeakSet:Set,A=null;function oo(e,t){var a=e.ref;if(a!==null)if(typeof a==\"function\")try{a(null)}catch(o){ce(e,t,o)}else a.current=null}function cu(e,t,a){try{a()}catch(o){ce(e,t,o)}}var Ud=!1;function Qg(e,t){if(js=Ql,e=Rc(),Nu(e)){if(\"selectionStart\"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var r=o.anchorOffset,l=o.focusNode;o=o.focusOffset;try{a.nodeType,l.nodeType}catch(h){a=null;break e}var s=0,u=-1,i=-1,d=0,p=0,f=e,g=null;t:for(;;){for(var y;f!==a||r!==0&&f.nodeType!==3||(u=s+r),f!==l||o!==0&&f.nodeType!==3||(i=s+o),f.nodeType===3&&(s+=f.nodeValue.length),(y=f.firstChild)!==null;)g=f,f=y;for(;;){if(f===e)break t;if(g===a&&++d===r&&(u=s),g===l&&++p===o&&(i=s),(y=f.nextSibling)!==null)break;f=g,g=f.parentNode}f=y}a=u===-1||i===-1?null:{start:u,end:i}}else a=null}a=a||{start:0,end:0}}else a=null;for(Xs={focusedElem:e,selectionRange:a},Ql=!1,A=t;A!==null;)if(t=A,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,A=e;else for(;A!==null;){t=A;try{var k=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(k!==null){var v=k.memoizedProps,I=k.memoizedState,x=t.stateNode,c=x.getSnapshotBeforeUpdate(t.elementType===t.type?v:ot(t.type,v),I);x.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var m=t.stateNode.containerInfo;m.nodeType===1?m.textContent=\"\":m.nodeType===9&&m.documentElement&&m.removeChild(m.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(w(163))}}catch(h){ce(t,t.return,h)}if(e=t.sibling,e!==null){e.return=t.return,A=e;break}A=t.return}return k=Ud,Ud=!1,k}function ar(e,t,a){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var r=o=o.next;do{if((r.tag&e)===e){var l=r.destroy;r.destroy=void 0,l!==void 0&&cu(t,a,l)}r=r.next}while(r!==o)}}function In(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var a=t=t.next;do{if((a.tag&e)===e){var o=a.create;a.destroy=o()}a=a.next}while(a!==t)}}function fu(e){var t=e.ref;if(t!==null){var a=e.stateNode;e.tag,e=a,typeof t==\"function\"?t(e):t.current=e}}function Pf(e){var t=e.alternate;t!==null&&(e.alternate=null,Pf(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[yt],delete t[gr],delete t[Ys],delete t[Ag],delete t[Pg])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Nf(e){return e.tag===5||e.tag===3||e.tag===4}function Wd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Nf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function pu(e,t,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?a.nodeType===8?a.parentNode.insertBefore(e,t):a.insertBefore(e,t):(a.nodeType===8?(t=a.parentNode,t.insertBefore(e,a)):(t=a,t.appendChild(e)),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=Jl));else if(o!==4&&(e=e.child,e!==null))for(pu(e,t,a),e=e.sibling;e!==null;)pu(e,t,a),e=e.sibling}function mu(e,t,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(mu(e,t,a),e=e.sibling;e!==null;)mu(e,t,a),e=e.sibling}var ke=null,rt=!1;function qt(e,t,a){for(a=a.child;a!==null;)Mf(e,t,a),a=a.sibling}function Mf(e,t,a){if(Lt&&typeof Lt.onCommitFiberUnmount==\"function\")try{Lt.onCommitFiberUnmount(xn,a)}catch(u){}switch(a.tag){case 5:be||oo(a,t);case 6:var o=ke,r=rt;ke=null,qt(e,t,a),ke=o,rt=r,ke!==null&&(rt?(e=ke,a=a.stateNode,e.nodeType===8?e.parentNode.removeChild(a):e.removeChild(a)):ke.removeChild(a.stateNode));break;case 18:ke!==null&&(rt?(e=ke,a=a.stateNode,e.nodeType===8?hs(e.parentNode,a):e.nodeType===1&&hs(e,a),dr(e)):hs(ke,a.stateNode));break;case 4:o=ke,r=rt,ke=a.stateNode.containerInfo,rt=!0,qt(e,t,a),ke=o,rt=r;break;case 0:case 11:case 14:case 15:if(!be&&(o=a.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){r=o=o.next;do{var l=r,s=l.destroy;l=l.tag,s!==void 0&&((l&2)!==0||(l&4)!==0)&&cu(a,t,s),r=r.next}while(r!==o)}qt(e,t,a);break;case 1:if(!be&&(oo(a,t),o=a.stateNode,typeof o.componentWillUnmount==\"function\"))try{o.props=a.memoizedProps,o.state=a.memoizedState,o.componentWillUnmount()}catch(u){ce(a,t,u)}qt(e,t,a);break;case 21:qt(e,t,a);break;case 22:a.mode&1?(be=(o=be)||a.memoizedState!==null,qt(e,t,a),be=o):qt(e,t,a);break;default:qt(e,t,a)}}function qd(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var a=e.stateNode;a===null&&(a=e.stateNode=new Xg),t.forEach(function(o){var r=lx.bind(null,e,o);a.has(o)||(a.add(o),o.then(r,r))})}}function at(e,t){var a=t.deletions;if(a!==null)for(var o=0;o<a.length;o++){var r=a[o];try{var l=e,s=t,u=s;e:for(;u!==null;){switch(u.tag){case 5:ke=u.stateNode,rt=!1;break e;case 3:ke=u.stateNode.containerInfo,rt=!0;break e;case 4:ke=u.stateNode.containerInfo,rt=!0;break e}u=u.return}if(ke===null)throw Error(w(160));Mf(l,s,r),ke=null,rt=!1;var i=r.alternate;i!==null&&(i.return=null),r.return=null}catch(d){ce(r,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Rf(t,e),t=t.sibling}function Rf(e,t){var a=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(at(t,e),xt(e),o&4){try{ar(3,e,e.return),In(3,e)}catch(v){ce(e,e.return,v)}try{ar(5,e,e.return)}catch(v){ce(e,e.return,v)}}break;case 1:at(t,e),xt(e),o&512&&a!==null&&oo(a,a.return);break;case 5:if(at(t,e),xt(e),o&512&&a!==null&&oo(a,a.return),e.flags&32){var r=e.stateNode;try{nr(r,\"\")}catch(v){ce(e,e.return,v)}}if(o&4&&(r=e.stateNode,r!=null)){var l=e.memoizedProps,s=a!==null?a.memoizedProps:l,u=e.type,i=e.updateQueue;if(e.updateQueue=null,i!==null)try{u===\"input\"&&l.type===\"radio\"&&l.name!=null&&oc(r,l),Gs(u,s);var d=Gs(u,l);for(s=0;s<i.length;s+=2){var p=i[s],f=i[s+1];p===\"style\"?uc(r,f):p===\"dangerouslySetInnerHTML\"?nc(r,f):p===\"children\"?nr(r,f):vu(r,p,f,d)}switch(u){case\"input\":Ps(r,l);break;case\"textarea\":rc(r,l);break;case\"select\":var g=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!l.multiple;var y=l.value;y!=null?lo(r,!!l.multiple,y,!1):g!==!!l.multiple&&(l.defaultValue!=null?lo(r,!!l.multiple,l.defaultValue,!0):lo(r,!!l.multiple,l.multiple?[]:\"\",!1))}r[gr]=l}catch(v){ce(e,e.return,v)}}break;case 6:if(at(t,e),xt(e),o&4){if(e.stateNode===null)throw Error(w(162));r=e.stateNode,l=e.memoizedProps;try{r.nodeValue=l}catch(v){ce(e,e.return,v)}}break;case 3:if(at(t,e),xt(e),o&4&&a!==null&&a.memoizedState.isDehydrated)try{dr(t.containerInfo)}catch(v){ce(e,e.return,v)}break;case 4:at(t,e),xt(e);break;case 13:at(t,e),xt(e),r=e.child,r.flags&8192&&(l=r.memoizedState!==null,r.stateNode.isHidden=l,!l||r.alternate!==null&&r.alternate.memoizedState!==null||(ei=pe())),o&4&&qd(e);break;case 22:if(p=a!==null&&a.memoizedState!==null,e.mode&1?(be=(d=be)||p,at(t,e),be=d):at(t,e),xt(e),o&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!p&&(e.mode&1)!==0)for(A=e,p=e.child;p!==null;){for(f=A=p;A!==null;){switch(g=A,y=g.child,g.tag){case 0:case 11:case 14:case 15:ar(4,g,g.return);break;case 1:oo(g,g.return);var k=g.stateNode;if(typeof k.componentWillUnmount==\"function\"){o=g,a=g.return;try{t=o,k.props=t.memoizedProps,k.state=t.memoizedState,k.componentWillUnmount()}catch(v){ce(o,a,v)}}break;case 5:oo(g,g.return);break;case 22:if(g.memoizedState!==null){Vd(f);continue}}y!==null?(y.return=g,A=y):Vd(f)}p=p.sibling}e:for(p=null,f=e;;){if(f.tag===5){if(p===null){p=f;try{r=f.stateNode,d?(l=r.style,typeof l.setProperty==\"function\"?l.setProperty(\"display\",\"none\",\"important\"):l.display=\"none\"):(u=f.stateNode,i=f.memoizedProps.style,s=i!=null&&i.hasOwnProperty(\"display\")?i.display:null,u.style.display=sc(\"display\",s))}catch(v){ce(e,e.return,v)}}}else if(f.tag===6){if(p===null)try{f.stateNode.nodeValue=d?\"\":f.memoizedProps}catch(v){ce(e,e.return,v)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===e)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===e)break e;for(;f.sibling===null;){if(f.return===null||f.return===e)break e;p===f&&(p=null),f=f.return}p===f&&(p=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:at(t,e),xt(e),o&4&&qd(e);break;case 21:break;default:at(t,e),xt(e)}}function xt(e){var t=e.flags;if(t&2){try{e:{for(var a=e.return;a!==null;){if(Nf(a)){var o=a;break e}a=a.return}throw Error(w(160))}switch(o.tag){case 5:var r=o.stateNode;o.flags&32&&(nr(r,\"\"),o.flags&=-33);var l=Wd(e);mu(e,l,r);break;case 3:case 4:var s=o.stateNode.containerInfo,u=Wd(e);pu(e,u,s);break;default:throw Error(w(161))}}catch(i){ce(e,e.return,i)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Zg(e,t,a){A=e,Hf(e,t,a)}function Hf(e,t,a){for(var o=(e.mode&1)!==0;A!==null;){var r=A,l=r.child;if(r.tag===22&&o){var s=r.memoizedState!==null||Pl;if(!s){var u=r.alternate,i=u!==null&&u.memoizedState!==null||be;u=Pl;var d=be;if(Pl=s,(be=i)&&!d)for(A=r;A!==null;)s=A,i=s.child,s.tag===22&&s.memoizedState!==null?Kd(r):i!==null?(i.return=s,A=i):Kd(r);for(;l!==null;)A=l,Hf(l,t,a),l=l.sibling;A=r,Pl=u,be=d}_d(e,t,a)}else(r.subtreeFlags&8772)!==0&&l!==null?(l.return=r,A=l):_d(e,t,a)}}function _d(e){for(;A!==null;){var t=A;if((t.flags&8772)!==0){var a=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:be||In(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!be)if(a===null)o.componentDidMount();else{var r=t.elementType===t.type?a.memoizedProps:ot(t.type,a.memoizedProps);o.componentDidUpdate(r,a.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&Bd(t,l,o);break;case 3:var s=t.updateQueue;if(s!==null){if(a=null,t.child!==null)switch(t.child.tag){case 5:a=t.child.stateNode;break;case 1:a=t.child.stateNode}Bd(t,s,a)}break;case 5:var u=t.stateNode;if(a===null&&t.flags&4){a=u;var i=t.memoizedProps;switch(t.type){case\"button\":case\"input\":case\"select\":case\"textarea\":i.autoFocus&&a.focus();break;case\"img\":i.src&&(a.src=i.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var p=d.memoizedState;if(p!==null){var f=p.dehydrated;f!==null&&dr(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(w(163))}be||t.flags&512&&fu(t)}catch(g){ce(t,t.return,g)}}if(t===e){A=null;break}if(a=t.sibling,a!==null){a.return=t.return,A=a;break}A=t.return}}function Vd(e){for(;A!==null;){var t=A;if(t===e){A=null;break}var a=t.sibling;if(a!==null){a.return=t.return,A=a;break}A=t.return}}function Kd(e){for(;A!==null;){var t=A;try{switch(t.tag){case 0:case 11:case 15:var a=t.return;try{In(4,t)}catch(i){ce(t,a,i)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount==\"function\"){var r=t.return;try{o.componentDidMount()}catch(i){ce(t,r,i)}}var l=t.return;try{fu(t)}catch(i){ce(t,l,i)}break;case 5:var s=t.return;try{fu(t)}catch(i){ce(t,s,i)}}}catch(i){ce(t,t.return,i)}if(t===e){A=null;break}var u=t.sibling;if(u!==null){u.return=t.return,A=u;break}A=t.return}}var Yg=Math.ceil,cn=Nt.ReactCurrentDispatcher,Yu=Nt.ReactCurrentOwner,Ze=Nt.ReactCurrentBatchConfig,W=0,Le=null,me=null,ve=0,ze=0,ro=sa(0),he=0,vr=null,Ta=0,Fn=0,Ju=0,or=null,Me=null,ei=0,yo=1/0,Ft=null,fn=!1,gu=null,ta=null,Nl=!1,Xt=null,pn=0,rr=0,xu=null,Wl=-1,ql=0;function Ae(){return(W&6)!==0?pe():Wl!==-1?Wl:Wl=pe()}function aa(e){return(e.mode&1)===0?1:(W&2)!==0&&ve!==0?ve&-ve:Mg.transition!==null?(ql===0&&(ql=kc()),ql):(e=X,e!==0||(e=window.event,e=e===void 0?16:bc(e.type)),e)}function st(e,t,a,o){if(50<rr)throw rr=0,xu=null,Error(w(185));Sr(e,a,o),((W&2)===0||e!==Le)&&(e===Le&&((W&2)===0&&(Fn|=a),he===4&&$t(e,ve)),Oe(e,o),a===1&&W===0&&(t.mode&1)===0&&(yo=pe()+500,vn&&ua()))}function Oe(e,t){var a=e.callbackNode;Hm(e,t);var o=Xl(e,e===Le?ve:0);if(o===0)a!==null&&ed(a),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(a!=null&&ed(a),t===1)e.tag===0?Ng($d.bind(null,e)):Kc($d.bind(null,e)),Dg(function(){(W&6)===0&&ua()}),a=null;else{switch(vc(o)){case 1:a=wu;break;case 4:a=yc;break;case 16:a=jl;break;case 536870912:a=Lc;break;default:a=jl}a=Vf(a,Gf.bind(null,e))}e.callbackPriority=t,e.callbackNode=a}}function Gf(e,t){if(Wl=-1,ql=0,(W&6)!==0)throw Error(w(327));var a=e.callbackNode;if(co()&&e.callbackNode!==a)return null;var o=Xl(e,e===Le?ve:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=mn(e,o);else{t=o;var r=W;W|=2;var l=zf();(Le!==e||ve!==t)&&(Ft=null,yo=pe()+500,wa(e,t));do try{tx();break}catch(u){Of(e,u)}while(!0);Ou(),cn.current=l,W=r,me!==null?t=0:(Le=null,ve=0,t=he)}if(t!==0){if(t===2&&(r=qs(e),r!==0&&(o=r,t=hu(e,r))),t===1)throw a=vr,wa(e,0),$t(e,o),Oe(e,pe()),a;if(t===6)$t(e,o);else{if(r=e.current.alternate,(o&30)===0&&!Jg(r)&&(t=mn(e,o),t===2&&(l=qs(e),l!==0&&(o=l,t=hu(e,l))),t===1))throw a=vr,wa(e,0),$t(e,o),Oe(e,pe()),a;switch(e.finishedWork=r,e.finishedLanes=o,t){case 0:case 1:throw Error(w(345));case 2:Sa(e,Me,Ft);break;case 3:if($t(e,o),(o&130023424)===o&&(t=ei+500-pe(),10<t)){if(Xl(e,0)!==0)break;if(r=e.suspendedLanes,(r&o)!==o){Ae(),e.pingedLanes|=e.suspendedLanes&r;break}e.timeoutHandle=Zs(Sa.bind(null,e,Me,Ft),t);break}Sa(e,Me,Ft);break;case 4:if($t(e,o),(o&4194240)===o)break;for(t=e.eventTimes,r=-1;0<o;){var s=31-nt(o);l=1<<s,s=t[s],s>r&&(r=s),o&=~l}if(o=r,o=pe()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*Yg(o/1960))-o,10<o){e.timeoutHandle=Zs(Sa.bind(null,e,Me,Ft),o);break}Sa(e,Me,Ft);break;case 5:Sa(e,Me,Ft);break;default:throw Error(w(329))}}}return Oe(e,pe()),e.callbackNode===a?Gf.bind(null,e):null}function hu(e,t){var a=or;return e.current.memoizedState.isDehydrated&&(wa(e,t).flags|=256),e=mn(e,t),e!==2&&(t=Me,Me=a,t!==null&&yu(t)),e}function yu(e){Me===null?Me=e:Me.push.apply(Me,e)}function Jg(e){for(var t=e;;){if(t.flags&16384){var a=t.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var o=0;o<a.length;o++){var r=a[o],l=r.getSnapshot;r=r.value;try{if(!ut(l(),r))return!1}catch(s){return!1}}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function $t(e,t){for(t&=~Ju,t&=~Fn,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var a=31-nt(t),o=1<<a;e[a]=-1,t&=~o}}function $d(e){if((W&6)!==0)throw Error(w(327));co();var t=Xl(e,0);if((t&1)===0)return Oe(e,pe()),null;var a=mn(e,t);if(e.tag!==0&&a===2){var o=qs(e);o!==0&&(t=o,a=hu(e,o))}if(a===1)throw a=vr,wa(e,0),$t(e,t),Oe(e,pe()),a;if(a===6)throw Error(w(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Sa(e,Me,Ft),Oe(e,pe()),null}function ti(e,t){var a=W;W|=1;try{return e(t)}finally{W=a,W===0&&(yo=pe()+500,vn&&ua())}}function Aa(e){Xt!==null&&Xt.tag===0&&(W&6)===0&&co();var t=W;W|=1;var a=Ze.transition,o=X;try{if(Ze.transition=null,X=1,e)return e()}finally{X=o,Ze.transition=a,W=t,(W&6)===0&&ua()}}function ai(){ze=ro.current,re(ro)}function wa(e,t){e.finishedWork=null,e.finishedLanes=0;var a=e.timeoutHandle;if(a!==-1&&(e.timeoutHandle=-1,Eg(a)),me!==null)for(a=me.return;a!==null;){var o=a;switch(Ru(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&en();break;case 3:xo(),re(He),re(Be),Vu();break;case 5:_u(o);break;case 4:xo();break;case 13:re(se);break;case 19:re(se);break;case 10:zu(o.type._context);break;case 22:case 23:ai()}a=a.return}if(Le=e,me=e=oa(e.current,null),ve=ze=t,he=0,vr=null,Ju=Fn=Ta=0,Me=or=null,Ia!==null){for(t=0;t<Ia.length;t++)if(a=Ia[t],o=a.interleaved,o!==null){a.interleaved=null;var r=o.next,l=a.pending;if(l!==null){var s=l.next;l.next=r,o.next=s}a.pending=o}Ia=null}return e}function Of(e,t){do{var a=me;try{if(Ou(),Ol.current=dn,un){for(var o=ue.memoizedState;o!==null;){var r=o.queue;r!==null&&(r.pending=null),o=o.next}un=!1}if(Da=0,ye=xe=ue=null,tr=!1,yr=0,Yu.current=null,a===null||a.return===null){he=1,vr=t,me=null;break}e:{var l=e,s=a.return,u=a,i=t;if(t=ve,u.flags|=32768,i!==null&&typeof i==\"object\"&&typeof i.then==\"function\"){var d=i,p=u,f=p.tag;if((p.mode&1)===0&&(f===0||f===11||f===15)){var g=p.alternate;g?(p.updateQueue=g.updateQueue,p.memoizedState=g.memoizedState,p.lanes=g.lanes):(p.updateQueue=null,p.memoizedState=null)}var y=Nd(s);if(y!==null){y.flags&=-257,Md(y,s,u,l,t),y.mode&1&&Pd(l,d,t),t=y,i=d;var k=t.updateQueue;if(k===null){var v=new Set;v.add(i),t.updateQueue=v}else k.add(i);break e}else{if((t&1)===0){Pd(l,d,t),oi();break e}i=Error(w(426))}}else if(ne&&u.mode&1){var I=Nd(s);if(I!==null){(I.flags&65536)===0&&(I.flags|=256),Md(I,s,u,l,t),Hu(ho(i,u));break e}}l=i=ho(i,u),he!==4&&(he=2),or===null?or=[l]:or.push(l),l=s;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var x=Sf(l,i,t);bd(l,x);break e;case 1:u=i;var c=l.type,m=l.stateNode;if((l.flags&128)===0&&(typeof c.getDerivedStateFromError==\"function\"||m!==null&&typeof m.componentDidCatch==\"function\"&&(ta===null||!ta.has(m)))){l.flags|=65536,t&=-t,l.lanes|=t;var h=Cf(l,u,t);bd(l,h);break e}}l=l.return}while(l!==null)}Wf(a)}catch(L){t=L,me===a&&a!==null&&(me=a=a.return);continue}break}while(!0)}function zf(){var e=cn.current;return cn.current=dn,e===null?dn:e}function oi(){(he===0||he===3||he===2)&&(he=4),Le===null||(Ta&268435455)===0&&(Fn&268435455)===0||$t(Le,ve)}function mn(e,t){var a=W;W|=2;var o=zf();(Le!==e||ve!==t)&&(Ft=null,wa(e,t));do try{ex();break}catch(r){Of(e,r)}while(!0);if(Ou(),W=a,cn.current=o,me!==null)throw Error(w(261));return Le=null,ve=0,he}function ex(){for(;me!==null;)Uf(me)}function tx(){for(;me!==null&&!Bm();)Uf(me)}function Uf(e){var t=_f(e.alternate,e,ze);e.memoizedProps=e.pendingProps,t===null?Wf(e):me=t,Yu.current=null}function Wf(e){var t=e;do{var a=t.alternate;if(e=t.return,(t.flags&32768)===0){if(a=$g(a,t,ze),a!==null){me=a;return}}else{if(a=jg(a,t),a!==null){a.flags&=32767,me=a;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{he=6,me=null;return}}if(t=t.sibling,t!==null){me=t;return}me=t=e}while(t!==null);he===0&&(he=5)}function Sa(e,t,a){var o=X,r=Ze.transition;try{Ze.transition=null,X=1,ax(e,t,a,o)}finally{Ze.transition=r,X=o}return null}function ax(e,t,a,o){do co();while(Xt!==null);if((W&6)!==0)throw Error(w(327));a=e.finishedWork;var r=e.finishedLanes;if(a===null)return null;if(e.finishedWork=null,e.finishedLanes=0,a===e.current)throw Error(w(177));e.callbackNode=null,e.callbackPriority=0;var l=a.lanes|a.childLanes;if(Gm(e,l),e===Le&&(me=Le=null,ve=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Nl||(Nl=!0,Vf(jl,function(){return co(),null})),l=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||l){l=Ze.transition,Ze.transition=null;var s=X;X=1;var u=W;W|=4,Yu.current=null,Qg(e,a),Rf(a,e),Ig(Xs),Ql=!!js,Xs=js=null,e.current=a,Zg(a,e,r),Em(),W=u,X=s,Ze.transition=l}else e.current=a;if(Nl&&(Nl=!1,Xt=e,pn=r),l=e.pendingLanes,l===0&&(ta=null),Am(a.stateNode,o),Oe(e,pe()),t!==null)for(o=e.onRecoverableError,a=0;a<t.length;a++)r=t[a],o(r.value,{componentStack:r.stack,digest:r.digest});if(fn)throw fn=!1,e=gu,gu=null,e;return(pn&1)!==0&&e.tag!==0&&co(),l=e.pendingLanes,(l&1)!==0?e===xu?rr++:(rr=0,xu=e):rr=0,ua(),null}function co(){if(Xt!==null){var e=vc(pn),t=Ze.transition,a=X;try{if(Ze.transition=null,X=16>e?16:e,Xt===null)var o=!1;else{if(e=Xt,Xt=null,pn=0,(W&6)!==0)throw Error(w(331));var r=W;for(W|=4,A=e.current;A!==null;){var l=A,s=l.child;if((A.flags&16)!==0){var u=l.deletions;if(u!==null){for(var i=0;i<u.length;i++){var d=u[i];for(A=d;A!==null;){var p=A;switch(p.tag){case 0:case 11:case 15:ar(8,p,l)}var f=p.child;if(f!==null)f.return=p,A=f;else for(;A!==null;){p=A;var g=p.sibling,y=p.return;if(Pf(p),p===d){A=null;break}if(g!==null){g.return=y,A=g;break}A=y}}}var k=l.alternate;if(k!==null){var v=k.child;if(v!==null){k.child=null;do{var I=v.sibling;v.sibling=null,v=I}while(v!==null)}}A=l}}if((l.subtreeFlags&2064)!==0&&s!==null)s.return=l,A=s;else e:for(;A!==null;){if(l=A,(l.flags&2048)!==0)switch(l.tag){case 0:case 11:case 15:ar(9,l,l.return)}var x=l.sibling;if(x!==null){x.return=l.return,A=x;break e}A=l.return}}var c=e.current;for(A=c;A!==null;){s=A;var m=s.child;if((s.subtreeFlags&2064)!==0&&m!==null)m.return=s,A=m;else e:for(s=c;A!==null;){if(u=A,(u.flags&2048)!==0)try{switch(u.tag){case 0:case 11:case 15:In(9,u)}}catch(L){ce(u,u.return,L)}if(u===s){A=null;break e}var h=u.sibling;if(h!==null){h.return=u.return,A=h;break e}A=u.return}}if(W=r,ua(),Lt&&typeof Lt.onPostCommitFiberRoot==\"function\")try{Lt.onPostCommitFiberRoot(xn,e)}catch(L){}o=!0}return o}finally{X=a,Ze.transition=t}}return!1}function jd(e,t,a){t=ho(a,t),t=Sf(e,t,1),e=ea(e,t,1),t=Ae(),e!==null&&(Sr(e,1,t),Oe(e,t))}function ce(e,t,a){if(e.tag===3)jd(e,e,a);else for(;t!==null;){if(t.tag===3){jd(t,e,a);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError==\"function\"||typeof o.componentDidCatch==\"function\"&&(ta===null||!ta.has(o))){e=ho(a,e),e=Cf(t,e,1),t=ea(t,e,1),e=Ae(),t!==null&&(Sr(t,1,e),Oe(t,e));break}}t=t.return}}function ox(e,t,a){var o=e.pingCache;o!==null&&o.delete(t),t=Ae(),e.pingedLanes|=e.suspendedLanes&a,Le===e&&(ve&a)===a&&(he===4||he===3&&(ve&130023424)===ve&&500>pe()-ei?wa(e,0):Ju|=a),Oe(e,t)}function qf(e,t){t===0&&((e.mode&1)===0?t=1:(t=kl,kl<<=1,(kl&130023424)===0&&(kl=4194304)));var a=Ae();e=At(e,t),e!==null&&(Sr(e,t,a),Oe(e,a))}function rx(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),qf(e,a)}function lx(e,t){var a=0;switch(e.tag){case 13:var o=e.stateNode,r=e.memoizedState;r!==null&&(a=r.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(w(314))}o!==null&&o.delete(t),qf(e,a)}var _f;_f=function(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps||He.current)Re=!0;else{if((e.lanes&a)===0&&(t.flags&128)===0)return Re=!1,Kg(e,t,a);Re=(e.flags&131072)!==0}else Re=!1,ne&&(t.flags&1048576)!==0&&$c(t,on,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Ul(e,t),e=t.pendingProps;var r=po(t,Be.current);io(t,a),r=$u(null,t,o,e,r,a);var l=ju();return t.flags|=1,typeof r==\"object\"&&r!==null&&typeof r.render==\"function\"&&r.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Ge(o)?(l=!0,tn(t)):l=!1,t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Wu(t),r.updater=Cn,t.stateNode=r,r._reactInternals=t,ru(t,o,e,a),t=su(null,t,o,!0,l,a)):(t.tag=0,ne&&l&&Mu(t),Te(null,t,r,a),t=t.child),t;case 16:o=t.elementType;e:{switch(Ul(e,t),e=t.pendingProps,r=o._init,o=r(o._payload),t.type=o,r=t.tag=sx(o),e=ot(o,e),r){case 0:t=nu(null,t,o,e,a);break e;case 1:t=Gd(null,t,o,e,a);break e;case 11:t=Rd(null,t,o,e,a);break e;case 14:t=Hd(null,t,o,ot(o.type,e),a);break e}throw Error(w(306,o,\"\"))}return t;case 0:return o=t.type,r=t.pendingProps,r=t.elementType===o?r:ot(o,r),nu(e,t,o,r,a);case 1:return o=t.type,r=t.pendingProps,r=t.elementType===o?r:ot(o,r),Gd(e,t,o,r,a);case 3:e:{if(bf(t),e===null)throw Error(w(387));o=t.pendingProps,l=t.memoizedState,r=l.element,Jc(e,t),nn(t,o,null,a);var s=t.memoizedState;if(o=s.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){r=ho(Error(w(423)),t),t=Od(e,t,o,a,r);break e}else if(o!==r){r=ho(Error(w(424)),t),t=Od(e,t,o,a,r);break e}else for(Ue=Jt(t.stateNode.containerInfo.firstChild),We=t,ne=!0,lt=null,a=Zc(t,null,o,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(mo(),o===r){t=Pt(e,t,a);break e}Te(e,t,o,a)}t=t.child}return t;case 5:return ef(t),e===null&&tu(t),o=t.type,r=t.pendingProps,l=e!==null?e.memoizedProps:null,s=r.children,Qs(o,r)?s=null:l!==null&&Qs(o,l)&&(t.flags|=32),wf(e,t),Te(e,t,s,a),t.child;case 6:return e===null&&tu(t),null;case 13:return Bf(e,t,a);case 4:return qu(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=go(t,null,o,a):Te(e,t,o,a),t.child;case 11:return o=t.type,r=t.pendingProps,r=t.elementType===o?r:ot(o,r),Rd(e,t,o,r,a);case 7:return Te(e,t,t.pendingProps,a),t.child;case 8:return Te(e,t,t.pendingProps.children,a),t.child;case 12:return Te(e,t,t.pendingProps.children,a),t.child;case 10:e:{if(o=t.type._context,r=t.pendingProps,l=t.memoizedProps,s=r.value,ae(rn,o._currentValue),o._currentValue=s,l!==null)if(ut(l.value,s)){if(l.children===r.children&&!He.current){t=Pt(e,t,a);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var u=l.dependencies;if(u!==null){s=l.child;for(var i=u.firstContext;i!==null;){if(i.context===o){if(l.tag===1){i=Et(-1,a&-a),i.tag=2;var d=l.updateQueue;if(d!==null){d=d.shared;var p=d.pending;p===null?i.next=i:(i.next=p.next,p.next=i),d.pending=i}}l.lanes|=a,i=l.alternate,i!==null&&(i.lanes|=a),au(l.return,a,t),u.lanes|=a;break}i=i.next}}else if(l.tag===10)s=l.type===t.type?null:l.child;else if(l.tag===18){if(s=l.return,s===null)throw Error(w(341));s.lanes|=a,u=s.alternate,u!==null&&(u.lanes|=a),au(s,a,t),s=l.sibling}else s=l.child;if(s!==null)s.return=l;else for(s=l;s!==null;){if(s===t){s=null;break}if(l=s.sibling,l!==null){l.return=s.return,s=l;break}s=s.return}l=s}Te(e,t,r.children,a),t=t.child}return t;case 9:return r=t.type,o=t.pendingProps.children,io(t,a),r=Ye(r),o=o(r),t.flags|=1,Te(e,t,o,a),t.child;case 14:return o=t.type,r=ot(o,t.pendingProps),r=ot(o.type,r),Hd(e,t,o,r,a);case 15:return If(e,t,t.type,t.pendingProps,a);case 17:return o=t.type,r=t.pendingProps,r=t.elementType===o?r:ot(o,r),Ul(e,t),t.tag=1,Ge(o)?(e=!0,tn(t)):e=!1,io(t,a),vf(t,o,r),ru(t,o,r,a),su(null,t,o,!0,e,a);case 19:return Ef(e,t,a);case 22:return Ff(e,t,a)}throw Error(w(156,t.tag))};function Vf(e,t){return hc(e,t)}function nx(e,t,a,o){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Qe(e,t,a,o){return new nx(e,t,a,o)}function ri(e){return e=e.prototype,!(!e||!e.isReactComponent)}function sx(e){if(typeof e==\"function\")return ri(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Cu)return 11;if(e===Iu)return 14}return 2}function oa(e,t){var a=e.alternate;return a===null?(a=Qe(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&14680064,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a}function _l(e,t,a,o,r,l){var s=2;if(o=e,typeof e==\"function\")ri(e)&&(s=1);else if(typeof e==\"string\")s=5;else e:switch(e){case ja:return ba(a.children,r,l,t);case Su:s=8,r|=8;break;case Bs:return e=Qe(12,a,t,r|2),e.elementType=Bs,e.lanes=l,e;case Es:return e=Qe(13,a,t,r),e.elementType=Es,e.lanes=l,e;case Ds:return e=Qe(19,a,t,r),e.elementType=Ds,e.lanes=l,e;case ec:return wn(a,r,l,t);default:if(typeof e==\"object\"&&e!==null)switch(e.$$typeof){case Yd:s=10;break e;case Jd:s=9;break e;case Cu:s=11;break e;case Iu:s=14;break e;case _t:s=16,o=null;break e}throw Error(w(130,e==null?e:typeof e,\"\"))}return t=Qe(s,a,t,r),t.elementType=e,t.type=o,t.lanes=l,t}function ba(e,t,a,o){return e=Qe(7,e,o,t),e.lanes=a,e}function wn(e,t,a,o){return e=Qe(22,e,o,t),e.elementType=ec,e.lanes=a,e.stateNode={isHidden:!1},e}function Fs(e,t,a){return e=Qe(6,e,null,t),e.lanes=a,e}function ws(e,t,a){return t=Qe(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function ux(e,t,a,o,r){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=is(0),this.expirationTimes=is(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=is(0),this.identifierPrefix=o,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function li(e,t,a,o,r,l,s,u,i){return e=new ux(e,t,a,u,i),t===1?(t=1,l===!0&&(t|=8)):t=0,l=Qe(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:o,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},Wu(l),e}function ix(e,t,a){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:$a,key:o==null?null:\"\"+o,children:e,containerInfo:t,implementation:a}}function Kf(e){if(!e)return la;e=e._reactInternals;e:{if(Na(e)!==e||e.tag!==1)throw Error(w(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Ge(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(w(171))}if(e.tag===1){var a=e.type;if(Ge(a))return Vc(e,a,t)}return t}function $f(e,t,a,o,r,l,s,u,i){return e=li(a,o,!0,e,r,l,s,u,i),e.context=Kf(null),a=e.current,o=Ae(),r=aa(a),l=Et(o,r),l.callback=t!=null?t:null,ea(a,l,r),e.current.lanes=r,Sr(e,r,o),Oe(e,o),e}function bn(e,t,a,o){var r=t.current,l=Ae(),s=aa(r);return a=Kf(a),t.context===null?t.context=a:t.pendingContext=a,t=Et(l,s),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=ea(r,t,s),e!==null&&(st(e,r,s,l),Gl(e,r,s)),s}function gn(e){return e=e.current,e.child?(e.child.tag===5,e.child.stateNode):null}function Xd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function ni(e,t){Xd(e,t),(e=e.alternate)&&Xd(e,t)}function dx(){return null}var jf=typeof reportError==\"function\"?reportError:function(e){console.error(e)};function si(e){this._internalRoot=e}Bn.prototype.render=si.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(w(409));bn(e,t,null,null)};Bn.prototype.unmount=si.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Aa(function(){bn(null,e,null,null)}),t[Tt]=null}};function Bn(e){this._internalRoot=e}Bn.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ic();e={blockedOn:null,target:e,priority:t};for(var a=0;a<Kt.length&&t!==0&&t<Kt[a].priority;a++);Kt.splice(a,0,e),a===0&&wc(e)}};function ui(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function En(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==\" react-mount-point-unstable \"))}function Qd(){}function cx(e,t,a,o,r){if(r){if(typeof o==\"function\"){var l=o;o=function(){var d=gn(s);l.call(d)}}var s=$f(t,o,e,0,null,!1,!1,\"\",Qd);return e._reactRootContainer=s,e[Tt]=s.current,pr(e.nodeType===8?e.parentNode:e),Aa(),s}for(;r=e.lastChild;)e.removeChild(r);if(typeof o==\"function\"){var u=o;o=function(){var d=gn(i);u.call(d)}}var i=li(e,0,!1,null,null,!1,!1,\"\",Qd);return e._reactRootContainer=i,e[Tt]=i.current,pr(e.nodeType===8?e.parentNode:e),Aa(function(){bn(t,i,a,o)}),i}function Dn(e,t,a,o,r){var l=a._reactRootContainer;if(l){var s=l;if(typeof r==\"function\"){var u=r;r=function(){var i=gn(s);u.call(i)}}bn(t,s,e,r)}else s=cx(a,t,e,r,o);return gn(s)}Sc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var a=jo(t.pendingLanes);a!==0&&(bu(t,a|1),Oe(t,pe()),(W&6)===0&&(yo=pe()+500,ua()))}break;case 13:Aa(function(){var o=At(e,1);if(o!==null){var r=Ae();st(o,e,1,r)}}),ni(e,1)}};Bu=function(e){if(e.tag===13){var t=At(e,134217728);if(t!==null){var a=Ae();st(t,e,134217728,a)}ni(e,134217728)}};Cc=function(e){if(e.tag===13){var t=aa(e),a=At(e,t);if(a!==null){var o=Ae();st(a,e,t,o)}ni(e,t)}};Ic=function(){return X};Fc=function(e,t){var a=X;try{return X=e,t()}finally{X=a}};zs=function(e,t,a){switch(t){case\"input\":if(Ps(e,a),t=a.name,a.type===\"radio\"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll(\"input[name=\"+JSON.stringify(\"\"+t)+'][type=\"radio\"]'),t=0;t<a.length;t++){var o=a[t];if(o!==e&&o.form===e.form){var r=kn(o);if(!r)throw Error(w(90));ac(o),Ps(o,r)}}}break;case\"textarea\":rc(e,a);break;case\"select\":t=a.value,t!=null&&lo(e,!!a.multiple,t,!1)}};cc=ti;fc=Aa;var fx={usingClientEntryPoint:!1,Events:[Ir,Ya,kn,ic,dc,ti]},_o={findFiberByHostInstance:Ca,bundleType:0,version:\"18.3.1\",rendererPackageName:\"react-dom\"},px={bundleType:_o.bundleType,version:_o.version,rendererPackageName:_o.rendererPackageName,rendererConfig:_o.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Nt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=gc(e),e===null?null:e.stateNode},findFiberByHostInstance:_o.findFiberByHostInstance||dx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:\"18.3.1-next-f1338f8080-20240426\"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__!=\"undefined\"&&(Vo=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Vo.isDisabled&&Vo.supportsFiber))try{xn=Vo.inject(px),Lt=Vo}catch(e){}var Vo;Ve.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=fx;Ve.createPortal=function(e,t){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ui(t))throw Error(w(200));return ix(e,t,null,a)};Ve.createRoot=function(e,t){if(!ui(e))throw Error(w(299));var a=!1,o=\"\",r=jf;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=li(e,1,!1,null,null,a,!1,o,r),e[Tt]=t.current,pr(e.nodeType===8?e.parentNode:e),new si(t)};Ve.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render==\"function\"?Error(w(188)):(e=Object.keys(e).join(\",\"),Error(w(268,e)));return e=gc(t),e=e===null?null:e.stateNode,e};Ve.flushSync=function(e){return Aa(e)};Ve.hydrate=function(e,t,a){if(!En(t))throw Error(w(200));return Dn(null,e,t,!0,a)};Ve.hydrateRoot=function(e,t,a){if(!ui(e))throw Error(w(405));var o=a!=null&&a.hydratedSources||null,r=!1,l=\"\",s=jf;if(a!=null&&(a.unstable_strictMode===!0&&(r=!0),a.identifierPrefix!==void 0&&(l=a.identifierPrefix),a.onRecoverableError!==void 0&&(s=a.onRecoverableError)),t=$f(t,null,e,1,a!=null?a:null,r,!1,l,s),e[Tt]=t.current,pr(e),o)for(e=0;e<o.length;e++)a=o[e],r=a._getVersion,r=r(a._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[a,r]:t.mutableSourceEagerHydrationData.push(a,r);return new Bn(t)};Ve.render=function(e,t,a){if(!En(t))throw Error(w(200));return Dn(null,e,t,!1,a)};Ve.unmountComponentAtNode=function(e){if(!En(e))throw Error(w(40));return e._reactRootContainer?(Aa(function(){Dn(null,null,e,!1,function(){e._reactRootContainer=null,e[Tt]=null})}),!0):!1};Ve.unstable_batchedUpdates=ti;Ve.unstable_renderSubtreeIntoContainer=function(e,t,a,o){if(!En(a))throw Error(w(200));if(e==null||e._reactInternals===void 0)throw Error(w(38));return Dn(e,t,a,!1,o)};Ve.version=\"18.3.1-next-f1338f8080-20240426\"});var Yf=It((i1,Zf)=>{\"use strict\";function Qf(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__==\"undefined\"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=\"function\"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Qf)}catch(e){console.error(e)}}Qf(),Zf.exports=Xf()});var ep=It(ii=>{\"use strict\";var Jf=Yf();ii.createRoot=Jf.createRoot,ii.hydrateRoot=Jf.hydrateRoot;var d1});var lp=It(Pn=>{\"use strict\";var mx=_a(),gx=Symbol.for(\"react.element\"),xx=Symbol.for(\"react.fragment\"),hx=Object.prototype.hasOwnProperty,yx=mx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Lx={key:!0,ref:!0,__self:!0,__source:!0};function rp(e,t,a){var o,r={},l=null,s=null;a!==void 0&&(l=\"\"+a),t.key!==void 0&&(l=\"\"+t.key),t.ref!==void 0&&(s=t.ref);for(o in t)hx.call(t,o)&&!Lx.hasOwnProperty(o)&&(r[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps,t)r[o]===void 0&&(r[o]=t[o]);return{$$typeof:gx,type:e,key:l,ref:s,props:r,_owner:yx.current}}Pn.Fragment=xx;Pn.jsx=rp;Pn.jsxs=rp});var ol=It((tL,np)=>{\"use strict\";np.exports=lp()});var zp=Ut(ep(),1);var D=Ut(_a(),1);var An=Ut(_a());var tp=e=>e.replace(/([a-z0-9])([A-Z])/g,\"$1-$2\").toLowerCase(),Tn=(...e)=>e.filter((t,a,o)=>!!t&&o.indexOf(t)===a).join(\" \");var wr=Ut(_a());var ap={xmlns:\"http://www.w3.org/2000/svg\",width:24,height:24,viewBox:\"0 0 24 24\",fill:\"none\",stroke:\"currentColor\",strokeWidth:2,strokeLinecap:\"round\",strokeLinejoin:\"round\"};var op=(0,wr.forwardRef)(({color:e=\"currentColor\",size:t=24,strokeWidth:a=2,absoluteStrokeWidth:o,className:r=\"\",children:l,iconNode:s,...u},i)=>(0,wr.createElement)(\"svg\",{ref:i,...ap,width:t,height:t,stroke:e,strokeWidth:o?Number(a)*24/Number(t):a,className:Tn(\"lucide\",r),...u},[...s.map(([d,p])=>(0,wr.createElement)(d,p)),...Array.isArray(l)?l:[l]]));var S=(e,t)=>{let a=(0,An.forwardRef)(({className:o,...r},l)=>(0,An.createElement)(op,{ref:l,iconNode:t,className:Tn(`lucide-${tp(e)}`,o),...r}));return a.displayName=`${e}`,a};var vo=S(\"ArrowDown\",[[\"path\",{d:\"M12 5v14\",key:\"s699le\"}],[\"path\",{d:\"m19 12-7 7-7-7\",key:\"1idqje\"}]]);var So=S(\"ArrowLeftRight\",[[\"path\",{d:\"M8 3 4 7l4 4\",key:\"9rb6wj\"}],[\"path\",{d:\"M4 7h16\",key:\"6tx8e3\"}],[\"path\",{d:\"m16 21 4-4-4-4\",key:\"siv7j2\"}],[\"path\",{d:\"M20 17H4\",key:\"h6l3hr\"}]]);var ia=S(\"ArrowLeft\",[[\"path\",{d:\"m12 19-7-7 7-7\",key:\"1l729n\"}],[\"path\",{d:\"M19 12H5\",key:\"x3x0zl\"}]]);var da=S(\"ArrowRight\",[[\"path\",{d:\"M5 12h14\",key:\"1ays0h\"}],[\"path\",{d:\"m12 5 7 7-7 7\",key:\"xquz4c\"}]]);var Co=S(\"ArrowUp\",[[\"path\",{d:\"m5 12 7-7 7 7\",key:\"hav0vg\"}],[\"path\",{d:\"M12 19V5\",key:\"x0mq9r\"}]]);var br=S(\"Blocks\",[[\"rect\",{width:\"7\",height:\"7\",x:\"14\",y:\"3\",rx:\"1\",key:\"6d4xhi\"}],[\"path\",{d:\"M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3\",key:\"1fpvtg\"}]]);var Br=S(\"BookCopy\",[[\"path\",{d:\"M2 16V4a2 2 0 0 1 2-2h11\",key:\"spzkk5\"}],[\"path\",{d:\"M5 14H4a2 2 0 1 0 0 4h1\",key:\"16gqf9\"}],[\"path\",{d:\"M22 18H11a2 2 0 1 0 0 4h11V6H11a2 2 0 0 0-2 2v12\",key:\"1owzki\"}]]);var Er=S(\"BookOpen\",[[\"path\",{d:\"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z\",key:\"vv98re\"}],[\"path\",{d:\"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z\",key:\"1cyq3y\"}]]);var Mt=S(\"CalendarDays\",[[\"path\",{d:\"M8 2v4\",key:\"1cmpym\"}],[\"path\",{d:\"M16 2v4\",key:\"4m81vk\"}],[\"rect\",{width:\"18\",height:\"18\",x:\"3\",y:\"4\",rx:\"2\",key:\"1hopcy\"}],[\"path\",{d:\"M3 10h18\",key:\"8toen8\"}],[\"path\",{d:\"M8 14h.01\",key:\"6423bh\"}],[\"path\",{d:\"M12 14h.01\",key:\"1etili\"}],[\"path\",{d:\"M16 14h.01\",key:\"1gbofw\"}],[\"path\",{d:\"M8 18h.01\",key:\"lrp35t\"}],[\"path\",{d:\"M12 18h.01\",key:\"mhygvu\"}],[\"path\",{d:\"M16 18h.01\",key:\"kzsmim\"}]]);var it=S(\"Check\",[[\"path\",{d:\"M20 6 9 17l-5-5\",key:\"1gmf2c\"}]]);var Ma=S(\"ChevronLeft\",[[\"path\",{d:\"m15 18-6-6 6-6\",key:\"1wnfg3\"}]]);var ca=S(\"ChevronRight\",[[\"path\",{d:\"m9 18 6-6-6-6\",key:\"mthhwq\"}]]);var fa=S(\"CircleAlert\",[[\"circle\",{cx:\"12\",cy:\"12\",r:\"10\",key:\"1mglay\"}],[\"line\",{x1:\"12\",x2:\"12\",y1:\"8\",y2:\"12\",key:\"1pkeuh\"}],[\"line\",{x1:\"12\",x2:\"12.01\",y1:\"16\",y2:\"16\",key:\"4dfq90\"}]]);var Dr=S(\"CircleDot\",[[\"circle\",{cx:\"12\",cy:\"12\",r:\"10\",key:\"1mglay\"}],[\"circle\",{cx:\"12\",cy:\"12\",r:\"1\",key:\"41hilf\"}]]);var pa=S(\"CodeXml\",[[\"path\",{d:\"m18 16 4-4-4-4\",key:\"1inbqp\"}],[\"path\",{d:\"m6 8-4 4 4 4\",key:\"15zrgr\"}],[\"path\",{d:\"m14.5 4-5 16\",key:\"e7oirm\"}]]);var Rt=S(\"Columns3\",[[\"rect\",{width:\"18\",height:\"18\",x:\"3\",y:\"3\",rx:\"2\",key:\"afitv7\"}],[\"path\",{d:\"M9 3v18\",key:\"fh3hqa\"}],[\"path\",{d:\"M15 3v18\",key:\"14nvp0\"}]]);var Tr=S(\"CornerDownLeft\",[[\"polyline\",{points:\"9 10 4 15 9 20\",key:\"r3jprv\"}],[\"path\",{d:\"M20 4v7a4 4 0 0 1-4 4H4\",key:\"6o5b7l\"}]]);var ma=S(\"FileDown\",[[\"path\",{d:\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\",key:\"1rqfz7\"}],[\"path\",{d:\"M14 2v4a2 2 0 0 0 2 2h4\",key:\"tnqrlb\"}],[\"path\",{d:\"M12 18v-6\",key:\"17g6i2\"}],[\"path\",{d:\"m9 15 3 3 3-3\",key:\"1npd3o\"}]]);var Ar=S(\"FileUp\",[[\"path\",{d:\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\",key:\"1rqfz7\"}],[\"path\",{d:\"M14 2v4a2 2 0 0 0 2 2h4\",key:\"tnqrlb\"}],[\"path\",{d:\"M12 12v6\",key:\"3ahymv\"}],[\"path\",{d:\"m15 15-3-3-3 3\",key:\"15xj92\"}]]);var Io=S(\"Flame\",[[\"path\",{d:\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\",key:\"96xj49\"}]]);var Fo=S(\"FolderOpen\",[[\"path\",{d:\"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\",key:\"usdka0\"}]]);var Pr=S(\"FolderPlus\",[[\"path\",{d:\"M12 10v6\",key:\"1bos4e\"}],[\"path\",{d:\"M9 13h6\",key:\"1uhe8q\"}],[\"path\",{d:\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\",key:\"1kt360\"}]]);var Ht=S(\"GitBranch\",[[\"line\",{x1:\"6\",x2:\"6\",y1:\"3\",y2:\"15\",key:\"17qcm7\"}],[\"circle\",{cx:\"18\",cy:\"6\",r:\"3\",key:\"1h7g24\"}],[\"circle\",{cx:\"6\",cy:\"18\",r:\"3\",key:\"fqmcym\"}],[\"path\",{d:\"M18 9a9 9 0 0 1-9 9\",key:\"n2h4wq\"}]]);var dt=S(\"Grid3x3\",[[\"rect\",{width:\"18\",height:\"18\",x:\"3\",y:\"3\",rx:\"2\",key:\"afitv7\"}],[\"path\",{d:\"M3 9h18\",key:\"1pudct\"}],[\"path\",{d:\"M3 15h18\",key:\"5xshup\"}],[\"path\",{d:\"M9 3v18\",key:\"fh3hqa\"}],[\"path\",{d:\"M15 3v18\",key:\"14nvp0\"}]]);var Nr=S(\"Hash\",[[\"line\",{x1:\"4\",x2:\"20\",y1:\"9\",y2:\"9\",key:\"4lhtct\"}],[\"line\",{x1:\"4\",x2:\"20\",y1:\"15\",y2:\"15\",key:\"vyu0kd\"}],[\"line\",{x1:\"10\",x2:\"8\",y1:\"3\",y2:\"21\",key:\"1ggp8o\"}],[\"line\",{x1:\"16\",x2:\"14\",y1:\"3\",y2:\"21\",key:\"weycgp\"}]]);var Mr=S(\"Heading2\",[[\"path\",{d:\"M4 12h8\",key:\"17cfdx\"}],[\"path\",{d:\"M4 18V6\",key:\"1rz3zl\"}],[\"path\",{d:\"M12 18V6\",key:\"zqpxq5\"}],[\"path\",{d:\"M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1\",key:\"9jr5yi\"}]]);var wo=S(\"ImagePlus\",[[\"path\",{d:\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7\",key:\"31hg93\"}],[\"line\",{x1:\"16\",x2:\"22\",y1:\"5\",y2:\"5\",key:\"ez7e4s\"}],[\"line\",{x1:\"19\",x2:\"19\",y1:\"2\",y2:\"8\",key:\"1gkr8c\"}],[\"circle\",{cx:\"9\",cy:\"9\",r:\"2\",key:\"af1f0g\"}],[\"path\",{d:\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\",key:\"1xmnt7\"}]]);var Rr=S(\"Languages\",[[\"path\",{d:\"m5 8 6 6\",key:\"1wu5hv\"}],[\"path\",{d:\"m4 14 6-6 2-3\",key:\"1k1g8d\"}],[\"path\",{d:\"M2 5h12\",key:\"or177f\"}],[\"path\",{d:\"M7 2h1\",key:\"1t2jsx\"}],[\"path\",{d:\"m22 22-5-10-5 10\",key:\"don7ne\"}],[\"path\",{d:\"M14 18h6\",key:\"1m8k6r\"}]]);var Hr=S(\"Layers\",[[\"path\",{d:\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\",key:\"8b97xw\"}],[\"path\",{d:\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\",key:\"dd6zsq\"}],[\"path\",{d:\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\",key:\"ep9fru\"}]]);var Gr=S(\"LayoutGrid\",[[\"rect\",{width:\"7\",height:\"7\",x:\"3\",y:\"3\",rx:\"1\",key:\"1g98yp\"}],[\"rect\",{width:\"7\",height:\"7\",x:\"14\",y:\"3\",rx:\"1\",key:\"6d4xhi\"}],[\"rect\",{width:\"7\",height:\"7\",x:\"14\",y:\"14\",rx:\"1\",key:\"nxv5o0\"}],[\"rect\",{width:\"7\",height:\"7\",x:\"3\",y:\"14\",rx:\"1\",key:\"1bb6yr\"}]]);var Or=S(\"LayoutList\",[[\"rect\",{width:\"7\",height:\"7\",x:\"3\",y:\"3\",rx:\"1\",key:\"1g98yp\"}],[\"rect\",{width:\"7\",height:\"7\",x:\"3\",y:\"14\",rx:\"1\",key:\"1bb6yr\"}],[\"path\",{d:\"M14 4h7\",key:\"3xa0d5\"}],[\"path\",{d:\"M14 9h7\",key:\"1icrd9\"}],[\"path\",{d:\"M14 15h7\",key:\"1mj8o2\"}],[\"path\",{d:\"M14 20h7\",key:\"11slyb\"}]]);var Ra=S(\"Library\",[[\"path\",{d:\"m16 6 4 14\",key:\"ji33uf\"}],[\"path\",{d:\"M12 6v14\",key:\"1n7gus\"}],[\"path\",{d:\"M8 8v12\",key:\"1gg7y9\"}],[\"path\",{d:\"M4 4v16\",key:\"6qkkli\"}]]);var zr=S(\"ListChecks\",[[\"path\",{d:\"m3 17 2 2 4-4\",key:\"1jhpwq\"}],[\"path\",{d:\"m3 7 2 2 4-4\",key:\"1obspn\"}],[\"path\",{d:\"M13 6h8\",key:\"15sg57\"}],[\"path\",{d:\"M13 12h8\",key:\"h98zly\"}],[\"path\",{d:\"M13 18h8\",key:\"oe0vm4\"}]]);var Ur=S(\"ListFilter\",[[\"path\",{d:\"M3 6h18\",key:\"d0wm0j\"}],[\"path\",{d:\"M7 12h10\",key:\"b7w52i\"}],[\"path\",{d:\"M10 18h4\",key:\"1ulq68\"}]]);var Wr=S(\"ListOrdered\",[[\"line\",{x1:\"10\",x2:\"21\",y1:\"6\",y2:\"6\",key:\"76qw6h\"}],[\"line\",{x1:\"10\",x2:\"21\",y1:\"12\",y2:\"12\",key:\"16nom4\"}],[\"line\",{x1:\"10\",x2:\"21\",y1:\"18\",y2:\"18\",key:\"u3jurt\"}],[\"path\",{d:\"M4 6h1v4\",key:\"cnovpq\"}],[\"path\",{d:\"M4 10h2\",key:\"16xx2s\"}],[\"path\",{d:\"M6 18H4c0-1 2-2 2-3s-1-1.5-2-1\",key:\"m9a95d\"}]]);var qr=S(\"Maximize2\",[[\"polyline\",{points:\"15 3 21 3 21 9\",key:\"mznyad\"}],[\"polyline\",{points:\"9 21 3 21 3 15\",key:\"1avn1i\"}],[\"line\",{x1:\"21\",x2:\"14\",y1:\"3\",y2:\"10\",key:\"ota7mn\"}],[\"line\",{x1:\"3\",x2:\"10\",y1:\"21\",y2:\"14\",key:\"1atl0r\"}]]);var _r=S(\"Minus\",[[\"path\",{d:\"M5 12h14\",key:\"1ays0h\"}]]);var Vr=S(\"Moon\",[[\"path\",{d:\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\",key:\"a7tn18\"}]]);var Kr=S(\"Palette\",[[\"circle\",{cx:\"13.5\",cy:\"6.5\",r:\".5\",fill:\"currentColor\",key:\"1okk4w\"}],[\"circle\",{cx:\"17.5\",cy:\"10.5\",r:\".5\",fill:\"currentColor\",key:\"f64h9f\"}],[\"circle\",{cx:\"8.5\",cy:\"7.5\",r:\".5\",fill:\"currentColor\",key:\"fotxhn\"}],[\"circle\",{cx:\"6.5\",cy:\"12.5\",r:\".5\",fill:\"currentColor\",key:\"qy21gx\"}],[\"path\",{d:\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z\",key:\"12rzf8\"}]]);var ga=S(\"PenLine\",[[\"path\",{d:\"M12 20h9\",key:\"t2du7b\"}],[\"path\",{d:\"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z\",key:\"ymcmye\"}]]);var bo=S(\"Pencil\",[[\"path\",{d:\"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z\",key:\"5qss01\"}],[\"path\",{d:\"m15 5 4 4\",key:\"1mk7zo\"}]]);var $r=S(\"Plus\",[[\"path\",{d:\"M5 12h14\",key:\"1ays0h\"}],[\"path\",{d:\"M12 5v14\",key:\"s699le\"}]]);var Bo=S(\"RotateCcw\",[[\"path\",{d:\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\",key:\"1357e3\"}],[\"path\",{d:\"M3 3v5h5\",key:\"1xhq8a\"}]]);var vt=S(\"Rows3\",[[\"rect\",{width:\"18\",height:\"18\",x:\"3\",y:\"3\",rx:\"2\",key:\"afitv7\"}],[\"path\",{d:\"M21 9H3\",key:\"1338ky\"}],[\"path\",{d:\"M21 15H3\",key:\"9uk58r\"}]]);var Ha=S(\"Settings\",[[\"path\",{d:\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\",key:\"1qme2f\"}],[\"circle\",{cx:\"12\",cy:\"12\",r:\"3\",key:\"1v7zrd\"}]]);var jr=S(\"SlidersHorizontal\",[[\"line\",{x1:\"21\",x2:\"14\",y1:\"4\",y2:\"4\",key:\"obuewd\"}],[\"line\",{x1:\"10\",x2:\"3\",y1:\"4\",y2:\"4\",key:\"1q6298\"}],[\"line\",{x1:\"21\",x2:\"12\",y1:\"12\",y2:\"12\",key:\"1iu8h1\"}],[\"line\",{x1:\"8\",x2:\"3\",y1:\"12\",y2:\"12\",key:\"ntss68\"}],[\"line\",{x1:\"21\",x2:\"16\",y1:\"20\",y2:\"20\",key:\"14d8ph\"}],[\"line\",{x1:\"12\",x2:\"3\",y1:\"20\",y2:\"20\",key:\"m0wm8r\"}],[\"line\",{x1:\"14\",x2:\"14\",y1:\"2\",y2:\"6\",key:\"14e1ph\"}],[\"line\",{x1:\"8\",x2:\"8\",y1:\"10\",y2:\"14\",key:\"1i6ji0\"}],[\"line\",{x1:\"16\",x2:\"16\",y1:\"18\",y2:\"22\",key:\"1lctlv\"}]]);var xa=S(\"Sparkles\",[[\"path\",{d:\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\",key:\"4pj2yx\"}],[\"path\",{d:\"M20 3v4\",key:\"1olli1\"}],[\"path\",{d:\"M22 5h-4\",key:\"1gvqau\"}],[\"path\",{d:\"M4 17v2\",key:\"vumght\"}],[\"path\",{d:\"M5 18H3\",key:\"zchphs\"}]]);var Gt=S(\"SquareCheckBig\",[[\"path\",{d:\"m9 11 3 3L22 4\",key:\"1pflzl\"}],[\"path\",{d:\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\",key:\"1jnkn4\"}]]);var Eo=S(\"Star\",[[\"polygon\",{points:\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\",key:\"8f66p6\"}]]);var Xr=S(\"StickyNote\",[[\"path\",{d:\"M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z\",key:\"qazsjp\"}],[\"path\",{d:\"M15 3v4a2 2 0 0 0 2 2h4\",key:\"40519r\"}]]);var Do=S(\"Sun\",[[\"circle\",{cx:\"12\",cy:\"12\",r:\"4\",key:\"4exip2\"}],[\"path\",{d:\"M12 2v2\",key:\"tus03m\"}],[\"path\",{d:\"M12 20v2\",key:\"1lh1kg\"}],[\"path\",{d:\"m4.93 4.93 1.41 1.41\",key:\"149t6j\"}],[\"path\",{d:\"m17.66 17.66 1.41 1.41\",key:\"ptbguv\"}],[\"path\",{d:\"M2 12h2\",key:\"1t8f8n\"}],[\"path\",{d:\"M20 12h2\",key:\"1q8mjw\"}],[\"path\",{d:\"m6.34 17.66-1.41 1.41\",key:\"1m8zz5\"}],[\"path\",{d:\"m19.07 4.93-1.41 1.41\",key:\"1shlcs\"}]]);var Qr=S(\"Tag\",[[\"path\",{d:\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\",key:\"vktsd0\"}],[\"circle\",{cx:\"7.5\",cy:\"7.5\",r:\".5\",fill:\"currentColor\",key:\"kqv944\"}]]);var Ga=S(\"Target\",[[\"circle\",{cx:\"12\",cy:\"12\",r:\"10\",key:\"1mglay\"}],[\"circle\",{cx:\"12\",cy:\"12\",r:\"6\",key:\"1vlfrh\"}],[\"circle\",{cx:\"12\",cy:\"12\",r:\"2\",key:\"1c9p78\"}]]);var Zr=S(\"TextCursorInput\",[[\"path\",{d:\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\",key:\"18xjzo\"}],[\"path\",{d:\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\",key:\"fj48gi\"}],[\"path\",{d:\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\",key:\"1n9rhb\"}],[\"path\",{d:\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\",key:\"13ksps\"}],[\"path\",{d:\"M9 7v10\",key:\"1vc8ob\"}]]);var Yr=S(\"ToggleLeft\",[[\"rect\",{width:\"20\",height:\"12\",x:\"2\",y:\"6\",rx:\"6\",ry:\"6\",key:\"f2vt7d\"}],[\"circle\",{cx:\"8\",cy:\"12\",r:\"2\",key:\"1nvbw3\"}]]);var Ot=S(\"Trash2\",[[\"path\",{d:\"M3 6h18\",key:\"d0wm0j\"}],[\"path\",{d:\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\",key:\"4alrt4\"}],[\"path\",{d:\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\",key:\"v07s0e\"}],[\"line\",{x1:\"10\",x2:\"10\",y1:\"11\",y2:\"17\",key:\"1uufr5\"}],[\"line\",{x1:\"14\",x2:\"14\",y1:\"11\",y2:\"17\",key:\"xtxkd\"}]]);var Jr=S(\"TrendingDown\",[[\"polyline\",{points:\"22 17 13.5 8.5 8.5 13.5 2 7\",key:\"1r2t7k\"}],[\"polyline\",{points:\"16 17 22 17 22 11\",key:\"11uiuu\"}]]);var To=S(\"TrendingUp\",[[\"polyline\",{points:\"22 7 13.5 15.5 8.5 10.5 2 17\",key:\"126l90\"}],[\"polyline\",{points:\"16 7 22 7 22 13\",key:\"kwv8wd\"}]]);var ha=S(\"TriangleAlert\",[[\"path\",{d:\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\",key:\"wmoenq\"}],[\"path\",{d:\"M12 9v4\",key:\"juzpu7\"}],[\"path\",{d:\"M12 17h.01\",key:\"p32p05\"}]]);var Ao=S(\"Trophy\",[[\"path\",{d:\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6\",key:\"17hqa7\"}],[\"path\",{d:\"M18 9h1.5a2.5 2.5 0 0 0 0-5H18\",key:\"lmptdp\"}],[\"path\",{d:\"M4 22h16\",key:\"57wxv0\"}],[\"path\",{d:\"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\",key:\"1nw9bq\"}],[\"path\",{d:\"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\",key:\"1np0yb\"}],[\"path\",{d:\"M18 2H6v7a6 6 0 0 0 12 0V2Z\",key:\"u46fv3\"}]]);var el=S(\"Type\",[[\"polyline\",{points:\"4 7 4 4 20 4 20 7\",key:\"1nosan\"}],[\"line\",{x1:\"9\",x2:\"15\",y1:\"20\",y2:\"20\",key:\"swin9y\"}],[\"line\",{x1:\"12\",x2:\"12\",y1:\"4\",y2:\"20\",key:\"1tx1rr\"}]]);var ya=S(\"WandSparkles\",[[\"path\",{d:\"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72\",key:\"ul74o6\"}],[\"path\",{d:\"m14 7 3 3\",key:\"1r5n42\"}],[\"path\",{d:\"M5 6v4\",key:\"ilb8ba\"}],[\"path\",{d:\"M19 14v4\",key:\"blhpug\"}],[\"path\",{d:\"M10 2v2\",key:\"7u0qdc\"}],[\"path\",{d:\"M7 8H3\",key:\"zfb6yr\"}],[\"path\",{d:\"M21 16h-4\",key:\"1cnmox\"}],[\"path\",{d:\"M11 3H9\",key:\"1obp7u\"}]]);var ct=S(\"X\",[[\"path\",{d:\"M18 6 6 18\",key:\"1bl5f8\"}],[\"path\",{d:\"m6 6 12 12\",key:\"d8bk6v\"}]]);var tl=S(\"ZoomIn\",[[\"circle\",{cx:\"11\",cy:\"11\",r:\"8\",key:\"4ej97u\"}],[\"line\",{x1:\"21\",x2:\"16.65\",y1:\"21\",y2:\"16.65\",key:\"13gj7c\"}],[\"line\",{x1:\"11\",x2:\"11\",y1:\"8\",y2:\"14\",key:\"1vmskp\"}],[\"line\",{x1:\"8\",x2:\"14\",y1:\"11\",y2:\"11\",key:\"durymu\"}]]);var al=S(\"ZoomOut\",[[\"circle\",{cx:\"11\",cy:\"11\",r:\"8\",key:\"4ej97u\"}],[\"line\",{x1:\"21\",x2:\"16.65\",y1:\"21\",y2:\"16.65\",key:\"13gj7c\"}],[\"line\",{x1:\"8\",x2:\"14\",y1:\"11\",y2:\"11\",key:\"durymu\"}]]);var n=Ut(ol(),1),hp={normal:{en:\"Normal\",ar:\"\\u0639\\u0627\\u062F\\u064A\",light:{canvas:\"#F3EAD9\",header:\"#DCE9DC\",surface:\"#FFFDFB\",surfaceSoft:\"#F8F2E6\",ink:\"#241B13\",inkSoft:\"#6B5D4F\",hairline:\"rgba(36,27,19,0.10)\",hairlineStrong:\"rgba(36,27,19,0.18)\",accent:\"#E8654A\",accentHover:\"#D2543C\",accentInk:\"#FFFDFB\",accentSoft:\"rgba(232,101,74,0.12)\"},dark:{canvas:\"#17130F\",header:\"#1D2420\",surface:\"#231C16\",surfaceSoft:\"#2A2119\",ink:\"#F3E9DA\",inkSoft:\"rgba(243,233,217,0.62)\",hairline:\"rgba(243,233,217,0.12)\",hairlineStrong:\"rgba(243,233,217,0.22)\",accent:\"#E8654A\",accentHover:\"#F3785D\",accentInk:\"#1D120C\",accentSoft:\"rgba(232,101,74,0.16)\"}},inkteal:{en:\"Ink & Teal\",ar:\"\\u062D\\u0628\\u0631 \\u0648\\u062A\\u0631\\u0643\\u0648\\u0627\\u0632\",light:{canvas:\"#EAFBFA\",header:\"#CFF3EF\",surface:\"#FFFFFF\",surfaceSoft:\"#E3F7F4\",ink:\"#06232A\",inkSoft:\"rgba(6,35,42,0.62)\",hairline:\"rgba(6,35,42,0.10)\",hairlineStrong:\"rgba(6,35,42,0.18)\",accent:\"#0E7C79\",accentHover:\"#0A6663\",accentInk:\"#FFFFFF\",accentSoft:\"rgba(14,124,121,0.14)\"},dark:{canvas:\"#011627\",header:\"#0A2036\",surface:\"#0F2A42\",surfaceSoft:\"#132F49\",ink:\"#FDFFFC\",inkSoft:\"rgba(253,255,252,0.62)\",hairline:\"rgba(253,255,252,0.12)\",hairlineStrong:\"rgba(253,255,252,0.22)\",accent:\"#41EAD4\",accentHover:\"#35CDB9\",accentInk:\"#011627\",accentSoft:\"rgba(65,234,212,0.18)\"}},sunsetplum:{en:\"Sunset Plum\",ar:\"\\u0628\\u0631\\u0642\\u0648\\u0642 \\u0627\\u0644\\u063A\\u0631\\u0648\\u0628\",light:{canvas:\"#FBF1E6\",header:\"#F3DEC0\",surface:\"#FFFFFF\",surfaceSoft:\"#F7E7D2\",ink:\"#2B0F0A\",inkSoft:\"rgba(43,15,10,0.62)\",hairline:\"rgba(43,15,10,0.10)\",hairlineStrong:\"rgba(43,15,10,0.18)\",accent:\"#FE5917\",accentHover:\"#E14C10\",accentInk:\"#FFFFFF\",accentSoft:\"rgba(254,89,23,0.14)\"},dark:{canvas:\"#1A0503\",header:\"#2B0F14\",surface:\"#241009\",surfaceSoft:\"#2E140D\",ink:\"#E3D3AE\",inkSoft:\"rgba(227,211,174,0.62)\",hairline:\"rgba(227,211,174,0.12)\",hairlineStrong:\"rgba(227,211,174,0.22)\",accent:\"#FE5917\",accentHover:\"#FF7738\",accentInk:\"#1A0503\",accentSoft:\"rgba(254,89,23,0.20)\"}},skymint:{en:\"Sky Mint\",ar:\"\\u0646\\u0639\\u0646\\u0627\\u0639 \\u0633\\u0645\\u0627\\u0648\\u064A\",light:{canvas:\"#F1FFE7\",header:\"#C2E7DA\",surface:\"#FFFFFF\",surfaceSoft:\"#E9F5EA\",ink:\"#1A1B41\",inkSoft:\"rgba(26,27,65,0.62)\",hairline:\"rgba(26,27,65,0.10)\",hairlineStrong:\"rgba(26,27,65,0.18)\",accent:\"#6290C3\",accentHover:\"#4E77A8\",accentInk:\"#FFFFFF\",accentSoft:\"rgba(98,144,195,0.14)\"},dark:{canvas:\"#10112B\",header:\"#1A1B41\",surface:\"#171840\",surfaceSoft:\"#1D1E4A\",ink:\"#F1FFE7\",inkSoft:\"rgba(241,255,231,0.62)\",hairline:\"rgba(241,255,231,0.12)\",hairlineStrong:\"rgba(241,255,231,0.22)\",accent:\"#6EA6DE\",accentHover:\"#86B7E6\",accentInk:\"#10112B\",accentSoft:\"rgba(110,166,222,0.20)\"}},amberdusk:{en:\"Amber Dusk\",ar:\"\\u0643\\u0647\\u0631\\u0645\\u0627\\u0646 \\u0627\\u0644\\u063A\\u0633\\u0642\",light:{canvas:\"#F3F5F7\",header:\"#E4E9ED\",surface:\"#FFFFFF\",surfaceSoft:\"#EAEDF0\",ink:\"#032539\",inkSoft:\"rgba(3,37,57,0.62)\",hairline:\"rgba(3,37,57,0.10)\",hairlineStrong:\"rgba(3,37,57,0.18)\",accent:\"#D98A4F\",accentHover:\"#C1763F\",accentInk:\"#FFFFFF\",accentSoft:\"rgba(217,138,79,0.14)\"},dark:{canvas:\"#032539\",header:\"#0D3350\",surface:\"#0A2E47\",surfaceSoft:\"#0F3A57\",ink:\"#E4E9ED\",inkSoft:\"rgba(228,233,237,0.62)\",hairline:\"rgba(228,233,237,0.12)\",hairlineStrong:\"rgba(228,233,237,0.22)\",accent:\"#F1AA6F\",accentHover:\"#F5BC8C\",accentInk:\"#032539\",accentSoft:\"rgba(241,170,111,0.20)\"}},papayacaramel:{en:\"Papaya Caramel\",ar:\"\\u0643\\u0631\\u0627\\u0645\\u064A\\u0644 \\u0628\\u0627\\u0628\\u0627\\u064A\\u0627\",light:{canvas:\"#FDECD8\",header:\"#F7DCC0\",surface:\"#FFFFFF\",surfaceSoft:\"#FCE4CD\",ink:\"#4A2E12\",inkSoft:\"rgba(74,46,18,0.62)\",hairline:\"rgba(74,46,18,0.10)\",hairlineStrong:\"rgba(74,46,18,0.18)\",accent:\"#BF7E46\",accentHover:\"#A76B39\",accentInk:\"#FFFFFF\",accentSoft:\"rgba(191,126,70,0.14)\"},dark:{canvas:\"#241505\",header:\"#35200C\",surface:\"#2C1908\",surfaceSoft:\"#33200D\",ink:\"#FDECD8\",inkSoft:\"rgba(253,236,216,0.62)\",hairline:\"rgba(253,236,216,0.12)\",hairlineStrong:\"rgba(253,236,216,0.22)\",accent:\"#E0A867\",accentHover:\"#EAB87F\",accentInk:\"#241505\",accentSoft:\"rgba(224,168,103,0.20)\"}},wasabijade:{en:\"Wasabi Jade\",ar:\"\\u0648\\u0627\\u0633\\u0627\\u0628\\u064A \\u0648\\u062C\\u064A\\u062F\",light:{canvas:\"#F4FAF0\",header:\"#D7EFFF\",surface:\"#FFFFFF\",surfaceSoft:\"#EAF3E4\",ink:\"#26301E\",inkSoft:\"rgba(38,48,30,0.62)\",hairline:\"rgba(38,48,30,0.10)\",hairlineStrong:\"rgba(38,48,30,0.18)\",accent:\"#A9BC1E\",accentHover:\"#93A419\",accentInk:\"#FFFFFF\",accentSoft:\"rgba(169,188,30,0.16)\"},dark:{canvas:\"#14170F\",header:\"#1C2015\",surface:\"#1A1D13\",surfaceSoft:\"#202417\",ink:\"#EAF3E4\",inkSoft:\"rgba(234,243,228,0.62)\",hairline:\"rgba(234,243,228,0.12)\",hairlineStrong:\"rgba(234,243,228,0.22)\",accent:\"#E9F056\",accentHover:\"#F1F87A\",accentInk:\"#14170F\",accentSoft:\"rgba(233,240,86,0.20)\"}}},Ct={normal:{id:\"normal\",radiusLg:20,radiusMd:16,radiusSm:9999,border:\"1px solid\",borderW:1,shadow:\"none\",blur:\"none\",surfaceAlpha:1,pixel:!1,displayFontOverride:null,letterSpacing:\"normal\"},glass:{id:\"glass\",radiusLg:28,radiusMd:20,radiusSm:9999,border:\"1px solid\",borderW:1,shadow:\"0 12px 40px rgba(20,20,30,0.14)\",blur:\"blur(18px) saturate(180%)\",surfaceAlpha:.55,pixel:!1,displayFontOverride:null,letterSpacing:\"normal\"},pixel:{id:\"pixel\",radiusLg:0,radiusMd:0,radiusSm:0,border:\"3px solid\",borderW:3,shadow:\"5px 5px 0 0 rgba(0,0,0,0.85)\",blur:\"none\",surfaceAlpha:1,pixel:!0,displayFontOverride:\"'Press Start 2P', 'Space Mono', monospace\",letterSpacing:\"0.02em\"}};function de(e,t){return e.id===\"glass\"?t.hairlineStrong:e.id===\"pixel\"?t.ink:t.hairline}function Hn(e,t){let a=e.replace(\"#\",\"\");if(a.length!==6)return e;let o=parseInt(a.slice(0,2),16),r=parseInt(a.slice(2,4),16),l=parseInt(a.slice(4,6),16);return`rgba(${o},${r},${l},${t})`}function yp(e,t,a){let o=a?t.surfaceSoft:t.surface;if(e.surfaceAlpha>=1)return o;let r=o.replace(\"#\",\"\");if(r.length===6){let l=parseInt(r.slice(0,2),16),s=parseInt(r.slice(2,4),16),u=parseInt(r.slice(4,6),16);return`rgba(${l},${s},${u},${e.surfaceAlpha})`}return o}function ft(e,t,{soft:a=!1,radius:o=\"lg\"}={}){let r=o===\"sm\"?e.radiusSm:o===\"md\"?e.radiusMd:e.radiusLg;return{background:yp(e,t,a),borderRadius:r,border:`${e.border.split(\" \")[0]} solid ${de(e,t)}`,boxShadow:e.shadow,backdropFilter:e.blur,WebkitBackdropFilter:e.blur}}var Q={bg:\"#9BE8C4\",border:\"#0B2318\"},Z={bg:\"#FFD9CE\",border:\"#7A2A12\"},di={bg:\"#F1F0FF\",border:\"#B7C3FF\",ink:\"#10112B\"},Ce={single:{color:{bg:\"#E4FF6E\",ink:\"#15170B\"},Icon:Dr,en:\"Single choice\",ar:\"\\u0627\\u062E\\u062A\\u064A\\u0627\\u0631 \\u0648\\u0627\\u062D\\u062F\"},multi:{color:{bg:\"#FF8A5B\",ink:\"#241007\"},Icon:Gt,en:\"Multi select\",ar:\"\\u0627\\u062E\\u062A\\u064A\\u0627\\u0631 \\u0645\\u062A\\u0639\\u062F\\u062F\"},tf:{color:{bg:\"#9BE8C4\",ink:\"#0B2318\"},Icon:Yr,en:\"True / False\",ar:\"\\u0635\\u062D / \\u063A\\u0644\\u0637\"},short:{color:{bg:\"#B7C3FF\",ink:\"#10112B\"},Icon:el,en:\"Short answer\",ar:\"\\u0625\\u062C\\u0627\\u0628\\u0629 \\u0642\\u0635\\u064A\\u0631\\u0629\"},essay:{color:{bg:\"#FFCF5C\",ink:\"#231a05\"},Icon:ga,en:\"Essay\",ar:\"\\u0645\\u0642\\u0627\\u0644\\u064A\"},fill:{color:{bg:\"#FF9ECF\",ink:\"#2b0a1c\"},Icon:Zr,en:\"Fill the blank\",ar:\"\\u0623\\u0643\\u0645\\u0644 \\u0627\\u0644\\u0641\\u0631\\u0627\\u063A\"},cloze:{color:{bg:\"#C4B5FD\",ink:\"#20123A\"},Icon:br,en:\"Word bank\",ar:\"\\u0628\\u0646\\u0643 \\u0643\\u0644\\u0645\\u0627\\u062A\"},match:{color:{bg:\"#6EE7B7\",ink:\"#062B1D\"},Icon:So,en:\"Matching\",ar:\"\\u062A\\u0648\\u0635\\u064A\\u0644\"},order:{color:{bg:\"#FDBA74\",ink:\"#361603\"},Icon:Wr,en:\"Ordering\",ar:\"\\u062A\\u0631\\u062A\\u064A\\u0628\"},sort:{color:{bg:\"#93C5FD\",ink:\"#08214D\"},Icon:Gr,en:\"Categorize\",ar:\"\\u062A\\u0635\\u0646\\u064A\\u0641\"},numeric:{color:{bg:\"#F472B6\",ink:\"#380620\"},Icon:Nr,en:\"Numeric\",ar:\"\\u0631\\u0642\\u0645\\u064A\"},rating:{color:{bg:\"#FCD34D\",ink:\"#332200\"},Icon:Eo,en:\"Self-rating\",ar:\"\\u062A\\u0642\\u064A\\u064A\\u0645 \\u0630\\u0627\\u062A\\u064A\"},slider:{color:{bg:\"#A7F3D0\",ink:\"#042F1A\"},Icon:jr,en:\"Slider\",ar:\"\\u0634\\u0631\\u064A\\u0637 \\u062A\\u0645\\u0631\\u064A\\u0631\"}},Lp={en:{Beginner:\"Beginner\",Intermediate:\"Intermediate\",Advanced:\"Advanced\",Reflection:\"Reflection\"},ar:{Beginner:\"\\u0645\\u0628\\u062A\\u062F\\u0626\",Intermediate:\"\\u0645\\u062A\\u0648\\u0633\\u0637\",Advanced:\"\\u0645\\u062A\\u0642\\u062F\\u0645\",Reflection:\"\\u062A\\u0623\\u0645\\u0651\\u0644\"}},kx={en:{core:\"core\",extra:\"extra\",advanced:\"advanced tier\"},ar:{core:\"\\u0623\\u0633\\u0627\\u0633\\u064A\",extra:\"\\u0625\\u0636\\u0627\\u0641\\u064A\",advanced:\"\\u0645\\u0633\\u062A\\u0648\\u0649 \\u0645\\u062A\\u0642\\u062F\\u0645\"}},vx={en:{dir:\"ltr\",htmlLang:\"en\",displayFont:\"'Space Mono', ui-monospace, monospace\",bodyFont:\"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif\",brand:\"EDUcraft\",langToggle:\"AR\",navLibrary:\"Books\",navTree:\"Tree\",navEditor:\"Editor\",editorSoon:\"Editor \\u2014 coming soon\",libraryKicker:\"Your library\",libraryTitle:\"Every book grows its own tree.\",librarySub:\"Open a book to see its knowledge tree \\u2014 branches split into smaller branches, and a few of them link straight across to one another.\",branchesLabel:\"branches\",questionsLabel:\"questions\",openBook:\"Open tree\",backToLibrary:\"Library\",treeEyebrow:\"Knowledge tree\",treeSub:\"Branches split into sub-branches, and a leaf sitting under one can still link straight to a leaf under another. Select a leaf to open its card.\",legendBranch:\"Branch\",legendLink:\"Cross-branch link\",legendLeaf:\"Leaf \\xB7 tap to open\",emptyHint:\"Pick a highlighted leaf on the tree to open its question card.\",deckOf:\"of\",deckQuestion:\"Question\",prev:\"Previous\",next:\"Next\",checkAnswer:\"Check answer\",tryAgain:\"Try again\",correctMsg:\"Correct.\",incorrectMsg:\"Not quite.\",revealModel:\"Reveal model answer\",hideModel:\"Hide model answer\",selfGraded:\"Self-graded \\u2014 no single correct answer.\",accepted:\"Accepted\",bankHint:\"Tap a word, then tap the blank to place it.\",sortHint:\"Tap a tag, then tap the bin it belongs in.\",matchHint:\"Tap a selector, then tap what it targets.\",orderHint:\"Use the arrows to put these in the right order.\",multiCardBadge:e=>`${e} questions`,navSettings:\"Settings\",settingsTitle:\"Settings\",settingsSub:\"Personalize how EDUcraft looks and how question cards move.\",settingsThemeLabel:\"Theme\",themeNormal:\"Normal\",themeNormalDesc:\"Warm paper, soft rounded cards.\",themeGlass:\"Liquid glass\",themeGlassDesc:\"Frosted, translucent, floating panels.\",themePixel:\"Pixel art\",themePixelDesc:\"Blocky edges, hard shadows, retro type.\",settingsCardModeLabel:\"Question cards\",cardModePaged:\"Next / Previous\",cardModePagedDesc:\"Page through one question at a time.\",cardModeScroll:\"Scroll\",cardModeScrollDesc:\"All questions in one scrollable card.\",settingsScrollDirLabel:\"Scroll direction\",scrollDirVertical:\"Vertical\",scrollDirVerticalDesc:\"Stack cards above one another.\",scrollDirHorizontal:\"Horizontal\",scrollDirHorizontalDesc:\"Line cards up side by side.\",coverEdit:\"Change cover\",coverReset:\"Use default cover\",settingsClose:\"Close\",settingsDataLabel:\"Data\",settingsDataSub:\"Your progress, plans, covers, and preferences are saved on this device automatically.\",settingsResetLabel:\"Reset everything\",settingsResetConfirm:\"This clears all saved progress, to-do/calendar plans, covers, and preferences on this device. This can't be undone. Continue?\",browseCta:\"Browse & practice all questions\",browseTitle:\"All questions\",browseSub:\"Every question in this book, in one place \\u2014 filter by type, or just scroll.\",scoreLabel:\"Score\",streakLabel:\"Streak\",completionLabel:\"Completion\",filterByType:\"Filter by type\",filterAll:\"All\",fromLeaf:\"From\",settingsFlavorLabel:\"Taste\",settingsFlavorSub:\"The color mood \\u2014 works with any of the themes above, in light or dark.\",navPlanner:\"Planner\",plannerTitle:\"Plan this book.\",plannerSub:\"Set a goal, check off leaves as you go, and see whether you're on pace\",plannerNoGoalTitle:\"No goal set yet\",plannerNoGoalSub:\"Pick a finish date and how much of the book you want done \\u2014 we'll work out the daily pace for you.\",plannerGoalDateLabel:\"Finish by\",plannerGoalCountLabel:\"Leaves to finish\",plannerSetGoal:\"Set goal\",plannerEditGoal:\"Edit goal\",plannerClearGoal:\"Clear goal\",plannerCancel:\"Cancel\",plannerTargetLabel:\"Goal\",plannerLeavesUnit:\"leaves by\",plannerStatusAhead:\"Ahead of schedule\",plannerStatusOnTrack:\"On track\",plannerStatusBehind:\"Behind schedule\",plannerStatusNoGoal:\"Set a goal to track your status\",plannerStatusDone:\"Goal complete\",plannerDaysLeft:\"Days left\",plannerRequiredPace:\"Needed / day\",plannerActualPace:\"Your pace / day\",plannerStreakLabel:\"Day streak\",plannerCompletionLabel:\"Complete\",plannerTodoTitle:\"To-do\",plannerTodoSub:\"Check off leaves as you finish them \\u2014 this feeds your calendar and pace above.\",plannerCalendarTitle:\"Activity calendar\",plannerAllDone:\"Every leaf in this book is checked off. Nice work.\",treePlannerCta:\"To-do & calendar\",treeExportCta:\"Export as HTML\",exportToast:\"Downloaded \\u2014 open the file in any browser, it works fully offline.\",libraryNewFolder:\"New folder\",libraryNewEncyclopedia:\"New encyclopedia\",collectionNamePromptFolder:\"Name this folder\",collectionNamePromptEncyclopedia:\"Name this encyclopedia\",libraryAddToFolder:\"Add to\\u2026\",libraryRemoveFromCollection:\"Remove\",libraryDeleteCollection:\"Delete\",libraryDeleteCollectionConfirm:\"Delete this \\u2014 the books and encyclopedias inside go back to the main library. Continue?\",libraryEmptyCollection:'Nothing in here yet. Go back to the library and use \"Add to\\u2026\" on a book or encyclopedia to file it here.',folderBadge:\"Folder\",encyclopediaBadge:\"Encyclopedia\",booksCountLabel:\"books\",libraryRootCrumb:\"Library\"},ar:{dir:\"rtl\",htmlLang:\"ar\",displayFont:\"'Cairo', 'Tajawal', sans-serif\",bodyFont:\"'IBM Plex Sans Arabic', 'Tajawal', sans-serif\",brand:\"EDUcraft\",langToggle:\"EN\",navLibrary:\"\\u0627\\u0644\\u0643\\u062A\\u0628\",navTree:\"\\u0627\\u0644\\u0634\\u062C\\u0631\\u0629\",navEditor:\"\\u0627\\u0644\\u0645\\u062D\\u0631\\u0631\",editorSoon:\"\\u0627\\u0644\\u0645\\u062D\\u0631\\u0631 \\u2014 \\u0642\\u0631\\u064A\\u0628\\u064B\\u0627\",libraryKicker:\"\\u0645\\u0643\\u062A\\u0628\\u062A\\u0643\",libraryTitle:\"\\u0644\\u0643\\u0644 \\u0643\\u062A\\u0627\\u0628 \\u0634\\u062C\\u0631\\u062A\\u0647 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629.\",librarySub:\"\\u0627\\u0641\\u062A\\u062D \\u0643\\u062A\\u0627\\u0628 \\u0639\\u0634\\u0627\\u0646 \\u062A\\u0634\\u0648\\u0641 \\u0634\\u062C\\u0631\\u0629 \\u0645\\u0639\\u0631\\u0641\\u062A\\u0647 \\u2014 \\u0627\\u0644\\u0641\\u0631\\u0648\\u0639 \\u0628\\u062A\\u062A\\u0641\\u0631\\u0651\\u0639 \\u0644\\u0641\\u0631\\u0648\\u0639 \\u0623\\u0635\\u063A\\u0631\\u060C \\u0648\\u0628\\u0639\\u0636\\u0647\\u0627 \\u0628\\u064A\\u062A\\u0631\\u0627\\u0628\\u0637 \\u0645\\u0628\\u0627\\u0634\\u0631\\u0629 \\u0645\\u0639 \\u0628\\u0639\\u0636\\u0647.\",branchesLabel:\"\\u0641\\u0631\\u0648\\u0639\",questionsLabel:\"\\u0623\\u0633\\u0626\\u0644\\u0629\",openBook:\"\\u0627\\u0641\\u062A\\u062D \\u0627\\u0644\\u0634\\u062C\\u0631\\u0629\",backToLibrary:\"\\u0627\\u0644\\u0645\\u0643\\u062A\\u0628\\u0629\",treeEyebrow:\"\\u0634\\u062C\\u0631\\u0629 \\u0627\\u0644\\u0645\\u0639\\u0631\\u0641\\u0629\",treeSub:\"\\u0627\\u0644\\u0641\\u0631\\u0648\\u0639 \\u0628\\u062A\\u062A\\u0641\\u0631\\u0651\\u0639 \\u0644\\u0641\\u0631\\u0648\\u0639 \\u0641\\u0631\\u0639\\u064A\\u0629\\u060C \\u0648\\u0648\\u0631\\u0642\\u0629 \\u062A\\u062D\\u062A \\u0641\\u0631\\u0639 \\u0645\\u0639\\u064A\\u0651\\u0646 \\u0645\\u0645\\u0643\\u0646 \\u062A\\u062A\\u0631\\u0627\\u0628\\u0637 \\u0645\\u0628\\u0627\\u0634\\u0631\\u0629 \\u0645\\u0639 \\u0648\\u0631\\u0642\\u0629 \\u062A\\u062D\\u062A \\u0641\\u0631\\u0639 \\u062A\\u0627\\u0646\\u064A. \\u0627\\u062E\\u062A\\u0627\\u0631 \\u0648\\u0631\\u0642\\u0629 \\u0639\\u0634\\u0627\\u0646 \\u062A\\u0641\\u062A\\u062D \\u0643\\u0627\\u0631\\u062A\\u0647\\u0627.\",legendBranch:\"\\u0641\\u0631\\u0639\",legendLink:\"\\u0631\\u0627\\u0628\\u0637 \\u0634\\u0628\\u0643\\u064A\",legendLeaf:\"\\u0648\\u0631\\u0642\\u0629 \\xB7 \\u062F\\u0648\\u0633 \\u062A\\u0641\\u062A\\u062D\",emptyHint:\"\\u0627\\u062E\\u062A\\u0627\\u0631 \\u0648\\u0631\\u0642\\u0629 \\u0645\\u062A\\u0644\\u0648\\u0651\\u0646\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0634\\u062C\\u0631\\u0629 \\u0639\\u0634\\u0627\\u0646 \\u062A\\u0641\\u062A\\u062D \\u0643\\u0627\\u0631\\u062A \\u0623\\u0633\\u0626\\u0644\\u062A\\u0647\\u0627.\",deckOf:\"\\u0645\\u0646\",deckQuestion:\"\\u0633\\u0624\\u0627\\u0644\",prev:\"\\u0627\\u0644\\u0633\\u0627\\u0628\\u0642\",next:\"\\u0627\\u0644\\u062A\\u0627\\u0644\\u064A\",checkAnswer:\"\\u062A\\u062D\\u0642\\u0642 \\u0645\\u0646 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0628\\u0629\",tryAgain:\"\\u062D\\u0627\\u0648\\u0644 \\u062A\\u0627\\u0646\\u064A\",correctMsg:\"\\u0625\\u062C\\u0627\\u0628\\u0629 \\u0635\\u062D.\",incorrectMsg:\"\\u0645\\u0634 \\u062A\\u0645\\u0627\\u0645.\",revealModel:\"\\u0627\\u0638\\u0647\\u0631 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0628\\u0629 \\u0627\\u0644\\u0646\\u0645\\u0648\\u0630\\u062C\\u064A\\u0629\",hideModel:\"\\u0627\\u062E\\u0641\\u0650 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0628\\u0629 \\u0627\\u0644\\u0646\\u0645\\u0648\\u0630\\u062C\\u064A\\u0629\",selfGraded:\"\\u0628\\u064A\\u062A\\u0642\\u064A\\u0651\\u0645 \\u0630\\u0627\\u062A\\u064A\\u064B\\u0627 \\u2014 \\u0645\\u0641\\u064A\\u0634 \\u0625\\u062C\\u0627\\u0628\\u0629 \\u0648\\u0627\\u062D\\u062F\\u0629 \\u0635\\u062D.\",accepted:\"\\u0627\\u0644\\u0625\\u062C\\u0627\\u0628\\u0627\\u062A \\u0627\\u0644\\u0645\\u0642\\u0628\\u0648\\u0644\\u0629\",bankHint:\"\\u062F\\u0648\\u0633 \\u0639\\u0644\\u0649 \\u0643\\u0644\\u0645\\u0629\\u060C \\u0648\\u0628\\u0639\\u062F\\u064A\\u0646 \\u062F\\u0648\\u0633 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0641\\u0631\\u0627\\u063A \\u0627\\u0644\\u0644\\u064A \\u0647\\u062A\\u062D\\u0637\\u0647\\u0627 \\u0641\\u064A\\u0647.\",sortHint:\"\\u062F\\u0648\\u0633 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0648\\u0633\\u0645\\u060C \\u0648\\u0628\\u0639\\u062F\\u064A\\u0646 \\u062F\\u0648\\u0633 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0635\\u0646\\u062F\\u0648\\u0642 \\u0627\\u0644\\u0644\\u064A \\u0628\\u064A\\u062A\\u0628\\u0639\\u0644\\u0647.\",matchHint:\"\\u062F\\u0648\\u0633 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0640 selector\\u060C \\u0648\\u0628\\u0639\\u062F\\u064A\\u0646 \\u062F\\u0648\\u0633 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0644\\u064A \\u0628\\u064A\\u0633\\u062A\\u0647\\u062F\\u0641\\u0647.\",orderHint:\"\\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u0633\\u0647\\u0627\\u0645 \\u0639\\u0634\\u0627\\u0646 \\u062A\\u0631\\u062A\\u0628\\u0647\\u0645 \\u0635\\u062D.\",multiCardBadge:e=>`${e} \\u0623\\u0633\\u0626\\u0644\\u0629`,navSettings:\"\\u0627\\u0644\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\",settingsTitle:\"\\u0627\\u0644\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\",settingsSub:\"\\u062E\\u0635\\u0651\\u0635 \\u0634\\u0643\\u0644 EDUcraft \\u0648\\u0637\\u0631\\u064A\\u0642\\u0629 \\u062D\\u0631\\u0643\\u0629 \\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u0627\\u0644\\u0623\\u0633\\u0626\\u0644\\u0629.\",settingsThemeLabel:\"\\u0627\\u0644\\u062B\\u064A\\u0645\",themeNormal:\"\\u0639\\u0627\\u062F\\u064A\",themeNormalDesc:\"\\u062E\\u0644\\u0641\\u064A\\u0629 \\u0648\\u0631\\u0642\\u064A\\u0629 \\u062F\\u0627\\u0641\\u0626\\u0629 \\u0648\\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u0646\\u0627\\u0639\\u0645\\u0629 \\u0645\\u062F\\u0648\\u0631\\u0629.\",themeGlass:\"\\u0632\\u062C\\u0627\\u062C \\u0634\\u0641\\u0627\\u0641\",themeGlassDesc:\"\\u0644\\u0648\\u062D\\u0627\\u062A \\u0634\\u0641\\u0627\\u0641\\u0629 \\u0648\\u0636\\u0628\\u0627\\u0628\\u064A\\u0629 \\u0639\\u0627\\u0626\\u0645\\u0629.\",themePixel:\"\\u0628\\u064A\\u0643\\u0633\\u0644 \\u0622\\u0631\\u062A\",themePixelDesc:\"\\u062D\\u0648\\u0627\\u0641 \\u062D\\u0627\\u062F\\u0629 \\u0648\\u0638\\u0644 \\u0635\\u0644\\u0628 \\u0648\\u062E\\u0637 \\u0631\\u064A\\u062A\\u0631\\u0648.\",settingsCardModeLabel:\"\\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u0627\\u0644\\u0623\\u0633\\u0626\\u0644\\u0629\",cardModePaged:\"\\u0627\\u0644\\u062A\\u0627\\u0644\\u064A / \\u0627\\u0644\\u0633\\u0627\\u0628\\u0642\",cardModePagedDesc:\"\\u062A\\u0642\\u0644\\u0651\\u0628 \\u0628\\u064A\\u0646 \\u0627\\u0644\\u0623\\u0633\\u0626\\u0644\\u0629 \\u0633\\u0624\\u0627\\u0644 \\u0633\\u0624\\u0627\\u0644.\",cardModeScroll:\"\\u0633\\u0643\\u0631\\u0648\\u0644\",cardModeScrollDesc:\"\\u0643\\u0644 \\u0627\\u0644\\u0623\\u0633\\u0626\\u0644\\u0629 \\u062C\\u0648\\u0627 \\u0643\\u0627\\u0631\\u062F \\u0648\\u0627\\u062D\\u062F \\u0642\\u0627\\u0628\\u0644 \\u0644\\u0644\\u0633\\u0643\\u0631\\u0648\\u0644.\",settingsScrollDirLabel:\"\\u0627\\u062A\\u062C\\u0627\\u0647 \\u0627\\u0644\\u0633\\u0643\\u0631\\u0648\\u0644\",scrollDirVertical:\"\\u0631\\u0623\\u0633\\u064A\",scrollDirVerticalDesc:\"\\u0627\\u0644\\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u0641\\u0648\\u0642 \\u0628\\u0639\\u0636.\",scrollDirHorizontal:\"\\u0623\\u0641\\u0642\\u064A\",scrollDirHorizontalDesc:\"\\u0627\\u0644\\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u062C\\u0646\\u0628 \\u0628\\u0639\\u0636.\",coverEdit:\"\\u063A\\u064A\\u0651\\u0631 \\u0627\\u0644\\u063A\\u0644\\u0627\\u0641\",coverReset:\"\\u0631\\u062C\\u0651\\u0639 \\u0627\\u0644\\u063A\\u0644\\u0627\\u0641 \\u0627\\u0644\\u0627\\u0641\\u062A\\u0631\\u0627\\u0636\\u064A\",settingsClose:\"\\u0625\\u063A\\u0644\\u0627\\u0642\",settingsDataLabel:\"\\u0627\\u0644\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\",settingsDataSub:\"\\u062A\\u0642\\u062F\\u0645\\u0643 \\u0648\\u062E\\u0637\\u0637\\u0643 (\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0648\\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645) \\u0648\\u0627\\u0644\\u0623\\u063A\\u0644\\u0641\\u0629 \\u0648\\u062A\\u0641\\u0636\\u064A\\u0644\\u0627\\u062A\\u0643 \\u0628\\u062A\\u062A\\u062D\\u0641\\u0638 \\u0623\\u0648\\u062A\\u0648\\u0645\\u0627\\u062A\\u064A\\u0643 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u062C\\u0647\\u0627\\u0632 \\u062F\\u0647.\",settingsResetLabel:\"\\u0625\\u0639\\u0627\\u062F\\u0629 \\u0636\\u0628\\u0637 \\u0643\\u0644 \\u062D\\u0627\\u062C\\u0629\",settingsResetConfirm:\"\\u062F\\u0647 \\u0647\\u064A\\u0645\\u0633\\u062D \\u0643\\u0644 \\u0627\\u0644\\u062A\\u0642\\u062F\\u0645 \\u0627\\u0644\\u0645\\u062D\\u0641\\u0648\\u0638\\u060C \\u062E\\u0637\\u0637 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0648\\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645\\u060C \\u0627\\u0644\\u0623\\u063A\\u0644\\u0641\\u0629\\u060C \\u0648\\u0627\\u0644\\u062A\\u0641\\u0636\\u064A\\u0644\\u0627\\u062A \\u0639\\u0644\\u0649 \\u0627\\u0644\\u062C\\u0647\\u0627\\u0632 \\u062F\\u0647. \\u0645\\u064A\\u0646\\u0641\\u0639\\u0634 \\u062A\\u0631\\u062C\\u0639 \\u0641\\u064A\\u0647. \\u062A\\u0643\\u0645\\u0644\\u061F\",browseCta:\"\\u062A\\u0635\\u0641\\u062D \\u0648\\u062A\\u062F\\u0631\\u0651\\u0628 \\u0639\\u0644\\u0649 \\u0643\\u0644 \\u0627\\u0644\\u0623\\u0633\\u0626\\u0644\\u0629\",browseTitle:\"\\u0643\\u0644 \\u0627\\u0644\\u0623\\u0633\\u0626\\u0644\\u0629\",browseSub:\"\\u0643\\u0644 \\u0633\\u0624\\u0627\\u0644 \\u0641\\u064A \\u0627\\u0644\\u0643\\u062A\\u0627\\u0628 \\u062F\\u0647 \\u0641\\u064A \\u0645\\u0643\\u0627\\u0646 \\u0648\\u0627\\u062D\\u062F \\u2014 \\u0641\\u0644\\u062A\\u0631 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0646\\u0648\\u0639\\u060C \\u0623\\u0648 \\u0627\\u0633\\u0643\\u0631\\u0648\\u0644 \\u0639\\u0627\\u062F\\u064A.\",scoreLabel:\"\\u0627\\u0644\\u0646\\u062A\\u064A\\u062C\\u0629\",streakLabel:\"\\u0627\\u0644\\u062A\\u062A\\u0627\\u0628\\u0639\",completionLabel:\"\\u0646\\u0633\\u0628\\u0629 \\u0627\\u0644\\u0625\\u0646\\u062C\\u0627\\u0632\",filterByType:\"\\u0641\\u0644\\u062A\\u0631 \\u062D\\u0633\\u0628 \\u0627\\u0644\\u0646\\u0648\\u0639\",filterAll:\"\\u0627\\u0644\\u0643\\u0644\",fromLeaf:\"\\u0645\\u0646\",settingsFlavorLabel:\"\\u0627\\u0644\\u0646\\u0643\\u0647\\u0629\",settingsFlavorSub:\"\\u0645\\u0632\\u0627\\u062C \\u0627\\u0644\\u0623\\u0644\\u0648\\u0627\\u0646 \\u2014 \\u0628\\u062A\\u0634\\u062A\\u063A\\u0644 \\u0645\\u0639 \\u0623\\u064A \\u062B\\u064A\\u0645 \\u0641\\u0648\\u0642\\u060C \\u0641\\u0627\\u062A\\u062D \\u0623\\u0648 \\u063A\\u0627\\u0645\\u0642.\",navPlanner:\"\\u0627\\u0644\\u062E\\u0637\\u0629\",plannerTitle:\"\\u062E\\u0637\\u0651\\u0637 \\u0644\\u0644\\u0643\\u062A\\u0627\\u0628 \\u062F\\u0647.\",plannerSub:\"\\u062D\\u062F\\u0651\\u062F \\u0647\\u062F\\u0641\\u060C \\u0627\\u0639\\u0644\\u0651\\u0645 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0648\\u0631\\u0627\\u0642 \\u0627\\u0644\\u0644\\u064A \\u0628\\u062A\\u062E\\u0644\\u0651\\u0635\\u0647\\u0627\\u060C \\u0648\\u0634\\u0648\\u0641 \\u0645\\u0627\\u0634\\u064A \\u0639\\u0644\\u0649 \\u0627\\u0644\\u062E\\u0637\\u0629 \\u0648\\u0644\\u0627 \\u0644\\u0623\",plannerNoGoalTitle:\"\\u0644\\u0633\\u0647 \\u0645\\u0641\\u064A\\u0634 \\u0647\\u062F\\u0641 \\u0645\\u062D\\u062F\\u062F\",plannerNoGoalSub:\"\\u0627\\u062E\\u062A\\u0627\\u0631 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0639\\u0627\\u064A\\u0632 \\u062A\\u062E\\u0644\\u0651\\u0635 \\u0641\\u064A\\u0647\\u060C \\u0648\\u0642\\u062F \\u0627\\u064A\\u0647 \\u0645\\u0646 \\u0627\\u0644\\u0643\\u062A\\u0627\\u0628 \\u0639\\u0627\\u064A\\u0632 \\u062A\\u062E\\u0644\\u0651\\u0635\\u0647 \\u2014 \\u0648\\u0625\\u062D\\u0646\\u0627 \\u0647\\u0646\\u062D\\u0633\\u0628\\u0644\\u0643 \\u0627\\u0644\\u0648\\u062A\\u064A\\u0631\\u0629 \\u0627\\u0644\\u064A\\u0648\\u0645\\u064A\\u0629.\",plannerGoalDateLabel:\"\\u062A\\u062E\\u0644\\u0651\\u0635 \\u0642\\u0628\\u0644\",plannerGoalCountLabel:\"\\u0639\\u062F\\u062F \\u0627\\u0644\\u0623\\u0648\\u0631\\u0627\\u0642 \\u0627\\u0644\\u0644\\u064A \\u0647\\u062A\\u062E\\u0644\\u0651\\u0635\\u0647\\u0627\",plannerSetGoal:\"\\u062D\\u062F\\u0651\\u062F \\u0627\\u0644\\u0647\\u062F\\u0641\",plannerEditGoal:\"\\u0639\\u062F\\u0651\\u0644 \\u0627\\u0644\\u0647\\u062F\\u0641\",plannerClearGoal:\"\\u0627\\u0645\\u0633\\u062D \\u0627\\u0644\\u0647\\u062F\\u0641\",plannerCancel:\"\\u0625\\u0644\\u063A\\u0627\\u0621\",plannerTargetLabel:\"\\u0627\\u0644\\u0647\\u062F\\u0641\",plannerLeavesUnit:\"\\u0648\\u0631\\u0642\\u0629\\u060C \\u062A\\u062E\\u0644\\u0635 \\u0642\\u0628\\u0644\",plannerStatusAhead:\"\\u0642\\u062F\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0637\\u0629\",plannerStatusOnTrack:\"\\u0645\\u0627\\u0634\\u064A \\u0632\\u064A \\u0645\\u0627 \\u0627\\u062A\\u0641\\u0642\\u0646\\u0627\",plannerStatusBehind:\"\\u0645\\u062A\\u0623\\u062E\\u0631 \\u0639\\u0646 \\u0627\\u0644\\u062E\\u0637\\u0629\",plannerStatusNoGoal:\"\\u062D\\u062F\\u0651\\u062F \\u0647\\u062F\\u0641 \\u0639\\u0634\\u0627\\u0646 \\u062A\\u0634\\u0648\\u0641 \\u0623\\u062F\\u0627\\u0621\\u0643\",plannerStatusDone:\"\\u062E\\u0644\\u0651\\u0635\\u062A \\u0627\\u0644\\u0647\\u062F\\u0641\",plannerDaysLeft:\"\\u0627\\u0644\\u0623\\u064A\\u0627\\u0645 \\u0627\\u0644\\u0645\\u062A\\u0628\\u0642\\u064A\\u0629\",plannerRequiredPace:\"\\u0627\\u0644\\u0645\\u0637\\u0644\\u0648\\u0628 / \\u064A\\u0648\\u0645\",plannerActualPace:\"\\u0648\\u062A\\u064A\\u0631\\u062A\\u0643 / \\u064A\\u0648\\u0645\",plannerStreakLabel:\"\\u0623\\u064A\\u0627\\u0645 \\u0645\\u062A\\u062A\\u0627\\u0644\\u064A\\u0629\",plannerCompletionLabel:\"\\u0646\\u0633\\u0628\\u0629 \\u0627\\u0644\\u0625\\u0646\\u062C\\u0627\\u0632\",plannerTodoTitle:\"\\u0642\\u0627\\u0626\\u0645\\u0629 \\u0627\\u0644\\u0645\\u0647\\u0627\\u0645\",plannerTodoSub:\"\\u0639\\u0644\\u0651\\u0645 \\u0639\\u0644\\u0649 \\u0643\\u0644 \\u0648\\u0631\\u0642\\u0629 \\u062A\\u062E\\u0644\\u0651\\u0635\\u0647\\u0627 \\u2014 \\u0628\\u062A\\u062A\\u062D\\u0633\\u0628 \\u0641\\u064A \\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645 \\u0648\\u0641\\u064A \\u0648\\u062A\\u064A\\u0631\\u062A\\u0643 \\u0641\\u0648\\u0642.\",plannerCalendarTitle:\"\\u062A\\u0642\\u0648\\u064A\\u0645 \\u0627\\u0644\\u0646\\u0634\\u0627\\u0637\",plannerAllDone:\"\\u062E\\u0644\\u0651\\u0635\\u062A \\u0643\\u0644 \\u0623\\u0648\\u0631\\u0627\\u0642 \\u0627\\u0644\\u0643\\u062A\\u0627\\u0628 \\u062F\\u0647. \\u062A\\u0633\\u0644\\u0645 \\u0625\\u064A\\u062F\\u0643.\",treePlannerCta:\"\\u0627\\u0644\\u0645\\u0647\\u0627\\u0645 \\u0648\\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645\",treeExportCta:\"\\u0635\\u062F\\u0651\\u0631 \\u0643\\u0645\\u0644\\u0641 HTML\",exportToast:\"\\u0627\\u062A\\u062D\\u0645\\u0651\\u0644 \\u2014 \\u0627\\u0641\\u062A\\u062D \\u0627\\u0644\\u0645\\u0644\\u0641 \\u0628\\u0623\\u064A \\u0645\\u062A\\u0635\\u0641\\u062D\\u060C \\u0648\\u0647\\u064A\\u0634\\u062A\\u063A\\u0644 \\u0645\\u0646 \\u063A\\u064A\\u0631 \\u0646\\u062A \\u062E\\u0627\\u0644\\u0635.\",libraryNewFolder:\"\\u0634\\u0646\\u0637\\u0629 \\u062C\\u062F\\u064A\\u062F\\u0629\",libraryNewEncyclopedia:\"\\u0645\\u0648\\u0633\\u0648\\u0639\\u0629 \\u062C\\u062F\\u064A\\u062F\\u0629\",collectionNamePromptFolder:\"\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0634\\u0646\\u0637\\u0629\",collectionNamePromptEncyclopedia:\"\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0648\\u0633\\u0648\\u0639\\u0629\",libraryAddToFolder:\"\\u0636\\u064A\\u0641\\u0647 \\u0644\\u0640\\u2026\",libraryRemoveFromCollection:\"\\u0634\\u064A\\u0644\\u0647 \\u0645\\u0646 \\u0647\\u0646\\u0627\",libraryDeleteCollection:\"\\u0627\\u062D\\u0630\\u0641\",libraryDeleteCollectionConfirm:\"\\u0647\\u062A\\u0645\\u0633\\u062D \\u062F\\u0647 \\u2014 \\u0627\\u0644\\u0643\\u062A\\u0628 \\u0648\\u0627\\u0644\\u0645\\u0648\\u0633\\u0648\\u0639\\u0627\\u062A \\u0627\\u0644\\u0644\\u064A \\u062C\\u0648\\u0627\\u0647 \\u0647\\u062A\\u0631\\u062C\\u0639 \\u0644\\u0644\\u0645\\u0643\\u062A\\u0628\\u0629 \\u0627\\u0644\\u0631\\u0626\\u064A\\u0633\\u064A\\u0629. \\u062A\\u0643\\u0645\\u0644\\u061F\",libraryEmptyCollection:'\\u0645\\u0641\\u064A\\u0634 \\u062D\\u0627\\u062C\\u0629 \\u0647\\u0646\\u0627 \\u0644\\u0633\\u0647. \\u0627\\u0631\\u062C\\u0639 \\u0644\\u0644\\u0645\\u0643\\u062A\\u0628\\u0629 \\u0648\\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 \"\\u0636\\u064A\\u0641\\u0647 \\u0644\\u0640\\u2026\" \\u0639\\u0644\\u0649 \\u0623\\u064A \\u0643\\u062A\\u0627\\u0628 \\u0623\\u0648 \\u0645\\u0648\\u0633\\u0648\\u0639\\u0629 \\u0639\\u0634\\u0627\\u0646 \\u062A\\u062D\\u0637\\u0647 \\u0647\\u0646\\u0627.',folderBadge:\"\\u0634\\u0646\\u0637\\u0629\",encyclopediaBadge:\"\\u0645\\u0648\\u0633\\u0648\\u0639\\u0629\",booksCountLabel:\"\\u0643\\u062A\\u0628\",libraryRootCrumb:\"\\u0627\\u0644\\u0645\\u0643\\u062A\\u0628\\u0629\"}},sp=800,up=300,Nn=44,Oa=156,St=262,Mn=[{id:\"web-foundations\",cover:{from:\"#F2C879\",to:\"#E8654A\",icon:\"code\"},en:{title:\"HTML & CSS Foundations\",tagline:\"Structure the page, then dress it.\"},ar:{title:\"\\u0623\\u0633\\u0627\\u0633\\u064A\\u0627\\u062A HTML \\u0648 CSS\",tagline:\"\\u0627\\u0628\\u0646\\u064A \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\\u060C \\u0648\\u0628\\u0639\\u062F\\u064A\\u0646 \\u0644\\u0628\\u0651\\u0633\\u0647\\u0627.\"},crossLinks:[[\"a1a\",\"b2a\"],[\"a2a\",\"b1a\"]],nodes:[{id:\"a\",level:\"branch\",x:200,y:Nn,en:\"Structure\",ar:\"\\u0627\\u0644\\u0628\\u0646\\u064A\\u0629\"},{id:\"b\",level:\"branch\",x:629,y:Nn,en:\"Styling\",ar:\"\\u0627\\u0644\\u062A\\u0646\\u0633\\u064A\\u0642\"},{id:\"a1\",level:\"sub\",parent:\"a\",x:114,y:Oa,en:\"Elements\",ar:\"\\u0627\\u0644\\u0639\\u0646\\u0627\\u0635\\u0631\"},{id:\"a2\",level:\"sub\",parent:\"a\",x:286,y:Oa,en:\"Semantics\",ar:\"\\u0627\\u0644\\u062F\\u0644\\u0627\\u0644\\u0627\\u062A\"},{id:\"b1\",level:\"sub\",parent:\"b\",x:514,y:Oa,en:\"Layout\",ar:\"\\u0627\\u0644\\u062A\\u062E\\u0637\\u064A\\u0637\"},{id:\"b2\",level:\"sub\",parent:\"b\",x:743,y:Oa,en:\"Selectors\",ar:\"\\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0627\\u062A\"},{id:\"a1a\",level:\"leaf\",parent:\"a1\",x:57,y:St,en:\"Lists\",ar:\"\\u0627\\u0644\\u0642\\u0648\\u0627\\u0626\\u0645\",questions:[{type:\"single\",subject:\"HTML\",difficulty:\"Beginner\",tier:\"core\",dir:\"ltr\",en:{prompt:\"Which HTML element defines an ordered list?\",options:[\"<ul>\",\"<ol>\",\"<li>\",\"<dl>\"],correct:1},ar:{prompt:\"\\u0623\\u0646\\u0647\\u064A \\u0639\\u0646\\u0635\\u0631 HTML \\u0628\\u064A\\u0639\\u0631\\u0651\\u0641 \\u0642\\u0627\\u0626\\u0645\\u0629 \\u0645\\u0631\\u0642\\u0651\\u0645\\u0629\\u061F\",options:[\"<ul>\",\"<ol>\",\"<li>\",\"<dl>\"],correct:1}},{type:\"short\",subject:\"CSS\",difficulty:\"Beginner\",tier:\"core\",dir:\"ltr\",en:{prompt:\"Which CSS property changes the color of text?\",accepted:[\"color\"]},ar:{prompt:\"\\u0623\\u0646\\u0647\\u064A \\u062E\\u0627\\u0635\\u064A\\u0629 CSS \\u0628\\u062A\\u063A\\u064A\\u0651\\u0631 \\u0644\\u0648\\u0646 \\u0627\\u0644\\u0646\\u0635\\u061F\",accepted:[\"color\"]}}]},{id:\"a1b\",level:\"leaf\",parent:\"a1\",x:171,y:St,en:\"Links\",ar:\"\\u0627\\u0644\\u0631\\u0648\\u0627\\u0628\\u0637\",questions:[{type:\"fill\",subject:\"HTML\",difficulty:\"Beginner\",tier:\"core\",dir:\"ltr\",en:{template:\"The ___ tag defines a hyperlink, and its ___ attribute specifies the destination URL.\",blanks:[\"a\",\"href\"]},ar:{template:\"\\u0627\\u0644\\u0648\\u0633\\u0645 ___ \\u0628\\u064A\\u0639\\u0631\\u0651\\u0641 \\u0631\\u0627\\u0628\\u0637 \\u062A\\u0634\\u0639\\u0628\\u064A\\u060C \\u0648\\u062E\\u0627\\u0635\\u064A\\u0629 ___ \\u0628\\u062A\\u062D\\u062F\\u062F \\u0631\\u0627\\u0628\\u0637 \\u0627\\u0644\\u0648\\u062C\\u0647\\u0629.\",blanks:[\"a\",\"href\"]}}]},{id:\"a2a\",level:\"leaf\",parent:\"a2\",x:286,y:St,en:\"Tag roles\",ar:\"\\u0623\\u062F\\u0648\\u0627\\u0631 \\u0627\\u0644\\u0648\\u0633\\u0648\\u0645\",questions:[{type:\"sort\",subject:\"HTML\",difficulty:\"Beginner\",tier:\"core\",dir:\"ltr\",en:{prompt:\"Sort each tag into its default display role.\",bins:[\"Block\",\"Inline\"],items:[[\"<div>\",\"Block\"],[\"<span>\",\"Inline\"],[\"<p>\",\"Block\"],[\"<a>\",\"Inline\"]]},ar:{prompt:\"\\u0631\\u062A\\u0651\\u0628 \\u0643\\u0644 tag \\u062D\\u0633\\u0628 \\u0646\\u0648\\u0639 \\u0627\\u0644\\u0639\\u0631\\u0636 \\u0627\\u0644\\u0627\\u0641\\u062A\\u0631\\u0627\\u0636\\u064A \\u0628\\u062A\\u0627\\u0639\\u0647.\",bins:[\"Block\",\"Inline\"],items:[[\"<div>\",\"Block\"],[\"<span>\",\"Inline\"],[\"<p>\",\"Block\"],[\"<a>\",\"Inline\"]]}}]},{id:\"b1a\",level:\"leaf\",parent:\"b1\",x:400,y:St,en:\"Flexbox\",ar:\"\\u0641\\u0644\\u0643\\u0633 \\u0628\\u0648\\u0643\\u0633\",cards:[{id:\"b1a-card1\",image:\"https://picsum.photos/seed/flexbox-diagram/640/360\",imagePosition:\"top\",questions:[{type:\"single\",subject:\"CSS\",difficulty:\"Intermediate\",tier:\"core\",dir:\"ltr\",en:{prompt:\"Which property controls the gap between a flex container's items?\",options:[\"gap\",\"margin\",\"align-items\",\"justify-content\"],correct:0},ar:{prompt:\"\\u0623\\u0646\\u0647\\u064A \\u062E\\u0627\\u0635\\u064A\\u0629 \\u0628\\u062A\\u062A\\u062D\\u0643\\u0645 \\u0641\\u064A \\u0627\\u0644\\u0645\\u0633\\u0627\\u0641\\u0629 \\u0628\\u064A\\u0646 \\u0639\\u0646\\u0627\\u0635\\u0631 \\u0627\\u0644\\u0640 flex container\\u061F\",options:[\"gap\",\"margin\",\"align-items\",\"justify-content\"],correct:0}},{type:\"tf\",subject:\"CSS\",difficulty:\"Intermediate\",tier:\"core\",dir:\"ltr\",en:{prompt:\"In Flexbox, justify-content controls alignment along the cross axis.\",correct:!1},ar:{prompt:\"\\u0641\\u064A \\u0627\\u0644\\u0640 Flexbox\\u060C \\u062E\\u0627\\u0635\\u064A\\u0629 justify-content \\u0628\\u062A\\u062A\\u062D\\u0643\\u0645 \\u0641\\u064A \\u0627\\u0644\\u0645\\u062D\\u0627\\u0630\\u0627\\u0629 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0645\\u062D\\u0648\\u0631 \\u0627\\u0644\\u0639\\u0631\\u0636\\u064A.\",correct:!1}}]}],questions:[]},{id:\"b1b\",level:\"leaf\",parent:\"b1\",x:514,y:St,en:\"Box model\",ar:\"\\u0646\\u0645\\u0648\\u0630\\u062C \\u0627\\u0644\\u0635\\u0646\\u062F\\u0648\\u0642\",questions:[{type:\"order\",subject:\"CSS\",difficulty:\"Intermediate\",tier:\"core\",dir:\"ltr\",en:{prompt:\"Arrange the CSS box model from the inside out.\",items:[\"margin\",\"content\",\"border\",\"padding\"],correct:[\"content\",\"padding\",\"border\",\"margin\"]},ar:{prompt:\"\\u0631\\u062A\\u0651\\u0628 \\u0645\\u0643\\u0648\\u0646\\u0627\\u062A \\u0627\\u0644\\u0640 CSS box model \\u0645\\u0646 \\u0627\\u0644\\u062C\\u0648\\u0647 \\u0644\\u0644\\u0628\\u0631\\u0651\\u0647.\",items:[\"margin\",\"content\",\"border\",\"padding\"],correct:[\"content\",\"padding\",\"border\",\"margin\"]}}]},{id:\"b1c\",level:\"leaf\",parent:\"b1\",x:629,y:St,en:\"Units\",ar:\"\\u0627\\u0644\\u0648\\u062D\\u062F\\u0627\\u062A\",questions:[{type:\"multi\",subject:\"CSS\",difficulty:\"Intermediate\",tier:\"core\",dir:\"ltr\",en:{prompt:\"Select every value that is a valid CSS length or size unit.\",options:[\"px\",\"rgb\",\"em\",\"vh\",\"deg\"],correct:[0,2,3]},ar:{prompt:\"\\u0627\\u062E\\u062A\\u0627\\u0631 \\u0643\\u0644 \\u0642\\u064A\\u0645\\u0629 \\u062A\\u0639\\u062A\\u0628\\u0631 \\u0648\\u062D\\u062F\\u0629 \\u0637\\u0648\\u0644 \\u0623\\u0648 \\u062D\\u062C\\u0645 \\u0635\\u062D\\u064A\\u062D\\u0629 \\u0641\\u064A CSS.\",options:[\"px\",\"rgb\",\"em\",\"vh\",\"deg\"],correct:[0,2,3]}}]},{id:\"b2a\",level:\"leaf\",parent:\"b2\",x:743,y:St,en:\"Matching\",ar:\"\\u0627\\u0644\\u062A\\u0648\\u0635\\u064A\\u0644\",questions:[{type:\"match\",subject:\"CSS\",difficulty:\"Intermediate\",tier:\"core\",dir:\"ltr\",en:{prompt:\"Match each selector to what it targets.\",left:[\".card\",\"#hero\",\"*\",\"a:hover\"],right:[\"A link while the pointer is over it\",\"Every element on the page\",\"A single unique element by id\",\"Any element with a given class\"],correct:[3,2,1,0]},ar:{prompt:\"\\u0648\\u0635\\u0651\\u0644 \\u0643\\u0644 selector \\u0628\\u0627\\u0644\\u0644\\u064A \\u0628\\u064A\\u0633\\u062A\\u0647\\u062F\\u0641\\u0647.\",left:[\".card\",\"#hero\",\"*\",\"a:hover\"],right:[\"\\u0644\\u064A\\u0646\\u0643 \\u0648\\u0642\\u062A \\u0645\\u0627 \\u0627\\u0644\\u0645\\u0624\\u0634\\u0631 \\u0641\\u0648\\u0642\\u0647\",\"\\u0643\\u0644 \\u0639\\u0646\\u0635\\u0631 \\u0641\\u064A \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\",\"\\u0639\\u0646\\u0635\\u0631 \\u0648\\u0627\\u062D\\u062F \\u0641\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u0640 id\",\"\\u0623\\u064A \\u0639\\u0646\\u0635\\u0631 \\u0628\\u0643\\u0644\\u0627\\u0633 \\u0645\\u0639\\u064A\\u0651\\u0646\"],correct:[3,2,1,0]}}]}]},{id:\"js-deep-dive\",cover:{from:\"#6EE7B7\",to:\"#1F6B47\",icon:\"brackets\"},en:{title:\"JavaScript Deep Dive\",tagline:\"Arrays, async, and a gut check.\"},ar:{title:\"\\u062C\\u0627\\u0641\\u0627\\u0633\\u0643\\u0631\\u064A\\u0628\\u062A \\u0628\\u0639\\u0645\\u0642\",tagline:\"\\u0645\\u0635\\u0641\\u0648\\u0641\\u0627\\u062A\\u060C \\u0628\\u0631\\u0645\\u062C\\u0629 \\u063A\\u064A\\u0631 \\u0645\\u062A\\u0632\\u0627\\u0645\\u0646\\u0629\\u060C \\u0648\\u062A\\u0642\\u064A\\u064A\\u0645 \\u0630\\u0627\\u062A\\u064A.\"},crossLinks:[[\"a1a\",\"b1a\"]],nodes:[{id:\"a\",level:\"branch\",x:267,y:Nn,en:\"Fundamentals\",ar:\"\\u0627\\u0644\\u0623\\u0633\\u0627\\u0633\\u064A\\u0627\\u062A\"},{id:\"b\",level:\"branch\",x:667,y:Nn,en:\"Reflection\",ar:\"\\u062A\\u0623\\u0645\\u0651\\u0644\"},{id:\"a1\",level:\"sub\",parent:\"a\",x:133,y:Oa,en:\"Arrays\",ar:\"\\u0627\\u0644\\u0645\\u0635\\u0641\\u0648\\u0641\\u0627\\u062A\"},{id:\"a2\",level:\"sub\",parent:\"a\",x:400,y:Oa,en:\"Async\",ar:\"\\u063A\\u064A\\u0631 \\u0645\\u062A\\u0632\\u0627\\u0645\\u0646\"},{id:\"b1\",level:\"sub\",parent:\"b\",x:667,y:Oa,en:\"Self-check\",ar:\"\\u062A\\u0642\\u064A\\u064A\\u0645 \\u0630\\u0627\\u062A\\u064A\"},{id:\"a1a\",level:\"leaf\",parent:\"a1\",x:133,y:St,en:\"Array methods\",ar:\"\\u062F\\u0648\\u0627\\u0644 \\u0627\\u0644\\u0645\\u0635\\u0641\\u0648\\u0641\\u0627\\u062A\",cards:[{id:\"a1a-card1\",image:\"https://picsum.photos/seed/array-methods/480/480\",imagePosition:\"right\",questions:[{type:\"cloze\",subject:\"JavaScript\",difficulty:\"Intermediate\",tier:\"extra\",dir:\"rtl\",en:{template:\"The ___ method returns the first array element that satisfies a condition.\",bank:[\"find\",\"filter\",\"map\",\"reduce\"],correct:\"find\"},ar:{template:\"\\u0627\\u0644\\u062F\\u0627\\u0644\\u0629 ___ \\u0628\\u062A\\u0631\\u062C\\u0639 \\u0623\\u0648\\u0644 \\u0639\\u0646\\u0635\\u0631 \\u0641\\u064A \\u0627\\u0644\\u0645\\u0635\\u0641\\u0648\\u0641\\u0629 \\u0628\\u064A\\u062D\\u0642\\u0642 \\u0634\\u0631\\u0637 \\u0645\\u0639\\u064A\\u0651\\u0646.\",bank:[\"find\",\"filter\",\"map\",\"reduce\"],correct:\"find\"}},{type:\"numeric\",subject:\"JavaScript\",difficulty:\"Advanced\",tier:\"advanced\",dir:\"ltr\",en:{prompt:\"At most how many parameters can the callback passed to Array.prototype.reduce receive?\",correct:4,tolerance:0},ar:{prompt:\"\\u0623\\u062F \\u0627\\u064A\\u0647 \\u0623\\u0642\\u0635\\u0649 \\u0639\\u062F\\u062F \\u0628\\u0627\\u0631\\u0627\\u0645\\u064A\\u062A\\u0631\\u0627\\u062A \\u0645\\u0645\\u0643\\u0646 \\u0627\\u0644\\u0640 callback \\u0628\\u062A\\u0627\\u0639 reduce \\u064A\\u0627\\u062E\\u062F\\u0647\\u0627\\u061F\",correct:4,tolerance:0}}]}],questions:[]},{id:\"a2a\",level:\"leaf\",parent:\"a2\",x:400,y:St,en:\"Promises\",ar:\"\\u0627\\u0644\\u0640 Promises\",questions:[{type:\"essay\",subject:\"JavaScript\",difficulty:\"Advanced\",tier:\"extra\",dir:\"rtl\",en:{prompt:\"Explain the difference between synchronous and asynchronous code in JavaScript, and why we use Promises.\",model:\"Synchronous code runs top to bottom, blocking until each line finishes. Asynchronous code (like fetch()) lets the rest of the page keep running, and reports back through a Promise once the result is ready.\"},ar:{prompt:\"\\u0627\\u0634\\u0631\\u062D \\u0627\\u0644\\u0641\\u0631\\u0642 \\u0628\\u064A\\u0646 \\u0627\\u0644\\u0643\\u0648\\u062F \\u0627\\u0644\\u0640 Synchronous \\u0648\\u0627\\u0644\\u0640 Asynchronous \\u0641\\u064A \\u062C\\u0627\\u0641\\u0627\\u0633\\u0643\\u0631\\u064A\\u0628\\u062A\\u060C \\u0648\\u0644\\u064A\\u0629 \\u0628\\u0646\\u0633\\u062A\\u062E\\u062F\\u0645 Promises.\",model:\"\\u0627\\u0644\\u0643\\u0648\\u062F \\u0627\\u0644\\u0645\\u062A\\u0632\\u0627\\u0645\\u0646 \\u0628\\u064A\\u062A\\u0646\\u0641\\u0630 \\u0633\\u0637\\u0631 \\u0633\\u0637\\u0631 \\u0648\\u0645\\u062D\\u062F\\u0634 \\u0628\\u064A\\u0643\\u0645\\u0644 \\u0642\\u0628\\u0644 \\u0645\\u0627 \\u0627\\u0644\\u0644\\u064A \\u0642\\u0628\\u0644\\u0647 \\u064A\\u062E\\u0644\\u0635. \\u0627\\u0644\\u0643\\u0648\\u062F \\u0627\\u0644\\u063A\\u064A\\u0631 \\u0645\\u062A\\u0632\\u0627\\u0645\\u0646 \\u0632\\u064A fetch() \\u0628\\u064A\\u0633\\u0645\\u062D \\u0644\\u0644\\u0635\\u0641\\u062D\\u0629 \\u062A\\u0643\\u0645\\u0644 \\u0634\\u063A\\u0644\\u0647\\u0627 \\u0645\\u0646 \\u063A\\u064A\\u0631 \\u0645\\u0627 \\u062A\\u062A\\u0648\\u0642\\u0641\\u060C \\u0648\\u0628\\u064A\\u0631\\u062C\\u0639 \\u0627\\u0644\\u0646\\u062A\\u064A\\u062C\\u0629 \\u0639\\u0646 \\u0637\\u0631\\u064A\\u0642 Promise \\u0644\\u0645\\u0627 \\u062A\\u062C\\u0647\\u0632.\"}}]},{id:\"b1a\",level:\"leaf\",parent:\"b1\",x:667,y:St,en:\"Confidence\",ar:\"\\u0627\\u0644\\u062B\\u0642\\u0629\",questions:[{type:\"rating\",subject:\"Self-check\",difficulty:\"Reflection\",tier:\"extra\",dir:\"ltr\",en:{prompt:\"How confident do you feel about CSS Grid right now?\"},ar:{prompt:\"\\u0623\\u062F \\u0627\\u064A\\u0647 \\u0625\\u062D\\u0633\\u0627\\u0633\\u0643 \\u0628\\u0627\\u0644\\u062B\\u0642\\u0629 \\u0641\\u064A CSS Grid \\u062F\\u0644\\u0648\\u0642\\u062A\\u064A\\u061F\"}},{type:\"slider\",subject:\"CSS\",difficulty:\"Intermediate\",tier:\"core\",dir:\"ltr\",en:{prompt:\"Drag the slider to the opacity value that makes an element exactly half transparent.\",min:0,max:1,step:.05,correct:.5,tolerance:.05},ar:{prompt:\"\\u062D\\u0631\\u0651\\u0643 \\u0627\\u0644\\u0633\\u0644\\u0627\\u064A\\u062F\\u0631 \\u0644\\u0642\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0640 opacity \\u0627\\u0644\\u0644\\u064A \\u0628\\u062A\\u062E\\u0644\\u064A \\u0627\\u0644\\u0639\\u0646\\u0635\\u0631 \\u0634\\u0641\\u0627\\u0641 \\u0628\\u0646\\u0635 \\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0628\\u0627\\u0644\\u0638\\u0628\\u0637.\",min:0,max:1,step:.05,correct:.5,tolerance:.05}}]}]}];function za(e,t,a){var o,r;switch(e.type){case\"single\":return a===t.correct;case\"multi\":return Array.isArray(a)?[...a].sort().join(\",\")===[...t.correct].sort().join(\",\"):!1;case\"tf\":return a===t.correct;case\"short\":return t.accepted.includes(String(a||\"\").trim().toLowerCase());case\"fill\":return t.blanks.every((l,s)=>(a[s]||\"\").trim().toLowerCase()===l.toLowerCase());case\"cloze\":return a===t.correct;case\"match\":return t.left.every((l,s)=>a[s]===t.correct[s]);case\"order\":return t.correct.every((l,s)=>a[s]===l);case\"sort\":return t.items.every((l,s)=>a[s]===l[1]);case\"numeric\":return Math.abs(Number(a)-t.correct)<=((o=t.tolerance)!=null?o:0);case\"slider\":return Math.abs(Number(a)-t.correct)<=((r=t.tolerance)!=null?r:0);default:return null}}function Ua(e){return e.cards?e.cards:e.questions.map((t,a)=>({id:`${e.id}-auto-${a}`,image:t.en&&t.en.image||t.ar&&t.ar.image||t.image||null,imagePosition:\"top\",video:t.video||null,audio:t.audio||null,questions:[t]}))}function ip(){return{targetCount:null,targetDate:null,startDate:null,doneLeafIds:[],log:{}}}function Rn(e){let t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,\"0\"),o=String(e.getDate()).padStart(2,\"0\");return`${t}-${a}-${o}`}function pi(e){let[t,a,o]=e.split(\"-\").map(Number);return new Date(t,a-1,o)}function ci(e,t){return Math.round((pi(t)-pi(e))/864e5)}function Sx(e){let t=e.getFullYear(),a=e.getMonth(),o=new Date(t,a,1),r=new Date(t,a+1,0).getDate(),l=[];for(let u=0;u<o.getDay();u++)l.push(null);for(let u=1;u<=r;u++)l.push(new Date(t,a,u));for(;l.length%7!==0;)l.push(null);let s=[];for(let u=0;u<l.length;u+=7)s.push(l.slice(u,u+7));return s}function kp(){return typeof window!=\"undefined\"&&window.__EDUCRAFT_EXPORT__||null}var vp=(()=>{let e=kp();return e?\"educraft-export-\"+e.id:\"educraft-app-state-v1\"})();function Cx(){if(typeof window==\"undefined\")return{};try{return JSON.parse(window.localStorage.getItem(vp))||{}}catch(e){return{}}}function dp(e){if(typeof window!=\"undefined\")try{window.localStorage.setItem(vp,JSON.stringify(e))}catch(t){}}function Ix(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}function Fx(e,t){let a=new Set(e.flatMap(o=>o.itemIds));return{rootCollections:e.filter(o=>!a.has(o.id)),rootBooks:t.filter(o=>!a.has(o.id))}}function Sp({ok:e,ui:t,onRetry:a,skin:o=Ct.normal}){return(0,n.jsxs)(\"div\",{className:\"flex flex-wrap items-center gap-3 border-2 px-4 py-3 text-sm font-semibold\",style:{borderRadius:o.radiusLg,...e?{background:Q.bg,borderColor:Q.border,color:Q.border}:{background:Z.bg,borderColor:Z.border,color:Z.border}},children:[e?(0,n.jsx)(it,{size:16}):(0,n.jsx)(ct,{size:16}),(0,n.jsx)(\"span\",{className:\"flex-1\",children:e?t.correctMsg:t.incorrectMsg}),(0,n.jsxs)(\"button\",{onClick:a,className:\"flex items-center gap-1 border-2 border-current px-3 py-1.5 text-xs font-bold\",style:{minHeight:32,borderRadius:o.radiusSm},children:[(0,n.jsx)(Bo,{size:12}),\" \",t.tryAgain]})]})}function xi({children:e,state:t,onClick:a,theme:o,dir:r,disabled:l,skin:s=Ct.normal}){let u={borderColor:o.hairlineStrong,background:o.canvas,color:o.ink};return t===\"correct\"?u={background:Q.bg,borderColor:Q.border,color:Q.border}:t===\"incorrect\"?u={background:Z.bg,borderColor:Z.border,color:Z.border}:t===\"selected\"&&(u={background:o.ink,borderColor:o.ink,color:o.canvas}),(0,n.jsx)(\"button\",{dir:r,onClick:a,disabled:l,className:\"w-full text-start border-2 px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed\",style:{...u,minHeight:44,borderRadius:s.radiusMd},children:e})}function Cp({c:e,dir:t,value:a,setValue:o,checked:r,theme:l,skin:s=Ct.normal}){return(0,n.jsx)(\"div\",{className:\"flex flex-col gap-2.5\",children:e.options.map((u,i)=>{let d;return r?d=i===e.correct?\"correct\":i===a?\"incorrect\":void 0:d=i===a?\"selected\":void 0,(0,n.jsx)(xi,{dir:t,theme:l,skin:s,state:d,disabled:r,onClick:()=>!r&&o(i),children:u},i)})})}function Ip({c:e,dir:t,value:a=[],setValue:o,checked:r,theme:l,skin:s=Ct.normal}){let u=i=>!r&&o(a.includes(i)?a.filter(d=>d!==i):[...a,i]);return(0,n.jsx)(\"div\",{className:\"flex flex-col gap-2.5\",children:e.options.map((i,d)=>{let p,f=a.includes(d),g=e.correct.includes(d);return r&&(f||g)?p=g&&f?\"correct\":\"incorrect\":f&&(p=\"selected\"),(0,n.jsx)(xi,{dir:t,theme:l,skin:s,state:p,disabled:r,onClick:()=>u(d),children:i},d)})})}function Fp({c:e,value:t,setValue:a,checked:o,lang:r,theme:l,skin:s=Ct.normal}){return(0,n.jsx)(\"div\",{className:\"grid grid-cols-2 gap-3\",children:[!0,!1].map(u=>{let i=u?r===\"ar\"?\"\\u0635\\u062D\":\"True\":r===\"ar\"?\"\\u063A\\u0644\\u0637\":\"False\",d;return o?d=u===e.correct?\"correct\":u===t?\"incorrect\":void 0:d=t===u?\"selected\":void 0,(0,n.jsx)(xi,{theme:l,skin:s,state:d,disabled:o,onClick:()=>!o&&a(u),children:(0,n.jsx)(\"span\",{className:\"block text-center font-bold text-base\",children:i})},i)})})}function wp({c:e,dir:t,value:a=\"\",setValue:o,checked:r,ui:l,theme:s}){let u=r?za({type:\"short\"},e,a):null;return(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"input\",{dir:t,disabled:r,value:a,onChange:i=>o(i.target.value),placeholder:\"\\u2026\",className:\"w-full rounded-2xl border-2 px-4 py-3 text-sm font-medium outline-none\",style:{borderColor:r?u?Q.border:Z.border:s.hairlineStrong,background:r?u?Q.bg:Z.bg:s.canvas,color:s.ink,minHeight:44}}),r&&!u&&(0,n.jsxs)(\"p\",{className:\"mt-2 text-sm\",style:{color:s.inkSoft},children:[l.accepted,\": \",e.accepted.join(\", \")]})]})}function bp({c:e,dir:t,value:a=\"\",setValue:o,ui:r,theme:l}){let[s,u]=(0,D.useState)(!1);return(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-3\",children:[(0,n.jsx)(\"textarea\",{dir:t,value:a,onChange:i=>o(i.target.value),rows:4,placeholder:\"\\u2026\",className:\"w-full resize-none rounded-2xl border-2 px-4 py-3 text-sm outline-none\",style:{borderColor:l.hairlineStrong,background:l.canvas,color:l.ink}}),(0,n.jsx)(\"button\",{onClick:()=>u(i=>!i),className:\"self-start rounded-full border-2 px-4 py-2 text-xs font-bold\",style:{borderColor:l.hairlineStrong,color:l.ink,minHeight:40},children:s?r.hideModel:r.revealModel}),s&&(0,n.jsx)(\"div\",{dir:t,className:\"rounded-2xl border-2 px-4 py-3 text-sm leading-relaxed\",style:{background:di.bg,borderColor:di.border,color:di.ink},children:e.model}),(0,n.jsx)(\"p\",{className:\"text-xs\",style:{color:l.inkSoft},children:r.selfGraded})]})}function Bp({c:e,dir:t,value:a=[],setValue:o,checked:r,theme:l}){let s=e.template.split(\"___\"),u=(i,d)=>{let p=[...a];p[i]=d,o(p)};return(0,n.jsx)(\"p\",{dir:t,className:\"flex flex-wrap items-center gap-2 text-base leading-loose\",style:{color:l.ink},children:s.map((i,d)=>(0,n.jsxs)(\"span\",{className:\"contents\",children:[(0,n.jsx)(\"span\",{children:i}),d<s.length-1&&(0,n.jsx)(\"input\",{dir:\"auto\",disabled:r,value:a[d]||\"\",onChange:p=>u(d,p.target.value),className:\"mx-1 w-24 rounded-lg border-2 px-2 py-1 text-center font-mono text-sm outline-none\",style:{borderColor:r?(a[d]||\"\").trim().toLowerCase()===e.blanks[d].toLowerCase()?Q.border:Z.border:l.hairlineStrong,background:r?(a[d]||\"\").trim().toLowerCase()===e.blanks[d].toLowerCase()?Q.bg:Z.bg:l.canvas,color:l.ink,minHeight:36}})]},d))})}function Ep({c:e,dir:t,value:a,setValue:o,checked:r,ui:l,theme:s}){let u=e.template.split(\"___\"),i=r?a===e.correct:null;return(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-4\",children:[(0,n.jsx)(\"p\",{dir:t,className:\"flex flex-wrap items-center gap-2 text-base leading-loose\",style:{color:s.ink},children:u.map((d,p)=>(0,n.jsxs)(\"span\",{className:\"contents\",children:[(0,n.jsx)(\"span\",{children:d}),p<u.length-1&&(0,n.jsx)(\"button\",{onClick:()=>!r&&o(void 0),disabled:r,className:\"mx-1 min-w-[80px] rounded-lg border-2 border-dashed px-3 py-1 font-mono text-sm\",style:{borderColor:r?i?Q.border:Z.border:s.hairlineStrong,background:r?i?Q.bg:Z.bg:s.canvas,color:s.ink},children:a||\"?\"})]},p))}),(0,n.jsx)(\"p\",{className:\"text-xs\",style:{color:s.inkSoft},children:l.bankHint}),(0,n.jsx)(\"div\",{className:\"flex flex-wrap gap-2\",children:e.bank.map(d=>(0,n.jsx)(\"button\",{dir:\"ltr\",disabled:r||a===d,onClick:()=>o(d),className:\"rounded-full border-2 px-4 py-2 font-mono text-sm font-semibold disabled:opacity-30\",style:{borderColor:s.hairlineStrong,background:s.canvas,color:s.ink,minHeight:40},children:d},d))})]})}function Dp({c:e,value:t={},setValue:a,checked:o,ui:r,theme:l}){let[s,u]=(0,D.useState)(null),i=Object.values(t),d=f=>{if(!o){if(t[f]!==void 0){let g={...t};delete g[f],a(g);return}u(f)}},p=f=>{o||s===null||i.includes(f)||(a({...t,[s]:f}),u(null))};return(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-3\",children:[(0,n.jsx)(\"p\",{className:\"text-xs\",style:{color:l.inkSoft},children:r.matchHint}),(0,n.jsxs)(\"div\",{className:\"grid grid-cols-2 gap-3\",children:[(0,n.jsx)(\"div\",{className:\"flex flex-col gap-2\",children:e.left.map((f,g)=>{let y={borderColor:l.hairlineStrong,background:l.canvas,color:l.ink};return o?y=e.correct[g]===t[g]?{background:Q.bg,borderColor:Q.border,color:Q.border}:{background:Z.bg,borderColor:Z.border,color:Z.border}:s===g?y={background:l.ink,borderColor:l.ink,color:l.canvas}:t[g]!==void 0&&(y={borderColor:l.accent,background:l.canvas,color:l.ink}),(0,n.jsxs)(\"button\",{onClick:()=>d(g),className:\"rounded-2xl border-2 px-3 py-2.5 text-start font-mono text-sm font-bold\",style:{...y,minHeight:44},children:[f,t[g]!==void 0&&(0,n.jsxs)(\"span\",{className:\"block text-xs font-normal opacity-70 mt-0.5\",children:[\"\\u2192 \",e.right[t[g]]]})]},g)})}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-2\",children:e.right.map((f,g)=>(0,n.jsx)(\"button\",{disabled:o||i.includes(g),onClick:()=>p(g),className:\"rounded-2xl border-2 px-3 py-2.5 text-start text-sm disabled:opacity-40\",style:{borderColor:l.hairlineStrong,background:l.canvas,color:l.ink,minHeight:44},children:f},g))})]})]})}function Tp({c:e,value:t,setValue:a,checked:o,ui:r,theme:l}){let s=t||e.items,u=(i,d)=>{if(o)return;let p=i+d;if(p<0||p>=s.length)return;let f=[...s];[f[i],f[p]]=[f[p],f[i]],a(f)};return(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-3\",children:[(0,n.jsx)(\"p\",{className:\"text-xs\",style:{color:l.inkSoft},children:r.orderHint}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-2\",children:s.map((i,d)=>{let p=o?e.correct[d]===i?\"correct\":\"incorrect\":null,f=p===\"correct\"?{background:Q.bg,borderColor:Q.border}:p===\"incorrect\"?{background:Z.bg,borderColor:Z.border}:{background:l.canvas,borderColor:l.hairlineStrong};return(0,n.jsxs)(\"div\",{className:\"flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5\",style:{...f,color:l.ink},children:[(0,n.jsx)(\"span\",{className:\"grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-xs font-bold\",style:{background:l.ink,color:l.canvas},children:d+1}),(0,n.jsx)(\"span\",{className:\"flex-1 font-mono text-sm font-semibold\",children:i}),(0,n.jsxs)(\"div\",{className:\"flex flex-col\",children:[(0,n.jsx)(\"button\",{\"aria-label\":r.prev,disabled:o||d===0,onClick:()=>u(d,-1),className:\"disabled:opacity-20\",style:{color:l.inkSoft},children:(0,n.jsx)(Co,{size:15})}),(0,n.jsx)(\"button\",{\"aria-label\":r.next,disabled:o||d===s.length-1,onClick:()=>u(d,1),className:\"disabled:opacity-20\",style:{color:l.inkSoft},children:(0,n.jsx)(vo,{size:15})})]})]},i)})})]})}function Ap({c:e,value:t={},setValue:a,checked:o,ui:r,theme:l}){let[s,u]=(0,D.useState)(null),i=e.items.filter((f,g)=>t[g]===void 0),d=f=>{o||s===null||(a({...t,[s]:f}),u(null))},p=f=>{if(o)return;let g={...t};delete g[f],a(g)};return(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-4\",children:[(0,n.jsx)(\"p\",{className:\"text-xs\",style:{color:l.inkSoft},children:r.sortHint}),(0,n.jsxs)(\"div\",{className:\"flex flex-wrap gap-2 rounded-2xl border-2 border-dashed p-3 min-h-[52px]\",style:{borderColor:l.hairlineStrong},children:[i.length===0&&(0,n.jsx)(\"span\",{className:\"text-xs\",style:{color:l.inkSoft},children:\"\\u2014\"}),e.items.map(([f],g)=>t[g]===void 0?(0,n.jsx)(\"button\",{onClick:()=>u(s===g?null:g),className:\"rounded-full border-2 px-3 py-1.5 font-mono text-sm font-semibold\",style:s===g?{background:l.ink,color:l.canvas,borderColor:l.ink}:{borderColor:l.hairlineStrong,color:l.ink},children:f},g):null)]}),(0,n.jsx)(\"div\",{className:\"grid grid-cols-2 gap-3\",children:e.bins.map(f=>(0,n.jsxs)(\"button\",{onClick:()=>d(f),className:\"flex min-h-[100px] flex-col gap-2 rounded-2xl border-2 p-3 text-start\",style:{borderColor:l.hairlineStrong,background:l.canvas},children:[(0,n.jsx)(\"span\",{className:\"text-xs font-bold uppercase tracking-wide\",style:{color:l.inkSoft},children:f}),(0,n.jsx)(\"div\",{className:\"flex flex-wrap gap-1.5\",children:e.items.map(([g,y],k)=>{if(t[k]!==f)return null;let v=o?y===f?\"correct\":\"incorrect\":null,I=v===\"correct\"?{background:Q.bg,borderColor:Q.border}:v===\"incorrect\"?{background:Z.bg,borderColor:Z.border}:{background:\"transparent\",borderColor:l.hairlineStrong};return(0,n.jsx)(\"span\",{onClick:x=>{x.stopPropagation(),p(k)},className:\"rounded-full border-2 px-2.5 py-1 font-mono text-xs font-semibold\",style:{...I,color:l.ink},children:g},k)})})]},f))})]})}function Pp({c:e,value:t=\"\",setValue:a,checked:o,theme:r}){let l=o?za({type:\"numeric\"},e,t):null;return(0,n.jsx)(\"input\",{type:\"number\",inputMode:\"decimal\",disabled:o,value:t,onChange:s=>a(s.target.value),placeholder:\"0\",className:\"w-32 rounded-2xl border-2 px-4 py-3 text-center font-mono text-lg font-bold outline-none\",style:{borderColor:o?l?Q.border:Z.border:r.hairlineStrong,background:o?l?Q.bg:Z.bg:r.canvas,color:r.ink,minHeight:44}})}function Np({value:e=0,setValue:t}){return(0,n.jsx)(\"div\",{className:\"flex gap-2\",children:[1,2,3,4,5].map(a=>(0,n.jsx)(\"button\",{\"aria-label\":String(a),onClick:()=>t(a),style:{minHeight:40,minWidth:40},children:(0,n.jsx)(Eo,{size:28,fill:a<=e?\"#FCD34D\":\"none\",stroke:a<=e?\"#a8790c\":\"#14151A55\",strokeWidth:1.5})},a))})}function Mp({c:e,value:t,setValue:a,checked:o,theme:r}){let l=t!=null?t:(e.min+e.max)/2,s=o?za({type:\"slider\"},e,l):null;return(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-3\",children:[(0,n.jsx)(\"input\",{type:\"range\",min:e.min,max:e.max,step:e.step,disabled:o,value:l,onChange:u=>a(parseFloat(u.target.value)),className:\"w-full\",style:{accentColor:r.accent,minHeight:24}}),(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between text-sm\",children:[(0,n.jsx)(\"span\",{className:\"font-mono\",style:{color:r.inkSoft},children:e.min}),(0,n.jsx)(\"span\",{className:\"rounded-full border-2 px-3 py-1 font-mono text-sm font-bold\",style:{borderColor:o?s?Q.border:Z.border:r.hairlineStrong,background:o?s?Q.bg:Z.bg:r.canvas,color:r.ink},children:l}),(0,n.jsx)(\"span\",{className:\"font-mono\",style:{color:r.inkSoft},children:e.max})]})]})}function wx({q:e,lang:t,ui:a,theme:o,skin:r=Ct.normal,onAnswered:l}){let s=e[t],u=Ce[e.type],i=e.type===\"multi\"?[]:e.type===\"match\"||e.type===\"sort\"?{}:e.type===\"order\"?s.items:void 0,[d,p]=(0,D.useState)(i),[f,g]=(0,D.useState)(!1),y=e.type===\"essay\"||e.type===\"rating\",k=f&&!y?za(e,s,d):null,v=(0,D.useRef)(!1);(0,D.useEffect)(()=>{if(!y||v.current||!l)return;(e.type===\"rating\"?d!=null:typeof d==\"string\"&&d.trim().length>0)&&(v.current=!0,l(null))},[d]);let I=()=>{g(!0),!y&&l&&!v.current&&(v.current=!0,l(za(e,s,d)))},x=(()=>{switch(e.type){case\"single\":return(0,n.jsx)(Cp,{c:s,dir:s.dir||e.dir,value:d,setValue:p,checked:f,theme:o,skin:r});case\"multi\":return(0,n.jsx)(Ip,{c:s,dir:e.dir,value:d,setValue:p,checked:f,theme:o,skin:r});case\"tf\":return(0,n.jsx)(Fp,{c:s,value:d,setValue:p,checked:f,lang:t,theme:o,skin:r});case\"short\":return(0,n.jsx)(wp,{c:s,dir:e.dir,value:d,setValue:p,checked:f,ui:a,theme:o});case\"essay\":return(0,n.jsx)(bp,{c:s,dir:e.dir,value:d,setValue:p,ui:a,theme:o});case\"fill\":return(0,n.jsx)(Bp,{c:s,dir:e.dir,value:d,setValue:p,checked:f,theme:o});case\"cloze\":return(0,n.jsx)(Ep,{c:s,dir:e.dir,value:d,setValue:p,checked:f,ui:a,theme:o});case\"match\":return(0,n.jsx)(Dp,{c:s,value:d,setValue:p,checked:f,ui:a,theme:o});case\"order\":return(0,n.jsx)(Tp,{c:s,value:d,setValue:p,checked:f,ui:a,theme:o});case\"sort\":return(0,n.jsx)(Ap,{c:s,value:d,setValue:p,checked:f,ui:a,theme:o});case\"numeric\":return(0,n.jsx)(Pp,{c:s,value:d,setValue:p,checked:f,theme:o});case\"rating\":return(0,n.jsx)(Np,{value:d,setValue:p});case\"slider\":return(0,n.jsx)(Mp,{c:s,value:d,setValue:p,checked:f,theme:o});default:return null}})(),c=d===void 0?!1:Array.isArray(d)?d.length>0:typeof d==\"object\"?Object.keys(d).length>0:typeof d==\"string\"?d.trim().length>0:!0;return(0,n.jsxs)(\"div\",{className:\"p-4 sm:p-5 flex flex-col gap-3.5\",style:{background:u.color.bg,color:u.color.ink,borderRadius:r.radiusMd,border:r.pixel?`${r.borderW}px solid ${u.color.ink}`:\"none\",boxShadow:r.pixel?r.shadow:\"none\"},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(u.Icon,{size:14,strokeWidth:2.25,style:{opacity:.75}}),(0,n.jsxs)(\"span\",{className:\"text-[0.68rem] font-black uppercase tracking-wider\",style:{opacity:.75,letterSpacing:r.letterSpacing},children:[u[t],\" \\xB7 \",Lp[t][e.difficulty]]})]}),(0,n.jsx)(\"p\",{dir:e.dir,className:\"text-base font-semibold leading-relaxed\",children:s.prompt||s.template}),x,f&&!y&&(0,n.jsx)(Sp,{ok:k,ui:a,skin:r,onRetry:()=>g(!1)}),!y&&!f&&(0,n.jsx)(\"button\",{onClick:I,disabled:!c,className:\"self-start px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed\",style:{borderRadius:r.radiusSm,background:\"rgba(20,21,26,0.88)\",minHeight:44},children:a.checkAnswer})]})}function cp({group:e,lang:t,ui:a,theme:o,skin:r=Ct.normal,onAnswered:l}){let s=e.imagePosition||\"top\",u=!!e.image,i=!!e.video,d=!!e.audio,p=r.surfaceAlpha>=1?o.header:Hn(o.header,r.surfaceAlpha),f={...ft(r,o),background:p},g=(0,n.jsx)(\"div\",{className:\"flex flex-col gap-5 p-5 sm:p-6 flex-1 min-w-0\",style:{maxHeight:\"min(60vh, 540px)\",overflowY:\"auto\",WebkitOverflowScrolling:\"touch\"},children:e.questions.map((v,I)=>(0,n.jsx)(wx,{q:v,lang:t,ui:a,theme:o,skin:r,onAnswered:l?x=>l(e.id,I,x):void 0},I))}),y=i||d?(0,n.jsxs)(\"div\",{className:\"shrink-0 px-5 pt-5 sm:px-6 sm:pt-6 flex flex-col gap-3\",children:[i&&(0,n.jsx)(\"video\",{src:e.video,controls:!0,playsInline:!0,className:\"w-full\",style:{borderRadius:r.radiusSm||10,display:\"block\",maxHeight:360}}),d&&(0,n.jsx)(\"audio\",{src:e.audio,controls:!0,className:\"w-full\",style:{display:\"block\"}})]}):null;if(!u)return(0,n.jsxs)(\"div\",{className:\"overflow-hidden\",style:f,children:[y,g]});let k=v=>(0,n.jsx)(\"div\",{className:\"shrink-0\",style:v?{width:\"100%\",aspectRatio:\"16/9\"}:{width:\"38%\",minWidth:110,alignSelf:\"stretch\"},children:(0,n.jsx)(\"img\",{src:e.image,alt:\"\",className:\"w-full h-full\",style:{objectFit:\"cover\",objectPosition:\"center\",display:\"block\"}})});return s===\"top\"?(0,n.jsxs)(\"div\",{className:\"overflow-hidden\",style:f,children:[k(!0),y,g]}):(0,n.jsxs)(\"div\",{className:\"overflow-hidden flex flex-col sm:flex-row\",style:f,children:[s===\"left\"&&k(!1),(0,n.jsxs)(\"div\",{className:\"flex flex-col flex-1 min-w-0\",children:[y,g]}),s===\"right\"&&k(!1)]})}function bx({q:e,lang:t,ui:a,theme:o,skin:r=Ct.normal,onAnswered:l}){let s=e[t],u=Ce[e.type],i=e.type===\"multi\"?[]:e.type===\"match\"||e.type===\"sort\"?{}:e.type===\"order\"?s.items:void 0,[d,p]=(0,D.useState)(i),[f,g]=(0,D.useState)(!1),y=e.type===\"essay\"||e.type===\"rating\",k=f&&!y?za(e,s,d):null,v=s.image||e.image,I=(0,D.useRef)(!1);(0,D.useEffect)(()=>{if(!y||I.current||!l)return;(e.type===\"rating\"?d!=null:typeof d==\"string\"&&d.trim().length>0)&&(I.current=!0,l(null))},[d]);let x=()=>{g(!0),!y&&l&&!I.current&&(I.current=!0,l(za(e,s,d)))},c=(()=>{switch(e.type){case\"single\":return(0,n.jsx)(Cp,{c:s,dir:s.dir||e.dir,value:d,setValue:p,checked:f,theme:o,skin:r});case\"multi\":return(0,n.jsx)(Ip,{c:s,dir:e.dir,value:d,setValue:p,checked:f,theme:o,skin:r});case\"tf\":return(0,n.jsx)(Fp,{c:s,value:d,setValue:p,checked:f,lang:t,theme:o,skin:r});case\"short\":return(0,n.jsx)(wp,{c:s,dir:e.dir,value:d,setValue:p,checked:f,ui:a,theme:o});case\"essay\":return(0,n.jsx)(bp,{c:s,dir:e.dir,value:d,setValue:p,ui:a,theme:o});case\"fill\":return(0,n.jsx)(Bp,{c:s,dir:e.dir,value:d,setValue:p,checked:f,theme:o});case\"cloze\":return(0,n.jsx)(Ep,{c:s,dir:e.dir,value:d,setValue:p,checked:f,ui:a,theme:o});case\"match\":return(0,n.jsx)(Dp,{c:s,value:d,setValue:p,checked:f,ui:a,theme:o});case\"order\":return(0,n.jsx)(Tp,{c:s,value:d,setValue:p,checked:f,ui:a,theme:o});case\"sort\":return(0,n.jsx)(Ap,{c:s,value:d,setValue:p,checked:f,ui:a,theme:o});case\"numeric\":return(0,n.jsx)(Pp,{c:s,value:d,setValue:p,checked:f,theme:o});case\"rating\":return(0,n.jsx)(Np,{value:d,setValue:p});case\"slider\":return(0,n.jsx)(Mp,{c:s,value:d,setValue:p,checked:f,theme:o});default:return null}})(),m=d===void 0?!1:Array.isArray(d)?d.length>0:typeof d==\"object\"?Object.keys(d).length>0:typeof d==\"string\"?d.trim().length>0:!0;return(0,n.jsxs)(\"div\",{className:\"p-5 sm:p-6 flex flex-col gap-4\",style:{background:u.color.bg,color:u.color.ink,borderRadius:r.radiusLg,border:r.pixel?`${r.borderW}px solid ${u.color.ink}`:\"none\",boxShadow:r.pixel?r.shadow:\"none\"},children:[(0,n.jsxs)(\"div\",{className:\"flex flex-wrap items-start justify-between gap-3\",children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(u.Icon,{size:16,strokeWidth:2.25,style:{opacity:.75}}),(0,n.jsxs)(\"div\",{className:\"flex flex-col leading-tight\",children:[(0,n.jsxs)(\"span\",{className:\"text-xs font-black uppercase tracking-wider\",style:{opacity:.75,letterSpacing:r.letterSpacing},children:[u[t],\" // \",e.subject]}),(0,n.jsxs)(\"span\",{className:\"text-[0.7rem] font-bold uppercase tracking-wide\",style:{opacity:.55},children:[Lp[t][e.difficulty],\" \\xB7 \",kx[t][e.tier]]})]})]}),(0,n.jsxs)(\"span\",{dir:\"ltr\",className:\"flex items-center gap-1 px-2 py-1 text-[0.65rem] font-bold\",style:{borderRadius:r.radiusSm,background:\"rgba(255,255,255,0.5)\"},children:[(0,n.jsx)(So,{size:11}),\" \",e.dir===\"rtl\"?\"RTL\":\"LTR\"]})]}),(0,n.jsx)(\"p\",{dir:e.dir,className:\"text-base font-semibold leading-relaxed\",children:s.prompt||s.template}),v&&(0,n.jsx)(\"div\",{className:\"w-full overflow-hidden shrink-0\",style:{borderRadius:r.radiusMd,aspectRatio:\"16/9\",border:r.pixel?`${r.borderW}px solid ${u.color.ink}`:\"none\"},children:(0,n.jsx)(\"img\",{src:v,alt:\"\",className:\"w-full h-full\",style:{objectFit:\"cover\",objectPosition:\"center\",display:\"block\"}})}),c,f&&!y&&(0,n.jsx)(Sp,{ok:k,ui:a,skin:r,onRetry:()=>g(!1)}),!y&&!f&&(0,n.jsx)(\"button\",{onClick:x,disabled:!m,className:\"self-start px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed\",style:{borderRadius:r.radiusSm,background:\"rgba(20,21,26,0.88)\",minHeight:44},children:a.checkAnswer})]})}function Bx({node:e,book:t,lang:a,ui:o,theme:r,dir:l,skin:s,cardMode:u=\"paged\",scrollDir:i=\"vertical\"}){let[d,p]=(0,D.useState)(0),f=(0,D.useMemo)(()=>Ua(e),[e]),g=f.length>1,y=l===\"rtl\"?Ma:ca,k=l===\"rtl\"?ca:Ma,v=u===\"scroll\"&&g,I=v&&i===\"horizontal\",x=f.reduce((c,m)=>c+m.questions.length,0);return(0,D.useEffect)(()=>p(0),[e.id]),(0,n.jsxs)(\"div\",{className:\"overflow-hidden educraft-panel-in\",style:ft(s,r),children:[(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between gap-3 px-5 py-3.5 flex-wrap\",style:{borderBottom:`1px solid ${de(s,r)}`,background:yp(s,r,!0)},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2 min-w-0\",children:[(0,n.jsx)(Hr,{size:16,color:r.accent,strokeWidth:2}),(0,n.jsxs)(\"div\",{className:\"flex flex-col leading-tight min-w-0\",children:[(0,n.jsx)(\"span\",{className:\"text-xs font-semibold truncate\",style:{color:r.inkSoft},children:t[a].title}),(0,n.jsx)(\"span\",{className:\"text-sm font-bold truncate\",style:{color:r.ink},children:e[a]})]})]}),g&&!v&&(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2 shrink-0\",children:[(0,n.jsxs)(\"span\",{className:\"text-xs font-semibold px-2.5 py-1\",style:{borderRadius:s.radiusSm,background:r.canvas,color:r.inkSoft},children:[o.deckQuestion,\" \",d+1,\" \",o.deckOf,\" \",f.length]}),(0,n.jsx)(\"button\",{\"aria-label\":o.prev,onClick:()=>p(c=>Math.max(0,c-1)),disabled:d===0,className:\"grid place-items-center disabled:opacity-30\",style:{width:32,height:32,borderRadius:s.radiusSm,border:`1px solid ${de(s,r)}`,color:r.ink},children:(0,n.jsx)(k,{size:15})}),(0,n.jsx)(\"button\",{\"aria-label\":o.next,onClick:()=>p(c=>Math.min(f.length-1,c+1)),disabled:d===f.length-1,className:\"grid place-items-center disabled:opacity-30\",style:{width:32,height:32,borderRadius:s.radiusSm,border:`1px solid ${de(s,r)}`,color:r.ink},children:(0,n.jsx)(y,{size:15})})]}),v&&(0,n.jsxs)(\"span\",{className:\"flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 shrink-0\",style:{borderRadius:s.radiusSm,background:r.canvas,color:r.inkSoft},children:[I?(0,n.jsx)(Rt,{size:12}):(0,n.jsx)(vt,{size:12}),x,\" \",o.questionsLabel]})]}),v?(0,n.jsx)(\"div\",{className:\"p-2.5 sm:p-3.5 flex gap-3\",style:{flexDirection:I?\"row\":\"column\",overflowX:I?\"auto\":\"visible\",overflowY:I?\"visible\":\"auto\",maxHeight:I?\"none\":\"min(70vh, 640px)\",scrollSnapType:I?\"x mandatory\":\"none\",WebkitOverflowScrolling:\"touch\"},children:f.map((c,m)=>(0,n.jsx)(\"div\",{style:I?{flex:\"0 0 min(88vw, 420px)\",scrollSnapAlign:\"start\"}:void 0,children:(0,n.jsx)(cp,{group:c,lang:a,ui:o,theme:r,skin:s})},c.id||`${e.id}-${m}`))}):(0,n.jsx)(\"div\",{className:\"p-2.5 sm:p-3.5\",children:(0,n.jsx)(cp,{group:f[d],lang:a,ui:o,theme:r,skin:s},f[d].id||`${e.id}-${d}`)}),g&&!v&&(0,n.jsx)(\"div\",{className:\"flex items-center justify-center gap-1.5 pb-4\",children:f.map((c,m)=>(0,n.jsx)(\"button\",{\"aria-label\":`${o.deckQuestion} ${m+1}`,onClick:()=>p(m),className:\"transition-all\",style:{width:m===d?18:6,height:6,borderRadius:s.radiusSm,background:m===d?r.accent:r.hairlineStrong}},m))})]})}function Ex({book:e,lang:t,dir:a,theme:o,ui:r,skin:l,selected:s,onSelect:u}){let[i,d]=(0,D.useState)(null),p=e.nodes,f=(0,D.useMemo)(()=>{let c=p.filter(h=>h.parent).map(h=>({from:h.parent,to:h.id,type:\"branch\"})),m=e.crossLinks.map(([h,L])=>({from:h,to:L,type:\"link\"}));return[...c,...m]},[e]),g=(0,D.useMemo)(()=>Object.fromEntries(p.map(c=>[c.id,c])),[p]),y=c=>({x:a===\"rtl\"?sp-c.x:c.x,y:c.y}),k=i||s,v=c=>k&&(c.from===k||c.to===k),I=c=>k&&(c===k||f.some(m=>m.from===k&&m.to===c||m.to===k&&m.from===c)),x={branch:{w:168,h:42,r:21,fs:13,fw:700},sub:{w:148,h:36,r:14,fs:12,fw:600},leaf:{w:130,h:40,r:12,fs:11.5,fw:600}};return(0,n.jsxs)(\"div\",{children:[(0,n.jsxs)(\"svg\",{viewBox:`0 0 ${sp} ${up}`,className:\"w-full\",style:{overflow:\"visible\"},role:\"img\",\"aria-label\":r.treeEyebrow,children:[f.map((c,m)=>{let h=y(g[c.from]),L=y(g[c.to]),F=v(c),b=k&&!F;if(c.type===\"branch\"){let P=(h.y+L.y)/2,M=`M ${h.x} ${h.y+20} C ${h.x} ${P}, ${L.x} ${P}, ${L.x} ${L.y-20}`;return(0,n.jsx)(\"path\",{d:M,fill:\"none\",stroke:F?o.accent:o.hairlineStrong,strokeWidth:F?2.5:1.5,style:{opacity:b?.35:1,transition:\"all .18s ease\"}},m)}let C=Math.min(up-14,Math.min(h.y,L.y)+30),N=`M ${h.x} ${h.y+20} C ${h.x} ${C}, ${L.x} ${C}, ${L.x} ${L.y+20}`;return(0,n.jsx)(\"path\",{d:N,fill:\"none\",stroke:F?o.accent:o.inkSoft,strokeWidth:F?2.5:1.4,strokeDasharray:\"5 5\",style:{opacity:b?.2:.85,transition:\"all .18s ease\"}},m)}),p.map(c=>{let{x:m,y:h}=y(c),L=x[c.level],F=I(c.id),b=i===c.id,C=s===c.id,N=c.level===\"leaf\",P=c.level===\"branch\",M=N?Ua(c).reduce((U,q)=>U+q.questions.length,0):0,E=o.surface,H=o.hairlineStrong,_=o.ink;return P?(E=o.accent,H=\"transparent\",_=o.accentInk):N&&C?(E=o.accent,H=o.accent,_=o.accentInk):N&&(E=o.accentSoft,H=o.accent),(0,n.jsxs)(\"g\",{role:N?\"button\":void 0,tabIndex:N?0:-1,\"aria-label\":N?`${c[t]} \\u2014 ${M>1?r.multiCardBadge(M):\"\"}`:c[t],onMouseEnter:()=>d(c.id),onMouseLeave:()=>d(null),onFocus:()=>d(c.id),onBlur:()=>d(null),onClick:()=>N&&u(c.id),onKeyDown:U=>{N&&(U.key===\"Enter\"||U.key===\" \")&&(U.preventDefault(),u(c.id))},style:{cursor:N?\"pointer\":\"default\",outline:\"none\"},children:[(0,n.jsx)(\"rect\",{x:m-L.w/2,y:h-L.h/2,width:L.w,height:L.h,rx:l&&l.pixel?0:L.r,fill:E,stroke:H,strokeWidth:l&&l.pixel?2.5:1.5,style:{filter:b?\"brightness(1.05)\":\"none\",opacity:k&&!F?.4:1,transition:\"all .18s ease\",transformBox:\"fill-box\",transformOrigin:\"center\",transform:b||C?\"scale(1.05)\":\"scale(1)\"}}),(0,n.jsx)(\"text\",{x:m,y:h,textAnchor:\"middle\",dominantBaseline:\"central\",fontSize:L.fs,fontWeight:L.fw,fill:_,style:{fontFamily:\"inherit\",opacity:k&&!F?.5:1,transition:\"opacity .18s ease\",pointerEvents:\"none\"},children:c[t]}),M>1&&(0,n.jsxs)(\"g\",{style:{opacity:k&&!F?.5:1,transition:\"opacity .18s ease\",pointerEvents:\"none\"},children:[(0,n.jsx)(\"circle\",{cx:m+L.w/2-6,cy:h-L.h/2+2,r:10,fill:o.ink}),(0,n.jsx)(\"text\",{x:m+L.w/2-6,y:h-L.h/2+2,textAnchor:\"middle\",dominantBaseline:\"central\",fontSize:10,fontWeight:700,fill:o.canvas,children:M})]})]},c.id)})]}),(0,n.jsxs)(\"div\",{className:\"flex flex-wrap items-center gap-5 mt-4\",children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(\"span\",{className:\"inline-block rounded-full\",style:{width:22,height:10,background:o.accent}}),(0,n.jsx)(\"span\",{className:\"text-sm\",style:{color:o.inkSoft},children:r.legendBranch})]}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(\"span\",{className:\"inline-block rounded-full\",style:{width:18,height:10,background:o.accentSoft,border:`1.5px solid ${o.accent}`}}),(0,n.jsx)(\"span\",{className:\"text-sm\",style:{color:o.inkSoft},children:r.legendLeaf})]}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(\"svg\",{width:\"18\",height:\"6\",children:(0,n.jsx)(\"line\",{x1:\"0\",y1:\"3\",x2:\"18\",y2:\"3\",stroke:o.inkSoft,strokeWidth:\"1.6\",strokeDasharray:\"4 4\"})}),(0,n.jsx)(\"span\",{className:\"text-sm\",style:{color:o.inkSoft},children:r.legendLink})]})]})]})}function Dx({book:e,theme:t}){let{from:a,to:o,icon:r}=e.cover,l=`grad-${e.id}`;return(0,n.jsxs)(\"svg\",{viewBox:\"0 0 160 210\",className:\"w-full h-full\",role:\"img\",\"aria-hidden\":\"true\",children:[(0,n.jsx)(\"defs\",{children:(0,n.jsxs)(\"linearGradient\",{id:l,x1:\"0\",y1:\"0\",x2:\"1\",y2:\"1\",children:[(0,n.jsx)(\"stop\",{offset:\"0%\",stopColor:a}),(0,n.jsx)(\"stop\",{offset:\"100%\",stopColor:o})]})}),(0,n.jsx)(\"rect\",{x:\"0\",y:\"0\",width:\"160\",height:\"210\",rx:\"14\",fill:`url(#${l})`}),(0,n.jsx)(\"rect\",{x:\"0\",y:\"0\",width:\"160\",height:\"210\",rx:\"14\",fill:\"black\",opacity:\"0.06\"}),(0,n.jsx)(\"rect\",{x:\"10\",y:\"10\",width:\"140\",height:\"190\",rx:\"8\",fill:\"none\",stroke:\"white\",strokeOpacity:\"0.35\",strokeWidth:\"1.5\"}),r===\"code\"?(0,n.jsxs)(\"g\",{stroke:\"white\",strokeOpacity:\"0.9\",strokeWidth:\"6\",strokeLinecap:\"round\",strokeLinejoin:\"round\",fill:\"none\",children:[(0,n.jsx)(\"path\",{d:\"M58 78 L38 105 L58 132\"}),(0,n.jsx)(\"path\",{d:\"M102 78 L122 105 L102 132\"}),(0,n.jsx)(\"path\",{d:\"M88 66 L72 144\"})]}):(0,n.jsxs)(\"g\",{stroke:\"white\",strokeOpacity:\"0.9\",strokeWidth:\"6\",strokeLinecap:\"round\",strokeLinejoin:\"round\",fill:\"none\",children:[(0,n.jsx)(\"path\",{d:\"M64 62 C40 62 40 92 64 96 C88 100 88 130 62 130\"}),(0,n.jsx)(\"circle\",{cx:\"98\",cy:\"70\",r:\"4\",fill:\"white\",stroke:\"none\"}),(0,n.jsx)(\"circle\",{cx:\"98\",cy:\"130\",r:\"4\",fill:\"white\",stroke:\"none\"})]}),(0,n.jsx)(\"path\",{d:\"M114 0 V38 L126 26 L138 38 V0 Z\",fill:t.accent})]})}function Rp({book:e,theme:t,skin:a,ui:o,coverUrl:r,onChangeCover:l,onClearCover:s,editable:u=!0,radius:i=14}){let d=`cover-input-${e.id}`,p=f=>{let g=f.target.files&&f.target.files[0];if(!g)return;let y=new FileReader;y.onload=()=>l(e.id,y.result),y.readAsDataURL(g),f.target.value=\"\"};return(0,n.jsxs)(\"div\",{className:\"group/cover relative w-full h-full\",style:{borderRadius:i,overflow:\"hidden\"},children:[r?(0,n.jsx)(\"img\",{src:r,alt:\"\",className:\"w-full h-full\",style:{objectFit:\"cover\",objectPosition:\"center\",display:\"block\"}}):(0,n.jsx)(Dx,{book:e,theme:t}),r&&(0,n.jsx)(\"div\",{className:\"absolute inset-0 pointer-events-none\",style:{boxShadow:\"inset 0 0 0 1.5px rgba(255,255,255,0.35)\"}}),r&&(0,n.jsx)(\"svg\",{className:\"absolute top-0 right-0 pointer-events-none\",width:\"26\",height:\"38\",viewBox:\"0 0 26 38\",children:(0,n.jsx)(\"path\",{d:\"M0 0 H26 V38 L13 27 L0 38 Z\",fill:t.accent})}),u&&(0,n.jsxs)(\"div\",{className:\"absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover/cover:opacity-100 focus-within:opacity-100 transition-opacity\",style:{background:\"rgba(10,8,6,0.42)\"},children:[(0,n.jsx)(\"label\",{htmlFor:d,onClick:f=>f.stopPropagation(),className:\"flex items-center justify-center rounded-full cursor-pointer\",style:{width:30,height:30,background:\"rgba(255,255,255,0.92)\",color:\"#241B13\"},\"aria-label\":o.coverEdit,title:o.coverEdit,children:(0,n.jsx)(bo,{size:13})}),(0,n.jsx)(\"input\",{id:d,type:\"file\",accept:\"image/*\",onChange:p,className:\"hidden\",onClick:f=>f.stopPropagation()}),r&&(0,n.jsx)(\"button\",{onClick:f=>{f.stopPropagation(),s(e.id)},className:\"flex items-center justify-center rounded-full\",style:{width:30,height:30,background:\"rgba(255,255,255,0.92)\",color:\"#241B13\"},\"aria-label\":o.coverReset,title:o.coverReset,children:(0,n.jsx)(Ot,{size:13})})]})]})}function Tx({lang:e,ui:t,theme:a,dir:o,onOpen:r,skin:l,covers:s,onChangeCover:u,onClearCover:i,books:d,collections:p,libraryPath:f,onEnterCollection:g,onCrumb:y,onCreateCollection:k,onDeleteCollection:v,onAssignToCollection:I,onRemoveFromCollection:x,onExportBook:c,onExportCollection:m}){let h=o===\"rtl\"?ia:da,L=f.length===0,F=L?null:p.find(E=>E.id===f[f.length-1]),b=[],C=[];if(L){let{rootCollections:E,rootBooks:H}=Fx(p,d);C=E,b=H}else F&&(C=p.filter(E=>F.itemIds.includes(E.id)),b=d.filter(E=>F.itemIds.includes(E.id)));let N=p.filter(E=>E.kind===\"folder\"),P=E=>E===\"book\"?p.filter(H=>H.kind===\"folder\"||H.kind===\"encyclopedia\"):N,M=E=>E===\"encyclopedia\"?Br:Fo;return(0,n.jsxs)(\"section\",{children:[L?(0,n.jsxs)(\"div\",{className:\"text-center pt-4 pb-8 max-w-xl mx-auto\",children:[(0,n.jsx)(\"p\",{className:\"text-sm mb-3\",style:{color:a.inkSoft},children:t.libraryKicker}),(0,n.jsx)(\"h1\",{className:\"text-3xl sm:text-4xl font-bold mb-4\",style:{fontFamily:t.displayFont,color:a.ink,lineHeight:1.3},children:t.libraryTitle}),(0,n.jsx)(\"p\",{className:\"text-base\",style:{color:a.inkSoft,lineHeight:1.7},children:t.librarySub})]}):(0,n.jsxs)(\"div\",{className:\"mb-6\",children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1.5 text-xs font-bold mb-3 flex-wrap\",style:{color:a.inkSoft},children:[(0,n.jsx)(\"button\",{onClick:()=>y(0),className:\"hover:underline\",style:{color:a.inkSoft},children:t.libraryRootCrumb}),f.map((E,H)=>{let _=p.find(U=>U.id===E);return _?(0,n.jsxs)(\"span\",{className:\"flex items-center gap-1.5\",children:[(0,n.jsx)(ca,{size:11,style:{transform:o===\"rtl\"?\"scaleX(-1)\":\"none\"}}),(0,n.jsx)(\"button\",{onClick:()=>y(H+1),className:\"hover:underline\",style:{color:H===f.length-1?a.ink:a.inkSoft},children:_.title})]},E):null})]}),F&&(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between gap-3 flex-wrap\",children:[(0,n.jsx)(\"h1\",{className:\"text-2xl font-bold\",style:{fontFamily:t.displayFont,color:a.ink},children:F.title}),(0,n.jsxs)(\"button\",{onClick:()=>v(F.id),className:\"flex items-center gap-1.5 text-xs font-bold px-3 py-1.5\",style:{borderRadius:l.radiusSm,border:`1.5px solid ${Z.border}`,color:Z.border},children:[(0,n.jsx)(Ot,{size:12}),t.libraryDeleteCollection]})]})]}),L&&(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2 mb-6\",children:[(0,n.jsxs)(\"button\",{onClick:()=>k(\"folder\"),className:\"flex items-center gap-1.5 text-xs font-bold px-3.5 py-2\",style:{borderRadius:l.radiusSm,border:`1.5px solid ${de(l,a)}`,color:a.ink,minHeight:36},children:[(0,n.jsx)(Pr,{size:13}),t.libraryNewFolder]}),(0,n.jsxs)(\"button\",{onClick:()=>k(\"encyclopedia\"),className:\"flex items-center gap-1.5 text-xs font-bold px-3.5 py-2\",style:{borderRadius:l.radiusSm,border:`1.5px solid ${de(l,a)}`,color:a.ink,minHeight:36},children:[(0,n.jsx)($r,{size:13}),t.libraryNewEncyclopedia]})]}),!L&&C.length===0&&b.length===0&&(0,n.jsx)(\"p\",{className:\"text-sm p-5\",style:{...ft(l,a,{soft:!0}),color:a.inkSoft},children:t.libraryEmptyCollection}),(0,n.jsxs)(\"div\",{className:\"grid grid-cols-1 sm:grid-cols-2 gap-5\",children:[C.map(E=>{let H=M(E.kind),_=E.itemIds.length;return(0,n.jsxs)(\"div\",{className:\"group flex gap-4 p-4 text-start\",style:{...ft(l,a),cursor:\"pointer\"},onClick:()=>g(E.id),role:\"button\",tabIndex:0,children:[(0,n.jsx)(\"div\",{className:\"shrink-0 grid place-items-center\",style:{width:96,height:126,borderRadius:l.radiusMd*.7,background:a.accentSoft,color:a.accent},children:(0,n.jsx)(H,{size:34})}),(0,n.jsxs)(\"div\",{className:\"flex flex-1 min-w-0 flex-col justify-between py-1\",children:[(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"span\",{className:\"inline-block text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full mb-1.5\",style:{background:a.accentSoft,color:a.accent},children:E.kind===\"encyclopedia\"?t.encyclopediaBadge:t.folderBadge}),(0,n.jsx)(\"h3\",{className:\"text-lg font-bold leading-snug\",style:{color:a.ink},children:E.title})]}),(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between gap-2 mt-3\",children:[(0,n.jsxs)(\"span\",{className:\"text-xs font-semibold\",style:{color:a.inkSoft},children:[_,\" \",t.booksCountLabel]}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1.5\",children:[m&&(0,n.jsx)(\"button\",{onClick:U=>{U.stopPropagation(),m(E)},className:\"p-1.5\",style:{borderRadius:l.radiusSm,color:a.inkSoft},\"aria-label\":t.treeExportCta,title:t.treeExportCta,children:(0,n.jsx)(ma,{size:13})}),L?E.kind===\"encyclopedia\"&&N.length>0?(0,n.jsxs)(\"select\",{onClick:U=>U.stopPropagation(),onChange:U=>U.target.value&&I(E.id,U.target.value),defaultValue:\"\",className:\"text-[11px] font-bold px-2 py-1\",style:{borderRadius:l.radiusSm,border:`1.5px solid ${de(l,a)}`,background:a.surface,color:a.ink},children:[(0,n.jsx)(\"option\",{value:\"\",children:t.libraryAddToFolder}),N.map(U=>(0,n.jsx)(\"option\",{value:U.id,children:U.title},U.id))]}):(0,n.jsx)(h,{size:14,style:{color:a.inkSoft}}):(0,n.jsxs)(\"button\",{onClick:U=>{U.stopPropagation(),x(E.id)},className:\"text-[11px] font-bold px-2 py-1\",style:{borderRadius:l.radiusSm,color:a.inkSoft},children:[(0,n.jsx)(ct,{size:11,className:\"inline\"}),\" \",t.libraryRemoveFromCollection]})]})]})]})]},E.id)}),b.map(E=>{let H=E.nodes.filter(q=>q.level===\"branch\").length,_=E.nodes.reduce((q,Ne)=>q+(Ne.level===\"leaf\"?Ua(Ne).reduce((et,pt)=>et+pt.questions.length,0):0),0),U=P(\"book\");return(0,n.jsxs)(\"div\",{className:\"group flex gap-4 p-4 text-start transition-transform\",style:{...ft(l,a),cursor:\"pointer\"},onClick:()=>r(E.id),role:\"button\",tabIndex:0,onKeyDown:q=>(q.key===\"Enter\"||q.key===\" \")&&r(E.id),children:[(0,n.jsx)(\"div\",{className:\"shrink-0\",style:{width:96,height:126,borderRadius:l.radiusMd*.7,overflow:\"hidden\"},children:(0,n.jsx)(Rp,{book:E,theme:a,skin:l,ui:t,coverUrl:s[E.id],onChangeCover:u,onClearCover:i,radius:l.radiusMd*.7})}),(0,n.jsxs)(\"div\",{className:\"flex flex-1 min-w-0 flex-col justify-between py-1\",children:[(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"h3\",{className:\"text-lg font-bold leading-snug mb-1\",style:{color:a.ink},children:E[e].title}),(0,n.jsx)(\"p\",{className:\"text-sm\",style:{color:a.inkSoft,lineHeight:1.5},children:E[e].tagline})]}),(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between gap-2 mt-3\",children:[(0,n.jsxs)(\"span\",{className:\"text-xs font-semibold\",style:{color:a.inkSoft},children:[H,\" \",t.branchesLabel,\" \\xB7 \",_,\" \",t.questionsLabel]}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1.5\",children:[c&&(0,n.jsx)(\"button\",{onClick:q=>{q.stopPropagation(),c(E)},className:\"p-1.5\",style:{borderRadius:l.radiusSm,color:a.inkSoft},\"aria-label\":t.treeExportCta,title:t.treeExportCta,children:(0,n.jsx)(ma,{size:13})}),L?U.length>0?(0,n.jsxs)(\"select\",{onClick:q=>q.stopPropagation(),onChange:q=>q.target.value&&I(E.id,q.target.value),defaultValue:\"\",className:\"text-[11px] font-bold px-2 py-1\",style:{borderRadius:l.radiusSm,border:`1.5px solid ${de(l,a)}`,background:a.surface,color:a.ink},children:[(0,n.jsx)(\"option\",{value:\"\",children:t.libraryAddToFolder}),U.map(q=>(0,n.jsx)(\"option\",{value:q.id,children:q.title},q.id))]}):(0,n.jsxs)(\"span\",{className:\"flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors\",style:{background:a.accentSoft,color:a.accent},children:[t.openBook,(0,n.jsx)(h,{size:12})]}):(0,n.jsxs)(\"button\",{onClick:q=>{q.stopPropagation(),x(E.id)},className:\"text-[11px] font-bold px-2 py-1\",style:{borderRadius:l.radiusSm,color:a.inkSoft},children:[(0,n.jsx)(ct,{size:11,className:\"inline\"}),\" \",t.libraryRemoveFromCollection]})]})]})]})]},E.id)})]})]})}function fp({book:e,lang:t,ui:a,theme:o,dir:r,onBack:l,skin:s,selectedLeaf:u,onSelectLeaf:i,onBrowse:d,onPlanner:p,onExport:f,covers:g,onChangeCover:y,onClearCover:k}){let v=r===\"rtl\"?da:ia;return(0,n.jsxs)(\"section\",{children:[(0,n.jsxs)(\"button\",{onClick:l,className:\"flex items-center gap-1.5 text-sm font-semibold mb-5\",style:{color:o.inkSoft,minHeight:40},children:[(0,n.jsx)(v,{size:15}),a.backToLibrary]}),(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between gap-3 mb-6 flex-wrap\",children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-3\",children:[(0,n.jsx)(\"div\",{className:\"shrink-0\",style:{width:56,height:74,borderRadius:s.radiusMd*.55,overflow:\"hidden\"},children:(0,n.jsx)(Rp,{book:e,theme:o,skin:s,ui:a,coverUrl:g[e.id],onChangeCover:y,onClearCover:k,radius:s.radiusMd*.55})}),(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"h1\",{className:\"text-2xl sm:text-3xl font-bold\",style:{fontFamily:a.displayFont,color:o.ink,lineHeight:1.25},children:e[t].title}),(0,n.jsx)(\"p\",{className:\"text-sm\",style:{color:o.inkSoft},children:e[t].tagline})]})]}),(0,n.jsxs)(\"button\",{onClick:d,className:\"flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 shrink-0\",style:{borderRadius:s.radiusSm,background:o.accent,color:o.accentInk,minHeight:44},children:[(0,n.jsx)(Ur,{size:15}),a.browseCta]})]}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2 mb-6 flex-wrap\",children:[(0,n.jsxs)(\"button\",{onClick:p,className:\"flex items-center gap-1.5 text-xs font-bold px-3.5 py-2\",style:{borderRadius:s.radiusSm,border:`1.5px solid ${de(s,o)}`,color:o.ink,minHeight:36},children:[(0,n.jsx)(Mt,{size:13}),a.treePlannerCta]}),f&&(0,n.jsxs)(\"button\",{onClick:f,className:\"flex items-center gap-1.5 text-xs font-bold px-3.5 py-2\",style:{borderRadius:s.radiusSm,border:`1.5px solid ${de(s,o)}`,color:o.ink,minHeight:36},children:[(0,n.jsx)(ma,{size:13}),a.treeExportCta]})]}),(0,n.jsxs)(\"div\",{className:\"p-6 sm:p-8\",style:ft(s,o),children:[(0,n.jsx)(\"p\",{className:\"text-xs font-semibold mb-2\",style:{color:o.accent},children:a.treeEyebrow}),(0,n.jsx)(\"p\",{className:\"text-sm mb-6 max-w-lg\",style:{color:o.inkSoft,lineHeight:1.7},children:a.treeSub}),(0,n.jsx)(Ex,{book:e,lang:t,dir:r,theme:o,ui:a,skin:s,selected:u,onSelect:i})]})]})}function Ax({node:e,book:t,lang:a,ui:o,theme:r,dir:l,skin:s,cardMode:u,scrollDir:i,onBack:d}){let p=l===\"rtl\"?da:ia;return(0,n.jsxs)(\"section\",{children:[(0,n.jsxs)(\"button\",{onClick:d,className:\"flex items-center gap-1.5 text-sm font-semibold mb-5\",style:{color:r.inkSoft,minHeight:40},children:[(0,n.jsx)(p,{size:15}),t[a].title]}),(0,n.jsx)(Bx,{node:e,book:t,lang:a,ui:o,theme:r,dir:l,skin:s,cardMode:u,scrollDir:i})]})}function Px({book:e,lang:t,ui:a,theme:o,dir:r,skin:l,onBack:s}){let u=(0,D.useMemo)(()=>{let C=[];return e.nodes.filter(N=>N.level===\"leaf\").forEach(N=>{Ua(N).forEach(P=>{P.questions.forEach((M,E)=>C.push({q:M,leaf:N,key:`${P.id}-${E}`}))})}),C},[e]),i=(0,D.useMemo)(()=>{let C={};return u.forEach(({q:N})=>C[N.type]=(C[N.type]||0)+1),C},[u]),d=(0,D.useMemo)(()=>u.filter(({q:C})=>C.type!==\"essay\"&&C.type!==\"rating\").length,[u]),[p,f]=(0,D.useState)(\"all\"),[g,y]=(0,D.useState)({}),[k,v]=(0,D.useState)(0),I=C=>N=>{y(P=>({...P,[C]:N})),N===!0?v(P=>P+1):N===!1&&v(0)},x=Object.values(g).filter(C=>C===!0).length,c=Object.keys(g).length,m=u.length?Math.round(c/u.length*100):0,h=p===\"all\"?u:u.filter(({q:C})=>C.type===p),L=Object.keys(Ce).filter(C=>i[C]),F=r===\"rtl\"?da:ia,b=(C,N,P,M,E)=>(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-2 p-4\",style:{background:C,color:N,borderRadius:l.radiusLg,border:l.pixel?`${l.borderW}px solid ${N}`:\"none\",boxShadow:l.pixel?l.shadow:\"none\"},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1.5 text-xs font-black uppercase tracking-wider\",style:{opacity:.75},children:[(0,n.jsx)(M,{size:13,strokeWidth:2.5}),P]}),E]});return(0,n.jsxs)(\"section\",{children:[(0,n.jsxs)(\"button\",{onClick:s,className:\"flex items-center gap-1.5 text-sm font-semibold mb-5\",style:{color:o.inkSoft,minHeight:40},children:[(0,n.jsx)(F,{size:15}),e[t].title]}),(0,n.jsx)(\"h1\",{className:\"text-2xl font-bold mb-1\",style:{fontFamily:a.displayFont,color:o.ink},children:a.browseTitle}),(0,n.jsx)(\"p\",{className:\"text-sm mb-5\",style:{color:o.inkSoft},children:a.browseSub}),(0,n.jsxs)(\"div\",{className:\"grid grid-cols-2 gap-3 mb-3\",children:[b(Ce.single.color.bg,Ce.single.color.ink,a.scoreLabel,Ao,(0,n.jsxs)(\"span\",{className:\"text-3xl font-black\",children:[x,(0,n.jsxs)(\"span\",{className:\"text-base font-bold opacity-60\",children:[\"/\",d]})]})),b(Ce.multi.color.bg,Ce.multi.color.ink,a.streakLabel,Io,(0,n.jsx)(\"span\",{className:\"text-3xl font-black\",children:k}))]}),(0,n.jsxs)(\"div\",{className:\"p-4 mb-6\",style:{background:Ce.tf.color.bg,color:Ce.tf.color.ink,borderRadius:l.radiusLg,border:l.pixel?`${l.borderW}px solid ${Ce.tf.color.ink}`:\"none\",boxShadow:l.pixel?l.shadow:\"none\"},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between gap-3 mb-2\",children:[(0,n.jsx)(\"span\",{className:\"text-xs font-black uppercase tracking-wider\",style:{opacity:.75},children:a.completionLabel}),(0,n.jsxs)(\"span\",{className:\"text-xl font-black\",children:[m,\"%\"]})]}),(0,n.jsx)(\"div\",{className:\"w-full\",style:{height:8,borderRadius:l.radiusSm,background:\"rgba(0,0,0,0.12)\"},children:(0,n.jsx)(\"div\",{className:\"h-full transition-all\",style:{width:`${m}%`,borderRadius:l.radiusSm,background:Ce.tf.color.ink}})})]}),(0,n.jsx)(\"p\",{className:\"text-xs font-bold uppercase tracking-wide mb-2.5\",style:{color:o.inkSoft},children:a.filterByType}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2 mb-6 overflow-x-auto pb-1\",style:{WebkitOverflowScrolling:\"touch\"},children:[(0,n.jsxs)(\"button\",{onClick:()=>f(\"all\"),className:\"shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold\",style:{borderRadius:l.radiusSm,border:`1.5px solid ${p===\"all\"?o.ink:de(l,o)}`,background:p===\"all\"?o.ink:o.canvas,color:p===\"all\"?o.canvas:o.ink},children:[a.filterAll,\" \",u.length]}),L.map(C=>{let N=Ce[C],P=p===C;return(0,n.jsxs)(\"button\",{onClick:()=>f(C),className:\"shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold\",style:{borderRadius:l.radiusSm,border:`1.5px solid ${P?o.accent:de(l,o)}`,background:P?o.accentSoft:o.canvas,color:o.ink},children:[(0,n.jsx)(N.Icon,{size:13}),N[t],\" \",i[C]]},C)})]}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-4\",children:h.map(({q:C,leaf:N,key:P})=>(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-1.5\",children:[(0,n.jsxs)(\"span\",{className:\"text-xs font-semibold px-1\",style:{color:o.inkSoft},children:[a.fromLeaf,\" \",N[t]]}),(0,n.jsx)(bx,{q:C,lang:t,ui:a,theme:o,skin:l,onAnswered:I(P)})]},P))})]})}function Nx({ui:e,theme:t,dir:a,skinId:o,onSkinChange:r,flavorId:l,onFlavorChange:s,mode:u,cardMode:i,onCardModeChange:d,scrollDir:p,onScrollDirChange:f,voiceEnabled:g,onVoiceEnabledChange:y,onClose:k,onReset:v}){let I=Ct[o],x=[{id:\"normal\",label:e.themeNormal,desc:e.themeNormalDesc,Icon:Do},{id:\"glass\",label:e.themeGlass,desc:e.themeGlassDesc,Icon:xa},{id:\"pixel\",label:e.themePixel,desc:e.themePixelDesc,Icon:dt}],c=[{id:\"paged\",label:e.cardModePaged,desc:e.cardModePagedDesc,Icon:Or},{id:\"scroll\",label:e.cardModeScroll,desc:e.cardModeScrollDesc,Icon:vt}],m=[{id:\"vertical\",label:e.scrollDirVertical,desc:e.scrollDirVerticalDesc,Icon:vt},{id:\"horizontal\",label:e.scrollDirHorizontal,desc:e.scrollDirHorizontalDesc,Icon:Rt}];return(0,n.jsx)(\"div\",{className:\"fixed inset-0 z-50 flex items-center justify-center p-4\",style:{background:\"rgba(20,16,10,0.5)\"},onClick:k,role:\"dialog\",\"aria-modal\":\"true\",\"aria-label\":e.settingsTitle,children:(0,n.jsxs)(\"div\",{dir:a,className:\"educraft-modal-in w-full max-w-md max-h-[85vh] overflow-y-auto p-6\",style:{...ft(I,t),boxShadow:I.id===\"normal\"?\"0 24px 60px rgba(20,16,10,0.25)\":I.shadow},onClick:h=>h.stopPropagation(),children:[(0,n.jsxs)(\"div\",{className:\"flex items-start justify-between gap-3 mb-1\",children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(Kr,{size:18,color:t.accent}),(0,n.jsx)(\"h2\",{className:\"text-lg font-bold\",style:{color:t.ink},children:e.settingsTitle})]}),(0,n.jsx)(\"button\",{onClick:k,className:\"grid place-items-center shrink-0\",style:{width:32,height:32,borderRadius:I.radiusSm,border:`1px solid ${de(I,t)}`,color:t.ink},\"aria-label\":e.settingsClose,children:(0,n.jsx)(ct,{size:15})})]}),(0,n.jsx)(\"p\",{className:\"text-sm mb-6\",style:{color:t.inkSoft,lineHeight:1.6},children:e.settingsSub}),(0,n.jsx)(\"p\",{className:\"text-xs font-bold uppercase tracking-wide mb-2.5\",style:{color:t.inkSoft},children:e.settingsThemeLabel}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-2 mb-6\",children:x.map(h=>{let L=o===h.id;return(0,n.jsxs)(\"button\",{onClick:()=>r(h.id),className:\"flex items-center gap-3 text-start px-3.5 py-3\",style:{borderRadius:I.radiusMd,border:`${L?2:1}px solid ${L?t.accent:de(I,t)}`,background:L?t.accentSoft:t.canvas},children:[(0,n.jsx)(\"span\",{className:\"grid place-items-center shrink-0\",style:{width:34,height:34,borderRadius:I.radiusSm,background:L?t.accent:t.surfaceSoft,color:L?t.accentInk:t.ink},children:(0,n.jsx)(h.Icon,{size:16})}),(0,n.jsxs)(\"span\",{className:\"flex-1 min-w-0\",children:[(0,n.jsx)(\"span\",{className:\"block text-sm font-bold\",style:{color:t.ink},children:h.label}),(0,n.jsx)(\"span\",{className:\"block text-xs\",style:{color:t.inkSoft},children:h.desc})]}),L&&(0,n.jsx)(it,{size:16,color:t.accent,className:\"shrink-0\"})]},h.id)})}),(0,n.jsx)(\"p\",{className:\"text-xs font-bold uppercase tracking-wide mb-1\",style:{color:t.inkSoft},children:e.settingsFlavorLabel}),(0,n.jsx)(\"p\",{className:\"text-xs mb-2.5\",style:{color:t.inkSoft,lineHeight:1.5},children:e.settingsFlavorSub}),(0,n.jsx)(\"div\",{className:\"grid grid-cols-4 gap-2.5 mb-6\",children:Object.entries(hp).map(([h,L])=>{let F=l===h,b=L[u],C=a===\"rtl\"?L.ar:L.en;return(0,n.jsxs)(\"button\",{onClick:()=>s(h),className:\"flex flex-col items-center gap-1.5 p-1.5\",title:C,\"aria-label\":C,style:{borderRadius:I.radiusMd,border:`${F?2:1}px solid ${F?t.accent:de(I,t)}`,background:F?t.accentSoft:\"transparent\"},children:[(0,n.jsxs)(\"span\",{className:\"grid grid-cols-2 overflow-hidden shrink-0\",style:{width:34,height:34,borderRadius:I.radiusSm>100?9999:I.radiusSm*.6,border:`1px solid ${de(I,t)}`},children:[(0,n.jsx)(\"span\",{style:{background:b.canvas}}),(0,n.jsx)(\"span\",{style:{background:b.accent}}),(0,n.jsx)(\"span\",{style:{background:b.header}}),(0,n.jsx)(\"span\",{style:{background:b.ink}})]}),(0,n.jsx)(\"span\",{className:\"text-[0.65rem] font-bold text-center leading-tight\",style:{color:t.ink},children:C}),F&&(0,n.jsx)(it,{size:12,color:t.accent,className:\"shrink-0 -mt-1\"})]},h)})}),(0,n.jsx)(\"p\",{className:\"text-xs font-bold uppercase tracking-wide mb-2.5\",style:{color:t.inkSoft},children:e.settingsCardModeLabel}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-2 mb-2\",children:c.map(h=>{let L=i===h.id;return(0,n.jsxs)(\"button\",{onClick:()=>d(h.id),className:\"flex items-center gap-3 text-start px-3.5 py-3\",style:{borderRadius:I.radiusMd,border:`${L?2:1}px solid ${L?t.accent:de(I,t)}`,background:L?t.accentSoft:t.canvas},children:[(0,n.jsx)(\"span\",{className:\"grid place-items-center shrink-0\",style:{width:34,height:34,borderRadius:I.radiusSm,background:L?t.accent:t.surfaceSoft,color:L?t.accentInk:t.ink},children:(0,n.jsx)(h.Icon,{size:16})}),(0,n.jsxs)(\"span\",{className:\"flex-1 min-w-0\",children:[(0,n.jsx)(\"span\",{className:\"block text-sm font-bold\",style:{color:t.ink},children:h.label}),(0,n.jsx)(\"span\",{className:\"block text-xs\",style:{color:t.inkSoft},children:h.desc})]}),L&&(0,n.jsx)(it,{size:16,color:t.accent,className:\"shrink-0\"})]},h.id)})}),i===\"scroll\"&&(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-2 mt-3 educraft-panel-in\",children:[(0,n.jsx)(\"p\",{className:\"text-xs font-bold uppercase tracking-wide mb-0.5\",style:{color:t.inkSoft},children:e.settingsScrollDirLabel}),(0,n.jsx)(\"div\",{className:\"grid grid-cols-2 gap-2\",children:m.map(h=>{let L=p===h.id;return(0,n.jsxs)(\"button\",{onClick:()=>f(h.id),className:\"flex flex-col items-center gap-1.5 px-3 py-3\",style:{borderRadius:I.radiusMd,border:`${L?2:1}px solid ${L?t.accent:de(I,t)}`,background:L?t.accentSoft:t.canvas},children:[(0,n.jsx)(h.Icon,{size:16,color:L?t.accent:t.ink}),(0,n.jsx)(\"span\",{className:\"text-xs font-bold\",style:{color:t.ink},children:h.label})]},h.id)})})]}),(0,n.jsx)(\"div\",{className:\"mt-6 pt-5\",style:{borderTop:`1px solid ${t.hairline}`},children:(0,n.jsxs)(\"label\",{className:\"flex items-start gap-3 cursor-pointer\",children:[(0,n.jsx)(\"input\",{type:\"checkbox\",checked:g,onChange:h=>y(h.target.checked),className:\"mt-0.5\"}),(0,n.jsxs)(\"span\",{children:[(0,n.jsx)(\"span\",{className:\"block text-sm font-bold\",style:{color:t.ink},children:mi[a===\"rtl\"?\"ar\":\"en\"].voiceFeature}),(0,n.jsx)(\"span\",{className:\"block text-xs\",style:{color:t.inkSoft},children:mi[a===\"rtl\"?\"ar\":\"en\"].voiceFeatureSub})]})]})}),(0,n.jsxs)(\"div\",{className:\"mt-6 pt-5\",style:{borderTop:`1px solid ${t.hairline}`},children:[(0,n.jsx)(\"p\",{className:\"text-xs font-bold uppercase tracking-wide mb-1\",style:{color:t.inkSoft},children:e.settingsDataLabel}),(0,n.jsx)(\"p\",{className:\"text-xs mb-3\",style:{color:t.inkSoft,lineHeight:1.5},children:e.settingsDataSub}),(0,n.jsxs)(\"button\",{onClick:()=>{window.confirm(e.settingsResetConfirm)&&v()},className:\"flex items-center gap-2 px-3.5 py-2.5 text-sm font-bold\",style:{borderRadius:I.radiusSm,border:`1.5px solid ${Z.border}`,color:Z.border,minHeight:40},children:[(0,n.jsx)(Bo,{size:14}),e.settingsResetLabel]})]})]})})}var mi={en:{editorTitle:\"Editor\",editorSub:\"Pick a leaf, then build its cards or its printed pages.\",addQuestion:\"Add question\",noLeaf:\"Pick a leaf on the left to start editing.\",prompt:\"Prompt\",voice:\"Voice\",voiceOn:\"Voice enabled\",code:\"Code box\",codeLang:\"Language\",linked:\"Related to\",linkedHint:\"Search a leaf to link\\u2026\",linkToBlockHint:\"Link to a specific plate, or the whole leaf\",linkWholeLeaf:\"Whole leaf\",incomingLinks:\"Linked from\",delete:\"Delete question\",tabCards:\"Cards\",tabPages:\"A4 pages\",options:\"Options\",correct:\"Correct\",addOption:\"Add option\",accepted:\"Accepted answers (comma separated)\",modelAnswer:\"Model answer\",template:\"Template (use ___ for the blank)\",blanks:\"Blanks (comma separated, in order)\",bank:\"Word bank (comma separated)\",correctWord:\"Correct word\",left:\"Left side\",right:\"Right side\",items:\"Items (in correct order)\",bins:\"Bins (comma separated)\",sortItems:'Items \\u2014 one \"label:bin\" per line',min:\"Min\",max:\"Max\",step:\"Step\",tolerance:\"Tolerance\",trueLabel:\"True\",falseLabel:\"False\",voiceFeature:\"Voice feature\",voiceFeatureSub:\"Show or hide the voice slot on question cards everywhere.\",card:\"Card\",newCard:\"New card\",deleteCard:\"Delete card\",cardImage:\"Card image\",posTop:\"Top\",posRight:\"Right\",posLeft:\"Left\",posNone:\"None\",cardVideo:\"Card video\",cardAudio:\"Card audio\",uploadVideo:\"Upload video\",uploadAudio:\"Upload audio\",removeMedia:\"Remove\",noQuestionsInCard:\"This card is empty \\u2014 add a question.\",pagesSub:\"Build the printed A4 version \\u2014 plates, images, and page breaks.\",addBlock:\"Add block\",genFromCards:\"Generate from this leaf's cards\",pagePalette:\"Page palette\",insertGroup:\"Insert\",pageGroup:\"Page\",zoomOut:\"Zoom out\",zoomIn:\"Zoom in\",zoomFit:\"Fit width\",zoomReset:\"100%\",blockSectionTitle:\"Section title\",blockKeyterm:\"Key term\",blockNote:\"Note\",blockWarning:\"Warning\",blockImportant:\"Important\",blockImage:\"Image\",blockCode:\"Code box\",blockPagebreak:\"Page break\",blockTitle:\"Title\",blockText:\"Text\",imageUrl:\"Image URL\",imageCaption:\"Caption\",imageTitle:\"Image title\",imageMeta:\"Source / note\",pageOf:(e,t)=>`Page ${e} of ${t}`,moveUp:\"Move up\",moveDown:\"Move down\",removeBlock:\"Remove\",files:\"Files\",importBookJson:\"Import book (JSON)\",exportBookJson:\"Export book (JSON)\",importOrderedImages:\"Import a folder of images \\u2014 sorted 0,1,2\\u2026 and assigned to cards in order\",importManifestFolder:\"Import a folder containing a manifest.json + its images\",importDone:e=>`Imported ${e} image(s).`,importNoManifest:\"No manifest.json found in that folder.\",importSkipped:e=>`${e} item(s) pointed to a leaf id that doesn't exist in this book.`,cardNote:\"Note\"},ar:{editorTitle:\"\\u0627\\u0644\\u0645\\u062D\\u0631\\u0631\",editorSub:\"\\u0627\\u062E\\u062A\\u0627\\u0631 \\u0648\\u0631\\u0642\\u0629\\u060C \\u0648\\u0627\\u0628\\u0646\\u064A \\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u0623\\u0633\\u0626\\u0644\\u062A\\u0647\\u0627 \\u0623\\u0648 \\u0635\\u0641\\u062D\\u0627\\u062A\\u0647\\u0627 \\u0627\\u0644\\u0645\\u0637\\u0628\\u0648\\u0639\\u0629.\",addQuestion:\"\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0633\\u0624\\u0627\\u0644\",noLeaf:\"\\u0627\\u062E\\u062A\\u0627\\u0631 \\u0648\\u0631\\u0642\\u0629 \\u0645\\u0646 \\u0627\\u0644\\u0634\\u0645\\u0627\\u0644 \\u0639\\u0634\\u0627\\u0646 \\u062A\\u0628\\u062F\\u0623 \\u0627\\u0644\\u062A\\u062D\\u0631\\u064A\\u0631.\",prompt:\"\\u0646\\u0635 \\u0627\\u0644\\u0633\\u0624\\u0627\\u0644\",voice:\"\\u0635\\u0648\\u062A\",voiceOn:\"\\u0627\\u0644\\u0635\\u0648\\u062A \\u0645\\u0641\\u0639\\u0651\\u0644\",code:\"\\u0635\\u0646\\u062F\\u0648\\u0642 \\u0643\\u0648\\u062F\",codeLang:\"\\u0627\\u0644\\u0644\\u063A\\u0629\",linked:\"\\u0645\\u0631\\u062A\\u0628\\u0637 \\u0628\\u0640\",linkedHint:\"\\u062F\\u0648\\u0651\\u0631 \\u0639\\u0644\\u0649 \\u0648\\u0631\\u0642\\u0629 \\u062A\\u0631\\u0628\\u0637\\u0647\\u0627\\u2026\",linkToBlockHint:\"\\u0627\\u0631\\u0628\\u0637 \\u0628\\u0639\\u0646\\u0635\\u0631 \\u0645\\u0639\\u064A\\u0646 \\u0641\\u064A \\u0635\\u0641\\u062D\\u0627\\u062A\\u0647\\u0627\\u060C \\u0623\\u0648 \\u0628\\u0627\\u0644\\u0648\\u0631\\u0642\\u0629 \\u0643\\u0644\\u0647\\u0627\",linkWholeLeaf:\"\\u0627\\u0644\\u0648\\u0631\\u0642\\u0629 \\u0643\\u0644\\u0647\\u0627\",incomingLinks:\"\\u0631\\u0648\\u0627\\u0628\\u0637 \\u0648\\u0627\\u0631\\u062F\\u0629 \\u0645\\u0646\",delete:\"\\u0627\\u062D\\u0630\\u0641 \\u0627\\u0644\\u0633\\u0624\\u0627\\u0644\",tabCards:\"\\u0627\\u0644\\u0643\\u0627\\u0631\\u062F\\u0627\\u062A\",tabPages:\"\\u0635\\u0641\\u062D\\u0627\\u062A A4\",options:\"\\u0627\\u0644\\u0627\\u062E\\u062A\\u064A\\u0627\\u0631\\u0627\\u062A\",correct:\"\\u0627\\u0644\\u0635\\u062D\",addOption:\"\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0627\\u062E\\u062A\\u064A\\u0627\\u0631\",accepted:\"\\u0625\\u062C\\u0627\\u0628\\u0627\\u062A \\u0645\\u0642\\u0628\\u0648\\u0644\\u0629 (\\u0627\\u0641\\u0635\\u0644 \\u0628\\u0641\\u0627\\u0635\\u0644\\u0629)\",modelAnswer:\"\\u0627\\u0644\\u0625\\u062C\\u0627\\u0628\\u0629 \\u0627\\u0644\\u0646\\u0645\\u0648\\u0630\\u062C\\u064A\\u0629\",template:\"\\u0627\\u0644\\u0646\\u0635 (\\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 ___ \\u0644\\u0644\\u0641\\u0631\\u0627\\u063A)\",blanks:\"\\u0627\\u0644\\u0641\\u0631\\u0627\\u063A\\u0627\\u062A (\\u0627\\u0641\\u0635\\u0644 \\u0628\\u0641\\u0627\\u0635\\u0644\\u0629\\u060C \\u0628\\u0627\\u0644\\u062A\\u0631\\u062A\\u064A\\u0628)\",bank:\"\\u0628\\u0646\\u0643 \\u0627\\u0644\\u0643\\u0644\\u0645\\u0627\\u062A (\\u0627\\u0641\\u0635\\u0644 \\u0628\\u0641\\u0627\\u0635\\u0644\\u0629)\",correctWord:\"\\u0627\\u0644\\u0643\\u0644\\u0645\\u0629 \\u0627\\u0644\\u0635\\u062D\",left:\"\\u0627\\u0644\\u0639\\u0645\\u0648\\u062F \\u0627\\u0644\\u0623\\u0648\\u0644\",right:\"\\u0627\\u0644\\u0639\\u0645\\u0648\\u062F \\u0627\\u0644\\u062A\\u0627\\u0646\\u064A\",items:\"\\u0627\\u0644\\u0639\\u0646\\u0627\\u0635\\u0631 (\\u0628\\u0627\\u0644\\u062A\\u0631\\u062A\\u064A\\u0628 \\u0627\\u0644\\u0635\\u062D)\",bins:\"\\u0627\\u0644\\u0635\\u0646\\u0627\\u062F\\u064A\\u0642 (\\u0627\\u0641\\u0635\\u0644 \\u0628\\u0641\\u0627\\u0635\\u0644\\u0629)\",sortItems:'\\u0627\\u0644\\u0639\\u0646\\u0627\\u0635\\u0631 \\u2014 \"\\u0627\\u0644\\u0639\\u0646\\u0635\\u0631:\\u0627\\u0644\\u0635\\u0646\\u062F\\u0648\\u0642\" \\u0643\\u0644 \\u0633\\u0637\\u0631 \\u0644\\u0648\\u062D\\u062F\\u0647',min:\"\\u0623\\u0642\\u0644 \\u0642\\u064A\\u0645\\u0629\",max:\"\\u0623\\u0639\\u0644\\u0649 \\u0642\\u064A\\u0645\\u0629\",step:\"\\u0627\\u0644\\u062E\\u0637\\u0648\\u0629\",tolerance:\"\\u0647\\u0627\\u0645\\u0634 \\u0627\\u0644\\u062E\\u0637\\u0623\",trueLabel:\"\\u0635\\u062D\",falseLabel:\"\\u063A\\u0644\\u0637\",voiceFeature:\"\\u0645\\u064A\\u0632\\u0629 \\u0627\\u0644\\u0635\\u0648\\u062A\",voiceFeatureSub:\"\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0623\\u0648 \\u0625\\u062E\\u0641\\u0627\\u0621 \\u0645\\u0643\\u0627\\u0646 \\u0627\\u0644\\u0635\\u0648\\u062A \\u0641\\u064A \\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u0627\\u0644\\u0623\\u0633\\u0626\\u0644\\u0629 \\u0641\\u064A \\u0643\\u0644 \\u0645\\u0643\\u0627\\u0646.\",card:\"\\u0643\\u0627\\u0631\\u062F\",newCard:\"\\u0643\\u0627\\u0631\\u062F \\u062C\\u062F\\u064A\\u062F\",deleteCard:\"\\u0627\\u062D\\u0630\\u0641 \\u0627\\u0644\\u0643\\u0627\\u0631\\u062F\",cardImage:\"\\u0635\\u0648\\u0631\\u0629 \\u0627\\u0644\\u0643\\u0627\\u0631\\u062F\",posTop:\"\\u0641\\u0648\\u0642\",posRight:\"\\u064A\\u0645\\u064A\\u0646\",posLeft:\"\\u0634\\u0645\\u0627\\u0644\",posNone:\"\\u0628\\u062F\\u0648\\u0646\",cardVideo:\"\\u0641\\u064A\\u062F\\u064A\\u0648 \\u0627\\u0644\\u0643\\u0627\\u0631\\u062F\",cardAudio:\"\\u0635\\u0648\\u062A \\u0627\\u0644\\u0643\\u0627\\u0631\\u062F\",uploadVideo:\"\\u0631\\u0641\\u0639 \\u0641\\u064A\\u062F\\u064A\\u0648\",uploadAudio:\"\\u0631\\u0641\\u0639 \\u0635\\u0648\\u062A\",removeMedia:\"\\u0625\\u0632\\u0627\\u0644\\u0629\",noQuestionsInCard:\"\\u0627\\u0644\\u0643\\u0627\\u0631\\u062F \\u062F\\u0647 \\u0641\\u0627\\u0636\\u064A \\u2014 \\u0636\\u064A\\u0641 \\u0633\\u0624\\u0627\\u0644.\",pagesSub:\"\\u0627\\u0628\\u0646\\u064A \\u0627\\u0644\\u0646\\u0633\\u062E\\u0629 \\u0627\\u0644\\u0645\\u0637\\u0628\\u0648\\u0639\\u0629 A4 \\u2014 \\u0628\\u0644\\u0627\\u064A\\u062A\\u0633 \\u0648\\u0635\\u0648\\u0631 \\u0648\\u0641\\u0648\\u0627\\u0635\\u0644 \\u0635\\u0641\\u062D\\u0627\\u062A.\",addBlock:\"\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0639\\u0646\\u0635\\u0631\",genFromCards:\"\\u0648\\u0644\\u0651\\u062F \\u0645\\u0646 \\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u0627\\u0644\\u0648\\u0631\\u0642\\u0629 \\u062F\\u064A\",pagePalette:\"\\u0628\\u0627\\u0644\\u064A\\u062A\\u0629 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\",insertGroup:\"\\u0625\\u062F\\u0631\\u0627\\u062C\",pageGroup:\"\\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\",zoomOut:\"\\u062A\\u0635\\u063A\\u064A\\u0631\",zoomIn:\"\\u062A\\u0643\\u0628\\u064A\\u0631\",zoomFit:\"\\u0645\\u0644\\u0627\\u0626\\u0645\\u0629 \\u0627\\u0644\\u0639\\u0631\\u0636\",zoomReset:\"100%\",blockSectionTitle:\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0642\\u0633\\u0645\",blockKeyterm:\"\\u0645\\u0635\\u0637\\u0644\\u062D \\u0645\\u0641\\u062A\\u0627\\u062D\\u064A\",blockNote:\"\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\",blockWarning:\"\\u062A\\u062D\\u0630\\u064A\\u0631\",blockImportant:\"\\u0645\\u0647\\u0645\",blockImage:\"\\u0635\\u0648\\u0631\\u0629\",blockCode:\"\\u0635\\u0646\\u062F\\u0648\\u0642 \\u0643\\u0648\\u062F\",blockPagebreak:\"\\u0641\\u0627\\u0635\\u0644 \\u0635\\u0641\\u062D\\u0629\",blockTitle:\"\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\",blockText:\"\\u0627\\u0644\\u0646\\u0635\",imageUrl:\"\\u0631\\u0627\\u0628\\u0637 \\u0627\\u0644\\u0635\\u0648\\u0631\\u0629\",imageCaption:\"\\u0627\\u0644\\u062A\\u0639\\u0644\\u064A\\u0642\",imageTitle:\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0635\\u0648\\u0631\\u0629\",imageMeta:\"\\u0627\\u0644\\u0645\\u0635\\u062F\\u0631 / \\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\",pageOf:(e,t)=>`\\u0635\\u0641\\u062D\\u0629 ${e} \\u0645\\u0646 ${t}`,moveUp:\"\\u0644\\u0623\\u0639\\u0644\\u0649\",moveDown:\"\\u0644\\u0623\\u0633\\u0641\\u0644\",removeBlock:\"\\u0625\\u0632\\u0627\\u0644\\u0629\",files:\"\\u0645\\u0644\\u0641\\u0627\\u062A\",importBookJson:\"\\u0627\\u0633\\u062A\\u064A\\u0631\\u0627\\u062F \\u0627\\u0644\\u0643\\u062A\\u0627\\u0628 (JSON)\",exportBookJson:\"\\u062A\\u0635\\u062F\\u064A\\u0631 \\u0627\\u0644\\u0643\\u062A\\u0627\\u0628 (JSON)\",importOrderedImages:\"\\u0627\\u0633\\u062A\\u064A\\u0631\\u0627\\u062F \\u0641\\u0648\\u0644\\u062F\\u0631 \\u0635\\u0648\\u0631 \\u2014 \\u0645\\u0631\\u062A\\u0628\\u0629 0\\u060C1\\u060C2\\u2026 \\u0648\\u062A\\u062A\\u0648\\u0632\\u0639 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0643\\u0627\\u0631\\u062F\\u0627\\u062A \\u0628\\u0627\\u0644\\u062A\\u0631\\u062A\\u064A\\u0628\",importManifestFolder:\"\\u0627\\u0633\\u062A\\u064A\\u0631\\u0627\\u062F \\u0641\\u0648\\u0644\\u062F\\u0631 \\u0641\\u064A\\u0647 manifest.json + \\u0627\\u0644\\u0635\\u0648\\u0631 \\u0628\\u062A\\u0627\\u0639\\u062A\\u0647\",importDone:e=>`\\u062A\\u0645 \\u0627\\u0633\\u062A\\u064A\\u0631\\u0627\\u062F ${e} \\u0635\\u0648\\u0631\\u0629.`,importNoManifest:\"\\u0645\\u0627\\u0641\\u064A\\u0634 \\u0645\\u0644\\u0641 manifest.json \\u062C\\u0648\\u0627 \\u0627\\u0644\\u0641\\u0648\\u0644\\u062F\\u0631 \\u062F\\u0647.\",importSkipped:e=>`${e} \\u0639\\u0646\\u0635\\u0631 \\u0628\\u064A\\u0634\\u0627\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0648\\u0631\\u0642\\u0629 \\u0645\\u0634 \\u0645\\u0648\\u062C\\u0648\\u062F\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0643\\u062A\\u0627\\u0628 \\u062F\\u0647.`,cardNote:\"\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\"}};function J({label:e,theme:t,children:a}){return(0,n.jsxs)(\"div\",{className:\"mb-3\",children:[(0,n.jsx)(\"p\",{className:\"text-[11px] font-bold uppercase tracking-wide mb-1\",style:{color:t.inkSoft},children:e}),a]})}function ee({value:e,onChange:t,theme:a,skin:o,placeholder:r,type:l=\"text\"}){return(0,n.jsx)(\"input\",{type:l,value:e!=null?e:\"\",onChange:s=>t(l===\"number\"?s.target.valueAsNumber:s.target.value),placeholder:r,className:\"w-full text-sm px-3 py-2\",style:{borderRadius:o.radiusSm,border:`1px solid ${a.hairline}`,background:a.surface,color:a.ink}})}function Mx({value:e,onChange:t,theme:a,skin:o,placeholder:r,minHeight:l=76}){let s=(0,D.useRef)(null);(0,D.useEffect)(()=>{s.current&&(s.current.innerHTML=e||\"\")},[]);let u=(f,g)=>{var y;(y=s.current)==null||y.focus(),document.execCommand(f,!1,g),t(s.current.innerHTML)},i=f=>{let g=window.getSelection();if(!g||g.rangeCount===0||g.isCollapsed)return;let y=g.getRangeAt(0),k=document.createElement(\"bdi\");f&&k.setAttribute(\"dir\",f);try{y.surroundContents(k)}catch(v){}t(s.current.innerHTML)},d=[\"#241B13\",\"#E8654A\",\"#0E7C79\",\"#8B5CF6\",\"#D97706\",\"#E11D48\"],p={borderRadius:6,color:a.ink,background:a.surface,border:`1px solid ${a.hairline}`};return(0,n.jsxs)(\"div\",{children:[(0,n.jsxs)(\"div\",{className:\"flex flex-wrap items-center gap-1.5 mb-1.5 p-1.5\",style:{borderRadius:o.radiusSm,background:a.surfaceSoft,border:`1px solid ${a.hairline}`},children:[(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>u(\"bold\"),className:\"w-7 h-7 grid place-items-center font-black text-xs\",style:p,title:\"Bold\",children:\"B\"}),d.map(f=>(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>u(\"foreColor\",f),className:\"w-5 h-5 rounded-full shrink-0\",style:{background:f,border:`1px solid ${a.hairlineStrong}`},title:f},f)),(0,n.jsxs)(\"select\",{onChange:f=>f.target.value&&u(\"fontName\",f.target.value),className:\"text-xs px-1.5 py-1\",style:{...p,maxWidth:84},defaultValue:\"\",children:[(0,n.jsx)(\"option\",{value:\"\",disabled:!0,children:\"Aa\"}),(0,n.jsx)(\"option\",{value:\"monospace\",children:\"Mono\"}),(0,n.jsx)(\"option\",{value:\"Georgia\",children:\"Serif\"}),(0,n.jsx)(\"option\",{value:\"sans-serif\",children:\"Sans\"})]}),(0,n.jsx)(\"span\",{className:\"w-px h-5 mx-0.5\",style:{background:a.hairlineStrong}}),(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>i(\"auto\"),className:\"text-[10px] font-bold px-2 py-1\",style:p,title:\"BDI \\u2014 auto isolate\",children:\"bdi\"}),(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>i(\"ltr\"),className:\"text-[10px] font-bold px-2 py-1\",style:p,children:\"LTR\"}),(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>i(\"rtl\"),className:\"text-[10px] font-bold px-2 py-1\",style:p,children:\"RTL\"})]}),(0,n.jsx)(\"div\",{ref:s,contentEditable:!0,suppressContentEditableWarning:!0,dir:\"auto\",onInput:()=>t(s.current.innerHTML),className:\"w-full text-sm px-3 py-2.5 outline-none\",style:{minHeight:l,borderRadius:o.radiusSm,border:`1px solid ${a.hairline}`,background:a.surface,color:a.ink,lineHeight:1.7},\"data-placeholder\":r})]})}function Rx({q:e,lang:t,onChangeLang:a,theme:o,skin:r,t:l}){let s=e[t]||{},u=i=>a({...s,...i});switch(e.type){case\"single\":case\"multi\":{let i=s.options||[],d=e.type===\"multi\",p=f=>{if(d){let g=Array.isArray(s.correct)?s.correct:[];u({correct:g.includes(f)?g.filter(y=>y!==f):[...g,f].sort((y,k)=>y-k)})}else u({correct:f})};return(0,n.jsxs)(J,{label:l.options,theme:o,children:[i.map((f,g)=>{let y=d?(s.correct||[]).includes(g):s.correct===g;return(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2 mb-1.5\",children:[(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>p(g),className:\"w-6 h-6 shrink-0 grid place-items-center\",style:{borderRadius:d?6:999,border:`2px solid ${o.accent}`,background:y?o.accent:\"transparent\"},children:y&&(0,n.jsx)(it,{size:12,color:o.accentInk})}),(0,n.jsx)(\"input\",{value:f,onChange:k=>{let v=[...i];v[g]=k.target.value,u({options:v})},className:\"flex-1 text-sm px-2.5 py-1.5\",style:{borderRadius:r.radiusSm,border:`1px solid ${o.hairline}`,background:o.surface,color:o.ink}}),(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>u({options:i.filter((k,v)=>v!==g)}),style:{color:o.inkSoft},children:(0,n.jsx)(Ot,{size:14})})]},g)}),(0,n.jsxs)(\"button\",{type:\"button\",onClick:()=>u({options:[...i,\"\"]}),className:\"text-xs font-bold px-2.5 py-1.5\",style:{borderRadius:r.radiusSm,border:`1px dashed ${o.hairlineStrong}`,color:o.accent},children:[\"+ \",l.addOption]})]})}case\"tf\":return(0,n.jsx)(J,{label:l.correct,theme:o,children:(0,n.jsx)(\"div\",{className:\"flex gap-2\",children:[!0,!1].map(i=>(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>u({correct:i}),className:\"flex-1 text-sm font-bold py-2\",style:{borderRadius:r.radiusSm,background:s.correct===i?o.accent:o.surface,color:s.correct===i?o.accentInk:o.ink,border:`1px solid ${o.hairline}`},children:i?l.trueLabel:l.falseLabel},String(i)))})});case\"short\":return(0,n.jsx)(J,{label:l.accepted,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.accepted||[]).join(\", \"),onChange:i=>u({accepted:i.split(\",\").map(d=>d.trim()).filter(Boolean)})})});case\"essay\":return(0,n.jsx)(J,{label:l.modelAnswer,theme:o,children:(0,n.jsx)(\"textarea\",{value:s.model||\"\",onChange:i=>u({model:i.target.value}),rows:3,className:\"w-full text-sm px-3 py-2\",style:{borderRadius:r.radiusSm,border:`1px solid ${o.hairline}`,background:o.surface,color:o.ink}})});case\"fill\":return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(J,{label:l.template,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:s.template,onChange:i=>u({template:i})})}),(0,n.jsx)(J,{label:l.blanks,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.blanks||[]).join(\", \"),onChange:i=>u({blanks:i.split(\",\").map(d=>d.trim())})})})]});case\"cloze\":return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(J,{label:l.template,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:s.template,onChange:i=>u({template:i})})}),(0,n.jsx)(J,{label:l.bank,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.bank||[]).join(\", \"),onChange:i=>u({bank:i.split(\",\").map(d=>d.trim())})})}),(0,n.jsx)(J,{label:l.correctWord,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:s.correct,onChange:i=>u({correct:i})})})]});case\"match\":return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(J,{label:l.left,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.left||[]).join(\", \"),onChange:i=>u({left:i.split(\",\").map(d=>d.trim())})})}),(0,n.jsx)(J,{label:l.right,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.right||[]).join(\", \"),onChange:i=>u({right:i.split(\",\").map(d=>d.trim())})})}),(0,n.jsx)(J,{label:l.correct,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.correct||[]).join(\", \"),onChange:i=>u({correct:i.split(\",\").map(d=>parseInt(d.trim(),10))})})})]});case\"order\":return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(J,{label:l.items,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.items||[]).join(\", \"),onChange:i=>u({items:i.split(\",\").map(d=>d.trim())})})}),(0,n.jsx)(J,{label:l.correct,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.correct||[]).join(\", \"),onChange:i=>u({correct:i.split(\",\").map(d=>d.trim())})})})]});case\"sort\":return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(J,{label:l.bins,theme:o,children:(0,n.jsx)(ee,{theme:o,skin:r,value:(s.bins||[]).join(\", \"),onChange:i=>u({bins:i.split(\",\").map(d=>d.trim())})})}),(0,n.jsx)(J,{label:l.sortItems,theme:o,children:(0,n.jsx)(\"textarea\",{value:(s.items||[]).map(i=>i.join(\":\")).join(`\n`),onChange:i=>u({items:i.target.value.split(`\n`).filter(Boolean).map(d=>d.split(\":\").map(p=>p.trim()))}),rows:4,className:\"w-full text-sm px-3 py-2\",style:{borderRadius:r.radiusSm,border:`1px solid ${o.hairline}`,background:o.surface,color:o.ink,fontFamily:\"monospace\"}})})]});case\"numeric\":return(0,n.jsxs)(\"div\",{className:\"grid grid-cols-2 gap-2\",children:[(0,n.jsx)(J,{label:l.correct,theme:o,children:(0,n.jsx)(ee,{type:\"number\",theme:o,skin:r,value:s.correct,onChange:i=>u({correct:i})})}),(0,n.jsx)(J,{label:l.tolerance,theme:o,children:(0,n.jsx)(ee,{type:\"number\",theme:o,skin:r,value:s.tolerance,onChange:i=>u({tolerance:i})})})]});case\"rating\":return null;case\"slider\":return(0,n.jsxs)(\"div\",{className:\"grid grid-cols-2 gap-2\",children:[(0,n.jsx)(J,{label:l.min,theme:o,children:(0,n.jsx)(ee,{type:\"number\",theme:o,skin:r,value:s.min,onChange:i=>u({min:i})})}),(0,n.jsx)(J,{label:l.max,theme:o,children:(0,n.jsx)(ee,{type:\"number\",theme:o,skin:r,value:s.max,onChange:i=>u({max:i})})}),(0,n.jsx)(J,{label:l.step,theme:o,children:(0,n.jsx)(ee,{type:\"number\",theme:o,skin:r,value:s.step,onChange:i=>u({step:i})})}),(0,n.jsx)(J,{label:l.correct,theme:o,children:(0,n.jsx)(ee,{type:\"number\",theme:o,skin:r,value:s.correct,onChange:i=>u({correct:i})})}),(0,n.jsx)(J,{label:l.tolerance,theme:o,children:(0,n.jsx)(ee,{type:\"number\",theme:o,skin:r,value:s.tolerance,onChange:i=>u({tolerance:i})})})]});default:return null}}function Gn(e){return typeof e==\"string\"?e:e.leafId}function hi(e){return typeof e==\"string\"?null:e.blockId||null}function ll(e){return typeof e==\"string\"?e:`${e.leafId}::${e.blockId||\"\"}`}function On(e,t,a){var r;if(!e||!t)return null;let o=(e.pageBlocks||[]).find(l=>l.id===t);return o?o.title||((r=o.text)==null?void 0:r.slice(0,24))||a[`block${o.kind[0].toUpperCase()}${o.kind.slice(1)}`]||o.kind:null}function Hx({allLeaves:e,currentLeafId:t,linkedTo:a,lang:o,theme:r,skin:l,t:s,onChange:u}){let[i,d]=(0,D.useState)(\"\"),[p,f]=(0,D.useState)(null),g=a||[],y=g.map(Gn),k=e.filter(c=>c.id!==t&&(o===\"ar\"?c.ar:c.en).toLowerCase().includes(i.toLowerCase())),v=p?e.find(c=>c.id===p):null,I=v?(v.pageBlocks||[]).filter(c=>c.kind!==\"pagebreak\"):[],x=c=>{u([...g,c]),d(\"\"),f(null)};return(0,n.jsxs)(\"div\",{children:[g.length>0&&(0,n.jsx)(\"div\",{className:\"flex flex-wrap gap-1.5 mb-1.5\",children:g.map((c,m)=>{let h=e.find(b=>b.id===Gn(c));if(!h)return null;let L=hi(c),F=L?On(h,L,s):null;return(0,n.jsxs)(\"span\",{className:\"flex items-center gap-1 text-[11px] font-bold px-2.5 py-1\",style:{borderRadius:999,background:r.accent,color:r.accentInk},children:[o===\"ar\"?h.ar:h.en,F&&(0,n.jsxs)(\"span\",{style:{opacity:.8,fontWeight:600},children:[\"\\u203A \",F]}),(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>u(g.filter((b,C)=>C!==m)),children:(0,n.jsx)(ct,{size:11})})]},ll(c)+m)})}),v?(0,n.jsxs)(\"div\",{className:\"p-2\",style:{borderRadius:l.radiusSm,border:`1px solid ${r.hairlineStrong}`,background:r.surface},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between mb-1.5\",children:[(0,n.jsxs)(\"p\",{className:\"text-[11px] font-bold\",style:{color:r.inkSoft},children:[s.linkToBlockHint,\" \\u2014 \",o===\"ar\"?v.ar:v.en]}),(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>f(null),className:\"text-[11px] font-bold\",style:{color:r.accent},children:(0,n.jsx)(ct,{size:12})})]}),(0,n.jsxs)(\"div\",{className:\"flex flex-wrap gap-1.5\",children:[(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>x(v.id),className:\"text-[11px] font-bold px-2.5 py-1\",style:{borderRadius:999,border:`1.5px dashed ${r.accent}`,color:r.accent},children:s.linkWholeLeaf}),I.map(c=>{var h,L;let m=nl(rl(v.pagePaletteId||1));return(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>x({leafId:v.id,blockId:c.id}),className:\"text-[11px] font-bold px-2.5 py-1\",style:{borderRadius:999,background:((h=m[c.kind])==null?void 0:h.bg)||r.surfaceSoft,color:((L=m[c.kind])==null?void 0:L.fg)||r.ink},children:On(v,c.id,s)},c.id)})]})]}):(0,n.jsxs)(\"div\",{className:\"relative\",children:[(0,n.jsx)(ee,{theme:r,skin:l,value:i,onChange:d,placeholder:s.linkedHint}),i&&k.length>0&&(0,n.jsx)(\"div\",{className:\"absolute z-10 mt-1 w-full max-h-40 overflow-y-auto\",style:{borderRadius:l.radiusSm,background:r.surface,border:`1px solid ${r.hairlineStrong}`,boxShadow:l.shadow},children:k.slice(0,8).map(c=>(0,n.jsxs)(\"button\",{type:\"button\",onClick:()=>{(c.pageBlocks||[]).some(m=>m.kind!==\"pagebreak\")?(f(c.id),d(\"\")):x(c.id)},className:\"w-full text-start text-xs px-3 py-2 flex items-center justify-between gap-2\",style:{color:r.ink},children:[(0,n.jsx)(\"span\",{children:o===\"ar\"?c.ar:c.en}),y.includes(c.id)&&(0,n.jsx)(\"span\",{className:\"text-[10px]\",style:{color:r.inkSoft},children:\"\\u2713\"})]},c.id))})]})]})}function Gx({q:e,lang:t,theme:a,skin:o,t:r,onUpdate:l,onDelete:s,allLeaves:u,currentLeafId:i,voiceEnabled:d}){var v,I,x,c,m,h;let p=Ce[e.type],f=e[t]||{},g=f.template!==void 0?\"template\":\"prompt\",y=L=>l({[t]:{...f,...L}}),k=L=>y({[g]:L});return(0,n.jsxs)(\"div\",{style:{borderRadius:12,border:`1px solid ${a.hairline}`,overflow:\"hidden\"},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between gap-2 px-3.5 py-2.5\",style:{background:p.color.bg,color:p.color.ink},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(p.Icon,{size:14}),(0,n.jsx)(\"span\",{className:\"text-xs font-bold\",children:t===\"ar\"?p.ar:p.en})]}),(0,n.jsx)(\"button\",{onClick:s,className:\"w-6 h-6 grid place-items-center\",style:{borderRadius:999,background:\"rgba(0,0,0,0.12)\"},title:r.delete,children:(0,n.jsx)(Ot,{size:12})})]}),(0,n.jsxs)(\"div\",{className:\"p-3.5\",style:{background:a.surface},children:[(0,n.jsx)(J,{label:r.prompt,theme:a,children:(0,n.jsx)(Mx,{value:f[g]||\"\",onChange:k,theme:a,skin:o,placeholder:r.prompt},e.id+t)}),(0,n.jsx)(Rx,{q:e,lang:t,onChangeLang:y,theme:a,skin:o,t:r}),d&&(0,n.jsxs)(J,{label:r.voice,theme:a,children:[(0,n.jsx)(ee,{theme:a,skin:o,value:(v=e.voice)==null?void 0:v.url,onChange:L=>l({voice:{...e.voice||{},url:L}}),placeholder:\"https://\\u2026\"}),(0,n.jsxs)(\"label\",{className:\"flex items-center gap-1.5 mt-1.5 text-xs font-semibold\",style:{color:a.inkSoft},children:[(0,n.jsx)(\"input\",{type:\"checkbox\",checked:!!((I=e.voice)!=null&&I.enabled),onChange:L=>l({voice:{...e.voice||{},enabled:L.target.checked}})}),r.voiceOn]})]}),(0,n.jsxs)(J,{label:r.code,theme:a,children:[(0,n.jsxs)(\"div\",{className:\"flex gap-2 mb-1.5 items-center\",children:[(0,n.jsx)(ee,{theme:a,skin:o,value:(x=e.code)==null?void 0:x.lang,onChange:L=>l({code:{...e.code||{},lang:L}}),placeholder:r.codeLang}),(0,n.jsxs)(\"label\",{className:\"flex items-center gap-1.5 text-xs font-semibold shrink-0 px-2\",style:{color:a.inkSoft},children:[(0,n.jsx)(\"input\",{type:\"checkbox\",checked:!!((c=e.code)!=null&&c.enabled),onChange:L=>l({code:{...e.code||{},enabled:L.target.checked}})}),r.code]})]}),((m=e.code)==null?void 0:m.enabled)&&(0,n.jsx)(\"textarea\",{value:((h=e.code)==null?void 0:h.src)||\"\",onChange:L=>l({code:{...e.code||{},src:L.target.value}}),rows:4,className:\"w-full text-sm px-3 py-2\",style:{borderRadius:o.radiusSm,border:`1px solid ${a.hairline}`,background:a.canvas,color:a.ink,fontFamily:\"'Space Mono', monospace\"}})]}),(0,n.jsx)(J,{label:r.linked,theme:a,children:(0,n.jsx)(Hx,{allLeaves:u,currentLeafId:i,linkedTo:e.linkedTo,lang:t,theme:a,skin:o,t:r,onChange:L=>l({linkedTo:L})})})]})]})}function pp({label:e,uploadLabel:t,removeLabel:a,accept:o,value:r,onChange:l,theme:s,skin:u,kind:i}){let d=(0,D.useRef)(`media-${i}-${Math.random().toString(36).slice(2,8)}`).current,[p,f]=(0,D.useState)(!1),g=async k=>{let v=k.target.files&&k.target.files[0];if(k.target.value=\"\",!!v){f(!0);try{let I=await gi(v);l(I)}finally{f(!1)}}},y=r?Math.round(r.length*.75/(1024*1024)*10)/10:0;return(0,n.jsxs)(\"div\",{className:\"mb-3\",children:[(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between mb-1.5\",children:[(0,n.jsx)(\"p\",{className:\"text-[11px] font-bold uppercase tracking-wide\",style:{color:s.inkSoft},children:e}),r&&(0,n.jsxs)(\"span\",{className:\"text-[10px] font-semibold\",style:{color:s.inkSoft},children:[\"~\",y,\" MB\"]})]}),r?(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-1.5\",children:[i===\"video\"?(0,n.jsx)(\"video\",{src:r,controls:!0,playsInline:!0,className:\"w-full\",style:{borderRadius:u.radiusSm,maxHeight:160,background:\"#000\"}}):(0,n.jsx)(\"audio\",{src:r,controls:!0,className:\"w-full\"}),(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>l(null),className:\"self-start text-[11px] font-bold px-2 py-1\",style:{borderRadius:6,color:\"#7A2A12\",background:\"#FFD9CE\"},children:a})]}):(0,n.jsx)(\"label\",{htmlFor:d,className:\"flex items-center justify-center text-xs font-bold px-3 py-2.5 cursor-pointer\",style:{borderRadius:u.radiusSm,border:`1px dashed ${s.hairlineStrong}`,color:s.inkSoft,background:s.surface},children:p?\"\\u2026\":t}),(0,n.jsx)(\"input\",{id:d,type:\"file\",accept:o,onChange:g,className:\"hidden\"})]})}function Ox({card:e,lang:t,theme:a,skin:o,t:r,onUpdateCard:l,onDeleteCard:s,allLeaves:u,currentLeafId:i,voiceEnabled:d}){let p=e.imagePosition||\"top\",f=(0,D.useRef)({}),g=(c,m)=>l({questions:e.questions.map((h,L)=>L===c?{...h,...m}:h)}),y=c=>l({questions:e.questions.filter((m,h)=>h!==c)}),k=c=>{let m={id:`${e.id}-${Date.now()}`,type:c,subject:\"\",difficulty:\"Beginner\",tier:\"core\",dir:\"ltr\",en:{prompt:\"\"},ar:{prompt:\"\"}};l({questions:[...e.questions,m]})},v=c=>{var m;return(m=f.current[c])==null?void 0:m.scrollIntoView({behavior:\"smooth\",block:\"center\"})},I=[...e.cardLinkedTo||[],...e.questions.flatMap(c=>c.linkedTo||[])],x=Array.from(new Map(I.map(c=>[ll(c),c])).values());return(0,n.jsxs)(\"div\",{className:\"educraft-panel-in\",style:{borderRadius:o.radiusLg,border:`1px solid ${a.hairlineStrong}`,background:a.surfaceSoft,padding:14},children:[(0,n.jsxs)(\"div\",{className:\"flex items-start justify-between gap-3 mb-3\",children:[(0,n.jsx)(\"p\",{className:\"text-xs font-bold\",style:{color:a.inkSoft},children:r.cardImage}),(0,n.jsx)(\"button\",{onClick:s,className:\"text-xs font-bold px-2.5 py-1.5 shrink-0\",style:{borderRadius:8,color:\"#7A2A12\",background:\"#FFD9CE\"},children:r.deleteCard})]}),(0,n.jsx)(\"div\",{className:\"mb-2\",style:{height:110,borderRadius:12,overflow:\"hidden\",background:e.image?void 0:\"repeating-linear-gradient(45deg, \"+a.surface+\", \"+a.surface+\" 8px, \"+a.hairline+\" 8px, \"+a.hairline+\" 16px)\",display:\"flex\",alignItems:\"center\",justifyContent:\"center\"},children:e.image?(0,n.jsx)(\"img\",{src:e.image,alt:\"\",style:{width:\"100%\",height:\"100%\",objectFit:\"cover\"}}):(0,n.jsx)(\"span\",{className:\"text-xs font-semibold\",style:{color:a.inkSoft},children:r.cardImage})}),(0,n.jsx)(ee,{theme:a,skin:o,value:e.image,onChange:c=>l({image:c}),placeholder:\"https://\\u2026\"}),(0,n.jsx)(\"div\",{className:\"flex gap-1.5 mt-1.5 mb-3\",children:[[\"top\",r.posTop],[\"right\",r.posRight],[\"left\",r.posLeft],[\"none\",r.posNone]].map(([c,m])=>(0,n.jsx)(\"button\",{type:\"button\",onClick:()=>l({imagePosition:c}),className:\"text-[11px] font-bold px-2 py-1\",style:{borderRadius:6,background:p===c?a.accent:a.surface,color:p===c?a.accentInk:a.ink},children:m},c))}),(0,n.jsx)(pp,{label:r.cardVideo,uploadLabel:r.uploadVideo,removeLabel:r.removeMedia,accept:\"video/*\",value:e.video,onChange:c=>l({video:c}),theme:a,skin:o,kind:\"video\"}),(0,n.jsx)(pp,{label:r.cardAudio,uploadLabel:r.uploadAudio,removeLabel:r.removeMedia,accept:\"audio/*\",value:e.audio,onChange:c=>l({audio:c}),theme:a,skin:o,kind:\"audio\"}),(0,n.jsx)(\"input\",{value:e.note||\"\",onChange:c=>l({note:c.target.value}),placeholder:r.cardNote,dir:\"auto\",className:\"w-full text-xs px-3 py-2 mb-3\",style:{borderRadius:o.radiusSm,border:`1px solid ${a.hairline}`,background:a.surface,color:a.inkSoft}}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1.5 overflow-x-auto pb-1 mb-3\",children:[e.questions.map((c,m)=>{let h=Ce[c.type];return(0,n.jsxs)(\"button\",{onClick:()=>v(c.id),className:\"shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5\",style:{borderRadius:999,background:h.color.bg,color:h.color.ink},children:[(0,n.jsx)(h.Icon,{size:12}),t===\"ar\"?h.ar:h.en]},c.id||m)}),x.map((c,m)=>{let h=u.find(b=>b.id===Gn(c));if(!h)return null;let L=hi(c),F=L?On(h,L,r):null;return(0,n.jsxs)(\"span\",{className:\"shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5\",style:{borderRadius:999,background:\"transparent\",border:`1.5px dashed ${a.accent}`,color:a.accent},children:[(0,n.jsx)(Ht,{size:11}),t===\"ar\"?h.ar:h.en,F&&(0,n.jsxs)(\"span\",{style:{opacity:.8},children:[\"\\u203A \",F]})]},ll(c)+m)}),(0,n.jsxs)(\"div\",{className:\"relative group shrink-0\",children:[(0,n.jsx)(\"button\",{className:\"w-7 h-7 grid place-items-center\",style:{borderRadius:999,border:`1.5px dashed ${a.hairlineStrong}`,color:a.ink},title:r.addQuestion,children:\"+\"}),(0,n.jsx)(\"div\",{className:\"hidden group-hover:grid absolute z-10 mt-1 grid-cols-4 gap-1 p-2\",style:{borderRadius:o.radiusSm,background:a.surface,border:`1px solid ${a.hairlineStrong}`,boxShadow:o.shadow},children:Object.entries(Ce).map(([c,m])=>(0,n.jsx)(\"button\",{onClick:()=>k(c),className:\"w-7 h-7 grid place-items-center\",style:{borderRadius:999,background:m.color.bg,color:m.color.ink},title:t===\"ar\"?m.ar:m.en,children:(0,n.jsx)(m.Icon,{size:12})},c))})]})]}),(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-3\",children:[e.questions.map((c,m)=>(0,n.jsx)(\"div\",{ref:h=>f.current[c.id]=h,children:(0,n.jsx)(Gx,{q:c,lang:t,theme:a,skin:o,t:r,voiceEnabled:d,allLeaves:u,currentLeafId:i,onUpdate:h=>g(m,h),onDelete:()=>y(m)})},c.id||m)),e.questions.length===0&&(0,n.jsx)(\"p\",{className:\"text-xs\",style:{color:a.inkSoft},children:r.noQuestionsInCard})]})]})}function zx({book:e,lang:t,theme:a,selectedLeafId:o,onSelect:r}){let l=e.nodes.filter(i=>i.level===\"branch\"),s=i=>e.nodes.filter(d=>d.level===\"sub\"&&d.parent===i),u=i=>e.nodes.filter(d=>d.level===\"leaf\"&&d.parent===i);return(0,n.jsx)(\"div\",{className:\"flex flex-col gap-3\",children:l.map(i=>(0,n.jsxs)(\"div\",{children:[(0,n.jsxs)(\"p\",{className:\"text-xs font-black uppercase tracking-wide mb-1.5 flex items-center gap-1.5\",style:{color:a.accent},children:[(0,n.jsx)(Ht,{size:12}),\" \",t===\"ar\"?i.ar:i.en]}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-2 ps-3\",style:{borderInlineStart:`2px solid ${a.hairline}`},children:s(i.id).map(d=>(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"p\",{className:\"text-[11px] font-bold mb-1\",style:{color:a.inkSoft},children:t===\"ar\"?d.ar:d.en}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-1 ps-2\",children:u(d.id).map(p=>(0,n.jsxs)(\"button\",{onClick:()=>r(p.id),className:\"text-start text-xs font-semibold px-2.5 py-1.5 flex items-center justify-between gap-2\",style:{borderRadius:8,background:o===p.id?a.accentSoft:\"transparent\",color:a.ink,border:`1px solid ${o===p.id?a.accent:\"transparent\"}`},children:[(0,n.jsx)(\"span\",{children:t===\"ar\"?p.ar:p.en}),(0,n.jsx)(\"span\",{className:\"text-[10px]\",style:{color:a.inkSoft},children:(p.questions||[]).length})]},p.id))})]},d.id))})]},i.id))})}var zn=[{id:1,name:\"\\u0643\\u0644\\u0627\\u0633\\u064A\\u0643 \\u0623\\u0643\\u0627\\u062F\\u064A\\u0645\\u064A\",PageBG:\"#F8F5F0\",HeaderColor:\"#2E4060\",SectionBG:\"#E8874A\",SectionFrame:\"#C96B2F\",KeyBG:\"#E8F7F9\",KeyFrame:\"#4C9DB0\",KeyText:\"#1A6B7A\",NoteBG:\"#F0EDF7\",NoteFrame:\"#655A7C\",NoteText:\"#3B3050\",BodyText:\"#000000\",WarningBG:\"#F2F4E6\",WarningFrame:\"#84922A\",WarningText:\"#626D17\",ImportantText:\"#14428F\",HighlightBG:\"#D9E0F2\"},{id:2,name:\"\\u0623\\u0632\\u0631\\u0642 \\u0645\\u062D\\u0627\\u064A\\u062F\",PageBG:\"#F5F8FA\",HeaderColor:\"#1B3A5C\",SectionBG:\"#2E6F9E\",SectionFrame:\"#1F4F73\",KeyBG:\"#E6F2F8\",KeyFrame:\"#3E8FBF\",KeyText:\"#14506E\",NoteBG:\"#EAEFF5\",NoteFrame:\"#52688A\",NoteText:\"#2A3A52\",BodyText:\"#000000\",WarningBG:\"#E8E6F4\",WarningFrame:\"#4934B2\",WarningText:\"#26176D\",ImportantText:\"#8F4514\",HighlightBG:\"#F2ECD9\"},{id:3,name:\"\\u0631\\u0645\\u0627\\u062F\\u064A \\u0623\\u0646\\u064A\\u0642\",PageBG:\"#F7F7F6\",HeaderColor:\"#33363B\",SectionBG:\"#6E5046\",SectionFrame:\"#4F3A33\",KeyBG:\"#EDEDEA\",KeyFrame:\"#8A8580\",KeyText:\"#3A3833\",NoteBG:\"#F1ECEA\",NoteFrame:\"#8C6F62\",NoteText:\"#4A3A32\",BodyText:\"#000000\",WarningBG:\"#F4F4E6\",WarningFrame:\"#92922A\",WarningText:\"#6D6D17\",ImportantText:\"#14148F\",HighlightBG:\"#D9E3F2\"},{id:4,name:\"\\u0628\\u0627\\u0633\\u062A\\u064A\\u0644 \\u0648\\u0631\\u062F\\u064A\",PageBG:\"#FDF6F5\",HeaderColor:\"#8C4B5A\",SectionBG:\"#E8A0AC\",SectionFrame:\"#C97584\",KeyBG:\"#FCEDEF\",KeyFrame:\"#D98A9A\",KeyText:\"#8A3D4C\",NoteBG:\"#FBF0E9\",NoteFrame:\"#C99E84\",NoteText:\"#6E4A36\",BodyText:\"#000000\",WarningBG:\"#F4EEE6\",WarningFrame:\"#B27D34\",WarningText:\"#6D4917\",ImportantText:\"#127481\",HighlightBG:\"#D9EEF2\"},{id:5,name:\"\\u0628\\u0627\\u0633\\u062A\\u064A\\u0644 \\u0646\\u0639\\u0646\\u0627\\u0639\\u064A\",PageBG:\"#F4FAF7\",HeaderColor:\"#2F6B57\",SectionBG:\"#6FBFA0\",SectionFrame:\"#409478\",KeyBG:\"#E7F7F1\",KeyFrame:\"#52B399\",KeyText:\"#1F6B53\",NoteBG:\"#EEF6F8\",NoteFrame:\"#6FA8B5\",NoteText:\"#2C5A66\",BodyText:\"#000000\",WarningBG:\"#E6EFF4\",WarningFrame:\"#3484B2\",WarningText:\"#174E6D\",ImportantText:\"#8F1452\",HighlightBG:\"#F2D9DA\"},{id:6,name:\"\\u0628\\u0627\\u0633\\u062A\\u064A\\u0644 \\u0644\\u0627\\u0641\\u0646\\u062F\\u0631\",PageBG:\"#F8F6FB\",HeaderColor:\"#4A3F73\",SectionBG:\"#9A8AC7\",SectionFrame:\"#6F5DA3\",KeyBG:\"#EFEAF8\",KeyFrame:\"#8470B8\",KeyText:\"#4B3A7A\",NoteBG:\"#EAF0F6\",NoteFrame:\"#7E93B0\",NoteText:\"#354A66\",BodyText:\"#000000\",WarningBG:\"#F4E6F4\",WarningFrame:\"#B234B0\",WarningText:\"#6D176C\",ImportantText:\"#4C7411\",HighlightBG:\"#E3F2D9\"},{id:7,name:\"\\u0628\\u0627\\u0633\\u062A\\u064A\\u0644 \\u062E\\u0648\\u062E\\u064A\",PageBG:\"#FDF8F1\",HeaderColor:\"#8A5A2E\",SectionBG:\"#EFA85E\",SectionFrame:\"#D1873A\",KeyBG:\"#FCEFE0\",KeyFrame:\"#E0A05C\",KeyText:\"#7A4C20\",NoteBG:\"#FAF3E6\",NoteFrame:\"#C9A06A\",NoteText:\"#6B4E2A\",BodyText:\"#000000\",WarningBG:\"#F1F4E6\",WarningFrame:\"#7E9A2D\",WarningText:\"#576D17\",ImportantText:\"#14478F\",HighlightBG:\"#D9DDF2\"},{id:8,name:\"\\u0644\\u064A\\u0644\\u064A \\u0623\\u0632\\u0631\\u0642\",PageBG:\"#1B1F2A\",HeaderColor:\"#E8ECF2\",SectionBG:\"#3D6FB4\",SectionFrame:\"#6E9CDB\",KeyBG:\"#223240\",KeyFrame:\"#5EC3D6\",KeyText:\"#8FE3F0\",NoteBG:\"#282235\",NoteFrame:\"#9E8FD6\",NoteText:\"#C9BBF5\",BodyText:\"#E6E8EC\",WarningBG:\"#31244C\",WarningFrame:\"#774DCB\",WarningText:\"#BBA5E9\",ImportantText:\"#8999E6\",HighlightBG:\"#403D1C\"},{id:9,name:\"\\u0644\\u064A\\u0644\\u064A \\u0628\\u0646\\u0641\\u0633\\u062C\\u064A\",PageBG:\"#201A2B\",HeaderColor:\"#F0E9F7\",SectionBG:\"#8A5FBF\",SectionFrame:\"#AE8AE0\",KeyBG:\"#271F38\",KeyFrame:\"#4FB3A8\",KeyText:\"#8FE0D4\",NoteBG:\"#2A2230\",NoteFrame:\"#C99A6B\",NoteText:\"#EAC79A\",BodyText:\"#EDE7F4\",WarningBG:\"#4C2444\",WarningFrame:\"#CB4DB2\",WarningText:\"#E9A5DB\",ImportantText:\"#CA89E6\",HighlightBG:\"#24401C\"},{id:10,name:\"\\u0644\\u064A\\u0644\\u064A \\u0623\\u062E\\u0636\\u0631\",PageBG:\"#16201C\",HeaderColor:\"#E6F0EA\",SectionBG:\"#3E8E68\",SectionFrame:\"#63B58A\",KeyBG:\"#1C2A24\",KeyFrame:\"#5BAFA0\",KeyText:\"#9FE3D4\",NoteBG:\"#20251F\",NoteFrame:\"#A9A45E\",NoteText:\"#E1DC9E\",BodyText:\"#E7EDE9\",WarningBG:\"#24414C\",WarningFrame:\"#4DA9CB\",WarningText:\"#A5D6E9\",ImportantText:\"#89E6D1\",HighlightBG:\"#401C21\"},{id:11,name:\"\\u0637\\u0628\\u064A \\u0625\\u0643\\u0644\\u064A\\u0646\\u064A\\u0643\\u064A\",PageBG:\"#FAFCFD\",HeaderColor:\"#0E5C73\",SectionBG:\"#1C8FA8\",SectionFrame:\"#146C82\",KeyBG:\"#E3F6F4\",KeyFrame:\"#2BA89A\",KeyText:\"#0E6B5F\",NoteBG:\"#EAF4FB\",NoteFrame:\"#4A8FBF\",NoteText:\"#1B4F75\",BodyText:\"#000000\",WarningBG:\"#E6E7F4\",WarningFrame:\"#343DB2\",WarningText:\"#171D6D\",ImportantText:\"#8F3D14\",HighlightBG:\"#F2E6D9\"},{id:12,name:\"\\u0647\\u0646\\u062F\\u0633\\u064A \\u062A\\u0642\\u0646\\u064A\",PageBG:\"#F6F7F8\",HeaderColor:\"#22272E\",SectionBG:\"#E0A12C\",SectionFrame:\"#B8821B\",KeyBG:\"#E9EEF2\",KeyFrame:\"#4A6B8A\",KeyText:\"#1F3A52\",NoteBG:\"#EEEDEA\",NoteFrame:\"#8C8275\",NoteText:\"#4A4338\",BodyText:\"#000000\",WarningBG:\"#EFF4E6\",WarningFrame:\"#6E9A2D\",WarningText:\"#4B6D17\",ImportantText:\"#8F5214\",HighlightBG:\"#D9D9F2\"},{id:13,name:\"\\u0637\\u0628\\u064A\\u0639\\u064A \\u062A\\u0631\\u0627\\u0628\\u064A\",PageBG:\"#F7F5EE\",HeaderColor:\"#4A4520\",SectionBG:\"#8A9B5E\",SectionFrame:\"#677A3E\",KeyBG:\"#EFF1E3\",KeyFrame:\"#7E9460\",KeyText:\"#435228\",NoteBG:\"#F1E9DE\",NoteFrame:\"#A07D52\",NoteText:\"#5C4327\",BodyText:\"#000000\",WarningBG:\"#E6F4E6\",WarningFrame:\"#2FA232\",WarningText:\"#176D1A\",ImportantText:\"#14308F\",HighlightBG:\"#E8D9F2\"},{id:14,name:\"\\u0645\\u0644\\u0643\\u064A \\u0630\\u0647\\u0628\\u064A\",PageBG:\"#F9F7F1\",HeaderColor:\"#1F2A4A\",SectionBG:\"#B68A3E\",SectionFrame:\"#8C6A26\",KeyBG:\"#F3EEE0\",KeyFrame:\"#A9842F\",KeyText:\"#6B4F18\",NoteBG:\"#EFEAF1\",NoteFrame:\"#7A4F5E\",NoteText:\"#5A2E3C\",BodyText:\"#000000\",WarningBG:\"#EFF4E6\",WarningFrame:\"#709A2D\",WarningText:\"#4C6D17\",ImportantText:\"#14338F\",HighlightBG:\"#D9DAF2\"},{id:15,name:\"\\u0639\\u0635\\u0631\\u064A \\u062C\\u0631\\u064A\\u0621\",PageBG:\"#FBFBFA\",HeaderColor:\"#1A2E35\",SectionBG:\"#EB5E55\",SectionFrame:\"#C73E36\",KeyBG:\"#E3F4F2\",KeyFrame:\"#1FA39A\",KeyText:\"#0E6760\",NoteBG:\"#FDF1E3\",NoteFrame:\"#E0A23A\",NoteText:\"#7A4E12\",BodyText:\"#000000\",WarningBG:\"#F4F2E6\",WarningFrame:\"#A69030\",WarningText:\"#6D5D17\",ImportantText:\"#14148F\",HighlightBG:\"#D9E8F2\"},{id:16,name:\"\\u0623\\u062D\\u0645\\u0631 \\u0645\\u0631\\u062C\\u0627\\u0646\\u064A\",PageBG:\"#F7F3F3\",HeaderColor:\"#511F1F\",SectionBG:\"#C84141\",SectionFrame:\"#9D2525\",KeyBG:\"#E5F5ED\",KeyFrame:\"#3B9B6B\",KeyText:\"#1F6B45\",NoteBG:\"#EEEAF5\",NoteFrame:\"#654B9B\",NoteText:\"#3E2B64\",BodyText:\"#000000\",WarningBG:\"#F4F1E6\",WarningFrame:\"#A68930\",WarningText:\"#6D5817\",ImportantText:\"#117474\",HighlightBG:\"#D9EAF2\"},{id:17,name:\"\\u0623\\u062E\\u0636\\u0631 \\u0632\\u0645\\u0631\\u062F\\u064A\",PageBG:\"#F3F7F4\",HeaderColor:\"#1F512E\",SectionBG:\"#268241\",SectionFrame:\"#124E24\",KeyBG:\"#F2E5F5\",KeyFrame:\"#9B43B1\",KeyText:\"#5B1F6B\",NoteBG:\"#F5F1EA\",NoteFrame:\"#9B7D4B\",NoteText:\"#644F2B\",BodyText:\"#000000\",WarningBG:\"#E6F4F4\",WarningFrame:\"#2F9DA2\",WarningText:\"#176A6D\",ImportantText:\"#8F1470\",HighlightBG:\"#F2D9E2\"},{id:18,name:\"\\u0623\\u0631\\u062C\\u0648\\u0627\\u0646\\u064A\",PageBG:\"#F5F3F7\",HeaderColor:\"#3C1F51\",SectionBG:\"#9041C8\",SectionFrame:\"#6B259D\",KeyBG:\"#F4F5E5\",KeyFrame:\"#899037\",KeyText:\"#646B1F\",NoteBG:\"#EAF5F4\",NoteFrame:\"#499791\",NoteText:\"#2B645F\",BodyText:\"#000000\",WarningBG:\"#F4E6F0\",WarningFrame:\"#B23488\",WarningText:\"#6D1751\",ImportantText:\"#427411\",HighlightBG:\"#DBF2D9\"},{id:19,name:\"\\u0630\\u0647\\u0628\\u064A \\u0641\\u0627\\u062A\\u062D\",PageBG:\"#F7F6F3\",HeaderColor:\"#514B1F\",SectionBG:\"#7E7325\",SectionFrame:\"#4A4311\",KeyBG:\"#E5EFF5\",KeyFrame:\"#4388B1\",KeyText:\"#1F4E6B\",NoteBG:\"#F5EAF3\",NoteFrame:\"#9B4B8A\",NoteText:\"#642B58\",BodyText:\"#000000\",WarningBG:\"#EBF4E6\",WarningFrame:\"#589E2E\",WarningText:\"#376D17\",ImportantText:\"#14338F\",HighlightBG:\"#DED9F2\"},{id:20,name:\"\\u0633\\u0645\\u0627\\u0648\\u064A\",PageBG:\"#F3F6F7\",HeaderColor:\"#1F4951\",SectionBG:\"#297D8E\",SectionFrame:\"#154F5B\",KeyBG:\"#F5E5EA\",KeyFrame:\"#B14368\",KeyText:\"#6B1F38\",NoteBG:\"#F0F5EA\",NoteFrame:\"#709749\",NoteText:\"#47642B\",BodyText:\"#000000\",WarningBG:\"#E6E7F4\",WarningFrame:\"#343EB2\",WarningText:\"#171E6D\",ImportantText:\"#8F3314\",HighlightBG:\"#F2E6D9\"},{id:21,name:\"\\u0641\\u0648\\u0634\\u064A\\u0627\",PageBG:\"#F7F3F5\",HeaderColor:\"#511F3A\",SectionBG:\"#C73D88\",SectionFrame:\"#992463\",KeyBG:\"#E6F5E5\",KeyFrame:\"#409F3C\",KeyText:\"#226B1F\",NoteBG:\"#EAEDF5\",NoteFrame:\"#4B5B9B\",NoteText:\"#2B3764\",BodyText:\"#000000\",WarningBG:\"#F4E9E6\",WarningFrame:\"#B24E34\",WarningText:\"#6D2917\",ImportantText:\"#117845\",HighlightBG:\"#D9F2ED\"},{id:22,name:\"\\u0623\\u062E\\u0636\\u0631 \\u0631\\u0628\\u064A\\u0639\\u064A\",PageBG:\"#F4F7F3\",HeaderColor:\"#2B511F\",SectionBG:\"#3D8226\",SectionFrame:\"#214E12\",KeyBG:\"#E9E5F5\",KeyFrame:\"#5F43B1\",KeyText:\"#321F6B\",NoteBG:\"#F5EBEA\",NoteFrame:\"#9B514B\",NoteText:\"#64302B\",BodyText:\"#000000\",WarningBG:\"#E6F4ED\",WarningFrame:\"#2E9E66\",WarningText:\"#176D42\",ImportantText:\"#70148F\",HighlightBG:\"#F2D9F0\"},{id:23,name:\"\\u0623\\u0632\\u0631\\u0642 \\u0646\\u064A\\u0644\\u064A\",PageBG:\"#F3F3F7\",HeaderColor:\"#211F51\",SectionBG:\"#4741C8\",SectionFrame:\"#2A259D\",KeyBG:\"#F5EEE5\",KeyFrame:\"#B17F43\",KeyText:\"#6B481F\",NoteBG:\"#EAF5EE\",NoteFrame:\"#4B9B69\",NoteText:\"#2B6440\",BodyText:\"#000000\",WarningBG:\"#F1E6F4\",WarningFrame:\"#9834B2\",WarningText:\"#5C176D\",ImportantText:\"#6B6B0F\",HighlightBG:\"#E9F2D9\"},{id:24,name:\"\\u0628\\u0631\\u062A\\u0642\\u0627\\u0644\\u064A \\u062F\\u0627\\u0641\\u0626\",PageBG:\"#F7F4F3\",HeaderColor:\"#51301F\",SectionBG:\"#B25E34\",SectionFrame:\"#803F1E\",KeyBG:\"#E5F5F3\",KeyFrame:\"#3B9B8B\",KeyText:\"#1F6B5E\",NoteBG:\"#F1EAF5\",NoteFrame:\"#804B9B\",NoteText:\"#512B64\",BodyText:\"#000000\",WarningBG:\"#F3F4E6\",WarningFrame:\"#8A922A\",WarningText:\"#666D17\",ImportantText:\"#14708F\",HighlightBG:\"#D9E1F2\"},{id:25,name:\"\\u0646\\u0639\\u0646\\u0627\\u0639\\u064A \\u063A\\u0627\\u0645\\u0642\",PageBG:\"#F3F7F5\",HeaderColor:\"#1F513E\",SectionBG:\"#268260\",SectionFrame:\"#124E38\",KeyBG:\"#F5E5F3\",KeyFrame:\"#B143A4\",KeyText:\"#6B1F61\",NoteBG:\"#F5F5EA\",NoteFrame:\"#949147\",NoteText:\"#64622B\",BodyText:\"#000000\",WarningBG:\"#E6EFF4\",WarningFrame:\"#3482B2\",WarningText:\"#174D6D\",ImportantText:\"#8F1452\",HighlightBG:\"#F2D9DA\"},{id:26,name:\"\\u0645\\u0648\\u0641\",PageBG:\"#F7F3F7\",HeaderColor:\"#4D1F51\",SectionBG:\"#BA39C6\",SectionFrame:\"#8B2395\",KeyBG:\"#EEF5E5\",KeyFrame:\"#70983A\",KeyText:\"#4B6B1F\",NoteBG:\"#EAF2F5\",NoteFrame:\"#4B879B\",NoteText:\"#2B5664\",BodyText:\"#000000\",WarningBG:\"#F4E6EB\",WarningFrame:\"#B2345E\",WarningText:\"#6D1734\",ImportantText:\"#117811\",HighlightBG:\"#D9F2DF\"},{id:27,name:\"\\u0644\\u064A\\u0645\\u0648\\u0646\\u064A\",PageBG:\"#F6F7F3\",HeaderColor:\"#47511F\",SectionBG:\"#687B24\",SectionFrame:\"#3B4610\",KeyBG:\"#E5EAF5\",KeyFrame:\"#4363B1\",KeyText:\"#1F356B\",NoteBG:\"#F5EAEF\",NoteFrame:\"#9B4B6F\",NoteText:\"#642B45\",BodyText:\"#000000\",WarningBG:\"#E6F4E6\",WarningFrame:\"#33A22F\",WarningText:\"#1A6D17\",ImportantText:\"#33148F\",HighlightBG:\"#E7D9F2\"},{id:28,name:\"\\u0623\\u0632\\u0631\\u0642 \\u0633\\u0645\\u0627\\u0621\",PageBG:\"#F3F5F7\",HeaderColor:\"#1F3851\",SectionBG:\"#3678BA\",SectionFrame:\"#205488\",KeyBG:\"#F5E5E5\",KeyFrame:\"#B14343\",KeyText:\"#6B1F1F\",NoteBG:\"#ECF5EA\",NoteFrame:\"#589B4B\",NoteText:\"#34642B\",BodyText:\"#000000\",WarningBG:\"#EAE6F4\",WarningFrame:\"#5334B2\",WarningText:\"#2D176D\",ImportantText:\"#8F5214\",HighlightBG:\"#F2EED9\"},{id:29,name:\"\\u062A\\u0648\\u062A\\u064A \\u0641\\u0631\\u0648\\u062A\\u064A\",PageBG:\"#F7F3F3\",HeaderColor:\"#511F29\",SectionBG:\"#C8415D\",SectionFrame:\"#9D253E\",KeyBG:\"#E5F5EA\",KeyFrame:\"#3C9F59\",KeyText:\"#1F6B35\",NoteBG:\"#ECEAF5\",NoteFrame:\"#554B9B\",NoteText:\"#322B64\",BodyText:\"#000000\",WarningBG:\"#F4EEE6\",WarningFrame:\"#B27834\",WarningText:\"#6D4617\",ImportantText:\"#117474\",HighlightBG:\"#D9EFF2\"},{id:30,name:\"\\u0623\\u062E\\u0636\\u0631 \\u0632\\u0645\\u0631\\u062F\\u064A 2\",PageBG:\"#F3F7F3\",HeaderColor:\"#1F5123\",SectionBG:\"#27862F\",SectionFrame:\"#135319\",KeyBG:\"#EFE5F5\",KeyFrame:\"#8443B1\",KeyText:\"#4B1F6B\",NoteBG:\"#F5EFEA\",NoteFrame:\"#9B6C4B\",NoteText:\"#64432B\",BodyText:\"#000000\",WarningBG:\"#E6F4F2\",WarningFrame:\"#2E9E8B\",WarningText:\"#176D5F\",ImportantText:\"#8F148F\",HighlightBG:\"#F2D9E8\"},{id:31,name:\"\\u0628\\u0646\\u0641\\u0633\\u062C\\u064A \\u0645\\u0644\\u0643\\u064A\",PageBG:\"#F4F3F7\",HeaderColor:\"#321F51\",SectionBG:\"#7441C8\",SectionFrame:\"#52259D\",KeyBG:\"#F5F3E5\",KeyFrame:\"#988C3A\",KeyText:\"#6B611F\",NoteBG:\"#EAF5F2\",NoteFrame:\"#4B9B84\",NoteText:\"#2B6453\",BodyText:\"#000000\",WarningBG:\"#F4E6F2\",WarningFrame:\"#B234A2\",WarningText:\"#6D1762\",ImportantText:\"#587010\",HighlightBG:\"#E0F2D9\"},{id:32,name:\"\\u0643\\u0647\\u0631\\u0645\\u0627\\u0646\\u064A\",PageBG:\"#F7F6F3\",HeaderColor:\"#51411F\",SectionBG:\"#8E6D29\",SectionFrame:\"#5B4415\",KeyBG:\"#E5F2F5\",KeyFrame:\"#4198AA\",KeyText:\"#1F5E6B\",NoteBG:\"#F5EAF5\",NoteFrame:\"#9B4B9B\",NoteText:\"#642B64\",BodyText:\"#000000\",WarningBG:\"#EEF4E6\",WarningFrame:\"#6C9A2D\",WarningText:\"#496D17\",ImportantText:\"#14338F\",HighlightBG:\"#D9D9F2\"},{id:33,name:\"\\u062A\\u0631\\u0643\\u0648\\u0627\\u0632\",PageBG:\"#F3F7F7\",HeaderColor:\"#1F514F\",SectionBG:\"#257E7B\",SectionFrame:\"#114A48\",KeyBG:\"#F5E5EE\",KeyFrame:\"#B1437F\",KeyText:\"#6B1F48\",NoteBG:\"#F2F5EA\",NoteFrame:\"#809749\",NoteText:\"#53642B\",BodyText:\"#000000\",WarningBG:\"#E6EAF4\",WarningFrame:\"#3457B2\",WarningText:\"#17306D\",ImportantText:\"#8F1414\",HighlightBG:\"#F2E0D9\"},{id:34,name:\"\\u0641\\u0648\\u0634\\u064A\\u0627 2\",PageBG:\"#F7F3F6\",HeaderColor:\"#511F45\",SectionBG:\"#C639A2\",SectionFrame:\"#952378\",KeyBG:\"#E9F5E5\",KeyFrame:\"#539B3B\",KeyText:\"#326B1F\",NoteBG:\"#EAEFF5\",NoteFrame:\"#4B6C9B\",NoteText:\"#2B4364\",BodyText:\"#000000\",WarningBG:\"#F4E6E6\",WarningFrame:\"#B23434\",WarningText:\"#6D1817\",ImportantText:\"#11782B\",HighlightBG:\"#D9F2E8\"},{id:35,name:\"\\u0623\\u062E\\u0636\\u0631 \\u0631\\u0628\\u064A\\u0639\\u064A 2\",PageBG:\"#F5F7F3\",HeaderColor:\"#36511F\",SectionBG:\"#508226\",SectionFrame:\"#2E4E12\",KeyBG:\"#E6E5F5\",KeyFrame:\"#4843B1\",KeyText:\"#221F6B\",NoteBG:\"#F5EAEC\",NoteFrame:\"#9B4B54\",NoteText:\"#642B32\",BodyText:\"#000000\",WarningBG:\"#E6F4EA\",WarningFrame:\"#2FA251\",WarningText:\"#176D30\",ImportantText:\"#52148F\",HighlightBG:\"#EFD9F2\"},{id:36,name:\"\\u0623\\u0632\\u0631\\u0642 \\u0646\\u064A\\u0644\\u064A 2\",PageBG:\"#F3F3F7\",HeaderColor:\"#1F2751\",SectionBG:\"#4157C8\",SectionFrame:\"#25399D\",KeyBG:\"#F5EBE5\",KeyFrame:\"#B16843\",KeyText:\"#6B381F\",NoteBG:\"#EAF5EC\",NoteFrame:\"#4B9B58\",NoteText:\"#2B6435\",BodyText:\"#000000\",WarningBG:\"#EEE6F4\",WarningFrame:\"#7E34B2\",WarningText:\"#4A176D\",ImportantText:\"#6B6B0F\",HighlightBG:\"#EEF2D9\"},{id:37,name:\"\\u0623\\u062D\\u0645\\u0631 \\u0645\\u0631\\u062C\\u0627\\u0646\\u064A 2\",PageBG:\"#F7F3F3\",HeaderColor:\"#51251F\",SectionBG:\"#C64B39\",SectionFrame:\"#953123\",KeyBG:\"#E5F5EF\",KeyFrame:\"#3B9B77\",KeyText:\"#1F6B4F\",NoteBG:\"#EFEAF5\",NoteFrame:\"#704B9B\",NoteText:\"#452B64\",BodyText:\"#000000\",WarningBG:\"#F4F3E6\",WarningFrame:\"#9A8D2D\",WarningText:\"#6D6317\",ImportantText:\"#117474\",HighlightBG:\"#D9E6F2\"},{id:38,name:\"\\u0623\\u062E\\u0636\\u0631 \\u0632\\u0645\\u0631\\u062F\\u064A 3\",PageBG:\"#F3F7F4\",HeaderColor:\"#1F5134\",SectionBG:\"#26824D\",SectionFrame:\"#124E2C\",KeyBG:\"#F4E5F5\",KeyFrame:\"#A943B1\",KeyText:\"#651F6B\",NoteBG:\"#F5F2EA\",NoteFrame:\"#9B874B\",NoteText:\"#64562B\",BodyText:\"#000000\",WarningBG:\"#E6F2F4\",WarningFrame:\"#3298AE\",WarningText:\"#175E6D\",ImportantText:\"#8F1470\",HighlightBG:\"#F2D9DF\"},{id:39,name:\"\\u0623\\u0631\\u062C\\u0648\\u0627\\u0646\\u064A 2\",PageBG:\"#F6F3F7\",HeaderColor:\"#431F51\",SectionBG:\"#A141C8\",SectionFrame:\"#7A259D\",KeyBG:\"#F2F5E5\",KeyFrame:\"#809438\",KeyText:\"#5B6B1F\",NoteBG:\"#EAF5F5\",NoteFrame:\"#4B979B\",NoteText:\"#2B6164\",BodyText:\"#000000\",WarningBG:\"#F4E6EE\",WarningFrame:\"#B23478\",WarningText:\"#6D1746\",ImportantText:\"#2B7811\",HighlightBG:\"#D9F2DA\"},{id:40,name:\"\\u0630\\u0647\\u0628\\u064A \\u0641\\u0627\\u062A\\u062D 2\",PageBG:\"#F7F7F3\",HeaderColor:\"#51511F\",SectionBG:\"#767722\",SectionFrame:\"#424210\",KeyBG:\"#E5EDF5\",KeyFrame:\"#437AB1\",KeyText:\"#1F456B\",NoteBG:\"#F5EAF1\",NoteFrame:\"#9B4B80\",NoteText:\"#642B51\",BodyText:\"#000000\",WarningBG:\"#E9F4E6\",WarningFrame:\"#4AA22F\",WarningText:\"#2C6D17\",ImportantText:\"#14148F\",HighlightBG:\"#E2D9F2\"},{id:41,name:\"\\u0633\\u0645\\u0627\\u0648\\u064A 2\",PageBG:\"#F3F6F7\",HeaderColor:\"#1F4251\",SectionBG:\"#2E7D9E\",SectionFrame:\"#19536B\",KeyBG:\"#F5E5E8\",KeyFrame:\"#B1435A\",KeyText:\"#6B1F2F\",NoteBG:\"#EEF5EA\",NoteFrame:\"#689B4B\",NoteText:\"#40642B\",BodyText:\"#000000\",WarningBG:\"#E7E6F4\",WarningFrame:\"#3934B2\",WarningText:\"#1B176D\",ImportantText:\"#8F3314\",HighlightBG:\"#F2E9D9\"},{id:42,name:\"\\u0648\\u0631\\u062F\\u064A \\u063A\\u0627\\u0645\\u0642\",PageBG:\"#F7F3F4\",HeaderColor:\"#511F34\",SectionBG:\"#C84179\",SectionFrame:\"#9D2556\",KeyBG:\"#E5F5E7\",KeyFrame:\"#3C9F45\",KeyText:\"#1F6B26\",NoteBG:\"#EAEBF5\",NoteFrame:\"#4B519B\",NoteText:\"#2B2F64\",BodyText:\"#000000\",WarningBG:\"#F4EBE6\",WarningFrame:\"#B25E34\",WarningText:\"#6D3417\",ImportantText:\"#11745B\",HighlightBG:\"#D9F2F0\"},{id:43,name:\"\\u0623\\u062E\\u0636\\u0631 \\u0631\\u0628\\u064A\\u0639\\u064A 3\",PageBG:\"#F3F7F3\",HeaderColor:\"#25511F\",SectionBG:\"#318226\",SectionFrame:\"#1A4E12\",KeyBG:\"#EBE5F5\",KeyFrame:\"#6D43B1\",KeyText:\"#3C1F6B\",NoteBG:\"#F5EDEA\",NoteFrame:\"#9B5C4B\",NoteText:\"#64372B\",BodyText:\"#000000\",WarningBG:\"#E6F4EF\",WarningFrame:\"#2E9E75\",WarningText:\"#176D4E\",ImportantText:\"#8F148F\",HighlightBG:\"#F2D9ED\"},{id:44,name:\"\\u0628\\u0646\\u0641\\u0633\\u062C\\u064A \\u0645\\u0644\\u0643\\u064A 2\",PageBG:\"#F3F3F7\",HeaderColor:\"#271F51\",SectionBG:\"#5841C8\",SectionFrame:\"#39259D\",KeyBG:\"#F5F0E5\",KeyFrame:\"#AA8741\",KeyText:\"#6B521F\",NoteBG:\"#EAF5F0\",NoteFrame:\"#4B9B73\",NoteText:\"#2B6448\",BodyText:\"#000000\",WarningBG:\"#F3E6F4\",WarningFrame:\"#A834B2\",WarningText:\"#67176D\",ImportantText:\"#6B6B0F\",HighlightBG:\"#E5F2D9\"},{id:45,name:\"\\u0628\\u0631\\u062A\\u0642\\u0627\\u0644\\u064A \\u062F\\u0627\\u0641\\u0626 2\",PageBG:\"#F7F5F3\",HeaderColor:\"#51361F\",SectionBG:\"#A2642F\",SectionFrame:\"#70421A\",KeyBG:\"#E5F5F5\",KeyFrame:\"#3B9B98\",KeyText:\"#1F6B68\",NoteBG:\"#F3EAF5\",NoteFrame:\"#8A4B9B\",NoteText:\"#582B64\",BodyText:\"#000000\",WarningBG:\"#F1F4E6\",WarningFrame:\"#80962C\",WarningText:\"#5B6D17\",ImportantText:\"#14528F\",HighlightBG:\"#D9DEF2\"},{id:46,name:\"\\u0646\\u0639\\u0646\\u0627\\u0639\\u064A \\u063A\\u0627\\u0645\\u0642 2\",PageBG:\"#F3F7F6\",HeaderColor:\"#1F5145\",SectionBG:\"#26826C\",SectionFrame:\"#124E40\",KeyBG:\"#F5E5F1\",KeyFrame:\"#B14395\",KeyText:\"#6B1F57\",NoteBG:\"#F4F5EA\",NoteFrame:\"#8D9447\",NoteText:\"#5F642B\",BodyText:\"#000000\",WarningBG:\"#E6EDF4\",WarningFrame:\"#3471B2\",WarningText:\"#17416D\",ImportantText:\"#8F1433\",HighlightBG:\"#F2DBD9\"},{id:47,name:\"\\u0645\\u0648\\u0641 2\",PageBG:\"#F7F3F7\",HeaderColor:\"#511F4F\",SectionBG:\"#BE37B8\",SectionFrame:\"#8C2188\",KeyBG:\"#ECF5E5\",KeyFrame:\"#679B3B\",KeyText:\"#416B1F\",NoteBG:\"#EAF1F5\",NoteFrame:\"#4B7C9B\",NoteText:\"#2B4E64\",BodyText:\"#000000\",WarningBG:\"#F4E6E9\",WarningFrame:\"#B2344E\",WarningText:\"#6D1729\",ImportantText:\"#117811\",HighlightBG:\"#D9F2E2\"},{id:48,name:\"\\u0644\\u064A\\u0645\\u0648\\u0646\\u064A 2\",PageBG:\"#F6F7F3\",HeaderColor:\"#40511F\",SectionBG:\"#607E25\",SectionFrame:\"#374A11\",KeyBG:\"#E5E8F5\",KeyFrame:\"#4355B1\",KeyText:\"#1F2B6B\",NoteBG:\"#F5EAEE\",NoteFrame:\"#9B4B65\",NoteText:\"#642B3E\",BodyText:\"#000000\",WarningBG:\"#E6F4E7\",WarningFrame:\"#2FA239\",WarningText:\"#176D1F\",ImportantText:\"#33148F\",HighlightBG:\"#EAD9F2\"},{id:49,name:\"\\u0623\\u0632\\u0631\\u0642 \\u0633\\u0645\\u0627\\u0621 2\",PageBG:\"#F3F4F7\",HeaderColor:\"#1F3251\",SectionBG:\"#4173C8\",SectionFrame:\"#25519D\",KeyBG:\"#F5E7E5\",KeyFrame:\"#B15243\",KeyText:\"#6B291F\",NoteBG:\"#EBF5EA\",NoteFrame:\"#4E9B4B\",NoteText:\"#2D642B\",BodyText:\"#000000\",WarningBG:\"#EBE6F4\",WarningFrame:\"#6434B2\",WarningText:\"#38176D\",ImportantText:\"#7D6212\",HighlightBG:\"#F2F1D9\"},{id:50,name:\"\\u062A\\u0648\\u062A\\u064A \\u0641\\u0631\\u0648\\u062A\\u064A 2\",PageBG:\"#F7F3F3\",HeaderColor:\"#511F23\",SectionBG:\"#C8414C\",SectionFrame:\"#9D252E\",KeyBG:\"#E5F5EC\",KeyFrame:\"#3C9F66\",KeyText:\"#1F6B3F\",NoteBG:\"#EDEAF5\",NoteFrame:\"#5F4B9B\",NoteText:\"#392B64\",BodyText:\"#000000\",WarningBG:\"#F4F0E6\",WarningFrame:\"#AE8532\",WarningText:\"#6D5117\",ImportantText:\"#117474\",HighlightBG:\"#D9ECF2\"},{id:51,name:\"\\u0623\\u062E\\u0636\\u0631 \\u0632\\u0645\\u0631\\u062F\\u064A 4\",PageBG:\"#F3F7F4\",HeaderColor:\"#1F512A\",SectionBG:\"#27863B\",SectionFrame:\"#135321\",KeyBG:\"#F1E5F5\",KeyFrame:\"#9243B1\",KeyText:\"#551F6B\",NoteBG:\"#F5F0EA\",NoteFrame:\"#9B764B\",NoteText:\"#644A2B\",BodyText:\"#000000\",WarningBG:\"#E6F4F4\",WarningFrame:\"#2E9E9A\",WarningText:\"#176D6A\",ImportantText:\"#8F1470\",HighlightBG:\"#F2D9E4\"},{id:52,name:\"\\u0623\\u0631\\u062C\\u0648\\u0627\\u0646\\u064A 3\",PageBG:\"#F5F3F7\",HeaderColor:\"#381F51\",SectionBG:\"#8541C8\",SectionFrame:\"#61259D\",KeyBG:\"#F5F5E5\",KeyFrame:\"#909037\",KeyText:\"#6A6B1F\",NoteBG:\"#EAF5F3\",NoteFrame:\"#49978B\",NoteText:\"#2B645B\",BodyText:\"#000000\",WarningBG:\"#F4E6F1\",WarningFrame:\"#B23492\",WarningText:\"#6D1758\",ImportantText:\"#427411\",HighlightBG:\"#DDF2D9\"},{id:53,name:\"\\u0643\\u0647\\u0631\\u0645\\u0627\\u0646\\u064A 2\",PageBG:\"#F7F6F3\",HeaderColor:\"#51471F\",SectionBG:\"#867327\",SectionFrame:\"#534613\",KeyBG:\"#E5F0F5\",KeyFrame:\"#4391B1\",KeyText:\"#1F546B\",NoteBG:\"#F5EAF4\",NoteFrame:\"#9B4B90\",NoteText:\"#642B5D\",BodyText:\"#000000\",WarningBG:\"#ECF4E6\",WarningFrame:\"#609E2E\",WarningText:\"#3E6D17\",ImportantText:\"#14338F\",HighlightBG:\"#DCD9F2\"},{id:54,name:\"\\u062A\\u0631\\u0643\\u0648\\u0627\\u0632 2\",PageBG:\"#F3F7F7\",HeaderColor:\"#1F4D51\",SectionBG:\"#277E86\",SectionFrame:\"#134D53\",KeyBG:\"#F5E5EC\",KeyFrame:\"#B14371\",KeyText:\"#6B1F3E\",NoteBG:\"#F1F5EA\",NoteFrame:\"#769749\",NoteText:\"#4C642B\",BodyText:\"#000000\",WarningBG:\"#E6E8F4\",WarningFrame:\"#3449B2\",WarningText:\"#17256D\",ImportantText:\"#8F1414\",HighlightBG:\"#F2E3D9\"},{id:55,name:\"\\u0641\\u0648\\u0634\\u064A\\u0627 3\",PageBG:\"#F7F3F5\",HeaderColor:\"#511F3E\",SectionBG:\"#C73D93\",SectionFrame:\"#99246C\",KeyBG:\"#E7F5E5\",KeyFrame:\"#489F3C\",KeyText:\"#286B1F\",NoteBG:\"#EAEDF5\",NoteFrame:\"#4B629B\",NoteText:\"#2B3B64\",BodyText:\"#000000\",WarningBG:\"#F4E8E6\",WarningFrame:\"#B24434\",WarningText:\"#6D2217\",ImportantText:\"#117845\",HighlightBG:\"#D9F2EB\"},{id:56,name:\"\\u0623\\u062E\\u0636\\u0631 \\u0631\\u0628\\u064A\\u0639\\u064A 4\",PageBG:\"#F4F7F3\",HeaderColor:\"#2F511F\",SectionBG:\"#448226\",SectionFrame:\"#264E12\",KeyBG:\"#E8E5F5\",KeyFrame:\"#5643B1\",KeyText:\"#2C1F6B\",NoteBG:\"#F5EAEA\",NoteFrame:\"#9B4B4B\",NoteText:\"#642B2B\",BodyText:\"#000000\",WarningBG:\"#E6F4EC\",WarningFrame:\"#2FA260\",WarningText:\"#176D3C\",ImportantText:\"#70148F\",HighlightBG:\"#F2D9F2\"},{id:57,name:\"\\u0623\\u0632\\u0631\\u0642 \\u0646\\u064A\\u0644\\u064A 3\",PageBG:\"#F3F3F7\",HeaderColor:\"#1F2151\",SectionBG:\"#4146C8\",SectionFrame:\"#25299D\",KeyBG:\"#F5EDE5\",KeyFrame:\"#B17643\",KeyText:\"#6B421F\",NoteBG:\"#EAF5EE\",NoteFrame:\"#4B9B62\",NoteText:\"#2B643C\",BodyText:\"#000000\",WarningBG:\"#F0E6F4\",WarningFrame:\"#8E34B2\",WarningText:\"#55176D\",ImportantText:\"#6B6B0F\",HighlightBG:\"#EBF2D9\"},{id:58,name:\"\\u0628\\u0631\\u062A\\u0642\\u0627\\u0644\\u064A \\u062F\\u0627\\u0641\\u0626 3\",PageBG:\"#F7F4F3\",HeaderColor:\"#512C1F\",SectionBG:\"#BA5836\",SectionFrame:\"#883B20\",KeyBG:\"#E5F5F1\",KeyFrame:\"#3B9B84\",KeyText:\"#1F6B58\",NoteBG:\"#F1EAF5\",NoteFrame:\"#7A4B9B\",NoteText:\"#4C2B64\",BodyText:\"#000000\",WarningBG:\"#F4F4E6\",WarningFrame:\"#91922A\",WarningText:\"#6D6D17\",ImportantText:\"#14708F\",HighlightBG:\"#D9E3F2\"},{id:59,name:\"\\u0646\\u0639\\u0646\\u0627\\u0639\\u064A \\u063A\\u0627\\u0645\\u0642 3\",PageBG:\"#F3F7F5\",HeaderColor:\"#1F513A\",SectionBG:\"#268259\",SectionFrame:\"#124E33\",KeyBG:\"#F5E5F4\",KeyFrame:\"#B143AC\",KeyText:\"#6B1F67\",NoteBG:\"#F5F4EA\",NoteFrame:\"#978E49\",NoteText:\"#645D2B\",BodyText:\"#000000\",WarningBG:\"#E6F0F4\",WarningFrame:\"#348BB2\",WarningText:\"#17536D\",ImportantText:\"#8F1452\",HighlightBG:\"#F2D9DC\"},{id:60,name:\"\\u0645\\u0648\\u0641 3\",PageBG:\"#F6F3F7\",HeaderColor:\"#491F51\",SectionBG:\"#B241C8\",SectionFrame:\"#8A259D\",KeyBG:\"#F0F5E5\",KeyFrame:\"#78983A\",KeyText:\"#516B1F\",NoteBG:\"#EAF3F5\",NoteFrame:\"#4B8D9B\",NoteText:\"#2B5A64\",BodyText:\"#000000\",WarningBG:\"#F4E6EC\",WarningFrame:\"#B23468\",WarningText:\"#6D173B\",ImportantText:\"#2B7811\",HighlightBG:\"#D9F2DD\"}];function nl(e){return{sectionTitle:{bg:e.SectionBG,fg:\"#FFFFFF\",border:e.SectionFrame,bar:!0},keyterm:{bg:e.KeyBG,fg:e.KeyText,border:e.KeyFrame},note:{bg:e.NoteBG,fg:e.NoteText,border:e.NoteFrame},warning:{bg:e.WarningBG,fg:e.WarningText,border:e.WarningFrame,strong:!0},important:{bg:e.HighlightBG,fg:e.ImportantText,border:e.ImportantText,strong:!0},code:{bg:\"#0D0D0D\",fg:\"#D4D4D4\",border:\"#2A2A2A\"}}}function rl(e){return zn.find(t=>t.id===e)||zn[0]}var Ux=nl(zn[0]),Un=\"'Amiri','Noto Naskh Arabic','Traditional Arabic',serif\";function Wx({block:e,t,theme:a,skin:o,kinds:r,onUpdate:l,onDelete:s,onMove:u}){let i=e.kind;return(0,n.jsxs)(\"div\",{className:\"p-2.5 mb-2\",style:{borderRadius:10,border:`1px solid ${a.hairline}`,background:a.surface},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1.5 mb-2\",children:[(0,n.jsxs)(\"select\",{value:i,onChange:d=>l({kind:d.target.value}),className:\"text-xs font-bold px-2 py-1.5\",style:{borderRadius:6,border:`1px solid ${a.hairline}`,background:a.surfaceSoft,color:a.ink},children:[(0,n.jsx)(\"option\",{value:\"sectionTitle\",children:t.blockSectionTitle}),(0,n.jsx)(\"option\",{value:\"keyterm\",children:t.blockKeyterm}),(0,n.jsx)(\"option\",{value:\"note\",children:t.blockNote}),(0,n.jsx)(\"option\",{value:\"warning\",children:t.blockWarning}),(0,n.jsx)(\"option\",{value:\"important\",children:t.blockImportant}),(0,n.jsx)(\"option\",{value:\"image\",children:t.blockImage}),(0,n.jsx)(\"option\",{value:\"code\",children:t.blockCode}),(0,n.jsx)(\"option\",{value:\"pagebreak\",children:t.blockPagebreak})]}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1 ms-auto\",children:[(0,n.jsx)(\"button\",{onClick:u(-1),className:\"w-6 h-6 grid place-items-center\",style:{borderRadius:6,color:a.ink},title:t.moveUp,children:(0,n.jsx)(Co,{size:13})}),(0,n.jsx)(\"button\",{onClick:u(1),className:\"w-6 h-6 grid place-items-center\",style:{borderRadius:6,color:a.ink},title:t.moveDown,children:(0,n.jsx)(vo,{size:13})}),(0,n.jsx)(\"button\",{onClick:s,className:\"w-6 h-6 grid place-items-center\",style:{borderRadius:6,color:\"#C0392B\"},title:t.removeBlock,children:(0,n.jsx)(Ot,{size:13})})]})]}),i===\"pagebreak\"?(0,n.jsxs)(\"p\",{className:\"text-[11px]\",style:{color:a.inkSoft},children:[\"\\u2014 \",t.blockPagebreak,\" \\u2014\"]}):i===\"image\"?(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-1.5\",children:[(0,n.jsx)(ee,{theme:a,skin:o,value:e.imageUrl,onChange:d=>l({imageUrl:d}),placeholder:t.imageUrl}),(0,n.jsxs)(\"div\",{className:\"grid grid-cols-2 gap-1.5\",children:[(0,n.jsx)(ee,{theme:a,skin:o,value:e.title,onChange:d=>l({title:d}),placeholder:t.imageTitle}),(0,n.jsx)(ee,{theme:a,skin:o,value:e.meta,onChange:d=>l({meta:d}),placeholder:t.imageMeta})]}),(0,n.jsx)(\"textarea\",{value:e.caption||\"\",onChange:d=>l({caption:d.target.value}),rows:2,dir:\"auto\",className:\"w-full text-sm px-2.5 py-1.5\",style:{borderRadius:6,border:`1px solid ${a.hairline}`,background:a.surfaceSoft,color:a.ink},placeholder:t.imageCaption})]}):i===\"code\"?(0,n.jsx)(\"textarea\",{value:e.text||\"\",onChange:d=>l({text:d.target.value}),rows:4,dir:\"ltr\",className:\"w-full text-sm px-2.5 py-1.5\",style:{borderRadius:6,border:`1px solid ${a.hairline}`,background:\"#0D0D0D\",color:\"#D4D4D4\",fontFamily:\"'JetBrains Mono','Fira Code',Consolas,monospace\"},placeholder:t.blockText}):(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-1.5\",children:[i!==\"sectionTitle\"&&(0,n.jsx)(ee,{theme:a,skin:o,value:e.title,onChange:d=>l({title:d}),placeholder:t.blockTitle}),(0,n.jsx)(\"textarea\",{value:e.text||\"\",onChange:d=>l({text:d.target.value}),rows:2,dir:\"auto\",className:\"w-full text-sm px-2.5 py-1.5\",style:{borderRadius:6,border:`1px solid ${a.hairline}`,background:a.surfaceSoft,color:a.ink},placeholder:t.blockText})]})]})}function Wn({block:e,style:t,kinds:a}){let o=a||Ux,r=o[e.kind];return e.kind===\"image\"?(0,n.jsxs)(\"div\",{style:{margin:\"10px 0\",background:\"#fff\",borderRadius:16,overflow:\"hidden\",border:`1.5px solid ${o.sectionTitle.border}`,boxShadow:\"0 4px 14px rgba(0,0,0,0.10)\",...t},children:[e.imageUrl&&(0,n.jsx)(\"img\",{src:e.imageUrl,alt:\"\",style:{width:\"100%\",aspectRatio:\"4/3\",objectFit:\"cover\",display:\"block\"}}),(e.title||e.caption||e.meta)&&(0,n.jsxs)(\"div\",{style:{padding:\"10px 14px 12px\"},children:[e.title&&(0,n.jsx)(\"p\",{style:{fontWeight:800,color:o.sectionTitle.border,margin:\"0 0 4px\",fontSize:13},children:e.title}),e.caption&&(0,n.jsx)(\"p\",{style:{margin:0,fontSize:12.5,lineHeight:1.7,color:\"#241B13\"},dir:\"auto\",children:e.caption}),e.meta&&(0,n.jsx)(\"p\",{style:{margin:\"4px 0 0\",fontSize:10.5,color:\"#7a7a7a\"},children:e.meta})]})]}):e.kind===\"code\"?(0,n.jsx)(\"div\",{style:{margin:\"10px 0\",background:r.bg,border:`1px solid ${r.border}`,borderRadius:14,overflow:\"hidden\",boxShadow:\"0 6px 18px rgba(0,0,0,0.25)\",direction:\"ltr\",...t},children:(0,n.jsx)(\"pre\",{style:{margin:0,padding:\"14px 16px\",overflowX:\"auto\",fontFamily:\"'JetBrains Mono','Fira Code',Consolas,monospace\",fontSize:13,lineHeight:1.7,color:r.fg,whiteSpace:\"pre-wrap\",wordBreak:\"break-word\"},children:e.text})}):e.kind===\"sectionTitle\"?(0,n.jsx)(\"div\",{style:{background:r.bg,color:r.fg,borderRadius:10,padding:\"10px 16px\",margin:\"14px 0 10px\",fontWeight:800,fontSize:15,...t},children:e.text}):(0,n.jsxs)(\"div\",{style:{background:r.bg,color:r.fg,borderRadius:12,border:`${r.strong?2:1.5}px solid ${r.border}`,padding:\"10px 14px\",margin:\"10px 0\",boxShadow:\"0 2px 8px rgba(0,0,0,0.06)\",...t},children:[e.title&&(0,n.jsx)(\"p\",{style:{fontWeight:800,fontSize:12,margin:\"0 0 4px\"},children:e.title}),(0,n.jsx)(\"p\",{style:{margin:0,fontSize:13.5,lineHeight:1.7},dir:\"auto\",children:e.text})]})}var qx=265;function Hp(e){let t=(0,D.useRef)(null),[a,o]=(0,D.useState)([]);return(0,D.useEffect)(()=>{let r=t.current;if(!r)return;let l=qx*3.7795,s=Array.from(r.children),u=0,i=[],d=[];e.forEach((p,f)=>{if(p.kind===\"pagebreak\"){d.push(i),i=[],u=0;return}let g=s[f]?s[f].getBoundingClientRect().height+4:40;u+g>l&&i.length&&(d.push(i),i=[],u=0),i.push(p),u+=g}),d.push(i),o(d.filter((p,f)=>p.length||f===0))},[e]),{pages:a.length?a:[e],measureRef:t}}var _x=210*3.7795;function Gp(){let e=(0,D.useRef)(null),[t,a]=(0,D.useState)(1),[o,r]=(0,D.useState)(null);(0,D.useEffect)(()=>{let d=e.current;if(!d)return;let p=()=>{let g=d.clientWidth-16,y=g>0?Math.min(1.15,Math.max(.2,g/_x)):1;a(y)};p();let f=new ResizeObserver(p);return f.observe(d),()=>f.disconnect()},[]);let l=o!=null?o:t;return{containerRef:e,scale:l,zoomIn:()=>r(Math.min(2,Math.round((l+.15)*100)/100)),zoomOut:()=>r(Math.max(.2,Math.round((l-.15)*100)/100)),zoomFit:()=>r(null),isFit:o==null}}function Op({t:e,theme:t,skin:a,scale:o,onZoomOut:r,onZoomIn:l,onFit:s,isFit:u}){return(0,n.jsxs)(\"div\",{className:\"flex items-center justify-end gap-1 mb-2\",children:[(0,n.jsx)(\"button\",{onClick:r,className:\"w-7 h-7 grid place-items-center shrink-0\",style:{borderRadius:a.radiusSm,border:`1px solid ${t.hairline}`,color:t.ink},title:e.zoomOut,children:(0,n.jsx)(al,{size:13})}),(0,n.jsxs)(\"button\",{onClick:s,className:\"text-[11px] font-bold px-2.5 h-7 shrink-0\",style:{borderRadius:a.radiusSm,border:`1px solid ${t.hairline}`,background:u?t.accentSoft:\"transparent\",color:u?t.accent:t.ink},title:e.zoomFit,children:[u?(0,n.jsx)(qr,{size:12,className:\"inline -mt-0.5 me-1\"}):null,Math.round(o*100),\"%\"]}),(0,n.jsx)(\"button\",{onClick:l,className:\"w-7 h-7 grid place-items-center shrink-0\",style:{borderRadius:a.radiusSm,border:`1px solid ${t.hairline}`,color:t.ink},title:e.zoomIn,children:(0,n.jsx)(tl,{size:13})})]})}function fi({label:e,children:t}){return(0,n.jsxs)(\"div\",{className:\"flex flex-col items-stretch shrink-0\",children:[(0,n.jsx)(\"div\",{className:\"flex items-end gap-1 px-1 flex-1\",children:t}),(0,n.jsx)(\"p\",{className:\"text-center text-[9px] font-semibold uppercase tracking-wide mt-1 px-1\",style:{opacity:.6},children:e})]})}function mp({theme:e}){return(0,n.jsx)(\"div\",{className:\"self-stretch w-px my-1.5 shrink-0\",style:{background:e.hairline}})}function gp({icon:e,label:t,active:a,onClick:o,theme:r,skin:l,tone:s}){return(0,n.jsxs)(\"button\",{onClick:o,title:t,className:\"flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 shrink-0\",style:{borderRadius:l.radiusSm,minWidth:52,background:a?r.accentSoft:\"transparent\",color:(s==null?void 0:s.fg)||(a?r.accent:r.ink),border:`1px solid ${a?r.accent:\"transparent\"}`},children:[(0,n.jsx)(e,{size:16}),(0,n.jsx)(\"span\",{className:\"text-[9px] font-bold leading-none whitespace-nowrap\",children:t})]})}function Vx(e,t){let a=e.nodes.filter(u=>u.level===\"branch\"),o=u=>e.nodes.filter(i=>i.level===\"sub\"&&i.parent===u),r=u=>e.nodes.filter(i=>i.level===\"leaf\"&&i.parent===u),l=[],s=!0;return a.forEach(u=>{o(u.id).forEach(i=>{r(i.id).forEach(d=>{let p=d.pageBlocks||[];if(!p.length)return;s||l.push({id:`${d.id}-fb-break`,kind:\"pagebreak\"}),s=!1;let f=t===\"ar\"?d.ar:d.en,g=t===\"ar\"?u.ar:u.en,y=d.pagePaletteId||1;p.forEach((k,v)=>{l.push({...k,id:`${d.id}-fb-${k.id||v}`,_leafTitle:f,_branchTitle:g,_paletteId:y})})})})}),l}function Kx({book:e,lang:t,t:a,theme:o,skin:r,docTitle:l}){let s=(0,D.useMemo)(()=>Vx(e,t),[e,t]),{pages:u,measureRef:i}=Hp(s),{containerRef:d,scale:p,zoomIn:f,zoomOut:g,zoomFit:y,isFit:k}=Gp();return s.length?(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"div\",{ref:i,style:{position:\"absolute\",visibility:\"hidden\",pointerEvents:\"none\",width:\"182mm\",top:-99999,fontFamily:Un,fontSize:15,lineHeight:1.9},children:s.map((v,I)=>(0,n.jsx)(Wn,{block:v,kinds:nl(rl(v._paletteId||1))},v.id||I))}),(0,n.jsx)(Op,{t:a,theme:o,skin:r,scale:p,onZoomOut:g,onZoomIn:f,onFit:y,isFit:k}),(0,n.jsx)(\"div\",{ref:d,className:\"overflow-x-auto\",children:(0,n.jsx)(\"div\",{style:{zoom:p},children:(0,n.jsx)(\"div\",{className:\"flex flex-col gap-6 items-center py-2\",children:u.map((v,I)=>{let x=v[0],c=rl((x==null?void 0:x._paletteId)||1);return(0,n.jsxs)(\"div\",{dir:\"rtl\",style:{width:\"210mm\",minHeight:\"297mm\",background:c.PageBG,color:c.BodyText,padding:\"16mm 14mm\",boxShadow:\"0 4px 24px rgba(0,0,0,0.15)\",borderRadius:4,fontFamily:Un,fontSize:15,lineHeight:1.9},children:[(0,n.jsxs)(\"div\",{style:{display:\"flex\",justifyContent:\"space-between\",alignItems:\"center\",paddingBottom:\"0.6rem\",marginBottom:\"1rem\",borderBottom:`2px solid ${c.HeaderColor}`,color:c.HeaderColor,fontWeight:700,fontSize:12},children:[(0,n.jsx)(\"span\",{children:l}),(0,n.jsx)(\"span\",{children:x!=null&&x._branchTitle?`${x._branchTitle} \\u2014 ${x._leafTitle}`:x==null?void 0:x._leafTitle})]}),v.map((m,h)=>(0,n.jsx)(Wn,{block:m,kinds:nl(rl(m._paletteId||1))},m.id||h)),(0,n.jsx)(\"p\",{style:{position:\"relative\",top:\"8mm\",textAlign:\"center\",fontSize:10,color:\"#b3a692\"},children:a.pageOf(I+1,u.length)})]},I)})})})})]}):(0,n.jsx)(\"p\",{className:\"text-sm\",style:{color:\"#00000088\"},children:a.emptyBook})}function $x({leaf:e,lang:t,theme:a,skin:o,t:r,onUpdateLeaf:l,allLeavesCards:s,docTitle:u,pageTitle:i}){let d=e.pageBlocks||[],p=rl(e.pagePaletteId||1),f=nl(p),g=M=>l({pageBlocks:M}),y=(M,E)=>g(d.map((H,_)=>_===M?{...H,...E}:H)),k=M=>g(d.filter((E,H)=>H!==M)),v=(M,E)=>()=>{let H=M+E;if(H<0||H>=d.length)return;let _=[...d];[_[M],_[H]]=[_[H],_[M]],g(_)},I=M=>g([...d,{id:`${e.id}-b-${Date.now()}`,kind:M,title:\"\",text:\"\",imageUrl:\"\",caption:\"\"}]),x=()=>{let M=s,E=[{id:`${e.id}-b-title`,kind:\"sectionTitle\",text:t===\"ar\"?e.ar:e.en}];M.forEach(H=>{H.image&&E.push({id:`${H.id}-img`,kind:\"image\",imageUrl:H.image,caption:\"\"}),H.questions.forEach(_=>{let U=_[t]||{};E.push({id:`${_.id}-b`,kind:\"note\",title:(Ce[_.type]||{})[t]||_.type,text:U.prompt||U.template||\"\"})})}),g(E)},{pages:c,measureRef:m}=Hp(d),{containerRef:h,scale:L,zoomIn:F,zoomOut:b,zoomFit:C,isFit:N}=Gp(),P=[[\"sectionTitle\",r.blockSectionTitle,Mr],[\"keyterm\",r.blockKeyterm,Qr],[\"note\",r.blockNote,Xr],[\"warning\",r.blockWarning,ha],[\"important\",r.blockImportant,fa],[\"image\",r.blockImage,wo],[\"code\",r.blockCode,pa],[\"pagebreak\",r.blockPagebreak,Tr]];return(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-3\",children:[(0,n.jsx)(\"div\",{className:\"overflow-x-auto\",style:{borderRadius:o.radiusLg,border:`1px solid ${a.hairline}`,background:a.surface},children:(0,n.jsxs)(\"div\",{className:\"flex items-start gap-1 p-2 w-max min-w-full\",children:[(0,n.jsx)(fi,{label:r.pageGroup,children:(0,n.jsxs)(\"div\",{className:\"flex flex-col items-center gap-1 px-1 py-1\",children:[(0,n.jsx)(\"div\",{className:\"grid grid-cols-8 gap-1\",children:zn.map(M=>(0,n.jsx)(\"button\",{onClick:()=>l({pagePaletteId:M.id}),title:M.name,className:\"w-4 h-4 rounded-full shrink-0\",style:{background:M.SectionBG,border:`2px solid ${p.id===M.id?a.ink:\"transparent\"}`,boxShadow:p.id===M.id?`0 0 0 2px ${a.accent}`:\"none\"}},M.id))}),(0,n.jsx)(\"p\",{className:\"text-[9px] font-semibold whitespace-nowrap\",style:{color:a.inkSoft},children:p.name})]})}),(0,n.jsx)(mp,{theme:a}),(0,n.jsx)(fi,{label:r.insertGroup,children:P.map(([M,E,H])=>(0,n.jsx)(gp,{icon:H,label:E,theme:a,skin:o,onClick:()=>I(M),tone:f[M]},M))}),(0,n.jsx)(mp,{theme:a}),(0,n.jsx)(fi,{label:r.addBlock,children:(0,n.jsx)(gp,{icon:ya,label:r.genFromCards,theme:a,skin:o,onClick:x})})]})}),(0,n.jsxs)(\"div\",{className:\"grid lg:grid-cols-[1fr_260px] gap-4 items-start\",children:[(0,n.jsxs)(\"div\",{className:\"order-1 min-w-0\",children:[(0,n.jsx)(Op,{t:r,theme:a,skin:o,scale:L,onZoomOut:b,onZoomIn:F,onFit:C,isFit:N}),(0,n.jsx)(\"div\",{ref:m,style:{position:\"absolute\",visibility:\"hidden\",pointerEvents:\"none\",width:\"182mm\",top:-99999,fontFamily:Un,fontSize:15,lineHeight:1.9},children:d.map((M,E)=>(0,n.jsx)(Wn,{block:M,kinds:f},M.id||E))}),(0,n.jsx)(\"div\",{ref:h,className:\"overflow-x-auto\",children:(0,n.jsx)(\"div\",{style:{zoom:L},children:(0,n.jsx)(\"div\",{className:\"flex flex-col gap-6 items-center py-2\",children:c.map((M,E)=>(0,n.jsxs)(\"div\",{dir:\"rtl\",style:{width:\"210mm\",minHeight:\"297mm\",background:p.PageBG,color:p.BodyText,padding:\"16mm 14mm\",boxShadow:\"0 4px 24px rgba(0,0,0,0.15)\",borderRadius:4,fontFamily:Un,fontSize:15,lineHeight:1.9},children:[(0,n.jsxs)(\"div\",{style:{display:\"flex\",justifyContent:\"space-between\",alignItems:\"center\",paddingBottom:\"0.6rem\",marginBottom:E===0?\"0.6rem\":\"1rem\",borderBottom:`2px solid ${p.HeaderColor}`,color:p.HeaderColor,fontWeight:700,fontSize:12},children:[(0,n.jsx)(\"span\",{children:u}),(0,n.jsx)(\"span\",{children:i})]}),E===0&&(0,n.jsxs)(\"div\",{style:{textAlign:\"center\",marginBottom:\"1rem\"},children:[(0,n.jsx)(\"div\",{style:{fontSize:22,fontWeight:800,color:p.HeaderColor},children:u}),(0,n.jsx)(\"div\",{style:{fontSize:15,fontWeight:700,color:p.SectionBG,marginTop:4},children:i}),(0,n.jsx)(\"hr\",{style:{border:\"none\",borderTop:`1.4pt solid ${p.SectionFrame}`,width:\"50%\",margin:\"0.8rem auto\"}})]}),M.map((H,_)=>(0,n.jsx)(Wn,{block:H,kinds:f},H.id||_)),(0,n.jsx)(\"p\",{style:{position:\"relative\",top:\"8mm\",textAlign:\"center\",fontSize:10,color:\"#b3a692\"},children:r.pageOf(E+1,c.length)})]},E))})})})]}),(0,n.jsxs)(\"div\",{className:\"order-2 p-3\",style:{borderRadius:o.radiusLg,border:`1px solid ${a.hairline}`,background:a.surface,alignSelf:\"start\"},children:[(0,n.jsx)(\"p\",{className:\"text-[10px] font-bold uppercase tracking-wide mb-2\",style:{color:a.inkSoft},children:r.addBlock}),(0,n.jsx)(\"div\",{className:\"max-h-[40vh] lg:max-h-[70vh] overflow-y-auto\",children:d.map((M,E)=>(0,n.jsx)(Wx,{block:M,t:r,theme:a,skin:o,kinds:f,onUpdate:H=>y(E,H),onDelete:()=>k(E),onMove:H=>v(E,H)},M.id||E))})]})]})]})}function jx(e,t){let a=new Blob([JSON.stringify(t,null,2)],{type:\"application/json\"}),o=URL.createObjectURL(a),r=document.createElement(\"a\");r.href=o,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(o)}function Xx(e,t){let a=e.match(/\\d+/),o=t.match(/\\d+/);if(a&&o){let r=parseInt(a[0],10)-parseInt(o[0],10);if(r!==0)return r}return e.localeCompare(t)}function gi(e){return new Promise((t,a)=>{let o=new FileReader;o.onload=()=>t(o.result),o.onerror=a,o.readAsDataURL(e)})}var xp=/\\.(png|jpe?g|gif|webp|svg)$/i;function Qx(e,t,a){let o=e.nodes.map(l=>({...l})),r=[];return(t.items||[]).forEach(l=>{let s=o.findIndex(y=>y.id===l.leafId&&y.level===\"leaf\");if(s===-1){r.push(l.leafId);return}let u={...o[s]},i=(u.cards||Ua(u)).map(y=>({...y,questions:[...y.questions]})),d=l.image?a[l.image]:null,p=l.cardId?i.findIndex(y=>y.id===l.cardId):-1,f;p===-1?(f={id:l.cardId||`${u.id}-card-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,image:d||null,imagePosition:\"top\",questions:[],note:l.info||\"\"},i=[...i,f],p=i.length-1):(f={...i[p]},d&&(f.image=d),l.info&&(f.note=l.info));let g=(l.linkedTo||[]).map(y=>typeof y==\"string\"?y:y.leafId?y.blockId?{leafId:y.leafId,blockId:y.blockId}:y.leafId:null).filter(Boolean);if(l.questionId){let y=f.questions.findIndex(k=>k.id===l.questionId);if(y!==-1&&g.length){let k={...f.questions[y]};k.linkedTo=Array.from(new Map([...k.linkedTo||[],...g].map(v=>[ll(v),v])).values()),f.questions=f.questions.map((v,I)=>I===y?k:v)}}else g.length&&(f.cardLinkedTo=Array.from(new Map([...f.cardLinkedTo||[],...g].map(y=>[ll(y),y])).values()));i[p]=f,u.cards=i,u.questions=i.flatMap(y=>y.questions),o[s]=u}),{book:{...e,nodes:o},skipped:r}}function Zx({book:e,lang:t,theme:a,t:o,onImportBook:r,addCard:l,addQuestionOfType:s,voiceEnabled:u,onVoiceEnabledChange:i,onImportOrderedImages:d,onImportManifestFolder:p,importStatus:f}){let g=(0,D.useRef)(null),y=(0,D.useRef)(null),k=(0,D.useRef)(null),v=c=>{var L;let m=(L=c.target.files)==null?void 0:L[0];if(!m)return;let h=new FileReader;h.onload=()=>{try{let F=JSON.parse(h.result);r(F)}catch(F){}},h.readAsText(m),c.target.value=\"\"},I={background:a.surface,borderRadius:14,border:`1px solid ${a.hairline}`,padding:8},x={height:28,borderRadius:8,background:a.surfaceSoft,display:\"grid\",placeItems:\"center\",color:a.ink};return(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-2\",style:{width:150},children:[(0,n.jsxs)(\"div\",{style:I,children:[(0,n.jsx)(\"p\",{className:\"text-[9px] font-bold uppercase mb-1.5\",style:{color:a.inkSoft},children:o.files}),(0,n.jsxs)(\"div\",{className:\"flex gap-1.5 mb-1.5\",children:[(0,n.jsx)(\"button\",{onClick:()=>{var c;return(c=g.current)==null?void 0:c.click()},className:\"flex-1\",style:x,title:o.importBookJson,children:(0,n.jsx)(Ar,{size:14})}),(0,n.jsx)(\"button\",{onClick:()=>jx(`${e.id}.json`,e),className:\"flex-1\",style:x,title:o.exportBookJson,children:(0,n.jsx)(ma,{size:14})}),(0,n.jsx)(\"input\",{ref:g,type:\"file\",accept:\"application/json\",onChange:v,className:\"hidden\"})]}),(0,n.jsxs)(\"button\",{onClick:()=>{var c;return(c=y.current)==null?void 0:c.click()},className:\"w-full flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 mb-1.5\",style:{borderRadius:8,background:a.surfaceSoft,color:a.ink},title:o.importOrderedImages,children:[(0,n.jsx)(wo,{size:12}),\" 0\\xB71\\xB72\"]}),(0,n.jsx)(\"input\",{ref:y,type:\"file\",accept:\"image/*\",multiple:!0,webkitdirectory:\"\",directory:\"\",onChange:c=>{d(c.target.files),c.target.value=\"\"},className:\"hidden\"}),(0,n.jsxs)(\"button\",{onClick:()=>{var c;return(c=k.current)==null?void 0:c.click()},className:\"w-full flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5\",style:{borderRadius:8,background:a.surfaceSoft,color:a.ink},title:o.importManifestFolder,children:[(0,n.jsx)(Fo,{size:12}),\" manifest\"]}),(0,n.jsx)(\"input\",{ref:k,type:\"file\",multiple:!0,webkitdirectory:\"\",directory:\"\",onChange:c=>{p(c.target.files),c.target.value=\"\"},className:\"hidden\"}),f&&(0,n.jsx)(\"p\",{className:\"text-[9px] mt-1.5\",style:{color:f.ok?a.accent:\"#C0392B\"},children:f.text})]}),(0,n.jsxs)(\"div\",{style:I,children:[(0,n.jsx)(\"p\",{className:\"text-[9px] font-bold uppercase mb-1.5\",style:{color:a.inkSoft},children:o.card}),(0,n.jsxs)(\"button\",{onClick:l,className:\"w-full text-[10px] font-bold py-1.5\",style:{borderRadius:8,background:a.accentSoft,color:a.accent},children:[\"+ \",o.newCard]})]}),(0,n.jsxs)(\"div\",{style:I,children:[(0,n.jsx)(\"p\",{className:\"text-[9px] font-bold uppercase mb-1.5\",style:{color:a.inkSoft},children:o.addQuestion}),(0,n.jsx)(\"div\",{className:\"grid grid-cols-3 gap-1 max-h-40 overflow-y-auto\",children:Object.entries(Ce).map(([c,m])=>(0,n.jsx)(\"button\",{onClick:()=>s(c),className:\"h-7 grid place-items-center\",style:{borderRadius:7,background:m.color.bg,color:m.color.ink},title:t===\"ar\"?m.ar:m.en,children:(0,n.jsx)(m.Icon,{size:12})},c))})]}),(0,n.jsx)(\"div\",{style:I,children:(0,n.jsxs)(\"label\",{className:\"flex items-start gap-1.5 cursor-pointer\",children:[(0,n.jsx)(\"input\",{type:\"checkbox\",checked:u,onChange:c=>i(c.target.checked),className:\"mt-0.5\"}),(0,n.jsx)(\"span\",{className:\"text-[10px] font-semibold\",style:{color:a.ink},children:o.voiceFeature})]})})]})}function Yx({book:e,lang:t,leaf:a,card:o,theme:r}){var u,i;let l=a?e.nodes.find(d=>{var p;return d.id===((p=e.nodes.find(f=>f.id===a.parent))==null?void 0:p.parent)}):null,s=[{n:1,active:!0,label:t===\"ar\"?(u=e.ar)==null?void 0:u.title:(i=e.en)==null?void 0:i.title},{n:2,active:!!a,label:l?t===\"ar\"?l.ar:l.en:\"\"},{n:3,active:!!a,label:a?t===\"ar\"?a.ar:a.en:\"\"},{n:4,active:!!o,label:\"\"}];return(0,n.jsx)(\"div\",{className:\"flex items-center gap-2 flex-wrap\",children:s.map((d,p)=>(0,n.jsxs)(\"span\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(\"span\",{className:\"w-6 h-6 grid place-items-center text-[10px] font-bold shrink-0\",style:{borderRadius:999,background:d.active?r.accent:r.surface,color:d.active?r.accentInk:r.inkSoft,border:`1px solid ${d.active?r.accent:r.hairline}`},children:d.n}),d.label&&(0,n.jsx)(\"span\",{className:\"text-[11px] font-semibold\",style:{color:r.inkSoft},children:d.label}),p<s.length-1&&(0,n.jsx)(\"span\",{style:{color:r.hairlineStrong},children:\"\\u203A\"})]},d.n))})}function Jx({book:e,lang:t,theme:a,skin:o,voiceEnabled:r,onVoiceEnabledChange:l,onUpdateBook:s}){var q,Ne,et,pt;let u=mi[t],[i,d]=(0,D.useState)(\"cards\"),[p,f]=(0,D.useState)(null),[g,y]=(0,D.useState)(0),[k,v]=(0,D.useState)(!1),I=(0,D.useMemo)(()=>e.nodes.filter(T=>T.level===\"leaf\"),[e]),x=I.find(T=>T.id===p)||null,c=x?Ua(x):[],m=c[g],h=(0,D.useMemo)(()=>{if(!p)return[];let T=[];I.forEach(R=>{Ua(R).forEach(V=>{[...V.cardLinkedTo||[],...V.questions.flatMap(ge=>ge.linkedTo||[])].forEach(ge=>{Gn(ge)===p&&T.push({srcLeaf:R,blockId:hi(ge)})})})});let B=new Set;return T.filter(R=>{let V=R.srcLeaf.id+\"::\"+(R.blockId||\"\");return B.has(V)?!1:(B.add(V),!0)})},[I,p]),L=T=>{s(B=>({...B,nodes:B.nodes.map(R=>R.id===p?T(R):R)}))},F=T=>L(B=>({...B,cards:T,questions:T.flatMap(R=>R.questions)})),b=(T,B)=>F(c.map((R,V)=>V===T?{...R,...B}:R)),C=T=>{F(c.filter((B,R)=>R!==T)),y(0)},N=()=>{let T=[...c,{id:`${p}-card-${Date.now()}`,image:null,imagePosition:\"top\",video:null,audio:null,questions:[]}];F(T),y(T.length-1)},P=T=>{if(!m)return;let B={id:`${m.id}-${Date.now()}`,type:T,subject:\"\",difficulty:\"Beginner\",tier:\"core\",dir:\"ltr\",en:{prompt:\"\"},ar:{prompt:\"\"}};b(g,{questions:[...m.questions,B]})},M=T=>s(()=>T),[E,H]=(0,D.useState)(null),_=async T=>{if(!x)return;let B=Array.from(T).filter(K=>xp.test(K.name));B.sort((K,ge)=>Xx(K.name,ge.name));let R=await Promise.all(B.map(gi)),V=[...c];R.forEach((K,ge)=>{V[ge]?V[ge]={...V[ge],image:K}:V.push({id:`${p}-card-${Date.now()}-${ge}`,image:K,imagePosition:\"top\",questions:[]})}),F(V),H({ok:!0,text:u.importDone(R.length)})},U=async T=>{let B=Array.from(T),R=B.find(Ee=>/manifest.*\\.json$/i.test(Ee.name)||/\\.json$/i.test(Ee.name));if(!R){H({ok:!1,text:u.importNoManifest});return}let V=JSON.parse(await R.text()),K=B.filter(Ee=>xp.test(Ee.name)),ge={};for(let Ee of K)ge[Ee.name]=await gi(Ee);let{book:Po,skipped:zt}=Qx(e,V,ge);s(()=>Po);let La=(V.items||[]).length-zt.length;H({ok:zt.length===0,text:zt.length?`${u.importDone(La)} ${u.importSkipped(zt.length)}`:u.importDone(La)})};return(0,n.jsxs)(\"div\",{className:\"educraft-panel-in\",style:{background:`linear-gradient(180deg, ${a.accentSoft} 0%, ${a.canvas} 55%)`,borderRadius:20,padding:16},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between flex-wrap gap-3 mb-4\",children:[(0,n.jsx)(Yx,{book:e,lang:t,leaf:x,card:m,theme:a}),(0,n.jsx)(\"div\",{className:\"flex items-center gap-2\",children:[[\"cards\",u.tabCards],[\"pages\",u.tabPages]].map(([T,B])=>(0,n.jsx)(\"button\",{onClick:()=>d(T),className:\"text-sm font-bold px-3.5 py-2\",style:{borderRadius:o.radiusSm,background:i===T?a.accent:a.surface,color:i===T?a.accentInk:a.ink},children:B},T))})]}),(0,n.jsxs)(\"div\",{className:\"grid md:grid-cols-[200px_1fr] gap-4\",children:[(0,n.jsx)(\"div\",{className:\"p-3\",style:{borderRadius:o.radiusLg,border:`1px solid ${a.hairline}`,background:a.surface,alignSelf:\"start\"},children:(0,n.jsx)(zx,{book:e,lang:t,theme:a,selectedLeafId:p,onSelect:T=>{f(T),y(0)}})}),(0,n.jsxs)(\"div\",{children:[!k&&!x?(0,n.jsx)(\"p\",{className:\"text-sm\",style:{color:a.inkSoft},children:u.noLeaf}):!k&&(0,n.jsx)(n.Fragment,{children:h.length>0&&(0,n.jsxs)(\"div\",{className:\"flex flex-wrap items-center gap-1.5 mb-3\",children:[(0,n.jsx)(\"span\",{className:\"text-[11px] font-bold\",style:{color:a.inkSoft},children:u.incomingLinks}),h.map(({srcLeaf:T,blockId:B},R)=>{let V=B?On(T,B,u):null;return(0,n.jsxs)(\"button\",{onClick:()=>{f(T.id),y(0)},className:\"flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1\",style:{borderRadius:999,background:a.surface,border:`1.5px dashed ${a.accent}`,color:a.accent},children:[(0,n.jsx)(Ht,{size:11}),t===\"ar\"?T.ar:T.en,V&&(0,n.jsxs)(\"span\",{style:{opacity:.8},children:[\"\\u203A \",V]})]},T.id+\"::\"+(B||\"\")+R)})]})}),i===\"pages\"?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between gap-2 mb-3 flex-wrap\",children:[(0,n.jsx)(\"p\",{className:\"text-xs\",style:{color:a.inkSoft},children:k?u.wholeBookSub:u.pagesSub}),(0,n.jsxs)(\"button\",{onClick:()=>v(T=>!T),className:\"text-xs font-bold px-3 py-1.5 flex items-center gap-1.5\",style:{borderRadius:o.radiusSm,background:k?a.accent:a.surface,color:k?a.accentInk:a.ink,border:`1px solid ${a.hairline}`},children:[(0,n.jsx)(Ra,{size:13}),k?u.backToLeafPages:u.previewWholeBook]})]}),k?(0,n.jsx)(Kx,{book:e,lang:t,t:u,theme:a,skin:o,docTitle:t===\"ar\"?(q=e.ar)==null?void 0:q.title:(Ne=e.en)==null?void 0:Ne.title}):x?(0,n.jsx)($x,{leaf:x,lang:t,theme:a,skin:o,t:u,onUpdateLeaf:T=>L(B=>({...B,...T})),allLeavesCards:c,docTitle:t===\"ar\"?(et=e.ar)==null?void 0:et.title:(pt=e.en)==null?void 0:pt.title,pageTitle:t===\"ar\"?x.ar:x.en}):(0,n.jsx)(\"p\",{className:\"text-sm\",style:{color:a.inkSoft},children:u.noLeaf})]}):x&&(0,n.jsxs)(\"div\",{className:\"flex gap-4 items-start\",children:[(0,n.jsxs)(\"div\",{className:\"flex-1 min-w-0\",children:[(0,n.jsx)(\"div\",{className:\"flex flex-wrap items-center gap-1.5 mb-3\",children:c.map((T,B)=>(0,n.jsxs)(\"button\",{onClick:()=>y(B),className:\"text-xs font-bold px-3 py-1.5\",style:{borderRadius:999,background:g===B?a.accent:a.surface,color:g===B?a.accentInk:a.ink},children:[u.card,\" \",B+1]},T.id||B))}),m&&(0,n.jsx)(Ox,{card:m,lang:t,theme:a,skin:o,t:u,voiceEnabled:r,allLeaves:I,currentLeafId:p,onUpdateCard:T=>b(g,T),onDeleteCard:()=>C(g)})]}),(0,n.jsx)(Zx,{book:e,lang:t,theme:a,t:u,onImportBook:M,addCard:N,addQuestionOfType:P,voiceEnabled:r,onVoiceEnabledChange:l,onImportOrderedImages:_,onImportManifestFolder:U,importStatus:E})]})]})]})]})}function e1({book:e,lang:t,ui:a,theme:o,dir:r,skin:l,plan:s,onUpdatePlan:u}){let i=(0,D.useMemo)(()=>e.nodes.filter(G=>G.level===\"leaf\"),[e]),d=i.length,p=(0,D.useMemo)(()=>new Set(i.map(G=>G.id)),[i]),f=(0,D.useMemo)(()=>new Set(s.doneLeafIds.filter(G=>p.has(G))),[s.doneLeafIds,p]),g=f.size,y=new Date,k=Rn(y),v=!!s.targetDate,I=t===\"ar\"?\"ar-EG\":\"en-US\",[x,c]=(0,D.useState)(!v),[m,h]=(0,D.useState)(s.targetDate||\"\"),[L,F]=(0,D.useState)(s.targetCount||d||1),b=Math.max(1,Math.min(d||1,s.targetCount||d||1)),C=Math.max(0,b-g),N=v?Math.max(1,ci(s.startDate||k,s.targetDate)):null,P=s.startDate?Math.max(1,ci(s.startDate,k)+1):1,M=v?Math.max(0,ci(k,s.targetDate)):null,E=v?b/N:null,H=v?Math.min(b,E*P):null,_=g/P,U=v?M>0?C/M:C:null,q=\"no-goal\";if(v)if(C===0)q=\"done\";else{let G=g-H;G>=.5?q=\"ahead\":G<=-.5?q=\"behind\":q=\"on-track\"}let Ne={\"no-goal\":{label:a.plannerStatusNoGoal,bg:o.surfaceSoft,ink:o.inkSoft,Icon:Ga},ahead:{label:a.plannerStatusAhead,bg:Q.bg,ink:Q.border,Icon:To},\"on-track\":{label:a.plannerStatusOnTrack,bg:o.accentSoft,ink:o.ink,Icon:_r},behind:{label:a.plannerStatusBehind,bg:Z.bg,ink:Z.border,Icon:Jr},done:{label:a.plannerStatusDone,bg:Q.bg,ink:Q.border,Icon:Ao}}[q],et=(0,D.useMemo)(()=>{let G=0,j=new Date(y.getFullYear(),y.getMonth(),y.getDate());for(s.log[Rn(j)]||j.setDate(j.getDate()-1);(s.log[Rn(j)]||0)>0;)G++,j.setDate(j.getDate()-1);return G},[s.log]),pt=d?Math.round(g/d*100):0,T=G=>{u(j=>{let Y=j.doneLeafIds.includes(G),$=Y?j.doneLeafIds.filter(Ke=>Ke!==G):[...j.doneLeafIds,G],mt={...j.log,[k]:Math.max(0,(j.log[k]||0)+(Y?-1:1))};return{...j,doneLeafIds:$,log:mt}})},B=()=>{m&&(u(G=>({...G,targetDate:m,targetCount:Math.max(1,Math.min(d||1,Number(L)||d||1)),startDate:G.startDate||k})),c(!1))},R=()=>{u(G=>({...G,targetDate:null,targetCount:null,startDate:null})),h(\"\"),c(!0)},V=(0,D.useMemo)(()=>{let G=Y=>{let $=e.nodes.find(Ke=>Ke.id===Y.parent);return($?e.nodes.find(Ke=>Ke.id===$.parent):null)||$||Y},j=new Map;return i.forEach(Y=>{let $=G(Y);j.has($.id)||j.set($.id,{branch:$,leaves:[]}),j.get($.id).leaves.push(Y)}),Array.from(j.values())},[i,e]),[K,ge]=(0,D.useState)(()=>new Date(y.getFullYear(),y.getMonth(),1)),Po=(0,D.useMemo)(()=>Sx(K),[K]),zt=(0,D.useMemo)(()=>{let G=new Date(2023,0,1);return Array.from({length:7}).map((j,Y)=>{let $=new Date(G);return $.setDate(G.getDate()+Y),$.toLocaleDateString(I,{weekday:\"narrow\"})})},[t]),La={borderRadius:l.radiusSm===9999?10:l.radiusSm,border:`1.5px solid ${de(l,o)}`,background:o.surface,color:o.ink},Ee=(G,j,Y,$)=>(0,n.jsxs)(\"div\",{className:\"flex flex-col gap-1.5 p-4\",style:ft(l,o,{soft:!0}),children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider\",style:{color:o.inkSoft},children:[(0,n.jsx)($,{size:12}),G]}),(0,n.jsx)(\"span\",{className:\"text-2xl font-black\",style:{color:o.ink,fontFamily:a.displayFont},children:j}),Y&&(0,n.jsx)(\"span\",{className:\"text-[11px] font-semibold\",style:{color:o.inkSoft},children:Y})]});return(0,n.jsxs)(\"section\",{children:[(0,n.jsx)(\"h1\",{className:\"text-2xl font-bold mb-1\",style:{fontFamily:a.displayFont,color:o.ink},children:a.plannerTitle}),(0,n.jsxs)(\"p\",{className:\"text-sm mb-6\",style:{color:o.inkSoft},children:[a.plannerSub,\" \\u2014 \",e[t].title]}),(0,n.jsx)(\"div\",{className:\"p-5 mb-5\",style:ft(l,o),children:x?(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"h3\",{className:\"text-sm font-black uppercase tracking-wide mb-1\",style:{color:o.ink},children:v?a.plannerEditGoal:a.plannerNoGoalTitle}),!v&&(0,n.jsx)(\"p\",{className:\"text-xs mb-4 max-w-md\",style:{color:o.inkSoft},children:a.plannerNoGoalSub}),(0,n.jsxs)(\"div\",{className:\"flex flex-wrap items-end gap-4 mt-3\",children:[(0,n.jsxs)(\"label\",{className:\"flex flex-col gap-1.5 text-xs font-bold\",style:{color:o.inkSoft},children:[a.plannerGoalDateLabel,(0,n.jsx)(\"input\",{type:\"date\",value:m,min:k,onChange:G=>h(G.target.value),className:\"px-3 py-2 text-sm font-semibold\",style:{...La,minHeight:40}})]}),(0,n.jsxs)(\"label\",{className:\"flex flex-col gap-1.5 text-xs font-bold\",style:{color:o.inkSoft},children:[a.plannerGoalCountLabel,\" \",(0,n.jsxs)(\"span\",{className:\"font-normal opacity-70\",children:[\"/\",d]}),(0,n.jsx)(\"input\",{type:\"number\",min:1,max:d||1,value:L,onChange:G=>F(G.target.value),className:\"px-3 py-2 text-sm font-semibold w-24\",style:{...La,minHeight:40}})]}),(0,n.jsxs)(\"button\",{onClick:B,disabled:!m,className:\"flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold\",style:{borderRadius:l.radiusSm,background:o.accent,color:o.accentInk,minHeight:40,opacity:m?1:.5},children:[(0,n.jsx)(Ga,{size:14}),a.plannerSetGoal]}),v&&(0,n.jsx)(\"button\",{onClick:()=>c(!1),className:\"px-3 py-2.5 text-sm font-bold\",style:{color:o.inkSoft,minHeight:40},children:a.plannerCancel})]})]}):(0,n.jsxs)(\"div\",{className:\"flex flex-wrap items-center justify-between gap-4\",children:[(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"h3\",{className:\"text-xs font-black uppercase tracking-wide mb-1.5\",style:{color:o.inkSoft},children:a.plannerTargetLabel}),(0,n.jsxs)(\"p\",{className:\"text-lg font-bold\",style:{color:o.ink,fontFamily:a.displayFont},children:[b,\" \",a.plannerLeavesUnit,\" \",pi(s.targetDate).toLocaleDateString(I,{day:\"numeric\",month:\"long\",year:\"numeric\"})]})]}),(0,n.jsxs)(\"div\",{className:\"flex gap-2\",children:[(0,n.jsxs)(\"button\",{onClick:()=>c(!0),className:\"flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold\",style:{borderRadius:l.radiusSm,border:`1.5px solid ${de(l,o)}`,color:o.ink,minHeight:36},children:[(0,n.jsx)(bo,{size:12}),a.plannerEditGoal]}),(0,n.jsxs)(\"button\",{onClick:R,className:\"flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold\",style:{color:o.inkSoft,minHeight:36},children:[(0,n.jsx)(ct,{size:12}),a.plannerClearGoal]})]})]})}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-3 px-4 py-3.5 mb-5\",style:{background:Ne.bg,color:Ne.ink,borderRadius:l.radiusLg,border:l.pixel?`${l.borderW}px solid ${Ne.ink}`:\"none\",boxShadow:l.pixel?l.shadow:\"none\"},children:[(0,n.jsx)(Ne.Icon,{size:20,strokeWidth:2.5}),(0,n.jsx)(\"span\",{className:\"text-sm font-black\",children:Ne.label})]}),(0,n.jsxs)(\"div\",{className:\"grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6\",children:[Ee(a.plannerCompletionLabel,`${pt}%`,`${g}/${d}`,Gt),Ee(a.plannerDaysLeft,v?M:\"\\u2014\",null,Mt),Ee(a.plannerRequiredPace,v?U.toFixed(1):\"\\u2014\",null,Ga),Ee(a.plannerActualPace,_.toFixed(1),null,To),Ee(a.plannerStreakLabel,et,null,Io)]}),(0,n.jsxs)(\"div\",{className:\"p-5 mb-5\",style:ft(l,o),children:[(0,n.jsxs)(\"div\",{className:\"flex items-center justify-between mb-4\",children:[(0,n.jsxs)(\"h3\",{className:\"text-sm font-black uppercase tracking-wide flex items-center gap-1.5\",style:{color:o.ink},children:[(0,n.jsx)(Mt,{size:14}),a.plannerCalendarTitle]}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1\",children:[(0,n.jsx)(\"button\",{onClick:()=>ge(G=>new Date(G.getFullYear(),G.getMonth()-1,1)),className:\"p-1.5\",style:{borderRadius:l.radiusSm,color:o.inkSoft,minHeight:32,minWidth:32},\"aria-label\":\"prev month\",children:(0,n.jsx)(Ma,{size:16})}),(0,n.jsx)(\"span\",{className:\"text-xs font-bold w-32 text-center\",style:{color:o.ink},children:K.toLocaleDateString(I,{month:\"long\",year:\"numeric\"})}),(0,n.jsx)(\"button\",{onClick:()=>ge(G=>new Date(G.getFullYear(),G.getMonth()+1,1)),className:\"p-1.5\",style:{borderRadius:l.radiusSm,color:o.inkSoft,minHeight:32,minWidth:32},\"aria-label\":\"next month\",children:(0,n.jsx)(ca,{size:16})})]})]}),(0,n.jsx)(\"div\",{className:\"grid grid-cols-7 gap-1.5 mb-1.5\",children:zt.map((G,j)=>(0,n.jsx)(\"div\",{className:\"text-center text-[10px] font-bold\",style:{color:o.inkSoft},children:G},j))}),Po.map((G,j)=>(0,n.jsx)(\"div\",{className:\"grid grid-cols-7 gap-1.5 mb-1.5\",children:G.map((Y,$)=>{if(!Y)return(0,n.jsx)(\"div\",{},$);let mt=Rn(Y),Ke=s.log[mt]||0,qn=mt===k,sl=Y>y,_n=Ke>0?Math.min(.24*Ke+.22,1):0;return(0,n.jsx)(\"div\",{className:\"aspect-square flex items-center justify-center text-[10px] font-bold\",title:`${mt}: ${Ke}`,style:{borderRadius:8,background:Ke>0?Hn(o.accent,_n):sl?\"transparent\":Hn(o.ink,.04),color:o.ink,border:qn?`1.5px solid ${o.accent}`:`1px solid ${de(l,o)}`,opacity:sl?.4:1},children:Y.getDate()},$)})},j))]}),(0,n.jsxs)(\"div\",{className:\"p-5\",style:ft(l,o),children:[(0,n.jsxs)(\"h3\",{className:\"text-sm font-black uppercase tracking-wide mb-1 flex items-center gap-1.5\",style:{color:o.ink},children:[(0,n.jsx)(zr,{size:14}),a.plannerTodoTitle]}),(0,n.jsx)(\"p\",{className:\"text-xs mb-4\",style:{color:o.inkSoft},children:a.plannerTodoSub}),d>0&&g===d&&(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2 px-3.5 py-3 mb-4 text-sm font-semibold\",style:{background:Q.bg,color:Q.border,borderRadius:l.radiusMd},children:[(0,n.jsx)(it,{size:16}),a.plannerAllDone]}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-5\",children:V.map(({branch:G,leaves:j})=>(0,n.jsxs)(\"div\",{children:[(0,n.jsx)(\"p\",{className:\"text-xs font-black uppercase tracking-wide mb-2\",style:{color:o.inkSoft},children:G[t]}),(0,n.jsx)(\"div\",{className:\"flex flex-col gap-1.5\",children:j.map(Y=>{let $=f.has(Y.id);return(0,n.jsxs)(\"button\",{onClick:()=>T(Y.id),className:\"flex items-center gap-3 px-3.5 py-2.5 w-full text-start transition-colors\",style:{borderRadius:l.radiusMd,border:`1.5px solid ${$?o.accent:de(l,o)}`,background:$?o.accentSoft:\"transparent\",minHeight:44},children:[(0,n.jsx)(\"span\",{className:\"grid place-items-center shrink-0\",style:{width:20,height:20,borderRadius:l.radiusSm===9999?999:6,border:`1.5px solid ${$?o.accent:o.hairlineStrong}`,background:$?o.accent:\"transparent\"},children:$&&(0,n.jsx)(it,{size:12,color:o.accentInk,strokeWidth:3})}),(0,n.jsx)(\"span\",{className:\"text-sm font-semibold flex-1\",style:{color:o.ink,textDecoration:$?\"line-through\":\"none\",opacity:$?.6:1},children:Y[t]}),(0,n.jsx)(\"span\",{className:\"text-[11px] font-bold shrink-0\",style:{color:o.inkSoft},children:Y.questions.length})]},Y.id)})})]},G.id))})]})]})}function yi({onExportBook:e,onExportCollection:t}={}){let a=(0,D.useMemo)(()=>kp(),[]),[o]=(0,D.useState)(()=>Cx()),[r,l]=(0,D.useState)(o.lang||a&&a.lang||\"en\"),[s,u]=(0,D.useState)(o.mode||\"light\"),[i,d]=(0,D.useState)(\"library\"),[p,f]=(0,D.useState)(a?a.books:Mn),[g,y]=(0,D.useState)(a?a.startBookId||a.books[0].id:Mn[0].id),[k,v]=(0,D.useState)(null),[I,x]=(0,D.useState)(o.skinId||a&&a.skinId||\"normal\"),[c,m]=(0,D.useState)(o.flavorId||a&&a.flavorId||\"normal\"),[h,L]=(0,D.useState)(o.cardMode||\"paged\"),[F,b]=(0,D.useState)(o.scrollDir||\"vertical\"),[C,N]=(0,D.useState)(o.covers||a&&a.covers||{}),[P,M]=(0,D.useState)(o.plans||{}),[E,H]=(0,D.useState)(o.collections||a&&a.collections||[]),[_,U]=(0,D.useState)([]),[q,Ne]=(0,D.useState)(!1),[et,pt]=(0,D.useState)(o.voiceEnabled!==!1),T=vx[r],B=hp[c][s],R=Ct[I],V=T.dir,K=p.find(O=>O.id===g)||p[0],ge=O=>f(le=>le.map(fe=>fe.id===K.id?O(fe):fe)),Po=P[g]||ip(),zt=O=>M(le=>({...le,[g]:O(le[g]||ip())}));(0,D.useEffect)(()=>{dp({lang:r,mode:s,skinId:I,flavorId:c,cardMode:h,scrollDir:F,voiceEnabled:et,covers:C,plans:P,collections:E})},[r,s,I,c,h,F,et,C,P,E]);let La=()=>{dp({}),l(\"en\"),u(\"light\"),x(\"normal\"),m(\"normal\"),L(\"paged\"),b(\"vertical\"),pt(!0),N({}),M({}),H([]),U([]),f(a?a.books:Mn),y(a?a.startBookId||a.books[0].id:Mn[0].id),v(null),d(\"library\")},Ee=O=>{y(O),v(null),d(\"tree\")},G=O=>{v(O),d(\"deck\")},j=(0,D.useMemo)(()=>Object.fromEntries(K.nodes.filter(O=>O.level===\"leaf\").map(O=>[O.id,O])),[K]),Y=k?j[k]:null,$=(O,le)=>N(fe=>({...fe,[O]:le})),mt=O=>N(le=>{let fe={...le};return delete fe[O],fe}),Ke=O=>{let le=window.prompt(O===\"encyclopedia\"?T.collectionNamePromptEncyclopedia:T.collectionNamePromptFolder);!le||!le.trim()||H(fe=>[...fe,{id:Ix(O),kind:O,title:le.trim(),itemIds:[]}])},qn=O=>{window.confirm(T.libraryDeleteCollectionConfirm)&&(H(le=>le.filter(fe=>fe.id!==O)),U(le=>le.filter(fe=>fe!==O)))},sl=(O,le)=>{H(fe=>fe.map(Wa=>Wa.id===le?{...Wa,itemIds:Array.from(new Set([...Wa.itemIds,O]))}:Wa))},_n=O=>{H(le=>le.map(fe=>fe.itemIds.includes(O)?{...fe,itemIds:fe.itemIds.filter(Wa=>Wa!==O)}:fe))},Wp=O=>U(le=>[...le,O]),qp=O=>U(le=>le.slice(0,O)),_p=R.displayFontOverride||T.displayFont;return(0,n.jsxs)(\"div\",{dir:V,lang:T.htmlLang,className:\"min-h-screen w-full\",style:{background:B.canvas,color:B.ink,fontFamily:T.bodyFont},children:[(0,n.jsx)(\"style\",{children:`\n        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&family=Cairo:wght@500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Press+Start+2P&display=swap');\n        /* Fixes the stray white/default strip that used to show above the\n           header: the browser's default body margin let the page's own\n           white background peek through before our canvas color painted. */\n        html, body { margin: 0; padding: 0; background: ${B.canvas}; }\n        #root, #__next { background: ${B.canvas}; }\n        .educraft-root * { box-sizing: border-box; }\n        .educraft-root button { font: inherit; cursor: pointer; }\n        .educraft-root button:disabled { cursor: not-allowed; }\n        .educraft-root input, .educraft-root textarea { font: inherit; }\n        .educraft-root button:focus-visible,\n        .educraft-root a:focus-visible,\n        .educraft-root input:focus-visible,\n        .educraft-root textarea:focus-visible,\n        .educraft-root g:focus-visible rect { outline: 2px solid ${B.accent}; outline-offset: 2px; }\n        @media (prefers-reduced-motion: reduce) {\n          .educraft-root * { animation: none !important; transition: none !important; }\n        }\n        @keyframes educraft-rise {\n          from { opacity: 0; transform: translateY(10px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n        @keyframes educraft-pop {\n          from { opacity: 0; transform: translateY(14px) scale(0.98); }\n          to { opacity: 1; transform: translateY(0) scale(1); }\n        }\n        .educraft-hero-in { animation: educraft-rise .45s ease both; }\n        .educraft-panel-in { animation: educraft-rise .3s ease both; }\n        .educraft-modal-in { animation: educraft-pop .22s ease both; }\n      `}),(0,n.jsxs)(\"div\",{className:\"educraft-root max-w-5xl mx-auto px-5 sm:px-8 pb-16\",children:[(0,n.jsxs)(\"header\",{className:\"flex items-center justify-between gap-4 mt-6 px-5 py-3.5 flex-wrap\",style:{background:R.surfaceAlpha>=1?B.header:Hn(B.header,R.surfaceAlpha),borderRadius:R.radiusLg,border:`${R.borderW}px solid ${de(R,B)}`,boxShadow:R.shadow,backdropFilter:R.blur,WebkitBackdropFilter:R.blur},children:[(0,n.jsxs)(\"div\",{className:\"flex items-center gap-2\",children:[(0,n.jsx)(Er,{size:20,color:B.ink,strokeWidth:2}),(0,n.jsx)(\"span\",{className:\"text-lg font-bold\",style:{fontFamily:_p,color:B.ink,letterSpacing:R.letterSpacing},children:T.brand})]}),(0,n.jsxs)(\"nav\",{className:\"hidden md:flex items-center gap-1\",children:[(0,n.jsxs)(\"button\",{onClick:()=>d(\"library\"),className:\"flex items-center gap-1.5 text-sm font-semibold px-3 py-2 transition-colors\",style:{borderRadius:R.radiusSm,color:i===\"library\"?B.accentInk:B.ink,background:i===\"library\"?B.accent:\"transparent\"},children:[(0,n.jsx)(Ra,{size:14}),T.navLibrary]}),(0,n.jsxs)(\"button\",{onClick:()=>d(\"tree\"),className:\"flex items-center gap-1.5 text-sm font-semibold px-3 py-2 transition-colors\",style:{borderRadius:R.radiusSm,color:i===\"tree\"?B.accentInk:B.ink,background:i===\"tree\"?B.accent:\"transparent\"},children:[(0,n.jsx)(Ht,{size:14}),T.navTree]}),(0,n.jsxs)(\"button\",{onClick:()=>d(\"editor\"),className:\"flex items-center gap-1.5 text-sm font-semibold px-3 py-2 transition-colors\",style:{borderRadius:R.radiusSm,color:i===\"editor\"?B.accentInk:B.ink,background:i===\"editor\"?B.accent:\"transparent\"},children:[(0,n.jsx)(Ha,{size:14}),T.navEditor]}),(0,n.jsxs)(\"button\",{onClick:()=>d(\"planner\"),className:\"flex items-center gap-1.5 text-sm font-semibold px-3 py-2 transition-colors\",style:{borderRadius:R.radiusSm,color:i===\"planner\"?B.accentInk:B.ink,background:i===\"planner\"?B.accent:\"transparent\"},children:[(0,n.jsx)(Mt,{size:14}),T.navPlanner]})]}),(0,n.jsxs)(\"div\",{className:\"flex items-center gap-1.5\",children:[(0,n.jsxs)(\"button\",{onClick:()=>l(O=>O===\"en\"?\"ar\":\"en\"),className:\"flex items-center gap-1.5 text-xs font-semibold px-2.5 py-2\",style:{borderRadius:R.radiusSm,color:B.ink,minHeight:40},\"aria-label\":\"Toggle language\",children:[(0,n.jsx)(Rr,{size:16}),T.langToggle]}),(0,n.jsx)(\"button\",{onClick:()=>u(O=>O===\"light\"?\"dark\":\"light\"),className:\"p-2\",style:{borderRadius:R.radiusSm,color:B.ink,minHeight:40,minWidth:40},\"aria-label\":\"Toggle theme\",children:s===\"light\"?(0,n.jsx)(Vr,{size:16}):(0,n.jsx)(Do,{size:16})}),(0,n.jsx)(\"button\",{onClick:()=>Ne(!0),className:\"p-2\",style:{borderRadius:R.radiusSm,color:B.ink,minHeight:40,minWidth:40},\"aria-label\":T.navSettings,title:T.navSettings,children:(0,n.jsx)(Ha,{size:16})})]}),(0,n.jsxs)(\"nav\",{className:\"flex md:hidden items-center gap-1 w-full justify-center pt-1\",children:[(0,n.jsxs)(\"button\",{onClick:()=>d(\"library\"),className:\"flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors\",style:{borderRadius:R.radiusSm,color:i===\"library\"?B.accentInk:B.ink,background:i===\"library\"?B.accent:\"transparent\"},children:[(0,n.jsx)(Ra,{size:13}),T.navLibrary]}),(0,n.jsxs)(\"button\",{onClick:()=>d(\"tree\"),className:\"flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors\",style:{borderRadius:R.radiusSm,color:i===\"tree\"?B.accentInk:B.ink,background:i===\"tree\"?B.accent:\"transparent\"},children:[(0,n.jsx)(Ht,{size:13}),T.navTree]}),(0,n.jsxs)(\"button\",{onClick:()=>d(\"editor\"),className:\"flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors\",style:{borderRadius:R.radiusSm,color:i===\"editor\"?B.accentInk:B.ink,background:i===\"editor\"?B.accent:\"transparent\"},children:[(0,n.jsx)(Ha,{size:13}),T.navEditor]}),(0,n.jsxs)(\"button\",{onClick:()=>d(\"planner\"),className:\"flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors\",style:{borderRadius:R.radiusSm,color:i===\"planner\"?B.accentInk:B.ink,background:i===\"planner\"?B.accent:\"transparent\"},children:[(0,n.jsx)(Mt,{size:13}),T.navPlanner]})]})]}),(0,n.jsx)(\"div\",{className:\"educraft-hero-in pt-8\",children:i===\"library\"?(0,n.jsx)(Tx,{lang:r,ui:T,theme:B,dir:V,onOpen:Ee,skin:R,covers:C,onChangeCover:$,onClearCover:mt,books:p,collections:E,libraryPath:_,onEnterCollection:Wp,onCrumb:qp,onCreateCollection:Ke,onDeleteCollection:qn,onAssignToCollection:sl,onRemoveFromCollection:_n,onExportBook:e?O=>e(O,r,B,T,R,C):void 0,onExportCollection:t?O=>t(O,p,E,r,B,T,R,C):void 0}):i===\"tree\"?(0,n.jsx)(fp,{book:K,lang:r,ui:T,theme:B,dir:V,onBack:()=>d(\"library\"),skin:R,selectedLeaf:k,onSelectLeaf:G,onBrowse:()=>d(\"browse\"),onPlanner:()=>d(\"planner\"),onExport:e?()=>e(K,r,B,T,R,C):void 0,covers:C,onChangeCover:$,onClearCover:mt},K.id):i===\"browse\"?(0,n.jsx)(Px,{book:K,lang:r,ui:T,theme:B,dir:V,skin:R,onBack:()=>d(\"tree\")},K.id):i===\"editor\"?(0,n.jsx)(Jx,{book:K,lang:r,theme:B,skin:R,voiceEnabled:et,onVoiceEnabledChange:pt,onUpdateBook:ge},K.id):i===\"planner\"?(0,n.jsx)(e1,{book:K,lang:r,ui:T,theme:B,dir:V,skin:R,plan:Po,onUpdatePlan:zt},K.id):Y?(0,n.jsx)(Ax,{node:Y,book:K,lang:r,ui:T,theme:B,dir:V,skin:R,cardMode:h,scrollDir:F,onBack:()=>d(\"tree\")},Y.id):(0,n.jsx)(fp,{book:K,lang:r,ui:T,theme:B,dir:V,onBack:()=>d(\"library\"),skin:R,selectedLeaf:k,onSelectLeaf:G,onBrowse:()=>d(\"browse\"),onPlanner:()=>d(\"planner\"),onExport:e?()=>e(K,r,B,T,R,C):void 0,covers:C,onChangeCover:$,onClearCover:mt},K.id)})]}),q&&(0,n.jsx)(Nx,{ui:T,theme:B,dir:V,skinId:I,onSkinChange:x,flavorId:c,onFlavorChange:m,mode:s,cardMode:h,onCardModeChange:L,scrollDir:F,onScrollDirChange:b,voiceEnabled:et,onVoiceEnabledChange:pt,onClose:()=>Ne(!1),onReset:La})]})}var Up=Ut(ol(),1),t1=document.getElementById(\"root\"),a1=(0,zp.createRoot)(t1);a1.render((0,Up.jsx)(yi,{}));})();\n/*! Bundled license information:\n\nreact/cjs/react.production.min.js:\n  (**\n   * @license React\n   * react.production.min.js\n   *\n   * Copyright (c) Facebook, Inc. and its affiliates.\n   *\n   * This source code is licensed under the MIT license found in the\n   * LICENSE file in the root directory of this source tree.\n   *)\n\nscheduler/cjs/scheduler.production.min.js:\n  (**\n   * @license React\n   * scheduler.production.min.js\n   *\n   * Copyright (c) Facebook, Inc. and its affiliates.\n   *\n   * This source code is licensed under the MIT license found in the\n   * LICENSE file in the root directory of this source tree.\n   *)\n\nreact-dom/cjs/react-dom.production.min.js:\n  (**\n   * @license React\n   * react-dom.production.min.js\n   *\n   * Copyright (c) Facebook, Inc. and its affiliates.\n   *\n   * This source code is licensed under the MIT license found in the\n   * LICENSE file in the root directory of this source tree.\n   *)\n\nreact/cjs/react-jsx-runtime.production.min.js:\n  (**\n   * @license React\n   * react-jsx-runtime.production.min.js\n   *\n   * Copyright (c) Facebook, Inc. and its affiliates.\n   *\n   * This source code is licensed under the MIT license found in the\n   * LICENSE file in the root directory of this source tree.\n   *)\n\nlucide-react/dist/esm/shared/src/utils.js:\nlucide-react/dist/esm/defaultAttributes.js:\nlucide-react/dist/esm/Icon.js:\nlucide-react/dist/esm/createLucideIcon.js:\nlucide-react/dist/esm/icons/arrow-down.js:\nlucide-react/dist/esm/icons/arrow-left-right.js:\nlucide-react/dist/esm/icons/arrow-left.js:\nlucide-react/dist/esm/icons/arrow-right.js:\nlucide-react/dist/esm/icons/arrow-up.js:\nlucide-react/dist/esm/icons/blocks.js:\nlucide-react/dist/esm/icons/book-copy.js:\nlucide-react/dist/esm/icons/book-open.js:\nlucide-react/dist/esm/icons/calendar-days.js:\nlucide-react/dist/esm/icons/check.js:\nlucide-react/dist/esm/icons/chevron-left.js:\nlucide-react/dist/esm/icons/chevron-right.js:\nlucide-react/dist/esm/icons/circle-alert.js:\nlucide-react/dist/esm/icons/circle-dot.js:\nlucide-react/dist/esm/icons/code-xml.js:\nlucide-react/dist/esm/icons/columns-3.js:\nlucide-react/dist/esm/icons/corner-down-left.js:\nlucide-react/dist/esm/icons/file-down.js:\nlucide-react/dist/esm/icons/file-up.js:\nlucide-react/dist/esm/icons/flame.js:\nlucide-react/dist/esm/icons/folder-open.js:\nlucide-react/dist/esm/icons/folder-plus.js:\nlucide-react/dist/esm/icons/git-branch.js:\nlucide-react/dist/esm/icons/grid-3x3.js:\nlucide-react/dist/esm/icons/hash.js:\nlucide-react/dist/esm/icons/heading-2.js:\nlucide-react/dist/esm/icons/image-plus.js:\nlucide-react/dist/esm/icons/languages.js:\nlucide-react/dist/esm/icons/layers.js:\nlucide-react/dist/esm/icons/layout-grid.js:\nlucide-react/dist/esm/icons/layout-list.js:\nlucide-react/dist/esm/icons/library.js:\nlucide-react/dist/esm/icons/list-checks.js:\nlucide-react/dist/esm/icons/list-filter.js:\nlucide-react/dist/esm/icons/list-ordered.js:\nlucide-react/dist/esm/icons/maximize-2.js:\nlucide-react/dist/esm/icons/minus.js:\nlucide-react/dist/esm/icons/moon.js:\nlucide-react/dist/esm/icons/palette.js:\nlucide-react/dist/esm/icons/pen-line.js:\nlucide-react/dist/esm/icons/pencil.js:\nlucide-react/dist/esm/icons/plus.js:\nlucide-react/dist/esm/icons/rotate-ccw.js:\nlucide-react/dist/esm/icons/rows-3.js:\nlucide-react/dist/esm/icons/settings.js:\nlucide-react/dist/esm/icons/sliders-horizontal.js:\nlucide-react/dist/esm/icons/sparkles.js:\nlucide-react/dist/esm/icons/square-check-big.js:\nlucide-react/dist/esm/icons/star.js:\nlucide-react/dist/esm/icons/sticky-note.js:\nlucide-react/dist/esm/icons/sun.js:\nlucide-react/dist/esm/icons/tag.js:\nlucide-react/dist/esm/icons/target.js:\nlucide-react/dist/esm/icons/text-cursor-input.js:\nlucide-react/dist/esm/icons/toggle-left.js:\nlucide-react/dist/esm/icons/trash-2.js:\nlucide-react/dist/esm/icons/trending-down.js:\nlucide-react/dist/esm/icons/trending-up.js:\nlucide-react/dist/esm/icons/triangle-alert.js:\nlucide-react/dist/esm/icons/trophy.js:\nlucide-react/dist/esm/icons/type.js:\nlucide-react/dist/esm/icons/wand-sparkles.js:\nlucide-react/dist/esm/icons/x.js:\nlucide-react/dist/esm/icons/zoom-in.js:\nlucide-react/dist/esm/icons/zoom-out.js:\nlucide-react/dist/esm/lucide-react.js:\n  (**\n   * @license lucide-react v0.383.0 - ISC\n   *\n   * This source code is licensed under the ISC license.\n   * See the LICENSE file in the root directory of this source tree.\n   *)\n*/\n";
const EDUCRAFT_EXPORT_TAILWIND_CSS = "*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/*! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:\"\"}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.container{width:100%}@media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}@media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}@media (min-width:1536px){.container{max-width:1536px}}.pointer-events-none{pointer-events:none}.visible{visibility:visible}.invisible{visibility:hidden}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:0}.right-0{right:0}.top-0{top:0}.isolate{isolation:isolate}.z-10{z-index:10}.z-50{z-index:50}.order-1{order:1}.order-2{order:2}.mx-0\\.5{margin-left:.125rem;margin-right:.125rem}.mx-1{margin-left:.25rem;margin-right:.25rem}.mx-auto{margin-left:auto;margin-right:auto}.my-1\\.5{margin-top:.375rem;margin-bottom:.375rem}.-mt-0\\.5{margin-top:-.125rem}.-mt-1{margin-top:-.25rem}.mb-0\\.5{margin-bottom:.125rem}.mb-1{margin-bottom:.25rem}.mb-1\\.5{margin-bottom:.375rem}.mb-2{margin-bottom:.5rem}.mb-2\\.5{margin-bottom:.625rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mb-6{margin-bottom:1.5rem}.me-1{margin-inline-end:.25rem}.ms-auto{margin-inline-start:auto}.mt-0\\.5{margin-top:.125rem}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.block{display:block}.inline-block{display:inline-block}.inline{display:inline}.flex{display:flex}.grid{display:grid}.contents{display:contents}.hidden{display:none}.aspect-square{aspect-ratio:1/1}.h-4{height:1rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-7{height:1.75rem}.h-full{height:100%}.max-h-40{max-height:10rem}.max-h-\\[40vh\\]{max-height:40vh}.max-h-\\[85vh\\]{max-height:85vh}.min-h-\\[100px\\]{min-height:100px}.min-h-\\[52px\\]{min-height:52px}.min-h-screen{min-height:100vh}.w-24{width:6rem}.w-32{width:8rem}.w-4{width:1rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-7{width:1.75rem}.w-full{width:100%}.w-max{width:-moz-max-content;width:max-content}.w-px{width:1px}.min-w-0{min-width:0}.min-w-\\[80px\\]{min-width:80px}.min-w-full{min-width:100%}.max-w-5xl{max-width:64rem}.max-w-lg{max-width:32rem}.max-w-md{max-width:28rem}.max-w-xl{max-width:36rem}.flex-1{flex:1 1 0%}.flex-shrink-0,.shrink-0{flex-shrink:0}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.resize-none{resize:none}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.grid-cols-7{grid-template-columns:repeat(7,minmax(0,1fr))}.grid-cols-8{grid-template-columns:repeat(8,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.place-items-center{place-items:center}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.items-stretch{align-items:stretch}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-0\\.5{gap:.125rem}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-2\\.5{gap:.625rem}.gap-3{gap:.75rem}.gap-3\\.5{gap:.875rem}.gap-4{gap:1rem}.gap-5{gap:1.25rem}.gap-6{gap:1.5rem}.self-start{align-self:flex-start}.self-stretch{align-self:stretch}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;text-overflow:ellipsis}.truncate,.whitespace-nowrap{white-space:nowrap}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.border{border-width:1px}.border-2{border-width:2px}.border-dashed{border-style:dashed}.border-current{border-color:currentColor}.p-1\\.5{padding:.375rem}.p-2{padding:.5rem}.p-2\\.5{padding:.625rem}.p-3{padding:.75rem}.p-3\\.5{padding:.875rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.px-1{padding-left:.25rem;padding-right:.25rem}.px-1\\.5{padding-left:.375rem;padding-right:.375rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-3\\.5{padding-left:.875rem;padding-right:.875rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.py-0\\.5{padding-top:.125rem;padding-bottom:.125rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-3\\.5{padding-top:.875rem;padding-bottom:.875rem}.pb-1{padding-bottom:.25rem}.pb-16{padding-bottom:4rem}.pb-4{padding-bottom:1rem}.pb-8{padding-bottom:2rem}.ps-2{padding-inline-start:.5rem}.ps-3{padding-inline-start:.75rem}.pt-1{padding-top:.25rem}.pt-4{padding-top:1rem}.pt-5{padding-top:1.25rem}.pt-8{padding-top:2rem}.text-center{text-align:center}.text-start{text-align:start}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-\\[0\\.65rem\\]{font-size:.65rem}.text-\\[0\\.68rem\\]{font-size:.68rem}.text-\\[0\\.7rem\\]{font-size:.7rem}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[9px\\]{font-size:9px}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.leading-loose{line-height:2}.leading-none{line-height:1}.leading-relaxed{line-height:1.625}.leading-snug{line-height:1.375}.leading-tight{line-height:1.25}.tracking-wide{letter-spacing:.025em}.tracking-wider{letter-spacing:.05em}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.line-through{text-decoration-line:line-through}.opacity-0{opacity:0}.opacity-60{opacity:.6}.opacity-70{opacity:.7}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.outline{outline-style:solid}.blur{--tw-blur:blur(8px)}.blur,.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.focus-within\\:opacity-100:focus-within{opacity:1}.hover\\:underline:hover{text-decoration-line:underline}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-20:disabled{opacity:.2}.disabled\\:opacity-30:disabled{opacity:.3}.disabled\\:opacity-40:disabled{opacity:.4}.group:hover .group-hover\\:grid{display:grid}.group\\/cover:hover .group-hover\\/cover\\:opacity-100{opacity:1}@media (min-width:640px){.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.sm\\:flex-row{flex-direction:row}.sm\\:p-3\\.5{padding:.875rem}.sm\\:p-5{padding:1.25rem}.sm\\:p-6{padding:1.5rem}.sm\\:p-8{padding:2rem}.sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}.sm\\:px-8{padding-left:2rem;padding-right:2rem}.sm\\:pt-6{padding-top:1.5rem}.sm\\:text-3xl{font-size:1.875rem;line-height:2.25rem}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}@media (min-width:768px){.md\\:flex{display:flex}.md\\:hidden{display:none}.md\\:grid-cols-\\[200px_1fr\\]{grid-template-columns:200px 1fr}}@media (min-width:1024px){.lg\\:max-h-\\[70vh\\]{max-height:70vh}.lg\\:grid-cols-\\[1fr_260px\\]{grid-template-columns:1fr 260px}}";

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
  const seed = {
    id: book.id,
    startBookId: book.id,
    books: [book],
    collections: [],
    lang,
    skinId: skinIdOf(skin),
    flavorId: flavorIdOf(theme),
    covers: covers[book.id] ? { [book.id]: covers[book.id] } : {},
  };
  const favicon = faviconDataUri(book.cover, book[lang].title);
  const html = buildExportHTML({ title: book[lang].title, favicon, lang, dir: ui.dir, seed });
  downloadHTMLFile(`${slugify(book[lang].title)}.html`, html);
}

function downloadCollectionHTML(collection, books, collections, lang, theme, ui, skin, covers) {
  covers = covers || {};
  const subtree = resolveCollectionSubtree(collection, collections || []);
  const flatBooks = resolveCollectionBooks(collection, collections || [], books);
  const seedCovers = {};
  flatBooks.forEach((b) => {
    if (covers[b.id]) seedCovers[b.id] = covers[b.id];
  });
  const seed = {
    id: collection.id,
    startBookId: flatBooks[0] ? flatBooks[0].id : null,
    books: flatBooks,
    collections: subtree,
    lang,
    skinId: skinIdOf(skin),
    flavorId: flavorIdOf(theme),
    covers: seedCovers,
  };
  const favicon = faviconDataUri({ from: flatBooks[0]?.cover?.from, to: flatBooks[0]?.cover?.to }, collection.title);
  const html = buildExportHTML({ title: collection.title, favicon, lang, dir: ui.dir, seed });
  downloadHTMLFile(`${slugify(collection.title)}.html`, html);
}

export default function EDUcraft() {
  return <EDUcraftApp onExportBook={downloadBookHTML} onExportCollection={downloadCollectionHTML} />;
}
