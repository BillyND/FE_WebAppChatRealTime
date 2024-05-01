import { getInfoUserLocal } from "@services/customAxios";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { message } from "antd";
import { useSubscription } from "global-state-hook";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Layout from "./Layout";
import { WrapStyledApp } from "./StyledApp";
import PreviewImageFullScreen from "./UI/PreviewImageFullScreen";
import messageSound from "./assets/sounds/message.mp3";
import AuthScreen from "./components/Auth/AuthScreen";
import { handleGetAllConversations } from "./components/Conversation/ListConversations";
import HomeScreen from "./components/Home/HomeScreen";
import MessageScreen from "./components/Message/MessageScreen";
import ModalNewPost from "./components/Post/ModalNewPost";
import { placeHolderInputPost } from "./components/Post/NewPost";
import SearchScreen from "./components/Search/SearchScreen";
import UserScreen from "./components/User/UserScreen";
import "./global.scss";
import { getDataInfoUser } from "./services/api";
import {
  TIME_DELAY_FETCH_API,
  TITLE_OF_CURRENT_SITE,
  boxMessageId,
} from "./utils/constant";
import {
  conversationSubs,
  socketIoSubs,
} from "./utils/globalStates/initGlobalState";
import { useNavigateCustom } from "./utils/hooks/useNavigateCustom";
import {
  convertToTitleCase,
  debounce,
  isChanged,
  scrollToBottomOfElement,
} from "./utils/utilities";

const TriggerNavigate = () => {
  const navigate = useNavigateCustom();
  const { pathname } = useLocation();
  const { accessToken } = getInfoUserLocal();
  const isOnLoginRegisterPage =
    pathname === "/login" || pathname === "/register";
  const isNotOnHomePage = pathname !== "/";
  const shouldRedirectToHome =
    accessToken && isOnLoginRegisterPage && isNotOnHomePage;
  const shouldRedirectToLogin = !accessToken && !isOnLoginRegisterPage;

  useEffect(() => {
    document.title = convertToTitleCase(pathname) || TITLE_OF_CURRENT_SITE;
    if (shouldRedirectToHome) {
      navigate("/");
    }

    if (shouldRedirectToLogin) {
      navigate("/login");
    }
  }, [pathname]);

  return <PreviewImageFullScreen />;
};

const TriggerConnectSocketIo = () => {
  const {
    state: { socketIo },
    setState,
  } = useSubscription(socketIoSubs, ["socketIo"]);

  const {
    state: { conversationId, receiver },
  } = useSubscription(conversationSubs);

  const {
    infoUser: { _id: userId },
    login,
  } = useAuthUser();

  const handleApplyNewInfoUser = async () => {
    const resInfoUser = await getDataInfoUser();

    if (resInfoUser.data) {
      login({
        infoUser: resInfoUser.data,
      });
    }
  };

  useEffect(() => {
    handleApplyNewInfoUser();
    initFunction();

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    newSocket.emit("connectUser", userId);
    setState({ socketIo: newSocket });

    return () => {
      newSocket.close();
      setState({ socketIo: null });
    };
  }, [userId]);

  useEffect(() => {
    socketIo?.on("getMessage", handleUpdateMessageSocket);
  }, [socketIo, conversationId]);

  const handleUpdateMessageSocket = debounce(async (data) => {
    const { newMessage, targetSocketId } = data || {};
    const { sender, conversationId: conversationIdSocket } = newMessage || {};
    const { listMessages } = conversationSubs.state || {};

    // Handle new message sound
    const newMessageSound = new Audio(messageSound);

    // If in a conversation screen with the sender
    const inConversationWithSender = window.location.search?.includes(sender);

    if (targetSocketId === socketIo?.id) {
      return;
    }

    // Update new messages
    if (
      inConversationWithSender &&
      !isEmpty(listMessages) &&
      conversationId === conversationIdSocket
    ) {
      conversationSubs.updateState({
        listMessages: [...listMessages, newMessage],
      });

      scrollToBottomOfElement(boxMessageId);
    }

    handleGetAllConversations(false);
    debounce(() => newMessageSound.play(), 1000)();
  }, 50);

  const initFunction = () => {
    handleGetAllConversations(false);
  };

  return <></>;
};

function App() {
  const {
    styleApp,
    styleApp: { type: typeStyle },
  } = useStyleApp();
  const { isMobile } = useWindowSize();

  message.config({
    maxCount: isMobile ? 1 : 3,
  });

  return (
    <WrapStyledApp style={styleApp} className="App" typeStyle={typeStyle}>
      <BrowserRouter>
        {/* Component to trigger navigate */}
        <TriggerNavigate />

        {/* Component to trigger socketIo */}
        <TriggerConnectSocketIo />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeScreen />} />
            <Route path="search" element={<SearchScreen />} />
            <Route path="message" element={<MessageScreen />} />
            <Route path="user" element={<UserScreen />} />
            <Route path="*" element={<HomeScreen />} />
          </Route>

          {/* <=== Auth screen ===> */}
          <Route path="logout" element={<AuthScreen />} />
          <Route path="login" element={<AuthScreen />} />
          <Route path="register" element={<AuthScreen />} />
          <Route path="forgot-password" element={<AuthScreen />} />
        </Routes>
      </BrowserRouter>
      <ModalNewPost placeHolderInputPost={placeHolderInputPost} />
    </WrapStyledApp>
  );
}

export default App;
