import { CloseOutlined } from "@ant-design/icons";
import { IconSearchDeActive } from "@assets/icons/icon";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { useCallback, useRef, useState } from "react";
import { TIME_DELAY_FETCH_API } from "../../utils/constant";
import { searchInputSubs } from "../../utils/globalStates/initGlobalState";
import PreviewSearch from "./PreviewSearch";

function InputSearch(props) {
  const {
    styleApp: { inputSearch: inputSearchStyle },
  } = useStyleApp();
  const {
    state: { keySearchUser },
    setState: setDataSearchUser,
  } = useSubscription(searchInputSubs, ["keySearchUser", "resultsPreview"]);
  const { isMobile } = useWindowSize();
  const [inputSearch, setInputSearch] = useState("");
  const refInput = useRef(null);
  const [focusInput, setFocusInput] = useState(false);

  const [loadingSearch, setLoadingSearch] = useState(false);

  document.onclick = () => {
    setFocusInput(false);
  };

  const handleDebounceSearch = useCallback(
    debounce((value) => {
      setDataSearchUser({
        keySearchUser: value.trim(),
      });
    }, TIME_DELAY_FETCH_API),
    []
  );

  const handleChangeInput = (value) => {
    setLoadingSearch(true);
    setDataSearchUser({
      resultsPreview: [],
    });
    setInputSearch(value);
    handleDebounceSearch(value);
  };

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

      <PreviewSearch
        focusInput={focusInput}
        loadingSearch={loadingSearch}
        setLoadingSearch={setLoadingSearch}
        inputSearch={inputSearch}
      />
    </Flex>
  );
}

export default InputSearch;
