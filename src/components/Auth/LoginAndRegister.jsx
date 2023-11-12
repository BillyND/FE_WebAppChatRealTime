import { LoadingOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import Link from "antd/es/typography/Link";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";
import { postRegister } from "../../services/api";
import { TIME_DEBOUNCE_INPUT_LOGIN_REGISTER } from "../../utils/constant";

const ButtonLoginRegister = (props) => {
  const {
    loadingAuth,
    setLoadingAuth,
    isLoginPage,
    infoUserInput,
    refInfoUser,
  } = props;
  const { login, infoUser } = useAuthUser();

  const handleLogin = () => {
    if (loadingAuth) {
      return;
    }
    setLoadingAuth(true);
    login(infoUserInput);
  };

  const handleRegister = async () => {
    if (loadingAuth) {
      return;
    }
    try {
      setLoadingAuth(true);

      console.log("===>infoUserInput:", infoUserInput);

      const resRegister = await postRegister(infoUserInput);
      refInfoUser.current.value = "";

      if (resRegister?.EC === 0) {
        message.success(resRegister?.message);
      } else {
        message.error(resRegister?.message);
      }

      setLoadingAuth(false);
    } catch (error) {
      setLoadingAuth(false);
      message.error("Server error");
    }
  };

  return (
    <button
      className={`button-auth ${loadingAuth ? "disable-btn" : ""}`}
      onClickCapture={isLoginPage ? handleLogin : handleRegister}
    >
      {isLoginPage ? "SIGN IN" : "SIGN UP"}
      {loadingAuth && <LoadingOutlined className="icon-loading" />}
    </button>
  );
};

function LoginAndRegister() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [infoUserInput, setInfoUserInput] = useState({});
  const isLoginPage = pathname?.includes("login");
  const refInfoUser = useRef(null);

  return (
    <div className="login-container none-copy">
      <div className="text-center login-content container">
        <h1 className="header-login">{isLoginPage ? "Sign in" : "Sign up"}</h1>
        <span className="description-login">
          {isLoginPage ? (
            <Link
              className="remove-style-link"
              onClick={() => navigate("/register")}
            >
              {`Don't have an account yet? Register now!`}
            </Link>
          ) : (
            <Link
              className="remove-style-link"
              onClick={() => navigate("/login")}
            >
              {`Already have an account? Log in now!`}
            </Link>
          )}
        </span>

        <Input
          ref={refInfoUser}
          size="large"
          placeholder="Email"
          className="input-login"
          onChange={debounce((e) => {
            setInfoUserInput({
              ...infoUserInput,
              email: e.target.value?.trim(),
            });
          }, TIME_DEBOUNCE_INPUT_LOGIN_REGISTER)}
        />

        {!isLoginPage && (
          <Input
            size="large"
            placeholder="Username"
            className="input-login"
            onChange={debounce((e) => {
              setInfoUserInput({
                ...infoUserInput,
                username: e.target.value?.trim(),
              });
            }, TIME_DEBOUNCE_INPUT_LOGIN_REGISTER)}
          />
        )}

        <Input
          size="large"
          placeholder="Password"
          className="input-login"
          onChange={debounce((e) => {
            setInfoUserInput({
              ...infoUserInput,
              password: e.target.value?.trim(),
            });
          }, TIME_DEBOUNCE_INPUT_LOGIN_REGISTER)}
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
          infoUserInput={infoUserInput}
          refInfoUser={refInfoUser}
        />
      </div>
    </div>
  );
}

export default LoginAndRegister;
