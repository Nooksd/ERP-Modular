import styled from "styled-components";

export const SelectContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.secondary_1};
  justify-content: center;
`;

export const SelectModule = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  gap: 20px;
`;

export const SelectModuleOption = styled.button`
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  border-radius: 5px;
  color: ${(props) => props.theme.fonts.color};
  background-color: ${(props) => props.theme.colors.primary_1};
  border: none;
  cursor: pointer;
`;
