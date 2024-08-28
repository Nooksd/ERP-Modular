// loginStyles.js

import styled from "styled-components";

export const LoginContainer = styled.div`
  width: 100%;
  height: 100dvh;
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
  justify-content: center;
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
  margin-bottom: 15px;
`;

export const LoginForm = styled.form`
  width: 100%;
  max-width: 427px;
  height: 300px;
  padding 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

export const LoginInput = styled.input`
  width: 100%;
  height: 60px;
  padding: 10px;
  border-radius: 10px;
  border: 3px solid ${(props) => props.theme.colors.primary_1};
  background-color: rgba(255, 255, 255, 0.9);
`;
