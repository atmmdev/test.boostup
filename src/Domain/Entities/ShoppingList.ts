import type { Ingredient } from "./Recipe";

type ItemEntry = { ingredient: Ingredient; have: boolean };
type ItemsByCategory = Record<string, ItemEntry[]>;

export class ShoppingList {
  private items: ItemsByCategory;

  constructor(initial?: ItemsByCategory) {
    this.items = initial ? ShoppingList.deepCopy(initial) : {};
  }

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

  getSnapshot(): ItemsByCategory {
    return ShoppingList.deepCopy(this.items);
  }

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

  static fromSnapshot(snapshot: ItemsByCategory): ShoppingList {
    return new ShoppingList(snapshot);
  }
}
