"use client"
import "../globals.css";
import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addTransactionAsync, fetchTransactionAsync, deleteTransactionAsync } from "@/redux/transactionActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector((state: RootState) => state.transactions.transactions);
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
    const [selectedTypeKey, setSelectedTypeKey] = useState(1);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState(1);
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
        {id: 2, value: "Додати свою..."}
    ]

    const selectCategoriesSpending=[
        {id: 1, value: "Техніка"},
        {id: 2, value: "Додати свою..."}
    ]

    const selectedCategories =
    selectedTypeKey === 1 ? selectCategoriesIncome : selectCategoriesSpending;

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

    const handleDeleteTransaction = (transactionId: string) => {
        dispatch(deleteTransactionAsync(transactionId));
    }

    const toggleCategoryExpand = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const groupedTransactions = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
            acc[transaction.category] = { total: 0, items: [] };
        }
        acc[transaction.category].total += transaction.amount;
        acc[transaction.category].items.push(transaction);
        return acc;
    }, {} as { [key: string]: { total: number; items: any[] } });

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
                <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2 place-self-center">Доходи</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-green-500 text-white">
                                <th className="p-2 border">Сума</th>
                                <th className="p-2 border">Категорія</th>
                            </tr>
                        </thead>
                        <tbody>
                        {transactions
                            .filter((t) => t.type === "Дохід")
                            .map((transaction) => (
                                <tr key={transaction.id}>
                                <td className="p-2 border">{transaction.amount}</td>
                                <td className="p-2 border">{transaction.category}</td> 
                                <td className="p-2 border text-center">
                                    <button
                                                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600"
                                                onClick={() => toggleCategoryExpand(transaction.category)}
                                            >
                                                {expandedCategories[transaction.category] ? "🔼" : "🔽"}
                                    </button>
                                </td>
                                {expandedCategories[transaction.category] &&
                                        groupedTransactions[transaction.category].items.map(transaction => (
                                            <tr key={transaction.id} className="bg-gray-100">
                                                <td className="p-2 border">{transaction.amount}</td>
                                                <td className="p-2 border">{transaction.note}</td>
                                                <td className="p-2 border text-center">
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                                    onClick={() => handleDeleteTransaction(transaction.id!)}
                                                >
                                                    -
                                                </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2 place-self-center">Витрати</h2>
                    <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-red-500 text-white">
                            <th className="p-2 border">Сума</th>
                            <th className="p-2 border">Категорія</th>
                        </tr>
                    </thead>
                    <tbody>
                    {transactions
                            .filter((t) => t.type === "Витрати")
                            .map((transaction) => (
                                <tr key={transaction.id}>
                                <td className="p-2 border">{transaction.amount}</td>
                                <td className="p-2 border">{transaction.category}</td>
                                <td className="p-2 border text-center">
                                    <button
                                                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600"
                                                onClick={() => toggleCategoryExpand(transaction.category)}
                                            >
                                                {expandedCategories[transaction.category] ? "🔼" : "🔽"}
                                    </button>
                                </td>
                                {expandedCategories[transaction.category] &&
                                        groupedTransactions[transaction.category].items.map(transaction => (
                                            <tr key={transaction.id} className="bg-gray-100">
                                                <td className="p-2 border">{transaction.amount}</td>
                                                <td className="p-2 border">{transaction.note}</td>
                                                <td className="p-2 border text-center">
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                                    onClick={() => handleDeleteTransaction(transaction.id!)}
                                                >
                                                    -
                                                </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tr>
                            ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </main>
        </>
    )
}
