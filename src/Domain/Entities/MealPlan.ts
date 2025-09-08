import { Recipe } from "./Recipe";

export class MealPlan {
  meals: Recipe[] = [];

  constructor(meals: Recipe[] = []) {
    this.meals = meals;
  }

  addRecipe(recipe: Recipe) {
    this.meals.push(recipe);
  }

  getMeals() {
    return this.meals;
  }
}
