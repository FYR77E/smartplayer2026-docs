# Interactive Tour Visual Cleanup Pass V1

## Focus
- Reduce noise from legacy callouts baked into source screenshots without destructively editing the source image files.
- Make the active area look cleaner and more intentional across desktop and mobile.

## Problem confirmed
- Several source screenshots still contain old red outlines, numbered circles and extra visual accents.
- Even with corrected highlight geometry, users can still perceive conflicting focus points outside the active zone.

## Fix approach
- Kept the original screenshot assets intact.
- Added a non-destructive cleanup layer inside the tour:
  - the full screenshot is rendered in a muted state
  - the active zone is rendered again as a crisp focused window
  - the outer area remains dimmed so the user's eye stays on the live step target

## Result
- The active area reads cleaner without touching the source assets.
- Legacy annotations outside the active zone are visually de-emphasized.
- The step experience feels closer to a guided walkthrough than a reused annotated manual screenshot.

## Verification
- `npm run check:tour`
- `npm run check:release:full`
- manual desktop/mobile screenshot pass on noisy steps (`dashboard`, `devices`, `quick-send`, `schedule`)
