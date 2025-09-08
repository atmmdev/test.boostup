// src/Presentation/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import recipesData from "../../Data/recipe.json";
import type { Recipe } from "../../Domain/Entities/Recipe";
import { MealPlan } from "../../Domain/Entities/MealPlan";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";
import { Sidebar } from "../components/Sidebar";
import { RecipeGallery } from "../components/RecipeGallery";
import { MealPlanner } from "../components/MealPlanner";
import { ShoppingListView } from "../components/ShoppingListView";
import { RecipeModal } from "../components/RecipeModal";

export function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tab, setTab] = useState<"dashboard" | "planner" | "list">("dashboard");

  const [query, setQuery] = useState("");
  const [mealFilter, setMealFilter] = useState<
    "all" | "breakfast" | "lunch" | "dinner"
  >("all");

  const [planner, setPlanner] = useState<any>({});
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [selected, setSelected] = useState<Recipe | null>(null);

  useEffect(() => {
    setRecipes(recipesData as Recipe[]);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Sidebar
        tab={tab}
        setTab={setTab}
        shoppingCount={shoppingList ? shoppingList.getTotalCount() : 0}
      />
      <main className="flex-1 p-4 overflow-auto">
        {tab === "dashboard" && (
          <RecipeGallery
            recipes={recipes}
            query={query}
            mealFilter={mealFilter}
            setQuery={setQuery}
            setMealFilter={setMealFilter}
            onSelect={setSelected}
            onAdd={(r) => console.log("Add recipe", r)}
          />
        )}
        {tab === "planner" && (
          <MealPlanner
            planner={planner}
            setPlanner={setPlanner}
            setShoppingList={setShoppingList}
            setTab={setTab}
          />
        )}
        {tab === "list" && shoppingList && (
          <ShoppingListView
            shoppingList={shoppingList}
            setShoppingList={setShoppingList}
          />
        )}
      </main>
      {selected && <RecipeModal recipe={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}