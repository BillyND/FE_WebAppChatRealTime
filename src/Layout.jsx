import { useEffect } from "react";
import { getInfoUserLocal } from "./services/customAxios";
import { useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const { accessToken } = getInfoUserLocal();
    const isOnLoginRegisterPage = "/login/register"?.includes(pathname);
    const isNotOnHomePage = pathname !== "/";
    const shouldRedirectToHome =
      accessToken && isOnLoginRegisterPage && isNotOnHomePage;

    if (shouldRedirectToHome) {
      navigate("/");
    }

    if (!accessToken) {
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
