import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserFromStorage } from "../../store/slicers/userSlicer";
import { Error404 } from "../../components/error404/404";
import {
  NavbarContentContainer,
  NavbarMenuContentContainer,
} from "../../styles/global";
import Header from "../includes/header/header";
import Hamburger from "../includes/hamburguer/hamburguer";
import { Home } from "../../components/home/home";
import { ControleHH } from "../../components/controleHH/controleHH";
import { Usuarios } from "../../components/Usuários/usuarios";
import { Historico } from "../../components/historico/historico";
import { GestaoHH } from "../../components/gestaoHH/gestaoHH";
import SVGHome from "../icons/home/Home_icon";
import SVGHHControll from "../icons/hamburguer/HHControll_icon";
import SVGHistory from "../icons/hamburguer/History_icon";
import SVGControll from "../icons/hamburguer/Controll_icon";
import SVGUsers from "../icons/hamburguer/Users_icon";

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
    component: <Home />,
    icon: <SVGHome width="40" height="40" />,
  },
  {
    path: "controlehh",
    name: "Controle HH",
    component: <ControleHH />,
    icon: <SVGHHControll width="35" height="35" />,
  },
  {
    path: "historico",
    name: "Histórico",
    component: <Historico />,
    icon: <SVGHistory width="35" height="35" />,
  },
  {
    path: "gestaohh",
    name: "Gestão HH",
    component: <GestaoHH />,
    icon: <SVGControll width="35" height="35" />,
  },
  {
    path: "usuarios",
    name: "Usuários",
    component: <Usuarios />,
    icon: <SVGUsers width="35" height="35" />,
    requiresManager: true,
  },
];

const ProtectedRouter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

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

  const renderPageContent = () => {
    const currentPage = normalizeString(
      location.pathname.substring(1).toLowerCase()
    );

    const page = pages.find((p) => normalizeString(p.path) === currentPage);

    if (!page) return <Error404 />;

    const allowedPages = user.pages.map((page) =>
      normalizeString(page.toLowerCase())
    );

    if ((page.requiresManager && user.isManager) || currentPage === "home")
      return page.component;

    if (!allowedPages.includes(currentPage)) {
      return <Error404 />;
    }

    return page.component;
  };

  const getPageData = () => {
    const currentPage = normalizeString(
      location.pathname.substring(1).toLowerCase()
    );
    return pages.find((p) => normalizeString(p.path) === currentPage);
  };

  if (isLoading || loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const pageData = getPageData();

  return (
    <NavbarMenuContentContainer>
      <Hamburger user={user} />
      <NavbarContentContainer>
        <Header
          page={pageData && pageData.name}
          icon={pageData && pageData.icon}
          logged={true}
        />
        <NavbarContentContainer>{renderPageContent()}</NavbarContentContainer>
      </NavbarContentContainer>
    </NavbarMenuContentContainer>
  );
};

export default ProtectedRouter;
