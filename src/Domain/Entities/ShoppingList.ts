// src/Domain/Entities/ShoppingList.ts
import type { Ingredient } from "./Recipe";

type ItemEntry = { ingredient: Ingredient; have: boolean };
type ItemsByCategory = Record<string, ItemEntry[]>;

export class ShoppingList {
  private items: ItemsByCategory;

  constructor(initial?: ItemsByCategory) {
    this.items = initial ? ShoppingList.deepCopy(initial) : {};
  }

  /** Clona profundamente a estrutura (para imutabilidade no React) */
  private static deepCopy(data: ItemsByCategory): ItemsByCategory {
    const copy: ItemsByCategory = {};
    for (const cat of Object.keys(data)) {
      copy[cat] = data[cat].map(entry => ({
        ingredient: { ...entry.ingredient },
        have: entry.have,
      }));
    }
    return copy;
  }

  /** Serializa um snapshot profundo para poder recriar a lista mais tarde */
  getSnapshot(): ItemsByCategory {
    return ShoppingList.deepCopy(this.items);
  }

  /** Soma total de itens (usado no badge do Sidebar) */
  getTotalCount(): number {
    return Object.values(this.items).reduce((acc, arr) => acc + arr.length, 0);
  }

  addIngredients(ingredients: Ingredient[]) {
    for (const ing of ingredients) {
      if (!this.items[ing.category]) {
        this.items[ing.category] = [];
      }

      const existing = this.items[ing.category].find(
        (i) => i.ingredient.name.toLowerCase() === ing.name.toLowerCase()
      );

      if (existing) {
        // concatena quantidades
        existing.ingredient.quantity += ` + ${ing.quantity}`;
      } else {
        this.items[ing.category].push({ ingredient: { ...ing }, have: false });
      }
    }
  }

  getItems(): ItemsByCategory {
    return this.items;
  }

  toggleHave(category: string, ingredientName: string) {
    const catItems = this.items[category];
    if (!catItems) return;
    const item = catItems.find(
      (i) => i.ingredient.name.toLowerCase() === ingredientName.toLowerCase()
    );
    if (item) item.have = !item.have;
  }

  removeItem(category: string, ingredientName: string) {
    if (!this.items[category]) return;
    this.items[category] = this.items[category].filter(
      (i) => i.ingredient.name.toLowerCase() !== ingredientName.toLowerCase()
    );
  }

  addItem(category: string, ingredient: Ingredient) {
    if (!this.items[category]) this.items[category] = [];
    this.items[category].push({ ingredient: { ...ingredient }, have: false });
  }

  /** Factory: recria a lista a partir de um snapshot */
  static fromSnapshot(snapshot: ItemsByCategory): ShoppingList {
    return new ShoppingList(snapshot);
  }
}
