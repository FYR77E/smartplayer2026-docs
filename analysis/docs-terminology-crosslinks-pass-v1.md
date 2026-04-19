# Docs Terminology & Cross-Links Pass V1

## Scope
- Docs shell
- Home entry points
- Checklist redirect page
- Core onboarding docs pages

## Real Issues Found
1. Home and docs pages still mixed old and new labels:
   - `Быстрый старт`
   - `Пошаговый быстрый старт`
   - `Чек-лист запуска`
   - `Чек-лист перед запуском`
2. Several onboarding callouts still used technical or mixed-language wording:
   - `Interactive Tour`
   - `reference-раздел`
   - `launch gate`
   - `rollout`
3. Related links between onboarding surfaces were present, but not expressed in one consistent vocabulary.

## Fixes Applied
1. Aligned start-surface labels on the home page:
   - `Пошаговый старт`
   - `Интерактивный тур`
   - `Чек-лист перед запуском`
2. Updated the checklist redirect page title and description to the same wording.
3. Rewrote onboarding callouts in:
   - `Руководство пользователя`
   - `Быстрый старт`
   - `Чек-лист перед запуском`
4. Replaced mixed-language labels in related links:
   - `Interactive Tour` -> `Интерактивный тур`
   - `Чек-лист запуска` -> `Чек-лист перед запуском`
5. Synced the same label in nearby supporting docs and in the generated table of contents.

## Product Effect
- The platform now describes the four onboarding surfaces in one stable vocabulary.
- Users see more clearly:
  - where the full documentation starts
  - where the step-by-step route lives
  - where the visual tour lives
  - where the final pre-launch check happens

## Verification
- `npm run check:release:full`
- Manual live checks after deploy:
  - `/`
  - `/interactive-tour/`
  - `/checklist/`
  - `/generated/быстрый-старт`
  - `/generated/17-13-чек-лист-запуска`
