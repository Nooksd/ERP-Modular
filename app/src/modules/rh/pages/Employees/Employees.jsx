import { useEffect, useState } from "react";
import { innovaApi } from "@/services/http.js";

import * as styled from "./EmployeeStyles.js";

import SVGCheck from "../../../assets/icons/adm/usinas/Check_icon.jsx";
import SVGClose from "../../../assets/icons/adm/usinas/Close_icon.jsx";
import SVGUpDown from "../../../assets/icons/historyHH/UpDownArrow_icon.jsx";
import SVGSearch from "../../../assets/icons/historyHH/Search_icon.jsx";
import SVGEdit from "../../../assets/icons/historyHH/Edit_icon.jsx";
import SVGDelete from "../../../assets/icons/controleHH/Delete_icon.jsx";

const Employees = ({ toastMessage, modalMessage, modalInfo, openPage }) => {
  const [employees, setEmployees] = useState([]);

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
          if (modalInfo.response) deleteEmployee();
          break;
        case "disable":
          if (modalInfo.response) disableEmployee();
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
    openPage("Adicionar Funcionário", 2);
  };

  const handleSearch = async (click = false) => {
    try {
      const response = await innovaApi.get(
        `/rh/employee/get-all?page=${page}&limit=${limit}&order=${order}&name=${search}&active=${activeMode}`
      );

      setEmployees(response.data.employees);
      setTotalPages(response.data.pagination.totalPages);
      if (click) {
        toastMessage({
          danger: false,
          title: "Sucesso",
          message: "Funcionários encontrados com sucesso",
        });
      }
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Erro ao buscar Funcionários",
      });
    }
  };

  const handleDeleteButtonClick = async (employeeId, employeeName) => {
    setWhatDelete(employeeId);

    modalMessage({
      response: null,
      event: "delete",
      title: "Confirmação",
      message: `Deseja excluir o funcionário ${employeeName} (Ação Permanente)?`,
    });
  };

  const handleEditButtonClick = (employeeId) => {
    openPage("Editar Funcionário", 2, employeeId);
  };

  const handleDisableToggle = (employeeId, employeeName) => {
    setWhatDisable(employeeId);
    const action = activeMode ? "desativar" : "ativar";

    modalMessage({
      response: null,
      event: "disable",
      title: "Confirmação",
      message: `Deseja ${action} o funcionário ${employeeName}?`,
    });
  };

  async function deleteEmployee() {
    try {
      await innovaApi.delete(`/rh/employee/delete/${whatDelete}`);
      toastMessage({
        danger: false,
        title: "Sucesso",
        message: "Funcionário excluído com sucesso",
      });
      setWhatDelete("");
      handleSearch();
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível excluir o funcionário",
      });
    }
  }

  async function disableEmployee() {
    try {
      await innovaApi.put(`/rh/employee/update/${whatDisable}`, {
        isActive: !activeMode,
      });

      const action = activeMode ? "desabilitada" : "habilitada";

      toastMessage({
        danger: false,
        title: "Sucesso",
        message: `Funcionário ${action} com sucesso`,
      });
      setWhatDisable("");
      setActiveMode((prev) => !prev);
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Error",
        message: "Não foi possível desabilitar a funcionário",
      });
    }
  }

  const RenderResultsOnPege = () => {
    return employees.map((employee, index) => {
      const formatCPF = (cpf) => {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
      };
      return (
        <styled.UserDiv $isEven={(index + 1) % 2 == 0} key={index}>
          <styled.userIndexSpan>
            {`#${index + 1 + (page - 1) * limit}`}
          </styled.userIndexSpan>
          <styled.userDataSpan>{employee.name}</styled.userDataSpan>
          <styled.userDataSpan>{formatCPF(employee.cpf)}</styled.userDataSpan>
          <styled.userDataSpan>{employee.email}</styled.userDataSpan>
          <styled.userDataSpan>{employee.role}</styled.userDataSpan>
          <styled.controllButtonsDiv>
            <styled.EditButton
              onClick={() => handleEditButtonClick(employee._id)}
            >
              <SVGEdit width="20" height="20" />
            </styled.EditButton>
            <styled.DeleteButton
              onClick={() =>
                handleDeleteButtonClick(employee._id, employee.name)
              }
            >
              <SVGDelete width="16" height="16" />
            </styled.DeleteButton>
            <styled.disableButton
              onClick={() => handleDisableToggle(employee._id, employee.name)}
            />
          </styled.controllButtonsDiv>
        </styled.UserDiv>
      );
    });
  };

  return (
    <>
      <styled.headerUsersDiv>Controle de Funcionários</styled.headerUsersDiv>
      <styled.filterOptionsDiv>
        <styled.addNewOneDiv>
          <styled.addNewOneButton onClick={() => handleAddOne()}>
            <span>+</span> Novo funcionário
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
            <span>Nome</span>
            <span>Cpf</span>
            <span>Email</span>
            <span>Função</span>
            <span>Controles</span>
          </styled.infoPartDiv>
        </styled.filterAndInfoDiv>
      </styled.filterOptionsDiv>
      <styled.resultsDiv>
        {employees && employees.length > 0 && RenderResultsOnPege()}
        {employees && employees.length > 0 && (
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

export default Employees;
