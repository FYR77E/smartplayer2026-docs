const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const buildRoot = path.join(repoRoot, 'build');

const routeChecks = [
  {
    route: '/',
    file: 'index.html',
    includes: ['SmartPlayer — Документация', '/quickstart/', '/interactive-tour/', '/checklist/'],
  },
  {
    route: '/interactive-tour/',
    file: 'interactive-tour/index.html',
    includes: ['Интерактивный визуальный тур по Quick Start', 'keycap_', '/quickstart/', '/checklist/'],
  },
  {
    route: '/quickstart/',
    file: 'quickstart/index.html',
    includes: ['Быстрый старт', '/quickstart-site/index.html'],
  },
  {
    route: '/checklist/',
    file: 'checklist/index.html',
    includes: ['Чек-лист запуска SmartPlayer', '/generated/17-13-чек-лист-запуска'],
  },
  {
    route: '/new-interactive/',
    file: 'new-interactive/index.html',
    includes: ['Интерактивный тур SmartPlayer', '/interactive-tour'],
  },
];

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`OK   ${message}`);
}

if (!fs.existsSync(buildRoot)) {
  console.error('Build output is missing. Run `npm run build` before `npm run check:routes`.');
  process.exit(1);
}

for (const check of routeChecks) {
  const filePath = path.join(buildRoot, check.file);

  if (!fs.existsSync(filePath)) {
    fail(`${check.route} -> missing file ${check.file}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const missingPatterns = check.includes.filter((pattern) => !html.includes(pattern));

  if (missingPatterns.length > 0) {
    fail(`${check.route} -> missing patterns: ${missingPatterns.join(', ')}`);
    continue;
  }

  pass(`${check.route} -> ${check.file}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Route smoke check passed.');
