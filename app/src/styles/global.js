import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% {
    background-position: -50% 0;
  }
  50% {
    background-position: 150% 0; 
  }
  100% {
    background-position: 150% 0; 
  }
`;

export const Loading = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  min-height: 20px;
  border-radius: 5px;
  background: linear-gradient(90deg, #d9d9d9 30%, #a6a6a6 50%, #d9d9d9 70%);
  background-size: 200%;
  animation: ${loadingAnimation} 1.5s infinite linear;
`;

export const NavbarMenuContentContainer = styled.div`
  width: 100%;
  background-color: #f6f8fd;
  height: 100vh;
  display: flex;

  select {
    background-color: #f6f8fd;
  }
  input {
    background-color: #f6f8fd;
  }
`;

export const NavbarContentContainer = styled.div`
  width: 100%;
  padding-left: 37.5px;
  height: 100%;
`;
