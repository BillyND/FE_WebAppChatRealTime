import { LoadingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { TIME_DELAY_SEARCH_INPUT } from "../../constants/ConstantHomePage";
import { useScrollToBottom } from "../../hooks/useScrollBottom";
import ListPost, { listPostSubs } from "../ListPost/ListPost";
import NewPost from "../NewPost/NewPost";
import { handleGetListPost } from "../../utils/utilities";

function HomeContent() {
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);
  const [loadingNewPost, setLoadingNewPost] = useState(true);

  useEffect(() => {
    isBottom && handleFetchNewPost();
  }, [isBottom]);

  const handleFetchNewPost = debounce(async () => {
    setLoadingNewPost(true);
    const { next } = listPostSubs.state;
    next && (await handleGetListPost(next));
    setLoadingNewPost(false);
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
            opacity: loadingNewPost ? "1" : "0",
          }}
        >
          <LoadingOutlined className="icon-loading-new-post" />
        </Flex>
      </div>
    </PerfectScrollbar>
  );
}

export default HomeContent;
