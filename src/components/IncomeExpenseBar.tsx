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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        color: "black",
        anchor: "end" as const,
        align: "end" as const,
        offset: -4,
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },      
      legend: {
        labels: {
          color: "black",
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "black",
          font: {
            size: 14,
          },
        },
      },
      y: {
        ticks: {
          color: "black",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "500px", height: "350px", margin: "1vw", placeSelf: "self-center"}}>
      <Bar data={data} options={options} />
    </div>
  );
}
