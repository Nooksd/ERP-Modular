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
  color: ${(props) =>
    props.$selected
      ? props.theme.fonts.color
      : props.theme.colors.primary_dark};
  background-color: ${(props) =>
    props.$selected ? props.theme.colors.primary_2 : props.theme.fonts.color};
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
      background-color: ${(props) =>
        props.$selected
          ? props.theme.fonts.color
          : props.theme.colors.primary_dark};
    }
  }
`;

export const filterRole = styled.button`
  width: 250px;
  height: 40px;
  font-size: 16px;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.primary_dark};
  background-color: ${(props) => props.theme.fonts.color};
  position: relative;
  text-align: start;
  padding-left: 20px;
`;

export const openSvgContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: end;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;

  svg {
    fill: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const rolesContainer = styled.div`
  width: auto;
  max-width: 700px;
  height: auto;
  padding: 20px 13px;
  max-height: 600px;
  background-color: ${(props) => props.theme.fonts.color};
  box-shadow: 5px 5px 0 ${(props) => props.theme.colors.primary_dark};
  font-size: 16px;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  border-radius: 5px;
  position: absolute;
  top: 110%;
  left: 10%;
  z-index: 2000;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

export const roleCheckContainer = styled.label`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  span {
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
    height: 22px;
    width: 22px;
    background-color: #eee;

    &:after {
      border-radius: 3px;
      content: "";
      position: absolute;
      display: none;
      top: 15%;
      left: 35%;
      transform: translate(-50%, -50%);
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  &:hover input ~ span {
    background-color: ${(props) => props.theme.colors.grey};
  }

  input:checked ~ span {
    background-color: ${(props) => props.theme.colors.primary_2};
  }

  input:checked ~ span:after {
    display: block;
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
  grid-template-rows: 0.9fr 1.5fr 1.5fr 0.3fr;
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

  display: grid;
  grid-template-rows: 1.2fr 2fr 0.5fr;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

export const graphTitleBlue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.fonts.color};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const pieContainer = styled.div`
  width: 260px;
  height: auto;
  position: relative;
  margin: 0 auto;
  color: ${(props) => props.theme.fonts.color};
  white-space: nowrap;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const barContainer = styled.div`
  width: 100%;
  height: 300px;
  color: ${(props) => props.theme.fonts.color};
  white-space: nowrap;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
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

export const exportButton = styled.button`
  width: 300px;
  height: 45px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.fonts.color};
  color: ${(props) => props.theme.colors.primary_dark};
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  gap: 5px;
  font-family: "Inter", sans-serif;
  padding-left: 50px;
  display: flex;
  align-items: center;
  justify-content: start;
  transition: gap 0.1s;

  svg {
    path {
      stroke: ${(props) => props.theme.colors.primary_dark};
    }
  }

  &:hover {
    gap: 15px;
  }
`;

export const summaryContainer = styled.div`
  width: 100%;
  min-width: 300px;
  overflow: hidden;
  height: 100%;
  cursor: pointer;
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
  cursor: pointer;
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
