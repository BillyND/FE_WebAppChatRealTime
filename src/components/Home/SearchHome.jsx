import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete } from "antd";
import Search from "antd/es/input/Search";
import React, { useCallback, useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { debounce } from "lodash";
import { TIME_DELAY_SEARCH_INPUT } from "../../constants/ConstantHomePage";

function SearchHome(props) {
  const [optionsSearch, setOptionsSearch] = useState([]);
  const [dataSearch, setDataSearch] = useState({
    value: "",
    loading: false,
  });

  const handleSearchUser = useCallback(
    debounce((value) => {
      setDataSearch({
        value,
        loading: false,
      });

      console.log("===>here", value);
    }, TIME_DELAY_SEARCH_INPUT),
    []
  );

  const handleOnChangeSearch = (value = "") => {
    value = value.trim();

    if (!dataSearch.loading) {
      setDataSearch({
        value,
        loading: true,
      });
    }

    handleSearchUser(value);
  };

  return (
    <div className="search-home-container">
      <AutoComplete style={{ width: "100%" }} options={optionsSearch}>
        <Search
          value={dataSearch.value}
          onChange={(e) => handleOnChangeSearch(e.target.value)}
          className="search-input"
          prefix={<SearchOutlined className="icon-search" />}
          placeholder="Search on Social Media"
          allowClear
        />
      </AutoComplete>
      {dataSearch.loading && <LoadingOutlined />}
    </div>
  );
}

export default SearchHome;
