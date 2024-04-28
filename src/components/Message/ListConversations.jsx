import { SpinnerLoading } from "@UI//SpinnerLoading";
import { UserThumbnail } from "@UI//UserThumbnail";
import { CloseOutlined } from "@ant-design/icons";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { formatTimeAgo } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConversations, searchUserByName } from "../../services/api";
import { TIME_DELAY_FETCH_API, TYPE_STYLE_APP } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import {
  debounce,
  scrollIntoViewById,
  showPopupError,
} from "../../utils/utilities";
import { WrapListConversation, WrapSearchUser } from "./StyledMessageScreen";
import { useAuthUser } from "@utils/hooks/useAuthUser";

function ListConversations() {
  const [receiverIdParams] = useSearchParams(["receiverId"]);
  const { infoUser } = useAuthUser();
  const { _id: userId } = infoUser;

  const { state, setState } = useSubscription(conversationSubs);
  const { listConversation, selectedConversation, fetchingConversion } =
    state || {};

  const [valueSearch, setValueSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const trimValueSearch = valueSearch?.trim() || "";
  const navigate = useNavigate();

  const [listUser, setListUser] = useState([]);
  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;

  useEffect(() => {
    handleGetAllConverSation();
  }, []);

  useEffect(() => {
    applyInitDataConversation();
  }, [listConversation, receiverIdParams]);

  const applyInitDataConversation = () => {
    if (!listConversation?.length) return;

    const existConversion = listConversation.find(
      (conversation) => receiverIdParams === conversation?.receiver?._id
    );

    const { _id: existConversionId } = existConversion || {};

    if (receiverIdParams) {
      handleSelectConversation(receiverIdParams, existConversionId);
      return;
    }

    const firstReceiver = listConversation[0]?.receiver;
    const { _id: receiverId } = firstReceiver || {};
    navigate(`/message?receiverId=${receiverId}`);

    setState({
      selectedConversation: listConversation[0]?._id || -1,
    });
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

  const handleSelectConversation = (receiverId, conversionId) => {
    navigate(`/message?receiverId=${receiverId}`);

    setState({
      selectedConversation: conversionId,
    });

    scrollIntoViewById(`conversion-${conversionId}`);
  };

  const handleGetAllConverSation = async () => {
    setState({ fetchingConversion: true });
    try {
      const resConversation = await getConversations();

      if (typeof resConversation === "object" && resConversation.length) {
        setState({ listConversation: resConversation });
      }
    } catch (error) {
      showPopupError(error);
    } finally {
      setState({ fetchingConversion: false });
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
        id={`conversion-${id}`}
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
        {(loadingSearch || fetchingConversion) && <SpinnerLoading />}

        {!fetchingConversion && (
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
