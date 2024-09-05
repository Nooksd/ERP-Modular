import styled, { keyframes, css } from "styled-components";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
`;

export const Hamburger = styled.div`
  position: relative;
  width: ${(props) => (props.$active ? "200px" : "75px")};
  transition: 0.5s all;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 100dvh;
  background-image: linear-gradient(
    45deg,
    ${(props) => props.theme.colors.primary_2},
    ${(props) => props.theme.colors.primary_1}
  );
`;

export const HamburgerIconDiv = styled.div`
  width: 100%;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;

  ${(props) =>
    props.$active
      ? `
    svg {
    margin-left: auto;
  }
    `
      : `
      svg {
    margin-left: 0;
  }
    `}
`;

export const IconsDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 23px;
`;

export const MenuIten = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ItenText = styled.span`
  font-size: 16px;
  color: ${(props) => props.theme.fonts.color};
  font-weight: 500;
  left: 40px;
  opacity: 0;
  visibility: hidden;
  margin-left: 15px;
  transition: all 0.5s ease;
  white-space: nowrap;

  ${({ $active }) =>
    $active
      ? css`
          animation: ${slideIn} 0.5s ease forwards;
          opacity: 1;
          width: 100px;
          visibility: visible;
        `
      : css`
          animation: ${slideOut} 0.5s ease forwards;
          opacity: 0;
          width: 0;
          visibility: hidden;
        `}
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  margin-left: 15px;
`;
