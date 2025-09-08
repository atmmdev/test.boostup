// src/Domain/Entities/MealPlan.ts
import { Recipe } from "./Recipe";

export class MealPlan {
  meals: Recipe[] = [];
  constructor(meals: Recipe[] = []) {
    this.meals = meals;
  }
  addRecipe(_recipe: Recipe) {
    // legado — evitar usar
    this.meals.push(_recipe);
  }
  withRecipe(recipe: Recipe): MealPlan {
    return new MealPlan([...this.meals, recipe]);
  }
  getMeals() {
    return this.meals;
  }
}
