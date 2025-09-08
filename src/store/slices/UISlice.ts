import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Recipe } from "../../Domain/Entities/Recipe";

interface UIState {
  tab: "dashboard" | "planner" | "list";
  selected: Recipe | null;
}

const initialState: UIState = {
  tab: "dashboard",
  selected: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<UIState["tab"]>) {
      state.tab = action.payload;
    },
    selectRecipe(state, action: PayloadAction<Recipe | null>) {
      state.selected = action.payload;
    },
  },
});

export const { setTab, selectRecipe } = uiSlice.actions;
export default uiSlice.reducer;
