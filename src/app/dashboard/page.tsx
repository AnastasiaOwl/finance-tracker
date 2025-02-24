"use client"
import "../globals.css";
import React, { useState} from 'react';

export default function Dashboard() {
    const [selectedTypeKey, setSelectedTypeKey] = useState(1);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState(1);

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
                   <input className="p-2 border rounded-md m-2 w-[6vw]"></input>
                </label>
                <label className="text-base">
                    Коментар
                   <input className="p-2 border rounded-md m-2 w-[35vw]" maxLength={40}></input>
                </label>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
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
                            <tr>
                                <td className="p-2 border">$2000</td>
                                <td className="p-2 border">Зарплата</td>
                            </tr>
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
                        <tr>
                            <td className="p-2 border">$500</td>
                            <td className="p-2 border">Техніка</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </main>
        </>
    )
}
