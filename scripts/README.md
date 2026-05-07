# `scripts/` — release and import tooling

This folder contains checks and utilities for keeping the legacy/current docs stable.

## Important Scripts

- `sync_quickstart_compat.cjs` — syncs Quick Start compatibility assets before start/build.
- `quickstart_asset_budget_check.cjs` — checks quickstart asset budget.
- `route_smoke_check.cjs` — checks key routes.
- `interactive_tour_qa.cjs` — Playwright-based tour QA.
- `import_manual_docx.py` — imports manual DOCX content.
- `optimize_quickstart_assets.py` — optimizes quickstart assets.

## Commands

```bash
npm run check:release
npm run check:release:full
```

Use `check:release:full` when changing tour, quickstart assets, screenshots, or route structure.

## Agent Rule

If a script changes, update this README and run the smallest relevant check plus `npm run typecheck`.
