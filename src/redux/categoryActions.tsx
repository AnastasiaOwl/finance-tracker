"use client"
import { addCategory, setCategories} from "./categorySlice";
import { addCategoryToFirestore, fetchCategories} from "@/firebase/firebaseApi";
import { Category } from "@/redux/categorySlice";
import { AppDispatch } from "./store";

export const addCategoryAsync =
  (category: Category) => async (dispatch: AppDispatch) => {
    try {
      const categoryId = await addCategoryToFirestore(category);
      dispatch(addCategory({ ...category, id: categoryId }));
      console.log("✅ Category added to Redux and Firestore");
    } catch (error) {
      console.error("❌ Error adding category:", error);
    }
  };

export const fetchCategoryAsync = 
()=> async (dispatch: AppDispatch)=>{
  try {
    const category = await fetchCategories();
    dispatch(setCategories(category));
    console.log("✅ Category loaded into Redux");
  } catch (error) {
    console.error("❌ Error loading category:", error);
  }
}