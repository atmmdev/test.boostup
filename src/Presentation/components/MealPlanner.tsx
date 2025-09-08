// src/Presentation/components/MealPlanner.tsx
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

/** Gera uma estrutura vazia e segura (sem undefined) */
function makeEmptyPlanner(): Planner {
  const base: Planner = {} as Planner;
  for (const d of days) {
    base[d] = {} as Record<Slot, Cell>;
    for (const s of slots) base[d][s] = {};
  }
  return base;
}

/** Normaliza qualquer objeto em um Planner completo (preenche faltantes) */
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

export function MealPlanner({ planner, setPlanner, setShoppingList, setTab }: Props) {
  // Garantimos que sempre teremos todas as chaves de dias/slots
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

  /** (opcional) util para setar uma receita em um dia/slot */
  function setCell(day: Day, slot: Slot, recipe?: Recipe) {
    const next = normalizePlanner(safePlanner); // cópia segura
    next[day][slot] = recipe ? { recipe } : {};
    setPlanner(next);
  }

  /** (opcional) limpar toda a semana */
  function clearAll() {
    setPlanner(makeEmptyPlanner());
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Weekly Meal Planner</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearAll}
            className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm"
          >
            Clear Week
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="p-2 border w-28"></th>
              {days.map((d) => (
                <th key={d} className="p-2 border text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s}>
                <td className="p-2 border font-semibold">{s}</td>
                {days.map((d) => {
                  const cell = safePlanner[d][s];
                  const has = Boolean(cell?.recipe);
                  return (
                    <td key={d + s} className="p-2 border align-top">
                      {has ? (
                        <div className="space-y-1">
                          <div className="font-medium">{cell!.recipe!.title}</div>
                          <div className="text-xs text-gray-500">
                            P:{cell!.recipe!.nutrition.protein} • C:{cell!.recipe!.nutrition.carbs} • F:{cell!.recipe!.nutrition.fat}
                          </div>
                          <button
                            type="button"
                            onClick={() => setCell(d, s, undefined)}
                            className="mt-1 text-xs text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs">Empty</span>
                          {/* Botão de placeholder para teste rápido (seta vazio) */}
                          <button
                            type="button"
                            onClick={() => setCell(d, s, undefined)}
                            className="text-xs text-green-700"
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
  );
}
