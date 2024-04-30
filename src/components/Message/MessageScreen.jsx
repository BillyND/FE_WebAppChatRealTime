import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import React from "react";
import { TYPE_STYLE_APP } from "../../utils/constant";
import ConversationBox from "../Conversation/ConversationBox";
import ListConversations from "../Conversation/ListConversations";
import { WrapMessageScreen } from "../Conversation/StyledMessageScreen";

function MessageScreen() {
  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;
  const { isMobile } = useWindowSize();

  return (
    <WrapMessageScreen isDark={isDark} isMobile={isMobile}>
      <ListConversations />
      <ConversationBox />
    </WrapMessageScreen>
  );
}

export default MessageScreen;
