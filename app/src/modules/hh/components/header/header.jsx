import * as styled from "./headerStyles.js";
import { Link } from "react-router-dom";

import { Loading } from "../../../../styles/global.js";

import SVGlogowhite from "../../assets/logo/innova_logo_white.jsx";
import SVGExit from "../../assets/icons/header/Exit_icon.jsx";

const Header = ({ page, icon, user, onLogout }) => {
  const avatar =
    user?.avatar ??
    "https://relevium.com.br/wp-content/uploads/2015/09/default-avatar-300x300.png";
  const name = user.employeeId?.name ?? "";

  return (
    <styled.NavBar>
      <styled.NavItem1>
        {icon}
        <styled.NavTitle>{page}</styled.NavTitle>
      </styled.NavItem1>
      <styled.NavItem2>
        <div onClick={onLogout}>
          <styled.RoundButton>
            <SVGExit width="15" height="15" />
          </styled.RoundButton>
        </div>
        <styled.Division />
        <styled.ProfilePicture>
          {avatar ? (
            <styled.Avatar src={avatar} loading="lazy" alt="" />
          ) : (
            <Loading />
          )}
        </styled.ProfilePicture>
        <styled.Name>{name || <Loading />}</styled.Name>
        <styled.Division />
        <Link to="/hh/home">
          <SVGlogowhite width="170" fill="#fff" />
        </Link>
      </styled.NavItem2>
    </styled.NavBar>
  );
};

export default Header;
