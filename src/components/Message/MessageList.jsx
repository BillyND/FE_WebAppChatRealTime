import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { useEffect, useState } from "react";
import {
  OPTIONS_STYLE_CONVERSATION,
  TYPE_STYLE_APP,
} from "../../utils/constant";
import {
  conversationSubs,
  previewImageFullScreenSubs,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import {
  formatHtmlToText,
  formatTimeAgo,
  getDataSearchParams,
} from "../../utils/utilities";

function MessageList({ listMessages }) {
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const receiverId = getDataSearchParams("receiverId");
  const { state } = useSubscription(conversationSubs, ["listConversations"]);
  const { listConversations } = state || {};

  const currentConversation = listConversations.find(
    (item) => item?._id === getDataSearchParams("conversationId")
  );

  return (
    <>
      {listMessages.map((message, index) => (
        <MessageItem
          key={`${message?._id}-${index}`}
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
  const { _id, text, isSending, updatedAt, img } = message || {};
  const { receiver, listMessages, conversationColor } = state || {};

  const { avaUrl } = receiver || {};
  const { messageRead } = currentConversation || {};
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

  const messageTimeGapCurrent = nextMessage
    ? new Date(updatedAt) - new Date(nextMessage.updatedAt)
    : 0;

  const messageTimeGapPrev = prevMessage
    ? new Date(prevMessage.updatedAt) - new Date(updatedAt)
    : 0;

  const isMessageTimeGapBigCurrent = messageTimeGapCurrent > 1 * 60 * 60 * 1000;
  const isMessageTimeGapBigPrev = messageTimeGapPrev > 1 * 60 * 60 * 1000;

  const isStart =
    (message.sender === userId && prevMessage?.sender !== userId) ||
    (message.sender === receiverId && prevMessage?.sender !== receiverId) ||
    (isMessageTimeGapBigCurrent && isMessageTimeGapBigPrev) ||
    isMessageTimeGapBigPrev;

  const isEnd =
    (message.sender === userId && nextMessage?.sender !== userId) ||
    (message.sender === receiverId && nextMessage?.sender !== receiverId) ||
    (isMessageTimeGapBigCurrent && isMessageTimeGapBigPrev) ||
    isMessageTimeGapBigCurrent;

  const MessageTime = ({ updatedAt, isDark }) => (
    <Flex
      align="center"
      justify="center"
      className="time-message"
      style={{ backgroundColor: isDark ? "#e7e7e78c" : "#0000008c" }}
    >
      {formatTimeAgo(updatedAt || Date.now())}
    </Flex>
  );

  const TextMessage = () => (
    <div
      style={{ backgroundColor: isSender ? conversationColor : undefined }}
      className={`wrap-message text-message ${
        isSender ? "sender" : "receiver"
      } ${isStart ? "start" : ""} ${isEnd ? "end" : ""}`}
    >
      <span dangerouslySetInnerHTML={{ __html: formatHtmlToText(text) }} />
      <MessageTime updatedAt={updatedAt} isDark={isDark} />
    </div>
  );

  const ImageMessage = () => {
    const { url, aspectRatio, width } = img || {};

    if (!img) return;

    return (
      <Flex
        vertical
        className={`wrap-message ${isSender ? "sender" : "receiver"} ${
          isStart ? "start" : ""
        } ${isEnd ? "end" : ""}`}
        onClick={() =>
          previewImageFullScreenSubs.updateState({ imgSrc: url || img })
        }
      >
        <img
          loading="lazy"
          style={{
            aspectRatio: `${aspectRatio}`,
            height: "auto",
            width: width < 250 ? `${width}px` : "250px",
          }}
          draggable="false"
          className={`wrap-message press-active img-message border-image-dashed ${
            isSender ? "sender" : "receiver"
          } ${isStart ? "start" : ""} ${isEnd ? "end" : ""}`}
          src={url || img}
        />
        <MessageTime updatedAt={updatedAt} isDark={isDark} />
      </Flex>
    );
  };

  return (
    <Flex vertical key={_id}>
      {isMessageTimeGapBigCurrent && (
        <Flex justify="center" className="m-2">
          <span className="last-time-message mt-2">
            {formatTimeAgo(updatedAt || Date.now())}
          </span>
        </Flex>
      )}

      <Flex vertical>
        {text?.trim() && (
          <Flex
            className={`${isMobile ? "mx-2" : "ml-2 "} ${
              isEnd ? "mt-3" : "mt-1"
            }`}
            justify={isSender ? "end" : "start"}
            align="center"
            gap={6}
          >
            {isSending && <SpinnerLoading className="icon-load-send-message" />}
            <TextMessage />
          </Flex>
        )}

        {img && (
          <Flex
            align="center"
            gap={6}
            className={`${isMobile ? "mx-2" : "ml-2 "} ${
              isEnd ? "mt-3" : "mt-1"
            }`}
            justify={isSender ? "end" : "start"}
          >
            {isSending && <SpinnerLoading className="icon-load-send-message" />}
            <ImageMessage />
          </Flex>
        )}
      </Flex>

      {showIconRead && (
        <Flex
          className={`${isMobile ? "mx-2" : "ml-2"} px-1 mt-1`}
          justify="end"
        >
          <UserThumbnail avaUrl={avaUrl} size={16} />
        </Flex>
      )}

      {index === 0 && message.sender && (
        <Flex
          justify="center"
          align="center"
          className={`user-typing text-message wrap-message m-2 wrap-message-typing receiver ${
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
