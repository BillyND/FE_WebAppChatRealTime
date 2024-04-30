import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { CloseOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { formatTimeAgo } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import {
  getConversations,
  searchUserByName,
  updateUsersReadConversation,
} from "../../services/api";
import { TIME_DELAY_FETCH_API, TYPE_STYLE_APP } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import { debounce, isChanged, showPopupError } from "../../utils/utilities";
import { WrapListConversation, WrapSearchUser } from "./StyledMessageScreen";

export const handleGetAllConversations = async (fetching = true) => {
  fetching && conversationSubs.updateState({ fetchingConversation: true });

  try {
    const resConversation = await getConversations();

    if (typeof resConversation === "object" && resConversation.length) {
      conversationSubs.updateState({ listConversation: resConversation });
    }
  } catch (error) {
    showPopupError(error);
  } finally {
    conversationSubs.updateState({ fetchingConversation: false });
  }
};

function ListConversations() {
  const { state, setState } = useSubscription(conversationSubs, [
    "listConversation",
    "fetchingConversation",
  ]);

  const { listConversation, fetchingConversation } = state || {};
  const [receiverIdParams] = useSearchParams(["receiverId"]);
  const { infoUser } = useAuthUser();
  const { _id: userId } = infoUser;
  const [selectedConversation, setSelectedConversation] = useState(-1);

  const [valueSearch, setValueSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const trimValueSearch = valueSearch?.trim() || "";
  const navigate = useNavigateCustom();

  const [listUser, setListUser] = useState([]);
  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;

  useEffect(() => handleGetAllConversations(), []);

  useEffect(() => {
    applyInitDataConversation();
  }, [JSON.stringify(listConversation), receiverIdParams]);

  const handleReadConversation = async (conversationId) => {
    const resUpdated = await updateUsersReadConversation(conversationId);

    if (isEmpty(resUpdated)) return;

    const newList = listConversation.map((conversation) =>
      conversation._id === resUpdated._id &&
      isChanged([conversation.usersRead, resUpdated.usersRead])
        ? { ...conversation, usersRead: resUpdated.usersRead }
        : conversation
    );

    if (isChanged([listConversation, newList])) {
      setState({ listConversation: newList });
    }
  };

  const applyInitDataConversation = () => {
    if (!listConversation?.length) return;

    const existConversation = listConversation.find(
      (conversation) => receiverIdParams === conversation?.receiver?._id
    );

    const { _id: existConversationId } = existConversation || {};

    if (receiverIdParams) {
      handleSelectConversation(receiverIdParams, existConversationId);
      return;
    }

    const firstReceiver = listConversation[0]?.receiver;
    const { _id: receiverId } = firstReceiver || {};

    navigate(`/message?receiverId=${receiverId}`);
    setSelectedConversation(listConversation[0]?._id || -1);
  };

  const debounceQueryUser = debounce(async (propValue) => {
    let finalListUser = [];
    try {
      const resUser = await searchUserByName({ username: propValue });

      if (resUser.length) {
        finalListUser = resUser;
      }
    } catch (error) {
      showPopupError(error);
    } finally {
      setLoadingSearch(false);
      setListUser(finalListUser);
    }
  }, TIME_DELAY_FETCH_API);

  const handleQueryUser = (propValue) => {
    if (!propValue?.trim()) {
      setListUser([]);
      return;
    }

    setLoadingSearch(true);
    debounceQueryUser(propValue);
  };

  const handleSelectUser = (user) => {
    const { _id } = user || {};
    navigate(`/message?receiverId=${_id}`);
    handleClearInputSearch();
  };

  const handleSelectConversation = (receiverId, conversationId) => {
    setSelectedConversation(conversationId);
    handleReadConversation(conversationId);

    if (receiverIdParams === receiverId) return;

    navigate(`/message?receiverId=${receiverId}`);
  };

  const handleClearInputSearch = () => {
    handleQueryUser("");
    setValueSearch("");
  };

  const renderConversationItem = (previewConversation, index) => {
    const {
      _id: id,
      receiver,
      lastMessage,
      usersRead,
    } = previewConversation || {};
    const { avaUrl, username, _id: receiverId } = receiver || {};
    const { timeSendLast, text, sender } = lastMessage || {};

    const isSelected = selectedConversation === id;
    const formattedTime = formatTimeAgo(timeSendLast);
    const isSender = sender === userId;
    const isRead = usersRead?.includes(userId);

    return (
      <Flex
        id={`conversation-${id}`}
        key={`${id}-${index}`}
        className={`item-preview-conversation p-3 pr-3 ${
          isSelected ? "selected" : ""
        }`}
        onClick={() => handleSelectConversation(receiverId, id)}
        gap={8}
      >
        {!isRead && <div className="icon-un-read"></div>}

        <UserThumbnail avaUrl={avaUrl} size={45} />

        <Flex vertical gap={2} className="width-100-per none-copy">
          <b>{username}</b>

          <Flex justify="space-between" className="info-last-message">
            <span
              className={`content-last-message ${isRead ? "read" : ""}`}
            >{`${isSender ? "Me: " : ""}${text}`}</span>
            <span>{formattedTime}</span>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  const renderUserItem = (user) => {
    const { _id, username, email, avaUrl } = user || {};

    return (
      <Flex
        key={_id}
        align="center"
        gap={10}
        className="item-user p-2 cursor-pointer none-copy"
        onClick={() => handleSelectUser(user)}
      >
        <UserThumbnail avaUrl={avaUrl} size={45} />

        <Flex vertical gap={2}>
          <b className="user-name">{username}</b>
          <span className="user-email">{email}</span>
        </Flex>
      </Flex>
    );
  };

  const EmptyConversation = () => {
    if (listUser.length || listConversation.length || trimValueSearch) {
      return null;
    }

    return (
      <Flex
        align="center"
        justify="center"
        className="warning-no-conversation mt-4"
      >
        No conversations yet.
      </Flex>
    );
  };

  const EmptyUser = () => {
    if (!trimValueSearch || listUser.length) {
      return null;
    }

    return (
      <Flex
        align="center"
        justify="center"
        className="warning-no-conversation mt-4"
      >
        User not found.
      </Flex>
    );
  };

  return (
    <Flex vertical className="wrap-all-conversations">
      <WrapSearchUser isDark={isDark} className="p-2 mt-1 width-100-per">
        <input
          placeholder="Search"
          className="width-100-per search-conversation"
          value={valueSearch}
          onChange={(e) => {
            setValueSearch(e.target.value);
            handleQueryUser(e.target.value);
          }}
        />

        {trimValueSearch && (
          <div
            className="suffix-input-search cursor-pointer press-active"
            onClick={handleClearInputSearch}
          >
            <CloseOutlined style={{ scale: "0.7" }} />
          </div>
        )}
      </WrapSearchUser>

      <WrapListConversation isDark={isDark} className="px-2 pb-2">
        {(loadingSearch || fetchingConversation) && <SpinnerLoading />}

        {!fetchingConversation && (
          <>
            <EmptyConversation />

            {!loadingSearch && (
              <>
                <EmptyUser />
                {!listUser?.length &&
                  listConversation.map(renderConversationItem)}

                <Flex vertical gap={12}>
                  {listUser.map(renderUserItem)}
                </Flex>
              </>
            )}
          </>
        )}
      </WrapListConversation>
    </Flex>
  );
}

export default ListConversations;
