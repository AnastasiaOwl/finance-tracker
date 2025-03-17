import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { deleteTransactionAsync } from "@/redux/transactionActions";
import { Transaction } from "@/redux/transactionSlice";
import collapseArrow from "../icons/collapse-arrow.png";
import expandArrow from "../icons/expand-arrow.png";

interface TransactionTableProps {
    title: string;
    groupedTransactions: { [key: string]: { total: number; items: Transaction[] } };
    expandedCategories: { [key: string]: boolean };
    toggleCategoryExpand: (category: string) => void;
    totalSum: number;
    color: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
    title,
    groupedTransactions,
    expandedCategories,
    toggleCategoryExpand,
    totalSum,
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
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedTransactions).map(([category, data]) => (
                        <React.Fragment key={category}>
                            <tr>
                                <td className="p-2 border">{title === "Дохід" ? `+${data.total}` : `-${data.total}`}</td>
                                <td className="p-2 border">
                                    <div>{category}</div>
                                    <div className="place-self-end">
                                        <button
                                            className="rounded place-self-end"
                                            onClick={() => toggleCategoryExpand(category)}
                                        >
                                          {expandedCategories[category] ? (
                                            <Image src={collapseArrow} alt="collapse arrow" width={20} height={20} />
                                            ) : (
                                            <Image src={expandArrow} alt="expand arrow" width={20} height={20} />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {expandedCategories[category] &&
                                data.items.map(transaction => (
                                    <tr key={transaction.id} className="bg-gray-100">
                                        <td className="p-2 border">{title === "Дохід" ? `+${transaction.amount}` : `-${transaction.amount}`}</td>
                                        <td className="p-2 border">
                                            <div className="flex justify-between">
                                                {transaction.note}
                                                <button
                                                    className="rounded place-self-end"
                                                    onClick={() => dispatch(deleteTransactionAsync(transaction.id!))}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    ))}
                    <tr>
                        <td
                            className={`p-2 border text-lg font-bold 
                                ${title === "Дохід" ? "bg-green-500" : "bg-red-500"}
                            `}
                        >
                            {title === "Дохід" ? `+${totalSum}` : `-${totalSum}`}
                        </td>
                        <td className="p-2 border text-lg font-bold">
                            Загальна сума
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
