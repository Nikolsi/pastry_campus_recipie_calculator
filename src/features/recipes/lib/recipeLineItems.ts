import type { LineItem } from "@/domain/types";

function createClientId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

export function createRecipeLineItem(ingredientName: string): LineItem {
  return {
    id: createClientId(),
    ingredientName,
    grams: 0,
  };
}

export function normalizeRecipeNumberInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");

  if (cleaned === "" || cleaned === ".") {
    return "";
  }

  const value = Number.parseFloat(cleaned);

  if (Number.isNaN(value)) {
    return "";
  }

  return String(value);
}

