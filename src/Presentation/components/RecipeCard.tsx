// src/Presentation/components/RecipeCard.tsx
import { useState } from "react";
import type { Recipe } from "../../Domain/Entities/Recipe";
import { days, slots, type Day, type Slot } from "./_plannerTypes";

interface Props {
  recipe: Recipe;
  onSelect: (r: Recipe) => void;
  onAdd: (r: Recipe) => void;
  onPlan: (day: Day, slot: Slot, r: Recipe) => void; // 👈 NOVO
}

export function RecipeCard({ recipe, onSelect, onAdd, onPlan }: Props) {
  const [openPlan, setOpenPlan] = useState(false);
  const [day, setDay] = useState<Day>("Mon");
  const [slot, setSlot] = useState<Slot>("Breakfast");

  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col">
      <div className="flex gap-4 items-start">
        <div className="text-center">
          <img
            onClick={() => onSelect(recipe)}
            src={recipe.image}
            className="w-24 h-24 rounded-lg object-cover cursor-pointer"
            alt={recipe.title}
          />
          <small className="text-xs">{recipe.cuisine} food</small>
        </div>

        <div className="text-start flex-1">
          <span className="block text-xs text-green-600 tracking-wider">
            {recipe.dietaryTags.join(", ")} • {recipe.difficulty}
          </span>
          <h4 className="font-bold">{recipe.title}</h4>

          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            <span className="bg-green-100 px-2 py-1 rounded">Protein: {recipe.nutrition.protein}g</span>
            <span className="bg-yellow-100 px-2 py-1 rounded">Carbs: {recipe.nutrition.carbs}g</span>
            <span className="bg-red-100 px-2 py-1 rounded">Fat: {recipe.nutrition.fat}g</span>
          </div>

          <div className="flex flex-wrap gap-3 items-center mt-3">
            <button
              type="button"
              onClick={() => onAdd(recipe)}
              className="text-green-700 hover:cursor-pointer px-2 py-1 rounded text-xs border border-green-200"
            >
              <i className="fa-solid fa-plus" /> Add to buy
            </button>

            <button
              type="button"
              onClick={() => setOpenPlan((v) => !v)}
              className="text-blue-700 hover:cursor-pointer px-2 py-1 rounded text-xs border border-blue-200"
            >
              <i className="fa-regular fa-calendar-plus" /> Plan
            </button>

            <small
              className="text-xs hover:cursor-pointer"
              onClick={() => onSelect(recipe)}
            >
              <i className="fa-regular fa-chart-bar" /> Details
            </small>

            <small className="text-xs">
              <i className="fa-regular fa-alarm-clock" /> {recipe.cookingTime} min.
            </small>
          </div>

          {/* Mini-form para escolher dia/slot */}
          {openPlan && (
            <div className="mt-3 p-3 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <label className="text-xs">
                Day
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value as Day)}
                  className="ml-2 border rounded px-2 py-1 text-xs"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs">
                Slot
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value as Slot)}
                  className="ml-2 border rounded px-2 py-1 text-xs"
                >
                  {slots.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlan(day, slot, recipe);
                    setOpenPlan(false);
                  }}
                  className="text-white bg-blue-600 px-3 py-1 rounded text-xs"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPlan(false)}
                  className="text-gray-600 border border-gray-300 px-3 py-1 rounded text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
