// src/Presentation/components/RecipeGallery.tsx
import type { Recipe } from "../../Domain/Entities/Recipe";
import { RecipeCard } from "./RecipeCard";

interface Props {
  recipes: Recipe[];
  query: string;
  mealFilter: "all" | "breakfast" | "lunch" | "dinner";
  setQuery: (q: string) => void;
  setMealFilter: (f: any) => void;
  onSelect: (r: Recipe) => void;
  onAdd: (r: Recipe) => void;
}

export function RecipeGallery({
  recipes,
  query,
  mealFilter,
  setQuery,
  setMealFilter,
  onSelect,
  onAdd,
}: Props) {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold">Recipe Gallery</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border rounded px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          {["all", "breakfast", "lunch", "dinner"].map((cat) => (
            <button
              key={cat}
              onClick={() => setMealFilter(cat as any)}
              className={`px-2 py-1 rounded text-xs ${
                mealFilter === cat
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {cat[0].toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            onSelect={onSelect}
            onAdd={onAdd}
          />
        ))}
      </div>
    </>
  );
}