import { useState, useMemo } from "react";
import "./App.css";
import type { Ingredient, LineItem } from "./domain/types";
import { ingredients } from "./data/ingredients";
import { normalizeTo1000, computeTotals } from "./calc/formulator";
import { validateTotals, type RecipeType } from "./calc/ranges";
import { RecipeIngredientsPanel } from "@/features/recipes/components/RecipeIngredientsPanel";
import { RecipeTypeSelector } from "@/features/recipes/components/RecipeTypeSelector";
import { ValidationPanel } from "@/features/recipes/components/ValidationPanel";
import { createRecipeLineItem } from "@/features/recipes/lib/recipeLineItems";

function App() {
  const [recipeType, setRecipeType] = useState<RecipeType>("HELADO");
  const [items, setItems] = useState<LineItem[]>([]);

  const ingredientById = useMemo(() => {
    const map = new Map<number, Ingredient>();
    ingredients.forEach((ing) => {
      map.set(ing.id, ing);
    });
    return map;
  }, []);

  const totals = useMemo(
    () => computeTotals(items, ingredientById),
    [items, ingredientById]
  );

  const validation = useMemo(
    () => validateTotals(totals, recipeType),
    [totals, recipeType]
  );

  const addIngredientById = (ingredientId: number) => {
    setItems((currentItems) => {
      if (currentItems.some((item) => item.ingredientId === ingredientId)) {
        return currentItems;
      }

      return [...currentItems, createRecipeLineItem(ingredientId)];
    });
  };

  const updateGrams = (id: string, grams: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, grams: Number.isFinite(grams) ? grams : 0 }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const getDisplayName = (ingredientId: number): string => {
    const ing = ingredientById.get(ingredientId);
    return ing ? (ing.name_ru ?? ing.name) : `Ingredient #${ingredientId}`;
  };

  const handleNormalizeTo1000 = () => setItems(normalizeTo1000(items));

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">PastryCampus Calculator</h1>
        <p className="text-muted-foreground">
          Рассчитайте и проверьте баланс рецепта мороженого
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="space-y-4">
          <RecipeTypeSelector
            recipeType={recipeType}
            onRecipeTypeChange={setRecipeType}
          />

          <RecipeIngredientsPanel
            ingredients={ingredients}
            items={items}
            totalG={totals.totalG}
            getDisplayName={getDisplayName}
            onAddIngredient={addIngredientById}
            onUpdateGrams={updateGrams}
            onRemoveItem={removeItem}
            onNormalizeTo1000={handleNormalizeTo1000}
          />
        </div>

        <div className="space-y-4">
          <ValidationPanel
            itemCount={items.length}
            validation={validation}
            tempServeC={totals.tempServeC}
          />
        </div>
      </div>

    </div>
  );
}

export default App;
