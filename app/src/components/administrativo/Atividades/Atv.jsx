import { useEffect, useState } from "react";
import { innovaApi } from "../../../services/http.js";

import * as styled from "./AtvStyles.js";

import SVGUpDown from "../../../shared/icons/historyHH/UpDownArrow_icon.jsx";
import SVGSearch from "../../../shared/icons/historyHH/Search_icon.jsx";
import SVGEdit from "../../../shared/icons/historyHH/Edit_icon.jsx";
import SVGDelete from "../../../shared/icons/controleHH/Delete_icon.jsx";

const Atividades = ({ toastMessage, modalMessage, modalInfo, openPage }) => {
  const [activities, setActivities] = useState([]);

  const [order, setOrder] = useState(true);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [whatDeleteArea, setWhatDeleteArea] = useState("");
  const [whatDeleteActivity, setWhatDeleteActivity] = useState("");
  const [whatDeleteSubactivity, setWhatDeleteSubactivity] = useState("");

  useEffect(() => {
    handleSearch();
  }, [page]);

  useEffect(() => {
    if (modalInfo.response !== null) {
      switch (modalInfo.event) {
        case "deleteArea":
          if (modalInfo.response) deleteArea();
          break;
        case "deleteActivity":
          if (modalInfo.response) deleteActivity();
          break;
        case "deleteSubactivity":
          if (modalInfo.response) deleteSubactivity();
          break;
      }
      modalMessage({
        title: "",
        message: "",
        response: null,
        event: null,
      });
    }
  }, [modalInfo.response]);

  const handleAddOne = () => {
    openPage("Adicionar Atividade", 2);
  };

  const handleSearch = async (click = false) => {
    try {
      const response = await innovaApi.get(
        `/activity/get-all?page=${page}&limit=${limit}&order=${order}&name=${search}`
      );

      setActivities(response.data.activities);
      setTotalPages(response.data.pagination.totalPages);
      if (click) {
        toastMessage({
          danger: false,
          title: "Sucesso",
          message: "Funcões encontradas com sucesso",
        });
      }
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Erro ao buscar as funções",
      });
    }
  };

  const handleDeleteButtonClick = async (
    areaId,
    activityId,
    subactivityId,
    activityName,
    type
  ) => {
    if (type === "area") {
      setWhatDeleteArea(areaId);

      modalMessage({
        response: null,
        event: "deleteArea",
        title: "Confirmação",
        message: `Deseja excluir a área ${activityName} (Ação Permanente)?`,
      });
    }
    if (type === "atividade") {
      setWhatDeleteArea(areaId);
      setWhatDeleteActivity(activityId);

      modalMessage({
        response: null,
        event: "deleteActivity",
        title: "Confirmação",
        message: `Deseja excluir a atividade ${activityName} (Ação Permanente)?`,
      });
    }
    if (type === "subatividade") {
      setWhatDeleteArea(areaId);
      setWhatDeleteActivity(activityId);
      setWhatDeleteSubactivity(subactivityId);

      modalMessage({
        response: null,
        event: "deleteSubactivity",
        title: "Confirmação",
        message: `Deseja excluir a subatividade ${activityName} (Ação Permanente)?`,
      });
    }
  };

  const handleEditButtonClick = (activityId) => {
    openPage("Editar Atividade", 2, activityId);
  };

  async function deleteArea() {
    try {
      await innovaApi.delete(`/activity/delete/${whatDeleteArea}`);

      toastMessage({
        danger: false,
        title: "Sucesso",
        message: "Área excluída com sucesso",
      });

      setWhatDeleteArea("");
      setActivities((prev) =>
        prev.filter((area) => area._id !== whatDeleteArea)
      );
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir a área",
      });
    }
  }

  async function deleteActivity() {
    try {
      const areaToUpdate = activities.find(
        (area) => area._id === whatDeleteArea
      );

      if (areaToUpdate) {
        const updatedActivities = areaToUpdate.activities.filter(
          (activity) => activity._id !== whatDeleteActivity
        );

        const newArea = {
          ...areaToUpdate,
          activities: updatedActivities,
          totalActivities: updatedActivities.length,
          totalSubactivities: updatedActivities.reduce(
            (count, act) => count + act.totalSubActivities,
            0
          ),
        };

        await innovaApi.put(`/activity/update/${whatDeleteArea}`, newArea);

        toastMessage({
          danger: false,
          title: "Sucesso",
          message: "Atividade excluída com sucesso",
        });
        setWhatDeleteArea("");
        setActivities((prev) =>
          prev.map((area) => (area._id === whatDeleteArea ? newArea : area))
        );
      }
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir a atividade",
      });
    }
  }

  async function deleteSubactivity() {
    try {
      const areaToUpdate = activities.find(
        (area) => area._id === whatDeleteArea
      );

      if (areaToUpdate) {
        const activityToUpdate = areaToUpdate.activities.find(
          (activity) => activity._id === whatDeleteActivity
        );

        if (activityToUpdate) {
          const updatedSubactivities = activityToUpdate.subactivities.filter(
            (subactivity) => subactivity._id !== whatDeleteSubactivity
          );

          const newActivity = {
            ...activityToUpdate,
            subactivities: updatedSubactivities,
            totalSubActivities: updatedSubactivities.length,
          };

          const newArea = {
            ...areaToUpdate,
            activities: areaToUpdate.activities.map((activity) =>
              activity._id === whatDeleteActivity ? newActivity : activity
            ),
            totalSubactivities: areaToUpdate.activities.reduce(
              (count, act) =>
                act._id === whatDeleteActivity
                  ? count + updatedSubactivities.length
                  : count + act.totalSubActivities,
              0
            ),
          };

          await innovaApi.put(`/activity/update/${whatDeleteArea}`, newArea);

          toastMessage({
            danger: false,
            title: "Sucesso",
            message: "Sub-Atividade excluída com sucesso",
          });

          setWhatDeleteArea("");
          setActivities((prev) =>
            prev.map((area) => (area._id === whatDeleteArea ? newArea : area))
          );
        }
      }
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir a sub-atividade",
      });
    }
  }

  const RenderResultsOnPege = () => {
    return activities.map((area, areaIndex) => {
      return (
        <styled.hiddenContentWrapper key={areaIndex}>
          <styled.UserDiv $isEven={(areaIndex + 1) % 2 === 0}>
            <styled.userIndexSpan>
              {`#${areaIndex + 1 + (page - 1) * limit}`}
            </styled.userIndexSpan>
            <styled.OpenButton
              onClick={() =>
                setActivities((prev) =>
                  prev.map((a, i) =>
                    i === areaIndex ? { ...a, open: !a.open } : a
                  )
                )
              }
            >
              {area.open ? "-" : "+"}
            </styled.OpenButton>
            <styled.userDataSpan>{area.area}</styled.userDataSpan>
            <styled.userDataSpan>{area.totalActivities}</styled.userDataSpan>
            <styled.userDataSpan>{area.totalSubactivities}</styled.userDataSpan>
            <styled.controllButtonsDiv>
              <styled.EditButton
                onClick={() => handleEditButtonClick(area._id, "area")}
              >
                <SVGEdit width="20" height="20" />
              </styled.EditButton>
              <styled.DeleteButton
                onClick={() =>
                  handleDeleteButtonClick(area._id, "", "", area.area, "area")
                }
              >
                <SVGDelete width="16" height="16" />
              </styled.DeleteButton>
            </styled.controllButtonsDiv>
          </styled.UserDiv>
          {area.open &&
            area.activities.map((activity, activityIndex) => (
              <styled.hiddenContentWrapper key={activityIndex}>
                <styled.UserDiv $isEven={(areaIndex + 1) % 2 === 0}>
                  <span></span>
                  <styled.OpenButton
                    onClick={() =>
                      setActivities((prev) =>
                        prev.map((a, i) => {
                          if (i === areaIndex) {
                            const updatedActivities = a.activities.map(
                              (act, j) =>
                                j === activityIndex
                                  ? { ...act, open: !act.open }
                                  : act
                            );
                            return { ...a, activities: updatedActivities };
                          }
                          return a;
                        })
                      )
                    }
                  >
                    {activity.open ? "-" : "+"}
                  </styled.OpenButton>
                  <span>{area.area}</span>
                  <span>{activity.activity}</span>
                  <span>{activity.totalSubActivities}</span>
                  <styled.controllButtonsDiv>
                    <styled.DeleteButton
                      onClick={() =>
                        handleDeleteButtonClick(
                          area._id,
                          activity._id,
                          "",
                          activity.activity,
                          "atividade"
                        )
                      }
                    >
                      <SVGDelete width="16" height="16" />
                    </styled.DeleteButton>
                  </styled.controllButtonsDiv>
                </styled.UserDiv>
                {activity.open &&
                  activity.subactivities.map((subactivity, subIndex) => (
                    <styled.UserDiv
                      key={subIndex}
                      $isEven={(areaIndex + 1) % 2 === 0}
                    >
                      <span></span>
                      <span></span>
                      <span>{area.area}</span>
                      <span>{activity.activity}</span>
                      <span>{subactivity.subactivity}</span>
                      <styled.controllButtonsDiv>
                        <styled.DeleteButton
                          onClick={() =>
                            handleDeleteButtonClick(
                              area._id,
                              activity._id,
                              subactivity._id,
                              subactivity.subactivity,
                              "subatividade"
                            )
                          }
                        >
                          <SVGDelete width="16" height="16" />
                        </styled.DeleteButton>
                      </styled.controllButtonsDiv>
                    </styled.UserDiv>
                  ))}
              </styled.hiddenContentWrapper>
            ))}
        </styled.hiddenContentWrapper>
      );
    });
  };

  return (
    <>
      <styled.headerUsersDiv>
        Controle de atividades de campo
      </styled.headerUsersDiv>
      <styled.filterOptionsDiv>
        <styled.addNewOneDiv>
          <styled.addNewOneButton onClick={() => handleAddOne()}>
            <span>+</span> Nova atividade
          </styled.addNewOneButton>
        </styled.addNewOneDiv>
        <styled.filterAndInfoDiv>
          <styled.filterPartDiv>
            <div>
              <styled.totalNumberSelect
                onChange={(e) => setLimit(e.target.value)}
              >
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </styled.totalNumberSelect>
              Quantidade por Página
            </div>
            <div>
              <styled.searchInput
                name="search"
                placeholder="Pesquisar por Nome"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                style={{ background: "none" }}
                onClick={() => setOrder((prev) => !prev)}
              >
                <SVGUpDown width="25" height="25" decrescent={order} />
              </button>
              <styled.searchButton onClick={() => handleSearch(true)}>
                <SVGSearch width="15" height="15" />
                Buscar
              </styled.searchButton>
            </div>
          </styled.filterPartDiv>
          <styled.infoPartDiv>
            <span>Index</span>
            <span>Expandir</span>
            <span>Área</span>
            <span>Atividades</span>
            <span>Subtividades</span>
            <span>Controles</span>
          </styled.infoPartDiv>
        </styled.filterAndInfoDiv>
      </styled.filterOptionsDiv>
      <styled.resultsDiv>
        {activities && activities.length > 0 && RenderResultsOnPege()}
        {activities && activities.length > 0 && (
          <styled.paginationDiv>
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              {"<"}
            </button>
            <span>{`Página ${page} de ${totalPages}`}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {">"}
            </button>
          </styled.paginationDiv>
        )}
      </styled.resultsDiv>
    </>
  );
};

export default Atividades;
