# Decision 0003: Telegram Bot Backend And Repository Topology

## Status

Proposed

## Date

2026-06-01

## Context

The current prototype opens the React calculator from Telegram as an external
web page. The customer wants the Telegram bot to become a useful business tool:
quick calculator access, saved recipes, ingredient data, course visibility,
support, and future monetization.

BotFather can configure bot metadata, commands, and launch buttons, but it does
not provide product logic. Commands, inline buttons, callbacks, payments,
notifications, and access checks require a backend endpoint that Telegram can
call.

Telegram webhooks require a public HTTPS URL. Supabase is already the preferred
MVP backend direction in Decision 0001, and Supabase Edge Functions are a good
fit for short-lived HTTP handlers such as webhooks and Mini App auth exchange.

## Decision

Start with a managed/serverless backend instead of a VPS:

- Supabase Postgres/Auth/RLS for data and access control.
- Supabase Edge Functions for Telegram Mini App auth validation.
- Supabase Edge Functions for the initial Telegram bot webhook.
- Static frontend hosting for the Vite React app.
- No dedicated VPS for the MVP.

Keep the project in one repository for now. Add backend functions and database
migrations alongside the current frontend so schema, shared types, calculator
logic, bot commands, and UI changes can move together.

Recommended initial layout:

```text
src/
  calc/
  domain/
  lib/api/
  lib/telegram/

supabase/
  migrations/
  functions/
    telegram-auth/
    telegram-webhook/
```

If backend complexity grows, evolve this repository into a monorepo before
splitting it into separate repositories:

```text
apps/web
apps/api
apps/bot
packages/calc
packages/domain
packages/api-client
supabase/migrations
```

## Consequences

- The first backend can stay small and cheap to operate.
- The bot can become useful without rewriting the React calculator.
- Telegram, web/PWA, and the existing website can share the same backend access
  model.
- Calculator math remains reusable because `src/calc` stays independent from
  Telegram and backend concerns.
- Local development must include Supabase function workflows for webhook/auth
  logic.
- Edge functions should stay short-lived and idempotent.

## When To Revisit

Move to a dedicated Node service, container, or VPS if the product needs:

- long-running background workers;
- queue processing with retries and scheduled jobs;
- heavy PDF rendering or browser automation;
- dependencies that do not fit the Edge Function runtime;
- complex payment/course workflows that are hard to debug in serverless;
- stronger observability or operational control than managed functions provide.

Create a separate backend repository only if ownership, deployment cadence,
security boundaries, or team structure become genuinely separate.

## References

- Telegram Bot API webhooks: https://core.telegram.org/bots/api#setwebhook
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase Telegram bot example: https://supabase.com/docs/guides/functions/examples/telegram-bot
