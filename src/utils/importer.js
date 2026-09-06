/**
 * EDUcraft Smart Schema Validator & Import Pipeline Engine
 * Conforming strictly to EDUcraft-full-json-guide.md specification
 */

export const QUESTION_TYPES = [
  "single", "multi", "tf", "short", "essay", "fill",
  "cloze", "match", "order", "sort", "numeric", "rating", "slider"
];

export const PAGE_BLOCK_KINDS = [
  "sectionTitle", "keyterm", "note", "warning", "important", "image", "code", "pagebreak"
];

export function parseJSONSafely(text) {
  try {
    const data = JSON.parse(text);
    return { data, error: null };
  } catch (err) {
    let line = null;
    let col = null;
    const match = err.message.match(/at position (\d+)/) || err.message.match(/line (\d+) column (\d+)/);
    if (match) {
      if (match[2]) {
        line = parseInt(match[1], 10);
        col = parseInt(match[2], 10);
      } else {
        const pos = parseInt(match[1], 10);
        const sub = text.slice(0, pos);
        line = (sub.match(/\n/g) || []).length + 1;
        col = pos - sub.lastIndexOf("\n");
      }
    }
    return {
      data: null,
      error: {
        message: err.message,
        line,
        col
      }
    };
  }
}

export function detectPayloadType(data) {
  if (!data || typeof data !== "object") return "unknown";

  if (Array.isArray(data)) {
    if (data.length === 0) return "empty_array";
    const hasKind = data.every((item) => item && typeof item === "object" && ("kind" in item || "itemIds" in item));
    if (hasKind) return "collections";
    const hasNodes = data.every((item) => item && typeof item === "object" && ("nodes" in item || "cover" in item));
    if (hasNodes) return "books";
    return "unknown";
  }

  if ("books" in data && Array.isArray(data.books)) {
    return "master_library";
  }
  if ("nodes" in data && Array.isArray(data.nodes)) {
    return "book";
  }
  if ("kind" in data && ("itemIds" in data || data.kind === "folder" || data.kind === "encyclopedia")) {
    return "collection";
  }
  if ("doneLeafIds" in data || "targetCount" in data) {
    return "plan";
  }

  return "unknown";
}

