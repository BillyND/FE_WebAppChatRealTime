import { DownCircleOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex, Tooltip, Upload } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { IconImage } from "../../assets/icons/icon";
import { TIME_DELAY_SEARCH_INPUT, boxMessageId } from "../../utils/constant";
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
import asyncWait from "@utils/asyncWait";
import { readFileAsDataURL, resizeImage } from "@utils/handleImages";

function ConversationFooter({ handleSendMessage }) {
  const [canBackFirstMessage, setBackFirstMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imgList, setImgList] = useState([]);

  const refInput = useRef(null);
  const refBtnUpImage = useRef(null);
  const isDisablePickImg = fileList.length >= 10;
  const isDisableButtonSend =
    !message?.trim() && !fileList.length && imgList.length !== fileList.length;

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

  useEffect(() => {
    handleResizeImage(fileList);
  }, [fileList.length]);

  const handleResizeImage = debounce(async (imgList) => {
    const imgExtracted = [];

    for (const img of imgList) {
      const resizedFile = await resizeImage(img?.originFileObj);
      const dataURL = await readFileAsDataURL(resizedFile);
      imgExtracted.push(dataURL);
    }

    setImgList(imgExtracted);
  }, TIME_DELAY_SEARCH_INPUT);

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

  const handleSendLocalMessage = async () => {
    if (isDisableButtonSend) return;

    let tempMessage = message;

    const sendTempMessage = async (msg, img) => {
      handleSendMessage(msg, img);
      setFileList([]);
      await asyncWait(300);
    };

    for (const img of imgList) {
      await sendTempMessage(tempMessage, img);
      tempMessage = ""; // Clear tempMessage after sending the first message with an image
      setMessage(tempMessage);
    }

    if (!fileList.length) {
      handleSendMessage(tempMessage);
      tempMessage = ""; // Clear tempMessage after sending the final message
      setMessage(tempMessage);
    }
  };

  const handleChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleOpenPickImg = () => {
    if (refBtnUpImage.current && !isDisablePickImg) {
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
        maxCount={10}
        method="get"
        className={`${fileList.length > 0 ? "has-file" : ""}`}
        multiple
        accept="image/*"
        listType="picture"
        fileList={fileList}
        onPreview={() => {}}
        onChange={handleChange}
      >
        <span className="btn-up-img-message" ref={refBtnUpImage}></span>
      </Upload>

      <Flex className={`px-3 pt-2 pb-3 mt-1 `} gap={12} align="center">
        <Flex className="mx-1" align="center" justify="center">
          <Tooltip
            title={isDisablePickImg ? "The photo limit has been reached." : ""}
          >
            <IconImage
              className={`press-active ${
                isDisablePickImg ? "disable-pick-img" : ""
              }`}
              onClick={handleOpenPickImg}
            />
          </Tooltip>
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
