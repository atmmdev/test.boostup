import { useEffect, useState } from "react";
import type { Recipe } from "../../Domain/Entities/Recipe";

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeModal({ recipe, onClose }: Props) {
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  // rating + notes
  function getKey(id: string) {
    return `recipe_meta_${id}`;
  }
  function loadMeta(id: string) {
    return JSON.parse(
      localStorage.getItem(getKey(id)) || `{"rating":0,"notes":""}`
    );
  }
  function saveMeta(id: string, meta: { rating: number; notes: string }) {
    localStorage.setItem(getKey(id), JSON.stringify(meta));
  }

  const [meta, setMeta] = useState<{ rating: number; notes: string }>(
    () => loadMeta(recipe.id)
  );

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{recipe.title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded"
        />
        <div className="text-sm text-gray-600">
          <div>Time: {recipe.cookingTime} min • {recipe.difficulty}</div>
          <div>
            P:{recipe.nutrition.protein} • C:{recipe.nutrition.carbs} • F:{recipe.nutrition.fat}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Ingredients</h4>
          <ul className="list-disc list-inside text-sm">
            {recipe.ingredients.map((i) => (
              <li key={i.name}>{i.quantity} {i.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Instructions</h4>
          <ol className="list-decimal list-inside text-sm space-y-1">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 text-sm">
          <span>
            Timer: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </span>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => {
              setTimer(0);
              setRunning(false);
            }}
          >
            Reset
          </button>
        </div>

        {/* Rating & Notes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`text-xl ${
                  meta.rating >= star ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => {
                  const m = { ...meta, rating: star };
                  setMeta(m);
                  saveMeta(recipe.id, m);
                }}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={meta.notes}
            onChange={(e) => {
              const m = { ...meta, notes: e.target.value };
              setMeta(m);
              saveMeta(recipe.id, m);
            }}
            placeholder="Your notes..."
            className="w-full border rounded p-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}