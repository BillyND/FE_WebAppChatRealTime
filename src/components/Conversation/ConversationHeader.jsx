import { UserThumbnail } from "@UI/UserThumbnail";
import { LeftOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React from "react";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";

function ConversationHeader({ username, avaUrl, email }) {
  const navigate = useNavigateCustom();
  const { isMobile } = useWindowSize();
  const { infoUser } = useAuthUser();

  const { _id: userId } = infoUser;
  const { state } = useSubscription(conversationSubs, ["listConversation"]);
  const { listConversation } = state || {};

  const conversationsUnread = listConversation.filter(
    (conversation) => !conversation?.usersRead?.includes(userId)
  )?.length;

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
          <div>
            <div
              className={`icon-un-read ${conversationsUnread ? "show" : ""}`}
            >
              {conversationsUnread}
            </div>
            <Flex
              onClick={backToScreenListConversation}
              align="center"
              justify="center"
              className="icon-back-conversation press-active"
            >
              <LeftOutlined />
            </Flex>
          </div>
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
