import { useSubscription } from "global-state-hook";
import { KEY_INFO_USER, initInfoUser } from "../constant";
import { infoUserSubscription } from "../globalStates/initGlobalState";
import { passLocalStorage } from "../passLocalStorage";

export const useAuthUser = () => {
  const { state, setState } = useSubscription(infoUserSubscription, [
    "infoUser",
    "accessToken",
    "refreshToken",
  ]);

  const login = (payload) => {
    setState({
      ...state,
      ...payload,
    });

    passLocalStorage?.setItem(KEY_INFO_USER, payload);
  };

  const logout = () => {
    setState(initInfoUser);
    passLocalStorage?.removeItem(KEY_INFO_USER);
  };

  const { infoUser = {}, accessToken = {}, refreshToken = {} } = state;

  return { login, logout, infoUser, accessToken, refreshToken };
};
