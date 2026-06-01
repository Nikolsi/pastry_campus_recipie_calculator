# Roadmap

## Phase 0: Stabilize Prototype

- Fix build/lint as the baseline quality gate.
- Extract recipe editor, totals, validation, and tools from `App.tsx`.
- Store recipe line items by stable ingredient ID in the client.
- Add unit tests for calculation and validation.
- Add basic PWA metadata.
- Replace template README with product-specific setup notes.
- Keep school MVP scope explicit.

## Phase 1: Data Model

- Define calculator modules, metric definitions, and ingredient profiles before
  writing production migrations.
- Introduce database migrations for schools, profiles, ingredients, recipe
  types, validation rules, recipes, recipe items, and calculation snapshots.
- Seed the current `ingredients.json` data into the database.
- Keep a local fallback dataset until the API layer is stable.
- Store recipes by ingredient ID, not ingredient name.

## Phase 2: Accounts

- Add auth provider and profile creation.
- Support roles: admin, teacher, student.
- Add school membership and recipe visibility.
- Add row-level security policies before exposing write operations.
- Keep school/classroom workflows as the first account model.

## Phase 3: Telegram And PWA

- Add a minimal Telegram bot webhook/backend, preferably as a managed function
  before considering a VPS.
- Keep the frontend, bot functions, database migrations, and shared domain code
  in this repository until there is a real ownership or deployment reason to
  split them.
- Implement `/start`, `/calculator`, `/courses`, `/recipes`, and `/support` so
  the bot is more than a launcher button.
- Track Telegram deep-link campaign payloads for Instagram-to-bot funnels.
- Prepare cohort chat invite/join-request automation for paid students.
- Add Telegram Mini App bootstrap and theme support.
- Validate Telegram `initData` on the backend before trusting user identity.
- Add PWA manifest, installable icons, and safe-area-aware mobile layout.
- Support deep links to recipes or class assignments.

## Phase 4: Education Features

- Save recipe versions and calculation snapshots.
- Show guidance explaining what is out of range and why.
- Add teacher-created assignments and student submissions.
- Add export/share flows.

## Phase 4b: RecipeHub Foundations

- Add recipe versions and source metadata.
- Add recipe collections and culinary books.
- Add import adapters for raw text, URLs, images, PDFs, and social snippets.
- Add access policies for private, school, class, public, and paid resources.
- Add export artifacts linked to recipe versions and calculation snapshots.

## Phase 5: Calculator Platform

- Generalize calculator modules beyond ice cream.
- Move calculator-specific metrics, ranges, and UI panels behind calculator
  definitions.
- Add chocolate bars, molded chocolates, and praline fillings only after the
  ice cream module proves the shared platform boundaries.
- Add dough, pizza, sourdough, and bakery formulas after the same boundaries are
  stable.
- Add nutrition, costing, and report/export modules as cross-cutting features.

## Phase 6: API And AI Readiness

- Publish stable API contracts for calculator modules, metrics, ingredients,
  recipes, snapshots, and exports.
- Add machine-readable public/shared resources where permissions allow.
- Prepare documentation for external tools, school systems, Telegram bots, and
  AI services.
- Explore GEO/SEO content only after the domain API and permissions model are
  stable.

## Phase 7: Creator And Monetization

- Support closed creator/teacher accounts.
- Support paid recipe books, courses, or recipe packs.
- Add licensing, access grants, and export permissions.
- Add analytics only after privacy and consent rules are clear.
