# دليل وقواعد بنية كتاب EDUcraft JSON الرسمية الموحدة (الإصدار 0.0.9+ و Schema 1.1)
# EDUcraft Master JSON Specification (v0.0.9+ & Schema 1.1)

هذا الملف يمثل المرجع الشامل والنهائي لكتابة، تعديل، والتحقق من ملفات كتب وموسوعات EDUcraft بصيغة JSON (`book.json` / `all_educraft_books.json`).
تم تصميمه ليتوافق بنسبة 100% مع محرك التحقق الصارم في Rust (`src-tauri/src/book_manager/validator.rs`) ومحرك الاستيراد الذكي في الواجهة (`src/utils/importer.js`).

---

## فهرس المحتويات
1. [القاعدة الذهبية (Rule 1 is Absolute)](#1-القاعدة-الذهبية-rule-1-is-absolute)
2. [الهيكل العام لكتاب EDUcraft (Schema 1.1 Root)](#2-الهيكل-العام-لكتاب-educraft-schema-11-root)
3. [بنية الشجرة، الفروع والأوراق (Tree Structure & Nodes)](#3-بنية-الشجرة-الفروع-والأوراق-tree-structure--nodes)
4. [أنواع كتل المحتوى الـ 10 (ContentBlock Types)](#4-أنواع-كتل-المحتوى-الـ-10-contentblock-types)
5. [أنواع الأسئلة الـ 13 الكاملة (Question Types)](#5-أنواع-الأسئلة-الـ-13-الكاملة-question-types)
6. [نظام الأصول وربط الصور المحلية (Knowledge Assets & Local Images)](#6-نظام-الأصول-وربط-الصور-المحلية-knowledge-assets--local-images)
7. [بنية الموسوعات والمجلدات (Collections & Encyclopedias)](#7-بنية-الموسوعات-والمجلدات-collections--encyclopedias)
8. [قائمة التحقق قبل الاستيراد (Pre-Import Checklist)](#8-قائمة-التحقق-قبل-الاستيراد-pre-import-checklist)

---

## 1. القاعدة الذهبية (Rule 1 is Absolute)
> **لا يُسمح أبداً بكسر توافقية الكتب السابقة.**
- أي كتاب قديم بصيغة `1.0` (لا يحتوي على `schema_version` أو `capabilities` أو `manifest`) يُقبل بنسبة 100% ويعمل دون أي تحذير أو أخطاء.
- النظام يقوم تلقائياً بترقية الكتب القديمة إلى Schema `1.1` داخلياً دون المساس بالملفات الأصلية.
- وجود 0 أصول أو عدم وجود صور هو أمر طبيعي وافتراضي تماماً (Rule 9).

---

## 2. الهيكل العام لكتاب EDUcraft (Schema 1.1 Root)

```json
{
  "schema_version": "1.1",
  "id": "01-html-master-curriculum",
  "ar": {
    "title": "كتاب لغة الويب HTML",
    "tagline": "المسار الاحترافي الشامل من الصفر حتى بناء الواجهات المتقدمة"
  },
  "en": {
    "title": "HTML Master Curriculum",
    "tagline": "From Zero to Production-Ready Web Architecture"
  },
  "cover": {
    "from": "#ea580c",
    "to": "#c2410c"
  },
  "capabilities": [
    "images",
    "quizzes",
    "cross_links",
    "reading_progress"
  ],
  "metadata": {
    "author": "EDUcraft Architecture Team",
    "version": "1.1.0",
    "created_at": "2026-09-05",
    "license": "MIT",
    "tags": ["frontend", "html", "web-standards"]
  },
  "assets": {
    "manifest_path": "assets/manifest.json",
    "total_count": 0
  },
  "recommended_plugins": [
    "com.educraft.latex-math",
    "com.educraft.code-playground"
  ],
  "nodes": [
    ...
  ],
  "crossLinks": [
    ["leaf_intro", "leaf_tags"]
  ]
}
```

### الحقول الأساسية ومعانيها:
- **`schema_version`** *(اختياري)*: نص يحدد الإصدار، `"1.1"` للإصدارات الحديثة، وافتراضياً `"1.0"`.
- **`id`** *(إجباري)*: معرّف فريد للكتاب بالحروف الإنجليزية الصغيرة والأرقام والشرطات (slug)، مثل `"01-html-master-curriculum"`.
- **`ar` & `en`** *(إجباريان)*: كائن يحتوي على `title` (عنوان الكتاب) و `tagline` (الوصف المختصر).
- **`cover`** *(إجباري في الواجهة)*: كائن يحتوي على تدرج لوني `from` و `to` بصيغة HEX (مثل `"#3b82f6"`).
- **`capabilities`** *(جديد في 1.1)*: مصفوفة بالقدرات المفعلة في الكتاب:
  - `"images"`: استدعاء وحل الصور والأصول متعددة الوسائط.
  - `"quizzes"`: تفعيل نظام الاختبارات وتصحيح الأسئلة.
  - `"cross_links"`: روابط المتطلبات السابقة والانتقال السريع.
  - `"reading_progress"`: حفظ وتتبع تقدم القراءة وسجل الطالب.
- **`metadata`** *(جديد في 1.1)*: بيانات المؤلف، تاريخ الإنشاء، والوسوم.
- **`recommended_plugins`** *(جديد في 1.1)*: مصفوفة بمعرفات إضافات تيتانيوم الموصى بتفعيلها مع هذا الكتاب.
- **`nodes`** *(إجباري)*: مصفوفة عقد الشجرة (الفصول والأوراق).
- **`crossLinks`** *(اختياري)*: مصفوفة علاقات المتطلبات السابقة، إما مصفوفة ثنائية `["leaf_A", "leaf_B"]` (حيث A متطلب لـ B) أو كائن `{"from": "leaf_A", "to": "leaf_B"}`.

---

## 3. بنية الشجرة، الفروع والأوراق (Tree Structure & Nodes)

تتكون الشجرة من نوعين من العقد في مصفوفة `nodes`:
1. **`branch` (فصل / وحدة رئيسية)**:
   - لا يحتوي على محتوى مباشر، بل يجمع تحته الأوراق (`leaves`).
   - حقله `level` يكون دائماً `"branch"`.
   - حقله `parent` يكون إما `null` أو معرّف الفرع الأب.
2. **`leaf` (ورقة درسية / صفحة محتوى)**:
   - يحتوي على المحتوى التعليمي والأسئلة داخل كائن `extra`.
   - حقله `level` يكون دائماً `"leaf"`.
   - حقله `parent` يكون معرّف الـ `branch` التابع له.

```json
{
  "id": "branch_01",
  "level": "branch",
  "parent": null,
  "ar": "الفصل الأول: أساسيات لغة HTML",
  "en": "Chapter 1: HTML Fundamentals",
  "extra": {}
},
{
  "id": "leaf_html_intro",
  "level": "leaf",
  "parent": "branch_01",
  "ar": "مقدمة عن بنية الويب ومستند HTML",
  "en": "Introduction to Web Structure and HTML Documents",
  "extra": {
    "pagePaletteId": "amber",
    "pageBlocks": [ ... ],
    "cards": [ ... ],
    "questions": [ ... ]
  }
}
```

### حقول كائن `extra` في الـ `leaf`:
- **`pagePaletteId`**: لون وهوية الصفحة (مثل `"amber"`, `"emerald"`, `"indigo"`, `"rose"`, `"sky"`, `"violet"`).
- **`pageBlocks`**: مصفوفة كتل المحتوى التي تتدفق كصفحات A4 مقروءة.
- **`cards`** أو **`questions`**: كروت وأسئلة الاختبار التفاعلية الخاصة بالدرس.

---

## 4. أنواع كتل المحتوى الـ 10 (ContentBlock Types)

توضع في مصفوفة `pageBlocks` داخل `node.extra`:

### 1. `sectionTitle` (عنوان قسم رئيسي أو فرعي)
```json
{
  "id": "blk_sec_01",
  "kind": "sectionTitle",
  "title": "هيكلية مستند HTML5 القياسي",
  "subtitle": "العناصر الأساسية لبناء صفحة متوافقة مع المعايير الحديثة",
  "level": 2,
  "concepts": ["html5_doctype", "html_structure"]
}
```

### 2. `keyterm` (مصطلح رئيسي وتعريفه)
```json
{
  "id": "blk_term_01",
  "kind": "keyterm",
  "term": "DOM (Document Object Model)",
  "definition": "تمثيل شجري برمجي لكافة عناصر وخصائص صفحة الويب في ذاكرة المتصفح.",
  "concepts": ["dom_tree"]
}
```

### 3. `note` (ملاحظة تعليمية أو إيضاح إضافي)
```json
{
  "id": "blk_note_01",
  "kind": "note",
  "title": "نصيحة للمطورين",
  "text": "احرص دائماً على تحديد سمة lang='ar' في وسم html لدعم قارئات الشاشة والخطوط."
}
```

### 4. `warning` (تحذير هام لتجنب الأخطاء الشائعة)
```json
{
  "id": "blk_warn_01",
  "kind": "warning",
  "title": "تجنب استخدام الجداول للتنسيق",
  "text": "استخدام عناصر table لتخطيط الصفحة يضر بإمكانية الوصول (a11y) وتهيئة محركات البحث (SEO)."
}
```

### 5. `important` (معلومة جوهرية لا غنى عنها)
```json
{
  "id": "blk_imp_01",
  "kind": "important",
  "title": "إغلاق الوسوم الذاتية",
  "text": "في معيار HTML5 الحديث لا يلزم وضع شرطة مائلة في نهاية عناصر مثل img أو input."
}
```

### 6. `code` (كتلة كود برمجي مع تلوين نحوي)
```json
{
  "id": "blk_code_01",
  "kind": "code",
  "lang": "html",
  "title": "بنية الصفحة الأساسية",
  "code": "<!DOCTYPE html>\n<html lang=\"ar\" dir=\"rtl\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>صفحتي الأولى</title>\n  </head>\n  <body>\n    <h1>مرحباً بالعالم</h1>\n  </body>\n</html>"
}
```

### 7. `image` (صورة أو رسم توضيحي مع رابط أو معرف أصل)
```json
{
  "id": "blk_img_01",
  "kind": "image",
  "imageUrl": "assets/images/dom_hierarchy.png",
  "asset_id": "asset_dom_hierarchy_01",
  "caption": "رسم توضيحي لشجرة الـ DOM وتفرع العناصر من العقدة الجذرية",
  "alt": "مخطط شجرة DOM لصفحة HTML",
  "concepts": ["dom_tree"]
}
```

### 8. `table` (جدول مقارنات أو بيانات منظم)
> **شرط Rust الصارم**: يجب أن تحتوي `headers` على عمود واحد على الأقل، وكل صف في `rows` يجب أن يكون مصفوفة خلايا بنفس عدد الأعمدة.
```json
{
  "id": "blk_tbl_01",
  "kind": "table",
  "caption": "مقارنة بين عناصر التكتل والعناصر السطرية",
  "headers": ["نوع العنصر", "سلوك العرض", "أمثلة شائعة"],
  "rows": [
    ["Block Element", "يشغل السطر كاملاً ويبدأ في سطر جديد", "div, p, h1, section"],
    ["Inline Element", "يشغل مساحة محتواه فقط ولا ينكسر السطر", "span, a, strong, em"]
  ]
}
```

### 9. `callout` (صندوق بارز مع أيقونة أو تنبيه خاص)
```json
{
  "id": "blk_call_01",
  "kind": "callout",
  "icon": "lightbulb",
  "title": "فكرة ذكية",
  "text": "استخدم وسم main مرة واحدة فقط في كل مستند لتعريف المحتوى الفريد للصفحة."
}
```

### 10. `pagebreak` (فاصل صفحات يدوي للطباعة و A4)
> **شرط Rust الصارم**: مسموح به في `pageBlocks` فقط، وممنوع منعاً باتاً استخدامه داخل محتوى الأسئلة.
```json
{
  "id": "blk_pb_01",
  "kind": "pagebreak"
}
```

---

## 5. أنواع الأسئلة الـ 13 الكاملة (Question Types)

توضع في مصفوفة `questions` داخل `node.extra`:

### 1. `single` (اختيار من متعدد - إجابة واحدة صحيحة)
> **شرط**: `options` مصفوفة بها خيارين على الأقل، و `correct` رقم فهرس صحيح `0 <= correct < options.length`.
```json
{
  "id": "q_html_01",
  "type": "single",
  "subject": "html_basics",
  "concepts": ["html_tags"],
  "ar": {
    "prompt": "ما هو الوسم المسؤول عن تعريف أهم عنوان رئيسي في صفحة الويب؟",
    "options": ["<header>", "<h1>", "<title>", "<main>"],
    "correct": 1,
    "explanation": "العنصر <h1> هو المسؤول دلالياً عن العنوان الرئيسي الأول للمقال أو الصفحة."
  },
  "en": {
    "prompt": "Which tag represents the most important top-level heading in an HTML page?",
    "options": ["<header>", "<h1>", "<title>", "<main>"],
    "correct": 1,
    "explanation": "The <h1> element represents the main top-level heading."
  }
}
```

### 2. `multi` (اختيارات متعددة - أكثر من إجابة صحيحة)
> **شرط**: `correct` مصفوفة أرقام، وكل عنصر فيها هو فهرس صحيح داخل نطاق `options`.
```json
{
  "id": "q_html_02",
  "type": "multi",
  "ar": {
    "prompt": "أي من العناصر التالية تُعد عناصر سطرية (Inline Elements)؟",
    "options": ["<span>", "<div>", "<a>", "<p>", "<strong>"],
    "correct": [0, 2, 4],
    "explanation": "span و a و strong عناصر سطرية لا تنشئ أسطراً جديدة بطبيعتها."
  },
  "en": {
    "prompt": "Which of the following are inline elements?",
    "options": ["<span>", "<div>", "<a>", "<p>", "<strong>"],
    "correct": [0, 2, 4],
    "explanation": "span, a, and strong are inline elements."
  }
}
```

### 3. `tf` (صح أو خطأ - True / False)
> **شرط**: `correct` قيمة منطقية (`true` أو `false`).
```json
{
  "id": "q_html_03",
  "type": "tf",
  "ar": {
    "prompt": "يمكن تكرار السمة id بنفس القيمة لأكثر من عنصر في نفس صفحة HTML.",
    "correct": false,
    "explanation": "السمة id يجب أن تكون فريدة كلياً (Unique) لكل عنصر داخل المستند الواحد."
  },
  "en": {
    "prompt": "The id attribute can be reused with the same value across multiple elements on the same page.",
    "correct": false,
    "explanation": "The id attribute must be completely unique within a document."
  }
}
```

### 4. `short` (إجابة نصية قصيرة)
```json
{
  "id": "q_html_04",
  "type": "short",
  "ar": {
    "prompt": "اكتب اسم السمة التي تُستخدم لفتح الرابط في لسان تبويب جديد في وسم <a>:",
    "acceptedAnswers": ["target=\"_blank\"", "target", "_blank"],
    "explanation": "الخاصية target=\"_blank\" توجه المتصفح لفتح الرابط في نافذة أو تبويب جديد."
  },
  "en": {
    "prompt": "Name the attribute used to open a link in a new tab:",
    "acceptedAnswers": ["target=\"_blank\"", "target", "_blank"],
    "explanation": "The target=\"_blank\" attribute opens the destination in a new browsing context."
  }
}
```

### 5. `essay` (سؤال مقالي للشرح والتفكير النقدي)
```json
{
  "id": "q_html_05",
  "type": "essay",
  "ar": {
    "prompt": "اشرح الفارق الجوهري بين عناصر HTML الدلالية (Semantic) والعناصر غير الدلالية، مع ضرب مثالين لكل منهما.",
    "sampleAnswer": "العناصر الدلالية تنقل المعنى الوظيفي للمتصفح وقارئات الشاشة (مثل article و nav)، بينما العناصر غير الدلالية هي مجرد حاويات تنسيقية محايدة (مثل div و span)."
  },
  "en": {
    "prompt": "Explain the difference between Semantic and Non-semantic HTML elements.",
    "sampleAnswer": "Semantic elements carry meaning to the browser and assistive technologies."
  }
}
```

### 6. `fill` (ملء الفراغات)
```json
{
  "id": "q_html_06",
  "type": "fill",
  "ar": {
    "template": "لتحديد الترميز اللغوي في HTML5 نستخدم وسم <meta [blank]=\"UTF-8\">.",
    "correct": ["charset"],
    "explanation": "السمة charset تحدد ترميز المحارف المعتمد في الصفحة."
  },
  "en": {
    "template": "To specify document encoding in HTML5 we use <meta [blank]=\"UTF-8\">.",
    "correct": ["charset"],
    "explanation": "The charset attribute defines the character encoding."
  }
}
```

### 7. `cloze` (نص به فراغات مدمجة)
```json
{
  "id": "q_html_07",
  "type": "cloze",
  "ar": {
    "textWithBlanks": "يُستخدم الوسم {0} لإنشاء القوائم المرتبة، بينما يُستخدم الوسم {1} لإنشاء القوائم غير المرتبة.",
    "blanks": [
      { "options": ["<ol>", "<ul>", "<dl>"], "correct": 0 },
      { "options": ["<ol>", "<ul>", "<dl>"], "correct": 1 }
    ]
  },
  "en": {
    "textWithBlanks": "Tag {0} is used for ordered lists, while tag {1} is for unordered lists.",
    "blanks": [
      { "options": ["<ol>", "<ul>", "<dl>"], "correct": 0 },
      { "options": ["<ol>", "<ul>", "<dl>"], "correct": 1 }
    ]
  }
}
```

### 8. `match` (مطابقة أزواج من طرفين)
```json
{
  "id": "q_html_08",
  "type": "match",
  "ar": {
    "prompt": "طابق بين وسم HTML ودوره الدلالي الصحيح:",
    "pairs": [
      { "left": "<nav>", "right": "روابط التنقل الرئيسية في الموقع" },
      { "left": "<aside>", "right": "محتوى جانبي أو شريط إضافي" },
      { "left": "<footer>", "right": "تذييل الصفحة وحقوق النشر" }
    ]
  },
  "en": {
    "prompt": "Match the tag with its semantic role:",
    "pairs": [
      { "left": "<nav>", "right": "Primary navigation links" },
      { "left": "<aside>", "right": "Secondary sidebar content" },
      { "left": "<footer>", "right": "Document footer and copyright" }
    ]
  }
}
```

### 9. `order` (ترتيب تسلسلي صحيح للخطوات)
```json
{
  "id": "q_html_09",
  "type": "order",
  "ar": {
    "prompt": "رتب خطوات دورة حياة صفحة الويب في المتصفح بالتسلسل الصحيح:",
    "items": [
      "طلب مستند HTML من السيرفر",
      "تحليل الكود وبناء شجرة DOM",
      "تحميل واستعراض ملفات الـ CSS وبناء CSSOM",
      "حساب التخطيط (Layout) ورسم البكسلات (Paint)"
    ]
  },
  "en": {
    "prompt": "Order the browser page rendering lifecycle steps:",
    "items": [
      "Request HTML document from server",
      "Parse markup and construct DOM tree",
      "Load styles and build CSSOM",
      "Calculate layout and paint pixels"
    ]
  }
}
```

### 10. `sort` (تصنيف العناصر إلى مجموعات منفصلة)
```json
{
  "id": "q_html_10",
  "type": "sort",
  "ar": {
    "prompt": "صنف العناصر التالية إلى مجموعاتها الدلالية المناسبة:",
    "buckets": [
      { "name": "عناصر دلالية هيكلية", "items": ["header", "main", "footer", "section"] },
      { "name": "عناصر تنسيق نصي", "items": ["strong", "em", "code", "mark"] }
    ]
  },
  "en": {
    "prompt": "Categorize elements into appropriate groups:",
    "buckets": [
      { "name": "Structural Semantic", "items": ["header", "main", "footer", "section"] },
      { "name": "Text Formatting", "items": ["strong", "em", "code", "mark"] }
    ]
  }
}
```

### 11. `numeric` (سؤال رقمي بقيمة محددة أو هامش خطأ)
```json
{
  "id": "q_html_11",
  "type": "numeric",
  "ar": {
    "prompt": "كم عدد مستويات العناوين القياسية المدعومة في لغة HTML (من h1 حتى h...؟)",
    "correct": 6,
    "tolerance": 0,
    "explanation": "تدعم لغة HTML ستة مستويات عناوين قياسية فقط: من h1 حتى h6."
  },
  "en": {
    "prompt": "How many standard heading levels are supported in HTML?",
    "correct": 6,
    "tolerance": 0,
    "explanation": "HTML supports exactly 6 standard heading levels (h1 to h6)."
  }
}
```

### 12. `rating` (تقييم ذاتي أو فهم لمفهوم)
```json
{
  "id": "q_html_12",
  "type": "rating",
  "ar": {
    "prompt": "ما مدى ثقتك الآن في بناء صفحة كاملة باستخدام HTML5 Semantic Elements؟",
    "max": 5
  },
  "en": {
    "prompt": "Rate your confidence in building pages with HTML5 semantic elements:",
    "max": 5
  }
}
```

### 13. `slider` (شريط تمرير لاختيار قيمة ضمن نطاق)
```json
{
  "id": "q_html_13",
  "type": "slider",
  "ar": {
    "prompt": "حدد النسبة المئوية التقريبية لدعم المتصفحات العالمية لـ HTML5 حالياً:",
    "min": 0,
    "max": 100,
    "step": 5,
    "correct": 98,
    "tolerance": 5
  },
  "en": {
    "prompt": "Select approximate global browser support percentage for HTML5:",
    "min": 0,
    "max": 100,
    "step": 5,
    "correct": 98,
    "tolerance": 5
  }
}
```

---

## 6. نظام الأصول وربط الصور المحلية (Knowledge Assets & Local Images)

عند استخدام صور داخل الكتاب، يمكنك الإشارة إليها بمسارات نسبية:
- في `pageBlocks` ذات النوع `image`: `"imageUrl": "assets/images/architecture.svg"` أو `"assets/my_photo.jpg"`.
- في الأسئلة أو الكروت: `"image": "assets/diagram.png"`.

### استيراد الصور الذكي عبر EDUcraft:
عند استيراد ملف JSON يحتوي على مسارات صور:
1. يقوم تطبيق EDUcraft بفحص ملف الـ JSON تلقائياً واكتشاف كافة الصور المطلوبة.
2. تظهر شاشة **"ربط مجلد الصور (Link Images Folder)"** بقائمة بجميع الصور المكتشفة ومواقعها داخل الكتاب.
3. يمكنك الضغط على **"اختيار مجلد الصور"** أو تحديد ملفات الصور مباشرة من جهازك.
4. يقوم التطبيق تلقائياً بمطابقة أسماء الملفات وتضمينها فورياً في الكتاب، ليعمل الكتاب وصوره بدون أي روابط مكسورة وبشكل مستقل تماماً دون الحاجة لإنترنت.

---

## 7. بنية الموسوعات والمجلدات (Collections & Encyclopedias)

يمكن دمج الكتب في مجلدات أو موسوعات متعددة المستويات:

```json
{
  "id": "col_web_stack",
  "kind": "encyclopedia",
  "parentId": null,
  "ar": {
    "title": "موسوعة تطوير الواجهات الشاملة",
    "desc": "مسار تعليمي متكامل يجمع كتب الـ HTML والـ CSS والـ JavaScript"
  },
  "en": {
    "title": "Full Web Frontend Stack Encyclopedia",
    "desc": "Complete track combining HTML, CSS, and JS"
  },
  "cover": {
    "from": "#0284c7",
    "to": "#0369a1"
  },
  "itemIds": [
    "01-html-master-curriculum",
    "02-css-tailwind-master-curriculum",
    "03-javascript-master-curriculum"
  ]
}
```

---

## 8. قائمة التحقق قبل الاستيراد (Pre-Import Checklist)

تأكد من الآتي قبل إرسال ملف الـ JSON إلى EDUcraft:
- [ ] كائن الـ Root يحتوي على `id` فريد لا يحتوي على مسافات، ويحتوي على كائنات `ar` و `en` و `cover` و `nodes`.
- [ ] كل `leaf` ينتمي إلى `parent` موجود من نوع `branch`.
- [ ] في أسئلة `single`، قيمة `correct` تبدأ من `0` وتكون أقل تماماً من عدد عناصر `options`.
- [ ] في أسئلة `multi`، جميع أرقام `correct` تقع داخل نطاق الخيارات.
- [ ] في كتل `table`، مصفوفة `headers` ليست فارغة، وكل صف في `rows` له نفس عدد الأعمدة.
- [ ] لا يوجد أي `pagebreak` داخل كتل الأسئلة (مسموح به في `pageBlocks` فقط).
- [ ] مسارات الصور معرّفة بأسماء واضحة (مثل `hero.png`) لتسهيل ربطها فور استيراد الـ JSON.

---
**تم اعتماد وتوثيق هذا المعيار رسمياً لمنصة EDUcraft — الإصدار 0.0.9+ ومحرك تيتانيوم.**
