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

const BarGraph = ({ importedData, chartRef }) => {
  const data = {
    labels: importedData?.labels,
    datasets: [
      {
        label: "HH Utilizado",
        data: importedData?.data,
        backgroundColor: ["#2257A8"],
        borderWidth: 1,
      },
      {
        label: "HH Orçado",
        data: importedData?.data2,
        backgroundColor: ["#95C11F"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
      },
      x: {
        ticks: {
          color: '#172242',
        },
        grid: {
          display: false,
        },
      }
    },
    plugins: {
      legend: {
        labels: {
          padding: 5,
          color: '#172242',
        },
      },
      datalabels: {
        display: true,
        color: '#172242', 
        align: 'end',
        anchor: 'end',
        formatter: (value) => `${value} h`,
      },
    },
  };

  return <Bar data={data} options={options} ref={chartRef} />;
};

export default BarGraph;
