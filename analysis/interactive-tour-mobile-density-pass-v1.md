# Interactive Tour Mobile Density Pass V1

## Focus
- Make the mobile version of the interactive tour easier to scan.
- Reduce visual density without changing the walkthrough logic.

## Issues confirmed
- Mobile screens still felt denser than necessary because several desktop-oriented patterns carried over almost unchanged.
- The first screen, step rail, active step details, and completion state all used slightly generous spacing for a small viewport.
- During active steps, the footer links added duplicate navigation weight below the main action stack on mobile.

## Fixes
- Tightened mobile spacing across hero, shell, progress header, step chips, image frame, mobile details, intro card, and completion card.
- Reduced type size and padding where the previous rhythm felt too large for a narrow viewport.
- Made the hero facts stack more cleanly and shortened their visual footprint.
- Reduced the visual weight of the top step rail on mobile while preserving quick navigation.
- Hid the active-step footer links on mobile to remove duplicated secondary navigation below the main tour controls.
- Kept the core flow intact: step rail, prev/next, exit, quick start handoff, checklist handoff.

## Result
- The mobile tour reads more calmly.
- There is less repeated UI weight around the main action area.
- The active step on mobile now feels more like a guided reading flow than a stacked control panel.

## Verification
- `npm run check:tour`
- `npm run check:release:full`
