import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useState } from "react";
import { TYPE_STYLE_APP } from "../../utils/constant";
import {
  conversationSubs,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import {
  formatHtmlToText,
  formatTimeAgo,
  getCurrentReceiverId,
} from "../../utils/utilities";
import { useWindowSize } from "@utils/hooks/useWindowSize";

function MessageList({ listMessages }) {
  const receiverId = getCurrentReceiverId();
  const { state } = useSubscription(conversationSubs, [
    "listConversations",
    "conversationId",
  ]);
  const {
    infoUser: { _id: userId },
  } = useAuthUser();
  const { listConversations, conversationId } = state || {};
  const currentConversation = listConversations.find(
    (item) => item?._id === conversationId
  );

  return (
    <>
      {listMessages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          index={index}
          currentConversation={currentConversation}
          userId={userId}
          receiverId={receiverId}
        />
      ))}
    </>
  );
}

function MessageItem({
  message,
  index,
  currentConversation,
  userId,
  receiverId,
}) {
  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs, ["socketIo"]);
  const { isMobile } = useWindowSize();
  const [isTyping, setIsTyping] = useState(false);
  const { state } = useSubscription(conversationSubs, ["conversationColor"]);
  const { styleApp } = useStyleApp();

  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;
  const { _id, text, isSending, updatedAt } = message || {};
  const { messageRead } = currentConversation || {};
  const { conversationColor, receiver, listMessages, next } = state || {};
  const { avaUrl } = receiver || {};
  const showIconRead = _id && messageRead?.[receiverId] === _id;

  useEffect(() => {
    const handleTyping = (data) => {
      setIsTyping(data?.start && data?.userId === receiverId);
    };

    socketIo?.on("receiveUserTyping", handleTyping);

    return () => {
      socketIo?.off("receiveUserTyping", handleTyping);
    };
  }, [receiverId, socketIo]);

  const isSender = message.sender === userId;
  const prevMessage = listMessages[index - 1];
  const nextMessage = listMessages[index + 1];

  const isStart =
    (message.sender === userId && prevMessage?.sender !== userId) ||
    (message.sender === receiverId && prevMessage?.sender !== receiverId);

  const isEnd =
    (message.sender === userId && nextMessage?.sender !== userId) ||
    (message.sender === receiverId && nextMessage?.sender !== receiverId);

  const messageTimeGap = nextMessage
    ? new Date(updatedAt) - new Date(nextMessage.updatedAt)
    : 0;

  const isMessageTimeGapBig = messageTimeGap > 1 * 60 * 60 * 1000;

  return (
    <Flex vertical>
      {isMessageTimeGapBig && (
        <Flex justify="center" className="m-2">
          <span className={`last-time-message mt-2`}>
            {formatTimeAgo(updatedAt || Date.now())}
          </span>
        </Flex>
      )}

      <Flex
        className={`${isMobile ? "mx-2" : "ml-2 "} ${isEnd ? "mt-3" : "mt-1"}`}
        justify={isSender ? "end" : "start"}
        align="center"
        gap={6}
        key={_id}
      >
        {isSending && <SpinnerLoading className="icon-load-send-message" />}

        <div
          style={{
            backgroundColor: isSender ? conversationColor : undefined,
          }}
          className={`wrap-message
          ${isSender ? "sender" : "receiver"}
          ${isStart ? "start" : ""}
          ${isEnd ? "end" : ""}`}
        >
          <span dangerouslySetInnerHTML={{ __html: formatHtmlToText(text) }} />

          <Flex
            align="center"
            justify="center"
            className={`time-message`}
            style={{ backgroundColor: isDark ? "#e7e7e78c" : "#0000008c" }}
          >
            {formatTimeAgo(updatedAt || Date.now())}
          </Flex>
        </div>
      </Flex>
      {showIconRead && (
        <Flex
          className={`${isMobile ? "mx-2" : "ml-2"} px-1 mt-1`}
          justify={"end"}
        >
          <UserThumbnail avaUrl={avaUrl} size={16} />
        </Flex>
      )}
      {index === 0 && message.sender && (
        <Flex
          justify="center"
          align="center"
          className={`user-typing wrap-message m-2 wrap-message-typing receiver ${
            isTyping ? "typing" : "not-typing"
          }`}
        >
          <span className="dot-typing"></span>
          <span className="dot-typing"></span>
          <span className="dot-typing"></span>
        </Flex>
      )}
    </Flex>
  );
}

export default MessageList;
