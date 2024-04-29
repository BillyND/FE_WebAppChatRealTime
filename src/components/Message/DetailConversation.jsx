import { SpinnerLoading } from "@UI//SpinnerLoading";
import { UserThumbnail } from "@UI//UserThumbnail";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { scrollToBottomOfElement } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { isEmpty, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import {
  createConversation,
  createMessage,
  getConversationByReceiver,
} from "../../services/api";
import { TIME_DELAY_FETCH_API } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import {
  debounce,
  preventKeydown,
  scrollIntoViewById,
  showPopupError,
} from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";

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
      // If the send button is disabled, return early
      if (isDisableButtonSend) return;

      // Generate a unique key for the new message based on the current timestamp
      const keyNewMessage = Date.now();

      // Process creating a new conversation asynchronously
      const newConversation = await processCreateNewConversation(
        conversationId,
        receiverId,
        keyNewMessage
      );

      // Extract the new conversation ID or use the existing one
      const { _id: newConversationId } = newConversation || {};
      const updatedConversationId = conversationId || newConversationId;

      // If no updated conversation ID is available, return early
      if (!updatedConversationId) return;

      // Prepare the message send option
      const optionSend = {
        conversationId: updatedConversationId,
        text: message,
        sender: userId,
      };

      // Create a copy of the list of conversations
      let updatedListConversation = [...listConversation];

      // If a new conversation was created, add it to the beginning of the list
      if (newConversation) {
        updatedListConversation.unshift(newConversation);
      }

      // Update the conversation list with the new message and sort by the latest message time
      updatedListConversation = unionBy(updatedListConversation, "_id").map(
        (conversation) =>
          conversation._id === updatedConversationId
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

      // Sort the updated conversation list by the time of the last message
      updatedListConversation.sort(
        (a, b) =>
          (new Date(b?.lastMessage?.timeSendLast) || 0) -
          (new Date(a?.lastMessage?.timeSendLast) || 0)
      );

      // Update the component state with the updated conversation ID and list
      setState({
        conversationId: updatedConversationId,
        listConversation: updatedListConversation,
        // If it's not a new conversation, add the message to the list of messages
        ...(!newConversation && {
          listMessages: [
            ...listMessages,
            { ...optionSend, key: keyNewMessage, isSending: true },
          ],
        }),
      });

      scrollToBottomOfElement(boxMessageId);
      setMessage("");
      scrollIntoViewById(`conversation-${updatedConversationId}`, 400);

      // Send the message
      const resSendMessage = await createMessage(optionSend);

      // Update the list of messages with the sent message
      setState((prevState) => ({
        listMessages: prevState.listMessages.map((message) =>
          message.key === keyNewMessage ? resSendMessage : message
        ),
      }));
    } catch (error) {
      console.error("===>Error handleSendMessage:", error);
      showPopupError(error);
    }
  };

  const processCreateNewConversation = async (
    conversationId,
    receiverId,
    keyNewMessage
  ) => {
    try {
      setMessage("");

      setState({
        listMessages: [
          ...listMessages,
          {
            text: message,
            sender: userId,
            key: keyNewMessage,
            isSending: true,
          },
        ],
      });

      if (conversationId) return null;

      return await createConversation(receiverId);
    } catch (error) {
      return null;
    }
  };

  if (listMessages?.length) {
    containerMessage = (
      <Flex vertical gap={4}>
        {listMessages.map((message, index) => {
          const { _id, text, sender, isSending } = message || {};
          const formattedText = text?.replaceAll("\n", "<br/>");
          const isSender = sender === userId;
          const { sender: endSender } = listMessages[index - 1] || {};
          const isStartSectionSender = endSender ? endSender !== sender : false;

          return (
            <Flex
              className={`mx-2 px-1 ${isStartSectionSender ? "pt-4" : ""}`}
              justify={isSender ? "end" : "start"}
              align="center"
              gap={6}
              key={_id}
            >
              {isSending && (
                <SpinnerLoading className="icon-load-send-message" />
              )}

              <div
                className={`${isSender ? "sender" : ""} wrap-message`}
                dangerouslySetInnerHTML={{ __html: formattedText }}
              />
            </Flex>
          );
        })}
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
            onKeyDown={(e) => preventKeydown(e, "Enter", handleSendMessage)}
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
