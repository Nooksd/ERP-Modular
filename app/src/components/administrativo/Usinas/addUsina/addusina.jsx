import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { innovaApi } from "../../../../services/http.js";
import * as styled from "./addUsinaStyles.js";

import Calendar from "../../../../shared/includes/calendar/calendar.jsx";

import SVGCalendar from "../../../../shared/icons/controleHH/calendar_icon.jsx";
import SVGDelete from "../../../../shared/icons/controleHH/Delete_icon.jsx";
import { fetchAppUsers } from "../../../../store/slicers/appUsersSlicer.js";

const AddUsina = ({ toastMessage, editData }) => {
  const appUsers = useSelector((state) => state.appUsers);

  const [openCalendarStart, setOpenCalendarStart] = useState(false);
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);
  const [selectedStartDay, setSelectedStartDay] = useState("");
  const [selectedEndDay, setSelectedEndDay] = useState("");

  const [nameError, setNameError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [cnoError, setCnoError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [managerError, setManagerError] = useState([]);

  const [usinaInfo, setUsinaInfo] = useState({
    name: "",
    location: "",
    cno: "",
    startDate: "",
    endDate: "",
    managerIds: [],
  });

  const dispatch = useDispatch();

  const addManagerRef = useRef(null);

  useEffect(() => {
    if (!appUsers || appUsers.status !== "succeeded") {
      dispatch(fetchAppUsers());
    }
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      getUsinaInfo();
    }
  }, [editData]);

  useEffect(() => {
    if (selectedStartDay) {
      const formattedDate = selectedStartDay.replace(
        /(\d{2})(\d{2})(\d{4})/,
        "$1/$2/$3"
      );

      setUsinaInfo((prevInfo) => ({
        ...prevInfo,
        startDate: formattedDate,
        endDate: "",
      }));
      setSelectedEndDay("");
    } else {
      setUsinaInfo((prevInfo) => ({
        ...prevInfo,
        startDate: "",
        endDate: "",
      }));
    }
  }, [selectedStartDay]);

  useEffect(() => {
    if (selectedEndDay) {
      const formattedDate = selectedEndDay.replace(
        /(\d{2})(\d{2})(\d{4})/,
        "$1/$2/$3"
      );

      setUsinaInfo((prevInfo) => ({
        ...prevInfo,
        endDate: formattedDate,
      }));
    } else {
      setUsinaInfo((prevInfo) => ({
        ...prevInfo,
        endDate: "",
      }));
    }
  }, [selectedEndDay]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "cno") {
      const cno = value.slice(0, 12);
      setUsinaInfo({ ...usinaInfo, [name]: cno });
    } else {
      setUsinaInfo({ ...usinaInfo, [name]: value });
    }
  };

  const handleRemoveManagerId = (index) => {
    setUsinaInfo((prevInfo) => ({
      ...prevInfo,
      managerIds: prevInfo.managerIds.filter((_, i) => i !== index),
    }));
  };

  const handleAddNewEmpityManagerId = () => {
    setUsinaInfo((prevInfo) => ({
      ...prevInfo,
      managerIds: [...prevInfo.managerIds, ""],
    }));

    setTimeout(() => {
      addManagerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleSelectManager = (managerId, index) => {
    const newManagerIds = [...usinaInfo.managerIds];
    newManagerIds[index] = managerId;
    setUsinaInfo({ ...usinaInfo, managerIds: newManagerIds });
  };

  const handleSubmit = async () => {
    if (fieldValidator()) {
      try {
        const formatDate = (dateStr) => {
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month}-${day}`;
        };

        let newUsinaInfo = {
          ...usinaInfo,
          startDate: formatDate(usinaInfo.startDate),
          endDate: usinaInfo.endDate ? formatDate(usinaInfo.endDate) : null,
        };

        let response;
        if (editData) {
          response = await innovaApi.put(
            `/work/update-work/${editData}`,
            newUsinaInfo
          );
        } else {
          response = await innovaApi.post("/work/add-work", newUsinaInfo);
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

    if (!usinaInfo.name) {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }
    if (!usinaInfo.location) {
      setLocationError(true);
      isValid = false;
    } else {
      setLocationError(false);
    }
    if (!usinaInfo.cno || usinaInfo.cno.length !== 12) {
      setCnoError(true);
      isValid = false;
    } else {
      setCnoError(false);
    }
    if (!usinaInfo.startDate) {
      setStartDateError(true);
      isValid = false;
    } else {
      setStartDateError(false);
    }

    usinaInfo.managerIds.map((managerId, index) => {
      if (managerId === "") {
        const newManagerErros = [...managerError];
        newManagerErros[index] = true;
        setManagerError(newManagerErros);
        isValid = false;
      } else {
        const newManagerErros = [...managerError];
        newManagerErros[index] = false;
        setManagerError(newManagerErros);
      }
    });

    return isValid;
  }

  async function getUsinaInfo() {
    try {
      const response = await innovaApi.get(`/work/get-one/${editData}`);
      const result = response.data.work;

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const newUsinaInfo = {
        cno: String(result.cno),
        location: result.location,
        managerIds: result.managerIds,
        name: result.name,
        startDate: formatDate(result.startDate),
        endDate: result.endDate ? formatDate(result.endDate) : null,
      };

      setUsinaInfo(newUsinaInfo);

      toastMessage({
        danger: false,
        title: "Sucesso",
        message: response.data.message,
      });
    } catch (e) {
      toastMessage({
        danger: true,
        title: "Erro",
        message: "Erro ao buscar dados da usina",
      });
    }
  }

  return (
    <>
      <styled.formTitle>
        {editData ? "Editar" : "Adicionar"} Usina
      </styled.formTitle>
      <styled.formContainer>
        <styled.formDiv $required={true}>
          <styled.formLabel>Nome da usina</styled.formLabel>
          <styled.formInput
            name="name"
            $error={nameError}
            value={usinaInfo.name}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formDiv $required={true}>
          <styled.formLabel>Localização da usina</styled.formLabel>
          <styled.formInput
            name="location"
            $error={locationError}
            value={usinaInfo.location}
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formDiv $required={true}>
          <styled.formLabel>CNO da obra</styled.formLabel>
          <styled.formInput
            name="cno"
            $error={cnoError}
            value={usinaInfo.cno}
            max="12"
            min="12"
            type="number"
            onChange={(e) => handleInputChange(e)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
          />
        </styled.formDiv>
        <styled.formInputDiv>
          <styled.formDiv $required={true}>
            <styled.formLabel>Data Inicial</styled.formLabel>
            <styled.formDateDiv $error={startDateError}>
              <span>{usinaInfo.startDate}</span>
              <styled.calendarDeleteIconDiv>
                {openCalendarStart && (
                  <styled.calendarContainerStart>
                    <Calendar
                      selectedDay={selectedStartDay}
                      onDaySelect={setSelectedStartDay}
                      allowFuture={true}
                    />
                  </styled.calendarContainerStart>
                )}
                <SVGCalendar
                  onClick={() => {
                    setOpenCalendarEnd(false);
                    setOpenCalendarStart((prev) => !prev);
                  }}
                />
                <SVGDelete
                  width="20"
                  height="20"
                  onClick={() => setSelectedStartDay("")}
                />
              </styled.calendarDeleteIconDiv>
            </styled.formDateDiv>
          </styled.formDiv>
          <styled.formDiv>
            <styled.formLabel>DataFinal</styled.formLabel>
            <styled.formDateDiv>
              <span>{usinaInfo.endDate}</span>
              <styled.calendarDeleteIconDiv>
                {openCalendarEnd && (
                  <styled.calendarContainerEnd>
                    <Calendar
                      selectedDay={selectedEndDay}
                      onDaySelect={setSelectedEndDay}
                      allowFuture={true}
                      minDate={selectedStartDay}
                    />
                  </styled.calendarContainerEnd>
                )}
                <SVGCalendar
                  onClick={() => {
                    if (selectedStartDay) {
                      setOpenCalendarStart(false);
                      setOpenCalendarEnd((prev) => !prev);
                    }
                  }}
                />
                <SVGDelete
                  width="20"
                  height="20"
                  onClick={() => setSelectedEndDay("")}
                />
              </styled.calendarDeleteIconDiv>
            </styled.formDateDiv>
          </styled.formDiv>
        </styled.formInputDiv>
        <styled.formManagerAndSubmitButtonDiv>
          <styled.formManagerDiv>
            {usinaInfo.managerIds.map((managerId, index) => {
              return (
                <styled.managerAndButtonDiv key={index}>
                  <styled.formManagerSelect
                    $error={managerError[index]}
                    value={managerId}
                    onChange={(e) => handleSelectManager(e.target.value, index)}
                  >
                    <option value="">Selecionar usuário gestor</option>
                    {appUsers.appUsers.map((user) => {
                      if (
                        usinaInfo.managerIds.includes(user._id) &&
                        usinaInfo.managerIds[index] !== user._id
                      )
                        return null;
                      return (
                        <option key={user._id} value={user._id}>
                          {user.name}
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
              );
            })}
            <styled.managerAndButtonDiv>
              {usinaInfo.managerIds.length === 0 && (
                <styled.addNewText>
                  Adicionar usuário gestor da usina
                </styled.addNewText>
              )}
              <styled.formManagerButton
                style={{ borderRadius: "5pc" }}
                $new={true}
                onClick={() => handleAddNewEmpityManagerId()}
                ref={addManagerRef}
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

export default AddUsina;
