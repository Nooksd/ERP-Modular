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
  position: relative;
  flex-direction: column;
  overflow-y: auto;

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

export const greenBackground = styled.div`
  width: 100%;
  height: 170px;
  background-image: linear-gradient(
    to bottom right,
    ${(props) => props.theme.colors.secondary_2},
    ${(props) => props.theme.colors.secondary_1}
  );
`;

export const titleContainer = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 70px;
`;

export const title = styled.div`
  height: 40px;
  border-left: 3px solid ${(props) => props.theme.fonts.color};
  color: ${(props) => props.theme.fonts.color};
  font-size: 26px;
  font-weight: 700;
  padding-left: 16px;
  display: flex;
  align-items: center;
`;

export const controllContainer = styled.div`
  width: auto;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
`;

export const yearSelector = styled.div`
  width: auto;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
`;

export const year = styled.button`
  width: 60px;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.primary_dark};
  background-color: ${(props) => props.theme.fonts.color};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:first-child {
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: ${(props) => props.theme.colors.primary_dark};
    }
  }
`;

export const filter = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => props.theme.fonts.color};
`;

export const workSelect = styled.select`
  width: 260px;
  height: 40px;
  cursor: pointer;
  font-weight: 400;
  font-size: 16px;
  padding: 0 15px;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
  color: ${(props) => props.theme.colors.primary_dark};
  background-color: ${(props) => props.theme.fonts.color};
`;

export const eraseFilter = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  background: none;
`;

export const dashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: -85px;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1.1fr 1.5fr 1.5fr 0.3fr;
  grid-auto-flow: dense;
  gap: 24px 70px;
  padding: 24px 70px;
`;

export const sideGrapchContainer = styled.div`
  width: 100%;
  min-width: 300px;
  overflow: hidden;
  height: 100%;
  grid-row: span 4;
  border-radius: 20px;
  background-image: linear-gradient(
    to bottom left,
    ${(props) => props.theme.colors.primary_2},
    ${(props) => props.theme.colors.primary_1}
  );
`;

export const summaryContainer = styled.div`
  width: 100%;
  min-width: 300px;
  overflow: hidden;
  height: 100%;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.primary_2};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    bottom: -30px;
    right: -20px;
    width: 140px;
    border-radius: 50%;
    height: 140px;
    opacity: 0.3;
    background-image: linear-gradient(
      to bottom right,
      ${(props) => props.theme.colors.primary_1},
      ${(props) => props.theme.colors.primary_2}
    );
  }

  &::after {
    content: "";
    position: absolute;
    top: -30px;
    left: -30px;
    width: 120px;
    border-radius: 50%;
    height: 120px;
    opacity: 0.3;
    background-image: linear-gradient(
      to bottom right,
      ${(props) => props.theme.colors.primary_2},
      ${(props) => props.theme.colors.primary_1}
    );
  }
`;

export const IconContainer = styled.div`
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
`;

export const cardContentContainer = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 38%;
  padding-right: 20px;
`;

export const cardTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  align-self: center;
  margin-bottom: 7px;
  color: ${(props) => props.theme.fonts.color};
`;

export const cardValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: ${(props) => props.theme.fonts.color};
  position: relative;

  &:after {
    content: "HH";
    font-size: 24px;
    font-weight: 700;
    color: ${(props) => props.theme.fonts.color};
    position: absolute;
    right: -40px;
    top: 40%;
  }
`;

export const smallCardValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  align-self: end;
  margin-top: 10px;
  z-index: 1000;
  color: ${(props) => props.theme.fonts.color};

  span {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.fonts.color};
  }
`;

export const bigGraphContainer = styled.div`
  width: 100%;
  height: 100%;
  grid-column: span 2;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.grey};
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 200px;
  padding: 10px 20px;
  overflow: hidden;
`;

export const smallGraphContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.grey};
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 200px;
  overflow: hidden;
`;

export const monthSelectorContainer = styled.div`
  width: 100%;
  grid-column: span 3;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const monthAndLine = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const monthSelect = styled.button`
  width: auto;
  height: 40px;
  cursor: pointer;
  font-weight: 400;
  font-size: 12px;
  padding: 0 15px;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
  color: ${(props) =>
    props.$selected || props.$between
      ? props.theme.fonts.color
      : props.theme.colors.primary_dark};
  background-color: ${(props) =>
    props.$selected
      ? props.theme.colors.secondary_1
      : props.$between
      ? props.theme.colors.secondary_2
      : props.theme.colors.grey};
  appearance: none;
`;

export const monthLine = styled.div`
  width: 100%;
  height: 3px;
  background-color: ${(props) =>
    props.$between
      ? props.theme.colors.secondary_1
      : props.theme.colors.primary_dark};
`;
