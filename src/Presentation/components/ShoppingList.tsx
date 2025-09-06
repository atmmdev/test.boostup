import { ShoppingList } from "../../Domain/Entities/ShoppingList";

interface Props {
  list: ShoppingList;
}

export function ShoppingListView({ list }: Props) {
  const items = list.getItems();
  return (
    <div>
      <h1>ShoppingListView</h1>
      {Object.keys(items).map((cat) => (
        <div key={cat}>
          <h3 className="font-bold">{cat}</h3>
          <ul>
            {items[cat].map((ing, i) => (
              <li key={i}>
                {ing.quantity} {ing.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
