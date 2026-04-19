# Miro Template — Project Skills Layer V1

## Frame 1 — Why Skills
- Scripts already existed, but reusable agent workflows were not yet captured
- Team needed versioned process knowledge inside the repo
- Goal: make release, tour QA, and discoverability repeatable

## Frame 2 — Skill Placement
- Location: `.codex/skills/`
- Reason: project-specific, reviewable, shipped with GitHub history
- Benefit: skills evolve with docs architecture and quality gates

## Frame 3 — Skill 1
- `smartplayer-release-audit`
- Uses release gates in the correct order
- Distinguishes `check:release` and `check:release:full`
- Improves publish-readiness summaries

## Frame 4 — Skill 2
- `smartplayer-tour-qa`
- Protects screenshot-tour concept
- Keeps 9-step flow explicit
- Anchors breakpoint and overlap checks

## Frame 5 — Skill 3
- `smartplayer-docs-discoverability`
- Treats docs surfaces as one product
- Stabilizes terminology
- Reinforces next-step logic and cross-link consistency

## Frame 6 — Validation And Next Step
- Bundled validator blocked by missing `PyYAML`
- Manual structural validation completed
- Next step: use these skills in the next SmartPlayer iteration
