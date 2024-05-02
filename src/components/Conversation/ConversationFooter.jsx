import { PlusCircleOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import React, { useRef, useState } from "react";
import { preventKeydown } from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";

function ConversationFooter({ handleSendMessage }) {
  const [message, setMessage] = useState("");
  const isDisableButtonSend = !message?.trim();
  const refInput = useRef(null);

  const handleSendLocalMessage = () => {
    if (isDisableButtonSend) {
      return;
    }
    refInput.current.value = "22";

    handleSendMessage(message);
    setMessage("");

    console.log("===>refInput.current:", refInput.current.value);
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
          onChange={(e) => setMessage(e.target.value)}
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
