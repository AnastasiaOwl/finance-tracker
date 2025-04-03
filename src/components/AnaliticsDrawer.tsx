import React from "react";
import IncomePieChart from "./IncomePieChart";
import useIncomeExpenseSummary from "@/hooks/useIncomeExpenseSummary";
import IncomeExpenseBar from "./IncomeExpenseBar";

interface AnalyticsDrawerProps {
  totalIncome: number;
  totalExpenses: number;
}

export default function AnalyticsDrawer({ totalIncome, totalExpenses }: AnalyticsDrawerProps ) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { incomeData, expenseData } = useIncomeExpenseSummary();
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
            w-[60vw]
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
          {/* Radio buttons to toggle between graph types */}
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
              Секторна діаграма
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
              Бар граф
            </label>
          </div>

          {selectedGraph === "pie" ? (
            <div className="flex flex-col border border-black w-fit rounded-xl ml-[2vw]">
              <h2 className="self-center text-xl m-[1vw]">Секторна діаграма за місяць</h2>
              <div className="flex flex-row">
                <div className="flex flex-col items-center">
                  <h2>Дохід</h2>
                  <IncomePieChart data={incomeData} />
                </div>
                <div className="flex flex-col items-center">
                  <h2>Витрати</h2>
                  <IncomePieChart data={expenseData} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col border border-black w-fit rounded-xl ml-[2vw]">
              <h2 className="self-center text-xl m-[1vw]">Порівняння доходів та витрат за поточний місяць</h2>
              <IncomeExpenseBar totalIncome={totalIncome} totalExpenses={totalExpenses} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}