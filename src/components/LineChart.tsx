"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );

  interface LineChartProps {
    yearlyIncome: number[];
    yearlyExpenses: number[];
  }

  const UA_MONTHS = [
    "Січ",
    "Лют",
    "Бер",
    "Кві",
    "Тра",
    "Чер",
    "Лип",
    "Сер",
    "Вер",
    "Жов",
    "Лис",
    "Гру",
  ];


export default function LineChart({
    yearlyIncome,
    yearlyExpenses,
  }: LineChartProps) {
    const data: ChartData<"line", number[], string> = {
        labels: UA_MONTHS,
        datasets: [
          {
            label: "Дохід",
            data: yearlyIncome,
            borderColor: "#36A2EB",
            backgroundColor: "#36A2EB20",
            tension: 0.25,
          },
          {
            label: "Витрати",
            data: yearlyExpenses,
            borderColor: "#FF6384",
            backgroundColor: "#FF638420",
            tension: 0.25,
          },
        ],
      };
    
      const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (ctx: TooltipItem<"line">) => {
                const label = ctx.dataset.label ?? "";
                return `${label}: ${ctx.parsed.y.toLocaleString()} ₴`;
              },
            },
          },
        },
        scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value: number | string): string => {
                  const num =
                    typeof value === "string" ? parseFloat(value) : value;
                  return `${num.toLocaleString()} ₴`;
                },
              },
            },
        },
      }

      return (
        <div className="w-[40vw] h-[50vh]">
          <Line data={data} options={options} />
        </div>
      );
}