import Hamburguer from "../../shared/includes/hamburguer/hamburguer";
import Header from "../../shared/includes/header/header";

import * as styled from "./homeStyles.js";

import SVGHome from "../../shared/icons/home/Home_icon";

import {
  NavbarMenuContentContainer,
  NavbarContentContainer,
} from "../../styles/global";
import SVGBackgroundHome from "../../shared/icons/home/BackGroundHome.jsx";
import SVGInnovaDashboard from "../../shared/icons/home/InnovaDashboard.jsx";

export const Home = () => {
  return (
    <NavbarMenuContentContainer>
      <Hamburguer />
      <NavbarContentContainer>
        <Header page="Home" logged={true}>
          <SVGHome width="40" height="40" />
        </Header>
        <styled.HomeContainer>
          <styled.HomeTitle>BEM-VINDO</styled.HomeTitle>
          <SVGInnovaDashboard />
          <styled.HomeDescription>
            Ponto de partida para simplificar o dia a dia e tornar a gestão mais
            conectada, ágil e inteligente. Aproveite ao máximo essa experiência!
          </styled.HomeDescription>
          <SVGBackgroundHome />
        </styled.HomeContainer>
      </NavbarContentContainer>
    </NavbarMenuContentContainer>
  );
};
