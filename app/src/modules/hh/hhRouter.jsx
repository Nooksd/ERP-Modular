import { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slicers/userSlicer";
import store from "./store";

import {
  NavbarContentContainer,
  NavbarMenuContentContainer,
} from "../../styles/global";

import Header from "./components/header/header";
import Hamburger from "./components/hamburguer/hamburguer";
import Modal from "./components/modal/modal";

import { Home } from "./pages/home/home";
import { ControleHH } from "./pages/controleHH/controleHH";
import { Historico } from "./pages/historico/historico";
import { GestaoHH } from "./pages/gestaoHH/gestaoHH";
import { Adm } from "./pages/administrativo/adm";
import { Slider } from "./pages/slider/slider";
import { SliderManager } from "./pages/slider/sliderManager";

import SVGHome from "./assets/icons/home/Home_icon";
import SVGHHControll from "./assets/icons/hamburguer/HHControll_icon";
import SVGHistory from "./assets/icons/hamburguer/History_icon";
import SVGControll from "./assets/icons/hamburguer/Controll_icon";
import SVGPersonConfig from "./assets/icons/hamburguer/PersonConfig_icon";
import SVGSlider from "./assets/icons/slider/slider_icon";

const HHRouter = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const { user } = useSelector((state) => state.user);

  const [modalMessage, setModalMessage] = useState({
    response: null,
    event: null,
    message: "",
    title: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      icon: <SVGHome width="40" height="40" />,
      small: <SVGHome />,
    },
    {
      path: "controlehh",
      name: "Controle HH",
      permission: 2,
      component: <ControleHH windowHeight={windowHeight} />,
      icon: <SVGHHControll width="35" height="35" />,
      small: <SVGHHControll />,
    },
    {
      path: "historicohh",
      name: "Histórico HH",
      permission: 2,
      component: (
        <Historico
          windowHeight={windowHeight}
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
      permission: 1,
      component: <GestaoHH windowHeight={windowHeight} />,
      icon: <SVGControll width="35" height="35" />,
      small: <SVGControll />,
    },
    {
      path: "contfigurar-slider",
      name: "Slider",
      permission: 1,
      component: <SliderManager windowHeight={windowHeight} />,
      icon: <SVGSlider width="30" height="30" />,
      small: <SVGSlider />,
    },
    {
      path: "administrativo",
      name: "Administrativo",
      permission: 3,
      component: (
        <Adm
          windowHeight={windowHeight}
          modalMessage={setModalMessage}
          modalInfo={modalMessage}
        />
      ),
      icon: <SVGPersonConfig width="30" height="30" />,
      small: <SVGPersonConfig />,
    },
    {
      path: "slider",
      permission: 1,
      noHude: true,
      component: <Slider windowHeight={windowHeight} />,
    },
  ];

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

  const renderPageContent = () => {
    const page = getPageData();

    if (!page) return <Navigate to="/hh/home" replace />;

    if (user.globalPermission >= page.permission) return page.component;

    const modulePermission = user?.modulePermissions.find(
      (perm) => perm.module === "hh"
    );

    if (modulePermission && modulePermission.access >= page.permission) {
      return page.component;
    }

    if (page.permission) {
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
    return <Provider store={store}>{pageData.component}</Provider>;
  }

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login/hh");
    } catch (e) {
      console.error("Falha no Logout", e);
    }
  };

  return (
    <Provider store={store}>
      <NavbarMenuContentContainer>
        <Hamburger user={user} pageIcons={pages} />
        <NavbarContentContainer>
          <Modal
            modalMessage={modalMessage}
            setModalMessage={setModalMessage}
          />
          <Header
            user={user}
            page={pageData && pageData.name}
            icon={pageData && pageData.icon}
            onLogout={logout}
          />
          <NavbarContentContainer>{renderPageContent()}</NavbarContentContainer>
        </NavbarContentContainer>
      </NavbarMenuContentContainer>
    </Provider>
  );
};

export default HHRouter;
