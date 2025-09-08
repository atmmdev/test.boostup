import type { Ingredient } from "./Recipe";

export class ShoppingList {
  private items: Record<string, { ingredient: Ingredient; have: boolean }[]> = {};

  addIngredients(ingredients: Ingredient[]) {
    for (const ing of ingredients) {
      if (!this.items[ing.category]) {
        this.items[ing.category] = [];
      }

      // Verifica se já existe o mesmo ingrediente na categoria
      const existing = this.items[ing.category].find(
        (i) => i.ingredient.name.toLowerCase() === ing.name.toLowerCase()
      );

      if (existing) {
        // Se já existir, concatena quantidade
        existing.ingredient.quantity += ` + ${ing.quantity}`;
      } else {
        this.items[ing.category].push({ ingredient: ing, have: false });
      }
    }
  }

  /** Retorna itens agrupados por categoria */
  getItems() {
    return this.items;
  }

  /** Marca ingrediente como "já tenho" */
  toggleHave(category: string, ingredientName: string) {
    const catItems = this.items[category];
    if (!catItems) return;

    const item = catItems.find(
      (i) => i.ingredient.name.toLowerCase() === ingredientName.toLowerCase()
    );

    if (item) {
      item.have = !item.have;
    }
  }

  /** Remove ingrediente */
  removeItem(category: string, ingredientName: string) {
    if (this.items[category]) {
      this.items[category] = this.items[category].filter(
        (i) => i.ingredient.name.toLowerCase() !== ingredientName.toLowerCase()
      );
    }
  }

  /** Adiciona manualmente */
  addItem(category: string, ingredient: Ingredient) {
    if (!this.items[category]) {
      this.items[category] = [];
    }
    this.items[category].push({ ingredient, have: false });
  }
}
