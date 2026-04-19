---
name: smartplayer-release-audit
description: Run the SmartPlayer docs release workflow and summarize release readiness. Use when Codex is preparing a deploy, validating changes to docs, Quick Start, navigation, support content, or the interactive tour, or when the user asks whether the site is safe to publish.
---

# SmartPlayer Release Audit

Run the repo's existing release gates in the right order, interpret failures, and return a publication-ready summary.

## Workflow

1. Confirm scope before running checks.
- Review `git status --short` and changed files.
- Treat changes under `src/components/interactive-tour/`, `static/quickstart-site/`, `docs/generated/`, `src/pages/`, `sidebars.ts`, `docusaurus.config.ts`, and `scripts/` as release-relevant.

2. Pick the right audit depth.
- Use `npm run check:release` for copy, navigation, docs-linking, or docs-only structural changes.
- Use `npm run check:release:full` when the change can affect the interactive tour, screenshots, responsive layout, asset budgets, or production UX.
- If the change is clearly tour-only, it is still fine to run `npm run check:tour` first for fast feedback and then finish with the full release gate.

3. Interpret the result by sub-check.
- `npm run typecheck`: TypeScript safety.
- `npm run build`: Docusaurus build and route generation.
- `npm run check:routes`: smoke-checks `/`, `/interactive-tour/`, `/quickstart/`, `/checklist/`, and `/new-interactive/`.
- `npm run check:assets`: enforces Quick Start asset budget and blocks disallowed screenshot regressions.
- `npm run check:tour`: validates intro, completion, all 9 tour steps, desktop/medium/mobile behavior, popover overlap, and keyboard navigation.

4. Investigate failures at the source.
- Read `scripts/route_smoke_check.cjs` for missing route expectations.
- Read `scripts/quickstart_asset_budget_check.cjs` for asset thresholds and PNG/WebP rules.
- Read `scripts/interactive_tour_qa.cjs` when the failure is viewport, overlap, or keyboard related.
- Do not paper over failures by changing the test unless the product behavior or source of truth truly changed.

5. Close the loop after a passing run.
- If the user asked for publication status, report whether the work is only local, already pushed, or already deployed.
- When the change affects user journeys or process, update the relevant `analysis/*.md` note and the paired `analysis/miro-*.md` or `analysis/figma-*.mmd` artifact.
- Keep the report compact and factual: changed files, checks passed/failed, routes manually verified, deploy status.

## Guardrails

- Treat `/quickstart/` returning `307` as expected because it routes into the standalone Quick Start surface.
- Prefer `npm run check:release:full` before any claim that production behavior is safe.
- If a build or route check fails, do not claim the site is ready even if local pages appear to render.
- If the worktree contains unrelated edits, avoid rolling them back. Work around them and report any risk.
