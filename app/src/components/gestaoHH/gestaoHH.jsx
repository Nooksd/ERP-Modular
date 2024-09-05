import Hamburguer from "../../shared/includes/hamburguer/hamburguer";
import Header from "../../shared/includes/header/header";

import { NavbarMenuContentContainer, NavbarContentContainer } from "../../styles/global";

import SVGControll from "../../shared/icons/hamburguer/Controll_icon";


export const GestaoHH = () => {
  return (
    <NavbarMenuContentContainer>
      <Hamburguer />
      <NavbarContentContainer>
      <Header page="Gestão HH" logged={true}>
        <SVGControll width="40" height="40" />
      </Header>
      <h1>Gestão de HH</h1>
      <p>Bem-vindo a gestão de HH</p>
      </NavbarContentContainer>
    </NavbarMenuContentContainer>
  );
};
