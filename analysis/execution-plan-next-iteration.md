# SmartPlayer Docs — Execution Plan (Next Iteration)

## Goal

Следующая итерация должна не “ещё улучшить внешний вид”, а закрепить целостность продукта и убрать самые опасные точки drift.

## Recommended Focus

### Sprint Goal

Сделать SmartPlayer Docs более предсказуемой и управляемой documentation platform через quality gates, clearer onboarding paths и operational governance.

## Workstream 1 — Product Safety

### Deliverables

1. Route smoke audit
2. Interactive-tour QA checklist
3. Quickstart asset budget rule

### Expected effect

- меньше риска тихих product regressions
- более надёжный release path

## Workstream 2 — Product Clarity

### Deliverables

1. Чёткое разведение quickstart и docs quickstart
2. Более явная роль checklist в launch flow
3. Уточнение decision labels на home

### Expected effect

- меньше путаницы в entry points
- более ясный onboarding path

## Workstream 3 — Team Governance

### Deliverables

1. Rule: любое изменение quickstart screenshots требует review interactive-tour
2. Обновлённый `STATUS.md`
3. Runbook по обновлению docs surfaces

### Expected effect

- меньше drift между поверхностями
- меньше скрытых знаний в голове у одного человека

## Suggested Sequence

### Day A

- route smoke audit
- checklist of core routes

### Day B

- interactive-tour QA checklist
- verification workflow for desktop / medium / mobile

### Day C

- quickstart asset review
- wire optimization/check into working process

### Day D

- content clarity pass for quickstart vs docs quickstart
- launch gate wording around checklist

### Day E

- update internal governance docs
- finalize runbook and acceptance rules

## Completion Criteria

Следующая итерация считается успешной, если:

1. маршрут запуска читается без двусмысленности
2. tour не может silently устареть без review
3. heavy assets не проскальзывают без контроля
4. команда понимает текущую архитектуру и release path
