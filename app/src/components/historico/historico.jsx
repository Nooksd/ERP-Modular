// Página de envio e edicao de HH

// -imports Ract, Redux- >
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { innovaApi } from "../../services/http.js";
import { fetchUserWorks } from "../../store/slicers/worksSlicer";

// -imports Componentes- >
import Calendar from "../../shared/includes/calendar/calendar.jsx";
import { Loading } from "../../styles/global.js";

// -imports Styles- >
import * as styled from "./historicoStyles.js";

// -imports SVGs- >
import SVGCalendar from "../../shared/icons/controleHH/calendar_icon.jsx";
import SVGUpDown from "../../shared/icons/historyHH/UpDownArrow_icon.jsx";
import SVGSearch from "../../shared/icons/historyHH/Search_icon.jsx";
import SVGDelete from "../../shared/icons/controleHH/Delete_icon.jsx";
import SVGEdit from "../../shared/icons/historyHH/Edit_icon.jsx";

export const Historico = ({ toastMessage }) => {
  // -Declaracoes da página- >
  const works = useSelector((state) => state.works);
  const dispatch = useDispatch();

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedWork, setSelectedWork] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [hhRecords, setHHRecords] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState(true);

  // -Whachers de mudancas useEffect- >
  useEffect(() => {
    if (!works || works.status !== "succeeded") {
      dispatch(fetchUserWorks());
    }
  }, [dispatch]);

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
    if (selectedWork !== "") handleSearchHHRecords();
  }, [page]);

  useEffect(() => {
    if (selectedWork !== "") {
      setPage(1);
    }
  }, [limit]);

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

        console.log(response.data);
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
          <styled.RecordDiv key={index}>
            <styled.Division />
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
            <styled.recordHoursDiv>{record.hours}</styled.recordHoursDiv>
            <styled.Division />
            <styled.editDeleteDiv>
              <SVGDelete width="24" height="24" style={{ cursor: "pointer" }} />
              <SVGEdit width="24" height="24" style={{ cursor: "pointer" }} />
            </styled.editDeleteDiv>
            <styled.Division />
          </styled.RecordDiv>
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
