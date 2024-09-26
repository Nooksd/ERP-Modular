import styled from "styled-components";

export const contentDiv = styled.div`
  width: 100%;
  height: calc(${(props) => props.$windowHeight}px - 115px);
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
  height: calc(100% - 120px);
  display: flex;
  gap: 20px;
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
  padding: 0 30px;
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
  padding: 0 30px;
  align-items: center;
  justify-content: start;
  background-color: ${(props) => props.theme.fonts.color};
  border-top: 3px solid ${(props) => props.theme.colors.grey};
  font-size: 16px;
  cursor: pointer;

  div {
    width: 35px;
  }

  svg {
    fill: ${(props) => props.theme.colors.primary_dark};
    path {
      fill: ${(props) => props.theme.colors.primary_dark};
    }
    ellipse {
      fill: ${(props) => props.theme.colors.primary_dark};
    }
    circle {
      fill: ${(props) => props.theme.colors.primary_dark};
    }
  }

  span {
    margin-left: 15px;
  }

  &:last-child {
    border-bottom: 3px solid ${(props) => props.theme.colors.grey};
  }
  &:hover {
    span {
      margin-left: 25px;
      transition: margin 0.2s;
    }
    background-color: ${(props) => props.theme.colors.secondary_2};
    color: ${(props) => props.theme.fonts.color};

    svg {
      fill: ${(props) => props.theme.fonts.color};
      path {
        fill: ${(props) => props.theme.fonts.color};
      }
      ellipse {
        fill: ${(props) => props.theme.fonts.color};
      }
      circle {
        fill: ${(props) => props.theme.fonts.color};
      }
    }
  }
`;

export const pageTrailDiv = styled.div`
  width: 100%;
  height: 40px;
  font-size: 20px;
  color: ${(props) => props.theme.colors.primary_dark};
  font-style: italic;
  font-weight: 600;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  justify-content: flex-start;
  opacity: 0.9;

  span {
    display: flex;
    gap: 15px;
    align-items: center;

    span {
      cursor: pointer;
    }
  }

  svg {
    g {
      fill: ${(props) => props.theme.colors.primary_dark};
    }
  }
`;

export const pageContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 3px solid ${(props) => props.theme.colors.grey};
`;
