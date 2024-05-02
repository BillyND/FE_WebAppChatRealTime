import { SpinnerLoading } from "@UI/SpinnerLoading";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import parse from "html-react-parser";
import React from "react";
import { TYPE_STYLE_APP } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { formatTimeAgo } from "../../utils/utilities";

function MessageList({ listMessages }) {
  if (!listMessages?.length) return null;

  return (
    <Flex vertical gap={4} className="scroller-bottom">
      {listMessages.map((message, index) => {
        const { sender } = message || {};
        const { sender: endSender } = listMessages[index - 1] || {};
        const isStartSectionSender = endSender ? endSender !== sender : false;

        return (
          <MessageItem
            key={index}
            index={index}
            isStartSectionSender={isStartSectionSender}
          />
        );
      })}

      <div className="anchor-scroll-bottom" />
    </Flex>
  );
}

function MessageItem({ index, isStartSectionSender }) {
  const { state } = useSubscription(conversationSubs, [
    "conversationColor",
    "listMessages",
  ]);

  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;

  const { conversationColor, listMessages } = state || {};
  const message = listMessages?.[index];
  const { _id, text, sender, isSending, updatedAt } = message || {};
  const formattedText = text?.replaceAll("\n", "<br/>") || "";
  const isSender = sender === userId;
  const isShowTimeMessage = index === listMessages?.length - 1;

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
          style={{
            backgroundColor: isSender ? conversationColor : undefined,
          }}
          className={`${isSender ? "sender" : ""} wrap-message`}
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
      <Flex className="mx-3" justify={isSender ? "end" : "start"}>
        {isShowTimeMessage && (
          <span className={`last-time-message`}>
            {formatTimeAgo(updatedAt || Date.now())}
          </span>
        )}
      </Flex>
    </Flex>
  );
}

export default MessageList;
