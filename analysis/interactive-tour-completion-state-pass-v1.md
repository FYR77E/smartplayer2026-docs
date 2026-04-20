# Interactive Tour Completion State Pass V1

## Goal

Make the end of the interactive tour clearer and more action-oriented without changing the walkthrough itself.

## Real issue

The completion state already had the right links, but all three actions competed with each other:
- go to Quick Start
- open the checklist
- restart the tour

That made the hierarchy weaker right at the moment when the user should understand what to do next.

## Change made

- rewrote the completion text around a simple next-step sequence
- added a short ordered list with the recommended path after the tour
- kept only two main CTA buttons:
  - `Пошаговый старт`
  - `Чек-лист перед запуском`
- moved `Пройти ещё раз` into a lighter inline action

## Why this is safe

- no route logic changed
- no screenshot geometry changed
- no highlight zone changed
- the tour concept remains the same; only the handoff after completion became clearer

## Validation

- `npm run check:release:full` passed
