import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Recipe } from "../../Domain/Entities/Recipe";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots: ("Breakfast" | "Lunch" | "Dinner")[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
];

type PlannerState = Record<string, Record<string, { recipe?: Recipe }>>;

const initialState: PlannerState = Object.fromEntries(
  days.map((d) => [
    d,
    Object.fromEntries(slots.map((s) => [s, {} as { recipe?: Recipe }])),
  ])
);

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    addToPlanner(
      state,
      action: PayloadAction<{ day: string; slot: string; recipe: Recipe }>
    ) {
      const { day, slot, recipe } = action.payload;
      state[day][slot] = { recipe };
    },
    clearPlanner() {
      return initialState;
    },
  },
});

export const { addToPlanner, clearPlanner } = plannerSlice.actions;
export default plannerSlice.reducer;
