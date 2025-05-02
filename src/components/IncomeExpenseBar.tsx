"use client";
import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

interface Props {
  totalIncome: number;
  totalExpenses: number;
}

export default function IncomeExpenseBar({ totalIncome, totalExpenses }: Props) {
  const data = {
    labels: ["Поточний місяць"],
    datasets: [
      {
        label: "Дохід",
        data: [totalIncome],
        backgroundColor: "rgba(12, 179, 0, 0.7)",
      },
      {
        label: "Витрати",
        data: [totalExpenses],
        backgroundColor: "rgba(228, 0, 50, 0.7)",
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        /* … */
        font: (ctx) => {
          const w = ctx.chart.width;
          const h = ctx.chart.height;
          const mobileLand =
            w < 640 &&
            w > h &&
            window.matchMedia('(max-width: 639px) and (orientation: landscape)').matches;
  
          return { size: mobileLand ? 10 : 14, weight: 'bold' };
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: (ctx) => {
            const w = ctx.chart.width;
            const h = ctx.chart.height;
            const mobileLand =
              w < 640 &&
              w > h &&
              window.matchMedia('(max-width: 639px) and (orientation: landscape)').matches;
  
            return { size: mobileLand ? 10 : 14 };
          },
        },
      },
      y: {
        ticks: {
          font: (ctx) => {
            const w = ctx.chart.width;
            const h = ctx.chart.height;
            const mobileLand =
              w < 640 &&
              w > h &&
              window.matchMedia('(max-width: 639px) and (orientation: landscape)').matches;
  
            return { size: mobileLand ? 10 : 14 };
          },
        },
      },
    },
  };  


  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
}
