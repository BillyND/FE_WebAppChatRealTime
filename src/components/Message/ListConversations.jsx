import { SpinnerLoading } from "@UI//SpinnerLoading";
import { UserThumbnail } from "@UI//UserThumbnail";
import { CloseOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { formatTimeAgo } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useState } from "react";
import { getConversations, searchUserByName } from "../../services/api";
import { TIME_DELAY_FETCH_API, TYPE_STYLE_APP } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import {
  debounce,
  scrollIntoViewById,
  showPopupError,
} from "../../utils/utilities";
import { WrapListConversation, WrapSearchUser } from "./StyledMessageScreen";

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

  useEffect(() => {
    handleGetAllConverSation();
  }, []);

  useEffect(() => {
    applyInitDataConversation();
  }, [JSON.stringify(listConversation), receiverIdParams]);

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
    navigate(`/message?receiverId=${receiverId}`);
    setSelectedConversation(conversationId);
    scrollIntoViewById(`conversation-${conversationId}`);
  };

  const handleGetAllConverSation = async () => {
    setState({ fetchingConversation: true });
    try {
      const resConversation = await getConversations();

      if (typeof resConversation === "object" && resConversation.length) {
        setState({ listConversation: resConversation });
      }
    } catch (error) {
      showPopupError(error);
    } finally {
      setState({ fetchingConversation: false });
    }
  };

  const handleClearInputSearch = () => {
    handleQueryUser("");
    setValueSearch("");
  };

  const renderConversationItem = (previewConversation, index) => {
    const { _id: id, receiver, lastMessage } = previewConversation || {};
    const { avaUrl, username, _id: receiverId } = receiver || {};
    const { timeSendLast, text, sender } = lastMessage || {};
    const isSelected = selectedConversation === id;
    const formattedTime = formatTimeAgo(timeSendLast);
    const isSender = sender === userId;

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
        <UserThumbnail avaUrl={avaUrl} size={45} />

        <Flex vertical gap={2} className="width-100-per none-copy">
          <b>{username}</b>

          <Flex justify="space-between" className="info-last-message">
            <span className="content-last-message">{`${
              isSender ? "Me: " : ""
            }${text}`}</span>
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
      <WrapSearchUser isDark={isDark} className="p-3 width-100-per">
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

      <WrapListConversation className="px-3 pb-3">
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
