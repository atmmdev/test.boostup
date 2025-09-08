import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ShoppingList } from "../../Domain/Entities/ShoppingList";
import type { Recipe } from "../../Domain/Entities/Recipe";

interface ShoppingState {
  list: ShoppingList | null;
}

const initialState: ShoppingState = {
  list: null,
};

const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    generateList(state, action: PayloadAction<Recipe[]>) {
      const list = new ShoppingList();
      for (const recipe of action.payload) {
        list.addIngredients(recipe.ingredients);
      }
      state.list = list;
    },
    toggleHave(state, action: PayloadAction<{ cat: string; name: string }>) {
      if (state.list) {
        state.list.toggleHave(action.payload.cat, action.payload.name);
      }
    },
  },
});

export const { generateList, toggleHave } = shoppingSlice.actions;
export default shoppingSlice.reducer;
