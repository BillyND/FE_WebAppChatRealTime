import React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ButtonSend } from "../Post/ModalCommentPost";
import { Flex } from "antd";
import { preventKeydown } from "../../utils/utilities";

function ConversationFooter({
  message,
  setMessage,
  isDisableButtonSend,
  handleSendMessage,
}) {
  return (
    <Flex className="footer-conversation" justify="start" vertical>
      <hr className="gray width-100-per" />

      <Flex className="px-3  pt-2 pb-3 mt-1" gap={12} align="center">
        <PlusCircleOutlined className="icon-show-more-option" />

        <textarea
          maxLength={8000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => preventKeydown(e, "Enter", handleSendMessage)}
          rows={1}
          placeholder="Type a message..."
          className={`input-comment ${message.length > 100 ? "full" : "mini"}`}
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
  );
}

export default ConversationFooter;
