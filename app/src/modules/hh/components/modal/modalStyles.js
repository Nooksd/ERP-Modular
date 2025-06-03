import styled from "styled-components";

export const modalBackgroundDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const modalContainerDiv = styled.div`
  width: 550px;
  position: relative;
  height: 300px;
  z-index: 10000;
  border-radius: 5px;
  padding: 20px;
  background-color: ${(props) => props.theme.fonts.color};
  border: 2px solid ${(props) => props.theme.colors.primary_1};
  box-shadow: 10px 10px 0 ${(props) => props.theme.colors.primary_1};
  overflow: hidden;
`;

export const modalTitleDiv = styled.div`
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
  margin-bottom: 20px;
  position: relative;
  color: ${(props) => props.theme.colors.primary_dark};

  &:before {
    content: "";
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 2px;
    background-color: ${(props) => props.theme.colors.secondary_1};
  }
`;

export const modalContentDiv = styled.div`
  width: 100%;
  height: 150px;
  font-size: 16px;
  line-height: 24px;
  padding: 0 20px;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.primary_dark};
  white-space: pre-wrap;
  overflow-wrap: break-word;
  text-align: justify;
  overflow-y: scroll;

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

export const modalAlertSvgDiv = styled.div`
  width: 50%;
  height: 100%;
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: start;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  svg {
    margin-left: -60px;
    margin-bottom: -60px;
    path {
      fill: ${(props) => props.theme.colors.primary_1};
    }
  }
`;

export const responseButtonDiv = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 30px;
`;

export const responseButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => props.theme.colors.secondary_2};
  color: ${(props) => props.theme.fonts.color};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary_1};
  }
`;
