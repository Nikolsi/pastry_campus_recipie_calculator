# Telegram And PWA Plan

## Product Direction

PastryCampus Calculator should become a Telegram-first web app, not a separate
chat-only bot rewrite.

The current prototype works because Telegram opens a hosted React page. That is
a good first step, but it means the bot itself has no product logic: no `/start`
flow, no inline buttons, no saved data, no course access, no payments, and no
notifications. BotFather can configure names, descriptions, menu buttons, and
commands, but real behavior requires a bot/backend server.

The target shape is:

```text
Telegram Bot
  /start, /calculator, /courses, /recipes, /support
  inline buttons, notifications, payment events, support entry points

React Telegram Mini App
  calculator UI, ingredient management, recipes, courses, account screens

Backend API
  users, Telegram auth, ingredients, recipes, courses, purchases, access grants

Database
  durable source of truth for school data, user data, recipes, and entitlements

Existing Website
  can keep using the same backend/API instead of becoming a separate system
```

The bot should be the Telegram-native entry point and assistant. The Mini App
should remain the rich interface for complex workflows such as recipe editing,
ingredient management, course browsing, and exports.

## Telegram-Led School Operations

The expected customer workflow is not a full public course website first. The
school already runs much of its business manually through Telegram: course
sales, announcements, support, curator help, community touchpoints, and live
stream announcements.

The product should therefore treat Telegram as the primary operating channel for
school workflows:

- Show the student's available courses and calculator access.
- Announce new courses, course updates, live streams, and deadlines.
- Let students quickly open the calculator, saved recipes, and course-linked
  tools.
- Route support and curator questions from the bot.
- Reflect purchases or manual access grants made by the school.
- Support future Telegram-native purchases once packaging is clear.

The existing website can remain a checkout, landing, or content host where
needed, but it should not be required as the central experience for the Telegram
MVP.

## Instagram-To-Telegram Funnel

One likely acquisition path is:

```text
Instagram ad/story/post
  -> Telegram deep link with campaign/source payload
  -> bot onboarding
  -> course offer
  -> payment or manual sales confirmation
  -> course entitlement
  -> cohort assignment
  -> curator/support chat access
  -> course updates, live streams, reminders, calculator tools
```

The bot should preserve attribution from the first deep link when possible, for
example `instagram_story_june`, `gelato_launch`, or a compact campaign token.
Telegram deep links can pass a `/start` parameter to the bot; the backend should
store that value as lead/source metadata instead of relying on frontend-only
analytics.

After purchase, the backend should assign the user to a course cohort. A cohort
can control:

- course access dates;
- curator or teacher assignment;
- group/channel/chat links;
- live stream schedule;
- reminder cadence;
- calculator add-ons or recipe packs included with the course.

Telegram chat joining should be designed as invite/request automation, not as a
silent forced add. The bot should generate or send an invite link for the
cohort chat/channel. If the chat uses join requests and the bot is an admin with
the required invite permissions, the bot can approve valid students
automatically after checking their enrollment or entitlement.

## Architecture Principles

- Keep React as the interface, not the source of business truth.
- Put durable product logic behind backend/API boundaries.
- Do not connect production database behavior as frontend-only logic.
- Keep `src/calc` pure and independent from React, Telegram, payments, and
  backend clients.
- Keep regular web/PWA access working alongside Telegram Mini App access.
- Store recipes and ingredients by stable IDs, not names.
- Treat Telegram identity as untrusted until backend validation succeeds.
- Add monetization and course access as entitlements, not hard-coded UI flags.

## Bot Server Responsibilities

A useful Telegram bot needs a small server even before the full education
platform exists. The first bot server can be intentionally thin:

```text
Telegram update webhook
  -> command handlers
  -> inline keyboard handlers
  -> Mini App launch buttons
  -> support commands
  -> payment callbacks later
```

Initial commands:

- `/start` - onboarding and primary buttons.
- `/calculator` or `/app` - open the Mini App.
- `/courses` - show owned courses and a link to available courses.
- `/recipes` - open saved recipes in the Mini App.
- `/support` - support entry point.
- `/paysupport` - required support path once Telegram payments are enabled.

Initial buttons:

- Open Calculator.
- My Recipes.
- My Courses.
- Buy Course.
- Contact Support.

This should make the bot feel like a product tool instead of a single external
link, while still keeping the complex UI inside the Mini App.

## Hosting Direction

Do not start with a VPS unless the product needs long-running background
workers, custom system packages, heavy PDF rendering, or operational control
that managed platforms cannot provide.

Recommended MVP hosting:

```text
Frontend
  Vite static app on Vercel, Netlify, Cloudflare Pages, or similar

Database/Auth
  Supabase Postgres/Auth/RLS

Bot/API functions
  Supabase Edge Functions first
  Cloudflare Workers or a small Node service later if needed
```

This keeps the first backend small: public HTTPS endpoints for Telegram
webhooks, Telegram Mini App auth, and app API calls. Telegram webhooks require a
public HTTPS URL, so local-only code or BotFather configuration is not enough.

Move to a dedicated Node service or VPS only when at least one of these becomes
true:

- The bot needs long-running jobs or queue workers.
- PDF export needs a full browser/runtime that does not fit edge functions.
- Payment/course workflows need more complex background retries.
- Observability, debugging, or dependency needs become painful in edge
  functions.
- Traffic or cost patterns make a persistent service simpler.

