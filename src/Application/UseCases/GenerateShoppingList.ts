
import type { RecipeRepository } from "../../Domain/Repositories/RecipeRepository";
import { MealPlan } from "../../Domain/Entities/MealPlan";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";

export class GenerateShoppingList {
  constructor(private recipeRepo: RecipeRepository) { }

  async execute(mealPlan: MealPlan): Promise<ShoppingList> {
    const shoppingList = new ShoppingList();
    for (const slot of mealPlan.slots) {
      const recipe = await this.recipeRepo.getById(slot.recipeId);
      shoppingList.addIngredients(recipe.ingredients);
    }
    return shoppingList;
  }
}
