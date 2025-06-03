import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../modules/hh/pages/login/login";
import { MobileDownload } from "../modules/hh/pages/downlaod/download";
import { Navigate } from "react-router-dom";
import ModuleRouter from "./moduleRouter";
import Error404 from "../modules/error/404";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/download-mobile" element={<MobileDownload />} />
        <Route path="/:module/*" element={<ModuleRouter />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
