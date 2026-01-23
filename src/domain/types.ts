export interface Ingredient {
    id: number;
    name: string;
    fat: number;
    lactose: number;
    protein: number;
    solids: number;
    sugars: number;
    water: number;
    pod: number;
    pac: number;
    cocoa_nf?: number;
    name_ru?: string;
    [key: string]: string | number | undefined;
}

export interface LineItem {
    id: string;
    ingredientName: string;
    grams: number;
}

export interface Totals {
    totalG: number;
    equalizer: number;
    sugarsG: number;
    fatG: number;
    proteinG: number;
    lactoseG: number;
    solidsG: number;
    waterG: number;
    cocoaNFG: number;
    podUnits: number;
    pacUnits: number;
    sugarsPct: number;
    fatPct: number;
    proteinPct: number;
    lactosePct: number;
    solidsPct: number;
    waterPct: number;
    podPct: number;
    pac: number;
    tempServeC: number;
}
