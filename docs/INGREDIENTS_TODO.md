# Ingredients TODO Before Database

The current `Ingredient` interface is shaped by the static calculator dataset.
Before creating production database migrations, review which fields are truly
required and which should be optional, derived, or calculator-specific.

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

Prefer a small core `ingredients` table plus calculator-specific nutrition
profiles:

```text
ingredients
  id
  name
  names/translations
  scope
  ownership fields
  metadata

ingredient_nutrition_profiles
  ingredient_id
  calculator_type
  water
  solids
  sugars
  fat
  protein
  lactose
  pod
  pac
  cocoa_nf
  extra jsonb
```

For the first migration, it is acceptable to keep nutrient fields as columns on
`ingredients` if speed matters, but avoid making future-only fields mandatory.

## Pre-Migration Tasks

- Audit which current UI/calculation code actually reads each ingredient field.
- Decide if custom ingredients can be saved with incomplete data.
- Decide validation behavior for missing nutrient values.
- Add seed transformation from `src/data/ingredients.json`.
- Add tests for missing optional fields before relaxing frontend types.
- Update `Ingredient` type to distinguish core identity from ice cream profile.

