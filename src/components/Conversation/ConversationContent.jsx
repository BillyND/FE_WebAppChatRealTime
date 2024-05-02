import { UserThumbnail } from "@UI/UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import MessageList from "../Message/MessageList";
import { boxMessageId } from "../../utils/constant";

const ConversationContent = ({ avaUrl, username, email }) => {
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const { state } = useSubscription(conversationSubs, ["listMessages"]);
  let { listMessages } = state || {};

  const navigate = useNavigateCustom();

  return (
    <div className="content-conversation">
      <Flex vertical id={boxMessageId} gap={50}>
        <Flex
          vertical
          align="center"
          justify="center"
          gap={12}
          className="pt-5"
        >
          <UserThumbnail avaUrl={avaUrl} size={70} />

          <Flex vertical gap={4} align="center" justify="center">
            <b>{username}</b>
            <span className="user-email">{email}</span>
          </Flex>

          <div
            onClick={() => {
              navigate(`/user?email=${email}`);
            }}
            className="btn-view-profile press-active"
          >
            View profile
          </div>
        </Flex>

        <MessageList listMessages={listMessages} userId={userId} />
      </Flex>
    </div>
  );
};

export default ConversationContent;
