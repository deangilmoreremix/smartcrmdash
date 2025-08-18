// analyzePages.js
// Scans src/pages for .tsx/.jsx/.js files, finds files missing the "Page" suffix,
// detects collisions with existing *Page.* twins, and reports which is newer.

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, 'client', 'src', 'pages');
const exts = ['.tsx', '.jsx', '.js'];

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

function mtime(p) {
  try { return fs.statSync(p).mtimeMs; } catch { return 0; }
}

function fmt(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z');
}

if (!fs.existsSync(PAGES_DIR)) {
  console.error(`❌ src/pages not found at: ${PAGES_DIR}`);
  process.exit(1);
}

const all = listFiles(PAGES_DIR).filter(p => exts.includes(path.extname(p)));

// Find all files with "copy" in the name
const copyFiles = all.filter(p => p.toLowerCase().includes('copy'));
const originalFiles = all.filter(p => !p.toLowerCase().includes('copy'));

console.log('=== DUPLICATE FILES ANALYSIS ===\n');

// Group by base name (without "copy" suffix)
const groups = {};
for (const file of copyFiles) {
  const fileName = path.basename(file);
  const baseName = fileName.replace(/ copy( copy)?\.(tsx|jsx|js)$/, '.$2');
  const originalPath = path.join(path.dirname(file), baseName);
  
  if (!groups[baseName]) {
    groups[baseName] = {
      original: null,
      copies: []
    };
  }
  
  // Check if original exists
  if (fs.existsSync(originalPath)) {
    groups[baseName].original = originalPath;
  }
  
  groups[baseName].copies.push(file);
}

// Analyze each group
for (const [baseName, group] of Object.entries(groups)) {
  console.log(`📄 ${baseName}:`);
  
  const allVersions = [];
  if (group.original) {
    allVersions.push({
      path: group.original,
      type: 'original',
      mtime: mtime(group.original),
      size: fs.statSync(group.original).size
    });
  }
  
  for (const copy of group.copies) {
    allVersions.push({
      path: copy,
      type: 'copy',
      mtime: mtime(copy),
      size: fs.statSync(copy).size
    });
  }
  
  // Sort by modification time (newest first)
  allVersions.sort((a, b) => b.mtime - a.mtime);
  
  for (let i = 0; i < allVersions.length; i++) {
    const version = allVersions[i];
    const isNewest = i === 0;
    const status = isNewest ? '✅ NEWEST' : '❌ older';
    console.log(`  ${status} ${path.relative(PAGES_DIR, version.path)} (${version.size} bytes, ${fmt(version.mtime)})`);
  }
  console.log();
}

console.log(`\nSummary:
- Total page files: ${all.length}
- Files with "copy" in name: ${copyFiles.length}
- Unique base files with duplicates: ${Object.keys(groups).length}
`);