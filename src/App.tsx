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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IngredientCombobox } from "@/components/IngredientCombobox";

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

      {/* Header Controls */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Настройки рецепта</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end flex-wrap">
            <div className="w-full sm:w-auto">
              <Label htmlFor="recipeType">Тип рецепта</Label>
              <Select
                value={recipeType}
                onValueChange={(value) => setRecipeType(value as RecipeType)}
              >
                <SelectTrigger id="recipeType" className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HELADO">Мороженое</SelectItem>
                  <SelectItem value="SORBETE">Сорбет</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Label htmlFor="batchKg">Партия (кг)</Label>
              <Input
                id="batchKg"
                type="number"
                value={batchKg}
                onChange={(e) => setBatchKg(Number(e.target.value))}
                step="0.1"
                min="0"
                className="w-full sm:w-[120px]"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setItems(normalizeTo1000(items))}
                variant="secondary"
              >
                Нормализовать до 1000г
              </Button>
              <Button
                onClick={() => setItems(scaleToKg(items, batchKg))}
                variant="secondary"
              >
                Применить партию
              </Button>
              <Button onClick={() => setItems([])} variant="destructive">
                Очистить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Ingredient Picker */}
          <Card>
            <CardHeader>
              <CardTitle>Добавить ингредиенты</CardTitle>
              <CardDescription>
                Поиск и выбор ингредиентов для рецепта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IngredientCombobox
                ingredients={ingredients}
                onSelect={addIngredientByName}
                placeholder="Выберите ингредиент..."
                addedIngredientNames={items.map((item) => item.ingredientName)}
              />
            </CardContent>
          </Card>

          {/* Recipe Items */}
          <Card>
            <CardHeader>
              <CardTitle>Рецепт</CardTitle>
              <CardDescription>
                {items.length === 0
                  ? "Ингредиенты еще не добавлены"
                  : `${items.length} ингредиентов`}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Итоги</CardTitle>
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

          {/* Validation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Валидация</CardTitle>
                <Badge
                  variant={validation.overallOk ? "default" : "destructive"}
                >
                  {validation.overallOk
                    ? "✅ Все в пределах"
                    : `❌ Отклонения: ${validation.checks.filter((c) => !c.ok).length}`}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Рекомендуется нормализовать до 1000 г перед оценкой диапазонов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validation.checks.map((check) => (
                  <div key={check.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{check.label}</span>
                      <Badge
                        variant={check.ok ? "outline" : "destructive"}
                        className="text-xs"
                      >
                        {check.ok ? "✅" : "❌"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Факт: {check.actual}</span>
                      <span>Ожидание: {check.expected}</span>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
