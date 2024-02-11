import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import React from "react";
import InputSearch from "./InputSearch";
import ListUserSearched from "./ListUserSearched";
import { WrapSearchScreen } from "./SearchScreenStyled";

function SearchScreen() {
  const {
    styleApp: { type },
  } = useStyleApp();
  const { isMobile } = useWindowSize();

  return (
    <WrapSearchScreen id="search-screen" isMobile={isMobile} typeStyle={type}>
      <Flex vertical gap={16}>
        <InputSearch />
        <ListUserSearched />
      </Flex>
    </WrapSearchScreen>
  );
}

export default SearchScreen;
