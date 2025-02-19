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
    const groups = [];
    const pages = [];

    user.pages.map((page, i) => {
      const formattedPage = normalizeString(page);

      const pageData = pageIcons.find(
        (p) => normalizeString(p.path) === formattedPage
      );

      if (!pageData) return null;

      const isActive = location.pathname === `/${formattedPage}`;

      if (pageData.group) {
        const located = groups.find((group) => group.group === pageData.group);

        if (located) {
          located.page.push(pageData);
          return null;
        }

        groups.push({ group: pageData.group, page: [pageData] });
      }
    });

    return (
      <>
        {groups.map((group) => {
          return group.page.map((page) => {
            const formattedPage = normalizeString(page.name);

            const pageData = pageIcons.find(
              (p) => normalizeString(p.path) === formattedPage
            );

            if (!pageData) return null;

            const isActive = location.pathname === `/${formattedPage}`;

            return (
              <Link to={`/${formattedPage}`} key={formattedPage}>
                <styled.MenuIten $isActive={isActive}>
                  <styled.IconWrapper>{pageData.small}</styled.IconWrapper>
                  <styled.ItenText $active={openMenu}>{page.name}</styled.ItenText>
                </styled.MenuIten>
              </Link>
            );
          });
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
