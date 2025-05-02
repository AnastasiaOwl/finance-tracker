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


  const handleAddCategory = (type: "Дохід" | "Витрати") => {
    if (type === "Дохід") {
      const category: Omit<Category, "id"> = {
        name: customCategoryIncome,
        type: "Дохід",   
      };
      dispatch(addCategoryAsync(category));
    } else {
      const category: Omit<Category, "id"> = {
        name: customCategoryExpenses,
        type: "Витрати",    
      };
      dispatch(addCategoryAsync(category));
    }
  };

  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[calc(var(--vw)*92)] max-w-md rounded-2xl bg-white p-4 shadow-xl
        mobile-landscape:w-[calc(var(--vw)*75)]
        mobile-landscape:h-fit
        mobile-landscape:p-1
        md:w-[calc(var(--vw)*92)]">
        <button
            onClick={onClose}
            className="ml-[calc(var(--vw)*26)] text-black mobile-landscape:ml-[0.5vw] mobile-landscape:text-xs"
          >
            X
          </button>
          <h2 className="mb-4 text-xl font-semibold place-self-center 
          mobile-landscape:text-xs
          mobile-landscape:mb-2">Категорії</h2>
          <div className="flex flex-row justify-evenly
          mobile-landscape:w-[calc(var(--vw)*65)]
          md:w-[calc(var(--vw)*27)]
          ">
            <div className="flex flex-col mr-[calc(var(--vw)*5)]
            mobile-landscape:text-xs
            mobile-landscape:w-[calc(var(--vw)*33)]
            md:w-[calc(var(--vw)*13)] md:mr-[0.5vw]">
                <h3 className="mb-2 text-lg font-medium text-green-600 place-self-center 
                mobile-landscape:text-xs
                mobile-landscape:mb-1">Дохід</h3>
                <div className="flex flex-row items-center">
                    <input  type="text"
                            placeholder="введіть категорію"
                            value={customCategoryIncome}
                            onChange={(e) => setCustomCategoryIncome(e.target.value)}
                            className="p-2 border rounded-md 
                            mobile-landscape:w-[calc(var(--vw)*28)]
                            mobile-landscape:mb-1
                            md:w-[calc(var(--vw)*11)]
                            md:mr-[0.5vw]">
                    </input>
                    <button
                            onClick={() => handleAddCategory("Дохід")}
                            className="bg-black text-white text-xs px-1 py-0.3 rounded hover:bg-gray-800
                            mobile-landscape:w-[calc(var(--vw)*4)]
                            mobile-landscape:h-[calc(var(--vw)*4)]
                            mobile-landscape:ml-[calc(var(--vw)*1)]
                            md:w-[1.5vw]
                            md:h-[1.5vw]"
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
    
            <div className="flex flex-col 
            mobile-landscape:text-xs
            mobile-landscape:w-[calc(var(--vw)*33)]
            md:w-[calc(var(--vw)*13)]">
                <h3 className="mb-2 text-lg font-medium text-red-600 place-self-center 
                mobile-landscape:text-xs
                mobile-landscape:mb-1">Витрати</h3>
                <div className="flex flex-row items-center">
                    <input  type="text"
                            placeholder="введіть категорію"
                            value={customCategoryExpenses}
                            onChange={(e) => setCustomCategoryExpenses(e.target.value)}
                            className="p-2 border rounded-md
                            mobile-landscape:w-[calc(var(--vw)*28)]
                            mobile-landscape:mb-1
                            md:w-[calc(var(--vw)*11)]
                            md:mr-[0.5vw]">
                    </input>
                    <button
                            onClick={() => handleAddCategory("Витрати")}
                            className="bg-black text-white text-xs px-1 py-0.3 rounded hover:bg-gray-800
                             mobile-landscape:w-[calc(var(--vw)*4)]
                            mobile-landscape:h-[calc(var(--vw)*4)]
                            mobile-landscape:ml-[calc(var(--vw)*1)]
                             md:w-[1.5vw]
                            md:h-[1.5vw]"
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
  