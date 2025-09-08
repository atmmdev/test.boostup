// src/Infrastructure/Repositories/LocalStoragePlannerRepository.ts
import type { PlannerRepository } from "../../Domain/Repositories/PlannerRepository";
import { makeEmptyPlanner, days, slots, type Planner, type Day, type Slot } from "../../Domain/Entities/Planner";
import type { RecipeRepository } from "../../Domain/Repositories/RecipeRepository";

type Snapshot = Record<Day, Record<Slot, string | null>>; // guarda apenas recipeId

const KEY = "planner_ids_v1";

export class LocalStoragePlannerRepository implements PlannerRepository {
  constructor(private recipeRepo: RecipeRepository) {}

  async load(): Promise<Planner> {
    const json = localStorage.getItem(KEY);
    if (!json) return makeEmptyPlanner();

    let snap: Snapshot | null = null;
    try {
      snap = JSON.parse(json) as Snapshot;
    } catch {
      return makeEmptyPlanner();
    }

    // Reconstruir Planner a partir dos IDs
    const planner = makeEmptyPlanner();
    for (const d of days) {
      for (const s of slots) {
        const id = snap?.[d]?.[s] ?? null;
        if (id) {
          try {
            const recipe = await this.recipeRepo.getById(id);
            planner[d][s] = { recipe };
          } catch {
            planner[d][s] = {};
          }
        }
      }
    }
    console.log(">> Carregado do localStorage:", snap);
    return planner;
  }

  async save(planner: Planner): Promise<void> {
    const snap: Snapshot = {} as any;
    for (const d of days) {
      snap[d] = {} as any;
      for (const s of slots) {
        snap[d][s] = planner[d][s]?.recipe?.id ?? null;
      }
    }
    console.log(">> Salvando snapshot no localStorage:", snap);
    localStorage.setItem(KEY, JSON.stringify(snap));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(KEY);
  }
}
