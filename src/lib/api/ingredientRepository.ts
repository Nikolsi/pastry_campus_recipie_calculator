import type { Ingredient } from '@/domain/types';
import { supabase } from '@/lib/supabase';
import { ingredients as staticIngredients } from '@/data/ingredients';

type IceCreamIngredientRow = {
    id: string;
    legacy_id: number | null;
    name: string;
    name_ru: string | null;
    category: string | null;
    scope: string;
    created_by: string | null;
    fat: number | null;
    lactose: number | null;
    protein: number | null;
    solids: number | null;
    sugars: number | null;
    water: number | null;
    pod: number | null;
    pac: number | null;
    cocoa_nf: number | null;
};

function rowToIngredient(row: IceCreamIngredientRow): Ingredient {
    return {
        id: row.id,
        name: row.name,
        name_ru: row.name_ru ?? undefined,
        category: row.category ?? undefined,
        scope: (row.scope as 'system' | 'school' | 'user') ?? 'system',
        createdBy: row.created_by ?? undefined,
        fat: Number(row.fat ?? 0),
        lactose: Number(row.lactose ?? 0),
        protein: Number(row.protein ?? 0),
        solids: Number(row.solids ?? 0),
        sugars: Number(row.sugars ?? 0),
        water: Number(row.water ?? 0),
        pod: Number(row.pod ?? 0),
        pac: Number(row.pac ?? 0),
        cocoa_nf: Number(row.cocoa_nf ?? 0),
    };
}

export const ingredientRepository = {
    async list(): Promise<Ingredient[]> {
        const { data, error } = await supabase
            .from('ice_cream_ingredients')
            .select('*')
            .order('name');

        if (error || !data) {
            console.warn('[ingredientRepository] Supabase unavailable, using static data:', error?.message);
            return staticIngredients;
        }

        return (data as IceCreamIngredientRow[]).map(rowToIngredient);
    },
};
