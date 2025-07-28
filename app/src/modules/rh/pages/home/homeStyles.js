import styled from "styled-components";

export const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: start;
  align-items: baseline;
`;

export const HomeTitle = styled.h1`
  margin-top: 100px;
  margin-left: 150px;
  font-size: 64px;
  margin-bottom: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary_dark};
`;

export const HomeDescription = styled.h2`
  margin-top: 30px;
  font-size: 16px;
  max-width: 400px;
  color: ${(props) => props.theme.colors.primary_dark};
`;
