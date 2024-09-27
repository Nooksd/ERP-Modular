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
    handleSearchButtonClick();
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

  const handleSearchButtonClick = async (click = false) => {
    try {
      const response = await innovaApi.get(
        `/user/get-all-users?page=${page}&limit=${limit}&order=${order}&name=${search}&active=${activeMode}`
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
      handleSearchButtonClick();
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir a usuário",
      });
    }
  }

  async function disableUser() {
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



  return (
    <>
      <h1>USERS</h1>
    </>
  );
};

export default Users;
