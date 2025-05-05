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
        <div className=" max-w-md rounded-2xl bg-white p-4 shadow-xl
        md:w-[calc(var(--vw)*55)]
        lg:w-[calc(var(--vw)*92)]">
        <button
            onClick={onClose}
            className="lg:ml-[calc(var(--vw)*26)] text-black  md:text-sm"
          >
            X
          </button>
          <h2 className="mb-4 lg:text-xl font-semibold place-self-center text-black
          md:text-sm
          md:mb-2">Категорії</h2>
          <div className="flex flex-row justify-evenly
          lg:w-[calc(var(--vw)*27)]
          ">
            <div className="flex flex-col mr-[calc(var(--vw)*5)]
            lg:w-[calc(var(--vw)*13)] lg:mr-[0.5vw]">
                <h3 className="mb-2 lg:text-lg text-green-600 place-self-center 
                md:text-sm
                md:mb-1">Дохід</h3>
                <div className="flex flex-row items-center mb-[0.5vw]">
                    <input  type="text"
                            placeholder="введіть категорію"
                            value={customCategoryIncome}
                            onChange={(e) => setCustomCategoryIncome(e.target.value)}
                            className="p-2 border rounded-md 
                            md:w-[calc(var(--vw)*20)]
                            lg:w-[calc(var(--vw)*11)]">
                    </input>
                    <button
                            onClick={() => handleAddCategory("Дохід")}
                            className="bg-black text-white lg:text-sm md:text-xs px-1 py-0.3 rounded hover:bg-gray-800
                            md:ml-[0.5vw]"
                            >
                            +
                    </button>
                  </div>
                <ul className="mb-4 space-y-1">
                    {incomeCategories.map((cat) => (
                    <li
                        key={cat.id}
                        className="rounded-lg border border-gray-200 px-3 py-1 text-black md:text-sm lg:text-base flex justify-between"
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
            md:text-sm
            mobile-landscape:w-[calc(var(--vw)*33)]
            lg:w-[calc(var(--vw)*13)]">
                <h3 className="mb-2 lg:text-lg font-medium text-red-600 place-self-center 
                md:text-sm
                md:mb-1">Витрати</h3>
                <div className="flex flex-row items-center mb-[0.5vw]">
                    <input  type="text"
                            placeholder="введіть категорію"
                            value={customCategoryExpenses}
                            onChange={(e) => setCustomCategoryExpenses(e.target.value)}
                            className="p-2 border rounded-md
                            md:w-[calc(var(--vw)*20)]
                            lg:w-[calc(var(--vw)*11)]">
                    </input>
                    <button
                            onClick={() => handleAddCategory("Витрати")}
                            className="bg-black text-white lg:text-sm md:text-xs  px-1 py-0.3 rounded hover:bg-gray-800
                            md:ml-[0.5vw]"
                            >
                            +
                    </button>
                  </div>
                <ul className="space-y-1">
                    {expenseCategories.map((cat) => (
                    <li
                        key={cat.id}
                        className="rounded-lg border border-gray-200 px-3 py-1 md:text-sm lg:text-base text-black flex justify-between"
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
  