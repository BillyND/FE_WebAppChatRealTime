import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { boxMessageId } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import {
  handleGetMessage,
  handleReadConversation,
} from "../../utils/utilities";
import MessageList from "../Message/MessageList";
import { DraggerUploadImage } from "./ConversationUploadImg";

const ConversationContent = ({
  avaUrl,
  username,
  email,
  boxMessageElement,
}) => {
  const { state } = useSubscription(conversationSubs, ["listMessages", "next"]);
  let { listMessages, next } = state || {};
  const navigate = useNavigateCustom();
  const [loadMore, setLoadMore] = useState(false);

  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  useEffect(() => {
    loadMore && setLoadMore(false);
    handleReadConversation();
  }, [listMessages]);

  const handleScrollToTop = () => {
    !loadMore && setLoadMore(true);
    next && handleGetMessage({ ...next, allowFetching: false });
  };

  const handlePreventDnd = (e, type) => {
    e.preventDefault();
    boxMessageElement.current?.classList.add("drag-image");
  };

  return (
    <div
      onDragEnter={handlePreventDnd}
      onDragLeave={handlePreventDnd}
      onDragOver={handlePreventDnd}
      onDrop={handlePreventDnd}
      onDragEnd={handlePreventDnd}
      className="content-conversation"
      id={boxMessageId}
      ref={boxMessageElement}
    >
      <DraggerUploadImage boxMessageElement={boxMessageElement} />
      <InfiniteScroll
        dataLength={listMessages.length}
        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        inverse={true}
        next={handleScrollToTop}
        hasMore={true}
        loader={loadMore && next && <SpinnerLoading />}
        scrollableTarget={"box-list-message"}
      >
        <MessageList listMessages={listMessages} userId={userId} />
      </InfiniteScroll>
      {!next && (
        <Flex
          vertical
          align="center"
          justify="center"
          gap={12}
          className="pt-5"
        >
          <UserThumbnail avaUrl={avaUrl} size={70} />

          <Flex vertical gap={4} align="center" justify="center">
            <b>{username}</b>
            <span className="user-email">{email}</span>
          </Flex>

          <div
            onClick={() => {
              navigate(`/user?email=${email}`);
            }}
            className="btn-view-profile press-active"
          >
            View profile
          </div>
        </Flex>
      )}
    </div>
  );
};

export default ConversationContent;