## Repository Direction

Keep this as one repository for now.

The current product is still small, and the frontend, calculator domain, schema,
Telegram bot, and API contracts need to evolve together. A single repository
allows atomic changes across the Mini App, migrations, shared types, and bot
handlers.

Recommended near-term layout:

```text
src/
  calc/                    pure calculator logic
  domain/                  shared frontend/domain types
  lib/api/                 browser API clients and repositories
  lib/telegram/            optional Telegram Mini App adapter

supabase/
  migrations/              database schema and RLS policies
  functions/
    telegram-auth/         validates Mini App initData and creates sessions
    telegram-webhook/      handles /start, buttons, callbacks, payments later
```

If the backend grows beyond Supabase functions, prefer evolving into a monorepo
before creating a separate repository:

```text
apps/web
apps/api
apps/bot
packages/calc
packages/domain
packages/api-client
supabase/migrations
```

Create a separate repository only if ownership, deployment cadence, or security
boundaries become genuinely separate. Premature repo splitting would make shared
types, migrations, and calculator behavior harder to keep aligned.

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

## Backend/API Foundation

The important near-term decision is to move data access behind an API before the
database becomes deeply tied to the React client.

Useful early endpoints:

```text
GET  /api/me
GET  /api/ingredients
POST /api/ingredients
GET  /api/recipes
POST /api/recipes
GET  /api/my-courses
GET  /api/my-entitlements
```

Useful early tables:

```text
users
telegram_identities
schools
school_memberships
ingredients
recipes
recipe_items
courses
products
purchases
entitlements
exports
```

`entitlements` should be the central access model. A user can receive an
entitlement from a website purchase, a Telegram Stars purchase, a school admin,
a course enrollment, or a manual grant. The calculator UI should ask the
backend what the user can access instead of deciding locally.

## Course And Monetization Direction

The school may keep selling courses through the existing website at first. The
Telegram bot can still become useful immediately by showing owned courses,
opening the calculator quickly, linking support, and reflecting access from the
shared backend.

Recommended staged approach:

1. Keep website checkout as the first source of paid course purchases.
2. Sync website purchases into backend `purchases` and `entitlements`.
3. Let Telegram show owned courses and unlock calculator features based on
   entitlements.
4. Add paid calculator add-ons, course packs, PDF export, or Pro features on
   top of the same entitlement model.
5. Add Telegram-native payments after the product packaging is clear.

As of 2026-06-01, Telegram requires digital goods and services sold inside
Telegram bots or Mini Apps to use Telegram Stars. Do not plan to sell digital
courses, calculator add-ons, recipe packs, or Pro access inside Telegram through
Stripe, crypto, or external payment providers. External website checkout can
remain a separate channel, but Telegram-native purchases should be designed
around Stars.

References:

- Telegram Mini Apps: https://core.telegram.org/bots/webapps
- Telegram Stars payments: https://core.telegram.org/bots/payments-stars
- Bot API payments: https://core.telegram.org/bots/api#payments

## MVP Path

### Immediate Sprint: Bot-Ready Foundation

- Add a minimal Telegram webhook endpoint.
- Implement `/start`, `/calculator`, `/courses`, `/recipes`, and `/support`.
- Add Telegram Mini App auth validation on the backend.
- Add `GET /api/me`.
- Move ingredient loading behind a repository/API boundary.
- Keep static `ingredients.json` as a fallback while the database path is
  introduced.
- Do not add course monetization until users, ingredients, recipes, and
  entitlements have a clear data model.

### MVP 1: Make The Bot Alive

- Add a small bot server with a public HTTPS webhook.
- Implement `/start`, `/calculator`, `/courses`, `/recipes`, and `/support`.
- Send inline buttons that open the current calculator Mini App.
- Configure the menu button and main Mini App in BotFather.
- Keep "My Courses" and "Buy Course" as simple flows at first, even if they
  link to the existing website.

### MVP 2: Link Telegram Users To App Data

- Validate Telegram `initData` on the backend.
- Create or link a user by Telegram ID.
- Add `/api/me`.
- Store ingredient data in the database behind repository/API boundaries.
- Keep static JSON as a temporary fallback while migration is in progress.

### MVP 3: Saved Recipes

- Add recipe save/list/load flows.
- Store recipe items by ingredient ID.
- Add recipe ownership and school visibility rules.
- Add calculation snapshots so exported or reviewed recipes stay reproducible.

### MVP 4: Courses And Entitlements

- Add courses/products/entitlements.
- Show "My Courses" in Telegram and in the Mini App.
- Unlock calculator features from backend access checks.
- Sync existing website purchases into the same access model.

### MVP 5: Monetization And Exports

- Add Telegram Stars purchase flows for Telegram-native digital products.
- Add `/paysupport` and refund handling.
- Generate PDFs on the backend for stable exports.
- Add paid exports, Pro calculator features, course bundles, or recipe packs
  only after the entitlement model is in place.

## PWA

1. Replace template title, language, favicon, and metadata. Done.
2. Add `manifest.webmanifest`. Done.
3. Add installable icons. Basic SVG icons are present; production PNG/maskable
   assets can be added later.
4. Add `theme-color` and `apple-mobile-web-app-capable` metadata. Done.
5. Add a service worker only after the data-loading strategy is clear.
6. Cache static shell and read-only ingredient data first.
7. Avoid offline recipe writes until conflict handling is designed.
