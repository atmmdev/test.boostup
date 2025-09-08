import { useMemo } from "react";
import type { Recipe } from "../../Domain/Entities/Recipe";
import { RecipeCard } from "./RecipeCard";

type MealKind = "all" | "breakfast" | "lunch" | "dinner";
import { type Day, type Slot } from "../components/_plannerTypes";

interface Props {
  recipes: Recipe[];
  query: string;
  mealFilter: MealKind;
  setQuery: (q: string) => void;
  setMealFilter: (f: MealKind) => void;
  onSelect: (r: Recipe) => void;
  onAdd: (r: Recipe) => void;
  onPlan: (day: Day, slot: Slot, r: Recipe) => void;
}

function normalize(s: string) {
  return (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function indexRecipe(r: Recipe): string {
  const parts: string[] = [];

  parts.push(r.title, r.cuisine, r.difficulty, String(r.cookingTime));

  if (Array.isArray(r.dietaryTags)) parts.push(r.dietaryTags.join(" "));
  if (Array.isArray(r.mealType)) parts.push(r.mealType.join(" "));

  if (Array.isArray(r.ingredients)) {
    for (const ing of r.ingredients) {
      parts.push(
        ing.name,
        ing.quantity,
        ing.category,
        `${ing.quantity} ${ing.name}`
      );
    }
  }

  if (Array.isArray(r.instructions)) parts.push(r.instructions.join(" "));

  if (r.nutrition) {
    parts.push(
      `calories ${r.nutrition.calories}`,
      `protein ${r.nutrition.protein}`,
      `carbs ${r.nutrition.carbs}`,
      `fat ${r.nutrition.fat}`
    );
  }

  return normalize(parts.filter(Boolean).join(" | "));
}

export function RecipeGallery({
  recipes,
  query,
  mealFilter,
  setQuery,
  setMealFilter,
  onSelect,
  onAdd,
  onPlan,
}: Props) {
  const normalizedQuery = normalize(query.trim());

  const filtered = useMemo(() => {
    if (!recipes?.length) return [];

    return recipes.filter((r) => {
      // filtro por tipo de refeição
      let mealOk = true;
      if (mealFilter !== "all") {
        if (Array.isArray(r.mealType)) {
          mealOk = r.mealType.map(normalize).includes(normalize(mealFilter));
        } else if (typeof r.mealType === "string") {
          mealOk = normalize(r.mealType) === normalize(mealFilter);
        } else {
          mealOk = false;
        }
      }

      if (!query.trim()) return mealOk;

      const hay = indexRecipe(r); // função que concatena todos os campos
      const q = normalize(query);
      const queryOk = hay.includes(q);

      return mealOk && queryOk;
    });
  }, [recipes, mealFilter, query]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold">Recipe Gallery</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, ingredient..."
          className="border rounded px-3 py-2 text-sm w-full sm:w-72 md:w-96"
        />
        <div className="flex gap-2">
          {(["all", "breakfast", "lunch", "dinner"] as MealKind[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setMealFilter(cat)}
              className={`px-2 py-1 rounded text-xs transition cursor-pointer ${
                mealFilter === cat
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              aria-pressed={mealFilter === cat}
            >
              {cat[0].toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-sm text-red-500">
          No recipes found
          {query ? (
            <>
              to <span className="font-medium">“{query}”</span>
            </>
          ) : null}
          {mealFilter !== "all" ? (
            <>
              in <span className="font-medium">{mealFilter}</span>
            </>
          ) : null}
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onSelect={onSelect}
              onAdd={onAdd}
              onPlan={onPlan}
            />
          ))}
        </div>
      )}
    </>
  );
}
