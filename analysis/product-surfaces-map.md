# SmartPlayer Docs — Product Surfaces Map

## Purpose

Этот документ фиксирует текущие поверхности продукта SmartPlayer Docs как единую систему.

Задача документа:

- развести роли поверхностей
- зафиксировать канонические entry points
- понять, где проходит граница между docs, quickstart, walkthrough и operational materials

## Product Model

Сейчас docs-продукт состоит из 6 пользовательских поверхностей:

1. Главная страница docs
2. Полная документация
3. Quick Start
4. Interactive Tour
5. Checklist
6. Внешние точки знаний и поддержки

## Surface 1 — Home

- Route: `/`
- Технический тип: Docusaurus page
- Основная роль: стартовый хаб для входа в систему документации
- Основная аудитория: новый пользователь, оператор, администратор, support
- Основной intent: понять, куда идти дальше
- Каноническая роль: навигационный dispatcher

Что должно происходить на этой поверхности:

- пользователь должен различить полный docs path, quickstart path, tour path и checklist path
- пользователь должен быстро понять, какой маршрут подходит для его задачи

Что уже работает хорошо:

- главная разводит entry points по сценариям
- есть быстрые входы в quickstart, tour, checklist и полное руководство

Основной риск:

- если этот слой снова начнёт смешивать обзор, обучение и эксплуатацию в одну плоскость, продукт снова станет ощущаться как набор разрозненных страниц

## Surface 2 — Full Documentation

- Основной route family: `/generated/*`, `/admin/*`, `/operations/*`
- Технический тип: Docusaurus docs
- Основная роль: канонический knowledge layer
- Основная аудитория: все роли, которым нужна полнота, а не только быстрый запуск
- Основной intent: найти полное объяснение, reference и регламенты
- Каноническая роль: source of truth по знаниям и рабочим процедурам

Что входит:

- старт и ориентация
- архитектура и развёртывание
- начало работы
- мониторинг и устройства
- контент
- трансляции
- расписания
- отчёты
- администрирование
- типовые ошибки
- регламенты

Что docs должны делать:

- объяснять полную модель продукта
- хранить reference и связанное знание
- служить канонической точкой терминологии

Что docs не должны делать:

- заменять quickstart как линейный first-run path
- заменять interactive-tour как guided visual onboarding

## Surface 3 — Quick Start

- Route: `/quickstart/`
- Реальный контент: `/quickstart-site/index.html`
- Технический тип: standalone HTML surface, подключенная в общий продукт через redirect/rewrite
- Основная роль: линейный сценарий первого запуска
- Основная аудитория: оператор внедрения, команда запуска, новый пользователь
- Основной intent: быстро пройти первый рабочий путь без чтения всего manual
- Каноническая роль: operational onboarding path

Что Quick Start должен делать:

- давать прямой пошаговый путь
- держать низкую когнитивную нагрузку
- быть практическим и сценарным

Что Quick Start не должен делать:

- конкурировать с полной docs как общий knowledge layer
- превращаться в параллельную каноническую документацию

Основная зависимость:

- quickstart живёт отдельно от docs shell и требует sync/compatibility поддержки

## Surface 4 — Interactive Tour

- Route: `/interactive-tour/`
- Технический тип: React page inside Docusaurus
- Контентная зависимость: использует реальные quickstart screenshots
- Основная роль: guided visual walkthrough
- Основная аудитория: новый пользователь, которому нужен быстрый визуальный обзор
- Основной intent: пройти базовый сценарий через реальные экраны без чтения всего quickstart
- Каноническая роль: visual onboarding layer

Что Interactive Tour должен делать:

- быстро показать ключевые шаги
- точно связывать текст и выделенную область
- снижать порог входа перед Quick Start

Что Interactive Tour не должен делать:

- подменять Quick Start как полный сценарий
- становиться псевдо-CMS или отдельным knowledge layer

Основная зависимость:

- точность тура зависит от стабильности и актуальности screenshot assets

## Surface 5 — Checklist

- Public route: `/checklist/`
- Канонический docs route: `/generated/17-13-чек-лист-запуска/`
- Технический тип: Docusaurus redirect page + docs content
- Основная роль: короткий operational gate перед запуском
- Основная аудитория: оператор внедрения, команда запуска, support
- Основной intent: быстро проверить готовность к старту или приёмке
- Каноническая роль: pre-launch and acceptance gate

Что Checklist должен делать:

- быть коротким и прикладным
- служить operational control point
- быть понятным финальным шагом после quickstart/tour

Что Checklist не должен делать:

- конкурировать с полной docs
- превращаться в длинное руководство

## Surface 6 — External Knowledge And Support

- Routes:
  - `https://wiki.smartplayer.org`
  - `https://smartplayer.atlassian.net/servicedesk/customer/portals`
- Технический тип: external systems
- Основная роль: extended knowledge и support escalation
- Основная аудитория: support, эксплуатация, администраторы, пользователи с нестандартными вопросами
- Основной intent: выйти за пределы публичной docs surface
- Каноническая роль: external extension layer

Что здесь важно:

- внешний контур не должен заменять канонические entry points docs-платформы
- переход во внешний контур должен быть осознанным и понятным

## Canonical Ownership Matrix

### If user wants overview

- Каноническая точка входа: `/interactive-tour/`
- Альтернатива: `/`

### If user wants first-run path

- Каноническая точка входа: `/quickstart/`
- Альтернатива: `/interactive-tour/`

### If user wants readiness gate

- Каноническая точка входа: `/checklist/`

### If user wants full explanation or reference

- Каноническая точка входа: `/generated/smartplayer-руководство/`

### If user wants admin / support detail

- Канонические точки входа:
  - `/admin/пользователи-и-роли/`
  - `/admin/история-и-аудит-действий/`
  - `/admin/операционный-регламент-администратора/`

## Current Structural Truth

На текущий момент продукт можно описать так:

- Home — выбирает маршрут
- Interactive Tour — показывает обзор и снижает порог входа
- Quick Start — ведёт по линейному first-run сценарию
- Checklist — закрывает запуск и приёмку
- Full docs — отвечает за полноту знаний и регламенты
- External systems — закрывают расширенное знание и поддержку

## Main Risks

1. `quickstart` и `generated/быстрый-старт` легко спутать как две канонические поверхности
2. `interactive-tour` зависит от quickstart screenshots, а значит подвержен visual drift
3. `checklist` должен оставаться коротким gate, иначе он начнет конкурировать с docs
4. внешние knowledge/support links могут уводить пользователя слишком рано, если основной docs shell теряет ясность

## What This Means For Product Decisions

Следующие улучшения должны усиливать не “красоту”, а ясность ролей:

- главная должна ещё жёстче разводить сценарии
- docs должны оставаться source of truth
- quickstart должен оставаться линейным operational guide
- tour должен оставаться визуальным guide
- checklist должен оставаться короткой operational проверкой
