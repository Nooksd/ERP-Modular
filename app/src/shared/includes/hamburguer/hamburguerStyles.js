import styled, { keyframes } from "styled-components";

export const Hamburger = styled.div`
  position: relative;
  width: ${(props) => (props.$active ? "175px" : "75px")};
  transition: 0.5s all;
  display: flex;
  justify-content: center;
  height: 100dvh;
  background-image: linear-gradient(
    45deg,
    ${(props) => props.theme.colors.primary_2},
    ${(props) => props.theme.colors.primary_1}
  );

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
