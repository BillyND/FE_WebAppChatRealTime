import { useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getInfoUserLocal } from "./services/customAxios";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const { accessToken } = getInfoUserLocal();
    const isOnLoginRegisterPage = "/login/register"?.includes(pathname);
    const isNotOnHomePage = pathname !== "/";
    const shouldRedirectToHome =
      accessToken && isOnLoginRegisterPage && isNotOnHomePage;

    const shouldRedirectToLogin = !accessToken && !isOnLoginRegisterPage;

    if (shouldRedirectToHome) {
      navigate("/");
    }

    if (shouldRedirectToLogin) {
      navigate("/login");
    }
  }, [pathname]);

  return (
    <div>
      <main className="main-content-children">{children}</main>
    </div>
  );
};

export default Layout;
