import { useSubscription } from "global-state-hook";
import {
  KEY_INFO_USER,
  TIME_DEBOUNCE_INPUT_LOGIN_REGISTER,
  TIME_DELAY_FETCH_API,
  TIME_DELAY_SEARCH_INPUT,
  initInfoUser,
} from "../constant";
import { infoUserSubscription } from "../globalStates/initGlobalState";
import { passLocalStorage } from "../passLocalStorage";
import { useCallback } from "react";
import { debounce } from "lodash";

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

    passLocalStorage?.setItem(KEY_INFO_USER, {
      ...state,
      ...payload,
    });
  };

  const logout = () => {
    setState({
      infoUser: {},
    });
    passLocalStorage?.removeItem(KEY_INFO_USER);
  };

  const { infoUser = {}, accessToken = {}, refreshToken = {} } = state;

  return { login, logout, infoUser, accessToken, refreshToken };
};
