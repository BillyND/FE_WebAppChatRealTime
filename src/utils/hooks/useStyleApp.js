import { useSubscription } from "global-state-hook";
import { useEffect } from "react";
import { KEY_STYLE_APP, TYPE_STYLE_APP } from "../constant";
import { styleAppSubscription } from "../globalStates/initGlobalState";
import { passLocalStorage } from "../passLocalStorage";

export const styleDark = {
  backgroundColor: "#101010",
  color: "#f3f5f7",
  subColor: "#99999A",
  type: TYPE_STYLE_APP.DARK,
};

export const styleLight = {
  backgroundColor: "#FFFFFF",
  color: "#000000",
  subColor: "#99999A",
  type: TYPE_STYLE_APP.LIGHT,
};

export const useStyleApp = () => {
  const { state, setState } = useSubscription(styleAppSubscription);

  useEffect(() => {
    const styleFromLocalStorage = passLocalStorage.getItem(KEY_STYLE_APP);

    if (styleFromLocalStorage) {
      updateStyleApp(styleFromLocalStorage);
    }
  }, []);

  const updateStyleApp = (type) => {
    switch (type) {
      case TYPE_STYLE_APP.DARK: {
        setState(styleDark);
        break;
      }
      case TYPE_STYLE_APP.LIGHT: {
        setState(styleLight);
        break;
      }

      default: {
        setState(styleDark);
        break;
      }
    }

    passLocalStorage.setItem(KEY_STYLE_APP, type);
  };

  return { styleApp: state || {}, updateStyleApp };
};
