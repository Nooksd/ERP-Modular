import Hamburguer from "../../shared/includes/hamburguer/hamburguer";
import Header from "../../shared/includes/header/header";

import SVGHHControll from "../../shared/icons/hamburguer/HHControll_icon";

import { NavbarMenuContentContainer, NavbarContentContainer } from "../../styles/global";

export const ControleHH = () => {
  return (
    <NavbarMenuContentContainer>
      <Hamburguer />
      <NavbarContentContainer>
      <Header page="Controle HH" logged={true}>
        <SVGHHControll width="40" height="40" />
      </Header>
      <h1>Controle de HH</h1>
      <p>Bem-vindo ao controle de HH</p>
      </NavbarContentContainer>
    </NavbarMenuContentContainer>
  );
};
