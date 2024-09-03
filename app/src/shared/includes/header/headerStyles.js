import styled from "styled-components";

export const NavBar = styled.nav`
  width: 100%;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 27px;
  background-image: linear-gradient(
    45deg,
    ${(props) => props.theme.colors.primary_1},
    ${(props) => props.theme.colors.primary_2}
  );
`;

export const NavItem1 = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: start;
`;

export const NavItem2 = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: end;
  align-items: center;
`;

export const Division = styled.nav`
  width: 1px;
  height: 100%;
  margin: 0 15px;
  background-color: #fff;
`;

export const RoundButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  background-color: #fff;
  cursor: pointer;
`;

export const ProfilePicture = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
`;

export const Name = styled.h2`
  font-size: 16px;
  margin: 0 15px;
  font-weight: 500;
  min-width: 200px;
  min-height: 20px;
  overflow: hidden;
  color: #fff;
`;

export const openMenu = styled.div`
  position: relative;
  cursor: pointer;
`;
