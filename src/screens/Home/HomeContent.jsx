import { LoadingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";
import ListPost from "../../components/Post/ListPost";
import NewPost from "../../components/Post/NewPost";
import { TIME_DELAY_SEARCH_INPUT } from "../../utils/constant";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { useScrollToBottom } from "../../utils/hooks/useScrollBottom";
import { handleGetListPost } from "../../utils/utilities";

export const SpinnerLoading = ({ style, className }) => (
  <Flex
    style={{
      ...style,
      position: "relative",
      height: "60px",
    }}
    className={`transition-02 ${className}`}
    justify="center"
  >
    <LoadingOutlined
      className="icon-loading"
      style={{ position: "absolute" }}
    />
  </Flex>
);

function HomeContent() {
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
    <div
      className="enable-scroll"
      ref={scrollContainerRef}
      style={{ height: "100vh" }}
    >
      <div className="home-content">
        <NewPost />
        <ListPost />
        <SpinnerLoading
          className={"pt-4"}
          style={{ opacity: loading ? "1" : "0" }}
        />
      </div>
    </div>
  );
}

export default HomeContent;
