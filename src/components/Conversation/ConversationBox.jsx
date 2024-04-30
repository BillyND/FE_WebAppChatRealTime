import { SpinnerLoading } from "@UI/SpinnerLoading";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { useWindowSize } from "@utils/hooks/useWindowSize";
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
import { TIME_DELAY_FETCH_API, boxMessageId } from "../../utils/constant";
import {
  conversationSubs,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import { debounce, showPopupError } from "../../utils/utilities";
import ConversationContent from "./ConversationContent";
import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import { handleGetAllConversations } from "./ListConversations";

export const handleGetMessage = debounce(async (receiverId) => {
  if (!receiverId) {
    conversationSubs.updateState({
      fetchingMessage: false,
    });
    return;
  }

  try {
    handleGetAllConversations(false);
    const resConversation = await getConversationByReceiver(receiverId);
    const { receiver, listMessages, conversationId } = resConversation || {};

    conversationSubs.updateState({
      receiver,
      listMessages,
      conversationId,
      fetchingMessage: false,
    });

    scrollToBottomOfElement(boxMessageId);
  } catch (error) {
    console.error("===>Error handleGetMessage:", error);
    conversationSubs.updateState({
      fetchingMessage: false,
    });
    showPopupError(error);
  }
}, TIME_DELAY_FETCH_API);

function ConversationBox() {
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs, ["socketIo"]);

  const { isMobile } = useWindowSize();
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

  useEffect(() => {
    setState((prev) => ({ ...prev, fetchingMessage: true }));
    handleGetMessage(receiverId);

    return () => {
      setState({ receiver: null });
      setMessage("");
    };
  }, [receiverId]);

  if (isMobile && !receiverId) return null;

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
      // scrollIntoViewById(`conversation-${updatedConversationId}`, 400);

      // Send the message
      const resSendMessage = await createMessage(optionSend);

      // Update the list of messages with the sent message
      setState((prevState) => ({
        listMessages: prevState.listMessages.map((message) =>
          message.key === keyNewMessage ? resSendMessage : message
        ),
      }));

      socketIo?.emit("sendMessage", resSendMessage);
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

  if (fetchingMessage) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{ color: "gray", width: "100vw" }}
      >
        <SpinnerLoading />
      </Flex>
    );
  }

  if (isEmpty(receiver) && !fetchingMessage) {
    return (
      <Flex
        className="wrap-detail-conversation"
        align="center"
        justify="center"
        style={{ color: "gray" }}
      >
        Please select a conversation!
      </Flex>
    );
  }

  return (
    <Flex vertical className="wrap-detail-conversation">
      <ConversationHeader username={username} avaUrl={avaUrl} email={email} />

      <ConversationContent avaUrl={avaUrl} username={username} email={email} />

      <ConversationFooter
        message={message}
        setMessage={setMessage}
        isDisableButtonSend={isDisableButtonSend}
        handleSendMessage={handleSendMessage}
      />
    </Flex>
  );
}

export default ConversationBox;
