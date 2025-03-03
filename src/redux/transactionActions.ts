"use client"
import { addTransaction } from "./transactionSlice";
import { addTransactionToFirestore } from "@/firebase/firebaseApi";
import { Transaction } from "@/redux/transactionSlice";
import { AppDispatch } from "./store";

export const addTransactionAsync =
  (transaction: Transaction) => async (dispatch: AppDispatch) => {
    try {
      const transactionId = await addTransactionToFirestore(transaction);
      dispatch(addTransaction({ ...transaction, id: transactionId }));
      console.log("✅ Transaction added to Redux and Firestore");
    } catch (error) {
      console.error("❌ Error adding transaction:", error);
    }
  };
