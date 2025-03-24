"use client"
import { addCategory, setCategories} from "./categorySlice";
import { addCategoryToFirestore, fetchCategories} from "@/firebase/firebaseApi";
import { Category } from "@/redux/categorySlice";
import { AppDispatch } from "./store";

// Inside addCategoryAsync:
// categoryActions.ts
export const addCategoryAsync =
  (category: Omit<Category, "id">) => 
  async (dispatch: AppDispatch) => {
    try {
      const docId = await addCategoryToFirestore(category);
      const numericId = parseInt(docId, 10);
      dispatch(addCategory({ ...category, id: numericId }));
      return numericId;
    } catch (error) {
      console.error("❌ Error adding category:", error);
      throw error;
    }
  };



export const fetchCategoryAsync =
  () => async (dispatch: AppDispatch) => {
    try {
      const categories = await fetchCategories();
      dispatch(setCategories(categories));
      console.log("✅ Category loaded into Redux");
    } catch (error) {
      console.error("❌ Error loading category:", error);
    }
  };