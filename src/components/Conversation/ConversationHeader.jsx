import { UserThumbnail } from "@UI/UserThumbnail";
import { LeftOutlined } from "@ant-design/icons";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import React from "react";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";

function ConversationHeader({ username, avaUrl, email }) {
  const navigate = useNavigateCustom();
  const { isMobile } = useWindowSize();

  const goToProfileUser = () => {
    navigate(`/user?email=${email}`);
  };

  const backToScreenListConversation = () => {
    navigate(`/message`);
  };

  return (
    <Flex vertical>
      <Flex
        gap={10}
        className="header-conversation pt-3 pb-2 px-3"
        align="center"
        justify="start"
      >
        {isMobile && (
          <Flex
            onClick={backToScreenListConversation}
            align="center"
            justify="center"
            className="icon-back-conversation press-active"
          >
            <LeftOutlined />
          </Flex>
        )}

        <div className="cursor-pointer" onClick={goToProfileUser}>
          <UserThumbnail avaUrl={avaUrl} size={35} />
        </div>

        <b className="cursor-pointer" onClick={goToProfileUser}>
          {username}
        </b>
      </Flex>
      <hr className="width-100-per gray" />
    </Flex>
  );
}

export default ConversationHeader;
