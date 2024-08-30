import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingPage from "../../components/loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { setUserFromStorage } from "../../store/slicers/userSlicer";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { user, accessToken, refreshToken } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuthStatus = async () => {
      await dispatch(setUserFromStorage());
      setIsLoading(false);
    };
    checkAuthStatus();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user || !accessToken || !refreshToken) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
