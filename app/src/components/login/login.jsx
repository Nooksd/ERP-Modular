import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slicers/userSlicer.js";
import { useNavigate } from "react-router-dom";

import * as styled from "./loginStyles.js";

import SVGlogowhite from "../../shared/logo/innova_logo_white.jsx";
import SVGLock from "../../shared/icons/Lock_icon.jsx";
import SVGPerson from "../../shared/icons/Person_icon.jsx";
import { SVGSeePassword } from "../../shared/icons/See_password_icon.jsx";
import { SVGWarning } from "../../shared/icons/Warning_icon.jsx";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepConnection, setkeepConnection] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errorTimerRef = useRef(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim() === "") {
      setEmailError("Campo de email não pode estar vazio");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Email inválido.");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (password) => {
    if (!password || password.trim() === "") {
      setPasswordError("Campo de senha não pode estar vazio");
      return false;
    } else if (password.length < 5) {
      setPasswordError("Senha prescisa ser maior que 4 caracteres");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleLoginEvent = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (emailError || passwordError) {
      return;
    } else if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const loginCredentials = {
      email: email.trim(),
      password: password.trim(),
      keepConnection,
    };
    dispatch(loginUser(loginCredentials)).then((result) => {
      if (result.payload && result.payload.status) {
        setEmail("");
        setPassword("");
        navigate("/home");
      } else if (result.error) {
        setErrorMessage(result.error.message);
      }
    });
  };

  const handleBlur = (field) => {
    if (field === "email") {
      validateEmail(email);
    } else if (field === "password") {
      validatePassword(password);
    }
  };

  const handleFocus = (field) => {
    if (field === "email") {
      setEmailError("");
    } else if (field === "password") {
      setPasswordError("");
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setEmailError("Email ou senha inválida");
      setPasswordError("Email ou senha inválida");

      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }

      errorTimerRef.current = setTimeout(() => {
        setErrorMessage(null);
      }, 2000);

      return () => {
        clearTimeout(errorTimerRef.current);
      };
    }
  }, [error]);

  return (
    <styled.LoginContainer>
      <styled.greenLoginBlock>
        <styled.BlueLoginBlockBefore />
        <styled.blueLoginBlock>
          <SVGlogowhite fill="white" width="220px" />
          <styled.LoginTitle>Login</styled.LoginTitle>
          <styled.LoginForm onSubmit={handleLoginEvent}>
            <styled.FormDiv>
              <SVGPerson width="30" height="30" />
              <styled.LoginInput
                $loginError={!emailError}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                onFocus={() => handleFocus("email")}
                placeholder="Email de Usuário"
                type="text"
              />
              {emailError && (
                <styled.ErrorOnInputField>
                  <SVGWarning />
                  {emailError}
                </styled.ErrorOnInputField>
              )}
            </styled.FormDiv>
            <styled.FormDiv>
              <SVGLock width="30" height="30" />
              <styled.LoginInput
                $loginError={!passwordError}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                onFocus={() => handleFocus("password")}
                placeholder="Senha de Usuário"
                type={isPasswordVisible ? "text" : "password"}
              />
              {passwordError && (
                <styled.ErrorOnInputField>
                  <SVGWarning />
                  {passwordError}
                </styled.ErrorOnInputField>
              )}
              <styled.seePasswordDiv
                onClick={() => setIsPasswordVisible((prevState) => !prevState)}
              >
                <SVGSeePassword
                  show={isPasswordVisible}
                  width="20"
                  height="20"
                />
              </styled.seePasswordDiv>
            </styled.FormDiv>
            <styled.FormDiv>
              <styled.keepLoggedDiv>
                <styled.HiddenCheckbox
                  id="checkbox"
                  checked={keepConnection}
                  onChange={() => setkeepConnection((prev) => !prev)}
                />
                <styled.StyledCheckbox htmlFor="checkbox" />
                <styled.KeepLoggedLabel htmlFor="checkbox">
                  Manter conectado
                </styled.KeepLoggedLabel>
              </styled.keepLoggedDiv>
              <a
                href="https://api.whatsapp.com/send/?phone=%2B5534999232388&text=Ol%C3%A1%2C+tudo+bem%3F+Estou+com+problemas+para+fazer+login&type=phone_number&app_absent=0"
                target="_blank"
              >
                <styled.forgotPassP>Problemas com o Login?</styled.forgotPassP>
              </a>
            </styled.FormDiv>
            <styled.LoginButton
              $notAllowed={
                emailError || passwordError || loading ? false : true
              }
            >
              {loading ? "loading..." : "Login"}
            </styled.LoginButton>
          </styled.LoginForm>
          {ErrorMessage && (
            <styled.ErrorMessage>
              Acesso negado! credenciais inválidas.
            </styled.ErrorMessage>
          )}
        </styled.blueLoginBlock>
        <styled.BlueLoginBlockAfter />
      </styled.greenLoginBlock>
    </styled.LoginContainer>
  );
};
