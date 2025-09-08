import { useEffect, useState } from "react";
// Entities and Repositories
import { Recipe } from "../../Domain/Entities/Recipe";
import { MealPlan } from "../../Domain/Entities/MealPlan";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";
import { LocalStorageRecipeRepository } from "../../Infrastructure/Repositories/LocalStorageRecipeRepository";
import { GenerateShoppingList } from "../../Application/UseCases/GenerateShoppingList";
import { ShoppingListView } from "../components/ShoppingList";
// Data
import recipesData from "../../Data/recipe.json";

export function Dashboard() {
  const repo = new LocalStorageRecipeRepository();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [plan, setPlan] = useState(new MealPlan());
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [tab, setTab] = useState<"recipes" | "list">("recipes");
  const [category, setCategory] = useState<"all" | "breakfast" | "lunch" | "dinner">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Recipe|null>(null);


  useEffect(() => {
    setRecipes(recipesData as Recipe[]);
  }, []);

  const generateList = async () => {
    const useCase = new GenerateShoppingList(repo);
    const list = await useCase.execute(plan);
    setShoppingList(list);
    setTab("list");
  };

  const filteredRecipes = recipes.filter((r) =>
    category === "all" ? true : r.mealType?.toLowerCase() === category
  );

  // UI Simples
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const slots: ("Breakfast"|"Lunch"|"Dinner")[] = ["Breakfast","Lunch","Dinner"];

  type PlanCell = { recipe?: Recipe };
  const [planner, setPlanner] = useState<Record<string, Record<string, PlanCell>>>(
    () => Object.fromEntries(days.map(d => [d, Object.fromEntries(slots.map(s => [s, {}]))]))
  );

  function addToPlanner(day: string, slot: string, recipe: Recipe) {
    setPlanner(prev => ({...prev, [day]: {...prev[day], [slot]: {recipe}}}));
  }


  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* <!-- Sidebar --> */}
      <aside className="w-full lg:w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="p-4 flex items-center gap-2 border-b border-green-500">
            <div className="w-8 h-8 bg-green-500 rounded-sm"></div>
            <h1 className="font-bold text-xl">Meal Planner</h1>
          </div>
          <nav className="px-4 py-4 space-y-2">
            <button
              onClick={() => setTab("recipes")}
              className={`tracking-wider hover:cursor-pointer text-sm block px-3 py-2 rounded-lg ${
                tab === "recipes"
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-green-100 text-gray-500"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTab("list")}
              className={`tracking-wider hover:cursor-pointer text-sm flex gap-30 items-center px-3 py-2 rounded-lg ${
                tab === "list"
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-green-100 text-gray-500"
              }`}
            >
              <span>Shopplist</span>
              <span className="inline-flex items-center justify-center w-7 h-7 text-xs text-green-700 bg-green-100 rounded-full">
                {shoppingList ? shoppingList.items.length : 0}
              </span>
            </button>
          </nav>
        </div>
      </aside>

      {/* <!-- Content Area --> */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {tab === "recipes" && (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold">Dashboard</h2>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title, ingredient, cuisine..." className="w-full sm:w-64 border rounded px-3 py-2 text-sm" />
                <button onClick={generateList} className="bg-green-500 text-white px-4 py-2 rounded text-sm">Generate Shopping List</button>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["all", "breakfast", "lunch", "dinner", "dessert"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat as any)}
                      className={`px-2 py-1 rounded text-xs ${
                        category === cat
                          ? "bg-green-100 text-green-700"
                          : "opacity-50 hover:opacity-100 hover:cursor-pointer bg-green-50 text-green-700"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  )
                )}
              </div>

              {/* UI Simples */}
              <div className="overflow-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 border"></th>
                      {days.map(d => <th key={d} className="p-2 border">{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map(s => (
                      <tr key={s}>
                        <td className="p-2 border font-semibold">{s}</td>
                        {days.map(d => {
                          const cell = planner[d][s];
                          return (
                            <td key={d+s} className="p-2 border align-top">
                              {cell.recipe ? (
                                <div className="space-y-1">
                                  <div className="font-medium">{cell.recipe.title}</div>
                                  <div className="text-xs text-gray-500">
                                    P:{cell.recipe.nutrition.protein}g · C:{cell.recipe.nutrition.carbs}g · F:{cell.recipe.nutrition.fat}g
                                  </div>
                                </div>
                              ) : <span className="text-gray-400 text-xs">Empty</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              {/* Grid de Receitas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map((r) => (
                  <div key={r.id} className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col">
                    <div className="flex gap-4 items-start">
                      <div className="text-center">
                        <img onClick={()=>setSelected(r)} src={r.image} className="w-24 h-24 rounded-lg object-cover" />
                        <small className="text-xs">{r.cuisine} food</small>
                      </div>
                      <div className="text-start">
                        <span className="block text-xs text-green-600 tracking-wider">
                          {r.dietaryTags.join(", ")} • {r.difficulty}
                        </span>
                        <h4 className="font-bold">{r.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="bg-green-100 px-2 py-1 rounded">
                            Protein: {r.nutrition.protein}g
                          </span>
                          <span className="bg-yellow-100 px-2 py-1 rounded">
                            Carbs: {r.nutrition.carbs}g
                          </span>
                          <span className="bg-red-100 px-2 py-1 rounded">
                            Fat: {r.nutrition.fat}g
                          </span>
                        </div>
                        <div className="flex justify-between items-center-safe gap-3">
                          <button
                            onClick={() => {
                              plan.addRecipe(r);
                              setPlan(new MealPlan([...plan.meals]));
                            }}
                            className="mt-3 text-green-700 hover:cursor-pointer px-2 py-1 rounded text-xs"
                          >
                            <i className="fa-solid fa-plus"></i> Add to buy
                          </button>
                          <small className="mt-3 text-xs hover:cursor-pointer" onClick={()=>setSelected(r)}><i className="fa-regular fa-chart-bar"></i> Details</small>
                          <small className="mt-3 text-xs"><i className="fa-regular fa-alarm-clock"></i> {r.cookingTime} min.</small>
                        </div>
                      </div>
                      <button
                        onClick={()=>addToPlanner("Mon","Breakfast", r)}
                        className="mt-2 text-xs border px-2 py-1 rounded hover:bg-green-700 hover:text-white">
                        + Mon Breakfast
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "list" && shoppingList && (
            <ShoppingListView shoppingList={shoppingList}
              onToggle={(cat, name) => {
                shoppingList.toggleHave(cat, name);
                setShoppingList({ ...shoppingList });
              }}
            />
          )}
        </main>
      </div>

      

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{selected.title}</h3>
              <button onClick={()=>setSelected(null)}>✕</button>
            </div>
            <img src={selected.image} className="w-full h-48 object-cover rounded"/>
            <div className="text-sm text-gray-600">
              <div>Time: {selected.cookingTime} min • {selected.difficulty}</div>
              <div>P:{selected.nutrition.protein} • C:{selected.nutrition.carbs} • F:{selected.nutrition.fat}</div>
            </div>
            <div>
              <h4 className="font-semibold">Ingredients</h4>
              <ul className="list-disc list-inside text-sm">
                {selected.ingredients.map(i => <li key={i.name}>{i.quantity} {i.name}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Instructions</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {selected.instructions.map((step, idx)=><li key={idx}>{step}</li>)}
              </ol>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
