import { createSubscription, useSubscription } from "global-state-hook";

export const modalSubscription = createSubscription({});

export const useModal = () => {
  const { state, setState } = useSubscription(modalSubscription);

  const openModal = (key = "") => {
    if (key) {
      setState({ ...state, [key]: true });
    }
    document.documentElement.style.setProperty("overflow", "hidden");
  };

  const closeModal = (key = "") => {
    if (key) {
      setState({ ...state, [key]: false });
    }
    document.documentElement.style.removeProperty("overflow");
  };

  return { state, openModal, closeModal };
};
