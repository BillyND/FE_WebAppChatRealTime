import { DownCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { boxMessageId } from "../../utils/constant";
import { socketIoSubs } from "../../utils/globalStates/initGlobalState";
import {
  debounce,
  getCurrentReceiverId,
  preventKeydown,
  scrollToTopOfElement,
} from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";

function ConversationFooter({ handleSendMessage }) {
  const [canBackFirstMessage, setBackFirstMessage] = useState(false);
  const [message, setMessage] = useState("");
  const isDisableButtonSend = !message?.trim();
  const refInput = useRef(null);

  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs, ["socketIo"]);
  const boxMessage = document.getElementById(boxMessageId);

  useEffect(() => {
    boxMessage?.addEventListener("scroll", handleScrollBoxMessage);

    return () => {
      boxMessage?.removeEventListener("scroll", handleScrollBoxMessage);
    };
  }, [boxMessage]);

  const handleScrollBoxMessage = () => {
    setBackFirstMessage(Math.abs(boxMessage?.scrollTop) > 100);
  };

  const handleScrollToFirstMessage = () => {
    scrollToTopOfElement(boxMessageId);
  };

  const handleChangeMessage = (message) => {
    setMessage(message);

    socketIo?.emit("userTyping", {
      receiverId: getCurrentReceiverId(),
      userId,
      start: true,
    });

    debounce(
      () => {
        socketIo?.emit("userTyping", {
          receiverId: getCurrentReceiverId(),
          userId,
          start: false,
        });
      },
      message ? 3000 : 0
    )();
  };

  const handleSendLocalMessage = () => {
    if (isDisableButtonSend) {
      return;
    }

    handleSendMessage(message);
    setMessage("");

    socketIo?.emit("userTyping", {
      receiverId: getCurrentReceiverId(),
      userId,
      start: false,
    });
  };

  return (
    <Flex className="footer-conversation" justify="start" vertical>
      <DownCircleOutlined
        onClick={handleScrollToFirstMessage}
        className={`icon-back-first-message press-active ${
          canBackFirstMessage ? "show-back-first" : ""
        }`}
      />

      <hr className="gray width-100-per" />

      <Flex className={`px-3 pt-2 pb-3 mt-1 `} gap={12} align="center">
        <PlusCircleOutlined className="icon-show-more-option" />

        <textarea
          ref={refInput}
          maxLength={8000}
          value={message}
          onChange={(e) => handleChangeMessage(e.target.value)}
          onKeyDown={(e) => preventKeydown(e, "Enter", handleSendLocalMessage)}
          rows={1}
          placeholder="Type a message..."
          className={`input-comment ${message.length > 100 ? "full" : "mini"}`}
          style={{
            minWidth: `calc(100% - 110px)`,
          }}
        />

        <div className={`${isDisableButtonSend ? "" : "press-active"}`}>
          <ButtonSend
            onClick={handleSendLocalMessage}
            disabled={isDisableButtonSend}
          />
        </div>
      </Flex>
    </Flex>
  );
}

export default ConversationFooter;
