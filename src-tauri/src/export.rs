use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize)]
pub struct ExportPayload {
    pub target_type: String, // "book" | "encyclopedia" | "bag"
    pub title: String,
    pub tagline: Option<String>,
    pub lang: String,       // "en" | "ar"
    pub dir: String,        // "ltr" | "rtl"
    pub cover_from: Option<String>,
    pub cover_to: Option<String>,
    pub cover_icon: Option<String>,
    pub cover_image: Option<String>,
    pub data: Value,        // Full JSON data for the book(s) or bag
    pub custom_todos: Option<Value>,
    pub calendar_events: Option<Value>,
}

pub fn generate_standalone_html(payload: &ExportPayload) -> String {
    let title = &payload.title;
    let tagline = payload.tagline.as_deref().unwrap_or("Educational Knowledge Package");
    let lang = if payload.lang.is_empty() { "en" } else { &payload.lang };
    let dir = if payload.dir.is_empty() { "ltr" } else { &payload.dir };
    let from_color = payload.cover_from.as_deref().unwrap_or("#E8654A");
    let to_color = payload.cover_to.as_deref().unwrap_or("#F2C879");
    
    let is_ar = lang == "ar";
    let letter = title.chars().next().unwrap_or('E').to_uppercase().to_string();

    let favicon_svg = format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{}"/><stop offset="1" stop-color="{}"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="43" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="white" text-anchor="middle">{}</text></svg>"#,
        from_color, to_color, letter
    );
    let favicon_uri = format!("data:image/svg+xml;utf8,{}", urlencoding_encode(&favicon_svg));

    let json_data_str = serde_json::to_string(&payload.data).unwrap_or_else(|_| "{}".to_string());
    let json_data_escaped = json_data_str.replace("</script>", "<\\/script>");

    let custom_todos_str = serde_json::to_string(&payload.custom_todos.clone().unwrap_or(serde_json::json!([]))).unwrap_or_else(|_| "[]".to_string());
    let calendar_events_str = serde_json::to_string(&payload.calendar_events.clone().unwrap_or(serde_json::json!([]))).unwrap_or_else(|_| "[]".to_string());

    let tree_tab = if is_ar { "شجرة المعرفة" } else { "Knowledge Tree" };
    let plates_tab = if is_ar { "صفحات A4" } else { "A4 Plates" };
    let deck_tab = if is_ar { "الأسئلة والتدريب" } else { "Practice Deck" };
    let planner_tab = if is_ar { "خطة المذاكرة" } else { "Study Planner" };
    let cal_tab = if is_ar { "التقويم" } else { "Calendar" };
    let print_btn = if is_ar { "طباعة" } else { "Print" };

    let tree_heading = if is_ar { "خريطة المفاهيم" } else { "Knowledge Tree Map" };
    let planner_heading = if is_ar { "خطة المذاكرة والمهام اليومية" } else { "Study Plan & Daily Tasks" };
    let planner_sub = if is_ar { "تابع تقدمك في دراسة فصول وأوراق المادة." } else { "Track your learning progress chapter by chapter." };
    let todo_placeholder = if is_ar { "اكتب مهمة جديدة واضغط إضافة..." } else { "Add a new study task..." };
    let add_btn = if is_ar { "إضافة" } else { "Add" };
    let cal_heading = if is_ar { "التقويم وجدول المذاكرة" } else { "Educational Calendar" };

    format!(r#"<!DOCTYPE html>
<html lang="{lang}" dir="{dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — EDUcraft Standalone</title>
<link rel="icon" href="{favicon_uri}">
<style>
  :root {{
    --PageBG: #F8F5F0;
    --HeaderColor: #2E4060;
    --SectionBG: #E8874A;
    --SectionFrame: #C96B2F;
    --KeyBG: #E8F7F9;
    --KeyFrame: #4C9DB0;
    --KeyText: #1A6B7A;
    --NoteBG: #F0EDF7;
    --NoteFrame: #655A7C;
    --NoteText: #3B3050;
    --WarningBG: #F2F4E6;
    --WarningFrame: #84922A;
    --WarningText: #626D17;
    --ImportantText: #14428F;
    --HighlightBG: #D9E0F2;
    --BodyText: #1a1a1a;
    --CodeBG: #0D0D0D;
    --CodeFrame: #2A2A2A;
    --CodeComment: #8A8A8A;
    --CodeKeyword: #C586C0;
    --CodeType: #4FC1FF;
    --CodeMacro: #FF7AB2;
    --CodeFunc: #DCDCDC;
    --CodeString: #6A9955;
    --CodeNumber: #CE9178;
    --CodePlain: #D4D4D4;
    --Accent: {from_color};
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0; padding: 0;
    background: #F3EAD9; color: #241B13;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Cairo', Roboto, sans-serif;
    line-height: 1.6;
  }}
  .app-container {{ max-width: 1200px; margin: 0 auto; padding: 16px 20px 80px; }}
  
  header.top-header {{
    display: flex; align-items: center; justify-content: space-between;
    background: #DCE9DC; border: 1px solid rgba(0,0,0,0.12);
    border-radius: 20px; padding: 12px 20px; margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04); flex-wrap: wrap; gap: 12px;
  }}
  .brand-block {{ display: flex; align-items: center; gap: 10px; }}
  .brand-icon {{
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, {from_color}, {to_color});
    display: grid; place-items: center; color: #fff; font-weight: 900; font-size: 18px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }}
  .brand-title {{ font-size: 1.1rem; font-weight: 800; color: #241B13; }}
  .brand-sub {{ font-size: 0.75rem; color: rgba(36,27,19,0.7); }}

  .nav-tabs {{ display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }}
  .tab-pill {{
    border: none; background: transparent; padding: 7px 14px;
    border-radius: 999px; font-weight: 700; font-size: 0.82rem;
    cursor: pointer; transition: all 0.2s; color: #241B13;
    display: inline-flex; align-items: center; gap: 6px;
  }}
  .tab-pill:hover {{ background: rgba(0,0,0,0.06); }}
  .tab-pill.active {{
    background: #E8654A; color: #ffffff;
    box-shadow: 0 2px 8px rgba(232,101,74,0.35); transform: scale(1.03);
  }}

  .item-picker {{
    background: #fff; border: 1px solid rgba(0,0,0,0.15);
    border-radius: 12px; padding: 6px 12px; font-size: 0.85rem; font-weight: 700;
    outline: none; cursor: pointer;
  }}

  .view-pane {{ display: none; }}
  .view-pane.active {{ display: block; animation: fadeIn 0.25s ease-out; }}
  @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(4px); }} to {{ opacity: 1; transform: translateY(0); }} }}

  .plate {{
    background: var(--PageBG); color: var(--BodyText);
    width: 210mm; min-height: 297mm; max-width: 100%;
    box-sizing: border-box; padding: 16mm 14mm 20mm; margin: 24px auto;
    font-family: 'Amiri', 'Noto Naskh Arabic', 'Cairo', serif; font-size: 17px; line-height: 1.85;
    box-shadow: 0 10px 32px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.05);
    border-radius: 4px; position: relative;
  }}
  header.doc-head {{
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 2px solid var(--HeaderColor); color: var(--HeaderColor);
    padding-bottom: 0.5rem; margin-bottom: 0.8rem; font-weight: 700; font-size: 0.95rem;
  }}
  .title-block {{ text-align: center; margin-bottom: 1.2rem; }}
  .title-block .subject {{ font-size: 1.65rem; font-weight: 800; color: var(--HeaderColor); }}
  .title-block .lecture {{ font-size: 1.2rem; font-weight: 700; color: var(--SectionBG); margin-top: 0.25rem; }}
  .title-block hr {{ border: none; border-top: 1.5px solid var(--SectionFrame); width: 50%; margin: 0.75rem auto 0; }}
  
  .box {{ border-radius: 14px; padding: 0.9rem 1.25rem; margin: 1rem 0; box-shadow: 0 3px 10px rgba(0,0,0,0.08); border-width: 1.5px; border-style: solid; }}
  .box.section-title {{ background: var(--SectionBG); border-color: var(--SectionFrame); color: #fff; font-weight: 800; font-size: 1.2rem; }}
  .box.keyterm {{ background: var(--KeyBG); border-color: var(--KeyFrame); color: var(--KeyText); }}
  .box.note {{ background: var(--NoteBG); border-color: var(--NoteFrame); color: var(--NoteText); }}
  .box.warning {{ background: var(--WarningBG); border-color: var(--WarningFrame); color: var(--WarningText); border-width: 2px; }}
  .box.important {{ background: var(--HighlightBG); border-color: var(--ImportantText); color: var(--ImportantText); border-width: 2px; font-weight: 700; }}
  
  .code-box {{ background: var(--CodeBG); border: 1px solid var(--CodeFrame); border-radius: 14px; margin: 1.2rem 0; overflow: hidden; direction: ltr; text-align: left; }}
  .code-box pre {{ margin: 0; padding: 1.1rem 1.3rem; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; line-height: 1.7; color: var(--CodePlain); overflow-x: auto; }}
  
  .media-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1.2rem 0; }}
  .media-card {{ background: #fff; border: 1.5px solid var(--SectionFrame); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.10); }}
  .media-card img {{ width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }}
  .media-card .media-info {{ padding: 0.8rem 1rem 1rem; color: var(--BodyText); }}
  .media-card .media-title {{ font-weight: 800; color: var(--SectionFrame); margin-bottom: 0.25rem; font-size: 1rem; }}

  table.thiqa-table {{ width: 100%; border-collapse: collapse; margin: 1rem 0; border-radius: 10px; overflow: hidden; font-size: 0.95em; }}
  table.thiqa-table th {{ background: var(--SectionBG); color: #fff; padding: 0.5rem 0.8rem; border: 1px solid var(--SectionFrame); text-align: inherit; }}
  table.thiqa-table td {{ padding: 0.45rem 0.8rem; border: 1px solid var(--SectionFrame); }}
  table.thiqa-table tr:nth-child(even) td {{ background: var(--KeyBG); }}

  .q-card {{ border-radius: 18px; padding: 20px; margin-bottom: 16px; border: 1.5px solid rgba(0,0,0,0.12); box-shadow: 0 4px 14px rgba(0,0,0,0.06); }}
  .opt-btn {{
    display: block; width: 100%; text-align: start; border: 1.5px solid rgba(0,0,0,0.15);
    background: rgba(255,255,255,0.75); color: inherit; border-radius: 12px;
    padding: 10px 14px; margin-bottom: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 600;
    transition: all 0.18s;
  }}
  .opt-btn:hover {{ background: rgba(255,255,255,0.92); }}
  .opt-btn.selected {{ background: rgba(20,21,26,0.92); color: #fff; border-color: rgba(20,21,26,0.92); }}
  .opt-btn.correct {{ background: #9BE8C4 !important; border-color: #0B2318 !important; color: #0B2318 !important; }}
  .opt-btn.incorrect {{ background: #FFD9CE !important; border-color: #7A2A12 !important; color: #7A2A12 !important; }}
  
  .btn-check {{
    background: rgba(20,21,26,0.92); color: #fff; border: none; padding: 9px 20px;
    border-radius: 999px; font-weight: 700; font-size: 0.85rem; cursor: pointer;
    transition: transform 0.15s; margin-top: 6px;
  }}
  .btn-check:hover {{ transform: scale(1.04); }}
  
  .todo-panel {{ background: #fff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.1); padding: 24px; box-shadow: 0 4px 18px rgba(0,0,0,0.05); }}
  .todo-item {{ display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; background: #F9F7F3; margin-bottom: 8px; transition: all 0.2s; }}
  .todo-item.done {{ opacity: 0.55; text-decoration: line-through; background: #ECE7DD; }}
  .todo-checkbox {{ width: 18px; height: 18px; cursor: pointer; accent-color: #E8654A; }}

  .cal-grid {{ display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-top: 14px; }}
  .cal-day-name {{ text-align: center; font-weight: 800; font-size: 0.78rem; opacity: 0.65; padding: 4px; }}
  .cal-cell {{ background: #fff; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); padding: 8px; min-height: 68px; display: flex; flex-direction: column; justify-content: space-between; }}
  .cal-cell.today {{ border: 2px solid #E8654A; background: #FFF9F7; }}
  .cal-cell .day-num {{ font-weight: 800; font-size: 0.85rem; }}
  .cal-badge {{ font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 6px; background: #E8F7F9; color: #1A6B7A; margin-top: 2px; }}

  .tree-container {{ background: #fff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.1); padding: 24px; box-shadow: 0 4px 18px rgba(0,0,0,0.05); }}

  @media print {{
    body {{ background: var(--PageBG) !important; }}
    header.top-header, .nav-tabs, .print-hide, .btn-check {{ display: none !important; }}
    .plate {{ box-shadow: none; margin: 0; width: 100%; break-after: page; page-break-after: always; }}
  }}
</style>
</head>
<body>
<div class="app-container">
  <header class="top-header">
    <div class="brand-block">
      <div class="brand-icon">{letter}</div>
      <div>
        <div class="brand-title">{title}</div>
        <div class="brand-sub">{tagline}</div>
      </div>
    </div>

    <nav class="nav-tabs">
      <button class="tab-pill active" onclick="switchTab('tree')">🌳 {tree_tab}</button>
      <button class="tab-pill" onclick="switchTab('plates')">📄 {plates_tab}</button>
      <button class="tab-pill" onclick="switchTab('deck')">🎴 {deck_tab}</button>
      <button class="tab-pill" onclick="switchTab('planner')">✅ {planner_tab}</button>
      <button class="tab-pill" onclick="switchTab('calendar')">📅 {cal_tab}</button>
      <button class="tab-pill print-hide" onclick="window.print()" style="background: rgba(0,0,0,0.08);">🖨️ {print_btn}</button>
    </nav>
  </header>

  <section id="view-tree" class="view-pane active">
    <div class="tree-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
        <h2 style="margin: 0; font-size: 1.25rem;">{tree_heading}</h2>
        <div id="itemSwitcherMount"></div>
      </div>
      <div id="treeSvgMount" style="overflow-x: auto;"></div>
    </div>
  </section>

  <section id="view-plates" class="view-pane">
    <div id="platesMount"></div>
  </section>

  <section id="view-deck" class="view-pane">
    <div style="max-width: 760px; margin: 0 auto;" id="deckMount"></div>
  </section>

  <section id="view-planner" class="view-pane">
    <div class="todo-panel" style="max-width: 760px; margin: 0 auto;">
      <h2 style="margin-top: 0; font-size: 1.25rem;">{planner_heading}</h2>
      <p style="font-size: 0.85rem; opacity: 0.75; margin-bottom: 18px;">{planner_sub}</p>
      
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <input id="newTodoInput" type="text" placeholder="{todo_placeholder}" style="flex: 1; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.15); font-size: 0.9rem; outline: none;">
        <button onclick="addCustomTodo()" class="btn-check" style="margin: 0; padding: 10px 18px;">+ {add_btn}</button>
      </div>

      <div id="todoListMount"></div>
    </div>
  </section>

  <section id="view-calendar" class="view-pane">
    <div class="todo-panel" style="max-width: 860px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <h2 style="margin: 0; font-size: 1.25rem;" id="calMonthTitle">{cal_heading}</h2>
        <div style="display: flex; gap: 6px;">
          <button onclick="shiftMonth(-1)" class="tab-pill" style="border: 1px solid rgba(0,0,0,0.15);">◀</button>
          <button onclick="shiftMonth(1)" class="tab-pill" style="border: 1px solid rgba(0,0,0,0.15);">▶</button>
        </div>
      </div>
      <div class="cal-grid" id="calGridMount"></div>
    </div>
  </section>
</div>

<script>
const RAW_DATA = {json_data_escaped};
const CUSTOM_TODOS = {custom_todos_str};
const CAL_EVENTS = {calendar_events_str};
const LANG = "{lang}";
const DIR = "{dir}";

let currentBookIndex = 0;
let books = Array.isArray(RAW_DATA) ? RAW_DATA : (RAW_DATA.books || [RAW_DATA]);
let activeBook = books[0] || {{ nodes: [] }};

let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

function switchTab(name) {{
  document.querySelectorAll('.view-pane').forEach(function(p) {{ p.classList.remove('active'); }});
  document.querySelectorAll('.tab-pill').forEach(function(b) {{ b.classList.remove('active'); }});
  
  const pane = document.getElementById('view-' + name);
  if (pane) pane.classList.add('active');
  
  if (window.event && window.event.target) {{
    window.event.target.classList.add('active');
  }}
}}

function renderTree(book) {{
  const nodes = book.nodes || [];
  const VB_W = 800, VB_H = 300;
  let svg = '<svg viewBox="0 0 ' + VB_W + ' ' + VB_H + '" style="width: 100%; min-width: 600px;">';
  
  nodes.filter(function(n) {{ return n.parent; }}).forEach(function(n) {{
    const p = nodes.find(function(x) {{ return x.id === n.parent; }});
    if (!p) return;
    const ax = DIR === 'rtl' ? VB_W - p.x : p.x;
    const bx = DIR === 'rtl' ? VB_W - n.x : n.x;
    const midY = (p.y + n.y) / 2;
    svg += '<path d="M ' + ax + ' ' + (p.y+18) + ' C ' + ax + ' ' + midY + ', ' + bx + ' ' + midY + ', ' + bx + ' ' + (n.y-18) + '" fill="none" stroke="#E8654A" stroke-width="2" opacity="0.6"/>';
  }});

  nodes.forEach(function(n) {{
    const x = DIR === 'rtl' ? VB_W - n.x : n.x;
    const y = n.y;
    const isLeaf = n.level === 'leaf';
    const isBranch = n.level === 'branch';
    const title = n[LANG] || n.en || n.title || n.id;
    const fill = isBranch ? '#E8654A' : isLeaf ? '#E8F7F9' : '#fff';
    const stroke = isBranch ? 'transparent' : '#E8654A';
    const textColor = isBranch ? '#fff' : '#1a1a1a';
    
    svg += '<g style="cursor: ' + (isLeaf ? 'pointer' : 'default') + '" onclick="onLeafClick(\\'' + n.id + '\\')">';
    svg += '<rect x="' + (x - 65) + '" y="' + (y - 18) + '" width="130" height="36" rx="10" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>';
    svg += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="' + textColor + '">' + title + '</text>';
    svg += '</g>';
  }});
  
  svg += '</svg>';
  document.getElementById('treeSvgMount').innerHTML = svg;
}}

function onLeafClick(leafId) {{
  switchTab('deck');
  const el = document.getElementById('q-leaf-' + leafId);
  if (el) el.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
}}

function renderPlates(book) {{
  let html = '';
  const leaves = (book.nodes || []).filter(function(n) {{ return n.level === 'leaf'; }});
  
  leaves.forEach(function(leaf) {{
    const blocks = leaf.pageBlocks || [];
    if (!blocks.length) return;

    html += '<section class="plate">';
    blocks.forEach(function(b) {{
      if (b.kind === 'titleBlock') {{
        html += '<header class="doc-head"><span>' + (b.title || '') + '</span><span>' + (b.sub || '') + '</span></header>';
        html += '<div class="title-block"><div class="subject">' + (b.title || '') + '</div><div class="lecture">' + (b.sub || '') + '</div><hr></div>';
      }} else if (b.kind === 'sectionTitle') {{
        html += '<div class="box section-title">' + (b.text || '') + '</div>';
      }} else if (b.kind === 'keyterm') {{
        html += '<div class="box keyterm"><b>' + (b.title || '') + ':</b> ' + (b.text || '') + '</div>';
      }} else if (b.kind === 'note') {{
        html += '<div class="box note"><b>' + (b.title || 'Note') + ':</b> ' + (b.text || '') + '</div>';
      }} else if (b.kind === 'warning') {{
        html += '<div class="box warning"><b>⚠️ ' + (b.title || 'Warning') + ':</b> ' + (b.text || '') + '</div>';
      }} else if (b.kind === 'important') {{
        html += '<div class="box important"><b>⭐ ' + (b.title || 'Important') + ':</b> ' + (b.text || '') + '</div>';
      }} else if (b.kind === 'code') {{
        html += '<div class="code-box"><pre>' + (b.code || '') + '</pre></div>';
      }} else if (b.kind === 'mediaCard') {{
        html += '<div class="media-grid"><div class="media-card"><img src="' + (b.imageUrl || '') + '"><div class="media-info"><div class="media-title">' + (b.title || '') + '</div><div>' + (b.desc || '') + '</div></div></div></div>';
      }}
    }});
    html += '</section>';
  }});
  
  document.getElementById('platesMount').innerHTML = html || '<div class="plate"><p style="text-align:center;">No A4 plates available.</p></div>';
}}

function renderDeck(book) {{
  let html = '';
  const leaves = (book.nodes || []).filter(function(n) {{ return n.level === 'leaf'; }});

  leaves.forEach(function(leaf) {{
    const cards = leaf.cards || [];
    const questions = leaf.questions || [];
    const allQ = [].concat(questions, cards.flatMap(function(c) {{ return c.questions || []; }}));
    if (!allQ.length) return;

    html += '<div id="q-leaf-' + leaf.id + '" style="margin-bottom: 24px;">';
    html += '<h3 style="margin-bottom: 12px; color: #E8654A;">🌿 ' + (leaf[LANG] || leaf.en || leaf.title) + '</h3>';

    allQ.forEach(function(q) {{
      const c = q[LANG] || q.en || {{}};
      const bg = q.type === 'single' ? '#E4FF6E' : q.type === 'multi' ? '#FF8A5B' : q.type === 'tf' ? '#9BE8C4' : '#B7C3FF';
      
      html += '<div class="q-card" style="background: ' + bg + ';">';
      html += '<div style="font-weight: 800; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 6px;">' + (q.type || 'Question') + '</div>';
      html += '<p style="font-weight: 700; font-size: 1rem; margin: 0 0 12px;">' + (c.prompt || c.template || '') + '</p>';

      if (c.options) {{
        c.options.forEach(function(opt, oIdx) {{
          html += '<button class="opt-btn" onclick="selectOption(this, ' + (oIdx === c.correct) + ')">' + opt + '</button>';
        }});
      }} else if (q.type === 'tf') {{
        html += '<button class="opt-btn" onclick="selectOption(this, ' + (c.correct === true) + ')">True / صح</button>';
        html += '<button class="opt-btn" onclick="selectOption(this, ' + (c.correct === false) + ')">False / غلط</button>';
      }}

      html += '</div>';
    }});

    html += '</div>';
  }});

  document.getElementById('deckMount').innerHTML = html || '<p style="text-align:center;">No questions found.</p>';
}}

function selectOption(btn, isCorrect) {{
  const parent = btn.parentElement;
  parent.querySelectorAll('.opt-btn').forEach(function(b) {{ b.classList.remove('selected', 'correct', 'incorrect'); }});
  btn.classList.add(isCorrect ? 'correct' : 'incorrect');
}}

let savedTodos = JSON.parse(localStorage.getItem('educraft_export_todos') || 'null');
if (!savedTodos) {{
  savedTodos = [];
  books.forEach(function(b) {{
    (b.nodes || []).filter(function(n) {{ return n.level === 'leaf'; }}).forEach(function(l) {{
      savedTodos.push({{ id: l.id, text: (LANG === 'ar' ? 'مذاكرة وحل كاردات: ' : 'Study leaf: ') + (l[LANG] || l.en), done: false }});
    }});
  }});
}}

function renderTodos() {{
  let html = '';
  savedTodos.forEach(function(t, i) {{
    html += '<div class="todo-item ' + (t.done ? 'done' : '') + '">';
    html += '<input type="checkbox" class="todo-checkbox" ' + (t.done ? 'checked' : '') + ' onchange="toggleTodo(' + i + ')">';
    html += '<span style="flex: 1; font-weight: 600; font-size: 0.9rem;">' + t.text + '</span>';
    html += '<button onclick="deleteTodo(' + i + ')" style="border:none; background:transparent; cursor:pointer; opacity:0.5;">🗑️</button>';
    html += '</div>';
  }});
  document.getElementById('todoListMount').innerHTML = html;
  localStorage.setItem('educraft_export_todos', JSON.stringify(savedTodos));
}}

function toggleTodo(i) {{
  savedTodos[i].done = !savedTodos[i].done;
  renderTodos();
}}
function deleteTodo(i) {{
  savedTodos.splice(i, 1);
  renderTodos();
}}
function addCustomTodo() {{
  const input = document.getElementById('newTodoInput');
  if (!input.value.trim()) return;
  savedTodos.unshift({{ id: 'custom-' + Date.now(), text: input.value.trim(), done: false }});
  input.value = '';
  renderTodos();
}}

function renderCalendar() {{
  const monthNames = LANG === 'ar' 
    ? ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = LANG === 'ar' ? ['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'] : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  document.getElementById('calMonthTitle').innerText = monthNames[calMonth] + ' ' + calYear;

  let html = '';
  dayNames.forEach(function(d) {{ html += '<div class="cal-day-name">' + d + '</div>'; }});

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {{
    html += '<div class="cal-cell" style="background: transparent; border: none;"></div>';
  }}

  for (let d = 1; d <= daysInMonth; d++) {{
    const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d;
    html += '<div class="cal-cell ' + (isToday ? 'today' : '') + '">';
    html += '<span class="day-num">' + d + '</span>';
    if (d % 3 === 0) html += '<span class="cal-badge">📚 Session</span>';
    html += '</div>';
  }}

  document.getElementById('calGridMount').innerHTML = html;
}}

function shiftMonth(delta) {{
  calMonth += delta;
  if (calMonth < 0) {{ calMonth = 11; calYear--; }}
  else if (calMonth > 11) {{ calMonth = 0; calYear++; }}
  renderCalendar();
}}

if (books.length > 1) {{
  let select = '<select class="item-picker" onchange="activeBook = books[this.value]; initBook();">';
  books.forEach(function(b, i) {{
    select += '<option value="' + i + '">' + (b[LANG]?.title || b.en?.title || ('Book ' + (i+1))) + '</option>';
  }});
  select += '</select>';
  document.getElementById('itemSwitcherMount').innerHTML = select;
}}

function initBook() {{
  renderTree(activeBook);
  renderPlates(activeBook);
  renderDeck(activeBook);
}}

initBook();
renderTodos();
renderCalendar();
</script>
</body>
</html>"#,
        lang = lang,
        dir = dir,
        title = title,
        favicon_uri = favicon_uri,
        from_color = from_color,
        to_color = to_color,
        letter = letter,
        tagline = tagline,
        tree_tab = tree_tab,
        plates_tab = plates_tab,
        deck_tab = deck_tab,
        planner_tab = planner_tab,
        cal_tab = cal_tab,
        print_btn = print_btn,
        tree_heading = tree_heading,
        planner_heading = planner_heading,
        planner_sub = planner_sub,
        todo_placeholder = todo_placeholder,
        add_btn = add_btn,
        cal_heading = cal_heading,
        json_data_escaped = json_data_escaped,
        custom_todos_str = custom_todos_str,
        calendar_events_str = calendar_events_str,
    )
}

fn urlencoding_encode(s: &str) -> String {
    let mut result = String::new();
    for b in s.bytes() {
        match b {
            b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                result.push(b as char);
            }
            _ => {
                result.push_str(&format!("%{:02X}", b));
            }
        }
    }
    result
}
