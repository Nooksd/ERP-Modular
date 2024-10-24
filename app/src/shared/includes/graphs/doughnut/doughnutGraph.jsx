import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { darkTheme } from "../../../../styles/theme";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const DoughnutGraph = ({ importedData }) => {
  const data = {
    labels: importedData?.labels,
    datasets: [
      {
        label: "Series A",
        data: [80, 20],
        backgroundColor: [darkTheme.colors.secondary_2, darkTheme.colors.grey],
        borderWidth: 0,
        cutout: "80%",
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
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: false,
      },
    },
    hover: {
      mode: null,
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutGraph;
