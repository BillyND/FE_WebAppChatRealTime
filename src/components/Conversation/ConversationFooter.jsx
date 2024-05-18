import { DownCircleOutlined } from "@ant-design/icons";
import asyncWait from "@utils/asyncWait";
import { resizeImage } from "@utils/handleImages";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex, Tooltip, Upload } from "antd";
import { useSubscription } from "global-state-hook";
import { useEffect, useRef, useState } from "react";
import { IconImage } from "../../assets/icons/icon";
import { MAX_IMG_PICK, boxMessageId } from "../../utils/constant";
import {
  dataImageMessage,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import {
  debounce,
  getCurrentReceiverId,
  preventKeydown,
  scrollToTopOfElement,
  uploadFile,
} from "../../utils/utilities";
import { ButtonSend } from "../Post/ModalCommentPost";

function ConversationFooter({ handleSendMessage }) {
  const { state } = useSubscription(dataImageMessage, [
    "fileList",
    "imgList",
    "uploading",
  ]);

  const { fileList, imgList, uploading } = state || {};
  const [canBackFirstMessage, setBackFirstMessage] = useState(false);
  const [message, setMessage] = useState("");

  const refInput = useRef(null);
  const refBtnUpImage = useRef(null);
  const isDisablePickImg = fileList.length >= MAX_IMG_PICK;

  const isDisableButtonSend =
    (!message?.trim() && !fileList.length) ||
    imgList.length < fileList.length ||
    uploading;

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
    // handleResizeImage(fileList);
  }, [fileList.length]);

  // const handleResizeImage = debounce(async (imgList) => {
  //   const imgExtracted = [];

  //   for (const img of imgList) {
  //     const resizedFile = await resizeImage(img?.originFileObj);
  //     const dataURL = await readFileAsDataURL(resizedFile);
  //     imgExtracted.push(dataURL);
  //   }

  //   setImgList(imgExtracted);
  // }, TIME_DELAY_SEARCH_INPUT);

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
      dataImageMessage.updateState({ fileList: [] });
      await asyncWait(200);
    };

    for (const img of imgList) {
      await sendTempMessage(tempMessage, img);
      tempMessage = "";
    }

    if (!fileList.length) {
      handleSendMessage(tempMessage);
      tempMessage = "";
    }

    setMessage(tempMessage);
    dataImageMessage.updateState({ imgList: [], fileList: [] });
  };

  const handleChange = async ({ fileList }) => {
    dataImageMessage.updateState({ fileList });
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
        maxCount={MAX_IMG_PICK}
        customRequest={async (e) => {
          const { file, onSuccess, onError } = e || {};
          dataImageMessage.updateState({ uploading: true });
          const resizedFile = await resizeImage(file);
          const resUpload = await uploadFile(resizedFile);

          if (resUpload?.url) {
            dataImageMessage.updateState({
              imgList:
                dataImageMessage.state.imgList.length < MAX_IMG_PICK
                  ? [resUpload, ...dataImageMessage.state.imgList]
                  : dataImageMessage.state.imgList,
            });

            onSuccess("Ok");
            dataImageMessage.updateState({ uploading: false });

            return;
          }

          onError("Ok");
        }}
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
