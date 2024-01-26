import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";
import { TIME_DELAY_SEARCH_INPUT } from "../../utils/constant";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { useScrollToBottom } from "../../utils/hooks/useScrollBottom";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { handleGetListPost } from "../../utils/utilities";
import HomeContent from "./HomeContent";
import "./HomeScreen.scss";
import { WrapHomeScreen } from "./HomeStyled";
import PerfectScrollbar from "react-perfect-scrollbar";
import NavMenu from "./NavMenu";
import { useStyleApp } from "../../utils/hooks/useStyleApp";

export default function HomeScreen({ path }) {
  const { isMobile, isTablet } = useWindowSize();
  const { styleApp } = useStyleApp();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);
  const { setState } = useSubscription(listPostSubs, ["loading"]);

  useEffect(() => {
    isBottom && handleFetchNewPost();
  }, [isBottom]);

  const handleFetchNewPost = debounce(async () => {
    setState({
      loading: true,
    });
    const { next } = listPostSubs.state;
    next && (await handleGetListPost(next));
    setState({
      loading: false,
    });
  }, TIME_DELAY_SEARCH_INPUT);

  return (
    <WrapHomeScreen isMobile={isMobile} isTablet={isTablet} style={styleApp}>
      <PerfectScrollbar
        containerRef={(ref) => (scrollContainerRef.current = ref)}
        className={`home-container`}
      >
        <NavMenu />
        <HomeContent />
      </PerfectScrollbar>
    </WrapHomeScreen>
  );
}
