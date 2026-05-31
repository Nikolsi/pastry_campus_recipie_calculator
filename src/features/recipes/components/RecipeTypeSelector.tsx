import type { RecipeType } from "@/calc/ranges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RecipeTypeSelectorProps {
  recipeType: RecipeType;
  onRecipeTypeChange: (recipeType: RecipeType) => void;
}

export function RecipeTypeSelector({
  recipeType,
  onRecipeTypeChange,
}: RecipeTypeSelectorProps) {
  return (
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
            onClick={() => onRecipeTypeChange("HELADO")}
            className={cn(
              "h-12 text-base",
              recipeType === "HELADO" &&
                "bg-black text-white hover:bg-black/90 border-black",
            )}
          >
            Мороженое
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onRecipeTypeChange("SORBETE")}
            className={cn(
              "h-12 text-base",
              recipeType === "SORBETE" &&
                "bg-black text-white hover:bg-black/90 border-black",
            )}
          >
            Сорбет
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

