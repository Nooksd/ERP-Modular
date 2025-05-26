import styled from "styled-components";

export const headerUsersDiv = styled.div`
  width: 100%;
  min-height: 45px;
  display: flex;
  gap: 20px;
  align-items: center;
  padding-left: 55px;
  justify-content: flex-start;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary_dark};
  border-bottom: 3px solid ${(props) => props.theme.colors.grey};
`;

export const Division = styled.nav`
  width: 3px;
  height: 100%;
  margin: 0 15px;
  background-color: ${(props) =>
    props.$error ? props.theme.colors.danger : props.theme.colors.grey};
`;

export const filterOptionsDiv = styled.div`
  width: 100%;
  min-height: 200px;
`;

export const addNewOneDiv = styled.div`
  width: 100%;
  height: 40%;
  padding: 0 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const addNewOneButton = styled.button`
  width: 200px;
  height: 40px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  background-color: ${(props) => props.theme.colors.secondary_2};
  color: ${(props) => props.theme.fonts.color};
  cursor: pointer;

  span {
    font-size: 26px;
    font-weight: 400;
  }
`;

export const filterAndInfoDiv = styled.div`
  width: 100%;
  height: 60%;
  position: relative;
  background-color: ${(props) => props.theme.fonts.color};
  color: ${(props) => props.theme.colors.primary_dark};
  padding: 0 30px;
  border-top: 3px solid ${(props) => props.theme.colors.primary_dark};
  border-bottom: 1px solid ${(props) => props.theme.colors.primary_dark};
  display: flex;
  flex-direction: column;
`;

export const switchModeDiv = styled.div`
  position: absolute;
  width: 200px;
  display: flex;
  height: 40px;
  left: 40px;
  top: -43px;
`;

export const switchModeButton = styled.button`
  width: 100%;
  height: 100%;
  border: ${(props) =>
    props.$active ? `none` : `1px solid ${props.theme.colors.primary_dark}`};
  border-bottom: none;
  border-top-width: 3px;
  box-sizing: content-box;
  background-color: ${(props) =>
    props.$active ? props.theme.colors.grey : props.theme.fonts.color};
  opacity: ${(props) => (props.$active ? 0.5 : 1)};
  color: ${(props) => props.theme.colors.primary_dark};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;

  &:first-child {
    svg {
      path {
        stroke: ${(props) =>
          !props.$active ? props.theme.colors.success : "black"};
      }
    }
  }

  &:last-child {
    svg {
      path {
        stroke: ${(props) =>
          !props.$active ? props.theme.colors.danger : "black"};
      }
    }
  }
`;

export const filterPartDiv = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    gap: 15px;
    font-size: 14px;
  }
`;

export const totalNumberSelect = styled.select`
  width: 70px;
  height: 20px;
  background-color: ${(props) => props.theme.fonts.color};
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const searchInput = styled.input`
  width: 500px;
  height: 30px;
  padding: 0 10px;
  background-color: ${(props) => props.theme.fonts.color};
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const searchButton = styled.button`
  width: 100px;
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.secondary_2};
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.fonts.color};

  svg {
    path {
      fill: ${(props) => props.theme.fonts.color};
    }
  }
`;

export const infoPartDiv = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: 0.3fr 0.2fr 1fr 1fr 0.5fr;
  color: ${(props) => props.theme.colors.primary_dark};
  align-items: end;
  padding: 10px 0;
`;

export const UserDiv = styled.div`
  width: 100%;
  height: 50px;
  padding: 0 30px;
  display: grid;
  grid-template-columns: 0.3fr 0.2fr 1fr 1fr 0.5fr;
  align-items: center;
  background-color: ${(props) =>
    props.$isEven ? props.theme.fonts.color : props.theme.colors.grey};
`;

export const userIndexSpan = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.secondary_2};
`;

export const userAvatarImg = styled.img`
  height: 45px;
  aspect-ratio: 1;
  border-radius: 5px;
`;

export const userDataSpan = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const controllButtonsDiv = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
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

export const disableButton = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${(props) => props.theme.colors.primary_dark};
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary_dark};

    &:after {
      background-color: ${(props) => props.theme.fonts.color};
    }
  }

  &:after {
    content: "";
    position: absolute;
    width: 50%;
    height: 50%;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1.5px solid ${(props) => props.theme.colors.primary_dark};
    z-index: 2;
  }
`;

export const resultsDiv = styled.div`
  width: 100%;
  height: 100%;
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

export const paginationDiv = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;
