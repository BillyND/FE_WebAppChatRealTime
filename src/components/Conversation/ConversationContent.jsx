import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { InboxOutlined } from "@ant-design/icons";
import asyncWait from "@utils/asyncWait";
import { resizeImage } from "@utils/handleImages";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { Flex } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useSubscription } from "global-state-hook";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { updateUsersReadConversation } from "../../services/api";
import {
  MAX_IMG_PICK,
  TIME_DELAY_FETCH_API,
  TIME_DELAY_SEARCH_INPUT,
  boxMessageId,
} from "../../utils/constant";
import {
  conversationSubs,
  dataImageMessage,
  infoUserSubscription,
  socketIoSubs,
} from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import {
  debounce,
  getCurrentReceiverId,
  isChanged,
  uploadFile,
} from "../../utils/utilities";
import MessageList from "../Message/MessageList";
import { handleGetMessage } from "./ConversationBox";

export const handleReadConversation = debounce(async () => {
  const { listMessages, conversationId } = conversationSubs.state || {};
  const { _id: userId } = infoUserSubscription.state.infoUser || {};
  const lastMessageId = listMessages[0]?._id;

  if (!conversationId || !lastMessageId) return;

  const newList = conversationSubs.state.listConversations.map((conversation) =>
    conversation._id === conversationId
      ? { ...conversation, usersRead: [userId] }
      : conversation
  );

  if (isChanged([conversationSubs.state.listConversations, newList])) {
    conversationSubs.updateState({ listConversations: newList });
  }

  socketIoSubs.state.socketIo?.emit("readMessage", {
    conversationId,
    messageRead: {
      [getCurrentReceiverId()]: lastMessageId,
      [userId]: lastMessageId,
    },
    receiverId: getCurrentReceiverId(),
  });

  debounce(() => {
    updateUsersReadConversation(conversationId, lastMessageId);
  }, TIME_DELAY_FETCH_API)();
}, TIME_DELAY_SEARCH_INPUT);

const ConversationContent = ({ avaUrl, username, email }) => {
  const { state: stateImageMessage } = useSubscription(dataImageMessage, [
    "fileList",
    "imgList",
    "uploading",
  ]);

  const { fileList } = stateImageMessage || {};
  const { state } = useSubscription(conversationSubs, ["listMessages", "next"]);
  let { listMessages, next } = state || {};

  const navigate = useNavigateCustom();
  const boxMessageElement = useRef(null);
  const [loadMore, setLoadMore] = useState(false);

  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  useEffect(() => {
    loadMore && setLoadMore(false);
    handleReadConversation();
  }, [listMessages]);

  const handleScrollToTop = () => {
    !loadMore && setLoadMore(true);
    next && handleGetMessage({ ...next, allowFetching: false });
  };

  const handlePreventDnd = (e, type) => {
    e.preventDefault();
    boxMessageElement.current?.classList.add("drag-image");
  };

  return (
    <div
      onDragEnter={handlePreventDnd}
      onDragLeave={handlePreventDnd}
      onDragOver={handlePreventDnd}
      onDrop={handlePreventDnd}
      onDragEnd={handlePreventDnd}
      className="content-conversation"
      id={boxMessageId}
      ref={boxMessageElement}
    >
      <div
        onMouseOut={async () => {
          await asyncWait(100);
          boxMessageElement.current?.classList.remove("drag-image");
        }}
        onMouseEnter={async () => {
          await asyncWait(100);
          boxMessageElement.current?.classList.remove("drag-image");
        }}
      >
        <Dragger
          accept="image/*"
          fileList={fileList}
          multiple
          maxCount={MAX_IMG_PICK}
          method="get"
          onChange={({ fileList }) => {
            dataImageMessage.updateState({ fileList });
            boxMessageElement.current?.classList.remove("drag-image");
          }}
          className="drop-image-message"
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
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
      </div>
      <InfiniteScroll
        dataLength={listMessages.length}
        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        inverse={true}
        next={handleScrollToTop}
        hasMore={true}
        loader={loadMore && next && <SpinnerLoading />}
        scrollableTarget={"box-list-message"}
      >
        <MessageList listMessages={listMessages} userId={userId} />
      </InfiniteScroll>
      {!next && (
        <Flex
          vertical
          align="center"
          justify="center"
          gap={12}
          className="pt-5"
        >
          <UserThumbnail avaUrl={avaUrl} size={70} />

          <Flex vertical gap={4} align="center" justify="center">
            <b>{username}</b>
            <span className="user-email">{email}</span>
          </Flex>

          <div
            onClick={() => {
              navigate(`/user?email=${email}`);
            }}
            className="btn-view-profile press-active"
          >
            View profile
          </div>
        </Flex>
      )}
    </div>
  );
};

export default ConversationContent;
