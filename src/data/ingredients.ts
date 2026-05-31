import type { Ingredient } from '../domain/types';
import { toComponentIngredients } from '../domain/ingredientProfiles';
import ingredientsData from './ingredients.json';

// Runtime validation
if (!Array.isArray(ingredientsData) || ingredientsData.length === 0) {
    throw new Error("ingredients dataset is empty");
}

// Validate each ingredient has required fields
ingredientsData.forEach((ingredient, index) => {
    if (!ingredient.id || !ingredient.name) {
        throw new Error(`Ingredient at index ${index} is missing required fields (id or name)`);
    }
});

export const ingredients: Ingredient[] = ingredientsData.map((raw): Ingredient => ({
    id: String(raw.id),
    name: raw.name,
    name_ru: raw.name_ru ?? undefined,
    scope: 'system',
    fat: raw.fat,
    lactose: raw.lactose,
    protein: raw.protein,
    solids: raw.solids,
    sugars: raw.sugars,
    water: raw.water,
    pod: raw.pod,
    pac: raw.pac,
    cocoa_nf: raw.cocoa_nf,
}));

export const componentIngredients = toComponentIngredients(ingredients);

export const ingredientByName = new Map<string, Ingredient>(
    ingredients.map((i) => [i.name, i])
);

export const ingredientById = new Map<string, Ingredient>(
    ingredients.map((i) => [i.id, i])
);
