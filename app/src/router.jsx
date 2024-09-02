import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Error404 } from "./components/error/404";
import { Login } from "./components/login/login";
import { Home } from "./components/home/home";
import ProtectedRoute from "./shared/security/protected";

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
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
