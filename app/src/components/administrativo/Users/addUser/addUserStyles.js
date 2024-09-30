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

export const formContainer = styled.div`
  width: 1000px;
  height: 80%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding-top: 20px;
  gap: 50px;
  align-content: flex-start;
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
  position: relative;

  &:before {
    ${(props) => props.$required && "content: '*';"}
    width: 10px;
    height: 10px;
    position: absolute;
    top: 50%;
    left: -20px;
    font-size: 22px;
    color: ${(props) => props.theme.colors.danger};
  }
`;

export const formInput = styled.input`
  width: 100%;
  min-height: 40px;
  padding: 10px;
  border: 1px solid
    ${(props) =>
      props.$error
        ? props.theme.colors.danger
        : props.theme.colors.primary_dark};
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
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  border: 1px solid
    ${(props) =>
      props.$error
        ? props.theme.colors.danger
        : props.theme.colors.primary_dark};
  background-color: #f6f8fd;
  position: relative;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.primary_dark};
  font-size: 18px;

  span {
    width: 100px;
  }
`;

export const calendarDeleteIconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 10px;

  svg:last-child {
    cursor: pointer;
    path {
      fill: ${(props) => props.theme.colors.danger};
    }
  }
`;

export const calendarContainerStart = styled.div`
  position: absolute;
  z-index: 1000;
  top: -320px;
  left: 20px;
`;

export const calendarContainerEnd = styled.div`
  position: absolute;
  z-index: 1000;
  top: -320px;
  right: 90%;
`;

export const formManagerAndSubmitButtonDiv = styled.div`
  width: 80%;
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 100px;
`;

export const formManagerDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: end;
  justify-content: center;
`;

export const managerAndButtonDiv = styled.div`
  width: 100%;
  min-height: 40px;
  display: flex;
  justify-content: end;
  position: relative;

  &:before {
    content: "*";
    width: 10px;
    height: 10px;
    position: absolute;
    top: 25%;
    left: -20px;
    font-size: 22px;
    color: ${(props) => props.theme.colors.danger};
  }

  &:last-child {
    &:before {
      content: "";
    }
  }
`;

export const formManagerSelect = styled.select`
  width: 100%;
  min-height: 40px;
  padding: 0 10px;
  border: 1px solid
    ${(props) =>
      props.$error
        ? props.theme.colors.danger
        : props.theme.colors.primary_dark};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  position: relative;
`;

export const addNewText = styled.h3`
  width: 100%;
  min-height: 40px;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const formManagerButton = styled.button`
  min-width: 40px;
  min-height: 40px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$new ? "22px" : "28px")};
  color: ${(props) => props.theme.fonts.color};
  background-color: ${(props) =>
    props.$new ? props.theme.colors.success : props.theme.colors.danger};
`;

export const formSubmitButton = styled.button`
  width: 50%;
  min-height: 40px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.secondary_2};
  color: ${(props) => props.theme.fonts.color};
  font-size: 18px;

  svg {
    path {
      fill: ${(props) => props.theme.fonts.color};
    }
  }
`;
