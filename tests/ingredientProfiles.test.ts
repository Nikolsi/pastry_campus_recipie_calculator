import assert from "node:assert/strict";
import test from "node:test";

import {
  fromCoreAndIceCreamProfile,
  toComponentIngredient,
  toComponentIngredients,
  toIceCreamProfile,
  toIngredientCore,
  toIngredientProfileRecords,
} from "../src/domain/ingredientProfiles.js";
import type { Ingredient } from "../src/domain/types.js";

const ingredient: Ingredient = {
  id: 42,
  name: "Leche entera",
  name_es: "Leche entera",
  name_ru: "Цельное молоко",
  fat: 3.6,
  lactose: 4.6,
  protein: 3.1,
  solids: 12.5,
  sugars: 4.6,
  water: 87.5,
  pod: 0.736,
  pac: 9,
  cocoa_nf: 0,
};

test("toIngredientCore keeps identity, translations, and default scope", () => {
  const core = toIngredientCore(ingredient);

  assert.equal(core.id, 42);
  assert.equal(core.name, "Leche entera");
  assert.equal(core.name_es, "Leche entera");
  assert.equal(core.name_ru, "Цельное молоко");
  assert.equal(core.scope, "system");
  assert.deepEqual(core.names, [
    { locale: "es", value: "Leche entera" },
    { locale: "ru", value: "Цельное молоко" },
  ]);
});

test("toIceCreamProfile extracts ice cream calculation fields", () => {
  assert.deepEqual(toIceCreamProfile(ingredient), {
    fat: 3.6,
    lactose: 4.6,
    protein: 3.1,
    solids: 12.5,
    sugars: 4.6,
    water: 87.5,
    pod: 0.736,
    pac: 9,
    cocoa_nf: 0,
  });
});

test("toIngredientProfileRecords creates ice cream and nutrition profiles", () => {
  const profiles = toIngredientProfileRecords(ingredient);

  assert.deepEqual(
    profiles.map((profile) => profile.type),
    ["ice_cream", "nutrition"],
  );
  assert.equal(profiles[0]!.values.water, 87.5);
  assert.equal(profiles[0]!.values.pac, 9);
  assert.equal(profiles[1]!.values.protein, 3.1);
  assert.equal(profiles[1]!.values.sugars, 4.6);
});

test("toComponentIngredient separates core and profiles", () => {
  const componentIngredient = toComponentIngredient(ingredient);

  assert.equal(componentIngredient.core.id, ingredient.id);
  assert.equal(componentIngredient.profiles.length, 2);
  assert.equal(componentIngredient.profiles[0]!.type, "ice_cream");
});

test("toComponentIngredients transforms a dataset", () => {
  const result = toComponentIngredients([ingredient]);

  assert.equal(result.length, 1);
  assert.equal(result[0]!.core.name, ingredient.name);
});

test("fromCoreAndIceCreamProfile rebuilds the compatibility Ingredient shape", () => {
  const core = toIngredientCore(ingredient, "school");
  const profile = toIceCreamProfile(ingredient);
  const rebuilt = fromCoreAndIceCreamProfile(core, profile);

  assert.equal(rebuilt.id, ingredient.id);
  assert.equal(rebuilt.scope, "school");
  assert.equal(rebuilt.water, ingredient.water);
  assert.equal(rebuilt.pac, ingredient.pac);
});

