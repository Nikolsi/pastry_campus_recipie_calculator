# Project Status

Last updated: 2026-05-31

## Done

- React/Vite calculator prototype exists.
- Ice cream and sorbet validation ranges are implemented.
- Ingredient search has a mobile drawer flow.
- Static ingredient dataset is present and currently valid enough to seed a DB.
- Production build passes.
- `src/App.tsx` has been reduced to a feature container.
- Recipe screen UI is split into feature components under `src/features/recipes`.
- Recipe line items now store stable `ingredientId` values instead of
  ingredient names.
- Unit tests cover core calculation and validation behavior.
- Product brand is now `MiseLab`; primary domain is `miselab.app` and contact
  email is `info@miselab.app`.
- Basic PWA metadata and manifest are in place.
- Component/profile-based domain types are in place for calculator modules,
  metric definitions, ingredient core data, and optional profiles.
- Current `Ingredient` remains a compatibility type for ice cream ingredients:
  `IngredientCore & IceCreamProfile`.
- Current lint baseline passes.

## Doing

- Handoff to Codex with Browser plugin for visual QA.
- Prepare the app structure for database-backed ingredients, accounts, and
  saved recipes.
- Keep mobile and Telegram Mini App usage as first-class constraints.
- Keep the MVP focused on culinary/pastry schools as the first customer
  segment.
- Keep the domain open to broader culinary calculators beyond pastry: dough,
  pizza, sourdough, bakery formulas, nutrition, costing, and exports.
- Preserve long-term AI/API optionality with stable IDs, metric codes,
  calculator modules, and versioned snapshots. This is not MVP scope.
- Preserve RecipeHub optionality: recipe versions, imports, collections/books,
  access policies, monetization, and export artifacts. This is not MVP scope.
- Track naming research. `RecipeLab` fits conceptually but appears risky due to
  existing product/trademark signals; `Workbench` direction is worth exploring.

## Next

1. Keep school MVP scope documented while architecture stays extensible.
2. Review calculator module/profile model before database migrations.
3. Review ingredient required/optional fields before database migrations.
4. Add database migrations and seed current ingredients.
5. Add Telegram Mini App auth handshake via a backend endpoint.
6. Add browser/e2e coverage once Browser or Playwright is available.

## Blocked

- Backend provider/project is not created yet.
- Account model and school roles need final confirmation before production RLS.
- Visual in-app browser QA was not available from the VSCode session because
  `agent.browsers.list()` returned no browser contexts.

## Handoff Notes

- Last green checks: `npm test`, `npm run lint`, and `npm run build`.
- Local dev server was started at `http://127.0.0.1:5173/`, verified with
  `HTTP/1.1 200 OK`, and then stopped before handoff. It was started and
  verified again after moving to Codex.
- Browser plugin retry in Codex still did not expose `iab`; after a runtime
  reset it failed with `sandbox-exec: execvp() of 'macos' failed`.
- Existing pre-session changes are still present in `package.json`,
  `package-lock.json`, `src/components/IngredientCombobox.tsx`, and
  `src/components/ui/drawer.tsx`.
- New foundation docs were added under `docs/`, plus `AGENTS.md`.
- The next Codex Browser pass should run `npm run dev -- --host 127.0.0.1`,
  open `http://127.0.0.1:5173/`, and do a quick desktop/mobile smoke test.
- `npm install --package-lock-only` reported 8 audit findings (3 moderate,
  5 high). They were not fixed during the branding pass.
