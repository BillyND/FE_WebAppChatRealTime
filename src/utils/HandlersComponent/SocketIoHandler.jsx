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
import { handleReadConversation } from "../../components/Conversation/ConversationContent";

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
      socketIo?.emit("disconnect");
      newSocket.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      setState({ socketIo: null });
    };
  }, [userId]);

  useEffect(() => {
    socketIo?.on("getMessage", handleUpdateMessageSocket);
    socketIo?.on("receiveReadMessage", handleUpdateMessageRead);
    socketIo?.on("receiveConnect", () => clearTimeout(timerForceReload));
    socketIo?.on("usersOnline", (data) => {
      console.log("===?>herer");
      conversationSubs.updateState({ usersOnline: data });
    });

    return () => {
      socketIo?.off("getMessage", handleUpdateMessageSocket);
      socketIo?.off("receiveReadMessage", handleUpdateMessageRead);
    };
  }, [socketIo, conversationId]);

  const handleVisibilityChange = async () => {
    handleReadConversation();

    if (!newSocket?.connected) {
      newSocket = await io(import.meta.env.VITE_SOCKET_URL, {
        transports: ["websocket"],
      });

      setState({ socketIo: newSocket });

      newSocket.emit("connectUser", userId);
    }

    newSocket?.emit("checkConnect", userId);

    clearTimeout(timerForceReload);

    timerForceReload = setTimeout(async () => {
      newSocket = await io(import.meta.env.VITE_SOCKET_URL, {
        transports: ["websocket"],
      });

      setState({ socketIo: newSocket });

      newSocket.emit("connectUser", userId);
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
