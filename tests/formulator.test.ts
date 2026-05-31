import assert from "node:assert/strict";
import test from "node:test";

import {
  computeTotals,
  normalizeTo1000,
  scaleToKg,
} from "../src/calc/formulator.js";
import type { Ingredient, LineItem } from "../src/domain/types.js";

const water: Ingredient = {
  id: "1",
  name: "Water",
  fat: 0,
  lactose: 0,
  protein: 0,
  solids: 0,
  sugars: 0,
  water: 100,
  pod: 0,
  pac: 0,
  cocoa_nf: 0,
};

const sucrose: Ingredient = {
  id: "2",
  name: "Sucrose",
  fat: 0,
  lactose: 0,
  protein: 0,
  solids: 100,
  sugars: 100,
  water: 0,
  pod: 100,
  pac: 100,
  cocoa_nf: 0,
};

const cream: Ingredient = {
  id: "3",
  name: "Cream",
  fat: 35,
  lactose: 3,
  protein: 2,
  solids: 40,
  sugars: 3,
  water: 60,
  pod: 0.5,
  pac: 3,
  cocoa_nf: 0,
};

const ingredientById = new Map(
  [water, sucrose, cream].map((ingredient) => [ingredient.id, ingredient]),
);

test("normalizeTo1000 preserves ingredient ratios", () => {
  const result = normalizeTo1000([
    { id: "water", ingredientId: water.id, grams: 200 },
    { id: "sucrose", ingredientId: sucrose.id, grams: 300 },
  ]);

  assert.equal(result.length, 2);
  assert.equal(result[0]!.grams, 400);
  assert.equal(result[1]!.grams, 600);
  assert.equal(
    result.reduce((sum, item) => sum + item.grams, 0),
    1000,
  );
});

test("scaleToKg normalizes first and then scales to target kilograms", () => {
  const result = scaleToKg(
    [
      { id: "water", ingredientId: water.id, grams: 200 },
      { id: "sucrose", ingredientId: sucrose.id, grams: 300 },
    ],
    2,
  );

  assert.equal(result.length, 2);
  assert.equal(result[0]!.grams, 800);
  assert.equal(result[1]!.grams, 1200);
  assert.equal(
    result.reduce((sum, item) => sum + item.grams, 0),
    2000,
  );
});

test("scaleToKg clears grams when target kilograms are not positive", () => {
  const result = scaleToKg(
    [
      { id: "water", ingredientId: water.id, grams: 200 },
      { id: "sucrose", ingredientId: sucrose.id, grams: 300 },
    ],
    0,
  );

  assert.deepEqual(
    result.map((item) => item.grams),
    [0, 0],
  );
});

test("computeTotals uses ingredient values per 100 grams", () => {
  const totals = computeTotals(
    [
      { id: "water", ingredientId: water.id, grams: 900 },
      { id: "sucrose", ingredientId: sucrose.id, grams: 100 },
    ],
    ingredientById,
  );

  assert.equal(totals.totalG, 1000);
  assert.equal(totals.sugarsG, 100);
  assert.equal(totals.solidsG, 100);
  assert.equal(totals.waterG, 900);
  assert.equal(totals.sugarsPct, 0.1);
  assert.equal(totals.waterPct, 0.9);
  assert.equal(totals.podUnits, 100);
  assert.equal(totals.pac, 100);
  assert.equal(totals.tempServeC, 100 / 0.9 / -45.5);
});

test("computeTotals skips unknown ingredient IDs", () => {
  const items: LineItem[] = [
    { id: "known", ingredientId: cream.id, grams: 100 },
    { id: "unknown", ingredientId: "999", grams: 100 },
  ];

  const totals = computeTotals(items, ingredientById);

  assert.equal(totals.totalG, 100);
  assert.equal(totals.fatG, 35);
  assert.equal(totals.waterG, 60);
  assert.equal(totals.equalizer, 900);
});
