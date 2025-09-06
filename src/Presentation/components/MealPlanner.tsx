import { MealPlan } from "../../Domain/Entities/MealPlan";

interface Props {
  plan: MealPlan;
}

export function MealPlanner({ plan }: Props) {
  return (
    <div className="grid grid-cols-7 gap-2">
      <h1>MealPlan</h1>
      {plan.slots.map((slot, i) => (
        <div key={i} className="p-2 border rounded text-sm">
          {slot.date} - {slot.type} → {slot.recipeId}
        </div>
      ))}
    </div>
  );
}
