import { DownCircleOutlined } from "@ant-design/icons";
import { conversationSubs } from "@utils/globalStates/initGlobalState";
import { Flex } from "antd";
import { useEffect, useRef, useState } from "react";
import { boxMessageId } from "../../utils/constant";
import { limitFetchMessage, scrollToTopOfElement } from "../../utils/utilities";
import { ButtonPickImage, ManualUploadImage } from "./ConversationUploadImg";
import InputMessage from "./InputMessage";

function ButtonBackToFirstMessage() {
  const [canBackFirstMessage, setBackFirstMessage] = useState(false);
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

    conversationSubs.updateState({
      listMessages: conversationSubs.state.listMessages.slice(
        0,
        limitFetchMessage
      ),
    });
  };

  return (
    <DownCircleOutlined
      onClick={handleScrollToFirstMessage}
      className={`icon-back-first-message press-active ${
        canBackFirstMessage ? "show-back-first" : ""
      }`}
    />
  );
}

function ConversationFooter({ handleSendMessage }) {
  const refBtnUpImage = useRef(null);

  return (
    <Flex className="footer-conversation" justify="start" vertical>
      <ButtonBackToFirstMessage />
      <hr className="gray width-100-per" />
      <ManualUploadImage refBtnUpImage={refBtnUpImage} />

      <Flex className={`px-3 pt-2 pb-3 mt-1 `} gap={12} align="center">
        <ButtonPickImage refBtnUpImage={refBtnUpImage} />
        <InputMessage handleSendMessage={handleSendMessage} />
      </Flex>
    </Flex>
  );
}

export default ConversationFooter;
