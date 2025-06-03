import styled, { keyframes } from "styled-components";

const ProgressBarAnimation = keyframes`
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
`;

export const ToastContainer = styled.div`
  position: absolute;
  top: 100px;
  right: 0;
  z-index: 9999;
  display: flex;
  width: 275px;
  height: 75px;
  padding: 15px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.$danger ? props.theme.colors.danger : props.theme.colors.success};
  background-color: ${(props) => props.theme.fonts.color};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-50%);
    width: 10px;
    height: 100%;
    border-radius: 20%;
    background-color: ${(props) =>
      props.$danger ? props.theme.colors.danger : props.theme.colors.success};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${(props) =>
      props.$danger ? props.theme.colors.danger : props.theme.colors.success};
    animation: ${ProgressBarAnimation} 2s linear forwards;
    border-radius: 0 0 10px 10px;
  }
`;

export const toastBackground = styled.div`
  position: relative;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.colors.primary_dark};

  h1 {
    font-size: 16px;
    color: ${(props) =>
      props.$danger ? props.theme.colors.danger : props.theme.colors.success};
  }

  p {
    font-size: 12px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-color: transparent;
`;
