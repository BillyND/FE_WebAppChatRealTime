import { useEffect, useState } from "react";
import { TIME_DELAY_SEARCH_INPUT } from "../../utils/constant";
import { useDebounce } from "./useDebounce";

export function useScrollToBottom(scrollContainerRef) {
  const [isBottom, setIsBottom] = useState(false);
  const debounceIsBottom = useDebounce(isBottom, TIME_DELAY_SEARCH_INPUT / 4);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        scrollContainerRef.current;
      if (scrollTop + clientHeight + 10 >= scrollHeight) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
        setIsBottom(false);
      }
    };
  }, []);

  return { isBottom: debounceIsBottom };
}
