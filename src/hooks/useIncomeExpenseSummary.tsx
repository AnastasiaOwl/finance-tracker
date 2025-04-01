import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


export default function useIncomeExpenseSummary() {
    const transactions = useSelector((state: RootState) => state.transactions.transactions);
  
    const incomeMap: Record<string, number> = {};
    const expenseMap: Record<string, number> = {};
  
    transactions.forEach((tx) => {
      if (tx.type === "Дохід") {
        incomeMap[tx.category] = (incomeMap[tx.category] || 0) + tx.amount;
      } else {
        expenseMap[tx.category] = (expenseMap[tx.category] || 0) + tx.amount;
      }
    });

    const incomeData = Object.entries(incomeMap).map(([cat, amt]) => ({ category: cat, amount: amt }));
    const expenseData = Object.entries(expenseMap).map(([cat, amt]) => ({ category: cat, amount: amt }));
  
    return { incomeData, expenseData };
  }
  