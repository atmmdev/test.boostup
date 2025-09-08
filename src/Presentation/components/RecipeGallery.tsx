// src/Presentation/components/RecipeGallery.tsx
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

function getRecipeName(r: any): string {
  if ("name" in r && typeof r.name === "string") return r.name;
  if ("title" in r && typeof r.title === "string") return r.title;
  return String(r?.id ?? "Recipe");
}

function getMealType(r: any): string | undefined {
  if ("meal" in r && typeof r.meal === "string") return r.meal;
  if ("mealType" in r && typeof r.mealType === "string") return r.mealType;
  if ("category" in r && typeof r.category === "string") return r.category;
  return undefined;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
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
      const meal = (getMealType(r) || "").toLowerCase();
      const mealOk =
        mealFilter === "all" ? true : meal === mealFilter.toLowerCase();

      if (!normalizedQuery) return mealOk;
      const haystackParts: string[] = [];
      haystackParts.push(getRecipeName(r));

      if ("description" in r && typeof r.description === "string") {
        haystackParts.push(r.description);
      }

      if ("ingredients" in r) {
        const ing = (r as any).ingredients;
        if (Array.isArray(ing)) haystackParts.push(ing.join(", "));
        else if (typeof ing === "string") haystackParts.push(ing);
      }

      if ("tags" in r && Array.isArray((r as any).tags)) {
        haystackParts.push((r as any).tags.join(", "));
      }

      const haystack = normalize(haystackParts.join(" | "));
      const queryOk = haystack.includes(normalizedQuery);

      return mealOk && queryOk;
    });
  }, [recipes, mealFilter, normalizedQuery]);

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
            <>to <span className="font-medium">“{query}”</span></>
          ) : null}
          {mealFilter !== "all" ? (
            <>in <span className="font-medium">{mealFilter}</span></>
          ) : null}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} onSelect={onSelect} onAdd={onAdd} onPlan={onPlan} />
          ))}
        </div>
      )}
    </>
  );
}
