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
  CheckCircle2
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
      dims[n.id] = { w: Math.max(130, Math.min(230, len * 8.5 + 34)), h: 42, r: 12, fs: 11.5, fw: 600 };
    }
  });

  // Calculate subtree widths taking collapse into account
  const subTreeWidths = {};
  subs.forEach((s) => {
    if (collapsedNodeIds.has(s.id) || (s.parent && collapsedNodeIds.has(s.parent))) {
      subTreeWidths[s.id] = dims[s.id].w;
      return;
    }
    const sLeaves = leaves.filter((l) => l.parent === s.id && !collapsedNodeIds.has(l.id));
    if (sLeaves.length > 0) {
      const leavesTotalW = sLeaves.reduce((sum, l) => sum + dims[l.id].w, 0) + (sLeaves.length - 1) * 24;
      subTreeWidths[s.id] = Math.max(dims[s.id].w, leavesTotalW);
    } else {
      subTreeWidths[s.id] = dims[s.id].w;
    }
  });

  const branchTreeWidths = {};
  branches.forEach((b) => {
    if (collapsedNodeIds.has(b.id)) {
      branchTreeWidths[b.id] = dims[b.id].w;
      return;
    }
    const bSubs = subs.filter((s) => s.parent === b.id && !collapsedNodeIds.has(s.id));
    const bLeaves = leaves.filter((l) => l.parent === b.id && !collapsedNodeIds.has(l.id));
    let total = 0;
    if (bSubs.length > 0) {
      total = bSubs.reduce((sum, s) => sum + subTreeWidths[s.id], 0) + (bSubs.length - 1) * 36;
    }
    if (bLeaves.length > 0) {
      const lTotal = bLeaves.reduce((sum, l) => sum + dims[l.id].w, 0) + (bLeaves.length - 1) * 24;
      total = Math.max(total, lTotal);
    }
    branchTreeWidths[b.id] = Math.max(dims[b.id].w, total);
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
  const handleZoom = (delta, clientCenter) => {
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

    // Coordinate mapping from SVG viewBox to pixel container
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
    <div className="flex flex-col gap-3 select-none">
      {/* Search Bar & Quick Jump Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
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

        {/* Zoom & Fit Control Toolbar */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-xl border shadow-sm"
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
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-opacity hover:opacity-80"
            style={{ background: theme.surfaceSoft, color: theme.ink }}
            title={ui.treeFitView || (lang === "ar" ? "إعادة ضبط العرض" : "Fit to view")}
          >
            <RotateCcw size={12} />
            <span>{Math.round(scale * 100)}%</span>
          </button>
        </div>
      </div>

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
        className="w-full relative overflow-hidden rounded-2xl border transition-colors select-none"
        style={{
          height: 480,
          background: theme.canvas,
          borderColor: theme.hairline,
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none"
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center origin-center transition-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "center center"
          }}
        >
          <svg
            viewBox={`0 0 ${vbW} ${vbH}`}
            className="overflow-visible"
            style={{ width: vbW, height: vbH }}
            role="img"
            aria-label={ui.treeEyebrow}
          >
            {/* Edges */}
            {edges.map((e, i) => {
              const a = posFor(nodeById[e.from]);
              const b = posFor(nodeById[e.to]);
              const edgeActive = isEdgeActive(e);
              const dimmed = active && !edgeActive;

              if (e.type === "branch") {
                const midY = (a.y + b.y) / 2;
                const path = `M ${a.x} ${a.y + 22} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y - 20}`;
                return (
                  <path
                    key={`edge-${i}`}
                    d={path}
                    fill="none"
                    stroke={edgeActive ? theme.accent : theme.hairlineStrong}
                    strokeWidth={edgeActive ? 3 : 1.8}
                    style={{ opacity: dimmed ? 0.3 : 1, transition: "all .18s ease" }}
                  />
                );
              }

              // Cross-branch link
              const midY = Math.min(vbH - 12, Math.min(a.y, b.y) + 40);
              const path = `M ${a.x} ${a.y + 20} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y + 20}`;
              return (
                <path
                  key={`link-${i}`}
                  d={path}
                  fill="none"
                  stroke={edgeActive ? theme.accent : theme.inkSoft}
                  strokeWidth={edgeActive ? 3 : 1.6}
                  strokeDasharray="6 5"
                  style={{ opacity: dimmed ? 0.2 : 0.85, transition: "all .18s ease" }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              if (!positions[n.id]) return null;
              const { x, y } = posFor(n);
              const d = dims[n.id] || { w: 140, h: 40, r: 14, fs: 12, fw: 600 };
              const nodeActive = isNodeActive(n.id);
              const isHovered = hovered === n.id;
              const isSelected = selected === n.id;
              const isLeaf = n.level === "leaf";
              const isBranch = n.level === "branch";
              const isSub = n.level === "sub";
              const count = isLeaf ? leafCards(n).reduce((sum, g) => sum + g.questions.length, 0) : 0;
              const isCollapsed = collapsedNodes.has(n.id);

              const hasChildren = (isBranch || isSub) && nodes.some((child) => child.parent === n.id);
              const isSearchMatch = searchResults.some((sr) => sr.id === n.id);

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

              if (isSearchMatch) {
                stroke = theme.accentHover;
              }

              return (
                <g
                  key={n.id}
                  role={isLeaf ? "button" : undefined}
                  tabIndex={isLeaf ? 0 : -1}
                  aria-label={isLeaf ? `${n[lang] || n.ar || n.en} — ${count > 1 ? ui.multiCardBadge(count) : ""}` : (n[lang] || n.ar || n.en)}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(n.id)}
                  onBlur={() => setHovered(null)}
                  onClick={(e) => {
                    if (dragStartRef.current.moved) return;
                    if (isLeaf) {
                      onSelect(n.id);
                    } else if (hasChildren) {
                      toggleCollapse(e, n.id);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (isLeaf && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onSelect(n.id);
                    }
                  }}
                  style={{ cursor: isLeaf ? "pointer" : hasChildren ? "pointer" : "default", outline: "none" }}
                >
                  <rect
                    x={x - d.w / 2}
                    y={y - d.h / 2}
                    width={d.w}
                    height={d.h}
                    rx={skin && skin.pixel ? 0 : d.r}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSearchMatch ? 3 : skin && skin.pixel ? 2.5 : 1.5}
                    style={{
                      filter: isHovered || isSearchMatch ? "drop-shadow(0 4px 12px rgba(0,0,0,0.18))" : "none",
                      opacity: active && !nodeActive && !isSearchMatch ? 0.35 : 1,
                      transition: "all .18s ease",
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      transform: isHovered || isSelected || isSearchMatch ? "scale(1.06)" : "scale(1)"
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
                    style={{
                      fontFamily: "inherit",
                      opacity: active && !nodeActive && !isSearchMatch ? 0.45 : 1,
                      transition: "opacity .18s ease",
                      pointerEvents: "none"
                    }}
                  >
                    {n[lang] || n.ar || n.en || n.id}
                  </text>

                  {/* Completed checkmark badge on leaves */}
                  {isLeaf && doneSet.has(n.id) && (
                    <g style={{ pointerEvents: "none" }}>
                      <circle cx={x - d.w / 2 + 10} cy={y - d.h / 2 + 10} r={8} fill="#10B981" />
                      <path
                        d={`M ${x - d.w / 2 + 6.5} ${y - d.h / 2 + 10} L ${x - d.w / 2 + 9} ${y - d.h / 2 + 12.5} L ${x - d.w / 2 + 13.5} ${y - d.h / 2 + 7.5}`}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}

                  {/* Multi-question count badge on leaves */}
                  {count > 1 && (
                    <g style={{ opacity: active && !nodeActive ? 0.5 : 1, transition: "opacity .18s ease", pointerEvents: "none" }}>
                      <circle cx={x + d.w / 2 - 6} cy={y - d.h / 2 + 2} r={10} fill={theme.ink} />
                      <text x={x + d.w / 2 - 6} y={y - d.h / 2 + 2} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fill={theme.canvas}>
                        {count}
                      </text>
                    </g>
                  )}

                  {/* Collapse indicator for parent branches */}
                  {hasChildren && (
                    <g
                      onClick={(e) => toggleCollapse(e, n.id)}
                      className="cursor-pointer transition-transform hover:scale-125"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <circle
                        cx={x}
                        cy={y + d.h / 2 + 1}
                        r={8}
                        fill={theme.surface}
                        stroke={theme.hairlineStrong}
                        strokeWidth={1.5}
                      />
                      <text
                        x={x}
                        y={y + d.h / 2 + 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={9}
                        fontWeight={900}
                        fill={theme.ink}
                      >
                        {isCollapsed ? "+" : "−"}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Tree Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-1 px-1">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full" style={{ width: 22, height: 10, background: theme.accent }} />
            <span className="text-xs font-semibold" style={{ color: theme.inkSoft }}>
              {ui.legendBranch}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full" style={{ width: 18, height: 10, background: theme.accentSoft, border: `1.5px solid ${theme.accent}` }} />
            <span className="text-xs font-semibold" style={{ color: theme.inkSoft }}>
              {ui.legendLeaf}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="18" height="6">
              <line x1="0" y1="3" x2="18" y2="3" stroke={theme.inkSoft} strokeWidth="1.6" strokeDasharray="4 4" />
            </svg>
            <span className="text-xs font-semibold" style={{ color: theme.inkSoft }}>
              {ui.legendLink}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono" style={{ color: theme.inkSoft }}>
          {lang === "ar" ? "اسحب للتحريك · بكرة الماوس للزوم" : "Drag to pan · Scroll to zoom"}
        </span>
      </div>
    </div>
  );
}
