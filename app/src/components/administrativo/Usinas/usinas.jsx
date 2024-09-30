import { useEffect, useState } from "react";
import { innovaApi } from "../../../services/http.js";
import * as styled from "./usinasStyles.js";

import SVGCheck from "../../../shared/icons/adm/usinas/Check_icon.jsx";
import SVGClose from "../../../shared/icons/adm/usinas/Close_icon.jsx";
import SVGUpDown from "../../../shared/icons/historyHH/UpDownArrow_icon.jsx";
import SVGSearch from "../../../shared/icons/historyHH/Search_icon.jsx";
import SVGEdit from "../../../shared/icons/historyHH/Edit_icon.jsx";
import SVGDelete from "../../../shared/icons/controleHH/Delete_icon.jsx";

const Usinas = ({ toastMessage, modalMessage, modalInfo, openPage }) => {
  const [usinas, setUsinas] = useState([]);
  
  const [activeMode, setActiveMode] = useState(true);
  const [order, setOrder] = useState(true);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [whatDelete, setWhatDelete] = useState("");
  const [whatDisable, setWhatDisable] = useState("");

  useEffect(() => {
    handleSearch();
  }, [page, activeMode]);

  useEffect(() => {
    if (modalInfo.response !== null) {
      switch (modalInfo.event) {
        case "delete":
          if (modalInfo.response) deleteUsina();
          break;
        case "disable":
          if (modalInfo.response) disableUsina();
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

  const handleAddNewUsinaButtonClick = () => {
    openPage("Adicionar Usina", 2);
  };

  const handleSearch = async (click = false) => {
    try {
      const response = await innovaApi.get(
        `/work/get-all-works?page=${page}&limit=${limit}&order=${order}&name=${search}&active=${activeMode}`
      );

      setUsinas(response.data.works);
      setTotalPages(response.data.pagination.totalPages);
      if (click) {
        toastMessage({
          danger: false,
          title: "Sucesso",
          message: "Usinas encontradas com sucesso",
        });
      }
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Erro ao buscar Usinas",
      });
    }
  };

  const handleDeleteButtonClick = async (usinaId, usinaNome) => {
    setWhatDelete(usinaId);

    modalMessage({
      response: null,
      event: "delete",
      title: "Confirmação",
      message: `Deseja excluir a usina ${usinaNome} (Ação Permanente)?`,
    });
  };

  const handleEditButtonClick = (usinaId) => {
    openPage("Editar Usina", 2, usinaId);
  };

  const handleDisableUsina = (usinaId, usinaNome) => {
    setWhatDisable(usinaId);
    const action = activeMode ? "desativar" : "ativar";

    modalMessage({
      response: null,
      event: "disable",
      title: "Confirmação",
      message: `Deseja ${action} a usina ${usinaNome}?`,
    });
  };

  async function deleteUsina() {
    try {
      await innovaApi.delete(`/work/delete/${whatDelete}`);
      toastMessage({
        danger: false,
        title: "Sucesso",
        message: "Usina excluída com sucesso",
      });
      setWhatDelete("");
      handleSearch();
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir a usina",
      });
    }
  }

  async function disableUsina() {
    try {
      await innovaApi.put(`/work/update-work/${whatDisable}`, {
        isActive: !activeMode,
      });

      const action = activeMode ? "desabilitada" : "habilitada";

      toastMessage({
        danger: false,
        title: "Sucesso",
        message: `Usina ${action} com sucesso`,
      });
      setWhatDisable("");
      setActiveMode((prev) => !prev);
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível desabilitar a usina",
      });
    }
  }

  const RenderResultsOnPege = () => {
    return usinas.map((usina, index) => {
      const dateStart = new Date(usina.startDate);
      const dateEnd = new Date(usina.endDate);

      const startDate = new Date(
        dateStart.getUTCFullYear(),
        dateStart.getUTCMonth(),
        dateStart.getUTCDate()
      ).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const endDate =
        dateEnd == "Invalid Date"
          ? "Sem Data Final"
          : new Date(
              dateEnd.getUTCFullYear(),
              dateEnd.getUTCMonth(),
              dateEnd.getUTCDate()
            ).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });

      return (
        <styled.usinaDiv $isEven={(index + 1) % 2 == 0} key={index}>
          <styled.usinaIndexSpan>
            {`#${index + 1 + (page - 1) * limit}`}
          </styled.usinaIndexSpan>
          <styled.usinaDataSpan>{usina.name}</styled.usinaDataSpan>
          <styled.usinaDataSpan>{usina.location}</styled.usinaDataSpan>
          <styled.usinaDataSpan>{startDate}</styled.usinaDataSpan>
          <styled.usinaDataSpan>{endDate}</styled.usinaDataSpan>
          <styled.controllButtonsDiv>
            <styled.EditButton onClick={() => handleEditButtonClick(usina._id)}>
              <SVGEdit width="20" height="20" />
            </styled.EditButton>
            <styled.DeleteButton
              onClick={() => handleDeleteButtonClick(usina._id, usina.name)}
            >
              <SVGDelete width="16" height="16" />
            </styled.DeleteButton>
            <styled.disableButton
              onClick={() => handleDisableUsina(usina._id, usina.name)}
            />
          </styled.controllButtonsDiv>
        </styled.usinaDiv>
      );
    });
  };
  return (
    <>
      <styled.headerUsinasDiv>Controle de Usinas/Obras</styled.headerUsinasDiv>
      <styled.filterOptionsDiv>
        <styled.addNewOneDiv>
          <styled.addNewOneButton
            onClick={() => handleAddNewUsinaButtonClick()}
          >
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
              <styled.totalNumberSelect
                onChange={(e) => setLimit(e.target.value)}
              >
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
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                style={{ background: "none" }}
                onClick={() => setOrder((prev) => !prev)}
              >
                <SVGUpDown width="25" height="25" decrescent={order} />
              </button>
              <styled.searchButton
                onClick={() => handleSearch(true)}
              >
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
      <styled.resultsDiv>
        {usinas.length > 0 && RenderResultsOnPege()}
        {usinas.length > 0 && (
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

export default Usinas;
