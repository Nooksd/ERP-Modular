import { useEffect, useState } from "react";
import { innovaApi } from "../../../services/http.js";

import * as styled from "./UserStyles.js";

import SVGCheck from "../../../shared/icons/adm/usinas/Check_icon.jsx";
import SVGClose from "../../../shared/icons/adm/usinas/Close_icon.jsx";
import SVGUpDown from "../../../shared/icons/historyHH/UpDownArrow_icon.jsx";
import SVGSearch from "../../../shared/icons/historyHH/Search_icon.jsx";
import SVGEdit from "../../../shared/icons/historyHH/Edit_icon.jsx";
import SVGDelete from "../../../shared/icons/controleHH/Delete_icon.jsx";

const Users = ({ toastMessage, modalMessage, modalInfo, openPage }) => {
  const [users, setUsers] = useState([]);

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
          if (modalInfo.response) deleteUser();
          break;
        case "disable":
          if (modalInfo.response) disableUser();
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
    openPage("Adicionar Usuário", 2);
  };

  const handleSearch = async (click = false) => {
    try {
      const response = await innovaApi.get(
        `/user/get-all?page=${page}&limit=${limit}&order=${order}&name=${search}&active=${activeMode}`
      );

      setUsers(response.data.users);
      setTotalPages(response.data.pagination.totalPages);
      if (click) {
        toastMessage({
          danger: false,
          title: "Sucesso",
          message: "Usuários encontrados com sucesso",
        });
      }
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Erro ao buscar Usuários",
      });
    }
  };

  const handleDeleteButtonClick = async (userId, userNome) => {
    setWhatDelete(userId);

    modalMessage({
      response: null,
      event: "delete",
      title: "Confirmação",
      message: `Deseja excluir o usuário ${userNome} (Ação Permanente)?`,
    });
  };

  const handleEditButtonClick = (userId) => {
    openPage("Editar Usuário", 2, userId);
  };

  const handleDisableToggle = (userId, userNome) => {
    setWhatDisable(userId);
    const action = activeMode ? "desativar" : "ativar";

    modalMessage({
      response: null,
      event: "disable",
      title: "Confirmação",
      message: `Deseja ${action} o usuário ${userNome}?`,
    });
  };

  async function deleteUser() {
    try {
      await innovaApi.delete(`/user/delete/${whatDelete}`);
      toastMessage({
        danger: false,
        title: "Sucesso",
        message: "Usuário excluído com sucesso",
      });
      setWhatDelete("");
      handleSearch();
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir o usuário",
      });
    }
  }

  async function disableUser() {
    try {
      await innovaApi.put(`/user/update/${whatDisable}`, {
        isActive: !activeMode,
      });

      const action = activeMode ? "desabilitada" : "habilitada";

      toastMessage({
        danger: false,
        title: "Sucesso",
        message: `Usuário ${action} com sucesso`,
      });
      setWhatDisable("");
      setActiveMode((prev) => !prev);
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível desabilitar a usuário",
      });
    }
  }

  const RenderResultsOnPege = () => {
    return users.map((user, index) => {
      return (
        <styled.UserDiv $isEven={(index + 1) % 2 == 0} key={index}>
          <styled.userIndexSpan>
            {`#${index + 1 + (page - 1) * limit}`}
          </styled.userIndexSpan>
          <styled.userAvatarImg src={user.avatar} />
          <styled.userDataSpan>{user.name}</styled.userDataSpan>
          <styled.userDataSpan>{user.email}</styled.userDataSpan>
          <styled.userDataSpan>{user.pages.length}</styled.userDataSpan>
          <styled.controllButtonsDiv>
            <styled.EditButton onClick={() => handleEditButtonClick(user._id)}>
              <SVGEdit width="20" height="20" />
            </styled.EditButton>
            <styled.DeleteButton
              onClick={() => handleDeleteButtonClick(user._id, user.name)}
            >
              <SVGDelete width="16" height="16" />
            </styled.DeleteButton>
            <styled.disableButton
              onClick={() => handleDisableToggle(user._id, user.name)}
            />
          </styled.controllButtonsDiv>
        </styled.UserDiv>
      );
    });
  };

  return (
    <>
      <styled.headerUsersDiv>Controle de Usuários</styled.headerUsersDiv>
      <styled.filterOptionsDiv>
        <styled.addNewOneDiv>
          <styled.addNewOneButton onClick={() => handleAddOne()}>
            <span>+</span> Novo usuário
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
              <styled.searchButton onClick={() => handleSearch(true)}>
                <SVGSearch width="15" height="15" />
                Buscar
              </styled.searchButton>
            </div>
          </styled.filterPartDiv>
          <styled.infoPartDiv>
            <span>Index</span>
            <span>Foto</span>
            <span>Nome</span>
            <span>Email</span>
            <span>Páginas</span>
            <span>Controles</span>
          </styled.infoPartDiv>
        </styled.filterAndInfoDiv>
      </styled.filterOptionsDiv>
      <styled.resultsDiv>
        {users && users.length > 0 && RenderResultsOnPege()}
        {users && users.length > 0 && (
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

export default Users;
