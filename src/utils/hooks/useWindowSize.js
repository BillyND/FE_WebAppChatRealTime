import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { TIME_DELAY_SEARCH_INPUT } from "../constant";
import { debounce } from "lodash";

export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isTablet: window.innerWidth < 960,
    isMobile: window.innerWidth < 700,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isTablet: window.innerWidth < 960,
        isMobile: window.innerWidth < 700,
      });
    }, TIME_DELAY_SEARCH_INPUT / 4);

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};
