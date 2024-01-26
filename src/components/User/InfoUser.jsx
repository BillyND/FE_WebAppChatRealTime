import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useLocation } from "react-router-dom";
import "./User.scss";

function InfoUser(props) {
  const { pathname } = useLocation();

  console.log("===>pathname:", pathname);
  return (
    <PerfectScrollbar>
      <div className="info-user-container p-4 none-copy">
        {/* <DetailUser /> */}
        <b className="divider-dashed"></b>
        <b className="divider-dashed"></b>
      </div>
    </PerfectScrollbar>
  );
}

export default InfoUser;
