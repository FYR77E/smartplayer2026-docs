# Interactive Tour Step Context Pass V1

## Goal

Reduce the chance that users lose context inside the interactive tour after the intro screen.

## Real issue

The tour had a progress bar and the current step title, but no quick way to understand the full step sequence once the walkthrough was active.

Impact:
- users had weak context for where they were inside the 9-step route
- revisiting a specific step required repeated next/previous clicks
- on mobile and medium widths the tour remained stable, but the mental map of the flow was still thin

## Change made

Added a compact step rail directly under the progress bar.

Behavior:
- shows all 9 steps in order
- highlights the current step
- shows which steps are already passed
- allows direct jump to any active step without leaving the tour
- stays horizontally scrollable on narrow screens instead of breaking layout

## Why this is safe

- the screenshot-tour concept is unchanged
- no route logic changed
- no screenshot geometry changed
- the new control sits outside the image area, so highlight zones remain unaffected

## Validation

- `npm run check:tour` passed
- `npm run typecheck` passed
- `npm run build` passed

## Follow-up

- Intro-state density reduced without changing the walkthrough concept
- Progress header and step rail now appear only after the tour starts
- Intro CTA hierarchy is cleaner: start the tour first, then use Quick Start, then checklist
