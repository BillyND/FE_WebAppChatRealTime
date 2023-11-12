import { LoadingOutlined } from "@ant-design/icons";
import { Checkbox, Flex, Input } from "antd";
import Link from "antd/es/typography/Link";
import { useState } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import "./Login.scss";

let infoLogin = {
  email: "",
  password: "",
};

const ButtonLogin = () => {
  const { login, infoUser } = useAuthUser();
  console.log("===>infoUser:", infoUser);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleLogin = () => {
    if (loadingLogin) {
      return;
    }
    setLoadingLogin(true);
    login(infoLogin);
  };

  return (
    <button
      className={`button-auth ${loadingLogin ? "disable-btn" : ""}`}
      onClickCapture={handleLogin}
    >
      SIGN IN
      {loadingLogin && <LoadingOutlined className="icon-loading" />}
    </button>
  );
};

function Login() {
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <div className="login-container none-copy">
      <div className="text-center login-content container">
        <h1 className="header-login">Sign in</h1>
        <span className="description-login">Have an account?</span>

        <Input
          size="large"
          placeholder="Email"
          className="input-login"
          onChange={(e) => {
            infoLogin = {
              ...infoLogin,
              email: e.target.value,
            };
          }}
        />

        <Input
          size="large"
          placeholder="Password"
          className="input-login"
          onChange={(e) => {
            infoLogin = {
              ...infoLogin,
              password: e.target.value,
            };
          }}
        />

        <Flex
          justify="space-between"
          align="center"
          gap="small"
          style={{ width: "100%" }}
        >
          <Flex align="center" gap="small">
            <Checkbox onChange={onChange}>Checkbox</Checkbox>
          </Flex>

          <Link className="reset-password">Forgot Password</Link>
        </Flex>

        <ButtonLogin />
      </div>
    </div>
  );
}

export default Login;
