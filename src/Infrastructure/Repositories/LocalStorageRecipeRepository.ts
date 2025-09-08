// src/Infrastructure/Repositories/LocalStorageRecipeRepository.ts
import type { RecipeRepository } from "../../Domain/Repositories/RecipeRepository";
import type { Recipe } from "../../Domain/Entities/Recipe";

export class LocalStorageRecipeRepository implements RecipeRepository {
  private key = "recipes";

  async getAll(): Promise<Recipe[]> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  async getById(id: string): Promise<Recipe> {
    const recipes = await this.getAll();
    const found = recipes.find(r => r.id === id);
    if (!found) {
      throw new Error(`Recipe with id ${id} not found`);
    }
    return found;
  }

  async save(recipe: Recipe): Promise<void> {
    const recipes = await this.getAll();
    recipes.push(recipe);
    localStorage.setItem(this.key, JSON.stringify(recipes));
  }
}
