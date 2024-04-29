import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { TIME_DEBOUNCE_INPUT_LOGIN_REGISTER } from "@utils/constant";
import { Input } from "antd";
import Link from "antd/es/typography/Link";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import { debounce } from "../../utils/utilities";
import { WrapAuthScreen } from "./AuthScreenStyled";
import { ButtonAuth } from "./ButtonAuth";
import ForgotPass from "./ForgotPass";

export default function AuthScreen() {
  const navigate = useNavigateCustom();
  const { pathname } = useLocation();
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [infoUserInput, setInfoUserInput] = useState({});
  const isLoginPage = pathname?.includes("login");
  const refInfoUser = useRef(null);

  const handleInputChange = (key, value) => {
    setInfoUserInput({
      ...infoUserInput,
      [key]: value,
    });
  };

  const isForgotPasswordPage = pathname?.includes("forgot-password");

  return (
    <WrapAuthScreen>
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
    </WrapAuthScreen>
  );
}
