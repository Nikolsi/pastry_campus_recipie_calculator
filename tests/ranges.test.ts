import assert from "node:assert/strict";
import test from "node:test";

import { validateTotals } from "../src/calc/ranges.js";
import type { Totals } from "../src/domain/types.js";

function createTotals(overrides: Partial<Totals> = {}): Totals {
  return {
    totalG: 1000,
    equalizer: 0,
    sugarsG: 200,
    fatG: 100,
    proteinG: 40,
    lactoseG: 60,
    solidsG: 380,
    waterG: 620,
    cocoaNFG: 0,
    podUnits: 300,
    pacUnits: 60,
    sugarsPct: 0.2,
    fatPct: 0.1,
    proteinPct: 0.04,
    lactosePct: 0.06,
    solidsPct: 0.38,
    waterPct: 0.62,
    podPct: 0.3,
    pac: 60,
    tempServeC: -2.13,
    ...overrides,
  };
}

test("validateTotals accepts a balanced helado profile", () => {
  const result = validateTotals(createTotals(), "HELADO");

  assert.equal(result.overallOk, true);
  assert.equal(result.checks.length, 8);
  assert.equal(result.checks.every((check) => check.ok), true);
});

test("validateTotals reports out-of-range helado metrics", () => {
  const result = validateTotals(
    createTotals({
      sugarsPct: 0.1,
      pac: 90,
    }),
    "HELADO",
  );

  const sugars = result.checks.find((check) => check.key === "sugarsPct");
  const pac = result.checks.find((check) => check.key === "pac");

  assert.equal(result.overallOk, false);
  assert.equal(sugars?.ok, false);
  assert.equal(sugars?.actual, "10.00%");
  assert.equal(pac?.ok, false);
  assert.equal(pac?.actual, "90.00");
});

test("validateTotals applies sorbet-specific max rules", () => {
  const result = validateTotals(
    createTotals({
      sugarsPct: 0.28,
      fatPct: 0.02,
      proteinPct: 0.02,
      lactosePct: 0.01,
      solidsPct: 0.3,
      waterPct: 0.7,
      podPct: 0.2,
      pac: 50,
    }),
    "SORBETE",
  );

  const fat = result.checks.find((check) => check.key === "fatPct");
  const protein = result.checks.find((check) => check.key === "proteinPct");
  const lactose = result.checks.find((check) => check.key === "lactosePct");

  assert.equal(result.overallOk, false);
  assert.equal(fat?.expected, "≤ 1.00%");
  assert.equal(protein?.expected, "≤ 1.00%");
  assert.equal(lactose?.expected, "≤ 0.50%");
});

