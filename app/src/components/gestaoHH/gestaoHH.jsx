// Página de gestão de HH

// -imports Ract, Redux- >
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserWorks } from "../../store/slicers/worksSlicer.js";
import { innovaApi } from "../../services/http.js";

import * as styled from "./gestaoHHStyles.js";

import LineGraph from "../../shared/includes/graphs/line/lineGraph.jsx";
import BarGraph from "../../shared/includes/graphs/bar/barGraph.jsx";
import PieGraph from "../../shared/includes/graphs/pie/pieGraph.jsx";

import SVGFilter from "../../shared/icons/gestaoHH/Filter_icon.jsx";
import SVGEraseFilter from "../../shared/icons/gestaoHH/EraseFilter_icon.jsx";
import SVGTime from "../../shared/icons/gestaoHH/Time_icon.jsx";
import SVGTimeE1 from "../../shared/icons/gestaoHH/TimeE1_icon.jsx";
import SVGTimeE2 from "../../shared/icons/gestaoHH/TimeE2.jsx";

export const GestaoHH = ({ windowHeight, toastMessage }) => {
  const works = useSelector((state) => state.works);
  const [workData, setWorkData] = useState();
  const [activities, setActivities] = useState([]);

  const [totalNormal, setTotalNormal] = useState(0);
  const [totalExtra1, setTotalExtra1] = useState(0);
  const [totalExtra2, setTotalExtra2] = useState(0);

  const [recordDate, setRecordDate] = useState([]);
  const [importedData, setImportedData] = useState({});

  const [filterType, setFilterType] = useState(0);
  const [selectedComparison, setSelectedComparison] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedWork, setSelectedWork] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedSubactivity, setSelectedSubactivity] = useState("");

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
    }
  }, [
    workData,
    selectedStartDate,
    selectedEndDate,
    selectedYear,
    selectedComparison,
    selectedArea,
    selectedActivity,
    selectedSubactivity,
  ]);

  useEffect(() => {
    if (workData) {
      organizeValues(workData);
    }
  }, [selectedStartDate, selectedEndDate, selectedYear]);

  useEffect(() => {
    async function getWork() {
      try {
        const { data } = await innovaApi.get(
          `/hhcontroll/get-statistics/${selectedWork}`
        );

        setWorkData(data.hhRecords);
        organizeDate(data.hhRecords);
        organizeValues(data.hhRecords);
        organizeActivities(data.hhRecords);
        toastMessage({
          danger: false,
          title: "Sucesso",
          message: data.message,
        });
      } catch (e) {
        toastMessage({
          danger: true,
          title: "Erro",
          message: e.message,
        });
      }
    }

    if (selectedWork) {
      getWork();
    }
  }, [selectedWork]);

  const handleSelectWork = (work) => {
    setSelectedStartDate("");
    setSelectedEndDate("");
    setSelectedYear("");
    setSelectedArea("");
    setSelectedActivity("");
    setSelectedSubactivity("");
    setTotalNormal(0);
    setTotalExtra1(0);
    setTotalExtra2(0);
    setRecordDate([]);
    setActivities([]);
    setSelectedWork(work);
    setWorkData();
    setImportedData({});
  };

  const handleSelectType = (type) => {
    if (selectedWork) {
      if (selectedComparison === type) {
        setSelectedComparison(0);
      } else {
        setSelectedComparison(type);
      }
      organizeGraph(workData);
    }
  };

  const handleSelectDate = (mes) => {
    if (selectedStartDate === undefined) {
      setSelectedStartDate(mes);
    } else if (selectedEndDate === undefined) {
      if (mes > selectedStartDate) {
        setSelectedEndDate(mes);
      } else if (mes <= selectedStartDate) {
        setSelectedStartDate(mes);
      }
    } else {
      if (mes === selectedStartDate) {
        setSelectedStartDate(undefined);
        setSelectedEndDate(undefined);
      } else if (mes === selectedEndDate) {
        setSelectedStartDate(undefined);
        setSelectedEndDate(undefined);
      } else {
        setSelectedStartDate(mes);
        setSelectedEndDate(undefined);
      }
    }
  };

  function organizeGraph(response) {
    function activityFilter(area, activity, subactivity) {
      if (
        selectedSubactivity &&
        (area !== selectedArea ||
          activity !== selectedActivity ||
          subactivity !== selectedSubactivity)
      )
        return true;
      if (
        selectedActivity &&
        (area !== selectedArea || activity !== selectedActivity)
      )
        return true;
      if (selectedArea && area !== selectedArea) return true;

      return false;
    }

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

      if (selectedYear && year !== selectedYear) return;
      if (selectedStartDate) {
        const selectedMonth = recordDate.find(
          (date) => date.ano === selectedStartDate.slice(0, 4)
        ).meses[selectedStartDate.slice(5, 7)];

        if (year < selectedStartDate.slice(0, 4)) return;

        if (
          year === selectedStartDate.slice(0, 4) &&
          monthNumber < meses.indexOf(selectedMonth) + 1
        )
          return;
      }
      if (selectedEndDate) {
        const selectedMonth = recordDate.find(
          (date) => date.ano === selectedEndDate.slice(0, 4)
        ).meses[selectedEndDate.slice(5, 7)];

        if (year > selectedEndDate.slice(0, 4)) return;
        if (
          year === selectedEndDate.slice(0, 4) &&
          monthNumber > meses.indexOf(selectedMonth) + 1
        )
          return;
      }

      const uniqueIndex = selectedYear ? fullMonth : `${month}-${year}`;

      let labelIndex = labels.indexOf(uniqueIndex);

      if (labelIndex !== -1) {
        if (dayOfWeek === 5 || dayOfWeek === 6) {
          hhRecord.hhRecords.forEach((hhRecord) => {
            if (
              activityFilter(
                hhRecord.area,
                hhRecord.activity,
                hhRecord.subactivity
              )
            )
              return;
            hhRecord.roles.forEach((role) => {
              if (selectedComparison === 3 || selectedComparison === 0)
                data[labelIndex] += role.quantity * role.hours;
            });
          });
        } else {
          hhRecord.hhRecords.forEach((hhRecord) => {
            if (
              activityFilter(
                hhRecord.area,
                hhRecord.activity,
                hhRecord.subactivity
              )
            )
              return;
            hhRecord.roles.forEach((role) => {
              if (role.hours <= 9) {
                if (selectedComparison === 1 || selectedComparison === 0)
                  data[labelIndex] += role.quantity * role.hours;
              } else if (role.hours <= 11) {
                if (selectedComparison === 1 || selectedComparison === 0)
                  data[labelIndex] += role.quantity * 9;
                if (selectedComparison === 2 || selectedComparison === 0)
                  data[labelIndex] += role.quantity * (role.hours - 9);
              } else {
                if (selectedComparison === 1 || selectedComparison === 0)
                  data[labelIndex] += role.quantity * 9;
                if (selectedComparison === 2 || selectedComparison === 0)
                  data[labelIndex] += role.quantity * 2;
                if (selectedComparison === 3 || selectedComparison === 0)
                  data[labelIndex] += role.quantity * (role.hours - 11);
              }
            });
          });
        }
      } else {
        labels.push(uniqueIndex);
        let totalHours = 0;

        if (dayOfWeek === 5 || dayOfWeek === 6) {
          hhRecord.hhRecords.forEach((hhRecord) => {
            if (
              activityFilter(
                hhRecord.area,
                hhRecord.activity,
                hhRecord.subactivity
              )
            )
              return;
            hhRecord.roles.forEach((role) => {
              if (selectedComparison === 3 || selectedComparison === 0)
                totalHours += role.quantity * role.hours;
            });
          });
        } else {
          hhRecord.hhRecords.forEach((hhRecord) => {
            if (
              activityFilter(
                hhRecord.area,
                hhRecord.activity,
                hhRecord.subactivity
              )
            )
              return;
            hhRecord.roles.forEach((role) => {
              if (role.hours <= 9) {
                if (selectedComparison === 1 || selectedComparison === 0)
                  totalHours += role.quantity * role.hours;
              } else if (role.hours <= 11) {
                if (selectedComparison === 1 || selectedComparison === 0)
                  totalHours += role.quantity * 9;
                if (selectedComparison === 2 || selectedComparison === 0)
                  totalHours += role.quantity * (role.hours - 9);
              } else {
                if (selectedComparison === 1 || selectedComparison === 0)
                  totalHours += role.quantity * 9;
                if (selectedComparison === 2 || selectedComparison === 0)
                  totalHours += role.quantity * 2;
                if (selectedComparison === 3 || selectedComparison === 0)
                  totalHours += role.quantity * (role.hours - 11);
              }
            });
          });
        }

        data.push(totalHours);
      }
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

  function organizeValues(data) {
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

      if (selectedYear && year !== selectedYear) return;
      if (selectedStartDate) {
        const selectedMonth = recordDate.find(
          (date) => date.ano === selectedStartDate.slice(0, 4)
        ).meses[selectedStartDate.slice(5, 7)];

        if (year < selectedStartDate.slice(0, 4)) return;

        if (
          year === selectedStartDate.slice(0, 4) &&
          monthNumber < meses.indexOf(selectedMonth) + 1
        )
          return;
      }
      if (selectedEndDate) {
        const selectedMonth = recordDate.find(
          (date) => date.ano === selectedEndDate.slice(0, 4)
        ).meses[selectedEndDate.slice(5, 7)];

        if (year > selectedEndDate.slice(0, 4)) return;
        if (
          year === selectedEndDate.slice(0, 4) &&
          monthNumber > meses.indexOf(selectedMonth) + 1
        )
          return;
      }

      if (dayOfWeek === 5 || dayOfWeek === 6) {
        hhRecord.hhRecords.forEach((hhRecord) => {
          hhRecord.roles.forEach((role) => {
            totalHHExtra2 += role.quantity * role.hours;
          });
        });
      } else {
        hhRecord.hhRecords.forEach((hhRecord) => {
          hhRecord.roles.forEach((role) => {
            if (role.hours <= 9) {
              totalHHNormal += role.quantity * role.hours;
            } else if (role.hours <= 11) {
              totalHHNormal += role.quantity * 9;
              totalHHExtra1 += role.quantity * (role.hours - 9);
            } else {
              totalHHNormal += role.quantity * 9;
              totalHHExtra1 += role.quantity * 2;
              totalHHExtra2 += role.quantity * (role.hours - 11);
            }
          });
        });
      }
    });

    setTotalNormal(totalHHNormal);
    setTotalExtra1(totalHHExtra1);
    setTotalExtra2(totalHHExtra2);
  }

  function organizeActivities(data) {
    let newActivities = [];

    data.forEach((hhRecord) => {
      hhRecord.hhRecords.forEach((record) => {
        let newActivity = true;

        const area = record.area;
        const activity = record.activity;
        const subactivity = record.subactivity;

        let areaRecord = newActivities.find(
          (activity) => activity.area == area
        );

        if (areaRecord) {
          areaRecord.activities.forEach((currentActivity) => {
            if (currentActivity.activity == activity) {
              newActivity = false;
              if (!currentActivity.subactivities.includes(subactivity))
                currentActivity.subactivities.push(subactivity);
            }
          });

          if (newActivity)
            areaRecord.activities.push({
              activity,
              subactivities: [subactivity],
            });
        } else {
          newActivities.push({
            area,
            activities: [
              {
                activity,
                subactivities: [subactivity],
              },
            ],
          });
        }
      });
    });

    setActivities(newActivities);
  }

  function organizeDate(data) {
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

    if (newRecordDate.length === 1) setSelectedYear(newRecordDate[0].ano);

    setRecordDate(newRecordDate);
  }

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
                    onClick={() => setSelectedYear("")}
                    $selected={selectedYear === ""}
                  ></styled.year>
                  {recordDate &&
                    recordDate.map((date) => (
                      <styled.year
                        key={date.ano}
                        disabled={recordDate.length === 1}
                        onClick={() => setSelectedYear(date.ano)}
                        $selected={selectedYear === date.ano}
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
                    value={selectedArea}
                    onChange={(e) => {
                      setSelectedArea(e.target.value);
                      setSelectedActivity("");
                      setSelectedSubactivity("");
                    }}
                  >
                    <option value="">Selecionar Área</option>
                    {activities.map((activity) => (
                      <option key={activity.area} value={activity.area}>
                        {activity.area}
                      </option>
                    ))}
                  </styled.workSelect>
                  {selectedArea && (
                    <styled.workSelect
                      name="atividade"
                      value={selectedActivity}
                      onChange={(e) => {
                        setSelectedActivity(e.target.value);
                        setSelectedSubactivity("");
                      }}
                    >
                      <option value="">Selecionar Atividade</option>
                      {activities.map((activity) => {
                        if (activity.area === selectedArea) {
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
                  {selectedArea && selectedActivity && (
                    <styled.workSelect
                      name="subatividade"
                      value={selectedSubactivity}
                      onChange={(e) => setSelectedSubactivity(e.target.value)}
                    >
                      <option value="">Selecionar Subatividade</option>
                      {activities.map((activity) => {
                        if (activity.area === selectedArea) {
                          return activity.activities.map((activity) => {
                            if (activity.activity === selectedActivity) {
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
                <styled.filterRole>Selecionar Funções</styled.filterRole>
              )}
              <styled.filter
                onClick={() =>
                  setFilterType((prev) => {
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
              <styled.eraseFilter onClick={() => handleSelectWork("")}>
                <SVGEraseFilter />
              </styled.eraseFilter>
            </styled.controllContainer>
          </styled.titleContainer>
        </styled.greenBackground>
        <styled.dashboardContainer>
          <styled.sideGrapchContainer></styled.sideGrapchContainer>
          <styled.summaryContainer
            $selected={selectedComparison === 1}
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
            $selected={selectedComparison === 2}
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
            $selected={selectedComparison === 3}
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
            {importedData?.labels ? (
              <BarGraph importedData={importedData} />
            ) : (
              "Usina não selecionada"
            )}
          </styled.bigGraphContainer>
          <styled.smallGraphContainer>
            {importedData?.labels ? (
              <PieGraph importedData={importedData} />
            ) : (
              "Usina não selecionada"
            )}
          </styled.smallGraphContainer>
          <styled.bigGraphContainer>
            {importedData?.labels ? (
              <LineGraph importedData={importedData} />
            ) : (
              "Usina não selecionada"
            )}
          </styled.bigGraphContainer>
          <styled.smallGraphContainer>
            {importedData?.labels ? (
              <PieGraph importedData={importedData} />
            ) : (
              "Usina não selecionada"
            )}
          </styled.smallGraphContainer>
          <styled.monthSelectorContainer>
            {recordDate.map((date, dateIndex) => {
              if (date.ano === selectedYear || selectedYear === "") {
                return date.meses.map((mes, monthIndex) => {
                  const uniqueIndex = `${date.ano}-${monthIndex}`;
                  return (
                    <Fragment key={`month-select-${uniqueIndex}`}>
                      <styled.monthSelect
                        key={`month-select-${uniqueIndex}`}
                        $selected={
                          selectedStartDate === uniqueIndex ||
                          selectedEndDate === uniqueIndex
                        }
                        $between={
                          uniqueIndex > selectedStartDate &&
                          uniqueIndex < selectedEndDate
                        }
                        onClick={() => handleSelectDate(uniqueIndex)}
                      >
                        {selectedYear ? mes : mes.slice(0, 3)}
                      </styled.monthSelect>

                      {(monthIndex + 1 !== date.meses.length ||
                        (dateIndex + 1 !== recordDate.length &&
                          !selectedYear)) && (
                        <styled.monthLine
                          key={`monthLine-${uniqueIndex}`}
                          $between={
                            (uniqueIndex > selectedStartDate &&
                              uniqueIndex < selectedEndDate) ||
                            (selectedStartDate === uniqueIndex &&
                              selectedEndDate)
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
