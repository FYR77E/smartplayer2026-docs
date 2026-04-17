# SmartPlayer Docs — Checklist Launch Gate Pass V1

## Goal

Сделать `/checklist/` не просто ещё одной ссылкой, а более явным финальным gate в стартовом пользовательском маршруте.

## Problems Observed

1. Checklist был доступен, но в нескольких местах читался как обычный соседний раздел, а не как финальная сверка перед запуском.
2. В `interactive-tour` CTA к checklist не объясняли достаточно явно, что это следующий контрольный шаг перед пилотом и rollout.
3. В standalone Quick Start не хватало прямого сигнала, что после маршрута нужно идти в checklist.
4. На home роль checklist уже была видна, но wording можно было сделать более product-oriented.

## Changes Made

### Home

- В шаге `Расписание и пилот` усилена логика:
  - сначала расписание
  - потом пилот
  - перед массовым запуском — checklist

### Quick Start

- В верхнем explanatory note добавлен прямой next step:
  - после Quick Start -> `/checklist/`

### Interactive Tour

- Intro copy теперь упоминает checklist как контроль перед пилотом
- Checklist CTA переименованы в более action-oriented формулировку
- Completion state перестроен под более логичный порядок:
  - Quick Start
  - Checklist
  - Restart

### Checklist Surface

- Redirect page `/checklist/` теперь звучит как launch gate, а не как нейтральный redirect
- Каноническая docs page `/generated/17-13-чек-лист-запуска` теперь явно объясняет:
  - когда открывать checklist
  - зачем он нужен
  - какие страницы логично пройти до него

## Expected Effect

1. Пользователь яснее понимает, что checklist нужен не в начале, а перед реальным запуском.
2. Onboarding path выглядит последовательнее:
   - Tour -> Quick Start -> Checklist
3. Launch discipline становится читаемым прямо в UI, а не только в внутренних документах.
