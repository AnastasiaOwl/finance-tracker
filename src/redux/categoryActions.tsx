"use client"
import { addCategory, setCategories, deleteCategory} from "./categorySlice";
import { addCategoryToFirestore, fetchCategories, deleteCategoryFirestore} from "@/firebase/firebaseApi";
import { Category } from "@/redux/categorySlice";
import { AppDispatch } from "./store";

export const addCategoryAsync =
  (category: Omit<Category, "id">) =>
  async (dispatch: AppDispatch) => {
    const docId = await addCategoryToFirestore(
      category as Category
    );
    const numericId = parseInt(docId, 10);
    dispatch(addCategory({ ...category, id: numericId }));
    return numericId;
  };

export const deleteCategoryAsync = 
(categoryId: string) => async (dispatch: AppDispatch)=>{
  try {
    await deleteCategoryFirestore(categoryId);
    dispatch(deleteCategory(categoryId));
    console.log("✅ Category deleted from Redux and Firestore");
  } catch (error) {
    console.error("❌ Error deleting category:", error);
  }
}

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