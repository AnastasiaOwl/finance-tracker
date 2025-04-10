"use client"
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, setDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Transaction } from "@/redux/transactionSlice";
import {Category} from "@/redux/categorySlice";
import { auth } from "@/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  console.log("Signed in with Google:", user.uid);

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
  });
  
  const defaultCategories: Category[] = [
    { id: 1, name: "Зарплатня", type: "Дохід" },
    { id: 2, name: "Медицина", type: "Витрати" },
  ];
  defaultCategories.forEach(async (cat) => {
    const docRef = doc(collection(db, "users", user.uid, "categories"), cat.id!.toString());
    await setDoc(docRef, cat);
  });

  return user;
}


export async function signUpWithEmail(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
      });
      const defaultCategories: Category[] = [
        { id: 1, name: "Зарплатня", type: "Дохід" },
        { id: 2, name: "Медицина", type: "Витрати" },
      ];
      defaultCategories.forEach(async (cat) => {
        const docRef = doc(collection(db, "users", user.uid, "categories"), cat.id.toString());
        await setDoc(docRef, cat);
      });
    console.log("User signed up:", userCredential.user.uid);
    return userCredential.user;
  }
  
  export async function signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Firebase sign-in error:", firebaseError.code, firebaseError.message);
      throw firebaseError;
    }
  }

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log("✅ User signed out");
  } catch (error) {
    console.error("❌ Error signing out:", error);
  }
}

export const addCategoryToFirestore = async (category: Category) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently logged in!");
  }
  const userId = user.uid; 
  try {
    const randomId = Math.floor(Math.random() * 1_000_000) + 1;
    const docRef = doc(
      collection(db, "users", userId, "categories"),
      randomId.toString()
    );
    await setDoc(docRef, {
      id: randomId,
      name: category.name,
      type: category.type,
    });
    console.log("✅ Category added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding category:", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<Category[]>=>{
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently logged in!");
  }
  const userId = user.uid; 

  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "categories"));
    const categories: Category[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id as number,
        name: data.name,
        type: data.type,
      };
    });
    console.log("✅ Categories fetched:", categories);
    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
}

export const deleteCategoryFirestore = async (categoryId: string) =>{
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently logged in!");
  }
  const userId = user.uid; 
    try {
      await deleteDoc(doc(db, "users", userId, "categories", categoryId));
      console.log("Category deleting with ID:", categoryId);
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      throw error;
    }
}

export const addTransactionToFirestore = async (transaction: Transaction) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently logged in!");
  }
  const userId = user.uid;

  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "transactions"),
      {
        ...transaction,
        date: Timestamp.fromDate(new Date(transaction.date)), 
      }
    );
    console.log("✅ Transaction added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding transaction:", error);
    throw error;
  }
};

export const deleteTransactionFirestore = async (transactionId: string) =>{
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently logged in!");
  }
  const userId = user.uid; 
    try {
      await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
      console.log("Transaction deleting with ID:", transactionId);
    } catch (error) {
      console.error("❌ Error deleting transaction:", error);
      throw error;
    }
}

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently logged in!");
  }
  const userId = user.uid;

  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "transactions"));
    const transactions: Transaction[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const formattedDate =
        data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
      return {
        id: doc.id,
        ...data,
        date: formattedDate,
      };
    }) as Transaction[];
    console.log("📜 Raw transaction data from Firestore:", querySnapshot.docs.map(doc => doc.data()));

    console.log("✅ Transactions fetched:", transactions);
    return transactions;
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    return [];
  }
};

