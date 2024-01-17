import React from "react";
import "./HomePage.scss";
import InfoUser from "../InfoUser/InfoUser";
import HomeContent from "./HomeContent";
import NewFriends from "../NewFriends/NewFriends";

function HomePage() {
  return (
    <div className="home-container">
      <InfoUser />
      <HomeContent />
      <NewFriends />
    </div>
  );
}

export default HomePage;
