import { useEffect, useState, useRef } from "react";
import { innovaApi } from "../../../../services/http.js";
import * as styled from "./addAreaStyles.js";

const AddArea = ({ toastMessage, editData }) => {
  const [areaError, setAreaError] = useState(false);
  const [activitiesError, setActivitiesError] = useState([]);

  const [areaInfo, setAreaInfo] = useState({
    area: "",
    activities: [],
  });

  const addActivityRef = useRef(null);

  useEffect(() => {
    if (editData) {
      getAreaInfo();
    }
  }, [editData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAreaInfo({ ...areaInfo, [name]: value });
  };

  const handleRemoveActivity = (index) => {
    setAreaInfo((prevInfo) => ({
      ...prevInfo,
      activities: prevInfo.activities.filter((_, i) => i !== index),
    }));
  };

  const handleAddNewEmpityActivity = () => {
    setAreaInfo((prevInfo) => ({
      ...prevInfo,
      activities: [
        ...prevInfo.activities,
        {
          activity: "",
          subactivities: [],
        },
      ],
    }));

    setTimeout(() => {
      addActivityRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleActivitySelect = (value, index) => {
    const newActivities = [...areaInfo.activities];
    newActivities[index] = {
      activity: value,
      subactivities: newActivities[index].subactivities,
    };
    setAreaInfo({ ...areaInfo, activities: newActivities });
  };

  const handleSubmit = async () => {
    if (fieldValidator()) {
      try {
        let response;
        if (editData) {
          response = await innovaApi.put(
            `/activity/update/${editData}`,
            areaInfo
          );
        } else {
          response = await innovaApi.post("/activity/create", areaInfo);
        }

        console.log(areaInfo);

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

    if (!areaInfo.area) {
      setAreaError(true);
      isValid = false;
    } else {
      setAreaError(false);
    }

    areaInfo.activities.map((activity, index) => {
      if (activity.activity === "") {
        const newActivityErrors = [...activitiesError];
        newActivityErrors[index] = true;
        setActivitiesError(newActivityErrors);
        isValid = false;
      } else {
        const newActivityErrors = [...activitiesError];
        newActivityErrors[index] = false;
        setActivitiesError(newActivityErrors);
      }
    });

    return isValid;
  }

  async function getAreaInfo() {
    try {
      const response = await innovaApi.get(`/activity/get-one/${editData}`);
      const result = response.data.activity;

      const newAreaInfo = {
        area: result.area,
        activities: result.activities,
      };

      setAreaInfo(newAreaInfo);

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
        {editData ? "Editar" : "Adicionar"} Área
      </styled.formTitle>
      <styled.formContainer>
        <styled.formDiv $required={true}>
          <styled.formLabel>Nome da área</styled.formLabel>
          <styled.formInput
            name="area"
            $error={areaError}
            value={areaInfo.area}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formManagerAndSubmitButtonDiv>
          <styled.formManagerDiv>
            {areaInfo.activities.map((activity, index) => (
              <styled.managerAndButtonDiv key={index}>
                <styled.formInput
                  name="activities"
                  $error={activitiesError[index]}
                  value={activity.activity}
                  onChange={(e) => handleActivitySelect(e.target.value, index)}
                />
                <styled.formManagerButton
                  onClick={() => handleRemoveActivity(index)}
                >
                  -
                </styled.formManagerButton>
              </styled.managerAndButtonDiv>
            ))}
            <styled.managerAndButtonDiv>
              {areaInfo.activities.length === 0 && (
                <styled.addNewText>Adicionar atividade</styled.addNewText>
              )}
              <styled.formManagerButton
                style={{ borderRadius: "5pc" }}
                $new={true}
                onClick={() => handleAddNewEmpityActivity()}
                ref={addActivityRef}
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

export default AddArea;
