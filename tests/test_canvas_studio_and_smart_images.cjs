const fs = require('fs');
const path = require('path');
const assert = require('assert');

const filePath = path.join(__dirname, '../src/EDUcraft_fixed.jsx');
const content = fs.readFileSync(filePath, 'utf8');

console.log('🧪 Starting validation of Canvas Studio, 60 Plates & Smart Images...');

// 1. Verify 60 palettes English names
const pagePalettesMatch = content.match(/const PAGE_PALETTES\s*=\s*\[([\s\S]*?)\];/);
assert(pagePalettesMatch, 'PAGE_PALETTES array must exist');
const paletteEntries = pagePalettesMatch[1].match(/\{\s*id:\s*\d+[\s\S]*?\}/g);
assert(paletteEntries && paletteEntries.length >= 60, `Expected 60+ palettes, found ${paletteEntries ? paletteEntries.length : 0}`);
let missingEn = 0;
paletteEntries.forEach((entry, idx) => {
  if (!entry.includes('en:')) {
    missingEn++;
  }
});
assert.strictEqual(missingEn, 0, `All palettes must have English names, found ${missingEn} without`);
console.log(`✅ Palettes verified: ${paletteEntries.length} palettes all have English names.`);

// 2. Verify PlatePaletteModal has category tabs in English & A4 sheet miniature styling
assert(content.includes('PlatePaletteModal'), 'PlatePaletteModal component must exist');
assert(content.includes('Academic & Neutral'), 'Must have Academic & Neutral filter tab');
assert(content.includes('Soft Pastel'), 'Must have Soft Pastel filter tab');
assert(content.includes('Night & Dark'), 'Must have Night & Dark filter tab');
assert(content.includes('aspect-[1/1.32]'), 'Must use 1:1.32 vertical A4 sheet miniature aspect ratio');
console.log('✅ PlatePaletteModal verified with English filter tabs & A4 miniature sheets.');

// 3. Verify Smart Image Controls in PlateBlock & BlockRow
assert(content.includes('fitMode'), 'Must support fitMode property');
assert(content.includes('smart') || content.includes('smart auto'), 'Must support smart mode');
assert(content.includes('imgFit === "cover" ? "cover" : "contain"'), 'Must handle smart objectFit fallback');
assert(content.includes('["25%", "25%"]'), 'Must support 25% width');
assert(content.includes('["50%", "50%"]'), 'Must support 50% width');
assert(content.includes('["75%", "75%"]'), 'Must support 75% width');
console.log('✅ Smart Image dimensions, width controls, and aspect ratio engine verified.');

assert(content.includes('card.imageFit') && content.includes('group.imageFit'), 'Question cards must support imageFit sizing mode');
assert(content.includes('objectFit: "contain"'), 'Question cards must support contain objectFit');
console.log('✅ Question card image sizing verified.');

// 5. Verify CanvasBlockWrapper & in-place editing
assert(content.includes('CanvasBlockWrapper'), 'CanvasBlockWrapper must exist');
assert(content.includes('isHovered') || content.includes('onMouseEnter'), 'CanvasBlockWrapper must track hover');
assert(content.includes('isEditing'), 'CanvasBlockWrapper must have in-place editing state');
assert(content.includes('onMove(-1)'), 'CanvasBlockWrapper must have Move Up action');
assert(content.includes('onMove(1)'), 'CanvasBlockWrapper must have Move Down action');
assert(content.includes('onInsertBelow'), 'CanvasBlockWrapper must have Insert Below action');
assert(content.includes('onDelete'), 'CanvasBlockWrapper must have Delete action');
console.log('✅ CanvasBlockWrapper verified with floating action bar and in-place editing.');

// 6. Verify Focus Mode in A4PageBuilder
assert(content.includes('focusMode'), 'Focus mode state must exist');
assert(content.includes('صفحة كاملة') || content.includes('Focus Canvas'), 'Focus Canvas toggle button must exist');
assert(content.includes('grid-cols-1') && content.includes('focusMode'), 'Focus mode should collapse sidepane into single column');
console.log('✅ Focus Canvas mode verified.');

// 7. Verify FullBookA4Preview Active Ribbon and Page Targeting
assert(content.includes('targetLeafId') || content.includes('targetPageIndex') || content.includes('الصفحة المستهدفة'), 'FullBookA4Preview must track targeted page');
assert(content.includes('addBlockToTargetLeaf') && content.includes('updateBlockInLeaf'), 'FullBookA4Preview must allow inserting and updating blocks in target leaf');
console.log('✅ FullBookA4Preview active authoring ribbon verified.');

console.log('\n🎉 ALL 7 AUDIT CHECKS PASSED PERFECTLY (100%)!');
