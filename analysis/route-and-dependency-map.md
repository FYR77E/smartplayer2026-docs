# SmartPlayer Docs — Route And Dependency Map

## Purpose

Этот документ фиксирует публичные маршруты продукта, их назначение, реальные зависимости и потенциальные точки поломки.

## Public Route Inventory

Ниже перечислены ключевые маршруты, подтверждённые текущей production build:

### Core Routes

- `/`
- `/quickstart/`
- `/interactive-tour/`
- `/new-interactive/`
- `/checklist/`
- `/search/`

### Core Docs Routes

- `/generated/smartplayer-руководство/`
- `/generated/руководство-пользователя/`
- `/generated/быстрый-старт/`
- `/generated/история-изменений/`
- `/generated/оглавление/`

### Operations And Product Routes

- `/generated/06-1-введение/`
- `/generated/07-2-архитектура-и-развертывание/`
- `/generated/08-3-начало-работы/`
- `/generated/09-4-разделы-мониторинга-и-устройств/`
- `/generated/10-5-работа-с-контентом/`
- `/generated/10-6-работа-с-трансляциями/`
- `/generated/11-7-расписания/`
- `/generated/12-8-отчеты/`
- `/generated/13-9-дополнительные-разделы/`
- `/generated/14-10-администрирование/`
- `/generated/15-11-практические-рекомендации/`
- `/generated/16-12-типовые-ошибки-и-решения/`
- `/generated/17-13-чек-лист-запуска/`

### Admin Routes

- `/admin/пользователи-и-роли/`
- `/admin/история-и-аудит-действий/`
- `/admin/операционный-регламент-администратора/`

### Operations Routes

- `/operations/регламент-запуска-и-приемки/`

### Category Routes

- `/category/старт-и-ориентация/`
- `/category/платформа-и-запуск/`
- `/category/контент-и-операции/`
- `/category/практика-и-поддержка/`

## Redirects And Special Routes

### `/quickstart/`

- Реализован как публичный route в Docusaurus
- Делает client-side redirect на `/quickstart-site/index.html`
- На платформенном уровне Vercel также перенаправляет `/quickstart` и `/quickstart/` на `/quickstart-site/index.html`

Значение:

- пользователь видит единый product route
- технически контент живёт в отдельной standalone surface

### `/new-interactive/`

- Сохраняется как compatibility route
- Делает redirect на `/interactive-tour/`

Значение:

- маршрут нужен для обратной совместимости и старых ссылок

### `/checklist/`

- Служит коротким и ожидаемым user-facing route
- Делает redirect на канонический docs content `/generated/17-13-чек-лист-запуска/`

Значение:

- закрывает short-path intent без необходимости помнить длинный docs slug

### Legacy Compatibility Routes

- `/sp2026.html` -> `/quickstart/`
- `/wtf.html` -> `/generated/smartplayer-руководство`

Значение:

- сохраняется совместимость со старыми HTML/manual entry points

## Entry Point Logic

### Home

Главные целевые переходы:

- `/generated/smartplayer-руководство`
- `/quickstart/`
- `/interactive-tour/`
- `/checklist/`
- topical docs routes
- external support portal

Роль:

- распределить пользователя по правильному сценарию

### Quick Start

Главные целевые переходы:

- `/generated/smartplayer-руководство`
- `/interactive-tour/`
- `/checklist/`
- внутренние anchors внутри quickstart
- внешние knowledge/support links

Роль:

- линейный first-run path плюс переход дальше

### Interactive Tour

Главные целевые переходы:

- `/quickstart/`
- `/checklist/`

Роль:

- обзор и вводный визуальный слой перед operational execution

### Full Docs

Главные целевые переходы:

- category routes
- related docs routes
- admin and operations routes

Роль:

- канонический knowledge layer

## Dependency Map

### Dependency 1 — Docusaurus Shell

Зависимые части:

- home
- docs pages
- interactive-tour
- compatibility routes

Что держит:

- общую навигацию
- поиск
- категорийную структуру
- единый брендовый shell

### Dependency 2 — Quick Start Standalone Layer

Зависимые части:

- `/quickstart/`
- `/quickstart-site/index.html`
- `manual-common.css`
- `manual-common.js`
- `/image/*`
- Vercel rewrites

Что держит:

- full linear quickstart experience
- internal quickstart anchors
- asset-heavy screenshot content

Риск:

- это отдельный слой, который нужно синхронизировать с остальным продуктом

### Dependency 3 — Interactive Tour Screenshot Dependency

Зависимые части:

- `src/components/interactive-tour/InteractiveTourPage.tsx`
- `quickstart-site/image/png/*`

Что держит:

- 9-step walkthrough
- точность highlight zones
- визуальную актуальность onboarding path

Риск:

- если quickstart screenshots меняются, тур визуально устаревает

### Dependency 4 — Sync Compatibility Layer

Зависимые части:

- `scripts/sync_quickstart_compat.cjs`
- `prestart`
- `prebuild`
- `preserve`

Что держит:

- совместимость quickstart assets в корне static build

Риск:

- это скрытая build-time связь, о которой команда может забыть

### Dependency 5 — External Knowledge And Support

Зависимые части:

- wiki link
- service desk link

Что держит:

- глубокую knowledge support surface
- escalation path

Риск:

- внешний контур нельзя считать полностью управляемой частью UX внутри этого repo

## Current Transition Quality

На текущий момент transitions выглядят так:

- `Home -> Quick Start` — сильный и понятный путь
- `Home -> Interactive Tour` — понятный путь
- `Home -> Checklist` — теперь понятный путь
- `Quick Start -> Interactive Tour` — есть
- `Quick Start -> Checklist` — есть
- `Interactive Tour -> Quick Start` — есть
- `Interactive Tour -> Checklist` — есть
- `Compatibility routes -> canonical routes` — есть

Это означает, что базовый user flow уже собран в единую систему.

## Main Structural Risks

1. Duality between `/quickstart/` and `/generated/быстрый-старт/`
2. Quick Start depends on a standalone HTML layer rather than the same rendering model as docs
3. Interactive Tour depends on screenshot assets rather than shared semantic UI data
4. Compatibility routes add maintenance burden, even though they are useful
5. External systems remain outside direct UX control of the repo

## What To Monitor

Следующие вещи нужно регулярно проверять:

1. Не появились ли broken transitions между home, quickstart, tour и checklist
2. Не разошлись ли quickstart screenshots и tour highlight zones
3. Не начали ли docs и quickstart конкурировать за роль канонического first-run guide
4. Не появились ли новые legacy routes без явной ownership
5. Не стали ли внешние support links слишком ранним выходом из основного docs journey

## Recommended Control Points

1. Route smoke check для core routes
2. Redirect check для compatibility routes
3. Screenshot drift check для interactive-tour
4. Asset budget check для quickstart
5. Content consistency review между quickstart, tour и docs
