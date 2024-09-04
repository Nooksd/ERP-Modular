import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserFromStorage } from "../../store/slicers/userSlicer";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if(isAuthenticated === true) {
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

  return children;
};

export default ProtectedRoute;
