import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/login/login";
import ProtectedRouter from "./shared/security/protected";
import { MobileDownload } from "./components/downlaod/download";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/download-mobile" element={<MobileDownload />} />
        <Route path="*" element={<ProtectedRouter />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
