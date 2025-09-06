import { Recipe } from "../../Domain/Entities/Recipe";

interface Props {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: Props) {
  return (
    <div
      className="p-4 rounded-xl shadow-md cursor-pointer hover:scale-105 transition"
      onClick={onClick}
    >
      <img src={recipe.image} alt={recipe.title} className="rounded-md" />
      <h3 className="mt-2 font-bold">{recipe.title}</h3>
      <p>{recipe.cookingTime} min • {recipe.difficulty}</p>
      <div className="flex gap-2 mt-2 flex-wrap">
        {recipe.dietaryTags.map(tag => (
          <span key={tag} className="px-2 py-1 text-xs bg-green-100 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
