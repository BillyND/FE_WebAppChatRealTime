import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { IconSearchDeActive } from "@assets/icons/icon";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import React from "react";
import { WrapSearchScreen } from "./SearchScreenStyled";
import { useState } from "react";
function SearchScreen() {
  const {
    styleApp: { inputSearch: inputSearchStyle, type },
  } = useStyleApp();
  const { isMobile } = useWindowSize();
  const [inputSearch, setInputSearch] = useState();

  const handleClearInputSearch = () => {
    setInputSearch("");
  };

  return (
    <WrapSearchScreen id="search-screen" isMobile={isMobile} typeStyle={type}>
      <Flex vertical>
        <Flex justify="center">
          <label
            className="label-search none-copy"
            type="search"
            value=""
            tabIndex="0"
            title="okila"
            style={inputSearchStyle}
          >
            <div className="prefix-input-search">
              <IconSearchDeActive style={{ scale: "0.8" }} />
            </div>
            <input
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              style={inputSearchStyle}
              className="input-search"
              placeholder="Search"
            />
            {inputSearch && (
              <div
                className="suffix-input-search cursor-pointer"
                onClick={handleClearInputSearch}
              >
                <CloseOutlined style={{ scale: "0.7" }} />
              </div>
            )}
          </label>
        </Flex>
        <div>oki</div>
      </Flex>
    </WrapSearchScreen>
  );
}

export default SearchScreen;
