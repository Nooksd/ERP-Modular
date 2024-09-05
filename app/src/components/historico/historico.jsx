import Hamburguer from "../../shared/includes/hamburguer/hamburguer";
import Header from "../../shared/includes/header/header";

import SVGHistory from "../../shared/icons/hamburguer/History_icon";

import { NavbarMenuContentContainer, NavbarContentContainer } from "../../styles/global";

export const Historico = () => {
  return (
    <NavbarMenuContentContainer>
      <Hamburguer />
      <NavbarContentContainer>
      <Header page="Histórico" logged={true}>
        <SVGHistory width="40" height="40" />
      </Header>
      <h1>Historico</h1>
      <p>Bem-vindo ao Historico</p>
      </NavbarContentContainer>
    </NavbarMenuContentContainer>
  );
};
