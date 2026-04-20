# Interactive Tour Visual Route Pass V1

## Focus
- Final manual visual pass for the full `interactive-tour` route:
  - intro
  - active steps
  - completion
- Priority: mobile viewport behavior after start and after completion.

## What was checked
- Desktop, medium and mobile screenshots for:
  - intro
  - login
  - schedule
  - completion
- Viewport-specific mobile screenshots for:
  - first step after start
  - schedule
  - completion

## Real issues found
- On mobile, the first active step started too low in the viewport, leaving too much previous hero context above the tour shell.
- On mobile, completion state could open mid-card instead of returning the user to the top of the finished tour shell.
- On desktop, the `schedule` popover was clipped below the viewport by 6 px in the QA flow.

## Fixes
- Added breakpoint-aware top alignment for the tour shell:
  - mobile: tighter top snap
  - medium: moderate top offset
  - desktop: slightly higher shell alignment than before
- Added explicit completion-state realignment so the finished tour lands at the top of the shell after the final step.
- Verified and corrected the desktop `schedule` step by shifting the shell high enough to keep the popover inside the viewport.

## Result
- Mobile start state is cleaner and no longer drops the user into the route with obvious leftover context above the tour shell.
- Mobile completion state now opens from the top of the completed route rather than mid-card.
- `check:tour` and `check:release:full` pass again after the visual-route fixes.
