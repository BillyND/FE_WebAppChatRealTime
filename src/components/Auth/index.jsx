import "./Auth.scss";
import LoginAndRegister from "./LoginAndRegister";
import { useLocation } from "react-router-dom";
import ForgotPass from "./ForgotPass";

function AuthScreen() {
  const { pathname } = useLocation();

  const isForgotPasswordPage = pathname?.includes("forgot-password");

  return (
    <div className="auth-screen">
      {isForgotPasswordPage ? <ForgotPass /> : <LoginAndRegister />}
    </div>
  );
}

export default AuthScreen;
