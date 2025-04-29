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
        <div className="m-[2vw] w-fit rounded-xl border border-black p-4">
          <h2 className="mb-4 text-center text-xl font-medium">
            Секторна діаграма — {currentMonthName}
          </h2>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <h3 className="mb-2 font-semibold">Дохід</h3>
              <IncomePieChart data={incomeCategoryData} variant={"Дохід"} />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="mb-2 font-semibold">Витрати</h3>
              <IncomePieChart data={expenseCategoryData} variant={"Витрати"} />
            </div>
          </div>
        </div>
      );

    case "bar":
      return (
        <div className="m-[2vw] w-fit rounded-xl border border-black p-4">
          <h2 className="mb-4 text-center text-xl font-medium">
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
        <div className="m-[2vw] h-[28rem] w-[43vw] rounded-xl border border-black p-4">
          <h2 className="mb-4 text-center text-xl font-medium">
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
      className="absolute right-0 top-[12vh] flex h-[38rem] 
      w-[2rem] rotate-180 items-center justify-center rounded-r-full 
      border border-black bg-black text-lg tracking-widest text-white 
      transition-colors duration-300 hover:bg-white hover:text-black [text-orientation:mixed] 
      [writing-mode:vertical-rl]
      mobile-landscape:text-xs
      mobile-landscape:w-[1rem]
      mobile-landscape:top-[15vh]"
    >
      Аналітика
    </button>
    <div
      className={`fixed right-0 top-[12vh] bottom-0 w-[50vw] rounded-3xl border border-black bg-white shadow transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <button onClick={() => setIsOpen(false)} className="p-2 ml-[1vw]">
        X
      </button>

      <div className="flex flex-col p-4">
        {/* radio buttons */}
        <div className="mb-4 flex items-center space-x-4">
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