import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { innovaApi } from "../../../../services/http.js";
import * as styled from "./addUserStyles.js";

import { fetchEmployees } from "../../../../store/slicers/employeeSlicer.js";

const AddUser = ({ toastMessage, editData }) => {
  const employees = useSelector((state) => state.employees);
  const [pages, setPages] = useState([]);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [employeeIdError, setEmployeeIdError] = useState(false);
  const [pagesError, setPagesError] = useState([]);

  const [userInfo, setUserInfo] = useState({
    name: "",
    avatar: "",
    email: "",
    password: "",
    employeeId: "",
    isManager: false,
    pages: [],
  });

  const dispatch = useDispatch();

  const addPageRef = useRef(null);

  useEffect(() => {
    if (!employees || employees.status !== "succeeded") {
      dispatch(fetchEmployees());
    }
  }, [dispatch]);

  useEffect(() => {
    getPages();
  }, []);

  useEffect(() => {
    if (editData) {
      getUserInfo();
    }
  }, [editData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleRemovePage = (index) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      pages: prevInfo.pages.filter((_, i) => i !== index),
    }));
  };

  const handleAddNewEmpityPage = () => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      pages: [...prevInfo.pages, ""],
    }));

    setTimeout(() => {
      addPageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleSelectPage = (page, index) => {
    const newPages = [...userInfo.pages];
    newPages[index] = page;
    setUserInfo({ ...userInfo, pages: newPages });
  };

  const handleSubmit = async () => {
    if (fieldValidator()) {
      try {
        let response;
        if (editData) {
          response = await innovaApi.put(
            `/user/update/${editData}`,
            userInfo
          );
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

    userInfo.pages.map((page, index) => {
      if (page === "") {
        const newPageErrors = [...pagesError];
        newPageErrors[index] = true;
        setPagesError(newPageErrors);
        isValid = false;
      } else {
        const newPageErrors = [...pagesError];
        newPageErrors[index] = false;
        setPagesError(newPageErrors);
      }
    });

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
        pages: result.pages,
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

  async function getPages() {
    try {
      const response = await innovaApi.get("/page/get-all");
      const result = response.data.pages;
      setPages(result);
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Erro",
        message: "Erro ao buscar páginas",
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
              {employees.employees.map((employee) => (
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
          <styled.formManagerDiv>
            {userInfo.pages.map((page, index) => (
              <styled.managerAndButtonDiv key={index}>
                <styled.formManagerSelect
                  $error={pagesError[index]}
                  value={page}
                  onChange={(e) => handleSelectPage(e.target.value, index)}
                >
                  <option value="">Selecionar página</option>
                  {pages.map((page) => {
                    if (
                      userInfo.pages.includes(page.title) &&
                      userInfo.pages[index] !== page.title
                    )
                      return null;
                    return (
                      <option key={page.title} value={page.title}>
                        {page.title}
                      </option>
                    );
                  })}
                </styled.formManagerSelect>
                <styled.formManagerButton
                  onClick={() => handleRemovePage(index)}
                >
                  -
                </styled.formManagerButton>
              </styled.managerAndButtonDiv>
            ))}
            <styled.managerAndButtonDiv>
              {userInfo.pages.length === 0 && (
                <styled.addNewText>Adicionar acesso a página</styled.addNewText>
              )}
              <styled.formManagerButton
                style={{ borderRadius: "5pc" }}
                $new={true}
                onClick={() => handleAddNewEmpityPage()}
                ref={addPageRef}
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

export default AddUser;
