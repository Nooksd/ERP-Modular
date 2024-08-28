import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Error404 } from "./components/error/404";
import { Login } from "./components/login/login";
import { Dashboard } from "./components/Dashboard";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
