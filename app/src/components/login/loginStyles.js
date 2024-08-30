// loginStyles.js

import styled, { keyframes } from "styled-components";

const progressBarAnimation = keyframes`
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
`;

export const LoginContainer = styled.div`
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const greenLoginBlock = styled.div`
  width: 1147px;
  height: 527px;
  border-radius: 40px;
  position: relative;
  background-image: linear-gradient(
    to bottom right,
    ${(props) => props.theme.colors.secundary_2},
    ${(props) => props.theme.colors.secundary_1}
  );
`;

export const blueLoginBlock = styled.div`
  width: 533px;
  height: 753px;
  position: absolute;
  top: -113px;
  right: 50%;
  transform: translateX(50%);
  background-image: linear-gradient(
    to bottom right,
    ${(props) => props.theme.colors.primary_1},
    ${(props) => props.theme.colors.primary_2}
  );
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BlueLoginBlockBefore = styled.div`
  position: absolute;
  top: -226.3px;
  right: calc(50% - 266px);
  transform: translateX(50%);
  border-top: 113px solid transparent;
  border-right: 113px solid transparent;
  border-left: 113px solid transparent;
  border-bottom: 113px solid ${(props) => props.theme.colors.primary_dark};
  z-index: -1;
`;

export const BlueLoginBlockAfter = styled.div`
  position: absolute;
  bottom: -226.3px;
  left: calc(50% - 493px);
  transform: translateX(50%);
  border-top: 113px solid ${(props) => props.theme.colors.primary_dark};
  border-right: 113px solid transparent;
  border-left: 113px solid transparent;
  border-bottom: 113px solid transparent;
  z-index: -1;
`;

export const LoginTitle = styled.h1`
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-top: 50px;
  margin-bottom: 13px;
`;

export const LoginForm = styled.form`
  width: 100%;
  max-width: 427px;
  height: 300px;
  padding 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;	
`;

export const LoginInput = styled.input`
  width: 100%;
  height: 60px;
  padding: 10px;
  border-radius: 10px;
  border: 3px solid
    ${(props) =>
      props.$loginError
        ? props.theme.colors.primary_1
        : props.theme.colors.danger};
  background-color: rgba(255, 255, 255, 0.9);
  padding-left: 60px;
  position: relative;
  font-size: 16px;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const ErrorOnInputField = styled.div`
  width: 100%;
  height: 30px;
  color: ${(props) => props.theme.colors.danger};
  display: flex;
  align-items: center;
  position: absolute;
  bottom: -30px;
  gap: 7px;
  padding: 0 5px;
  left: 0;
`;

export const FormDiv = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:nth-child(1) {
    margin-bottom: 40px;
  }
  &:nth-child(2) {
    margin-bottom: 30px;
  }
  &:nth-child(3) {
    margin-bottom: 50px;
  }
`;

export const seePasswordDiv = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: min-content;
  height: min-content;
  cursor: pointer;
`;

export const forgotPassP = styled.p`
  font-size: 14px;
  text-align: end;
  color: ${(props) => props.theme.fonts.color};
  font-weight: 100;
  cursor: pointer;
  font-style: italic;

  &:hover {
    color: ${(props) => props.theme.colors.primary_light};
  }
`;

export const keepLoggedDiv = styled.div`
  display: flex;
  align-items: center;
`;
export const keepLoggedInput = styled.input.attrs({ type: "checkbox" })`
  margin: 0 10px;
  width: 15px;
  height: 15px;
  border-color: "black";
`;

export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 1px;
`;

export const StyledCheckbox = styled.label`
  width: 15px;
  height: 15px;
  background: ${(props) => props.theme.colors.background};
  opacity: 0.9;
  border-radius: 10px;
  border: 2px solid ${(props) => props.theme.colors.primary_1};
  transition: all 150ms;
  cursor: pointer;
  margin: 0 10px;

  ${HiddenCheckbox}:checked + & {
    background: ${(props) => props.theme.colors.primary_light};
  }

  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: absolute;
    left: 16px;
    top: 1.5px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  ${HiddenCheckbox}:checked + &::before {
    opacity: 1;
  }
`;

export const KeepLoggedLabel = styled.label`
  font-size: 14px;
  color: ${(props) => props.theme.fonts.color};
  font-weight: 300;
  cursor: pointer;
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 60px;
  background-color: ${(props) => props.theme.colors.secundary_2};
  border-radius: 10px;
  color: ${(props) => props.theme.fonts.color};
  font-size: 16px;
  font-weight: 500;
  cursor: ${(props) => (props.$notAllowed ? "pointer" : "not-allowed")};
`;

export const ErrorMessage = styled.div`
  background: ${(props) => props.theme.colors.dangerBackColor};
  width: 80%;
  height: 70px;
  padding: 20px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.dangerText};
  border-radius: 10px;
  font-size: 16px;
  margin-top: 15px;
  position: relative; 
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: white; 
    animation: ${progressBarAnimation} 2s linear forwards; 
    border-radius: 0 0 10px 10px; 
`;
