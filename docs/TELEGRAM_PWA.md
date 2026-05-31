# Telegram And PWA Plan

## Telegram Mini App

1. Add a small Telegram adapter that detects `window.Telegram?.WebApp`.
2. Keep the adapter optional so regular browser/PWA mode still works.
3. On launch, send raw `initData` to a backend endpoint.
4. Validate `initData` on the backend using the bot token.
5. Create or link a profile by `telegram_id`.
6. Return a normal app session.
7. Apply Telegram theme params and viewport/safe-area behavior.
8. Support deep links for recipes, lessons, and assignments.

Never trust `initDataUnsafe` for authentication or authorization decisions.

## PWA

1. Replace template title, language, favicon, and metadata. Done.
2. Add `manifest.webmanifest`. Done.
3. Add installable icons. Basic SVG icons are present; production PNG/maskable
   assets can be added later.
4. Add `theme-color` and `apple-mobile-web-app-capable` metadata. Done.
5. Add a service worker only after the data-loading strategy is clear.
6. Cache static shell and read-only ingredient data first.
7. Avoid offline recipe writes until conflict handling is designed.
