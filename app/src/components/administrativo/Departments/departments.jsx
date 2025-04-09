import { useEffect, useState } from "react";
import { innovaApi } from "../../../services/http.js";

import * as styled from "./departmentsStyle.js";

import SVGUpDown from "../../../shared/icons/historyHH/UpDownArrow_icon.jsx";
import SVGSearch from "../../../shared/icons/historyHH/Search_icon.jsx";
import SVGEdit from "../../../shared/icons/historyHH/Edit_icon.jsx";
import SVGDelete from "../../../shared/icons/controleHH/Delete_icon.jsx";

const Departments = ({ toastMessage, modalMessage, modalInfo, openPage }) => {
  const [roles, setRoles] = useState([]);

  const [order, setOrder] = useState(true);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [whatDelete, setWhatDelete] = useState("");

  useEffect(() => {
    handleSearch();
  }, [page]);

  useEffect(() => {
    if (modalInfo.response !== null) {
      switch (modalInfo.event) {
        case "delete":
          if (modalInfo.response) deleteEmployee();
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
    openPage("Adicionar Função", 2);
  };

  const handleSearch = async (click = false) => {
    try {
      const response = await innovaApi.get(
        `/role/get-all?page=${page}&limit=${limit}&order=${order}&name=${search}`
      );

      setRoles(response.data.roles);
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

  const handleDeleteButtonClick = async (roleId, roleName) => {
    setWhatDelete(roleId);

    modalMessage({
      response: null,
      event: "delete",
      title: "Confirmação",
      message: `Deseja excluir a função ${roleName} (Ação Permanente)?`,
    });
  };

  const handleEditButtonClick = (roleId) => {
    openPage("Editar Função", 2, roleId);
  };

  async function deleteEmployee() {
    try {
      await innovaApi.delete(`/role/delete/${whatDelete}`);
      toastMessage({
        danger: false,
        title: "Sucesso",
        message: "Função excluída com sucesso",
      });
      setWhatDelete("");
      handleSearch();
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir a função",
      });
    }
  }

  const RenderResultsOnPege = () => {
    return roles.map((role, index) => {
      return (
        <styled.UserDiv $isEven={(index + 1) % 2 == 0} key={index}>
          <styled.userIndexSpan>
            {`#${index + 1 + (page - 1) * limit}`}
          </styled.userIndexSpan>
          <styled.userDataSpan>{role.sector}</styled.userDataSpan>
          <styled.userDataSpan>{role.role}</styled.userDataSpan>
          <styled.userDataSpan>{`R$ ${role.baseSalary
            .toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</styled.userDataSpan>
          <styled.userDataSpan>
            {role.isField ? "Campo" : "Escritório"}
          </styled.userDataSpan>
          <styled.controllButtonsDiv>
            <styled.EditButton onClick={() => handleEditButtonClick(role._id)}>
              <SVGEdit width="20" height="20" />
            </styled.EditButton>
            <styled.DeleteButton
              onClick={() => handleDeleteButtonClick(role._id, role.role)}
            >
              <SVGDelete width="16" height="16" />
            </styled.DeleteButton>
          </styled.controllButtonsDiv>
        </styled.UserDiv>
      );
    });
  };

  return (
    <>
      <styled.headerUsersDiv>Controle de funções</styled.headerUsersDiv>
      <styled.filterOptionsDiv>
        <styled.addNewOneDiv>
          <styled.addNewOneButton onClick={() => handleAddOne()}>
            <span>+</span> Nova função
          </styled.addNewOneButton>
        </styled.addNewOneDiv>
        <styled.filterAndInfoDiv>
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
            <span>Setor</span>
            <span>Função</span>
            <span>Salário Base</span>
            <span>Tipo de cargo</span>
            <span>Controles</span>
          </styled.infoPartDiv>
        </styled.filterAndInfoDiv>
      </styled.filterOptionsDiv>
      <styled.resultsDiv>
        {roles && roles.length > 0 && RenderResultsOnPege()}
        {roles && roles.length > 0 && (
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

export default Departments;
