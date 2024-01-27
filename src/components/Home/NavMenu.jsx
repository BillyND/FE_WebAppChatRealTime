import { Flex } from "antd";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconMessageActive,
  IconMessageDeActive,
  IconHomeActive,
  IconHomeDeActive,
  IconLogo,
  IconPostDeActive,
  IconSearchActive,
  IconSearchDeActive,
  IconUserActive,
  IconUserDeActive,
} from "../../assets/icons/icon";
import { postLogout } from "../../services/api";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { WrapNavMenu } from "./HomeStyled";
import { openModalWithOutRender, useModal } from "../../utils/hooks/useModal";
import ToggleSwitch from "../../UI/ToggleSwitch";
import { TYPE_STYLE_APP } from "../../utils/constant";

function NavMenu(props) {
  const { styleApp, updateStyleApp } = useStyleApp();
  const { isMobile } = useWindowSize();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const {
    accessToken,
    infoUser: { _id: userId, username, avaUrl },
  } = useAuthUser();

  const handleToggleStyleLayout = (style) => {
    updateStyleApp(style ? TYPE_STYLE_APP.DARK : TYPE_STYLE_APP.LIGHT);
  };

  const handleNavigation = (path) => {
    if (path === "/post") {
      openModalWithOutRender("MODAL_NEW_POST");
      return;
    }

    if (pathname === path || !path) {
      return;
    }
    navigate(path);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await postLogout();
    setLoadingLogout(false);
    handleNavigation("/login");
  };

  const optionIcon = [
    {
      key: "home",
      path: "/",
      iconActive: <IconHomeActive />,
      iconDeActive: <IconHomeDeActive />,
    },
    {
      key: "search",
      path: "/search",
      iconActive: <IconSearchActive />,
      iconDeActive: <IconSearchDeActive />,
    },
    {
      key: "post",
      path: "/post",
      iconActive: <IconPostDeActive />,
      iconDeActive: <IconPostDeActive />,
    },
    {
      key: "message",
      path: "/message",
      iconActive: <IconMessageActive />,
      iconDeActive: <IconMessageDeActive />,
    },
    {
      key: "user",
      path: `/user/${userId}`,
      iconActive: <IconUserActive />,
      iconDeActive: <IconUserDeActive />,
    },
  ];

  return (
    <WrapNavMenu style={styleApp} className="none-copy">
      <div className="group-nav-menu">
        <Flex align="center" justify="center" className="group-nav pl-3">
          <div className="icon-logo cursor-pointer transition-03">
            <IconLogo />
          </div>
        </Flex>
        <Flex align="center" justify="center" className="group-nav" gap={1}>
          {optionIcon.map((item) => {
            const { key, path, iconActive, iconDeActive } = item || {};
            const isActive = pathname === path;

            return (
              <div
                key={key}
                className="icon-nav cursor-pointer transition-02"
                onClick={() => handleNavigation(path)}
              >
                {isActive ? iconActive : iconDeActive}
              </div>
            );
          })}
        </Flex>
        <Flex
          align="center"
          justify="center"
          className="group-nav pr-3 cursor-pointer"
          gap={16}
        >
          <Flex gap={4} align="center" justify="center">
            Light{" "}
            <ToggleSwitch
              active={styleApp.type === TYPE_STYLE_APP.DARK}
              onToggle={handleToggleStyleLayout}
            />
            Dark
          </Flex>
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
