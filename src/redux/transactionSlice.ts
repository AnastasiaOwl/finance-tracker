"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Transaction {
  id?: string;
  type: "Дохід" | "Витрати";
  amount: number;
  category: string;
  date: Date;
  note?: string;
  userId: string;
}

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    deleteTransaction: (state, action: PayloadAction<string>)=>{
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
    clearAllTransactions: (state) => {
      state.transactions = [];
    },
  },
});

export const { addTransaction, setTransactions, deleteTransaction, clearAllTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
