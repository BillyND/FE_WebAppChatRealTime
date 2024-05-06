import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSubscription } from "global-state-hook";
import { uniqBy } from "lodash";
import { useEffect } from "react";
import { io } from "socket.io-client";
import messageSound from "../../assets/sounds/message.mp3";
import { handleGetAllConversations } from "../../components/Conversation/ListConversations";
import { getDataInfoUser } from "../../services/api";
import {
  conversationSubs,
  socketIoSubs,
} from "../globalStates/initGlobalState";
import { getCurrentReceiverId } from "../utilities";

export const SocketIoHandler = () => {
  const {
    state: { socketIo },
    setState,
  } = useSubscription(socketIoSubs, ["socketIo"]);

  const {
    state: { conversationId },
  } = useSubscription(conversationSubs);

  const {
    infoUser,
    infoUser: { _id: userId },
    login,
  } = useAuthUser();

  useEffect(() => {
    const handleApplyNewInfoUser = async () => {
      const resInfoUser = await getDataInfoUser();
      if (resInfoUser.data) {
        login({ infoUser: resInfoUser.data });
      }
    };

    const initFunction = () => {
      handleGetAllConversations(false);
    };

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    newSocket.emit("connectUser", userId);
    setState({ socketIo: newSocket });
    handleApplyNewInfoUser();
    initFunction();

    return () => {
      newSocket.close();
      setState({ socketIo: null });
    };
  }, [userId]);

  useEffect(() => {
    const newMessageSound = new Audio(messageSound);

    const handleUpdateMessageSocket = async (data) => {
      if (!data || !data.message || !data.conversation) {
        console.error("Invalid data provided");
        return;
      }

      const { message, targetSocketId, conversation } = data;

      const { sender } = message;
      const { listMessages } = conversationSubs.state || {};

      if (targetSocketId === socketIo?.id) {
        return;
      }

      const inConversationWithSender = window.location.search?.includes(sender);
      const usersRead = inConversationWithSender ? [userId] : [sender];

      const updatedConversations = updateConversations(conversation, usersRead);
      const updatedMessages = updateMessages(message, listMessages);

      const dataUpdated = {
        listConversations: updatedConversations,
        listMessages: updatedMessages,
        receiver: conversation.receiver,
      };

      conversationSubs.updateState(dataUpdated);

      newMessageSound.play();
    };

    const updateConversations = (updatedConversation, usersRead) => {
      const { listConversations } = conversationSubs.state || {};
      return uniqBy(
        [updatedConversation, ...listConversations].map((item) => {
          return item?._id === updatedConversation?._id
            ? { ...updatedConversation, usersRead }
            : item;
        }),
        "_id"
      );
    };

    const updateMessages = (newMessage, existingMessages) => {
      if (newMessage?.sender === getCurrentReceiverId()) {
        return [newMessage, ...existingMessages];
      }

      return existingMessages;
    };

    socketIo?.on("getMessage", handleUpdateMessageSocket);

    return () => {
      socketIo?.off("getMessage", handleUpdateMessageSocket);
    };
  }, [socketIo, conversationId]);

  return <></>;
};
