"use client"
import React from 'react';
import { Category } from "@/redux/categorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteCategoryAsync } from "@/redux/categoryActions";

export interface SettingsModalProps {
    categories: Category[];
    onClose: () => void;
  }
export default function SettingsModal({ categories, onClose }: SettingsModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const incomeCategories = categories.filter((c) => c.type === "Дохід");
    const expenseCategories = categories.filter((c) => c.type === "Витрати");
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[90vw] max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <button
            onClick={onClose}
            className="ml-[26vw] text-black"
          >
            X
          </button>
          <h2 className="mb-4 text-xl font-semibold place-self-center">Категорії</h2>
          <div className="flex flex-row w-[89vw]">
            <div className="flex flex-col w-[13vw]">
                <h3 className="mb-2 text-lg font-medium text-green-600 place-self-center">Дохід</h3>
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
    
            <div className="flex flex-col w-[13vw]">
                <h3 className="mb-2 text-lg font-medium text-red-600 place-self-center">Витрати</h3>
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
  