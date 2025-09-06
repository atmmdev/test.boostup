import { useEffect, useState } from "react";
// Entities and Repositories
import { Recipe } from "../../Domain/Entities/Recipe";
import { MealPlan } from "../../Domain/Entities/MealPlan";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";
import { LocalStorageRecipeRepository } from "../../Infrastructure/Repositories/LocalStorageRecipeRepository";
import { GenerateShoppingList } from "../../Application/UseCases/GenerateShoppingList";
// Components
import { RecipeGallery } from "../components/RecipeGallery";
import { MealPlanner } from "../components/MealPlanner";
import { ShoppingListView } from "../components/ShoppingList";


//         <button onClick={() => setTab("recipes")} className={`px-3 py-1 rounded ${tab === "recipes" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
//           Food Recipes
//         </button>
//         <button onClick={() => setTab("planner")} className={`px-3 py-1 rounded ${tab === "planner" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
//           Planner
//         </button>
//         <button onClick={generateList} className={`px-3 py-1 rounded ${tab === "list" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
//           Shopplist
//         </button>

//       {tab === "recipes" && <RecipeGallery recipes={recipes} onSelect={() => {}} />}
//       {tab === "planner" && <MealPlanner plan={plan} />}
//       {tab === "list" && shoppingList && <ShoppingListView list={shoppingList} />}

