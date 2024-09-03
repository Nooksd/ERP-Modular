import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const Loading = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  min-height: 20px;
  border-radius: 5px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${loadingAnimation} 1.5s infinite linear;
`;
