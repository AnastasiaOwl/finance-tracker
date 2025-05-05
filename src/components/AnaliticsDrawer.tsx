import React from "react";
import IncomePieChart from "./IncomePieChart";
import IncomeExpenseBar from "./IncomeExpenseBar";
import LineChart from "./LineChart";

export interface CategoryAmount {
  category: string;
  amount: number;
}

interface AnalyticsDrawerProps {
  totalIncome: number;
  totalExpenses: number;
  incomeCategoryData: CategoryAmount[];
  expenseCategoryData: CategoryAmount[];
  yearlyIncome: number[];
  yearlyExpenses: number[];
  currentMonthName: string;
}

export default function AnalyticsDrawer({ incomeCategoryData,
  expenseCategoryData,
  totalIncome,
  totalExpenses,
  yearlyExpenses,
  yearlyIncome,
 currentMonthName}: AnalyticsDrawerProps ) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedGraph, setSelectedGraph] = React.useState<"pie" | "bar" | "line">(
      "pie"
    );
  
 function renderGraph() {
  switch (selectedGraph) {
    case "pie":
      return (
        <div className="m-[calc(var(--vw)*2)] 
          lg:w-[calc(var(--vw)*45)]
          h-fit rounded-xl border border-black lg:p-3">
          <h2 className="lg:mb-4 text-center lg:text-xl text-black
           md:text-sm
           md:mb-1">
            Секторна діаграма — {currentMonthName}
          </h2>
          <div className="flex gap-6 justify-evenly">
            <div className="flex flex-col items-center w-[calc(var(--vw)*24)] h-[calc(var(--vw)*24)]
            md:mb-1">
              <h3 className="mb-2 font-semibold md:mb-1 md:text-sm text-black lg:text-base">Дохід</h3>
              <IncomePieChart data={incomeCategoryData} variant={"Дохід"} />
            </div>
            <div className="flex flex-col items-center w-[calc(var(--vw)*24)] h-[calc(var(--vw)*24)]
             ">
              <h3 className="mb-2 font-semibold md:mb-1 md:text-sm text-black lg:text-base">Витрати</h3>
              <IncomePieChart data={expenseCategoryData} variant={"Витрати"} />
            </div>
          </div>
        </div>
      );

    case "bar":
      return (
        <div className="m-[calc(var(--vw)*2)] lg:w-[calc(var(--vw)*45)] h-[calc(var(--vw)*28)] 
        flex flex-col self-center rounded-xl border border-black p-4">
          <h2 className="lg:mb-4 text-center lg:text-xl text-black
           md:text-xs
           md:mb-1">
            Гістограма — {currentMonthName}
          </h2>
          <IncomeExpenseBar
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />
        </div>
      );

    case "line":
      return (
        <div className="m-[calc(var(--vw)*2)] lg:w-[calc(var(--vw)*43)] h-[calc(var(--vw)*28)]  rounded-xl border border-black p-4
          self-center flex flex-col
          md:w-[calc(var(--vw)*60)]">
          <h2 className="mb-4 text-center lg:text-xl text-black
           md:text-sm
           md:mb-1">
            Дохід / витрати — {new Date().getFullYear()}
          </h2>
          <LineChart
            yearlyIncome={yearlyIncome}
            yearlyExpenses={yearlyExpenses}
          />
        </div>
      );

    default:
      return null;
  }
}

return (
  <>
    <button
      onClick={() => setIsOpen((p) => !p)}
      className="fixed right-0 top-[12vh] flex h-[calc(100vh-12vh)]
      w-[2rem] rotate-180 items-center justify-center rounded-r-full 
      border border-black bg-black tracking-widest text-white 
      transition-colors duration-300 hover:bg-white hover:text-black [text-orientation:mixed] 
      [writing-mode:vertical-rl]
      md:text-sm
      lg:text-lg"
    >
      Аналітика
    </button>
    <div
      className={`fixed right-0 top-[12vh]
        lg:w-[calc(var(--vw)*50)] 
        md:w-[calc(var(--vw)*75)]
        lg:pb-[calc(var(--vw)*1)]
        lg:bottom-0
        lg:h-[calc(100vh-12vh)] rounded-3xl border border-black
        bg-white shadow transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
      <button onClick={() => setIsOpen(false)} className="p-2 ml-[calc(var(--vw)*1)] text-black
       md:p-1">
        X
      </button>

      <div className="flex flex-col p-4
       md:p-1">
        <div className="mb-4 flex items-center justify-evenly space-x-4
        md:mb-1">
          <label className="flex items-center text-black md:text-sm lg:text-base">
            <input
              type="radio"
              name="graph"
              value="pie"
              checked={selectedGraph === "pie"}
              onChange={() => setSelectedGraph("pie")}
              className="mr-2"
            />
            Секторна
          </label>
          <label className="flex items-center text-black md:text-sm lg:text-base">
            <input
              type="radio"
              name="graph"
              value="bar"
              checked={selectedGraph === "bar"}
              onChange={() => setSelectedGraph("bar")}
              className="mr-2"
            />
            Гістограма
          </label>
          <label className="flex items-center text-black md:text-sm lg:text-base">
            <input
              type="radio"
              name="graph"
              value="line"
              checked={selectedGraph === "line"}
              onChange={() => setSelectedGraph("line")}
              className="mr-2"
            />
            Лінійний графік
          </label>
        </div>
        {renderGraph()}
      </div>
    </div>
  </>
);
}