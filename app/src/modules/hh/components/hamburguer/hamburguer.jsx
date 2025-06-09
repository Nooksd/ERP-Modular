import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as styled from "./hamburguerStyles.js";

import SVGHamburger from "../../assets/icons/hamburguer/Menu_icon.jsx";

const Hamburguer = ({ user, pageIcons }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  const renderMenuItems = () => {
    if (!pageIcons || !Array.isArray(pageIcons)) {
      console.error("Invalid pages array provided");
      return null;
    }

    let permission = user.modulePermissions.find(
      (perm) => perm.module === "hh"
    );
    if (!permission?.access) permission = { access: 0 };

    if (user.globalPermission > permission.access)
      permission = { access: user.globalPermission };

    return (
      <>
        {pageIcons.map((page) => {
          if (
            page.permission > permission.access ||
            (page.permission === 1 && permission.access === 2)
          ) {
            return null;
          }
          if (page.path === "home") return null;

          const isActive = location.pathname === `/${page.path}`;

          return (
            <Link to={`/hh/${page.path}`} key={page.path}>
              <styled.MenuIten $isActive={isActive}>
                <styled.IconWrapper>{page.small}</styled.IconWrapper>
                <styled.ItenText $active={openMenu}>
                  {page.name}
                </styled.ItenText>
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
