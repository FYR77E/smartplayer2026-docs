# SmartPlayer Docs — Miro Board Template

## How To Add This Into Miro

Самый быстрый способ переноса:

1. Создай новую board или новый area внутри текущей board.
2. Сделай 8 frame'ов с названиями ниже.
3. Копируй блоки из этого файла по одному frame за раз.
4. Каждый bullet ниже — это отдельный sticky.
5. Цвета удобно разложить так:
   - yellow — facts
   - pink — risks
   - green — improvements
   - blue — next actions

## Frame 1 — Product Surfaces

- Docs platform — основной канонический слой документации
- Quick Start — линейный сценарий первого запуска
- Interactive Tour — визуальный guided walkthrough
- Checklist — короткий operational gate перед запуском
- Wiki — внешняя knowledge base
- Support portal — внешняя точка поддержки

## Frame 2 — User Entry Points

- Новый пользователь идет с главной страницы
- Оператор часто приходит сразу в quickstart
- Администратор ищет роли, аудит и регламент
- Редактору нужен быстрый вход в контент и трансляции
- Поддержке нужен короткий путь в диагностику и типовые ошибки

## Frame 3 — Route Map

- Home -> Quick Start
- Home -> Interactive Tour
- Home -> Checklist
- Home -> Full documentation
- Quick Start -> Interactive Tour
- Quick Start -> Checklist
- Interactive Tour -> Quick Start
- Interactive Tour -> Checklist
- Docs -> Operations -> Checklist
- Docs -> Admin -> Audit and roles

## Frame 4 — Dependencies

- quickstart зависит от standalone HTML surface
- interactive-tour зависит от screenshot assets
- Docusaurus build зависит от sync quickstart compatibility
- release quality зависит от ручной проверки маршрутов
- контент зависит от внешнего import pipeline

## Frame 5 — UX Frictions

- Возможен drift между docs, quickstart и tour
- Entry points нужно держать канонически разведенными
- Quick Start должен оставаться линейным и легким
- Tour должен оставаться точным по highlight zones и popovers
- Governance и release discipline пока слабее, чем сам UI

## Frame 6 — Governance Risks

- Нет единого release gate для всего docs product
- Нет автоматической проверки drift между поверхностями
- Asset optimization для quickstart не встроен в pipeline
- Source of truth частично остается вне repo
- В repo есть мертвый след старой архитектуры

## Frame 7 — Prioritized Backlog

- P1: единый release audit
- P1: quickstart asset governance
- P1: docs / quickstart / tour consistency checks
- P2: a11y polish в interactive-tour
- P2: cleanup legacy dependencies
- P2: обновление status/runbook документов

## Frame 8 — Next Actions

- Зафиксировать ownership для всех поверхностей
- Встроить automated release checks
- Встроить asset budget control
- Оформить runbook по обновлению контента
- Подготовить sprint backlog на 2 недели
