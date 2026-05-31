# Project Status

Last updated: 2026-06-01

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
- Working product name is `PastryCampus Calculator` (custom school order);
  broader platform vision lives in `docs/MISELAB.md`.
- Basic PWA metadata and manifest are in place.
- Component/profile-based domain types are in place for calculator modules,
  metric definitions, ingredient core data, and optional profiles.
- Current `Ingredient` remains a compatibility type for ice cream ingredients:
  `IngredientCore & IceCreamProfile`.
- Static ingredients can now be adapted into `IngredientCore` plus `ice_cream`
  and `nutrition` profile records.
- Unit tests now cover the ingredient profile adapter.
- Current lint baseline passes.

## Doing

- Student-friendly UI: traffic-light balance panel (green/yellow/red) for 4
  key metrics (sugars, fat, solids, PAC) with explanations per direction.
- Ingredient total row in recipe panel (red border if ≠ 1000 g, green if ok).
- Phase 1: Supabase backend setup, DB migrations, custom ingredient entry.
- Keep mobile and Telegram Mini App usage as first-class constraints.
- Keep the domain open to broader culinary calculators beyond pastry.

## Next

1. Set up Supabase project (Postgres + Auth + RLS).
2. DB migrations: schools, ingredients, recipe types, recipes, recipe items.
3. Seed current `ingredients.json` into the database.
4. Add custom ingredient entry UI (school-scoped, stored in DB).
5. Add Telegram Mini App auth handshake via backend endpoint.
6. Review calculator module/profile model before additional migrations.

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
