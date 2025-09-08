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
import { LocalStorageIngredientRepository } from "../../Infrastructure/Repositories/LocalStorageIngredientRepository";

export function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tab, setTab] = useState<"dashboard" | "planner" | "list">("dashboard");

  const [query, setQuery] = useState("");
  const [mealFilter, setMealFilter] = useState<
    "all" | "breakfast" | "lunch" | "dinner"
  >("all");

  const [planner, setPlanner] = useState<Planner>(() => makeEmptyPlanner());
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [selected, setSelected] = useState<Recipe | null>(null);

  const recipeRepo = useMemo(() => new LocalStorageRecipeRepository(), []);
  const plannerRepoRef = useRef<LocalStoragePlannerRepository>();
  const ingredientRepo = useMemo(
    () => new LocalStorageIngredientRepository(),
    []
  );

  useEffect(() => {
    (async () => {
      const items = await ingredientRepo.getAll();
      if (items.length) {
        const list = new ShoppingList();
        for (const entry of items) {
          list.addItem(entry.ingredient.category, entry.ingredient);
          if (entry.have)
            list.toggleHave(entry.ingredient.category, entry.ingredient.name);
        }
        setShoppingList(list);
      }
    })();
  }, [ingredientRepo]);

  useEffect(() => {
    if (!shoppingList) return;
    (async () => {
      const items = shoppingList.getItems();
      const flat = Object.keys(items).flatMap((cat) =>
        items[cat].map((entry) => ({
          ingredient: entry.ingredient,
          have: entry.have,
        }))
      );
      await ingredientRepo.saveAll(flat);
    })();
  }, [shoppingList, ingredientRepo]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const existing = await recipeRepo.getAll();
        if (!existing.length) {
          for (const r of recipesData as Recipe[]) {
            await recipeRepo.save(r);
          }
        }
        const allRecipes = await recipeRepo.getAll();
        if (!cancelled) setRecipes(allRecipes);

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

  useEffect(() => {
    if (!plannerRepoRef.current) return;
    void plannerRepoRef.current.save(planner);
  }, [planner]);

  const handleAddToBuy = (r: Recipe) => {
    setShoppingList((prev) => {
      const next = prev
        ? ShoppingList.fromSnapshot(prev.getSnapshot())
        : new ShoppingList();
      next.addIngredients(r.ingredients);
      return next;
    });
  };

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
