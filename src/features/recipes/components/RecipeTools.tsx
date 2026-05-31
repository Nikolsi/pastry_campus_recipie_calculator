import { Badge } from "@/components/ui/badge";
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

interface RecipeToolsProps {
  itemCount: number;
  batchKg: number;
  onBatchKgChange: (batchKg: number) => void;
  onNormalizeTo1000: () => void;
  onApplyBatch: () => void;
}

export function RecipeTools({
  itemCount,
  batchKg,
  onBatchKgChange,
  onNormalizeTo1000,
  onApplyBatch,
}: RecipeToolsProps) {
  return (
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
          onClick={onNormalizeTo1000}
          variant="secondary"
          disabled={itemCount === 0}
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
              onChange={(event) => onBatchKgChange(Number(event.target.value))}
              step="0.1"
              min="0"
              className="w-full sm:w-32"
            />
          </div>
          <Button
            onClick={onApplyBatch}
            variant="outline"
            disabled={itemCount === 0 || batchKg <= 0}
          >
            Применить партию
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

