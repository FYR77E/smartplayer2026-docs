# SmartPlayer Docs — Miro Template For Release Flow And Ownership

## Source Artifacts

Используй эти FigJam-диаграммы как визуальную основу:

- Release Flow:
  - `https://www.figma.com/online-whiteboard/create-diagram/b9efaa1a-d307-4a06-92ad-a4565e3adddc?utm_source=chatgpt&utm_content=edit_in_figjam&oai_id=&request_id=18466c12-a17c-4647-99e8-b87a680e740b`
- Ownership Map:
  - `https://www.figma.com/online-whiteboard/create-diagram/4b045f0b-3e91-4963-9d82-655ddcc99627?utm_source=chatgpt&utm_content=edit_in_figjam&oai_id=&request_id=cefcc672-bcec-44c6-8146-7354e42ba9eb`

## How To Add This Into Miro

1. Создай новый area `Release Governance`.
2. Добавь 6 frame'ов с названиями ниже.
3. Вставь FigJam-ссылки в первый и второй frame как reference.
4. Каждый bullet ниже — это отдельный sticky.
5. Рекомендуемые цвета:
   - yellow — facts
   - pink — risks
   - green — rules
   - blue — actions

## Frame 1 — Release Flow

- Change requested
- Определяем затронутую поверхность
- Docs shell
- Quick Start
- Interactive Tour
- Routes and CTA
- `check:release`
- `check:release:full`
- Manual route review
- Commit and push
- Vercel deploy
- Production check
- Published

## Frame 2 — Trigger Matrix

- Изменился `quickstart-site` -> обязателен review `interactive-tour`
- Изменились screenshot assets -> обязателен `check:release:full`
- Изменились routes или CTA -> проверяем home, navbar, footer, quickstart, tour, checklist
- Изменился docs content про запуск -> сверяем quickstart и checklist
- Изменился `interactive-tour` -> проверяем 9 шагов, intro, complete, keyboard nav, mobile

## Frame 3 — Ownership Map

- Docs shell = canonical knowledge layer
- Quick Start = linear execution path
- Interactive Tour = visual orientation path
- Checklist = launch gate
- Docs quick-start chapter = short reference inside full manual
- Standalone `/quickstart/` = основной first-run сценарий со скриншотами

## Frame 4 — Coupling Risks

- Tour зависит от screenshot layer Quick Start
- Route compatibility pages участвуют в реальном user flow
- Drift между docs и quickstart ломает ощущение единой платформы
- Drift между quickstart и tour ломает доверие к walkthrough
- Неявные названия entry points создают product confusion

## Frame 5 — Publish Checklist

- `npm run typecheck` passed
- `npm run build` passed
- `npm run check:routes` passed
- `npm run check:assets` passed
- `npm run check:tour` passed, если тронуты tour или quickstart
- Ключевые маршруты открываются
- Copy сохраняет distinction между `/quickstart/` и `/generated/быстрый-старт`
- Production URL проверен после deploy

## Frame 6 — Next Team Actions

- Сделать этот flow стандартом перед каждым production deploy
- Держать правило `Quick Start screenshots -> tour review` в PR review
- Продолжать разводить execution surfaces и reference surfaces
- Расширить internal runbook, а не только публичную docs shell
- При желании сделать отдельный weekly release checklist frame для команды
