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
- Current lint baseline passes.

## Doing

- Handoff to Codex with Browser plugin for visual QA.
- Prepare the app structure for database-backed ingredients, accounts, and
  saved recipes.
- Keep mobile and Telegram Mini App usage as first-class constraints.

## Next

1. Move recipe lines from `ingredientName` to stable `ingredientId`.
2. Add a test runner and calculator unit tests.
3. Add PWA manifest and app metadata.
4. Add database migrations and seed current ingredients.
5. Add Telegram Mini App auth handshake via a backend endpoint.

## Blocked

- Backend provider/project is not created yet.
- Account model and school roles need final confirmation before production RLS.
- Visual in-app browser QA was not available from the VSCode session because
  `agent.browsers.list()` returned no browser contexts.

## Handoff Notes

- Last green checks: `npm run lint` and `npm run build`.
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
