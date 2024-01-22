import React from "react";
import "./HomeScreen.scss";
import InfoUser from "../../components/User/InfoUser";
import HomeContent from "./HomeContent";
import NewFriends from "../../components/NewFriends/NewFriends";
import { useWindowSize } from "../../utils/hooks/useWindowSize";

export default function HomeScreen({ path }) {
  const { isMobile } = useWindowSize();

  const pathToScreen = {
    "/": <HomeContent />,
    "/profile": "profile",
    "/inbox": "inbox",
  };

  console.log("===>path:", path);

  return (
    <div className={`home-container ${isMobile ? "mobile" : ""}`}>
      {!isMobile && <InfoUser />}
      {pathToScreen?.[path]}
      {!isMobile && <NewFriends />}
    </div>
  );
}
