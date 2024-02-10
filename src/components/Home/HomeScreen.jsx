import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";
import { TIME_DELAY_SEARCH_INPUT } from "@utils/constant";
import { listPostSubs } from "@utils/globalStates/initGlobalState";
import { useScrollToBottom } from "@utils/hooks/useScrollBottom";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { handleGetListPost } from "@utils/utilities";
import ListPost from "../Post/ListPost";
import NewPost from "../Post/NewPost";
import { WrapHomeScreen } from "./HomeStyled";
import NavMenu from "./NavMenu";
import { SpinnerLoading } from "@UI//SpinnerLoading";

export default function HomeScreen({ path }) {
  const { isMobile, isTablet } = useWindowSize();
  const { styleApp } = useStyleApp();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);
  const {
    state: { loading },
    setState,
  } = useSubscription(listPostSubs, ["loading"]);

  useEffect(() => {
    isBottom && handleFetchNewPost();
  }, [isBottom]);

  const handleFetchNewPost = debounce(async () => {
    setState({
      loading: true,
    });
    const { next } = listPostSubs.state;
    next && (await handleGetListPost(next));
    setState({
      loading: false,
    });
  }, TIME_DELAY_SEARCH_INPUT);

  return (
    <WrapHomeScreen
      id="home-container"
      ref={scrollContainerRef}
      isMobile={isMobile}
      isTablet={isTablet}
      style={styleApp}
    >
      <NavMenu />

      {!isMobile && <NewPost />}
      <Flex vertical gap={20} className={`${isMobile ? "pb-5" : undefined}`}>
        <ListPost />
        <SpinnerLoading style={{ opacity: loading ? "1" : "0" }} />
      </Flex>
    </WrapHomeScreen>
  );
}
