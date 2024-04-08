import { UserThumbnail } from "@UI//UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useState } from "react";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { SpinnerLoading } from "@UI//SpinnerLoading";
import { useNavigate } from "react-router-dom";
import { getMessages } from "../../services/api";
import { showPopupError } from "../../utils/utilities";
import { useWindowSize } from "@utils/hooks/useWindowSize";

function DetailConversation() {
  const {
    infoUser: { _id: currentIdUser },
  } = useAuthUser();

  const { isMobile, isTablet } = useWindowSize();

  const navigate = useNavigate();
  const [fetchingMessage, setFetchingMessage] = useState(false);
  const { state, setState } = useSubscription(conversationSubs);
  const { selectedConversation, dataMessage } = state || {};

  const { _id: conversationId, user1, user2 } = selectedConversation || {};
  const receiver = currentIdUser === user1?.userId ? user2 : user1;
  const { username, email, avaUrl } = receiver || {};

  console.log("===>isTablet:", isTablet);
  console.log("===>isMobile:", isMobile);

  let containerConversation = (
    <Flex vertical align="center" justify="center" gap={12}>
      <UserThumbnail avaUrl={avaUrl} size={70} />

      <Flex vertical gap={4} align="center" justify="center">
        <b>{username}</b>
        <span className="user-email">{email}</span>
      </Flex>

      <button
        onClick={() => {
          navigate(`/user?email=${email}`);
        }}
        className="btn-view-profile press-active"
      >
        View profile
      </button>
    </Flex>
  );

  if (fetchingMessage) {
    containerConversation = <SpinnerLoading />;
  }

  useEffect(() => {
    handleGetMessage();
  }, [email]);

  const handleGetMessage = async () => {
    if (!conversationId) {
      return;
    }

    setFetchingMessage(true);

    try {
      const resMessage = await getMessages(conversationId);

      if (resMessage.length) {
        setState({
          dataMessage: resMessage,
        });
      }
    } catch (error) {
      showPopupError(error);
    } finally {
      setFetchingMessage(false);
    }
  };

  return (
    <Flex vertical className="wrap-detail-conversation" gap={10}>
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

      <div className="content-conversation pt-4">{containerConversation}</div>
      <Flex className="footer-conversation" justify="start" vertical>
        <hr className="gray width-100-per" />
        <Flex className="px-4  pt-3 pb-4">
          <textarea className="width-100-per" />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DetailConversation;
