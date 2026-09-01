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
  Briefcase,
  BookCopy,
  FolderPlus,
  Link2,
  ExternalLink,
  Table as TableIcon,
  Plus,
  Search,
  Code,
  Image as ImageIcon,
  Eye,
  EyeOff,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  Sparkle,
  Bookmark,
  AlertTriangle,
  Info,
  Heading,
  CodeXml,
  Menu,
} from "lucide-react";

/* =================================================================
   60 THIQA (ثِقة) PALETTES (BLADES) — The 60 A4 Color Systems
================================================================== */
const THIQA_PALETTES = [
  {
    "id": 1,
    "num": 1,
    "name": "كلاسيك أكاديمي",
    "vars": {
      "--PageBG": "#F8F5F0",
      "--HeaderColor": "#2E4060",
      "--SectionBG": "#E8874A",
      "--SectionFrame": "#C96B2F",
      "--KeyBG": "#E8F7F9",
      "--KeyFrame": "#4C9DB0",
      "--KeyText": "#1A6B7A",
      "--NoteBG": "#F0EDF7",
      "--NoteFrame": "#655A7C",
      "--NoteText": "#3B3050",
      "--BodyText": "#000000",
      "--WarningBG": "#F2F4E6",
      "--WarningFrame": "#84922A",
      "--WarningText": "#626D17",
      "--ImportantText": "#14428F",
      "--HighlightBG": "#D9E0F2"
    }
  },
  {
    "id": 2,
    "num": 2,
    "name": "أزرق محايد",
    "vars": {
      "--PageBG": "#F5F8FA",
      "--HeaderColor": "#1B3A5C",
      "--SectionBG": "#2E6F9E",
      "--SectionFrame": "#1F4F73",
      "--KeyBG": "#E6F2F8",
      "--KeyFrame": "#3E8FBF",
      "--KeyText": "#14506E",
      "--NoteBG": "#EAEFF5",
      "--NoteFrame": "#52688A",
      "--NoteText": "#2A3A52",
      "--BodyText": "#000000",
      "--WarningBG": "#E8E6F4",
      "--WarningFrame": "#4934B2",
      "--WarningText": "#26176D",
      "--ImportantText": "#8F4514",
      "--HighlightBG": "#F2ECD9"
    }
  },
  {
    "id": 3,
    "num": 3,
    "name": "رمادي أنيق",
    "vars": {
      "--PageBG": "#F7F7F6",
      "--HeaderColor": "#33363B",
      "--SectionBG": "#6E5046",
      "--SectionFrame": "#4F3A33",
      "--KeyBG": "#EDEDEA",
      "--KeyFrame": "#8A8580",
      "--KeyText": "#3A3833",
      "--NoteBG": "#F1ECEA",
      "--NoteFrame": "#8C6F62",
      "--NoteText": "#4A3A32",
      "--BodyText": "#000000",
      "--WarningBG": "#F4F4E6",
      "--WarningFrame": "#92922A",
      "--WarningText": "#6D6D17",
      "--ImportantText": "#14148F",
      "--HighlightBG": "#D9E3F2"
    }
  },
  {
    "id": 4,
    "num": 4,
    "name": "باستيل وردي",
    "vars": {
      "--PageBG": "#FDF6F5",
      "--HeaderColor": "#8C4B5A",
      "--SectionBG": "#E8A0AC",
      "--SectionFrame": "#C97584",
      "--KeyBG": "#FCEDEF",
      "--KeyFrame": "#D98A9A",
      "--KeyText": "#8A3D4C",
      "--NoteBG": "#FBF0E9",
      "--NoteFrame": "#C99E84",
      "--NoteText": "#6E4A36",
      "--BodyText": "#000000",
      "--WarningBG": "#F4EEE6",
      "--WarningFrame": "#B27D34",
      "--WarningText": "#6D4917",
      "--ImportantText": "#127481",
      "--HighlightBG": "#D9EEF2"
    }
  },
  {
    "id": 5,
    "num": 5,
    "name": "باستيل نعناعي",
    "vars": {
      "--PageBG": "#F4FAF7",
      "--HeaderColor": "#2F6B57",
      "--SectionBG": "#6FBFA0",
      "--SectionFrame": "#409478",
      "--KeyBG": "#E7F7F1",
      "--KeyFrame": "#52B399",
      "--KeyText": "#1F6B53",
      "--NoteBG": "#EEF6F8",
      "--NoteFrame": "#6FA8B5",
      "--NoteText": "#2C5A66",
      "--BodyText": "#000000",
      "--WarningBG": "#E6EFF4",
      "--WarningFrame": "#3484B2",
      "--WarningText": "#174E6D",
      "--ImportantText": "#8F1452",
      "--HighlightBG": "#F2D9DA"
    }
  },
  {
    "id": 6,
    "num": 6,
    "name": "باستيل لافندر",
    "vars": {
      "--PageBG": "#F8F6FB",
      "--HeaderColor": "#4A3F73",
      "--SectionBG": "#9A8AC7",
      "--SectionFrame": "#6F5DA3",
      "--KeyBG": "#EFEAF8",
      "--KeyFrame": "#8470B8",
      "--KeyText": "#4B3A7A",
      "--NoteBG": "#EAF0F6",
      "--NoteFrame": "#7E93B0",
      "--NoteText": "#354A66",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6F4",
      "--WarningFrame": "#B234B0",
      "--WarningText": "#6D176C",
      "--ImportantText": "#4C7411",
      "--HighlightBG": "#E3F2D9"
    }
  },
  {
    "id": 7,
    "num": 7,
    "name": "باستيل خوخي",
    "vars": {
      "--PageBG": "#FDF8F1",
      "--HeaderColor": "#8A5A2E",
      "--SectionBG": "#EFA85E",
      "--SectionFrame": "#D1873A",
      "--KeyBG": "#FCEFE0",
      "--KeyFrame": "#E0A05C",
      "--KeyText": "#7A4C20",
      "--NoteBG": "#FAF3E6",
      "--NoteFrame": "#C9A06A",
      "--NoteText": "#6B4E2A",
      "--BodyText": "#000000",
      "--WarningBG": "#F1F4E6",
      "--WarningFrame": "#7E9A2D",
      "--WarningText": "#576D17",
      "--ImportantText": "#14478F",
      "--HighlightBG": "#D9DDF2"
    }
  },
  {
    "id": 8,
    "num": 8,
    "name": "ليلي أزرق",
    "vars": {
      "--PageBG": "#1B1F2A",
      "--HeaderColor": "#E8ECF2",
      "--SectionBG": "#3D6FB4",
      "--SectionFrame": "#6E9CDB",
      "--KeyBG": "#223240",
      "--KeyFrame": "#5EC3D6",
      "--KeyText": "#8FE3F0",
      "--NoteBG": "#282235",
      "--NoteFrame": "#9E8FD6",
      "--NoteText": "#C9BBF5",
      "--BodyText": "#E6E8EC",
      "--WarningBG": "#31244C",
      "--WarningFrame": "#774DCB",
      "--WarningText": "#BBA5E9",
      "--ImportantText": "#8999E6",
      "--HighlightBG": "#403D1C"
    }
  },
  {
    "id": 9,
    "num": 9,
    "name": "ليلي بنفسجي",
    "vars": {
      "--PageBG": "#201A2B",
      "--HeaderColor": "#F0E9F7",
      "--SectionBG": "#8A5FBF",
      "--SectionFrame": "#AE8AE0",
      "--KeyBG": "#271F38",
      "--KeyFrame": "#4FB3A8",
      "--KeyText": "#8FE0D4",
      "--NoteBG": "#2A2230",
      "--NoteFrame": "#C99A6B",
      "--NoteText": "#EAC79A",
      "--BodyText": "#EDE7F4",
      "--WarningBG": "#4C2444",
      "--WarningFrame": "#CB4DB2",
      "--WarningText": "#E9A5DB",
      "--ImportantText": "#CA89E6",
      "--HighlightBG": "#24401C"
    }
  },
  {
    "id": 10,
    "num": 10,
    "name": "ليلي أخضر",
    "vars": {
      "--PageBG": "#16201C",
      "--HeaderColor": "#E6F0EA",
      "--SectionBG": "#3E8E68",
      "--SectionFrame": "#63B58A",
      "--KeyBG": "#1C2A24",
      "--KeyFrame": "#5BAFA0",
      "--KeyText": "#9FE3D4",
      "--NoteBG": "#20251F",
      "--NoteFrame": "#A9A45E",
      "--NoteText": "#E1DC9E",
      "--BodyText": "#E7EDE9",
      "--WarningBG": "#24414C",
      "--WarningFrame": "#4DA9CB",
      "--WarningText": "#A5D6E9",
      "--ImportantText": "#89E6D1",
      "--HighlightBG": "#401C21"
    }
  },
  {
    "id": 11,
    "num": 11,
    "name": "طبي إكلينيكي",
    "vars": {
      "--PageBG": "#FAFCFD",
      "--HeaderColor": "#0E5C73",
      "--SectionBG": "#1C8FA8",
      "--SectionFrame": "#146C82",
      "--KeyBG": "#E3F6F4",
      "--KeyFrame": "#2BA89A",
      "--KeyText": "#0E6B5F",
      "--NoteBG": "#EAF4FB",
      "--NoteFrame": "#4A8FBF",
      "--NoteText": "#1B4F75",
      "--BodyText": "#000000",
      "--WarningBG": "#E6E7F4",
      "--WarningFrame": "#343DB2",
      "--WarningText": "#171D6D",
      "--ImportantText": "#8F3D14",
      "--HighlightBG": "#F2E6D9"
    }
  },
  {
    "id": 12,
    "num": 12,
    "name": "هندسي تقني",
    "vars": {
      "--PageBG": "#F6F7F8",
      "--HeaderColor": "#22272E",
      "--SectionBG": "#E0A12C",
      "--SectionFrame": "#B8821B",
      "--KeyBG": "#E9EEF2",
      "--KeyFrame": "#4A6B8A",
      "--KeyText": "#1F3A52",
      "--NoteBG": "#EEEDEA",
      "--NoteFrame": "#8C8275",
      "--NoteText": "#4A4338",
      "--BodyText": "#000000",
      "--WarningBG": "#EFF4E6",
      "--WarningFrame": "#6E9A2D",
      "--WarningText": "#4B6D17",
      "--ImportantText": "#8F5214",
      "--HighlightBG": "#D9D9F2"
    }
  },
  {
    "id": 13,
    "num": 13,
    "name": "طبيعي ترابي",
    "vars": {
      "--PageBG": "#F7F5EE",
      "--HeaderColor": "#4A4520",
      "--SectionBG": "#8A9B5E",
      "--SectionFrame": "#677A3E",
      "--KeyBG": "#EFF1E3",
      "--KeyFrame": "#7E9460",
      "--KeyText": "#435228",
      "--NoteBG": "#F1E9DE",
      "--NoteFrame": "#A07D52",
      "--NoteText": "#5C4327",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4E6",
      "--WarningFrame": "#2FA232",
      "--WarningText": "#176D1A",
      "--ImportantText": "#14308F",
      "--HighlightBG": "#E8D9F2"
    }
  },
  {
    "id": 14,
    "num": 14,
    "name": "ملكي ذهبي",
    "vars": {
      "--PageBG": "#F9F7F1",
      "--HeaderColor": "#1F2A4A",
      "--SectionBG": "#B68A3E",
      "--SectionFrame": "#8C6A26",
      "--KeyBG": "#F3EEE0",
      "--KeyFrame": "#A9842F",
      "--KeyText": "#6B4F18",
      "--NoteBG": "#EFEAF1",
      "--NoteFrame": "#7A4F5E",
      "--NoteText": "#5A2E3C",
      "--BodyText": "#000000",
      "--WarningBG": "#EFF4E6",
      "--WarningFrame": "#709A2D",
      "--WarningText": "#4C6D17",
      "--ImportantText": "#14338F",
      "--HighlightBG": "#D9DAF2"
    }
  },
  {
    "id": 15,
    "num": 15,
    "name": "عصري جريء",
    "vars": {
      "--PageBG": "#FBFBFA",
      "--HeaderColor": "#1A2E35",
      "--SectionBG": "#EB5E55",
      "--SectionFrame": "#C73E36",
      "--KeyBG": "#E3F4F2",
      "--KeyFrame": "#1FA39A",
      "--KeyText": "#0E6760",
      "--NoteBG": "#FDF1E3",
      "--NoteFrame": "#E0A23A",
      "--NoteText": "#7A4E12",
      "--BodyText": "#000000",
      "--WarningBG": "#F4F2E6",
      "--WarningFrame": "#A69030",
      "--WarningText": "#6D5D17",
      "--ImportantText": "#14148F",
      "--HighlightBG": "#D9E8F2"
    }
  },
  {
    "id": 16,
    "num": 16,
    "name": "أحمر مرجاني",
    "vars": {
      "--PageBG": "#F7F3F3",
      "--HeaderColor": "#511F1F",
      "--SectionBG": "#C84141",
      "--SectionFrame": "#9D2525",
      "--KeyBG": "#E5F5ED",
      "--KeyFrame": "#3B9B6B",
      "--KeyText": "#1F6B45",
      "--NoteBG": "#EEEAF5",
      "--NoteFrame": "#654B9B",
      "--NoteText": "#3E2B64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4F1E6",
      "--WarningFrame": "#A68930",
      "--WarningText": "#6D5817",
      "--ImportantText": "#117474",
      "--HighlightBG": "#D9EAF2"
    }
  },
  {
    "id": 17,
    "num": 17,
    "name": "أخضر زمردي",
    "vars": {
      "--PageBG": "#F3F7F4",
      "--HeaderColor": "#1F512E",
      "--SectionBG": "#268241",
      "--SectionFrame": "#124E24",
      "--KeyBG": "#F2E5F5",
      "--KeyFrame": "#9B43B1",
      "--KeyText": "#5B1F6B",
      "--NoteBG": "#F5F1EA",
      "--NoteFrame": "#9B7D4B",
      "--NoteText": "#644F2B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4F4",
      "--WarningFrame": "#2F9DA2",
      "--WarningText": "#176A6D",
      "--ImportantText": "#8F1470",
      "--HighlightBG": "#F2D9E2"
    }
  },
  {
    "id": 18,
    "num": 18,
    "name": "أرجواني",
    "vars": {
      "--PageBG": "#F5F3F7",
      "--HeaderColor": "#3C1F51",
      "--SectionBG": "#9041C8",
      "--SectionFrame": "#6B259D",
      "--KeyBG": "#F4F5E5",
      "--KeyFrame": "#899037",
      "--KeyText": "#646B1F",
      "--NoteBG": "#EAF5F4",
      "--NoteFrame": "#499791",
      "--NoteText": "#2B645F",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6F0",
      "--WarningFrame": "#B23488",
      "--WarningText": "#6D1751",
      "--ImportantText": "#427411",
      "--HighlightBG": "#DBF2D9"
    }
  },
  {
    "id": 19,
    "num": 19,
    "name": "ذهبي فاتح",
    "vars": {
      "--PageBG": "#F7F6F3",
      "--HeaderColor": "#514B1F",
      "--SectionBG": "#7E7325",
      "--SectionFrame": "#4A4311",
      "--KeyBG": "#E5EFF5",
      "--KeyFrame": "#4388B1",
      "--KeyText": "#1F4E6B",
      "--NoteBG": "#F5EAF3",
      "--NoteFrame": "#9B4B8A",
      "--NoteText": "#642B58",
      "--BodyText": "#000000",
      "--WarningBG": "#EBF4E6",
      "--WarningFrame": "#589E2E",
      "--WarningText": "#376D17",
      "--ImportantText": "#14338F",
      "--HighlightBG": "#DED9F2"
    }
  },
  {
    "id": 20,
    "num": 20,
    "name": "سماوي",
    "vars": {
      "--PageBG": "#F3F6F7",
      "--HeaderColor": "#1F4951",
      "--SectionBG": "#297D8E",
      "--SectionFrame": "#154F5B",
      "--KeyBG": "#F5E5EA",
      "--KeyFrame": "#B14368",
      "--KeyText": "#6B1F38",
      "--NoteBG": "#F0F5EA",
      "--NoteFrame": "#709749",
      "--NoteText": "#47642B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6E7F4",
      "--WarningFrame": "#343EB2",
      "--WarningText": "#171E6D",
      "--ImportantText": "#8F3314",
      "--HighlightBG": "#F2E6D9"
    }
  },
  {
    "id": 21,
    "num": 21,
    "name": "فوشيا",
    "vars": {
      "--PageBG": "#F7F3F5",
      "--HeaderColor": "#511F3A",
      "--SectionBG": "#C73D88",
      "--SectionFrame": "#992463",
      "--KeyBG": "#E6F5E5",
      "--KeyFrame": "#409F3C",
      "--KeyText": "#226B1F",
      "--NoteBG": "#EAEDF5",
      "--NoteFrame": "#4B5B9B",
      "--NoteText": "#2B3764",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E9E6",
      "--WarningFrame": "#B24E34",
      "--WarningText": "#6D2917",
      "--ImportantText": "#117845",
      "--HighlightBG": "#D9F2ED"
    }
  },
  {
    "id": 22,
    "num": 22,
    "name": "أخضر ربيعي",
    "vars": {
      "--PageBG": "#F4F7F3",
      "--HeaderColor": "#2B511F",
      "--SectionBG": "#3D8226",
      "--SectionFrame": "#214E12",
      "--KeyBG": "#E9E5F5",
      "--KeyFrame": "#5F43B1",
      "--KeyText": "#321F6B",
      "--NoteBG": "#F5EBEA",
      "--NoteFrame": "#9B514B",
      "--NoteText": "#64302B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4ED",
      "--WarningFrame": "#2E9E66",
      "--WarningText": "#176D42",
      "--ImportantText": "#70148F",
      "--HighlightBG": "#F2D9F0"
    }
  },
  {
    "id": 23,
    "num": 23,
    "name": "أزرق نيلي",
    "vars": {
      "--PageBG": "#F3F3F7",
      "--HeaderColor": "#211F51",
      "--SectionBG": "#4741C8",
      "--SectionFrame": "#2A259D",
      "--KeyBG": "#F5EEE5",
      "--KeyFrame": "#B17F43",
      "--KeyText": "#6B481F",
      "--NoteBG": "#EAF5EE",
      "--NoteFrame": "#4B9B69",
      "--NoteText": "#2B6440",
      "--BodyText": "#000000",
      "--WarningBG": "#F1E6F4",
      "--WarningFrame": "#9834B2",
      "--WarningText": "#5C176D",
      "--ImportantText": "#6B6B0F",
      "--HighlightBG": "#E9F2D9"
    }
  },
  {
    "id": 24,
    "num": 24,
    "name": "برتقالي دافئ",
    "vars": {
      "--PageBG": "#F7F4F3",
      "--HeaderColor": "#51301F",
      "--SectionBG": "#B25E34",
      "--SectionFrame": "#803F1E",
      "--KeyBG": "#E5F5F3",
      "--KeyFrame": "#3B9B8B",
      "--KeyText": "#1F6B5E",
      "--NoteBG": "#F1EAF5",
      "--NoteFrame": "#804B9B",
      "--NoteText": "#512B64",
      "--BodyText": "#000000",
      "--WarningBG": "#F3F4E6",
      "--WarningFrame": "#8A922A",
      "--WarningText": "#666D17",
      "--ImportantText": "#14708F",
      "--HighlightBG": "#D9E1F2"
    }
  },
  {
    "id": 25,
    "num": 25,
    "name": "نعناعي غامق",
    "vars": {
      "--PageBG": "#F3F7F5",
      "--HeaderColor": "#1F513E",
      "--SectionBG": "#268260",
      "--SectionFrame": "#124E38",
      "--KeyBG": "#F5E5F3",
      "--KeyFrame": "#B143A4",
      "--KeyText": "#6B1F61",
      "--NoteBG": "#F5F5EA",
      "--NoteFrame": "#949147",
      "--NoteText": "#64622B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6EFF4",
      "--WarningFrame": "#3482B2",
      "--WarningText": "#174D6D",
      "--ImportantText": "#8F1452",
      "--HighlightBG": "#F2D9DA"
    }
  },
  {
    "id": 26,
    "num": 26,
    "name": "موف",
    "vars": {
      "--PageBG": "#F7F3F7",
      "--HeaderColor": "#4D1F51",
      "--SectionBG": "#BA39C6",
      "--SectionFrame": "#8B2395",
      "--KeyBG": "#EEF5E5",
      "--KeyFrame": "#70983A",
      "--KeyText": "#4B6B1F",
      "--NoteBG": "#EAF2F5",
      "--NoteFrame": "#4B879B",
      "--NoteText": "#2B5664",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6EB",
      "--WarningFrame": "#B2345E",
      "--WarningText": "#6D1734",
      "--ImportantText": "#117811",
      "--HighlightBG": "#D9F2DF"
    }
  },
  {
    "id": 27,
    "num": 27,
    "name": "ليموني",
    "vars": {
      "--PageBG": "#F6F7F3",
      "--HeaderColor": "#47511F",
      "--SectionBG": "#687B24",
      "--SectionFrame": "#3B4610",
      "--KeyBG": "#E5EAF5",
      "--KeyFrame": "#4363B1",
      "--KeyText": "#1F356B",
      "--NoteBG": "#F5EAEF",
      "--NoteFrame": "#9B4B6F",
      "--NoteText": "#642B45",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4E6",
      "--WarningFrame": "#33A22F",
      "--WarningText": "#1A6D17",
      "--ImportantText": "#33148F",
      "--HighlightBG": "#E7D9F2"
    }
  },
  {
    "id": 28,
    "num": 28,
    "name": "أزرق سماء",
    "vars": {
      "--PageBG": "#F3F5F7",
      "--HeaderColor": "#1F3851",
      "--SectionBG": "#3678BA",
      "--SectionFrame": "#205488",
      "--KeyBG": "#F5E5E5",
      "--KeyFrame": "#B14343",
      "--KeyText": "#6B1F1F",
      "--NoteBG": "#ECF5EA",
      "--NoteFrame": "#589B4B",
      "--NoteText": "#34642B",
      "--BodyText": "#000000",
      "--WarningBG": "#EAE6F4",
      "--WarningFrame": "#5334B2",
      "--WarningText": "#2D176D",
      "--ImportantText": "#8F5214",
      "--HighlightBG": "#F2EED9"
    }
  },
  {
    "id": 29,
    "num": 29,
    "name": "توتي فروتي",
    "vars": {
      "--PageBG": "#F7F3F3",
      "--HeaderColor": "#511F29",
      "--SectionBG": "#C8415D",
      "--SectionFrame": "#9D253E",
      "--KeyBG": "#E5F5EA",
      "--KeyFrame": "#3C9F59",
      "--KeyText": "#1F6B35",
      "--NoteBG": "#ECEAF5",
      "--NoteFrame": "#554B9B",
      "--NoteText": "#322B64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4EEE6",
      "--WarningFrame": "#B27834",
      "--WarningText": "#6D4617",
      "--ImportantText": "#117474",
      "--HighlightBG": "#D9EFF2"
    }
  },
  {
    "id": 30,
    "num": 30,
    "name": "أخضر زمردي 2",
    "vars": {
      "--PageBG": "#F3F7F3",
      "--HeaderColor": "#1F5123",
      "--SectionBG": "#27862F",
      "--SectionFrame": "#135319",
      "--KeyBG": "#EFE5F5",
      "--KeyFrame": "#8443B1",
      "--KeyText": "#4B1F6B",
      "--NoteBG": "#F5EFEA",
      "--NoteFrame": "#9B6C4B",
      "--NoteText": "#64432B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4F2",
      "--WarningFrame": "#2E9E8B",
      "--WarningText": "#176D5F",
      "--ImportantText": "#8F148F",
      "--HighlightBG": "#F2D9E8"
    }
  },
  {
    "id": 31,
    "num": 31,
    "name": "بنفسجي ملكي",
    "vars": {
      "--PageBG": "#F4F3F7",
      "--HeaderColor": "#321F51",
      "--SectionBG": "#7441C8",
      "--SectionFrame": "#52259D",
      "--KeyBG": "#F5F3E5",
      "--KeyFrame": "#988C3A",
      "--KeyText": "#6B611F",
      "--NoteBG": "#EAF5F2",
      "--NoteFrame": "#4B9B84",
      "--NoteText": "#2B6453",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6F2",
      "--WarningFrame": "#B234A2",
      "--WarningText": "#6D1762",
      "--ImportantText": "#587010",
      "--HighlightBG": "#E0F2D9"
    }
  },
  {
    "id": 32,
    "num": 32,
    "name": "كهرماني",
    "vars": {
      "--PageBG": "#F7F6F3",
      "--HeaderColor": "#51411F",
      "--SectionBG": "#8E6D29",
      "--SectionFrame": "#5B4415",
      "--KeyBG": "#E5F2F5",
      "--KeyFrame": "#4198AA",
      "--KeyText": "#1F5E6B",
      "--NoteBG": "#F5EAF5",
      "--NoteFrame": "#9B4B9B",
      "--NoteText": "#642B64",
      "--BodyText": "#000000",
      "--WarningBG": "#EEF4E6",
      "--WarningFrame": "#6C9A2D",
      "--WarningText": "#496D17",
      "--ImportantText": "#14338F",
      "--HighlightBG": "#D9D9F2"
    }
  },
  {
    "id": 33,
    "num": 33,
    "name": "تركواز",
    "vars": {
      "--PageBG": "#F3F7F7",
      "--HeaderColor": "#1F514F",
      "--SectionBG": "#257E7B",
      "--SectionFrame": "#114A48",
      "--KeyBG": "#F5E5EE",
      "--KeyFrame": "#B1437F",
      "--KeyText": "#6B1F48",
      "--NoteBG": "#F2F5EA",
      "--NoteFrame": "#809749",
      "--NoteText": "#53642B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6EAF4",
      "--WarningFrame": "#3457B2",
      "--WarningText": "#17306D",
      "--ImportantText": "#8F1414",
      "--HighlightBG": "#F2E0D9"
    }
  },
  {
    "id": 34,
    "num": 34,
    "name": "فوشيا 2",
    "vars": {
      "--PageBG": "#F7F3F6",
      "--HeaderColor": "#511F45",
      "--SectionBG": "#C639A2",
      "--SectionFrame": "#952378",
      "--KeyBG": "#E9F5E5",
      "--KeyFrame": "#539B3B",
      "--KeyText": "#326B1F",
      "--NoteBG": "#EAEFF5",
      "--NoteFrame": "#4B6C9B",
      "--NoteText": "#2B4364",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6E6",
      "--WarningFrame": "#B23434",
      "--WarningText": "#6D1817",
      "--ImportantText": "#11782B",
      "--HighlightBG": "#D9F2E8"
    }
  },
  {
    "id": 35,
    "num": 35,
    "name": "أخضر ربيعي 2",
    "vars": {
      "--PageBG": "#F5F7F3",
      "--HeaderColor": "#36511F",
      "--SectionBG": "#508226",
      "--SectionFrame": "#2E4E12",
      "--KeyBG": "#E6E5F5",
      "--KeyFrame": "#4843B1",
      "--KeyText": "#221F6B",
      "--NoteBG": "#F5EAEC",
      "--NoteFrame": "#9B4B54",
      "--NoteText": "#642B32",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4EA",
      "--WarningFrame": "#2FA251",
      "--WarningText": "#176D30",
      "--ImportantText": "#52148F",
      "--HighlightBG": "#EFD9F2"
    }
  },
  {
    "id": 36,
    "num": 36,
    "name": "أزرق نيلي 2",
    "vars": {
      "--PageBG": "#F3F3F7",
      "--HeaderColor": "#1F2751",
      "--SectionBG": "#4157C8",
      "--SectionFrame": "#25399D",
      "--KeyBG": "#F5EBE5",
      "--KeyFrame": "#B16843",
      "--KeyText": "#6B381F",
      "--NoteBG": "#EAF5EC",
      "--NoteFrame": "#4B9B58",
      "--NoteText": "#2B6435",
      "--BodyText": "#000000",
      "--WarningBG": "#EEE6F4",
      "--WarningFrame": "#7E34B2",
      "--WarningText": "#4A176D",
      "--ImportantText": "#6B6B0F",
      "--HighlightBG": "#EEF2D9"
    }
  },
  {
    "id": 37,
    "num": 37,
    "name": "أحمر مرجاني 2",
    "vars": {
      "--PageBG": "#F7F3F3",
      "--HeaderColor": "#51251F",
      "--SectionBG": "#C64B39",
      "--SectionFrame": "#953123",
      "--KeyBG": "#E5F5EF",
      "--KeyFrame": "#3B9B77",
      "--KeyText": "#1F6B4F",
      "--NoteBG": "#EFEAF5",
      "--NoteFrame": "#704B9B",
      "--NoteText": "#452B64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4F3E6",
      "--WarningFrame": "#9A8D2D",
      "--WarningText": "#6D6317",
      "--ImportantText": "#117474",
      "--HighlightBG": "#D9E6F2"
    }
  },
  {
    "id": 38,
    "num": 38,
    "name": "أخضر زمردي 3",
    "vars": {
      "--PageBG": "#F3F7F4",
      "--HeaderColor": "#1F5134",
      "--SectionBG": "#26824D",
      "--SectionFrame": "#124E2C",
      "--KeyBG": "#F4E5F5",
      "--KeyFrame": "#A943B1",
      "--KeyText": "#651F6B",
      "--NoteBG": "#F5F2EA",
      "--NoteFrame": "#9B874B",
      "--NoteText": "#64562B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F2F4",
      "--WarningFrame": "#3298AE",
      "--WarningText": "#175E6D",
      "--ImportantText": "#8F1470",
      "--HighlightBG": "#F2D9DF"
    }
  },
  {
    "id": 39,
    "num": 39,
    "name": "أرجواني 2",
    "vars": {
      "--PageBG": "#F6F3F7",
      "--HeaderColor": "#431F51",
      "--SectionBG": "#A141C8",
      "--SectionFrame": "#7A259D",
      "--KeyBG": "#F2F5E5",
      "--KeyFrame": "#809438",
      "--KeyText": "#5B6B1F",
      "--NoteBG": "#EAF5F5",
      "--NoteFrame": "#4B979B",
      "--NoteText": "#2B6164",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6EE",
      "--WarningFrame": "#B23478",
      "--WarningText": "#6D1746",
      "--ImportantText": "#2B7811",
      "--HighlightBG": "#D9F2DA"
    }
  },
  {
    "id": 40,
    "num": 40,
    "name": "ذهبي فاتح 2",
    "vars": {
      "--PageBG": "#F7F7F3",
      "--HeaderColor": "#51511F",
      "--SectionBG": "#767722",
      "--SectionFrame": "#424210",
      "--KeyBG": "#E5EDF5",
      "--KeyFrame": "#437AB1",
      "--KeyText": "#1F456B",
      "--NoteBG": "#F5EAF1",
      "--NoteFrame": "#9B4B80",
      "--NoteText": "#642B51",
      "--BodyText": "#000000",
      "--WarningBG": "#E9F4E6",
      "--WarningFrame": "#4AA22F",
      "--WarningText": "#2C6D17",
      "--ImportantText": "#14148F",
      "--HighlightBG": "#E2D9F2"
    }
  },
  {
    "id": 41,
    "num": 41,
    "name": "سماوي 2",
    "vars": {
      "--PageBG": "#F3F6F7",
      "--HeaderColor": "#1F4251",
      "--SectionBG": "#2E7D9E",
      "--SectionFrame": "#19536B",
      "--KeyBG": "#F5E5E8",
      "--KeyFrame": "#B1435A",
      "--KeyText": "#6B1F2F",
      "--NoteBG": "#EEF5EA",
      "--NoteFrame": "#689B4B",
      "--NoteText": "#40642B",
      "--BodyText": "#000000",
      "--WarningBG": "#E7E6F4",
      "--WarningFrame": "#3934B2",
      "--WarningText": "#1B176D",
      "--ImportantText": "#8F3314",
      "--HighlightBG": "#F2E9D9"
    }
  },
  {
    "id": 42,
    "num": 42,
    "name": "وردي غامق",
    "vars": {
      "--PageBG": "#F7F3F4",
      "--HeaderColor": "#511F34",
      "--SectionBG": "#C84179",
      "--SectionFrame": "#9D2556",
      "--KeyBG": "#E5F5E7",
      "--KeyFrame": "#3C9F45",
      "--KeyText": "#1F6B26",
      "--NoteBG": "#EAEBF5",
      "--NoteFrame": "#4B519B",
      "--NoteText": "#2B2F64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4EBE6",
      "--WarningFrame": "#B25E34",
      "--WarningText": "#6D3417",
      "--ImportantText": "#11745B",
      "--HighlightBG": "#D9F2F0"
    }
  },
  {
    "id": 43,
    "num": 43,
    "name": "أخضر ربيعي 3",
    "vars": {
      "--PageBG": "#F3F7F3",
      "--HeaderColor": "#25511F",
      "--SectionBG": "#318226",
      "--SectionFrame": "#1A4E12",
      "--KeyBG": "#EBE5F5",
      "--KeyFrame": "#6D43B1",
      "--KeyText": "#3C1F6B",
      "--NoteBG": "#F5EDEA",
      "--NoteFrame": "#9B5C4B",
      "--NoteText": "#64372B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4EF",
      "--WarningFrame": "#2E9E75",
      "--WarningText": "#176D4E",
      "--ImportantText": "#8F148F",
      "--HighlightBG": "#F2D9ED"
    }
  },
  {
    "id": 44,
    "num": 44,
    "name": "بنفسجي ملكي 2",
    "vars": {
      "--PageBG": "#F3F3F7",
      "--HeaderColor": "#271F51",
      "--SectionBG": "#5841C8",
      "--SectionFrame": "#39259D",
      "--KeyBG": "#F5F0E5",
      "--KeyFrame": "#AA8741",
      "--KeyText": "#6B521F",
      "--NoteBG": "#EAF5F0",
      "--NoteFrame": "#4B9B73",
      "--NoteText": "#2B6448",
      "--BodyText": "#000000",
      "--WarningBG": "#F3E6F4",
      "--WarningFrame": "#A834B2",
      "--WarningText": "#67176D",
      "--ImportantText": "#6B6B0F",
      "--HighlightBG": "#E5F2D9"
    }
  },
  {
    "id": 45,
    "num": 45,
    "name": "برتقالي دافئ 2",
    "vars": {
      "--PageBG": "#F7F5F3",
      "--HeaderColor": "#51361F",
      "--SectionBG": "#A2642F",
      "--SectionFrame": "#70421A",
      "--KeyBG": "#E5F5F5",
      "--KeyFrame": "#3B9B98",
      "--KeyText": "#1F6B68",
      "--NoteBG": "#F3EAF5",
      "--NoteFrame": "#8A4B9B",
      "--NoteText": "#582B64",
      "--BodyText": "#000000",
      "--WarningBG": "#F1F4E6",
      "--WarningFrame": "#80962C",
      "--WarningText": "#5B6D17",
      "--ImportantText": "#14528F",
      "--HighlightBG": "#D9DEF2"
    }
  },
  {
    "id": 46,
    "num": 46,
    "name": "نعناعي غامق 2",
    "vars": {
      "--PageBG": "#F3F7F6",
      "--HeaderColor": "#1F5145",
      "--SectionBG": "#26826C",
      "--SectionFrame": "#124E40",
      "--KeyBG": "#F5E5F1",
      "--KeyFrame": "#B14395",
      "--KeyText": "#6B1F57",
      "--NoteBG": "#F4F5EA",
      "--NoteFrame": "#8D9447",
      "--NoteText": "#5F642B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6EDF4",
      "--WarningFrame": "#3471B2",
      "--WarningText": "#17416D",
      "--ImportantText": "#8F1433",
      "--HighlightBG": "#F2DBD9"
    }
  },
  {
    "id": 47,
    "num": 47,
    "name": "موف 2",
    "vars": {
      "--PageBG": "#F7F3F7",
      "--HeaderColor": "#511F4F",
      "--SectionBG": "#BE37B8",
      "--SectionFrame": "#8C2188",
      "--KeyBG": "#ECF5E5",
      "--KeyFrame": "#679B3B",
      "--KeyText": "#416B1F",
      "--NoteBG": "#EAF1F5",
      "--NoteFrame": "#4B7C9B",
      "--NoteText": "#2B4E64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6E9",
      "--WarningFrame": "#B2344E",
      "--WarningText": "#6D1729",
      "--ImportantText": "#117811",
      "--HighlightBG": "#D9F2E2"
    }
  },
  {
    "id": 48,
    "num": 48,
    "name": "ليموني 2",
    "vars": {
      "--PageBG": "#F6F7F3",
      "--HeaderColor": "#40511F",
      "--SectionBG": "#607E25",
      "--SectionFrame": "#374A11",
      "--KeyBG": "#E5E8F5",
      "--KeyFrame": "#4355B1",
      "--KeyText": "#1F2B6B",
      "--NoteBG": "#F5EAEE",
      "--NoteFrame": "#9B4B65",
      "--NoteText": "#642B3E",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4E7",
      "--WarningFrame": "#2FA239",
      "--WarningText": "#176D1F",
      "--ImportantText": "#33148F",
      "--HighlightBG": "#EAD9F2"
    }
  },
  {
    "id": 49,
    "num": 49,
    "name": "أزرق سماء 2",
    "vars": {
      "--PageBG": "#F3F4F7",
      "--HeaderColor": "#1F3251",
      "--SectionBG": "#4173C8",
      "--SectionFrame": "#25519D",
      "--KeyBG": "#F5E7E5",
      "--KeyFrame": "#B15243",
      "--KeyText": "#6B291F",
      "--NoteBG": "#EBF5EA",
      "--NoteFrame": "#4E9B4B",
      "--NoteText": "#2D642B",
      "--BodyText": "#000000",
      "--WarningBG": "#EBE6F4",
      "--WarningFrame": "#6434B2",
      "--WarningText": "#38176D",
      "--ImportantText": "#7D6212",
      "--HighlightBG": "#F2F1D9"
    }
  },
  {
    "id": 50,
    "num": 50,
    "name": "توتي فروتي 2",
    "vars": {
      "--PageBG": "#F7F3F3",
      "--HeaderColor": "#511F23",
      "--SectionBG": "#C8414C",
      "--SectionFrame": "#9D252E",
      "--KeyBG": "#E5F5EC",
      "--KeyFrame": "#3C9F66",
      "--KeyText": "#1F6B3F",
      "--NoteBG": "#EDEAF5",
      "--NoteFrame": "#5F4B9B",
      "--NoteText": "#392B64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4F0E6",
      "--WarningFrame": "#AE8532",
      "--WarningText": "#6D5117",
      "--ImportantText": "#117474",
      "--HighlightBG": "#D9ECF2"
    }
  },
  {
    "id": 51,
    "num": 51,
    "name": "أخضر زمردي 4",
    "vars": {
      "--PageBG": "#F3F7F4",
      "--HeaderColor": "#1F512A",
      "--SectionBG": "#27863B",
      "--SectionFrame": "#135321",
      "--KeyBG": "#F1E5F5",
      "--KeyFrame": "#9243B1",
      "--KeyText": "#551F6B",
      "--NoteBG": "#F5F0EA",
      "--NoteFrame": "#9B764B",
      "--NoteText": "#644A2B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4F4",
      "--WarningFrame": "#2E9E9A",
      "--WarningText": "#176D6A",
      "--ImportantText": "#8F1470",
      "--HighlightBG": "#F2D9E4"
    }
  },
  {
    "id": 52,
    "num": 52,
    "name": "أرجواني 3",
    "vars": {
      "--PageBG": "#F5F3F7",
      "--HeaderColor": "#381F51",
      "--SectionBG": "#8541C8",
      "--SectionFrame": "#61259D",
      "--KeyBG": "#F5F5E5",
      "--KeyFrame": "#909037",
      "--KeyText": "#6A6B1F",
      "--NoteBG": "#EAF5F3",
      "--NoteFrame": "#49978B",
      "--NoteText": "#2B645B",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6F1",
      "--WarningFrame": "#B23492",
      "--WarningText": "#6D1758",
      "--ImportantText": "#427411",
      "--HighlightBG": "#DDF2D9"
    }
  },
  {
    "id": 53,
    "num": 53,
    "name": "كهرماني 2",
    "vars": {
      "--PageBG": "#F7F6F3",
      "--HeaderColor": "#51471F",
      "--SectionBG": "#867327",
      "--SectionFrame": "#534613",
      "--KeyBG": "#E5F0F5",
      "--KeyFrame": "#4391B1",
      "--KeyText": "#1F546B",
      "--NoteBG": "#F5EAF4",
      "--NoteFrame": "#9B4B90",
      "--NoteText": "#642B5D",
      "--BodyText": "#000000",
      "--WarningBG": "#ECF4E6",
      "--WarningFrame": "#609E2E",
      "--WarningText": "#3E6D17",
      "--ImportantText": "#14338F",
      "--HighlightBG": "#DCD9F2"
    }
  },
  {
    "id": 54,
    "num": 54,
    "name": "تركواز 2",
    "vars": {
      "--PageBG": "#F3F7F7",
      "--HeaderColor": "#1F4D51",
      "--SectionBG": "#277E86",
      "--SectionFrame": "#134D53",
      "--KeyBG": "#F5E5EC",
      "--KeyFrame": "#B14371",
      "--KeyText": "#6B1F3E",
      "--NoteBG": "#F1F5EA",
      "--NoteFrame": "#769749",
      "--NoteText": "#4C642B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6E8F4",
      "--WarningFrame": "#3449B2",
      "--WarningText": "#17256D",
      "--ImportantText": "#8F1414",
      "--HighlightBG": "#F2E3D9"
    }
  },
  {
    "id": 55,
    "num": 55,
    "name": "فوشيا 3",
    "vars": {
      "--PageBG": "#F7F3F5",
      "--HeaderColor": "#511F3E",
      "--SectionBG": "#C73D93",
      "--SectionFrame": "#99246C",
      "--KeyBG": "#E7F5E5",
      "--KeyFrame": "#489F3C",
      "--KeyText": "#286B1F",
      "--NoteBG": "#EAEDF5",
      "--NoteFrame": "#4B629B",
      "--NoteText": "#2B3B64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E8E6",
      "--WarningFrame": "#B24434",
      "--WarningText": "#6D2217",
      "--ImportantText": "#117845",
      "--HighlightBG": "#D9F2EB"
    }
  },
  {
    "id": 56,
    "num": 56,
    "name": "أخضر ربيعي 4",
    "vars": {
      "--PageBG": "#F4F7F3",
      "--HeaderColor": "#2F511F",
      "--SectionBG": "#448226",
      "--SectionFrame": "#264E12",
      "--KeyBG": "#E8E5F5",
      "--KeyFrame": "#5643B1",
      "--KeyText": "#2C1F6B",
      "--NoteBG": "#F5EAEA",
      "--NoteFrame": "#9B4B4B",
      "--NoteText": "#642B2B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F4EC",
      "--WarningFrame": "#2FA260",
      "--WarningText": "#176D3C",
      "--ImportantText": "#70148F",
      "--HighlightBG": "#F2D9F2"
    }
  },
  {
    "id": 57,
    "num": 57,
    "name": "أزرق نيلي 3",
    "vars": {
      "--PageBG": "#F3F3F7",
      "--HeaderColor": "#1F2151",
      "--SectionBG": "#4146C8",
      "--SectionFrame": "#25299D",
      "--KeyBG": "#F5EDE5",
      "--KeyFrame": "#B17643",
      "--KeyText": "#6B421F",
      "--NoteBG": "#EAF5EE",
      "--NoteFrame": "#4B9B62",
      "--NoteText": "#2B643C",
      "--BodyText": "#000000",
      "--WarningBG": "#F0E6F4",
      "--WarningFrame": "#8E34B2",
      "--WarningText": "#55176D",
      "--ImportantText": "#6B6B0F",
      "--HighlightBG": "#EBF2D9"
    }
  },
  {
    "id": 58,
    "num": 58,
    "name": "برتقالي دافئ 3",
    "vars": {
      "--PageBG": "#F7F4F3",
      "--HeaderColor": "#512C1F",
      "--SectionBG": "#BA5836",
      "--SectionFrame": "#883B20",
      "--KeyBG": "#E5F5F1",
      "--KeyFrame": "#3B9B84",
      "--KeyText": "#1F6B58",
      "--NoteBG": "#F1EAF5",
      "--NoteFrame": "#7A4B9B",
      "--NoteText": "#4C2B64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4F4E6",
      "--WarningFrame": "#91922A",
      "--WarningText": "#6D6D17",
      "--ImportantText": "#14708F",
      "--HighlightBG": "#D9E3F2"
    }
  },
  {
    "id": 59,
    "num": 59,
    "name": "نعناعي غامق 3",
    "vars": {
      "--PageBG": "#F3F7F5",
      "--HeaderColor": "#1F513A",
      "--SectionBG": "#268259",
      "--SectionFrame": "#124E33",
      "--KeyBG": "#F5E5F4",
      "--KeyFrame": "#B143AC",
      "--KeyText": "#6B1F67",
      "--NoteBG": "#F5F4EA",
      "--NoteFrame": "#978E49",
      "--NoteText": "#645D2B",
      "--BodyText": "#000000",
      "--WarningBG": "#E6F0F4",
      "--WarningFrame": "#348BB2",
      "--WarningText": "#17536D",
      "--ImportantText": "#8F1452",
      "--HighlightBG": "#F2D9DC"
    }
  },
  {
    "id": 60,
    "num": 60,
    "name": "موف 3",
    "vars": {
      "--PageBG": "#F6F3F7",
      "--HeaderColor": "#491F51",
      "--SectionBG": "#B241C8",
      "--SectionFrame": "#8A259D",
      "--KeyBG": "#F0F5E5",
      "--KeyFrame": "#78983A",
      "--KeyText": "#516B1F",
      "--NoteBG": "#EAF3F5",
      "--NoteFrame": "#4B8D9B",
      "--NoteText": "#2B5A64",
      "--BodyText": "#000000",
      "--WarningBG": "#F4E6EC",
      "--WarningFrame": "#B23468",
      "--WarningText": "#6D173B",
      "--ImportantText": "#2B7811",
      "--HighlightBG": "#D9F2DD"
    }
  }
];


