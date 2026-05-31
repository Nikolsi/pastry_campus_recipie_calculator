import type {
  ComponentIngredient,
  IceCreamProfile,
  Ingredient,
  IngredientCore,
  IngredientProfile,
  IngredientProfileValues,
  IngredientScope,
} from "./types";

const toProfileValues = <TValues extends IngredientProfileValues>(
  values: TValues,
): IngredientProfileValues => values;

export function toIngredientCore(
  ingredient: Ingredient,
  scope: IngredientScope = "system",
): IngredientCore {
  const names = [
    ingredient.name_ru
      ? { locale: "ru", value: ingredient.name_ru }
      : undefined,
  ].filter((name): name is { locale: string; value: string } => Boolean(name));

  return {
    id: ingredient.id,
    name: ingredient.name,
    name_ru: ingredient.name_ru,
    scope,
    names: names.length > 0 ? names : undefined,
  };
}

export function toIceCreamProfile(ingredient: Ingredient): IceCreamProfile {
  return {
    fat: ingredient.fat,
    lactose: ingredient.lactose,
    protein: ingredient.protein,
    solids: ingredient.solids,
    sugars: ingredient.sugars,
    water: ingredient.water,
    pod: ingredient.pod,
    pac: ingredient.pac,
    cocoa_nf: ingredient.cocoa_nf,
  };
}

export function toNutritionProfileValues(
  ingredient: Ingredient,
): IngredientProfileValues {
  return toProfileValues({
    protein: ingredient.protein,
    fat: ingredient.fat,
    sugars: ingredient.sugars,
  });
}

export function toIngredientProfileRecords(
  ingredient: Ingredient,
): IngredientProfile[] {
  return [
    {
      type: "ice_cream",
      values: toProfileValues({ ...toIceCreamProfile(ingredient) }),
    },
    {
      type: "nutrition",
      values: toNutritionProfileValues(ingredient),
    },
  ];
}

export function toComponentIngredient(
  ingredient: Ingredient,
): ComponentIngredient {
  return {
    core: toIngredientCore(ingredient),
    profiles: toIngredientProfileRecords(ingredient),
  };
}

export function toComponentIngredients(
  ingredients: Ingredient[],
): ComponentIngredient[] {
  return ingredients.map(toComponentIngredient);
}

export function fromCoreAndIceCreamProfile(
  core: IngredientCore,
  profile: IceCreamProfile,
): Ingredient {
  return {
    ...core,
    ...profile,
  };
}
