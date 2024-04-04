import { UserThumbnail } from "@UI//UserThumbnail";
import { CloseOutlined } from "@ant-design/icons";
import { useDebounce } from "@utils/hooks/useDebounce";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { formatTimeAgo } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useState } from "react";
import { getConversations } from "../../services/api";
import { TIME_DELAY_FETCH_API, TYPE_STYLE_APP } from "../../utils/constant";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { WrapListConversation, WrapSearchUser } from "./StyledMessageScreen";

const SearchUser = ({ setValueSearch }) => {
  const { styleApp } = useStyleApp();
  const isDark = styleApp.type === TYPE_STYLE_APP.DARK;
  const [inputSearch, setInputSearch] = useState("");
  const trimInputSearch = inputSearch?.trim() || "";
  const debounceSearch = useDebounce(trimInputSearch, TIME_DELAY_FETCH_API);

  useEffect(() => {
    setValueSearch(debounceSearch);
  }, [debounceSearch]);

  const handleClearInputSearch = () => {
    setInputSearch("");
    setValueSearch("");
  };

  return (
    <WrapSearchUser isDark={isDark} className="p-2 width-100-per">
      <input
        placeholder="Search"
        className="width-100-per search-conversation"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />

      {trimInputSearch && (
        <div
          className="suffix-input-search cursor-pointer press-active"
          onClick={handleClearInputSearch}
        >
          <CloseOutlined style={{ scale: "0.7" }} />
        </div>
      )}
    </WrapSearchUser>
  );
};

function ListConversations() {
  const {
    state: { listConversation, conversationSelected },
    setState,
  } = useSubscription(conversationSubs);
  const [valueSearch, setValueSearch] = useState("");

  useEffect(() => {
    setState({
      conversationSelected: listConversation[0]?.id,
    });
  }, []);

  useEffect(() => {
    handleGetAllConverSation();
  }, [valueSearch]);

  const handleGetAllConverSation = async () => {
    const resConversation = await getConversations();
    console.log("===>resConversation", resConversation);
  };

  const handleSelectConversation = (id) => {
    setState({
      conversationSelected: id,
    });
  };

  return (
    <Flex vertical className="wrap-all-conversations">
      <SearchUser setValueSearch={setValueSearch} />
      <WrapListConversation className="p-2">
        {listConversation.map((previewConversation, index) => {
          const { id, avaUrl, username, lastMessage, timeSendLast } =
            previewConversation || {};

          const isSelected = conversationSelected === id;
          const formattedTime = formatTimeAgo(timeSendLast);

          return (
            <Flex
              key={`${id}-${index}`}
              className={`item-preview-conversation p-2 pr-3 ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => handleSelectConversation(id)}
              gap={8}
            >
              <UserThumbnail avaUrl={avaUrl} size={45} />

              <Flex vertical gap={2} className="width-100-per">
                <b>{username}</b>

                <Flex justify="space-between" className="info-last-message">
                  <span className="content-last-message">{lastMessage}</span>
                  <span>{formattedTime}</span>
                </Flex>
              </Flex>
            </Flex>
          );
        })}
      </WrapListConversation>
    </Flex>
  );
}

export default ListConversations;
