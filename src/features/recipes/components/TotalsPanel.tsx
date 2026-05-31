import type { Totals } from "@/domain/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TotalsPanelProps {
  totals: Totals;
}

export function TotalsPanel({ totals }: TotalsPanelProps) {
  return (
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
  );
}

