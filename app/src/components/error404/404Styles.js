import styled from "styled-components";

export const Main = styled.div`
  width: 100%;
  height: calc(100dvh - 75px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RightSide = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: baseline;
`;

export const LeftSide = styled.div`
  height: 100%;
  margin-top: -200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: baseline;
`;

export const Title = styled.h1`
  font-size: 36px;
  margin-right: -70px;
  withe-space: nowrap;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary_dark};
  margin-bottom: 40px;
`;

export const Subtitle = styled.h2`
  font-size: 24px;
  white-space: nowrap;
  font-weight: 400;
  color: ${(props) => props.theme.colors.primary_dark};
  margin-bottom: 90px;
`;

export const Timer = styled.h3`
  font-size: 20px;
  white-space: nowrap;
  font-weight: 400;
  color: ${(props) => props.theme.colors.primary_dark};
`;
