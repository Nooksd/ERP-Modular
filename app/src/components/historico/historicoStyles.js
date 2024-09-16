import styled from "styled-components";

export const contentDiv = styled.div`
  width: 100%;
  height: calc(${(props) => props.$windowHeight}px - 75px);
  padding: 15px 20px;
  position: relative;
  display: inline-block;
  `;
  
  export const content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 3px solid
    ${(props) =>
      props.$error ? props.theme.colors.danger : props.theme.colors.grey};
`;
export const titleDiv = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: start;
  padding-left: 55px;
  border-bottom: 3px solid ${(props) => props.theme.colors.grey};
  font-size: 20px;
  font-weight: 600;
  position: relative;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const Division = styled.nav`
  width: 2px;
  height: 80%;
  margin: 0 15px;
  background-color: ${(props) => props.theme.colors.grey};
`;

export const containerWrapper = styled.div`
  position: relative;
`;

export const calendarContainer = styled.div`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 100%;
`;

export const WorkSelect = styled.select`
  width: 400px;
  height: 100%;
`;

export const hhRecordDiv = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(${(props) => props.$windowHeight}px - 253px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 15px;
  padding: 20px;
  margin: 10px 1px 0 0;
  overflow-y: scroll;
  border-bottom: 3px solid ${(props) => props.theme.colors.grey};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.primary_2};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.secundary_2};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.secundary_1};
  }
`;
