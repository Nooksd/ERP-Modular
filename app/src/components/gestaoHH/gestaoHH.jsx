// Página de gestão de HH

// -imports Ract, Redux- >
import { useEffect, useState } from "react";
import * as styled from "./gestaoHHStyles.js";
import SVGFilter from "../../shared/icons/gestaoHH/Filter_icon.jsx";
import SVGEraseFilter from "../../shared/icons/gestaoHH/EraseFilter_icon.jsx";

export const GestaoHH = ({ windowHeight }) => {
  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      <styled.content>
        <styled.greenBackground>
          <styled.titleContainer>
            <styled.title>Dashboard de gestão HH</styled.title>
            <styled.controllContainer>
              <styled.yearSelector>
                <styled.year>2022</styled.year>
                <styled.year>2023</styled.year>
                <styled.year>2024</styled.year>
              </styled.yearSelector>
              <styled.filter>
                <SVGFilter />
              </styled.filter>
              <styled.workSelect>
                <option value="">Selecionar Usina</option>
              </styled.workSelect>
              <styled.eraseFilter>
                <SVGEraseFilter />
              </styled.eraseFilter>
            </styled.controllContainer>
          </styled.titleContainer>
        </styled.greenBackground>
        <styled.dashboardContainer>
          <styled.sideGrapchContainer></styled.sideGrapchContainer>
          <styled.summaryContainer></styled.summaryContainer>
          <styled.summaryContainer></styled.summaryContainer>
          <styled.summaryContainer></styled.summaryContainer>
          <styled.bigGraphContainer></styled.bigGraphContainer>
          <styled.smallGraphContainer></styled.smallGraphContainer>
          <styled.bigGraphContainer></styled.bigGraphContainer>
          <styled.smallGraphContainer></styled.smallGraphContainer>
          <styled.monthSelectorContainer></styled.monthSelectorContainer>
        </styled.dashboardContainer>
      </styled.content>
    </styled.contentDiv>
  );
};
