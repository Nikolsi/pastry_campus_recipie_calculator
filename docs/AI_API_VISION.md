# Long-Term AI And API Vision

This is a long-term direction, not MVP scope.

The platform should eventually be useful not only for humans in the UI, but also
for AI services, assistants, search engines, recipe tools, school systems, and
automation workflows.

## Direction

- API-first domain model.
- Stable public identifiers for recipes, ingredients, calculator modules,
  metrics, and snapshots.
- Machine-readable recipe and calculation outputs.
- Versioned formulas and calculation snapshots.
- Clear permissions for private, school, shared, and public resources.
- Public documentation when the API is mature enough.

## Why It Matters

This supports:

- AI assistants that can calculate, critique, or adapt recipes.
- External school tools and Telegram bots.
- GEO/SEO-friendly public recipe or knowledge pages later.
- Technical card generation and recipe audits.
- Costing, nutrition, and procurement automations.

## API Shape To Preserve

Future APIs should expose concepts like:

```text
GET /calculator-modules
GET /metric-definitions?module=ice_cream
GET /ingredients
GET /ingredients/{id}
POST /recipes
POST /recipes/{id}/calculate
GET /recipes/{id}/snapshots/{snapshotId}
POST /exports/technical-card
```

## Machine-Readable Outputs

Calculations should be serializable as structured data:

```json
{
  "calculatorModule": "ice_cream",
  "formulaVersion": "ice-cream-v1",
  "totals": {
    "waterPct": 0.62,
    "solidsPct": 0.38,
    "pac": 60
  },
  "validation": [
    {
      "metric": "waterPct",
      "status": "ok",
      "actual": 62,
      "expected": { "min": 58, "max": 64 }
    }
  ]
}
```

## Design Implications Now

- Do not couple calculations only to UI labels.
- Keep metric codes stable and language-independent.
- Keep recipe snapshots versioned.
- Avoid recipe data that can only be understood by rendering the UI.
- Keep calculator modules explicit.
- Keep API permissions and school ownership in the domain model.

## Not MVP

Do not build a public AI API now. The current job is to preserve the option by
choosing clean domain boundaries, stable IDs, and machine-readable snapshots.

