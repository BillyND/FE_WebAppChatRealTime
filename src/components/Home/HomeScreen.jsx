import { SpinnerLoading } from "@UI/SpinnerLoading";
import { listPostSubs } from "@utils/globalStates/initGlobalState";
import { useScrollToBottom } from "@utils/hooks/useScrollBottom";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { handleGetListPost } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef } from "react";
import ListPost from "../Post/ListPost";
import NewPost from "../Post/NewPost";
import { WrapHomeScreen } from "./HomeStyled";

export default function HomeScreen() {
  const { isMobile, isTablet } = useWindowSize();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);
  const {
    state: { listPost, loading, next },
    setState: setStateListPost,
  } = useSubscription(listPostSubs, ["listPost", "loading", "next"]);

  useEffect(() => {
    next && isBottom && handleFetchNewPost();
  }, [isBottom]);

  useEffect(() => {
    handleGetListPost({ page: 1, limit: 5 });
  }, []);

  const handleFetchNewPost = async () => {
    setStateListPost({
      loading: true,
    });
    await handleGetListPost(next);

    setStateListPost({
      loading: false,
    });
  };

  return (
    <WrapHomeScreen
      id="home-screen"
      ref={scrollContainerRef}
      is-mobile={isMobile ? isMobile.toString() : undefined}
      is-tablet={isTablet ? isTablet.toString() : undefined}
    >
      {!isMobile && <NewPost />}
      <Flex vertical gap={20} className={`${isMobile ? "pb-5" : undefined}`}>
        <ListPost
          loading={loading}
          listPost={listPost}
          setStateListPost={setStateListPost}
          keyListPost="listPost"
        />
        <SpinnerLoading style={{ opacity: loading ? "1" : "0" }} />
      </Flex>
    </WrapHomeScreen>
  );
}
