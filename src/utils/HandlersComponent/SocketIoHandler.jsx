import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSubscription } from "global-state-hook";
import { uniqBy } from "lodash";
import { useEffect } from "react";
import messageSound from "../../assets/sounds/message.mp3";
import { handleGetAllConversations } from "../../components/Conversation/ListConversations";
import { getDataInfoUser } from "../../services/api";
import { TIME_DELAY_SEARCH_INPUT } from "../constant";
import {
  conversationSubs,
  socketIoSubs,
} from "../globalStates/initGlobalState";
import {
  connectUserToSocket,
  debounce,
  getCurrentReceiverId,
  isChanged,
  limitFetchMessage,
} from "../utilities";

let timerForceConnectSocket;
export const SocketIoHandler = () => {
  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs);

  const {
    state: { conversationId },
  } = useSubscription(conversationSubs);

  const {
    infoUser: { _id: userId, email },
    login,
  } = useAuthUser();

  useEffect(() => {
    handleApplyNewInfoUser();
    initFunction();
    connectUserToSocket();

    if (!userId) {
      socketIo?.disconnect();
    }

    return () => {
      socketIo?.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    socketIo?.on("getMessage", handleUpdateMessageSocket);
    socketIo?.on("receiveReadMessage", handleUpdateMessageRead);
    socketIo?.on("receiveConnect", () => clearTimeout(timerForceConnectSocket));
    socketIo?.on("usersOnline", (data) => {
      const { usersOnline, infoUserOnline = {} } = data;

      if (
        !conversationSubs.state.usersOnline ||
        isChanged([conversationSubs.state.usersOnline, usersOnline])
      ) {
        conversationSubs.updateState({ usersOnline });

        if (email === import.meta.env.VITE_EMAIL_ADMIN) {
          const formatInfoUserOnline = Object.keys(infoUserOnline).reduce(
            (acc, key) => {
              acc[infoUserOnline[key].email] = infoUserOnline[key];
              return acc;
            },
            {}
          );

          console.log("===>infoUserOnline", formatInfoUserOnline);
        }
      }
    });
  }, [conversationId, socketIo]);

  const handleUpdateMessageRead = (data) => {
    const { conversationId, messageRead } = data || {};

    const dataUpdate = {
      listConversations: conversationSubs.state.listConversations.map(
        (item) => {
          if (item?._id === conversationId) {
            return { ...item, messageRead };
          }

          return item;
        }
      ),
    };

    conversationSubs.state = { ...conversationSubs.state, ...dataUpdate };

    debounce(() => {
      conversationSubs.updateState(dataUpdate);
    }, TIME_DELAY_SEARCH_INPUT)();
  };

  const handleUpdateMessageSocket = async (data) => {
    if (!data || !data.message || !data.conversation) {
      console.error("Invalid data provided");
      return;
    }

    const newMessageSound = new Audio(messageSound);
    const { message, targetSocketId, conversation, receiver } = data;
    const { sender } = message;
    const { listMessages } = conversationSubs.state || {};

    if (targetSocketId === socketIo?.id) {
      return;
    }

    const inConversationWithSender =
      getCurrentReceiverId() === sender || userId === sender;
    const usersRead = inConversationWithSender ? [userId] : [sender];

    const updatedConversations = updateConversations(conversation, usersRead);
    const updatedMessages = updateMessages(message, listMessages);

    const dataUpdate = {
      ...(isChanged([
        conversationSubs.state.listConversations,
        updatedConversations,
      ]) && { listConversations: updatedConversations }),

      ...(isChanged([conversationSubs.state.listMessages, updatedMessages]) && {
        listMessages: updatedMessages,
      }),

      ...(getCurrentReceiverId() === conversation.receiver?._id && {
        receiver: conversation.receiver,
      }),
    };

    conversationSubs.state = { ...conversationSubs.state, ...dataUpdate };

    debounce(() => {
      const isCurrentUser = conversation?.receiver?._id === userId;

      conversationSubs.updateState(dataUpdate);
      !isCurrentUser && newMessageSound.play();
    }, TIME_DELAY_SEARCH_INPUT)();
  };

  function updateConversations(updatedConversation, usersRead) {
    const { listConversations } = conversationSubs.state || {};
    const { _id: newConversationId, receiver } = updatedConversation || {};
    const isCurrentUser = receiver?._id === userId;

    const isExistConversation = listConversations.some(
      (item) => item?._id === newConversationId
    );

    if (!isExistConversation) {
      listConversations.push(updatedConversation);
    }

    return uniqBy(
      listConversations.map((item) => {
        if (item?._id === updatedConversation?._id) {
          return {
            ...item,
            usersRead: isCurrentUser ? [userId] : usersRead,
            lastMessage: updatedConversation.lastMessage,
          };
        }

        return item;
      }),
      "_id"
    );
  }

  function updateMessages(newMessage, existingMessages) {
    if (
      newMessage?.sender === getCurrentReceiverId() ||
      newMessage?.sender === userId
    ) {
      return uniqBy(
        [newMessage, ...existingMessages].slice(0, limitFetchMessage),
        "_id"
      );
    }

    return getCurrentReceiverId() ? existingMessages : [];
  }

  const handleApplyNewInfoUser = async () => {
    const resInfoUser = await getDataInfoUser();
    if (resInfoUser.data) {
      login({ infoUser: resInfoUser.data });
    }
  };

  const initFunction = () => {
    handleGetAllConversations(false);
  };

  return null;
};
