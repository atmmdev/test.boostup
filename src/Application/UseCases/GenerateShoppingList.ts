import { MealPlan } from "../../Domain/Entities/MealPlan";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";
import type { RecipeRepository } from "../../Domain/Repositories/RecipeRepository";

export class GenerateShoppingList {
  constructor(private recipeRepo: RecipeRepository) {}

  async execute(plan: MealPlan): Promise<ShoppingList> {
    const shoppingList = new ShoppingList();

    for (const meal of plan.getMeals()) {
      shoppingList.addIngredients(meal.ingredients);
    }

    return shoppingList;
  }
}
