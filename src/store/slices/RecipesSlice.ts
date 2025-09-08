// src/store/slices/recipesSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import data from "../../Data/recipe.json";
import type { Recipe } from "../../Domain/Entities/Recipe";

interface RecipesState {
  all: Recipe[];
  query: string;
  filter: "all" | "breakfast" | "lunch" | "dinner";
}

const initialState: RecipesState = {
  all: data as Recipe[],
  query: "",
  filter: "all",
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setFilter(state, action: PayloadAction<RecipesState["filter"]>) {
      state.filter = action.payload;
    },
  },
});

export const { setQuery, setFilter } = recipesSlice.actions;
export default recipesSlice.reducer;
