import { useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getInfoUserLocal } from "./services/customAxios";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { accessToken } = getInfoUserLocal();
  const isOnLoginRegisterPage =
    pathname === "/login" || pathname === "/register";
  const isNotOnHomePage = pathname !== "/";
  const shouldRedirectToHome =
    accessToken && isOnLoginRegisterPage && isNotOnHomePage;

  const shouldRedirectToLogin = !accessToken && !isOnLoginRegisterPage;

  useEffect(() => {
    if (shouldRedirectToHome) {
      navigate("/");
    }

    if (shouldRedirectToLogin) {
      navigate("/login");
    }
  }, [pathname]);

  return (
    <div>
      <main
        className={`main-content-children ${
          !isOnLoginRegisterPage ? "has-header " : ""
        }`}
      >
        {!isOnLoginRegisterPage && (
          <header className="header-container"></header>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
