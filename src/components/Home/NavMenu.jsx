import { Button, Flex, List, Popover } from "antd";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ToggleSwitch from "../../UI/ToggleSwitch";
import {
  IconHomeActive,
  IconHomeDeActive,
  IconLogo,
  IconMessageActive,
  IconMessageDeActive,
  IconPostDeActive,
  IconSearchActive,
  IconSearchDeActive,
  IconSettings,
  IconUserActive,
  IconUserDeActive,
} from "../../assets/icons/icon";
import { postLogout } from "../../services/api";
import { TYPE_STYLE_APP } from "../../utils/constant";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { openModalWithOutRender } from "../../utils/hooks/useModal";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { WrapButtonSettings, WrapNavMenu } from "./HomeStyled";
import PopoverCustom from "../../UI/PopoverCustom";

const ButtonSettings = (props) => {
  const { handleLogout } = props;
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const data = [
    {
      id: "appearance",
      label: "Appearance",
    },
    {
      id: "reportProblem",
      label: "Report problem",
    },
    {
      id: "logOut",
      label: <Button onClick={handleLogout}>Log out</Button>,
    },
  ];

  const ListSettings = () => {
    return (
      <>
        {data.map((item, index) => {
          const { id } = item;
          return <div key={id}>{item.label}</div>;
        })}
      </>
    );
  };

  return (
    <PopoverCustom
      onOpenChange={setIsOpen}
      content={<ListSettings />}
      trigger="click"
      placement="bottomLeft"
    >
      <WrapButtonSettings
        className="cursor-pointer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <IconSettings isActive={isHover || isOpen} />
      </WrapButtonSettings>
    </PopoverCustom>
  );
};

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
          {optionIcon.map((item, index) => {
            const { key, path, iconActive, iconDeActive } = item || {};
            const isActive = pathname === path;

            return (
              <div
                key={`${key}-${index}`}
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
          className="group-nav pr-3"
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

          <ButtonSettings handleLogout={handleLogout} />
        </Flex>
      </div>
    </WrapNavMenu>
  );
}

export default NavMenu;
