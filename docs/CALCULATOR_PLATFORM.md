# Calculator Platform Model

The product should not become an ice-cream-only app with future features bolted
on. Ice cream is the first calculator module. The long-term shape is a modular
culinary recipe-calculation platform. Pastry schools are the first audience, but
the domain can expand into the wider culinary world.

## Potential Calculator Modules

- Ice cream and sorbet formulation.
- Chocolate bars.
- Molded chocolate bonbons.
- Praline fillings.
- Ganache, caramel, fruit fillings, and other pastry components.
- Pizza dough.
- Sourdough and preferments.
- Bread and viennoiserie formulas.
- Bakery hydration and fermentation calculators.
- Future calculators that are mostly ingredient constraints, target metrics,
  cost, yield, and export/report requirements.

## Design Principle

Keep the core recipe model stable and make calculator-specific behavior
pluggable:

```text
Recipe
  type/module
  line items
  target yield
  metadata

Ingredient
  identity
  ownership/scope
  translations
  optional profiles

Calculator Module
  supported ingredient profile
  metrics
  rules
  UI panels
  exports
```

Do not make ice-cream-specific fields globally required. A chocolate ingredient
or praline filling ingredient may need different technical attributes.

## Core Concepts

### Calculator Module

A calculator module defines:

- `code`: `ice_cream`, `chocolate_bar`, `molded_chocolate`,
  `praline_filling`, `pizza_dough`, `sourdough`.
- Available recipe types.
- Required ingredient profile type.
- Metrics it can calculate.
- Validation rules and recommended ranges.
- UI panels for editing and diagnostics.
- Export/report templates.

### Metric Definition

Metrics should be first-class data, not only hard-coded fields:

- Nutrition: protein, fat, carbs, sugars, lactose.
- Ice cream: solids, water, POD, PAC, serving temperature.
- Chocolate: cocoa solids, cocoa butter, sugar, viscosity-related values.
- Dough: flour basis, hydration, salt percentage, yeast/starter percentage,
  preferment share, fermentation time/temperature targets.
- Costing: unit cost, batch cost, cost per portion.
- Yield/reporting: target mass, loss percentage, output units.

The UI can still use strongly typed helpers for MVP modules, but the database
should not require every metric column on every ingredient.

### Ingredient Profiles

Ingredients have stable identity plus optional profiles:

```text
Ingredient Core
  id
  name
  translations
  category
  scope
  owner/school

Nutrition Profile
  protein
  fat
  carbohydrates
  sugars
  fiber
  salt
  calories

Ice Cream Profile
  water
  solids
  sugars
  fat
  protein
  lactose
  pod
  pac
  cocoa_nf

Cost Profile
  currency
  package size
  price
  waste/loss percentage

Chocolate Profile
  to be defined later

Dough Profile
  flour type
  protein strength
  absorption
  ash content
  starter hydration
  yeast type
```

Profiles can be strict per system ingredient but partial for user-entered draft
ingredients.

### Validation Rules

Validation rules should be data-driven where possible:

```text
recipe_type + metric + rule_type + threshold
```

Examples:

- Helado sugars between 16% and 24%.
- Sorbet fat max 1%.
- Chocolate bar cocoa solids within a target range.
- Filling water activity or shelf-life indicators later.
- Pizza dough hydration between target percentages.
- Sourdough inoculation percentage and fermentation targets.

### Reports And Exports

Recipes should eventually export as:

- Technical card.
- Student assignment/result.
- Cost estimate.
- Production batch sheet.
- Ingredient shopping list.
- Baker's percentage formula sheet.

Exports should read from recipe snapshots, not recompute old results with a
newer formula version.

## AI And External API Readiness

Long term, calculator modules and snapshots should be usable by external tools
and AI services through a documented API. This is not MVP scope, but module
codes, metric codes, stable IDs, and structured snapshots should be designed so
they can later be exposed safely. See `docs/AI_API_VISION.md`.

## MVP Boundary

For now:

- Keep ice cream formulas strongly typed in `src/calc`.
- Introduce names that imply modules and profiles rather than one global
  ingredient shape.
- Build the database draft around flexible profiles before writing migrations.
- Avoid implementing chocolate- or dough-specific logic until the module
  boundaries are proven by ice cream.
