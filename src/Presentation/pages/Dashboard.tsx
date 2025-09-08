// src/Presentation/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import recipesData from "../../Data/recipe.json";
import type { Recipe } from "../../Domain/Entities/Recipe";
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
  const [mealFilter, setMealFilter] = useState<"all" | "breakfast" | "lunch" | "dinner">("all");

  // planner simples por enquanto (você pode migrar para Redux quando quiser)
  const [planner, setPlanner] = useState<any>({});
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [selected, setSelected] = useState<Recipe | null>(null);

  useEffect(() => {
    setRecipes(recipesData as Recipe[]);
  }, []);

  // 👉 chamado pelo RecipeCard -> adiciona ingredientes desse recipe à shopping list
  const handleAddToBuy = (r: Recipe) => {
    setShoppingList(prev => {
      const next = prev ? ShoppingList.fromSnapshot(prev.getSnapshot()) : new ShoppingList();
      next.addIngredients(r.ingredients);
      return next;
    });
    // opcional: já navegar para a lista
    // setTab("list");
  };

  const shoppingCount = shoppingList ? shoppingList.getTotalCount() : 0;

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Sidebar
        tab={tab}
        setTab={setTab}
        shoppingCount={shoppingCount}
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
            onAdd={handleAddToBuy}
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
            // ✅ use o padrão onToggle (preferível). Assim não precisa passar setShoppingList.
            onToggle={(cat, name) => {
              setShoppingList(prev => {
                if (!prev) return prev;
                const next = ShoppingList.fromSnapshot(prev.getSnapshot());
                next.toggleHave(cat, name);
                return next;
              });
            }}
          />
        )}
      </main>

      {selected && <RecipeModal recipe={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
