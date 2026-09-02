import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  GitBranch,
  CheckCircle2,
  FileText,
  LayoutList
} from "lucide-react";

export function computeTreeLayout(nodes, crossLinks = [], dir = "ltr", lang = "ar", collapsedNodeIds = new Set()) {
  const branches = nodes.filter((n) => n.level === "branch");
  const subs = nodes.filter((n) => n.level === "sub");
  const leaves = nodes.filter((n) => n.level === "leaf");

  // Determine node dimensions based on text length
  const dims = {};
  nodes.forEach((n) => {
    const text = String(n[lang] || n.ar || n.en || n.id || "");
    const len = text.length;
    if (n.level === "branch") {
      dims[n.id] = { w: Math.max(168, Math.min(280, len * 11 + 44)), h: 44, r: 22, fs: 13.5, fw: 700 };
    } else if (n.level === "sub") {
      dims[n.id] = { w: Math.max(144, Math.min(250, len * 9.5 + 38)), h: 38, r: 16, fs: 12, fw: 600 };
    } else {
      dims[n.id] = { w: Math.max(120, Math.min(200, len * 8.5 + 34)), h: 34, r: 12, fs: 11, fw: 500 };
    }
  });

  // Calculate width required for each sub-branch's leaves
  const subTreeWidths = {};
  subs.forEach((s) => {
    const isCollapsed = collapsedNodeIds.has(s.id);
    const sLeaves = isCollapsed ? [] : leaves.filter((l) => l.parent === s.id && !collapsedNodeIds.has(l.id));
    if (sLeaves.length === 0) {
      subTreeWidths[s.id] = dims[s.id].w;
    } else {
      const leavesTotalW = sLeaves.reduce((sum, l) => sum + dims[l.id].w, 0) + (sLeaves.length - 1) * 24;
      subTreeWidths[s.id] = Math.max(dims[s.id].w, leavesTotalW);
    }
  });

  // Calculate width required for each branch
  const branchTreeWidths = {};
  branches.forEach((b) => {
    const isCollapsed = collapsedNodeIds.has(b.id);
    const bSubs = isCollapsed ? [] : subs.filter((s) => s.parent === b.id && !collapsedNodeIds.has(s.id));
    const bLeaves = isCollapsed ? [] : leaves.filter((l) => l.parent === b.id && !collapsedNodeIds.has(l.id));

    if (bSubs.length === 0 && bLeaves.length === 0) {
      branchTreeWidths[b.id] = dims[b.id].w;
    } else if (bSubs.length > 0) {
      const subsTotalW = bSubs.reduce((sum, s) => sum + subTreeWidths[s.id], 0) + (bSubs.length - 1) * 36;
      const leavesTotalW = bLeaves.length > 0
        ? bLeaves.reduce((sum, l) => sum + dims[l.id].w, 0) + (bLeaves.length - 1) * 24
        : 0;
      branchTreeWidths[b.id] = Math.max(dims[b.id].w, subsTotalW + (leavesTotalW ? leavesTotalW + 36 : 0));
    } else {
      const leavesTotalW = bLeaves.reduce((sum, l) => sum + dims[l.id].w, 0) + (bLeaves.length - 1) * 24;
      branchTreeWidths[b.id] = Math.max(dims[b.id].w, leavesTotalW);
    }
  });

  const interBranchGap = 64;
  const totalContentW = branches.reduce((sum, b) => sum + branchTreeWidths[b.id], 0) + Math.max(0, branches.length - 1) * interBranchGap;
  const vbW = Math.max(900, Math.round(totalContentW + 140));
  const vbH = 380;

  const positions = {};
  let currentBranchX = (vbW - totalContentW) / 2;

  branches.forEach((b) => {
    const bW = branchTreeWidths[b.id];
    const isBranchCollapsed = collapsedNodeIds.has(b.id);
    const bSubs = isBranchCollapsed ? [] : subs.filter((s) => s.parent === b.id && !collapsedNodeIds.has(s.id));
    const bLeaves = isBranchCollapsed ? [] : leaves.filter((l) => l.parent === b.id && !collapsedNodeIds.has(l.id));

    if (bSubs.length > 0) {
      const subGroupTotalW = bSubs.reduce((sum, s) => sum + subTreeWidths[s.id], 0) + (bSubs.length - 1) * 36;
      let curSubX = currentBranchX + (bW - subGroupTotalW) / 2;

      bSubs.forEach((s) => {
        const sW = subTreeWidths[s.id];
        const isSubCollapsed = collapsedNodeIds.has(s.id);
        const sLeaves = isSubCollapsed ? [] : leaves.filter((l) => l.parent === s.id && !collapsedNodeIds.has(l.id));

        if (sLeaves.length > 0) {
          const lTotalW = sLeaves.reduce((sum, l) => sum + dims[l.id].w, 0) + (sLeaves.length - 1) * 24;
          let curLeafX = curSubX + (sW - lTotalW) / 2;
          sLeaves.forEach((l) => {
            const lW = dims[l.id].w;
            positions[l.id] = { x: curLeafX + lW / 2, y: 300 };
            curLeafX += lW + 24;
          });
          const firstL = positions[sLeaves[0].id];
          const lastL = positions[sLeaves[sLeaves.length - 1].id];
          positions[s.id] = { x: (firstL.x + lastL.x) / 2, y: 178 };
        } else {
          positions[s.id] = { x: curSubX + sW / 2, y: 178 };
        }

        curSubX += sW + 36;
      });

      // Also position any direct branch leaves
      if (bLeaves.length > 0) {
        let curDirectLeafX = currentBranchX;
        bLeaves.forEach((l) => {
          const lW = dims[l.id].w;
          positions[l.id] = { x: curDirectLeafX + lW / 2, y: 300 };
          curDirectLeafX += lW + 24;
        });
      }

      const firstS = positions[bSubs[0].id];
      const lastS = positions[bSubs[bSubs.length - 1].id];
      positions[b.id] = { x: (firstS.x + lastS.x) / 2, y: 56 };
    } else if (bLeaves.length > 0) {
      const lTotalW = bLeaves.reduce((sum, l) => sum + dims[l.id].w, 0) + (bLeaves.length - 1) * 24;
      let curLeafX = currentBranchX + (bW - lTotalW) / 2;
      bLeaves.forEach((l) => {
        const lW = dims[l.id].w;
        positions[l.id] = { x: curLeafX + lW / 2, y: 300 };
        curLeafX += lW + 24;
      });
      const firstL = positions[bLeaves[0].id];
      const lastL = positions[bLeaves[bLeaves.length - 1].id];
      positions[b.id] = { x: (firstL.x + lastL.x) / 2, y: 56 };
    } else {
      positions[b.id] = { x: currentBranchX + bW / 2, y: 56 };
    }

    currentBranchX += bW + interBranchGap;
  });

  return { vbW, vbH, positions, dims };
}

