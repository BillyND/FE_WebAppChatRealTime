import { SpinnerLoading } from "@UI/SpinnerLoading";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { TYPE_STYLE_APP, boxMessageId } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { formatTimeAgo, scrollToBottomOfElement } from "../../utils/utilities";

let cacheScrollTop;
function MessageList({ listMessages }) {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  let boxMessageElement = document.getElementById(boxMessageId);
  const visibleMessages = listMessages.slice(startIndex, endIndex);

  const endMessageId = listMessages[listMessages.length - 1]?._id;
  let firstMessageEl = document.getElementById(`message-${endMessageId}`);
  console.log("===>visibleMessages", visibleMessages);

  useEffect(() => {
    setStartIndex(listMessages.length - 20);
    setEndIndex(listMessages.length);

    scrollToBottomOfElement(boxMessageId);
  }, [listMessages]);

  useEffect(() => {
    boxMessageElement = document.getElementById(boxMessageId);
    boxMessageElement?.addEventListener("scroll", lazyLoadMessages);

    return () => {
      boxMessageElement?.removeEventListener("scroll", lazyLoadMessages);
    };
  }, [boxMessageElement]);

  const lazyLoadMessages = () => {
    const { scrollTop, clientHeight, scrollHeight } = boxMessageElement;
    firstMessageEl =
      firstMessageEl || document.getElementById(`message-${endMessageId}`);

    const clonedMessage = firstMessageEl.cloneNode(true);
    const wrapMessageCloned = clonedMessage.querySelector(".wrap-message");

    if (scrollTop < 400) {
      setStartIndex((prev) => {
        if (prev > 10) {
          let newScrollProsition = 0;

          const batchMessages = listMessages.slice(prev - 10, prev - 1);

          batchMessages.forEach((message) => {
            boxMessageElement.append(clonedMessage);
            wrapMessageCloned.style.position = "fixed";
            wrapMessageCloned.style.visible = "hidden";
            wrapMessageCloned.textContent = message?.text;
            newScrollProsition += wrapMessageCloned.offsetHeight + 4;
            boxMessageElement.removeChild(clonedMessage);
          });

          console.log("===>newScrollProsition:", newScrollProsition);

          boxMessageElement.scrollTop += newScrollProsition;

          return prev - 10;
        }

        return 0;
      });
    }

    // console.log(
    //   "===>scrollTop + clientHeight + 10 >= scrollHeight",
    //   scrollTop + clientHeight >= scrollHeight
    // );
    // console.log("===>scrollHeight", scrollHeight);

    if (scrollTop + clientHeight > scrollHeight) {
      if (listMessages.length < endIndex + 9) {
        // boxMessageElement.scrollTop = boxMessageElement.scrollTop - 40;
        // setEndIndex((prev) =>
        //   listMessages.length > prev + 9 ? prev + 1 : prev
        // );
      }
    }
  };

  return (
    <Flex vertical gap={4} className="scroller-bottom">
      {visibleMessages.map((message, index) => {
        const { sender } = message || {};
        const { sender: endSender } = visibleMessages[index - 1] || {};
        const isStartSectionSender = endSender ? endSender !== sender : false;

        return (
          <MessageItem
            key={index}
            index={index}
            isStartSectionSender={isStartSectionSender}
            message={message}
          />
        );
      })}

      <div className="anchor-scroll-bottom" />
    </Flex>
  );
}

function MessageItem({ index, isStartSectionSender, message }) {
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
  const { _id, text, sender, isSending, updatedAt } = message || {};
  const formattedText = text?.replaceAll("\n", "<br/>") || "";
  const isSender = sender === userId;
  const isShowTimeMessage = index === listMessages?.length - 1;

  return (
    <Flex vertical id={`message-${_id}`}>
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
