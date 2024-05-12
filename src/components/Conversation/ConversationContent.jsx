import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { updateUsersReadConversation } from "../../services/api";
import {
  TIME_DELAY_FETCH_API,
  TIME_DELAY_SEARCH_INPUT,
  boxMessageId,
} from "../../utils/constant";
import {
  conversationSubs,
  infoUserSubscription,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import {
  debounce,
  getCurrentReceiverId,
  isChanged,
} from "../../utils/utilities";
import MessageList from "../Message/MessageList";
import { handleGetMessage } from "./ConversationBox";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

export const handleReadConversation = debounce(async () => {
  const { listMessages, conversationId } = conversationSubs.state || {};
  const { _id: userId } = infoUserSubscription.state.infoUser || {};
  const lastMessageId = listMessages[0]?._id;

  if (!conversationId || !lastMessageId) return;

  const newList = conversationSubs.state.listConversations.map((conversation) =>
    conversation._id === conversationId
      ? { ...conversation, usersRead: [userId] }
      : conversation
  );

  if (isChanged([conversationSubs.state.listConversations, newList])) {
    conversationSubs.updateState({ listConversations: newList });
  }

  socketIoSubs.state.socketIo?.emit("readMessage", {
    conversationId,
    messageRead: {
      [getCurrentReceiverId()]: lastMessageId,
      [userId]: lastMessageId,
    },
    receiverId: getCurrentReceiverId(),
  });

  debounce(() => {
    updateUsersReadConversation(conversationId, lastMessageId);
  }, TIME_DELAY_FETCH_API)();
}, TIME_DELAY_SEARCH_INPUT);

const ConversationContent = ({ avaUrl, username, email }) => {
  const { state } = useSubscription(conversationSubs, ["listMessages", "next"]);
  let { listMessages, next } = state || {};
  const navigate = useNavigateCustom();
  const boxMessageElement = useRef(null);
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

  return (
    <div
      onDragOver={(e) => {
        boxMessageElement.current?.classList.add("drag-image");
        // console.log("===>drop:", e);
      }}
      className="content-conversation"
      id={boxMessageId}
      ref={boxMessageElement}
    >
      <Dragger
        multiple
        maxCount={10}
        method="get"
        onMouseOut={() => {
          console.log("===>here");
          boxMessageElement.current?.classList.remove("drag-image");
        }}
        onChange={() => {
          console.log("===>here");
          boxMessageElement.current?.classList.remove("drag-image");
        }}
        className="drop-image-message"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
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