/* ──────────────────────────────────────────────────────────────────────────
   CurriculumOutlineView — High density hierarchical curriculum tree view
   ────────────────────────────────────────────────────────────────────────── */
function CurriculumOutlineView({
  nodes,
  lang,
  dir,
  theme,
  ui,
  skin,
  selected,
  onSelect,
  doneSet,
  searchQuery,
  leafCards
}) {
  const [collapsed, setCollapsed] = useState(new Set());

  const branches = useMemo(() => nodes.filter((n) => n.level === "branch"), [nodes]);
  const subOf = useCallback((bid) => nodes.filter((n) => n.level === "sub" && n.parent === bid), [nodes]);
  const leavesOf = useCallback((pid) => nodes.filter((n) => n.level === "leaf" && n.parent === pid), [nodes]);

  const allLeaves = useMemo(() => nodes.filter((n) => n.level === "leaf"), [nodes]);
  const completedCount = useMemo(() => allLeaves.filter((l) => doneSet.has(l.id)).length, [allLeaves, doneSet]);
  const progressPercent = allLeaves.length ? Math.round((completedCount / allLeaves.length) * 100) : 0;

  const toggleNode = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setCollapsed(new Set());
  const collapseAll = () => setCollapsed(new Set(nodes.map((n) => n.id)));

  // Filter matching nodes when search query is active
  const q = searchQuery.trim().toLowerCase();
  const matchesSearch = useCallback(
    (n) => {
      if (!q) return true;
      const text = `${n[lang] || ""} ${n.ar || ""} ${n.en || ""} ${n.id}`.toLowerCase();
      return text.includes(q);
    },
    [q, lang]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Progress & Quick Actions Bar */}
      <div
        className="flex items-center justify-between gap-4 p-4 rounded-2xl border flex-wrap"
        style={{
          background: theme.surface,
          borderColor: theme.hairline,
        }}
      >
        <div className="flex flex-col gap-1.5 min-w-[220px] flex-1">
          <div className="flex items-center justify-between text-xs font-bold" style={{ color: theme.ink }}>
            <span>
              {lang === "ar" ? "نسبة إنجاز المنهج" : "Curriculum Progress"}
            </span>
            <span style={{ color: "#10B981" }}>
              {completedCount} / {allLeaves.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: theme.canvas }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: progressPercent === 100 ? "#10B981" : theme.accent,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={expandAll}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
            style={{
              background: theme.surfaceSoft,
              borderColor: theme.hairline,
              color: theme.ink,
            }}
          >
            {lang === "ar" ? "توسيع الكل ▾" : "Expand All ▾"}
          </button>
          <button
            onClick={collapseAll}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
            style={{
              background: theme.surfaceSoft,
              borderColor: theme.hairline,
              color: theme.ink,
            }}
          >
            {lang === "ar" ? "طي الكل ▸" : "Collapse All ▸"}
          </button>
        </div>
      </div>

      {/* Hierarchical Tree Accordion */}
      <div className="flex flex-col gap-3">
        {branches.map((b, bIdx) => {
          const bSubs = subOf(b.id);
          const bDirectLeaves = leavesOf(b.id);
          const allBranchLeaves = [
            ...bDirectLeaves,
            ...bSubs.flatMap((s) => leavesOf(s.id)),
          ];
          const bDoneCount = allBranchLeaves.filter((l) => doneSet.has(l.id)).length;
          const isCollapsed = collapsed.has(b.id);

          // If searching, check if branch or any child matches
          const branchMatches = matchesSearch(b) || allBranchLeaves.some(matchesSearch);
          if (q && !branchMatches) return null;

          return (
            <div
              key={b.id}
              className="rounded-2xl border transition-all overflow-hidden"
              style={{
                background: theme.surface,
                borderColor: theme.hairline,
              }}
            >
              {/* Branch Header */}
              <button
                onClick={() => toggleNode(b.id)}
                className="w-full flex items-center justify-between gap-3 p-4 text-start transition-all hover:opacity-90"
                style={{
                  background: isCollapsed ? "transparent" : theme.surfaceSoft,
                  borderBottom: isCollapsed ? "none" : `1px solid ${theme.hairline}`,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-xs"
                    style={{ background: theme.accent, color: theme.accentInk }}
                  >
                    {bIdx + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold truncate" style={{ color: theme.ink }}>
                      {b[lang] || b.ar || b.en || b.id}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: theme.inkSoft }}>
                      {allBranchLeaves.length} {lang === "ar" ? "ورقة تعليمية" : "leaves"} · {bDoneCount} {lang === "ar" ? "مكتملة" : "done"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {bDoneCount === allBranchLeaves.length && allBranchLeaves.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      ✓ {lang === "ar" ? "مكتمل بالكامل" : "All Done"}
                    </span>
                  )}
                  {isCollapsed ? <ChevronDown size={16} style={{ color: theme.inkSoft }} /> : <ChevronUp size={16} style={{ color: theme.inkSoft }} />}
                </div>
              </button>

              {/* Branch Content */}
              {!isCollapsed && (
                <div className="p-4 flex flex-col gap-4">
                  {/* Direct Branch Leaves */}
                  {bDirectLeaves.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {bDirectLeaves.filter(matchesSearch).map((leaf) => (
                        <LeafCardItem
                          key={leaf.id}
                          leaf={leaf}
                          lang={lang}
                          theme={theme}
                          skin={skin}
                          selected={selected === leaf.id}
                          isDone={doneSet.has(leaf.id)}
                          onSelect={onSelect}
                          leafCards={leafCards}
                        />
                      ))}
                    </div>
                  )}

                  {/* Sub-branches */}
                  {bSubs.map((sub) => {
                    const sLeaves = leavesOf(sub.id);
                    const isSubCollapsed = collapsed.has(sub.id);
                    const subMatches = matchesSearch(sub) || sLeaves.some(matchesSearch);
                    if (q && !subMatches) return null;

                    return (
                      <div
                        key={sub.id}
                        className="rounded-xl border p-3 flex flex-col gap-3"
                        style={{
                          background: theme.canvas,
                          borderColor: theme.hairline,
                        }}
                      >
                        <button
                          onClick={() => toggleNode(sub.id)}
                          className="flex items-center justify-between text-start"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Layers size={14} style={{ color: theme.accent }} />
                            <span className="text-xs font-bold truncate" style={{ color: theme.ink }}>
                              {sub[lang] || sub.ar || sub.en || sub.id}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: theme.surface, color: theme.inkSoft }}>
                              {sLeaves.length}
                            </span>
                          </div>
                          {isSubCollapsed ? <ChevronDown size={14} style={{ color: theme.inkSoft }} /> : <ChevronUp size={14} style={{ color: theme.inkSoft }} />}
                        </button>

                        {!isSubCollapsed && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ps-2">
                            {sLeaves.filter(matchesSearch).map((leaf) => (
                              <LeafCardItem
                                key={leaf.id}
                                leaf={leaf}
                                lang={lang}
                                theme={theme}
                                skin={skin}
                                selected={selected === leaf.id}
                                isDone={doneSet.has(leaf.id)}
                                onSelect={onSelect}
                                leafCards={leafCards}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeafCardItem({ leaf, lang, theme, skin, selected, isDone, onSelect, leafCards }) {
  const cards = leafCards(leaf);
  const qCount = cards.reduce((sum, g) => sum + (Array.isArray(g?.questions) ? g.questions.length : 0), 0);
  const hasPages = Boolean(leaf.pageBlocks && leaf.pageBlocks.length > 0);

  return (
    <button
      onClick={() => onSelect?.(leaf.id)}
      className="flex items-center justify-between gap-2.5 p-3 rounded-xl border text-start transition-all hover:scale-[1.01] hover:shadow-sm"
      style={{
        background: selected ? theme.accentSoft || "rgba(79,70,229,0.12)" : theme.surface,
        borderColor: selected ? theme.accent : isDone ? "#10B981" : theme.hairline,
        borderWidth: selected ? 2 : 1.5,
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: isDone ? "#10B981" : theme.surfaceSoft,
            color: isDone ? "#FFFFFF" : theme.inkSoft,
          }}
        >
          {isDone ? <CheckCircle2 size={15} /> : <FileText size={14} />}
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className="text-xs font-bold truncate"
            style={{ color: selected ? theme.accent : theme.ink }}
          >
            {leaf[lang] || leaf.ar || leaf.en || leaf.id}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {hasPages && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded" style={{ background: theme.canvas, color: theme.inkSoft }}>
                📄 A4
              </span>
            )}
            {qCount > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded" style={{ background: theme.canvas, color: theme.inkSoft }}>
                🎯 {qCount}
              </span>
            )}
            {isDone && (
              <span className="text-[9px] font-bold text-emerald-600">
                ✓ {lang === "ar" ? "منجز" : "Done"}
              </span>
            )}
          </div>
        </div>
      </div>

      <span className="text-[11px] font-bold shrink-0 text-emerald-500 opacity-80 group-hover:opacity-100">
        ➜
      </span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   KnowledgeTreeEnhanced — Dual mode Mindmap Graph & Outline Explorer
   ────────────────────────────────────────────────────────────────────────── */
export function KnowledgeTreeEnhanced({
  book,
  lang = "ar",
  dir = "rtl",
  theme,
  ui,
  skin,
  selected,
  onSelect,
  doneLeafIds = [],
  leafCards = (n) => (n.cards?.length ? n.cards : n.questions?.length ? [{ questions: n.questions }] : [])
}) {
  const [viewMode, setViewMode] = useState("outline");
  const [hovered, setHovered] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const doneSet = useMemo(() => new Set(doneLeafIds || []), [doneLeafIds]);

  // Pan & Zoom state
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, moved: false });
  const containerRef = useRef(null);
  const touchStartRef = useRef({ dist: 0, scale: 1 });

  const nodes = book?.nodes || [];
  const crossLinks = book?.crossLinks || [];

  // Compute dynamic layout
  const { vbW, vbH, positions, dims } = useMemo(() => {
    return computeTreeLayout(nodes, crossLinks, dir, lang, collapsedNodes);
  }, [nodes, crossLinks, dir, lang, collapsedNodes]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  // Edges
  const edges = useMemo(() => {
    const branchEdges = nodes
      .filter((n) => n.parent && positions[n.id] && positions[n.parent])
      .map((n) => ({ from: n.parent, to: n.id, type: "branch" }));
    const linkEdges = crossLinks
      .filter(([from, to]) => positions[from] && positions[to])
      .map(([from, to]) => ({ from, to, type: "link" }));
    return [...branchEdges, ...linkEdges];
  }, [nodes, crossLinks, positions]);

  // Search matches
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return nodes.filter((n) => {
      const ar = (n.ar || "").toLowerCase();
      const en = (n.en || "").toLowerCase();
      const id = (n.id || "").toLowerCase();
      return ar.includes(q) || en.includes(q) || id.includes(q);
    });
  }, [nodes, searchQuery]);

  const active = hovered || selected;
  const isEdgeActive = (e) => active && (e.from === active || e.to === active);
  const isNodeActive = (id) =>
    active && (id === active || edges.some((e) => (e.from === active && e.to === id) || (e.to === active && e.from === id)));

  const posFor = useCallback(
    (n) => {
      if (!n || !positions[n.id]) return { x: 0, y: 0 };
      const raw = positions[n.id];
      return { x: dir === "rtl" ? vbW - raw.x : raw.x, y: raw.y };
    },
    [positions, dir, vbW]
  );

  // Zoom controls
  const handleZoom = (delta) => {
    setScale((prevScale) => {
      const newScale = Math.max(0.35, Math.min(3.5, prevScale * delta));
      return Number(newScale.toFixed(3));
    });
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const centerOnNode = (nodeId) => {
    const n = nodeById[nodeId];
    if (!n) return;
    const pos = posFor(n);
    if (!pos) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const targetScale = Math.max(1.2, scale);
    setScale(targetScale);

    const svgAspect = vbW / vbH;
    const contAspect = rect.width / rect.height;
    let renderedW = rect.width;
    let renderedH = rect.height;
    if (contAspect > svgAspect) {
      renderedW = rect.height * svgAspect;
    } else {
      renderedH = rect.width / svgAspect;
    }

    const normX = pos.x / vbW;
    const normY = pos.y / vbH;
    const nodePixelX = normX * renderedW;
    const nodePixelY = normY * renderedH;

    setPan({
      x: Math.round(rect.width / 2 - nodePixelX * targetScale),
      y: Math.round(rect.height / 2 - nodePixelY * targetScale)
    });

    if (n.level === "leaf") {
      onSelect?.(n.id);
    }
  };

  // Wheel to zoom
  const onWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    handleZoom(zoomFactor);
  };

  // Pointer drag for panning
  const onPointerDown = (e) => {
    if (e.target.closest("button") || e.target.closest("input")) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false
    };
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy
    });
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  // Touch gesture pinch to zoom
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { dist, scale };
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && touchStartRef.current.dist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartRef.current.dist;
      const newScale = Math.max(0.35, Math.min(3.5, touchStartRef.current.scale * ratio));
      setScale(Number(newScale.toFixed(3)));
    }
  };

  const toggleCollapse = (e, nodeId) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3.5 select-none">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* View Mode Switcher: Outline vs Mindmap */}
        <div
          className="flex items-center p-1 rounded-xl border shadow-xs"
          style={{ background: theme.surface, borderColor: theme.hairline }}
        >
          <button
            onClick={() => setViewMode("outline")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
            style={{
              background: viewMode === "outline" ? theme.accent : "transparent",
              color: viewMode === "outline" ? theme.accentInk : theme.inkSoft,
            }}
          >
            <LayoutList size={13} />
            <span>{lang === "ar" ? "شجرة المنهج" : "Curriculum Outline"}</span>
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
            style={{
              background: viewMode === "graph" ? theme.accent : "transparent",
              color: viewMode === "graph" ? theme.accentInk : theme.inkSoft,
            }}
          >
            <GitBranch size={13} />
            <span>{lang === "ar" ? "الخريطة التفاعلية" : "Mindmap"}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search
            size={14}
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              [dir === "rtl" ? "right" : "left"]: 12,
              color: theme.inkSoft
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={ui.treeSearchPlaceholder || (lang === "ar" ? "ابحث في الشجرة والفروع والأوراق…" : "Search topics, branches, or leaves…")}
            className="w-full text-xs font-semibold py-2 outline-none rounded-xl transition-all"
            style={{
              paddingLeft: dir === "rtl" ? 32 : 36,
              paddingRight: dir === "rtl" ? 36 : 32,
              background: theme.surface,
              color: theme.ink,
              border: `1.5px solid ${searchResults.length > 0 ? theme.accent : theme.hairline}`
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 -translate-y-1/2 grid place-items-center w-5 h-5 rounded-full hover:bg-black/10 transition-colors"
              style={{
                [dir === "rtl" ? "left" : "right"]: 8,
                color: theme.inkSoft
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Zoom Controls (only shown in graph mode) */}
        {viewMode === "graph" && (
          <div
            className="flex items-center gap-1.5 p-1 rounded-xl border shadow-xs"
            style={{ background: theme.surface, borderColor: theme.hairline }}
          >
            <button
              onClick={() => handleZoom(1.2)}
              className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
              style={{ color: theme.ink }}
              title={ui.treeZoomIn || (lang === "ar" ? "تكبير" : "Zoom in")}
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => handleZoom(0.83)}
              className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
              style={{ color: theme.ink }}
              title={ui.treeZoomOut || (lang === "ar" ? "تصغير" : "Zoom out")}
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={resetView}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded-lg transition-opacity hover:opacity-80"
              style={{ background: theme.surfaceSoft, color: theme.ink }}
              title={ui.treeFitView || (lang === "ar" ? "إعادة ضبط العرض" : "Fit to view")}
            >
              <RotateCcw size={12} />
              <span>{Math.round(scale * 100)}%</span>
            </button>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {viewMode === "outline" ? (
        <CurriculumOutlineView
          nodes={nodes}
          lang={lang}
          dir={dir}
          theme={theme}
          ui={ui}
          skin={skin}
          selected={selected}
          onSelect={onSelect}
          doneSet={doneSet}
          searchQuery={searchQuery}
          leafCards={leafCards}
        />
      ) : (
        <>
          {/* Search Results Pills */}
          {searchResults.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5">
              <span className="text-[10px] font-bold shrink-0 uppercase tracking-wider" style={{ color: theme.accent }}>
                {searchResults.length} {ui.treeSearchResults || (lang === "ar" ? "عنصر مطابق:" : "matches:")}
              </span>
              {searchResults.map((sr) => (
                <button
                  key={sr.id}
                  onClick={() => centerOnNode(sr.id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 border transition-all hover:scale-105"
                  style={{
                    background: sr.level === "leaf" ? theme.accentSoft : theme.surface,
                    borderColor: theme.accent,
                    color: theme.ink
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: sr.level === "branch" ? theme.accent : theme.accentHover }}
                  />
                  <span>{sr[lang] || sr.ar || sr.en || sr.id}</span>
                </button>
              ))}
            </div>
          )}

          {/* Interactive Pan & Zoom Tree Canvas */}
          <div
            ref={containerRef}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            className="w-full relative overflow-hidden rounded-2xl border transition-colors cursor-grab active:cursor-grabbing"
            style={{
              height: 520,
              background: theme.surface,
              borderColor: theme.hairline
            }}
          >
            {/* Subtle grid background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.inkSoft} 1px, transparent 0)`,
                backgroundSize: "24px 24px"
              }}
            />

            <div
              className="w-full h-full transform-gpu origin-top-left transition-transform duration-75 ease-out"
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`
              }}
            >
              <svg
                viewBox={`0 0 ${vbW} ${vbH}`}
                className="w-full h-full overflow-visible"
                style={{ minWidth: vbW, minHeight: vbH }}
              >
                {/* Connecting Edges */}
                {edges.map((e) => {
                  const p1 = posFor(nodeById[e.from]);
                  const p2 = posFor(nodeById[e.to]);
                  if (!p1 || !p2) return null;

                  const isLink = e.type === "link";
                  const edgeActive = isEdgeActive(e);
                  const strokeColor = edgeActive
                    ? theme.accent
                    : isLink
                    ? theme.inkSoft
                    : theme.hairline;
                  const strokeW = edgeActive ? 2.5 : isLink ? 1.5 : 1.5;

                  const d = `M ${p1.x} ${p1.y} C ${p1.x} ${(p1.y + p2.y) / 2}, ${p2.x} ${(p1.y + p2.y) / 2}, ${p2.x} ${p2.y}`;

                  return (
                    <g key={`${e.from}-${e.to}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeW}
                        strokeDasharray={isLink ? "4 3" : undefined}
                        className="transition-colors duration-200"
                        opacity={edgeActive ? 1 : isLink ? 0.6 : 0.8}
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((n) => {
                  if (!positions[n.id]) return null;
                  const pos = posFor(n);
                  const dim = dims[n.id] || { w: 120, h: 36, r: 12, fs: 11, fw: 500 };
                  const isBranch = n.level === "branch";
                  const isSub = n.level === "sub";
                  const isLeaf = n.level === "leaf";

                  const isDone = isLeaf && doneSet.has(n.id);
                  const isSel = selected === n.id;
                  const isHov = hovered === n.id;
                  const isAct = isNodeActive(n.id);
                  const isCollapsed = collapsedNodes.has(n.id);

                  const hasChildren = nodes.some((c) => c.parent === n.id);

                  // Colors
                  let bg = theme.surface;
                  let border = theme.hairline;
                  let textColor = theme.ink;

                  if (isBranch) {
                    bg = isSel || isAct ? theme.accent : theme.surface;
                    textColor = isSel || isAct ? theme.accentInk : theme.ink;
                    border = isSel || isAct ? theme.accent : theme.hairline;
                  } else if (isSub) {
                    bg = isSel || isAct ? theme.accentSoft : theme.surface;
                    textColor = isSel || isAct ? theme.accent : theme.ink;
                    border = isSel || isAct ? theme.accent : theme.hairline;
                  } else if (isLeaf) {
                    if (isDone) {
                      bg = isSel ? "#10B981" : "#10B9811A";
                      border = "#10B981";
                      textColor = isSel ? "#FFFFFF" : "#10B981";
                    } else if (isSel) {
                      bg = theme.accent;
                      textColor = theme.accentInk;
                      border = theme.accent;
                    } else if (isHov || isAct) {
                      bg = theme.accentSoft;
                      border = theme.accent;
                      textColor = theme.accent;
                    }
                  }

                  const title = n[lang] || n.ar || n.en || n.id;

                  return (
                    <g
                      key={n.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onMouseEnter={() => setHovered(n.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (dragStartRef.current.moved) return;
                        if (isLeaf) {
                          onSelect?.(n.id);
                        } else {
                          toggleCollapse(e, n.id);
                        }
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Node Shape */}
                      <rect
                        x={-dim.w / 2}
                        y={-dim.h / 2}
                        width={dim.w}
                        height={dim.h}
                        rx={dim.r}
                        fill={bg}
                        stroke={border}
                        strokeWidth={isSel || isHov ? 2.5 : 1.5}
                        className="transition-all duration-150 drop-shadow-xs"
                      />

                      {/* Done indicator for leaves */}
                      {isDone && (
                        <g transform={`translate(${dir === "rtl" ? dim.w / 2 - 16 : -dim.w / 2 + 16}, 0)`}>
                          <circle r={6} fill="#10B981" />
                          <path
                            d="M -3 0 L -1 2 L 3 -2"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      )}

                      {/* Expand / Collapse Indicator for Branches & Subs */}
                      {hasChildren && (
                        <g
                          transform={`translate(${dir === "rtl" ? -dim.w / 2 + 14 : dim.w / 2 - 14}, 0)`}
                          onClick={(e) => toggleCollapse(e, n.id)}
                          className="hover:scale-125 transition-transform"
                        >
                          <circle r={7} fill={theme.surfaceSoft} stroke={border} strokeWidth={1} />
                          {isCollapsed ? (
                            <path
                              d="M -3 -1.5 L 0 1.5 L 3 -1.5"
                              fill="none"
                              stroke={textColor}
                              strokeWidth={1.5}
                              strokeLinecap="round"
                            />
                          ) : (
                            <path
                              d="M -3 1.5 L 0 -1.5 L 3 1.5"
                              fill="none"
                              stroke={textColor}
                              strokeWidth={1.5}
                              strokeLinecap="round"
                            />
                          )}
                        </g>
                      )}

                      {/* Node Text Label */}
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={textColor}
                        fontSize={dim.fs}
                        fontWeight={dim.fw}
                        fontFamily="inherit"
                        className="pointer-events-none select-none"
                      >
                        {title}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function KnowledgeTree(props) {
  return <KnowledgeTreeEnhanced {...props} />;
}
