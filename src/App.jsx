import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getInfoUserLocal } from "./services/customAxios";
import AuthScreen from "./components/Auth/AuthScreen";
import HomeScreen from "./components/Home/HomeScreen";
import ModalNewPost from "./components/Post/ModalNewPost";
import { placeHolderInputPost } from "./components/Post/NewPost";
import { WrapStyledApp } from "./StyledApp";
import "./global.scss";
import { useStyleApp } from "./utils/hooks/useStyleApp";
import { useRef } from "react";
import { io } from "socket.io-client";
import { useAuthUser } from "./utils/hooks/useAuthUser";
import { useSubscription } from "global-state-hook";
import { socketIoSubs } from "./utils/globalStates/initGlobalState";

const TriggerNavigate = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { accessToken } = getInfoUserLocal();
  const isOnLoginRegisterPage =
    pathname === "/login" || pathname === "/register";
  const isNotOnHomePage = pathname !== "/";
  const shouldRedirectToHome =
    accessToken && isOnLoginRegisterPage && isNotOnHomePage;

  const shouldRedirectToLogin = !accessToken && !isOnLoginRegisterPage;

  useEffect(() => {
    if (shouldRedirectToHome) {
      navigate("/");
    }

    if (shouldRedirectToLogin) {
      navigate("/login");
    }
  }, [pathname]);

  return <></>;
};

const TriggerConnectSocketIo = () => {
  const { setState } = useSubscription(socketIoSubs, ["socketIo"]);
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    newSocket.emit("addUser", userId);
    setState({ socketIo: newSocket });
    return () => newSocket.close();
  }, []);

  return <></>;
};

function App() {
  const {
    styleApp: { type: typeStyle },
  } = useStyleApp();

  return (
    <WrapStyledApp className="App" typeStyle={typeStyle}>
      {/* Component to trigger navigate */}
      <TriggerNavigate />

      {/* Component to trigger socketIo */}
      <TriggerConnectSocketIo />

      <Routes>
        <Route path="/" element={<HomeScreen path="/" />} />
        <Route
          path="/profile/:userId"
          element={<HomeScreen path={"/profile"} />}
        />
        <Route path="/inbox" element={<HomeScreen path={"/inbox"} />} />

        {/* <=== Auth screen ===> */}
        <Route path="/logout" element={<AuthScreen />} />
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/register" element={<AuthScreen />} />
        <Route path="/forgot-password" element={<AuthScreen />} />

        <Route path="*" element={<HomeScreen />} />
      </Routes>
      <ModalNewPost placeHolderInputPost={placeHolderInputPost} />
    </WrapStyledApp>
  );
}

export default App;
