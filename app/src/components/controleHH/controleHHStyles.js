import styled from "styled-components";

export const controllContainer = styled.div`
  width: 100%;
  height: calc(100vh - 75px);
  display: grid;
  justify-content: center;
  grid-template-columns: .8fr 5fr;
  gap: 25px;
  padding: 15px 20px;
`;

export const contentDiv = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 5fr;
  border: 3px solid ${(props) => props.theme.colors.grey};
`;

export const titleDiv = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid ${(props) => props.theme.colors.grey};
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary_dark};
  
  `;
