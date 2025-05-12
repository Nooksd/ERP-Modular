// Página de Histórico

// -imports Ract, Redux- >
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { innovaApi } from "../../services/http.js";
import { useNavigate } from "react-router-dom";
import { fetchUserWorks } from "../../store/slicers/worksSlicer";

// -imports Componentes- >
import Calendar from "../../shared/includes/calendar/calendar.jsx";

// -imports Styles- >
import * as styled from "./historicoStyles.js";

// -imports SVGs- >
import SVGCalendar from "../../shared/icons/controleHH/calendar_icon.jsx";
import SVGUpDown from "../../shared/icons/historyHH/UpDownArrow_icon.jsx";
import SVGSearch from "../../shared/icons/historyHH/Search_icon.jsx";
import SVGDelete from "../../shared/icons/controleHH/Delete_icon.jsx";
import SVGEdit from "../../shared/icons/historyHH/Edit_icon.jsx";

export const Historico = ({
  toastMessage,
  modalMessage,
  modalInfo,
  windowHeight,
}) => {
  // -Declaracoes da página- >
  const works = useSelector((state) => state.works);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedWork, setSelectedWork] = useState("");

  const [openCalendar, setOpenCalendar] = useState(false);

  const [hhRecords, setHHRecords] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState(true);

  const [whatDelete, setWhatDelete] = useState("");

  // -Whachers de mudancas useEffect- >
  useEffect(() => {
    if (!works || works.status !== "succeeded") {
      dispatch(fetchUserWorks());
    }
  }, [dispatch]);

  useEffect(() => {
    if (selectedWork !== "") handleSearchHHRecords();
  }, [page]);

  useEffect(() => {
    if (selectedWork !== "") {
      if (page === 1) {
        handleSearchHHRecords();
      } else {
        setPage(1);
      }
    }
  }, [limit]);

  useEffect(() => {
    if (modalInfo.response !== null) {
      switch (modalInfo.event) {
        case "delete":
          if (modalInfo.response) deleteRecord();
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

  // -Onclick React Handlers- >
  const handleSelectWork = (value) => {
    setError(false);
    setSelectedWork(value);
  };
  const handleSearchHHRecords = async () => {
    const isValid = validateWork();

    if (isValid) {
      try {
        const response = await innovaApi.get(
          `/hhcontroll/get-history/${selectedWork}?page=${page}&limit=${limit}${createDateRange()}&order=${order}`
        );
        setHHRecords(response.data.hhRecords);
        setPages(response.data.pagination.totalPages);
        toastMessage({
          danger: false,
          title: "Sucesso",
          message: "Registros de hh encontrados",
        });
      } catch (e) {
        toastMessage({
          danger: true,
          title: "Error",
          message: "Registros de hh não encontrados",
        });
      }
    } else {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Campo de Obra não pode estar vazio",
      });
    }
  };

  const handleEditClick = (record) => {
    const date = new Date(record.date);
    const localDate = `${String(date.getUTCDate()).padStart(2, "0")}${String(
      date.getUTCMonth() + 1
    ).padStart(2, "0")}${date.getUTCFullYear()}`;

    const recordData = {
      recordId: record.recordId,
      projectId: selectedWork,
      date: localDate,
    };

    navigate("/controlehh", { state: recordData });
  };

  const handleDeleteClick = (record) => {
    const date = new Date(record.date);
    const localDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const workName = works.works.userWorks.find(
      (obj) => obj._id === selectedWork
    ).name;

    setWhatDelete({
      projectId: selectedWork,
      recordId: record.recordId,
    });

    modalMessage({
      response: null,
      event: "delete",
      title: "Confirmação",
      message: `Deseja excluir o registro das horas do dia ${localDate} de ${workName}?`,
    });
  };

  // -Funções de uso interno- >
  function validateWork() {
    let isValid = true;

    if (selectedWork === "") {
      isValid = false;
      setError(true);
    }

    return isValid;
  }

  function createDateRange() {
    let dateRange = "";

    if (selectedDay.length > 0) {
      dateRange =
        dateRange +
        `&startDate=${selectedDay[0].slice(4, 8)}-${selectedDay[0].slice(
          2,
          4
        )}-${selectedDay[0].slice(0, 2)}`;
      if (selectedDay.length === 2) {
        dateRange =
          dateRange +
          `&endDate=${selectedDay[1].slice(4, 8)}-${selectedDay[1].slice(
            2,
            4
          )}-${selectedDay[1].slice(0, 2)}&`;
      }
    }

    return dateRange;
  }

  async function deleteRecord() {
    try {
      await innovaApi.delete(
        `/hhcontroll/delete-record/${whatDelete.recordId}`
      );
      toastMessage({
        danger: false,
        title: "Sucesso",
        message: "Registro de hh excluído com sucesso",
      });
      setWhatDelete("");
      handleSearchHHRecords();
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir o registro de hh",
      });
    }
  }

  // -Dinamic page Content Renders- >
  const renderHHRecords = () => {
    if (hhRecords.length === 0) {
      return (
        <styled.empityHHRecordP>
          Selecione os parâmetros para buscar HH
        </styled.empityHHRecordP>
      );
    }

    return (
      hhRecords.length > 0 &&
      hhRecords.map((record, index) => {
        const date = new Date(record.date);
        const localDate = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate()
        ).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        return (
          <styled.recordWraperDiv key={index}>
            <styled.RecordDiv>
              <styled.recordIndexH4>{`#${index + 1}`}</styled.recordIndexH4>
              <styled.Division />
              <styled.recordDateH4>{localDate}</styled.recordDateH4>
              <styled.Division />
              <styled.recordActivitiesDiv>
                {record.activities}
              </styled.recordActivitiesDiv>
              <styled.Division />
              <styled.recordRolesDiv>{record.roles}</styled.recordRolesDiv>
              <styled.Division />
              <styled.recordHoursDiv>
                {record.hours + record.extra + record.extra2}
              </styled.recordHoursDiv>
              <styled.Division />
            </styled.RecordDiv>
            <styled.EditButton onClick={() => handleEditClick(record)}>
              <SVGEdit width="20" height="20" />
            </styled.EditButton>
            <styled.DeleteButton onClick={() => handleDeleteClick(record)}>
              <SVGDelete width="16" height="16" />
            </styled.DeleteButton>
          </styled.recordWraperDiv>
        );
      })
    );
  };

  // -Estrutura principal- >
  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      <styled.content $error={error}>
        <styled.titleDiv $error={error}>
          Histórico de lançamento HH da usina
          <styled.Division />
          <styled.containerWrapper>
            {openCalendar && (
              <styled.calendarContainer>
                <Calendar
                  selectedDay={selectedDay}
                  onDaySelect={setSelectedDay}
                  single={false}
                />
              </styled.calendarContainer>
            )}

            <SVGCalendar onClick={() => setOpenCalendar((prev) => !prev)} />
          </styled.containerWrapper>
          <styled.Division $error={error} />
          <styled.WorkSelect
            onChange={(e) => handleSelectWork(e.target.value)}
            name="work"
          >
            <option value="">Selecionar Obra</option>
            {works.status === "succeeded" &&
              works.works.userWorks.map((work) => (
                <option key={work._id} value={work._id}>
                  {work.name}
                </option>
              ))}
          </styled.WorkSelect>
          <styled.Division $error={error} />
          <styled.containerWrapper onClick={() => setOrder((prev) => !prev)}>
            <styled.orderH4>Ordem</styled.orderH4>
            <SVGUpDown decrescent={order} />
          </styled.containerWrapper>
          <styled.Division />
          <styled.containerWrapper onClick={() => handleSearchHHRecords()}>
            <styled.orderH4>Pesquisar</styled.orderH4>
            <SVGSearch width="20" />
          </styled.containerWrapper>
        </styled.titleDiv>
        <styled.historyDiv>{renderHHRecords()}</styled.historyDiv>
        <styled.HistoryControllDiv>
          <styled.controllButton
            disabled={page <= 1 ? true : false}
            onClick={() => setPage((prev) => prev - 1)}
          >
            {"<"}
          </styled.controllButton>
          <styled.controllSelect
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value))}
          >
            {Array.from({ length: pages }, (_, index) => index + 1).map(
              (page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              )
            )}
          </styled.controllSelect>
          <styled.controllSelect
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </styled.controllSelect>
          <styled.controllButton
            disabled={page >= pages ? true : false}
            onClick={() => setPage((prev) => prev + 1)}
          >
            {">"}
          </styled.controllButton>
        </styled.HistoryControllDiv>
      </styled.content>
    </styled.contentDiv>
  );
};
