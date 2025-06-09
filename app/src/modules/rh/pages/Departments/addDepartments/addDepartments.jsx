import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { innovaApi } from "@/services/http.js";
import * as styled from "./addDepartmentsStyle.js";

import { fetchEmployees } from "../../../../store/slicers/employeeSlicer.js";

const AddFunction = ({ toastMessage, editData }) => {
  const employees = useSelector((state) => state.employees);
  const [additives, setAdditives] = useState([
    {
      _id: 1,
      additive: "periculosidade",
    },
  ]);

  const [sectorError, setSectorError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [baseSalaryError, setBaseSalaryError] = useState(false);
  const [additivesError, setAdditivesError] = useState([]);

  const [roleInfo, setRoleInfo] = useState({
    sector: "",
    role: "",
    baseSalary: "0,00",
    employeeId: "",
    isField: false,
    additives: [],
  });

  const dispatch = useDispatch();

  const addAdditiveRef = useRef(null);

  useEffect(() => {
    if (!employees || employees.status !== "succeeded") {
      dispatch(fetchEmployees());
    }
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      getRoleInfo();
    }
  }, [editData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "baseSalary") {
      const newBaseSalary = value.replace(/\D/g, "");

      const slicedSalary = newBaseSalary.slice(0, 7);

      const formattedSalary = (slicedSalary / 100)
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      setRoleInfo({ ...roleInfo, baseSalary: formattedSalary });
    } else {
      setRoleInfo({ ...roleInfo, [name]: value });
    }
  };

  const handleRemoveAdditive = (index) => {
    setRoleInfo((prevInfo) => ({
      ...prevInfo,
      additives: prevInfo.additives.filter((_, i) => i !== index),
    }));
  };

  const handleAddNewEmpityAdditive = () => {
    setRoleInfo((prevInfo) => ({
      ...prevInfo,
      additives: [...(prevInfo?.additives ?? []), ""],
    }));

    setTimeout(() => {
      addAdditiveRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleSelectAdditive = (additive, index) => {
    const newAdditives = [...roleInfo.additives];
    newAdditives[index] = additive;
    setRoleInfo({ ...roleInfo, additives: newAdditives });
  };

  const handleSubmit = async () => {
    if (fieldValidator()) {
      try {
        let response;

        const newRoleInfo = {
          role: roleInfo.role,
          sector: roleInfo.sector,
          baseSalary: parseFloat(
            roleInfo.baseSalary.replace(".", "").replace(",", ".")
          ),
          employeeId: roleInfo.employeeId,
          isField: roleInfo.isField,
          additives: roleInfo.additives,
        };

        if (editData) {
          response = await innovaApi.put(
            `/rh/role/update/${editData}`,
            newRoleInfo
          );
        } else {
          response = await innovaApi.post("/rh/role/create", newRoleInfo);
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

    if (!roleInfo.sector) {
      setSectorError(true);
      isValid = false;
    } else {
      setSectorError(false);
    }
    if (!roleInfo.role) {
      setRoleError(true);
      isValid = false;
    } else {
      setRoleError(false);
    }
    if (!roleInfo.baseSalary || roleInfo.baseSalary.length < 8) {
      setBaseSalaryError(true);
      isValid = false;
    } else {
      setBaseSalaryError(false);
    }

    roleInfo.additives.map((additive, index) => {
      if (additive === "") {
        const newAdditiveErrors = [...additivesError];
        newAdditiveErrors[index] = true;
        setAdditivesError(newAdditiveErrors);
        isValid = false;
      } else {
        const newAdditiveErrors = [...additivesError];
        newAdditiveErrors[index] = false;
        setAdditivesError(newAdditiveErrors);
      }
    });

    return isValid;
  }

  async function getRoleInfo() {
    try {
      const response = await innovaApi.get(`/rh/role/get-one/${editData}`);
      const result = response.data.role;

      const newRoleInfo = {
        sector: result.sector,
        role: result.role,
        employeeId: result.employeeId,
        baseSalary: result.baseSalary
          .toFixed(2)
          .replace(".", ",")
          .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        isField: result.isField,
        additives: result.additives,
      };

      setRoleInfo(newRoleInfo);

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
        {editData ? "Editar" : "Adicionar"} Função
      </styled.formTitle>
      <styled.formContainer>
        <styled.formDiv $required={true}>
          <styled.formLabel>Setor da função</styled.formLabel>
          <styled.formInput
            name="sector"
            $error={sectorError}
            value={roleInfo.sector}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formDiv $required={true}>
          <styled.formLabel>Nome da função</styled.formLabel>
          <styled.formInput
            name="role"
            $error={roleError}
            value={roleInfo.role}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formManagerAndSubmitButtonDiv>
          <styled.formDiv $required={true}>
            <styled.formLabel>Salário base</styled.formLabel>
            <styled.formInput
              name="baseSalary"
              $error={baseSalaryError}
              value={roleInfo.baseSalary}
              onChange={(e) => handleInputChange(e)}
            />
          </styled.formDiv>
          <styled.formDiv style={{ width: 100 }}>
            <styled.formLabel style={{ padding: 0 }}>
              função de campo
            </styled.formLabel>
            <styled.formManagerSwitch
              onClick={() => {
                setRoleInfo((prevInfo) => ({
                  ...prevInfo,
                  isField: !prevInfo.isField,
                }));
              }}
            >
              <styled.formManagerSwitchButton $active={roleInfo.isField} />
            </styled.formManagerSwitch>
          </styled.formDiv>
        </styled.formManagerAndSubmitButtonDiv>
        <styled.formManagerAndSubmitButtonDiv>
          <styled.formManagerDiv>
            {roleInfo.additives &&
              roleInfo.additives.map((additive, index) => (
                <styled.managerAndButtonDiv key={index}>
                  <styled.formManagerSelect
                    $error={additivesError[index]}
                    value={additive}
                    onChange={(e) =>
                      handleSelectAdditive(e.target.value, index)
                    }
                  >
                    <option value="">Selecionar página</option>
                    {additives &&
                      additives.map((additive) => {
                        if (
                          roleInfo.additives.includes(additive.additive) &&
                          roleInfo.additives[index] !== additive.additive
                        )
                          return null;
                        return (
                          <option key={additive._id} value={additive.additive}>
                            {additive.additive}
                          </option>
                        );
                      })}
                  </styled.formManagerSelect>
                  <styled.formManagerButton
                    onClick={() => handleRemoveAdditive(index)}
                  >
                    -
                  </styled.formManagerButton>
                </styled.managerAndButtonDiv>
              ))}
            <styled.managerAndButtonDiv>
              {roleInfo.additives && roleInfo.additives.length === 0 && (
                <styled.addNewText>Adicionar aditivo</styled.addNewText>
              )}
              <styled.formManagerButton
                style={{ borderRadius: "5pc" }}
                $new={true}
                onClick={() => handleAddNewEmpityAdditive()}
                ref={addAdditiveRef}
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

export default AddFunction;
