import styled from "styled-components";

export const contentDiv = styled.div`
  width: 100%;
  height: 100vh;
`;

export const content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  overflow-x: hidden;

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

export const dashboardContainer = styled.div`
  min-width: 100%;
  height: 100%;
  display: ${(props) => (props.$state === 2 ? "none" : "grid")};
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.9fr 1.5fr 1.5fr 0.3fr;
  grid-auto-flow: dense;
  gap: 24px 70px;
  padding: 70px 70px 24px 70px;
  top: 0;
  left: 0;
  position: absolute;
  transition: ${(props) =>
    props.$state === 1
      ? "transform 1.2s ease-in-out"
      : props.$state === 3
      ? "transform 1.2s ease-in-out"
      : "none"};

  transform: translateX(
    ${(props) => {
      if (props.$state === 0) return "0%";
      if (props.$state === 1) return "-100%";
      if (props.$state === 2) return "100%";
      if (props.$state === 3) return "0%";
    }}
  );

  &::before {
    content: "| UFV Iraquara";
    position: absolute;
    color: white;
    padding-top: 20px;
    padding-left: 70px;
    font-size: 24px;
    font-weight: 700;
    top: 0;
    left: 0;
    width: 96.3%;
    min-height: 120px;
    background-image: linear-gradient(
      to bottom right,
      ${(props) => props.theme.colors.secondary_2},
      ${(props) => props.theme.colors.secondary_1}
    );
  }
`;

export const imageContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const sideGrapchContainer = styled.div`
  width: 100%;
  min-width: 300px;
  overflow: hidden;
  height: 100%;
  grid-row: span 3;
  overflow: auto;
  border-radius: 20px;
  background-image: linear-gradient(
    to bottom left,
    ${(props) => props.theme.colors.primary_2},
    ${(props) => props.theme.colors.primary_1}
  );

  display: grid;
  grid-template-rows: 2fr 0.3fr;
  justify-content: center;
  padding: 20px 0;

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

export const graphTitleBlue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.fonts.color};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const barContainer = styled.div`
  width: 100%;
  color: ${(props) => props.theme.fonts.color};
  white-space: nowrap;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const summaryContainer = styled.div`
  width: 100%;
  min-width: 300px;
  overflow: hidden;
  height: 100%;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.primary_2};
  position: relative;
  border: ${(props) => (props.$selected ? "5px" : "0px")} solid
    ${(props) => props.theme.colors.primary_dark};

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
  position: relative;
`;

export const cardTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  align-self: center;
  margin-bottom: 7px;
  color: ${(props) => props.theme.fonts.color};
`;

export const cardValue = styled.div`
  font-size: ${(props) => (props.$single ? "27px" : "48px")};
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
  background-color: ${(props) => props.theme.fonts.color};
  box-shadow: 5px 5px 0 ${(props) => props.theme.colors.primary_dark};
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 200px;
  padding: 10px 20px;
  overflow: hidden;
  position: relative;
`;

export const smallGraphContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 50px 30px 0 30px;
  background-color: ${(props) => props.theme.fonts.color};
  box-shadow: 5px 5px 0 ${(props) => props.theme.colors.primary_dark};
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 200px;
  overflow: hidden;
  position: relative;
`;

export const graphTitle = styled.h2`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const indicator = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.secondary_1};
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
  font-weight: 400;
  font-size: 12px;
  padding: 0 15px;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
  color: ${(props) => props.theme.fonts.color};
  background-color: ${(props) =>
    props.$selected
      ? props.theme.colors.secondary_1
      : props.$between
      ? props.theme.colors.secondary_2
      : props.theme.colors.primary_2};
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
