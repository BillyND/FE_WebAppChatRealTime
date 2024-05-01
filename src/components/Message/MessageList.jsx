import { SpinnerLoading } from "@UI/SpinnerLoading";
import { Flex } from "antd";
import React, { useState } from "react";
import { debounce, formatTimeAgo } from "../../utils/utilities";
import { TIME_DELAY_FETCH_API } from "../../utils/constant";
import { useSubscription } from "global-state-hook";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";

function MessageList({ listMessages, userId }) {
  const [selectedMessage, setSelectedMessage] = useState(-1);

  if (!listMessages?.length) return null;

  return (
    <Flex vertical gap={4}>
      {listMessages.map((message, index) => {
        const { sender } = message || {};
        const { sender: endSender } = listMessages[index - 1] || {};
        const isStartSectionSender = endSender ? endSender !== sender : false;

        const isShowTimeMessage =
          index === listMessages?.length - 1 ||
          message?._id === selectedMessage;

        return (
          <MessageItem
            key={index}
            setSelectedMessage={setSelectedMessage}
            isShowTimeMessage={isShowTimeMessage}
            message={message}
            userId={userId}
            isStartSectionSender={isStartSectionSender}
          />
        );
      })}
    </Flex>
  );
}

function MessageItem({
  message,
  userId,
  isStartSectionSender,
  isShowTimeMessage,
  setSelectedMessage,
}) {
  const {
    state: { conversationColor },
  } = useSubscription(conversationSubs, ["conversationColor"]);
  const { _id, text, sender, isSending, updatedAt } = message || {};
  const formattedText = text?.replaceAll("\n", "<br/>");
  const isSender = sender === userId;

  return (
    <Flex vertical>
      <Flex
        className={`mx-2 px-1 ${isStartSectionSender ? "pt-4" : ""}`}
        justify={isSender ? "end" : "start"}
        align="center"
        gap={6}
        key={_id}
      >
        {isSending && <SpinnerLoading className="icon-load-send-message" />}

        <div
          style={{ backgroundColor: isSender ? conversationColor : undefined }}
          onMouseEnter={() => setSelectedMessage(_id)}
          onTouchStart={() => setSelectedMessage(_id)}
          onMouseLeave={() =>
            debounce(() => setSelectedMessage(null), TIME_DELAY_FETCH_API)
          }
          className={`${isSender ? "sender" : ""} wrap-message`}
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      </Flex>
      <Flex className="mx-3" justify={isSender ? "end" : "start"}>
        <span className={`last-time-message ${isShowTimeMessage ? "" : ""}`}>
          {isShowTimeMessage && formatTimeAgo(updatedAt || Date.now())}
        </span>
      </Flex>
    </Flex>
  );
}

export default MessageList;
