import { useEffect, useState } from "react";
import * as styled from "./UserStyles.js";

const Users = ({ setPage }) => {
  return (
    <>
      <h1>USERS</h1>
      <button onClick={() => setPage("")}>Voltar</button>
    </>
  );
};

export default Users;
