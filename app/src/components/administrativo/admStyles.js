import styled from "styled-components";

export const contentDiv = styled.div`
  width: 100%;
  height: calc(${(props) => props.$windowHeight}px - 195px);
  padding: 15px 20px;
  position: relative;
  display: inline-block;
`;

export const infoBlocksDiv = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  gap: 50px;
  align-items: start;
  justify-content: space-around;
`;

export const infoBlock = styled.div`
  width: 50%;
  height: 100px;
  display: flex;
  background-color: ${(props) =>
    props.$first
      ? props.theme.colors.primary_2
      : props.theme.colors.secondary_2};
`;

export const infoIconDiv = styled.div`
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: ${(props) =>
    props.$first
      ? props.theme.colors.primary_1
      : props.theme.colors.secondary_1};

  svg {
    path {
      fill: ${(props) => props.theme.fonts.color};
    }
  }
`;

export const infoTitleDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding: 0 30px;
  color: ${(props) => props.theme.fonts.color};

  h1 {
    font-size: 32px;
    font-weight: 500;
  }
  h4 {
    font-size: 20px;
    font-weight: 400;
  }
`;

export const content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
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

export const optionsBlockDiv = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`;

export const optionsTitleDiv = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: start;
  background-color: ${(props) => props.theme.fonts.color};
  border-top: 3px solid ${(props) => props.theme.colors.primary_dark};
  color: ${(props) => props.theme.colors.primary_dark};
  font-size: 22px;
  font-weight: 700;
`;

export const optionButton = styled.button`
  width: 100%;
  height: 50px;
  display: flex;
  padding: 0 60px;
  align-items: center;
  justify-content: start;
  background-color: ${(props) => props.theme.fonts.color};
  border-top: 3px solid ${(props) => props.theme.colors.grey};
  font-size: 16px;

  &:last-child {
    border-bottom: 3px solid ${(props) => props.theme.colors.grey};
  }
`;
