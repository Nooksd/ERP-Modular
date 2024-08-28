import React from "react";
import * as styled from "./loginStyles.js";
import SVGlogowhite from "../../shared/innova_logo_white.jsx";

export const Login = () => {
  return (
    <styled.LoginContainer>
      <styled.greenLoginBlock>
        <styled.BlueLoginBlockBefore />
        <styled.blueLoginBlock>
            <SVGlogowhite />
          <styled.LoginTitle>Login</styled.LoginTitle>
          <styled.LoginForm>
            <styled.LoginInput type="text" />
            <styled.LoginInput type="password" />
          </styled.LoginForm>
        </styled.blueLoginBlock>
        <styled.BlueLoginBlockAfter />
      </styled.greenLoginBlock>
    </styled.LoginContainer>
  );
};
