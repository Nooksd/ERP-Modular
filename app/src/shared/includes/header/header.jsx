import { useEffect, useState } from "react";
import * as styled from "./headerStyles.js";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../store/slicers/userSlicer.js";
import { Link, useNavigate } from "react-router-dom";

import { Loading } from "../../../styles/global.js";

import SVGlogowhite from "../../logo/innova_logo_white.jsx";
import SVGFlag from "../../icons/header/Flag_icon.jsx";
import SVGQuestionmark from "../../icons/header/Question_icon.jsx";
import SVGEngine from "../../icons/header/Engine_icon.jsx";
import SVGArrowDown from "../../icons/header/Arrow_icon.jsx";
import SVGExit from "../../icons/header/Exit_icon.jsx";
import SVGProfile from "../../icons/header/Profile_icon.jsx";

const Header = ({ logged, page, icon }) => {
  const { user } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (e) {
      console.error("Falha no Logout", e);
    }
  };

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar);
      setName(user.name);
    }
  }, [user]);

  return (
    <styled.NavBar>
      <styled.NavItem1>
        {icon}
        <styled.NavTitle>{page}</styled.NavTitle>
      </styled.NavItem1>
      <styled.NavItem2>
        {logged && (
          <>
            <Link to="/report">
              <styled.RoundButton>
                <SVGFlag width="11" height="16" />
              </styled.RoundButton>
            </Link>
            <Link to="/help">
              <styled.RoundButton>
                <SVGQuestionmark width="10" height="17" />
              </styled.RoundButton>
            </Link>
            <Link to="/settings">
              <styled.RoundButton>
                <SVGEngine width="15" height="15" />
              </styled.RoundButton>
            </Link>
            <styled.Division />
            <styled.ProfilePicture>
              {avatar ? (
                <styled.Avatar src={avatar} loading="lazy" alt="" />
              ) : (
                <Loading />
              )}
            </styled.ProfilePicture>
            <styled.Name>{name || <Loading />}</styled.Name>
            <styled.openMenu>
              <SVGArrowDown
                width="25"
                fill="#fff"
                open={open}
                onClick={() => setOpen((prev) => !prev)}
              />
              <styled.Menu $show={open}>
                <Link to="/profile">
                  <styled.MenuItem>
                    <SVGProfile width="15" height="15" />
                    Perfil
                  </styled.MenuItem>
                </Link>
                <Link to="/settings">
                  <styled.MenuItem>
                    <SVGEngine width="15" height="15" />
                    Configuracoes
                  </styled.MenuItem>
                </Link>
                <styled.MenuItem onClick={() => logout()}>
                  <SVGExit width="15" height="15" />
                  Sair
                </styled.MenuItem>
              </styled.Menu>
            </styled.openMenu>
            <styled.Division />
          </>
        )}
        <Link to="/home">
          <SVGlogowhite width="170" fill="#fff" />
        </Link>
      </styled.NavItem2>
    </styled.NavBar>
  );
};

export default Header;
