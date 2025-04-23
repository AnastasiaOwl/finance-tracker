"use client"
import { Category } from "@/redux/categorySlice";
import React, { useState} from 'react';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteCategoryAsync } from "@/redux/categoryActions";
import { addCategoryAsync} from "@/redux/categoryActions";

export interface SettingsModalProps {
    categories: Category[];
    onClose: () => void;
  }
export default function SettingsModal({ categories, onClose }: SettingsModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const incomeCategories = categories.filter((c) => c.type === "Дохід");
    const expenseCategories = categories.filter((c) => c.type === "Витрати");
    const [customCategoryIncome,setCustomCategoryIncome] = useState<string>("");
    const [customCategoryExpenses,setCustomCategoryExpenses] = useState<string>("");

        const handleAddCategory = (type: string) =>{
          if(type==="Дохід"){
            if (!customCategoryIncome) {
              alert("Заповніть поле!");
              return;
            }
            const category = {
                name: customCategoryIncome,
                type: type,
            };
            dispatch(addCategoryAsync(category));
            setCustomCategoryIncome("");
          } else {
            if (!customCategoryExpenses) {
              alert("Заповніть поле!");
              return;
            }
            const category = {
                name: customCategoryExpenses,
                type: type,
            };
            dispatch(addCategoryAsync(category));
            setCustomCategoryExpenses("");
          }
       }
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[92vw] max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <button
            onClick={onClose}
            className="ml-[26vw] text-black"
          >
            X
          </button>
          <h2 className="mb-4 text-xl font-semibold place-self-center">Категорії</h2>
          <div className="flex flex-row w-[89vw]">
            <div className="flex flex-col w-[13vw] mr-[0.5vw]">
                <h3 className="mb-2 text-lg font-medium text-green-600 place-self-center">Дохід</h3>
                <div>
                    <input  type="text"
                            placeholder="введіть категорію"
                            value={customCategoryIncome}
                            onChange={(e) => setCustomCategoryIncome(e.target.value)}
                            className="p-2 border rounded-md"
                            style={{ width: "175px", margin:"0.3vw" }}>
                    </input>
                    <button
                            onClick={() => handleAddCategory("Дохід")}
                            className="bg-black text-white text-xs px-1 py-0.3 rounded hover:bg-gray-800"
                            >
                            +
                    </button>
                  </div>
                <ul className="mb-4 space-y-1">
                    {incomeCategories.map((cat) => (
                    <li
                        key={cat.id}
                        className="rounded-lg border border-gray-200 px-3 py-1 flex justify-between"
                    >
                        {cat.name}
                        <button className="rounded place-self-end"
                                onClick={() => dispatch(deleteCategoryAsync(cat.id.toString()))}>🗑️
                        </button>
                    </li>
                    ))}
                    {incomeCategories.length === 0 && (
                    <li className="text-sm text-gray-500">Немає категорій</li>
                    )}
                </ul>
            </div>
    
            <div className="flex flex-col w-[13vw] ml-[0.5vw]">
                <h3 className="mb-2 text-lg font-medium text-red-600 place-self-center">Витрати</h3>
                <div>
                    <input  type="text"
                            placeholder="введіть категорію"
                            value={customCategoryExpenses}
                            onChange={(e) => setCustomCategoryExpenses(e.target.value)}
                            className="p-2 border rounded-md"
                            style={{ width: "175px", margin:"0.3vw" }}>
                    </input>
                    <button
                            onClick={() => handleAddCategory("Витрати")}
                            className="bg-black text-white text-xs px-1 py-0.3 rounded hover:bg-gray-800"
                            >
                            +
                    </button>
                  </div>
                <ul className="space-y-1">
                    {expenseCategories.map((cat) => (
                    <li
                        key={cat.id}
                        className="rounded-lg border border-gray-200 px-3 py-1 flex justify-between"
                    >
                        {cat.name}
                        <button className="rounded place-self-end"
                                onClick={() => dispatch(deleteCategoryAsync(cat.id.toString()))}>🗑️
                        </button>
                    </li>
                    ))}
                    {expenseCategories.length === 0 && (
                    <li className="text-sm text-gray-500">Немає категорій</li>
                    )}
                </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  