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

export const Historico = () => {
  // -Declaracoes da página- >
  const works = useSelector((state) => state.works);
  const dispatch = useDispatch();

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [selectedDay, setSelectedDay] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);

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

  // -Onclick React Handlers- >

  // -Funções de uso interno- >

  // -Dinamic page Content Renders- >

  // -Estrutura principal- >
  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      <styled.content>
        <styled.titleDiv>
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
          <styled.Division />
          <styled.WorkSelect>
            <option value="">Selecionar Obra</option>
            {works &&
              works.works.userWorks.map((work) => (
                <option key={work._id} value={work._id}>
                  {work.name}
                </option>
              ))}
          </styled.WorkSelect>
          <styled.Division />
          <styled.containerWrapper>
            Ordem
          </styled.containerWrapper>
        </styled.titleDiv>
      </styled.content>
    </styled.contentDiv>
  );
};
