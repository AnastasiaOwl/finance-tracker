"use client";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; 
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface CategoryAmount {
  category: string;
  amount: number;
}

export default function IncomePieChart({ data }: { data: CategoryAmount[] }) {
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        datalabels: {
          formatter: (value: number, context: any) => {
            const datapoints = context.chart.data.datasets[0].data;
            const total = datapoints.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = (value / total * 100).toFixed(1) + "%";
            return percentage;
          },
          color: "black",
          anchor: "center",
          align: "center",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
  };

  return (
    <div className="w-80 h-80">
      <Pie data={chartData} options={options} />
    </div>
  );
}
