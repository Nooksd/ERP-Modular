import * as styled from "./homeStyles.js";

import SVGBackgroundHome from "../../shared/icons/home/BackGroundHome.jsx";
import SVGInnovaDashboard from "../../shared/icons/home/InnovaDashboard.jsx";

export const Home = () => {
  return (
    <styled.HomeContainer>
      <styled.HomeTitle>BEM-VINDO</styled.HomeTitle>
      <SVGInnovaDashboard />
      <styled.HomeDescription>
        Ponto de partida para simplificar o dia a dia e tornar a gestão mais
        conectada, ágil e inteligente. Aproveite ao máximo essa experiência!
      </styled.HomeDescription>
      <SVGBackgroundHome />
    </styled.HomeContainer>
  );
};
