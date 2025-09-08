// src/Domain/Entities/Planner.ts
import type { Recipe } from "./Recipe";

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const slots = ["Breakfast", "Lunch", "Dinner"] as const;

export type Day = typeof days[number];
export type Slot = typeof slots[number];

export type PlannerCell = { recipe?: Recipe };
export type Planner = Record<Day, Record<Slot, PlannerCell>>;

export function makeEmptyPlanner(): Planner {
  const base: Planner = {} as any;
  for (const d of days) {
    base[d] = {} as any;
    for (const s of slots) base[d][s] = {};
  }
  return base;
}
