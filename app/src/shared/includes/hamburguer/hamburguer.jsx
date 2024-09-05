import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as styled from "./hamburguerStyles.js";
import SVGHamburger from "../../icons/hamburguer/Menu_icon.jsx";
import SVGHistory from "../../icons/hamburguer/History_icon.jsx";
import SVGHHControll from "../../icons/hamburguer/HHControll_icon.jsx";
import SVGControll from "../../icons/hamburguer/Controll_icon.jsx";
import SVGUsers from "../../icons/hamburguer/Users_icon.jsx";

const pageIcons = {
  histórico: <SVGHistory />,
  controlehh: <SVGHHControll />,
  gestãohh: <SVGControll />,
  usuários: <SVGUsers />,
};

const Hamburguer = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const { user } = useSelector((state) => state.user);

  const renderMenuItems = () => {
    if (!user || !user.pages) return null;

    return user.pages.map((page) => {
      const formattedPage = page.trim().toLowerCase().replace(/\s+/g, "");
      const IconComponent = pageIcons[formattedPage];

      if (!IconComponent) return null;

      return (
        <Link to={`/${formattedPage}`} key={formattedPage}>
          <styled.MenuIten key={formattedPage}>
            <styled.IconWrapper>{IconComponent}</styled.IconWrapper>
            <styled.ItenText $active={openMenu}>{page}</styled.ItenText>
          </styled.MenuIten>
        </Link>
      );
    });
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
      <styled.IconsDiv>
        {renderMenuItems()}
        {user && user.isManager && (
          <Link to="/usuarios">
            <styled.MenuIten>
              <styled.IconWrapper>
                <SVGUsers />
              </styled.IconWrapper>
              <styled.ItenText $active={openMenu}>Usuários</styled.ItenText>
            </styled.MenuIten>
          </Link>
        )}
      </styled.IconsDiv>
    </styled.Hamburger>
  );
};

export default Hamburguer;
