import React from "react";
import SearchHome from "./SearchHome";
import NewPost from "../NewPost/NewPost";
import ListPost from "../ListPost/ListPost";
import PerfectScrollbar from "react-perfect-scrollbar";

function HomeContent(props) {
  return (
    <PerfectScrollbar style={{ height: "100vh" }}>
      <div className="home-content pt-4 px-1">
        <SearchHome />
        <NewPost />
        <ListPost />
      </div>
    </PerfectScrollbar>
  );
}

export default HomeContent;
