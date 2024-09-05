import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserFromStorage } from "../../store/slicers/userSlicer";
import { Error404 } from "../../components/error404/404";

const normalizeString = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isAuthenticated === true) {
        setIsLoading(false);
        return;
      }
      try {
        dispatch(setUserFromStorage());
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, [dispatch]);

  if (isLoading || loading) {
    return children;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user && user.pages) {
    const normalizedPages = user.pages.map((page) =>
      normalizeString(page.toLowerCase())
    );
    const normalizedComponentName = normalizeString(
      children.type.name.toLowerCase()
    );

    if (normalizedPages.includes(normalizedComponentName)) {
      return children;
    }
    if (normalizedComponentName === "home") {
      return children;
    }
    
    if (normalizedComponentName === "usuarios" &&  user.isManager) {
      return children;
    }
  }

  return <Error404 />;
};

export default ProtectedRoute;
