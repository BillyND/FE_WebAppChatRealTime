import { createSubscription, useSubscription } from "global-state-hook";

export const modalSubscription = createSubscription({});

export const useModal = () => {
  const { state, setState } = useSubscription(modalSubscription);

  const openModal = (key = "", condition) => {
    if (condition) {
      setState({
        ...state,
        [key]: {
          visible: true,
          condition,
        },
      });

      return;
    }

    if (key) {
      setState({
        ...state,
        [key]: true,
      });
    }
    // document.documentElement.style.setProperty("overflow", "hidden");
  };

  const closeModal = (key = "", condition) => {
    if (condition) {
      setState({
        ...state,
        [key]: {
          visible: false,
          condition: "null",
        },
      });
      return;
    }

    if (key) {
      setState({
        ...state,
        [key]: false,
      });
    }
    // document.documentElement.style.removeProperty("overflow");
  };

  return { state, openModal, closeModal };
};
