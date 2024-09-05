import Hamburguer from "../../shared/includes/hamburguer/hamburguer";
import Header from "../../shared/includes/header/header";

import SVGHHControll from "../../shared/icons/hamburguer/HHControll_icon";

import { NavbarMenuContentContainer, NavbarContentContainer } from "../../styles/global";

export const Usuarios = () => {
  return (
    <NavbarMenuContentContainer>
      <Hamburguer />
      <NavbarContentContainer>
      <Header page="Usuários" logged={true}>
        <SVGHHControll width="40" height="40" />
      </Header>
      <h1>Usuários</h1>
      <p>Bem-vindo aos Usuários</p>
      </NavbarContentContainer>
    </NavbarMenuContentContainer>
  );
};
