# Interactive Tour Intro & Step Rail Pass V1

## Focus
- Make the entry into the interactive tour feel lighter and less repetitive.
- Clarify the role of the top step chips during the active tour.

## Issues confirmed
- The old intro had duplication between the hero and the intro card: both explained the same idea in slightly different wording.
- The first screen felt denser than necessary before the user even started the tour.
- During the active flow, the step chips worked technically, but they still read a bit like passive progress instead of an intentional navigation control.

## Fixes
- Shortened and simplified the hero headline and supporting copy.
- Replaced the separate hero guide card with compact inline guidance and small fact chips.
- Added a clearer 3-step intro flow: tour → quick start → checklist.
- Clarified the secondary CTA label for the full quick start path.
- Added a short hint under the step rail so users understand they can use the chips for quick navigation.
- Slightly strengthened the current/reached chip states so the top navigation reads more confidently in the active tour.

## Result
- The first screen is calmer and easier to scan.
- The tour now starts with less repeated explanation and a clearer next-step model.
- The top step rail reads more like a real navigation tool during the walkthrough.

## Verification
- `npm run check:tour`
- `npm run check:release:full`
