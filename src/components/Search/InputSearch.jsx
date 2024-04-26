import { CloseOutlined } from "@ant-design/icons";
import { IconSearchDeActive } from "@assets/icons/icon";
import { TIME_DELAY_FETCH_API } from "@utils/constant";
import { searchInputSubs } from "@utils/globalStates/initGlobalState";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PreviewSearch from "./PreviewSearch";
import { debounce } from "../../utils/utilities";

/**
 * Functional component for search input.
 * @param {object} props - Props for the InputSearch component.
 */
function InputSearch(props) {
  const {
    styleApp: { inputSearch: inputSearchStyle },
  } = useStyleApp();

  const { setState: setDataSearchUser } = useSubscription(searchInputSubs, [
    "keySearchUser",
    "resultsPreview",
  ]);

  const { isMobile } = useWindowSize();
  const [inputSearch, setInputSearch] = useState("");
  const refInput = useRef(null);
  const [focusInput, setFocusInput] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setFocusInput(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDebounceSearch = debounce((value) => {
    setDataSearchUser({
      keySearchUser: value.trim(),
    });
  }, TIME_DELAY_FETCH_API);

  const handleChangeInput = (value) => {
    setLoadingSearch(true);
    setInputSearch(value);
    handleDebounceSearch(value);

    setDataSearchUser({
      resultsPreview: [],
    });
  };

  const handleClearInputSearch = () => {
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
      <Flex justify="center" align="center" gap={8} className="none-copy">
        <label
          className="label-search transition-02"
          tabIndex="0"
          style={{
            ...inputSearchStyle,
            ...(!isMobile &&
              focusInput && {
                borderBottomLeftRadius: inputSearch ? "0px" : "16px",
                borderBottomRightRadius: inputSearch ? "0px" : "16px",
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
            className="input-search transition-02"
            placeholder="Search"
            type="text"
            autoComplete="off"
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
            className="cursor-pointer press-active"
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
