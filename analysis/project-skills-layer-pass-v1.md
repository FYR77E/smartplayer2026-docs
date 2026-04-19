# Project Skills Layer Pass V1

## Goal

Add real, versioned SmartPlayer project skills so the repo has a reusable process layer in addition to scripts and manual roadmap notes.

## Decision

Store project skills inside the repository at `.codex/skills/`.

Why:
- the skills are specific to SmartPlayer docs workflows
- they should travel with the repository in GitHub
- the team can review and evolve them together with scripts and process notes

## Skills added

### `smartplayer-release-audit`
- wraps the current release workflow around the existing repo checks
- tells Codex when to use `check:release` vs `check:release:full`
- points failures back to the owning scripts
- enforces concise release reporting

### `smartplayer-tour-qa`
- defines the tour-sensitive files and screenshots
- anchors the 9-step walkthrough as source of truth
- reinforces breakpoint, overlap, and keyboard checks
- protects the screenshot-tour concept

### `smartplayer-docs-discoverability`
- treats home, Quick Start, interactive tour, checklist, and docs as one system
- stabilizes terminology and next-step logic
- reinforces small, product-minded copy and cross-link fixes
- keeps Miro/Figma tracking tied to IA changes

## Validation

Attempted:
- `python3 /Users/misaferrari/.codex/skills/.system/skill-creator/scripts/quick_validate.py ...`

Blocked by environment:
- local Python does not have `PyYAML`, so the bundled validator cannot run as-is

Fallback validation completed:
- checked all 3 `SKILL.md` files for valid frontmatter blocks
- confirmed exact skill names match folder names
- confirmed no `[TODO]` placeholders remain
- confirmed each skill has `agents/openai.yaml`

## Result

The repo now has a first real project-skills layer, and it matches the quality-gate/process system already added earlier.
