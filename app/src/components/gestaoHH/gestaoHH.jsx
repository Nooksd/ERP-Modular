// Página de gestão de HH

// -imports Ract, Redux- >
import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserWorks } from "../../store/slicers/worksSlicer.js";
import { innovaApi } from "../../services/http.js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import * as styled from "./gestaoHHStyles.js";

import LineGraph from "../../shared/includes/graphs/line/lineGraph.jsx";
import BarGraph from "../../shared/includes/graphs/bar/barGraph.jsx";
import GaugeGraph from "../../shared/includes/graphs/score metter/gaugeGraph.jsx";
import DoughnutGraph from "../../shared/includes/graphs/doughnut/doughnutGraph.jsx";
import PieGraph from "../../shared/includes/graphs/pie/pieGraph.jsx";
import VerticalBarGraph from "../../shared/includes/graphs/verticalBar/verticalBar.jsx";

import SVGFilter from "../../shared/icons/gestaoHH/Filter_icon.jsx";
import SVGEraseFilter from "../../shared/icons/gestaoHH/EraseFilter_icon.jsx";
import SVGTime from "../../shared/icons/gestaoHH/Time_icon.jsx";
import SVGTimeE1 from "../../shared/icons/gestaoHH/TimeE1_icon.jsx";
import SVGTimeE2 from "../../shared/icons/gestaoHH/TimeE2.jsx";
import SVGArrowDown from "../../shared/icons/header/Arrow_icon.jsx";

