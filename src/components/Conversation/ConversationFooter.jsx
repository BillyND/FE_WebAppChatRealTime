import { DownCircleOutlined } from "@ant-design/icons";
import { conversationSubs } from "@utils/globalStates/initGlobalState";
import { Flex } from "antd";
import { useEffect, useRef, useState } from "react";
import { TIME_DELAY_SEARCH_INPUT, boxMessageId } from "../../utils/constant";
import {
  debounce,
  limitFetchMessage,
  scrollToTopOfElement,
} from "../../utils/utilities";
import { ButtonPickImage, ManualUploadImage } from "./ConversationUploadImg";
import InputMessage from "./InputMessage";

function ButtonBackToFirstMessage({ boxMessageElement }) {
  const [canBackFirstMessage, setBackFirstMessage] = useState(false);
  const boxMessage = document.getElementById(boxMessageId);

  useEffect(() => {
    boxMessageElement?.current?.addEventListener(
      "scroll",
      handleScrollBoxMessage
    );

    return () => {
      boxMessageElement.current?.removeEventListener(
        "scroll",
        handleScrollBoxMessage
      );
    };
  }, [boxMessage]);

  const handleScrollBoxMessage = debounce(() => {
    setBackFirstMessage(Math.abs(boxMessageElement.current?.scrollTop) > 100);

    if (boxMessageElement.current?.scrollTop === 0) {
      conversationSubs.updateState({
        listMessages: conversationSubs.state.listMessages.slice(
          0,
          limitFetchMessage
        ),
      });
    }
  }, TIME_DELAY_SEARCH_INPUT);

  const handleScrollToFirstMessage = () => {
    scrollToTopOfElement(boxMessageId);
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

function ConversationFooter({ handleSendMessage, boxMessageElement }) {
  const refBtnUpImage = useRef(null);

  return (
    <Flex className="footer-conversation" justify="start" vertical>
      <ButtonBackToFirstMessage boxMessageElement={boxMessageElement} />
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
