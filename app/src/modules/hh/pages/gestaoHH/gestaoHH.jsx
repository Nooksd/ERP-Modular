// Página de gestão de HH

// -imports Ract, Redux- >
import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserWorks } from "../../store/slicers/worksSlicer.js";
import { innovaApi } from "@/services/http";
import { toast } from "react-toastify";
// import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import * as styled from "./gestaoHHStyles.js";

import LineGraph from "../../components/graphs/line/lineGraph.jsx";
import BarGraph from "../../components/graphs/bar/barGraph.jsx";
import GaugeGraph from "../../components/graphs/score metter/gaugeGraph.jsx";
import DoughnutGraph from "../../components/graphs/doughnut/doughnutGraph.jsx";
import VerticalBarGraph from "../../components/graphs/verticalBar/verticalBar.jsx";

import SVGFilter from "../../assets/icons/gestaoHH/Filter_icon.jsx";
import SVGEraseFilter from "../../assets/icons/gestaoHH/EraseFilter_icon.jsx";
import SVGTime from "../../assets/icons/gestaoHH/Time_icon.jsx";
import SVGTimeE1 from "../../assets/icons/gestaoHH/TimeE1_icon.jsx";
import SVGTimeE2 from "../../assets/icons/gestaoHH/TimeE2.jsx";
import SVGArrowDown from "../../assets/icons/header/Arrow_icon.jsx";

