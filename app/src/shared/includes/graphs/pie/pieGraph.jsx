import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { darkTheme } from "../../../../styles/theme";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieGraph = ({ normal, extra1, extra2 }) => {
  const data = {
    labels: ["HH Normal", "HH Extra I", "HH Extra II"],
    datasets: [
      {
        label: "Series A",
        data: [normal, extra1, extra2],
        backgroundColor: [
          darkTheme.colors.secondary_3,
          darkTheme.colors.secondary_2,
          darkTheme.colors.secondary_1,
        ],
        borderWidth: 0,
        cutout: "60%",
        circumference: 360,
        rotation: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 40,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return label;
        },
        anchor: "end",
        align: "end",
        offset: 10,
        borderColor: "#fff",
        borderWidth: 2,
        borderRadius: 4,
        borderDash: [5, 5],
        clamp: true,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default PieGraph;
