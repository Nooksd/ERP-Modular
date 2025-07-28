import * as styled from "./asideStyles.js";

import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

export const Aside = ({ user }) => {
  console.log(user);
  return (
    <styled.AsideContainer>
      <styled.profileDiv>
        <styled.profilePicture>
          <img
            loading="lazy"
            src="https://relevium.com.br/wp-content/uploads/2015/09/default-avatar-300x300.png"
            alt="Profile"
          />
        </styled.profilePicture>
        <styled.profileName>{user.employeeId.name}</styled.profileName>
      </styled.profileDiv>
      <styled.expanded />
      <styled.exitDiv>
        <ArrowLeftEndOnRectangleIcon className="w-5 h-5 mr-2" />
        Sair da Conta
      </styled.exitDiv>
    </styled.AsideContainer>
  );
};
