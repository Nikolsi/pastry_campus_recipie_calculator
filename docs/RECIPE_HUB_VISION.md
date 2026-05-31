# RecipeHub Vision

This is long-term product vision, not MVP scope.

The product can grow beyond calculators into a RecipeHub: a place to import,
design, calculate, organize, teach, sell, and export culinary recipes.

## Possible Product Layers

- Recipe calculator modules.
- Recipe design workspace.
- Recipe import from social media, websites, images, PDFs, and notes.
- Recipe normalization and technical conversion.
- Culinary books and collections.
- School lessons, assignments, and student submissions.
- Technical cards, production sheets, costing reports, and nutrition reports.
- Private, school-only, shared, public, and paid recipe access.
- Creator/teacher monetization and closed accounts.
- API and AI-assisted recipe critique, adaptation, and generation.

## Core Objects To Preserve

The platform should treat these as durable objects:

```text
Recipe
Recipe Version
Recipe Source
Recipe Collection
Recipe Book
Calculator Module
Ingredient
Ingredient Profile
Metric Definition
Calculation Snapshot
Export Artifact
User/Profile
School/Organization
Access Policy
```

## Import Direction

Recipe import should eventually support:

- Raw text.
- Social media captions.
- URLs.
- Images/screenshots.
- PDFs and documents.
- Manual notes.

Imported recipes should keep source metadata and confidence state. A recipe
created from import should be editable and convertible into a technical recipe
with structured ingredients, steps, yields, and calculator profiles.

## Privacy And Monetization

Access should not be an afterthought. Recipes and books may be:

- Private.
- Shared with a school.
- Shared with a class/cohort.
- Public.
- Paid/locked.
- Licensed or sold by a creator/teacher.

This implies stable ownership, organization membership, access policies, and
export permissions from the start.

## Export Direction

Export artifacts should be versioned outputs:

- Technical card.
- Cost estimate.
- Nutrition report.
- Production sheet.
- Shopping/procurement list.
- Student feedback report.
- Recipe book chapter/page.

Exports should reference a recipe version and calculation snapshot so old
exports remain reproducible.

## Foundation Decisions Now

- Keep recipe versions instead of overwriting the only recipe state.
- Store source/import metadata separately from cleaned recipe data.
- Keep calculation snapshots versioned.
- Use stable IDs and language-independent codes.
- Design access policies before public or paid sharing.
- Keep recipe collections/books separate from calculator logic.
- Keep imports and AI extraction as adapters, not as the source of truth.

## Not MVP

The MVP remains focused on the ice cream calculator and future database/auth
foundation. RecipeHub features should influence architecture, but not distract
the first shippable product.

