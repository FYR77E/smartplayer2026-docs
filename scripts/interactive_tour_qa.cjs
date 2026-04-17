const fs = require('fs');
const http = require('http');
const path = require('path');

let playwright;
try {
  playwright = require('playwright');
} catch (error) {
  console.error('Playwright is required for tour QA. Run via `npm exec --yes --package=playwright -- node scripts/interactive_tour_qa.cjs`.');
  process.exit(1);
}

const {chromium} = playwright;

const repoRoot = path.resolve(__dirname, '..');
const buildRoot = path.join(repoRoot, 'build');

const expectedSteps = [
  'login',
  'dashboard',
  'devices',
  'add-device',
  'content',
  'quick-send',
  'targets',
  'schedule',
  'device-card',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findFile(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const requestedPath = cleanPath === '/' ? '/index.html' : cleanPath;
  const exactPath = path.join(buildRoot, requestedPath.replace(/^\//, ''));

  if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
    return exactPath;
  }

  const withIndexPath = path.join(buildRoot, requestedPath.replace(/^\//, ''), 'index.html');
  if (fs.existsSync(withIndexPath)) {
    return withIndexPath;
  }

  if (!path.extname(requestedPath)) {
    const htmlPath = path.join(buildRoot, `${requestedPath.replace(/^\//, '')}.html`);
    if (fs.existsSync(htmlPath)) {
      return htmlPath;
    }
  }

  return null;
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.ico':
      return 'image/x-icon';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
}

async function createServer() {
  if (!fs.existsSync(buildRoot)) {
    throw new Error('Build output is missing. Run `npm run build` before `npm run check:tour`.');
  }

  const server = http.createServer((request, response) => {
    const filePath = findFile(request.url || '/');
    if (!filePath) {
      response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
      response.end('Not found');
      return;
    }

    response.writeHead(200, {'Content-Type': contentType(filePath)});
    fs.createReadStream(filePath).pipe(response);
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

function overlapArea(first, second) {
  const overlapWidth = Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left));
  const overlapHeight = Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));
  return overlapWidth * overlapHeight;
}

async function waitForStep(page, stepId) {
  await page.locator(`[data-tour-step-id="${stepId}"]`).waitFor();
}

async function waitForLayoutReady(page, mobile = false) {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.waitForFunction(
        ({isMobile}) => {
          const active = document.querySelector('[data-tour-state="active"]');
          if (!active) {
            return true;
          }

          if (isMobile) {
            const details = document.querySelector('[data-tour-mobile-details="true"]');
            if (!details) {
              return false;
            }
            const rect = details.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerHeight + 4;
          }

          const popover = document.querySelector('[data-tour-popover="true"]');
          const highlight = document.querySelector('[data-tour-highlight="true"]');
          if (!popover) {
            return false;
          }

          const rect = popover.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > window.innerHeight + 4) {
            return false;
          }

          if (!highlight) {
            return false;
          }

          const zoneRect = highlight.getBoundingClientRect();
          const overlapWidth = Math.max(0, Math.min(rect.right, zoneRect.right) - Math.max(rect.left, zoneRect.left));
          const overlapHeight = Math.max(0, Math.min(rect.bottom, zoneRect.bottom) - Math.max(rect.top, zoneRect.top));
          return overlapWidth * overlapHeight === 0;
        },
        {isMobile: mobile},
        {timeout: 4000},
      );
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(300);
    }
  }

  throw lastError;
}

async function clickVisibleAction(page, action) {
  const buttons = page.locator(`[data-tour-action="${action}"]:visible`);
  await buttons.first().click();
}

async function expectDesktopOrMediumState(page, stepId) {
  await waitForStep(page, stepId);
  await waitForLayoutReady(page, false);

  const popover = page.locator('[data-tour-popover="true"]');
  const highlight = page.locator('[data-tour-highlight="true"]');
  const mobileDetails = page.locator('[data-tour-mobile-details="true"]');

  await popover.waitFor();
  await highlight.waitFor();
  assert(await popover.isVisible(), `Popover should be visible for step ${stepId}`);
  assert(await highlight.isVisible(), `Highlight should be visible for step ${stepId}`);
  assert(!(await mobileDetails.isVisible()), `Mobile details should be hidden for step ${stepId}`);

  const [popoverBox, highlightBox, viewport] = await Promise.all([
    popover.boundingBox(),
    highlight.boundingBox(),
    page.evaluate(() => ({width: window.innerWidth, height: window.innerHeight, scrollY: window.scrollY})),
  ]);

  assert(popoverBox, `Popover box missing for step ${stepId}`);
  assert(highlightBox, `Highlight box missing for step ${stepId}`);

  const overlap = overlapArea(
    {
      left: popoverBox.x,
      right: popoverBox.x + popoverBox.width,
      top: popoverBox.y,
      bottom: popoverBox.y + popoverBox.height,
    },
    {
      left: highlightBox.x,
      right: highlightBox.x + highlightBox.width,
      top: highlightBox.y,
      bottom: highlightBox.y + highlightBox.height,
    },
  );

  assert(overlap === 0, `Popover overlaps highlight on step ${stepId}`);
  assert(popoverBox.y >= 0, `Popover is clipped above viewport on step ${stepId}`);
  assert(popoverBox.y + popoverBox.height <= viewport.height + 4, `Popover is clipped below viewport on step ${stepId}`);
}

