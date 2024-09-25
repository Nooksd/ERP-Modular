import { useState } from "react";
import * as styled from "./addUsinaStyles.js";
import Calendar from "../../../../shared/includes/calendar/calendar.jsx";

const AddUsina = ({ toastMessage, editData }) => {
  const [openCalendarStart, setOpenCalendarStart] = useState(true);
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);
  const [selectedStartDay, setSelectedStartDay] = useState("");
  const [selectedEndDay, setSelectedEndDay] = useState("");

  const [usinaInfo, setUsinaInfo] = useState({
    name: "",
    location: "",
    cno: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUsinaInfo({ ...usinaInfo, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(usinaInfo);
  };
  return (
    <>
      <styled.formTitle>
        {editData ? "Editar" : "Adicionar"} Usina
      </styled.formTitle>
      <styled.formContainer>
        <styled.formDiv>
          <styled.formLabel>Nome da usina</styled.formLabel>
          <styled.formInput
            name="name"
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formDiv>
          <styled.formLabel>Localização da usina</styled.formLabel>
          <styled.formInput
            name="location"
            onChange={(e) => handleInputChange(e)}
          />
        </styled.formDiv>
        <styled.formDiv>
          <styled.formLabel>CNO da obra</styled.formLabel>
          <styled.formInput
            name="cno"
            type="number"
            onChange={(e) => handleInputChange(e)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
          />
        </styled.formDiv>
        <styled.formInputDiv>
          <styled.formDiv>
            <styled.formLabel>Data Inicial</styled.formLabel>
            <styled.formDateDiv>
              {selectedStartDay}
              {openCalendarStart && (
                <styled.calendarContainer>
                  <Calendar
                    selectedDay={selectedStartDay}
                    onDaySelect={setSelectedStartDay}
                  />
                </styled.calendarContainer>
              )}
            </styled.formDateDiv>
          </styled.formDiv>
          <styled.formDiv>
            <styled.formLabel>DataFinal</styled.formLabel>
            <styled.formDateDiv>
              {selectedEndDay}
              {openCalendarEnd && (
                <styled.calendarContainer>
                  <Calendar
                    selectedDay={selectedEndDay}
                    onDaySelect={setSelectedEndDay}
                  />
                </styled.calendarContainer>
              )}
            </styled.formDateDiv>
          </styled.formDiv>
        </styled.formInputDiv>
        <styled.formSubmitButton onClick={(e) => handleSubmit(e)}>
          Enviar
        </styled.formSubmitButton>
      </styled.formContainer>
    </>
  );
};

export default AddUsina;
