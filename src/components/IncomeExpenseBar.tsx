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
import type { Context as DatalabelsContext } from "chartjs-plugin-datalabels";
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

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      anchor: "end" as const,
      align: "end" as const,
      offset: -4,
      font: (ctx: DatalabelsContext) => {
        const isLandscape = ctx.chart.width > ctx.chart.height;
        return { size: isLandscape ? 10 : 14, weight: "bold" };
      },
    },

    legend: {
      labels: {
        color: "black",
        font: (ctx) => {
          const chart = ctx.chart;
          const isLandscape = chart.width > chart.height;
          return { size: isLandscape ? 12 : 19 };
        },
      },
    },

    tooltip: {
      bodyFont: (ctx) => {
        const chart = ctx.chart;
        return { size: chart.width > chart.height ? 12 : 19 };
      },
      titleFont: (ctx) => {
        const chart = ctx.chart;
        return { size: chart.width > chart.height ? 14 : 16 };
      },
    },
  },

  scales: {
    x: {
      ticks: {
        color: "black",
        font: (ctx) => {
          const chart = ctx.chart;
          return { size: chart.width > chart.height ? 10 : 16 };
        },
      },
    },
    y: {
      ticks: {
        color: "black",
        font: (ctx) => {
          const chart = ctx.chart;
          return { size: chart.width > chart.height ? 10 : 16 };
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
