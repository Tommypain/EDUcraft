const fs = require("fs");
const path = require("path");

console.log("=== PHASE 7 VERIFICATION: KNOWLEDGE TREE SUITE ===\n");

function computeTreeLayout(nodes, crossLinks = [], dir = "ltr", lang = "ar", collapsedNodeIds = new Set()) {
  const branches = nodes.filter((n) => n.level === "branch");
  const subs = nodes.filter((n) => n.level === "sub");
  const leaves = nodes.filter((n) => n.level === "leaf");

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

  // Backward compatibility: If book already has complete manual x/y coordinates, preserve them!
  const allHaveCoords = nodes.length > 0 && nodes.every((n) => n.x !== undefined && n.y !== undefined && n.x !== null && n.y !== null && !isNaN(Number(n.x)) && !isNaN(Number(n.y)));
  if (allHaveCoords) {
    const positions = {};
    let maxX = 0;
    let maxY = 0;
    nodes.forEach((n) => {
      const x = Number(n.x);
      const y = Number(n.y);
      positions[n.id] = { x, y };
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });
    const vbW = Math.max(900, Math.round(maxX + 180));
    const vbH = Math.max(380, Math.round(maxY + 120));
    return { vbW, vbH, positions, dims };
  }

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

// 1. Stress Test with 200+ nodes
console.log("--- TEST 1: Stress Test with 200+ Nodes ---");
const syntheticNodes = [];
for (let b = 1; b <= 10; b++) {
  const bId = `branch-${b}`;
  syntheticNodes.push({ id: bId, level: "branch", ar: `الفرع الرئيسي ${b}`, en: `Main Branch ${b}` });
  for (let s = 1; s <= 4; s++) {
    const sId = `${bId}-sub-${s}`;
    syntheticNodes.push({ id: sId, level: "sub", parent: bId, ar: `فرع فرعي ${s}`, en: `Sub Branch ${s}` });
    for (let l = 1; l <= 5; l++) {
      const lId = `${sId}-leaf-${l}`;
      syntheticNodes.push({ id: lId, level: "leaf", parent: sId, ar: `ورقة تعليمية ${l}`, en: `Leaf ${l}` });
    }
  }
}
console.log(`Generated synthetic tree with ${syntheticNodes.length} nodes.`);

const t0 = process.hrtime.bigint();
const stressLayout = computeTreeLayout(syntheticNodes, [], "ltr", "ar");
const t1 = process.hrtime.bigint();
const ms = Number(t1 - t0) / 1_000_000;

console.log(`Stress layout computed in: ${ms.toFixed(3)} ms`);
console.log(`Dynamic ViewBox: ${stressLayout.vbW} x ${stressLayout.vbH}`);
console.log(`Nodes positioned: ${Object.keys(stressLayout.positions).length}/${syntheticNodes.length}`);

if (Object.keys(stressLayout.positions).length !== syntheticNodes.length) {
  throw new Error("Some nodes were not positioned in stress layout!");
}
if (ms > 50) {
  throw new Error(`Layout too slow: ${ms} ms`);
}
console.log("Stress test: PASS (< 50ms for 250 nodes)");

// 2. Backward compatibility with manual x/y coordinates
console.log("\n--- TEST 2: Legacy Book with Manual Coordinates Preservation ---");
const legacyNodes = [
  { id: "leg-b1", level: "branch", ar: "فرع يدوي", x: 120, y: 40 },
  { id: "leg-s1", level: "sub", parent: "leg-b1", ar: "فرع فرعي يدوي", x: 120, y: 140 },
  { id: "leg-l1", level: "leaf", parent: "leg-s1", ar: "ورقة يدوية", x: 120, y: 240 }
];

const legacyLayout = computeTreeLayout(legacyNodes, [], "ltr", "ar");
console.log("Legacy Node 1 position:", legacyLayout.positions["leg-b1"]);
console.log("Legacy Node 2 position:", legacyLayout.positions["leg-s1"]);
console.log("Legacy Node 3 position:", legacyLayout.positions["leg-l1"]);

if (legacyLayout.positions["leg-b1"].x !== 120 || legacyLayout.positions["leg-b1"].y !== 40) {
  throw new Error("Legacy branch manual x/y was overwritten!");
}
if (legacyLayout.positions["leg-s1"].x !== 120 || legacyLayout.positions["leg-s1"].y !== 140) {
  throw new Error("Legacy sub manual x/y was overwritten!");
}
if (legacyLayout.positions["leg-l1"].x !== 120 || legacyLayout.positions["leg-l1"].y !== 240) {
  throw new Error("Legacy leaf manual x/y was overwritten!");
}
console.log("Legacy manual coordinates preservation: PASS");

console.log("\nALL PHASE 7 TESTS PASSED 100% (PASS)!");