export function validateQuestion(q, path = "") {
  const errors = [];
  const warnings = [];

  if (!q || typeof q !== "object") {
    errors.push(`${path}: Question must be an object`);
    return { errors, warnings };
  }

  if (!QUESTION_TYPES.includes(q.type)) {
    errors.push(`${path}: Unknown question type "${q.type}". Must be one of: ${QUESTION_TYPES.join(", ")}`);
    return { errors, warnings };
  }

  if (!q.en || typeof q.en !== "object") {
    errors.push(`${path}: Missing English content object "en"`);
  }
  if (!q.ar || typeof q.ar !== "object") {
    errors.push(`${path}: Missing Arabic content object "ar"`);
  }

  const cEn = q.en || {};
  const cAr = q.ar || {};

  switch (q.type) {
    case "single": {
      if (!Array.isArray(cAr.options) || cAr.options.length < 2) {
        errors.push(`${path} [single]: "ar.options" must be an array with at least 2 choices`);
      }
      if (typeof cAr.correct !== "number" || cAr.correct < 0 || (Array.isArray(cAr.options) && cAr.correct >= cAr.options.length)) {
        errors.push(`${path} [single]: "ar.correct" must be a valid integer index within options range (0 to ${cAr.options?.length - 1 || 0})`);
      }
      break;
    }
    case "multi": {
      if (!Array.isArray(cAr.options) || cAr.options.length < 2) {
        errors.push(`${path} [multi]: "ar.options" must be an array with at least 2 choices`);
      }
      if (!Array.isArray(cAr.correct) || cAr.correct.length === 0) {
        errors.push(`${path} [multi]: "ar.correct" must be a non-empty array of valid option indices`);
      } else if (Array.isArray(cAr.options)) {
        cAr.correct.forEach((idx) => {
          if (typeof idx !== "number" || idx < 0 || idx >= cAr.options.length) {
            errors.push(`${path} [multi]: correct index ${idx} is out of bounds (0..${cAr.options.length - 1})`);
          }
        });
      }
      break;
    }
    case "tf": {
      if (typeof cAr.correct !== "boolean") {
        errors.push(`${path} [tf]: "ar.correct" must be a boolean (true or false)`);
      }
      break;
    }
    case "short": {
      if (!Array.isArray(cAr.accepted) || cAr.accepted.length === 0) {
        errors.push(`${path} [short]: "ar.accepted" must be a non-empty array of accepted answer strings`);
      }
      break;
    }
    case "essay": {
      if (!cAr.model || typeof cAr.model !== "string") {
        warnings.push(`${path} [essay]: "ar.model" is missing or empty (recommended for student self-evaluation)`);
      }
      break;
    }
    case "fill": {
      const template = cAr.template || "";
      const blankCount = (template.match(/___/g) || []).length;
      if (blankCount === 0) {
        errors.push(`${path} [fill]: template must contain at least one "___" placeholder`);
      }
      if (!Array.isArray(cAr.blanks) || cAr.blanks.length !== blankCount) {
        errors.push(`${path} [fill]: "ar.blanks" array length (${cAr.blanks?.length || 0}) must match "___" count in template (${blankCount})`);
      }
      break;
    }
    case "cloze": {
      const template = cAr.template || "";
      if (!template.includes("___")) {
        errors.push(`${path} [cloze]: template must contain a "___" placeholder`);
      }
      if (!Array.isArray(cAr.bank) || cAr.bank.length === 0) {
        errors.push(`${path} [cloze]: "ar.bank" must be a non-empty array of words`);
      }
      if (!cAr.correct || (Array.isArray(cAr.bank) && !cAr.bank.includes(cAr.correct))) {
        errors.push(`${path} [cloze]: "ar.correct" ("${cAr.correct}") must be an element present in the word bank`);
      }
      break;
    }
    case "match": {
      if (!Array.isArray(cAr.left) || !Array.isArray(cAr.right) || !Array.isArray(cAr.correct)) {
        errors.push(`${path} [match]: "left", "right", and "correct" must all be arrays`);
      } else {
        if (cAr.left.length !== cAr.right.length || cAr.left.length !== cAr.correct.length) {
          errors.push(`${path} [match]: "left" (${cAr.left.length}), "right" (${cAr.right.length}), and "correct" (${cAr.correct.length}) arrays must have identical length`);
        }
        cAr.correct.forEach((rIdx, lIdx) => {
          if (typeof rIdx !== "number" || rIdx < 0 || rIdx >= cAr.right.length) {
            errors.push(`${path} [match]: correct index for left item ${lIdx} (${rIdx}) is out of bounds for right array`);
          }
        });
      }
      break;
    }
    case "order": {
      if (!Array.isArray(cAr.items) || !Array.isArray(cAr.correct)) {
        errors.push(`${path} [order]: "items" and "correct" must both be arrays`);
      } else if (cAr.items.length !== cAr.correct.length) {
        errors.push(`${path} [order]: "items" length (${cAr.items.length}) must match "correct" length (${cAr.correct.length})`);
      }
      break;
    }
    case "sort": {
      if (!Array.isArray(cAr.bins) || cAr.bins.length < 2) {
        errors.push(`${path} [sort]: "bins" must be an array with at least 2 bin names`);
      }
      if (!Array.isArray(cAr.items) || cAr.items.length === 0) {
        errors.push(`${path} [sort]: "items" must be a non-empty array of [label, binName] tuples`);
      } else if (Array.isArray(cAr.bins)) {
        cAr.items.forEach(([label, binName], i) => {
          if (!cAr.bins.includes(binName)) {
            errors.push(`${path} [sort]: item ${i} assigns bin "${binName}" which is not in declared bins (${cAr.bins.join(", ")})`);
          }
        });
      }
      break;
    }
    case "numeric": {
      if (typeof cAr.correct !== "number") {
        errors.push(`${path} [numeric]: "ar.correct" must be a number`);
      }
      break;
    }
    case "rating": {
      if (!cAr.prompt) {
        errors.push(`${path} [rating]: "prompt" string is required`);
      }
      break;
    }
    case "slider": {
      if (typeof cAr.min !== "number" || typeof cAr.max !== "number" || typeof cAr.correct !== "number") {
        errors.push(`${path} [slider]: "min", "max", and "correct" must all be numbers`);
      } else if (cAr.min >= cAr.max) {
        errors.push(`${path} [slider]: "min" (${cAr.min}) must be strictly less than "max" (${cAr.max})`);
      }
      break;
    }
  }

  return { errors, warnings };
}

