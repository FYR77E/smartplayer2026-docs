# Interactive Tour Motion & Focus Pass V1

## Focus
- Remove visible jank when moving between tour steps.
- Make focus zones read more clearly across screenshots that already contain legacy red annotations.

## Issues confirmed
- Step transitions triggered several forced viewport realignments in a row.
- The active-step effect ran multiple delayed `ensureActiveStepInView` passes, which made the page feel like it was being pulled more than once after each click.
- The `ResizeObserver` also triggered extra viewport corrections during active steps.
- Some screenshots already contain their own red marks and numbered callouts, so the actual focus zone had to compete with existing visual noise.

## Fixes
- Added a navigation-aware scroll behavior:
  - `smooth` for user-driven next / previous / step-jump
  - `auto` for intro / restart / exit / completion restore
- Replaced recursive, repeated active-step viewport correction with a single navigation-aware alignment pass right after render.
- Stopped `ResizeObserver` from forcing additional scroll realignment during active steps.
- Removed the extra delayed settle re-scroll that could re-trigger movement right after the step already looked stable.
- Added a focus mask over the screenshot so the real active area stays visually dominant.
- Removed the inline "Фокус шага" badge from the highlight box to reduce noise and make the geometry feel cleaner.
- Added position transitions to focus and popover layers to make step changes feel calmer.

## Manual verification
- Desktop scroll trace after `Далее` to step 2 stayed stable from 0ms to 420ms.
- Mobile scroll trace after `Далее` to step 2 stayed stable from 0ms to 420ms.
- Updated viewport screenshots confirmed a calmer handoff and a clearer highlighted area.

## Result
- Step changes no longer produce the same visible multi-pass jump.
- The focus area now reads more clearly on both desktop and mobile, even on screenshots with existing legacy annotations.
