"use client"
import { addTransaction, setTransactions, deleteTransaction, clearAllTransactions } from "./transactionSlice";
import { addTransactionToFirestore, fetchTransactions, deleteTransactionFirestore, deleteAllTransactionsFirestore  } from "@/firebase/firebaseApi";
import { Transaction } from "@/redux/transactionSlice";
import { AppDispatch } from "./store";

export const addTransactionAsync =
  (transaction: Transaction) => async (dispatch: AppDispatch) => {
    try {
      const transactionId = await addTransactionToFirestore(transaction);
      dispatch(addTransaction({ ...transaction, id: transactionId, }));
      console.log("✅ Transaction added to Redux and Firestore");
    } catch (error) {
      console.error("❌ Error adding transaction:", error);
    }
  };

export const deleteTransactionAsync = 
(transactionId: string) => async (dispatch: AppDispatch)=>{
  try {
    await deleteTransactionFirestore(transactionId);
    dispatch(deleteTransaction(transactionId));
    console.log("✅ Transaction deleted from Redux and Firestore");
  } catch (error) {
    console.error("❌ Error deleting transaction:", error);
  }
}

export const fetchTransactionAsync = 
()=> async (dispatch: AppDispatch)=>{
  try {
    const transactions = await fetchTransactions();
    dispatch(setTransactions(transactions));
    console.log("✅ Transactions loaded into Redux");
  } catch (error) {
    console.error("❌ Error loading transactions:", error);
  }
}

export const deleteAllTransactionsAsync = () => async (dispatch: AppDispatch) => {
  try {
    await deleteAllTransactionsFirestore();
    dispatch(clearAllTransactions());
    console.log("✅ Transactions cleared from Redux and Firestore");
  } catch (error) {
    console.error("❌ Error clearing transactions:", error);
  }
};