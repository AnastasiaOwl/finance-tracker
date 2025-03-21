"use client"
import "../globals.css";
import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addTransactionAsync, fetchTransactionAsync} from "@/redux/transactionActions";
import { addCategoryAsync} from "@/redux/categoryActions";
import { Transaction } from "@/redux/transactionSlice";
import { AppDispatch, RootState } from "@/redux/store";
import TransactionTable from "@/components/TransactionTable";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector((state: RootState) => state.transactions.transactions);
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
    const [selectedTypeKey, setSelectedTypeKey] = useState(1);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState(1);
    const [customCategory,setCustomCategory] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        dispatch(fetchTransactionAsync());
    }, [dispatch]);

    const selectOptions = [
        { id: 1, value: "Дохід" }, 
        { id: 2, value: "Витрати"}, 
    ];

    const selectCategoriesIncome=[
        {id: 1, value: "Зарплатня"},
        {id: 40, value: "Додати свою..."}
    ]

    const selectCategoriesSpending=[
        {id: 1, value: "Техніка"},
        {id: 2, value: "Медицина"},
        {id: 40, value: "Додати свою..."}
    ]

    const selectedCategories =
    selectedTypeKey === 1 ? selectCategoriesIncome : selectCategoriesSpending;

    const handleAddCategory = () =>{
        if (!customCategory) {
            alert("Заповніть поле!");
            return;
        }
        const typeMap: Record<number, "Дохід" | "Витрати"> = {
            1: "Дохід",
            2: "Витрати",
          };
        const category = {
            name: customCategory,
            type: typeMap[selectedTypeKey],
        };
        dispatch(addCategoryAsync(category));
        setCustomCategory("");
    }

    const handleAddTransaction = () => {
            if (!amount || !selectedCategoryKey) {
            alert("Заповніть всі поля!");
            return;
        }
        const typeMap: Record<number, "Дохід" | "Витрати"> = {
            1: "Дохід",
            2: "Витрати",
        };
        const transaction = {
            type: typeMap[selectedTypeKey],
            amount: Number(amount),
            category: selectedCategories.find((category) => category.id === selectedCategoryKey)?.value || "",
            date: new Date(),
            note: comment,
            userId: "userId_1",
        };
        dispatch(addTransactionAsync(transaction));
        setAmount("");
        setComment("");
    };

    const toggleCategoryExpand = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const groupedIncome = transactions
    .filter((t) => t.type === "Дохід")
    .reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
            acc[transaction.category] = { total: 0, items: [] };
        }
        acc[transaction.category].total += transaction.amount;
        acc[transaction.category].items.push(transaction);
        return acc;
    }, {} as { [key: string]: { total: number; items: Transaction[] } });

    const totalIncome = Object.values(groupedIncome).reduce(
        (sum, category) => sum + category.total,
        0
    );

    const groupedExpenses = transactions
        .filter((t) => t.type === "Витрати")
        .reduce((acc, transaction) => {
            if (!acc[transaction.category]) {
                acc[transaction.category] = { total: 0, items: [] };
            }
            acc[transaction.category].total += transaction.amount;
            acc[transaction.category].items.push(transaction);
            return acc;
        }, {} as { [key: string]: { total: number; items: Transaction[] } });

    const totalExpenses = Object.values(groupedExpenses).reduce(
        (sum, category) => sum + category.total,
        0
    );

    return(
        <>
        <header className="bg-black text-white py-4 vw-6 flex justify-between items-center w-full">
            Вересень
        </header>
        <main>
            <div className="bg-gray-200 w-[88vw] flex gap-5 items-center rounded-[15px] p-3 m-3 justify-self-center shadow-md" >
                <label className="text-base">
                    Тип
                        <select
                            value={selectedTypeKey}
                            onChange={(e) => setSelectedTypeKey(parseInt(e.target.value))}
                            className="p-2 border rounded-md m-2"
                        >
                        {selectOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.value}
                        </option>
                        ))}
                        </select>
                </label>
                <label className="text-base">
                    Категорія 
                    <select
                            value={selectedCategoryKey}
                            onChange={(e) => setSelectedCategoryKey(parseInt(e.target.value))}
                            className="p-2 border rounded-md m-2"
                        >
                        {selectedCategories.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.value}
                        </option>
                        ))}
                    </select>
                    {selectedCategoryKey === 40 && (
                        <div>
                            <input type="text"
                            placeholder="введіть свою категорію"
                            value={customCategory}
                            onChange={(e)=>setCustomCategory(e.target.value)}
                            className="p-2 border rounded-md">
                            </input>
                            <button onClick={handleAddCategory}>+</button>
                        </div>
                            )}
                </label>
                <label className="text-base">
                    Сума 
                   <input className="p-2 border rounded-md m-2 w-[6vw]"
                   type = "number"
                   value= {amount}
                   onChange={(e) => setAmount(e.target.value)}></input>
                </label>
                <label className="text-base">
                    Коментар
                   <input className="p-2 border rounded-md m-2 w-[35vw]" maxLength={40}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}></input>
                </label>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                onClick={handleAddTransaction}>
                    Додати
                </button>
            </div>
            <div className="flex gap-6 p-4">
                    <TransactionTable 
                        title="Дохід" 
                        groupedTransactions={groupedIncome} 
                        expandedCategories={expandedCategories} 
                        toggleCategoryExpand={toggleCategoryExpand} 
                        totalSum = {totalIncome}
                        color="bg-green-500"
                    />
                    <TransactionTable 
                        title="Витрати" 
                        groupedTransactions={groupedExpenses} 
                        expandedCategories={expandedCategories} 
                        toggleCategoryExpand={toggleCategoryExpand} 
                        totalSum = {totalExpenses}
                        color="bg-red-500"
                    />
            </div>
        </main>
        </>
    )
}
