import { SpinnerLoading } from "@UI//SpinnerLoading";
import { TIME_DELAY_SEARCH_INPUT } from "@utils/constant";
import { listPostSubs } from "@utils/globalStates/initGlobalState";
import { useScrollToBottom } from "@utils/hooks/useScrollBottom";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { handleGetListPost } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";
import ListPost from "../Post/ListPost";
import NewPost from "../Post/NewPost";
import { WrapHomeScreen } from "./HomeStyled";

export default function HomeScreen() {
  const { isMobile, isTablet } = useWindowSize();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);
  const {
    state: { listPost, postIdDelete, loading, next },
    setState: setStateListPost,
  } = useSubscription(listPostSubs, ["listPost", "loading"]);

  console.log("===>next:", next);

  useEffect(() => {
    next && isBottom && handleFetchNewPost();
  }, [isBottom]);

  useEffect(() => {
    next && listPost.length < 1 && handleGetListPost({ page: 1, limit: 5 });
  }, []);

  const handleFetchNewPost = debounce(async () => {
    setStateListPost({
      loading: true,
    });
    await handleGetListPost(next);

    setStateListPost({
      loading: false,
    });
  }, TIME_DELAY_SEARCH_INPUT);

  return (
    <WrapHomeScreen
      id="home-container"
      ref={scrollContainerRef}
      isMobile={isMobile}
      isTablet={isTablet}
    >
      {!isMobile && <NewPost />}
      <Flex vertical gap={20} className={`${isMobile ? "pb-5" : undefined}`}>
        <ListPost
          loading={loading}
          listPost={listPost}
          setStateListPost={setStateListPost}
          postIdDelete={postIdDelete}
          handleGetListPost={handleGetListPost}
          keyListPost="listPost"
        />
        <SpinnerLoading style={{ opacity: loading ? "1" : "0" }} />
      </Flex>
    </WrapHomeScreen>
  );
}
