import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store";

import {
  NavbarContentContainer,
  NavbarMenuContentContainer,
} from "../../styles/global";

import Header from "./components/header/header";
import Hamburger from "./components/hamburguer/hamburguer";
import Toast from "./components/toast/toast";
import Modal from "./components/modal/modal";

import Error404 from "@/modules/error/404";
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

  console.log(user);

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

  const pages = [
    {
      path: "home",
      name: "Home",
      component: <Home />,
      icon: <SVGHome width="40" height="40" />,
      small: <SVGHome />,
    },
    // {
    //   path: "controlehh",
    //   name: "Controle HH",
    //   isRestricted: true,
    //   component: (
    //     <ControleHH
    //       toastMessage={setToastMessage}
    //       windowHeight={windowHeight}
    //     />
    //   ),
    //   icon: <SVGHHControll width="35" height="35" />,
    //   small: <SVGHHControll />,
    // },
    // {
    //   path: "historicohh",
    //   name: "Histórico HH",
    //   isRestricted: true,
    //   component: (
    //     <Historico
    //       windowHeight={windowHeight}
    //       toastMessage={setToastMessage}
    //       modalMessage={setModalMessage}
    //       modalInfo={modalMessage}
    //     />
    //   ),
    //   icon: <SVGHistory width="35" height="35" />,
    //   small: <SVGHistory />,
    // },
    // {
    //   path: "gestaohh",
    //   name: "Gestão HH",
    //   isRestricted: true,
    //   isAdmRequired: true,
    //   component: (
    //     <GestaoHH
    //       windowHeight={windowHeight}
    //       toastMessage={setToastMessage}
    //       modalMessage={setModalMessage}
    //       modalInfo={modalMessage}
    //     />
    //   ),
    //   icon: <SVGControll width="35" height="35" />,
    //   small: <SVGControll />,
    // },
    // {
    //   path: "contfigurar-slider",
    //   name: "Slider",
    //   isRestricted: true,
    //   isAdmRequired: true,
    //   component: (
    //     <SliderManager
    //       windowHeight={windowHeight}
    //       toastMessage={setToastMessage}
    //       modalMessage={setModalMessage}
    //       modalInfo={modalMessage}
    //     />
    //   ),
    //   icon: <SVGSlider width="30" height="30" />,
    //   small: <SVGSlider />,
    // },
    // {
    //   path: "administrativo",
    //   name: "Administrativo",
    //   isRestricted: true,
    //   isAdmRequired: true,
    //   component: (
    //     <Adm
    //       windowHeight={windowHeight}
    //       toastMessage={setToastMessage}
    //       modalMessage={setModalMessage}
    //       modalInfo={modalMessage}
    //     />
    //   ),
    //   icon: <SVGPersonConfig width="30" height="30" />,
    //   small: <SVGPersonConfig />,
    // },
    // {
    //   path: "slider",
    //   isRestricted: true,
    //   isAdmRequired: true,
    //   noHude: true,
    //   component: <Slider windowHeight={windowHeight} />,
    // },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderPageContent = () => {
    const page = getPageData();

    if (!page) return <Error404 />;

    if (!page?.isRestricted) return page.component;

    if (page?.isAdmRequired && !user.isManager) {
      return <Error404 />;
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
        <Hamburger user={user} pageIcons={pages} />
        <NavbarContentContainer>
          <Toast
            toastContent={toastMessage}
            setToastContent={setToastMessage}
          />
          <Modal
            modalMessage={modalMessage}
            setModalMessage={setModalMessage}
          />
          <Header
            user={user}
            page={pageData && pageData.name}
            icon={pageData && pageData.icon}
            logged={true}
          />
          <NavbarContentContainer>{renderPageContent()}</NavbarContentContainer>
        </NavbarContentContainer>
      </NavbarMenuContentContainer>
    </Provider>
  );
};

export default HHRouter;
