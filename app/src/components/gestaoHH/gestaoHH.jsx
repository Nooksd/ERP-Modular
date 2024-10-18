// Página de gestão de HH

// -imports Ract, Redux- >
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserWorks } from "../../store/slicers/worksSlicer.js";

import * as styled from "./gestaoHHStyles.js";

import LineGraph from "../../shared/includes/graphs/line/lineGraph.jsx";
import BarGraph from "../../shared/includes/graphs/bar/barGraph.jsx";
import PieGraph from "../../shared/includes/graphs/pie/pieGraph.jsx";

import SVGFilter from "../../shared/icons/gestaoHH/Filter_icon.jsx";
import SVGEraseFilter from "../../shared/icons/gestaoHH/EraseFilter_icon.jsx";
import SVGTime from "../../shared/icons/gestaoHH/Time_icon.jsx";
import SVGTimeE1 from "../../shared/icons/gestaoHH/TimeE1_icon.jsx";
import SVGTimeE2 from "../../shared/icons/gestaoHH/TimeE2.jsx";

export const GestaoHH = ({ windowHeight }) => {
  const works = useSelector((state) => state.works);

  const [selectedStartDate, setSelectedStartDate] = useState();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [selectedWork, setSelectedWork] = useState();
  const [selectedYear, setSelectedYear] = useState();

  const [years, setYears] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!works || works.status !== "succeeded") {
      dispatch(fetchUserWorks());
    }
  }, [dispatch]);

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

  const [importedData, setImportedData] = useState({});

  const handleSelectWork = (work) => {
    setSelectedWork(work);
    setYears(["2021", "2022", "2023", "2024"]);

    setImportedData({
      labels: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      data: [12, 19, 3, 5, 2, 12, 19, 3, 5, 2, 5, 2],
    });
  };

  const handleSelectDate = (mes) => {
    if (selectedStartDate === undefined) {
      if (selectedEndDate !== mes) {
        setSelectedStartDate(mes);
      } else {
        setSelectedEndDate(undefined);
      }
    } else if (selectedEndDate === undefined) {
      if (mes > selectedStartDate) {
        setSelectedEndDate(mes);
      } else if (mes <= selectedStartDate) {
        if (mes === selectedStartDate) {
          setSelectedStartDate(undefined);
          setSelectedEndDate(undefined);
        } else {
          setSelectedStartDate(mes);
        }
      }
    } else {
      if (mes === selectedStartDate) {
        setSelectedStartDate(undefined);
      } else if (mes === selectedEndDate) {
        setSelectedEndDate(undefined);
      } else {
        setSelectedStartDate(mes);
        setSelectedEndDate(undefined);
      }
    }
  };

  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      <styled.content>
        <styled.greenBackground>
          <styled.titleContainer>
            <styled.title>Dashboard de gestão HH</styled.title>
            <styled.controllContainer>
              <styled.yearSelector>
                <styled.year></styled.year>
                {years &&
                  years.map((year, index) => (
                    <styled.year key={index}>{year}</styled.year>
                  ))}
              </styled.yearSelector>
              <styled.filter>
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
              <styled.eraseFilter>
                <SVGEraseFilter />
              </styled.eraseFilter>
            </styled.controllContainer>
          </styled.titleContainer>
        </styled.greenBackground>
        <styled.dashboardContainer>
          <styled.sideGrapchContainer></styled.sideGrapchContainer>
          <styled.summaryContainer>
            <styled.IconContainer>
              <SVGTime />
            </styled.IconContainer>
            <styled.cardContentContainer>
              <styled.cardTitle>Horas Normais</styled.cardTitle>
              <styled.cardValue>103</styled.cardValue>
              <styled.smallCardValue>
                30% <span> Utilizado</span>
              </styled.smallCardValue>
            </styled.cardContentContainer>
          </styled.summaryContainer>
          <styled.summaryContainer>
            <styled.IconContainer>
              <SVGTimeE1 />
            </styled.IconContainer>
            <styled.cardContentContainer>
              <styled.cardTitle>Horas Extras I</styled.cardTitle>
              <styled.cardValue>33</styled.cardValue>
              <styled.smallCardValue>
                10% <span> Utilizado</span>
              </styled.smallCardValue>
            </styled.cardContentContainer>
          </styled.summaryContainer>
          <styled.summaryContainer>
            <styled.IconContainer>
              <SVGTimeE2 />
            </styled.IconContainer>
            <styled.cardContentContainer>
              <styled.cardTitle>Horas Extras II</styled.cardTitle>
              <styled.cardValue>76</styled.cardValue>
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
            {meses.map((mes, index) => (
              <Fragment key={`month-select-${index}`}>
                {selectedWork && (
                  <styled.monthSelect
                    key={`month-select-${index}`}
                    $selected={
                      selectedStartDate === index || selectedEndDate === index
                    }
                    $between={
                      index > selectedStartDate && index < selectedEndDate
                    }
                    onClick={() => handleSelectDate(index)}
                  >
                    {mes}
                  </styled.monthSelect>
                )}
                {index + 1 !== meses.length && (
                  <styled.monthLine
                    key={`monthLine-${index}`}
                    $between={
                      (index > selectedStartDate && index < selectedEndDate) ||
                      (selectedStartDate === index && selectedEndDate)
                    }
                  />
                )}
              </Fragment>
            ))}
          </styled.monthSelectorContainer>
        </styled.dashboardContainer>
      </styled.content>
    </styled.contentDiv>
  );
};
