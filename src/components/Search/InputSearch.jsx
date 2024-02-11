import { CloseOutlined } from "@ant-design/icons";
import { IconSearchDeActive } from "@assets/icons/icon";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { debounce } from "lodash";
import React, { useCallback, useRef, useState } from "react";
import { TIME_DELAY_SEARCH_INPUT } from "../../utils/constant";
import { useSubscription } from "global-state-hook";
import { searchInputSubs } from "../../utils/globalStates/initGlobalState";
import PreviewSearch from "./PreviewSearch";

function InputSearch() {
  const {
    styleApp: { inputSearch: inputSearchStyle },
  } = useStyleApp();
  const {
    state: { keySearchUser },
    setState: setKeySearchUser,
  } = useSubscription(searchInputSubs, ["keySearchUser"]);
  const { isMobile } = useWindowSize();
  const [inputSearch, setInputSearch] = useState("");
  const refInput = useRef(null);
  const [focusInput, setFocusInput] = useState(false);

  document.onclick = () => {
    setFocusInput(false);
  };

  const handleDebounceSearch = useCallback(
    debounce((value) => {
      setKeySearchUser({
        keySearchUser: value.trim(),
      });
    }, TIME_DELAY_SEARCH_INPUT)
  );

  const handleChangeInput = useCallback((value) => {
    setInputSearch(value);
    handleDebounceSearch(value);
  }, []);

  const handleClearInputSearch = (e) => {
    handleChangeInput("");
    refInput.current?.focus();
  };

  return (
    <Flex
      onClick={(e) => {
        e.stopPropagation();
      }}
      vertical
      style={{ position: "relative" }}
    >
      <Flex justify="center" align="center" gap={8} className=" none-copy">
        <label
          className="label-search transition-02"
          type="search"
          value=""
          tabIndex="0"
          style={{
            ...inputSearchStyle,
            ...(!isMobile &&
              focusInput && {
                borderBottomLeftRadius: keySearchUser ? "0px" : "16px",
                borderBottomRightRadius: keySearchUser ? "0px" : "16px",
              }),
          }}
        >
          <div className="prefix-input-search">
            <IconSearchDeActive style={{ scale: "0.7" }} />
          </div>
          <input
            onFocus={() => setFocusInput(true)}
            ref={refInput}
            value={inputSearch}
            onChange={(e) => handleChangeInput(e.target.value)}
            style={inputSearchStyle}
            className="input-search"
            placeholder="Search"
          />

          {!isMobile && inputSearch && (
            <div
              className="suffix-input-search cursor-pointer m-2"
              onClick={handleClearInputSearch}
            >
              <CloseOutlined style={{ scale: "0.7" }} />
            </div>
          )}
        </label>

        {isMobile && inputSearch && (
          <span
            onClick={handleClearInputSearch}
            className="cursor-pointer button-cancel-search transition-02"
          >
            Cancel
          </span>
        )}
      </Flex>

      <PreviewSearch focusInput={focusInput} />
    </Flex>
  );
}

export default InputSearch;
