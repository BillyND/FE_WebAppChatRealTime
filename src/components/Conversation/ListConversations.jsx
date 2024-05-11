import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { CloseOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { formatTimeAgo } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { getConversations, searchUserByName } from "../../services/api";
import { TIME_DELAY_FETCH_API, TYPE_STYLE_APP } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import { debounce, isChanged, showPopupError } from "../../utils/utilities";
import { WrapListConversation, WrapSearchUser } from "./StyledMessageScreen";

let timerGetAllConversation;

export const handleGetAllConversations = async () => {
  if (isEmpty(conversationSubs.state.listConversations)) {
    conversationSubs.updateState({ fetchingConversation: true });
  }

  clearTimeout(timerGetAllConversation);

  timerGetAllConversation = setTimeout(async () => {
    try {
      const resConversation = await getConversations();

      if (
        typeof resConversation === "object" &&
        resConversation.length &&
        isChanged([resConversation, conversationSubs.state.listConversations])
      ) {
        conversationSubs.updateState({ listConversations: resConversation });
      }
    } catch (error) {
      showPopupError(error);
    } finally {
      conversationSubs.updateState({ fetchingConversation: false });
    }
  }, TIME_DELAY_FETCH_API);
};

function ListConversations() {
  const { state, setState } = useSubscription(conversationSubs, [
    "listConversations",
    "fetchingConversation",
    "usersOnline",
    "receiver",
  ]);

  const [selectedConversation, setSelectedConversation] = useState(-1);
  const { isMobile } = useWindowSize();
  const { listConversations, fetchingConversation, usersOnline, receiver } =
    state || {};
  const [receiverIdParams] = useSearchParams(["receiverId"]);
  const { infoUser } = useAuthUser();
  const { _id: userId } = infoUser;

  const [valueSearch, setValueSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const trimValueSearch = valueSearch?.trim() || "";
  const navigate = useNavigateCustom();

  const [listUser, setListUser] = useState([]);
  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;

  useEffect(() => {
    handleGetAllConversations();
  }, []);

  useEffect(() => {
    applyInitDataConversation();
  }, [JSON.stringify(listConversations), receiverIdParams]);

  const applyInitDataConversation = () => {
    if (!listConversations?.length) return;

    const existConversation = listConversations.find(
      (conversation) => receiverIdParams === conversation?.receiver?._id
    );

    const { _id: existConversationId } = existConversation || {};

    if (receiverIdParams) {
      handleSelectConversation(receiverIdParams, existConversationId);
      return;
    }

    setSelectedConversation(-1);
  };

  const debounceQueryUser = debounce(async (propValue) => {
    let finalListUser = [];
    try {
      const resUser = await searchUserByName({ username: propValue });

      if (resUser.length && typeof resUser === "object") {
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

    if (conversationId !== conversationSubs.state.conversationId) {
      setState({ conversationId });
    }

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

    const isOnline = usersOnline?.[receiverId];

    return (
      <Flex
        id={`conversation-${id}`}
        key={`${id}-${index}`}
        className={`item-preview-conversation p-2 pr-3 ${
          isSelected ? "selected" : ""
        }`}
        onClick={() => handleSelectConversation(receiverId, id)}
        gap={8}
      >
        <div className={`icon-un-read ${isRead ? "" : "show"}`}></div>

        <div className="ava-user-conversation">
          <UserThumbnail avaUrl={avaUrl} size={45} />
          {isOnline && <span className="icon-online"></span>}
        </div>

        <Flex vertical gap={2} className="width-100-per none-copy">
          <span className={isRead ? "read" : "un-read"}>{username}</span>

          <Flex justify="space-between" className="info-last-message">
            <span
              className={`content-last-message ${isRead ? "read" : "un-read"}`}
            >{`${isSender ? "Me: " : ""}${text}`}</span>
            <span className="font-size-14">{formattedTime}</span>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  const renderUserItem = (user, index) => {
    const { _id, username, email, avaUrl } = user || {};

    return (
      <Flex
        key={`${_id}-${index}`}
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
    if (listUser.length || listConversations.length || trimValueSearch) {
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
        No results found.
      </Flex>
    );
  };

  if (isMobile && receiverIdParams) {
    return null;
  }

  return (
    <Flex vertical className="wrap-all-conversations">
      <WrapSearchUser
        is-dark={isDark ? isDark.toString() : undefined}
        className="p-2 mt-1 width-100-per"
      >
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

      <WrapListConversation
        is-dark={isDark ? isDark.toString() : undefined}
        className={`${isMobile ? "px-2" : "pl-2"} pb-2`}
      >
        {(loadingSearch || fetchingConversation) && <SpinnerLoading />}

        {!fetchingConversation && (
          <>
            <EmptyConversation />

            {!loadingSearch && (
              <>
                <EmptyUser />

                {!trimValueSearch &&
                  listConversations.map(renderConversationItem)}

                <Flex vertical gap={12}>
                  {listUser?.map(renderUserItem)}
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
