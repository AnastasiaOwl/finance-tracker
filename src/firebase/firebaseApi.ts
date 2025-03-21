"use client"
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Transaction } from "@/redux/transactionSlice";
import {Category} from "@/redux/categorySlice";

export const addCategoryToFirestore = async (category: Category) => {
  const userId = "testUser_123";
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "categories"),
      category
    );
    console.log("✅ Category added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding category:", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<Category[]>=>{
  const userId = "testUser_123";

  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "categories"));
    const categories: Category[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
    
    console.log("✅ Categories fetched:", categories);
    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
}

export const addTransactionToFirestore = async (transaction: Transaction) => {
  const userId = "testUser_123";

  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "transactions"),
      transaction
    );
    console.log("✅ Transaction added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding transaction:", error);
    throw error;
  }
};

export const deleteTransactionFirestore = async (transactionId: string) =>{
  const userId = "testUser_123";
    try {
      await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
      console.log("Transaction deleting with ID:", transactionId);
    } catch (error) {
      console.error("❌ Error deleting transaction:", error);
      throw error;
    }
}

export const fetchTransactions = async (): Promise<Transaction[]>=>{
  const userId = "testUser_123";

  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "transactions"));
    const transactions: Transaction[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
    
    console.log("✅ Transactions fetched:", transactions);
    return transactions;
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    return [];
  }
}
