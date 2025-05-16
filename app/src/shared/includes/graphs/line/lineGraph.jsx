import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ importedData, chartRef }) => {
  const datasets = [
    {
      label: "% Utilizado/Total",
      data: importedData?.data3,
      backgroundColor: ["#2257A8"],
      borderWidth: 1,
    },
  ];
  if (importedData?.data2) {
    datasets.push({
      label: "% Orçado/Total",
      data: importedData?.data4,
      backgroundColor: ["#95C11F"],
      borderWidth: 1,
    });
  }
  const data = {
    labels: importedData?.labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        grace: "40%",
      },
      x: {
        ticks: {
          color: "#172242",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          padding: 5,
          color: "#172242",
        },
      },
      datalabels: {
        display: true,
        color: "#172242",
        align: "end",
        anchor: "end",
        formatter: (value) => `${value}%`,
      },
    },
  };

  return <Bar data={data} options={options} ref={chartRef} />;
};

export default LineGraph;
