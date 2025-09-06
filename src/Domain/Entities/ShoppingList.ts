import type { Ingredient } from "./Recipe";

export class ShoppingList {
  private items: Record<string, Ingredient[]> = {};

  addIngredients(ingredients: Ingredient[]) {
    for (const ing of ingredients) {
      if (!this.items[ing.category]) {
        this.items[ing.category] = [];
      }
      this.items[ing.category].push(ing);
    }
  }

  getItems() {
    return this.items;
  }
}
