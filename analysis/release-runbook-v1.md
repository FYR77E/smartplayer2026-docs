# SmartPlayer Docs — Release Runbook V1

## Purpose

Этот runbook фиксирует повторяемый путь публикации для гибридного docs-продукта SmartPlayer:

- Docusaurus docs shell
- standalone `quickstart-site`
- React `interactive-tour`
- compatibility routes `/quickstart/`, `/interactive-tour/`, `/checklist/`, `/new-interactive/`

Цель документа — уменьшить drift между поверхностями и сделать публикацию предсказуемой для команды.

## Canonical Commands

### Fast release check

```bash
npm run check:release
```

Включает:

1. `npm run typecheck`
2. `npm run build`
3. `npm run check:routes`
4. `npm run check:assets`

### Full release check

```bash
npm run check:release:full
```

Дополнительно включает:

1. `npm run check:tour`

Его стоит считать обязательным, если затронуты:

- `src/components/interactive-tour/*`
- `static/quickstart-site/*`
- homepage / CTA / routing
- screenshot assets

## Release Flow

1. Синхронизироваться с `main`.
2. Внести точечные правки без затрагивания несвязанных поверхностей.
3. Прогнать `npm run check:release`.
4. Если менялись тур, маршруты, CTA или quickstart screenshots — прогнать `npm run check:release:full`.
5. Просмотреть diff по ключевым точкам входа:
   - `/`
   - `/quickstart/`
   - `/interactive-tour/`
   - `/checklist/`
   - `/generated/03-быстрый-старт`
6. Сделать чистый commit с понятным scope.
7. Запушить в GitHub.
8. Поднять Vercel deployment.
9. Ручно проверить production или preview URL по ключевым маршрутам.

## Change Rules

### Rule 1. Quick Start screenshots always trigger tour review

Если меняются скриншоты, размеры изображений, имена файлов или порядок шагов в `quickstart-site`, нужно отдельно проверить:

1. `interactive-tour` highlight zones
2. позиционирование popover
3. mobile fallback
4. соответствие текста выделенной области

Причина: `interactive-tour` зависит от screenshot layer Quick Start и может silently устареть.

### Rule 2. Route changes require entry-point review

Если меняются маршруты, redirect logic или главные CTA, нужно проверить:

1. home
2. navbar
3. footer
4. `quickstart`
5. `interactive-tour`
6. `checklist`

Причина: пользователь воспринимает это как единый продукт, а не как набор отдельных страниц.

### Rule 3. Docs quickstart and standalone Quick Start serve different jobs

- `/quickstart/` — линейный сценарий со скриншотами для первого запуска
- `/generated/03-быстрый-старт` — краткая reference-версия внутри полного руководства

Любая copy-правка вокруг старта должна сохранять это различие.

## Manual Verification

### Interactive Tour

Проверить:

1. intro state
2. all 9 steps
3. completion state
4. `ArrowRight`, `ArrowLeft`, `Escape`
5. desktop
6. medium width
7. mobile

### Quick Start

Проверить:

1. открытие `/quickstart/`
2. корректность ключевых изображений
3. cross-links в полную документацию, тур и checklist
4. отсутствие тяжелых PNG regression

### Site-wide

Проверить:

1. главную страницу
2. navbar
3. footer
4. `/checklist/`
5. `/generated/03-быстрый-старт`

## Publish Checklist

Перед публикацией должно быть true:

- `typecheck` passed
- `build` passed
- `check:routes` passed
- `check:assets` passed
- `check:tour` passed, если затронут tour/quickstart/routes
- ключевые маршруты открываются
- новая copy не ломает distinction между docs quickstart и standalone Quick Start

## Rollback Guidance

Если после публикации обнаружен регресс:

1. определить, это route issue, asset issue или tour issue
2. откатить проблемный commit через normal revert, а не destructive reset
3. повторно задеплоить предыдущую стабильную ревизию
4. зафиксировать причину в `STATUS.md` или follow-up audit note
