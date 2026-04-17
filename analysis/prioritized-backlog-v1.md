# SmartPlayer Docs — Prioritized Backlog V1

## Purpose

Этот backlog переводит structural findings и UX findings в управляемый список работ.

Принцип:

- `P1` — даёт заметный product effect или защищает от реальных regressions
- `P2` — улучшает ясность, consistency и управляемость, но не является срочным блокером
- `Later` — имеет смысл только после закрытия основных системных рисков

## Scoring Model

### Impact

- `High` — влияет на ключевой пользовательский путь или системную стабильность продукта
- `Medium` — улучшает важную часть UX, но не ломает основной сценарий
- `Low` — полезный polish, но не меняет продукт существенно

### Effort

- `S` — несколько часов или один аккуратный pass
- `M` — 1–2 дня
- `L` — несколько дней или требует отдельной coordination/migration работы

## P1 — Do Next

### 1. Развести роли `/quickstart/` и `/generated/быстрый-старт/`

- Problem:
  - В продукте остаются две похожие точки входа в “быстрый старт”, и это может путать пользователей.
- Why it matters:
  - Это влияет на onboarding path и каноничность first-run сценария.
- Impact: `High`
- Effort: `M`
- Proposed action:
  - добавить более явное семантическое разведение в copy и cross-links
  - проверить, нужен ли явный label для docs-page как reference-version
- Verification:
  - пользователь с главной и из docs понимает, куда идти за быстрым запуском, а куда за полной инструкцией

### 2. Формализовать связь `quickstart -> interactive-tour`

- Problem:
  - Tour зависит от screenshot assets quickstart, но эта зависимость пока в основном поддерживается вручную.
- Why it matters:
  - Любое обновление quickstart screenshots может silently сломать точность walkthrough.
- Impact: `High`
- Effort: `M`
- Proposed action:
  - описать process rule: изменение ключевых quickstart screens требует review interactive-tour
  - оформить это как operational checklist или skill spec
- Verification:
  - у команды есть явное правило и check step перед публикацией

### 3. Ввести route smoke audit

- Problem:
  - Сейчас продукт зависит от нескольких канонических маршрутов и compatibility routes.
- Why it matters:
  - Broken transition здесь ломает ощущение цельной платформы.
- Impact: `High`
- Effort: `S`
- Proposed action:
  - автоматизировать проверку core routes:
    - `/`
    - `/quickstart/`
    - `/interactive-tour/`
    - `/checklist/`
    - `/new-interactive/`
- Verification:
  - smoke check проходит локально и перед публикацией

### 4. Ввести `interactive-tour` QA gate

- Problem:
  - Tour — отдельная критичная onboarding surface, но без своего formalized QA gate.
- Why it matters:
  - Здесь особенно опасны тихие визуальные regressions: overlap, drift, broken mobile flow.
- Impact: `High`
- Effort: `M`
- Proposed action:
  - зафиксировать checklist для:
    - 9 шагов
    - intro/completion
    - keyboard nav
    - desktop/medium/mobile
    - highlight accuracy
    - popover placement
- Verification:
  - у тура есть отдельный repeatable QA-pass

### 5. Встроить quickstart asset budget check

- Problem:
  - Quick Start остаётся asset-heavy surface, где легко проскальзывают тяжёлые изображения.
- Why it matters:
  - Это влияет и на performance, и на дальнейшую поддержку.
- Impact: `High`
- Effort: `S`
- Proposed action:
  - добавить проверку тяжёлых PNG / предпочтения WebP / screenshot anomalies
  - подключить `scripts/optimize_quickstart_assets.py` к реальному рабочему процессу
- Verification:
  - в pipeline есть понятная проверка asset regressions

## P2 — Next Sprint

### 6. Усилить decision labels на home

- Problem:
  - Главная хорошо показывает entry points, но не всегда одинаково явно объясняет, кому какой маршрут нужен.
- Impact: `Medium`
- Effort: `S`
- Proposed action:
  - добавить короткие decision cues рядом с главными CTA
- Verification:
  - у пользователя меньше необходимости “угадывать” по названиям

### 7. Перепроверить CTA density в intro interactive-tour

- Problem:
  - Intro содержит три действия и немного размывает главный CTA.
- Impact: `Medium`
- Effort: `S`
- Proposed action:
  - провести ещё один product pass и решить, нужен ли перенос checklist CTA в completion state
- Verification:
  - intro либо остаётся как есть по осознанному решению, либо становится ещё чище

### 8. Усилить pathway из tour в full docs

- Problem:
  - Tour хорошо ведёт в quickstart, но менее явно ведёт к полному knowledge layer.
- Impact: `Medium`
- Effort: `S`
- Proposed action:
  - протестировать мягкую ссылку на full docs из completion state или footer
- Verification:
  - обзорный путь заканчивается не только execution path, но и knowledge path

### 9. Сделать checklist более явно частью launch flow

- Problem:
  - Checklist уже доступен, но пока остаётся слегка utility-like поверхностью.
- Impact: `Medium`
- Effort: `S`
- Proposed action:
  - усилить его роль как обязательного gate после quickstart
- Verification:
  - маршрут “прошёл запуск -> сверился с checklist” читается естественно

### 10. Обновить `STATUS.md` и runbook-слой

- Problem:
  - Внутреннее описание архитектуры отстаёт от текущей product reality.
- Impact: `Medium`
- Effort: `S`
- Proposed action:
  - обновить документы под актуальную гибридную модель продукта
- Verification:
  - команда видит текущую truth, а не старую фазу миграции

## Later — Only After Core Controls

### 11. Убрать legacy dependency `driver.js`

- Why later:
  - это cleanup, но не самый срочный product risk
- Impact: `Low`
- Effort: `S`

### 12. Дальше сближать standalone quickstart и docs shell

- Why later:
  - это потенциально полезно, но уже похоже на архитектурный шаг, а не на точечный polish
- Impact: `Medium`
- Effort: `L`

### 13. Расширять Figma/Miro governance layer

- Why later:
  - полезно для командной координации, но сначала нужно стабилизировать сам продукт и quality gates
- Impact: `Low`
- Effort: `M`

## Recommended Order

### Track A — Product Safety

1. route smoke audit
2. interactive-tour QA gate
3. quickstart asset budget check

### Track B — Product Clarity

1. развести quickstart vs docs quickstart
2. усилить checklist как launch gate
3. уточнить decision labels на home

### Track C — Team Governance

1. формализовать связь quickstart и tour
2. обновить `STATUS.md`
3. описать operational runbook

## What Should Not Be Prioritized Right Now

1. Полный редизайн сайта
2. Перенос quickstart в новую концепцию
3. Большой рефактор docs structure без доказанного product effect

## Definition Of Done For This Backlog Phase

Эту фазу можно считать закрытой, когда:

1. У нас есть route smoke checks
2. У нас есть repeatable tour QA flow
3. У нас есть asset control для quickstart
4. Пользователь не путает `quickstart` и docs quickstart
5. Checklist естественно встроен в запуск
6. Команда понимает текущую архитектуру и правила обновления
