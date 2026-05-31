# Architecture

## Product Shape

The app is a mobile-first technical recipe calculator for pastry schools. The
first calculator is for ice cream formulation. Students should be able to open
it from Telegram, install it as a PWA, calculate recipes, and learn why a recipe
is balanced or not.

The long-term product is a multi-calculator culinary platform, not a single
hard-coded ice cream calculator. See `docs/CALCULATOR_PLATFORM.md` for the
platform model: ice cream, chocolate bars, molded chocolate bonbons, praline
fillings, dough, pizza, sourdough, costing, nutrition, and report exports should
share a stable recipe/ingredient core while keeping calculator-specific metrics
pluggable.

## Current Client

```text
src/
  App.tsx                    recipe screen feature container
  calc/
    formulator.ts            pure calculation helpers
    ranges.ts                validation rules and formatting
  components/
    IngredientCombobox.tsx   ingredient selector
    ui/                      shadcn-style primitives
  data/
    ingredients.json         static source data
    ingredients.ts           static loader
  domain/
    types.ts                 shared domain types
  features/
    recipes/                 recipe screen components and helpers
```

## Target Client Boundaries

```text
src/
  app/                       app shell, providers, routes
  features/recipes/          recipe editor, panels, hooks
  features/ingredients/      ingredient search and data access
  features/auth/             account and Telegram session state
  calc/                      pure calculator engines
  domain/                    shared domain model
  lib/api/                   backend clients and repositories
```

Keep `calc` independent from React, network calls, Supabase, Telegram, and
browser storage.

Future calculator modules should be introduced behind module boundaries instead
of adding all possible fields to the global recipe or ingredient types.

The frontend domain model now follows a lightweight component/profile approach:
ingredient core identity is separate from profiles such as ice cream, nutrition,
cost, dough, and chocolate. The current MVP `Ingredient` type remains a
compatibility alias for `IngredientCore & IceCreamProfile`.

The long-term API should also be machine-readable enough for AI services and
external tools. See `docs/AI_API_VISION.md`; this is not MVP scope, but it
reinforces the need for stable IDs, metric codes, module boundaries, and
versioned calculation snapshots.

The broader product can evolve into a RecipeHub for importing, designing,
organizing, monetizing, and exporting recipes. See `docs/RECIPE_HUB_VISION.md`.
This reinforces recipe versions, source metadata, collections/books, access
policies, and export artifacts as long-term domain concepts.

The go-to-market focus remains culinary/pastry schools first. See
`docs/GO_TO_MARKET.md`; broad platform ideas should shape foundations without
pulling the MVP away from classroom workflows.

## Backend Direction

Use a hosted Postgres backend with auth and row-level policies. Supabase is the
preferred MVP option because it covers Postgres, Auth, RLS, Edge Functions, and
storage with little custom infrastructure.

The client should talk to repositories instead of importing raw data directly:

```text
IngredientRepository
  list()
  search(query)
  getById(id)

RecipeRepository
  listMine()
  get(id)
  save(recipe)
```

Static JSON can remain as a fallback during migration.

## Telegram Direction

Telegram Mini App data must be treated as untrusted on the client. The client
sends `initData` to the backend. The backend validates the signature, creates or
finds the profile, then returns a normal app session.

The app should still work as a regular web/PWA app when Telegram APIs are not
present.
