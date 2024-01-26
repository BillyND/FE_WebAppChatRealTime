import { LoadingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React from "react";
import ListPost from "../../components/Post/ListPost";
import NewPost from "../../components/Post/NewPost";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import { TYPE_STYLE_APP } from "../../utils/constant";

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
  const {
    state: { loading },
  } = useSubscription(listPostSubs, ["loading"]);

  return (
    <div className="home-content">
      <NewPost />
      <ListPost />
      <SpinnerLoading
        className={"pt-4"}
        style={{ opacity: loading ? "1" : "0" }}
      />
    </div>
  );
}

export default HomeContent;
