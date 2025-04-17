"use client"
import "../globals.css";
import React, { useState, useEffect, useMemo} from 'react';
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import SettingsModal from "@/components/SettingModal";
import { useRouter } from "next/navigation"; 
import { signOutUser} from "@/firebase/firebaseApi"; 
import { addTransactionAsync, fetchTransactionAsync} from "@/redux/transactionActions";
import { addCategoryAsync, fetchCategoryAsync} from "@/redux/categoryActions";
import { Transaction } from "@/redux/transactionSlice";
import { AppDispatch, RootState } from "@/redux/store";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import TransactionTable from "@/components/TransactionTable";
import logoutIcon from "@/icons/icons8-logout-50.png";
import listIcon from "@/icons/icons8-list-100.png";
import AnalyticsDrawer from "@/components/AnaliticsDrawer";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector((state: RootState) => state.transactions.transactions);
    const categories = useSelector((state: RootState) => state.categories.categories);
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
    const [selectedTypeKey, setSelectedTypeKey] = useState(1);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<number | string>(""); 
    const [customCategory,setCustomCategory] = useState<string>("");
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");
    const [settingsFormOpen, setSettingsFormOpen] = useState(false);
    const { user, loading } = useFirebaseAuth();
    const router = useRouter();
    const monthsUA = useMemo(
        () => [
          "Січень",
          "Лютий",
          "Березень",
          "Квітень",
          "Травень",
          "Червень",
          "Липень",
          "Серпень",
          "Вересень",
          "Жовтень",
          "Листопад",
          "Грудень",
        ],
        []
      );
      const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(new Date().getMonth());

    useEffect(() => {
        if (!loading && user) {
          dispatch(fetchTransactionAsync());
          dispatch(fetchCategoryAsync());
        }
      }, [dispatch, loading, user]);
      

    const handleLogout = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
          await signOutUser();
          router.push("/register");
        } catch (error) {
          console.error("Logout error:", error);
        }
      };

      useEffect(() => {
        if (!loading && !user) {
          router.push("/register");
        }
      }, [user, loading, router]);

    const selectOptions = [
        { id: 1, value: "Дохід" }, 
        { id: 2, value: "Витрати"}, 
    ];

    const filteredCategories = categories
    .filter((cat) => cat.type === (selectedTypeKey === 1 ? "Дохід" : "Витрати"))
    .map((cat) => ({
      id: cat.id, 
      value: cat.name,
    }));
  
    
    const selectedCategories = [
        ...filteredCategories,
        { id: 0, value: "Додати свою..." }
    ];

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
            category:
              selectedCategories.find(
                (category) => category.id === Number(selectedCategoryKey)
              )?.value || "",
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

    const transactionsForMonth = useMemo(() => {
        return transactions.filter((t) => {
          const date = t.date instanceof Date ? t.date : new Date(t.date);
          return (
            date.getMonth() === selectedMonthIndex &&
            date.getFullYear() === new Date().getFullYear()
          );
        });
      }, [transactions, selectedMonthIndex]);

    
    const groupedIncome = useMemo(() => {
        return transactionsForMonth
        .filter((t) => t.type === "Дохід")
        .reduce((acc, t) => {
            if (!acc[t.category]) acc[t.category] = { total: 0, items: [] };
            acc[t.category].total += t.amount;
            acc[t.category].items.push(t);
            return acc;
        }, {} as { [key: string]: { total: number; items: Transaction[] } });
    }, [transactionsForMonth]);

    const groupedExpenses = useMemo(() => {
        return transactionsForMonth
        .filter((t) => t.type === "Витрати")
        .reduce((acc, t) => {
            if (!acc[t.category]) acc[t.category] = { total: 0, items: [] };
            acc[t.category].total += t.amount;
            acc[t.category].items.push(t);
            return acc;
        }, {} as { [key: string]: { total: number; items: Transaction[] } });
    }, [transactionsForMonth]);

    const totalIncome = useMemo(
        () => Object.values(groupedIncome).reduce((s, c) => s + c.total, 0),
        [groupedIncome]
    );
    const totalExpenses = useMemo(
        () => Object.values(groupedExpenses).reduce((s, c) => s + c.total, 0),
        [groupedExpenses]
    );

    const incomeCategoryData = Object.entries(groupedIncome).map(
        ([category, { total }]) => ({ category, amount: total })
      );
      const expenseCategoryData = Object.entries(groupedExpenses).map(
        ([category, { total }]) => ({ category, amount: total })
      );
      

    return(
        <>
        <header className="bg-black text-white py-4 vw-6 flex justify-between items-center w-full">
            <select
                value={selectedMonthIndex}
                onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value, 10))}
                className="mr-4 rounded-md border border-white bg-black px-2 py-1 text-white focus:outline-none"
                >
                {monthsUA.map((month, idx) => (
                    <option key={idx} value={idx} className="text-white">
                    {month}
                    </option>
                ))}
            </select>
            <div>
                <button className="w-[2vw] h-[2vw] mr-[1vw]
                                transition-transform 
                                duration-300 
                                hover:scale-110"
                        onClick={()=>setSettingsFormOpen(true)}><Image src={listIcon} alt="settings"/></button>
                <button className="w-[2vw] h-[2vw] mr-[0.5vw]
                                transition-transform 
                                duration-300 
                                hover:scale-110
                                "
                        onClick={handleLogout}><Image src={logoutIcon} alt="logout" />
                </button>
            </div>
        </header>
        {settingsFormOpen && (
            <SettingsModal
                categories={categories}
                onClose={() => setSettingsFormOpen(false)}
            />
        )}
        <main>
            <div className="bg-gray-200 w-[95vw] flex gap-5 items-center rounded-[15px] p-3 m-3 justify-self-center shadow-md" >
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
                    {!showCustomInput ? (
                        <select
                        value={selectedCategoryKey}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            console.log("Selected category =>", newValue);
                            if (newValue === "0") {
                            setShowCustomInput(true);
                            } else {
                            setSelectedCategoryKey(newValue);
                            }
                        }}
                        className="p-2 border rounded-md m-2 w-[14vw]"
                        >
                        <option value="" disabled>
                            Виберіть категорію
                        </option>
                        {selectedCategories.map((option) => (
                            <option key={option.id} value={option.id.toString()}>
                            {option.value}
                          </option>
                        ))}
                        </select>                    
                        ) : (
                        <div className="inline-flex items-end gap-2 m-2">
                            <input
                            type="text"
                            placeholder="введіть свою категорію"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="p-2 border rounded-md"
                            style={{ width: "190px" }}
                            />
                            <div className="flex flex-col items-end gap-2">
                                <button
                                    onClick={() => {
                                    setShowCustomInput(false);
                                    setCustomCategory("");
                                    }}
                                    className="bg-red-600 text-white text-xs px-1 py-0.3 rounded hover:bg-red-700"
                                >
                                    X
                                </button>
                                <button
                                    onClick={handleAddCategory}
                                    className="bg-black text-white text-xs px-1 py-0.3 rounded hover:bg-gray-800"
                                >
                                    +
                                </button>
                                </div>
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
                <button className="bg-black text-white border border-white px-4 py-2 rounded-xl w-[7vw]
                      hover:bg-white hover:text-black hover:border-black
                      transition-colors duration-300"
                onClick={handleAddTransaction}>
                    Додати
                </button>
            </div>
            <div className="flex items-start gap-6 p-4 mr-[1.5vw]">
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
            <div>
                <AnalyticsDrawer
                    totalIncome={totalIncome}
                    totalExpenses={totalExpenses}
                    incomeCategoryData={incomeCategoryData}
                    expenseCategoryData={expenseCategoryData}
                />
            </div>
        </main>
        </>
    )
}
