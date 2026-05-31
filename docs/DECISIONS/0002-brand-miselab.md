# Decision 0002: Brand Name MiseLab

## Status

Accepted

## Context

The project started as a pastry school ice cream calculator. During product
discovery, the direction expanded toward a culinary calculation platform that
can eventually support schools, recipe modules, technical cards, RecipeHub
features, and API/AI integrations.

Names like RecipeLab and Chef Lab fit conceptually but showed crowded product or
trademark signals during early research. The `recipie.page` idea was rejected
because `recipie` reads as a misspelling of `recipe`.

## Decision

Use `MiseLab` as the product name.

Primary domain:

- `miselab.app`

Contact:

- `info@miselab.app`

## Why

- `mise` connects to `mise en place`: preparation, organization, and
  professional kitchen workflow.
- `lab` supports calculation, experimentation, teaching, and iteration.
- The name is not locked to ice cream or pastry only.
- The `.app` domain fits Telegram/PWA/app-first usage.

## Consequences

- The app metadata, PWA manifest, docs, and UI should use `MiseLab`.
- The old repository/package typo around `recipie` should not leak into product
  surfaces.
- Legal/trademark review is still needed before serious commercial launch.

## Brand Notes

Use `mise en place` as a core brand phrase and conceptual anchor. See
`docs/BRAND_NOTES.md`.
