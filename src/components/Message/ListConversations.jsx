import { useSubscription } from "global-state-hook";
import React from "react";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useEffect } from "react";
import { getConversations } from "../../services/api";
import { Flex } from "antd";

const SearchUser = () => {
  return (
    <div className="p-2 width-100-per">
      <input className="width-100-per" />
    </div>
  );
};

function ListConversations(props) {
  const { state, setState } = useSubscription(conversationSubs);

  useEffect(() => {
    handleGetAllConverSation();
  }, []);

  const handleGetAllConverSation = async () => {
    const resConversation = await getConversations();
    console.log("===>resConversation", resConversation);
  };

  return (
    <Flex vertical className="wrap-all-conversations">
      <SearchUser />
      ListConversations
    </Flex>
  );
}

export default ListConversations;
