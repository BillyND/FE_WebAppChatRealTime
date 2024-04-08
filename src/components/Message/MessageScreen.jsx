import { useStyleApp } from "@utils/hooks/useStyleApp";
import React from "react";
import { TYPE_STYLE_APP } from "../../utils/constant";
import DetailConversation from "./DetailConversation";
import ListConversations from "./ListConversations";
import { WrapMessageScreen } from "./StyledMessageScreen";
import { useWindowSize } from "@utils/hooks/useWindowSize";

function MessageScreen() {
  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;
  const { isMobile } = useWindowSize();

  return (
    <WrapMessageScreen isDark={isDark} isMobile={isMobile}>
      <ListConversations />
      <DetailConversation />
    </WrapMessageScreen>
  );
}

export default MessageScreen;
