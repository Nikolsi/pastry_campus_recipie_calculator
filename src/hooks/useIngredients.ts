import { useState, useEffect } from 'react';
import type { Ingredient } from '@/domain/types';
import { ingredientRepository } from '@/lib/api/ingredientRepository';

export function useIngredients() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ingredientRepository
            .list()
            .then(setIngredients)
            .finally(() => setLoading(false));
    }, []);

    return { ingredients, loading };
}
