import type { Recipe } from "../../Domain/Entities/Recipe";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots: ("Breakfast" | "Lunch" | "Dinner")[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
];

interface Props {
  planner: Record<string, Record<string, { recipe?: Recipe }>>;
  setPlanner: (p: any) => void;
  setShoppingList: (s: ShoppingList) => void;
  setTab: (t: "dashboard" | "planner" | "list") => void;
}

export function MealPlanner({ planner, setPlanner, setShoppingList, setTab }: Props) {
  function collectPlannedRecipes(): Recipe[] {
    return days
      .flatMap((d) => slots.map((s) => planner[d]?.[s]?.recipe).filter(Boolean))
      .filter(Boolean) as Recipe[];
  }

  function handleGenerateList() {
    const list = new ShoppingList();
    for (const recipe of collectPlannedRecipes()) {
      list.addIngredients(recipe.ingredients);
    }
    setShoppingList(list);
    setTab("list");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Weekly Meal Planner</h2>
      </div>

      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="p-2 border"></th>
              {days.map((d) => (
                <th key={d} className="p-2 border">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s}>
                <td className="p-2 border font-semibold">{s}</td>
                {days.map((d) => {
                  const cell = planner[d]?.[s];
                  return (
                    <td key={d + s} className="p-2 border align-top">
                      {cell?.recipe ? (
                        <div className="space-y-1">
                          <div className="font-medium">{cell.recipe.title}</div>
                          <div className="text-xs text-gray-500">
                            P:{cell.recipe.nutrition.protein} • C:{cell.recipe.nutrition.carbs} • F:{cell.recipe.nutrition.fat}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Empty</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}