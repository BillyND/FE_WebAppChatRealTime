import { useSubscription } from "global-state-hook";
import { useEffect } from "react";
import { KEY_STYLE_APP, TYPE_STYLE_APP } from "../constant";
import { styleAppSubscription } from "../globalStates/initGlobalState";
import { passLocalStorage } from "../passLocalStorage";
import { compareChange } from "../utilities";

export const styleDark = {
  backgroundModalColor: "#181818",
  backgroundColor: "#101010",
  color: "#f3f5f7",
  subColor: "#99999A",
  type: TYPE_STYLE_APP.DARK,
  STROKE_COLOR_ICON: {
    ACTIVE: "#fff",
    DE_ACTIVE: "#4D4D4D",
  },
  FILL_COLOR_ICON: {
    ACTIVE: "#fff",
    DE_ACTIVE: "#00000000",
  },
  navMenuStyle: {
    backgroundColor: "#101010fa",
    color: "#f3f5f7",
  },
  popoverSettings: {
    backgroundColor: "#181818",
    color: "#f3f5f7",
  },
};

export const styleLight = {
  backgroundModalColor: "#fff",
  backgroundColor: "#FFFFFF",
  color: "#000000",
  subColor: "#99999A",
  type: TYPE_STYLE_APP.LIGHT,
  STROKE_COLOR_ICON: {
    ACTIVE: "black",
    DE_ACTIVE: "#B8B8B8",
  },
  FILL_COLOR_ICON: {
    ACTIVE: "black",
    DE_ACTIVE: "#00000000",
  },
  navMenuStyle: {
    backgroundColor: "#fff",
    color: "#000000",
  },
  popoverSettings: {
    backgroundColor: "#fff",
    color: "black",
  },
};

export const useStyleApp = () => {
  const { state, setState } = useSubscription(styleAppSubscription, ["type"]);

  useEffect(() => {
    const styleFromLocalStorage = passLocalStorage.getItem(KEY_STYLE_APP);

    if (compareChange([styleFromLocalStorage, state.type])) {
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
