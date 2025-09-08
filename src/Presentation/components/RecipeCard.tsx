// src/Presentation/components/RecipeCard.tsx
import { useState } from "react";
import type { Recipe } from "../../Domain/Entities/Recipe";

interface Props {
  recipe: Recipe;
  onSelect: (r: Recipe) => void;
  onAdd: (r: Recipe) => void;
}

export function RecipeCard({ recipe, onSelect, onAdd }: Props) {
  const [plan, setPlan] = useState<{ meals: Recipe[] }>({ meals: [] });

  return (
    <div
      key={recipe.id}
      className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col"
    >
      <div className="flex gap-4 items-start">
        <div className="text-center">
          <img  onClick={() => onSelect(recipe)} src={recipe.image} className="w-24 h-24 rounded-lg object-cover cursor-pointer" />
          <small className="text-xs">{recipe.cuisine} food</small>
        </div>
        <div className="text-start">
          <span className="block text-xs text-green-600 tracking-wider">
            {recipe.dietaryTags.join(", ")} • {recipe.difficulty}
          </span>
          <h4 className="font-bold">{recipe.title}</h4>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            <span className="bg-green-100 px-2 py-1 rounded">
              Protein: {recipe.nutrition.protein}g
            </span>
            <span className="bg-yellow-100 px-2 py-1 rounded">
              Carbs: {recipe.nutrition.carbs}g
            </span>
            <span className="bg-red-100 px-2 py-1 rounded">
              Fat: {recipe.nutrition.fat}g
            </span>
          </div>
          <div className="flex justify-between items-center-safe gap-3">
            <button
            type="button"
              onClick={() => onAdd(recipe)}
              className="mt-3 text-green-700 hover:cursor-pointer px-2 py-1 rounded text-xs"
            >
              <i className="fa-solid fa-plus"></i> Add to buy
            </button>
            <small
              className="mt-3 text-xs hover:cursor-pointer"
              onClick={() => onSelect(recipe)}
            >
              <i className="fa-regular fa-chart-bar"></i> Details
            </small>
            <small className="mt-3 text-xs">
              <i className="fa-regular fa-alarm-clock"></i> {recipe.cookingTime} min.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
