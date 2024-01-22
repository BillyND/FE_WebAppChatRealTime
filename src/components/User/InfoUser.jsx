import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import NavMenu from "../NavMenu/NavMenu";
import DetailUser from "./DetailUser";
import "./User.scss";
import { useLocation } from "react-router-dom";

function InfoUser(props) {
  const { pathname } = useLocation();

  console.log("===>pathname:", pathname);
  return (
    <PerfectScrollbar>
      <div className="info-user-container p-4 none-copy">
        {/* <DetailUser /> */}
        <b className="divider-dashed"></b>
        <NavMenu />
        <b className="divider-dashed"></b>
      </div>
    </PerfectScrollbar>
  );
}

export default InfoUser;
