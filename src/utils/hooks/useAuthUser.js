import { useSubscription } from "global-state-hook";
import { KEY_INFO_USER } from "../constant";
import { infoUserSubscription } from "../globalStates/initGlobalState";
import { passLocalStorage } from "../passLocalStorage";

export const useAuthUser = () => {
  const { state, setState } = useSubscription(infoUserSubscription, [
    "infoUser",
    "accessToken",
    "refreshToken",
  ]);

  const login = (payload) => {
    passLocalStorage?.setItem(KEY_INFO_USER, {
      ...state,
      ...payload,
    });

    setState({
      ...state,
      ...payload,
    });
  };

  const logout = () => {
    passLocalStorage?.removeItem(KEY_INFO_USER);
    window.location.href = "/login";
  };

  const { infoUser = {}, accessToken = {}, refreshToken = {} } = state;

  return { login, logout, infoUser, accessToken, refreshToken };
};
