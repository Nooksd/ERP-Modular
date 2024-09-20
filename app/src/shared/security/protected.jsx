import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserFromStorage } from "../../store/slicers/userSlicer";

import {
  NavbarContentContainer,
  NavbarMenuContentContainer,
} from "../../styles/global";

import Header from "../includes/header/header";
import Hamburger from "../includes/hamburguer/hamburguer";
import Toast from "../includes/toast/toast";

import { Home } from "../../components/home/home";
import { ControleHH } from "../../components/controleHH/controleHH";
import { Historico } from "../../components/historico/historico";
import { GestaoHH } from "../../components/gestaoHH/gestaoHH";
import { Adm } from "../../components/administrativo/adm";
import { Error404 } from "../../components/Secundary_pages/error404/404";

import SVGHome from "../icons/home/Home_icon";
import SVGHHControll from "../icons/hamburguer/HHControll_icon";
import SVGHistory from "../icons/hamburguer/History_icon";
import SVGControll from "../icons/hamburguer/Controll_icon";
import Modal from "../includes/modal/modal";
import SVGPersonConfig from "../icons/hamburguer/PersonConfig_icon";

const ProtectedRouter = () => {
  const [isLoading, setIsLoading] = useState(true);
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
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
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
      isRestricted: false,
      component: <Home />,
      icon: <SVGHome width="40" height="40" />,
      small: <SVGHome />,
    },
    {
      path: "controlehh",
      name: "Controle HH",
      isRestricted: true,
      component: <ControleHH toastMessage={setToastMessage} />,
      icon: <SVGHHControll width="35" height="35" />,
      small: <SVGHHControll />,
    },
    {
      path: "historicohh",
      name: "Histórico HH",
      isRestricted: true,
      component: (
        <Historico
          toastMessage={setToastMessage}
          modalMessage={setModalMessage}
          modalInfo={modalMessage}
        />
      ),
      icon: <SVGHistory width="35" height="35" />,
      small: <SVGHistory />,
    },
    {
      path: "gestaohh",
      name: "Gestão HH",
      isRestricted: true,
      component: (
        <GestaoHH
          toastMessage={setToastMessage}
          modalMessage={setModalMessage}
          modalInfo={modalMessage}
        />
      ),
      icon: <SVGControll width="35" height="35" />,
      small: <SVGControll />,
    },
    {
      path: "administrativo",
      name: "Administrativo",
      isRestricted: true,
      component: (
        <Adm
          toastMessage={setToastMessage}
          modalMessage={setModalMessage}
          modalInfo={modalMessage}
        />
      ),
      icon: <SVGPersonConfig width="30" height="30" />,
      small: <SVGPersonConfig />,
    },
  ];

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

    if (!page.isRestricted) return page.component;

    const allowedPages = user.pages.map((page) =>
      normalizeString(page.toLowerCase())
    );

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
      <Hamburger user={user} pageIcons={pages} />
      <NavbarContentContainer>
        <Toast toastContent={toastMessage} setToastContent={setToastMessage} />
        <Modal modalMessage={modalMessage} setModalMessage={setModalMessage} />
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
