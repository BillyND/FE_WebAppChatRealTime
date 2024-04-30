import { SpinnerLoading } from "@UI/SpinnerLoading";
import { Flex } from "antd";
import React from "react";

function MessageList({ listMessages, userId }) {
  if (!listMessages?.length) return null;

  return (
    <Flex vertical gap={4}>
      {listMessages.map((message, index) => {
        const { sender } = message || {};
        const { sender: endSender } = listMessages[index - 1] || {};
        const isStartSectionSender = endSender ? endSender !== sender : false;

        return (
          <MessageItem
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

function MessageItem({ message, userId, isStartSectionSender }) {
  const { _id, text, sender, isSending } = message || {};
  const formattedText = text?.replaceAll("\n", "<br/>");
  const isSender = sender === userId;

  return (
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
  );
}

export default MessageList;
