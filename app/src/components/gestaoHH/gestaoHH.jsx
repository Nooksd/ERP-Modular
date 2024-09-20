// Página de gestão de HH

// -imports Ract, Redux- >
import { useEffect, useState } from "react";
import * as styled from "./gestaoHHStyles.js";

export const GestaoHH = () => {
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
      <styled.content>
      <h1>Gestao de homem-horas</h1>
      <p>Área restrita para os administradores.</p>
      </styled.content>
    </styled.contentDiv>
  );
};
