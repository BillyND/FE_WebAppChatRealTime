import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Link from "antd/es/typography/Link";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TIME_DEBOUNCE_INPUT_LOGIN_REGISTER } from "../../utils/constant";
import "./AuthScreen.scss";
import { ButtonAuth } from "./ButtonAuth";
import ForgotPass from "./ForgotPass";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { io } from "socket.io-client";
import { useEffect } from "react";

export default function AuthScreen() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [infoUserInput, setInfoUserInput] = useState({});
  const isLoginPage = pathname?.includes("login");
  const refInfoUser = useRef(null);

  const [testData, setTestData] = useState(0);

  const socketRef = useRef();
  const { infoUser } = useAuthUser();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("getData", (data) => {
      setTestData(data);
    });
  }, [socketRef]);

  useEffect(() => {
    socketRef.current.on("getData", (data) => {
      setTestData(data);
      console.log("===>data:", data);
    });
  }, [socketRef]);

  const handleInputChange = (key, value) => {
    setInfoUserInput({
      ...infoUserInput,
      [key]: value,
    });
  };

  const isForgotPasswordPage = pathname?.includes("forgot-password");

  return (
    <div className="auth-screen">
      <button
        onClick={() => {
          socketRef.current.emit("changeData", testData + 1);
        }}
      >
        Test
      </button>
      {testData}
      {isForgotPasswordPage ? (
        <ForgotPass />
      ) : (
        <div className="login-container none-copy">
          <div className="text-center login-content container">
            <h1 className="header-login">
              {isLoginPage ? "Sign in" : "Sign up"}
            </h1>
            <span className="description-login">
              <Link
                className="remove-style-link"
                onClick={() => navigate(isLoginPage ? "/register" : "/login")}
              >
                {isLoginPage
                  ? `Don't have an account yet? Register now!`
                  : `Already have an account? Log in now!`}
              </Link>
            </span>

            <Input
              ref={refInfoUser}
              size="large"
              placeholder="Email"
              className="input-login"
              onChange={(e) =>
                handleInputChange("email", e.target.value?.trim())
              }
            />

            {!isLoginPage && (
              <Input
                size="large"
                placeholder="Username"
                className="input-login"
                onChange={debounce(
                  (e) => handleInputChange("username", e.target.value?.trim()),
                  TIME_DEBOUNCE_INPUT_LOGIN_REGISTER
                )}
              />
            )}

            <Input.Password
              size="large"
              placeholder="Password"
              type="password"
              className="input-login password"
              onChange={(e) =>
                handleInputChange("password", e.target.value?.trim())
              }
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />

            <ButtonAuth
              isLoginPage={isLoginPage}
              loadingAuth={loadingAuth}
              setLoadingAuth={setLoadingAuth}
              setInfoUserInput={setInfoUserInput}
              infoUserInput={infoUserInput}
              refInfoUser={refInfoUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
