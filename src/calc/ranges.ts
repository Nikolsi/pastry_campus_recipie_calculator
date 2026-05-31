import type { Totals } from '../domain/types';
import { ICE_CREAM_METRICS } from '../domain/catalog.js';

export type RecipeType = 'HELADO' | 'SORBETE';

export type Rule =
    | { type: 'range'; min: number; max: number }
    | { type: 'max'; max: number }
    | { type: 'target'; target: number; tolerance: number };

export type TrafficLightColor = 'green' | 'yellow' | 'red';

export interface ValidationCheck {
    key: string;
    label: string;
    ok: boolean;
    color: TrafficLightColor;
    direction: 'high' | 'low' | null;
    actual: string;
    expected: string;
}

export interface ValidationResult {
    overallOk: boolean;
    checks: ValidationCheck[];
}

// Default validation rules for each recipe type
export const DEFAULT_RULES: Record<RecipeType, Record<string, Rule>> = {
    HELADO: {
        sugarsPct: { type: 'range', min: 16, max: 24 },
        fatPct: { type: 'range', min: 6, max: 16 },
        solidsPct: { type: 'range', min: 36, max: 42 },
        waterPct: { type: 'range', min: 58, max: 64 },
        proteinPct: { type: 'range', min: 3, max: 5 },
        lactosePct: { type: 'range', min: 5, max: 7 },
        podPct: { type: 'range', min: 28, max: 32 },
        pac: { type: 'range', min: 50, max: 70 },
    },
    SORBETE: {
        sugarsPct: { type: 'range', min: 25, max: 32 },
        fatPct: { type: 'max', max: 1 },
        solidsPct: { type: 'range', min: 28, max: 35 },
        waterPct: { type: 'range', min: 65, max: 72 },
        proteinPct: { type: 'max', max: 1 },
        lactosePct: { type: 'max', max: 0.5 },
        podPct: { type: 'range', min: 18, max: 22 },
        pac: { type: 'range', min: 40, max: 60 },
    },
};

const LABELS = Object.fromEntries(
    ICE_CREAM_METRICS.map((metric) => [metric.code, metric.label])
);

function formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
}

function formatValue(key: string, value: number): string {
    // PAC is not a percentage
    if (key === 'pac') {
        return value.toFixed(2);
    }
    return formatPercent(value);
}

function computeColorAndDirection(
    value: number,
    rule: Rule,
): { color: TrafficLightColor; direction: 'high' | 'low' | null } {
    switch (rule.type) {
        case 'range': {
            const buffer = (rule.max - rule.min) * 0.2;
            if (value >= rule.min && value <= rule.max) return { color: 'green', direction: null };
            if (value < rule.min) {
                return { color: value >= rule.min - buffer ? 'yellow' : 'red', direction: 'low' };
            }
            return { color: value <= rule.max + buffer ? 'yellow' : 'red', direction: 'high' };
        }
        case 'max': {
            if (value <= rule.max) return { color: 'green', direction: null };
            return { color: value <= rule.max * 1.3 ? 'yellow' : 'red', direction: 'high' };
        }
        case 'target': {
            const diff = Math.abs(value - rule.target);
            if (diff <= rule.tolerance) return { color: 'green', direction: null };
            const dir = value > rule.target ? 'high' : 'low';
            return { color: diff <= rule.tolerance * 2 ? 'yellow' : 'red', direction: dir };
        }
    }
}

function checkRule(value: number, rule: Rule): { ok: boolean; expected: string } {
    switch (rule.type) {
        case 'range':
            return {
                ok: value >= rule.min && value <= rule.max,
                expected: `${rule.min.toFixed(2)}% - ${rule.max.toFixed(2)}%`,
            };
        case 'max':
            return {
                ok: value <= rule.max,
                expected: `≤ ${rule.max.toFixed(2)}%`,
            };
        case 'target':
            return {
                ok: Math.abs(value - rule.target) <= rule.tolerance,
                expected: `${rule.target.toFixed(2)}% ± ${rule.tolerance.toFixed(2)}%`,
            };
    }
}

function checkRuleForPAC(value: number, rule: Rule): { ok: boolean; expected: string } {
    switch (rule.type) {
        case 'range':
            return {
                ok: value >= rule.min && value <= rule.max,
                expected: `${rule.min.toFixed(2)} - ${rule.max.toFixed(2)}`,
            };
        case 'max':
            return {
                ok: value <= rule.max,
                expected: `≤ ${rule.max.toFixed(2)}`,
            };
        case 'target':
            return {
                ok: Math.abs(value - rule.target) <= rule.tolerance,
                expected: `${rule.target.toFixed(2)} ± ${rule.tolerance.toFixed(2)}`,
            };
    }
}

export function validateTotals(
    totals: Totals,
    recipeType: RecipeType
): ValidationResult {
    const rules = DEFAULT_RULES[recipeType];
    const checks: ValidationCheck[] = [];

    for (const [key, rule] of Object.entries(rules)) {
        // Convert from fraction (0..1) to percentage (0..100) for comparison
        // PAC stays as-is (not a percentage)
        const raw = totals[key as keyof Totals] as number;
        const value = key === 'pac' ? raw : raw * 100;
        const label = LABELS[key] || key;

        const { ok, expected } = key === 'pac'
            ? checkRuleForPAC(value, rule)
            : checkRule(value, rule);

        const { color, direction } = computeColorAndDirection(value, rule);

        checks.push({
            key,
            label,
            ok,
            color,
            direction,
            actual: formatValue(key, value),
            expected,
        });
    }

    const overallOk = checks.every((check) => check.ok);

    return {
        overallOk,
        checks,
    };
}
