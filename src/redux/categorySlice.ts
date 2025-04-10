"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  id: number;
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
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (cat) => cat.id?.toString() !== action.payload
      );
    },
  }
});

export const { addCategory,setCategories, deleteCategory} = categorySlice.actions;
export default categorySlice.reducer;