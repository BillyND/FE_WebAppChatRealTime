import { UserThumbnail } from "@UI/UserThumbnail";
import { LeftOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React from "react";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";

function ConversationHeader({ username, avaUrl, email, receiverIdChat }) {
  const navigate = useNavigateCustom();
  const { isMobile } = useWindowSize();
  const { infoUser } = useAuthUser();

  // Destructure infoUser to get userId
  const { _id: userId } = infoUser;

  // Subscribe to conversation updates
  const { state } = useSubscription(conversationSubs, [
    "listConversations",
    "usersOnline",
  ]);

  const { listConversations, usersOnline } = state || {};

  const isOnline = usersOnline?.[receiverIdChat];

  // Calculate unread conversations
  const conversationsUnread = listConversations.filter(
    (conversation) => !conversation?.usersRead?.includes(userId)
  )?.length;

  // Function to navigate to user profile
  const goToProfileUser = () => {
    navigate(`/user?email=${email}`);
  };

  // Function to navigate back to conversation list
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
            {/* Render unread count if conversationsUnread > 0 */}

            <Flex
              onClick={backToScreenListConversation}
              align="center"
              justify="center"
              className="icon-back-conversation press-active"
            >
              <div
                className={`icon-un-read ${conversationsUnread ? "show" : ""}`}
              >
                {conversationsUnread}
              </div>
              <LeftOutlined />
            </Flex>
          </div>
        )}

        <div
          className="ava-user-conversation cursor-pointer"
          onClick={goToProfileUser}
        >
          <UserThumbnail avaUrl={avaUrl} size={35} />
          {isOnline && <span className="icon-online"></span>}
        </div>

        {/* Render username as a clickable link */}
        <Flex vertical>
          <b className="cursor-pointer" onClick={goToProfileUser}>
            {username}
          </b>
          {isOnline && <span className="user-active-state">Active now</span>}
        </Flex>
      </Flex>
      <hr className="width-100-per gray" />
    </Flex>
  );
}

export default ConversationHeader;
