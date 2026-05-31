# Handoff

Last updated: 2026-05-31

## Current State

- The app is a React/Vite/TypeScript calculator prototype.
- The codebase now has agent-facing docs in `AGENTS.md` and `docs/`.
- The recipe screen has been split from one large `App.tsx` into
  `src/features/recipes/components`.
- Recipe line items now reference ingredients by stable `ingredientId`.
- The calculation engine remains in `src/calc` and was not behaviorally changed.
- Unit tests exist in `tests/` and run via `npm test`.
- Product branding is `MiseLab`; domain/contact are `miselab.app` and
  `info@miselab.app`.
- Basic PWA manifest and app metadata are present.
- `npm run lint` passes.
- `npm run build` passes.

## Server State

- `http://127.0.0.1:5173/` was running during QA.
- It returned `HTTP/1.1 200 OK`.
- The Vite dev server was stopped before handoff, started again in Codex, and
  verified again with `HTTP/1.1 200 OK`.
- Browser runtime still failed to provide an `iab` context.

To restart:

```bash
npm run dev -- --host 127.0.0.1
```

## Why Move To Codex

The VSCode session did not expose a Browser plugin context. Browser discovery
returned no available in-app browser targets, so visual QA and screenshots
should be done after opening this project in Codex with Browser enabled.

Codex retry note: after Browser was enabled, discovery still returned `[]`.
After resetting the browser runtime, startup failed with
`sandbox-exec: execvp() of 'macos' failed`. The app itself was still reachable
over HTTP.

## Recommended Next Task

1. Start the dev server.
2. Open `http://127.0.0.1:5173/` in the in-app browser.
3. Smoke test desktop and mobile viewports.
4. Continue with database/domain model prep.

## Watch Outs

- The working tree includes user/pre-existing changes in package files,
  `IngredientCombobox`, and `drawer.tsx`. Do not revert them.
- The current static ingredient JSON should become database seed data later.
- `npm install --package-lock-only` reported 8 audit findings (3 moderate,
  5 high); not fixed yet.
