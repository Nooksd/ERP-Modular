import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { darkTheme } from "../../../../styles/theme";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const GaugeGraph = ({ desvio }) => {
  const getColor = () => {
    if (desvio <= 25) return "#339900";
    if (desvio <= 50) return "#FFCC00";
    return "#CC3300";
  };

  const data = {
    labels: [],
    datasets: [
      {
        label: "Desvio",
        data: [
          Math.min(desvio, 100).toFixed(2),
          Math.max(100 - desvio, 0).toFixed(2),
        ],
        backgroundColor: [getColor(), darkTheme.colors.grey],
        borderWidth: 0,
        cutout: "80%",
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: getColor(),
          fontWeight: "bold",
        }}
      >
        {desvio}%
      </div>
    </div>
  );
};

export default GaugeGraph;
