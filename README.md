# MiseLab

MiseLab is a mobile-first culinary calculation workspace. The MVP starts with an
ice cream and sorbet recipe calculator for culinary/pastry schools, while the
architecture stays open to future calculator modules, technical cards, costing,
nutrition, recipe imports, and RecipeHub-style workflows.

## Product Focus

- First segment: culinary/pastry schools.
- First calculator: ice cream and sorbet formulation.
- Primary usage: mobile, Telegram, and PWA-friendly classroom flow.
- Long-term direction: modular culinary recipe calculation platform.

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

## Contact

- Product domain: `miselab.app`
- Email: `info@miselab.app`

## Notes

The current ingredient dataset is static and bundled with the frontend. Database,
accounts, Telegram auth, saved recipes, and exports are planned next steps.

