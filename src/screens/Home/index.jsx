import React from "react";
import "./HomeScreen.scss";
import InfoUser from "../../components/User/InfoUser";
import HomeContent from "./HomeContent";
import NewFriends from "../../components/NewFriends/NewFriends";
import { useWindowSize } from "../../utils/hooks/useWindowSize";

export default function HomeScreen() {
  const { isMobile } = useWindowSize();

  return (
    <div className={`home-container ${isMobile ? "mobile" : ""}`}>
      {!isMobile && <InfoUser />}
      <HomeContent />
      {!isMobile && <NewFriends />}
    </div>
  );
}
