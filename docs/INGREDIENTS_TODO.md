# Ingredients TODO Before Database

The current `Ingredient` interface is shaped by the static calculator dataset.
Before creating production database migrations, review which fields are truly
required and which should be optional, derived, or calculator-specific.

This review must account for future calculator modules: ice cream, chocolate
bars, molded chocolate bonbons, praline fillings, dough, pizza, sourdough,
nutrition, costing, and export reports. See `docs/CALCULATOR_PLATFORM.md`.

## Current Frontend Fields

```ts
interface Ingredient {
  id: number;
  name: string;
  fat: number;
  lactose: number;
  protein: number;
  solids: number;
  sugars: number;
  water: number;
  pod: number;
  pac: number;
  cocoa_nf?: number;
  name_ru?: string;
}
```

## Proposed Required Core

- `id` or future database UUID
- `name`
- `scope`: system, school, or user
- `created_at`
- `updated_at`

## Probably Required For Ice Cream Calculator

These can remain required for system ice cream ingredients, but should be
reviewed before becoming globally required DB columns:

- `water`
- `solids`
- `sugars`
- `fat`
- `protein`
- `lactose`
- `pod`
- `pac`

## Probably Optional

- `cocoa_nf`
- `name_ru`
- `name_es`
- `category`
- `source`
- `notes`
- `brand`
- `supplier`
- `school_id`
- `created_by`

## Open Questions

1. Should `water + solids = 100` be enforced by validation, DB constraint, or
   warning only?
2. Should `solids` be stored, or derived from `100 - water` when possible?
3. Should `pod` and `pac` be stored per ingredient, or calculated by sugar type
   composition later?
4. Do school/user custom ingredients need partial nutrient profiles?
5. Should calculator-specific fields live in JSONB profiles instead of the main
   `ingredients` table?
6. How should future chocolate calculator fields be modeled without polluting
   ice cream ingredients?

## Database Design Direction

Prefer a small core `ingredients` table plus optional profiles:

```text
ingredients
  id
  name
  names/translations
  scope
  ownership fields
  metadata

ingredient_profiles
  ingredient_id
  profile_type
  values jsonb
```

Example profile types:

- `nutrition`
- `ice_cream`
- `cost`
- `chocolate`
- `dough`

For the first migration, avoid making ice-cream-only fields mandatory on the
core ingredient record. If speed matters, strongly typed frontend helpers can
still adapt profile JSON into TypeScript objects.

## Pre-Migration Tasks

- Audit which current UI/calculation code actually reads each ingredient field.
- Decide if custom ingredients can be saved with incomplete data.
- Decide validation behavior for missing nutrient values.
- Add seed transformation from `src/data/ingredients.json`.
- Add tests for missing optional fields before relaxing frontend types.
- Update `Ingredient` type to distinguish core identity from ice cream profile.
  Initial frontend component/profile types are now in place.
- Decide profile type names and which profile is required by the MVP ice cream
  calculator.
