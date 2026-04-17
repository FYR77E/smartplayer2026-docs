# SmartPlayer Docs — UX Friction List V1

## Scope

Этот документ фиксирует первые UX-friction points по ключевым пользовательским сценариям после структурного этапа.

Фокус:

- не эстетические вкусовые замечания
- а реальные точки, где пользователь может запутаться, потерять контекст или выбрать не тот маршрут

## Scenario 1 — New User Lands On Home

### What works

- Главная уже даёт 4 понятных направления:
  - полное руководство
  - быстрый старт
  - интерактивный тур
  - чек-лист запуска
- Рабочие контуры и блок последовательности хорошо объясняют, как двигаться дальше

### Frictions

#### P1 — Dual first-run meaning is still possible

Пользователь видит:

- `/quickstart/`
- `/generated/быстрый-старт/`

Даже если на главной ведём его правильно, в общей системе остаются два похожих входа в “быстрый старт”.

Риск:

- часть пользователей будет воспринимать docs-page и standalone quickstart как равнозначные стартовые сценарии

Что с этим делать:

- в навигации и copy жёстко закреплять:
  - `Quick Start` = линейный путь запуска
  - `Docs` = полное руководство

#### P2 — Home teaches structure, but not always decision criteria

Сейчас главная хорошо показывает доступные маршруты, но не везде одинаково явно объясняет:

- кому идти в tour
- кому идти в quickstart
- кому сразу идти в docs

Риск:

- пользователь выбирает маршрут по названию, а не по своей задаче

Что с этим делать:

- усилить короткие decision labels рядом с CTA, а не только общие описания секций

## Scenario 2 — User Goes To Quick Start

### What works

- Quick Start остаётся сильным линейным сценарием
- есть переключение на:
  - полное руководство
  - интерактивный тур
  - чек-лист запуска
- структура ориентирована на практическое прохождение

### Frictions

#### P1 — Quick Start живёт в отдельном rendering layer

Пользователь этого не видит, но на UX это влияет:

- standalone HTML имеет свой собственный ритм, структуру и internal behavior
- при drift он быстрее начнет ощущаться “отдельным продуктом”

Риск:

- платформа может снова начать восприниматься как stitched experience

Что с этим делать:

- держать cross-linking и terminology consistency под отдельным контролем

#### P1 — Heavy screenshot surface increases maintenance sensitivity

Quick Start сильно завязан на визуальные скриншоты.

Риск:

- даже небольшое обновление продукта или скрина делает walkthrough и смежные пояснения менее точными

Что с этим делать:

- держать asset budget и screenshot drift review как регулярную проверку

#### P2 — Redirected route adds one more invisible seam

Публичный route `/quickstart/` ведёт в standalone page через redirect path.

Риск:

- это не ломает UX напрямую, но повышает хрупкость интеграции

Что с этим делать:

- регулярно проверять redirect behavior, canonical tags и route smoke

## Scenario 3 — User Goes To Interactive Tour

### What works

- Тур остаётся понятным screenshot-based walkthrough
- есть intro, completion, keyboard nav и mobile fallback
- уже улучшены highlight zones и popover behavior

### Frictions

#### P1 — Tour still depends on screenshot truth, not product truth

Tour объясняет продукт через снимки текущего Quick Start, а не через shared UI model.

Риск:

- с ростом продукта это станет главным источником onboarding drift

Что с этим делать:

- зафиксировать отдельный operational process: любой апдейт ключевых quickstart screens требует review interactive-tour

#### P2 — Intro is still slightly choice-heavy

В intro у тура сейчас три действия:

- запустить тур
- открыть quickstart
- открыть checklist

Риск:

- главное действие остаётся понятным, но когнитивный фокус чуть размыт

Что с этим делать:

- оставить как есть на этой итерации, но вернуться к вопросу после пользовательского прогона

#### P2 — Tour closes into execution, but not into deeper docs

Сейчас тур хорошо ведёт в execution path, но слабее ведёт в full knowledge layer.

Риск:

- пользователь, который прошёл обзор, не всегда видит следующий путь для более глубокого изучения

Что с этим делать:

- позже протестировать добавление мягкой ссылки в полное руководство без перегруза completion state

## Scenario 4 — User Needs Checklist

### What works

- `/checklist/` теперь существует как понятный user-facing route
- чек-лист теперь естественно включён в маршрут запуска

### Frictions

#### P2 — Checklist is discoverable, but still more a route than a surfaced product block

Checklist уже встроен в навигацию и cross-links, но пока воспринимается скорее как utility route, чем как самостоятельный operational gate.

Риск:

- часть пользователей по-прежнему будет проходить запуск без явной фиксации readiness step

Что с этим делать:

- в следующем UX pass проверить, нужно ли ещё сильнее выделить checklist в сценарии “после quickstart”

## Scenario 5 — Admin Or Support User

### What works

- admin routes и support links доступны из docs shell
- главная уже лучше подсвечивает monitoring/admin/support contour

### Frictions

#### P2 — Support escalation still leaves the main product boundary

При переходе в wiki/service desk пользователь покидает основной docs journey.

Риск:

- это нормально по архитектуре, но важно не толкать пользователя туда слишком рано

Что с этим делать:

- сохранять основную docs shell как first-choice path, а external links держать как deliberate escalation

## Cross-Cutting Frictions

### P1 — Governance gaps can become UX regressions

Главная опасность не только в UI, а в том, что:

- нет единого release audit
- нет route smoke gate
- нет screenshot drift gate
- нет asset budget gate

Риск:

- UX будет деградировать тихо и постепенно

### P1 — Product consistency relies too much on manual discipline

Сейчас целостность платформы поддерживается в значительной степени вручную.

Риск:

- при ускорении изменений это станет bottleneck и источником регрессий

## Prioritized UX Issues

### P1

1. Развести `quickstart` и docs-level `быстрый старт` по пользовательскому смыслу
2. Формализовать review-связь между quickstart screenshots и interactive-tour
3. Ввести технические quality gates, которые защищают UX от незаметного drift

### P2

1. Уточнить decision labels на home entry points
2. Вернуться к CTA-density в intro interactive-tour
3. Проверить, нужен ли более явный next-step from tour to full docs
4. Проверить, нужно ли сильнее подсветить checklist как обязательный operational gate

## Current Conclusion

На этом этапе главный UX риск — не “визуально плохо”, а “продукт легко может снова разъехаться по слоям”.

Это хороший знак:

- базовый UX уже достаточно зрелый
- следующий рост качества даст не редизайн, а дисциплина маршрутов, ownership и consistency checks
