import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store";

import {
  NavbarContentContainer,
  NavbarMenuContentContainer,
} from "../../styles/global";

const HHRouter = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const { user } = useSelector((state) => state.user);

  const [toastMessage, setToastMessage] = useState({
    danger: false,
    message: "",
    title: "",
  });
  const [modalMessage, setModalMessage] = useState({
    response: null,
    event: null,
    message: "",
    title: "",
  });

  const location = useLocation();

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
  };

  const pages = [];

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

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

    console.log(currentPage);

    return pages.find((p) => normalizeString(p.path) === currentPage);
  };

  const pageData = getPageData();

  if (pageData && pageData.noHude) {
    return pageData.component;
  }

  return (
    <Provider store={store}>
      <NavbarMenuContentContainer>
        <NavbarContentContainer>
          teste
          <NavbarContentContainer>{renderPageContent()}</NavbarContentContainer>
        </NavbarContentContainer>
      </NavbarMenuContentContainer>
    </Provider>
  );
};

export default HHRouter;
