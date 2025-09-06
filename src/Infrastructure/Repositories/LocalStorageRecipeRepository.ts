import type { RecipeRepository } from "../../Domain/Repositories/RecipeRepository";
import { Recipe } from "../../Domain/Entities/Recipe";

export class LocalStorageRecipeRepository implements RecipeRepository {
  private key = "recipes";

  async getAll(): Promise<Recipe[]> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  async getById(id: string): Promise<Recipe> {
    const recipes = await this.getAll();
    return recipes.find(r => r.id === id)!;
  }

  async save(recipe: Recipe): Promise<void> {
    const recipes = await this.getAll();
    recipes.push(recipe);
    localStorage.setItem(this.key, JSON.stringify(recipes));
  }
}
