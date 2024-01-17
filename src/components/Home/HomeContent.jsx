import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import ListPost from "../ListPost/ListPost";
import NewPost from "../NewPost/NewPost";

function HomeContent() {
  return (
    <PerfectScrollbar style={{ height: "100vh" }}>
      <div className="home-content">
        <NewPost />
        <ListPost />
      </div>
    </PerfectScrollbar>
  );
}

export default HomeContent;
