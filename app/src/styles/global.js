// global.js

import styled from "styled-components";

export const errorDiv = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  width: 200px;
  height: 50px;
  background: ${(props) => props.theme.colors.danger};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;
