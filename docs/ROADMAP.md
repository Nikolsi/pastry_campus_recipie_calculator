# Roadmap

## Phase 0: Stabilize Prototype

- Fix build/lint as the baseline quality gate.
- Extract recipe editor, totals, validation, and tools from `App.tsx`.
- Add unit tests for calculation and validation.
- Add basic PWA metadata.
- Replace template README with product-specific setup notes.

## Phase 1: Data Model

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

## Phase 3: Telegram And PWA

- Add Telegram Mini App bootstrap and theme support.
- Validate Telegram `initData` on the backend before trusting user identity.
- Add PWA manifest, installable icons, and safe-area-aware mobile layout.
- Support deep links to recipes or class assignments.

## Phase 4: Education Features

- Save recipe versions and calculation snapshots.
- Show guidance explaining what is out of range and why.
- Add teacher-created assignments and student submissions.
- Add export/share flows.

## Phase 5: More Calculators

- Generalize calculator types beyond ice cream.
- Move calculator-specific metrics, ranges, and UI panels behind calculator
  definitions.
- Add chocolate calculator only after the ice cream data model is stable.

