import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { message } from "antd";
import "react-perfect-scrollbar/dist/css/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { WrapStyledApp } from "./StyledApp";
import AuthScreen from "./components/Auth/AuthScreen";
import HomeScreen from "./components/Home/HomeScreen";
import MessageScreen from "./components/Message/MessageScreen";
import ModalNewPost from "./components/Post/ModalNewPost";
import { placeHolderInputPost } from "./components/Post/NewPost";
import SearchScreen from "./components/Search/SearchScreen";
import UserScreen from "./components/User/UserScreen";
import "./global.scss";

import { NavigationHandler } from "./utils/HandlersComponent/NavigationHandler";
import { SocketIoHandler } from "./utils/HandlersComponent/SocketIoHandler";

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
    <WrapStyledApp style={styleApp} className="App" type-style={typeStyle}>
      <BrowserRouter>
        {/* Component to trigger navigate */}
        <NavigationHandler />

        {/* Component to trigger socketIo */}
        <SocketIoHandler />

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
