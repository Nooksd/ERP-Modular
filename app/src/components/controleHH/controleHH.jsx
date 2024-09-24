// Página de envio e edicao de HH

// -imports Ract, Redux- >
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { innovaApi } from "../../services/http.js";
import { fetchUserWorks } from "../../store/slicers/worksSlicer";
import { fetchActivities } from "../../store/slicers/activitySlicer.js";
import { fetchFieldRoles } from "../../store/slicers/fieldRoleSlicer.js";

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

export const ControleHH = ({ toastMessage, windowHeight }) => {
  // -Declaracoes da página- >
  const works = useSelector((state) => state.works);
  const activities = useSelector((state) => state.activity);
  const fieldRoles = useSelector((state) => state.fieldRoles);
  const dispatch = useDispatch();
  const location = useLocation();
  const date = new Date();

  const recordData = location.state || {};
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [selectedWork, setSelectedWork] = useState("");
  const [workError, setWorkError] = useState(false);
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
    error: false,
    role: "",
    quantity: "",
    hours: "",
  };

  const emptyActivity = {
    open: false,
    error: false,
    area: "",
    activity: "",
    subactivity: "",
    workDescription: "",
    indicative: "",
    roles: [{ ...emptyRole }],
  };

  const [openCalendar, setOpenCalendar] = useState(false);
  const [hhRecords, setHHRecords] = useState([{ ...emptyActivity }]);

  const activitiesEndRef = useRef(null);

  // -Whachers de mudancas useEffect- >
  useEffect(() => {
    if (recordData.projectId && recordData.recordId && recordData.date) {
      setIsNewRecord(false);
      setSelectedWork(recordData.projectId);
      setSelectedDay(recordData.date);
      handleGetHHRecord(recordData.recordId);
    }
  }, [recordData]);

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
    if (works.status == "succeeded" && fieldRoles.status !== "succeeded") {
      dispatch(fetchFieldRoles());
    }
  }, [dispatch, works.status]);

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
        (role) => role.hours !== "" && !isNaN(parseFloat(role.hours))
      );
      return (
        total +
        validRoles.reduce((roleTotal, role) => {
          const hours = parseFloat(role.hours);
          const quantity = parseInt(role.quantity, 10);

          const totalRoleHours = hours * (isNaN(quantity) ? 0 : quantity);

          return roleTotal + totalRoleHours;
        }, 0)
      );
    }, 0);

    const totalRoles = hhRecords.reduce((total, activity) => {
      const validRolesSum = activity.roles.reduce((sum, role) => {
        const quantity = parseInt(role.quantity);
        return sum + (isNaN(quantity) ? 0 : quantity);
      }, 0);
      return total + validRolesSum;
    }, 0);

    const totalActivities = hhRecords.filter(
      (activity) =>
        activity.area.trim() !== "" &&
        activity.activity.trim() !== "" &&
        activity.subactivity.trim() !== "" &&
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
  const handleGetHHRecord = async (recordId) => {
    const isValid = validateWork();
    if (isValid || recordId) {
      try {
        let response;
        if (!recordId) {
          response = await innovaApi.get(
            `hhcontroll/get-last-record/${selectedWork}`
          );
        } else {
          setWorkError(false);
          response = await innovaApi.get(`hhcontroll/get-record/${recordId}`);
        }

        const { data } = response;

        console.log(data);

        setHHRecords(data.hhRecord.hhRecords);
        toastMessage({
          danger: false,
          title: "Sucesso",
          message: data.message,
        });
      } catch (e) {
        console.log(e);
        toastMessage({
          danger: true,
          title: "Error",
          message: "Erro ao buscar registro",
        });
      }
    }
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
          error: false,
          activity: "",
          subactivity: "",
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
          error: false,
          subactivity: "",
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleSelectSubactivity = (index, value) => {
    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          error: false,
          subactivity: value,
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleInputComment = (index, value) => {
    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          error: false,
          workDescription: value,
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };
  const handleInputIndicative = (index, value) => {
    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          error: false,
          indicative: value,
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleSelectRole = (index, roleIndex, value) => {
    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          error: false,
          roles: activity.roles.map((role, j) => {
            if (j === roleIndex) {
              return { ...role, role: value, error: false };
            }
            return role;
          }),
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleInputQuantity = (index, roleIndex, value) => {
    let quantity = parseInt(value.replace(/[^0-9]/g, ""), 10);

    if (isNaN(quantity) || quantity < 0) quantity = "";
    if (quantity > 100) quantity = 100;

    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          error: false,
          roles: activity.roles.map((role, j) => {
            if (j === roleIndex) {
              return {
                ...role,
                error: false,
                quantity: quantity,
              };
            }
            return role;
          }),
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleInputHours = (index, roleIndex, value) => {
    let hours = parseInt(value.replace(/[^0-9]/g, ""), 10);

    if (isNaN(hours) || hours < 0) hours = "";
    if (hours > 24) hours = 24;

    const newHHRecords = hhRecords.map((activity, i) => {
      if (i === index) {
        return {
          ...activity,
          error: false,
          roles: activity.roles.map((role, j) => {
            if (j === roleIndex) {
              return {
                ...role,
                error: false,
                hours: hours,
              };
            }
            return role;
          }),
        };
      } else {
        return activity;
      }
    });

    setHHRecords(newHHRecords);
  };

  const handleSendHHRecord = async () => {
    const isValid = validateHHRecord();

    if (isValid || recordData.recordId) {
      try {
        const dataBody = {
          projectId: selectedWork,
          date: `${placeAndDate.year}-${placeAndDate.month}-${placeAndDate.day}`,
          hhRecords: removeErrorAndOpen(hhRecords),
        };
        if (recordData.recordId) {
          await innovaApi.put(
            `/hhcontroll/update-record/${recordData.recordId}`,
            {
              hhRecords: removeErrorAndOpen(hhRecords),
            }
          );
          toastMessage({
            danger: false,
            title: "Sucesso",
            message: "Registro de horas atualizado com sucesso",
          });
        } else {
          await innovaApi.post("/hhcontroll/sendHH", dataBody);
          toastMessage({
            danger: false,
            title: "Sucesso",
            message: "Registro de horas feito com sucesso",
          });
        }
      } catch (e) {
        if (e.response.status === 409) {
          toastMessage({
            danger: true,
            title: "Error",
            message: "Atividade já registrada",
          });
        } else if (e.response.status === 500) {
          toastMessage({
            danger: true,
            title: "Error",
            message: "Ocorreu um erro interno no servidor.",
          });
        } else {
          toastMessage({
            danger: true,
            title: "Error",
            message: "Ocorreu um erro ao enviar o registro de horas.",
          });
        }
      }
    }
  };

  // -Funções de uso interno- >
  function validateWork() {
    let isValid = true;

    if (selectedWork === "") {
      isValid = false;
      setWorkError(true);
    }

    return isValid;
  }
  function validateHHRecord() {
    let isValid = true;

    const newHHRecords = hhRecords.map((activity) => {
      let hasError = false;
      let hasRoleError = false;

      if (
        activity.area.trim() === "" ||
        activity.activity.trim() === "" ||
        activity.subactivity.trim() === "" ||
        activity.workDescription.trim() === "" ||
        activity.roles.length === 0
      ) {
        hasError = true;
        isValid = false;
      }

      const newRoles = activity.roles.map((role) => {
        const roleHasError =
          role.role.trim() === "" || role.quantity === "" || role.hours === "";

        if (roleHasError) {
          hasRoleError = true;
          isValid = false;
        }

        return {
          ...role,
          error: roleHasError,
        };
      });

      return {
        ...activity,
        open: hasRoleError ? true : activity.open,
        roles: newRoles,
        error: hasError,
      };
    });

    if (selectedWork === "") {
      isValid = false;
      setWorkError(true);
    }

    setHHRecords(newHHRecords);
    return isValid;
  }

  function removeErrorAndOpen(hhRecords) {
    return hhRecords.map((activity) => {
      const { error, open, ...cleanActivity } = activity;

      const cleanRoles = cleanActivity.roles.map(
        ({ error, ...cleanRole }) => cleanRole
      );

      return {
        ...cleanActivity,
        roles: cleanRoles,
      };
    });
  }

  // -Dinamic page Content Renders- >
  const renderWorks = () => {
    if (works.status === "loading") {
      return (
        <ul>
          <styled.work style={{ marginBottom: "30px" }}>
            <Loading />
          </styled.work>
          <styled.work style={{ marginBottom: "30px" }}>
            <Loading />
          </styled.work>
          <styled.work style={{ marginBottom: "30px" }}>
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
              onClick={() => {
                if (!recordData.projectId) {
                  setSelectedWork(work._id);
                  setWorkError(false);
                }
              }}
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
                <styled.activityInputDiv
                  style={{ marginLeft: 20 }}
                  $error={hhRecords[index].error}
                >
                  <styled.ActivitySelect
                    value={activity.area}
                    name="area"
                    onChange={(e) => handleSelectArea(index, e.target.value)}
                  >
                    <option value="">Selecionar Área</option>
                    {activities &&
                      activities.activities.map((activity) => (
                        <option key={activity._id} value={activity.area}>
                          {activity.area}
                        </option>
                      ))}
                  </styled.ActivitySelect>
                  <styled.ActivitySelect
                    value={activity.activity}
                    name="activity"
                    onChange={(e) =>
                      handleSelectActivity(index, e.target.value)
                    }
                  >
                    <option value="">Selecionar Atividade</option>
                    {hhRecords[index].area &&
                      activities.activities.map((area) => {
                        if (area.area === hhRecords[index].area) {
                          return area.activities.map((activity) => (
                            <option
                              key={activity._id}
                              value={activity.activity}
                            >
                              {activity.activity}
                            </option>
                          ));
                        }
                      })}
                  </styled.ActivitySelect>
                  <styled.ActivitySelect
                    value={activity.subactivity}
                    name="subactivity"
                    onChange={(e) =>
                      handleSelectSubactivity(index, e.target.value)
                    }
                  >
                    <option value="">Selecionar Subatividade</option>
                    {hhRecords[index].area &&
                      activities.activities.map((area) => {
                        if (area.area === hhRecords[index].area) {
                          return area.activities.map((activity) => {
                            if (
                              activity.activity === hhRecords[index].activity
                            ) {
                              return activity.subactivities.map(
                                (subactivity) => (
                                  <option
                                    key={subactivity._id}
                                    value={subactivity.subactivity}
                                  >
                                    {subactivity.subactivity}
                                  </option>
                                )
                              );
                            }
                          });
                        }
                      })}
                  </styled.ActivitySelect>
                  <styled.ActivityCommentInput
                    type="text"
                    name="comment"
                    value={hhRecords[index].workDescription}
                    placeholder="Escrever Comentário"
                    onChange={(e) => handleInputComment(index, e.target.value)}
                  />
                  {hhRecords[index].area &&
                    activities.activities.map((area) => {
                      if (area.area === hhRecords[index].area) {
                        return area.activities.map((activity) => {
                          if (activity.activity === hhRecords[index].activity) {
                            return activity.subactivities.map((subactivity) => {
                              if (
                                subactivity.subactivity ===
                                  hhRecords[index].subactivity &&
                                subactivity.haveIndicative
                              ) {
                                return (
                                  <styled.ActivityIndicativeInput
                                    style={{ borderRight: 0 }}
                                    key={subactivity._id}
                                    type="number"
                                    value={hhRecords[index].indicative}
                                    name="indicative"
                                    placeholder="Num"
                                    onChange={(e) =>
                                      handleInputIndicative(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (["e", "E", "+", "-"].includes(e.key))
                                        e.preventDefault();
                                    }}
                                  />
                                );
                              }
                            });
                          }
                        });
                      }
                    })}

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
                      <styled.activityInputDiv
                        style={{ padding: "0 100px" }}
                        $error={hhRecords[index].roles[roleIndex].error}
                      >
                        <styled.ActivitySelect
                          value={role.role}
                          name="'role"
                          onChange={(e) =>
                            handleSelectRole(index, roleIndex, e.target.value)
                          }
                        >
                          <option value="">Selecionar Função</option>
                          {fieldRoles &&
                            fieldRoles.roles.map((role) => (
                              <option key={role._id} value={role.role}>
                                {role.role}
                              </option>
                            ))}
                        </styled.ActivitySelect>
                        <styled.ActivityIndicativeInput
                          style={{ width: "200px", borderRight: 0 }}
                          type="number"
                          name="quantity"
                          max="100"
                          value={role.quantity}
                          placeholder="Escrever quantidade"
                          onChange={(e) =>
                            handleInputQuantity(
                              index,
                              roleIndex,
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key))
                              e.preventDefault();
                          }}
                        />
                        <styled.ActivityIndicativeInput
                          style={{ width: "200px" }}
                          type="number"
                          name="hours"
                          max="24"
                          value={role.hours}
                          placeholder="Escrever horas"
                          onChange={(e) =>
                            handleInputHours(index, roleIndex, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key))
                              e.preventDefault();
                          }}
                        />
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
    <styled.controllContainer $windowHeight={windowHeight}>
      <styled.contentDiv $error={workError} style={{ maxWidth: "300px" }}>
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
            <SVGCalendar
              onClick={() =>
                !recordData.projectId ? setOpenCalendar((prev) => !prev) : null
              }
            />
          </styled.calendarContainerWrapper>
          <styled.placeAndDateDiv>
            <styled.createOrEditButton
              $isNewRecord={isNewRecord}
              onClick={() =>
                !recordData.projectId ? setIsNewRecord((prev) => !prev) : null
              }
            >
              <span>Registrar</span>
              <span>Editar</span>
            </styled.createOrEditButton>
          </styled.placeAndDateDiv>
          <styled.getLastHHRecordButton
            onClick={() => (!recordData.projectId ? handleGetHHRecord() : null)}
          >
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
          <styled.placeAndDateDiv style={{ left: 100 }}>
            {`${placeAndDate.place}, ${placeAndDate.day}-${placeAndDate.month}-${placeAndDate.year}`}
          </styled.placeAndDateDiv>
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
