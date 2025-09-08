import { useEffect, useMemo, useRef, useState } from "react";
import recipesData from "../../Data/recipe.json";
import type { Recipe } from "../../Domain/Entities/Recipe";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";

import { Sidebar } from "../components/Sidebar";
import { RecipeGallery } from "../components/RecipeGallery";
import { MealPlanner } from "../components/MealPlanner";
import { ShoppingListView } from "../components/ShoppingListView";
import { RecipeModal } from "../components/RecipeModal";

import {
  makeEmptyPlanner,
  type Planner,
  type Day,
  type Slot,
} from "../../Domain/Entities/Planner";

import { LocalStoragePlannerRepository } from "../../Infrastructure/Repositories/LocalStoragePlannerRepository";
import { LocalStorageRecipeRepository } from "../../Infrastructure/Repositories/LocalStorageRecipeRepository";

export function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tab, setTab] = useState<"dashboard" | "planner" | "list">("dashboard");

  const [query, setQuery] = useState("");
  const [mealFilter, setMealFilter] = useState<"all" | "breakfast" | "lunch" | "dinner">("all");

  const [planner, setPlanner] = useState<Planner>(() => makeEmptyPlanner());
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [selected, setSelected] = useState<Recipe | null>(null);

  // Repositórios
  const recipeRepo = useMemo(() => new LocalStorageRecipeRepository(), []);
  const plannerRepoRef = useRef<LocalStoragePlannerRepository>();

  // Seed de receitas + carga do planner
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) Seed das receitas
        const existing = await recipeRepo.getAll();
        if (!existing.length) {
          for (const r of recipesData as Recipe[]) {
            await recipeRepo.save(r);
          }
        }
        const allRecipes = await recipeRepo.getAll();
        if (!cancelled) setRecipes(allRecipes);

        // 2) Carregar planner (depois do seed)
        const repo = new LocalStoragePlannerRepository(recipeRepo);
        plannerRepoRef.current = repo;
        const loaded = await repo.load();
        if (!cancelled) setPlanner(loaded);
      } catch (err) {
        console.error("Erro ao carregar seed/planner", err);
        if (!cancelled) {
          setRecipes(recipesData as Recipe[]);
          setPlanner(makeEmptyPlanner());
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [recipeRepo]);

  // Auto-save do planner
  useEffect(() => {
    if (!plannerRepoRef.current) return;
    void plannerRepoRef.current.save(planner);
  }, [planner]);

  // Adicionar ingredientes (card -> ShoppingList)
  const handleAddToBuy = (r: Recipe) => {
    setShoppingList((prev) => {
      const next = prev
        ? ShoppingList.fromSnapshot(prev.getSnapshot())
        : new ShoppingList();
      next.addIngredients(r.ingredients);
      return next;
    });
  };

  // Planejar receita em dia/slot
  const handlePlan = (day: Day, slot: Slot, recipe: Recipe) => {
    if (!recipe?.id) {
      console.error("Recipe sem id, não pode salvar no planner", recipe);
      return;
    }

    setPlanner((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: { recipe },
      },
    }));
    setTab("planner");
  };

  const shoppingCount = shoppingList ? shoppingList.getTotalCount() : 0;

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Sidebar tab={tab} setTab={setTab} shoppingCount={shoppingCount} />

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
            onPlan={handlePlan}
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
            onToggle={(cat, name) => {
              setShoppingList((prev) => {
                if (!prev) return prev;
                const next = ShoppingList.fromSnapshot(prev.getSnapshot());
                next.toggleHave(cat, name);
                return next;
              });
            }}
          />
        )}
      </main>

      {selected && (
        <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
