import { MealPlan, MealSlot } from "../../Dmain/Entities/MealPlan";

export class PlanMeal {
  constructor(private mealPlan: MealPlan) {}

  execute(slot: MealSlot) {
    this.mealPlan.addMeal(slot);
    return this.mealPlan;
  }
}
