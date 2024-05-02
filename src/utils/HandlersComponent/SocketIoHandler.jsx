import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { useSubscription } from "global-state-hook";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { io } from "socket.io-client";
import messageSound from "../../assets/sounds/message.mp3";
import { handleGetAllConversations } from "../../components/Conversation/ListConversations";
import { getDataInfoUser } from "../../services/api";
import { boxMessageId } from "../constant";
import {
  conversationSubs,
  socketIoSubs,
} from "../globalStates/initGlobalState";
import { scrollToBottomOfElement } from "../utilities";

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

  const { isMobile } = useWindowSize();

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
      const { newMessage, targetSocketId } = data || {};
      const { sender, conversationId: conversationIdSocket } = newMessage || {};
      const { listMessages } = conversationSubs.state || {};

      const inConversationWithSender = window.location.search?.includes(sender);

      if (targetSocketId === socketIo?.id) {
        return;
      }

      if (
        inConversationWithSender &&
        !isEmpty(listMessages) &&
        conversationId === conversationIdSocket
      ) {
        conversationSubs.updateState({
          listMessages: [...listMessages, newMessage],
        });

        isMobile && scrollToBottomOfElement(boxMessageId);
      }

      newMessageSound.play();
      handleGetAllConversations(false);
    };

    socketIo?.on("getMessage", handleUpdateMessageSocket);

    return () => {
      socketIo?.off("getMessage", handleUpdateMessageSocket);
    };
  }, [socketIo, conversationId]);

  return <></>;
};
