import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import * as styled from "./hamburguerStyles.js";

import SVGHamburger from "../../icons/hamburguer/Menu_icon.jsx";
import SVGHistory from "../../icons/hamburguer/History_icon.jsx";
import SVGHHControll from "../../icons/hamburguer/HHControll_icon.jsx";
import SVGControll from "../../icons/hamburguer/Controll_icon.jsx";
import SVGUsers from "../../icons/hamburguer/Users_icon.jsx";

const pageIcons = {
  historico: <SVGHistory />,
  controlehh: <SVGHHControll />,
  gestaohh: <SVGControll />,
  usuarios: <SVGUsers />,
};

const Hamburguer = ({ user }) => {
  const [openMenu, setOpenMenu] = useState(false);
  
  const location = useLocation();

  const renderMenuItems = () => {
    if (!user || !user.pages) return null;

    return (
      <>
        {user.pages.map((page) => {
          const formattedPage = page
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "");
          const IconComponent = pageIcons[formattedPage];
          const isActive = location.pathname === `/${formattedPage}`;

          if (!IconComponent) return null;

          return (
            <Link to={`/${formattedPage}`} key={formattedPage}>
              <styled.MenuIten key={formattedPage} $isActive={isActive}>
                <styled.IconWrapper>{IconComponent}</styled.IconWrapper>
                <styled.ItenText $active={openMenu}>{page}</styled.ItenText>
              </styled.MenuIten>
            </Link>
          );
        })}
        {user.isManager && (
          <Link to="/usuarios" style={{ "width": "100%"}}>
            <styled.MenuIten $isActive={location.pathname === "/usuarios"}>
              <styled.IconWrapper>
                <SVGUsers />
              </styled.IconWrapper>
              <styled.ItenText $active={openMenu}>Usuários</styled.ItenText>
            </styled.MenuIten>
          </Link>
        )}
      </>
    );
  };

  return (
    <styled.Hamburger $active={openMenu}>
      <styled.HamburgerIconDiv $active={openMenu}>
        <SVGHamburger
          width="30"
          height="30"
          $active={openMenu}
          onClick={() => setOpenMenu((prev) => !prev)}
        />
      </styled.HamburgerIconDiv>
      <styled.IconsDiv>{renderMenuItems()}</styled.IconsDiv>
    </styled.Hamburger>
  );
};

export default Hamburguer;
