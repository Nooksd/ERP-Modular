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
  border-bottom: 3px solid
    ${(props) =>
      props.$error ? props.theme.colors.danger : props.theme.colors.grey};
  font-size: 20px;
  font-weight: 600;
  position: relative;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const Division = styled.nav`
  width: 3px;
  height: 100%;
  margin: 0 15px;
  background-color: ${(props) =>
    props.$error ? props.theme.colors.danger : props.theme.colors.grey};
`;

export const containerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
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
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary_dark};

  option {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const orderH4 = styled.h4`
  font-size: 16px;
  font-weight: 600;
`;

export const historyDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  margin: 10px 1px 0 0;
  overflow-y: auto;
  border-bottom: 3px solid ${(props) => props.theme.colors.grey};

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

export const empityHHRecordP = styled.p`
  font-size: 22px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const recordWraperDiv = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

export const RecordDiv = styled.div`
  width: inherit;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  border: 3px solid ${(props) => props.theme.colors.grey};
  border-radius: 10px;
`;

export const recordIndexH4 = styled.h4`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary_1};
`;

export const recordDateH4 = styled.h4`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary_dark};

  position: relative;
  &:before {
    content: "Data enviada";
    width: max-content;
    display: inline-block;
    position: absolute;
    top: -13px;
    right: 50%;
    transform: translateX(50%);
    font-size: 10px;
    color: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const recordActivitiesDiv = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary_dark};

  position: relative;
  &:before {
    content: "Número de Atividades";
    width: max-content;
    position: absolute;
    top: -13px;
    right: 50%;
    transform: translateX(50%);
    font-size: 10px;
    color: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const recordRolesDiv = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary_dark};

  position: relative;
  &:before {
    content: "Número de Funções";
    width: max-content;
    position: absolute;
    top: -13px;
    right: 50%;
    transform: translateX(50%);
    font-size: 10px;
    color: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const recordHoursDiv = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary_dark};

  position: relative;
  &:before {
    content: "Total de horas";
    width: max-content;
    position: absolute;
    top: -13px;
    right: 50%;
    transform: translateX(50%);
    font-size: 10px;
    color: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const EditButton = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 3px solid ${(props) => props.theme.colors.primary_1};
  cursor: pointer;
  font-size: 26px;

  svg {
    path {
      fill: ${(props) => props.theme.colors.primary_1};
    }
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.primary_1};

    svg {
      path {
        fill: ${(props) => props.theme.fonts.color};
      }
    }
  }
`;

export const DeleteButton = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 3px solid ${(props) => props.theme.colors.danger};
  cursor: pointer;
  font-size: 26px;

  svg {
    path {
      fill: ${(props) => props.theme.colors.danger};
    }
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.danger};

    svg {
      path {
        fill: ${(props) => props.theme.fonts.color};
      }
    }
  }
`;

export const HistoryControllDiv = styled.div`
  width: 100%;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding-right: 50px;
  position: relative;
`;

export const controllButton = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.secondary_1};
  color: ${(props) => props.theme.fonts.color};
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const controllSelect = styled.select`
  width: 200px;
  height: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary_dark};

  option {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary_dark};
  }
`;
