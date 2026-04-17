# SmartPlayer Docs — Miro Template For Interactive Tour Zone Audit

## Source Scope

- Surface: `interactive-tour`
- Focus: correctness of highlight zones against real screenshots

## How To Add This Into Miro

1. Создай новый frame group `Interactive Tour Zone Audit`.
2. Сделай 4 frame'а по структуре ниже.
3. Каждый bullet — отдельный sticky.
4. Цвета:
   - yellow — facts
   - pink — risks
   - green — decisions
   - blue — actions

## Frame 1 — Steps Reviewed

- `login`
- `dashboard`
- `devices`
- `add-device`
- `content`
- `quick-send`
- `targets`
- `schedule`
- `device-card`

## Frame 2 — Findings

- Геометрически критичных промахов не найдено
- `login` и `dashboard` выглядят точными
- `targets` и `device-card` выглядят точными
- `content` и `quick-send` широкие, но соответствуют сценарию
- `schedule` требовал уточнения текста, а не новой geometry

## Frame 3 — Decision

- Не менять концепцию screenshot-tour
- Не переразмечать шаги без доказанного mismatch
- Исправлять copy, если текст уходит за пределы реальной зоны
- Держать geometry стабильной, если она уже соответствует изображению

## Frame 4 — Next Actions

- При следующем pass снова проверить `content`, `quick-send`, `schedule`
- Если обновятся скриншоты Quick Start, повторить zone audit
- Хранить walkthrough как product surface с отдельной QA-дисциплиной
