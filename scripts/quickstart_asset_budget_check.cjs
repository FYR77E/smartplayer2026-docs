const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(repoRoot, 'static', 'quickstart-site', 'index.html');
const imageRoot = path.join(repoRoot, 'static', 'quickstart-site', 'image');

const MAX_TOTAL_REFERENCED_BYTES = 1_600 * 1024;
const MAX_SINGLE_REFERENCED_BYTES = 160 * 1024;
const ALLOWED_PNG_REFS = new Set(['image/png/Лого SP.png']);
const ATTR_PATTERNS = {
  src: /src="([^"]+)"/g,
  'data-src': /data-src="([^"]+)"/g,
  href: /href="([^"]+)"/g,
  content: /content="([^"]+)"/g,
  srcset: /srcset="([^"]+)"/g,
};

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`OK   ${message}`);
}

function normalizeRef(value) {
  const decoded = decodeURIComponent(value);
  const imageIndex = decoded.indexOf('image/');
  if (imageIndex === -1) {
    return null;
  }
  return decoded.slice(imageIndex).normalize('NFC');
}

function collectRefs(html, attr) {
  const refs = [];
  const pattern = ATTR_PATTERNS[attr];
  let match;

  while ((match = pattern.exec(html))) {
    if (attr === 'srcset') {
      const candidates = match[1]
        .split(',')
        .map((entry) => entry.trim().split(/\s+/)[0])
        .map(normalizeRef)
        .filter(Boolean);
      refs.push(...candidates);
      continue;
    }

    const normalized = normalizeRef(match[1]);
    if (normalized) {
      refs.push(normalized);
    }
  }

  return refs;
}

function relativeImageFiles(root) {
  return fs
    .readdirSync(root, {recursive: true, withFileTypes: true})
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const absolutePath = path.join(entry.parentPath, entry.name);
      const relativePath = path.relative(path.join(root, '..'), absolutePath).split(path.sep).join('/').normalize('NFC');
      return relativePath;
    })
    .sort();
}

if (!fs.existsSync(htmlPath)) {
  console.error(`Quick Start HTML is missing: ${htmlPath}`);
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const usedRefs = new Set();

for (const attr of Object.keys(ATTR_PATTERNS)) {
  for (const ref of collectRefs(html, attr)) {
    usedRefs.add(ref);
  }
}

const missingRefs = [];
const referencedFiles = [];
for (const ref of [...usedRefs].sort()) {
  const absolutePath = path.join(path.dirname(htmlPath), ref);
  if (!fs.existsSync(absolutePath)) {
    missingRefs.push(ref);
    continue;
  }
  referencedFiles.push({
    ref,
    absolutePath,
    bytes: fs.statSync(absolutePath).size,
  });
}

if (missingRefs.length) {
  fail(`Missing referenced assets: ${missingRefs.join(', ')}`);
}

const disallowedPngRefs = referencedFiles
  .filter(({ref}) => ref.toLowerCase().endsWith('.png') && !ALLOWED_PNG_REFS.has(ref))
  .map(({ref}) => ref);

if (disallowedPngRefs.length) {
  fail(`Disallowed PNG references in Quick Start HTML: ${disallowedPngRefs.join(', ')}`);
} else {
  pass('No disallowed display PNG references');
}

const oversizedRefs = referencedFiles
  .filter(({bytes}) => bytes > MAX_SINGLE_REFERENCED_BYTES)
  .sort((a, b) => b.bytes - a.bytes);

if (oversizedRefs.length) {
  fail(
    `Referenced assets exceed ${Math.round(MAX_SINGLE_REFERENCED_BYTES / 1024)} KB: ${oversizedRefs
      .map(({ref, bytes}) => `${ref} (${(bytes / 1024).toFixed(1)} KB)`)
      .join(', ')}`,
  );
} else {
  pass(`Every referenced asset is within ${Math.round(MAX_SINGLE_REFERENCED_BYTES / 1024)} KB`);
}

const totalReferencedBytes = referencedFiles.reduce((sum, file) => sum + file.bytes, 0);
if (totalReferencedBytes > MAX_TOTAL_REFERENCED_BYTES) {
  fail(
    `Total referenced Quick Start assets are ${(totalReferencedBytes / 1024).toFixed(1)} KB, budget is ${(
      MAX_TOTAL_REFERENCED_BYTES / 1024
    ).toFixed(0)} KB`,
  );
} else {
  pass(
    `Total referenced Quick Start assets ${(totalReferencedBytes / 1024).toFixed(1)} KB / ${(
      MAX_TOTAL_REFERENCED_BYTES / 1024
    ).toFixed(0)} KB`,
  );
}

const orphanedPngsWithWebpTwin = relativeImageFiles(imageRoot)
  .filter((ref) => ref.toLowerCase().endsWith('.png'))
  .filter((ref) => !usedRefs.has(ref))
  .filter((ref) => fs.existsSync(path.join(path.dirname(htmlPath), ref.replace(/\.png$/i, '.webp'))));

if (orphanedPngsWithWebpTwin.length) {
  fail(`Unused PNG screenshots with WebP twins should be removed: ${orphanedPngsWithWebpTwin.join(', ')}`);
} else {
  pass('No orphaned PNG screenshots with WebP twins');
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Quick Start asset budget check passed.');
