import React from "react";
import IncomePieChart from "./IncomePieChart";
import useIncomeExpenseSummary from "@/hooks/useIncomeExpenseSummary";

export default function AnalyticsDrawer() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { incomeData, expenseData } = useIncomeExpenseSummary();
  
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
            w-[70vw]
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
          <div className="display flex flex-col border border-black w-fit rounded-xl ml-[2vw]">
            <h2 className="place-self-center text-xl m-[1vw]">Секторна діаграма за місяць</h2>
            <div className="display flex flex-row">
              <div className="display flex flex-col items-center">
                  <h2>Доходи</h2>
                  <IncomePieChart data={incomeData}/>
              </div>
              <div className="display flex flex-col items-center">
                  <h2>Витрати</h2>
                  <IncomePieChart data={expenseData} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  