export function validatePageBlock(block, path = "") {
  const errors = [];
  const warnings = [];

  if (!block || typeof block !== "object") {
    errors.push(`${path}: PageBlock must be an object`);
    return { errors, warnings };
  }

  if (!PAGE_BLOCK_KINDS.includes(block.kind)) {
    errors.push(`${path}: Unknown pageBlock kind "${block.kind}". Must be one of: ${PAGE_BLOCK_KINDS.join(", ")}`);
    return { errors, warnings };
  }

  if (block.kind === "image") {
    if (!block.imageUrl || typeof block.imageUrl !== "string") {
      errors.push(`${path} [image block]: "imageUrl" is required`);
    }
  } else if (block.kind !== "pagebreak") {
    if (!block.text || typeof block.text !== "string") {
      errors.push(`${path} [${block.kind} block]: "text" string is required`);
    }
  }

  return { errors, warnings };
}

export function validateBook(book, path = "", existingBookIds = new Set()) {
  const errors = [];
  const warnings = [];
  const stats = {
    branches: 0,
    subs: 0,
    leaves: 0,
    questions: 0,
    cards: 0,
    pageBlocks: 0,
    questionTypes: {}
  };

  if (!book || typeof book !== "object") {
    errors.push(`${path}: Book must be an object`);
    return { errors, warnings, stats };
  }

  if (!book.id || typeof book.id !== "string" || !book.id.trim()) {
    errors.push(`${path}: Missing or invalid "id"`);
  }

  if (!book.cover || typeof book.cover !== "object" || !book.cover.from || !book.cover.to) {
    errors.push(`${path} (${book.id || "unknown"}): "cover" must be an object with "from" and "to" color strings`);
  }

  if (!book.en || !book.en.title || !book.en.tagline) {
    errors.push(`${path} (${book.id || "unknown"}): Missing "en.title" or "en.tagline"`);
  }
  if (!book.ar || !book.ar.title || !book.ar.tagline) {
    errors.push(`${path} (${book.id || "unknown"}): Missing "ar.title" or "ar.tagline"`);
  }

  if (!Array.isArray(book.nodes) || book.nodes.length === 0) {
    errors.push(`${path} (${book.id || "unknown"}): "nodes" must be a non-empty array`);
    return { errors, warnings, stats };
  }

  const nodeIds = new Set();
  const leafIds = new Set();
  const nodeMap = new Map();

  book.nodes.forEach((n, idx) => {
    const nPath = `${path} > node[${idx}] (${n.id || "no-id"})`;
    if (!n.id || typeof n.id !== "string") {
      errors.push(`${nPath}: Missing or invalid node id`);
    } else if (nodeIds.has(n.id)) {
      errors.push(`${nPath}: Duplicate node id "${n.id}" within book`);
    } else {
      nodeIds.add(n.id);
      nodeMap.set(n.id, n);
    }

    if (!["branch", "sub", "leaf"].includes(n.level)) {
      errors.push(`${nPath}: Invalid level "${n.level}". Must be branch, sub, or leaf`);
    }

    if (typeof n.x !== "number" || typeof n.y !== "number") {
      warnings.push(`${nPath}: x and y coordinates should be numeric for SVG tree rendering`);
    }

    if (n.level === "branch") {
      stats.branches++;
      if (n.parent) {
        warnings.push(`${nPath}: Root branch should have null parent`);
      }
    } else if (n.level === "sub") {
      stats.subs++;
      if (!n.parent) {
        errors.push(`${nPath}: Sub-branch must specify a parent node ID`);
      }
    } else if (n.level === "leaf") {
      stats.leaves++;
      leafIds.add(n.id);
      if (!n.parent) {
        errors.push(`${nPath}: Leaf must specify a parent node ID`);
      }

      const hasQuestions = Array.isArray(n.questions) && n.questions.length > 0;
      const hasCards = Array.isArray(n.cards) && n.cards.length > 0;

      if (hasQuestions && hasCards) {
        errors.push(`${nPath}: Leaf cannot declare both non-empty "questions" AND "cards" at the same time. Use either questions OR cards`);
      }

      if (hasQuestions) {
        n.questions.forEach((q, qIdx) => {
          stats.questions++;
          stats.questionTypes[q.type] = (stats.questionTypes[q.type] || 0) + 1;
          const qRes = validateQuestion(q, `${nPath} > question[${qIdx}]`);
          errors.push(...qRes.errors);
          warnings.push(...qRes.warnings);
        });
      }

      if (hasCards) {
        n.cards.forEach((card, cIdx) => {
          stats.cards++;
          const cPath = `${nPath} > card[${cIdx}] (${card.id || "no-id"})`;
          if (!Array.isArray(card.questions) || card.questions.length === 0) {
            errors.push(`${cPath}: Card must contain a non-empty "questions" array`);
          } else {
            card.questions.forEach((q, qIdx) => {
              stats.questions++;
              stats.questionTypes[q.type] = (stats.questionTypes[q.type] || 0) + 1;
              const qRes = validateQuestion(q, `${cPath} > question[${qIdx}]`);
              errors.push(...qRes.errors);
              warnings.push(...qRes.warnings);
            });
          }
        });
      }

      if (!hasQuestions && !hasCards && (!Array.isArray(n.pageBlocks) || n.pageBlocks.length === 0)) {
        warnings.push(`${nPath}: Leaf has neither questions nor pageBlocks (empty leaf)`);
      }

      if (Array.isArray(n.pageBlocks)) {
        n.pageBlocks.forEach((blk, bIdx) => {
          stats.pageBlocks++;
          const bRes = validatePageBlock(blk, `${nPath} > pageBlock[${bIdx}]`);
          errors.push(...bRes.errors);
          warnings.push(...bRes.warnings);
        });
      }
    }
  });

  // Verify all parent references point to existing nodes
  book.nodes.forEach((n) => {
    if (n.parent && !nodeIds.has(n.parent)) {
      errors.push(`${path}: Node "${n.id}" points to non-existent parent ID "${n.parent}" (orphan node)`);
    }
  });

  // Verify crossLinks
  if (Array.isArray(book.crossLinks)) {
    book.crossLinks.forEach(([fromId, toId], idx) => {
      const clPath = `${path} > crossLink[${idx}] [${fromId}, ${toId}]`;
      if (!leafIds.has(fromId)) {
        errors.push(`${clPath}: Source leaf "${fromId}" does not exist in book`);
      }
      if (!leafIds.has(toId)) {
        errors.push(`${clPath}: Target leaf "${toId}" does not exist in book`);
      }
    });
  }

  return { errors, warnings, stats };
}

