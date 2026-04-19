---
name: smartplayer-docs-discoverability
description: Review SmartPlayer docs wayfinding, terminology, and next-step logic across the docs shell. Use when Codex changes home navigation, sidebars, cross-links, Quick Start, checklist, troubleshooting, or when the user asks whether the documentation still feels like one coherent platform.
---

# SmartPlayer Docs Discoverability

Keep the docs platform coherent so users can tell where to start, where to go next, and which surface is canonical.

## Workflow

1. Audit the core surfaces as one system.
- Check `/` as the dispatcher.
- Check `/quickstart/` as the linear first-run path.
- Check `/interactive-tour/` as the visual overview.
- Check `/checklist/` as the pre-launch gate.
- Check `/generated/быстрый-старт` and related docs pages as reference material inside the full manual.

2. Keep terminology stable.
- Prefer the current product labels: `Пошаговый старт`, `Интерактивный тур`, `Чек-лист перед запуском`, `Полное руководство`.
- Remove internal or overly technical language that leaks implementation details unless the user explicitly wants it.
- Watch for duplicate names that make two different entry points sound identical.

3. Validate wayfinding after edits.
- Run `npm run build` and `npm run check:routes`.
- Use `rg` to trace labels or routes across `src/`, `docs/`, `static/quickstart-site/`, `sidebars.ts`, and `docusaurus.config.ts`.
- Check that each major page answers `what is this`, `when should I use it`, and `where do I go next`.

4. Fix the smallest thing that restores clarity.
- Prefer small CTA, heading, callout, and related-material edits over broad rewrites.
- Add or refine `Куда идти дальше` / `Связанные материалы` blocks when a long page otherwise dead-ends.
- When a support or troubleshooting path changes, mirror the update across home, Quick Start, and the relevant generated docs page.

5. Update tracking when the information architecture changes.
- Add or update an `analysis/*pass*.md` note for the change.
- Add the paired `analysis/miro-*.md` template and `analysis/figma-*.mmd` artifact when the step is significant enough to track in the roadmap.
- In final reports, name the exact routes checked and the terminology decisions made.

## Guardrails

- Do not turn the docs into a marketing landing page.
- Do not invent a new concept for Quick Start or the interactive tour.
- Do not collapse all entry points into one; each surface has a distinct job.
