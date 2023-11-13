import React from "react";
import SearchHome from "./SearchHome";
import NewPost from "../NewPost/NewPost";

function HomeContent(props) {
  return (
    <div className="home-content pt-4 px-1">
      <SearchHome />
      <NewPost />
    </div>
  );
}

export default HomeContent;
