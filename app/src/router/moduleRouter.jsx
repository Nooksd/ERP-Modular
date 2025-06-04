import { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hasModulePermission } from "../utils/permissions";
import { setUserFromStorage } from "../store/slicers/userSlicer";

const ModuleRouter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  const moduleName = location.pathname.split("/")[1] || "";

  const LazyModuleRouter = useMemo(
    () =>
      lazy(() =>
        import(`../modules/${moduleName}/${moduleName}Router`).catch(() =>
          import(`../modules/error/404`)
        )
      ),
    [moduleName]
  );

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
  }, [dispatch, isAuthenticated]);

  if (isLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const canAccessModule = hasModulePermission(user, moduleName, 1);
  if (!canAccessModule) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyModuleRouter />
    </Suspense>
  );
};

const LoadingSpinner = () => {
  return (
    <>
      <h1>Loading...</h1>
    </>
  );
};

export default ModuleRouter;
