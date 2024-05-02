import { useEffect } from "react";
import { useNavigateCustom } from "../hooks/useNavigateCustom";
import { getInfoUserLocal } from "../../services/customAxios";
import { useLocation } from "react-router-dom";
import { convertToTitleCase } from "../utilities";
import { TIME_DELAY_FETCH_API, TITLE_OF_CURRENT_SITE } from "../constant";
import PreviewImageFullScreen from "../../UI/PreviewImageFullScreen";

export const NavigationHandler = () => {
  const navigate = useNavigateCustom();
  const { pathname } = useLocation();
  const { accessToken } = getInfoUserLocal();

  useEffect(() => {
    document.title = convertToTitleCase(pathname) || TITLE_OF_CURRENT_SITE;

    if (accessToken && (pathname === "/login" || pathname === "/register")) {
      navigate("/");
    }

    if (!accessToken && pathname !== "/login" && pathname !== "/register") {
      navigate("/login");
    }
  }, [pathname, accessToken]);

  return <PreviewImageFullScreen />;
};
