import styled from "styled-components";


export const contentDiv = styled.div`
  width: 100%;
  height: calc(${(props) => props.$windowHeight}px - 75px);
  padding: 15px 20px;
  position: relative;
  display: inline-block;
`;

export const content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 3px solid
    ${(props) =>
      props.$error ? props.theme.colors.danger : props.theme.colors.grey};
`;
