# SmartPlayer Docs — Product Audit Roadmap (Week 1)

## Goal

За одну неделю собрать структурное понимание продукта SmartPlayer Docs как рабочей документационной платформы и превратить это понимание в приоритизированный backlog улучшений.

Фокус недели:

- не придумывать новый сайт
- не делать редизайн ради редизайна
- найти реальные product, UX, UI и governance-проблемы
- подготовить основу для точечных улучшений следующей итерации

## Current Product Surface

Сейчас платформа состоит из нескольких связанных поверхностей:

1. `docs` — основной Docusaurus-слой с документацией и поиском
2. `quickstart` — standalone quick start surface на `static/quickstart-site/index.html`
3. `interactive-tour` — screenshot-based walkthrough в React
4. `checklist` — отдельная точка входа в запуск и приемку
5. `wiki.smartplayer.org` — внешняя база знаний
6. `Jira Service Desk` — внешняя точка поддержки

## What We Already Know

Уже подтверждены следующие системные особенности:

- Платформа ощущается как единый продукт только если entry points явно разведены.
- Главный риск — drift между `docs`, `quickstart` и `interactive-tour`.
- Самая слабая часть сейчас не в визуале, а в governance и release discipline.
- Hybrid architecture требует регулярного контроля маршрутов, связей и ассетов.

## Week Plan

### Day 1 — Product Map

Цель:

- описать все поверхности продукта как одну систему

Задачи:

- собрать все entry points
- зафиксировать user intents для каждой поверхности
- определить, какая поверхность каноническая для каждого сценария
- выявить дублирующиеся сценарии

Артефакты:

- product surfaces map
- user entry map
- canonical ownership list

### Day 2 — Structural Research

Цель:

- понять, как связаны маршруты, сценарии и ownership

Задачи:

- пройти ключевые маршруты сайта
- проверить логику переходов между docs, quickstart, tour и checklist
- зафиксировать route dependencies и redirect dependencies
- отметить transitional и legacy edges

Артефакты:

- route map
- dependency map
- список структурных рисков

### Day 3 — Product Understanding

Цель:

- увидеть продукт глазами нового пользователя, оператора и администратора

Задачи:

- пройти onboarding path
- пройти operational path
- пройти support/admin path
- выделить точки потери контекста
- зафиксировать overloaded blocks и слабые next-step transitions

Артефакты:

- friction list
- scenario-based UX notes
- gaps by audience

### Day 4 — Governance And Infra Layer

Цель:

- понять, почему продукт может деградировать со временем

Задачи:

- описать release path
- зафиксировать, где нет automated checks
- определить, где возможен content drift
- разложить систему по 4 planes:
  - customer plane
  - operator plane
  - automation plane
  - integration plane

Артефакты:

- governance risk map
- automation gap list
- release control checklist

### Day 5 — Prioritization

Цель:

- превратить находки в управляемый backlog

Задачи:

- оценить impact, urgency, effort и regression risk
- разложить находки по приоритетам
- отделить critical now от nice-to-have

Артефакты:

- top priorities
- backlog by priority
- do-not-touch list

### Day 6 — Solution Design

Цель:

- подготовить конкретные улучшения без разрушения текущего продукта

Задачи:

- сформулировать fixes по маршрутам, структуре, контенту и a11y
- подготовить minimal changes и strategic changes
- определить, как проверять каждое улучшение

Артефакты:

- solution notes
- implementation candidates
- validation checklist

### Day 7 — Executive Synthesis

Цель:

- упаковать всю неделю в решение для команды

Задачи:

- собрать summary для стейкхолдеров
- собрать рабочий вариант для execution
- подготовить Miro/Figma board structure
- сформировать 2-4 week execution roadmap

Артефакты:

- executive summary
- team working board
- next sprint roadmap

## Main Research Questions

На протяжении недели отвечаем на эти вопросы:

- Пользователь понимает, куда идти с главной?
- Есть ли четкое различие между `quickstart`, `interactive-tour`, `checklist` и полной docs?
- Есть ли broken, awkward или misleading transitions?
- Нет ли конфликтующих названий для одной и той же сущности?
- Не отстает ли одна поверхность от другой по текстам, изображениям или логике?
- Где система зависит от ручной синхронизации?
- Какие улучшения дадут самый большой эффект без смены концепции?

## Current Working Hypotheses

На текущий момент наиболее вероятные источники product friction:

1. Hybrid architecture повышает риск drift между поверхностями.
2. Quick Start и docs требуют более жесткой канонизации ролей.
3. Release gate недостаточно строгий для документационного продукта.
4. Interactive tour требует отдельной регулярной QA-проверки.
5. Asset governance для quickstart надо встроить в pipeline.

## Skills To Add

Следующий слой зрелости лучше усиливать не руками, а специальными рабочими навыками:

1. `smartplayer-release-audit`
2. `smartplayer-tour-qa`
3. `smartplayer-quickstart-sync`
4. `smartplayer-asset-budget`
5. `smartplayer-docs-governance`
6. `smartplayer-preview-publisher`
7. `smartplayer-ops-runbook`
8. `smartplayer-support-routing`

## Success Criteria

К концу недели должно быть готово:

1. Понятная карта всех поверхностей продукта
2. Понятная карта входов и переходов
3. Список реальных UX/UI/product проблем
4. Понятный backlog улучшений
5. Понятная связь между docs, quickstart, interactive-tour и checklist
6. Понятная схема, как не дать системе снова разъехаться
