import asyncWait from "@utils/asyncWait";
import {
  dataImageMessage,
  socketIoSubs,
} from "@utils/globalStates/initGlobalState";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { getDataSearchParams, preventKeydown } from "@utils/utilities";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import { ButtonSend } from "../Post/ModalCommentPost";

function InputMessage({ handleSendMessage }) {
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const { state } = useSubscription(dataImageMessage, ["fileList", "imgList"]);
  const { fileList, imgList } = state || {};
  const refInput = useRef(null);
  const [message, setMessage] = useState("");

  const isDisableButtonSend =
    (!message?.trim() && !fileList.length) || imgList.length < fileList.length;

  const handleChangeMessage = (message) => {
    setMessage(message);

    socketIoSubs.state.socketIo?.emit("userTyping", {
      receiverId: getDataSearchParams("receiverId"),
      userId,
      start: true,
    });

    debounce(
      () => {
        socketIoSubs.state.socketIo?.emit("userTyping", {
          receiverId: getDataSearchParams("receiverId"),
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

  return (
    <>
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
    </>
  );
}

export default InputMessage;
