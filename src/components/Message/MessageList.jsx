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
import { isEmpty } from "lodash";

function MessageList({ listMessages }) {
  return (
    <>
      {listMessages.map((message, index) => {
        const { sender } = message || {};
        const { sender: endSender } = listMessages[index - 1] || {};
        const isStartSectionSender = endSender ? endSender !== sender : false;
        const isShowTimeMessage = index === 0 && sender;

        return (
          <MessageItem
            key={index}
            index={index}
            isStartSectionSender={isStartSectionSender}
            isShowTimeMessage={isShowTimeMessage}
            message={message}
          />
        );
      })}
    </>
  );
}

export function MessageItem({
  isShowTimeMessage,
  isStartSectionSender,
  message,
}) {
  const { state } = useSubscription(conversationSubs, ["conversationColor"]);

  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;

  const { conversationColor } = state || {};
  const { _id, text, sender, isSending, updatedAt } = message || {};
  const formattedText = text?.replaceAll("\n", "<br/>") || "";
  const isSender = sender === userId;

  return (
    <Flex vertical>
      <Flex
        className={`mx-2 mt-1 px-1 ${isStartSectionSender ? "pb-4" : ""}`}
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
