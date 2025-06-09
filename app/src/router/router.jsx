import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../modules/auth/pages/login/login";
import { Navigate } from "react-router-dom";
import ModuleRouter from "./moduleRouter";
import Error404 from "../modules/error/404";
import SelectModule from "../modules/auth/pages/moduler/modules";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login/:module" element={<Login />} />
        <Route path="/" element={<SelectModule />} />
        <Route path="/:module/*" element={<ModuleRouter />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
