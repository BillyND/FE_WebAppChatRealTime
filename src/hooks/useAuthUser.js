import { createSubscription, useSubscription } from "global-state-hook";

const infoUserSubscription = createSubscription({});

export const useAuthUser = () => {
  const { state, setState } = useSubscription(infoUserSubscription);

  const login = (payload) => {
    setState({
      ...state,
      ...payload,
    });
  };

  const logout = () => {
    setState({});
  };

  const infoUser = state;

  return { login, logout, infoUser };
};
