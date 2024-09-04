import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/includes/header/header.jsx";
import * as styled from "./404Styles.js";

import SVGError404 from "../../shared/icons/error404/Error404_icon.jsx";
import SVGInnova404 from "../../shared/icons/error404/Innova404_icon.jsx";

export const Error404 = () => {
  const [countdown, setCountdown] = useState(10); // Inicializa o timer em 10 segundos
  const navigate = useNavigate();

  useEffect(() => {
    // Configura um intervalo de 1 segundo
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval); // Limpa o intervalo quando o contador chegar a zero
          navigate("/home"); // Redireciona para a página inicial
          return 0; // Define o contador para zero após o redirecionamento
        }
        return prevCountdown - 1; // Decrementa o contador
      });
    }, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
      <Header page="Erro 404">
        <SVGError404 width="30px" />
      </Header>
      <styled.Main>
        <styled.LeftSide>
          <styled.Title>Oooops! parece que esta página não existe</styled.Title>
          <styled.Subtitle>
            Infelizmente, a página que você tentou acessar não existe.
          </styled.Subtitle>
          <styled.Timer>
            Voltando para o Início em... .. .  00:00:
            {countdown.toString().padStart(2, "0")}
          </styled.Timer>
        </styled.LeftSide>
        <styled.RightSide>
          <SVGInnova404 width="600px" height="300" />
        </styled.RightSide>
      </styled.Main>
    </>
  );
};
