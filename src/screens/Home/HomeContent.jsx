import { LoadingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { TIME_DELAY_SEARCH_INPUT } from "../../utils/constant";
import { useScrollToBottom } from "../../utils/hooks/useScrollBottom";
import ListPost, { listPostSubs } from "../../components/Post/ListPost";
import NewPost from "../../components/Post/NewPost";
import { handleGetListPost } from "../../utils/utilities";
import { useSubscription } from "global-state-hook";

function HomeContent() {
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);
  const {
    state: { loading },
    setState,
  } = useSubscription(listPostSubs, ["loading"]);
  console.log("===>loading", loading);

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
    <PerfectScrollbar
      containerRef={(ref) => (scrollContainerRef.current = ref)}
      style={{ height: "100vh" }}
    >
      <div className="home-content">
        <NewPost />
        <ListPost />
        <Flex
          className="transition-02"
          justify="center"
          style={{
            opacity: loading ? "1" : "0",
          }}
        >
          <LoadingOutlined className="icon-loading-new-post" />
        </Flex>
      </div>
    </PerfectScrollbar>
  );
}

export default HomeContent;
