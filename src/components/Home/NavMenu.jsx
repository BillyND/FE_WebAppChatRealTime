import PopoverCustom from "@UI/PopoverCustom";
import ToggleSwitch from "@UI/ToggleSwitch";
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
import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
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
          is-mobile={isMobile ? isMobile.toString() : undefined}
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
  const {
    styleApp: { navMenuStyle, type },
  } = useStyleApp();

  const isDark = type === TYPE_STYLE_APP.DARK ? "true" : undefined;
  const { infoUser } = useAuthUser();
  const { pathname, search } = useLocation();
  const { isMobile, isTablet } = useWindowSize();

  const { state } = useSubscription(conversationSubs, ["listConversations"]);
  const { listConversations } = state || {};

  const { _id: userId, email } = infoUser;

  const unreadCount = listConversations.filter(
    (conversation) => !conversation?.usersRead?.includes(userId)
  )?.length;

  useEffect(() => {
    updateTitle(unreadCount);
  }, [unreadCount, pathname]);

  const updateTitle = (unreadCount) => {
    document.title = document.title.replace(/\(\d+\)/g, "");

    if (unreadCount) {
      document.title = `(${unreadCount}) ${document.title}`;
    }
  };

  // Props của component
  const { handleNavigation } = props;

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

  const isActivePath = (path) => {
    if (path === "/message") {
      return pathname.includes("/message");
    }

    if (search) {
      return `${pathname}${search}` === path;
    }

    return pathname === path;
  };

  return (
    <WrapControlNav
      is-dark={isDark}
      is-tablet={isTablet ? isTablet.toString() : undefined}
      is-mobile={isMobile ? isMobile.toString() : undefined}
      style={isMobile ? navMenuStyle : undefined}
      className="group-nav"
    >
      <Flex align="center" justify="center" gap={1}>
        {optionIcon.map((item, index) => {
          const { key, path, iconActive, iconDeActive } = item || {};
          const isActive = isActivePath(path);

          return (
            <div
              key={`${key}-${index}`}
              className="icon-nav cursor-pointer press-active"
              onClick={() => handleNavigation(path)}
            >
              <div
                className={`icon-un-read ${
                  path === "/message" && !!unreadCount ? "show" : ""
                }`}
              >
                {unreadCount}
              </div>

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
  const navigate = useNavigateCustom();

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
        background-color={navMenuStyle.backgroundColor}
        color={navMenuStyle.backgroundColor}
        is-mobile={isMobile ? isMobile.toString() : undefined}
        is-tablet={isTablet ? isTablet.toString() : undefined}
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
