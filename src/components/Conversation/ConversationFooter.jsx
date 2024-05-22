import { DownCircleOutlined } from "@ant-design/icons";
import { conversationSubs } from "@utils/globalStates/initGlobalState";
import { Flex } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  TIME_DELAY_SEARCH_INPUT,
  TYPE_STYLE_APP,
  boxMessageId,
} from "../../utils/constant";
import {
  debounce,
  isChanged,
  limitFetchMessage,
  scrollToTopOfElement,
} from "../../utils/utilities";
import { ButtonPickImage, ManualUploadImage } from "./ConversationUploadImg";
import InputMessage from "./InputMessage";
import { IconDown } from "@assets/icons/icon";
import { useStyleApp } from "@utils/hooks/useStyleApp";

function ButtonBackToFirstMessage({ boxMessageElement }) {
  const [canBackFirstMessage, setBackFirstMessage] = useState(false);
  const boxMessage = document.getElementById(boxMessageId);
  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;

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
      if (conversationSubs.state.listMessages.length > limitFetchMessage) {
        conversationSubs.updateState({
          listMessages: conversationSubs.state.listMessages.slice(
            0,
            limitFetchMessage
          ),
        });
      }
    }
  }, TIME_DELAY_SEARCH_INPUT);

  const handleScrollToFirstMessage = () => {
    scrollToTopOfElement(boxMessageId);
  };

  return (
    <IconDown
      onClick={handleScrollToFirstMessage}
      className={`icon-back-first-message border-image-dashed press-active ${
        isDark ? "is-dark" : ""
      }  ${canBackFirstMessage ? "show-back-first" : ""}`}
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
