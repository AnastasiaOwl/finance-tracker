"use client"
import "../globals.css";
import React, { useState, useEffect, useMemo} from 'react';
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import SettingsModal from "@/components/SettingModal";
import { useRouter } from "next/navigation"; 
import { signOutUser} from "@/firebase/firebaseApi"; 
import { addTransactionAsync, fetchTransactionAsync,deleteAllTransactionsAsync} from "@/redux/transactionActions";
import { addCategoryAsync, fetchCategoryAsync} from "@/redux/categoryActions";
import { Transaction } from "@/redux/transactionSlice";
import { AppDispatch, RootState } from "@/redux/store";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import TransactionTable from "@/components/TransactionTable";
import logoutIcon from "@/icons/icons8-logout-50.png";
import listIcon from "@/icons/icons8-list-100.png";
import trashIcon from "@/icons/icons8-trash-128.png";
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
    const [clearAll, setClearAll] = useState(false);
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

    const { incomeByMonth, expenseByMonth } = useMemo(() => {
        const incomeArr = Array(12).fill(0);
        const expenseArr = Array(12).fill(0);
        transactions.forEach((t) => {
        const d = t.date instanceof Date ? t.date : new Date(t.date);
        if (d.getFullYear() === new Date().getFullYear()) {
            const m = d.getMonth();
            if (t.type === "Дохід") {
            incomeArr[m] += t.amount;
            } else {
            expenseArr[m] += t.amount;
            }
        }
        });
    
        return { incomeByMonth: incomeArr, expenseByMonth: expenseArr };
    }, [transactions]);
  
    const clearAllData = () => {
        dispatch(deleteAllTransactionsAsync());
        setClearAll(false);
      };
      

    return(
        <>
        <header className="bg-black text-white py-4 vw-6
         relative w-screen flex justify-between items-center
         h-[10vw]
         mobile-landscape:h-[8vw]
         md:h-[4.5vw] ">
            <select
                value={selectedMonthIndex}
                onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value, 10))}
                className="ml-4 mr-4 rounded-md border
                            w-[30vw]
                            h-[8vw]
                            text-xs
                            mobile-landscape:w-[19vw]
                            mobile-landscape:h-[5vw]
                            md:text-base
                            md:w-[8vw]
                            md:h-[2vw]
                            border-white bg-black px-2 py-1 text-white focus:outline-none"
                >
                {monthsUA.map((month, idx) => (
                    <option key={idx} value={idx} className="text-white text-xs  md:text-base">
                    {month}
                    </option>
                ))}
            </select>
            <div>
                <button className="w-[2vw] h-[2vw]
                                mobile-landscape:w-[5vw]
                                mobile-landscape:h-[5vw]
                                mobile-landscape: mr-[2vw]
                                mr-[1vw]
                                transition-transform 
                                duration-300 
                                hover:scale-110"  onClick={()=>setClearAll(true)}><Image src={trashIcon} alt="trash"/></button>
                <button className="w-[2vw] h-[2vw]
                                mobile-landscape:w-[5vw]
                                mobile-landscape:h-[5vw]
                                mobile-landscape: mr-[2vw]
                                mr-[1vw]
                                transition-transform 
                                duration-300 
                                hover:scale-110"
                        onClick={()=>setSettingsFormOpen(true)}><Image src={listIcon} alt="settings"/></button>
                <button className="w-[2vw] h-[2vw]
                                mobile-landscape:w-[5vw]
                                mobile-landscape:h-[5vw]
                                mobile-landscape: mr-[1vw]
                                mr-[0.5vw]
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
        {clearAll && (
            <div className="
            fixed inset-0 z-50 flex items-center justify-center bg-black/50
            ">
                <div className="w-[92vw] max-w-md rounded-2xl bg-white p-4 shadow-xl flex flex-col items-center 
                    mobile-landscape:w-[75vw]
                    mobile-landscape:h-fit
                    mobile-landscape:p-1
                    md:w-[92vw]">
                    <button className="flex place-self-end text-black mobile-landscape:mr-[1vw] mobile-landscape:text-xs" onClick={() => setClearAll(false)}>X</button>
                    <div className="w-full text-center mb-[1vw]">Ви впевнені що хочете очистити всю інформацію по транзакціям за цей рік?</div>
                    <button className="w-[10vw] h-[2vw]
                                    mobile-landscape:w-[25vw]
                                    mobile-landscape:h-[5vw]
                                    mobile-landscape: mr-[1vw]
                                    mr-[0.5vw]
                                    transition-transform 
                                    duration-300 
                                    hover:scale-110
                                    bg-red-600
                                    rounded-xl
                                    text-white" onClick={()=>clearAllData()}>Підтверджую</button>
                </div>
            </div>
        )}
        <main className="w-screen ">
            <div className="bg-gray-200 
                            w-[95vw]
                            mobile-landscape:w-[95vw]
                            mobile-landscape:h-[12vw]
                            sm:w-[95vw]
                            flex gap-2
                            md:gap-5
                            md:gap-3 
                            md:items-center 
                            items-end
                            rounded-[15px] p-1 m-3 justify-self-center shadow-md" >
                <label className="flex text-xs  md:text-base flex-col items-center
                        md:flex
                        md:flex-row 
                        md:items-center">
                        Тип
                        <select
                            value={selectedTypeKey}
                            onChange={(e) => setSelectedTypeKey(parseInt(e.target.value))}
                            className=" border rounded-md m-1
                            mobile-landscape:w-[12vw]
                            mobile-landscape:h-[5vw]
                            md:p-2
                            md:m-2
                            text-xs  md:text-base"
                        >
                        {selectOptions.map((option) => (
                        <option key={option.id} value={option.id} className="text-xs  md:text-base">
                            {option.value}
                        </option>
                        ))}
                        </select>
                </label>
                <label className="flex text-xs  md:text-base flex-col items-center
                        md:flex
                        md:flex-row 
                        md:items-center">
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
                        className=" border rounded-md m-1
                            mobile-landscape:w-[28vw]
                            mobile-landscape:h-[5vw]
                            md:w-[14vw]
                            md:p-2
                            md:m-2
                            text-xs  md:text-base"
                        >
                        <option value="" disabled className="flex text-xs  md:text-base flex-col items-center
                        md:flex
                        md:flex-row 
                        md:items-center">
                        Виберіть категорію
                        </option>
                        {selectedCategories.map((option) => (
                            <option key={option.id} value={option.id.toString()} className="text-xs  md:text-base">
                            {option.value}
                          </option>
                        ))}
                        </select>                    
                        ) : (
                        <div className="inline-flex items-end gap-2 m-1
                        md:m-2">
                            <input
                            type="text"
                            placeholder="своя категорія"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className=" border rounded-md
                            mobile-landscape:w-[21vw]
                            mobile-landscape:h-[5vw]
                            md:p-2
                            md:w-[14vw]"
                            />
                            <div className="flex flex-col items-end gap-2
                            mobile-landscape:gap-1">
                                <button
                                    onClick={() => {
                                    setShowCustomInput(false);
                                    setCustomCategory("");
                                    }}
                                    className="bg-red-600 text-white text-xs px-1 py-0.3 rounded hover:bg-red-700
                                    mobile-landscape:w-[2.2vw]
                                    mobile-landscape:h-[2.2vw]
                                    mobile-landscape:text-[0.4rem] "
                                >
                                    x
                                </button>
                                <button
                                    onClick={handleAddCategory}
                                    className="bg-black text-white text-xs px-1 py-0.3 rounded hover:bg-gray-800
                                    mobile-landscape:w-[2.2vw]
                                    mobile-landscape:h-[2.2vw]
                                    mobile-landscape:text-[0.4rem]"
                                >
                                    +
                                </button>
                                </div>
                        </div>
                        )}
                </label>
                <label className="flex text-xs  md:text-base flex-col items-center
                        md:flex
                        md:flex-row 
                        md:items-center">
                    Сума
                   <input className=" border rounded-md m-1 w-[6vw]
                    mobile-landscape:w-[10vw]
                    mobile-landscape:h-[5vw]
                    md:w-[6vw]
                    md:p-2
                    md:m-2"
                   type = "number"
                   value= {amount}
                   onChange={(e) => setAmount(e.target.value)}></input>
                </label>
                <label className="flex text-xs  md:text-base flex-col items-center
                        md:flex
                        md:flex-row 
                        md:items-center">
                    Коментар
                   <input className="p-2 border rounded-md m-1 w-[35vw]
                    mobile-landscape:w-[15vw]
                    mobile-landscape:h-[5vw]
                    md:w-[35vw]
                    md:p-2
                    md:m-2" maxLength={40}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}></input>
                </label>
                <button className="bg-black text-white border border-white  py-2 rounded-xl
                      hover:bg-white hover:text-black hover:border-black
                      m-1
                      mobile-landscape:w-[12vw]
                      mobile-landscape:h-[7vw]
                      md:text-base
                      text-xs
                      md:w-[7vw]
                      md:m-0
                      md:px-4
                      transition-colors duration-300"
                onClick={handleAddTransaction}>
                    Додати
                </button>
            </div>
            <div className="flex items-start gap-4 p-2 mr-[1.5vw]
            md:gap-6
            md:p-4">
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
                yearlyIncome={incomeByMonth}
                yearlyExpenses={expenseByMonth}
                currentMonthName={monthsUA[selectedMonthIndex]}
             />
            </div>
        </main>
        </>
    )
}
