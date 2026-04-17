# SmartPlayer Docs — Structural Findings V1

## Status

Этот документ фиксирует первые выводы после Product Surfaces Map и Route/Dependency Map.

## Confirmed Strengths

1. Платформа уже не выглядит как набор разрозненных manual pages.
2. Главная страница теперь лучше разводит сценарии запуска, обучения и эксплуатации.
3. Связка `Home -> Quick Start -> Checklist` стала понятной.
4. Связка `Home -> Interactive Tour -> Quick Start` стала понятной.
5. Compatibility routes закрывают старые сценарии доступа без поломки продукта.

## Confirmed Structural Risks

### 1. Dual first-run model

Пользователь может увидеть два похожих entry point для старта:

- `/quickstart/`
- `/generated/быстрый-старт/`

Риск:

- пользователь не всегда понимает, что из этого канонический linear path, а что knowledge page

### 2. Hybrid rendering model

Продукт состоит не из одного rendering layer, а из нескольких:

- Docusaurus docs
- standalone quickstart HTML
- React tour поверх screenshot assets

Риск:

- продукт выглядит единым, но поддерживается как гибрид
- это повышает вероятность drift и локальных регрессий

### 3. Screenshot dependency in interactive-tour

Interactive Tour зависит от готовых screenshot assets, а не от shared UI state.

Риск:

- изменение quickstart screenshots или ratio легко создаёт visual mismatch

### 4. Hidden build-time dependency

Quick Start compatibility поддерживается через sync script.

Риск:

- это важная связь, о которой легко забыть при будущих изменениях

### 5. External extension layer is useful but uncontrolled

Wiki и support portal полезны, но находятся вне прямого контроля этого repo.

Риск:

- нельзя считать их полностью управляемой частью основного UX

## Current Product Interpretation

Самая точная модель продукта на текущий момент:

- docs platform — канонический knowledge layer
- quickstart — канонический operational onboarding path
- interactive-tour — визуальный onboarding layer
- checklist — короткий launch gate
- external systems — расширенный knowledge/support layer

Это хорошая модель. Её нужно не менять, а закреплять.

## What Needs Stronger Governance

1. Route ownership
2. Entry point clarity
3. Screenshot drift control
4. Asset budget control
5. Release gate for the whole docs product

## Immediate Recommendations

### P1

- ввести route smoke checks
- ввести tour QA checks
- ввести quickstart asset checks

### P2

- сильнее развести `/quickstart/` и `/generated/быстрый-старт/` в пользовательской логике
- обновить internal status/runbook документы под текущую архитектуру
- убрать legacy dependencies, которые уже не используются

## What Not To Do

1. Не делать новый редизайн сайта
2. Не объединять все поверхности в один слой любой ценой
3. Не ломать standalone quickstart без явной migration strategy
4. Не усложнять interactive-tour до pseudo-CMS модели

## Next Logical Step

Следующий этап — Day 3:

- пройти сценарии глазами пользователя
- собрать UX friction list
- выделить места потери контекста
- подготовить backlog уже не по структуре, а по пользовательскому опыту
