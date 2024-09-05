import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Error404 } from "./components/error404/404";
import { Login } from "./components/login/login";
import { Home } from "./components/home/home";
import ProtectedRoute from "./shared/security/protected";
import { ControleHH } from "./components/controleHH/controleHH";
import { Historico } from "./components/historico/historico";
import { Usuarios } from "./components/Usuários/usuarios";
import { GestaoHH } from "./components/gestaoHH/gestaoHH";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/controlehh"
          element={
            <ProtectedRoute>
              <ControleHH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/histórico"
          element={
            <ProtectedRoute>
              <Historico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestãohh"
          element={
            <ProtectedRoute>
              <GestaoHH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
