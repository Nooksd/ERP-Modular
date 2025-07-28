import styled from "styled-components";

export const AsideContainer = styled.div`
  width: 255px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${(props) =>
    `linear-gradient(to bottom, ${props.theme.colors.primary_1}, ${props.theme.colors.primary_2})`};
  position: absolute;
  top: 0;
  left: 0;
`;

export const expanded = styled.div`
  flex: 1;
`;

export const profileDiv = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid white;
`;

export const profilePicture = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const profileName = styled.p`
  color: ${(props) => props.theme.fonts.color};
  min-width: 170px;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const exitDiv = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid white;
`;
