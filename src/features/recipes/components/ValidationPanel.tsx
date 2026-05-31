import { CheckCircle2, XCircle } from "lucide-react";

import type { ValidationResult } from "@/calc/ranges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ValidationPanelProps {
  itemCount: number;
  totalG: number;
  validation: ValidationResult;
}

export function ValidationPanel({
  itemCount,
  totalG,
  validation,
}: ValidationPanelProps) {
  const description =
    itemCount === 0
      ? "Валидация начнется после добавления ингредиентов"
      : totalG === 0 || Math.abs(totalG - 1000) > 50
        ? "Для корректной оценки диапазонов рекомендуется нормализовать до 1000 г (см. Экспериментальные инструменты)"
        : "Все параметры проверяются на соответствие стандартам";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">
              Шаг 3 — Проверьте баланс
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {itemCount === 0 ? (
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
                  check.ok ? "bg-emerald-50/40" : "bg-rose-50/40",
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
  );
}

