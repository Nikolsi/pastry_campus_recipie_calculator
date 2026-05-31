# Architecture

## Product Shape

The app is a mobile-first technical recipe calculator for pastry schools. The
first calculator is for ice cream formulation. Students should be able to open
it from Telegram, install it as a PWA, calculate recipes, and learn why a recipe
is balanced or not.

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
