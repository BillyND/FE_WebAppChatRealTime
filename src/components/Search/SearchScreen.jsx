import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import React, { useEffect, useState } from "react";
import { searchInputSubs } from "@utils/globalStates/initGlobalState";
import InputSearch from "./InputSearch";
import ListAllUsers from "./ListAllUsers";
import { WrapSearchScreen } from "./SearchScreenStyled";

function SearchScreen() {
  const {
    styleApp: { type },
  } = useStyleApp();
  const { isMobile } = useWindowSize();

  useEffect(() => {
    searchInputSubs.updateState({
      keySearchUser: "",
    });
  }, []);

  return (
    <WrapSearchScreen id="search-screen" isMobile={isMobile} typeStyle={type}>
      <Flex vertical gap={16}>
        <InputSearch />
        <ListAllUsers />
      </Flex>
    </WrapSearchScreen>
  );
}

export default SearchScreen;
