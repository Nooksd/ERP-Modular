import styled from "styled-components";

export const LockSVG = styled.svg`
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);

  path {
    stroke: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const seePasswordSVG = styled.svg`
  path {
    stroke: ${(props) => props.theme.colors.primary_dark};
  }
  circle {
    stroke: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const seePasswordPath = styled.path`
  fill: ${(props) => props.theme.colors.primary_dark};
`;

export const warningSVG = styled.svg`
  fill: ${(props) => props.theme.colors.danger};
`;
