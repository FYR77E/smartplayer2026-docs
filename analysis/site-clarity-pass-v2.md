# SmartPlayer Docs — Site Clarity Pass V2

## Goal

Убрать оставшиеся двусмысленные места в стартовом пользовательском маршруте и сделать переходы между поверхностями предсказуемее.

## What Was Still Ambiguous

1. `Руководство пользователя` недостаточно явно разводило standalone Quick Start и docs quick-start chapter.
2. В `interactive-tour` CTA всё ещё называли `/quickstart/` просто «полным Быстрым стартом`, что оставляло место для путаницы.
3. В standalone Quick Start не было достаточно явного объяснения, что это отдельная execution-surface, а не просто ещё одна docs page.
4. Один из обзорных блоков Quick Start всё ещё назывался `Документация/Быстрый старт`, что визуально смешивало две разные роли.

## Changes Made

### Docs

- В `Руководство пользователя` добавлен явный callout:
  - `/quickstart/` = пошаговый сценарий со скриншотами
  - `/generated/быстрый-старт` = краткая reference-версия
  - `/interactive-tour/` = визуальный обзор
  - `/checklist/` = финальная сверка

### Interactive Tour

- CTA вокруг `/quickstart/` переименованы в `Quick Start со скриншотами`
- completion copy теперь лучше описывает следующий шаг после тура

### Quick Start

- В switch-links добавлена отдельная ссылка на docs quick-start chapter
- Добавлен note, объясняющий роль standalone Quick Start
- Обзорный блок переименован в `Краткая версия в полном руководстве`

## Expected Effect

1. Пользователю проще различать execution path и reference path.
2. Tour сильнее подталкивает к правильному следующему шагу.
3. Quick Start перестаёт выглядеть как ещё одна неясная версия той же страницы.
4. Общая docs-платформа воспринимается как связанная система, а не как несколько почти одинаковых entry points.
