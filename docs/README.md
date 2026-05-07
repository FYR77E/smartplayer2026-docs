# `docs/` — legacy/current documentation content

This folder is the Docusaurus content layer for the legacy/current SmartPlayer docs site. README files are excluded from Docusaurus docs build and exist only as agent navigation.

## Start Here

- `generated/` — imported/generated manual chapters and source-of-truth for v4 coverage.
- `guides/` — task-oriented guide pages.
- `operations/` — launch and operational procedures.
- `admin/` — administration topics.
- `archive/` — legacy content that should not be treated as current product scope without recheck.
- `sidebars.ts` — navigation structure.

## When Working Here

- Preserve generated/manual facts unless there is a confirmed source update.
- If a v4 page changes because of this repo, update `_meta/wiki/docs-v3-v4-coverage.md`.
- For route or quickstart-sensitive changes, run release checks from `scripts/README.md`.

## Good Agent Flow

1. Find source section in `docs/generated/`.
2. Check if there is a newer task-oriented page.
3. Compare against `../smartplayer-docs-v4/docs/` if migration is involved.
4. Record durable conclusions in `_meta/outputs/` or `_meta/wiki/`.
