import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { TYPE_STYLE_APP } from "../../utils/constant";
import {
  conversationSubs,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import { formatTimeAgo, getCurrentReceiverId } from "../../utils/utilities";

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
      {listMessages.map((message, index) => {
        const { sender } = message || {};
        const isShowTimeMessage = index === 0 && sender;

        const messageTimeGap =
          new Date(listMessages[index]?.updatedAt) -
          new Date(listMessages[index + 1]?.updatedAt);

        const isMessageTimeGapBig = messageTimeGap > 1 * 60 * 60 * 1000;

        const isSender = sender === userId;
        const isStart =
          (listMessages[index].sender === userId &&
            listMessages[index - 1]?.sender !== userId) ||
          (listMessages[index].sender === receiverId &&
            listMessages[index - 1]?.sender !== receiverId);

        const isEnd =
          (listMessages[index].sender === userId &&
            listMessages[index + 1]?.sender !== userId) ||
          (listMessages[index].sender === receiverId &&
            listMessages[index + 1]?.sender !== receiverId);

        console.log("===>message", index, message.text);

        return (
          <MessageItem
            key={index}
            index={index}
            isShowTimeMessage={isShowTimeMessage}
            isMessageTimeGapBig={isMessageTimeGapBig}
            message={message}
            currentConversation={currentConversation}
            isSender={isSender}
            isStart={isStart}
            isEnd={isEnd}
          />
        );
      })}
    </>
  );
}

export function MessageItem({
  isShowTimeMessage,
  isMessageTimeGapBig,
  message,
  currentConversation,
  isSender,
  isStart,
  isEnd,
}) {
  const [isTyping, setIsTyping] = useState(false);
  const { state } = useSubscription(conversationSubs, ["conversationColor"]);

  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;
  const { _id, text, isSending, updatedAt } = message || {};

  const { messageRead } = currentConversation || {};
  const { conversationColor, receiver } = state || {};
  const { avaUrl } = receiver || {};
  const formattedText = text?.replaceAll("\n", "<br/>") || "";

  const showIconRead = _id && messageRead?.[getCurrentReceiverId()] === _id;

  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs, ["socketIo"]);

  useEffect(() => {
    socketIo?.on("receiveUserTyping", (data) => {
      setIsTyping(data?.start && data?.userId === getCurrentReceiverId());
    });
  }, [socketIo]);

  return (
    <Flex vertical>
      <Flex justify="center" className="m-2">
        {isMessageTimeGapBig && (
          <span className={`last-time-message mt-4`}>
            {formatTimeAgo(updatedAt || Date.now())}
          </span>
        )}
      </Flex>

      <Flex
        className={`mx-2 mt-1 px-1`}
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
          {parse(formattedText)}

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
        <Flex className="mx-2 px-1 mt-1" justify={"end"}>
          <UserThumbnail avaUrl={avaUrl} size={16} />
        </Flex>
      )}

      {isShowTimeMessage && (
        <Flex
          justify="center"
          align="center"
          className={`user-typing wrap-message m-3 wrap-message-typing receiver ${
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
