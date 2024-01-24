import { useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AuthScreen from "./screens/Auth/AuthScreen";
import HomeScreen from "./screens/Home";
import { getInfoUserLocal } from "./services/customAxios";
import { useState } from "react";
import { useRef } from "react";
import socketIOClient from "socket.io-client";
import { io } from "socket.io-client";
import { useAuthUser } from "./utils/hooks/useAuthUser";
import TriggerSocket from "./components/TriggerSocket";

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

function App() {
  return (
    <div className="App">
      {/* Component to trigger navigate */}
      <TriggerNavigate />
      <TriggerSocket />

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
    </div>
  );
}

export default App;
