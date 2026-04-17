# SmartPlayer Docs — Hybrid Surface Governance V1

## Purpose

Этот документ описывает, как поддерживать SmartPlayer Docs как один продукт, хотя технически он состоит из нескольких поверхностей.

## Product Surfaces

| Surface | User job | Source of truth | Notes |
| --- | --- | --- | --- |
| `Docusaurus docs` | Каноническое руководство и reference-слой | `docs/*`, `src/pages/*`, `src/components/*` | Основной knowledge layer |
| `standalone /quickstart/` | Линейный первый запуск со скриншотами | `static/quickstart-site/*` | Быстрый execution path |
| `interactive-tour` | Визуальный guided walkthrough | `src/components/interactive-tour/*` | Завязан на screenshot layer Quick Start |
| `/checklist/` | Финальная сверка перед запуском | short route + canonical docs page | Launch gate |

## Canonical Naming

Используем эти формулировки последовательно:

1. `Quick Start` или `Быстрый старт`:
   - standalone маршрут `/quickstart/`
   - сценарий со скриншотами и линейной последовательностью
2. `Быстрый старт` внутри полного руководства:
   - docs page `/generated/03-быстрый-старт`
   - краткая reference-версия, а не основной entry point
3. `Interactive Tour`:
   - `/interactive-tour/`
   - визуальный walkthrough, а не полноценная замена Quick Start
4. `Checklist`:
   - `/checklist/`
   - контрольный gate после основного сценария запуска

## Coupling Rules

### Quick Start -> Tour

Изменение любого из пунктов ниже автоматически означает обязательный review `interactive-tour`:

1. новое изображение
2. новая обрезка скриншота
3. новый ratio изображения
4. изменение порядка шагов
5. rename/move screenshot files

### Home / CTA -> Product Shell

Изменение любой стартовой CTA требует проверки:

1. home hero
2. feature cards
3. navbar
4. footer
5. quickstart cross-links
6. tour intro/completion

### Docs Content -> Launch Flow

Если меняется запуск, роли, мониторинг, расписания или приемка, нужно проверить не только docs page, но и:

1. `/quickstart/`
2. `/interactive-tour/`
3. `/checklist/`

## Ownership Matrix

### Docs shell

Отвечает за:

1. объяснение продукта
2. канонические reference-страницы
3. навигацию между разделами

### Quick Start

Отвечает за:

1. короткий рабочий маршрут
2. screenshot-backed first run
3. ясный переход к следующему действию

### Interactive Tour

Отвечает за:

1. быстрый визуальный обзор интерфейса
2. guided orientation по ключевым зонам
3. переход в Quick Start и Checklist

### Checklist

Отвечает за:

1. финальную сверку запуска
2. контроль перед пилотом или массовым включением
3. закрепление launch discipline

## What To Avoid

1. Не называть `/generated/03-быстрый-старт` и `/quickstart/` одинаково без пояснения контекста.
2. Не менять Quick Start screenshots без проверки тура.
3. Не считать route compatibility pages второстепенными: они участвуют в реальном пользовательском маршруте.
4. Не делать локальные улучшения в одной поверхности, игнорируя cross-links в других.

## Definition Of Healthy State

Состояние можно считать здоровым, если:

1. пользователь понимает, куда идти за обзором, куда за запуском и куда за финальной сверкой
2. quickstart и tour не расходятся по ключевым шагам
3. docs shell остаётся каноническим knowledge layer
4. route checks, asset checks и tour QA проходят без ручной импровизации
