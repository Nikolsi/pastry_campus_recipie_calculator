import { useState, useMemo } from "react";
import "./App.css";
import type { Ingredient, LineItem } from "./domain/types";
import { ingredients } from "./data/ingredients";
import { normalizeTo1000, scaleToKg, computeTotals } from "./calc/formulator";
import { validateTotals, type RecipeType } from "./calc/ranges";

function App() {
  const [recipeType, setRecipeType] = useState<RecipeType>("HELADO");
  const [items, setItems] = useState<LineItem[]>([]);
  const [batchKg, setBatchKg] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  // Build ingredient map keyed by name
  const ingredientByName = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredients.forEach((ing) => {
      map.set(ing.name, ing);
    });
    return map;
  }, []);

  // Filtered ingredients for picker
  const filteredIngredients = useMemo(() => {
    const searchLower = search.toLowerCase();
    return ingredients
      .filter((ing) => {
        const name = ing.name_ru ?? ing.name;
        return name.toLowerCase().includes(searchLower);
      })
      .slice(0, 50);
  }, [search]);

  // Compute totals and validation
  const totals = useMemo(
    () => computeTotals(items, ingredientByName),
    [items, ingredientByName]
  );

  const validation = useMemo(
    () => validateTotals(totals, recipeType),
    [totals, recipeType]
  );

  // Add ingredient to recipe
  const addIngredient = (ingredient: Ingredient) => {
    // Prevent duplicates
    if (items.some((item) => item.ingredientName === ingredient.name)) {
      return;
    }
    const newItem: LineItem = {
      id: `${Date.now()}-${Math.random()}`,
      ingredientName: ingredient.name,
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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Pastry Campus Recipe Calculator</h1>

      {/* Header Controls */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label>
          Recipe Type:
          <select
            value={recipeType}
            onChange={(e) => setRecipeType(e.target.value as RecipeType)}
            style={{ marginLeft: "5px" }}
          >
            <option value="HELADO">HELADO</option>
            <option value="SORBETE">SORBETE</option>
          </select>
        </label>

        <label>
          Batch (kg):
          <input
            type="number"
            value={batchKg}
            onChange={(e) => setBatchKg(Number(e.target.value))}
            step="0.1"
            min="0"
            style={{ marginLeft: "5px", width: "80px" }}
          />
        </label>

        <button onClick={() => setItems(normalizeTo1000(items))}>
          Normalize to 1000g
        </button>
        <button onClick={() => setItems(scaleToKg(items, batchKg))}>
          Apply batch kg
        </button>
        <button onClick={() => setItems([])}>Clear</button>
      </div>

      {/* Ingredient Picker */}
      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h2>Add Ingredient</h2>
        <input
          type="text"
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        />
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {filteredIngredients.map((ing) => (
            <div
              key={ing.id}
              style={{
                padding: "5px",
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>{ing.name_ru ?? ing.name}</span>
              <button onClick={() => addIngredient(ing)}>Add</button>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Table */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Recipe</h2>
        {items.length === 0 ? (
          <p>No ingredients added yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #333" }}>
                <th style={{ textAlign: "left", padding: "5px" }}>
                  Ingredient
                </th>
                <th style={{ textAlign: "right", padding: "5px" }}>Grams</th>
                <th style={{ padding: "5px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "5px" }}>
                    {getDisplayName(item.ingredientName)}
                  </td>
                  <td style={{ padding: "5px", textAlign: "right" }}>
                    <input
                      type="number"
                      value={item.grams}
                      onChange={(e) =>
                        updateGrams(item.id, Number(e.target.value))
                      }
                      step="0.1"
                      min="0"
                      style={{ width: "100px", textAlign: "right" }}
                    />
                  </td>
                  <td style={{ padding: "5px", textAlign: "center" }}>
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Totals & Validation */}
      <div style={{ marginBottom: "20px" }}>
        <h2>
          Totals & Validation{" "}
          <span style={{ fontSize: "24px" }}>
            {validation.overallOk ? "✅" : "❌"}
          </span>
        </h2>

        <div style={{ marginBottom: "10px" }}>
          <strong>Total: {totals.totalG.toFixed(2)}g</strong>
          {" | "}
          <strong>Equalizer: {totals.equalizer.toFixed(2)}g</strong>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #333" }}>
              <th style={{ textAlign: "left", padding: "5px" }}>Parameter</th>
              <th style={{ textAlign: "right", padding: "5px" }}>Actual</th>
              <th style={{ textAlign: "right", padding: "5px" }}>Expected</th>
              <th style={{ textAlign: "center", padding: "5px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {validation.checks.map((check) => (
              <tr key={check.key} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "5px" }}>{check.label}</td>
                <td style={{ padding: "5px", textAlign: "right" }}>
                  {check.actual}
                </td>
                <td style={{ padding: "5px", textAlign: "right" }}>
                  {check.expected}
                </td>
                <td style={{ padding: "5px", textAlign: "center" }}>
                  {check.ok ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          <div>Temperature (serve): {totals.tempServeC.toFixed(2)}°C</div>
        </div>
      </div>
    </div>
  );
}

export default App;
