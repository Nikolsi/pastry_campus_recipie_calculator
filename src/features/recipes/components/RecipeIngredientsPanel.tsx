import { Trash2 } from "lucide-react";

import type { Ingredient, LineItem } from "@/domain/types";
import { IngredientCombobox } from "@/components/IngredientCombobox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { normalizeRecipeNumberInput } from "@/features/recipes/lib/recipeLineItems";

interface RecipeIngredientsPanelProps {
  ingredients: Ingredient[];
  items: LineItem[];
  totalG: number;
  getDisplayName: (ingredientId: string) => string;
  onAddIngredient: (ingredientId: string) => void;
  onUpdateGrams: (id: string, grams: number) => void;
  onRemoveItem: (id: string) => void;
  onNormalizeTo1000: () => void;
}

export function RecipeIngredientsPanel({
  ingredients,
  items,
  totalG,
  getDisplayName,
  onAddIngredient,
  onUpdateGrams,
  onRemoveItem,
  onNormalizeTo1000,
}: RecipeIngredientsPanelProps) {
  const updateFromInput = (id: string, rawValue: string) => {
    const normalized = normalizeRecipeNumberInput(rawValue);
    onUpdateGrams(id, normalized === "" ? 0 : Number(normalized));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Шаг 2 — Добавьте ингредиенты
        </CardTitle>
        <CardDescription>
          Используйте поиск для быстрого добавления ингредиентов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <IngredientCombobox
          ingredients={ingredients}
          onSelect={onAddIngredient}
          placeholder="Выберите ингредиент..."
          addedIngredientIds={items.map((item) => item.ingredientId)}
        />

        {items.length > 0 && (
          <div className="flex items-center justify-between">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground px-3">
              Добавлено ингредиентов: {items.length}
            </span>
            <Separator className="flex-1" />
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Начните с выбора ингредиентов из выпадающего списка выше
            </p>
            <p className="text-xs text-muted-foreground">
              Введите количество в граммах для каждого ингредиента
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="hidden sm:block">
              <div className="grid grid-cols-[1fr_120px_48px] gap-2 font-medium text-sm mb-2">
                <div>Ингредиент</div>
                <div className="text-right">Граммы</div>
                <div />
              </div>
              <Separator className="mb-2" />
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_120px_48px] gap-2 items-center py-1"
                >
                  <div className="text-sm truncate">
                    {getDisplayName(item.ingredientId)}
                  </div>
                  <Input
                    inputMode="numeric"
                    value={item.grams}
                    onChange={(event) =>
                      updateFromInput(item.id, event.target.value)
                    }
                    min="0"
                    step="1"
                    className="tabular-nums text-right"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Удалить ингредиент"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="sm:hidden space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border bg-background p-3 space-y-2"
                >
                  <div className="font-medium text-sm">
                    {getDisplayName(item.ingredientId)}
                  </div>
                  <div className="grid grid-cols-[1fr_44px] gap-2">
                    <Input
                      inputMode="numeric"
                      value={item.grams}
                      onChange={(event) =>
                        updateFromInput(item.id, event.target.value)
                      }
                      min="0"
                      step="1"
                      placeholder="Граммы"
                      className="tabular-nums"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Удалить ингредиент"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {items.length > 0 && (
          <div className="space-y-2 pt-2">
            <Separator />
            <div
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 border-2 font-semibold",
                Math.abs(totalG - 1000) < 1
                  ? "border-emerald-400 bg-emerald-50/40"
                  : "border-rose-400 bg-rose-50/40 text-rose-700",
              )}
            >
              <span>ИТОГО</span>
              <span className="tabular-nums text-lg">
                {totalG.toFixed(0)} г
              </span>
            </div>
            {Math.abs(totalG - 1000) >= 1 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onNormalizeTo1000}
              >
                Нормализовать до 1000 г
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
