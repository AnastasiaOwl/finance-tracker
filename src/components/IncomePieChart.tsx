"use client";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from "chart.js";
  import type { ChartOptions } from "chart.js";
  import ChartDataLabels, { Context as DatalabelsContext } from "chartjs-plugin-datalabels";
  import { Pie } from "react-chartjs-2";
  
  ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
  

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface CategoryAmount {
  category: string;
  amount: number;
}

interface IncomePieChartProps {
  data: CategoryAmount[];
  variant?: "Дохід" | "Витрати";
}

export default function IncomePieChart({
  data,
  variant = "Дохід",
}: IncomePieChartProps) {
  const baseHue = variant === "Дохід" ? 120 : 0;

  const backgroundColor = data.map((_, idx) => {
    const hue = (baseHue + (idx * 360) / data.length) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  });

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor,
      },
    ],
  };


  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value: number, context: DatalabelsContext) => {
          const data = context.chart.data.datasets[0].data as number[];
          const total = data.reduce((sum, v) => sum + v, 0);
          return ((value / total) * 100).toFixed(1) + "%";
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
