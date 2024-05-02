import { useSubscription } from "global-state-hook";
import { useEffect } from "react";
import {
  KEY_STYLE_APP,
  TYPE_STYLE_APP,
  styleDark,
  styleLight,
} from "../constant";
import { styleAppSubscription } from "../globalStates/initGlobalState";
import { passLocalStorage } from "../passLocalStorage";
import { isChanged } from "../utilities";

export const useStyleApp = () => {
  const { state, setState } = useSubscription(styleAppSubscription, ["type"]);

  useEffect(() => {
    const styleFromLocalStorage = passLocalStorage.getItem(KEY_STYLE_APP);

    if (isChanged([styleFromLocalStorage, state.type])) {
      updateStyleApp(styleFromLocalStorage || TYPE_STYLE_APP.DARK);
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
