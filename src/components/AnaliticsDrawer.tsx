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
        <div className="m-[calc(var(--vw)*2)] w-[calc(var(--vw)*45)] h-fit rounded-xl border border-black p-3
         mobile-landscape:p-2
         mobile-landscape:w-[calc(var(--vw)*75)]
         mobile-landscape:h-[calc(var(--vw)*40)]
         mobile-landscape:m-[calc(var(--vw)*1)]">
          <h2 className="mb-4 text-center text-xl font-medium
           mobile-landscape:text-xs
           mobile-landscape:mb-1">
            Секторна діаграма — {currentMonthName}
          </h2>
          <div className="flex gap-6 justify-evenly">
            <div className="flex flex-col items-center w-[calc(var(--vw)*24)] h-[calc(var(--vw)*24)]
            mobile-landscape:w-[calc(var(--vw)*29)]
            mobile-landscape:h-[calc(var(--vw)*29)]
            mobile-landscape:mb-1">
              <h3 className="mb-2 font-semibold mobile-landscape:mb-1">Дохід</h3>
              <IncomePieChart data={incomeCategoryData} variant={"Дохід"} />
            </div>
            <div className="flex flex-col items-center w-[calc(var(--vw)*24)] h-[calc(var(--vw)*24)]
            mobile-landscape:w-[calc(var(--vw)*29)]
            mobile-landscape:h-[calc(var(--vw)*29)]">
              <h3 className="mb-2 font-semibold mobile-landscape:mb-1">Витрати</h3>
              <IncomePieChart data={expenseCategoryData} variant={"Витрати"} />
            </div>
          </div>
        </div>
      );

    case "bar":
      return (
        <div className="m-[calc(var(--vw)*2)] w-[calc(var(--vw)*45)] h-[calc(var(--vw)*28)] rounded-xl border border-black p-4
         mobile-landscape:w-[calc(var(--vw)*75)]
         mobile-landscape:h-[calc(var(--vw)*40)]
         mobile-landscape:m-[calc(var(--vw)*1)]">
          <h2 className="mb-4 text-center text-xl font-medium
          mobile-landscape:text-xs
           mobile-landscape:mb-1">
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
        <div className="m-[calc(var(--vw)*2)] w-[calc(var(--vw)*43)] h-[calc(var(--vw)*28)]  rounded-xl border border-black p-4
         mobile-landscape:w-[calc(var(--vw)*75)]
         mobile-landscape:h-[calc(var(--vw)*40)]
         mobile-landscape:p-2
         mobile-landscape:m-[calc(var(--vw)*1)]">
          <h2 className="mb-4 text-center text-xl font-medium
          mobile-landscape:text-xs
           mobile-landscape:mb-1">
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
      border border-black bg-black text-lg tracking-widest text-white 
      transition-colors duration-300 hover:bg-white hover:text-black [text-orientation:mixed] 
      [writing-mode:vertical-rl]
      mobile-landscape:text-xs
      mobile-landscape:w-[1rem]
      mobile-landscape:top-[15vh]
      mobile-landscape:h-[calc(100vh-15vh)]"
    >
      Аналітика
    </button>
    <div
      className={`fixed right-0 top-[12vh] w-[calc(var(--vw)*50)] h-fit rounded-3xl md:pb-[calc(var(--vw)*1)] border border-black bg-white shadow transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}
        mobile-landscape:w-fit
        mobile-landscape:top-[15vh]
        mobile-landscape:text-xs
        mobile-landscape:pb-[calc(var(--vw)*1)]
        md:bottom-0`}
    >
      <button onClick={() => setIsOpen(false)} className="p-2 ml-[calc(var(--vw)*1)]
       mobile-landscape:p-1">
        X
      </button>

      <div className="flex flex-col p-4
       mobile-landscape:p-1">
        <div className="mb-4 flex items-center justify-evenly space-x-4
        mobile-landscape:mb-1">
          <label className="flex items-center">
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
          <label className="flex items-center">
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
          <label className="flex items-center">
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