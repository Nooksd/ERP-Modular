import styled from "styled-components";

export const formTitle = styled.h1`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const formContainer = styled.form`
  width: 700px;
  height: 80%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-top: 3px solid ${(props) => props.theme.colors.primary_dark};
  border-bottom: 1px solid ${(props) => props.theme.colors.primary_dark};
  background-color: ${(props) => props.theme.fonts.color};
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.primary_2};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.secondary_2};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.secondary_1};
  }
`;

export const formDiv = styled.div`
  width: 80%;
`;

export const formInput = styled.input`
  width: 100%;
  min-height: 40px;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.primary_dark};
  border-radius: 5px;
  color: ${(props) => props.theme.colors.primary_dark};
  font-size: 18px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &: [type=number] {
    -moz-appearance: textfield;
  }
`;

export const formLabel = styled.label`
  width: 80%;
  min-height: 40px;
  padding: 10px;
  color: ${(props) => props.theme.colors.primary_dark};
  font-size: 18px;
`;

export const formInputDiv = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10%;
`;

export const formDateDiv = styled.div`
  width: 100%;
  min-height: 40px;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.primary_dark};
  background-color: #f6f8fd;
  position: relative;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.primary_dark};
  font-size: 18px;
`;

export const calendarContainer = styled.div`
  position: absolute;
  z-index: 1000;
  top: -320px;
  left: 80%;
`;

export const formSubmitButton = styled.button`
  width: 30%;
  min-height: 40px;
  margin-top: 30px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.secondary_2};
  color: ${(props) => props.theme.fonts.color};
  font-size: 18px;
`;
