import React from "react";
import IncomePieChart from "./IncomePieChart";
import IncomeExpenseBar from "./IncomeExpenseBar";

export interface CategoryAmount {
  category: string;
  amount: number;
}

interface AnalyticsDrawerProps {
  totalIncome: number;
  totalExpenses: number;
  incomeCategoryData: CategoryAmount[];
  expenseCategoryData: CategoryAmount[];
}

export default function AnalyticsDrawer({ incomeCategoryData,
  expenseCategoryData,
  totalIncome,
  totalExpenses, }: AnalyticsDrawerProps ) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedGraph, setSelectedGraph] = React.useState<"pie" | "bar">("pie");
  
    function toggleDrawer() {
      setIsOpen((prev) => !prev);
    }
  
    return (
      <>
        <button
          onClick={toggleDrawer}
          className=" 
            absolute right-0 top-[12vh]
            flex items-center justify-center
            w-[2rem] h-[38rem]
            bg-black text-white
            rounded-r-full
            [writing-mode:vertical-rl] 
            [text-orientation:mixed]  
            rotate-180 
            text-center 
            border 
            border-black
            hover:bg-white hover:text-black hover:border-black
            transition-colors duration-300
            text-lg
            tracking-widest"
          >
          Аналітика
        </button>
        <div
          className={`
            fixed top-[12vh] 
            bottom-0 
            right-0 
            w-[50vw]
            bg-white 
            shadow 
            transition-transform
            rounded-3xl
            border border-black
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <button onClick={toggleDrawer} className="p-2 ml-[1vw] text-black">
            X
          </button>
          
          <div className="flex flex-col p-4">
          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="graph"
                value="pie"
                checked={selectedGraph === "pie"}
                onChange={() => setSelectedGraph("pie")}
                className="mr-2"
              />
              Секторна діаграма дохід/витрати за місяць
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="graph"
                value="bar"
                checked={selectedGraph === "bar"}
                onChange={() => setSelectedGraph("bar")}
                className="mr-2"
              />
              Гістограма дохід/витрати за місяць
            </label>
          </div>

          {selectedGraph === "pie" ? (
            <div className="flex flex-col border border-black w-fit rounded-xl ml-[2vw] m-[2vw]">
              <h2 className="self-center text-xl m-[1vw]">Секторна діаграма дохід/витрати за місяць</h2>
              <div className="flex flex-row m-[1vw]">
                <div className="flex flex-col items-center">
                  <h2>Дохід</h2>
                  <IncomePieChart data={incomeCategoryData} />
                </div>
                <div className="flex flex-col items-center">
                  <h2>Витрати</h2>
                  <IncomePieChart data={expenseCategoryData} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col border border-black w-fit rounded-xl ml-[2vw] m-[2vw] self-center">
              <h2 className="self-center text-xl m-[1vw]">Гістограма дохід/витрати за місяць</h2>
              <IncomeExpenseBar totalIncome={totalIncome} totalExpenses={totalExpenses} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}