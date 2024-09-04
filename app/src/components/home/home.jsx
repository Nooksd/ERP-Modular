import Hamburguer from "../../shared/includes/hamburguer/hamburguer";
import Header from "../../shared/includes/header/header";

import SVGHome from "../../shared/icons/home/Home_icon";

export const Home = () => {
  return (
    <>
      <Header page="Home" logged={true}>
        <SVGHome width="40" height="40"/>
      </Header>
      <Hamburguer />
      <h1>Home</h1>
      <p>Bem-vindo à nossa página inicial</p>
    </>
  );
};