async function expectMobileState(page, stepId) {
  await waitForStep(page, stepId);
  await waitForLayoutReady(page, true);

  const popover = page.locator('[data-tour-popover="true"]');
  const highlight = page.locator('[data-tour-highlight="true"]');
  const mobileDetails = page.locator('[data-tour-mobile-details="true"]');

  assert(!(await popover.isVisible()), `Popover should be hidden on mobile for step ${stepId}`);
  assert(!(await highlight.isVisible()), `Highlight should be hidden on mobile for step ${stepId}`);
  assert(await mobileDetails.isVisible(), `Mobile details should be visible on mobile for step ${stepId}`);

  const ariaLive = await mobileDetails.getAttribute('aria-live');
  assert(ariaLive === 'polite', 'Mobile details must announce step changes with aria-live="polite"');
}

async function runDesktopChecks(baseUrl) {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}});

  await page.goto(`${baseUrl}/interactive-tour/`, {waitUntil: 'networkidle'});
  await page.locator('[data-tour-state="intro"]').waitFor();
  await page.locator('[data-tour-action="start"]').click();

  await expectDesktopOrMediumState(page, expectedSteps[0]);

  await page.keyboard.press('ArrowRight');
  await expectDesktopOrMediumState(page, expectedSteps[1]);

  await page.keyboard.press('ArrowLeft');
  await expectDesktopOrMediumState(page, expectedSteps[0]);

  await page.keyboard.press('Escape');
  await page.locator('[data-tour-state="intro"]').waitFor();

  await page.locator('[data-tour-action="start"]').click();
  for (const stepId of expectedSteps) {
    await expectDesktopOrMediumState(page, stepId);
    if (stepId !== expectedSteps[expectedSteps.length - 1]) {
      await clickVisibleAction(page, 'next');
    }
  }

  await clickVisibleAction(page, 'next');
  await page.locator('[data-tour-state="complete"]').waitFor();

  await browser.close();
}

async function runMediumChecks(baseUrl) {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage({viewport: {width: 1024, height: 900}});

  await page.goto(`${baseUrl}/interactive-tour/`, {waitUntil: 'networkidle'});
  await page.locator('[data-tour-action="start"]').click();

  for (const stepId of expectedSteps) {
    await expectDesktopOrMediumState(page, stepId);
    const viewport = await page.evaluate(() => ({height: window.innerHeight, scrollY: window.scrollY}));
    const popoverBox = await page.locator('[data-tour-popover="true"]').boundingBox();
    assert(popoverBox && popoverBox.y + popoverBox.height <= viewport.height + 4, `Medium layout overflow on step ${stepId}`);

    if (stepId !== expectedSteps[expectedSteps.length - 1]) {
      await clickVisibleAction(page, 'next');
    }
  }

  await browser.close();
}

async function runMobileChecks(baseUrl) {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});

  await page.goto(`${baseUrl}/interactive-tour/`, {waitUntil: 'networkidle'});
  await page.locator('[data-tour-action="start"]').click();

  await expectMobileState(page, expectedSteps[0]);
  await clickVisibleAction(page, 'next');
  await expectMobileState(page, expectedSteps[1]);
  await clickVisibleAction(page, 'previous');
  await expectMobileState(page, expectedSteps[0]);

  await browser.close();
}

async function main() {
  const {server, baseUrl} = await createServer();

  try {
    await runDesktopChecks(baseUrl);
    console.log('OK   Desktop interactive-tour flow');

    await runMediumChecks(baseUrl);
    console.log('OK   Medium interactive-tour flow');

    await runMobileChecks(baseUrl);
    console.log('OK   Mobile interactive-tour flow');

    console.log('Interactive-tour QA passed.');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
