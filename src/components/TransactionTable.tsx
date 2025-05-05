import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
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
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="w-1/2 bg-white shadow-md rounded-lg p-2
          md:p-4">
            <h2 className={` font-bold mb-2 text-center text-black
                md:text-sm
                lg:text-lg`}>{title}</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className={`${color} text-white border-gray-200`}>
                        <th className="p-2 border border-gray-500 md:text-sm lg:text-lg">Сума</th>
                        <th className="p-2 border border-gray-500 md:text-sm lg:text-lg">Категорія</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedTransactions).map(([category, data]) => (
                        <React.Fragment key={category}>
                            <tr>
                                <td className="p-1 border border-gray-500 md:text-sm text-black
                                md:p-2
                                lg:text-base">{title === "Дохід" ? `+${data.total}` : `-${data.total}`}</td>
                                <td className="p-1 border border-gray-500 md:text-sm text-black
                                md:p-2
                                lg:text-base">
                                    <div>{category}</div>
                                    <div className="place-self-end">
                                        <button
                                            className="rounded place-self-end"
                                            onClick={() => toggleCategoryExpand(category)}
                                        >
                                          {expandedCategories[category] ? (
                                            <Image src={collapseArrow} alt="collapse arrow" className="
                                            md:p-2
                                            md:w-[2.2vw]
                                            md:h-[2.2vw]" />
                                            ) : (
                                            <Image src={expandArrow} alt="expand arrow" className="
                                            md:p-2
                                            md:w-[2.2vw]
                                            md:h-[2.2vw]"/>
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {expandedCategories[category] &&
                                data.items.map(transaction => (
                                    <tr key={transaction.id} className="bg-gray-100">
                                        <td className="p-2 border border-gray-300  text-black md:text-xs lg:text-base">{title === "Дохід" ? `+${transaction.amount}` : `-${transaction.amount}`}</td>
                                        <td className="p-2 border border-gray-300  text-black md:text-xs lg:text-base">
                                            <div className="flex justify-between">
                                                <div className="flex flex-col">
                                                    {transaction.note}
                                                    <span className="text-grey-700 lg:text-xs md:text-[0.6rem] italic"> 
                                                     {transaction.date ? transaction.date.toLocaleDateString() : "No date"}
                                                    </span> 
                                                </div>
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
                            className={`p-2 border border-gray-500 lg:text-lg font-bold  md:text-sm text-black
                                ${title === "Дохід" ? "bg-green-500" : "bg-red-500"}
                            `}
                        >
                            {title === "Дохід" ? `+${totalSum}` : `-${totalSum}`}
                        </td>
                        <td className="p-2 border border-gray-500 lg:text-lg font-bold md:text-sm text-black">
                            Загальна сума
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
