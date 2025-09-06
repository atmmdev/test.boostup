import { Recipe } from "../../Domain/Entities/Recipe";
import { RecipeCard } from "./RecipeCard";

interface Props {
  recipes: Recipe[];
  onSelect: (id: string) => void;
}

export function RecipeGallery({ recipes, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <h1>RecipeGallery</h1>
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} onClick={() => onSelect(r.id)} />
      ))}
    </div>
  );
}
