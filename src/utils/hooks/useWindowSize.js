import { createSubscription, useSubscription } from "global-state-hook";
import { useEffect } from "react";
import { TIME_DELAY_SEARCH_INPUT } from "../constant";
import { debounce } from "../utilities";

const windowSizeSubs = createSubscription({
  width: window.innerWidth,
  height: window.innerHeight,
  isTablet: window.innerWidth < 960,
  isMobile: window.innerWidth < 700,
});

export const useWindowSize = () => {
  const { state, setState } = useSubscription(windowSizeSubs);

  useEffect(() => {
    const handleResize = debounce(() => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
        isTablet: window.innerWidth < 960,
        isMobile: window.innerWidth < 700,
      });
    }, TIME_DELAY_SEARCH_INPUT);

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return state;
};
