import { useEffect, useState } from "react";
import * as styled from "./hamburguerStyles.js";
import SVGHamburger from "../../icons/hamburguer/Menu_icon.jsx";

const Hamburguer = () => {
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    console.log(openMenu);
  }, [openMenu]);
  return (
    <styled.Hamburger $active={openMenu}>
      <SVGHamburger
        width="30"
        height="30"
        $active={openMenu}
        onClick={() => setOpenMenu((prev) => !prev)}
      />
    </styled.Hamburger>
  );
};

export default Hamburguer;
