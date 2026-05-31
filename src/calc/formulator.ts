import type { Ingredient, LineItem, Totals } from '../domain/types';

const num = (v: unknown): number => (Number.isFinite(Number(v)) ? Number(v) : 0);

/**
 * Normalize recipe so that total grams = 1000
 */
export function normalizeTo1000(items: LineItem[]): LineItem[] {
    const totalG = items.reduce((sum, item) => sum + num(item.grams), 0);

    if (totalG <= 0) {
        return items; // nothing to normalize
    }

    const factor = 1000 / totalG;

    return items.map((item) => ({
        ...item,
        grams: num(item.grams) * factor,
    }));
}

/**
 * Normalize to 1000g then multiply by kg
 */
export function scaleToKg(items: LineItem[], kg: number): LineItem[] {
    const kgValue = num(kg);
    if (kgValue <= 0) {
        return items.map((item) => ({ ...item, grams: 0 }));
    }

    const normalized = normalizeTo1000(items);

    return normalized.map((item) => ({
        ...item,
        grams: num(item.grams) * kgValue,
    }));
}

/**
 * Compute totals based on ingredient data.
 * Ingredient values are per 100g, so contribution = (grams / 100) * value
 */
export function computeTotals(
    items: LineItem[],
    ingredientById: Map<string, Ingredient>
): Totals {
    let sugarsG = 0;
    let fatG = 0;
    let proteinG = 0;
    let lactoseG = 0;
    let solidsG = 0;
    let waterG = 0;
    let cocoaNFG = 0;
    let podUnits = 0;
    let pacUnits = 0;
    let totalG = 0;

    for (const item of items) {
        const grams = num(item.grams);
        if (grams <= 0) continue;

        const ingredient = ingredientById.get(item.ingredientId);
        if (!ingredient) continue; // skip unknown ingredient entirely

        totalG += grams;

        // Contribution = (grams / 100) * value
        const factor = grams / 100;

        sugarsG += factor * num(ingredient.sugars);
        fatG += factor * num(ingredient.fat);
        proteinG += factor * num(ingredient.protein);
        lactoseG += factor * num(ingredient.lactose);
        solidsG += factor * num(ingredient.solids);
        waterG += factor * num(ingredient.water);
        cocoaNFG += factor * num(ingredient.cocoa_nf);
        podUnits += factor * num(ingredient.pod);
        pacUnits += factor * num(ingredient.pac);
    }

    // Percent fields are totals / 1000
    const sugarsPct = sugarsG / 1000;
    const fatPct = fatG / 1000;
    const proteinPct = proteinG / 1000;
    const lactosePct = lactoseG / 1000;
    const solidsPct = solidsG / 1000;
    const waterPct = waterG / 1000;

    // POD% = podUnits / 1000
    const podPct = podUnits / 1000;

    // PAC = pacUnits (not divided by 1000)
    const pac = pacUnits;

    // Temp estimate = PAC / waterPct / -45.5
    const tempServeC = waterPct > 0 ? pac / waterPct / -45.5 : 0;

    // equalizer = 1000 - totalG
    const equalizer = 1000 - totalG;

    return {
        totalG: num(totalG),
        equalizer: num(equalizer),
        sugarsG: num(sugarsG),
        fatG: num(fatG),
        proteinG: num(proteinG),
        lactoseG: num(lactoseG),
        solidsG: num(solidsG),
        waterG: num(waterG),
        cocoaNFG: num(cocoaNFG),
        podUnits: num(podUnits),
        pacUnits: num(pacUnits),
        sugarsPct: num(sugarsPct),
        fatPct: num(fatPct),
        proteinPct: num(proteinPct),
        lactosePct: num(lactosePct),
        solidsPct: num(solidsPct),
        waterPct: num(waterPct),
        podPct: num(podPct),
        pac: num(pac),
        tempServeC: num(tempServeC),
    };
}
