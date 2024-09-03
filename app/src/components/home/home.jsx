import Hamburguer from "../../shared/includes/hamburguer/hamburguer";
import Header from "../../shared/includes/header/header";
import SVGEngine from "../../shared/icons/Engine_icon";

export const Home = () => {
  return (
    <div>
      <Header page="Home" icon={SVGEngine} />
      <Hamburguer />
      <h1>Home</h1>
      <p>Bem-vindo à nossa página inicial</p>
    </div>
  );
};
