"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  id?: string;
  name: string;
  type: "Дохід" | "Витрати";
}

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
          state.categories = action.payload;
    },
  },
});

export const { addCategory,setCategories} = categorySlice.actions;
export default categorySlice.reducer;