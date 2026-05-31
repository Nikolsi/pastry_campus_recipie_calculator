# PastryCampus Calculator

Mobile-first ice cream recipe calculator for pastry schools. Students add
ingredients, check the traffic-light balance panel, and learn why a recipe is
balanced or not. See `docs/MISELAB.md` for the broader platform vision.

## Product Focus

- Segment: culinary/pastry schools (custom order).
- Calculator: ice cream and sorbet formulation.
- Primary usage: mobile, Telegram Mini App, PWA classroom flow.
- Architecture: open to future calculator modules and platform convergence.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn-style UI primitives
- Node built-in test runner for focused unit tests

## Commands

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

For local Browser/PWA checks:

```bash
npm run dev -- --host 127.0.0.1
```

## Project Map

```text
src/
  App.tsx                    recipe screen container
  calc/                      pure calculator logic
  components/                shared UI and ingredient selector
  data/                      current static ingredient dataset
  domain/                    shared domain types
  features/recipes/          recipe UI panels and helpers
docs/                        product, architecture, QA, and handoff notes
tests/                       focused unit tests
```

## Notes

The current ingredient dataset is static and bundled with the frontend. Database,
accounts, Telegram auth, saved recipes, and exports are planned next steps
(see `docs/ROADMAP.md`).

