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
  getDataSearchParams,
  isChanged,
  limitFetchMessage,
} from "../utilities";
import { useSearchParams } from "@utils/hooks/useSearchParams";

export const SocketIoHandler = () => {
  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs);

  const {
    state: { listConversations },
  } = useSubscription(conversationSubs, ["listConversations"]);

  const [conversationId] = useSearchParams(["conversationId"]);

  const {
    infoUser: { _id: userId, email },
    login,
  } = useAuthUser();

  useEffect(() => {
    debounce(() => {
      const currentConversation = listConversations.find(
        (item) => item?._id === conversationId
      );

      if (currentConversation) {
        socketIo?.emit("emitConversationSameUser", {
          currentConversation,
          userId,
        });
      }

      socketIo?.on(
        "getConversationSameUer",
        debounce((data) => {
          const { targetSocketId, currentConversation } = data || {};

          if (
            targetSocketId === socketIo?.id ||
            currentConversation?._id === conversationId
          ) {
            return;
          }

          const newListConversation = listConversations.map((item) =>
            item._id === currentConversation?._id ? currentConversation : item
          );

          if (isChanged([newListConversation, listConversations])) {
            conversationSubs.updateState({
              listConversations: newListConversation,
            });
          }
        }, 50)
      );
    }, 500)();
  }, [listConversations]);

  useEffect(() => {
    initFunction();

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
      getDataSearchParams("receiverId") === sender || userId === sender;
    const usersRead = inConversationWithSender ? [userId, sender] : [sender];

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

      ...(getDataSearchParams("receiverId") === conversation.receiver?._id && {
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
    const { listConversations = [] } = conversationSubs.state || {};
    const {
      _id: newConversationId,
      receiver,
      lastMessage,
      messageCount,
    } = updatedConversation || {};

    const isCurrentUser = receiver?._id === userId;

    const updatedList = listConversations.map((item) => {
      if (item?._id === newConversationId) {
        return {
          ...item,
          messageCount,
          usersRead: isCurrentUser ? [...usersRead, userId] : usersRead,
          lastMessage,
        };
      }
      return item;
    });

    if (!updatedList.some((item) => item?._id === newConversationId)) {
      updatedList.push(updatedConversation);
    }

    const uniqueList = uniqBy(updatedList, "_id");

    uniqueList.sort(
      (a, b) =>
        new Date(b.lastMessage?.timeSendLast) -
        new Date(a.lastMessage?.timeSendLast)
    );

    return uniqueList;
  }

  function updateMessages(newMessage, existingMessages) {
    if (
      newMessage?.sender === getDataSearchParams("receiverId") ||
      newMessage?.sender === userId
    ) {
      return uniqBy(
        [newMessage, ...existingMessages].slice(0, limitFetchMessage),
        "_id"
      );
    }

    return getDataSearchParams("receiverId") ? existingMessages : [];
  }

  const handleApplyNewInfoUser = async () => {
    const resInfoUser = await getDataInfoUser();
    if (resInfoUser.data) {
      login({ infoUser: resInfoUser.data });
    }
  };

  const initFunction = () => {
    handleGetAllConversations();
    handleApplyNewInfoUser();
    connectUserToSocket();
  };

  return null;
};
