import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: calc(${(props) => props.$windowHeight}px - 75px);
  padding: 15px 20px;
  position: relative;
  display: flex;
  gap: 20px;
`;

export const contentDiv = styled.div`
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
  justify-content: center;
  border-bottom: 3px solid ${(props) => props.theme.colors.grey};
  font-size: 20px;
  font-weight: 600;
  position: relative;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const work = styled.li`
  width: 102%;
  white-space: nowrap;
  overflow: hidden;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0 20px 0 30px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  margin: 0 -3px;
  color: ${(props) => props.theme.colors.primary_dark};

  background-color: "transparent";

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary_1};
    color: ${(props) => props.theme.fonts.color};
    transition: background-color 0.1s ease;
  }
`;

export const goToSliderButton = styled.div`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const sliderDiv = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(${(props) => props.$windowHeight}px - 253px);
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

export const slideDiv = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: start;
  height: 45px;
  border: 3px solid
    ${(props) =>
      props.$error ? props.theme.colors.danger : props.theme.colors.grey};
  border-radius: 10px;
  position: relative;

  margin-bottom: ${(props) => (props.$onHover ? "50px" : "0")};
`;

export const SlideTextInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  border-right: 3px solid ${(props) => props.theme.colors.grey};
  color: ${(props) => props.theme.colors.primary_dark};

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const switchDiv = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: start;
  height: 45px;
  position: relative;
`;

export const switchLabel = styled.div`
  width: 20%;
`;

export const Switch = styled.div`
  width: 30px;
  height: 30px;
  margin-left: 40px;
  border: none;
  position: relative;
  background-color: ${(props) => props.theme.colors.grey};
  cursor: pointer;

  &:before {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.grey};
    position: absolute;
    top: 0;
    left: -18px;
  }

  &:after {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.grey};
    position: absolute;
    top: 0;
    right: -18px;
  }
`;

export const SwitchButton = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: ${(props) => (props.$active ? "20px" : "-12px")};
  transition: left 0.3s ease;
  transform: translateY(-50%);
  background-color: ${(props) =>
    props.$active
      ? props.theme.colors.secondary_2
      : props.theme.colors.primary_dark};
  z-index: 2;
`;

export const deleteButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  width: 50px;
  height: 45px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  margin: -3px;
  cursor: pointer;
  background: none;
  border: 3px solid ${(props) => props.theme.colors.danger};
  opacity: 0.9;

  &:hover {
    background: ${(props) => props.theme.colors.danger};
    transition: background-color 0.1s ease;
    svg {
      path {
        fill: ${(props) => props.theme.fonts.color};
      }
    }
  }

  svg {
    path {
      fill: ${(props) => props.theme.colors.danger};
    }
  }
`;

export const addImageButton = styled.div`
  width: 175px;
  height: 40px;
  background-color: ${(props) => props.theme.colors.secondary_2};
  border-radius: 10px;
  color: ${(props) => props.theme.fonts.color};
  font-size: 16px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary_1};
    transition: background-color 0.1s ease;
  }

  input {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &::before {
    content: "Adicionar imagem";
    position: absolute;
    font-size: 16px;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const addOneMoreButton = styled.button`
  width: 175px;
  height: 40px;
  background-color: ${(props) => props.theme.colors.secondary_2};
  border-radius: 10px;
  color: ${(props) => props.theme.fonts.color};
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary_1};
    transition: background-color 0.1s ease;
  }
`;

export const finalCheckDiv = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  padding-right: 50px;
  justify-content: end;
  position: relative;
`;
