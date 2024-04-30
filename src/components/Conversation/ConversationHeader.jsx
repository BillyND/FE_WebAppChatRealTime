import React from "react";
import { UserThumbnail } from "@UI/UserThumbnail";
import { Flex } from "antd";

function ConversationHeader({ username, avaUrl }) {
  return (
    <Flex vertical>
      <Flex
        gap={10}
        className="header-conversation pt-3 pb-2 px-3"
        align="center"
        justify="start"
      >
        <UserThumbnail avaUrl={avaUrl} size={35} />
        <b>{username}</b>
      </Flex>
      <hr className="width-100-per gray" />
    </Flex>
  );
}

export default ConversationHeader;
