import { SpinnerLoading } from "@UI//SpinnerLoading";
import { TIME_DELAY_SEARCH_INPUT } from "@utils/constant";
import { listPostSubs } from "@utils/globalStates/initGlobalState";
import { openModalWithOutRender } from "@utils/hooks/useModal";
import { useScrollToBottom } from "@utils/hooks/useScrollBottom";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { handleGetListPost } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "../../utils/hooks/useSearchParams";
import ListPost from "../Post/ListPost";
import DetailUser from "./DetailUser";
import { WrapUserScreen } from "./UserScreenStyled";

function UserScreen(props) {
  const { isMobile, isTablet } = useWindowSize();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);
  const [emailParam] = useSearchParams(["email"]);
  const {
    state: { listPostByUser, loading, nextByUser, emailParamState },
    setState: setStateListPost,
  } = useSubscription(listPostSubs, ["listPostByUser", "loading"]);

  useEffect(() => {
    nextByUser && isBottom && handleFetchNewPost();
  }, [isBottom]);

  useEffect(() => {
    const shouldFetchListPost =
      emailParamState !== emailParam ||
      (nextByUser && listPostByUser.length < 1);

    if (shouldFetchListPost) {
      setStateListPost({ listPostByUser: [] });
      emailParam && handleGetListPost({ page: 1, limit: 5, email: emailParam });
    }

    listPostSubs.state.emailParamState = emailParam;

    return () => {
      listPostSubs.state.userIdParamState = null;
      listPostSubs.state.currentUser = null;
    };
  }, [emailParam]);

  const handleFetchNewPost = debounce(async () => {
    setStateListPost({
      loading: true,
    });
    await handleGetListPost({ ...nextByUser, email: emailParam });

    setStateListPost({
      loading: false,
    });
  }, TIME_DELAY_SEARCH_INPUT);

  return (
    <WrapUserScreen
      id="user-screen"
      ref={scrollContainerRef}
      isMobile={isMobile}
      isTablet={isTablet}
    >
      <Flex vertical gap={16} className={`${isMobile ? "pb-5" : undefined}`}>
        <DetailUser />

        {listPostByUser.length === 0 && !loading ? (
          <>
            <hr className="gray" />

            <Flex
              onClick={() => openModalWithOutRender("MODAL_NEW_POST")}
              align="center"
              className="btn-create-new-post none-copy press-active cursor-pointer"
            >
              Start creating your first post
            </Flex>
          </>
        ) : (
          <ListPost
            email={emailParam}
            loading={loading}
            listPost={listPostByUser}
            setStateListPost={setStateListPost}
            handleGetListPost={handleGetListPost}
            keyListPost="listPostByUser"
          />
        )}

        <SpinnerLoading style={{ opacity: loading ? "1" : "0" }} />
      </Flex>
    </WrapUserScreen>
  );
}

export default UserScreen;
