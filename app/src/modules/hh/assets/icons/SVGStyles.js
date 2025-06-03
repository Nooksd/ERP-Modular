import styled, { css } from "styled-components";

export const ColorSVG = styled.svg`
  fill: ${(props) => props.theme.colors.primary_dark};
  path {
    stroke: ${(props) => props.theme.colors.primary_dark};
    fill: ${(props) => props.theme.colors.primary_dark};
  }
`;

export const SVG = styled.svg`
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

export const HamburgerSVG = styled.svg`
  height: 60px;
  width: 60px;
  cursor: pointer;
  transition-duration: 0.3s;

  .line {
    fill: none;
    stroke: ${(props) => props.theme.colors.primary_dark};
    stroke-width: 5;
    transition-duration: 0.3s;
    stroke-linecap: round;
  }

  .top {
    stroke-dasharray: 40 160;
    ${({ $active }) =>
      $active &&
      css`
        stroke-dashoffset: -64px;
      `}
  }

  .middle {
    transform-origin: 50%;
    stroke-dasharray: 40 142;
    ${({ $active }) =>
      $active &&
      css`
        transform: rotate(90deg);
      `}
  }

  .bottom {
    transform-origin: 50%;
    stroke-dasharray: 40 85;
    ${({ $active }) =>
      $active &&
      css`
        stroke-dashoffset: -64px;
      `}
  }

  ${({ $active }) =>
    $active &&
    css`
      transform: rotate(45deg);
    `}
`;
