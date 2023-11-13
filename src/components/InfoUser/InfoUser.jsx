import React from "react";
import "./InfoUser.scss";
import DetailUser from "./DetailUser";
import NavMenu from "../NavMenu/NavMenu";
import Contact from "../Contact/Contact";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

function InfoUser(props) {
  return (
    <PerfectScrollbar>
      <div className="info-user-container p-4 none-copy">
        <DetailUser />
        <b className="divider-dashed"></b>
        <NavMenu />
        <b className="divider-dashed"></b>
        <Contact />
      </div>
    </PerfectScrollbar>
  );
}

export default InfoUser;
