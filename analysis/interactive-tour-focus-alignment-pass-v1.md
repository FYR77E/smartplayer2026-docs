# Interactive Tour Focus Alignment Pass V1

## Focus
- Improve geometric accuracy of the highlighted area after the visual cleanup pass.
- Remove the slight "uneven" feel caused by the previous focus-window rendering method.

## Problem confirmed
- The first visual cleanup pass reduced screenshot noise, but the focus window was rendered via a nested image scaled separately inside the target box.
- That approach could feel slightly uneven on some steps because the crop was visually close, but not mathematically identical to the base screenshot positioning.

## Fix
- Replaced the nested-image focus window with a background-based crop.
- The active focus window now uses computed `background-size` and `background-position` from the same source screenshot.
- This keeps the focused crop aligned more precisely to the base image while preserving the non-destructive cleanup approach.
- Slightly tightened the focus-window radius to make the frame feel cleaner.

## Result
- The active area reads more evenly.
- Focus framing feels less skewed on narrow and right-aligned zones.
- Screenshot cleanup remains non-destructive and compatible with current assets.

## Verification
- `npm run check:tour`
- `npm run check:release:full`
