# Interactive Tour Zone Calibration Pass V1

## Focus
- Re-check all 9 interactive-tour steps after the motion pass.
- Tighten highlight geometry where the described focus was broader or noisier than needed.
- Reduce distraction from legacy red annotations already baked into source screenshots.

## Findings
- The main source of "wrong focus" perception is not only geometry. Several source screenshots already contain legacy red outlines and numbered callouts, so users can perceive multiple competing focus points at once.
- `dashboard` highlighted too much of the sidebar and visually pulled attention into lower utility items that were not mentioned in the copy.
- `quick-send` highlighted the whole right side too broadly; the actual library panel can be framed tighter.
- `schedule` copy described both time settings and publication priority, but the visible highlight was mainly centered on the date/time block.

## Fixes
- Tightened the `dashboard` zone so the step now frames the main navigation area instead of most of the full sidebar height.
- Tightened the `quick-send` zone to the real asset-library panel on the right.
- Updated the `schedule` copy so it matches the highlighted block precisely.
- Increased the screenshot dim outside the active area to suppress legacy callouts and make the active zone read more clearly.

## Verification
- `npm run check:tour`
- `npm run check:release:full`
- Manual screenshot pass on desktop and mobile contact sheets.
