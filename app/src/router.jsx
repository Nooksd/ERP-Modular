import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Error404 } from "./components/error/404";
import { Login } from "./components/login/login";
import { Dashboard } from "./components/Dashboard/dashboard";
import ProtectedRoute from "./shared/security/protected";


export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
           <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
        } />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
