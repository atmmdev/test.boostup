import { MealPlan, MealSlot } from "../../Domain/Entities/MealPlan";

export class PlanMeal {
  constructor(private mealPlan: MealPlan) {}

  execute(slot: MealSlot) {
    this.mealPlan.addMeal(slot);
    return this.mealPlan;
  }
}