function getPalette(paletteId) {
  const num = Number(paletteId) || 1;
  return THIQA_PALETTES.find((p) => p.num === num) || THIQA_PALETTES[0];
}

/* =================================================================
   THEME FLAVORS & SKINS
================================================================== */
const FLAVORS = {
  normal: {
    en: "Normal",
    ar: "عادي",
    light: {
      canvas: "#F3EAD9",
      header: "#DCE9DC", // Restored soft sage green header
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

function skinBorderColor(skin, theme) {
  if (skin.id === "glass") return theme.hairlineStrong;
  if (skin.id === "pixel") return theme.ink;
  return theme.hairline;
}
function hexToRgba(hex, alpha) {
  const h = (hex || "#000000").replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function skinSurface(skin, theme, soft) {
  const base = soft ? theme.surfaceSoft : theme.surface;
  if (skin.surfaceAlpha >= 1) return base;
  const hex = base.replace("#", "");
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${skin.surfaceAlpha})`;
  }
  return base;
}
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
   Question-type palette — 13 types
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

/* =================================================================
   Chrome copy
================================================================== */
const UI = {
  en: {
    dir: "ltr",
    htmlLang: "en",
    displayFont: "'Space Mono', ui-monospace, monospace",
    bodyFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    brand: "EDUcraft",
    langToggle: "AR",
    navLibrary: "Library",
    navTree: "Tree",
    navEditor: "Studio",
    navBags: "Bags",
    allBags: "All Bags",
    newBag: "New Bag",
    typeAll: "All Items",
    typeBook: "Books",
    typeEncyclopedia: "Encyclopedias",
    palettePicker: "60 Blades (Palettes)",
    relatedQuestion: "Related Question",
    relatedInfo: "Related Info",
    importedFrom: "Imported from",
    jumpTo: "Jump to",
    addTable: "Add Table",
    createItem: "Create Book / Encyclopedia",
    libraryKicker: "Your Educational Bags & Shelf",
    libraryTitle: "Books, Encyclopedias & Bags.",
    librarySub: "Organize knowledge into Bags, explore knowledge trees, and edit structured A4 learning plates.",
    branchesLabel: "branches",
    questionsLabel: "questions",
    openBook: "Open tree",
    backToLibrary: "Library",
    treeEyebrow: "Knowledge tree",
    treeSub: "Branches split into sub-branches. Select a leaf to open its question card or edit its A4 plate.",
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
    settingsResetConfirm: "This clears all saved progress, plans, covers, and preferences on this device. Continue?",
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
    settingsFlavorSub: "The color mood — works with any theme.",
    treeExportCta: "Export as HTML",
    hideEditorPanel: "Hide Sidebar",
    showEditorPanel: "Show Sidebar",
    thumbnailsTitle: "Page Previews",
    printA4: "Print / Export A4",
  },
  ar: {
    dir: "rtl",
    htmlLang: "ar",
    displayFont: "'Cairo', 'Tajawal', sans-serif",
    bodyFont: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
    brand: "EDUcraft",
    langToggle: "EN",
    navLibrary: "المكتبة",
    navTree: "الشجرة",
    navEditor: "الاستوديو",
    navBags: "الشنط",
    allBags: "كل الشنط",
    newBag: "شنطة جديدة",
    typeAll: "كل العناصر",
    typeBook: "الكتب",
    typeEncyclopedia: "الموسوعات",
    palettePicker: "الباليتات الستين (ثِقة)",
    relatedQuestion: "سؤال مرتبط",
    relatedInfo: "معلومة مرتبطة",
    importedFrom: "مستورد من",
    jumpTo: "انتقل إلى",
    addTable: "إضافة جدول",
    createItem: "إنشاء كتاب / موسوعة",
    libraryKicker: "بيئاتك وشنطك التعليمية",
    libraryTitle: "كتب، موسوعات، وشنط تعليمية.",
    librarySub: "نظّم كتبك وموسوعاتك داخل شنط، استكشف أشجار المعرفة، وحرر صفحات A4 الملوّنة بالباليتات الستين.",
    branchesLabel: "فروع",
    questionsLabel: "أسئلة",
    openBook: "افتح الشجرة",
    backToLibrary: "المكتبة",
    treeEyebrow: "شجرة المعرفة",
    treeSub: "الفروع تتفرّع لفروع أصغر. اختار ورقة عشان تفتح كارد أسئلتها أو تحرر صفحتها المطبوعة A4.",
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
    settingsDataSub: "بياناتك وتفضيلاتك بتتحفظ أوتوماتيك على الجهاز ده.",
    settingsResetLabel: "إعادة ضبط كل حاجة",
    settingsResetConfirm: "ده هيمسح كل التقدم المحفوظ والتفضيلات على الجهاز ده. تكمل؟",
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
    treeExportCta: "صدّر كملف HTML",
    hideEditorPanel: "إخفاء القائمة",
    showEditorPanel: "إظهار القائمة",
    thumbnailsTitle: "معاينة الصفحات",
    printA4: "طباعة / تصدير A4",
  },
};

const DEFAULT_BAGS = [
  { id: "bag-frontend", en: "Web Development Bag", ar: "شنطة تطوير الويب", icon: "code" },
  { id: "bag-science", en: "Computer Science Bag", ar: "شنطة علوم الحاسوب", icon: "cpu" },
];

const VB_W = 800;
const VB_H = 300;
const BRANCH_Y = 44;
const SUB_Y = 156;
const LEAF_Y = 262;

const INITIAL_BOOKS = [
  {
    id: "web-foundations",
    type: "book",
    bagId: "bag-frontend",
    paletteId: 1,
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
        paletteId: 1,
        pageBlocks: [
          { id: "a1a-b0", kind: "titleBlock", title: "أساسيات الويب", sub: "المحاضرة الأولى: القوائم والجداول" },
          { id: "a1a-b1", kind: "sectionTitle", text: "قوائم HTML وتنسيقها" },
          { id: "a1a-b2", kind: "keyterm", title: "عنصر القائمة المرقّمة <ol>", text: "يُستخدم عنصر <ol> لإنشاء قوائم مرتبة تلقائيًا بأرقام أو أحرف.", linkedQuestionId: "a1a-q0" },
          { id: "a1a-b3", kind: "note", title: "ملاحظة هامة", text: "يمكن التحكم في لون النص عبر خاصية CSS color المباشرة.", linkedQuestionId: "a1a-q1" },
          { id: "a1a-b4", kind: "code", title: "مثال كود", lang: "html", code: "<ol>\n  <li>عنصر أول</li>\n  <li>عنصر ثاني</li>\n</ol>" },
        ],
        questions: [
          {
            id: "a1a-q0",
            type: "single",
            subject: "HTML",
            difficulty: "Beginner",
            tier: "core",
            dir: "ltr",
            linkedBlockId: "a1a-b2",
            en: { prompt: "Which HTML element defines an ordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correct: 1 },
            ar: { prompt: "أنهي عنصر HTML بيعرّف قائمة مرقّمة؟", options: ["<ul>", "<ol>", "<li>", "<dl>"], correct: 1 },
          },
          {
            id: "a1a-q1",
            type: "short",
            subject: "CSS",
            difficulty: "Beginner",
            tier: "core",
            dir: "ltr",
            linkedBlockId: "a1a-b3",
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
        paletteId: 1,
        pageBlocks: [
          { id: "a1b-b1", kind: "sectionTitle", text: "الروابط التشعبية Hyperlinks" },
          { id: "a1b-b2", kind: "keyterm", title: "الوسم <a> والخاصية href", text: "الوسم <a> يُعرّف رابط تشعبي، وتُحدد الخاصية href عنوان الوجهة المقصود.", linkedQuestionId: "a1b-q0" },
        ],
        questions: [
          {
            id: "a1b-q0",
            type: "fill",
            subject: "HTML",
            difficulty: "Beginner",
            tier: "core",
            dir: "ltr",
            linkedBlockId: "a1b-b2",
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
        paletteId: 1,
        questions: [
          {
            id: "a2a-q0",
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
        paletteId: 1,
        cards: [
          {
            id: "b1a-card1",
            image: "https://picsum.photos/seed/flexbox-diagram/640/360",
            imagePosition: "top",
            questions: [
              {
                id: "b1a-q0",
                type: "single",
                subject: "CSS",
                difficulty: "Intermediate",
                tier: "core",
                dir: "ltr",
                en: { prompt: "Which property controls the gap between a flex container's items?", options: ["gap", "margin", "align-items", "justify-content"], correct: 0 },
                ar: { prompt: "أنهي خاصية بتتحكم في المسافة بين عناصر الـ flex container؟", options: ["gap", "margin", "align-items", "justify-content"], correct: 0 },
              },
              {
                id: "b1a-q1",
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
        paletteId: 1,
        questions: [
          {
            id: "b1b-q0",
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
        paletteId: 1,
        questions: [
          {
            id: "b1c-q0",
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
        paletteId: 1,
        questions: [
          {
            id: "b2a-q0",
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
    type: "encyclopedia",
    bagId: "bag-science",
    paletteId: 2,
    cover: { from: "#6EE7B7", to: "#1F6B47", icon: "brackets" },
    en: { title: "JavaScript Deep Dive Encyclopedia", tagline: "Arrays, async, and a gut check." },
    ar: { title: "موسوعة جافاسكريبت بعمق", tagline: "مصفوفات، برمجة غير متزامنة، وتقييم ذاتي." },
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
        paletteId: 2,
        pageBlocks: [
          { id: "a1a-b0", kind: "titleBlock", title: "JavaScript Pro", sub: "Array Mastery & Asynchronous Execution" },
          { id: "a1a-b1", kind: "sectionTitle", text: "دوال المصفوفات في JavaScript" },
          { id: "a1a-b2", kind: "keyterm", title: "الدالة Array.find()", text: "تُرجع دالة find أول عنصر في المصفوفة يُحقق شرط دالة الاختبار المُمررة.", linkedQuestionId: "a1a-q0" },
          { id: "a1a-b3", kind: "important", title: "باراميترات reduce", text: "يقبل callback دالة reduce أربعة باراميترات كحد أقصى: accumulator, currentValue, currentIndex, array.", linkedQuestionId: "a1a-q1" },
          { id: "a1a-b4", kind: "code", title: "كود Array Methods", lang: "javascript", code: "const nums = [1, 2, 3, 4];\nconst even = nums.find(n => n % 2 === 0);\nconsole.log(even); // 2" },
        ],
        cards: [
          {
            id: "a1a-card1",
            image: "https://picsum.photos/seed/array-methods/480/480",
            imagePosition: "right",
            questions: [
              {
                id: "a1a-q0",
                type: "cloze",
                subject: "JavaScript",
                difficulty: "Intermediate",
                tier: "extra",
                dir: "rtl",
                linkedBlockId: "a1a-b2",
                en: { template: "The ___ method returns the first array element that satisfies a condition.", bank: ["find", "filter", "map", "reduce"], correct: "find" },
                ar: { template: "الدالة ___ بترجع أول عنصر في المصفوفة بيحقق شرط معيّن.", bank: ["find", "filter", "map", "reduce"], correct: "find" },
              },
              {
                id: "a1a-q1",
                type: "numeric",
                subject: "JavaScript",
                difficulty: "Advanced",
                tier: "advanced",
                dir: "ltr",
                linkedBlockId: "a1a-b3",
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
        paletteId: 2,
        questions: [
          {
            id: "a2a-q0",
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
        paletteId: 2,
        questions: [
          {
            id: "b1a-q0",
            type: "rating",
            subject: "Self-check",
            difficulty: "Reflection",
            tier: "extra",
            dir: "ltr",
            en: { prompt: "How confident do you feel about CSS Grid right now?" },
            ar: { prompt: "أد ايه إحساسك بالثقة في CSS Grid دلوقتي؟" },
          },
          {
            id: "b1a-q1",
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
      return (c.accepted || []).includes(String(value || "").trim().toLowerCase());
    case "fill":
      return (c.blanks || []).every((b, i) => (value[i] || "").trim().toLowerCase() === b.toLowerCase());
    case "cloze":
      return value === c.correct;
    case "match":
      return c.left.every((_, i) => value[i] === c.correct[i]);
    case "order":
      return (c.correct || []).every((v, i) => value[i] === v);
    case "sort":
      return (c.items || []).every((it, i) => value[i] === it[1]);
    case "numeric":
      return Math.abs(Number(value) - c.correct) <= (c.tolerance ?? 0);
    case "slider":
      return Math.abs(Number(value) - c.correct) <= (c.tolerance ?? 0);
    default:
      return null;
  }
}

function leafCards(leaf) {
  if (leaf.cards && leaf.cards.length > 0) return leaf.cards;
  const questions = leaf.questions || [];
  return questions.map((q, i) => ({
    id: `${leaf.id}-auto-${i}`,
    image: (q.en && q.en.image) || (q.ar && q.ar.image) || q.image || null,
    imagePosition: "top",
    questions: [q],
  }));
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
      .replace(/[^\w؀-ۿ]+/g, "-")
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
   Pill Tab Button (Matches uploaded reference design)
================================================================== */
function PillTabButton({ active, onClick, icon: Icon, children, theme }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all duration-200 rounded-full ${
        active
          ? "bg-[#E8654A] text-white shadow-sm scale-105"
          : "bg-transparent hover:bg-black/5 text-current opacity-70 hover:opacity-100"
      }`}
      style={active ? { background: theme?.accent || "#E8654A", color: theme?.accentInk || "#ffffff" } : undefined}
    >
      {Icon && <Icon size={15} />}
      <span>{children}</span>
    </button>
  );
}

/* =================================================================
   PaletteSelectorModal — 60 Blades Picker
================================================================== */
function PaletteSelectorModal({ currentPaletteId, onSelectPalette, onClose, ui, theme, dir, skin }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return THIQA_PALETTES;
    return THIQA_PALETTES.filter((p) => String(p.num).includes(q) || p.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,16,10,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        dir={dir}
        className="educraft-modal-in w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6"
        style={{ ...panelStyle(skin, theme), boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Palette size={20} color={theme.accent} />
            <div>
              <h2 className="text-lg font-bold" style={{ color: theme.ink }}>
                {ui.palettePicker} (60 Blades)
              </h2>
              <p className="text-xs" style={{ color: theme.inkSoft }}>
                {dir === "rtl" ? "اختر من باليتات ثِقة الستين لصفحات A4" : "Select from the 60 Thiqa palettes for A4 plates"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-full hover:bg-black/10 transition-colors"
            style={{ color: theme.ink }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={15} className="absolute top-3 start-3 opacity-50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dir === "rtl" ? "ابحث بالرقم أو الاسم (مثلاً: 12، أزرق، كلاسيك...)" : "Search by number or name..."}
            className="w-full text-sm ps-9 pe-3 py-2 rounded-xl outline-none"
            style={{
              background: theme.canvas,
              color: theme.ink,
              border: `1px solid ${theme.hairlineStrong}`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[58vh] overflow-y-auto pe-1">
          {filtered.map((p) => {
            const isSelected = (currentPaletteId || 1) === p.num;
            const v = p.vars;
            return (
              <button
                key={p.num}
                type="button"
                onClick={() => {
                  onSelectPalette(p.num);
                  onClose();
                }}
                className={`flex flex-col text-start p-2.5 rounded-xl transition-all border ${
                  isSelected ? "ring-2 ring-offset-1 border-transparent scale-[1.02]" : "border-black/10 hover:border-black/25"
                }`}
                style={{
                  background: v["--PageBG"],
                  borderColor: isSelected ? theme.accent : undefined,
                  boxShadow: isSelected ? `0 0 0 2px ${theme.accent}` : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: v["--SectionBG"], color: "#fff" }}>
                    #{p.num}
                  </span>
                  <span className="text-xs font-bold truncate max-w-[120px]" style={{ color: v["--HeaderColor"] }}>
                    {p.name}
                  </span>
                </div>

                <div className="flex h-4 w-full rounded overflow-hidden shadow-inner border border-black/10">
                  <span className="flex-1" style={{ background: v["--SectionBG"] }} title="Section" />
                  <span className="flex-1" style={{ background: v["--KeyBG"] }} title="Keyterm" />
                  <span className="flex-1" style={{ background: v["--NoteBG"] }} title="Note" />
                  <span className="flex-1" style={{ background: v["--WarningBG"] }} title="Warning" />
                  <span className="flex-1" style={{ background: v["--HighlightBG"] }} title="Important" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   SHARED FEEDBACK & BUTTONS
================================================================== */
function FeedbackBanner({ ok, ui, onRetry, skin = SKINS.normal }) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 border-2 px-4 py-3 text-sm font-semibold shadow-sm"
      style={{
        borderRadius: skin.radiusLg,
        ...(ok ? { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.border } : { background: INCORRECT.bg, borderColor: INCORRECT.border, color: INCORRECT.border }),
      }}
    >
      {ok ? <Check size={16} /> : <X size={16} />}
      <span className="flex-1">{ok ? ui.correctMsg : ui.incorrectMsg}</span>
      <button
        onClick={onRetry}
        className="flex items-center gap-1 border-2 border-current px-3 py-1.5 text-xs font-bold transition-transform hover:scale-105"
        style={{ minHeight: 32, borderRadius: skin.radiusSm, background: "rgba(255,255,255,0.4)" }}
      >
        <RotateCcw size={12} /> {ui.tryAgain}
      </button>
    </div>
  );
}

function OptionBtn({ children, state, onClick, theme, dir, disabled, skin = SKINS.normal }) {
  let style = {
    borderColor: "rgba(0,0,0,0.15)",
    background: "rgba(255,255,255,0.72)",
    color: "inherit",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  };
  if (state === "correct") style = { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.border };
  else if (state === "incorrect") style = { background: INCORRECT.bg, borderColor: INCORRECT.border, color: INCORRECT.border };
  else if (state === "selected") style = { background: "rgba(20,21,26,0.92)", borderColor: "rgba(20,21,26,0.92)", color: "#ffffff" };
  return (
    <button
      dir={dir}
      onClick={onClick}
      disabled={disabled}
      className="w-full text-start border-2 px-4 py-3 text-sm font-medium transition-all hover:brightness-95 disabled:cursor-not-allowed"
      style={{ ...style, minHeight: 44, borderRadius: skin.radiusMd }}
    >
      {children}
    </button>
  );
}

/* =================================================================
   Question Bodies
================================================================== */
function SingleBody({ c, dir, value, setValue, checked, theme, skin = SKINS.normal }) {
  return (
    <div className="flex flex-col gap-2.5">
      {c.options?.map((opt, i) => {
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
      {c.options?.map((opt, i) => {
        let state;
        const chosen = value.includes(i);
        const correctChoice = c.correct?.includes(i);
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
        className="w-full rounded-2xl border-2 px-4 py-3 text-sm font-medium outline-none shadow-sm"
        style={{
          borderColor: checked ? (ok ? CORRECT.border : INCORRECT.border) : "rgba(0,0,0,0.18)",
          background: checked ? (ok ? CORRECT.bg : INCORRECT.bg) : "rgba(255,255,255,0.85)",
          color: "inherit",
          minHeight: 44,
        }}
      />
      {checked && !ok && (
        <p className="mt-2 text-sm font-bold opacity-80">
          {ui.accepted}: {c.accepted?.join(", ")}
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
        className="w-full resize-none rounded-2xl border-2 px-4 py-3 text-sm outline-none shadow-sm"
        style={{ borderColor: "rgba(0,0,0,0.18)", background: "rgba(255,255,255,0.85)", color: "inherit" }}
      />
      <button
        onClick={() => setReveal((r) => !r)}
        className="self-start rounded-full border-2 px-4 py-2 text-xs font-bold transition-all hover:bg-black/5"
        style={{ borderColor: "rgba(0,0,0,0.25)", color: "inherit", minHeight: 40 }}
      >
        {reveal ? ui.hideModel : ui.revealModel}
      </button>
      {reveal && (
        <div dir={dir} className="rounded-2xl border-2 px-4 py-3 text-sm leading-relaxed shadow-sm" style={{ background: ESSAY_BOX.bg, borderColor: ESSAY_BOX.border, color: ESSAY_BOX.ink }}>
          {c.model}
        </div>
      )}
      <p className="text-xs font-semibold opacity-75">
        {ui.selfGraded}
      </p>
    </div>
  );
}

function FillBody({ c, dir, value = [], setValue, checked, theme }) {
  const parts = (c.template || "").split("___");
  const set = (i, v) => {
    const next = [...value];
    next[i] = v;
    setValue(next);
  };
  return (
    <p dir={dir} className="flex flex-wrap items-center gap-2 text-base leading-loose font-medium">
      {parts.map((seg, i) => (
        <span key={i} className="contents">
          <span>{seg}</span>
          {i < parts.length - 1 && (
            <input
              dir="auto"
              disabled={checked}
              value={value[i] || ""}
              onChange={(e) => set(i, e.target.value)}
              className="mx-1 w-24 rounded-lg border-2 px-2 py-1 text-center font-mono text-sm outline-none shadow-sm"
              style={{
                borderColor: checked ? ((value[i] || "").trim().toLowerCase() === (c.blanks?.[i] || "").toLowerCase() ? CORRECT.border : INCORRECT.border) : "rgba(0,0,0,0.2)",
                background: checked ? ((value[i] || "").trim().toLowerCase() === (c.blanks?.[i] || "").toLowerCase() ? CORRECT.bg : INCORRECT.bg) : "rgba(255,255,255,0.85)",
                color: "inherit",
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
  const parts = (c.template || "").split("___");
  const ok = checked ? value === c.correct : null;
  return (
    <div className="flex flex-col gap-4">
      <p dir={dir} className="flex flex-wrap items-center gap-2 text-base leading-loose font-medium">
        {parts.map((seg, i) => (
          <span key={i} className="contents">
            <span>{seg}</span>
            {i < parts.length - 1 && (
              <button
                onClick={() => !checked && setValue(undefined)}
                disabled={checked}
                className="mx-1 min-w-[80px] rounded-lg border-2 border-dashed px-3 py-1 font-mono text-sm font-bold shadow-sm"
                style={{
                  borderColor: checked ? (ok ? CORRECT.border : INCORRECT.border) : "rgba(0,0,0,0.25)",
                  background: checked ? (ok ? CORRECT.bg : INCORRECT.bg) : "rgba(255,255,255,0.85)",
                  color: "inherit",
                }}
              >
                {value || "?"}
              </button>
            )}
          </span>
        ))}
      </p>
      <p className="text-xs font-semibold opacity-75">
        {ui.bankHint}
      </p>
      <div className="flex flex-wrap gap-2">
        {(c.bank || []).map((w) => (
          <button
            key={w}
            dir="ltr"
            disabled={checked || value === w}
            onClick={() => setValue(w)}
            className="rounded-full border-2 px-4 py-2 font-mono text-sm font-bold shadow-sm disabled:opacity-30 transition-transform hover:scale-105"
            style={{ borderColor: "rgba(0,0,0,0.2)", background: "rgba(255,255,255,0.75)", color: "inherit", minHeight: 40 }}
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
      <p className="text-xs font-semibold opacity-75">
        {ui.matchHint}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {c.left?.map((l, i) => {
            let style = { borderColor: "rgba(0,0,0,0.18)", background: "rgba(255,255,255,0.75)", color: "inherit" };
            if (checked) style = c.correct?.[i] === value[i] ? { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.border } : { background: INCORRECT.bg, borderColor: INCORRECT.border, color: INCORRECT.border };
            else if (active === i) style = { background: "rgba(20,21,26,0.9)", borderColor: "rgba(20,21,26,0.9)", color: "#ffffff" };
            else if (value[i] !== undefined) style = { borderColor: theme.accent, background: "rgba(255,255,255,0.9)", color: "inherit" };
            return (
              <button key={i} onClick={() => pickLeft(i)} className="rounded-2xl border-2 px-3 py-2.5 text-start font-mono text-sm font-bold shadow-sm" style={{ ...style, minHeight: 44 }}>
                {l}
                {value[i] !== undefined && <span className="block text-xs font-normal opacity-75 mt-0.5">→ {c.right?.[value[i]]}</span>}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {c.right?.map((r, j) => (
            <button
              key={j}
              disabled={checked || placedRight.includes(j)}
              onClick={() => pickRight(j)}
              className="rounded-2xl border-2 px-3 py-2.5 text-start text-sm font-medium disabled:opacity-40 shadow-sm"
              style={{ borderColor: "rgba(0,0,0,0.18)", background: "rgba(255,255,255,0.75)", color: "inherit", minHeight: 44 }}
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
  const list = value || c.items || [];
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
      <p className="text-xs font-semibold opacity-75">
        {ui.orderHint}
      </p>
      <div className="flex flex-col gap-2">
        {list.map((item, i) => {
          const state = checked ? (c.correct?.[i] === item ? "correct" : "incorrect") : null;
          const style = state === "correct" ? { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.border } : state === "incorrect" ? { background: INCORRECT.bg, borderColor: INCORRECT.border, color: INCORRECT.border } : { background: "rgba(255,255,255,0.8)", borderColor: "rgba(0,0,0,0.15)", color: "inherit" };
          return (
            <div key={item} className="flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 shadow-sm" style={style}>
              <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background: "rgba(20,21,26,0.9)", color: "#ffffff" }}>
                {i + 1}
              </span>
              <span className="flex-1 font-mono text-sm font-semibold">{item}</span>
              <div className="flex flex-col">
                <button aria-label={ui.prev} disabled={checked || i === 0} onClick={() => move(i, -1)} className="disabled:opacity-20 hover:scale-110">
                  <ArrowUp size={15} />
                </button>
                <button aria-label={ui.next} disabled={checked || i === list.length - 1} onClick={() => move(i, 1)} className="disabled:opacity-20 hover:scale-110">
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
  const items = c.items || [];
  const unsorted = items.filter((_, i) => value[i] === undefined);
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
      <p className="text-xs font-semibold opacity-75">
        {ui.sortHint}
      </p>
      <div className="flex flex-wrap gap-2 rounded-2xl border-2 border-dashed p-3 min-h-[52px]" style={{ borderColor: "rgba(0,0,0,0.25)", background: "rgba(255,255,255,0.3)" }}>
        {unsorted.length === 0 && (
          <span className="text-xs opacity-60">
            —
          </span>
        )}
        {items.map(([label], i) =>
          value[i] === undefined ? (
            <button
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              className="rounded-full border-2 px-3 py-1.5 font-mono text-sm font-bold shadow-sm transition-transform hover:scale-105"
              style={active === i ? { background: "rgba(20,21,26,0.9)", color: "#ffffff", borderColor: "rgba(20,21,26,0.9)" } : { borderColor: "rgba(0,0,0,0.2)", color: "inherit", background: "rgba(255,255,255,0.8)" }}
            >
              {label}
            </button>
          ) : null
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {c.bins?.map((bin) => (
          <button key={bin} onClick={() => placeIn(bin)} className="flex min-h-[100px] flex-col gap-2 rounded-2xl border-2 p-3 text-start shadow-sm" style={{ borderColor: "rgba(0,0,0,0.2)", background: "rgba(255,255,255,0.7)" }}>
            <span className="text-xs font-black uppercase tracking-wide opacity-80">
              {bin}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {items.map(([label, correctBin], i) => {
                if (value[i] !== bin) return null;
                const state = checked ? (correctBin === bin ? "correct" : "incorrect") : null;
                const style = state === "correct" ? { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.border } : state === "incorrect" ? { background: INCORRECT.bg, borderColor: INCORRECT.border, color: INCORRECT.border } : { background: "rgba(255,255,255,0.9)", borderColor: "rgba(0,0,0,0.2)", color: "inherit" };
                return (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(i);
                    }}
                    className="rounded-full border-2 px-2.5 py-1 font-mono text-xs font-bold shadow-sm"
                    style={style}
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
      className="w-36 rounded-2xl border-2 px-4 py-3 text-center font-mono text-lg font-black outline-none shadow-sm"
      style={{
        borderColor: checked ? (ok ? CORRECT.border : INCORRECT.border) : "rgba(0,0,0,0.2)",
        background: checked ? (ok ? CORRECT.bg : INCORRECT.bg) : "rgba(255,255,255,0.85)",
        color: "inherit",
        minHeight: 44,
      }}
    />
  );
}

function RatingBody({ value = 0, setValue }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} aria-label={String(n)} onClick={() => setValue(n)} className="transition-transform hover:scale-110" style={{ minHeight: 40, minWidth: 40 }}>
          <Star size={30} fill={n <= value ? "#FCD34D" : "none"} stroke={n <= value ? "#996a00" : "rgba(0,0,0,0.3)"} strokeWidth={1.75} />
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
        <span className="font-mono font-bold opacity-75">
          {c.min}
        </span>
        <span
          className="rounded-full border-2 px-3 py-1 font-mono text-sm font-bold shadow-sm"
          style={{
            borderColor: checked ? (ok ? CORRECT.border : INCORRECT.border) : "rgba(0,0,0,0.2)",
            background: checked ? (ok ? CORRECT.bg : INCORRECT.bg) : "rgba(255,255,255,0.85)",
            color: "inherit",
          }}
        >
          {v}
        </span>
        <span className="font-mono font-bold opacity-75">
          {c.max}
        </span>
      </div>
    </div>
  );
}

/* =================================================================
   Full-Card Colored Question Components (with Linking Support)
================================================================== */
function QuestionItem({ q, lang, ui, theme, skin = SKINS.normal, onAnswered, onJumpToBlock, bookId, leafId }) {
  const c = q[lang] || {};
  const meta = TYPE_META[q.type] || TYPE_META.single;
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
      id={`q-item-${q.id}`}
      className="p-5 sm:p-6 flex flex-col gap-4 shadow-md transition-all"
      style={{
        background: meta.color.bg,
        color: meta.color.ink,
        borderRadius: skin.radiusLg,
        border: `1.5px solid rgba(0,0,0,0.12)`,
        boxShadow: skin.pixel ? skin.shadow : "0 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <meta.Icon size={16} strokeWidth={2.25} />
          <span className="text-xs font-black uppercase tracking-wider" style={{ letterSpacing: skin.letterSpacing }}>
            {meta[lang]} · {DIFF[lang][q.difficulty] || q.difficulty}
          </span>
        </div>

        {/* Linking Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {q.linkedBlockId && onJumpToBlock && (
            <button
              onClick={() => onJumpToBlock(bookId, leafId, q.linkedBlockId)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-white/80 hover:bg-white text-slate-900 border border-black/10 shadow-sm transition-transform hover:scale-105"
              title={ui.relatedInfo}
            >
              <BookOpen size={11} /> {ui.relatedInfo} <ExternalLink size={10} />
            </button>
          )}
          {q.importMeta && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/10 text-inherit">
              {ui.importedFrom}: {q.importMeta}
            </span>
          )}
        </div>
      </div>

      <p dir={q.dir} className="text-base font-bold leading-relaxed">
        {c.prompt || c.template}
      </p>

      {body}

      {checked && !selfGraded && <FeedbackBanner ok={ok} ui={ui} skin={skin} onRetry={() => setChecked(false)} />}

      {!selfGraded && !checked && (
        <button
          onClick={handleCheck}
          disabled={!canCheck}
          className="self-start px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed shadow transition-transform hover:scale-105 active:scale-95"
          style={{ borderRadius: skin.radiusSm, background: "rgba(20,21,26,0.92)", minHeight: 44 }}
        >
          {ui.checkAnswer}
        </button>
      )}
    </div>
  );
}

function QuestionGroupCard({ group, lang, ui, theme, skin = SKINS.normal, onAnswered, onJumpToBlock, bookId, leafId }) {
  const pos = group.imagePosition || "top";
  const hasImage = !!group.image;
  const cardStyle = { ...panelStyle(skin, theme, { soft: true }) };

  const list = (
    <div
      className="flex flex-col gap-4 p-4 sm:p-5 flex-1 min-w-0"
      style={{ maxHeight: "min(68vh, 600px)", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
    >
      {group.questions?.map((q, i) => (
        <QuestionItem
          key={q.id || i}
          q={q}
          lang={lang}
          ui={ui}
          theme={theme}
          skin={skin}
          bookId={bookId}
          leafId={leafId}
          onJumpToBlock={onJumpToBlock}
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
          : { width: "38%", minWidth: 120, alignSelf: "stretch" }
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

  return (
    <div className="overflow-hidden flex flex-col sm:flex-row" style={cardStyle}>
      {pos === "left" && imageBlock(false)}
      {list}
      {pos === "right" && imageBlock(false)}
    </div>
  );
}

function TypeCard({ q, lang, ui, theme, skin = SKINS.normal, onAnswered, onJumpToBlock, bookId, leafId }) {
  return <QuestionItem q={q} lang={lang} ui={ui} theme={theme} skin={skin} onAnswered={onAnswered} onJumpToBlock={onJumpToBlock} bookId={bookId} leafId={leafId} />;
}

/* =================================================================
   NodeQuestionDeck
================================================================== */
function NodeQuestionDeck({ node, book, lang, ui, theme, dir, skin, cardMode = "paged", scrollDir = "vertical", onJumpToBlock }) {
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
    <div className="overflow-hidden educraft-panel-in" style={panelStyle(skin, theme)}>
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 flex-wrap" style={{ borderBottom: `1px solid ${skinBorderColor(skin, theme)}`, background: skinSurface(skin, theme, true) }}>
        <div className="flex items-center gap-2 min-w-0">
          <Layers size={16} color={theme.accent} strokeWidth={2} />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-xs font-semibold truncate" style={{ color: theme.inkSoft }}>
              {book[lang]?.title || book.en?.title}
            </span>
            <span className="text-sm font-bold truncate" style={{ color: theme.ink }}>
              {node[lang] || node.en}
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
              className="grid place-items-center disabled:opacity-30 hover:bg-black/5"
              style={{ width: 32, height: 32, borderRadius: skin.radiusSm, border: `1px solid ${skinBorderColor(skin, theme)}`, color: theme.ink }}
            >
              <PrevIcon size={15} />
            </button>
            <button
              aria-label={ui.next}
              onClick={() => setIndex((i) => Math.min(cards.length - 1, i + 1))}
              disabled={index === cards.length - 1}
              className="grid place-items-center disabled:opacity-30 hover:bg-black/5"
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
          className="p-3 sm:p-4 flex gap-3"
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
              <QuestionGroupCard group={group} lang={lang} ui={ui} theme={theme} skin={skin} bookId={book.id} leafId={node.id} onJumpToBlock={onJumpToBlock} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 sm:p-4">
          <QuestionGroupCard key={cards[index]?.id || `${node.id}-${index}`} group={cards[index] || { id: "empty", questions: [] }} lang={lang} ui={ui} theme={theme} skin={skin} bookId={book.id} leafId={node.id} onJumpToBlock={onJumpToBlock} />
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
   KnowledgeTree
================================================================== */
function KnowledgeTree({ book, lang, dir, theme, ui, skin, selected, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const nodes = book.nodes || [];

  const edges = useMemo(() => {
    const branchEdges = nodes.filter((n) => n.parent).map((n) => ({ from: n.parent, to: n.id, type: "branch" }));
    const linkEdges = (book.crossLinks || []).map(([from, to]) => ({ from, to, type: "link" }));
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
          const a = nodeById[e.from] ? posFor(nodeById[e.from]) : { x: 0, y: 0 };
          const b = nodeById[e.to] ? posFor(nodeById[e.to]) : { x: 0, y: 0 };
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
          const d = dims[n.level] || dims.leaf;
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
              aria-label={isLeaf ? `${n[lang] || n.en} — ${count > 1 ? ui.multiCardBadge(count) : ""}` : (n[lang] || n.en)}
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
                {n[lang] || n.en}
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
   BookCover & EditableCover
================================================================== */
function BookCover({ book, theme }) {
  const { from = "#F2C879", to = "#E8654A", icon = "code" } = book.cover || {};
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
            className="flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-transform"
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
              className="flex items-center justify-center rounded-full hover:scale-110 transition-transform"
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
   LibraryView (With Bags & Item Type Filters)
================================================================== */
function LibraryView({ lang, ui, theme, dir, onOpen, skin, covers, onChangeCover, onClearCover, books, bags, onAddBag, onMoveBookBag, onAddBook }) {
  const [selectedBagId, setSelectedBagId] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // "all" | "book" | "encyclopedia"
  const [newBagName, setNewBagName] = useState("");
  const [showNewBagInput, setShowNewBagInput] = useState(false);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchBag = selectedBagId === "all" || b.bagId === selectedBagId;
      const matchType = selectedType === "all" || (b.type || "book") === selectedType;
      return matchBag && matchType;
    });
  }, [books, selectedBagId, selectedType]);

  const handleCreateBag = (e) => {
    e.preventDefault();
    if (!newBagName.trim()) return;
    const newBag = {
      id: `bag-${Date.now()}`,
      en: newBagName.trim(),
      ar: newBagName.trim(),
      icon: "briefcase",
    };
    onAddBag(newBag);
    setSelectedBagId(newBag.id);
    setNewBagName("");
    setShowNewBagInput(false);
  };

  return (
    <section>
      <div className="text-center pt-2 pb-8 max-w-2xl mx-auto">
        <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: theme.accent }}>
          {ui.libraryKicker}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: ui.displayFont, color: theme.ink, lineHeight: 1.3 }}>
          {ui.libraryTitle}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: theme.inkSoft }}>
          {ui.librarySub}
        </p>
      </div>

      {/* Bags & Environments Bar */}
      <div className="mb-6 p-3 rounded-2xl flex flex-col gap-3" style={{ background: skinSurface(skin, theme, true), border: `1px solid ${skinBorderColor(skin, theme)}` }}>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold px-2 flex items-center gap-1" style={{ color: theme.inkSoft }}>
              <Briefcase size={13} /> {ui.navBags}:
            </span>
            <button
              onClick={() => setSelectedBagId("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                selectedBagId === "all" ? "bg-[#E8654A] text-white shadow-sm" : "bg-white/60 hover:bg-white text-slate-800"
              }`}
              style={selectedBagId === "all" ? { background: theme.accent, color: theme.accentInk } : undefined}
            >
              {ui.allBags} ({books.length})
            </button>
            {bags.map((bag) => {
              const count = books.filter((b) => b.bagId === bag.id).length;
              const isSel = selectedBagId === bag.id;
              return (
                <button
                  key={bag.id}
                  onClick={() => setSelectedBagId(bag.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    isSel ? "bg-[#E8654A] text-white shadow-sm" : "bg-white/60 hover:bg-white text-slate-800"
                  }`}
                  style={isSel ? { background: theme.accent, color: theme.accentInk } : undefined}
                >
                  <span>🎒 {bag[lang] || bag.en}</span>
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {!showNewBagInput ? (
              <button
                onClick={() => setShowNewBagInput(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-full border border-dashed hover:bg-black/5 flex items-center gap-1"
                style={{ borderColor: theme.hairlineStrong, color: theme.accent }}
              >
                <Plus size={12} /> {ui.newBag}
              </button>
            ) : (
              <form onSubmit={handleCreateBag} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newBagName}
                  onChange={(e) => setNewBagName(e.target.value)}
                  placeholder={dir === "rtl" ? "اسم الشنطة..." : "Bag name..."}
                  className="text-xs px-2.5 py-1 rounded-full outline-none border"
                  style={{ background: theme.surface, color: theme.ink, borderColor: theme.accent }}
                  autoFocus
                />
                <button type="submit" className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: theme.accent }}>
                  {dir === "rtl" ? "إضافة" : "Add"}
                </button>
                <button type="button" onClick={() => setShowNewBagInput(false)} className="text-xs px-1.5" style={{ color: theme.inkSoft }}>
                  <X size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Item Type Filter & Create Item */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-black/5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold px-1" style={{ color: theme.inkSoft }}>
              {dir === "rtl" ? "النوع:" : "Type:"}
            </span>
            {[
              ["all", ui.typeAll],
              ["book", `📚 ${ui.typeBook}`],
              ["encyclopedia", `🏛️ ${ui.typeEncyclopedia}`],
            ].map(([t, label]) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedType === t ? "bg-black/10 text-slate-900 font-bold" : "hover:bg-black/5 text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={onAddBook}
            className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white shadow-sm transition-transform hover:scale-105"
            style={{ background: theme.accent }}
          >
            <Plus size={13} /> {ui.createItem}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filteredBooks.map((book) => {
          const branchCount = (book.nodes || []).filter((n) => n.level === "branch").length;
          const questionCount = (book.nodes || []).reduce((sum, n) => sum + (n.level === "leaf" ? leafCards(n).reduce((s, g) => s + g.questions.length, 0) : 0), 0);
          const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
          const isEncyclopedia = book.type === "encyclopedia";
          const bagObj = bags.find((g) => g.id === book.bagId);

          return (
            <div
              key={book.id}
              className="group flex gap-4 p-4 text-start transition-transform hover:scale-[1.01]"
              style={{ ...panelStyle(skin, theme), cursor: "pointer" }}
              onClick={() => onOpen(book.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(book.id)}
            >
              <div className="shrink-0" style={{ width: 100, height: 132, borderRadius: skin.radiusMd * 0.7, overflow: "hidden" }}>
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
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span
                      className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: isEncyclopedia ? "rgba(110,231,183,0.3)" : "rgba(232,101,74,0.18)",
                        color: isEncyclopedia ? "#065f46" : theme.accent,
                      }}
                    >
                      {isEncyclopedia ? `🏛️ ${ui.typeEncyclopedia}` : `📚 ${ui.typeBook}`}
                    </span>
                    {bagObj && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5" style={{ color: theme.inkSoft }}>
                        🎒 {bagObj[lang] || bagObj.en}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold leading-snug mb-1" style={{ color: theme.ink }}>
                    {book[lang]?.title || book.en?.title}
                  </h3>
                  <p className="text-xs line-clamp-2" style={{ color: theme.inkSoft, lineHeight: 1.5 }}>
                    {book[lang]?.tagline || book.en?.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-black/5">
                  <span className="text-[11px] font-semibold" style={{ color: theme.inkSoft }}>
                    {branchCount} {ui.branchesLabel} · {questionCount} {ui.questionsLabel}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors group-hover:brightness-95"
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
   TreeView
================================================================== */
function TreeView({ book, lang, ui, theme, dir, onBack, skin, selectedLeaf, onSelectLeaf, onBrowse, onExport, covers, onChangeCover, onClearCover }) {
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const isEncyclopedia = book.type === "encyclopedia";

  return (
    <section>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5 hover:opacity-80" style={{ color: theme.inkSoft, minHeight: 40 }}>
        <BackIcon size={15} />
        {ui.backToLibrary}
      </button>

      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="shrink-0" style={{ width: 56, height: 74, borderRadius: skin.radiusMd * 0.55, overflow: "hidden" }}>
            <EditableCover book={book} theme={theme} skin={skin} ui={ui} coverUrl={covers[book.id]} onChangeCover={onChangeCover} onClearCover={onClearCover} radius={skin.radiusMd * 0.55} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/5" style={{ color: theme.accent }}>
                {isEncyclopedia ? `🏛️ ${ui.typeEncyclopedia}` : `📚 ${ui.typeBook}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: ui.displayFont, color: theme.ink, lineHeight: 1.25 }}>
              {book[lang]?.title || book.en?.title}
            </h1>
            <p className="text-sm" style={{ color: theme.inkSoft }}>
              {book[lang]?.tagline || book.en?.tagline}
            </p>
          </div>
        </div>

        <button
          onClick={onBrowse}
          className="flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 shrink-0 shadow-sm transition-transform hover:scale-105"
          style={{ borderRadius: skin.radiusSm, background: theme.accent, color: theme.accentInk, minHeight: 44 }}
        >
          <ListFilter size={15} />
          {ui.browseCta}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 hover:bg-black/5 transition-colors"
          style={{ borderRadius: skin.radiusSm, border: `1.5px solid ${skinBorderColor(skin, theme)}`, color: theme.ink, minHeight: 36 }}
        >
          <FileDown size={13} />
          {ui.treeExportCta}
        </button>
      </div>

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
   DeckView
================================================================== */
function DeckView({ node, book, lang, ui, theme, dir, skin, cardMode, scrollDir, onBack, onJumpToBlock }) {
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  return (
    <section>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5 hover:opacity-80" style={{ color: theme.inkSoft, minHeight: 40 }}>
        <BackIcon size={15} />
        {book[lang]?.title || book.en?.title}
      </button>
      <NodeQuestionDeck node={node} book={book} lang={lang} ui={ui} theme={theme} dir={dir} skin={skin} cardMode={cardMode} scrollDir={scrollDir} onJumpToBlock={onJumpToBlock} />
    </section>
  );
}

/* =================================================================
   BrowseView
================================================================== */
function BrowseView({ book, lang, ui, theme, dir, skin, onBack, onJumpToBlock }) {
  const allQuestions = useMemo(() => {
    const list = [];
    (book.nodes || [])
      .filter((n) => n.level === "leaf")
      .forEach((leaf) => {
        leafCards(leaf).forEach((group) => {
          group.questions?.forEach((q, i) => list.push({ q, leaf, key: `${group.id}-${i}` }));
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
    <div className="flex flex-col gap-2 p-4 shadow-sm" style={{ background: bg, color: ink, borderRadius: skin.radiusLg, border: skin.pixel ? `${skin.borderW}px solid ${ink}` : "none", boxShadow: skin.pixel ? skin.shadow : "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider" style={{ opacity: 0.75 }}>
        <Icon size={13} strokeWidth={2.5} />
        {label}
      </div>
      {content}
    </div>
  );

  return (
    <section>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-5 hover:opacity-80" style={{ color: theme.inkSoft, minHeight: 40 }}>
        <BackIcon size={15} />
        {book[lang]?.title || book.en?.title}
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

      <div className="p-4 mb-6 shadow-sm" style={{ background: TYPE_META.tf.color.bg, color: TYPE_META.tf.color.ink, borderRadius: skin.radiusLg, border: skin.pixel ? `${skin.borderW}px solid ${TYPE_META.tf.color.ink}` : "none" }}>
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
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold shadow-sm"
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
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold shadow-sm"
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
              {ui.fromLeaf} {leaf[lang] || leaf.en}
            </span>
            <TypeCard q={q} lang={lang} ui={ui} theme={theme} skin={skin} bookId={book.id} leafId={leaf.id} onJumpToBlock={onJumpToBlock} onAnswered={handleAnswered(key)} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* =================================================================
   SettingsPanel
================================================================== */
function SettingsPanel({ ui, theme, dir, skinId, onSkinChange, flavorId, onFlavorChange, mode, cardMode, onCardModeChange, scrollDir, onScrollDirChange, voiceEnabled, onVoiceEnabledChange, onClose, onReset }) {
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
            className="grid place-items-center shrink-0 hover:bg-black/10 transition-colors"
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
                className="flex items-center gap-3 text-start px-3.5 py-3 transition-transform hover:scale-[1.01]"
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

        {/* Flavor / taste */}
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
                className="flex flex-col items-center gap-1.5 p-1.5 transition-transform hover:scale-105"
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

        {/* Card Mode */}
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
                className="flex items-center gap-3 text-start px-3.5 py-3 transition-transform hover:scale-[1.01]"
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
                    className="flex flex-col items-center gap-1.5 px-3 py-3 transition-transform hover:scale-105"
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
            className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-bold hover:bg-red-50 transition-colors"
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
   EDITOR MODE (Clean Studio Architecture — Unified 3-Pane Workspace)
================================================================== */
const EDITOR_STR = {
  en: {
    editorTitle: "Studio",
    editorSub: "Pick a leaf, then build its question cards or its printed A4 pages.",
    addQuestion: "Add question",
    noLeaf: "Pick a leaf on the left to start editing.",
    prompt: "Prompt",
    voice: "Voice", voiceOn: "Voice enabled",
    code: "Code box", codeLang: "Language",
    linked: "Link to Leaf",
    linkedBlock: "Link to A4 Plate Block",
    linkedHint: "Search a leaf to link…",
    delete: "Delete question",
    tabCards: "Cards", tabPages: "A4 Pages",
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
    sortItems: 'Items — one "label:bin" per line',
    min: "Min", max: "Max", step: "Step", tolerance: "Tolerance",
    trueLabel: "True", falseLabel: "False",
    voiceFeature: "Voice feature",
    voiceFeatureSub: "Show or hide the voice slot on question cards everywhere.",
    card: "Card", newCard: "New card", deleteCard: "Delete card",
    cardImage: "Card image", posTop: "Top", posRight: "Right", posLeft: "Left", posNone: "None",
    noQuestionsInCard: "This card is empty — add a question.",
    pagesSub: "Build the printed A4 version using the 60 Thiqa palettes.",
    addBlock: "Add block",
    genFromCards: "Auto-Generate from Cards",
    changePalette: "Change Palette",
    blockTitleBlock: "Doc Header Block",
    blockSectionTitle: "Section Title", blockKeyterm: "Key Term", blockNote: "Note Box", blockWarning: "Warning Box", blockImportant: "Important Box", blockImage: "Image", blockTable: "Thiqa Table", blockCode: "Code Box", blockMediaCard: "Media Card", blockPagebreak: "Page Break",
    blockTitle: "Title", blockText: "Text", imageUrl: "Image URL", imageCaption: "Caption",
    mediaTitle: "Card Title", mediaDesc: "Description", mediaMeta: "Source / Note",
    codeBoxLang: "Language", codeSnippet: "Code snippet",
    pageOf: (n, total) => `Page ${n} of ${total}`,
    moveUp: "Move up", moveDown: "Move down", removeBlock: "Remove",
    files: "Files",
    importBookJson: "Import book (JSON)",
    exportBookJson: "Export book (JSON)",
    cardNote: "Note",
    linkToQuestion: "Link to Question",
    thumbnailsTitle: "Page Previews",
    tabOutline: "Outline",
    tabAddBlocks: "Add Blocks",
    tabInspector: "Blocks List",
    emptyPagePrompt: "This page is empty right now. Start by adding a header, or generate automatically from cards with one click!",
  },
  ar: {
    editorTitle: "الاستوديو التعليمي",
    editorSub: "اختار ورقة، وابني كاردات أسئلتها الملوّنة أو صفحاتها المطبوعة A4.",
    addQuestion: "إضافة سؤال",
    noLeaf: "اختار ورقة من القائمة للبدء.",
    prompt: "نص السؤال",
    voice: "صوت", voiceOn: "الصوت مفعّل",
    code: "صندوق كود", codeLang: "اللغة",
    linked: "ربط بورقة شجرة",
    linkedBlock: "ربط بصندوق معلومة A4",
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
    sortItems: 'العناصر — "العنصر:الصندوق" كل سطر لوحده',
    min: "أقل قيمة", max: "أعلى قيمة", step: "الخطوة", tolerance: "هامش الخطأ",
    trueLabel: "صح", falseLabel: "غلط",
    voiceFeature: "ميزة الصوت",
    voiceFeatureSub: "إظهار أو إخفاء مكان الصوت في كاردات الأسئلة في كل مكان.",
    card: "كارد", newCard: "كارد جديد", deleteCard: "احذف الكارد",
    cardImage: "صورة الكارد", posTop: "فوق", posRight: "يمين", posLeft: "شمال", posNone: "بدون",
    noQuestionsInCard: "الكارد ده فاضي — ضيف سؤال.",
    pagesSub: "ابني النسخة المطبوعة A4 باستخدام الباليتات الستين (ثِقة).",
    addBlock: "إضافة عنصر",
    genFromCards: "توليد تلقائي من كاردات الورقة",
    changePalette: "تغيير الباليتة",
    blockTitleBlock: "ترويسة المادة والمحاضرة",
    blockSectionTitle: "عنوان قسم", blockKeyterm: "مصطلح مفتاحي", blockNote: "صندوق ملاحظة", blockWarning: "صندوق تحذير", blockImportant: "صندوق معلومة مهمة", blockImage: "صورة توضيحية", blockTable: "جدول ثِقة", blockCode: "صندوق كود برمجي", blockMediaCard: "بطاقة وسائط", blockPagebreak: "فاصل صفحة",
    blockTitle: "العنوان", blockText: "النص", imageUrl: "رابط الصورة", imageCaption: "التعليق",
    mediaTitle: "عنوان البطاقة", mediaDesc: "الوصف", mediaMeta: "المصدر / الملاحظة",
    codeBoxLang: "اللغة", codeSnippet: "الكود",
    pageOf: (n, total) => `صفحة ${n} من ${total}`,
    moveUp: "لأعلى", moveDown: "لأسفل", removeBlock: "إزالة",
    files: "ملفات",
    importBookJson: "استيراد الكتاب (JSON)",
    exportBookJson: "تصدير الكتاب (JSON)",
    cardNote: "ملاحظة",
    linkToQuestion: "ربط بسؤال",
    thumbnailsTitle: "معاينة الصفحات",
    tabOutline: "الفصول والأوراق",
    tabAddBlocks: "إضافة عناصر",
    tabInspector: "العناصر الحالية",
    emptyPagePrompt: "الصفحة فارغة حالياً. ابدأ بإضافة ترويسة أو ولّد المحتوى تلقائياً من كاردات الأسئلة بنقرة واحدة!",
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
      className="w-full text-sm px-3 py-2 outline-none shadow-sm"
      style={{ borderRadius: skin.radiusSm, border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.ink }}
    />
  );
}

function RichField({ value, onChange, theme, skin, placeholder, minHeight = 76 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
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
  const btnStyle = { borderRadius: 6, color: theme.ink, background: "rgba(255,255,255,0.75)", border: `1px solid ${theme.hairline}` };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5 p-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.04)", border: `1px solid ${theme.hairline}` }}>
        <button type="button" onClick={() => exec("bold")} className="w-7 h-7 grid place-items-center font-black text-xs hover:bg-white" style={btnStyle} title="Bold">
          B
        </button>
        {COLORS.map((c) => (
          <button key={c} type="button" onClick={() => exec("foreColor", c)} className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ background: c, border: `1px solid ${theme.hairlineStrong}` }} title={c} />
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
        <button type="button" onClick={() => wrapBdi("auto")} className="text-[10px] font-bold px-2 py-1 hover:bg-white" style={btnStyle} title="BDI — auto isolate">
          bdi
        </button>
        <button type="button" onClick={() => wrapBdi("ltr")} className="text-[10px] font-bold px-2 py-1 hover:bg-white" style={btnStyle}>
          LTR
        </button>
        <button type="button" onClick={() => wrapBdi("rtl")} className="text-[10px] font-bold px-2 py-1 hover:bg-white" style={btnStyle}>
          RTL
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        dir="auto"
        onInput={() => onChange(ref.current.innerHTML)}
        className="w-full text-sm px-3 py-2.5 outline-none shadow-sm rounded-lg"
        style={{ minHeight, border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.ink, lineHeight: 1.7 }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

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
                  className="flex-1 text-sm px-2.5 py-1.5 shadow-sm"
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
            className="text-xs font-bold px-2.5 py-1.5 rounded-lg"
            style={{ border: `1px dashed ${theme.hairlineStrong}`, color: theme.accent }}
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
                className="flex-1 text-sm font-bold py-2 shadow-sm"
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
            className="w-full text-sm px-3 py-2 shadow-sm"
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
              value={(c.items || []).map((p) => (Array.isArray(p) ? p.join(":") : p)).join("\n")}
              onChange={(e) => set({ items: e.target.value.split("\n").filter(Boolean).map((l) => l.split(":").map((s) => s.trim())) })}
              rows={4}
              className="w-full text-sm px-3 py-2 shadow-sm"
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
              <span key={id} className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm" style={{ background: theme.accent, color: theme.accentInk }}>
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
          <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto shadow-lg" style={{ borderRadius: skin.radiusSm, background: theme.surface, border: `1px solid ${theme.hairlineStrong}` }}>
            {options.slice(0, 8).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  onChange([...list, l.id]);
                  setQuery("");
                }}
                className="w-full text-start text-xs px-3 py-2 hover:bg-black/5"
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

function QuestionEditorRow({ q, lang, theme, skin, t, onUpdate, onDelete, allLeaves, currentLeafId, voiceEnabled, pageBlocks = [] }) {
  const meta = TYPE_META[q.type] || TYPE_META.single;
  const c = q[lang] || {};
  const textKey = c.template !== undefined ? "template" : "prompt";
  const setLangObj = (patch) => onUpdate({ [lang]: { ...c, ...patch } });
  const setText = (html) => setLangObj({ [textKey]: html });

  return (
    <div style={{ borderRadius: 12, border: `1.5px solid rgba(0,0,0,0.12)`, overflow: "hidden", background: meta.color.bg }}>
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5" style={{ color: meta.color.ink }}>
        <div className="flex items-center gap-2">
          <meta.Icon size={14} />
          <span className="text-xs font-black">{lang === "ar" ? meta.ar : meta.en}</span>
        </div>
        <button onClick={onDelete} className="w-6 h-6 grid place-items-center rounded-full bg-black/10 hover:bg-black/20" title={t.delete}>
          <Trash2 size={12} />
        </button>
      </div>

      <div className="p-3.5 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.7)", color: meta.color.ink }}>
        <FieldRow label={t.prompt} theme={theme}>
          <RichField key={q.id + lang} value={c[textKey] || ""} onChange={setText} theme={theme} skin={skin} placeholder={t.prompt} />
        </FieldRow>

        <QuestionFields q={q} lang={lang} onChangeLang={setLangObj} theme={theme} skin={skin} t={t} />

        {/* Link to A4 Plate Block */}
        <FieldRow label={t.linkedBlock} theme={theme}>
          <select
            value={q.linkedBlockId || ""}
            onChange={(e) => onUpdate({ linkedBlockId: e.target.value || null })}
            className="w-full text-xs px-2.5 py-2 rounded-lg outline-none shadow-sm"
            style={{ background: theme.surface, color: theme.ink, border: `1px solid ${theme.hairline}` }}
          >
            <option value="">{lang === "ar" ? "— بدون ربط بصندوق معلومة —" : "— None (No A4 plate linked) —"}</option>
            {pageBlocks.map((b) => (
              <option key={b.id} value={b.id}>
                [{b.kind}] {b.title || b.text?.slice(0, 30) || b.id}
              </option>
            ))}
          </select>
        </FieldRow>

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

function CardEditor({ card, lang, theme, skin, t, onUpdateCard, onDeleteCard, allLeaves, currentLeafId, voiceEnabled, pageBlocks = [] }) {
  const pos = card.imagePosition || "top";
  const qRefs = useRef({});
  const updateQ = (i, patch) => onUpdateCard({ questions: card.questions.map((qq, idx) => (idx === i ? { ...qq, ...patch } : qq)) });
  const deleteQ = (i) => onUpdateCard({ questions: card.questions.filter((_, idx) => idx !== i) });
  const addQ = (type) => {
    const base = { id: `${card.id}-${Date.now()}`, type, subject: "", difficulty: "Beginner", tier: "core", dir: "ltr", en: { prompt: "" }, ar: { prompt: "" } };
    onUpdateCard({ questions: [...card.questions, base] });
  };
  const jumpTo = (id) => qRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });

  const linkedIds = Array.from(new Set([...(card.cardLinkedTo || []), ...card.questions.flatMap((q) => q.linkedTo || [])]));

  return (
    <div className="educraft-panel-in shadow-sm" style={{ borderRadius: skin.radiusLg, border: `1px solid ${theme.hairlineStrong}`, background: theme.surfaceSoft, padding: 14 }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-xs font-bold" style={{ color: theme.inkSoft }}>
          {t.cardImage}
        </p>
        <button onClick={onDeleteCard} className="text-xs font-bold px-2.5 py-1.5 shrink-0 rounded-lg hover:brightness-95 transition-all" style={{ color: "#7A2A12", background: "#FFD9CE" }}>
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
            className="text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors"
            style={{ background: pos === p ? theme.accent : theme.surface, color: pos === p ? theme.accentInk : theme.ink }}
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
        className="w-full text-xs px-3 py-2 mb-3 rounded-lg outline-none"
        style={{ border: `1px solid ${theme.hairline}`, background: theme.surface, color: theme.inkSoft }}
      />

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3">
        {card.questions.map((q, i) => {
          const meta = TYPE_META[q.type] || TYPE_META.single;
          return (
            <button
              key={q.id || i}
              onClick={() => jumpTo(q.id)}
              className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform"
              style={{ background: meta.color.bg, color: meta.color.ink }}
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
              className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border border-dashed shadow-sm"
              style={{ borderColor: theme.accent, color: theme.accent }}
            >
              <GitBranch size={11} />
              {lang === "ar" ? l.ar : l.en}
            </span>
          );
        })}
        <div className="relative group shrink-0">
          <button className="w-7 h-7 grid place-items-center rounded-full border border-dashed hover:bg-white transition-colors" style={{ borderColor: theme.hairlineStrong, color: theme.ink }} title={t.addQuestion}>
            +
          </button>
          <div
            className="hidden group-hover:grid absolute z-10 mt-1 grid-cols-4 gap-1 p-2 shadow-lg"
            style={{ borderRadius: skin.radiusSm, background: theme.surface, border: `1px solid ${theme.hairlineStrong}` }}
          >
            {Object.entries(TYPE_META).map(([key, meta]) => (
              <button key={key} onClick={() => addQ(key)} className="w-7 h-7 grid place-items-center rounded-full shadow-sm hover:scale-110 transition-transform" style={{ background: meta.color.bg, color: meta.color.ink }} title={lang === "ar" ? meta.ar : meta.en}>
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
              pageBlocks={pageBlocks}
              onUpdate={(patch) => updateQ(i, patch)}
              onDelete={() => deleteQ(i)}
            />
          </div>
        ))}
        {card.questions.length === 0 && (
          <p className="text-xs font-semibold opacity-60">
            {t.noQuestionsInCard}
          </p>
        )}
      </div>
    </div>
  );
}

function EditorLeafNav({ book, lang, theme, selectedLeafId, onSelect }) {
  const branches = (book.nodes || []).filter((n) => n.level === "branch");
  const subOf = (bid) => (book.nodes || []).filter((n) => n.level === "sub" && n.parent === bid);
  const leavesOf = (sid) => (book.nodes || []).filter((n) => n.level === "leaf" && n.parent === sid);
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
                      className="text-start text-xs font-semibold px-2.5 py-1.5 flex items-center justify-between gap-2 transition-colors rounded-lg"
                      style={{ background: selectedLeafId === l.id ? theme.accentSoft : "transparent", color: theme.ink, border: `1px solid ${selectedLeafId === l.id ? theme.accent : "transparent"}` }}
                    >
                      <span>{lang === "ar" ? l.ar : l.en}</span>
                      <span className="text-[10px] font-bold opacity-60">
                        {((l.questions || []).length) + (l.cards ? l.cards.reduce((s, g) => s + g.questions.length, 0) : 0)}
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

/* =================================================================
   BLOCK ROW & PLATE BLOCKS
================================================================== */
function BlockRow({ block, t, theme, skin, onUpdate, onDelete, onMove, allQuestions = [], onJumpToQuestion, bookId, leafId }) {
  const kind = block.kind;
  return (
    <div id={`block-editor-${block.id}`} className="p-3 mb-2.5 rounded-xl shadow-xs border transition-all" style={{ borderColor: theme.hairline, background: theme.surface }}>
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <select
          value={kind}
          onChange={(e) => onUpdate({ kind: e.target.value })}
          className="text-xs font-bold px-2 py-1.5 rounded-lg outline-none"
          style={{ border: `1px solid ${theme.hairline}`, background: theme.surfaceSoft, color: theme.ink }}
        >
          <option value="titleBlock">{t.blockTitleBlock}</option>
          <option value="sectionTitle">{t.blockSectionTitle}</option>
          <option value="keyterm">{t.blockKeyterm}</option>
          <option value="note">{t.blockNote}</option>
          <option value="warning">{t.blockWarning}</option>
          <option value="important">{t.blockImportant}</option>
          <option value="code">{t.blockCode}</option>
          <option value="mediaCard">{t.blockMediaCard}</option>
          <option value="table">{t.blockTable}</option>
          <option value="image">{t.blockImage}</option>
          <option value="pagebreak">{t.blockPagebreak}</option>
        </select>

        {/* Link to Question selector */}
        <select
          value={block.linkedQuestionId || ""}
          onChange={(e) => onUpdate({ linkedQuestionId: e.target.value || null })}
          className="text-xs px-2 py-1.5 rounded-lg outline-none max-w-[130px] truncate"
          style={{ border: `1px solid ${theme.hairline}`, background: theme.surfaceSoft, color: theme.ink }}
          title={t.linkToQuestion}
        >
          <option value="">{t.linkToQuestion} (—)</option>
          {allQuestions.map((q, idx) => (
            <option key={q.id || idx} value={q.id}>
              Q: {q.ar?.prompt || q.en?.prompt || q.type}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 ms-auto">
          <button onClick={onMove(-1)} className="w-6 h-6 grid place-items-center rounded hover:bg-black/5" style={{ color: theme.ink }} title={t.moveUp}>
            <ArrowUp size={13} />
          </button>
          <button onClick={onMove(1)} className="w-6 h-6 grid place-items-center rounded hover:bg-black/5" style={{ color: theme.ink }} title={t.moveDown}>
            <ArrowDown size={13} />
          </button>
          <button onClick={onDelete} className="w-6 h-6 grid place-items-center rounded hover:bg-red-50" style={{ color: "#C0392B" }} title={t.removeBlock}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {kind === "pagebreak" ? (
        <p className="text-[11px] font-mono text-center opacity-60">
          — {t.blockPagebreak} (A4 Page Break) —
        </p>
      ) : kind === "titleBlock" ? (
        <div className="grid grid-cols-2 gap-1.5">
          <TextInput theme={theme} skin={skin} value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder="اسم المادة (Subject)" />
          <TextInput theme={theme} skin={skin} value={block.sub} onChange={(v) => onUpdate({ sub: v })} placeholder="عنوان المحاضرة (Lecture)" />
        </div>
      ) : kind === "code" ? (
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <TextInput theme={theme} skin={skin} value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder={t.blockTitle} />
            <TextInput theme={theme} skin={skin} value={block.lang} onChange={(v) => onUpdate({ lang: v })} placeholder="rust / js / html / css / python" />
          </div>
          <textarea
            value={block.code || ""}
            onChange={(e) => onUpdate({ code: e.target.value })}
            rows={4}
            dir="ltr"
            className="w-full text-xs px-2.5 py-1.5 rounded-lg outline-none font-mono"
            style={{ border: `1px solid ${theme.hairline}`, background: "#111", color: "#4FC1FF" }}
            placeholder={"fn main() {\\n  println!(\\\"Hello World\\\");\\n}"}
          />
        </div>
      ) : kind === "mediaCard" ? (
        <div className="flex flex-col gap-1.5">
          <TextInput theme={theme} skin={skin} value={block.imageUrl} onChange={(v) => onUpdate({ imageUrl: v })} placeholder={t.imageUrl} />
          <div className="grid grid-cols-2 gap-1.5">
            <TextInput theme={theme} skin={skin} value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder={t.mediaTitle} />
            <TextInput theme={theme} skin={skin} value={block.meta} onChange={(v) => onUpdate({ meta: v })} placeholder={t.mediaMeta} />
          </div>
          <textarea
            value={block.desc || ""}
            onChange={(e) => onUpdate({ desc: e.target.value })}
            rows={2}
            dir="auto"
            className="w-full text-xs px-2.5 py-1.5 rounded-lg outline-none"
            style={{ border: `1px solid ${theme.hairline}`, background: theme.surfaceSoft, color: theme.ink }}
            placeholder={t.mediaDesc}
          />
        </div>
      ) : kind === "image" ? (
        <div className="grid grid-cols-2 gap-1.5">
          <TextInput theme={theme} skin={skin} value={block.imageUrl} onChange={(v) => onUpdate({ imageUrl: v })} placeholder={t.imageUrl} />
          <TextInput theme={theme} skin={skin} value={block.caption} onChange={(v) => onUpdate({ caption: v })} placeholder={t.imageCaption} />
        </div>
      ) : kind === "table" ? (
        <div className="flex flex-col gap-1.5">
          <TextInput theme={theme} skin={skin} value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder={t.blockTitle} />
          <textarea
            value={block.tableData || "عمود 1, عمود 2\nقيمة أ, قيمة ب\nقيمة ج, قيمة د"}
            onChange={(e) => onUpdate({ tableData: e.target.value })}
            rows={3}
            dir="auto"
            className="w-full text-xs px-2.5 py-1.5 rounded-lg outline-none font-mono"
            style={{ border: `1px solid ${theme.hairline}`, background: theme.surfaceSoft, color: theme.ink }}
            placeholder="Headers: Col 1, Col 2\nRow 1: Val A, Val B"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {kind !== "sectionTitle" && <TextInput theme={theme} skin={skin} value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder={t.blockTitle} />}
          <textarea
            value={block.text || ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={2}
            dir="auto"
            className="w-full text-sm px-2.5 py-1.5 rounded-lg outline-none"
            style={{ border: `1px solid ${theme.hairline}`, background: theme.surfaceSoft, color: theme.ink }}
            placeholder={t.blockText}
          />
        </div>
      )}
    </div>
  );
}

function PlateBlock({ block, style, onJumpToQuestion, bookId, leafId, ui }) {
  const isTable = block.kind === "table";
  const isImage = block.kind === "image";
  const isSection = block.kind === "sectionTitle";
  const isCode = block.kind === "code";
  const isMediaCard = block.kind === "mediaCard";
  const isTitleBlock = block.kind === "titleBlock";

  const linkedBadge = block.linkedQuestionId && onJumpToQuestion ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onJumpToQuestion(bookId, leafId, block.linkedQuestionId);
      }}
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/10 hover:bg-black/20 text-inherit border border-black/10 shadow-xs ms-2 transition-transform hover:scale-105"
      title={ui?.relatedQuestion || "Jump to linked question"}
    >
      <Link2 size={10} /> {ui?.relatedQuestion || "Related Question"} <ExternalLink size={9} />
    </button>
  ) : null;

  if (isTitleBlock) {
    return (
      <div id={`plate-block-${block.id}`} style={{ width: "100%", marginBottom: "1rem", ...style }}>
        <header className="doc-head">
          <span>{block.title || "[اسم المادة]"}</span>
          <span>{block.sub || "[عنوان المحاضرة]"}</span>
        </header>
        <div className="title-block">
          <div className="subject">{block.title || "[اسم المادة]"}</div>
          <div className="lecture">{block.sub || "[عنوان المحاضرة]"}</div>
          <hr />
        </div>
      </div>
    );
  }

  if (isCode) {
    return (
      <div id={`plate-block-${block.id}`} className="code-box" style={style}>
        {block.title && (
          <div style={{ padding: "6px 14px", borderBottom: "1px solid var(--CodeFrame)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--CodeType)" }}>{block.title}</span>
            <span style={{ fontSize: 10, color: "var(--CodeComment)", textTransform: "uppercase" }}>{block.lang || "code"}</span>
            {linkedBadge}
          </div>
        )}
        <pre>{block.code || '// Enter your code here'}</pre>
      </div>
    );
  }

  if (isMediaCard) {
    return (
      <div id={`plate-block-${block.id}`} className="media-grid" style={style}>
        <div className="media-card">
          {block.imageUrl ? (
            <img src={block.imageUrl} alt={block.title || ""} />
          ) : (
            <div className="media-ph"><span>صورة توضيحية / Media</span></div>
          )}
          <div className="media-info">
            <div className="flex items-center justify-between">
              {block.title && <div className="media-title">{block.title}</div>}
              {linkedBadge}
            </div>
            {block.desc && <div className="media-desc">{block.desc}</div>}
            {block.meta && <div className="media-meta">{block.meta}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (isImage) {
    return (
      <div id={`plate-block-${block.id}`} style={{ margin: "12px 0", ...style }}>
        {block.imageUrl && <img src={block.imageUrl} alt="" style={{ width: "100%", borderRadius: 10, display: "block" }} />}
        {block.caption && <p style={{ fontSize: 11, textAlign: "center", margin: "4px 0 0", opacity: 0.75 }}>{block.caption}</p>}
        {linkedBadge}
      </div>
    );
  }

  if (isSection) {
    return (
      <div id={`plate-block-${block.id}`} className="box section-title" style={style}>
        <div className="flex items-center justify-between">
          <span>{block.text}</span>
          {linkedBadge}
        </div>
      </div>
    );
  }

  if (isTable) {
    const lines = (block.tableData || "عمود 1, عمود 2\nقيمة أ, قيمة ب").split("\n").filter(Boolean);
    const headers = lines[0] ? lines[0].split(",").map((s) => s.trim()) : [];
    const rows = lines.slice(1).map((l) => l.split(",").map((s) => s.trim()));

    return (
      <div id={`plate-block-${block.id}`} style={{ margin: "12px 0", ...style }}>
        {block.title && <p style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{block.title} {linkedBadge}</p>}
        <table className="thiqa-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const boxKindClass = {
    keyterm: "keyterm",
    note: "note",
    warning: "warning",
    important: "important",
  }[block.kind] || "note";

  return (
    <div id={`plate-block-${block.id}`} className={`box ${boxKindClass}`} style={style}>
      <div className="flex items-center justify-between mb-1">
        {block.title && <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>{block.title}</span>}
        {linkedBadge}
      </div>
      <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7 }} dir="auto">
        {block.text}
      </p>
    </div>
  );
}

const A4_CONTENT_HEIGHT_MM = 265;
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
      const h = children[i] ? children[i].getBoundingClientRect().height + 6 : 40;
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
   STUDIO PALETTE CARD DEFINITIONS FOR LEFT PANEL
================================================================== */
const STUDIO_BLOCK_DEFS = [
  { kind: "titleBlock", icon: Bookmark, en: "Doc Header", ar: "ترويسة المادة والمحاضرة", descEn: "Subject name & lecture header", descAr: "عنوان المادة واسم المحاضرة مع خط فاصل" },
  { kind: "sectionTitle", icon: Heading, en: "Section Title", ar: "عنوان قسم", descEn: "Main colored section header", descAr: "عنوان رئيسي بارز بلون الباليتة" },
  { kind: "keyterm", icon: Bookmark, en: "Key Term", ar: "مصطلح مفتاحي", descEn: "Definition box with highlighted term", descAr: "صندوق تعريف مصطلح بلون ناعم" },
  { kind: "note", icon: Info, en: "Note Box", ar: "صندوق ملاحظة", descEn: "Helpful study tip or clinical note", descAr: "ملاحظة توضيحية أو إرشادية" },
  { kind: "warning", icon: AlertTriangle, en: "Warning Box", ar: "صندوق تحذير", descEn: "Critical alert with distinct border", descAr: "تنبيه هام وملاحظة حساسة" },
  { kind: "important", icon: Star, en: "Important Box", ar: "معلومة مهمة", descEn: "High-priority emphasized box", descAr: "معلومة أساسية مميزة بلون فاقع" },
  { kind: "code", icon: CodeXml, en: "Code Box", ar: "صندوق كود", descEn: "Syntax highlighted code snippet", descAr: "كود برمجي داكن عالي التباين" },
  { kind: "mediaCard", icon: ImageIcon, en: "Media Card", ar: "بطاقة وسائط", descEn: "Image with title & description", descAr: "صورة مع عنوان ووصف ومصدر" },
  { kind: "table", icon: TableIcon, en: "Thiqa Table", ar: "جدول ثِقة", descEn: "Striped alternating data table", descAr: "جدول ملوّن متناسق مع الباليتة" },
  { kind: "pagebreak", icon: FileText, en: "Page Break", ar: "فاصل صفحة A4", descEn: "Split content into next page", descAr: "فصل المحتوى لصفحة جديدة" },
];

/* =================================================================
   A4PageBuilder (Royal View + Clean Studio Dock + Thumbnails)
================================================================== */
function A4PageBuilder({ leaf, book, lang, theme, skin, t, ui, onUpdateLeaf, allLeavesCards, allQuestions, onJumpToQuestion, sidebarOpen, sidebarTab, onSetSidebarTab }) {
  const blocks = leaf.pageBlocks || [];
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const currentPaletteNum = leaf.paletteId || book.paletteId || 1;
  const activePalette = getPalette(currentPaletteNum);
  const pageRefs = useRef([]);

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
  const addBlock = (kind) => setBlocks([...blocks, { id: `${leaf.id}-b-${Date.now()}`, kind, title: "", text: "", imageUrl: "", caption: "", tableData: "", code: "", lang: "rust", desc: "", meta: "" }]);

  const generateFromCards = () => {
    const cards = allLeavesCards;
    const gen = [
      { id: `${leaf.id}-b-title`, kind: "titleBlock", title: book[lang]?.title || book.en?.title, sub: lang === "ar" ? leaf.ar : leaf.en },
      { id: `${leaf.id}-b-sec`, kind: "sectionTitle", text: lang === "ar" ? leaf.ar : leaf.en }
    ];
    cards.forEach((card) => {
      if (card.image) gen.push({ id: `${card.id}-img`, kind: "mediaCard", imageUrl: card.image, title: "مخطط توضيحي", desc: "", meta: "" });
      card.questions?.forEach((q) => {
        const c = q[lang] || {};
        gen.push({
          id: `${q.id}-b`,
          kind: "note",
          title: (TYPE_META[q.type] || {})[lang] || q.type,
          text: c.prompt || c.template || "",
          linkedQuestionId: q.id,
        });
      });
    });
    setBlocks(gen);
  };

  const { pages, measureRef } = usePagedBlocks(blocks);

  const scrollToPage = (idx) => {
    setActivePageIndex(idx);
    pageRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Studio Top Control Bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border mb-4 shadow-xs flex-wrap"
        style={{ background: theme.surface, borderColor: theme.hairline }}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-black/10 text-xs font-bold transition-all hover:scale-105 shadow-xs"
              style={{ background: activePalette.vars["--PageBG"], color: activePalette.vars["--HeaderColor"] }}
            >
              <div className="flex h-3 w-8 rounded overflow-hidden shadow-inner border border-black/10">
                <span className="flex-1" style={{ background: activePalette.vars["--SectionBG"] }} />
                <span className="flex-1" style={{ background: activePalette.vars["--KeyBG"] }} />
                <span className="flex-1" style={{ background: activePalette.vars["--NoteBG"] }} />
              </div>
              <span>#{activePalette.num} — {activePalette.name}</span>
              <Palette size={12} className="opacity-60" />
            </button>
          </div>

          <button
            onClick={generateFromCards}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-transform hover:scale-105"
            style={{ background: theme.accentSoft, color: theme.accent }}
          >
            <Sparkles size={13} />
            <span>{t.genFromCards}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl border hover:bg-black/5 transition-colors"
            style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
          >
            <Printer size={13} />
            <span>{ui.printA4}</span>
          </button>
        </div>
      </div>

      {/* Center Studio Desk + Right Thumbnails */}
      <div className="flex gap-6 items-start justify-center relative min-h-[80vh]">
        {/* Hidden measuring pass */}
        <div ref={measureRef} style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", width: "182mm", top: -99999 }}>
          {blocks.map((b, i) => (
            <PlateBlock key={b.id || i} block={b} ui={ui} />
          ))}
        </div>

        {/* Center: A4 Paper Sheets on Desk */}
        <div className="flex-1 flex flex-col items-center min-w-0 max-w-4xl pb-20">
          {blocks.length === 0 ? (
            <div className="w-full max-w-xl p-8 my-8 text-center rounded-3xl border border-dashed shadow-sm" style={{ background: theme.surface, borderColor: theme.hairlineStrong }}>
              <div className="w-12 h-12 rounded-2xl grid place-items-center mx-auto mb-3" style={{ background: theme.accentSoft, color: theme.accent }}>
                <Sparkles size={24} />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: theme.ink }}>
                {leaf[lang] || leaf.en}
              </h3>
              <p className="text-xs mb-5 max-w-md mx-auto leading-relaxed" style={{ color: theme.inkSoft }}>
                {t.emptyPagePrompt}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={generateFromCards}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm transition-transform hover:scale-105"
                  style={{ background: theme.accent }}
                >
                  ⚡ {t.genFromCards}
                </button>
                <button
                  onClick={() => addBlock("titleBlock")}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border hover:bg-black/5 transition-colors"
                  style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
                >
                  + {t.blockTitleBlock}
                </button>
                <button
                  onClick={() => addBlock("sectionTitle")}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border hover:bg-black/5 transition-colors"
                  style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
                >
                  + {t.blockSectionTitle}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10 items-center w-full">
              {pages.map((pageBlocks, pi) => (
                <section
                  key={pi}
                  ref={(el) => (pageRefs.current[pi] = el)}
                  className="plate educraft-panel-in"
                  style={activePalette.vars}
                >
                  {pageBlocks.map((b, i) => (
                    <PlateBlock key={b.id || i} block={b} ui={ui} bookId={book.id} leafId={leaf.id} onJumpToQuestion={onJumpToQuestion} />
                  ))}
                  <div style={{ textAlign: "center", fontSize: 11, opacity: 0.6, marginTop: "1.5rem", borderTop: `1px dashed ${activePalette.vars["--SectionFrame"]}`, paddingTop: "0.5rem" }}>
                    {t.pageOf(pi + 1, pages.length)} · {book[lang]?.title || book.en?.title}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Page Thumbnails Ribbon Strip */}
        <div className="sticky top-6 hidden lg:flex flex-col gap-2.5 p-2 rounded-2xl border shrink-0 shadow-xs" style={{ background: theme.surface, borderColor: theme.hairline }}>
          <span className="text-[10px] font-black uppercase text-center opacity-60">
            {ui.thumbnailsTitle} ({pages.length})
          </span>
          <div className="flex flex-col gap-2 max-h-[75vh] overflow-y-auto px-1 py-1">
            {pages.map((p, pIdx) => {
              const isActive = activePageIndex === pIdx;
              return (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => scrollToPage(pIdx)}
                  className={`a4-thumb-item flex flex-col justify-between p-1.5 text-start ${isActive ? "active scale-105" : ""}`}
                  style={{ ...activePalette.vars, background: activePalette.vars["--PageBG"] }}
                  title={`Page ${pIdx + 1}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-bold px-1 rounded text-white" style={{ background: activePalette.vars["--SectionBG"] }}>
                      {pIdx + 1}
                    </span>
                    <span className="text-[8px] opacity-70 truncate max-w-[36px]" style={{ color: activePalette.vars["--HeaderColor"] }}>
                      A4
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 my-1 opacity-70">
                    <span className="h-1 rounded w-3/4" style={{ background: activePalette.vars["--HeaderColor"] }} />
                    <span className="h-0.5 rounded w-full" style={{ background: activePalette.vars["--SectionBG"] }} />
                    <span className="h-0.5 rounded w-1/2" style={{ background: activePalette.vars["--KeyBG"] }} />
                  </div>

                  <span className="text-[8px] text-center font-bold opacity-60 truncate">
                    {p.length} items
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => addBlock("pagebreak")}
            className="text-[10px] font-bold py-1.5 px-2 rounded-lg border border-dashed hover:bg-black/5 text-center transition-colors"
            style={{ borderColor: theme.hairlineStrong, color: theme.accent }}
            title="Add Page Break"
          >
            + New Page
          </button>
        </div>
      </div>

      {paletteModalOpen && (
        <PaletteSelectorModal
          currentPaletteId={currentPaletteNum}
          onSelectPalette={(pnum) => onUpdateLeaf({ paletteId: pnum })}
          onClose={() => setPaletteModalOpen(false)}
          ui={ui}
          theme={theme}
          dir={ui.dir}
          skin={skin}
        />
      )}
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

/* =================================================================
   buildBookExportHTML — Standalone Offline HTML Export
================================================================== */
function buildBookExportHTML({ book, lang, theme, ui }) {
  const palette = getPalette(book.paletteId || 1);
  const title = book[lang]?.title || book.en?.title;
  const tagline = book[lang]?.tagline || book.en?.tagline;
  const groups = groupLeavesByBranch(book).map(({ branch, leaves }) => ({
    branchTitle: branch[lang] || branch.en,
    leaves: leaves.map((leaf) => ({
      id: leaf.id,
      title: leaf[lang] || leaf.en,
      pageBlocks: leaf.pageBlocks || [],
      cards: leafCards(leaf).map((card) => ({
        image: card.image || null,
        imagePosition: card.imagePosition || "top",
        questions: card.questions?.map((q) => ({
          id: q.id,
          type: q.type,
          subject: q.subject || "",
          difficulty: (DIFF[lang] && DIFF[lang][q.difficulty]) || q.difficulty || "",
          code: q.code && q.code.enabled ? { lang: q.code.lang || "", src: q.code.src || "" } : null,
          linkedBlockId: q.linkedBlockId || null,
          d: q[lang] || q.en || {},
        })) || [],
      })),
    })),
  }));

  const totalLeaves = (book.nodes || []).filter((n) => n.level === "leaf").length;
  const dataJson = JSON.stringify({ id: book.id, title, tagline, totalLeaves, groups, lang, dir: ui.dir, cover: book.cover, palette }).replace(/</g, "\u003c");
  const favicon = faviconDataUri(book.cover, title);
  const vars = Object.entries(palette.vars).map(([k, v]) => `${k}:${v};`).join(" ");

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${ui.dir}" data-mode="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="icon" href="${favicon}">
<style>
  :root { ${vars} }
  *{box-sizing:border-box;}
  body{margin:0;background:var(--PageBG);color:var(--BodyText);font-family:'Amiri','Cairo',sans-serif;line-height:1.8;}
  .wrap{max-width:880px;margin:0 auto;padding:20px 18px 64px;}
  header.top{display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--KeyBG);border:1px solid var(--KeyFrame);border-radius:20px;padding:14px 18px;margin-bottom:22px;flex-wrap:wrap;}
  .tab-btn{border:none;background:transparent;color:inherit;font-weight:700;font-size:13px;padding:8px 16px;border-radius:999px;cursor:pointer;}
  .tab-btn.active{background:var(--SectionBG);color:#fff;}
  .box{border-radius:14px;padding:0.9rem 1.2rem;margin:1rem 0;box-shadow:0 3px 10px rgba(0,0,0,0.08);border-width:1.5px;border-style:solid;}
  .section-title{background:var(--SectionBG);border-color:var(--SectionFrame);color:#fff;font-weight:800;}
  .keyterm{background:var(--KeyBG);border-color:var(--KeyFrame);color:var(--KeyText);}
  .note{background:var(--NoteBG);border-color:var(--NoteFrame);color:var(--NoteText);}
  .warning{background:var(--WarningBG);border-color:var(--WarningFrame);color:var(--WarningText);border-width:2px;}
  .important{background:var(--HighlightBG);border-color:var(--ImportantText);color:var(--ImportantText);border-width:2px;font-weight:700;}
  table.thiqa-table{width:100%;border-collapse:collapse;margin:1rem 0;border-radius:10px;overflow:hidden;}
  table.thiqa-table th{background:var(--SectionBG);color:#fff;padding:0.5rem 0.8rem;}
  table.thiqa-table td{padding:0.45rem 0.8rem;border:1px solid var(--SectionFrame);}
  table.thiqa-table tr:nth-child(even) td{background:var(--KeyBG);}
  .q-card{padding:16px;border-radius:18px;margin-bottom:14px;border:1.5px solid rgba(0,0,0,0.12);box-shadow:0 3px 8px rgba(0,0,0,0.05);}
  .opt{display:block;width:100%;text-align:start;border:1.5px solid rgba(0,0,0,0.15);background:rgba(255,255,255,0.75);color:inherit;border-radius:10px;padding:8px 12px;margin-bottom:6px;cursor:pointer;font-size:13.5px;}
  .opt.sel{background:rgba(20,21,26,0.9);color:#fff;}
  .checkbtn{border:none;background:rgba(20,21,26,0.9);color:#fff;font-weight:700;font-size:12.5px;padding:8px 16px;border-radius:999px;cursor:pointer;margin-top:6px;}
  .feedback{font-size:13px;font-weight:700;margin-top:6px;}
  .feedback.ok{color:#0B7A3E;}
  .feedback.no{color:#B33A1E;}
  .hidden{display:none !important;}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1 style="margin:0;font-size:18px;">${title}</h1>
    <div style="display:flex;gap:6px;">
      <button class="tab-btn active" id="tabBook" onclick="showTab('book')">📖 ${lang === "ar" ? "الكتاب والأسئلة" : "Questions"}</button>
      <button class="tab-btn" id="tabA4" onclick="showTab('a4')">📄 ${lang === "ar" ? "صفحات A4" : "A4 Plates"}</button>
    </div>
  </header>

  <section id="view-book">
    <h2>${title}</h2>
    <p style="opacity:0.75;">${tagline}</p>
    <div id="bookContent"></div>
  </section>

  <section id="view-a4" class="hidden">
    <div id="a4Content"></div>
  </section>
</div>

<script>
const DATA = ${dataJson};
function showTab(t){
  document.getElementById('view-book').classList.toggle('hidden', t !== 'book');
  document.getElementById('view-a4').classList.toggle('hidden', t !== 'a4');
  document.getElementById('tabBook').classList.toggle('active', t === 'book');
  document.getElementById('tabA4').classList.toggle('active', t === 'a4');
}

function renderExport(){
  let bOut = "";
  let aOut = "";
  DATA.groups.forEach(g => {
    bOut += '<h3 style="margin-top:24px;border-bottom:1px solid var(--KeyFrame);padding-bottom:6px;">' + g.branchTitle + '</h3>';
    g.leaves.forEach(l => {
      bOut += '<h4>' + l.title + '</h4>';
      l.cards.forEach(c => {
        c.questions.forEach(q => {
          bOut += '<div class="q-card" style="background:#FFFDFB;">';
          bOut += '<div style="font-weight:700;margin-bottom:8px;">' + (q.d.prompt || q.d.template || '') + '</div>';
          if(q.d.options){
            q.d.options.forEach((opt, idx) => {
              bOut += '<button class="opt" onclick="this.parentElement.querySelectorAll(\'.opt\').forEach(x=>x.classList.remove(\'.sel\'));this.classList.add(\'.sel\');">' + opt + '</button>';
            });
          }
          bOut += '</div>';
        });
      });

      if(l.pageBlocks && l.pageBlocks.length > 0){
        aOut += '<div style="background:var(--PageBG);border:1px solid var(--KeyFrame);border-radius:12px;padding:16px;margin-bottom:20px;">';
        aOut += '<h3 style="color:var(--HeaderColor);margin-top:0;">' + l.title + '</h3>';
        l.pageBlocks.forEach(b => {
          if(b.kind === 'sectionTitle') aOut += '<div class="box section-title">' + b.text + '</div>';
          else if(b.kind === 'keyterm') aOut += '<div class="box keyterm"><b>' + (b.title||'') + ':</b> ' + b.text + '</div>';
          else if(b.kind === 'note') aOut += '<div class="box note"><b>' + (b.title||'') + ':</b> ' + b.text + '</div>';
          else if(b.kind === 'warning') aOut += '<div class="box warning"><b>' + (b.title||'') + ':</b> ' + b.text + '</div>';
          else if(b.kind === 'important') aOut += '<div class="box important"><b>' + (b.title||'') + ':</b> ' + b.text + '</div>';
        });
        aOut += '</div>';
      }
    });
  });
  document.getElementById('bookContent').innerHTML = bOut;
  document.getElementById('a4Content').innerHTML = aOut;
}
renderExport();
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
  a.download = `${slugify(book[lang]?.title || book.en?.title)}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* =================================================================
   MAIN EDUcraftApp
================================================================== */
export default function EDUcraftApp() {
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState("light");
  const [flavorId, setFlavorId] = useState("normal");
  const [skinId, setSkinId] = useState("normal");
  const [cardMode, setCardMode] = useState("paged");
  const [scrollDir, setScrollDir] = useState("vertical");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Bag & Book Data State
  const [bags, setBags] = useState(() => {
    try {
      const saved = localStorage.getItem("educraft_bags");
      return saved ? JSON.parse(saved) : DEFAULT_BAGS;
    } catch (e) {
      return DEFAULT_BAGS;
    }
  });

  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem("educraft_books");
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch (e) {
      return INITIAL_BOOKS;
    }
  });

  const [covers, setCovers] = useState(() => {
    try {
      const saved = localStorage.getItem("educraft_covers");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [screen, setScreen] = useState("library"); // "library" | "tree" | "deck" | "browse" | "editor"
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedLeafId, setSelectedLeafId] = useState(null);
  const [editorSubTab, setEditorSubTab] = useState("pages"); // "cards" | "pages"
  const [studioSidebarOpen, setStudioSidebarOpen] = useState(true);
  const [studioSidebarTab, setStudioSidebarTab] = useState("outline"); // "outline" | "blocks" | "inspector"

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem("educraft_bags", JSON.stringify(bags));
    } catch (e) {}
  }, [bags]);

  useEffect(() => {
    try {
      localStorage.setItem("educraft_books", JSON.stringify(books));
    } catch (e) {}
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem("educraft_covers", JSON.stringify(covers));
    } catch (e) {}
  }, [covers]);

  const ui = UI[lang] || UI.ar;
  const dir = ui.dir;
  const theme = FLAVORS[flavorId]?.[mode] || FLAVORS.normal.light;
  const skin = SKINS[skinId] || SKINS.normal;

  const currentBook = useMemo(() => books.find((b) => b.id === selectedBookId) || books[0], [books, selectedBookId]);
  const currentLeaf = useMemo(() => {
    const leaves = (currentBook?.nodes || []).filter((n) => n.level === "leaf");
    if (!leaves.length) return null;
    return leaves.find((n) => n.id === selectedLeafId) || leaves[0];
  }, [currentBook, selectedLeafId]);

  // Ensure selectedLeafId is always valid when entering editor
  useEffect(() => {
    if (currentBook && (!selectedLeafId || !(currentBook.nodes || []).some((n) => n.id === selectedLeafId))) {
      const firstLeaf = (currentBook.nodes || []).find((n) => n.level === "leaf");
      if (firstLeaf) setSelectedLeafId(firstLeaf.id);
    }
  }, [currentBook, selectedLeafId]);

  // Jump navigation between Questions and A4 Blocks
  const handleJumpToBlock = (bId, lId, blockId) => {
    setSelectedBookId(bId);
    setSelectedLeafId(lId);
    setScreen("editor");
    setEditorSubTab("pages");
    setTimeout(() => {
      const el = document.getElementById(`plate-block-${blockId}`) || document.getElementById(`block-editor-${blockId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("educraft-highlight");
        setTimeout(() => el.classList.remove("educraft-highlight"), 3000);
      }
    }, 150);
  };

  const handleJumpToQuestion = (bId, lId, questionId) => {
    setSelectedBookId(bId);
    setSelectedLeafId(lId);
    setScreen("deck");
    setTimeout(() => {
      const el = document.getElementById(`q-item-${questionId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("educraft-highlight");
        setTimeout(() => el.classList.remove("educraft-highlight"), 3000);
      }
    }, 150);
  };

  const handleUpdateBook = (updated) => {
    setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleUpdateCurrentLeaf = (patch) => {
    if (!currentBook || !currentLeaf) return;
    const updatedNodes = currentBook.nodes.map((n) => (n.id === currentLeaf.id ? { ...n, ...patch } : n));
    handleUpdateBook({ ...currentBook, nodes: updatedNodes });
  };

  const handleAddBook = () => {
    const titlePrompt = window.prompt(dir === "rtl" ? "أدخل عنوان الكتاب أو الموسوعة الجديدة:" : "Enter new book / encyclopedia title:", "");
    if (!titlePrompt || !titlePrompt.trim()) return;
    const isEncy = window.confirm(dir === "rtl" ? "هل تريد إنشاءها كـ 'موسوعة'؟ (اضغط Cancel لإنشاء 'كتاب'):" : "Create as Encyclopedia? (Press Cancel for Book):");
    const newId = `book-${Date.now()}`;
    const newBook = {
      id: newId,
      type: isEncy ? "encyclopedia" : "book",
      bagId: bags[0]?.id || "bag-frontend",
      paletteId: 1,
      cover: { from: "#F2C879", to: "#E8654A", icon: "code" },
      en: { title: titlePrompt.trim(), tagline: "New Educational Workspace" },
      ar: { title: titlePrompt.trim(), tagline: "مساحة تعليمية جديدة" },
      crossLinks: [],
      nodes: [
        { id: "b1", level: "branch", x: 400, y: BRANCH_Y, en: "Branch 1", ar: "الفرع 1" },
        { id: "s1", level: "sub", parent: "b1", x: 400, y: SUB_Y, en: "Sub-branch 1", ar: "الفرع الفرعي 1" },
        {
          id: "l1",
          level: "leaf",
          parent: "s1",
          x: 400,
          y: LEAF_Y,
          en: "Leaf 1",
          ar: "الورقة 1",
          paletteId: 1,
          pageBlocks: [{ id: "l1-b1", kind: "sectionTitle", text: titlePrompt.trim() }],
          questions: [
            {
              id: `q-${Date.now()}`,
              type: "single",
              subject: "General",
              difficulty: "Beginner",
              tier: "core",
              dir: "ltr",
              en: { prompt: "Sample question?", options: ["Option A", "Option B"], correct: 0 },
              ar: { prompt: "سؤال تجريبي؟", options: ["اختيار أ", "اختيار ب"], correct: 0 },
            },
          ],
        },
      ],
    };
    setBooks((prev) => [...prev, newBook]);
    setSelectedBookId(newId);
    setScreen("tree");
  };

  const handleResetData = () => {
    localStorage.clear();
    setBags(DEFAULT_BAGS);
    setBooks(INITIAL_BOOKS);
    setCovers({});
    setScreen("library");
    setSettingsOpen(false);
  };

  const allLeaves = useMemo(() => (currentBook?.nodes || []).filter((n) => n.level === "leaf"), [currentBook]);
  const allCurrentQuestions = useMemo(() => {
    if (!currentLeaf) return [];
    return leafCards(currentLeaf).flatMap((g) => g.questions);
  }, [currentLeaf]);

  const addStudioBlock = (kind) => {
    if (!currentLeaf) return;
    const currentBlocks = currentLeaf.pageBlocks || [];
    const newBlock = {
      id: `${currentLeaf.id}-b-${Date.now()}`,
      kind,
      title: "",
      text: "",
      imageUrl: "",
      caption: "",
      tableData: "",
      code: "",
      lang: "rust",
      desc: "",
      meta: "",
    };
    handleUpdateCurrentLeaf({ pageBlocks: [...currentBlocks, newBlock] });
    setStudioSidebarTab("inspector");
  };

  return (
    <div
      dir={dir}
      className="educraft-root min-h-screen transition-colors duration-200 flex flex-col"
      style={{
        background: theme.canvas,
        color: theme.ink,
        fontFamily: ui.bodyFont,
      }}
    >
      {/* TOP NAVIGATION BAR — Uses theme.header (Soft sage green restored) */}
      <header
        className="w-full border-b px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap sticky top-0 z-40"
        style={{
          background: skin.surfaceAlpha >= 1 ? theme.header : hexToRgba(theme.header, skin.surfaceAlpha),
          borderColor: theme.hairlineStrong,
          backdropFilter: skin.blur,
          WebkitBackdropFilter: skin.blur,
        }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setScreen("library")} className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <img src="/icon.png" alt="EDUcraft" className="w-7 h-7 rounded-lg object-contain shadow-xs" />
            <span className="text-base font-black tracking-tight" style={{ fontFamily: ui.displayFont }}>
              {ui.brand}
            </span>
          </button>

          {/* Pill Navigation Tabs (Orange Pill Reference) */}
          <nav className="flex items-center gap-1.5 ms-2">
            <PillTabButton active={screen === "library"} onClick={() => setScreen("library")} icon={Library} theme={theme}>
              {ui.navLibrary}
            </PillTabButton>

            {currentBook && (
              <>
                <PillTabButton active={screen === "tree" || screen === "deck" || screen === "browse"} onClick={() => setScreen("tree")} icon={GitBranch} theme={theme}>
                  {ui.navTree}
                </PillTabButton>

                <PillTabButton active={screen === "editor"} onClick={() => setScreen("editor")} icon={Pencil} theme={theme}>
                  {ui.navEditor}
                </PillTabButton>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang((l) => (l === "ar" ? "en" : "ar"))}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border hover:bg-black/5 transition-colors"
            style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
          >
            {ui.langToggle}
          </button>

          <button
            onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
            className="w-8 h-8 grid place-items-center rounded-lg border hover:bg-black/5 transition-colors"
            style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
          >
            {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="w-8 h-8 grid place-items-center rounded-lg border hover:bg-black/5 transition-colors"
            style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
          >
            <Settings size={15} />
          </button>
        </div>
      </header>

      {/* MAIN BODY CONTENT */}
      <main className="flex-1 flex flex-col">
        {screen === "library" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
            <LibraryView
              lang={lang}
              ui={ui}
              theme={theme}
              dir={dir}
              skin={skin}
              books={books}
              bags={bags}
              covers={covers}
              onOpen={(bookId) => {
                setSelectedBookId(bookId);
                setScreen("tree");
              }}
              onChangeCover={(bId, data) => setCovers((c) => ({ ...c, [bId]: data }))}
              onClearCover={(bId) =>
                setCovers((c) => {
                  const n = { ...c };
                  delete n[bId];
                  return n;
                })
              }
              onAddBag={(newBag) => setBags((prev) => [...prev, newBag])}
              onMoveBookBag={(bId, newBagId) => {
                setBooks((prev) => prev.map((b) => (b.id === bId ? { ...b, bagId: newBagId } : b)));
              }}
              onAddBook={handleAddBook}
            />
          </div>
        )}

        {screen === "tree" && currentBook && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
            <TreeView
              book={currentBook}
              lang={lang}
              ui={ui}
              theme={theme}
              dir={dir}
              skin={skin}
              covers={covers}
              selectedLeaf={selectedLeafId}
              onBack={() => setScreen("library")}
              onSelectLeaf={(leafId) => {
                setSelectedLeafId(leafId);
                setScreen("deck");
              }}
              onBrowse={() => setScreen("browse")}
              onExport={() => downloadBookHTML(currentBook, lang, theme, ui)}
              onChangeCover={(bId, data) => setCovers((c) => ({ ...c, [bId]: data }))}
              onClearCover={(bId) =>
                setCovers((c) => {
                  const n = { ...c };
                  delete n[bId];
                  return n;
                })
              }
            />
          </div>
        )}

        {screen === "deck" && currentBook && currentLeaf && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full">
            <DeckView
              node={currentLeaf}
              book={currentBook}
              lang={lang}
              ui={ui}
              theme={theme}
              dir={dir}
              skin={skin}
              cardMode={cardMode}
              scrollDir={scrollDir}
              onBack={() => setScreen("tree")}
              onJumpToBlock={handleJumpToBlock}
            />
          </div>
        )}

        {screen === "browse" && currentBook && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full">
            <BrowseView
              book={currentBook}
              lang={lang}
              ui={ui}
              theme={theme}
              dir={dir}
              skin={skin}
              onBack={() => setScreen("tree")}
              onJumpToBlock={handleJumpToBlock}
            />
          </div>
        )}

        {screen === "editor" && currentBook && (
          <div className="flex-1 flex flex-col w-full">
            {/* Studio Workspace Header Bar */}
            <div
              className="w-full border-b px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap"
              style={{ background: theme.surface, borderColor: theme.hairline }}
            >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setStudioSidebarOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border hover:bg-black/5 transition-colors"
                  style={{ borderColor: theme.hairlineStrong, color: theme.ink }}
                  title={studioSidebarOpen ? ui.hideEditorPanel : ui.showEditorPanel}
                >
                  {studioSidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
                  <span className="hidden sm:inline">{studioSidebarOpen ? ui.hideEditorPanel : ui.showEditorPanel}</span>
                </button>

                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: theme.inkSoft }}>
                  <span className="font-bold" style={{ color: theme.ink }}>{currentBook[lang]?.title || currentBook.en?.title}</span>
                  <span>/</span>
                  <span className="px-2 py-0.5 rounded-md font-bold" style={{ background: theme.accentSoft, color: theme.accent }}>
                    {currentLeaf ? (currentLeaf[lang] || currentLeaf.en) : "..."}
                  </span>
                </div>
              </div>

              {/* Sub-Tabs: Cards vs A4 Pages */}
              <div className="flex items-center gap-1 p-1 rounded-full border shadow-xs" style={{ background: theme.canvas, borderColor: theme.hairlineStrong }}>
                <PillTabButton active={editorSubTab === "pages"} onClick={() => setEditorSubTab("pages")} icon={BookOpen} theme={theme}>
                  {EDITOR_STR[lang]?.tabPages || "A4 Pages"}
                </PillTabButton>

                <PillTabButton active={editorSubTab === "cards"} onClick={() => setEditorSubTab("cards")} icon={Layers} theme={theme}>
                  {EDITOR_STR[lang]?.tabCards || "Cards"}
                </PillTabButton>
              </div>
            </div>

            {/* Studio Workspace 3-Pane Body */}
            <div className="flex-1 flex w-full relative">
              {/* Unified Left Studio Sidebar */}
              <aside
                className={`transition-all duration-300 ease-in-out shrink-0 border-e overflow-hidden flex flex-col ${
                  studioSidebarOpen ? "w-[320px] opacity-100" : "w-0 opacity-0 pointer-events-none"
                }`}
                style={{ background: theme.surface, borderColor: theme.hairline }}
              >
                {/* Sidebar Navigation Tabs */}
                <div className="flex items-center border-b p-1.5 gap-1 shrink-0" style={{ borderColor: theme.hairline, background: theme.surfaceSoft }}>
                  <button
                    onClick={() => setStudioSidebarTab("outline")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                      studioSidebarTab === "outline" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    🌿 {EDITOR_STR[lang]?.tabOutline}
                  </button>

                  {editorSubTab === "pages" && (
                    <>
                      <button
                        onClick={() => setStudioSidebarTab("blocks")}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                          studioSidebarTab === "blocks" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        🧩 {EDITOR_STR[lang]?.tabAddBlocks}
                      </button>

                      <button
                        onClick={() => setStudioSidebarTab("inspector")}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                          studioSidebarTab === "inspector" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        ✏️ {EDITOR_STR[lang]?.tabInspector} ({currentLeaf?.pageBlocks?.length || 0})
                      </button>
                    </>
                  )}
                </div>

                {/* Sidebar Tab Contents */}
                <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3">
                  {studioSidebarTab === "outline" && (
                    <EditorLeafNav
                      book={currentBook}
                      lang={lang}
                      theme={theme}
                      selectedLeafId={selectedLeafId}
                      onSelect={(id) => setSelectedLeafId(id)}
                    />
                  )}

                  {studioSidebarTab === "blocks" && editorSubTab === "pages" && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-bold mb-1" style={{ color: theme.inkSoft }}>
                        {dir === "rtl" ? "اختر عنصراً لإضافته للصفحة:" : "Select a block to add to page:"}
                      </p>
                      {STUDIO_BLOCK_DEFS.map((bDef) => {
                        const Icon = bDef.icon;
                        return (
                          <button
                            key={bDef.kind}
                            onClick={() => addStudioBlock(bDef.kind)}
                            className="flex items-start gap-3 p-2.5 rounded-xl border text-start transition-all hover:scale-[1.01] hover:border-black/25 shadow-xs"
                            style={{ background: theme.surfaceSoft, borderColor: theme.hairline }}
                          >
                            <div className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: theme.accentSoft, color: theme.accent }}>
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block text-xs font-bold" style={{ color: theme.ink }}>
                                {bDef[lang] || bDef.en}
                              </span>
                              <span className="block text-[10px] leading-tight opacity-70 truncate" style={{ color: theme.inkSoft }}>
                                {bDef[`desc${lang === "ar" ? "Ar" : "En"}`] || bDef.descEn}
                              </span>
                            </div>
                            <Plus size={14} className="opacity-50 mt-1 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {studioSidebarTab === "inspector" && editorSubTab === "pages" && currentLeaf && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold" style={{ color: theme.inkSoft }}>
                          {EDITOR_STR[lang]?.tabInspector}
                        </span>
                        <button
                          onClick={() => setStudioSidebarTab("blocks")}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
                          style={{ background: theme.accent }}
                        >
                          + {EDITOR_STR[lang]?.addBlock}
                        </button>
                      </div>

                      {(currentLeaf.pageBlocks || []).map((b, i) => (
                        <BlockRow
                          key={b.id || i}
                          block={b}
                          t={EDITOR_STR[lang] || EDITOR_STR.ar}
                          theme={theme}
                          skin={skin}
                          allQuestions={allCurrentQuestions}
                          onUpdate={(p) => {
                            const updated = (currentLeaf.pageBlocks || []).map((bb, idx) => (idx === i ? { ...bb, ...p } : bb));
                            handleUpdateCurrentLeaf({ pageBlocks: updated });
                          }}
                          onDelete={() => {
                            const updated = (currentLeaf.pageBlocks || []).filter((_, idx) => idx !== i);
                            handleUpdateCurrentLeaf({ pageBlocks: updated });
                          }}
                          onMove={(dir2) => () => {
                            const blocksList = currentLeaf.pageBlocks || [];
                            const j = i + dir2;
                            if (j < 0 || j >= blocksList.length) return;
                            const next = [...blocksList];
                            [next[i], next[j]] = [next[j], next[i]];
                            handleUpdateCurrentLeaf({ pageBlocks: next });
                          }}
                          onJumpToQuestion={handleJumpToQuestion}
                          bookId={currentBook.id}
                          leafId={currentLeaf.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </aside>

              {/* Center Canvas Studio Workspace */}
              <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6" style={{ background: theme.canvas }}>
                {currentLeaf ? (
                  editorSubTab === "cards" ? (
                    <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <h2 className="text-lg font-bold" style={{ color: theme.ink }}>
                          {currentLeaf[lang] || currentLeaf.en} — {EDITOR_STR[lang]?.tabCards}
                        </h2>

                        <button
                          onClick={() => {
                            const newCard = {
                              id: `${currentLeaf.id}-card-${Date.now()}`,
                              image: null,
                              imagePosition: "top",
                              questions: [],
                            };
                            const updatedCards = [...(currentLeaf.cards || leafCards(currentLeaf)), newCard];
                            handleUpdateCurrentLeaf({ cards: updatedCards });
                          }}
                          className="text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-xs transition-transform hover:scale-105"
                          style={{ background: theme.accent }}
                        >
                          + {EDITOR_STR[lang]?.newCard}
                        </button>
                      </div>

                      {(currentLeaf.cards || leafCards(currentLeaf)).map((card, idx) => (
                        <CardEditor
                          key={card.id || idx}
                          card={card}
                          lang={lang}
                          theme={theme}
                          skin={skin}
                          t={EDITOR_STR[lang] || EDITOR_STR.ar}
                          voiceEnabled={voiceEnabled}
                          allLeaves={allLeaves}
                          currentLeafId={currentLeaf.id}
                          pageBlocks={currentLeaf.pageBlocks || []}
                          onUpdateCard={(patch) => {
                            const cards = currentLeaf.cards || leafCards(currentLeaf);
                            const updated = cards.map((c, i) => (i === idx ? { ...c, ...patch } : c));
                            handleUpdateCurrentLeaf({ cards: updated });
                          }}
                          onDeleteCard={() => {
                            const cards = currentLeaf.cards || leafCards(currentLeaf);
                            handleUpdateCurrentLeaf({ cards: cards.filter((_, i) => i !== idx) });
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <A4PageBuilder
                      leaf={currentLeaf}
                      book={currentBook}
                      lang={lang}
                      theme={theme}
                      skin={skin}
                      t={EDITOR_STR[lang] || EDITOR_STR.ar}
                      ui={ui}
                      allLeavesCards={leafCards(currentLeaf)}
                      allQuestions={allCurrentQuestions}
                      onUpdateLeaf={handleUpdateCurrentLeaf}
                      onJumpToQuestion={handleJumpToQuestion}
                      sidebarOpen={studioSidebarOpen}
                      sidebarTab={studioSidebarTab}
                      onSetSidebarTab={setStudioSidebarTab}
                    />
                  )
                ) : (
                  <div className="p-12 text-center rounded-2xl border border-dashed m-auto" style={{ borderColor: theme.hairlineStrong, color: theme.inkSoft }}>
                    <GitBranch size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold">
                      {EDITOR_STR[lang]?.noLeaf || "Pick a leaf on the left to start editing."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

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
          onReset={handleResetData}
        />
      )}
    </div>
  );
}
