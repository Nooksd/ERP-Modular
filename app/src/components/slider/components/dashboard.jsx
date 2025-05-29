import { useEffect, useState, useRef } from "react";
import { innovaApi } from "@/services/http.js";

import * as styled from "../sliderStyles.js";

import LineGraph from "@/shared/includes/graphs/line/lineGraph.jsx";
import BarGraph from "@/shared/includes/graphs/bar/barGraph.jsx";
import GaugeGraph from "@/shared/includes/graphs/score metter/gaugeGraph.jsx";
import DoughnutGraph from "@/shared/includes/graphs/doughnut/doughnutGraph.jsx";
import VerticalBarGraph from "@/shared/includes/graphs/verticalBar/verticalBar.jsx";

import SVGTime from "@/shared/icons/gestaoHH/Time_icon.jsx";
import SVGTimeE1 from "@/shared/icons/gestaoHH/TimeE1_icon.jsx";
import SVGTimeE2 from "@/shared/icons/gestaoHH/TimeE2.jsx";

export const Dashboard = ({ selectedWork, toggleFilters, position }) => {
  const [workData, setWorkData] = useState();
  const [predictedData, setPredictedData] = useState();

  const [importedData, setImportedData] = useState({});
  const [importedDataRoles, setImportedDataRoles] = useState({});

  const [totalNormal, setTotalNormal] = useState(0);
  const [totalExtra1, setTotalExtra1] = useState(0);
  const [totalExtra2, setTotalExtra2] = useState(0);

  const [totalNormalPredicted, setTotalNormalPredicted] = useState(0);
  const [totalExtra2Predicted, setTotalExtra2Predicted] = useState(0);

  const chartRef = useRef(null);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    year: "",
    area: "",
    activity: "",
    subactivity: "",
    roles: [],
    comparison: 0,
  });

  const [desvioPercentual, setDesvioPercentual] = useState(0);

  const totalRealizado =
    importedData.data?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalPrevisto =
    importedData.data2?.reduce((acc, curr) => acc + curr, 0) || 0;

  const progressoTotal =
    totalPrevisto !== 0 ? (totalRealizado / totalPrevisto) * 100 : 0;

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    if (position === 0) {
      activateFilters();
    } else if (position === 2) {
      setFilter({ ...filter, comparison: 0 });
    }
  }, [position]);

  useEffect(() => {
    if ((workData && predictedData) || workData) {
      organizeGraph();
      organizeSecondGraph();
      organizeValues();
      calculatePredictedTotals();
      desvio();
    }
  }, [workData, predictedData, filter]);

  useEffect(() => {
    let isMounted = true;

    async function getWork() {
      try {
        let predicted;
        try {
          const { data } = await innovaApi.get(`/predicted/${selectedWork}`);
          predicted = data.predicted.data;
        } catch (error) {
          predicted = null;
        }

        const { data: realData } = await innovaApi.get(
          `/hhcontroll/get-statistics/${selectedWork}`
        );

        if (isMounted) {
          const real = realData.hhRecords;

          setWorkData(real);
          setPredictedData(predicted);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (selectedWork) {
      getWork();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedWork]);

  function desvio() {
    let totalPrevisto = 0;
    let totalNormal = 0;
    let desvio = 0;

    if (predictedData) {
      predictedData.forEach((record) => {
        if (filter?.comparison === 1 || filter?.comparison === 0)
          totalPrevisto += record.hours;
        if (filter?.comparison === 3 || filter?.comparison === 0)
          totalPrevisto += record.extras;
      });

      workData.forEach((record) => {
        record.hhRecords.forEach((hhRecord) => {
          hhRecord.roles.forEach((role) => {
            calculateHours(
              role,
              {
                normal: (value) => (totalNormal += value),
                extra1: (value) => (totalNormal += value),
                extra2: (value) => (totalNormal += value),
              },
              true
            );
          });
        });
      });

      if (totalPrevisto === 0) totalPrevisto = 1;

      desvio =
        ((totalNormal - totalPrevisto) / totalPrevisto) * 100 > 0
          ? (((totalNormal - totalPrevisto) / totalPrevisto) * 100).toFixed(2)
          : 0;
    }

    setDesvioPercentual(desvio);
  }

  function processRealData(realData) {
    const labels = [];
    const data = [];

    realData.forEach((hhRecord) => {
      const year = hhRecord.date.substring(0, 4);
      const month = meses[parseInt(hhRecord.date.substring(5, 7)) - 1].slice(
        0,
        3
      );
      const fullMonth = meses[parseInt(hhRecord.date.substring(5, 7)) - 1];

      const uniqueIndex = filter.year ? fullMonth : `${month}-${year}`;

      let labelIndex = labels.indexOf(uniqueIndex);

      if (labelIndex === -1) {
        labels.push(uniqueIndex);
        data.push(0);
        labelIndex = labels.length - 1;
      }

      hhRecord.hhRecords.forEach((record) => {
        record.roles.forEach((role) => {
          calculateHours(
            role,
            {
              normal: (value) => (data[labelIndex] += value),
              extra1: (value) => (data[labelIndex] += value),
              extra2: (value) => (data[labelIndex] += value),
            },
            true
          );
        });
      });
    });

    return { labels, data };
  }

  function processPredictedData(predicted) {
    const labels2 = [];
    const data2 = [];

    predicted.forEach((record) => {
      const year = record.date.substring(0, 4);
      const month = meses[parseInt(record.date.substring(5, 7)) - 1].slice(
        0,
        3
      );

      const fullMonth = meses[parseInt(record.date.substring(5, 7)) - 1];

      const uniqueIndex = filter.year ? fullMonth : `${month}-${year}`;

      let labelIndex = labels2.indexOf(uniqueIndex);

      if (labelIndex === -1) {
        labels2.push(uniqueIndex);
        data2.push(0);
        labelIndex = labels2.length - 1;
      }

      if (filter?.comparison === 3 || filter?.comparison === 0)
        data2[labelIndex] += record.extras;

      if (filter?.comparison === 1 || filter?.comparison === 0)
        data2[labelIndex] += record.hours;
    });

    return {
      labels2,
      data2,
    };
  }

  function organizeGraph() {
    const { labels: realLabels, data: realDataArray } = processRealData(
      workData || []
    );

    const sortedRealIndices = realLabels
      .map((label, index) => {
        const [month, year] = label.split("-");
        return {
          label,
          year: parseInt(year),
          monthIndex: meses.findIndex((m) => m.startsWith(month)),
          index,
        };
      })
      .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex)
      .map((item) => item.index);

    const sortedRealLabels = sortedRealIndices.map((i) => realLabels[i]);
    const sortedRealData = sortedRealIndices.map((i) => realDataArray[i]);

    if (predictedData) {
      const { labels2: predictedLabels, data2: predictedDataArray } =
        processPredictedData(predictedData || []);

      const sortedPredictedIndices = predictedLabels
        .map((label, index) => {
          const [month, year] = label.split("-");
          return {
            label,
            year: parseInt(year),
            monthIndex: meses.findIndex((m) => m.startsWith(month)),
            index,
          };
        })
        .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex)
        .map((item) => item.index);

      const sortedPredictedLabels = sortedPredictedIndices.map(
        (i) => predictedLabels[i]
      );
      const sortedPredictedData = sortedPredictedIndices.map(
        (i) => predictedDataArray[i]
      );

      const allLabelsSet = new Set([
        ...sortedRealLabels,
        ...sortedPredictedLabels,
      ]);
      const mergedLabels = Array.from(allLabelsSet);

      const sortedMergedLabels = mergedLabels
        .map((label) => {
          const [month, year] = label.includes("-")
            ? [label.split("-")[0], label.split("-")[1]]
            : [label, filter.year];
          return {
            label,
            year: parseInt(year),
            monthIndex: meses.findIndex((m) => m.startsWith(month)),
          };
        })
        .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex)
        .map((item) => item.label);

      const alignedRealData = sortedMergedLabels.map((label) => {
        const index = sortedRealLabels.indexOf(label);
        return index !== -1 ? sortedRealData[index] : 0;
      });

      const alignedPredictedData = sortedMergedLabels.map((label) => {
        const index = sortedPredictedLabels.indexOf(label);
        return index !== -1 ? sortedPredictedData[index] : 0;
      });

      const totalOrcado = predictedDataArray.reduce((acc, val) => acc + val, 0);

      const data3 = alignedRealData.map((real) =>
        totalOrcado === 0 ? 0 : Math.round((real / totalOrcado) * 100)
      );
      const data4 = alignedPredictedData.map((pred) =>
        totalOrcado === 0 ? 0 : Math.round((pred / totalOrcado) * 100)
      );

      setImportedData({
        labels: sortedMergedLabels,
        data: alignedRealData,
        data2: alignedPredictedData,
        data3: data3,
        data4: data4,
      });
    } else {
      setImportedData({
        labels: sortedRealLabels,
        data: sortedRealData,
      });
    }
  }

  const organizeSecondGraph = () => {
    const labels = [];
    const data = [];

    workData.forEach((hhRecord) => {
      hhRecord.hhRecords.forEach((record) => {
        record.roles.forEach((role) => {
          let labelIndex = labels.indexOf(role.role);

          if (labelIndex === -1) {
            labels.push(role.role);
            data.push(0);
            labelIndex = labels.length - 1;
          }

          calculateHours(
            role,
            {
              normal: (value) => (data[labelIndex] += value),
              extra1: (value) => (data[labelIndex] += value),
              extra2: (value) => (data[labelIndex] += value),
            },
            true
          );
        });
      });
    });

    setImportedDataRoles({
      labels: labels,
      data: data,
    });
  };

  const organizeValues = () => {
    let totalHHNormal = 0;
    let totalHHExtra1 = 0;
    let totalHHExtra2 = 0;

    workData.forEach((hhRecord) => {
      hhRecord.hhRecords.forEach((record) => {
        record.roles.forEach((role) => {
          calculateHours(role, {
            normal: (value) => (totalHHNormal += value),
            extra1: (value) => (totalHHExtra1 += value),
            extra2: (value) => (totalHHExtra2 += value),
          });
        });
      });
    });

    setTotalNormal(totalHHNormal);
    setTotalExtra1(totalHHExtra1);
    setTotalExtra2(totalHHExtra2);
  };

  const calculatePredictedTotals = () => {
    if (!predictedData) return;

    let normal = 0;
    let extra2 = 0;

    predictedData.forEach((record) => {
      normal += record.hours;
      extra2 += record.extras;
    });

    setTotalNormalPredicted(normal);
    setTotalExtra2Predicted(extra2);
  };

  function calculateHours(role, accumulators, comparison = false) {
    if (!comparison) {
      accumulators.normal(
        role.quantity * isNaN(role.hours) ? 0 : role.quantity * role.hours
      );
      accumulators.extra1(
        role.quantity * isNaN(role.extra) ? 0 : role.quantity * role.extra
      );
      accumulators.extra2(
        role.quantity * isNaN(role.extra2) ? 0 : role.quantity * role.extra2
      );
      return;
    }
    switch (filter.comparison) {
      case 1:
        accumulators.normal(
          role.quantity * isNaN(role.hours) ? 0 : role.quantity * role.hours
        );
        break;
      case 2:
        accumulators.extra1(
          role.quantity * isNaN(role.extra) ? 0 : role.quantity * role.extra
        );
        break;
      case 3:
        accumulators.extra2(
          role.quantity * isNaN(role.extra2) ? 0 : role.quantity * role.extra2
        );
        break;

      default:
        accumulators.normal(
          role.quantity * isNaN(role.hours) ? 0 : role.quantity * role.hours
        );
        accumulators.extra1(
          role.quantity * isNaN(role.extra) ? 0 : role.quantity * role.extra
        );
        accumulators.extra2(
          role.quantity * isNaN(role.extra2) ? 0 : role.quantity * role.extra2
        );
        break;
    }
  }

  const [filterIndex, setFilterIndex] = useState(0);
  const filterInterval = useRef(null);

  function activateFilters() {
    if (toggleFilters > 5000) {
      const timePerFilter = toggleFilters / 4;

      if (filterInterval.current) clearInterval(filterInterval.current);

      filterInterval.current = setInterval(() => {
        setFilterIndex((prev) => prev + 1);
      }, timePerFilter);
    }
  }

  useEffect(() => {
    if (filterIndex === 0) return;
    if (filterIndex >= 3) {
      clearInterval(filterInterval.current);
      setFilterIndex(0);
    }

    switch (filterIndex) {
      case 1:
        setFilter({ ...filter, comparison: 1 });
        break;
      case 2:
        setFilter({ ...filter, comparison: 2 });
        break;
      case 3:
        setFilter({ ...filter, comparison: 3 });
        break;
    }
  }, [filterIndex]);

  return (
    <>
      <styled.summaryContainer $selected={filter.comparison === 0}>
        <styled.IconContainer>
          <SVGTime />
        </styled.IconContainer>
        <styled.cardContentContainer>
          <styled.cardTitle>Horas Totais</styled.cardTitle>
          <styled.cardValue $single={predictedData && predictedData.length > 0}>
            {totalNormal + totalExtra1 + totalExtra2}{" "}
            {predictedData &&
              predictedData.length > 0 &&
              " / " + (totalNormalPredicted + totalExtra2Predicted).toFixed(0)}
          </styled.cardValue>
          <styled.smallCardValue
            style={{
              display:
                predictedData && predictedData.length > 0 ? "block" : "none",
            }}
          >
            {(
              ((totalNormal + totalExtra1 + totalExtra2) /
                (totalNormalPredicted + totalExtra2Predicted)) *
              100
            ).toFixed(0)}
            {"%"}
            <span> Utilizado</span>
          </styled.smallCardValue>
        </styled.cardContentContainer>
      </styled.summaryContainer>
      <styled.summaryContainer $selected={filter.comparison === 1}>
        <styled.IconContainer>
          <SVGTime />
        </styled.IconContainer>
        <styled.cardContentContainer>
          <styled.cardTitle>Horas Normais</styled.cardTitle>
          <styled.cardValue $single={predictedData && predictedData.length > 0}>
            {totalNormal}{" "}
            {predictedData &&
              predictedData.length > 0 &&
              " / " + totalNormalPredicted.toFixed(0)}
          </styled.cardValue>
          <styled.smallCardValue
            style={{
              display:
                predictedData && predictedData.length > 0 ? "block" : "none",
            }}
          >
            {((totalNormal / totalNormalPredicted) * 100).toFixed(0)}
            {"%"}
            <span> Utilizado</span>
          </styled.smallCardValue>
        </styled.cardContentContainer>
      </styled.summaryContainer>
      <styled.summaryContainer $selected={filter.comparison === 2}>
        <styled.IconContainer>
          <SVGTimeE1 />
        </styled.IconContainer>
        <styled.cardContentContainer>
          <styled.cardTitle>Horas Extras I</styled.cardTitle>
          <styled.cardValue $single={predictedData && predictedData.length > 0}>
            {totalExtra1} {predictedData && predictedData.length > 0 && " / 0"}
          </styled.cardValue>
          <styled.smallCardValue
            style={{
              display:
                predictedData && predictedData.length > 0 ? "block" : "none",
            }}
          >
            {(totalExtra1 * 100 - 100 > 0
              ? totalExtra1 * 100 - 100
              : 0
            ).toFixed(0)}
            {"%"}
            <span> Utilizado</span>
          </styled.smallCardValue>
        </styled.cardContentContainer>
      </styled.summaryContainer>
      <styled.summaryContainer $selected={filter.comparison === 3}>
        <styled.IconContainer>
          <SVGTimeE2 />
        </styled.IconContainer>
        <styled.cardContentContainer>
          <styled.cardTitle>Horas Extras II</styled.cardTitle>
          <styled.cardValue $single={predictedData && predictedData.length > 0}>
            {totalExtra2}{" "}
            {predictedData &&
              predictedData.length > 0 &&
              " / " + totalExtra2Predicted.toFixed(0)}
          </styled.cardValue>
          <styled.smallCardValue
            style={{
              display:
                predictedData && predictedData.length > 0 ? "block" : "none",
            }}
          >
            {((totalExtra2 / totalExtra2Predicted) * 100).toFixed(0)}
            {"%"}
            <span> Utilizado</span>
          </styled.smallCardValue>
        </styled.cardContentContainer>
      </styled.summaryContainer>
      <styled.sideGrapchContainer>
        <styled.graphTitleBlue>
          HH Utilizado x Função
          <styled.barContainer $position={importedDataRoles?.labels}>
            {importedDataRoles?.labels ? (
              <VerticalBarGraph importedData={importedDataRoles} />
            ) : (
              "Usina não selecionada"
            )}
          </styled.barContainer>
        </styled.graphTitleBlue>
      </styled.sideGrapchContainer>
      <styled.bigGraphContainer>
        <styled.graphTitle>HH Realizado x Orçado</styled.graphTitle>
        {importedData?.labels ? (
          <BarGraph importedData={importedData} chartRef={chartRef} />
        ) : (
          "Usina não selecionada"
        )}
      </styled.bigGraphContainer>
      <styled.smallGraphContainer>
        <styled.graphTitle>Termômetro do desvio</styled.graphTitle>
        {importedData?.labels ? (
          <GaugeGraph desvio={desvioPercentual} />
        ) : (
          "Usina não selecionada"
        )}
      </styled.smallGraphContainer>
      <styled.bigGraphContainer>
        <styled.graphTitle>% Mês/total</styled.graphTitle>
        {importedData?.labels ? (
          <LineGraph importedData={importedData} />
        ) : (
          "Usina não selecionada"
        )}
      </styled.bigGraphContainer>
      <styled.smallGraphContainer style={{ padding: "20px" }}>
        <styled.graphTitle>Progresso total</styled.graphTitle>
        <styled.indicator
          style={{ display: importedData.data ? "block" : "none" }}
        >
          {totalPrevisto !== 0
            ? `${
                Math.round(progressoTotal) > 100
                  ? 100
                  : Math.round(progressoTotal)
              }%`
            : "0%"}
        </styled.indicator>
        {importedData?.labels ? (
          <DoughnutGraph progress={progressoTotal} />
        ) : (
          "Usina não selecionada"
        )}
      </styled.smallGraphContainer>
    </>
  );
};