export function validateCollection(col, path = "", existingIds = new Set()) {
  const errors = [];
  const warnings = [];

  if (!col || typeof col !== "object") {
    errors.push(`${path}: Collection must be an object`);
    return { errors, warnings };
  }

  if (!col.id || typeof col.id !== "string") {
    errors.push(`${path}: Missing or invalid collection "id"`);
  }
  if (!["folder", "encyclopedia"].includes(col.kind)) {
    errors.push(`${path} (${col.id || "no-id"}): "kind" must be "folder" or "encyclopedia"`);
  }
  if (!col.title || typeof col.title !== "string") {
    errors.push(`${path} (${col.id || "no-id"}): Missing "title" string`);
  }
  if (!Array.isArray(col.itemIds)) {
    errors.push(`${path} (${col.id || "no-id"}): "itemIds" must be an array of book/collection IDs`);
  }

  return { errors, warnings };
}

export function validatePayload(data, existingBooks = [], existingCollections = []) {
  const type = detectPayloadType(data);
  const errors = [];
  const warnings = [];
  const existingBookIds = new Set(existingBooks.map((b) => b.id));
  const existingCollectionIds = new Set(existingCollections.map((c) => c.id));
  const existingAllIds = new Set([...existingBookIds, ...existingCollectionIds]);

  let parsedBooks = [];
  let parsedCollections = [];
  let parsedPlans = {};
  const conflicts = [];
  const totalStats = {
    booksCount: 0,
    collectionsCount: 0,
    branchesCount: 0,
    leavesCount: 0,
    questionsCount: 0,
    pageBlocksCount: 0,
    questionTypes: {}
  };

  if (type === "unknown" || type === "empty_array") {
    errors.push("Could not recognize valid EDUcraft payload format. Supported: Book, Book Array, Collections, Master Library Package, or Study Plan.");
    return { valid: false, type, errors, warnings, conflicts, totalStats, parsedBooks, parsedCollections, parsedPlans };
  }

  if (type === "book") {
    parsedBooks = [data];
  } else if (type === "books") {
    parsedBooks = data;
  } else if (type === "collection") {
    parsedCollections = [data];
  } else if (type === "collections") {
    parsedCollections = data;
  } else if (type === "master_library") {
    parsedBooks = data.books || [];
    parsedCollections = data.collections || [];
    if (data.plans) parsedPlans = data.plans;
  }

  // Validate books
  parsedBooks.forEach((book, bIdx) => {
    totalStats.booksCount++;
    if (existingBookIds.has(book.id)) {
      conflicts.push({ type: "book", id: book.id, title: book.ar?.title || book.en?.title || book.id });
    }
    const bRes = validateBook(book, `Book[${bIdx}]`, existingBookIds);
    errors.push(...bRes.errors);
    warnings.push(...bRes.warnings);
    totalStats.branchesCount += bRes.stats.branches;
    totalStats.leavesCount += bRes.stats.leaves;
    totalStats.questionsCount += bRes.stats.questions;
    totalStats.pageBlocksCount += bRes.stats.pageBlocks;
    Object.entries(bRes.stats.questionTypes).forEach(([qType, cnt]) => {
      totalStats.questionTypes[qType] = (totalStats.questionTypes[qType] || 0) + cnt;
    });
  });

  // Validate collections
  parsedCollections.forEach((col, cIdx) => {
    totalStats.collectionsCount++;
    if (existingCollectionIds.has(col.id)) {
      conflicts.push({ type: "collection", id: col.id, title: col.title || col.id });
    }
    const cRes = validateCollection(col, `Collection[${cIdx}]`, existingAllIds);
    errors.push(...cRes.errors);
    warnings.push(...cRes.warnings);
  });

  const referencedImages = extractReferencedImages(parsedBooks);
  const valid = errors.length === 0;
  return {
    valid,
    type,
    errors,
    warnings,
    conflicts,
    totalStats,
    parsedBooks,
    parsedCollections,
    parsedPlans,
    referencedImages
  };
}

