import { PlusCircleOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useRef, useState } from "react";
import { socketIoSubs } from "../../utils/globalStates/initGlobalState";
import {
  debounce,
  getCurrentReceiverId,
  preventKeydown,
} from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";
import { useAuthUser } from "@utils/hooks/useAuthUser";

function ConversationFooter({ handleSendMessage }) {
  const [message, setMessage] = useState("");
  const isDisableButtonSend = !message?.trim();
  const refInput = useRef(null);

  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs, ["socketIo"]);

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
      start: false,
    });
  };

  return (
    <Flex className="footer-conversation" justify="start" vertical>
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
