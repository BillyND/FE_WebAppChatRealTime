import { Outlet } from "react-router-dom";
import NavMenu from "./components/Home/NavMenu";

const Layout = () => {
  return (
    <>
      <NavMenu />
      <Outlet />
    </>
  );
};

export default Layout;
