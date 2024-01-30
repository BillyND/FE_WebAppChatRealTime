import { useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getInfoUserLocal } from "./services/customAxios";
import AuthScreen from "./components/Auth/AuthScreen";
import HomeScreen from "./components/Home/HomeScreen";
import ModalNewPost from "./components/Post/ModalNewPost";
import { placeHolderInputPost } from "./components/Post/NewPost";
import { WrapStyledApp } from "./StyledApp";
import "./global.scss";

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
    <WrapStyledApp className="App">
      {/* Component to trigger navigate */}
      <TriggerNavigate />

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
