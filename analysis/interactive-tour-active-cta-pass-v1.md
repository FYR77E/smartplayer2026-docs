# Interactive Tour Active CTA Pass V1

## Focus
- Reduce CTA competition inside active tour steps.
- Make the active step behave more like a guided walkthrough and less like a mini control panel.

## Issues confirmed
- The active popover had three equally button-like actions in one cluster: previous, next, exit.
- On the first step, the disabled previous button still occupied visual weight.
- The desktop footer repeated next-destination links in a button style, which added noise during the active walkthrough.

## Fixes
- Hid the previous button on the first step instead of showing it disabled.
- Changed the final step primary label from a generic next action to `Завершить тур`.
- Demoted `Выйти из тура` from a full secondary button to an inline support action.
- Replaced the desktop footer button row with a lighter inline handoff hint to quick start and checklist.

## Result
- The active step has a clearer hierarchy.
- The main action is more obvious.
- The tour feels less cluttered while keeping the same navigation logic.

## Verification
- `npm run check:release:full`
- `npm run check:tour`
