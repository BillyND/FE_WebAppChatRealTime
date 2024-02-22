import React from "react";
import { WrapMessageScreen } from "./StyledMessageScreen";
import ListConversations from "./ListConversations";
import DetailConversation from "./DetailConversation";

function MessageScreen(props) {
  return (
    <WrapMessageScreen>
      <ListConversations />
      <DetailConversation />
    </WrapMessageScreen>
  );
}

export default MessageScreen;
