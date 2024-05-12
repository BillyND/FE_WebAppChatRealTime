import { DownCircleOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex, Upload } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { IconImage } from "../../assets/icons/icon";
import { boxMessageId } from "../../utils/constant";
import {
  previewImageFullScreenSubs,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import {
  debounce,
  getCurrentReceiverId,
  preventKeydown,
  scrollToTopOfElement,
} from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";
import Dragger from "antd/es/upload/Dragger";

function ConversationFooter({ handleSendMessage }) {
  const [canBackFirstMessage, setBackFirstMessage] = useState(false);
  const [message, setMessage] = useState("");
  const isDisableButtonSend = !message?.trim();
  const [fileList, setFileList] = useState([]);

  const refInput = useRef(null);
  const refImage = useRef(null);
  const refBtnUpImage = useRef(null);

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
      message ? 3000 : 500
    )();
  };

  const handleSendLocalMessage = () => {
    if (isDisableButtonSend) {
      return;
    }

    handleSendMessage(message);
    setMessage("");
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleOpenPickImg = () => {
    if (refBtnUpImage.current) {
      refBtnUpImage.current.click();
    }
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

      <Upload
        method="get"
        className={`${fileList.length > 0 ? "has-file" : ""}`}
        multiple
        accept="image/*"
        listType="picture"
        fileList={fileList}
        onPreview={(e) => {
          previewImageFullScreenSubs.updateState({ imgSrc: e?.thumbUrl });
        }}
        onChange={handleChange}
      >
        <span className="btn-up-img-message" ref={refBtnUpImage}></span>
      </Upload>

      <Flex className={`px-3 pt-2 pb-3 mt-1 `} gap={12} align="center">
        <Flex className="mx-1" align="center" justify="center">
          <IconImage className="press-active" onClick={handleOpenPickImg} />
        </Flex>

        <textarea
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          autoSave="off"
          aria-autocomplete="none"
          ref={refInput}
          maxLength={16000}
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
