import { useSubscription } from "global-state-hook";
import React from "react";
import { SpinnerLoading } from "../../UI/SpinnerLoading";
import ListPost from "../../components/Post/ListPost";
import NewPost from "../../components/Post/NewPost";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { Flex } from "antd";

function HomeContent() {
  const { styleApp } = useStyleApp();
  const { isMobile } = useWindowSize();
  const {
    state: { loading },
    setState,
  } = useSubscription(listPostSubs, ["loading"]);

  return (
    <div className="home-content" style={styleApp}>
      {!isMobile && <NewPost />}
      <Flex vertical gap={20} className={`${isMobile ? "pb-5" : undefined}`}>
        <ListPost />
        <SpinnerLoading style={{ opacity: loading ? "1" : "0" }} />
      </Flex>
    </div>
  );
}

export default HomeContent;
