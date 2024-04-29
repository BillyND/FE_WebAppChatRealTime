import { SpinnerLoading } from "@UI//SpinnerLoading";
import { UserThumbnail } from "@UI//UserThumbnail";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { scrollToBottomOfElement } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import {
  createConversation,
  createMessage,
  getConversationByReceiver,
  getConversations,
} from "../../services/api";
import { TIME_DELAY_FETCH_API } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import {
  debounce,
  scrollIntoViewById,
  showPopupError,
} from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";

function DetailConversation() {
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const navigate = useNavigateCustom();
  const { state, setState } = useSubscription(conversationSubs);
  let {
    receiver,
    listMessages,
    conversationId,
    isSending,
    tempMessage,
    fetchingMessage,
    listConversation,
  } = state || {};

  const { username, email, avaUrl } = receiver || {};
  const [message, setMessage] = useState("");
  const trimMessage = message.trim();

  const isDisableButtonSend = !trimMessage || fetchingMessage;
  const [receiverId] = useSearchParams(["receiverId"]);
  const boxMessageId = "box-list-message";
  let containerMessage = null;

  useEffect(() => {
    setState((prev) => ({ ...prev, fetchingMessage: true }));
    handleGetMessage();

    return () => {
      setState({ receiver: null });
    };
  }, [receiverId]);

  const handleGetMessage = debounce(async () => {
    if (!receiverId) {
      setState((prev) => ({ ...prev, fetchingMessage: false }));
      return;
    }

    try {
      const resConversation = await getConversationByReceiver(receiverId);
      const { receiver, listMessages, conversationId } = resConversation || {};

      setState((prev) => ({
        ...prev,
        receiver,
        listMessages,
        conversationId,
        fetchingMessage: false,
      }));

      scrollToBottomOfElement(boxMessageId);
    } catch (error) {
      setState((prev) => ({ ...prev, fetchingMessage: false }));
      showPopupError(error);
    }
  }, TIME_DELAY_FETCH_API);

  const handleSendMessage = async () => {
    try {
      let newConversation = conversationId
        ? null
        : await processCreateNewConversation(receiverId);

      const { _id: newConversationId } = newConversation || {};
      conversationId = conversationId || newConversationId;
      const optionSend = { conversationId, text: message, sender: userId };

      newConversation && listConversation.unshift(newConversation);
      listConversation = listConversation.map((conversation) =>
        conversation?._id === conversationId
          ? {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                ...optionSend,
                timeSendLast: new Date(),
              },
            }
          : conversation
      );

      const newListConversation = listConversation.sort((a, b) => {
        const timeA = new Date(a?.lastMessage?.timeSendLast) || 0;
        const timeB = new Date(b?.lastMessage?.timeSendLast) || 0;

        return timeB - timeA;
      });

      if (!conversationId) return;

      setState({
        isSending: true,
        tempMessage: message,
        conversationId,
        listConversation: newListConversation,
      });

      scrollToBottomOfElement(boxMessageId);
      setMessage("");
      scrollIntoViewById(`conversation-${conversationId}`, 400);

      const resSendMessage = await createMessage(optionSend);

      setState({
        isSending: false,
        tempMessage: "",
        listMessages: [...listMessages, resSendMessage],
      });
    } catch (error) {
      console.error("===>Error handleSendMessage:", error);
      showPopupError(error);
    }
  };

  const processCreateNewConversation = async (receiverId) => {
    try {
      setState({
        isSending: true,
        tempMessage: message,
      });

      setMessage("");
      const resConversation = await createConversation(receiverId);

      return resConversation;
    } catch (error) {
      return null;
    }
  };

  if (listMessages?.length || tempMessage) {
    containerMessage = (
      <Flex vertical gap={4}>
        {listMessages.map((message, index) => {
          const { _id, text, sender } = message || {};
          const formattedText = text?.replaceAll("\n", "<br/>");
          const isSender = sender === userId;
          const { sender: endSender } = listMessages[index - 1] || {};
          const isStartSectionSender = endSender ? endSender !== sender : false;

          return (
            <Flex
              className={`mx-2 px-1 ${isStartSectionSender ? "pt-4" : ""}`}
              justify={isSender ? "end" : "start"}
              key={_id}
            >
              <div
                className={`${isSender ? "sender" : ""} wrap-message`}
                dangerouslySetInnerHTML={{ __html: formattedText }}
              />
            </Flex>
          );
        })}

        {isSending && (
          <Flex className="mx-2 px-1" justify="end" align="center" gap={6}>
            <SpinnerLoading className="icon-load-send-message" />
            <div
              className="sender wrap-message"
              dangerouslySetInnerHTML={{
                __html: tempMessage?.replaceAll("\n", "<br/>"),
              }}
            />
          </Flex>
        )}
      </Flex>
    );
  }

  let containerConversation = (
    <Flex vertical id={boxMessageId} gap={50}>
      <Flex vertical align="center" justify="center" gap={12} className="pt-5">
        <UserThumbnail avaUrl={avaUrl} size={70} />

        <Flex vertical gap={4} align="center" justify="center">
          <b>{username}</b>
          <span className="user-email">{email}</span>
        </Flex>

        <button
          onClick={() => {
            navigate(`/user?email=${email}`);
          }}
          className="btn-view-profile press-active"
        >
          View profile
        </button>
      </Flex>

      {containerMessage}
    </Flex>
  );

  if (fetchingMessage) {
    return (
      <Flex align="center" justify="center" style={{ color: "gray" }}>
        <SpinnerLoading />
      </Flex>
    );
  }

  if (isEmpty(receiver) && !fetchingMessage) {
    return (
      <Flex align="center" justify="center" style={{ color: "gray" }}>
        Please select a conversation!
      </Flex>
    );
  }

  return (
    <Flex vertical className="wrap-detail-conversation">
      <Flex vertical>
        <Flex
          gap={10}
          className="header-conversation pt-3 pb-2 px-3"
          align="center"
          justify="start"
        >
          <UserThumbnail avaUrl={avaUrl} size={35} />
          <b>{username}</b>
        </Flex>
        <hr className="width-100-per gray" />
      </Flex>

      <div className="content-conversation">{containerConversation}</div>

      <Flex className="footer-conversation" justify="start" vertical>
        <hr className="gray width-100-per" />

        <Flex className="px-3  pt-2 pb-3 mt-1" gap={12} align="center">
          <PlusCircleOutlined className="icon-show-more-option" />

          <textarea
            maxLength={8000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            placeholder="Type a message..."
            className={`input-comment ${
              message.length > 100 ? "full" : "mini"
            }`}
            style={{
              minWidth: `calc(100% - 110px)`,
            }}
          />

          <div className={`${isDisableButtonSend ? "" : "press-active"}`}>
            <ButtonSend
              onClick={handleSendMessage}
              disabled={isDisableButtonSend}
            />
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DetailConversation;