export function Dashboard() {
  const repo = new LocalStorageRecipeRepository();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [plan, setPlan] = useState(new MealPlan());
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [tab, setTab] = useState<"recipes" | "planner" | "list">("recipes");

  useEffect(() => {
    repo.getAll().then(setRecipes);
  }, [repo]);

  const generateList = async () => {
    const useCase = new GenerateShoppingList(repo);
    const list = await useCase.execute(plan);
    setShoppingList(list);
    setTab("list");
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen">
        {/* <!-- Sidebar --> */}
        <aside className="w-full lg:w-64 bg-white shadow-md flex flex-col justify-between">
          <div>
            <div className="p-4 flex items-center gap-2 border-b border-green-500">
              <div className="w-8 h-8 bg-green-500 rounded-sm"></div>
              <h1 className="font-bold text-xl">Meal Planner</h1>
            </div>
            <nav className="px-4 py-4 space-y-2">
              <a href="#" className="tracking-wider text-sm block px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                Dashboard
              </a>
              <a href="#" className="tracking-wider text-sm px-3 py-2 rounded-lg hover:bg-green-100 text-gray-500 flex justify-between items-center">
                Shopplist
                <span className="inline-flex items-center justify-center w-7 h-7 text-xs text-green-700 bg-green-100 rounded-full">
                  30
                </span>
              </a>
            </nav>
          </div>
        </aside>

        {/* <!-- Content Area --> */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* <!-- Main Content --> */}
          <main className="flex-1 p-4 lg:p-6 space-y-6">
            {/* <!-- Header --> */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold">Dashboard</h2>
            </div>

            {/* <!-- All Menu --> */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="flex flex-wrap gap-2">
                  <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    All
                  </button>
                  <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs opacity-50 hover:opacity-100 hover:cursor-pointer">
                    Breakfast
                  </button>
                </div>
              </div> 
              {/* All Menu */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* <!-- Card --> */}
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col">
                  <div className="flex gap-4 items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <img src="https://www.themealdb.com/images/media/meals/vvstvq1487342592.jpg" className="w-30 h-30 rounded-lg object-cover" />
                      <div className="text-start">
                        <span className="block text-xs text-green-600 font-thin tracking-wider">Breakfast • Easy</span>
                        <h4 className="font-bold">Avocado Toast with Poached Egg</h4>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="bg-green-100 px-2 py-1 rounded">Calories: 450</span>
                          <span className="bg-yellow-100 px-2 py-1 rounded">Carbohydrate: 40g</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">Protein: 35g</span>
                          <span className="bg-red-100 px-2 py-1 rounded">Fats: 12g</span>
                        </div>
                        <button className="mt-4 border text-green-700 hover:cursor-pointer hover:bg-green-700 hover:text-white px-2 py-1 rounded text-xs">
                          Add to Meal Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- Card --> */}

                <div className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col">
                  <div className="flex gap-4 items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <img src="https://www.themealdb.com/images/media/meals/vvstvq1487342592.jpg" className="w-30 h-30 rounded-lg object-cover" />
                      <div className="text-start">
                        <h4 className="font-bold">Avocado Toast with Poached Egg</h4>
                        <span className="block text-xs text-green-600 font-thin tracking-wider">Breakfast • Easy</span>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="bg-green-100 px-2 py-1 rounded">Calories: 450</span>
                          <span className="bg-yellow-100 px-2 py-1 rounded">Carbs: 40g</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">Proteins: 35g</span>
                          <span className="bg-red-100 px-2 py-1 rounded">Fats: 12g</span>
                        </div>
                        <button className="mt-4 border text-green-700 hover:cursor-pointer hover:bg-green-700 hover:text-white px-2 py-1 rounded-xl text-xs">
                          Add to Meal Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col">
                  <div className="flex gap-4 items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <img src="https://www.themealdb.com/images/media/meals/vvstvq1487342592.jpg" className="w-30 h-30 rounded-lg object-cover" />
                      <div className="text-start">
                        <h4 className="font-bold">Avocado Toast with Poached Egg</h4>
                        <span className="block text-xs text-green-600 font-thin tracking-wider">Breakfast • Easy</span>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="bg-green-100 px-2 py-1 rounded">Calories: 450</span>
                          <span className="bg-yellow-100 px-2 py-1 rounded">Carbs: 40g</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">Proteins: 35g</span>
                          <span className="bg-red-100 px-2 py-1 rounded">Fats: 12g</span>
                        </div>
                        <button className="mt-4 border text-green-700 hover:cursor-pointer hover:bg-green-700 hover:text-white px-2 py-1 rounded-xl text-xs">
                          Add to Meal Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col">
                  <div className="flex gap-4 items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <img src="https://www.themealdb.com/images/media/meals/vvstvq1487342592.jpg" className="w-30 h-30 rounded-lg object-cover" />
                      <div className="text-start">
                        <h4 className="font-bold">Avocado Toast with Poached Egg</h4>
                        <span className="block text-xs text-green-600 font-thin tracking-wider">Breakfast • Easy</span>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="bg-green-100 px-2 py-1 rounded">Calories: 450</span>
                          <span className="bg-yellow-100 px-2 py-1 rounded">Carbs: 40g</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">Proteins: 35g</span>
                          <span className="bg-red-100 px-2 py-1 rounded">Fats: 12g</span>
                        </div>
                        <button className="mt-4 border text-green-700 hover:cursor-pointer hover:bg-green-700 hover:text-white px-2 py-1 rounded-xl text-xs">
                          Add to Meal Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col">
                  <div className="flex gap-4 items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <img src="https://www.themealdb.com/images/media/meals/vvstvq1487342592.jpg" className="w-30 h-30 rounded-lg object-cover" />
                      <div className="text-start">
                        <h4 className="font-bold">Avocado Toast with Poached Egg</h4>
                        <span className="block text-xs text-green-600 font-thin tracking-wider">Breakfast • Easy</span>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="bg-green-100 px-2 py-1 rounded">Calories: 450</span>
                          <span className="bg-yellow-100 px-2 py-1 rounded">Carbs: 40g</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">Proteins: 35g</span>
                          <span className="bg-red-100 px-2 py-1 rounded">Fats: 12g</span>
                        </div>
                        <button className="mt-4 border text-green-700 hover:cursor-pointer hover:bg-green-700 hover:text-white px-2 py-1 rounded-xl text-xs">
                          Add to Meal Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col">
                  <div className="flex gap-4 items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <img src="https://www.themealdb.com/images/media/meals/vvstvq1487342592.jpg" className="w-30 h-30 rounded-lg object-cover" />
                      <div className="text-start">
                        <h4 className="font-bold">Avocado Toast with Poached Egg</h4>
                        <span className="block text-xs text-green-600 font-thin tracking-wider">Breakfast • Easy</span>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="bg-green-100 px-2 py-1 rounded">Calories: 450</span>
                          <span className="bg-yellow-100 px-2 py-1 rounded">Carbs: 40g</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">Proteins: 35g</span>
                          <span className="bg-red-100 px-2 py-1 rounded">Fats: 12g</span>
                        </div>
                        <button className="mt-4 border text-green-700 hover:cursor-pointer hover:bg-green-700 hover:text-white px-2 py-1 rounded-xl text-xs">
                          Add to Meal Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </main>

          {/* <!-- Right Sidebar --> */}
          <aside className="w-full lg:w-80 bg-white shadow-md p-4 lg:p-6 space-y-6">
            {/* <!-- User --> */}
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold">Anderson Martins</h4>
                <p className="text-sm text-gray-600">Member</p>
              </div>
            </div>

            {/* <!-- Popular Menu --> */}
            <div>
              <h3 className="font-bold mb-2">Popular Menu</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center">
                  <span>Greek Salad with Feta</span>
                  <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    + Lunch
                  </button>
                </li>
                <li className="flex justify-between items-center">
                  <span>Blueberry Protein Smoothie</span>
                  <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    + Breakfast
                  </button>
                </li>
                <li className="flex justify-between items-center">
                  <span>Grilled Salmon</span>
                  <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    + Dinner
                  </button>
                </li>
              </ul>
            </div>

            {/* <!-- Recommended Menu --> */}
            <div>
              <h3 className="font-bold mb-2">Recommended Menu</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center">
                  <span>Oatmeal with Almond Butter</span>
                  <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    + Breakfast
                  </button>
                </li>
                <li className="flex justify-between items-center">
                  <span>Grilled Chicken Wrap</span>
                  <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    + Lunch
                  </button>
                </li>
                <li className="flex justify-between items-center">
                  <span>Quinoa Salad</span>
                  <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    + Dinner
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
