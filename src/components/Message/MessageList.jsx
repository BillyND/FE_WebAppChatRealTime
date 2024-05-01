import { SpinnerLoading } from "@UI/SpinnerLoading";
import { Flex } from "antd";
import React from "react";
import { formatTimeAgo } from "../../utils/utilities";

function MessageList({ listMessages, userId }) {
  if (!listMessages?.length) return null;

  return (
    <Flex vertical gap={4}>
      {listMessages.map((message, index) => {
        const { sender } = message || {};
        const { sender: endSender } = listMessages[index - 1] || {};
        const isStartSectionSender = endSender ? endSender !== sender : false;
        const isLastMessage = index === listMessages?.length - 1;

        return (
          <MessageItem
            isLastMessage={isLastMessage}
            key={index}
            message={message}
            userId={userId}
            isStartSectionSender={isStartSectionSender}
          />
        );
      })}
    </Flex>
  );
}

function MessageItem({ message, userId, isStartSectionSender, isLastMessage }) {
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
          className={`${isSender ? "sender" : ""} wrap-message`}
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      </Flex>
      <Flex className="mx-3" justify={isSender ? "end" : "start"}>
        <span className="last-time-message">
          {isLastMessage && formatTimeAgo(updatedAt || Date.now())}
        </span>
      </Flex>
    </Flex>
  );
}

export default MessageList;
