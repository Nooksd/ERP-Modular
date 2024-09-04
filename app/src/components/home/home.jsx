import Hamburguer from "../../shared/includes/hamburguer/hamburguer";
import Header from "../../shared/includes/header/header";

import SVGHome from "../../shared/icons/home/Home_icon";

import { NavbarMenuContentContainer, NavbarContentContainer } from "../../styles/global";

export const Home = () => {
  return (
    <NavbarMenuContentContainer>
      <Hamburguer />
      <NavbarContentContainer>
      <Header page="Home" logged={true}>
        <SVGHome width="40" height="40" />
      </Header>
      <h1>Home</h1>
      <p>Bem-vindo à nossa página inicial</p>
      </NavbarContentContainer>
    </NavbarMenuContentContainer>
  );
};
