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

let timerForceReload;
export const SocketIoHandler = () => {
  const {
    state: { socketIo },
    setState,
  } = useSubscription(socketIoSubs, ["socketIo"]);

  const {
    state: { conversationId },
  } = useSubscription(conversationSubs);

  const {
    infoUser: { _id: userId },
    login,
  } = useAuthUser();

  let newSocket;

  useEffect(() => {
    handleApplyNewInfoUser();
    initFunction();
    handleVisibilityChange(false);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      newSocket.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      setState({ socketIo: null });
    };
  }, [userId]);

  useEffect(() => {
    socketIo?.on("getMessage", handleUpdateMessageSocket);
    socketIo?.on("receiveReadMessage", handleUpdateMessageRead);
    socketIo?.on("receiveConnect", (data) => {
      console.log("===>Is online socket:", data);
      clearTimeout(timerForceReload);
    });

    return () => {
      socketIo?.off("getMessage", handleUpdateMessageSocket);
      socketIo?.off("receiveReadMessage", handleUpdateMessageRead);
    };
  }, [socketIo, conversationId]);

  const handleVisibilityChange = async () => {
    if (!newSocket?.connected) {
      newSocket = await io(import.meta.env.VITE_SOCKET_URL, {
        transports: ["websocket"],
      });

      setState({ socketIo: newSocket });

      newSocket.emit("connectUser", userId);
    }

    newSocket?.emit("checkConnect", userId);

    clearTimeout(timerForceReload);

    timerForceReload = setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleUpdateMessageRead = (data) => {
    const { conversationId, messageRead } = data || {};

    conversationSubs.updateState({
      listConversations: conversationSubs.state.listConversations.map(
        (item) => {
          if (item?._id === conversationId) {
            return { ...item, messageRead };
          }

          return item;
        }
      ),
    });
  };

  const handleUpdateMessageSocket = async (data) => {
    if (!data || !data.message || !data.conversation) {
      console.error("Invalid data provided");
      return;
    }

    const newMessageSound = new Audio(messageSound);
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
      ...(getCurrentReceiverId() === conversation.receiver?._id && {
        receiver: conversation.receiver,
      }),
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

    if (!getCurrentReceiverId()) {
      return [];
    }

    return existingMessages;
  };

  const handleApplyNewInfoUser = async () => {
    const resInfoUser = await getDataInfoUser();
    if (resInfoUser.data) {
      login({ infoUser: resInfoUser.data });
    }
  };

  const initFunction = () => {
    handleGetAllConversations(false);
  };

  return <></>;
};
