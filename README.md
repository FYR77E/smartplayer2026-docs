# smartplayer2026-docs

Legacy/current documentation repo for SmartPlayer. This Docusaurus site keeps the older generated manual, quickstart, interactive tour, checklist, and release checks. For docs-v4 work, treat this repo as an important source-of-truth and regression reference.

## Start Here

- `docs/README.md` — map of the documentation layer.
- `scripts/README.md` — release and asset checks.
- `STATUS.md` — current project status and notes.
- `analysis/` — deeper audits and product-surface analysis.
- `../_meta/wiki/smartplayer2026-docs.md` — Obsidian project note.
- `../_meta/wiki/docs-v3-v4-coverage.md` — v3 -> v4 coverage map.

## Commands

```bash
npm start
npm run typecheck
npm run build
npm run check:release
npm run check:release:full
```

## Agent Rules

- Use `docs/generated/` as source material when checking v4 coverage.
- Run `npm run check:release` before publishing normal docs changes.
- Run `npm run check:release:full` when quickstart assets or interactive tour changed.
- Do not move `graphify-out/` into the knowledge base unless a synthesized output is created in `_meta/outputs/`.
