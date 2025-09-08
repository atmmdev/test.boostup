import type { ShoppingList } from "../../Domain/Entities/ShoppingList";

interface Props {
  shoppingList: ShoppingList;
  onToggle: (category: string, name: string) => void;
}

export function ShoppingListView({ shoppingList, onToggle }: Props) {
  const items = shoppingList.getItems();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Shopping List</h2>
      {Object.keys(items).map((category) => (
        <div key={category} className="mb-6">
          <h3 className="font-semibold text-green-700 mb-2">{category}</h3>
          <ul className="space-y-2">
            {items[category].map((entry) => (
              <li
                key={entry.ingredient.name}
                className="flex justify-between items-center bg-white shadow px-3 py-2 rounded"
              >
                <span
                  className={`${
                    entry.have ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {entry.ingredient.name} — {entry.ingredient.quantity}
                </span>
                <button
                  className="text-xs bg-green-100 px-2 py-1 rounded text-green-700"
                  onClick={() =>
                    onToggle(category, entry.ingredient.name)
                  }
                >
                  {entry.have ? "Undo" : "Already Have"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
