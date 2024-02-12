import { Outlet } from "react-router-dom";
import NavMenu from "./components/Home/NavMenu";

const Layout = () => {
  return (
    <>
      <NavMenu />
      <div className="outlet-component">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
