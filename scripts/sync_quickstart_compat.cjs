const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const staticRoot = path.join(repoRoot, 'static');
const quickstartRoot = path.join(staticRoot, 'quickstart-site');

const fileAliases = [
  ['manual-common.css', 'manual-common.css'],
  ['manual-common.js', 'manual-common.js'],
  ['sw.js', 'sw.js'],
  ['favicon.svg', 'favicon.svg'],
  ['favicon.ico', 'favicon.ico'],
];

function ensureSourceExists(sourcePath) {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Quick Start compatibility source is missing: ${sourcePath}`);
  }
}

function copyFileAlias(sourceRelativePath, targetRelativePath) {
  const sourcePath = path.join(quickstartRoot, sourceRelativePath);
  const targetPath = path.join(staticRoot, targetRelativePath);

  ensureSourceExists(sourcePath);
  fs.mkdirSync(path.dirname(targetPath), {recursive: true});
  fs.copyFileSync(sourcePath, targetPath);
}

function copyDirectoryAlias(sourceRelativePath, targetRelativePath) {
  const sourcePath = path.join(quickstartRoot, sourceRelativePath);
  const targetPath = path.join(staticRoot, targetRelativePath);

  ensureSourceExists(sourcePath);
  fs.rmSync(targetPath, {recursive: true, force: true});
  fs.mkdirSync(path.dirname(targetPath), {recursive: true});
  fs.cpSync(sourcePath, targetPath, {recursive: true});
}

function main() {
  ensureSourceExists(quickstartRoot);

  for (const [sourceRelativePath, targetRelativePath] of fileAliases) {
    copyFileAlias(sourceRelativePath, targetRelativePath);
  }

  copyDirectoryAlias('image', 'image');

  console.log('Synced Quick Start compatibility assets into static root.');
}

main();
