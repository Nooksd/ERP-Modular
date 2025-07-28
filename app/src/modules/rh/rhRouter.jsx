import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store";

import { Home } from "./pages/home/home";
import { Aside } from "./components/aside/aside";

const RHRouter = () => {
  const { user } = useSelector((state) => state.user);

  const location = useLocation();

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
  };

  const pages = [
    {
      path: "home",
      name: "Home",
      permissionRequired: 1,
      component: <Home />,
    },
  ];

  const renderPageContent = () => {
    const page = getPageData();

    if (!page) return <Navigate to="/hh/home" replace />;

    if (!page?.isRestricted) return page.component;

    if (page?.isAdmRequired && !user.isManager) {
      return <Navigate to="/hh/home" replace />;
    }

    return page.component;
  };

  const getPageData = () => {
    const currentPage = location.pathname.split("/")[2];

    return pages.find((p) => normalizeString(p.path) === currentPage);
  };

  const pageData = getPageData();

  if (pageData && pageData.noHude) {
    return pageData.component;
  }

  return (
    <Provider store={store}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          backgroundColor: "#F9FAFB",
        }}
      >
        <Aside user={user} />
        <div style={{ width: "255px" }}></div>
        <main
          style={{
            flex: 1,
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              minHeight: "100%",
              display: "flex",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 8px 16px rgba(23, 34, 66, 0.25)",
            }}
          >
            {renderPageContent()}
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default RHRouter;
