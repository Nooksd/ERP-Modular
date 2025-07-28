import { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hasModulePermission } from "../utils/permissions";
import { toast } from "react-toastify";
import { setUserFromStorage } from "../store/slicers/userSlicer";
import loadignAnimation from "@/assets/loading.json";
import Lottie from "lottie-react";

const ModuleRouter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  const moduleName = location.pathname.split("/")[1] || "";

  const LazyModuleRouter = useMemo(
    () =>
      lazy(() =>
        import(`../modules/${moduleName}/${moduleName}Router.jsx`).catch(() =>
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
    toast.error("Você precisa estar logado para acessar essa página.");
    return <Navigate to="/" />;
  }

  const canAccessModule = hasModulePermission(user, moduleName, 1);
  if (!canAccessModule) {
    return <Navigate to="/" />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyModuleRouter />
    </Suspense>
  );
};

const LoadingSpinner = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    setInterval(() => {
      setDots((prevDots) => (prevDots === "..." ? "" : prevDots + "."));
    }, 300);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "500px", height: "500px" }}>
        <Lottie animationData={loadignAnimation} loop={true} />
        <h1 style={{ textAlign: "center", color: "#172242" }}>Loading{dots}</h1>
      </div>
    </div>
  );
};

export default ModuleRouter;
