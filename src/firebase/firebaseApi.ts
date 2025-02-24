import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Transaction } from "@/redux/transactionSlice";

export const addTransactionToFirestore = async (transaction: Transaction) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", transaction.userId, "transactions"),
      transaction
    );
    console.log("✅ Transaction added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding transaction:", error);
    throw error;
  }
};
