import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/login/login";
import ProtectedRouter from "./shared/security/protected";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<ProtectedRouter />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
