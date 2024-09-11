// Página de envio e edicao de HH

// -imports Ract, Redux- >
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWorks } from "../../store/slicers/worksSlicer";
import { fetchActivities } from "../../store/slicers/activitySlicer.js";

// -imports Componentes- >
import Calendar from "../../shared/includes/calendar/calendar.jsx";
import { Loading } from "../../styles/global.js";

// -imports Styles- >
import * as styled from "./controleHHStyles.js";

// -imports SVGs- >
import SVGCalendar from "../../shared/icons/controleHH/calendar_icon.jsx";
import SVGDelete from "../../shared/icons/controleHH/Delete_icon.jsx";
import SVGConnector from "../../shared/icons/controleHH/conector_svg.jsx";
import SVGReload from "../../shared/icons/controleHH/Reload_icon.jsx";

// -Date Normalizer- >
const formatKey = (day, month, year) => {
  return `${String(day).padStart(2, "0")}${String(month + 1).padStart(
    2,
    "0"
  )}${year}`;
};

export const ControleHH = () => {
  // -Declaracoes da página- >
  const works = useSelector((state) => state.works);
  const activities = useSelector((state) => state.activity);
  const dispatch = useDispatch();
  const date = new Date();

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [selectedWork, setSelectedWork] = useState("");
  const [selectedDay, setSelectedDay] = useState(
    formatKey(date.getDate(), date.getMonth(), date.getFullYear())
  );
  const [placeAndDate, setPlaceAndDate] = useState({
    place: "Não Selecionado",
    day: "",
    month: "",
    year: "",
  });
  const [totalSummary, setTotalSummary] = useState({
    totalHours: 0,
    totalRoles: 0,
    totalActivities: 0,
  });

  const emptyRole = {
    role: "",
    quantity: "",
    hours: "",
  };

  const emptyActivity = {
    open: false,
    area: "",
    activity: "",
    subActivity: "",
    workDescription: "",
    roles: [{ ...emptyRole }],
  };

  const [openCalendar, setOpenCalendar] = useState(false);
  const [hhRecords, setHHRecords] = useState([{ ...emptyActivity }]);

  const activitiesEndRef = useRef(null);

  // -Whachers de mudancas useEffect- >
  useEffect(() => {
    if (!works || works.status !== "succeeded") {
      dispatch(fetchUserWorks());
    }
  }, [dispatch]);

  useEffect(() => {
    if (works.status == "succeeded" && activities.status !== "succeeded") {
      dispatch(fetchActivities());
    }
  }, [dispatch, works.status]);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (works.works.userWorks) {
      const foundWork = works.works.userWorks.find(
        (work) => work._id === selectedWork
      );

      if (foundWork) {
        setPlaceAndDate((prev) => ({
          ...prev,
          place: foundWork.name,
        }));
      }
    }
  }, [selectedWork]);

  useEffect(() => {
    const day = selectedDay.slice(0, 2);
    const month = selectedDay.slice(2, 4);
    const year = selectedDay.slice(4, 8);

    setPlaceAndDate((prev) => ({
      ...prev,
      day,
      month,
      year,
    }));
  }, [selectedDay]);

  useEffect(() => {
    const totalHours = hhRecords.reduce((total, activity) => {
      const validRoles = activity.roles.filter(
        (role) => role.hours.trim() !== "" && !isNaN(parseFloat(role.hours))
      );
      return (
        total +
        validRoles.reduce((roleTotal, role) => {
          return roleTotal + parseFloat(role.hours);
        }, 0)
      );
    }, 0);

    const totalRoles = hhRecords.reduce((total, activity) => {
      const validRolesSum = activity.roles.reduce((sum, role) => {
        const quantity = parseFloat(role.quantity.trim());
        return sum + (isNaN(quantity) ? 0 : quantity);
      }, 0);
      return total + validRolesSum;
    }, 0);

    const totalActivities = hhRecords.filter(
      (activity) =>
        activity.area.trim() !== "" &&
        activity.activity.trim() !== "" &&
        activity.subActivity.trim() !== "" &&
        activity.workDescription.trim() !== ""
    ).length;

    setTotalSummary((prev) => ({
      ...prev,
      totalHours,
      totalRoles,
      totalActivities,
    }));
  }, [hhRecords]);

  // -Onclick React Handlers- >
  const handleGetLastHHRecord = async () => {
    alert("Getting last HH Record");
  };

  const handleAddActivity = () => {
    setHHRecords((prev) => [...prev, { ...emptyActivity }]);

    setTimeout(() => {
      activitiesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleDeleteActivity = (index) => {
    setHHRecords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRole = (index) => {
    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          roles: [...activity.roles, { ...emptyRole }],
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleDeleteRole = (index, roleIndex) => {
    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          roles: activity.roles.filter((_, j) => j !== roleIndex),
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleSelectArea = (index, value) => {
    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          area: value,
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleSelectActivity = (index, value) => {
    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          activity: value,
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleSendHHRecord = () => {
    alert("Sending HH Record");
  };

  // -Dinamic page Content Renders- >
  const renderWorks = () => {
    if (works.status === "loading") {
      return (
        <ul>
          <styled.work>
            <Loading />
          </styled.work>
          <styled.work>
            <Loading />
          </styled.work>
          <styled.work>
            <Loading />
          </styled.work>
        </ul>
      );
    } else if (works.status === "succeeded") {
      return (
        <ul>
          {works.works.userWorks.map((work) => (
            <styled.work
              key={work._id}
              $isSelected={selectedWork === work._id}
              onClick={() => setSelectedWork(work._id)}
            >
              {work.name}
            </styled.work>
          ))}
        </ul>
      );
    }
    return [];
  };

  const renderActivities = () => {
    return (
      hhRecords.length > 0 && (
        <>
          {hhRecords.map((activity, index) => (
            <styled.activityDiv key={index}>
              <styled.visibleActivityDiv>
                <styled.openActivityButton
                  onClick={() =>
                    setHHRecords((prev) =>
                      prev.map((a, i) =>
                        i === index ? { ...a, open: !a.open } : a
                      )
                    )
                  }
                >
                  {hhRecords[index].open ? "-" : "+"}
                </styled.openActivityButton>
                <styled.activityInputDiv style={{ marginLeft: 20 }}>
                  <styled.ActivitySelect
                    onChange={(e) => handleSelectArea(index, e.target.value)}
                  >
                    <option value="">Área</option>
                    {activities &&
                      activities.activities.map((activity) => (
                        <option key={activity._id} value={activity._id}>
                          {activity.area}
                        </option>
                      ))}
                  </styled.ActivitySelect>
                  <styled.ActivitySelect
                    onChange={(e) =>
                      handleSelectActivity(index, e.target.value)
                    }
                  >
                    <option value="">Atividades</option>
                    {hhRecords[index].area &&
                      activities.activities.map((area) => {
                        if (area._id === hhRecords[index].area) {
                          return area.activities.map((activity) => (
                            <option key={activity._id} value={activity._id}>
                              {activity.activity}
                            </option>
                          ));
                        }
                      })}
                  </styled.ActivitySelect>
                  <styled.ActivitySelect>
                    <option value="">Subatividades</option>
                    {hhRecords[index].area &&
                      activities.activities.map((area) => {
                        if (area._id === hhRecords[index].area) {
                          return area.activities.map((activity) => {
                            console.log(activity);
                            if (activity._id === hhRecords[index].activity) {
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
                  </styled.ActivitySelect>
                  <styled.deleteButton
                    onClick={() => handleDeleteActivity(index)}
                  >
                    <SVGDelete />
                  </styled.deleteButton>
                </styled.activityInputDiv>
              </styled.visibleActivityDiv>
              {activity.open && (
                <styled.hiddenActivityDiv>
                  {hhRecords[index].roles.map((role, roleIndex) => (
                    <styled.visibleActivityDiv key={roleIndex}>
                      <SVGConnector cap={roleIndex === 0 ? 15 : 0} />
                      <styled.activityInputDiv>
                        <styled.deleteButton
                          onClick={() => handleDeleteRole(index, roleIndex)}
                        >
                          <SVGDelete />
                        </styled.deleteButton>
                      </styled.activityInputDiv>
                    </styled.visibleActivityDiv>
                  ))}
                  <styled.visibleActivityDiv>
                    <SVGConnector
                      cap={hhRecords[index].roles.length === 0 ? 15 : 0}
                    />
                    <styled.openActivityButton
                      onClick={() => handleAddRole(index)}
                    >
                      +
                    </styled.openActivityButton>
                  </styled.visibleActivityDiv>
                </styled.hiddenActivityDiv>
              )}
            </styled.activityDiv>
          ))}
        </>
      )
    );
  };

  // -Estrutura principal- >
  return (
    <styled.controllContainer>
      <styled.contentDiv>
        <styled.titleDiv>Usinas</styled.titleDiv>
        {renderWorks()}
        {works.status === "failed" && <p>Erro ao carregar as usinas.</p>}
      </styled.contentDiv>
      <styled.contentDiv>
        <styled.titleDiv
          style={{ justifyContent: "start", paddingLeft: "55px" }}
        >
          Controle diário da usina
          <styled.calendarContainerWrapper>
            {openCalendar && (
              <styled.calendarContainer>
                <Calendar
                  selectedDay={selectedDay}
                  onDaySelect={setSelectedDay}
                />
              </styled.calendarContainer>
            )}

            <SVGCalendar onClick={() => setOpenCalendar((prev) => !prev)} />
          </styled.calendarContainerWrapper>
          <styled.placeAndDateDiv>
            {`${placeAndDate.place}, ${placeAndDate.day}-${placeAndDate.month}-${placeAndDate.year}`}
          </styled.placeAndDateDiv>
          <styled.getLastHHRecordButton onClick={() => handleGetLastHHRecord()}>
            <SVGReload />
          </styled.getLastHHRecordButton>
        </styled.titleDiv>

        <styled.hhRecordDiv $windowHeight={windowHeight}>
          {renderActivities()}
          <styled.addOneMoreButton
            onClick={() => handleAddActivity()}
            ref={activitiesEndRef}
          >
            +
          </styled.addOneMoreButton>
        </styled.hhRecordDiv>
        <styled.finalCheckDiv>
          <styled.placeAndDateDiv>
            {`${totalSummary.totalActivities} ${
              totalSummary.totalActivities === 1 ? "Atividade" : "Atividades"
            }, ${totalSummary.totalRoles} ${
              totalSummary.totalRoles === 1 ? "Funcionário" : "Funcionários"
            }, ${totalSummary.totalHours} ${
              +totalSummary.totalHours === 1 ? "Hora" : "Horas"
            }`}
          </styled.placeAndDateDiv>
          <styled.addOneMoreButton
            style={{ fontSize: 16 }}
            onClick={() => handleSendHHRecord()}
          >
            Enviar
          </styled.addOneMoreButton>
        </styled.finalCheckDiv>
      </styled.contentDiv>
    </styled.controllContainer>
  );
};
