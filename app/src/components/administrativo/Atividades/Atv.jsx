import { useEffect, useState } from "react";
import * as styled from "./AtvStyles.js";

const Atividades = ({ setPage }) => {
  return (
    <>
      <h1>Atividades</h1>
      <button onClick={() => setPage("")}>Voltar</button>
    </>
  );
};

export default Atividades;
