import { useMemo } from "react";
import type { Recipe } from "../../Domain/Entities/Recipe";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const slots = ["Breakfast", "Lunch", "Dinner"] as const;

type Day = typeof days[number];
type Slot = typeof slots[number];

type Cell = { recipe?: Recipe };
type Planner = Record<Day, Record<Slot, Cell>>;

interface Props {
  planner: Record<string, Record<string, { recipe?: Recipe }>>;
  setPlanner: (p: Planner) => void;
  setShoppingList: (s: ShoppingList) => void;
  setTab: (t: "dashboard" | "planner" | "list") => void;
}

function makeEmptyPlanner(): Planner {
  const base: Planner = {} as Planner;
  for (const d of days) {
    base[d] = {} as Record<Slot, Cell>;
    for (const s of slots) base[d][s] = {};
  }
  return base;
}

function normalizePlanner(input: any): Planner {
  const empty = makeEmptyPlanner();
  for (const d of days) {
    const srcDay = (input?.[d] ?? {}) as Record<string, Cell>;
    for (const s of slots) {
      empty[d][s] = srcDay?.[s] && typeof srcDay[s] === "object" ? srcDay[s] : {};
    }
  }
  return empty;
}

function SlotLabel({ slot }: { slot: Slot }) {
  return (
    <span className="inline-flex items-center gap-1 font-medium">
      {slot}
    </span>
  );
}

function RecipeBadge({ recipe }: { recipe: Recipe }) {
  return (
    <div className="space-y-1">
      <div className="font-medium truncate" title={recipe.title}>
        {recipe.title}
      </div>
      <div className="text-xs text-gray-500">
        P:{recipe.nutrition.protein} • C:{recipe.nutrition.carbs} • F:{recipe.nutrition.fat}
      </div>
    </div>
  );
}

export function MealPlanner({ planner, setPlanner, setShoppingList, setTab }: Props) {
  const safePlanner = useMemo(() => normalizePlanner(planner), [planner]);

  function collectPlannedRecipes(pl: Planner): Recipe[] {
    const list: Recipe[] = [];
    for (const d of days) {
      for (const s of slots) {
        const r = pl[d][s]?.recipe;
        if (r) list.push(r);
      }
    }
    return list;
  }

  function handleGenerateList() {
    const list = new ShoppingList();
    for (const recipe of collectPlannedRecipes(safePlanner)) {
      list.addIngredients(recipe.ingredients);
    }
    setShoppingList(list);
    setTab("list");
  }

  function setCell(day: Day, slot: Slot, recipe?: Recipe) {
    const next = normalizePlanner(safePlanner);
    next[day][slot] = recipe ? { recipe } : {};
    setPlanner(next);
  }

  function clearAll() {
    setPlanner(makeEmptyPlanner());
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Weekly Meal Planner</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerateList}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Generate Shopping List
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Clear Week
          </button>
        </div>
      </div>

      {/* MOBILE LAYOUT (cards) */}
      <div className="grid gap-3 md:hidden">
        {days.map((d) => (
          <section key={d} className="bg-white rounded-lg shadow p-3">
            <h3 className="font-semibold mb-2">{d}</h3>
            <div className="grid gap-2">
              {slots.map((s) => {
                const cell = safePlanner[d][s];
                const has = Boolean(cell?.recipe);
                return (
                  <div
                    key={d + s}
                    className="flex items-start justify-between border rounded-md p-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 mb-1">
                        <SlotLabel slot={s} />
                      </div>
                      {has ? (
                        <RecipeBadge recipe={cell!.recipe!} />
                      ) : (
                        <span className="text-gray-400 text-xs">Empty</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {has ? (
                        <button
                          type="button"
                          onClick={() => setCell(d as Day, s as Slot, undefined)}
                          className="text-xs text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300 rounded px-2 py-1"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCell(d as Day, s as Slot, undefined)}
                          className="text-xs text-green-700 hover:underline focus:outline-none focus:ring-2 focus:ring-green-300 rounded px-2 py-1"
                          title="Leave empty"
                          aria-label={`Keep ${d} ${s} empty`}
                        >
                          —
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* DESKTOP LAYOUT (tabela) */}
      <div className="hidden md:block">
        <div className="overflow-auto rounded-lg border">
           <table className="min-w-[960px] w-full text-sm border-collapse">
            <thead>
              <tr>
                <th
                  className="p-2 border sticky left-0 z-20 bg-gray-50 w-36 text-left"
                  scope="col"
                ></th>
                {days.map((d) => (
                  <th
                    key={d}
                    scope="col"
                    className="p-2 border text-center sticky top-0 bg-gray-50 z-10"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s} className="align-top">
                  <th
                    scope="row"
                    className="p-2 border font-semibold sticky left-0 bg-white z-10"
                  >
                    <SlotLabel slot={s} />
                  </th>
                  {days.map((d) => {
                    const cell = safePlanner[d][s];
                    const has = Boolean(cell?.recipe);
                    return (
                      <td key={d + s} className="p-2 border align-top">
                        {has ? (
                          <div className="space-y-1">
                            <div
                              className="font-medium truncate max-w-[16ch]"
                              title={cell!.recipe!.title}
                            >
                              {cell!.recipe!.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              P:{cell!.recipe!.nutrition.protein} • C:{cell!.recipe!.nutrition.carbs} • F:{cell!.recipe!.nutrition.fat}
                            </div>
                            <button
                              type="button"
                              onClick={() => setCell(d as Day, s as Slot, undefined)}
                              className="mt-1 text-xs text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300 rounded px-1 py-0.5"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-xs">Empty</span>
                            <button
                              type="button"
                              onClick={() => setCell(d as Day, s as Slot, undefined)}
                              className="text-xs text-green-700 hover:underline focus:outline-none focus:ring-2 focus:ring-green-300 rounded px-1 py-0.5"
                              title="Leave empty"
                              aria-label={`Keep ${d} ${s} empty`}
                            >
                              —
                            </button>
                          </div>
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
    </div>
  );
}
