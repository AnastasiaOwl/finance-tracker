"use client"
import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./transactionSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;