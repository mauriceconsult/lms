import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  data: { name: string; total: number }[];
};

export const Chart = ({ data }: ChartProps) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Revenue by Course ($)",
        data: data.map((item) => item.total),
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"],
        borderColor: ["#388E3C", "#1976D2", "#F57C00"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Course Title",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Explicitly set to literal type
      },
      title: {
        display: true,
        text: "Revenue by Course",
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};