export const GestaoHH = ({ windowHeight, toastMessage }) => {
  const works = useSelector((state) => state.works);
  const [workData, setWorkData] = useState();

  const [activities, setActivities] = useState([]);
  const [recordDate, setRecordDate] = useState([]);
  const [importedData, setImportedData] = useState({});
  const [importedDataRoles, setImportedDataRoles] = useState({});
  const [roles, setRoles] = useState([]);

  const [totalNormal, setTotalNormal] = useState(0);
  const [totalExtra1, setTotalExtra1] = useState(0);
  const [totalExtra2, setTotalExtra2] = useState(0);

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
    if (workData) {
      organizeGraph(workData);
      organizeSecondGraph(workData);
      organizeValues(workData);
    }
  }, [workData, filter]);

  useEffect(() => {
    let isMounted = true;

    async function getWork() {
      try {
        const { data } = await innovaApi.get(
          `/hhcontroll/get-statistics/${selectedWork}`
        );
        if (isMounted) {
          setWorkData(data.hhRecords);
          getDate(data.hhRecords);
          getActivities(data.hhRecords);
          getRoles(data.hhRecords);
          toastMessage({
            danger: false,
            title: "Sucesso",
            message: data.message,
          });
        }
      } catch (e) {
        if (isMounted) {
          toastMessage({
            danger: true,
            title: "Erro",
            message: e.message,
          });
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
    if (filter.startDate === undefined) {
      setFilter({ ...filter, startDate: mes });
    } else if (filter.endDate === undefined) {
      if (mes > filter.startDate) {
        setFilter({ ...filter, endDate: mes });
      } else if (mes <= filter.startDate) {
        setFilter({ ...filter, startDate: mes });
      }
    } else {
      if (mes === filter.startDate) {
        setFilter({ ...filter, startDate: undefined, endDate: undefined });
      } else if (mes === filter.endDate) {
        setFilter({ ...filter, startDate: undefined, endDate: undefined });
      } else {
        setFilter({ ...filter, startDate: mes, endDate: undefined });
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

  function organizeGraph(response) {
    const labels = [];
    const data = [];

    response.forEach((hhRecord) => {
      const date = new Date(hhRecord.date);
      const dayOfWeek = date.getDay();
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
            dayOfWeek,
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

    const sortedIndices = labels
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

    const sortedLabels = sortedIndices.map((i) => labels[i]);
    const sortedData = sortedIndices.map((i) => data[i]);

    setImportedData({
      labels: sortedLabels,
      data: sortedData,
    });
  }

  const organizeSecondGraph = (response) => {
    const labels = [];
    const data = [];

    response.forEach((hhRecord) => {
      const date = new Date(hhRecord.date);
      const dayOfWeek = date.getDay();
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
            dayOfWeek,
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

  const organizeValues = (data) => {
    let totalHHNormal = 0;
    let totalHHExtra1 = 0;
    let totalHHExtra2 = 0;

    data.forEach((hhRecord) => {
      const date = new Date(hhRecord.date);
      const dayOfWeek = date.getDay();
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
          calculateHours(role, dayOfWeek, {
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

  function getActivities(data) {
    let newActivities = [];

    data.forEach((hhRecord) => {
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

  function getRoles(data) {
    let newRoles = [];

    data.forEach((hhRecord) => {
      hhRecord.hhRecords.forEach((record) => {
        record.roles.forEach((role) => {
          const foundRole = newRoles.find((roles) => roles === role.role);

          if (!foundRole) newRoles.push(role.role);
        });
      });
    });

    setRoles(newRoles);
  }

  function getDate(data) {
    let newRecordDate = [...recordDate];

    data.forEach((hhRecord) => {
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

  function calculateHours(role, dayOfWeek, accumulators, comparison = false) {
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      if (filter.comparison === 3 || filter.comparison === 0 || !comparison)
        accumulators.extra2(role.quantity * role.hours);
    } else {
      if (role.hours <= 9) {
        if (filter.comparison === 1 || filter.comparison === 0 || !comparison)
          accumulators.normal(role.quantity * role.hours);
      } else if (role.hours <= 11) {
        if (filter.comparison === 1 || filter.comparison === 0 || !comparison)
          accumulators.normal(role.quantity * 9);
        if (filter.comparison === 2 || filter.comparison === 0 || !comparison)
          accumulators.extra1(role.quantity * (role.hours - 9));
      } else {
        if (filter.comparison === 1 || filter.comparison === 0 || !comparison)
          accumulators.normal(role.quantity * 9);
        if (filter.comparison === 2 || filter.comparison === 0 || !comparison)
          accumulators.extra1(role.quantity * 2);
        if (filter.comparison === 3 || filter.comparison === 0 || !comparison)
          accumulators.extra2(role.quantity * (role.hours - 11));
      }
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

  const generatePDF = async () => {
    try {
      const { data } = await innovaApi.get("/hhcontroll/get-pdf-base", {
        responseType: "arraybuffer",
      });

      const pdfDoc = await PDFDocument.load(data);
      const pages = pdfDoc.getPages();
      const page = pages[0];

      const { width, height } = page.getSize();
      const blackColor = rgb(0, 0, 0);
      const greenColor = rgb(176 / 255, 209 / 255, 89 / 255);

      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      const selectedWorkDetails = works.works.userWorks.find(
        (work) => work._id === selectedWork
      );

      const titleConfig = {
        text: selectedWorkDetails.name,
        size: 25,
        averageCharacterWidth: 0.45,
        yOffset: 150,
      };

      titleConfig.width =
        titleConfig.size *
        titleConfig.text.length *
        titleConfig.averageCharacterWidth;

      titleConfig.x = width / 2 - titleConfig.width / 2;
      titleConfig.y = height - titleConfig.yOffset;

      page.drawText(titleConfig.text, {
        x: titleConfig.x,
        y: titleConfig.y,
        size: titleConfig.size,
        color: blackColor,
        font: timesRomanFont,
      });

      const subtitleConfig = {
        text: `${importedData.labels[0]} - ${
          importedData.labels[importedData.labels.length - 1]
        }`,
        size: 15,
        averageCharacterWidth: 0.45,
      };

      subtitleConfig.width =
        subtitleConfig.size *
        subtitleConfig.text.length *
        subtitleConfig.averageCharacterWidth;

      subtitleConfig.x = width / 2 - subtitleConfig.width / 2;
      subtitleConfig.y = titleConfig.y - 70;

      page.drawText(subtitleConfig.text, {
        x: subtitleConfig.x,
        y: subtitleConfig.y + 50,
        size: subtitleConfig.size,
        color: greenColor,
        font: timesRomanFont,
      });

      const canvas = chartRef.current?.canvas;
      const dataURL = canvas.toDataURL("image/png");
      const imageBytes = Uint8Array.from(atob(dataURL.split(",")[1]), (c) =>
        c.charCodeAt(0)
      );

      const pngImage = await pdfDoc.embedPng(imageBytes);
      const imgWidth = 400;
      const imgHeight = (imgWidth / pngImage.width) * pngImage.height;

      page.drawImage(pngImage, {
        x: width / 2 - imgWidth / 2,
        y: titleConfig.y - imgHeight - 50,
        width: imgWidth,
        height: imgHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Relatorio_HH_${titleConfig.text}.pdf`;
      a.click();
    } catch (e) {
      console.error("Erro ao gerar PDF", e);
      toastMessage({
        danger: true,
        title: "Erro",
        message: "Não foi possível gerar o PDF.",
      });
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
          <styled.sideGrapchContainer>
            <styled.graphTitleBlue>
              HH Normal x HH Extra I x HH Extra II
              <styled.pieContainer>
                {totalNormal || totalExtra1 || totalExtra2 ? (
                  <PieGraph
                    normal={totalNormal}
                    extra1={totalExtra1}
                    extra2={totalExtra2}
                  />
                ) : (
                  "Usina não selecionada"
                )}
              </styled.pieContainer>
            </styled.graphTitleBlue>
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
            <styled.exportButton onClick={() => generatePDF()}>
              Exportar relatório{" "}
              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12H20M20 12L16 8M20 12L16 16"
                  strokeWidth="`1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </styled.exportButton>
          </styled.sideGrapchContainer>
          <styled.summaryContainer
            $selected={filter.comparison === 1}
            onClick={() => handleSelectType(1)}
          >
            <styled.IconContainer>
              <SVGTime />
            </styled.IconContainer>
            <styled.cardContentContainer>
              <styled.cardTitle>Horas Normais</styled.cardTitle>
              <styled.cardValue>{totalNormal}</styled.cardValue>
              <styled.smallCardValue>
                30% <span> Utilizado</span>
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
              <styled.cardValue>{totalExtra1}</styled.cardValue>
              <styled.smallCardValue>
                10% <span> Utilizado</span>
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
              <styled.cardValue>{totalExtra2}</styled.cardValue>
              <styled.smallCardValue>
                50% <span> Utilizado</span>
              </styled.smallCardValue>
            </styled.cardContentContainer>
          </styled.summaryContainer>
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
              <GaugeGraph importedData={importedData} />
            ) : (
              "Usina não selecionada"
            )}
          </styled.smallGraphContainer>
          <styled.bigGraphContainer>
            <styled.graphTitle>HH Realizado x Orçado</styled.graphTitle>
            {importedData?.labels ? (
              <LineGraph importedData={importedData} />
            ) : (
              "Usina não selecionada"
            )}
          </styled.bigGraphContainer>
          <styled.smallGraphContainer style={{ padding: "20px" }}>
            <styled.graphTitle>Progresso total</styled.graphTitle>
            <styled.indicator>80%</styled.indicator>
            {importedData?.labels ? (
              <DoughnutGraph importedData={importedData} />
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
                            (filter.startDate === uniqueIndex && filter.endDate)
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
