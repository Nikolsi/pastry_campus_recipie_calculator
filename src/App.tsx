import { useState, useMemo } from "react";
import "./App.css";
import type { Ingredient, LineItem } from "./domain/types";
import { ingredients } from "./data/ingredients";
import { normalizeTo1000, scaleToKg, computeTotals } from "./calc/formulator";
import { validateTotals, type RecipeType } from "./calc/ranges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IngredientCombobox } from "@/components/IngredientCombobox";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function App() {
  const [recipeType, setRecipeType] = useState<RecipeType>("HELADO");
  const [items, setItems] = useState<LineItem[]>([]);
  const [batchKg, setBatchKg] = useState<number>(1);

  // Build ingredient map keyed by name
  const ingredientByName = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredients.forEach((ing) => {
      map.set(ing.name, ing);
    });
    return map;
  }, []);

  // Compute totals and validation
  const totals = useMemo(
    () => computeTotals(items, ingredientByName),
    [items, ingredientByName]
  );

  const validation = useMemo(
    () => validateTotals(totals, recipeType),
    [totals, recipeType]
  );

  // Add ingredient by name
  const addIngredientByName = (ingredientName: string) => {
    // Prevent duplicates
    if (items.some((item) => item.ingredientName === ingredientName)) {
      return;
    }
    const newItem: LineItem = {
      id: `${Date.now()}-${Math.random()}`,
      ingredientName,
      grams: 0,
    };
    setItems([...items, newItem]);
  };

  // Update grams for an item
  const updateGrams = (id: string, grams: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, grams: Number.isFinite(grams) ? grams : 0 }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Get display name for ingredient
  const getDisplayName = (ingredientName: string): string => {
    const ing = ingredientByName.get(ingredientName);
    return ing ? (ing.name_ru ?? ing.name) : ingredientName;
  };

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">
          Pastry Campus Recipe Calculator
        </h1>
        <p className="text-muted-foreground">
          Создайте и оптимизируйте рецепты мороженого
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Step 1: Recipe Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Шаг 1 — Выберите тип
              </CardTitle>
              <CardDescription>
                Выберите тип рецепта для настройки диапазонов валидации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRecipeType("HELADO")}
                  className={cn(
                    "h-12 text-base",
                    recipeType === "HELADO" &&
                      "bg-black text-white hover:bg-black/90 border-black"
                  )}
                >
                  Мороженое
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRecipeType("SORBETE")}
                  className={cn(
                    "h-12 text-base",
                    recipeType === "SORBETE" &&
                      "bg-black text-white hover:bg-black/90 border-black"
                  )}
                >
                  Сорбет
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Add Ingredients & Recipe */}
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
                onSelect={addIngredientByName}
                placeholder="Выберите ингредиент..."
                addedIngredientNames={items.map((item) => item.ingredientName)}
              />

              {items.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground px-3">
                      Добавлено ингредиентов: {items.length}
                    </span>
                    <Separator className="flex-1" />
                  </div>
                </>
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
                  {/* Desktop view */}
                  <div className="hidden sm:block">
                    <div className="grid grid-cols-[1fr_120px_80px] gap-2 font-medium text-sm mb-2">
                      <div>Ингредиент</div>
                      <div className="text-right">Граммы</div>
                      <div></div>
                    </div>
                    <Separator className="mb-2" />
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1fr_120px_80px] gap-2 items-center py-1"
                      >
                        <div className="text-sm truncate">
                          {getDisplayName(item.ingredientName)}
                        </div>
                        <Input
                          type="number"
                          value={item.grams}
                          onChange={(e) =>
                            updateGrams(item.id, Number(e.target.value))
                          }
                          step="0.1"
                          min="0"
                          className="tabular-nums text-right"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Mobile view */}
                  <div className="sm:hidden space-y-2">
                    {items.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="pt-4 space-y-2">
                          <div className="font-medium text-sm">
                            {getDisplayName(item.ingredientName)}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={item.grams}
                              onChange={(e) =>
                                updateGrams(item.id, Number(e.target.value))
                              }
                              step="0.1"
                              min="0"
                              placeholder="Граммы"
                              className="tabular-nums"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              Удалить
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Step 3: Validation */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-base sm:text-lg">
                    Шаг 3 — Проверьте баланс
                  </CardTitle>
                  <CardDescription>
                    {items.length === 0
                      ? "Валидация начнется после добавления ингредиентов"
                      : totals.totalG === 0 ||
                          Math.abs(totals.totalG - 1000) > 50
                        ? "Для корректной оценки диапазонов рекомендуется нормализовать до 1000 г (см. Экспериментальные инструменты)"
                        : "Все параметры проверяются на соответствие стандартам"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Добавьте ингредиенты для проверки баланса рецепта
                </div>
              ) : (
                <div className="space-y-2">
                  {validation.checks.map((check) => (
                    <div
                      key={check.key}
                      className={cn(
                        "rounded-lg px-3 py-2",
                        check.ok ? "bg-emerald-50/40" : "bg-rose-50/40"
                      )}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-2 min-w-0">
                          {check.ok ? (
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 mt-0.5 text-rose-600 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium leading-5 break-words">
                              {check.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Факт: {check.actual}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground sm:text-right break-words">
                          Ожидание: {check.expected}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Итоги</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Всего:</span>
                <span className="tabular-nums font-semibold">
                  {totals.totalG.toFixed(2)} г
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Эквалайзер:</span>
                <span className="tabular-nums font-semibold">
                  {totals.equalizer.toFixed(2)} г
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Температура подачи:</span>
                <span className="tabular-nums font-semibold">
                  {totals.tempServeC.toFixed(2)}°C
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Experimental Tools */}
      <Card className="mt-4 border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base sm:text-lg">
              Экспериментальные инструменты
            </CardTitle>
            <Badge variant="secondary" className="w-fit">
              Experimental
            </Badge>
          </div>
          <CardDescription>
            Инструменты могут измениться в будущих версиях
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Button
            onClick={() => setItems(normalizeTo1000(items))}
            variant="secondary"
            disabled={items.length === 0}
          >
            Нормализовать до 1000 г
          </Button>

          <div className="flex gap-2 items-end">
            <div className="grid gap-1">
              <Label htmlFor="batchKg">Партия (кг)</Label>
              <Input
                id="batchKg"
                type="number"
                value={batchKg}
                onChange={(e) => setBatchKg(Number(e.target.value))}
                step="0.1"
                min="0"
                className="w-full sm:w-32"
              />
            </div>
            <Button
              onClick={() => setItems(scaleToKg(items, batchKg))}
              variant="outline"
              disabled={items.length === 0 || batchKg <= 0}
            >
              Применить партию
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
