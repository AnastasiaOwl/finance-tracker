import React from "react";
import { useDispatch } from "react-redux";
import { deleteTransactionAsync } from "@/redux/transactionActions";
import { Transaction } from "@/redux/transactionSlice";

interface TransactionTableProps {
    title: string;
    groupedTransactions: { [key: string]: { total: number; items: Transaction[] } };
    expandedCategories: { [key: string]: boolean };
    toggleCategoryExpand: (category: string) => void;
    color: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
    title,
    groupedTransactions,
    expandedCategories,
    toggleCategoryExpand,
    color,
}) => {
    const dispatch = useDispatch();

    return (
        <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
            <h2 className={`text-lg font-bold mb-2 text-center`}>{title}</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className={`${color} text-white`}>
                        <th className="p-2 border">Сума</th>
                        <th className="p-2 border">Категорія</th>
                        <th className="p-2 border">Дія</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedTransactions).map(([category, data]) => (
                        <React.Fragment key={category}>
                            <tr>
                                <td className="p-2 border font-bold">{title === "Дохід" ? `+${data.total}` : `-${data.total}`}</td>
                                <td className="p-2 border font-bold">{category}</td>
                                <td className="p-2 border text-center">
                                    <button
                                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600"
                                        onClick={() => toggleCategoryExpand(category)}
                                    >
                                        {expandedCategories[category] ? "🔼" : "🔽"}
                                    </button>
                                </td>
                            </tr>
                            {expandedCategories[category] &&
                                data.items.map(transaction => (
                                    <tr key={transaction.id} className="bg-gray-100">
                                        <td className="p-2 border">{title === "Дохід" ? `+${transaction.amount}` : `-${transaction.amount}`}</td>
                                        <td className="p-2 border">{transaction.note}</td>
                                        <td className="p-2 border text-center">
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                                onClick={() => dispatch(deleteTransactionAsync(transaction.id!))}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