export function extractReferencedImages(parsedBooks = []) {
  const images = [];
  const seenPaths = new Set();

  parsedBooks.forEach((book) => {
    (book.nodes || []).forEach((node) => {
      // 1. Check pageBlocks
      const blocks = node.extra?.pageBlocks || [];
      blocks.forEach((block, bIdx) => {
        const rawPath = block.imageUrl || block.src || (block.kind === "image" ? block.asset_id : null);
        if (rawPath && typeof rawPath === "string" && !seenPaths.has(rawPath)) {
          seenPaths.add(rawPath);
          const filename = rawPath.split("/").pop().split("\\").pop();
          images.push({
            id: `img_${images.length + 1}`,
            path: rawPath,
            filename,
            location: `${node.ar || node.en || node.id} (PageBlock ${bIdx + 1})`,
            type: "pageBlock",
            resolvedUrl: null,
          });
        }
      });

      // 2. Check cards
      const cards = node.extra?.cards || [];
      cards.forEach((card, cIdx) => {
        if (card.image && typeof card.image === "string" && !seenPaths.has(card.image)) {
          seenPaths.add(card.image);
          const filename = card.image.split("/").pop().split("\\").pop();
          images.push({
            id: `img_${images.length + 1}`,
            path: card.image,
            filename,
            location: `${node.ar || node.en || node.id} (Card ${cIdx + 1})`,
            type: "card",
            resolvedUrl: null,
          });
        }
      });

      // 3. Check questions
      const questions = node.extra?.questions || [];
      questions.forEach((q, qIdx) => {
        const qImg = q.image || q.ar?.image || q.en?.image;
        if (qImg && typeof qImg === "string" && !seenPaths.has(qImg)) {
          seenPaths.add(qImg);
          const filename = qImg.split("/").pop().split("\\").pop();
          images.push({
            id: `img_${images.length + 1}`,
            path: qImg,
            filename,
            location: `${node.ar || node.en || node.id} (Question ${qIdx + 1})`,
            type: "question",
            resolvedUrl: null,
          });
        }
      });
    });
  });

  return images;
}

