import styled from "styled-components";

export const calendarContainer = styled.div`
  width: 400px;
  height: 335px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  border: 3px solid ${(props) => props.theme.colors.grey};
  margin: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
`;

export const calendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  font-size: 18px;
  font-weight: 500;
`;

export const calendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  width: 100%;
`;

export const prevNextButton = styled.button`
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary_2};
  color: ${(props) => props.theme.fonts.color};

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const calendarDay = styled.div`
  padding: 5px;
  text-align: center;
  border-radius: 5px;

  cursor: ${(props) =>
    props.$isDisabled || props.$isDayOfWeek ? "default" : "pointer"};

  background-color: ${(props) =>
    props.$isSelected
      ? props.theme.colors.secondary_2
      : props.$isBetween
      ? props.theme.colors.secondary_1
      : "transparent"};

  color: ${(props) =>
    props.$isDisabled
      ? props.theme.colors.grey
      : props.$isSelected || props.$isBetween
      ? props.theme.fonts.color
      : props.theme.colors.primary_dark};

  opacity: ${(props) => (props.$isDisabled ? 0.5 : props.$isBetween ? 0.5 : 1)};

  &:hover {
    background-color: ${(props) =>
      !props.$isDisabled &&
      !props.$isDayOfWeek &&
      props.theme.colors.secondary_2};
    color: ${(props) =>
      props.$isDisabled
        ? props.theme.colors.grey
        : props.$isDayOfWeek
        ? props.theme.colors.primary_dark
        : props.theme.fonts.color};
  }
`;
