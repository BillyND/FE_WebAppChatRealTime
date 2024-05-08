import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { updateUsersReadConversation } from "../../services/api";
import { boxMessageId } from "../../utils/constant";
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

export const handleReadConversation = debounce(async (isChangedListMessage) => {
  const lastMessageId = conversationSubs.state.listMessages?.[0]?._id;
  const conversationId = conversationSubs.state.conversationId;
  const userId = infoUserSubscription.state.infoUser._id;

  if (!conversationId) {
    return;
  }

  socketIoSubs.state.socketIo?.emit("readMessage", {
    conversationId,
    messageRead: { [userId]: lastMessageId },
    receiverId: getCurrentReceiverId(),
  });

  const newList = conversationSubs.state.listConversations.map((conversation) =>
    conversation._id === conversationId
      ? { ...conversation, usersRead: [userId] }
      : conversation
  );

  if (isChanged([conversationSubs.state.listConversations, newList])) {
    conversationSubs.updateState({ listConversations: newList });
  }

  updateUsersReadConversation(conversationId, lastMessageId);
}, 100);

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
    handleReadConversation(true);
  }, [listMessages]);

  const handleScrollToTop = () => {
    !loadMore && setLoadMore(true);
    next && handleGetMessage({ ...next, allowFetching: false });
  };

  return (
    <div
      className="content-conversation"
      id={boxMessageId}
      ref={boxMessageElement}
    >
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
