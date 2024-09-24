import { useEffect, useState } from "react";
import * as styled from "./usinasStyles.js";
import SVGCheck from "../../../shared/icons/adm/usinas/Check_icon.jsx";
import SVGClose from "../../../shared/icons/adm/usinas/Close_icon.jsx";
import SVGUpDown from "../../../shared/icons/historyHH/UpDownArrow_icon.jsx";
import SVGSearch from "../../../shared/icons/historyHH/Search_icon.jsx";
import SVGEdit from "../../../shared/icons/historyHH/Edit_icon.jsx";
import SVGDelete from "../../../shared/icons/controleHH/Delete_icon.jsx";

const Usinas = () => {
  const [activeMode, setActiveMode] = useState(true);
  const [usinas, setUsinas] = useState([
    {
      name: "Jaicos",
      location: "Jaicos, MG",
      startDate: "23/02/2023",
      endDate: "10/07/2024",
      isActive: true,
    },
    {
      name: "Rio Quente I",
      location: "Rio Quente, MG",
      startDate: "23/02/2023",
      endDate: "10/07/2024",
      isActive: true,
    },
    {
      name: "Rio Quente II",
      location: "Rio Quente, MG",
      startDate: "23/02/2023",
      endDate: "10/07/2024",
      isActive: true,
    },
    {
      name: "Rio Quente III",
      location: "Rio Quente, MG",
      startDate: "23/02/2023",
      endDate: "10/07/2024",
      isActive: true,
    },
  ]);
  const [order, setOrder] = useState(true);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const RenderResultsOnPege = () => {
    return usinas.map((usina, index) => (
      <styled.usinaDiv $isEven={(index + 1) % 2 == 0} key={index}>
        <styled.usinaIndexSpan>
          {`#${index + 1 + (page - 1) * limit}`}
        </styled.usinaIndexSpan>
        <styled.usinaDataSpan>{usina.name}</styled.usinaDataSpan>
        <styled.usinaDataSpan>{usina.location}</styled.usinaDataSpan>
        <styled.usinaDataSpan>{usina.startDate}</styled.usinaDataSpan>
        <styled.usinaDataSpan>{usina.endDate}</styled.usinaDataSpan>
        <styled.controllButtonsDiv>
          <styled.EditButton>
            <SVGEdit width="20" height="20" />
          </styled.EditButton>
          <styled.DeleteButton>
            <SVGDelete width="16" height="16" />
          </styled.DeleteButton>
        </styled.controllButtonsDiv>
      </styled.usinaDiv>
    ));
  };
  return (
    <>
      <styled.headerUsinasDiv>Controle de Usinas/Obras</styled.headerUsinasDiv>
      <styled.filterOptionsDiv>
        <styled.addNewOneDiv>
          <styled.addNewOneButton>
            <span>+</span> Nova Usina
          </styled.addNewOneButton>
        </styled.addNewOneDiv>
        <styled.filterAndInfoDiv>
          <styled.switchModeDiv>
            <styled.switchModeButton
              $active={!activeMode}
              onClick={() => setActiveMode(true)}
            >
              <SVGCheck width="15" height="15" />
              Ativos
            </styled.switchModeButton>
            <styled.switchModeButton
              $active={activeMode}
              onClick={() => setActiveMode(false)}
            >
              <SVGClose width="15" height="15" />
              Inativos
            </styled.switchModeButton>
          </styled.switchModeDiv>
          <styled.filterPartDiv>
            <div>
              <styled.totalNumberSelect>
                <option>10</option>
                <option>30</option>
                <option>50</option>
                <option>100</option>
              </styled.totalNumberSelect>
              Quantidade por Página
            </div>
            <div>
              <styled.searchInput
                name="search"
                placeholder="Pesquisar por Nome"
              />
              <button
                style={{ background: "none" }}
                onClick={() => setOrder((prev) => !prev)}
              >
                <SVGUpDown width="25" height="25" decrescent={order} />
              </button>
              <styled.searchButton>
                <SVGSearch width="15" height="15" />
                Buscar
              </styled.searchButton>
            </div>
          </styled.filterPartDiv>
          <styled.infoPartDiv>
            <span>Index</span>
            <span>Nome</span>
            <span>Localização</span>
            <span>Data de Início</span>
            <span>Data de Fim</span>
            <span>Controles</span>
          </styled.infoPartDiv>
        </styled.filterAndInfoDiv>
      </styled.filterOptionsDiv>
      {usinas.length > 0 && RenderResultsOnPege()}
    </>
  );
};

export default Usinas;
