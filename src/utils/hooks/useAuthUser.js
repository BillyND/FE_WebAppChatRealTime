import { useSubscription } from "global-state-hook";
import { KEY_INFO_USER, initInfoUser } from "../constant";
import { infoUserSubscription } from "../globalStates/initGlobalState";

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

    localStorage?.setItem(KEY_INFO_USER, JSON.stringify(payload));
  };

  const logout = () => {
    setState(initInfoUser);
    localStorage?.removeItem(KEY_INFO_USER);
  };

  const { infoUser = {}, accessToken = {}, refreshToken = {} } = state;

  return { login, logout, infoUser, accessToken, refreshToken };
};
