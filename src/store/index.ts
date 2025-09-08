import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "./slices/RecipesSlice";
import plannerReducer from "./slices/PlannerSlice";
import shoppingReducer from "./slices/ShoppingListSlice";
import uiReducer from "./slices/UISlice";

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    planner: plannerReducer,
    shopping: shoppingReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
