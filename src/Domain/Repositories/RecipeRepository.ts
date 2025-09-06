import { Recipe } from "../Entities/Recipe";

export interface RecipeRepository {
  getAll(): Promise<Recipe[]>;
  getById(id: string): Promise<Recipe>;
  save(recipe: Recipe): Promise<void>;
}
