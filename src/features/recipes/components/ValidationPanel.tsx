import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { ValidationResult, TrafficLightColor } from "@/calc/ranges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const KEY_METRICS = ["sugarsPct", "fatPct", "solidsPct", "pac"] as const;

const METRIC_HINTS: Record<string, { high: string; low: string }> = {
  sugarsPct: {
    high: "Много сахара — слишком мягкое",
    low: "Мало сахара — будет ледяным",
  },
  fatPct: {
    high: "Много жира — очень плотное",
    low: "Мало жира — водянистое",
  },
  solidsPct: {
    high: "Много сухих веществ — рассыпчатое",
    low: "Мало сухих веществ — водянистое",
  },
  pac: {
    high: "Высокий PAC — слишком мягкое",
    low: "Низкий PAC — твёрдое, ледяное",
  },
};

const DOT_STYLES: Record<TrafficLightColor, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-400",
  red: "bg-rose-500",
};

const ROW_STYLES: Record<TrafficLightColor, string> = {
  green: "bg-emerald-50/40",
  yellow: "bg-amber-50/50",
  red: "bg-rose-50/40",
};

interface ValidationPanelProps {
  itemCount: number;
  validation: ValidationResult;
  tempServeC: number;
}

export function ValidationPanel({
  itemCount,
  validation,
  tempServeC,
}: ValidationPanelProps) {
  const [showAll, setShowAll] = useState(false);

  const keyChecks = KEY_METRICS.map((key) =>
    validation.checks.find((c) => c.key === key),
  ).filter(Boolean);

  if (itemCount === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Баланс рецепта</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-muted-foreground">
            Добавьте ингредиенты для проверки баланса рецепта
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Баланс рецепта</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {keyChecks.map((check) => {
          if (!check) return null;
          const hint = check.direction
            ? METRIC_HINTS[check.key]?.[check.direction]
            : undefined;
          return (
            <div
              key={check.key}
              className={cn("rounded-lg px-3 py-2.5", ROW_STYLES[check.color])}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full mt-[3px] shrink-0",
                    DOT_STYLES[check.color],
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-sm">{check.label}</span>
                    <span className="tabular-nums text-sm font-semibold shrink-0">
                      {check.actual}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Норма: {check.expected}
                  </div>
                  {hint && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {hint}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex justify-between text-xs text-muted-foreground px-1 pt-1">
          <span>Температура подачи (расч.)</span>
          <span className="tabular-nums font-medium">
            {tempServeC.toFixed(1)}°C
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground text-xs"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Скрыть все показатели
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Все показатели ({validation.checks.length})
            </>
          )}
        </Button>

        {showAll && (
          <div className="space-y-1 border-t pt-2">
            {validation.checks.map((check) => (
              <div
                key={check.key}
                className={cn(
                  "rounded px-3 py-1.5",
                  ROW_STYLES[check.color],
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        DOT_STYLES[check.color],
                      )}
                    />
                    <span className="text-xs font-medium truncate">
                      {check.label}
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
                    <span className="tabular-nums font-medium">
                      {check.actual}
                    </span>
                    <span>{check.expected}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
