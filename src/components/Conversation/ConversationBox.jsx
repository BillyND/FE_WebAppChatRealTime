import { SpinnerLoading } from "@UI/SpinnerLoading";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { isEmpty, unionBy } from "lodash";
import { useEffect, useRef } from "react";
import { createConversation, createMessage } from "../../services/api";
import {
  conversationSubs,
  initConversationSubs,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import {
  handleGetMessage,
  limitFetchMessage,
  scrollToTopOfElement,
  showPopupError,
} from "../../utils/utilities";
import ConversationContent from "./ConversationContent";
import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import { boxMessageId } from "@utils/constant";

function ConversationBox() {
  const {
    infoUser: { _id: userId },
    infoUser,
  } = useAuthUser();

  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs, ["socketIo"]);

  const { state, setState } = useSubscription(conversationSubs, [
    "receiver",
    "fetchingMessage",
  ]);

  const { isMobile } = useWindowSize();
  const { receiver, fetchingMessage } = state || {};
  const { username, email, avaUrl, _id: receiverIdChat } = receiver || {};

  const [receiverId, conversationId] = useSearchParams([
    "receiverId",
    "conversationId",
  ]);

  useEffect(() => {
    handleGetMessage({});

    return () => {
      conversationSubs.state = {
        ...initConversationSubs,
        listConversations: conversationSubs.state.listConversations,
        usersOnline: conversationSubs.state.usersOnline,
      };
    };
  }, [receiverId, conversationId]);

  if (isMobile && !receiverId) return null;

  const handleSendMessage = async (message, img) => {
    try {
      scrollToTopOfElement(boxMessageId);

      // Generate a unique key for the new message based on the current timestamp
      const keyNewMessage = Date.now();

      const optionSend = {
        text: message,
        sender: userId,
        img,
        isSending: true,
        key: keyNewMessage,
      };

      // Process creating a new conversation asynchronously
      const newConversation = await processCreateNewConversation({
        optionSend,
        conversationId,
        receiverId,
      });

      // Extract the new conversation ID or use the existing one
      const { _id: newConversationId } = newConversation || {};
      const updatedConversationId = conversationId || newConversationId;

      // If no updated conversation ID is available, return early
      if (!updatedConversationId) return;

      optionSend.conversationId = updatedConversationId;

      // Create a copy of the list of conversations
      let updatedListConversation = [
        ...conversationSubs.state.listConversations,
      ];

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
                messageCount: conversation.messageCount + 1,
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
        listConversations: updatedListConversation,
      });

      // Send the message
      const resSendMessage = await createMessage(optionSend);

      // Update the list of messages with the sent message
      setState({
        listMessages: conversationSubs?.state?.listMessages.map((message) =>
          message.key === keyNewMessage ? resSendMessage : message
        ),
      });

      const conversation = conversationSubs.state.listConversations.find(
        (item) => item._id === resSendMessage?.conversationId
      );

      socketIo?.emit("sendMessage", {
        userId,
        message: resSendMessage,
        conversation: {
          ...conversation,
          receiver: {
            _id: infoUser._id,
            username: infoUser.username,
            avaUrl: infoUser.avaUrl,
            email: infoUser.email,
          },
        },
        receiverId,
      });
    } catch (error) {
      console.error("===>Error handleSendMessage:", error);
      showPopupError(error);
    }
  };

  const processCreateNewConversation = async ({
    conversationId,
    receiverId,
    optionSend,
  }) => {
    try {
      conversationSubs.updateState({
        listMessages: [
          { ...optionSend, sender: userId },
          ...(conversationSubs?.state?.next
            ? conversationSubs.state.listMessages.slice(0, limitFetchMessage)
            : conversationSubs.state.listMessages),
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
        style={{ color: "gray", width: isMobile ? "100vw" : "100%" }}
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
      <ConversationHeader
        username={username}
        avaUrl={avaUrl}
        email={email}
        receiverIdChat={receiverIdChat}
      />

      <ConversationContent avaUrl={avaUrl} username={username} email={email} />

      <ConversationFooter handleSendMessage={handleSendMessage} />
    </Flex>
  );
}

export default ConversationBox;
