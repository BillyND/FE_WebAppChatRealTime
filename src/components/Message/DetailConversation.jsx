import { SpinnerLoading } from "@UI//SpinnerLoading";
import { UserThumbnail } from "@UI//UserThumbnail";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMessages } from "../../services/api";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { showPopupError } from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";

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

  const [message, setMessage] = useState("");
  const trimMessage = message.trim();
  const isDisableButtonSend = !trimMessage || fetchingMessage;

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

  const handleSendMessage = async () => {};

  if (!receiver) {
    return (
      <Flex align="center" justify="center" style={{ color: "gray" }}>
        Please select a conversation!
      </Flex>
    );
  }

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

        <Flex className="px-3  pt-2 pb-3 mt-1" gap={12} align="center">
          <PlusCircleOutlined className="icon-show-more-option" />

          <textarea
            maxLength={8000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            placeholder="Type a message..."
            className={`input-comment ${
              message.length > 100 ? "full" : "mini"
            }`}
            style={{
              minWidth: `calc(100% - 110px)`,
            }}
          />

          <div className={`${isDisableButtonSend ? "" : "press-active"}`}>
            <ButtonSend
              onClick={handleSendMessage}
              disabled={isDisableButtonSend}
            />
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DetailConversation;
