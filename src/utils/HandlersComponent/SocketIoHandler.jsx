import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { useSubscription } from "global-state-hook";
import { isEmpty, uniqBy } from "lodash";
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
      const { message, targetSocketId, conversation } = data || {};
      const { sender } = message || {};
      const { listMessages } = conversationSubs.state || {};

      const inConversationWithSender = window.location.search?.includes(sender);

      if (targetSocketId === socketIo?.id) {
        return;
      }

      console.log("===>infoUser", infoUser);
      console.log("===>conversation.receiver ", conversation.receiver);

      const usersRead = inConversationWithSender ? [userId] : [sender];

      const dataUpdated = {
        listConversations: uniqBy(
          [conversation, ...conversationSubs.state.listConversations].map(
            (item) => {
              if (item?._id === conversation?._id) {
                return {
                  ...conversation,
                  usersRead,
                };
              }
              return item;
            }
          ),
          "_id"
        ),

        listMessages: [message, ...listMessages],
      };

      conversationSubs.updateState(dataUpdated);

      newMessageSound.play();
    };

    socketIo?.on("getMessage", handleUpdateMessageSocket);

    return () => {
      socketIo?.off("getMessage", handleUpdateMessageSocket);
    };
  }, [socketIo, conversationId]);

  return <></>;
};
