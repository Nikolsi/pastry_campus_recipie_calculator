# QA Notes

## Current Gates

- `npm run build`
- `npm run lint`

Last known result: both gates passed on 2026-05-31 after the feature component
split.

## Browser QA Status

- Local server was verified with `curl -I http://127.0.0.1:5173/`.
- The server was stopped before the first handoff.
- In-app browser QA was retried from Codex after enabling Browser. The runtime
  still did not expose an `iab` browser context; `agent.browsers.list()`
  returned `[]`.
- After resetting the browser runtime, startup failed with an environment-level
  `sandbox-exec: execvp() of 'macos' failed` error. This appears unrelated to
  the app code.

## Needed Tests

- `normalizeTo1000` preserves ratios and returns 1000 g total.
- `scaleToKg` normalizes first, then scales to target batch size.
- `computeTotals` uses ingredient values per 100 g.
- Unknown ingredients are reported or handled intentionally.
- Validation ranges format PAC differently from percent metrics.
- Recipe totals should make educational sense when the recipe is not exactly
  1000 g.

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
