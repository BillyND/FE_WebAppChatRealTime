import { Button, Flex, Switch } from "antd";
import React, { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PopoverCustom from "../../UI/PopoverCustom";
import ToggleSwitch from "../../UI/ToggleSwitch";
import {
  IconHomeActive,
  IconHomeDeActive,
  IconLogo,
  IconMessageActive,
  IconMessageDeActive,
  IconMoon,
  IconPostDeActive,
  IconSearchActive,
  IconSearchDeActive,
  IconSettings,
  IconSunlight,
  IconUserActive,
  IconUserDeActive,
} from "../../assets/icons/icon";
import { postLogout } from "../../services/api";
import { TYPE_STYLE_APP } from "../../utils/constant";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { openModalWithOutRender } from "../../utils/hooks/useModal";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import {
  WrapButtonSettings,
  WrapContentPopoverSettings,
  WrapNavMenu,
} from "./HomeStyled";
import { LoadingOutlined } from "@ant-design/icons";

const ButtonSettings = (props) => {
  const { handleNavigation } = props;
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    styleApp,
    styleApp: { navMenuStyle, popoverSettings },
    updateStyleApp,
  } = useStyleApp();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleToggleStyleLayout = (style) => {
    updateStyleApp(style ? TYPE_STYLE_APP.LIGHT : TYPE_STYLE_APP.DARK);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await postLogout();
    setLoadingLogout(false);
    handleNavigation("/login");
  };

  const data = [
    {
      id: "appearance",
      label: (
        <Flex align="center" justify="center" gap={10}>
          <IconMoon className={`icon-style`} />
          <ToggleSwitch
            active={styleApp.type === TYPE_STYLE_APP.LIGHT}
            onToggle={handleToggleStyleLayout}
          />
          <IconSunlight className={`icon-style`} />
        </Flex>
      ),
    },
    {
      id: "reportProblem",
      label: "Report problem",
    },
    {
      id: "logOut",
      label: (
        <Flex justify="space-between">
          <span>Log out</span>
          {loadingLogout && <LoadingOutlined className="spinner-logout" />}
        </Flex>
      ),
      disabled: loadingLogout,
    },
  ];

  const listSettings = (
    <WrapContentPopoverSettings style={popoverSettings} className="none-copy">
      {data.map((item, index) => {
        const { id, disabled } = item;
        const isButtonLogout = id === "logOut" && !loadingLogout;
        const isPointer = id !== "appearance";

        return (
          <Fragment key={id}>
            {index > 0 && <hr className="boundary-line-item" />}

            <div
              onClick={() => isButtonLogout && handleLogout()}
              className={` item-nav-menu ${disabled ? "disabled" : ""}  ${
                isPointer ? "cursor-pointer" : ""
              }`}
            >
              {item.label}
            </div>
          </Fragment>
        );
      })}
    </WrapContentPopoverSettings>
  );

  return (
    <PopoverCustom
      onOpenChange={setIsOpen}
      content={listSettings}
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
  const {
    styleApp,
    styleApp: { navMenuStyle },
    updateStyleApp,
  } = useStyleApp();
  const { isMobile } = useWindowSize();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const {
    accessToken,
    infoUser: { _id: userId, username, avaUrl },
  } = useAuthUser();

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
    <WrapNavMenu style={navMenuStyle} className="none-copy">
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
          <ButtonSettings handleNavigation={handleNavigation} />
        </Flex>
      </div>
    </WrapNavMenu>
  );
}

export default NavMenu;
