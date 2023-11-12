import { createSubscription, useSubscription } from "global-state-hook";
import { KEY_INFO_USER, initInfoUser } from "../utils/constant";
import { infoUserSubscription } from "../utils/initGlobalState";

export const useAuthUser = () => {
  const { state, setState } = useSubscription(infoUserSubscription);

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

  const infoUser = state;

  return { login, logout, infoUser };
};
