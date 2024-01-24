import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { postLogin, postRegister } from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { regexValidateEmail } from "../../utils/constant";
import { SpinnerLoading } from "../Home/HomeContent";

export const ButtonAuth = ({
  loadingAuth,
  setLoadingAuth,
  isLoginPage,
  infoUserInput,
  setInfoUserInput,
}) => {
  const { login } = useAuthUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname?.includes("register")) {
      setInfoUserInput({
        ...infoUserInput,
        username: "",
      });
    }
  }, [pathname]);

  const handleLogin = async () => {
    if (loadingAuth) return;

    // Email, password, and username validation
    if (
      !validateEmail(infoUserInput.email) ||
      !validateLength(infoUserInput.password, 6)
    ) {
      if (!validateEmail(infoUserInput.email)) {
        message.error("Please enter a valid email address.");
        return;
      }
      if (!validateLength(infoUserInput.password, 6)) {
        message.error("Password must be at least 6 characters.");
        return;
      }
      return;
    }
    try {
      setLoadingAuth(true);
      const resLogin = await postLogin(infoUserInput);

      if (resLogin?.EC === 0) {
        message.success(resLogin?.message);
        login(resLogin?.data);
        navigate("/");
      } else {
        message.error(resLogin?.message);
      }

      setLoadingAuth(false);
    } catch (error) {
      setLoadingAuth(false);
      message.error("Server error");
    }
  };

  const handleRegister = async () => {
    if (loadingAuth) return;

    // Email, password, and username validation
    if (
      !validateEmail(infoUserInput.email) ||
      !validateLength(infoUserInput.password, 6) ||
      !validateLength(infoUserInput.username, 6)
    ) {
      if (!validateEmail(infoUserInput.email)) {
        message.error("Please enter a valid email address.");
        return;
      }
      if (!validateLength(infoUserInput.password, 6)) {
        message.error("Password must be at least 6 characters.");
        return;
      }
      if (!validateLength(infoUserInput.username, 6)) {
        message.error("Username must be at least 6 characters.");
        return;
      }
      return;
    }

    try {
      setLoadingAuth(true);
      const resRegister = await postRegister(infoUserInput);

      if (resRegister?.EC === 0) {
        message.success(resRegister?.message);
        navigate("/login");
      } else {
        message.error(resRegister?.message);
      }

      setLoadingAuth(false);
    } catch (error) {
      setLoadingAuth(false);
      message.error("Server error");
    }
  };

  const validateEmail = (email) => {
    return email && regexValidateEmail.test(email);
  };

  const validateLength = (value, minLength) => {
    return value && value.length >= minLength;
  };

  return (
    <button
      className={`button-auth ${loadingAuth ? "disable-btn" : ""}`}
      onClickCapture={isLoginPage ? handleLogin : handleRegister}
    >
      {isLoginPage ? "SIGN IN" : "SIGN UP "}
      {loadingAuth && (
        <LoadingOutlined
          style={{ scale: "1.5", position: "absolute", marginLeft: "100px" }}
        />
      )}
    </button>
  );
};
