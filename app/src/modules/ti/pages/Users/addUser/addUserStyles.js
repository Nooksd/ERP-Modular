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
  padding: 20px 0;
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

  &[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
`;

export const formLabel = styled.label`
  width: 80%;
  min-height: 40px;
  padding: 10px;
  color: ${(props) => props.theme.colors.primary_dark};
  font-size: 18px;
  white-space: nowrap;
`;

export const formInputDiv = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10%;
`;

export const formManagerAndSubmitButtonDiv = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  align-items: start;
  justify-content: start;
  gap: 100px;
`;

export const formManagerSwitch = styled.div`
  width: 40px;
  height: 30px;
  margin-left: 40px;
  border: none;
  position: relative;
  background-color: ${(props) => props.theme.colors.grey};
  cursor: pointer;

  &:before {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.grey};
    position: absolute;
    top: 0;
    left: -18px;
  }

  &:after {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.grey};
    position: absolute;
    top: 0;
    right: -18px;
  }
`;

export const formManagerSwitchButton = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: ${(props) => (props.$active ? "28px" : "-12px")};
  transition: left 0.3s ease;
  transform: translateY(-50%);
  background-color: ${(props) =>
    props.$active
      ? props.theme.colors.secondary_2
      : props.theme.colors.primary_dark};
  z-index: 2;
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