export const GestaoHH = ({ windowHeight }) => {
  const works = useSelector((state) => state.works);
  const [workData, setWorkData] = useState();
  const [predictedData, setPredictedData] = useState();

  const [activities, setActivities] = useState([]);
  const [recordDate, setRecordDate] = useState([]);
  const [importedData, setImportedData] = useState({});
  const [importedDataRoles, setImportedDataRoles] = useState({});
  const [roles, setRoles] = useState([]);

  const [totalNormal, setTotalNormal] = useState(0);
  const [totalExtra1, setTotalExtra1] = useState(0);
  const [totalExtra2, setTotalExtra2] = useState(0);

  const [totalNormalPredicted, setTotalNormalPredicted] = useState(0);
  const [totalExtra2Predicted, setTotalExtra2Predicted] = useState(0);

  const [openWindow, setOpenWindow] = useState(false);
  const [filterType, setFilterType] = useState(0);

  const [selectedWork, setSelectedWork] = useState("");

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

  const dispatch = useDispatch();

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
    if (!works || works.status !== "succeeded") {
      dispatch(fetchUserWorks());
    }
  }, [dispatch]);

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
          const { data } = await innovaApi.get(`/hh/predicted/${selectedWork}`);
          predicted = data.predicted.data;
        } catch (error) {
          predicted = null;
        }

        const { data: realData } = await innovaApi.get(
          `/hh/hhcontroll/get-statistics/${selectedWork}`
        );

        if (isMounted) {
          const real = realData.hhRecords;

          setWorkData(real);
          setPredictedData(predicted);

          getDate(predicted, real);
          getActivities(predicted, real);
          getRoles(predicted, real);

          toast.success(realData.message);
        }
      } catch (e) {
        if (isMounted) {
          toast.error(e.message);
        }
      }
    }

    if (selectedWork) {
      getWork();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedWork]);

  const handleSelectWork = useCallback((work) => {
    handleEraseFilter();

    setTotalNormal(0);
    setTotalExtra1(0);
    setTotalExtra2(0);
    setTotalNormalPredicted(0);
    setTotalExtra2Predicted(0);
    setRecordDate([]);
    setActivities([]);
    setRoles([]);
    setWorkData();
    setImportedData({});
    setImportedDataRoles({});
    setSelectedWork(work);
  }, []);

  const handleSelectRole = (role) => {
    let updatedRoles = [...filter.roles];

    const isRoleSelected = updatedRoles.some(
      (selectedRole) => selectedRole === role
    );

    if (isRoleSelected) {
      updatedRoles = updatedRoles.filter(
        (selectedRole) => selectedRole !== role
      );
    } else {
      updatedRoles.push(role);
    }

    setFilter({ ...filter, roles: updatedRoles });
  };

  const handleSelectType = (type) => {
    if (selectedWork) {
      if (filter.comparison === type) {
        setFilter({ ...filter, comparison: 0 });
      } else {
        setFilter({ ...filter, comparison: type });
      }
    }
  };

  const handleSelectDate = (mes) => {
    if (!filter.startDate && !filter.endDate) {
      setFilter({ ...filter, startDate: mes, endDate: mes });
    } else {
      if (mes === filter.startDate || mes === filter.endDate) {
        setFilter({ ...filter, startDate: "", endDate: "" });
      } else {
        const startYear = parseInt(filter.startDate.split("-")[0]);
        const startMonth = parseInt(filter.startDate.split("-")[1]);
        const clickedYear = parseInt(mes.split("-")[0]);
        const clickedMonth = parseInt(mes.split("-")[1]);

        if (
          clickedYear > startYear ||
          (clickedYear === startYear && clickedMonth > startMonth)
        ) {
          setFilter({ ...filter, endDate: mes });
        } else {
          setFilter({ ...filter, startDate: mes });
        }
      }
    }
  };

  const handleEraseFilter = () => {
    setFilterType(0);
    setFilter({
      startDate: "",
      endDate: "",
      year: "",
      area: "",
      activity: "",
      subactivity: "",
      roles: [],
      comparison: 0,
    });
  };

  function desvio() {
    let totalPrevisto = 0;
    let totalNormal = 0;
    let desvio = 0;

    if (predictedData) {
      predictedData.forEach((record) => {
        const year = record.date.substring(0, 4);
        const monthNumber =
          record.date.substring(5, 6) == 0
            ? record.date.substring(6, 7)
            : record.date.substring(5, 7);

        if (timeFilter(year, monthNumber)) return;

        if (filter?.comparison === 1 || filter?.comparison === 0)
          totalPrevisto += record.hours;
        if (filter?.comparison === 3 || filter?.comparison === 0)
          totalPrevisto += record.extras;
      });

      workData.forEach((record) => {
        const date = new Date(record.date);
        const year = record.date.substring(0, 4);
        const monthNumber =
          record.date.substring(5, 6) == 0
            ? record.date.substring(6, 7)
            : record.date.substring(5, 7);

        if (timeFilter(year, monthNumber)) return;

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
      const monthNumber =
        hhRecord.date.substring(5, 6) == 0
          ? hhRecord.date.substring(6, 7)
          : hhRecord.date.substring(5, 7);

      if (timeFilter(year, monthNumber)) return;

      const uniqueIndex = filter.year ? fullMonth : `${month}-${year}`;

      let labelIndex = labels.indexOf(uniqueIndex);

      if (labelIndex === -1) {
        labels.push(uniqueIndex);
        data.push(0);
        labelIndex = labels.length - 1;
      }

      hhRecord.hhRecords.forEach((record) => {
        if (activityFilter(record.area, record.activity, record.subactivity))
          return;
        record.roles.forEach((role) => {
          if (!roleFilter(role.role)) return;
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
      const monthNumber =
        record.date.substring(5, 6) == 0
          ? record.date.substring(6, 7)
          : record.date.substring(5, 7);

      if (timeFilter(year, monthNumber)) return;

      const uniqueIndex = filter.year ? fullMonth : `${month}-${year}`;

      let labelIndex = labels2.indexOf(uniqueIndex);

      if (labelIndex === -1) {
        labels2.push(uniqueIndex);
        data2.push(0);
        labelIndex = labels2.length - 1;
      }

      if (activityFilter(record.area, record.activity, record.subactivity))
        return;

      if (!roleFilter(record.role)) return;

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

      // Calcular o total orçado
      const totalOrcado = predictedDataArray.reduce((acc, val) => acc + val, 0);

      // Calcular data3 e data4
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
        data4: data4, // Adicionando data4
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
      const year = hhRecord.date.substring(0, 4);
      const monthNumber =
        hhRecord.date.substring(5, 6) == 0
          ? hhRecord.date.substring(6, 7)
          : hhRecord.date.substring(5, 7);

      if (timeFilter(year, monthNumber)) return;

      hhRecord.hhRecords.forEach((record) => {
        if (activityFilter(record.area, record.activity, record.subactivity))
          return;
        record.roles.forEach((role) => {
          if (!roleFilter(role.role)) return;

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
      const year = hhRecord.date.substring(0, 4);
      const monthNumber =
        hhRecord.date.substring(5, 6) == 0
          ? hhRecord.date.substring(6, 7)
          : hhRecord.date.substring(5, 7);

      if (timeFilter(year, monthNumber)) return;

      hhRecord.hhRecords.forEach((record) => {
        if (activityFilter(record.area, record.activity, record.subactivity))
          return;

        record.roles.forEach((role) => {
          if (!roleFilter(role.role)) return;

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
      const year = record.date.substring(0, 4);
      const monthNumber =
        record.date.substring(5, 6) == 0
          ? record.date.substring(6, 7)
          : record.date.substring(5, 7);

      if (timeFilter(year, monthNumber)) return;

      normal += record.hours;
      extra2 += record.extras;
    });

    setTotalNormalPredicted(normal);
    setTotalExtra2Predicted(extra2);
  };

  function getActivities(predicted, actual) {
    let newActivities = [];

    if (predicted) {
      predicted.forEach((record) => {
        const area = record.area;
        const activity = record.activity;
        const subactivity = record.subactivity;

        let areaRecord = newActivities.find(
          (activity) => activity.area === area
        );
        if (areaRecord) {
          const currentActivity = areaRecord.activities.find(
            (a) => a.activity === activity
          );
          if (currentActivity) {
            if (!currentActivity.subactivities.includes(subactivity)) {
              currentActivity.subactivities.push(subactivity);
            }
          } else {
            areaRecord.activities.push({
              activity,
              subactivities: [subactivity],
            });
          }
        } else {
          newActivities.push({
            area,
            activities: [{ activity, subactivities: [subactivity] }],
          });
        }
      });
    }

    actual.forEach((hhRecord) => {
      hhRecord.hhRecords.forEach((record) => {
        const area = record.area;
        const activity = record.activity;
        const subactivity = record.subactivity;

        let areaRecord = newActivities.find(
          (activity) => activity.area === area
        );
        if (areaRecord) {
          const currentActivity = areaRecord.activities.find(
            (a) => a.activity === activity
          );
          if (currentActivity) {
            if (!currentActivity.subactivities.includes(subactivity)) {
              currentActivity.subactivities.push(subactivity);
            }
          } else {
            areaRecord.activities.push({
              activity,
              subactivities: [subactivity],
            });
          }
        } else {
          newActivities.push({
            area,
            activities: [{ activity, subactivities: [subactivity] }],
          });
        }
      });
    });

    setActivities(newActivities);
  }

  function getRoles(predicted, actual) {
    let newRoles = [];

    if (predicted) {
      predicted.forEach((record) => {
        const foundRole = newRoles.find((roles) => roles === record.role);

        if (!foundRole) newRoles.push(record.role);
      });
    }

    actual.forEach((hhRecord) => {
      hhRecord.hhRecords.forEach((record) => {
        record.roles.forEach((role) => {
          const foundRole = newRoles.find((roles) => roles === role.role);

          if (!foundRole) newRoles.push(role.role);
        });
      });
    });

    setRoles(newRoles);
  }

  function getDate(predicted, actual) {
    let newRecordDate = [...recordDate];

    if (predicted) {
      predicted.forEach((hhRecord) => {
        const year = hhRecord.date.substring(0, 4);
        const month = meses[parseInt(hhRecord.date.substring(5, 7)) - 1];

        let yearRecord = newRecordDate.find((date) => date.ano == year);

        if (yearRecord) {
          if (!yearRecord.meses.includes(month)) {
            yearRecord.meses.push(month);
            yearRecord.meses.sort(
              (a, b) => meses.indexOf(a) - meses.indexOf(b)
            );
          }
        } else {
          newRecordDate.push({
            ano: year,
            meses: [month],
          });
        }
      });
    }

    actual.forEach((hhRecord) => {
      const year = hhRecord.date.substring(0, 4);
      const month = meses[parseInt(hhRecord.date.substring(5, 7)) - 1];

      let yearRecord = newRecordDate.find((date) => date.ano == year);

      if (yearRecord) {
        if (!yearRecord.meses.includes(month)) {
          yearRecord.meses.push(month);
          yearRecord.meses.sort((a, b) => meses.indexOf(a) - meses.indexOf(b));
        }
      } else {
        newRecordDate.push({
          ano: year,
          meses: [month],
        });
      }
    });

    newRecordDate.sort((a, b) => a.ano - b.ano);

    if (newRecordDate.length === 1)
      setFilter({ ...filter, year: newRecordDate[0].ano });

    setRecordDate(newRecordDate);
  }

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

  function timeFilter(year, monthNumber) {
    if (filter.year && year !== filter.year) return true;
    if (filter.startDate) {
      const selectedMonth = recordDate.find(
        (date) => date.ano === filter.startDate.slice(0, 4)
      ).meses[filter.startDate.slice(5, 7)];

      if (year < filter.startDate.slice(0, 4)) return true;

      if (
        year === filter.startDate.slice(0, 4) &&
        monthNumber < meses.indexOf(selectedMonth) + 1
      )
        return true;
    }
    if (filter.endDate) {
      const selectedMonth = recordDate.find(
        (date) => date.ano === filter.endDate.slice(0, 4)
      ).meses[filter.endDate.slice(5, 7)];

      if (year > filter.endDate.slice(0, 4)) return true;
      if (
        year === filter.endDate.slice(0, 4) &&
        monthNumber > meses.indexOf(selectedMonth) + 1
      )
        return true;
    }

    return false;
  }

  function activityFilter(area, activity, subactivity) {
    if (
      filter.subactivity &&
      (area !== filter.area ||
        activity !== filter.activity ||
        subactivity !== filter.subactivity)
    )
      return true;
    if (
      filter.activity &&
      (area !== filter.area || activity !== filter.activity)
    )
      return true;
    if (filter.area && area !== filter.area) return true;

    return false;
  }

  function roleFilter(role) {
    if (filter.roles.length === 0) return true;

    return filter.roles.some((selectedRole) => selectedRole === role);
  }

  // const generatePDF = async () => {
  //   try {
  //     const { data } = await innovaApi.get("/hhcontroll/get-pdf-base", {
  //       responseType: "arraybuffer",
  //     });

  //     const pdfDoc = await PDFDocument.load(data);
  //     const pages = pdfDoc.getPages();
  //     const page = pages[0];

  //     const { width, height } = page.getSize();
  //     const blackColor = rgb(0, 0, 0);
  //     const greenColor = rgb(176 / 255, 209 / 255, 89 / 255);

  //     const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  //     const selectedWorkDetails = works.works.userWorks.find(
  //       (work) => work._id === selectedWork
  //     );

  //     const titleConfig = {
  //       text: selectedWorkDetails.name,
  //       size: 25,
  //       averageCharacterWidth: 0.45,
  //       yOffset: 150,
  //     };

  //     titleConfig.width =
  //       titleConfig.size *
  //       titleConfig.text.length *
  //       titleConfig.averageCharacterWidth;

  //     titleConfig.x = width / 2 - titleConfig.width / 2;
  //     titleConfig.y = height - titleConfig.yOffset;

  //     page.drawText(titleConfig.text, {
  //       x: titleConfig.x,
  //       y: titleConfig.y,
  //       size: titleConfig.size,
  //       color: blackColor,
  //       font: timesRomanFont,
  //     });

  //     const subtitleConfig = {
  //       text: `${importedData.labels[0]} - ${
  //         importedData.labels[importedData.labels.length - 1]
  //       }`,
  //       size: 15,
  //       averageCharacterWidth: 0.45,
  //     };

  //     subtitleConfig.width =
  //       subtitleConfig.size *
  //       subtitleConfig.text.length *
  //       subtitleConfig.averageCharacterWidth;

  //     subtitleConfig.x = width / 2 - subtitleConfig.width / 2;
  //     subtitleConfig.y = titleConfig.y - 70;

  //     page.drawText(subtitleConfig.text, {
  //       x: subtitleConfig.x,
  //       y: subtitleConfig.y + 50,
  //       size: subtitleConfig.size,
  //       color: greenColor,
  //       font: timesRomanFont,
  //     });

  //     const canvas = chartRef.current?.canvas;
  //     const dataURL = canvas.toDataURL("image/png");
  //     const imageBytes = Uint8Array.from(atob(dataURL.split(",")[1]), (c) =>
  //       c.charCodeAt(0)
  //     );

  //     const pngImage = await pdfDoc.embedPng(imageBytes);
  //     const imgWidth = 400;
  //     const imgHeight = (imgWidth / pngImage.width) * pngImage.height;

  //     page.drawImage(pngImage, {
  //       x: width / 2 - imgWidth / 2,
  //       y: titleConfig.y - imgHeight - 50,
  //       width: imgWidth,
  //       height: imgHeight,
  //     });

  //     const pdfBytes = await pdfDoc.save();
  //     const blob = new Blob([pdfBytes], { type: "application/pdf" });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `Relatorio_HH_${titleConfig.text}.pdf`;
  //     a.click();
  //   } catch (e) {
  //     toastMessage({
  //       danger: true,
  //       title: "Erro",
  //       message: "Não foi possível gerar o PDF.",
  //     });
  //   }
  // };

  const sendPredicted = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".xlsx, .xls";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!selectedWork) {
          toast.error("Selecione uma usina primeiro");
          return;
        }

        const formData = new FormData();
        formData.append("data", file);

        try {
          const response = await innovaApi.post(
            `/hh/predicted/send/${selectedWork}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          toast.success(response.data.message);

          const { data } = await innovaApi.get(`/hh/predicted/${selectedWork}`);
          setPredictedData(data.predicted.data);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Falha ao enviar arquivo"
          );
        }
      };

      input.click();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      <styled.content>
        <styled.greenBackground>
          <styled.titleContainer>
            <styled.title>Dashboard de gestão HH</styled.title>
            <styled.controllContainer>
              {filterType === 0 && (
                <styled.yearSelector>
                  <styled.year
                    disabled={recordDate.length === 1}
                    onClick={() => setFilter({ ...filter, year: "" })}
                    $selected={filter.year === ""}
                  ></styled.year>
                  {recordDate &&
                    recordDate.map((date) => (
                      <styled.year
                        key={date.ano}
                        disabled={recordDate.length === 1}
                        onClick={() => setFilter({ ...filter, year: date.ano })}
                        $selected={filter.year === date.ano}
                      >
                        {date.ano}
                      </styled.year>
                    ))}
                </styled.yearSelector>
              )}
              {filterType === 1 && (
                <styled.yearSelector>
                  <styled.workSelect
                    name="area"
                    value={filter.area}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        area: e.target.value,
                        activity: "",
                        subactivity: "",
                      });
                    }}
                  >
                    <option value="">Selecionar Área</option>
                    {activities.map((activity) => (
                      <option key={activity.area} value={activity.area}>
                        {activity.area}
                      </option>
                    ))}
                  </styled.workSelect>
                  {filter.area && (
                    <styled.workSelect
                      name="atividade"
                      value={filter.activity}
                      onChange={(e) => {
                        setFilter({
                          ...filter,
                          activity: e.target.value,
                          subactivity: "",
                        });
                      }}
                    >
                      <option value="">Selecionar Atividade</option>
                      {activities.map((activity) => {
                        if (activity.area === filter.area) {
                          return activity.activities.map((activity) => (
                            <option
                              key={activity.activity}
                              value={activity.activity}
                            >
                              {activity.activity}
                            </option>
                          ));
                        }
                      })}
                    </styled.workSelect>
                  )}
                  {filter.area && filter.activity && (
                    <styled.workSelect
                      name="subatividade"
                      value={filter.subactivity}
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          subactivity: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecionar Subatividade</option>
                      {activities.map((activity) => {
                        if (activity.area === filter.area) {
                          return activity.activities.map((activity) => {
                            if (activity.activity === filter.activity) {
                              return activity.subactivities.map(
                                (subactivity) => (
                                  <option key={subactivity} value={subactivity}>
                                    {subactivity}
                                  </option>
                                )
                              );
                            }
                          });
                        }
                      })}
                    </styled.workSelect>
                  )}
                </styled.yearSelector>
              )}
              {filterType === 2 && (
                <styled.filterRole>
                  Selecionar Funções
                  <styled.openSvgContainer
                    onClick={() => setOpenWindow((prev) => !prev)}
                  >
                    <SVGArrowDown open={openWindow} width="25" />
                  </styled.openSvgContainer>
                  {openWindow && (
                    <styled.rolesContainer>
                      {roles.map((role, index) => (
                        <styled.roleCheckContainer key={index}>
                          {role}
                          <input
                            type="checkbox"
                            checked={filter.roles.some(
                              (selectedRole) => selectedRole === role
                            )}
                            onChange={() => handleSelectRole(role)}
                          />
                          <span></span>
                        </styled.roleCheckContainer>
                      ))}
                    </styled.rolesContainer>
                  )}
                </styled.filterRole>
              )}
              <styled.filter
                onClick={() =>
                  setFilterType((prev) => {
                    setOpenWindow(false);
                    if (prev >= 2) {
                      return 0;
                    } else {
                      return prev + 1;
                    }
                  })
                }
              >
                <SVGFilter />
              </styled.filter>
              <styled.workSelect
                name="usina"
                value={selectedWork}
                onChange={(e) => handleSelectWork(e.target.value)}
              >
                <option value="">Selecionar Usina</option>
                {works.status === "succeeded" &&
                  works.works.userWorks.map((work) => (
                    <option key={work._id} value={work._id}>
                      {work.name}
                    </option>
                  ))}
              </styled.workSelect>
              <styled.eraseFilter onClick={() => handleEraseFilter()}>
                <SVGEraseFilter />
              </styled.eraseFilter>
            </styled.controllContainer>
          </styled.titleContainer>
        </styled.greenBackground>
        <styled.dashboardContainer>
          <styled.summaryContainer
            $selected={filter.comparison === 0}
            onClick={() => handleSelectType(0)}
          >
            <styled.IconContainer>
              <SVGTime />
            </styled.IconContainer>
            <styled.cardContentContainer>
              <styled.cardTitle>Horas Totais</styled.cardTitle>
              <styled.cardValue
                $single={predictedData && predictedData.length > 0}
              >
                {totalNormal + totalExtra1 + totalExtra2}{" "}
                {predictedData &&
                  predictedData.length > 0 &&
                  " / " +
                    (totalNormalPredicted + totalExtra2Predicted).toFixed(0)}
              </styled.cardValue>
              <styled.smallCardValue
                style={{
                  display:
                    predictedData && predictedData.length > 0
                      ? "block"
                      : "none",
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
          <styled.summaryContainer
            $selected={filter.comparison === 1}
            onClick={() => handleSelectType(1)}
          >
            <styled.IconContainer>
              <SVGTime />
            </styled.IconContainer>
            <styled.cardContentContainer>
              <styled.cardTitle>Horas Normais</styled.cardTitle>
              <styled.cardValue
                $single={predictedData && predictedData.length > 0}
              >
                {totalNormal}{" "}
                {predictedData &&
                  predictedData.length > 0 &&
                  " / " + totalNormalPredicted.toFixed(0)}
              </styled.cardValue>
              <styled.smallCardValue
                style={{
                  display:
                    predictedData && predictedData.length > 0
                      ? "block"
                      : "none",
                }}
              >
                {((totalNormal / totalNormalPredicted) * 100).toFixed(0)}
                {"%"}
                <span> Utilizado</span>
              </styled.smallCardValue>
            </styled.cardContentContainer>
          </styled.summaryContainer>
          <styled.summaryContainer
            $selected={filter.comparison === 2}
            onClick={() => handleSelectType(2)}
          >
            <styled.IconContainer>
              <SVGTimeE1 />
            </styled.IconContainer>
            <styled.cardContentContainer>
              <styled.cardTitle>Horas Extras I</styled.cardTitle>
              <styled.cardValue
                $single={predictedData && predictedData.length > 0}
              >
                {totalExtra1}{" "}
                {predictedData && predictedData.length > 0 && " / 0"}
              </styled.cardValue>
              <styled.smallCardValue
                style={{
                  display:
                    predictedData && predictedData.length > 0
                      ? "block"
                      : "none",
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
          <styled.summaryContainer
            $selected={filter.comparison === 3}
            onClick={() => handleSelectType(3)}
          >
            <styled.IconContainer>
              <SVGTimeE2 />
            </styled.IconContainer>
            <styled.cardContentContainer>
              <styled.cardTitle>Horas Extras II</styled.cardTitle>
              <styled.cardValue
                $single={predictedData && predictedData.length > 0}
              >
                {totalExtra2}{" "}
                {predictedData &&
                  predictedData.length > 0 &&
                  " / " + totalExtra2Predicted.toFixed(0)}
              </styled.cardValue>
              <styled.smallCardValue
                style={{
                  display:
                    predictedData && predictedData.length > 0
                      ? "block"
                      : "none",
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
            <styled.exportButton onClick={() => sendPredicted()}>
              Enviar previsto{" "}
              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12H20M20 12L16 8M20 12L16 16"
                  strokeWidth="`1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </styled.exportButton>
            {/* <styled.exportButton onClick={() => generatePDF()}>
              Exportar relatório{" "}
              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12H20M20 12L16 8M20 12L16 16"
                  strokeWidth="`1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </styled.exportButton> */}
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
          <styled.monthSelectorContainer>
            {recordDate.map((date, dateIndex) => {
              if (date.ano === filter.year || filter.year === "") {
                return date.meses.map((mes, monthIndex) => {
                  const uniqueIndex = `${date.ano}-${monthIndex}`;
                  return (
                    <Fragment key={`month-select-${uniqueIndex}`}>
                      <styled.monthSelect
                        key={`month-select-${uniqueIndex}`}
                        $selected={
                          filter.startDate === uniqueIndex ||
                          filter.endDate === uniqueIndex
                        }
                        $between={
                          uniqueIndex > filter.startDate &&
                          uniqueIndex < filter.endDate
                        }
                        onClick={() => handleSelectDate(uniqueIndex)}
                      >
                        {filter.year ? mes : mes.slice(0, 3)}
                      </styled.monthSelect>

                      {(monthIndex + 1 !== date.meses.length ||
                        (dateIndex + 1 !== recordDate.length &&
                          !filter.year)) && (
                        <styled.monthLine
                          key={`monthLine-${uniqueIndex}`}
                          $between={
                            (uniqueIndex > filter.startDate &&
                              uniqueIndex < filter.endDate) ||
                            (filter.startDate === uniqueIndex &&
                              filter.endDate &&
                              filter.startDate !== filter.endDate)
                          }
                        />
                      )}
                    </Fragment>
                  );
                });
              }
            })}
          </styled.monthSelectorContainer>
        </styled.dashboardContainer>
      </styled.content>
    </styled.contentDiv>
  );
};
