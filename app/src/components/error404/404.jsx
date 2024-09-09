import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as styled from "./404Styles.js";

import SVGInnova404 from "../../shared/icons/error404/Innova404_icon.jsx";

export const Error404 = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          navigate("/home");
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <styled.Main>
      <styled.LeftSide>
        <styled.Title>Oooops! parece que esta página não existe</styled.Title>
        <styled.Subtitle>
          Infelizmente, a página que você tentou acessar não existe.
        </styled.Subtitle>
        <styled.Timer>
          Voltando para o Início em... .. . 00:00:
          {countdown.toString().padStart(2, "0")}
        </styled.Timer>
      </styled.LeftSide>
      <styled.RightSide>
        <SVGInnova404 width="600px" height="300" />
      </styled.RightSide>
    </styled.Main>
  );
};
