export type EntityId = number;

export type CalculatorModuleCode =
    | 'ice_cream'
    | 'chocolate_bar'
    | 'molded_chocolate'
    | 'praline_filling'
    | 'pizza_dough'
    | 'sourdough';

export type IngredientScope = 'system' | 'school' | 'user';

export type IngredientProfileType =
    | 'ice_cream'
    | 'nutrition'
    | 'cost'
    | 'dough'
    | 'chocolate';

export interface LocalizedName {
    locale: string;
    value: string;
}

export interface IngredientCore {
    id: number;
    name: string;
    name_ru?: string;
    name_es?: string;
    category?: string;
    scope?: IngredientScope;
    schoolId?: string;
    createdBy?: string;
    names?: LocalizedName[];
}

export interface IngredientProfile<TProfileType extends IngredientProfileType = IngredientProfileType> {
    type: TProfileType;
    values: Record<string, string | number | boolean | undefined>;
}

export interface IceCreamProfile {
    fat: number;
    lactose: number;
    protein: number;
    solids: number;
    sugars: number;
    water: number;
    pod: number;
    pac: number;
    cocoa_nf?: number;
}

export interface NutritionProfile {
    protein?: number;
    fat?: number;
    carbohydrates?: number;
    sugars?: number;
    fiber?: number;
    salt?: number;
    caloriesKcal?: number;
}

export interface CostProfile {
    currency?: string;
    price?: number;
    packageGrams?: number;
    wastePct?: number;
}

export interface DoughProfile {
    flourType?: string;
    proteinStrength?: number;
    absorptionPct?: number;
    ashPct?: number;
    starterHydrationPct?: number;
    yeastType?: string;
}

export interface ChocolateProfile {
    cocoaSolidsPct?: number;
    cocoaButterPct?: number;
    sugarPct?: number;
    milkSolidsPct?: number;
}

export interface CalculatorModule {
    code: CalculatorModuleCode;
    title: string;
    requiredProfileTypes: IngredientProfileType[];
    metricCodes: string[];
}

export interface MetricDefinition {
    code: string;
    label: string;
    unit?: string;
    valueType: 'number' | 'percent' | 'currency' | 'text';
    calculatorModuleCode?: CalculatorModuleCode;
}

export type Ingredient = IngredientCore & IceCreamProfile;

export interface LineItem {
    id: string;
    ingredientId: number;
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
