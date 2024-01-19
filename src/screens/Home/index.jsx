import React from "react";
import "./HomeScreen.scss";
import InfoUser from "../../components/User/InfoUser";
import HomeContent from "./HomeContent";
import NewFriends from "../../components/NewFriends/NewFriends";

export default function HomeScreen() {
  return (
    <div className="home-container">
      <InfoUser />
      <HomeContent />
      <NewFriends />
    </div>
  );
}
