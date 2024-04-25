import { SpinnerLoading } from "@UI//SpinnerLoading";
import { UserThumbnail } from "@UI//UserThumbnail";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { scrollToBottomOfElement } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createConversation,
  createMessage,
  getConversationByReceiver,
} from "../../services/api";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { showPopupError } from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";

function DetailConversation() {
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const navigate = useNavigate();
  const [fetchingMessage, setFetchingMessage] = useState(false);
  const { state, setState } = useSubscription(conversationSubs);
  let { receiver, listMessages, conversationId } = state || {};
  const { username, email, avaUrl } = receiver || {};

  const [message, setMessage] = useState("");
  const trimMessage = message.trim();
  const isDisableButtonSend = !trimMessage || fetchingMessage;
  const [receiverId] = useSearchParams(["receiverId"]);
  const boxMessageId = "box-list-message";
  let containerMessage = null;

  useEffect(() => {
    handleGetMessage();
  }, [receiverId]);

  const handleGetMessage = async () => {
    if (!receiverId) {
      setState({
        receiver: null,
      });
      return;
    }

    setFetchingMessage(true);

    try {
      const resConversation = await getConversationByReceiver(receiverId);
      const { receiver, listMessages, conversationId } = resConversation || {};

      setState({
        receiver,
        listMessages,
        conversationId,
      });
    } catch (error) {
      showPopupError(error);
    } finally {
      setFetchingMessage(false);
      scrollToBottomOfElement(boxMessageId);
    }
  };

  const handleSendMessage = async () => {
    if (!conversationId) {
      const conversation = await createConversation(receiverId);

      if (conversation?._id) {
        conversationId = conversation?._id;
      } else {
        return;
      }
    }

    const optionSend = {
      conversationId,
      text: message,
    };

    const resSendMessage = await createMessage(optionSend);
  };

  if (listMessages?.length) {
    containerMessage = (
      <Flex vertical gap={4}>
        {listMessages.map((message) => {
          let { _id, text, sender } = message || {};
          text = text.replaceAll("\n", "<br/>");
          const isSender = sender === userId;

          return (
            <Flex
              className="mx-2 px-1"
              justify={isSender ? "end" : "start"}
              key={_id}
            >
              <div
                className={`${isSender ? "sender" : ""} wrap-message`}
                dangerouslySetInnerHTML={{ __html: text }}
              ></div>
            </Flex>
          );
        })}
      </Flex>
    );
  }

  let containerConversation = (
    <Flex vertical id={boxMessageId} gap={50}>
      <Flex vertical align="center" justify="center" gap={12} className="pt-5">
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

      {containerMessage}
    </Flex>
  );

  if (fetchingMessage) {
    return (
      <Flex align="center" justify="center" style={{ color: "gray" }}>
        <SpinnerLoading />
      </Flex>
    );
  }

  if (isEmpty(receiver) && !fetchingMessage) {
    return (
      <Flex align="center" justify="center" style={{ color: "gray" }}>
        Please select a conversation!
      </Flex>
    );
  }

  return (
    <Flex vertical className="wrap-detail-conversation">
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

      <div className="content-conversation">{containerConversation}</div>

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
