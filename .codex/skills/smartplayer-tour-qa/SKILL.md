---
name: smartplayer-tour-qa
description: Validate the SmartPlayer interactive tour across breakpoints and interaction states. Use when Codex changes `src/components/interactive-tour/*`, tour screenshots, Quick Start screenshots that feed the tour, tour CTA copy, or when the user asks whether highlight zones and tour behavior are still correct.
---

# SmartPlayer Tour QA

Audit the screenshot-based walkthrough without changing its core concept.

## Workflow

1. Know what counts as tour-sensitive work.
- Treat edits in `src/components/interactive-tour/`, `static/quickstart-site/index.html`, and `static/quickstart-site/image/` as tour-sensitive.
- Remember that the tour depends on screenshot assets and percentage-based highlight zones, so visual changes can break geometry even without TypeScript changes.

2. Run the deterministic check.
- Build first with `npm run build`.
- Run `npm run check:tour`.
- Use the output of `scripts/interactive_tour_qa.cjs` to locate the failing state before making changes.

3. Manually reason about the core states.
- Verify intro state, active state, and completion state.
- Verify all 9 steps: `login`, `dashboard`, `devices`, `add-device`, `content`, `quick-send`, `targets`, `schedule`, `device-card`.
- Verify keyboard behavior: `ArrowRight`, `ArrowLeft`, `Escape`.
- Verify desktop, medium, and mobile fallback behavior.

4. Judge correctness, not just test pass/fail.
- Check that highlight zones point to the element described by the step text.
- Check that desktop and medium popovers do not overlap the highlight zone or clip outside the viewport.
- Check that mobile hides the highlight and popover in favor of readable step details.
- Check that CTA wording still matches the surrounding product terminology: `Пошаговый старт`, `Интерактивный тур`, `Чек-лист перед запуском`.

5. When changing tour geometry or copy.
- Keep `data-tour-*` markers intact unless the QA script is intentionally updated with the product.
- If screenshots change, confirm that the affected step still aligns before updating any baselines or expectations.
- Prefer tightening a highlight zone or refining copy over broadening the highlight to cover uncertainty.

## Guardrails

- Do not reintroduce Driver.js.
- Do not switch to `object-fit: cover`; the tour relies on full screenshot visibility for highlight alignment.
- Do not claim success from a single breakpoint. The tour must hold on desktop, medium, and mobile.
