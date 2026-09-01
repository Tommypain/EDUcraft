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
} from "lucide-react";

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
function groupLeavesByBranch(book) {
  const leaves = book.nodes.filter((n) => n.level === "leaf");
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

/* =================================================================
   buildBookExportHTML — serializes one book (all leaves/cards/
   questions, code boxes, images) plus its own to-do list + activity
   calendar into a single self-contained offline HTML file. No React,
   no build step: a small vanilla-JS runtime re-implements just
   enough of the reader + planner to study and check answers, saving
   its own progress to localStorage (scoped to this exported file)
   with its own reset button and a light/dark toggle.
================================================================== */
function buildBookExportHTML({ book, lang, theme, ui }) {
  const flavorId = Object.keys(FLAVORS).find((k) => FLAVORS[k].light === theme || FLAVORS[k].dark === theme) || "normal";
  const flavor = FLAVORS[flavorId];
  const title = book[lang].title;
  const tagline = book[lang].tagline;
  const groups = groupLeavesByBranch(book).map(({ branch, leaves }) => ({
    branchTitle: branch[lang],
    leaves: leaves.map((leaf) => ({
      id: leaf.id,
      title: leaf[lang],
      cards: leafCards(leaf).map((card) => ({
        image: card.image || null,
        imagePosition: card.imagePosition || "top",
        questions: card.questions.map((q) => ({
          type: q.type,
          subject: q.subject || "",
          difficulty: (DIFF[lang] && DIFF[lang][q.difficulty]) || q.difficulty || "",
          code: q.code && q.code.enabled ? { lang: q.code.lang || "", src: q.code.src || "" } : null,
          d: q[lang] || {},
        })),
      })),
    })),
  }));
  const totalLeaves = book.nodes.filter((n) => n.level === "leaf").length;
  const dataJson = JSON.stringify({ id: book.id, title, tagline, totalLeaves, groups, lang, dir: ui.dir, cover: book.cover }).replace(/</g, "\\u003c");
  const favicon = faviconDataUri(book.cover, title);
  const L = flavor.light;
  const D = flavor.dark;
  const csp = `
    :root{ --canvas:${L.canvas}; --header:${L.header}; --surface:${L.surface}; --surfaceSoft:${L.surfaceSoft}; --ink:${L.ink}; --inkSoft:${L.inkSoft}; --hairline:${L.hairline}; --accent:${L.accent}; --accentInk:${L.accentInk}; --accentSoft:${L.accentSoft}; }
    html[data-mode="dark"]{ --canvas:${D.canvas}; --header:${D.header}; --surface:${D.surface}; --surfaceSoft:${D.surfaceSoft}; --ink:${D.ink}; --inkSoft:${D.inkSoft}; --hairline:${D.hairline}; --accent:${D.accent}; --accentInk:${D.accentInk}; --accentSoft:${D.accentSoft}; }
  `;
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${ui.dir}" data-mode="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="icon" href="${favicon}">
<style>
${csp}
*{box-sizing:border-box;}
body{margin:0;background:var(--canvas);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Tahoma,Arial,sans-serif;transition:background .2s,color .2s;}
.wrap{max-width:840px;margin:0 auto;padding:20px 18px 64px;}
header.top{display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--header);border-radius:20px;padding:14px 18px;margin-bottom:22px;flex-wrap:wrap;}
header.top h1{font-size:16px;margin:0;}
.tabs{display:flex;gap:6px;}
.tab-btn{border:none;background:transparent;color:var(--ink);font-weight:700;font-size:13px;padding:8px 12px;border-radius:999px;cursor:pointer;}
.tab-btn.active{background:var(--accent);color:var(--accentInk);}
.iconbtn{border:1px solid var(--hairline);background:transparent;color:var(--ink);border-radius:10px;padding:8px;cursor:pointer;font-size:13px;}
h1.title{font-size:26px;margin:0 0 2px;}
.tagline{color:var(--inkSoft);font-size:14px;margin:0 0 22px;}
.panel{background:var(--surface);border:1px solid var(--hairline);border-radius:20px;padding:18px 20px;margin-bottom:16px;}
.panel.soft{background:var(--surfaceSoft);}
.branch-label{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:var(--inkSoft);margin:22px 0 8px;}
.leaf-title{font-size:16px;font-weight:800;margin:0 0 10px;display:flex;align-items:center;gap:8px;}
.card{border:1px solid var(--hairline);border-radius:16px;padding:14px;margin-bottom:12px;}
.card img{width:100%;border-radius:12px;margin-bottom:10px;display:block;}
pre.codebox{background:#161616;color:#e6e6e6;border-radius:12px;padding:12px 14px;overflow-x:auto;font-size:12.5px;margin:0 0 12px;}
pre.codebox .lang{display:block;color:#9a9a9a;font-size:10px;text-transform:uppercase;margin-bottom:6px;}
.q{margin-bottom:14px;}
.q:last-child{margin-bottom:0;}
.q .prompt{font-weight:700;font-size:14px;margin-bottom:8px;}
.q .meta{font-size:10.5px;color:var(--inkSoft);font-weight:700;text-transform:uppercase;margin-bottom:6px;}
.opt{display:block;width:100%;text-align:start;border:1.5px solid var(--hairline);background:transparent;color:var(--ink);border-radius:10px;padding:8px 12px;margin-bottom:6px;cursor:pointer;font-size:13.5px;}
.opt.sel{border-color:var(--accent);background:var(--accentSoft);}
input[type=text],textarea{width:100%;border:1.5px solid var(--hairline);background:var(--surface);color:var(--ink);border-radius:10px;padding:8px 12px;font-size:13.5px;font-family:inherit;}
textarea{min-height:70px;resize:vertical;}
.checkbtn{border:none;background:var(--ink);color:var(--canvas);font-weight:700;font-size:12.5px;padding:7px 14px;border-radius:999px;cursor:pointer;margin-top:4px;}
.feedback{font-size:12.5px;font-weight:700;margin-top:6px;}
.feedback.ok{color:#0B7A3E;}
.feedback.no{color:#B33A1E;}
.todo-row{display:flex;align-items:center;gap:10px;border:1.5px solid var(--hairline);border-radius:12px;padding:10px 12px;margin-bottom:6px;cursor:pointer;}
.todo-row.done{border-color:var(--accent);background:var(--accentSoft);}
.todo-row .box{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--inkSoft);flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.todo-row.done .box{background:var(--accent);border-color:var(--accent);color:var(--accentInk);}
.todo-row .lbl{flex:1;font-size:13.5px;font-weight:600;}
.todo-row.done .lbl{text-decoration:line-through;opacity:.6;}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;margin-bottom:16px;}
.stat{background:var(--surfaceSoft);border-radius:14px;padding:12px;}
.stat .l{font-size:10px;font-weight:900;text-transform:uppercase;color:var(--inkSoft);margin-bottom:4px;}
.stat .v{font-size:22px;font-weight:900;}
.cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-bottom:5px;}
.cal-cell{aspect-ratio:1;border-radius:8px;border:1px solid var(--hairline);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
.goal-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;}
.field{display:flex;flex-direction:column;gap:5px;font-size:11px;font-weight:700;color:var(--inkSoft);}
.field input{padding:8px 10px;border-radius:10px;border:1.5px solid var(--hairline);background:var(--surface);color:var(--ink);font-size:13px;font-family:inherit;}
.status-banner{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:16px;margin-bottom:16px;font-weight:800;font-size:13.5px;}
.hidden{display:none !important;}
footer.foot{text-align:center;color:var(--inkSoft);font-size:11px;margin-top:30px;}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>${title}</h1>
    <div class="tabs">
      <button class="tab-btn active" data-tab="book">📖</button>
      <button class="tab-btn" data-tab="planner">🗓️</button>
    </div>
    <div style="display:flex;gap:6px;">
      <button class="iconbtn" id="modeBtn">☾</button>
      <button class="iconbtn" id="resetBtn">↺</button>
    </div>
  </header>

  <section id="view-book">
    <h1 class="title">${title}</h1>
    <p class="tagline">${tagline}</p>
    <div id="bookContent"></div>
  </section>

  <section id="view-planner" class="hidden">
    <h1 class="title">${ui.plannerTitle}</h1>
    <p class="tagline">${ui.plannerSub}</p>
    <div class="panel" id="goalPanel"></div>
    <div class="status-banner" id="statusBanner"></div>
    <div class="stat-grid" id="statGrid"></div>
    <div class="panel">
      <div class="cal-head">
        <strong>${ui.plannerCalendarTitle}</strong>
        <div>
          <button class="iconbtn" id="calPrev">‹</button>
          <span id="calLabel" style="font-size:12px;font-weight:700;margin:0 6px;"></span>
          <button class="iconbtn" id="calNext">›</button>
        </div>
      </div>
      <div class="cal-grid" id="calHead"></div>
      <div id="calBody"></div>
    </div>
    <div class="panel">
      <strong style="display:block;margin-bottom:10px;">${ui.plannerTodoTitle}</strong>
      <div id="todoList"></div>
    </div>
  </section>

  <footer class="foot">${title} · EDUcraft export</footer>
</div>

<script>
const DATA = ${dataJson};
const STORE_KEY = "educraft-export-" + DATA.id;
const LOC = DATA.lang === "ar" ? "ar-EG" : "en-US";
const STR = ${JSON.stringify({
    plannerGoalDateLabel: ui.plannerGoalDateLabel,
    plannerGoalCountLabel: ui.plannerGoalCountLabel,
    plannerSetGoal: ui.plannerSetGoal,
    plannerEditGoal: ui.plannerEditGoal,
    plannerClearGoal: ui.plannerClearGoal,
    plannerTargetLabel: ui.plannerTargetLabel,
    plannerLeavesUnit: ui.plannerLeavesUnit,
    plannerStatusAhead: ui.plannerStatusAhead,
    plannerStatusOnTrack: ui.plannerStatusOnTrack,
    plannerStatusBehind: ui.plannerStatusBehind,
    plannerStatusNoGoal: ui.plannerStatusNoGoal,
    plannerStatusDone: ui.plannerStatusDone,
    plannerDaysLeft: ui.plannerDaysLeft,
    plannerRequiredPace: ui.plannerRequiredPace,
    plannerActualPace: ui.plannerActualPace,
    plannerStreakLabel: ui.plannerStreakLabel,
    plannerCompletionLabel: ui.plannerCompletionLabel,
    plannerAllDone: ui.plannerAllDone,
    settingsResetConfirm: ui.settingsResetConfirm,
    checkAnswer: lang === "ar" ? "تأكد من الإجابة" : "Check answer",
    correctMsg: ui.correctMsg,
    incorrectMsg: ui.incorrectMsg,
    selfGraded: ui.selfGraded,
    modelAnswer: lang === "ar" ? "إجابة نموذجية" : "Model answer",
  })};

function todayStr(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function fromDateStr(s){ const p=s.split("-").map(Number); return new Date(p[0],p[1]-1,p[2]); }
function toDateStr(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function daysBetween(a,b){ return Math.round((fromDateStr(b)-fromDateStr(a))/86400000); }
function esc(s){ return (s==null?"":String(s)).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

function loadState(){
  try { return Object.assign({ mode:"light", targetCount:null, targetDate:null, startDate:null, doneLeafIds:[], log:{} }, JSON.parse(localStorage.getItem(STORE_KEY)) || {}); }
  catch(e){ return { mode:"light", targetCount:null, targetDate:null, startDate:null, doneLeafIds:[], log:{} }; }
}
let state = loadState();
function save(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }catch(e){} }

document.documentElement.setAttribute("data-mode", state.mode || "light");
document.getElementById("modeBtn").textContent = state.mode === "dark" ? "☀" : "☾";
document.getElementById("modeBtn").onclick = function(){
  state.mode = state.mode === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-mode", state.mode);
  document.getElementById("modeBtn").textContent = state.mode === "dark" ? "☀" : "☾";
  save();
};
document.getElementById("resetBtn").onclick = function(){
  if (!confirm(STR.settingsResetConfirm)) return;
  localStorage.removeItem(STORE_KEY);
  location.reload();
};

document.querySelectorAll(".tab-btn").forEach(function(b){ b.onclick = function(){
  document.querySelectorAll(".tab-btn").forEach(function(x){ x.classList.remove("active"); });
  b.classList.add("active");
  document.getElementById("view-book").classList.toggle("hidden", b.dataset.tab !== "book");
  document.getElementById("view-planner").classList.toggle("hidden", b.dataset.tab !== "planner");
  if (b.dataset.tab === "planner") renderPlanner();
}; });

function isCorrect(q, given){
  const d = q.d;
  switch(q.type){
    case "single": return given === d.correct;
    case "multi": return Array.isArray(given) && given.length===d.correct.length && given.every(function(i){ return d.correct.includes(i); });
    case "tf": return given === d.correct;
    case "short": return (d.accepted||[]).some(function(a){ return (given||"").trim().toLowerCase() === a.trim().toLowerCase(); });
    case "fill": return Array.isArray(given) && (d.blanks||[]).every(function(b,i){ return (given[i]||"").trim().toLowerCase()===b.trim().toLowerCase(); });
    case "cloze": return (given||"").trim().toLowerCase() === (d.correct||"").trim().toLowerCase();
    case "numeric": return Math.abs(Number(given)-Number(d.correct)) <= (d.tolerance||0);
    case "slider": return Math.abs(Number(given)-Number(d.correct)) <= (d.tolerance||0);
    default: return null;
  }
}

const QMAP = {};
let qCounter = 0;
function renderQuestion(q, qid){
  const d = q.d;
  let html = '<div class="q" data-qid="'+qid+'">';
  if (q.code) html += '<pre class="codebox"><span class="lang">'+esc(q.code.lang)+'</span>'+esc(q.code.src)+'</pre>';
  html += '<div class="meta">'+esc(q.subject)+' · '+esc(q.difficulty)+'</div>';
  html += '<div class="prompt">'+esc(d.prompt || d.template || "")+'</div>';

  if (q.type==="single" || q.type==="multi"){
    (d.options||[]).forEach(function(opt,i){ html += '<button type="button" class="opt" data-i="'+i+'" onclick="optClick(this,\\''+q.type+'\\')">'+esc(opt)+'</button>'; });
    html += '<div><button class="checkbtn" onclick="checkOpt(this,\\''+qid+'\\')">'+STR.checkAnswer+'</button><div class="feedback"></div></div>';
  } else if (q.type==="tf"){
    html += '<button type="button" class="opt" data-v="true" onclick="optClick(this,\\'tf\\')">True</button>';
    html += '<button type="button" class="opt" data-v="false" onclick="optClick(this,\\'tf\\')">False</button>';
    html += '<div><button class="checkbtn" onclick="checkOpt(this,\\''+qid+'\\')">'+STR.checkAnswer+'</button><div class="feedback"></div></div>';
  } else if (q.type==="short"){
    html += '<input type="text" class="shortin">';
    html += '<div><button class="checkbtn" onclick="checkShort(this,\\''+qid+'\\')">'+STR.checkAnswer+'</button><div class="feedback"></div></div>';
  } else if (q.type==="fill"){
    const parts = (d.template||"").split("___");
    html += '<div style="line-height:2.1;">';
    parts.forEach(function(p,i){ html += esc(p); if(i<parts.length-1) html += '<input type="text" class="blankin" data-i="'+i+'" style="width:110px;display:inline-block;margin:0 4px;padding:3px 8px;border-radius:8px;border:1.5px solid var(--hairline);background:var(--surface);color:var(--ink);">'; });
    html += '</div>';
    html += '<div><button class="checkbtn" onclick="checkFill(this,\\''+qid+'\\')">'+STR.checkAnswer+'</button><div class="feedback"></div></div>';
  } else if (q.type==="cloze"){
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">'+(d.bank||[]).map(function(w){ return '<span class="opt" style="display:inline-block;width:auto;cursor:default;">'+esc(w)+'</span>'; }).join("")+'</div>';
    html += '<input type="text" class="clozein" placeholder="'+esc((d.bank||[]).join(" / "))+'">';
    html += '<div><button class="checkbtn" onclick="checkCloze(this,\\''+qid+'\\')">'+STR.checkAnswer+'</button><div class="feedback"></div></div>';
  } else if (q.type==="order"){
    html += '<ol style="padding-inline-start:20px;">'+(d.items||[]).map(function(it){ return '<li>'+esc(it)+'</li>'; }).join("")+'</ol>';
    html += '<div class="feedback ok" style="display:block;">'+ (d.correct||[]).join(" → ") +'</div>';
  } else if (q.type==="sort"){
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">'+(d.items||[]).map(function(it){ return '<span class="opt" style="display:inline-block;width:auto;cursor:default;">'+esc(it[0])+' → '+esc(it[1])+'</span>'; }).join("")+'</div>';
  } else if (q.type==="match"){
    html += '<ul style="padding-inline-start:20px;">'+(d.left||[]).map(function(l,i){ return '<li>'+esc(l)+' — '+esc(d.right[d.correct[i]])+'</li>'; }).join("")+'</ul>';
  } else if (q.type==="numeric" || q.type==="slider"){
    html += '<input type="text" class="numin" placeholder="'+ (q.type==="slider" ? (d.min+" – "+d.max) : "") +'">';
    html += '<div><button class="checkbtn" onclick="checkNumeric(this,\\''+qid+'\\')">'+STR.checkAnswer+'</button><div class="feedback"></div></div>';
  } else if (q.type==="essay"){
    html += '<textarea placeholder="'+STR.selfGraded+'"></textarea>';
    if (d.model) html += '<details style="margin-top:8px;font-size:12.5px;color:var(--inkSoft);"><summary style="cursor:pointer;font-weight:700;">'+STR.modelAnswer+'</summary>'+esc(d.model)+'</details>';
  } else if (q.type==="rating"){
    html += '<div style="display:flex;gap:6px;">'+[1,2,3,4,5].map(function(n){ return '<button type="button" class="opt" style="width:auto;" onclick="this.parentElement.querySelectorAll(\\'.opt\\').forEach(function(x){x.classList.remove(\\'sel\\');});this.classList.add(\\'sel\\')">'+n+'</button>'; }).join("")+'</div>';
  }
  html += '</div>';
  return html;
}
function feedbackEl(btn){ return btn.parentElement.querySelector(".feedback"); }
function showFeedback(btn, ok){
  const f = feedbackEl(btn);
  f.textContent = ok ? STR.correctMsg : STR.incorrectMsg;
  f.className = "feedback " + (ok ? "ok" : "no");
}
window.optClick = function(el, type){
  const group = el.parentElement;
  if (type==="single" || type==="tf") group.querySelectorAll(".opt").forEach(function(o){ o.classList.remove("sel"); });
  el.classList.toggle("sel");
};
window.checkOpt = function(btn, qid){
  const card = document.querySelector('[data-qid="'+qid+'"]');
  const q = QMAP[qid];
  let given;
  if (q.type==="tf") given = card.querySelector(".opt.sel") ? card.querySelector(".opt.sel").dataset.v === "true" : null;
  else if (q.type==="multi") given = Array.from(card.querySelectorAll(".opt.sel")).map(function(o){ return Number(o.dataset.i); });
  else given = card.querySelector(".opt.sel") ? Number(card.querySelector(".opt.sel").dataset.i) : null;
  showFeedback(btn, isCorrect(q, given));
};
window.checkShort = function(btn, qid){ const card=document.querySelector('[data-qid="'+qid+'"]'); showFeedback(btn, isCorrect(QMAP[qid], card.querySelector(".shortin").value)); };
window.checkFill = function(btn, qid){ const card=document.querySelector('[data-qid="'+qid+'"]'); const vals=Array.from(card.querySelectorAll(".blankin")).map(function(i){ return i.value; }); showFeedback(btn, isCorrect(QMAP[qid], vals)); };
window.checkCloze = function(btn, qid){ const card=document.querySelector('[data-qid="'+qid+'"]'); showFeedback(btn, isCorrect(QMAP[qid], card.querySelector(".clozein").value)); };
window.checkNumeric = function(btn, qid){ const card=document.querySelector('[data-qid="'+qid+'"]'); showFeedback(btn, isCorrect(QMAP[qid], card.querySelector(".numin").value)); };

function renderBook(){
  let out = "";
  DATA.groups.forEach(function(g){
    out += '<div class="branch-label">'+esc(g.branchTitle)+'</div>';
    g.leaves.forEach(function(leaf){
      out += '<div class="panel">';
      out += '<div class="leaf-title">'+esc(leaf.title)+'</div>';
      leaf.cards.forEach(function(card){
        out += '<div class="card">';
        if (card.image) out += '<img src="'+card.image+'" alt="">';
        card.questions.forEach(function(q){
          const qid = "q"+(qCounter++);
          QMAP[qid] = q;
          out += renderQuestion(q, qid);
        });
        out += '</div>';
      });
      out += '</div>';
    });
  });
  document.getElementById("bookContent").innerHTML = out;
}
renderBook();

/* ---- planner ---- */
let calCursor = new Date();
calCursor.setDate(1);
let editingGoal = false;
function renderGoalPanel(){
  const has = !!state.targetDate;
  const el = document.getElementById("goalPanel");
  if (!has || editingGoal){
    el.innerHTML =
      '<div class="goal-row">' +
        '<label class="field">'+STR.plannerGoalDateLabel+'<input type="date" id="gDate" min="'+todayStr()+'" value="'+(state.targetDate||"")+'"></label>' +
        '<label class="field">'+STR.plannerGoalCountLabel+' /'+DATA.totalLeaves+'<input type="number" id="gCount" min="1" max="'+DATA.totalLeaves+'" value="'+(state.targetCount||DATA.totalLeaves)+'"></label>' +
        '<button class="checkbtn" id="gSave">'+STR.plannerSetGoal+'</button>' +
      '</div>';
    document.getElementById("gSave").onclick = function(){
      const dv = document.getElementById("gDate").value;
      if (!dv) return;
      state.targetDate = dv;
      state.targetCount = Math.max(1, Math.min(DATA.totalLeaves, Number(document.getElementById("gCount").value)||DATA.totalLeaves));
      state.startDate = state.startDate || todayStr();
      editingGoal = false;
      save(); renderPlanner();
    };
  } else {
    el.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">' +
        '<div><div style="font-size:11px;font-weight:900;color:var(--inkSoft);text-transform:uppercase;margin-bottom:3px;">'+STR.plannerTargetLabel+'</div>' +
        '<div style="font-size:16px;font-weight:800;">'+state.targetCount+' '+STR.plannerLeavesUnit+' '+fromDateStr(state.targetDate).toLocaleDateString(LOC,{day:"numeric",month:"long",year:"numeric"})+'</div></div>' +
        '<div><button class="iconbtn" id="gEdit">'+STR.plannerEditGoal+'</button> <button class="iconbtn" id="gClear">'+STR.plannerClearGoal+'</button></div>' +
      '</div>';
    document.getElementById("gEdit").onclick = function(){ editingGoal = true; renderGoalPanel(); };
    document.getElementById("gClear").onclick = function(){ state.targetDate=null; state.targetCount=null; state.startDate=null; editingGoal=false; save(); renderPlanner(); };
  }
}
function buildMonthMatrixJS(cursor){
  const year=cursor.getFullYear(), month=cursor.getMonth();
  const first=new Date(year,month,1);
  const daysInMonth=new Date(year,month+1,0).getDate();
  const cells=[];
  for(let i=0;i<first.getDay();i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(new Date(year,month,d));
  while(cells.length%7!==0) cells.push(null);
  const weeks=[];
  for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));
  return weeks;
}
function renderPlanner(){
  const validIds = {}; DATA.groups.forEach(function(g){ g.leaves.forEach(function(l){ validIds[l.id]=true; }); });
  const doneIds = (state.doneLeafIds||[]).filter(function(id){ return validIds[id]; });
  const doneCount = doneIds.length;
  const totalLeaves = DATA.totalLeaves;
  const today = new Date();
  const ts = todayStr();
  const hasGoal = !!state.targetDate;
  const targetCount = Math.max(1, Math.min(totalLeaves||1, state.targetCount||totalLeaves||1));
  const remaining = Math.max(0, targetCount-doneCount);
  const totalDaysPlan = hasGoal ? Math.max(1, daysBetween(state.startDate||ts, state.targetDate)) : null;
  const elapsedDays = state.startDate ? Math.max(1, daysBetween(state.startDate, ts)+1) : 1;
  const daysLeft = hasGoal ? Math.max(0, daysBetween(ts, state.targetDate)) : null;
  const idealPerDay = hasGoal ? targetCount/totalDaysPlan : null;
  const expectedByToday = hasGoal ? Math.min(targetCount, idealPerDay*elapsedDays) : null;
  const actualPerDay = doneCount/elapsedDays;
  const requiredPerDayNow = hasGoal ? (daysLeft>0 ? remaining/daysLeft : remaining) : null;
  let status="no-goal";
  if (hasGoal){ if (remaining===0) status="done"; else { const diff=doneCount-expectedByToday; status = diff>=0.5?"ahead":diff<=-0.5?"behind":"on-track"; } }
  const statusMeta = {
    "no-goal": {t: STR.plannerStatusNoGoal, bg:"var(--surfaceSoft)", ink:"var(--inkSoft)"},
    "ahead": {t: STR.plannerStatusAhead, bg:"#9BE8C4", ink:"#0B2318"},
    "on-track": {t: STR.plannerStatusOnTrack, bg:"var(--accentSoft)", ink:"var(--ink)"},
    "behind": {t: STR.plannerStatusBehind, bg:"#FFD9CE", ink:"#7A2A12"},
    "done": {t: STR.plannerStatusDone, bg:"#9BE8C4", ink:"#0B2318"}
  }[status];
  document.getElementById("statusBanner").style.background = statusMeta.bg;
  document.getElementById("statusBanner").style.color = statusMeta.ink;
  document.getElementById("statusBanner").textContent = statusMeta.t;

  let streak=0; let cur=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  if(!(state.log[toDateStr(cur)]>0)) cur.setDate(cur.getDate()-1);
  while((state.log[toDateStr(cur)]||0)>0){ streak++; cur.setDate(cur.getDate()-1); }

  const pct = totalLeaves ? Math.round(doneCount/totalLeaves*100) : 0;
  document.getElementById("statGrid").innerHTML =
    '<div class="stat"><div class="l">'+STR.plannerCompletionLabel+'</div><div class="v">'+pct+'%</div></div>' +
    '<div class="stat"><div class="l">'+STR.plannerDaysLeft+'</div><div class="v">'+(hasGoal?daysLeft:"—")+'</div></div>' +
    '<div class="stat"><div class="l">'+STR.plannerRequiredPace+'</div><div class="v">'+(hasGoal?requiredPerDayNow.toFixed(1):"—")+'</div></div>' +
    '<div class="stat"><div class="l">'+STR.plannerActualPace+'</div><div class="v">'+actualPerDay.toFixed(1)+'</div></div>' +
    '<div class="stat"><div class="l">'+STR.plannerStreakLabel+'</div><div class="v">'+streak+'</div></div>';

  renderGoalPanel();

  document.getElementById("calLabel").textContent = calCursor.toLocaleDateString(LOC,{month:"long",year:"numeric"});
  const ref = new Date(2023,0,1);
  document.getElementById("calHead").innerHTML = Array.from({length:7}).map(function(_,i){ const d=new Date(ref); d.setDate(ref.getDate()+i); return '<div style="text-align:center;font-size:10px;font-weight:700;color:var(--inkSoft);">'+d.toLocaleDateString(LOC,{weekday:"narrow"})+'</div>'; }).join("");
  const weeks = buildMonthMatrixJS(calCursor);
  document.getElementById("calBody").innerHTML = weeks.map(function(week){ return '<div class="cal-grid">' + week.map(function(day){
    if (!day) return '<div></div>';
    const ds = toDateStr(day);
    const count = state.log[ds]||0;
    const isToday = ds===ts;
    const isFuture = day > today;
    const alpha = count>0 ? Math.min(0.24*count+0.22,1) : 0;
    const bg = count>0 ? 'color-mix(in srgb, var(--accent) '+Math.round(alpha*100)+'%, transparent)' : 'transparent';
    return '<div class="cal-cell" style="background:'+bg+';border-color:'+(isToday?'var(--accent)':'var(--hairline)')+';opacity:'+(isFuture?0.4:1)+';" title="'+ds+': '+count+'">'+day.getDate()+'</div>';
  }).join("") + '</div>'; }).join("");

  let todoHtml = "";
  if (totalLeaves>0 && doneCount===totalLeaves) todoHtml += '<div class="stat" style="background:#9BE8C4;color:#0B2318;margin-bottom:10px;">'+STR.plannerAllDone+'</div>';
  DATA.groups.forEach(function(g){
    todoHtml += '<div class="branch-label">'+esc(g.branchTitle)+'</div>';
    g.leaves.forEach(function(leaf){
      const done = doneIds.indexOf(leaf.id) !== -1;
      todoHtml += '<div class="todo-row'+(done?' done':'')+'" onclick="toggleLeaf(\\''+leaf.id+'\\')"><span class="box">'+(done?'✓':'')+'</span><span class="lbl">'+esc(leaf.title)+'</span></div>';
    });
  });
  document.getElementById("todoList").innerHTML = todoHtml;
}
window.toggleLeaf = function(leafId){
  const ts = todayStr();
  state.doneLeafIds = state.doneLeafIds || [];
  const isDone = state.doneLeafIds.indexOf(leafId) !== -1;
  state.doneLeafIds = isDone ? state.doneLeafIds.filter(function(id){ return id!==leafId; }) : state.doneLeafIds.concat([leafId]);
  state.log = state.log || {};
  state.log[ts] = Math.max(0, (state.log[ts]||0) + (isDone?-1:1));
  save();
  renderPlanner();
};
document.getElementById("calPrev").onclick = function(){ calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth()-1, 1); renderPlanner(); };
document.getElementById("calNext").onclick = function(){ calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth()+1, 1); renderPlanner(); };
</script>
</body>
</html>`;
}
function downloadBookHTML(book, lang, theme, ui) {
  const html = buildBookExportHTML({ book, lang, theme, ui });
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(book[lang].title)}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
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

  if (!hasImage) {
    return (
      <div className="overflow-hidden" style={cardStyle}>
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
      {list}
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
  const [hovered, setHovered] = useState(null);
  const nodes = book.nodes;

  const edges = useMemo(() => {
    const branchEdges = nodes.filter((n) => n.parent).map((n) => ({ from: n.parent, to: n.id, type: "branch" }));
    const linkEdges = book.crossLinks.map(([from, to]) => ({ from, to, type: "link" }));
    return [...branchEdges, ...linkEdges];
  }, [book]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const posFor = (n) => ({ x: dir === "rtl" ? VB_W - n.x : n.x, y: n.y });

  const active = hovered || selected;
  const isEdgeActive = (e) => active && (e.from === active || e.to === active);
  const isNodeActive = (id) =>
    active && (id === active || edges.some((e) => (e.from === active && e.to === id) || (e.to === active && e.from === id)));

  const dims = { branch: { w: 168, h: 42, r: 21, fs: 13, fw: 700 }, sub: { w: 148, h: 36, r: 14, fs: 12, fw: 600 }, leaf: { w: 130, h: 40, r: 12, fs: 11.5, fw: 600 } };

  return (
    <div>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" style={{ overflow: "visible" }} role="img" aria-label={ui.treeEyebrow}>
        {edges.map((e, i) => {
          const a = posFor(nodeById[e.from]);
          const b = posFor(nodeById[e.to]);
          const edgeActive = isEdgeActive(e);
          const dimmed = active && !edgeActive;
          if (e.type === "branch") {
            const midY = (a.y + b.y) / 2;
            const path = `M ${a.x} ${a.y + 20} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y - 20}`;
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke={edgeActive ? theme.accent : theme.hairlineStrong}
                strokeWidth={edgeActive ? 2.5 : 1.5}
                style={{ opacity: dimmed ? 0.35 : 1, transition: "all .18s ease" }}
              />
            );
          }
          const midY = Math.min(VB_H - 14, Math.min(a.y, b.y) + 30);
          const path = `M ${a.x} ${a.y + 20} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y + 20}`;
          return (
            <path
              key={i}
              d={path}
              fill="none"
              stroke={edgeActive ? theme.accent : theme.inkSoft}
              strokeWidth={edgeActive ? 2.5 : 1.4}
              strokeDasharray="5 5"
              style={{ opacity: dimmed ? 0.2 : 0.85, transition: "all .18s ease" }}
            />
          );
        })}

        {nodes.map((n) => {
          const { x, y } = posFor(n);
          const d = dims[n.level];
          const nodeActive = isNodeActive(n.id);
          const isHovered = hovered === n.id;
          const isSelected = selected === n.id;
          const isLeaf = n.level === "leaf";
          const isBranch = n.level === "branch";
          const count = isLeaf ? leafCards(n).reduce((sum, g) => sum + g.questions.length, 0) : 0;

          let fill = theme.surface;
          let stroke = theme.hairlineStrong;
          let textFill = theme.ink;
          if (isBranch) {
            fill = theme.accent;
            stroke = "transparent";
            textFill = theme.accentInk;
          } else if (isLeaf && isSelected) {
            fill = theme.accent;
            stroke = theme.accent;
            textFill = theme.accentInk;
          } else if (isLeaf) {
            fill = theme.accentSoft;
            stroke = theme.accent;
          }

          return (
            <g
              key={n.id}
              role={isLeaf ? "button" : undefined}
              tabIndex={isLeaf ? 0 : -1}
              aria-label={isLeaf ? `${n[lang]} — ${count > 1 ? ui.multiCardBadge(count) : ""}` : n[lang]}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(n.id)}
              onBlur={() => setHovered(null)}
              onClick={() => isLeaf && onSelect(n.id)}
              onKeyDown={(e) => {
                if (isLeaf && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelect(n.id);
                }
              }}
              style={{ cursor: isLeaf ? "pointer" : "default", outline: "none" }}
            >
              <rect
                x={x - d.w / 2}
                y={y - d.h / 2}
                width={d.w}
                height={d.h}
                rx={skin && skin.pixel ? 0 : d.r}
                fill={fill}
                stroke={stroke}
                strokeWidth={skin && skin.pixel ? 2.5 : 1.5}
                style={{
                  filter: isHovered ? "brightness(1.05)" : "none",
                  opacity: active && !nodeActive ? 0.4 : 1,
                  transition: "all .18s ease",
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: isHovered || isSelected ? "scale(1.05)" : "scale(1)",
                }}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={d.fs}
                fontWeight={d.fw}
                fill={textFill}
                style={{ fontFamily: "inherit", opacity: active && !nodeActive ? 0.5 : 1, transition: "opacity .18s ease", pointerEvents: "none" }}
              >
                {n[lang]}
              </text>
              {count > 1 && (
                <g style={{ opacity: active && !nodeActive ? 0.5 : 1, transition: "opacity .18s ease", pointerEvents: "none" }}>
                  <circle cx={x + d.w / 2 - 6} cy={y - d.h / 2 + 2} r={10} fill={theme.ink} />
                  <text x={x + d.w / 2 - 6} y={y - d.h / 2 + 2} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fill={theme.canvas}>
                    {count}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center gap-5 mt-4">
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full" style={{ width: 22, height: 10, background: theme.accent }} />
          <span className="text-sm" style={{ color: theme.inkSoft }}>
            {ui.legendBranch}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full" style={{ width: 18, height: 10, background: theme.accentSoft, border: `1.5px solid ${theme.accent}` }} />
          <span className="text-sm" style={{ color: theme.inkSoft }}>
            {ui.legendLeaf}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="18" height="6">
            <line x1="0" y1="3" x2="18" y2="3" stroke={theme.inkSoft} strokeWidth="1.6" strokeDasharray="4 4" />
          </svg>
          <span className="text-sm" style={{ color: theme.inkSoft }}>
            {ui.legendLink}
          </span>
        </div>
      </div>
    </div>
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
function LibraryView({ lang, ui, theme, dir, onOpen, skin, covers, onChangeCover, onClearCover }) {
  return (
    <section>
      <div className="text-center pt-4 pb-10 max-w-xl mx-auto">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {BOOKS.map((book) => {
          const branchCount = book.nodes.filter((n) => n.level === "branch").length;
          const questionCount = book.nodes.reduce((sum, n) => sum + (n.level === "leaf" ? leafCards(n).reduce((s, g) => s + g.questions.length, 0) : 0), 0);
          const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
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
                <EditableCover
                  book={book}
                  theme={theme}
                  skin={skin}
                  ui={ui}
                  coverUrl={covers[book.id]}
                  onChangeCover={onChangeCover}
                  onClearCover={onClearCover}
                  radius={skin.radiusMd * 0.7}
                />
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
                  <span
                    className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors"
                    style={{ background: theme.accentSoft, color: theme.accent }}
                  >
                    {ui.openBook}
                    <ArrowIcon size={12} />
                  </span>
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
function TreeView({ book, lang, ui, theme, dir, onBack, skin, selectedLeaf, onSelectLeaf, onBrowse, onPlanner, onExport, covers, onChangeCover, onClearCover }) {
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
        <button
          onClick={onBrowse}
          className="flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 shrink-0"
          style={{ borderRadius: skin.radiusSm, background: theme.accent, color: theme.accentInk, minHeight: 44 }}
        >
          <ListFilter size={15} />
          {ui.browseCta}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={onPlanner}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2"
          style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
        >
          <CalendarDays size={13} />
          {ui.treePlannerCta}
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2"
          style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
        >
          <FileDown size={13} />
          {ui.treeExportCta}
        </button>
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
    noQuestionsInCard: "This card is empty — add a question.",
    pagesSub: "Build the printed A4 version — plates, images, and page breaks.",
    addBlock: "Add block",
    genFromCards: "Generate from this leaf's cards",
    blockSectionTitle: "Section title", blockKeyterm: "Key term", blockNote: "Note", blockWarning: "Warning", blockImportant: "Important", blockImage: "Image", blockPagebreak: "Page break",
    blockTitle: "Title", blockText: "Text", imageUrl: "Image URL", imageCaption: "Caption",
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
    noQuestionsInCard: "الكارد ده فاضي — ضيف سؤال.",
    pagesSub: "ابني النسخة المطبوعة A4 — بلايتس وصور وفواصل صفحات.",
    addBlock: "إضافة عنصر",
    genFromCards: "ولّد من كاردات الورقة دي",
    blockSectionTitle: "عنوان قسم", blockKeyterm: "مصطلح مفتاحي", blockNote: "ملاحظة", blockWarning: "تحذير", blockImportant: "مهم", blockImage: "صورة", blockPagebreak: "فاصل صفحة",
    blockTitle: "العنوان", blockText: "النص", imageUrl: "رابط الصورة", imageCaption: "التعليق",
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

/* Simple search-to-link combobox — replaces a wall of buttons. */
function LinkPicker({ allLeaves, currentLeafId, linkedTo, lang, theme, skin, t, onChange }) {
  const [query, setQuery] = useState("");
  const list = linkedTo || [];
  const options = allLeaves.filter((l) => l.id !== currentLeafId && !list.includes(l.id) && (lang === "ar" ? l.ar : l.en).toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      {list.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {list.map((id) => {
            const l = allLeaves.find((x) => x.id === id);
            if (!l) return null;
            return (
              <span key={id} className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1" style={{ borderRadius: 999, background: theme.accent, color: theme.accentInk }}>
                {lang === "ar" ? l.ar : l.en}
                <button type="button" onClick={() => onChange(list.filter((x) => x !== id))}>
                  <X size={11} />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div className="relative">
        <TextInput theme={theme} skin={skin} value={query} onChange={setQuery} placeholder={t.linkedHint} />
        {query && options.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto" style={{ borderRadius: skin.radiusSm, background: theme.surface, border: `1px solid ${theme.hairlineStrong}`, boxShadow: skin.shadow }}>
            {options.slice(0, 8).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  onChange([...list, l.id]);
                  setQuery("");
                }}
                className="w-full text-start text-xs px-3 py-2"
                style={{ color: theme.ink }}
              >
                {lang === "ar" ? l.ar : l.en}
              </button>
            ))}
          </div>
        )}
      </div>
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

  // union of every linked leaf across this card's questions, plus any
  // card-wide links (e.g. set by a manifest import) — shown as tag chips
  const linkedIds = Array.from(new Set([...(card.cardLinkedTo || []), ...card.questions.flatMap((q) => q.linkedTo || [])]));

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
        {linkedIds.map((id) => {
          const l = allLeaves.find((x) => x.id === id);
          if (!l) return null;
          return (
            <span
              key={id}
              className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5"
              style={{ borderRadius: 999, background: "transparent", border: `1.5px dashed ${theme.accent}`, color: theme.accent }}
            >
              <GitBranch size={11} />
              {lang === "ar" ? l.ar : l.en}
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

/* ---------------- A4 page builder ---------------- */
const PLATE_KINDS = {
  sectionTitle: { bg: "#E8654A", fg: "#FFFFFF", border: "#E8654A", bar: true },
  keyterm: { bg: "#FFF6DC", fg: "#5B4408", border: "#E8B84B" },
  note: { bg: "#E6F5F2", fg: "#0B3D3A", border: "#0E7C79" },
  warning: { bg: "#FDECEA", fg: "#7A2418", border: "#C0392B", strong: true },
  important: { bg: "#F3ECFB", fg: "#3A215E", border: "#7C4FD1", strong: true },
};

function BlockRow({ block, t, theme, skin, onUpdate, onDelete, onMove }) {
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
        <div className="grid grid-cols-2 gap-1.5">
          <TextInput theme={theme} skin={skin} value={block.imageUrl} onChange={(v) => onUpdate({ imageUrl: v })} placeholder={t.imageUrl} />
          <TextInput theme={theme} skin={skin} value={block.caption} onChange={(v) => onUpdate({ caption: v })} placeholder={t.imageCaption} />
        </div>
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

function PlateBlock({ block, style }) {
  const kind = PLATE_KINDS[block.kind];
  if (block.kind === "image") {
    return (
      <div style={{ margin: "10px 0", ...style }}>
        {block.imageUrl && <img src={block.imageUrl} alt="" style={{ width: "100%", borderRadius: 8, display: "block" }} />}
        {block.caption && <p style={{ fontSize: 11, color: "#8a7c6a", textAlign: "center", margin: "4px 0 0" }}>{block.caption}</p>}
      </div>
    );
  }
  if (block.kind === "sectionTitle") {
    return (
      <div style={{ background: kind.bg, color: kind.fg, borderRadius: 10, padding: "10px 16px", margin: "14px 0 10px", fontWeight: 800, fontSize: 15, ...style }}>
        {block.text}
      </div>
    );
  }
  return (
    <div
      style={{
        background: kind.bg,
        color: kind.fg,
        borderRadius: 12,
        border: `${kind.strong ? 2 : 1.5}px solid ${kind.border}`,
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

function A4PageBuilder({ leaf, lang, theme, skin, t, onUpdateLeaf, allLeavesCards }) {
  const blocks = leaf.pageBlocks || [];
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

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-5">
      <div className="p-3" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairline}`, background: theme.surface, alignSelf: "start" }}>
        <button
          onClick={generateFromCards}
          className="w-full text-xs font-bold px-3 py-2 mb-3"
          style={{ borderRadius: 8, background: theme.accentSoft, color: theme.accent }}
        >
          {t.genFromCards}
        </button>
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            ["sectionTitle", t.blockSectionTitle],
            ["keyterm", t.blockKeyterm],
            ["note", t.blockNote],
            ["warning", t.blockWarning],
            ["important", t.blockImportant],
            ["image", t.blockImage],
            ["pagebreak", t.blockPagebreak],
          ].map(([kind, label]) => (
            <button
              key={kind}
              onClick={() => addBlock(kind)}
              title={label}
              className="h-8 grid place-items-center text-[10px] font-bold"
              style={{ borderRadius: 6, background: PLATE_KINDS[kind]?.bg || theme.surfaceSoft, color: PLATE_KINDS[kind]?.fg || theme.ink, border: `1px solid ${theme.hairline}` }}
            >
              +
            </button>
          ))}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {blocks.map((b, i) => (
            <BlockRow key={b.id || i} block={b} t={t} theme={theme} skin={skin} onUpdate={(p) => updateBlock(i, p)} onDelete={() => deleteBlock(i)} onMove={(dir) => moveBlock(i, dir)} />
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* hidden measuring pass — same width, invisible */}
        <div ref={measureRef} style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", width: "182mm", top: -99999 }}>
          {blocks.map((b, i) => (
            <PlateBlock key={b.id || i} block={b} />
          ))}
        </div>

        <div className="flex flex-col gap-6 items-center py-2">
          {pages.map((pageBlocks, pi) => (
            <div key={pi} style={{ width: "210mm", minHeight: "297mm", background: "#fff", color: "#241B13", padding: "16mm 14mm", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", borderRadius: 4 }}>
              {pageBlocks.map((b, i) => (
                <PlateBlock key={b.id || i} block={b} />
              ))}
              <p style={{ position: "relative", top: "8mm", textAlign: "center", fontSize: 10, color: "#b3a692" }}>{t.pageOf(pi + 1, pages.length)}</p>
            </div>
          ))}
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
    const extraLinks = (item.linkedTo || []).map((l) => (typeof l === "string" ? l : l.leafId)).filter(Boolean);
    if (item.questionId) {
      const qIdx = card.questions.findIndex((q) => q.id === item.questionId);
      if (qIdx !== -1 && extraLinks.length) {
        const q = { ...card.questions[qIdx] };
        q.linkedTo = Array.from(new Set([...(q.linkedTo || []), ...extraLinks]));
        card.questions = card.questions.map((qq, i) => (i === qIdx ? q : qq));
      }
    } else if (extraLinks.length) {
      card.cardLinkedTo = Array.from(new Set([...(card.cardLinkedTo || []), ...extraLinks]));
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

  const allLeaves = useMemo(() => book.nodes.filter((n) => n.level === "leaf"), [book]);
  const leaf = allLeaves.find((l) => l.id === selectedLeafId) || null;
  const cards = leaf ? leafCards(leaf) : [];
  const card = cards[selectedCardIdx];

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
    const nextCards = [...cards, { id: `${selectedLeafId}-card-${Date.now()}`, image: null, imagePosition: "top", questions: [] }];
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
          {!leaf ? (
            <p className="text-sm" style={{ color: theme.inkSoft }}>
              {t.noLeaf}
            </p>
          ) : tab === "pages" ? (
            <>
              <p className="text-xs mb-3" style={{ color: theme.inkSoft }}>
                {t.pagesSub}
              </p>
              <A4PageBuilder leaf={leaf} lang={lang} theme={theme} skin={skin} t={t} onUpdateLeaf={(patch) => patchLeaf((n) => ({ ...n, ...patch }))} allLeavesCards={cards} />
            </>
          ) : (
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

export default function EDUcraftApp() {
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState("light");
  const [view, setView] = useState("library");
  const [books, setBooks] = useState(BOOKS);
  const [bookId, setBookId] = useState(BOOKS[0].id);
  const [leafId, setLeafId] = useState(null);
  const [skinId, setSkinId] = useState("normal");
  const [flavorId, setFlavorId] = useState("normal");
  const [cardMode, setCardMode] = useState("paged");
  const [scrollDir, setScrollDir] = useState("vertical");
  const [covers, setCovers] = useState({});
  const [plans, setPlans] = useState({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const ui = UI[lang];
  const theme = FLAVORS[flavorId][mode];
  const skin = SKINS[skinId];
  const dir = ui.dir;
  const currentBook = books.find((b) => b.id === bookId) || books[0];
  const updateCurrentBook = (fn) => setBooks((prev) => prev.map((b) => (b.id === currentBook.id ? fn(b) : b)));
  const currentPlan = plans[bookId] || defaultPlan();
  const updateCurrentPlan = (fn) => setPlans((prev) => ({ ...prev, [bookId]: fn(prev[bookId] || defaultPlan()) }));

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
            <LibraryView lang={lang} ui={ui} theme={theme} dir={dir} onOpen={openBook} skin={skin} covers={covers} onChangeCover={setCover} onClearCover={clearCover} />
          ) : view === "tree" ? (
            <TreeView
              key={currentBook.id}
              book={currentBook}
              lang={lang}
              ui={ui}
              theme={theme}
              dir={dir}
              onBack={() => setView("library")}
              skin={skin}
              selectedLeaf={leafId}
              onSelectLeaf={openLeaf}
              onBrowse={() => setView("browse")}
              covers={covers}
              onChangeCover={setCover}
              onClearCover={clearCover}
            />
          ) : view === "browse" ? (
            <BrowseView key={currentBook.id} book={currentBook} lang={lang} ui={ui} theme={theme} dir={dir} skin={skin} onBack={() => setView("tree")} />
          ) : view === "editor" ? (
            <EditorView
              key={currentBook.id}
              book={currentBook}
              lang={lang}
              theme={theme}
              skin={skin}
              voiceEnabled={voiceEnabled}
              onVoiceEnabledChange={setVoiceEnabled}
              onUpdateBook={updateCurrentBook}
            />
          ) : view === "planner" ? (
            <PlannerView key={currentBook.id} book={currentBook} lang={lang} ui={ui} theme={theme} dir={dir} skin={skin} plan={currentPlan} onUpdatePlan={updateCurrentPlan} />
          ) : currentLeaf ? (
            <DeckView
              key={currentLeaf.id}
              node={currentLeaf}
              book={currentBook}
              lang={lang}
              ui={ui}
              theme={theme}
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
              theme={theme}
              dir={dir}
              onBack={() => setView("library")}
              skin={skin}
              selectedLeaf={leafId}
              onSelectLeaf={openLeaf}
              onBrowse={() => setView("browse")}
              covers={covers}
              onChangeCover={setCover}
              onClearCover={clearCover}
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
        />
      )}
    </div>
  );
}
