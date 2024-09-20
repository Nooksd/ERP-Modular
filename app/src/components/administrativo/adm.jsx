// Página de envio e edicao de HH

// -imports Ract, Redux- >
import { useEffect, useState } from "react";
import * as styled from "./admStyles.js";
import SVGEmployee from "../../shared/icons/adm/Employees_icon.jsx";
import SVGUser from "../../shared/icons/adm/User_icon.jsx";

export const Adm = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // -Whachers de mudancas useEffect- >
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      <styled.infoBlocksDiv>
        <styled.infoBlock $first={true}>
          <styled.infoIconDiv $first={true}>
            <SVGEmployee width="50" height="50" />
          </styled.infoIconDiv>
          <styled.infoTitleDiv>
            <h1>001</h1>
            <h4>Funcionários Cadastrados</h4>
          </styled.infoTitleDiv>
        </styled.infoBlock>
        <styled.infoBlock>
          <styled.infoIconDiv>
            <SVGUser width="50" height="50" />
          </styled.infoIconDiv>
          <styled.infoTitleDiv>
            <h1>001</h1>
            <h4>Usuários Cadastrados</h4>
          </styled.infoTitleDiv>
        </styled.infoBlock>
      </styled.infoBlocksDiv>
      <styled.content>
        <styled.optionsBlockDiv>
          <styled.optionsTitleDiv>Controle de RH</styled.optionsTitleDiv>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionsTitleDiv>Controle de Obra</styled.optionsTitleDiv>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionButton>testeZX</styled.optionButton>
        </styled.optionsBlockDiv>
        <styled.optionsBlockDiv>
          <styled.optionsTitleDiv>Minha aplicação</styled.optionsTitleDiv>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionButton>testeZX</styled.optionButton>
          <styled.optionButton>testeZX</styled.optionButton>
        </styled.optionsBlockDiv>
      </styled.content>
    </styled.contentDiv>
  );
};
