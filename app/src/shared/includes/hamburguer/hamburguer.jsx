import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as styled from "./hamburguerStyles.js";

import SVGHamburger from "../../icons/hamburguer/Menu_icon.jsx";

const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

const Hamburguer = ({ user, pageIcons }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  const renderMenuItems = () => {
    if (!user || !user.pages) return null;

    return (
      <>
        {user.pages.map((page) => {
          const formattedPage = normalizeString(page);

          const pageData = pageIcons.find(
            (p) => normalizeString(p.path) === formattedPage
          );

          if (!pageData) return null;

          const isActive = location.pathname === `/${formattedPage}`;

          return (
            <Link to={`/${formattedPage}`} key={formattedPage}>
              <styled.MenuIten $isActive={isActive}>
                <styled.IconWrapper>{pageData.small}</styled.IconWrapper>
                <styled.ItenText $active={openMenu}>{page}</styled.ItenText>
              </styled.MenuIten>
            </Link>
          );
        })}
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
