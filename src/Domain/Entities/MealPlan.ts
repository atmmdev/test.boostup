export type MealType = "breakfast" | "lunch" | "dinner";

export interface MealSlot {
  date: string;
  type: MealType;
  recipeId: string;
}

export class MealPlan {
  constructor(public slots: MealSlot[] = []) {}

  addMeal(slot: MealSlot) {
    this.slots.push(slot);
  }
}
