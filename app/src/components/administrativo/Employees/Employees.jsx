import { useEffect, useState } from "react";
import * as styled from "./EmployeeStyles.js";

const Employees = ({ setPage }) => {
  return (
    <>
      <h1>Funcionários</h1>
      <button onClick={() => setPage("")}>Voltar</button>
    </>
  );
};

export default Employees;
