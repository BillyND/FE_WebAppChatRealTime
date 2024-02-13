import { SpinnerLoading } from "@UI//SpinnerLoading";
import { TIME_DELAY_SEARCH_INPUT } from "@utils/constant";
import { listPostSubs } from "@utils/globalStates/initGlobalState";
import { useScrollToBottom } from "@utils/hooks/useScrollBottom";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { handleGetListPostByUser } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ListPost from "../Post/ListPost";
import DetailUser from "./DetailUser";
import { WrapUserScreen } from "./UserScreenStyled";
import { openModalWithOutRender } from "@utils/hooks/useModal";

function UserScreen(props) {
  const { isMobile, isTablet } = useWindowSize();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);
  const { userId } = useParams();
  const {
    state: { listPostByUser, postIdDelete, loading, nextByUser },
    setState: setStateListPost,
  } = useSubscription(listPostSubs, ["listPostByUser", "loading"]);

  useEffect(() => {
    nextByUser && isBottom && handleFetchNewPost();
  }, [isBottom]);

  useEffect(() => {
    nextByUser &&
      listPostByUser.length < 1 &&
      handleGetListPostByUser({ page: 1, limit: 5, userId });
  }, []);

  const handleFetchNewPost = debounce(async () => {
    setStateListPost({
      loading: true,
    });
    await handleGetListPostByUser({ ...nextByUser, userId });

    setStateListPost({
      loading: false,
    });
  }, TIME_DELAY_SEARCH_INPUT);
  return (
    <WrapUserScreen
      id="home-container"
      ref={scrollContainerRef}
      isMobile={isMobile}
      isTablet={isTablet}
    >
      <Flex vertical gap={20} className={`${isMobile ? "pb-5" : undefined}`}>
        <DetailUser />

        {listPostByUser.length > 0 ? (
          <ListPost
            loading={loading}
            listPost={listPostByUser}
            setStateListPost={setStateListPost}
            postIdDelete={postIdDelete}
            handleGetListPost={handleGetListPostByUser}
            keyListPost="listPostByUser"
          />
        ) : (
          <>
            <hr className="gray" />

            <Flex
              onClick={() => openModalWithOutRender("MODAL_NEW_POST")}
              align="center"
              className="btn-create-new-post px-3 none-copy press-active transition-02 cursor-pointer"
            >
              Start creating your first post
            </Flex>
          </>
        )}

        <SpinnerLoading style={{ opacity: loading ? "1" : "0" }} />
      </Flex>
    </WrapUserScreen>
  );
}

export default UserScreen;
