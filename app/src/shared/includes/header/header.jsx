import { useEffect, useState } from "react";
import * as styled from "./headerStyles.js";
import { useSelector } from "react-redux";
import SVGlogowhite from "../../logo/innova_logo_white.jsx";
import SVGFlag from "../../icons/Flag_icon.jsx";
import SVGQuestionmark from "../../icons/Question_icon.jsx";
import SVGEngine from "../../icons/Engine_icon.jsx";
import SVGArrowDown from "../../icons/Arrow_icon.jsx";
import { Loading } from "../../../styles/global.js";

const Header = ({ page, icon }) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar);
      setName(user.name);
      setLoading(false);
    }
  }, [user]);

  return (
    <styled.NavBar>
      <styled.NavItem1>
        { icon }
        <h1>{ page }</h1>
      </styled.NavItem1>
      <styled.NavItem2>
        <styled.RoundButton>
          <SVGFlag width="11" height="16" />
        </styled.RoundButton>
        <styled.RoundButton>
          <SVGQuestionmark width="10" height="17" />
        </styled.RoundButton>
        <styled.RoundButton>
          <SVGEngine width="15" height="15" />
        </styled.RoundButton>
        <styled.Division />
        <styled.ProfilePicture>
          {loading ? (
            <Loading />
          ) : (
            <styled.Avatar src={avatar} loading="lazy" alt="" />
          )}
        </styled.ProfilePicture>
        <styled.Name>{loading ? <Loading /> : name}</styled.Name>
        <styled.openMenu>
          <SVGArrowDown
            width="25"
            fill="#fff"
            open={open}
            onClick={() => setOpen((prev) => !prev)}
          />
        </styled.openMenu>
        <styled.Division />
        <SVGlogowhite width="170" fill="#fff" />
      </styled.NavItem2>
    </styled.NavBar>
  );
};

export default Header;
