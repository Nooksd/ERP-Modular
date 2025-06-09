import { useEffect, useState, useRef } from "react";
import { innovaApi } from "@/services/http.js";

import * as styled from "./addEmployeeStyles.js";

import Calendar from "../../../../components/calendar/calendar.jsx";

import SVGCalendar from "../../../../assets/icons/controleHH/calendar_icon.jsx";
import SVGDelete from "../../../../assets/icons/controleHH/Delete_icon.jsx";

const AddEmployee = ({ toastMessage, editData }) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [dateError, setDateError] = useState(false);

  const [managerIds, setManagerIds] = useState([]);
  const [roles, setRoles] = useState([]);

  const [nameError, setNameError] = useState(false);
  const [cpfError, setCpfError] = useState(false);

  const [roleError, setRoleError] = useState(false);
  const [managerIdsError, setManagerIdsError] = useState([]);

  const [employeeInfo, setEmployeeInfo] = useState({
    name: "",
    cpf: "",
    email: "",
    role: "",
    startDate: "",
    managerIds: [],
  });

  const addManagerIdRef = useRef(null);

  useEffect(() => {
    getManagerIds();
    getRoles();
  }, []);

  useEffect(() => {
    if (editData) {
      getEmployeeInfo();
    }
  }, [editData]);

  useEffect(() => {
    if (selectedDay) {
      const formattedDate = selectedDay.replace(
        /(\d{2})(\d{2})(\d{4})/,
        "$1/$2/$3"
      );

      setEmployeeInfo((prevInfo) => ({
        ...prevInfo,
        startDate: formattedDate,
      }));
    } else {
      setEmployeeInfo((prevInfo) => ({
        ...prevInfo,
        startDate: "",
      }));
    }
  }, [selectedDay]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "cpf") {
      const rawCpf = value.replace(/\D/g, "");
      const cpf = rawCpf.slice(0, 11);
      const formattedCpf = cpf
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      setEmployeeInfo({ ...employeeInfo, [name]: formattedCpf });
    } else {
      setEmployeeInfo({ ...employeeInfo, [name]: value });
    }
  };

  const handleRemoveManagerId = (index) => {
    setEmployeeInfo((prevInfo) => ({
      ...prevInfo,
      managerIds: prevInfo.managerIds.filter((_, i) => i !== index),
    }));
  };

  const handleAddNewEmpityManagerId = () => {
    setEmployeeInfo((prevInfo) => ({
      ...prevInfo,
      managerIds: [...prevInfo.managerIds, ""],
    }));

    setTimeout(() => {
      addManagerIdRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleSelectManagerId = (managerId, index) => {
    const newManagerIds = [...employeeInfo.managerIds];
    newManagerIds[index] = managerId;
    setEmployeeInfo({ ...employeeInfo, managerIds: newManagerIds });
  };

  const handleSubmit = async () => {
    if (fieldValidator()) {
      try {
        let response;

        const formatDate = (dateStr) => {
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month}-${parseInt(day)}`;
        };

        let newEmployeeInfo = {
          ...employeeInfo,
          startDate: formatDate(employeeInfo.startDate),
        };

        if (editData) {
          response = await innovaApi.put(
            `/rh/employee/update/${editData}`,
            newEmployeeInfo
          );
        } else {
          response = await innovaApi.post(
            "/rh/employee/create",
            newEmployeeInfo
          );
        }

        toastMessage({
          danger: false,
          title: "Sucesso",
          message: response.data.message,
        });
      } catch (e) {
        toastMessage({
          danger: true,
          title: "Error",
          message: e.response.data.message,
        });
      }
    } else {
      toastMessage({
        danger: true,
        title: "Aviso",
        message: "Campos necessários não preenchidos",
      });
    }
  };

  function fieldValidator() {
    let isValid = true;

    if (!employeeInfo.name) {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }
    if (!employeeInfo.cpf || employeeInfo.cpf.length !== 14) {
      setCpfError(true);
      isValid = false;
    } else {
      setCpfError(false);
    }

    if (!employeeInfo.role) {
      setRoleError(true);
      isValid = false;
    } else {
      setRoleError(false);
    }

    employeeInfo.managerIds.map((managerId, index) => {
      if (managerId === "") {
        const newManagerIdErrors = [...managerIdsError];
        newManagerIdErrors[index] = true;
        setManagerIdsError(newManagerIdErrors);
        isValid = false;
      } else {
        const newManagerIdErrors = [...managerIdsError];
        newManagerIdErrors[index] = false;
        setManagerIdsError(newManagerIdErrors);
      }
    });

    return isValid;
  }

  async function getEmployeeInfo() {
    try {
      const response = await innovaApi.get(`/rh/employee/get-one/${editData}`);
      const result = response.data.employee;

      const formatDate1 = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const formatDate2 = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}${month}${year}`;
      };

      const newEmployeeInfo = {
        name: result.name,
        cpf: result.cpf,
        email: result.email,
        role: result.role,
        startDate: formatDate1(result.startDate),
        managerIds: result.managerIds,
      };

      setSelectedDay(formatDate2(result.startDate));

      setEmployeeInfo(newEmployeeInfo);

      toastMessage({
        danger: false,
        title: "Sucesso",
        message: response.data.message,
      });
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Erro",
        message: "Erro ao buscar dados do usuário",
      });
    }
  }

  async function getManagerIds() {
    try {
      const response = await innovaApi.get("/auth/user/get-managers");
      const result = response;

      setManagerIds(result.data.managerIds);
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Erro",
        message: "Erro ao buscar páginas",
      });
    }
  }

  async function getRoles() {
    try {
      const response = await innovaApi.get("/rh/role/get-all");
      const result = response.data.roles;

      setRoles(result);
    } catch (e) {}
  }

  return (
    <>
      <styled.formTitle>
        {editData ? "Editar" : "Adicionar"} Funcionário
      </styled.formTitle>
      <styled.formContainer>
        <styled.formDiv $required={true}>
          <styled.formLabel>Nome do funcionário</styled.formLabel>
          <styled.formInput
            name="name"
            $error={nameError}
            value={employeeInfo.name}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formDiv $required={true}>
          <styled.formLabel>Cpf do funcionário</styled.formLabel>
          <styled.formInput
            name="cpf"
            $error={cpfError}
            value={employeeInfo.cpf}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formDiv>
          <styled.formLabel>Email do funcionário</styled.formLabel>
          <styled.formInput
            name="email"
            value={employeeInfo.email}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formManagerAndSubmitButtonDiv>
          <styled.formDiv>
            <styled.formLabel>Data de inicio</styled.formLabel>
            <styled.formDateDiv $error={dateError}>
              <span>{employeeInfo.startDate}</span>
              <styled.calendarDeleteIconDiv>
                {openCalendar && (
                  <styled.calendarContainerStart>
                    <Calendar
                      selectedDay={selectedDay}
                      onDaySelect={setSelectedDay}
                      allowFuture={true}
                    />
                  </styled.calendarContainerStart>
                )}
                <SVGCalendar onClick={() => setOpenCalendar((prev) => !prev)} />
                <SVGDelete
                  width="20"
                  height="20"
                  onClick={() => setSelectedDay("")}
                />
              </styled.calendarDeleteIconDiv>
            </styled.formDateDiv>
          </styled.formDiv>
          <styled.formDiv>
            <styled.formLabel>Cargo do funcionário</styled.formLabel>
            <styled.formManagerSelect
              $error={roleError}
              value={employeeInfo.role}
              name="role"
              onChange={(e) => handleInputChange(e)}
            >
              <option value="">Selecionar funcionário</option>
              {roles &&
                roles.map((role, index) => (
                  <option key={index} value={role.role}>
                    {role.role}
                  </option>
                ))}
            </styled.formManagerSelect>
          </styled.formDiv>
        </styled.formManagerAndSubmitButtonDiv>
        <styled.formManagerAndSubmitButtonDiv>
          <styled.formManagerDiv>
            {employeeInfo.managerIds &&
              employeeInfo.managerIds.map((managerId, index) => (
                <styled.managerAndButtonDiv key={index}>
                  <styled.formManagerSelect
                    $error={managerIdsError[index]}
                    value={managerId}
                    onChange={(e) =>
                      handleSelectManagerId(e.target.value, index)
                    }
                  >
                    <option value="">Selecionar página</option>
                    {managerIds &&
                      managerIds.map((managerId) => {
                        if (
                          (employeeInfo.managerIds.includes(managerId.id) &&
                            employeeInfo.managerIds[index] !== managerId.id) ||
                          editData == managerId.employeeId
                        )
                          return null;
                        return (
                          <option key={managerId.id} value={managerId.id}>
                            {managerId.name}
                          </option>
                        );
                      })}
                  </styled.formManagerSelect>
                  <styled.formManagerButton
                    onClick={() => handleRemoveManagerId(index)}
                  >
                    -
                  </styled.formManagerButton>
                </styled.managerAndButtonDiv>
              ))}
            <styled.managerAndButtonDiv>
              {employeeInfo.managerIds &&
                employeeInfo.managerIds.length === 0 && (
                  <styled.addNewText>Adicionar gestor</styled.addNewText>
                )}
              <styled.formManagerButton
                style={{ borderRadius: "5pc" }}
                $new={true}
                onClick={() => handleAddNewEmpityManagerId()}
                ref={addManagerIdRef}
              >
                +
              </styled.formManagerButton>
            </styled.managerAndButtonDiv>
          </styled.formManagerDiv>
          <styled.formSubmitButton onClick={(e) => handleSubmit(e)}>
            Enviar
          </styled.formSubmitButton>
        </styled.formManagerAndSubmitButtonDiv>
      </styled.formContainer>
    </>
  );
};

export default AddEmployee;
