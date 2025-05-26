import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { innovaApi } from "../../../../services/http.js";
import * as styled from "./addUserStyles.js";

import { fetchEmployees } from "../../../../store/slicers/employeeSlicer.js";

const AddUser = ({ toastMessage, editData }) => {
  const employees = useSelector((state) => state.employees);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [employeeIdError, setEmployeeIdError] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    avatar: "",
    email: "",
    password: "",
    employeeId: "",
    isManager: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!employees || employees.status !== "succeeded") {
      dispatch(fetchEmployees());
    }
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      getUserInfo();
    }
  }, [editData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async () => {
    if (fieldValidator()) {
      try {
        let response;
        if (editData) {
          response = await innovaApi.put(`/user/update/${editData}`, userInfo);
        } else {
          response = await innovaApi.post("/user/create", userInfo);
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

    if (!userInfo.name) {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }
    if (!userInfo.email) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }
    if ((!userInfo.password || userInfo.password.length < 5) && !editData) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    if (!userInfo.employeeId) {
      setEmployeeIdError(true);
      isValid = false;
    } else {
      setEmployeeIdError(false);
    }

    return isValid;
  }

  async function getUserInfo() {
    try {
      const response = await innovaApi.get(`/user/get-one/${editData}`);
      const result = response.data.user;

      const newUserInfo = {
        avatar: result.avatar,
        name: result.name,
        employeeId: result.employeeId,
        email: result.email,
        password: "",
        isManager: result.isManager,
      };

      setUserInfo(newUserInfo);

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

  return (
    <>
      <styled.formTitle>
        {editData ? "Editar" : "Adicionar"} Usuário
      </styled.formTitle>
      <styled.formContainer>
        <styled.formDiv $required={true}>
          <styled.formLabel>Nome do usuário</styled.formLabel>
          <styled.formInput
            name="name"
            $error={nameError}
            value={userInfo.name}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        {/* <styled.formDiv $required={true}>
          <styled.formLabel>Avatar do perfil</styled.formLabel>
          <styled.formInput
            name="avatar"
            value={userInfo.avatar}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv> */}
        <styled.formDiv $required={true}>
          <styled.formLabel>Email</styled.formLabel>
          <styled.formInput
            name="email"
            $error={emailError}
            value={userInfo.email}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formDiv $required={true}>
          <styled.formLabel>Senha</styled.formLabel>
          <styled.formInput
            name="password"
            $error={passwordError}
            value={userInfo.password}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formManagerAndSubmitButtonDiv>
          <styled.formDiv>
            <styled.formLabel>funcionário da conta</styled.formLabel>
            <styled.formManagerSelect
              $error={employeeIdError}
              value={userInfo.employeeId}
              name="employeeId"
              onChange={(e) => handleInputChange(e)}
            >
              <option value="">Selecionar funcionário</option>
              {employees.employees &&
                employees.employees.map((employee) => (
                  <option key={employee.name} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
            </styled.formManagerSelect>
          </styled.formDiv>
          <styled.formDiv style={{ width: 100 }}>
            <styled.formLabel style={{ padding: 0 }}>
              funcionário Gestor
            </styled.formLabel>
            <styled.formManagerSwitch
              onClick={() => {
                setUserInfo((prevInfo) => ({
                  ...prevInfo,
                  isManager: !prevInfo.isManager,
                }));
              }}
            >
              <styled.formManagerSwitchButton $active={userInfo.isManager} />
            </styled.formManagerSwitch>
          </styled.formDiv>
        </styled.formManagerAndSubmitButtonDiv>
        <styled.formManagerAndSubmitButtonDiv>
          <styled.formSubmitButton onClick={(e) => handleSubmit(e)}>
            Enviar
          </styled.formSubmitButton>
        </styled.formManagerAndSubmitButtonDiv>
      </styled.formContainer>
    </>
  );
};

export default AddUser;
