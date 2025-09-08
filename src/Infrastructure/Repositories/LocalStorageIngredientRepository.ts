import type { Ingredient } from "../../Domain/Entities/Recipe";

export class LocalStorageIngredientRepository {
  private key = "shopping_ingredients";

  async getAll(): Promise<{ ingredient: Ingredient; have: boolean }[]> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  async saveAll(items: { ingredient: Ingredient; have: boolean }[]): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.key);
  }
}
