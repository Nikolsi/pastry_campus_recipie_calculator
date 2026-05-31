# QA Notes

## Current Gates

- `npm test`
- `npm run build`
- `npm run lint`

Last known result: all gates passed on 2026-05-31 after adding calculator unit
tests.

## Dependency Audit

- `npm install --package-lock-only` reported 8 audit findings: 3 moderate and
  5 high.
- They were not fixed during the branding/PWA pass because `npm audit fix` may
  change dependency versions beyond the requested scope.

## Browser QA Status

- Local server was verified with `curl -I http://127.0.0.1:5173/`.
- The server was stopped before the first handoff.
- In-app browser QA was retried from Codex after enabling Browser. The runtime
  still did not expose an `iab` browser context; `agent.browsers.list()`
  returned `[]`.
- After resetting the browser runtime, startup failed with an environment-level
  `sandbox-exec: execvp() of 'macos' failed` error. This appears unrelated to
  the app code.

## Current Tests

- `normalizeTo1000` preserves ratios and returns 1000 g total.
- `scaleToKg` normalizes first, then scales to target batch size.
- `scaleToKg` clears grams for non-positive target kilograms.
- `computeTotals` uses ingredient values per 100 g.
- `computeTotals` skips unknown ingredient IDs intentionally.
- `validateTotals` accepts a balanced helado profile.
- `validateTotals` reports out-of-range helado metrics.
- `validateTotals` applies sorbet-specific max rules.

## Needed Tests

- Recipe totals should make educational sense when the recipe is not exactly
  1000 g.
- Ingredient selector should keep duplicate prevention when using IDs.
- Mobile drawer interaction needs browser/e2e coverage once Browser or
  Playwright is available.

## Manual Mobile Checks

- Add ingredient from search.
- Search by Russian and Spanish names.
- Open ingredient drawer on mobile viewport.
- Edit grams with mobile numeric keyboard.
- Remove an item.
- Normalize to 1000 g.
- Apply batch size.
- Verify no text overlaps at 320 px width.

## Telegram/PWA Checks Later

- App opens outside Telegram without crashing.
- App reads Telegram theme only when `window.Telegram?.WebApp` exists.
- Backend validates Telegram `initData`.
- PWA manifest is installable over HTTPS or localhost.
- Layout respects mobile safe areas.
