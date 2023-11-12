import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Link from "antd/es/typography/Link";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TIME_DEBOUNCE_INPUT_LOGIN_REGISTER } from "../../utils/constant";
import { ButtonLoginRegister } from "./ButtonLoginRegister";

function LoginAndRegister() {
  const navigate = useNavigate();
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

  return (
    <div className="login-container none-copy">
      <div className="text-center login-content container">
        <h1 className="header-login">{isLoginPage ? "Sign in" : "Sign up"}</h1>
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
          onChange={debounce(
            (e) => handleInputChange("email", e.target.value?.trim()),
            TIME_DEBOUNCE_INPUT_LOGIN_REGISTER
          )}
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
          className="input-login"
          onChange={debounce(
            (e) => handleInputChange("password", e.target.value?.trim()),
            TIME_DEBOUNCE_INPUT_LOGIN_REGISTER
          )}
          iconRender={(visible) =>
            visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
          }
        />

        {isLoginPage && (
          <div
            style={{ width: "100%" }}
            className="d-flex justify-content-end px-2"
          >
            <Link
              className="remove-style-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password
            </Link>
          </div>
        )}

        <ButtonLoginRegister
          isLoginPage={isLoginPage}
          loadingAuth={loadingAuth}
          setLoadingAuth={setLoadingAuth}
          setInfoUserInput={setInfoUserInput}
          infoUserInput={infoUserInput}
          refInfoUser={refInfoUser}
        />
      </div>
    </div>
  );
}

export default LoginAndRegister;
