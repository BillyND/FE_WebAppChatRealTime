import React, { useState } from "react";
import "./NavMenu.scss";
import {
  HomeOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { postLogout } from "../../services/api";
import { useAuthUser } from "../../hooks/useAuthUser";

function NavMenu(props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const { accessToken } = useAuthUser();

  const handleNavigation = (route) => {
    if (pathname?.includes(route)) return;

    navigate(route);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await postLogout();
    setLoadingLogout(false);
    handleNavigation("/login");
  };

  const renderMenuItem = (icon, text, action, key) => {
    const isSelected = pathname.includes(key); // Check if the route is currently selected

    return (
      <div
        className={`nav-menu button-${key} ${
          isSelected ? "selected" : "" // Add selected class if the route is selected
        } ${key === "logout" && loadingLogout ? "disabled" : ""}`}
        onClick={action}
      >
        {icon}
        <span className="title-menu">{text}</span>
        {key === "logout" && loadingLogout && <LoadingOutlined />}
      </div>
    );
  };

  return (
    <div className="nav-menu-container">
      <div
        className={`nav-menu button-home ${pathname === "/" ? "selected" : ""}`} // Check if home is selected
        onClick={() => handleNavigation("/")}
      >
        <HomeOutlined className="icon" />
        <span className="title-menu">Home</span>
      </div>

      {accessToken && (
        <>
          {renderMenuItem(
            <UserOutlined className="icon" />,
            "Profile",
            () => handleNavigation("/profile"),
            "profile"
          )}

          {renderMenuItem(
            <MessageOutlined className="icon" />,
            "Inbox",
            () => handleNavigation("/inbox"),
            "inbox"
          )}

          {renderMenuItem(
            <LogoutOutlined className="icon" />,
            "Logout",
            handleLogout,
            "logout"
          )}
        </>
      )}
    </div>
  );
}

export default NavMenu;
