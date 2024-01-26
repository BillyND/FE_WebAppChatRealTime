import React, { useState } from "react";
import { WrapNavMenu } from "./HomeStyled";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import { Flex } from "antd";
import {
  IconHomeActive,
  IconHomeDeActive,
  IconLogo,
} from "../../assets/icons/icon";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { useLocation, useNavigate } from "react-router-dom";
import { postLogout } from "../../services/api";

function NavMenu(props) {
  const { styleApp, updateStyleApp } = useStyleApp();
  const { isMobile } = useWindowSize();
  const { type, color } = styleApp;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const {
    accessToken,
    infoUser: { _id: userId, username, avaUrl },
  } = useAuthUser();

  const handleNavigation = (route) => {
    if (pathname === route) return;
    navigate(route);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await postLogout();
    setLoadingLogout(false);
    handleNavigation("/login");
  };

  return (
    <WrapNavMenu
      type={type}
      color={color}
      isMobile={isMobile}
      className="none-copy"
    >
      <div className="group-nav-menu">
        <Flex align="center" justify="center" className="group-nav pl-3">
          <div className="icon-logo cursor-pointer transition-02">
            <IconLogo />
          </div>
        </Flex>
        <Flex align="center" justify="center" className="group-nav" gap={1}>
          <div className="icon-center cursor-pointer transition-02">
            <IconHomeActive />
            {/* <IconHomeDeActive /> */}
          </div>

          <div className="icon-center cursor-pointer transition-02">
            <IconHomeActive />
            {/* <IconHomeDeActive /> */}
          </div>

          <div className="icon-center cursor-pointer transition-02">
            <IconHomeActive />
            {/* <IconHomeDeAc/tive /> */}
          </div>

          <div className="icon-center cursor-pointer transition-02">
            <IconHomeActive />
            {/* <IconHomeDeActive /> */}
          </div>

          <div className="icon-center cursor-pointer transition-02">
            <IconHomeActive />
            {/* <IconHomeDeActive /> */}
          </div>
        </Flex>
        <Flex
          align="center"
          justify="center"
          className="group-nav pr-3 cursor-pointer"
        >
          <div
            className="icon-logo cursor-pointer transition-02"
            onClick={handleLogout}
          >
            Logout
          </div>
        </Flex>
      </div>
    </WrapNavMenu>
  );
}

export default NavMenu;
