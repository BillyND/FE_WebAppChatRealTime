import PopoverCustom from "@UI//PopoverCustom";
import ToggleSwitch from "@UI//ToggleSwitch";
import { LoadingOutlined } from "@ant-design/icons";
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
} from "@assets/icons/icon";
import { postLogout } from "@services/api";
import { TYPE_STYLE_APP } from "@utils/constant";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { openModalWithOutRender } from "@utils/hooks/useModal";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { scrollToTopOfElement } from "@utils/utilities";
import { Flex } from "antd";
import React, { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  WrapButtonSettings,
  WrapContentPopoverSettings,
  WrapControlNav,
  WrapNavMenu,
} from "./HomeStyled";
import ModalReportProblem from "./ModalReportProblem";

const ButtonSettings = (props) => {
  const { logout } = useAuthUser();
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { styleApp, updateStyleApp } = useStyleApp();
  const { isMobile } = useWindowSize();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleToggleStyleLayout = (style) => {
    updateStyleApp(style ? TYPE_STYLE_APP.LIGHT : TYPE_STYLE_APP.DARK);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await postLogout();
    setLoadingLogout(false);
    logout();
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
      onAction: () => openModalWithOutRender("REPORT_PROBLEM"),
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
      onAction: handleLogout,
    },
  ];

  const listSettings = (
    <WrapContentPopoverSettings className="none-copy">
      {data.map((item, index) => {
        const { id, disabled, onAction } = item;
        const isButtonLogout = id === "logOut" && !loadingLogout;
        const isPointer = id !== "appearance";

        return (
          <Fragment key={id}>
            {index > 0 && <hr className="boundary-line-item" />}

            <div
              onClick={() => onAction && onAction()}
              className={`${index > 0 ? "press-active" : ""} item-nav-menu ${
                disabled ? "disabled" : ""
              }  ${isPointer ? "cursor-pointer" : ""}`}
            >
              {item.label}
            </div>
          </Fragment>
        );
      })}
    </WrapContentPopoverSettings>
  );

  return (
    <>
      <ModalReportProblem />
      <PopoverCustom
        onOpenChange={setIsOpen}
        content={listSettings}
        trigger="click"
        placement="bottomLeft"
      >
        <WrapButtonSettings
          isMobile={isMobile}
          className="cursor-pointer"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <IconSettings isActive={isHover || isOpen} />
        </WrapButtonSettings>
      </PopoverCustom>
    </>
  );
};

const ControlMenu = (props) => {
  const { handleNavigation } = props;
  const {
    infoUser: { email },
  } = useAuthUser();
  const { pathname, search } = useLocation();
  const pathname2 = useLocation();
  const {
    styleApp: { navMenuStyle, type },
  } = useStyleApp();
  const { isMobile, isTablet } = useWindowSize();

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
      path: `/user?email=${email}`,
      iconActive: <IconUserActive />,
      iconDeActive: <IconUserDeActive />,
    },
  ];

  return (
    <WrapControlNav
      isDark={type === TYPE_STYLE_APP.DARK}
      isTablet={isTablet}
      style={isMobile ? navMenuStyle : undefined}
      className="group-nav"
    >
      <Flex align="center" justify="center" gap={1}>
        {optionIcon.map((item, index) => {
          const { key, path, iconActive, iconDeActive } = item || {};
          const isActive =
            (search ? `${pathname}${search}` : pathname) === path;

          return (
            <div
              key={`${key}-${index}`}
              className="icon-nav cursor-pointer press-active"
              onClick={() => handleNavigation(path)}
            >
              {isActive ? iconActive : iconDeActive}
            </div>
          );
        })}
      </Flex>
    </WrapControlNav>
  );
};

function NavMenu() {
  const {
    styleApp: { navMenuStyle },
  } = useStyleApp();
  const { isMobile, isTablet } = useWindowSize();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    path !== "/post" && navigate(path);
    path = path.replace(/\?.*$/, "");

    switch (path) {
      case "/": {
        scrollToTopOfElement("home-screen");
        break;
      }

      case "/post": {
        openModalWithOutRender("MODAL_NEW_POST");
        break;
      }

      case "/user": {
        scrollToTopOfElement("user-screen");
        break;
      }
      case "/search": {
        scrollToTopOfElement("list-all-user");
        break;
      }

      default:
        break;
    }
  };

  return (
    <>
      {isMobile && <ControlMenu handleNavigation={handleNavigation} />}
      <WrapNavMenu
        style={navMenuStyle}
        backgroundColor={navMenuStyle.backgroundColor}
        color={navMenuStyle.backgroundColor}
        isMobile={isMobile}
        isTablet={isTablet}
        className="none-copy"
      >
        <div className="group-nav-menu">
          <Flex align="center" justify="center" className="group-nav">
            <div
              className="icon-logo cursor-pointer transition-03"
              onClick={() => handleNavigation("/")}
            >
              <IconLogo />
            </div>
          </Flex>

          {!isMobile && <ControlMenu handleNavigation={handleNavigation} />}

          {isMobile ? (
            <ButtonSettings handleNavigation={handleNavigation} />
          ) : (
            <Flex align="center" justify="center" className="group-nav pr-3">
              <ButtonSettings handleNavigation={handleNavigation} />
            </Flex>
          )}
        </div>
      </WrapNavMenu>
    </>
  );
}

export default NavMenu;
